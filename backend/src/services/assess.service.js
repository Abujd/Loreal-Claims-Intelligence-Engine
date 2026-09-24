const crypto = require("node:crypto");
const { config } = require("../config");
const { CRITERIA } = require("../constants");
const { LlmOutputError, NotFoundError, ValidationError } = require("../errors");
const { chatJson } = require("../llm/ollama.client");
const { PROMPT_VERSION, SYSTEM_PROMPT, buildUserPrompt } = require("../llm/prompt");
const { LlmOutputJsonSchema, LlmOutputSchema } = require("../llm/assess.schema");
const assessmentsRepo = require("../repositories/assessments.repository");
const claimsRepo = require("../repositories/claims.repository");
const evidenceRepo = require("../repositories/evidence.repository");
const { computeGuardrails } = require("./guardrails");
const { computeConfidence, deriveVerdict } = require("./scoring");

async function runLlmOnce(claimText, evidence) {
    const raw = await chatJson({
        system: SYSTEM_PROMPT,
        user: buildUserPrompt(claimText, evidence),
        jsonSchema: LlmOutputJsonSchema,
    });

    const parsed = LlmOutputSchema.safeParse(raw);
    if (!parsed.success) {
        throw new LlmOutputError("LLM output failed schema validation", parsed.error.issues);
    }
    return parsed.data;
}

/** Retry once on malformed output. Transport errors are not retried. */
async function runLlm(claimText, evidence) {
    try {
        return await runLlmOnce(claimText, evidence);
    } catch (err) {
        if (!(err instanceof LlmOutputError)) throw err;
        console.warn(`[assess] invalid LLM output, retrying once: ${err.message}`);
        return await runLlmOnce(claimText, evidence);
    }
}

async function assess({ claimId, market, evidence }) {
    const claim = await claimsRepo.findClaimById(claimId);
    if (!claim) throw new NotFoundError(`Claim ${claimId} not found`);
    if (!claim.markets.includes(market)) {
        throw new ValidationError(`Market "${market}" is not one of this claim's markets: ${claim.markets.join(", ")}`);
    }

    const savedEvidence = await evidenceRepo.findOrCreate({
        claimId,
        studyTitle: evidence.studyTitle,
        studyType: evidence.studyType,
        content: evidence.content,
        submittedById: "demo-evaluator",
    });

    const started = Date.now();
    const llm = await runLlm(claim.text, evidence);
    const latencyMs = Date.now() - started;

    const criteria = [...llm.criteria].sort(
        (a, b) => CRITERIA.indexOf(a.name) - CRITERIA.indexOf(b.name)
    );
    const guardrailFlags = computeGuardrails(llm.extractedFindings);
    const verdict = deriveVerdict(criteria);

    const result = {
        id: crypto.randomUUID(),
        claimId,
        evidenceId: savedEvidence.id,
        market,
        verdict,
        justified: verdict === "JUSTIFIED",
        confidence: computeConfidence(llm.modelConfidence, criteria, guardrailFlags),
        modelConfidence: llm.modelConfidence,
        reasoning: llm.reasoning,
        criteria,
        extractedFindings: llm.extractedFindings,
        guardrailFlags,
        suggestedRewording: llm.suggestedRewording,
        model: config.ollama.model,
        promptVersion: PROMPT_VERSION,
        latencyMs,
        createdAt: new Date().toISOString(),
    };

    await assessmentsRepo.insert({
        result,
        evidenceContentHash: savedEvidence.contentHash,
        createdById: "demo-evaluator",
    });

    return result;
}

module.exports = { assess };