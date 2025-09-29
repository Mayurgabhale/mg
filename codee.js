this issue came more time how to slov it
⏳ Retrying Denver pool connect (2 left)…
❌ Denver pool connection failed: ConnectionError: Failed to connect to SRVWUDEN0891V:1433 in 30000ms
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\mssql\lib\tedious\connection-pool.js:85:17
    at Connection.onConnect (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:849:9)
    at Object.onceWrapper (node:events:633:26)
    at Connection.emit (node:events:518:28)
    at Connection.emit (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:970:18)
    at Connection.connectTimeout (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:1222:10)
    at Timeout._onTimeout (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:1167:12)
    at listOnTimeout (node:internal/timers:588:17)
    at process.processTimers (node:internal/timers:523:7) {
  code: 'ETIMEOUT',
  originalError: ConnectionError: Failed to connect to SRVWUDEN0891V:1433 in 30000ms
      at Connection.connectTimeout (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:1222:26)
      at Timeout._onTimeout (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:1167:12)
      at listOnTimeout (node:internal/timers:588:17)
      at process.processTimers (node:internal/timers:523:7) {
    code: 'ETIMEOUT'
  }
}
⏳ Retrying Denver pool connect (1 left)…
❌ Denver pool connection failed: ConnectionError: Failed to connect to SRVWUDEN0891V:1433 in 30000ms
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\mssql\lib\tedious\connection-pool.js:85:17
    at Connection.onConnect (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:849:9)
    at Object.onceWrapper (node:events:633:26)
    at Connection.emit (node:events:518:28)
    at Connection.emit (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:970:18)
    at Connection.connectTimeout (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:1222:10)
    at Timeout._onTimeout (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:1167:12)
    at listOnTimeout (node:internal/timers:588:17)
    at process.processTimers (node:internal/timers:523:7) {
  code: 'ETIMEOUT',
  originalError: ConnectionError: Failed to connect to SRVWUDEN0891V:1433 in 30000ms
      at Connection.connectTimeout (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:1222:26)
      at Timeout._onTimeout (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:1167:12)
      at listOnTimeout (node:internal/timers:588:17)
      at process.processTimers (node:internal/timers:523:7) {
    code: 'ETIMEOUT'
  }
}
⏳ Retrying Denver pool connect (3 left)…



// config/siteConfig.js
const { sql, getPool: sharedGetPool } = require('./db');

// Pune uses the shared getPool():
const punePoolPromise = sharedGetPool();

// Denver pool configuration (reasonable defaults)
const denverConfig = {
  user:     'GSOC_Test',
  password: 'Westernccure@2025',
  server:   'SRVWUDEN0891V',
  database: 'ACVSUJournal_00010028',
  options: {
    encrypt: true,
    trustServerCertificate: true
  },
  pool: {
    max: 6,                   // small pool; tune upwards only if needed
    min: 0,
    idleTimeoutMillis: 30_000,
    acquireTimeoutMillis: 30_000
  },
  connectionTimeout: 30_000,
  requestTimeout: 15_000     // per-query timeout of 15s (instead of no timeout)
};

const sqlModule = require('mssql'); // use same mssql package

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
    console.error('❌ Denver pool promise ultimately failed:', err);
    denverPoolPromise = null;
    return null;
  });

  return denverPoolPromise;
}

// Every 5 minutes, ping Denver so it never goes idle.
// If ping fails, reset the poolPromise (so next request will re-connect).
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
  pune: {
    name: 'Pune',
    poolPromise: punePoolPromise,
    sql: sqlModule
  },
  denver: {
    name: 'Denver',
    getPool: getDenverPool,
    sql: sqlModule
  }
};
