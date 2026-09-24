const { pool } = require("../db");

async function insert({ result, evidenceContentHash, createdById }) {
    await pool.query(
        `INSERT INTO "Assessment"
            (id, "claimId", "evidenceId", market, "evidenceContentHash",
             verdict, confidence, reasoning, criteria, "extractedFindings",
             "guardrailFlags", "suggestedRewording", "modelName", "promptVersion", "createdById")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11,$12,$13,$14,$15)`,
        [
            result.id, result.claimId, result.evidenceId, result.market, evidenceContentHash,
            result.verdict, result.confidence, result.reasoning,
            JSON.stringify(result.criteria),
            JSON.stringify(result.extractedFindings),
            result.guardrailFlags,
            result.suggestedRewording, result.model, result.promptVersion, createdById,
        ]
    );
}


module.exports = { insert };