const { neon } = require('@neondatabase/serverless');
const { Pool } = require('@neondatabase/serverless');
const ws = require('ws');
require('dotenv').config();

// Production (Vercel serverless) uses the Neon pooler URL with @neondatabase/serverless.
// neonConfig.webSocketConstructor is set for Node.js environments (local/server).
const { neonConfig } = require('@neondatabase/serverless');
neonConfig.webSocketConstructor = ws;

const connectionString = (process.env.DATABASE_URL || '').trim();

// neon() — HTTP client for single queries (stateless, works everywhere)
const sql = neon(connectionString);

// Pool — WebSocket-based client for transactions (BEGIN/COMMIT on one connection)
const pool = new Pool({ connectionString });

pool.on('connect', () => {
  console.log('PostgreSQL Database Connected Successfully');
});

pool.on('error', (err) => {
  console.error('Database Pool Error:', err.message);
});

module.exports = {
  query: async (text, params) => {
    const result = await sql.query(text, params || []);
    return { rows: result.rows };
  },
  getClient: () => pool.connect()
};
