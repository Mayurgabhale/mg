Server running at http://localhost:5000
✅ MSSQL pool connected
✅ Denver MSSQL pool connected
[DENVER] SSE client disconnected, cleared timers
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
node:internal/process/promises:394
    triggerUncaughtException(err, true /* fromPromise */);
    ^

TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)

Node.js v22.17.0
PS C:\Users\W0024618\Desktop\swipeData\employee-ai-insights> 
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\config\db.js
const sql    = require('mssql');
const dotenv = require('dotenv');
dotenv.config();

const config = {
  server:   process.env.DB_SERVER,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionTimeout: 30000,    // 30 s to establish
  requestTimeout:    0,        // no timeout on individual queries
  pool: {
    max:                  100,
    min:                   0,

    // Use maximum 32-bit signed‐int (~24.8 days) so Node/tarn doesn't overflow
    idleTimeoutMillis:    2147483647,
    acquireTimeoutMillis: 2147483647
  },
  options: {
    encrypt:               true,
    trustServerCertificate: true
  }
};

let poolPromise = null;

async function getPool(attempts = 10) {
  if (poolPromise) return poolPromise;

  poolPromise = (async () => {
    try {
      const pool = await sql.connect(config);
      console.log('✅ MSSQL pool connected');

      // attach pool-level error listener so we can reset and attempt reconnects
      pool.on('error', err => {
        console.error('❌ MSSQL pool error:', err);
        // Reset promise so next getPool() tries to reconnect
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

  // Global sql error: log but do not crash the process
  sql.on('error', err => {
    console.error('❌ MSSQL global error:', err);
    // Consider resetting poolPromise only for fatal errors:
    // poolPromise = null;
  });

  return poolPromise;
}

// Keep‐alive ping every 5 minutes
setInterval(async () => {
  try {
    const pool = await getPool();
    await pool.request().query('SELECT 1');
    // console.log('🔄 MSSQL keep‐alive succeeded');
  } catch (err) {
    console.error('⚠️ MSSQL keep‐alive ping failed:', err);
    // poolPromise stays intact so we keep using the same pool
  }
}, 5 * 60 * 1000);

module.exports = { sql, getPool };


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

=========================================
  
// controllers/denverLiveOccupancyController.js

const { DateTime }       = require('luxon');
const { denver }         = require('../config/siteConfig');
const doorFloorMap       = require('../data/denverDoorFloorMap');
const { monitoredDoors } = require('../data/strictDoorList');
const sql                = require('mssql');
const normalizeKey       = require('../data/normalizeKey');

const warnedKeys = new Set();

// build a Set of normalized door___direction keys
const normalizedMonitoredKeys = new Set(
  Object.entries(monitoredDoors).map(([door, dir]) => normalizeKey(door, dir))
);

/** Determine floor label, fallback to “HQ. N.” parsing **/
function mapDoorToFloor(rawDoor, rawDir) {
  const key = normalizeKey(rawDoor, rawDir);
  if (doorFloorMap[key]) return doorFloorMap[key];
  const m = rawDoor.match(/HQ\.\s*(\d{1,2})\b/);
  if (m) return `Floor ${m[1]}`;
  if (!warnedKeys.has(key)) {
    console.warn(`⛔ Unmapped door-floor key: "${key}"`);
    warnedKeys.add(key);
  }
  return 'Unknown Floor';
}

/** Strip any trailing “_HH:MM:SS” from a door name **/
function stripTimeSuffix(doorRaw) {
  return doorRaw.replace(/_[0-9]{2}:[0-9]{2}:[0-9]{2}$/, '');
}


function isSameDenverDate(dateOnly, referenceDt = null) {
  if (!dateOnly) return false;
  const swipeDate = DateTime.fromISO(dateOnly, { zone: 'America/Denver' }).toFormat('yyyy-LL-dd');
  const today = referenceDt
    ? referenceDt.setZone('America/Denver').toFormat('yyyy-LL-dd')
    : DateTime.now().setZone('America/Denver').toFormat('yyyy-LL-dd');
  return swipeDate === today;
}

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

// --- safer fetchEventsWindowUntil ---
async function fetchEventsWindowUntil(until) {
  let pool;
  try {
    pool = await denver.poolPromise;
  } catch (err) {
    console.error('❌ Failed to get Denver pool in fetchEventsWindowUntil():', err);
    return [];
  }
  if (!pool) return [];

  try {
    const req = pool.request();
    req.input('until', sql.DateTime2, until);

    const { recordset } = await req.query(`
      WITH CombinedQuery AS (
        SELECT
          DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
          t1.ObjectName1,
          CASE WHEN t3.Name IN ('Contractor','Terminated Contractor') THEN t2.Text12 ELSE CAST(t2.Int1 AS NVARCHAR) END AS EmployeeID,
          t1.ObjectIdentity1 AS PersonGUID,
          t3.Name AS PersonnelType,
          COALESCE(TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'), sc.value) AS CardNumber,
          t5a.value AS AdmitCode,
          t5d.value AS Direction,
          t1.ObjectName2 AS Door
        FROM ACVSUJournal_00010029.dbo.ACVSUJournalLog t1
        LEFT JOIN ACVSCore.Access.Personnel t2 ON t1.ObjectIdentity1 = t2.GUID
        LEFT JOIN ACVSCore.Access.PersonnelType t3 ON t2.PersonnelTypeId  = t3.ObjectID
        LEFT JOIN ACVSUJournal_00010029.dbo.ACVSUJournalLogxmlShred t5a ON t1.XmlGUID = t5a.GUID AND t5a.Name = 'AdmitCode'
        LEFT JOIN ACVSUJournal_00010029.dbo.ACVSUJournalLogxmlShred t5d ON t1.XmlGUID = t5d.GUID AND t5d.Name = 'Direction'
        LEFT JOIN ACVSUJournal_00010029.dbo.ACVSUJournalLogxml t_xml ON t1.XmlGUID = t_xml.GUID
        LEFT JOIN (
          SELECT GUID, value
          FROM ACVSUJournal_00010029.dbo.ACVSUJournalLogxmlShred
          WHERE Name IN ('Card','CHUID')
        ) sc ON t1.XmlGUID = sc.GUID
        WHERE
          t1.MessageType = 'CardAdmitted'
          AND t1.ObjectName2 LIKE '%HQ%'
          AND DATEADD(MINUTE,-1 * t1.MessageLocaleOffset, t1.MessageUTC) <= @until
          AND DATEADD(HOUR, -24, @until) < DATEADD(MINUTE,-1 * t1.MessageLocaleOffset, t1.MessageUTC)
      )
      SELECT
        LocaleMessageTime,
        CONVERT(VARCHAR(10), LocaleMessageTime, 23) AS Dateonly,
        CONVERT(VARCHAR(8) , LocaleMessageTime, 108) AS Swipe_Time,
        EmployeeID, PersonGUID, ObjectName1, PersonnelType,
        CardNumber, AdmitCode, Direction, Door
      FROM CombinedQuery
      ORDER BY LocaleMessageTime ASC;
    `);
    return recordset || [];
  } catch (err) {
    console.error('❌ fetchEventsWindowUntil query error — resetting Denver poolPromise:', err);
    try { denver.poolPromise = null; } catch (e) { /* ignore */ }
    return [];
  }
}

// --- ONLY endpoint: Snapshot endpoint for Denver with date + time ---
// GET /api/occupancy-at-time-denver?date=YYYY-MM-DD&time=HH:MM[:SS]
exports.getDenverSnapshotAtDateTime = async (req, res) => {
  try {
    const { date, time } = req.query;
    if (!date || !time) {
      return res.status(400).json({
        error: 'missing query params: expected ?date=YYYY-MM-DD&time=HH:MM[:SS]'
      });
    }

    // Validate date
    const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (!dateMatch) return res.status(400).json({ error: 'invalid "date" format; expected YYYY-MM-DD' });

    // Validate time
    const timeMatch = /^([0-1]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(time);
    if (!timeMatch) return res.status(400).json({ error: 'invalid "time" format; expected HH:MM or HH:MM:SS' });

    const year   = Number(dateMatch[1]);
    const month  = Number(dateMatch[2]);
    const day    = Number(dateMatch[3]);
    const hour   = Number(timeMatch[1]);
    const minute = Number(timeMatch[2]);
    const second = timeMatch[3] ? Number(timeMatch[3]) : 0;

    // Build Denver-local datetime
    const atDt = DateTime.fromObject(
      { year, month, day, hour, minute, second, millisecond: 0 },
      { zone: 'America/Denver' }
    );

    if (!atDt.isValid) {
      return res.status(400).json({ error: 'invalid date+time combination' });
    }

    const untilJsDate = atDt.toJSDate();

    // fetch with 24h window ending at requested datetime
    const events = await fetchEventsWindowUntil(untilJsDate);

    // filter only events on that Denver local date
    const targetDate = atDt.toFormat('yyyy-LL-dd');
    const filtered = events.filter(e => e.Dateonly === targetDate);

    // build occupancy payload (pass atDt so date checks use it)
    const payload = buildOccupancyForToday(filtered, [], atDt);

    return res.json(payload);
  } catch (err) {
    console.error('getDenverSnapshotAtDateTime error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


// --------------------------
// helper: computeVisitedToday using optional reference date
// Counts any swipe (In or Out) on the same Denver date and up to referenceDt (if provided).
function computeVisitedToday(allEvents, referenceDt = null) {
  const seen = new Map(); // key -> PersonnelType

  allEvents.forEach(evt => {
    // Must be same Denver date as referenceDt (or today when referenceDt null)
    if (!isSameDenverDate(evt.Dateonly, referenceDt)) return;

    // If referenceDt provided, ensure the event's local datetime <= referenceDt
    if (referenceDt) {
      // Prefer Dateonly + Swipe_Time (DB local fields)
      if (!evt.Dateonly || !evt.Swipe_Time) return;
      const evtDt = DateTime.fromISO(`${evt.Dateonly}T${evt.Swipe_Time}`, { zone: 'America/Denver' });
      if (!evtDt.isValid) return;
      if (evtDt > referenceDt.setZone('America/Denver')) return;
    }

    const key = evt.PersonGUID || evt.EmployeeID || evt.CardNumber;
    if (!key) return;
    if (!seen.has(key)) {
      seen.set(key, evt.PersonnelType);
    }
  });

  let employees = 0, contractors = 0;
  seen.forEach(type => {
    if (type === 'Employee' || type === 'Terminated Personnel') employees++;
    else contractors++;
  });

  return { total: seen.size, employees, contractors };
}



// Build occupancy for "today" where "today" can be the real today OR the date represented by atDt (Denver)
function buildOccupancyForToday(allEvents, freshEvents = [], atDt = null) {
  // reference DateTime in Denver (null => live now)
  const refDt = atDt ? atDt.setZone('America/Denver') : null;

  // canonical person key
  const personKey = (evt) => evt.PersonGUID || evt.EmployeeID || evt.CardNumber;

  // derive a Luxon DateTime in America/Denver for the event.
  // Prefer Dateonly + Swipe_Time (these are the DB's local values). Fallback to parsing LocaleMessageTime.
  const eventDtFor = (evt) => {
    if (evt && evt.Dateonly && evt.Swipe_Time) {
      const iso = `${evt.Dateonly}T${evt.Swipe_Time}`; // e.g. "2025-09-17T00:26:55"
      const dt = DateTime.fromISO(iso, { zone: 'America/Denver' });
      if (dt.isValid) return dt;
    }
    if (evt && evt.LocaleMessageTime) {
      // Last resort: parse LocaleMessageTime as ISO and convert to Denver.
      // NOTE: this is fallback only — avoid relying on it for correctness.
      const dt = DateTime.fromISO(evt.LocaleMessageTime, { zone: 'utc' }).setZone('America/Denver');
      if (dt.isValid) return dt;
    }
    return null;
  };

  // ---------- PREFILTER: only keep events on same Denver date and (if refDt) that occurred <= refDt
  const relevantEvents = allEvents.filter(evt => {
    if (!isSameDenverDate(evt.Dateonly, refDt)) return false;
    if (!refDt) return true;
    const eDt = eventDtFor(evt);
    if (!eDt) return false; // cannot compare -> discard
    return eDt <= refDt;
  });

  // ---------- A) Evict “Out of office” using the last event per person (by eventDt)
  const lastByPerson = new Map(); // personKey -> evt
  const lastDtByPerson = new Map(); // personKey -> DateTime

  relevantEvents.forEach(evt => {
    const key = personKey(evt);
    const eDt = eventDtFor(evt);
    if (!eDt) return; // skip malformed
    const prevDt = lastDtByPerson.get(key);
    if (!prevDt || eDt > prevDt) {
      lastDtByPerson.set(key, eDt);
      lastByPerson.set(key, evt);
    }
  });

  const evicted = new Set();
  lastByPerson.forEach(evt => {
    if (
      evt.Direction === 'OutDirection'
      && mapDoorToFloor(evt.Door, evt.Direction) === 'Out of office'
    ) {
      evicted.add(personKey(evt));
    }
  });

  // active events are relevantEvents minus evicted persons
  const activeEvents = relevantEvents.filter(evt => !evicted.has(personKey(evt)));

  // ---------- 1) Live occupancy dedupe by last InDirection (use eventDt ordering)
  const todayIn = activeEvents.filter(e => e.Direction === 'InDirection');

  const latestByPerson = new Map();
  const latestDtByPerson = new Map();
  todayIn.forEach(e => {
    const key = personKey(e);
    const eDt = eventDtFor(e);
    if (!eDt) return;
    const prev = latestDtByPerson.get(key);
    if (!prev || eDt > prev) {
      latestDtByPerson.set(key, eDt);
      latestByPerson.set(key, e);
    }
  });
  const finalList = Array.from(latestByPerson.values());
  

  // ---------- 2) Floor breakdown & personnel counts (live)
  let employees = 0, contractors = 0;
  const floorMap = {};
  finalList.forEach(e => {
    const fl = mapDoorToFloor(e.Door, e.Direction);
    floorMap[fl] = floorMap[fl] || [];
    floorMap[fl].push(e);
    if (e.PersonnelType === 'Employee' || e.PersonnelType === 'Terminated Personnel') employees++;
    else if (e.PersonnelType) contractors++;
  });

  const floorBreakdown = Object.entries(floorMap).map(([floor, occ]) => {
    let empCount = 0, contractorCount = 0, tempBadgeCount = 0, otherCount = 0;
    occ.forEach(e => {
      switch (e.PersonnelType) {
        case 'Employee':
        case 'Terminated Personnel':
          empCount++; break;
        case 'Contractor':
        case 'Terminated Contractor':
          contractorCount++; break;
        case 'Temp Badge':
          tempBadgeCount++; break;
        default:
          otherCount++;
      }
    });
    return {
      floor,
      total: occ.length,
      employees: empCount,
      contractors: contractorCount,
      tempBadge: tempBadgeCount,
      others: otherCount,
      occupants: occ
    };
  });

  // ---------- 3) Personnel breakdown
  const personnelBreakdown = Array.from(
    finalList.reduce((m, e) => {
      m.set(e.PersonnelType, (m.get(e.PersonnelType) || 0) + 1);
      return m;
    }, new Map()),
    ([personnelType, count]) => ({ personnelType, count })
  );

  // ---------- 4) Swipe stats (fresh only) — count only up to refDt
  const countUpToRef = (evt) => {
    if (!isSameDenverDate(evt.Dateonly, refDt)) return false;
    if (!refDt) return true;
    const eDt = eventDtFor(evt);
    if (!eDt) return false;
    return eDt <= refDt;
  };
  const totalInSwipes = (freshEvents || []).filter(e => e.Direction === 'InDirection' && countUpToRef(e)).length;
  const totalOutSwipes = (freshEvents || []).filter(e => e.Direction === 'OutDirection' && countUpToRef(e)).length;

  // ---------- 5) Floor In/Out summary (strict doors only)
  const validEvents = relevantEvents.filter(evt => {
    const doorNoTime = stripTimeSuffix(evt.Door.trim());
    const key = normalizeKey(doorNoTime, (evt.Direction || '').trim());
    return normalizedMonitoredKeys.has(key);
  });

  // Dedupe per person+floor+direction using eventDt ordering
  const deduped = new Map(); // mapKey -> evt
  validEvents.forEach(evt => {
    const rawNoTime = stripTimeSuffix(evt.Door);
    const m = rawNoTime.match(/HQ\.\s*(\d{1,2})\b/);
    const floor = m ? `Floor ${m[1]}` : 'Unknown Floor';

    const mapKey = `${personKey(evt)}___${floor}___${evt.Direction}`;
    const prev = deduped.get(mapKey);
    const nowDt = eventDtFor(evt);
    if (!nowDt) return;
    if (!prev) {
      deduped.set(mapKey, evt);
    } else {
      const prevDt = eventDtFor(prev);
      if (!prevDt || nowDt > prevDt) deduped.set(mapKey, evt);
    }
  });

  // Aggregate in/out per floor
  const floorMapIO = {};
  for (const evt of deduped.values()) {
    const rawNoTime = stripTimeSuffix(evt.Door);
    const m = rawNoTime.match(/HQ\.\s*(\d{1,2})\b/);
    const floor = m ? `Floor ${m[1]}` : 'Unknown Floor';

    if (!floorMapIO[floor]) floorMapIO[floor] = { inSwipes: 0, outSwipes: 0, inSet: new Set(), outSet: new Set() };
    const id = personKey(evt);
    if (evt.Direction === 'InDirection') {
      floorMapIO[floor].inSwipes++;
      floorMapIO[floor].inSet.add(id);
    } else {
      floorMapIO[floor].outSwipes++;
      floorMapIO[floor].outSet.add(id);
    }
  }

  const floorInOutSummary = Object.entries(floorMapIO).map(([floor, stats]) => {
    const inOnly = [...stats.inSet].filter(id => !stats.outSet.has(id));
    return {
      floor,
      inSwipes: stats.inSwipes,
      outSwipes: stats.outSwipes,
      inOnlyCount: inOnly.length,
      inOnlyPersons: inOnly
    };
  });

  // ---------- 6) Visited today breakdown (reuse computeVisitedToday; it already supports referenceDt)
  // const visited = computeVisitedToday(allEvents, refDt);
  const visited = computeVisitedToday(relevantEvents, refDt);

const visitedOccupants = relevantEvents
  .filter(e => eventDtFor(e) && eventDtFor(e) <= refDt)
  .reduce((map, e) => {
    const key = personKey(e);
    if (!map.has(key)) map.set(key, e); // keep first event for identity
    return map;
  }, new Map());

  // Build final payload
  const asOfLocal = refDt ? refDt.toISO() : DateTime.now().setZone('America/Denver').toISO();
  const asOfUTC = refDt ? refDt.toUTC().toISO() : new Date().toISOString();

  return {
    asOfLocal,
    asOfUTC,
    currentCount: finalList.length,
    floorBreakdown,
    personnelSummary: { employees, contractors },
    personnelBreakdown,
    totalVisitedToday: visited.total,
    visitedToday: {
      employees: visited.employees,
      contractors: visited.contractors,
      total: visited.total
    },
     visitedOccupants: Array.from(visitedOccupants.values()),  // 👈 new full list
    swipeStats: { totalInSwipes, totalOutSwipes },
    floorInOutSummary
  };
}

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
+++++++++++++++++++++++++++++++++++++++++++++++++++++
  
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
