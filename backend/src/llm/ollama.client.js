const { Ollama } = require("ollama");
const { config } = require("../config");
const { LlmOutputError, LlmUnavailableError } = require("../errors");

const client = new Ollama({
    host: config.ollama.host,
    fetch: (url, init) =>
        fetch(url, { ...init, signal: AbortSignal.timeout(config.ollama.timeoutMs) }),
});

/**
 * Sends a chat request and returns parsed JSON.
 * Translates transport-level failures into LlmUnavailableError.
 */
async function chatJson({ system, user, jsonSchema }) {
    let res;
    try {
        res = await client.chat({
            model: config.ollama.model,
            stream: false,
            format: jsonSchema,
            options: {
                temperature: 0,
                num_ctx: config.ollama.numCtx, // default context is small and silently truncates
            },
            messages: [
                { role: "system", content: system },
                { role: "user", content: user },
            ],
        });
    } catch (err) {
        if (err?.status_code === 404) {
            throw new LlmUnavailableError(
                `Model "${config.ollama.model}" not found. Run: ollama pull ${config.ollama.model}`
            );
        }
        if (err?.name === "TimeoutError" || err?.name === "AbortError") {
            throw new LlmUnavailableError(`Ollama timed out after ${config.ollama.timeoutMs}ms`);
        }
        throw new LlmUnavailableError(`Ollama request failed: ${err.message}`);
    }

    try {
        return JSON.parse(res.message.content);
    } catch {
        throw new LlmOutputError("LLM response was not valid JSON", {
            snippet: String(res.message.content).slice(0, 200),
        });
    }
}

async function pingOllama() {
    await client.list();
}

module.exports = { chatJson, pingOllama };