const crypto = require("node:crypto");
const { pool } = require("../db");

function normalizeAndHash(content) {
    const normalized = content.normalize("NFC").trim().replace(/\s+/g, " ");
    return crypto.createHash("sha256").update(normalized).digest("hex");
}

/** Insert evidence, or return the existing row if this exact content was already submitted for the claim. */
async function findOrCreate({ claimId, studyTitle, studyType, content, submittedById }) {
    const contentHash = normalizeAndHash(content);

    const { rows: existing } = await pool.query(
        'SELECT id, "contentHash" FROM "Evidence" WHERE "claimId" = $1 AND "contentHash" = $2',
        [claimId, contentHash]
    );
    if (existing[0]) return existing[0];

    const id = crypto.randomUUID();
    const { rows } = await pool.query(
        `INSERT INTO "Evidence"
            (id, "claimId", "studyTitle", "studyType", content, "contentHash", "submittedById")
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, "contentHash"`,
        [id, claimId, studyTitle, studyType, content, contentHash, submittedById]
    );
    return rows[0];
}

module.exports = { findOrCreate };
