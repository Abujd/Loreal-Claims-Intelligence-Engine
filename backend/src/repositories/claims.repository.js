const { pool } = require("../db");

async function findClaimById(id) {
    const { rows } = await pool.query(
        'SELECT id, text, markets FROM "Claim" WHERE id = $1',
        [id]
    );
    return rows[0] ?? null;
}

module.exports = { findClaimById };