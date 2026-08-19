const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: (process.env.DATABASE_URL || '').trim(),
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 30000,
  max: 10
});

pool.on('connect', () => {
  console.log('PostgreSQL Database Connected Successfully');
});

pool.on('error', (err) => {
  console.error('Database Pool Error:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect()
};