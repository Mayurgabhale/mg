Server running at http://localhost:5000
✅ MSSQL pool connected
✅ Denver MSSQL pool connected
❌ Denver MSSQL pool error: TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
❌ fetchNewEvents query error — resetting Denver poolPromise: TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
⚠️ Denver poolPromise resolved to null — DB likely unavailable
[DENVER] SSE client disconnected, cleared timers
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


  
async function fetchNewEvents(since) {
  let pool;
  try {
    pool = await denver.poolPromise;
  } catch (err) {
    console.error('❌ Failed to get Denver pool in fetchNewEvents():', err);
    return [];
  }
  if (!pool) return [];

  try {
    const req = pool.request();
    req.input('since', sql.DateTime2, since);
    // If a pool is present but the underlying connections are unhealthy,
    // this query can still throw (tarn acquire timeout). Catch that below.
    const { recordset } = await req.query(`
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
    `);
    return recordset || [];
  } catch (err) {
    console.error('❌ fetchNewEvents query error — resetting Denver poolPromise:', err);
    // Reset pool so next attempt will re-establish
    try { denver.poolPromise = null; } catch (e) { /* ignore */ }
    return [];
  }
}



============================

// config/siteConfig.js
const { sql, getPool } = require('./db');

// Pune uses the shared getPool():
const punePoolPromise = getPool();

// Denver pool configuration
const denverConfig = {
  user:     'GSOC_Test',
  password: 'Westernccure@2025',
  server:   'SRVWUDEN0891V',
  database: 'ACVSUJournal_00010028',
  options: {
    encrypt:               true,
    trustServerCertificate: true
  },
  pool: {
    max:                  5,
    min:                  0,

    // Make these extremely large so that Tarn will never time us out
    idleTimeoutMillis:    2147483647,
    acquireTimeoutMillis: 2147483647
  },
  connectionTimeout: 30000,  // 30 seconds to establish
  requestTimeout:    0       // no timeout on individual queries
};

let denverPoolPromise = null;

async function getDenverPool(attempts = 3) {
  // If a pool promise is already in-flight (or resolved), return it.
  if (denverPoolPromise) {
    return denverPoolPromise;
  }

  denverPoolPromise = (async () => {
    const pool = new sql.ConnectionPool(denverConfig);

    // If this pool ever errors, reset the promise so that
    // next time we can try to re-connect.
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

      // If all retries fail, re­throw so that calling code can catch it.
      throw err;
    }
  })().catch(err => {
    // Catch any unhandled rejection here so it never propagates
    // out of the immediate getDenverPool() call.
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
        await pool.request().query('SELECT 1'); // keepalive
        // console.log('🔄 Denver keep-alive succeeded');
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
    name:        'Pune',
    poolPromise: punePoolPromise,
    sql
  },
  denver: {
    name:        'Denver',
    poolPromise: getDenverPool(),
    sql
  }
};

