// config/siteConfig.js
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