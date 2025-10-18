// src/server.js
require('dotenv').config();
const app = require('./app');
const { getConnection } = require('./config/db'); // ensure DB connection setup before starting server

const PORT = process.env.PORT || 3001;

// Initialize database first, then start server
(async () => {
  try {
    const pool = await getConnection(); // connect to MSSQL
    if (pool.connected) {
      console.log('✅ Database connection established successfully.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server due to DB connection issue:', err);
    process.exit(1); // Exit so nodemon restarts or DevOps fails fast
  }
})();






.....
// src/config/db.js
const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT, 10) || 1433,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // Use encryption
    trustServerCertificate: true, // Allow self-signed certs for dev
    enableArithAbort: true,
  },
};

let pool; // Shared connection pool

// Create or reuse connection pool
async function getConnection() {
  try {
    // If pool already exists and is connected, reuse it
    if (pool && pool.connected) return pool;

    // If pool exists but not connected, close and recreate
    if (pool) {
      await pool.close().catch(() => {});
    }

    pool = new sql.ConnectionPool(dbConfig);

    pool.on('error', (err) => {
      console.error('❌ SQL Pool Error:', err);
      if (err.code === 'ESOCKET' || err.code === 'ECONNRESET') {
        console.log('🔁 Attempting to reconnect to SQL Server...');
        reconnect();
      }
    });

    await pool.connect();
    console.log('✅ MSSQL connected');
    return pool;
  } catch (err) {
    console.error('❌ MSSQL connection failed:', err);
    await new Promise((res) => setTimeout(res, 5000)); // Wait before retry
    console.log('🔁 Retrying MSSQL connection...');
    return getConnection(); // Recursive retry
  }
}

// Reconnect helper
async function reconnect() {
  try {
    if (pool) await pool.close();
  } catch (e) {
    // ignore
  }
  pool = null;
  return getConnection();
}

// Safe query helper
async function query(queryText, params = {}) {
  const conn = await getConnection();
  if (!conn) throw new Error('❌ No database connection available');

  const request = conn.request();
  for (const [key, value] of Object.entries(params)) {
    request.input(key, value);
  }

  const result = await request.query(queryText);
  return result.recordset;
}

module.exports = {
  sql,
  getConnection,
  query,
};

