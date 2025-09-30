// config/db.js — updated
const sql    = require('mssql');
const dotenv = require('dotenv');
dotenv.config();

const config = {
  server:   process.env.DB_SERVER,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  // connection & request timeouts
  connectionTimeout: 30000,   // 30s to establish TCP + handshake
  requestTimeout:    30_000,  // 30s per query (increase if queries may legitimately take longer)

  pool: {
    max:                  20,     // increase if DB can handle more concurrent connections (tune)
    min:                  1,      // keep at least 1 warm connection to reduce acquire latency
    idleTimeoutMillis:    30_000,
    acquireTimeoutMillis: 60_000  // wait up to 60s when trying to acquire a connection
  },

  options: {
    encrypt:               true,
    trustServerCertificate: true
  }
};

let poolPromise = null;

async function getPool(attempts = 5) {
  if (poolPromise) return poolPromise;

  poolPromise = (async () => {
    try {
      const pool = await sql.connect(config);
      console.log('✅ MSSQL pool connected');

      pool.on('error', err => {
        console.error('❌ MSSQL pool error:', err);
        // free the cached promise so next call will recreate the pool
        poolPromise = null;
      });

      return pool;
    } catch (err) {
      console.error('❌ MSSQL pool connection failed:', err);
      poolPromise = null;
      if (attempts > 0) {
        console.log(`⏳ Retrying MSSQL connect (${attempts} left)…`);
        await new Promise(res => setTimeout(res, 3000));
        return getPool(attempts - 1);
      }
      throw err;
    }
  })();

  // Global handler: reset pool on fatal pool-level errors such as Tarn TimeoutError
  sql.on('error', err => {
    console.error('❌ MSSQL global error:', err);
    // If it's a timeout / pool acquisition issue, reset poolPromise so we reconnect
    if (err && err.name === 'TimeoutError') {
      poolPromise = null;
    }
  });

  process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled Rejection at:', reason);
    // do not crash — but you could choose to exit(1) if desired and rely on a process manager
  });

  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception (will exit):', err);
    // prefer letting a process manager restart the process if it's a truly fatal error
    // process.exit(1);
  });

  return poolPromise;
}

module.exports = { sql, getPool };