i hove the data is getting more time to load the reasonu is this erro,
  this erro, is came every time.
  ++ i want to dont show this error again, dont user time 
  ++ i want to fethc data every second, i means live data, withou any timing ok 
  === WHAT IS THE SLUTION FO THIS ALL ERROR, i want to slove this erro permanatly 

⏳ Retrying Denver pool connect (1 left)…
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
Unhandled Rejection at: TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
❌ Unhandled Rejection at: TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
❌ Unhandled Rejection at: TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
✅ MSSQL pool connected
=================================================================
  

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
+++++++++++++++++++++++++++++++
  
// C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\controllers\liveOccupancyController.js

const { DateTime }   = require('luxon');
// const { poolConnect, pool, sql } = require('../config/db');
const { sql, getPool } = require('../config/db');

const doorZoneMap    = require('../data/doorZoneMap');
const zoneFloorMap   = require('../data/zoneFloorMap');

const ertMembers = require('../data/puneErtMembers.json');

// track which door→zone keys we've already warned on
const warnedKeys = new Set();

//update
function getTodayString() {
  return DateTime.now()
    .setZone('Asia/Kolkata')
    .toFormat('yyyy-LL-dd');
}

function normalizeZoneKey(rawDoor, rawDir) {
  // 1) Ensure it’s a string and trim whitespace
  let door = String(rawDoor || '').trim();

  // 2) Strip any "_HH:MM:SS" or "_XX:XX:XX" suffix (hex codes or times at end)
  door = door.replace(/_[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}$/, '');

  // 3) Collapse multiple spaces into one, then uppercase
  door = door.replace(/\s+/g, ' ').toUpperCase();

  // 4) Pick the direction token exactly as doorZoneMap expects
  const dir = rawDir === 'InDirection' ? 'InDirection' : 'OutDirection';

  return `${door}___${dir}`;
}

/** Normalize "Last, First" or "First Last" → lowercase "first last" */
function normalizePersonName(raw) {
  let n = String(raw || '').trim();
  if (n.includes(',')) {
    const [last, rest] = n.split(',', 2);
    n = `${rest.trim()} ${last.trim()}`;
  }
  return n.toLowerCase();
}


// --- new mapDoorToZone ---
function mapDoorToZone(rawDoor, rawDir) {
  const key = normalizeZoneKey(rawDoor, rawDir);
  const zone = doorZoneMap[key];

  if (!zone) {
    if (!warnedKeys.has(key)) {
      console.warn('⛔ Unmapped door–direction key:', key);
      warnedKeys.add(key);
    }
    return 'Unknown Zone';
  }

  // IMPORTANT: return the zone exactly as defined in doorZoneMap
  return zone;
}


async function fetchNewEvents(since) {
  // await the shared pool promise instead of poolConnect
  const pool = await getPool();
  const req  = pool.request();
  req.input('since', sql.DateTime2, since);

// console.log('🔎 [Pune] fetchNewEvents called with since =', since.toISOString());
  const { recordset } = await req.query(`
    WITH CombinedQuery AS (
      SELECT
       DATEADD(MINUTE,-1 *t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
       
        t1.ObjectName1,
        CASE
          WHEN t3.Name IN ('Contractor','Terminated Contractor') THEN t2.Text12
          ELSE CAST(t2.Int1 AS NVARCHAR)
        END AS EmployeeID,
        t1.ObjectIdentity1 AS PersonGUID,
        t3.Name AS PersonnelType,
        COALESCE(
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
          sc.value
        ) AS CardNumber,
        t5a.value AS AdmitCode,
        t5d.value AS Direction,
        t1.ObjectName2 AS Door
      FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLog] t1
      LEFT JOIN [ACVSCore].[Access].[Personnel]     t2 ON t1.ObjectIdentity1 = t2.GUID
      LEFT JOIN [ACVSCore].[Access].[PersonnelType] t3 ON t2.PersonnelTypeId = t3.ObjectID
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] t5a
        ON t1.XmlGUID = t5a.GUID AND t5a.Name = 'AdmitCode'
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] t5d
        ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxml] t_xml
        ON t1.XmlGUID = t_xml.GUID
      LEFT JOIN (
        SELECT GUID, value
        FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred]
        WHERE Name IN ('Card','CHUID')
      ) sc ON t1.XmlGUID = sc.GUID
      WHERE
        t1.MessageType     = 'CardAdmitted'
        AND t1.PartitionName2 = 'APAC.Default'
        AND DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) >@since
    )
    SELECT
      LocaleMessageTime,
      CONVERT(VARCHAR(10), LocaleMessageTime, 23) AS Dateonly,
      CONVERT(VARCHAR(8) , LocaleMessageTime, 108) AS Swipe_Time,
      EmployeeID,
      PersonGUID,
      ObjectName1,
      PersonnelType,
      CardNumber,
      AdmitCode,
      Direction,
      Door
    FROM CombinedQuery
    ORDER BY LocaleMessageTime ASC;
  `);

  // console.log(`📥 [Pune] fetched ${recordset.length} rows:`,
    // recordset.map(r => r.LocaleMessageTime.toISOString()));

  return recordset;
}

async function buildOccupancy(allEvents) {
  const current      = {};
  const uniquePeople = new Map();
// --- simplified per-event loop inside buildOccupancy ---
for (const evt of allEvents) {
  const {
    EmployeeID, PersonGUID,
    ObjectName1, PersonnelType,
    CardNumber, Dateonly,
    Swipe_Time, Direction, Door
  } = evt;

  const dedupKey = PersonGUID || EmployeeID || CardNumber || ObjectName1;
  const zoneRaw  = mapDoorToZone(Door, Direction);

  // 1) If we can’t map door+direction to a valid zone, skip this event entirely.
  if (zoneRaw === 'Unknown Zone') {
    continue;
  }

  const zoneLower = zoneRaw.toLowerCase();

  // OutDirection: eviction only for the real "Out of office"
  if (Direction === 'OutDirection') {
    if (zoneLower === 'out of office') {
      uniquePeople.delete(dedupKey);
      delete current[dedupKey];
    } else {
      // Keep them in headcount, update last-seen
      uniquePeople.set(dedupKey, PersonnelType);
      current[dedupKey] = {
        Dateonly, Swipe_Time,
        EmployeeID, ObjectName1, CardNumber,
        PersonnelType,
        zone: zoneRaw,
        door: Door,
        Direction
      };
    }
    continue;
  }

  // InDirection → normal check-in
  if (Direction === 'InDirection') {
    uniquePeople.set(dedupKey, PersonnelType);
    current[dedupKey] = {
      Dateonly, Swipe_Time,
      EmployeeID, ObjectName1, CardNumber,
      PersonnelType,
      zone: zoneRaw,
      door: Door,
      Direction
    };
    continue;
  }
  // Catch-all eviction
  uniquePeople.delete(dedupKey);
  delete current[dedupKey];
}

// live headcounts (only from uniquePeople, which has already evicted all true out-of-office)
  let employeeCount   = 0;
  let contractorCount = 0;
  for (const pt of uniquePeople.values()) {
    if (['Employee','Terminated Personnel'].includes(pt)) employeeCount++;
    else contractorCount++;
  }

  // Build zone→people map, but filter out any out-of-office at this final step too
  const zoneMap = {};
  for (const emp of Object.values(current)) {
    const zKey = emp.zone.toLowerCase();
    if (zKey === 'out of office') continue;
    zoneMap[emp.zone] = zoneMap[emp.zone] || [];
    zoneMap[emp.zone].push(emp);
  }

  // zoneDetails
  const zoneDetails = Object.fromEntries(
    Object.entries(zoneMap).map(([zone, emps]) => {
      const byType = emps.reduce((acc, e) => {
        acc[e.PersonnelType] = (acc[e.PersonnelType]||0) + 1;
        return acc;
      }, {});
      return [ zone, { total: emps.length, byPersonnelType: byType, employees: emps } ];
    })
  );

  // floorBreakdown
  const floorMap = {};
  for (const [zone, data] of Object.entries(zoneDetails)) {
    const floor = zoneFloorMap[zone] || 'Unknown Floor';
    floorMap[floor] = floorMap[floor] || { total: 0, byPersonnelType: {} };
    floorMap[floor].total += data.total;
    for (const [pt, c] of Object.entries(data.byPersonnelType)) {
      floorMap[floor].byPersonnelType[pt] = (floorMap[floor].byPersonnelType[pt]||0) + c;
    }
  }


  const ertStatus = Object.fromEntries(
    Object.entries(ertMembers).map(([role, members]) => {
      const list = members.map(m => {
        // pick the correct name field (JSON uses "Name")
        const rawName = m.name || m.Name;
        const expected = normalizePersonName(rawName);

        // find a matching swipe in current[]
        const matchEvt = Object.values(current).find(e => {
          return normalizePersonName(e.ObjectName1) === expected;
        });
        return {
          ...m,
          present: !!matchEvt,
          zone:    matchEvt ? matchEvt.zone : null
        };
     });
      return [ role, list ];
    })
  );

  return {
    asOf:             new Date().toISOString(),
    summary:          Object.entries(zoneDetails).map(([z,d])=>({ zone: z, count: d.total })),
    zoneBreakdown:    Object.entries(zoneDetails).map(([z,d])=>({ zone: z, ...d.byPersonnelType, total: d.total })),
    floorBreakdown:   Object.entries(floorMap).map(([f,d])=>({ floor: f, ...d.byPersonnelType, total: d.total })),
    details:          zoneMap,
    personnelSummary: { employees: employeeCount, contractors: contractorCount },
     ertStatus,
  
  personnelBreakdown: (() => {
    const map = new Map();
    // uniquePeople: Map<dedupKey, PersonnelType>
    for (const pt of uniquePeople.values()) {
      map.set(pt, (map.get(pt) || 0) + 1);
    }
    return Array.from(map, ([personnelType, count]) => ({ personnelType, count }));
  })(),
  };
}


/**
 * Build “visited today” from the same in‐memory stream
 *
 * @param {Array} allEvents  - events where evt.Dateonly is already local yyyy-MM-dd
 * @param {DateTime|Date|string} [asOf] - optional Luxon DateTime, JS Date or yyyy-MM-dd string.
 *                                       If provided, "today" will be computed from this instead
 *                                       of DateTime.now().setZone('Asia/Kolkata').
 */
function buildVisitedToday(allEvents, asOf) {
  // Determine "today" in Asia/Kolkata:
  let today;
  if (asOf) {
    // Accept Luxon DateTime, JS Date, or plain yyyy-MM-dd string
    if (typeof asOf === 'string') {
      today = asOf; // assume already 'yyyy-LL-dd'
    } else if (asOf instanceof Date) {
      today = DateTime.fromJSDate(asOf, { zone: 'Asia/Kolkata' }).toFormat('yyyy-LL-dd');
    } else if (asOf && typeof asOf.toFormat === 'function') {
      // assume Luxon DateTime
      today = asOf.setZone('Asia/Kolkata').toFormat('yyyy-LL-dd');
    } else {
      // fallback to now
      today = DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-LL-dd');
    }
  } else {
    // default behaviour: "today" is now in Kolkata
    today = DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-LL-dd');
  }

  // Use evt.Dateonly (already “yyyy-MM-dd” in local zone) to pick out today's InDirection swipes
  const todayIns = allEvents.filter(evt => {
    return (
      evt.Direction === 'InDirection' &&
      evt.Dateonly === today
    );
  });

  // Dedupe by PersonGUID → keep the latest swipe
  const dedup = new Map();
  for (const e of todayIns) {
    const key = e.PersonGUID; // same as original logic
    const prev = dedup.get(key);
    // Compare LocaleMessageTime lexicographically is fine for ISO strings; keep original behavior
    if (!prev || e.LocaleMessageTime > prev.LocaleMessageTime) {
      dedup.set(key, e);
    }
  }

  const finalList = Array.from(dedup.values());

  // Separate employees vs contractors (preserve original classification list)
  const employees = finalList.filter(e =>
    !['Contractor','Terminated Contractor','Temp Badge','Visitor','Property Management']
      .includes(e.PersonnelType)
  ).length;
  const contractors = finalList.length - employees;

  return { employees, contractors, total: finalList.length };
}



/** Server‐Sent‐Events endpoint */
exports.getLiveOccupancy = async (req, res) => {
  try {
    // wait for the shared pool to be ready
    await getPool();

    res.writeHead(200, {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection':    'keep-alive'
    });
    res.write('\n');

    // pull last 24h on startup
    // let lastSeen = new Date(Date.now() - 24*60*60*1000);
    let lastSeen = new Date();
    const events = [];

    const push = async () => {




    // Option B: Recompute date from the JS timestamp in Asia/Kolkata:
    const todayKolkata = DateTime.now().setZone('Asia/Kolkata').toISODate();
    for (let i = events.length - 1; i >= 0; i--) {
      const ts = DateTime.fromJSDate(events[i].LocaleMessageTime, { zone: 'utc' })
                     .setZone('Asia/Kolkata')
                     .toISODate();
      if (ts !== todayKolkata) {
        events.splice(i, 1);
      }
    }


//  console.log('🔄 [PUSH] Running at:', new Date().toISOString());
  // console.log('🔍 Last seen swipe time:', lastSeen);


      const fresh = await fetchNewEvents(lastSeen);

      //  console.log('📥 New events fetched:', fresh.length);

      if (fresh.length) {
        // lastSeen = fresh[fresh.length - 1].LocaleMessageTime;
         lastSeen = new Date();
        events.push(...fresh);
      }

  
      // build occupancy + today counts
      const occupancy  = await buildOccupancy(events);
      const todayStats = buildVisitedToday(events);

      occupancy.totalVisitedToday = todayStats.total;
      occupancy.visitedToday      = {
        employees:   todayStats.employees,
        contractors: todayStats.contractors,
        total:       todayStats.total
      };

  

      // add an `id:` so EventSource treats even identical payloads as “new”
      
      const sid = Date.now();
      res.write(`id: ${sid}\n`);
      res.write(`data: ${JSON.stringify(occupancy)}\n\n`);

    
      if (typeof res.flush === 'function') {
        res.flush();
      }

     };
    await push();
    const timer = setInterval(push, 2000);
    req.on('close', () => clearInterval(timer));

  } catch (err) {
    console.error('Live occupancy SSE error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};



// GET /api/occupancy-at-time-pune?date=YYYY-MM-DD&time=HH:MM[:SS]
exports.getPuneSnapshotAtDateTime = async (req, res) => {
  try {
    const { date, time } = req.query;
    if (!date || !time) {
      return res.status(400).json({
        error: 'missing query params: expected ?date=YYYY-MM-DD&time=HH:MM[:SS]'
      });
    }

    // Validate date
    const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (!dateMatch) {
      return res.status(400).json({ error: 'invalid "date" format; expected YYYY-MM-DD' });
    }

    // Validate time
    const timeMatch = /^([0-1]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(time);
    if (!timeMatch) {
      return res.status(400).json({ error: 'invalid "time" format; expected HH:MM or HH:MM:SS' });
    }

    const year   = Number(dateMatch[1]);
    const month  = Number(dateMatch[2]);
    const day    = Number(dateMatch[3]);
    const hour   = Number(timeMatch[1]);
    const minute = Number(timeMatch[2]);
    const second = timeMatch[3] ? Number(timeMatch[3]) : 0;

    // Build Pune-local datetime
    const atDt = DateTime.fromObject(
      { year, month, day, hour, minute, second, millisecond: 0 },
      { zone: 'Asia/Kolkata' }
    );

    if (!atDt.isValid) {
      return res.status(400).json({ error: 'invalid date+time combination' });
    }

    // Convert to UTC for SQL boundary
    const untilUtc = atDt.setZone('utc').toJSDate();

    // -----------------
    // Step 1: fetch events in 24h window ending at atDt
    const pool = await getPool();
    const reqDb = pool.request();
    reqDb.input('until', sql.DateTime2, untilUtc);

    const { recordset } = await reqDb.query(`
      WITH CombinedQuery AS (
        SELECT
          t1.MessageUTC,   -- always UTC
          t1.ObjectName1,
          CASE
            WHEN t3.Name IN ('Contractor','Terminated Contractor') THEN t2.Text12
            ELSE CAST(t2.Int1 AS NVARCHAR)
          END AS EmployeeID,
          t1.ObjectIdentity1 AS PersonGUID,
          t3.Name AS PersonnelType,
          COALESCE(
            TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
            TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
            sc.value
          ) AS CardNumber,
          t5a.value AS AdmitCode,
          t5d.value AS Direction,
          t1.ObjectName2 AS Door
        FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLog] t1
        LEFT JOIN [ACVSCore].[Access].[Personnel]     t2 ON t1.ObjectIdentity1 = t2.GUID
        LEFT JOIN [ACVSCore].[Access].[PersonnelType] t3 ON t2.PersonnelTypeId = t3.ObjectID
        LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] t5a
          ON t1.XmlGUID = t5a.GUID AND t5a.Name = 'AdmitCode'
        LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] t5d
          ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')
        LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxml] t_xml
          ON t1.XmlGUID = t_xml.GUID
        LEFT JOIN (
          SELECT GUID, value
          FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred]
          WHERE Name IN ('Card','CHUID')
        ) sc ON t1.XmlGUID = sc.GUID
        WHERE
          t1.MessageType     = 'CardAdmitted'
          AND t1.PartitionName2 = 'APAC.Default'
          AND t1.MessageUTC <= @until
          AND DATEADD(HOUR, -24, @until) < t1.MessageUTC
      )
      SELECT *
      FROM CombinedQuery
      ORDER BY MessageUTC ASC;
    `);

    // -----------------
    // Step 2: convert UTC → Asia/Kolkata
    const events = recordset.map(e => {
      const local = DateTime.fromJSDate(e.MessageUTC, { zone: 'utc' })
                            .setZone('Asia/Kolkata');
      return {
        ...e,
        LocaleMessageTime: local.toISO(),
        Dateonly: local.toFormat('yyyy-LL-dd'),
        Swipe_Time: local.toFormat('HH:mm:ss'),
      };
    });

    // -----------------
    // Step 3: filter only same Pune date
    const targetDate = atDt.toFormat('yyyy-LL-dd');
    const filtered = events.filter(e => e.Dateonly === targetDate);

    // Step 4: build occupancy snapshot
    const occupancy = await buildOccupancy(filtered);

    // Step 5: visited-today counts aligned to atDt
    // const visitedStats = buildVisitedToday(filtered);
    
    const visitedStats = buildVisitedToday(filtered, atDt);  // this add new code as per function buildVisitedToday change 📝 📝

    // ---- Output timestamps ----
    occupancy.asOfLocal = atDt.toISO(); // Pune-local with offset
    occupancy.asOfUTC   = `${date}T${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:${String(second).padStart(2,'0')}Z`;

    occupancy.totalVisitedToday = visitedStats.total;
    occupancy.visitedToday = visitedStats;

    return res.json(occupancy);
  } catch (err) {
    console.error('getPuneSnapshotAtDateTime error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

