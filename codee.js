
chekc belwo error and issue, and try to slove this permenantly ok 
⚠️ Denver poolPromise resolved to null — DB likely unavailable
[DENVER] SSE client disconnected, cleared timers
[DENVER] fetchNewEvents: got 2494 rows (took 3669ms)
[DENVER] fetchNewEvents: got 1 rows (took 9206ms)
[DENVER] fetchNewEvents: got 1 rows (took 2682ms)
[DENVER] fetchNewEvents: got 1 rows (took 14980ms)
[DENVER] fetchNewEvents: got 1 rows (took 4821ms)
[DENVER] fetchNewEvents: got 1 rows (took 14438ms)
[DENVER] fetchNewEvents: got 1 rows (took 1085ms)
[DENVER] fetchNewEvents: got 1 rows (took 9934ms)
[DENVER] fetchNewEvents: got 1 rows (took 10345ms)
[DENVER] fetchNewEvents: got 1 rows (took 16489ms)
[DENVER] fetchNewEvents: got 1 rows (took 1073ms)
[DENVER] fetchNewEvents: got 1 rows (took 1081ms)
❌ fetchNewEvents query error — resetting Denver pool and returning empty: RequestError: Query timed out after 20000ms
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\mssql\lib\tedious\request.js:429:27
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\mssql\lib\base\connection-pool.js:371:41
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5) {
  code: 'ECANCEL'
}
❌ fetchNewEvents query error — resetting Denver pool and returning empty: ConnectionError: Connection is closed.
    at Request._query (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\mssql\lib\base\request.js:497:37)
    at Request._query (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\mssql\lib\tedious\request.js:363:11)
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\mssql\lib\base\request.js:461:12
    at new Promise (<anonymous>)
    at Request.query (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\mssql\lib\base\request.js:460:12)
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\controllers\denverLiveOccupancyController.js:2547:32
    at safeQueryWithTimeout (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\controllers\denverLiveOccupancyController.js:2552:5)
    at fetchNewEvents (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\controllers\denverLiveOccupancyController.js:2807:33)
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9) {
  code: 'ECONNCLOSED'
}
✅ Denver MSSQL pool connected
⚠️ Denver poolPromise resolved to null — DB likely unavailable
[DENVER] SSE client disconnected, cleared timers
❌ fetchNewEvents query error — resetting Denver pool and returning empty: RequestError: Query timed out after 20000ms
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\mssql\lib\tedious\request.js:449:19
    at Array.forEach (<anonymous>)
    at Request.userCallback (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\mssql\lib\tedious\request.js:446:46)
    at Request.callback (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\request.js:239:14)
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:2694:24
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5) {
  code: 'ECANCEL',
  originalError: RequestError: Canceled.
      at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:2694:33
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5) {
    code: 'ECANCEL'
  },
  number: 'ECANCEL',
  lineNumber: undefined,
  state: undefined,
  class: undefined,
  serverName: undefined,
  procName: undefined,
  precedingErrors: []
        ____________________________
async function fetchNewEvents(since) {
  let pool;
  try {
    // IMPORTANT: use denver.getPool() (not denver.poolPromise)
    pool = await denver.getPool();
  } catch (err) {
    console.error('❌ Failed to get Denver pool in fetchNewEvents():', err);
    return [];
  }
  if (!pool) {
    console.warn('⚠️ fetchNewEvents: no pool available, returning empty');
    return [];
  }

  const req = pool.request();
  req.input('since', sql.DateTime2, since);

  const queryText = `
  
    WITH CombinedQuery AS (
      SELECT
        DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
        t1.ObjectName1,
        CASE
          WHEN t3.Name IN ('Contractor','Terminated Contractor') THEN t2.Text12
          ELSE CAST(t2.Int1 AS NVARCHAR)
        END AS EmployeeID,
        t1.ObjectIdentity1 AS PersonGUID,
        t3.Name AS PersonnelType,
        COALESCE(
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]' ,'varchar(50)'),
          sc.value
        ) AS CardNumber,
        t5a.value AS AdmitCode,
        t5d.value AS Direction,
        t1.ObjectName2 AS Door
      FROM ACVSUJournal_00010029.dbo.ACVSUJournalLog t1
      LEFT JOIN ACVSCore.Access.Personnel     t2 ON t1.ObjectIdentity1 = t2.GUID
      LEFT JOIN ACVSCore.Access.PersonnelType t3 ON t2.PersonnelTypeId  = t3.ObjectID
      LEFT JOIN ACVSUJournal_00010029.dbo.ACVSUJournalLogxmlShred t5a
        ON t1.XmlGUID = t5a.GUID AND t5a.Name = 'AdmitCode'
      LEFT JOIN ACVSUJournal_00010029.dbo.ACVSUJournalLogxmlShred t5d
        ON t1.XmlGUID = t5d.GUID AND t5d.Name = 'Direction'
      LEFT JOIN ACVSUJournal_00010029.dbo.ACVSUJournalLogxml t_xml
        ON t1.XmlGUID = t_xml.GUID
      LEFT JOIN (
        SELECT GUID, value
        FROM ACVSUJournal_00010029.dbo.ACVSUJournalLogxmlShred
        WHERE Name IN ('Card','CHUID')
      ) sc ON t1.XmlGUID = sc.GUID
      WHERE
        t1.MessageType   = 'CardAdmitted'
        AND t1.ObjectName2 LIKE '%HQ%'
        AND DATEADD(MINUTE,-1* t1.MessageLocaleOffset, t1.MessageUTC) >= @since
    )
    SELECT
      LocaleMessageTime,
      CONVERT(VARCHAR(10), LocaleMessageTime, 23) AS Dateonly,
      CONVERT(VARCHAR(8),  LocaleMessageTime, 108) AS Swipe_Time,
      EmployeeID, PersonGUID, ObjectName1, PersonnelType,
      CardNumber, AdmitCode, Direction, Door
    FROM CombinedQuery
    ORDER BY LocaleMessageTime ASC;
  `; // paste the same long query you already have

  const t0 = Date.now();
  try {
    const { recordset } = await safeQueryWithTimeout(req, queryText, 20_000); // 20s timeout
    const took = Date.now() - t0;
    console.log(`[DENVER] fetchNewEvents: got ${recordset ? recordset.length : 0} rows (took ${took}ms)`);
    return recordset || [];
  } catch (err) {
    console.error('❌ fetchNewEvents query error — resetting Denver pool and returning empty:', err);
    try {
      // Close pool to free resources; next getDenverPool will reconnect
      if (pool && typeof pool.close === 'function') {
        try { await pool.close(); } catch (e) { /* ignore */ }
      }
    } catch (e) { /* ignore */ }

    // set the exported promise to null so new callers will recreate
    try { denver._forceReset = true; } catch (e) { /* ignore */ }

    return [];
  }
}




// config/siteConfig.js
const sqlModule = require('mssql');

// -------------------- Pune (shared pool) --------------------
const { poolPromise: sharedPoolPromise } = require('./db'); // your existing Pune db.js
const punePoolPromise = sharedPoolPromise;

// -------------------- Denver pool --------------------
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
    max: 6,
    min: 0,
    idleTimeoutMillis: 30_000,
    acquireTimeoutMillis: 30_000
  },
  connectionTimeout: 30_000,
  requestTimeout: 15_000
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
    console.error('❌ Denver pool promise ultimately failed:', err);
    denverPoolPromise = null;
    return null;
  });

  return denverPoolPromise;
}

// Ping Denver every 5 minutes to keep the pool alive
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
    poolPromise: denverPoolPromise,
    sql: sqlModule
  }
};
