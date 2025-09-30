
// C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\config\db.js
// config/db.js
require('dotenv').config();
const sql = require('mssql');

// Pull and trim environment variables
const DB_USER     = (process.env.DB_USER     || '').trim();
const DB_PASSWORD = (process.env.DB_PASSWORD || '').trim();
const DB_SERVER   = (process.env.DB_SERVER   || '').trim();
const DB_DATABASE = (process.env.DB_DATABASE || '').trim();
const DB_PORT     = parseInt((process.env.DB_PORT || '').trim(), 10) || 1433;

const dbConfig = {
  user: DB_USER,
  password: DB_PASSWORD,
  server: DB_SERVER,
  port: DB_PORT,
  database: DB_DATABASE,
  options: { 
    encrypt: true,               // for Azure / secure connections
    trustServerCertificate: true,
    enableArithAbort: true
  },
  pool: {
    max: 20,                      // tuneable
    min: 1,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 60000
  },
  requestTimeout: 1800000,       // 30 minutes
  connectionTimeout: 60000       // 1 minute
};

let poolPromise = null;

async function getPool(attempts = 5) {
  if (poolPromise) return poolPromise;

  poolPromise = (async () => {
    try {
      const pool = await sql.connect(dbConfig);
      console.log('✅ MSSQL pool connected (Pune)');

      pool.on('error', err => {
        console.error('❌ MSSQL pool error (Pune):', err);
        poolPromise = null; // reset to allow reconnect
      });

      return pool;
    } catch (err) {
      console.error('❌ MSSQL pool connection failed (Pune):', err);
      poolPromise = null;
      if (attempts > 0) {
        console.log(`⏳ Retrying MSSQL connect (Pune) (${attempts} left)…`);
        await new Promise(res => setTimeout(res, 3000));
        return getPool(attempts - 1);
      }
      throw err;
    }
  })();

  // Global handler for MSSQL pool-level errors
  sql.on('error', err => {
    console.error('❌ MSSQL global error (Pune):', err);
    if (err && err.name === 'TimeoutError') poolPromise = null;
  });

  process.on('unhandledRejection', reason => {
    console.error('❌ Unhandled Rejection at (Pune):', reason);
  });

  process.on('uncaughtException', err => {
    console.error('❌ Uncaught Exception (will exit) (Pune):', err);
    // optional: process.exit(1);
  });

  return poolPromise;
}

module.exports = { sql, getPool };

================
user above code logic for below code carefully, 
    
// config/siteConfig.js
// C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\config\siteConfig.js
const sqlModule = require('mssql');
const { poolPromise: sharedPoolPromise } = require('./db'); // Pune shared pool
const punePoolPromise = sharedPoolPromise;

// Denver config (tune as needed)
const denverConfig = {
  user:     'GSOC_Test',
  password: 'Westernccure@2025',
  server:   'SRVWUDEN0891V',
  database: 'ACVSUJournal_00010028',
  options: { encrypt: true, trustServerCertificate: true },
  pool: {
    max: 6, min: 0,
    idleTimeoutMillis: 30_000,
    acquireTimeoutMillis: 30_000
  },
  connectionTimeout: 30_000,
  requestTimeout: 30_000  // raise per-query default to 30s (you still control per-request timeouts)
};

let denverPoolPromise = null;

async function getDenverPool(attempts = 3) {
  if (denverPoolPromise) return denverPoolPromise;

  denverPoolPromise = (async () => {
    const pool = new sqlModule.ConnectionPool(denverConfig);

    pool.on('error', err => {
      console.error('❌ Denver MSSQL pool error:', err);
      denverPoolPromise = null;
    });

    try {
      await pool.connect();
      console.log('✅ Denver MSSQL pool connected');
      return pool;
    } catch (err) {
      console.error('❌ Denver pool connection failed:', err);
      denverPoolPromise = null;
      if (attempts > 0) {
        console.log(`⏳ Retrying Denver pool connect (${attempts} left)…`);
        await new Promise(res => setTimeout(res, 3000));
        return getDenverPool(attempts - 1);
      }
      throw err;
    }
  })().catch(err => {
    denverPoolPromise = null;
    return null;
  });

  return denverPoolPromise;
}

// Kick off an initial connect so poolPromise isn't null at first request
denverPoolPromise = getDenverPool().catch(() => null);

// Ping Denver every 5 minutes to keep the TCP connection alive; if ping fails, reset promise
setInterval(async () => {
  try {
    const pool = await getDenverPool();
    if (pool) {
      try {
        await pool.request().query('SELECT 1');
      } catch (err) {
        console.warn('⚠️ Denver keep-alive query failed, resetting poolPromise:', err);
        denverPoolPromise = null;
      }
    }
  } catch (err) {
    console.error('⚠️ Denver keep-alive failed to get pool:', err);
    denverPoolPromise = null;
  }
}, 5 * 60 * 1000);

module.exports = {
  pune: { name: 'Pune', poolPromise: punePoolPromise, sql: sqlModule },
  denver: {
    name: 'Denver',
    getPool: getDenverPool,
    // export initial poolPromise for backward-compat — but code should prefer getPool()
    poolPromise: denverPoolPromise,
    sql: sqlModule
  }
};

