const pg = require('pg');
const { config } = require('./config');

const pool = new pg.Pool({ connectionString: config.databaseUrl });

pool.on('error', (err) => console.error('Unexpected pg pool error:', err));

module.exports = { pool };