const crypto = require("node:crypto");
const { pool } = require("../db");

async function findAssessmentById(assessmentId) {
    const { rows } = await pool.query(
        'SELECT id, "claimId", verdict FROM "Assessment" WHERE id = $1',
        [assessmentId]
    );
    return rows[0] ?? null;
}

async function findByAssessmentId(assessmentId) {
    const { rows } = await pool.query(
        `SELECT id, "assessmentId", decision, "humanVerdict", note, "reviewedById", "reviewedAt"
         FROM "AssessmentReview"
         WHERE "assessmentId" = $1
         ORDER BY "reviewedAt" DESC`,
        [assessmentId]
    );
    return rows;
}

async function insert({ assessmentId, decision, humanVerdict, note, reviewedById }) {
    const id = crypto.randomUUID();
    const { rows } = await pool.query(
        `INSERT INTO "AssessmentReview"
            (id, "assessmentId", decision, "humanVerdict", note, "reviewedById")
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, "assessmentId", decision, "humanVerdict", note, "reviewedById", "reviewedAt"`,
        [id, assessmentId, decision, humanVerdict ?? null, note ?? null, reviewedById]
    );
    return rows[0];
}

module.exports = { findAssessmentById, findByAssessmentId, insert };
