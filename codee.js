REad this error carefullym, i try to slove this erro more time but not sloved 
check why this error is came, and how to slove it,
  rea below all filse carefully and sloe this error carefully ok 
  i hove next time this error is not come ok 
[DENVER] fetchNewEvents: got 1 rows (took 13573ms)
⚠️ Denver poolPromise resolved to null — DB likely unavailable
[DENVER] SSE client disconnected, cleared timers
[DENVER] fetchNewEvents: got 1 rows (took 20266ms)
[DENVER] fetchNewEvents: got 1 rows (took 20285ms)
[DENVER] fetchNewEvents: got 214 rows (took 20939ms)
[DENVER] fetchNewEvents: got 1 rows (took 9214ms)
[DENVER] fetchNewEvents: got 1 rows (took 10122ms)
[DENVER] fetchNewEvents: got 1 rows (took 10129ms)
❌ MSSQL global error: TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
❌ MSSQL pool error: TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
❌ Unhandled Rejection at: TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
❌ MSSQL global error: TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
❌ MSSQL pool error: TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
❌ Unhandled Rejection at: TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
[DENVER] fetchNewEvents: got 1 rows (took 26004ms)
[DENVER] fetchNewEvents: got 1 rows (took 26009ms)
[DENVER] fetchNewEvents: got 1 rows (took 1075ms)
[DENVER] fetchNewEvents: got 1 rows (took 1080ms)
[DENVER] fetchNewEvents: got 1 rows (took 2802ms)
[DENVER] fetchNewEvents: got 1 rows (took 2816ms)
[DENVER] fetchNewEvents: got 1 rows (took 1061ms)
[DENVER] fetchNewEvents: got 1 rows (took 1079ms)
✅ MSSQL pool connected
[DENVER] fetchNewEvents: got 1 rows (took 1092ms)
[DENVER] fetchNewEvents: got 1 rows (took 1102ms)
[DENVER] fetchNewEvents: got 1 rows (took 1062ms)
[DENVER] fetchNewEvents: got 1 rows (took 1067ms)
++++++++++++++++++++++++++++++++++++++++++
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
++++++++++++++++++++++++++++
  

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
+++++++++++
  // Live SSE endpoint with heartbeat + non-overlap + logging
exports.getDenverLiveOccupancy = async (req, res) => {
  try {
    // ensure poolPromise at least initialised (does not throw)
    const poolMaybe = await denver.poolPromise;
    if (!poolMaybe) {
      console.warn('⚠️ Denver poolPromise resolved to null — DB likely unavailable');
    }
  } catch (err) {
    console.error('❌ Failed to initialize Denver pool in SSE endpoint:', err);
    // still continue but logs will show missing DB
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('\n');

  // heartbeat comment every 15s so clients do not time out
  const heartbeat = setInterval(() => {
    try {
      // SSE comment keeps connection alive but is ignored by EventSource data parser
      res.write(': heartbeat\n\n');
      if (typeof res.flush === 'function') res.flush();
    } catch (err) {
      console.warn('⚠️ Failed to send heartbeat (connection likely closed):', err);
    }
  }, 15_000);

  let lastSeen = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const events = [];
  let pushRunning = false;
  let consecutiveDbErrors = 0;

  const push = async () => {
    if (pushRunning) {
      // console.debug('[DENVER] push already running — skipping this tick');
      return;
    }
    pushRunning = true;
    try {
      const fresh = await fetchNewEvents(lastSeen);

      if (fresh.length) {
        // update lastSeen to the latest event's LocaleMessageTime (string or Date)
        const lastEvt = fresh[fresh.length - 1];
        if (lastEvt && lastEvt.LocaleMessageTime) {
          lastSeen = new Date(lastEvt.LocaleMessageTime);
        } else {
          lastSeen = new Date();
        }
        events.push(...fresh);
        // console.log(`[DENVER] pushed ${fresh.length} new events — events buffer now ${events.length}`);
      }

      // prune events not on today's Denver date (keep memory small)
      const todayDenver = DateTime.now().setZone('America/Denver').toISODate();
      for (let i = events.length - 1; i >= 0; i--) {
        const ts = events[i].Dateonly || (events[i].LocaleMessageTime ? DateTime.fromISO(events[i].LocaleMessageTime, { zone: 'utc' }).setZone('America/Denver').toISODate() : null);
        if (!ts || ts !== todayDenver) events.splice(i, 1);
      }

      // build payload
      let payload;
      try {
        payload = buildOccupancyForToday(events, fresh, null); // live mode (null => uses now)
      } catch (err) {
        console.error('[DENVER] Error building payload:', err);
        payload = {
          asOfLocal: DateTime.now().setZone('America/Denver').toISO(),
          asOfUTC: new Date().toISOString(),
          currentCount: 0,
          floorBreakdown: [],
          personnelSummary: { employees: 0, contractors: 0 },
          personnelBreakdown: [],
          totalVisitedToday: 0,
          visitedToday: { employees: 0, contractors: 0, total: 0 },
          swipeStats: { totalInSwipes: 0, totalOutSwipes: 0 },
          floorInOutSummary: []
        };
      }

      // write SSE event
      const sid = Date.now();
      try {
        res.write(`id: ${sid}\n`);
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
        if (typeof res.flush === 'function') res.flush();
        // console.debug(`[DENVER] wrote payload id=${sid}`);
      } catch (err) {
        console.warn('[DENVER] Failed to write SSE payload (connection likely closed):', err);
      }

      consecutiveDbErrors = 0;
    } catch (err) {
      consecutiveDbErrors++;
      console.error('[DENVER] push top-level error:', err);
      // back off a bit if DB failing repeatedly
      if (consecutiveDbErrors > 3) {
        console.warn(`[DENVER] ${consecutiveDbErrors} consecutive DB errors — sleeping 5s before next try`);
        await new Promise(r => setTimeout(r, 5000));
      }
    } finally {
      pushRunning = false;
    }
  };

  await push();
  const timer = setInterval(push, 1000); // 1s interval (user requested)

  req.on('close', () => {
    clearInterval(timer);
    clearInterval(heartbeat);
    console.log('[DENVER] SSE client disconnected, cleared timers');
  });
};

