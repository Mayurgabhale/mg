// config/db.js
const sql    = require('mssql');
const dotenv = require('dotenv');
dotenv.config();

const config = {
  server:   process.env.DB_SERVER,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  // 15s to establish; per-query timeout 15s (instead of infinite)
  connectionTimeout: 30000,
  requestTimeout:    15_000,

  pool: {
    // reasonable defaults; tune to your DB capacity
    max:                  10,
    min:                  0,
    // a moderate idle timeout so tarn can prune idle connections
    idleTimeoutMillis:    30000,
    // allow acquire to wait up to 30s for a connection
    acquireTimeoutMillis: 30_000
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
        // Reset so next call will attempt reconnect
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

  // global SQL error -> log and reset if it's connection-related
  sql.on('error', err => {
    console.error('❌ MSSQL global error:', err);
    // For fatal-looking errors, reset the pool so future calls reconnect
    // poolPromise = null; // optionally enable if you want aggressive reconnects
  });

  // Helpful: avoid crashing silently on unhandled rejections
  process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled Rejection at:', reason);
  });

  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception (will exit):', err);
    // Let your process manager (PM2/systemd/docker) restart the process.
    // Do not swallow — exit gracefully if you wish:
    // process.exit(1);
  });

  return poolPromise;
}

// Keep-alive ping every 5 minutes but *do not* throw if it fails
setInterval(async () => {
  try {
    const pool = await getPool();
    if (pool) {
      await pool.request().query('SELECT 1');
    }
  } catch (err) {
    console.warn('⚠️ MSSQL keep-alive ping failed (not fatal):', err);
    // reset pool so next request reinitializes
    poolPromise = null;
  }
}, 5 * 60 * 1000);

module.exports = { sql, getPool };