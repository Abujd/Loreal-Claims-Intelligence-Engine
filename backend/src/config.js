const int = (v, d) => (v === undefined || v === '' ? d : Number.parseInt(v, 10));

const config = {
    port: int(process.env.PORT, 3000),
    databaseUrl: process.env.DATABASE_URL,
    ollama: {
        host: process.env.OLLAMA_HOST || 'http://127.0.0.1:11434',
        model: process.env.OLLAMA_MODEL || 'llama3.1:8b',
        numCtx: int(process.env.OLLAMA_NUM_CTX, 8192),
        timeoutMs: int(process.env.OLLAMA_TIMEOUT_MS, 180_000),
    },
    scoring: {
        minSampleSize: int(process.env.POLICY_MIN_SAMPLE_SIZE, 30),
        guardrailPenalty: 0.05,
    },
};

if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is required');
}

module.exports = { config };