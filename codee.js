PS C:\Users\W0024618\Desktop\swipeData\employee-ai-insights> npm start

> employee-ai-insights@1.0.0 start
> node server.js

Server running at http://localhost:5000
✅ MSSQL pool connected
✅ Denver MSSQL pool connected
[DENVER] SSE client disconnected, cleared timers
[DENVER] SSE client disconnected, cleared timers
[DENVER] SSE client disconnected, cleared timers
[DENVER] SSE client disconnected, cleared timers
[DENVER] SSE client disconnected, cleared timers
[DENVER] SSE client disconnected, cleared timers
❌ Error computing in/out inconsistency: RequestError: Connection lost - read ECONNRESET
    at handleError (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\mssql\lib\tedious\request.js:384:15)
    at Connection.emit (node:events:530:35)
    at Connection.emit (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:970:18)
    at Connection.socketError (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:1359:12)
    at Socket.<anonymous> (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:1060:12)
    at Socket.emit (node:events:530:35)
    at emitErrorNT (node:internal/streams/destroy:170:8)
    at emitErrorCloseNT (node:internal/streams/destroy:129:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
  code: 'EREQUEST',
  originalError: Error: Connection lost - read ECONNRESET
      at handleError (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\mssql\lib\tedious\request.js:382:19)
      at Connection.emit (node:events:530:35)
      at Connection.emit (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:970:18)
      at Connection.socketError (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:1359:12)
      at Socket.<anonymous> (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:1060:12)
      at Socket.emit (node:events:530:35)
      at emitErrorNT (node:internal/streams/destroy:170:8)
      at emitErrorCloseNT (node:internal/streams/destroy:129:3)
      at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
    info: ConnectionError: Connection lost - read ECONNRESET
        at Connection.socketError (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:1359:26)
        at Socket.<anonymous> (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:1060:12)
        at Socket.emit (node:events:530:35)
        at emitErrorNT (node:internal/streams/destroy:170:8)
        at emitErrorCloseNT (node:internal/streams/destroy:129:3)
        at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
      code: 'ESOCKET',
      [cause]: [Error]
    }
  },
  number: undefined,
  lineNumber: undefined,
  state: undefined,
  class: undefined,
  serverName: undefined,
  procName: undefined
}



// controllers/denverInOutInconsistencyController.js

const { DateTime }       = require('luxon');
const { denver }         = require('../config/siteConfig');
const sql                = require('mssql');
const normalizeKey       = require('../data/normalizeKey');
const doorFloorMap       = require('../data/denverDoorFloorMap');
const { monitoredDoors } = require('../data/strictDoorList');

const warnedKeys = new Set();

// Build a Set of normalized door___direction keys (strict doors only)
const normalizedMonitoredKeys = new Set(
  Object.entries(monitoredDoors).map(
    ([door, dir]) => normalizeKey(door, dir)
  )
);

/** Strip any trailing “_HH:MM:SS” from a door name **/
function stripTimeSuffix(doorRaw) {
  return doorRaw.replace(/_[0-9]{2}:[0-9]{2}:[0-9]{2}$/, '').trim();
}

/**
 * Determine floor label by regex.
 * Falls back to doorFloorMap if necessary.
 */
function extractFloor(rawDoor) {
  const noTime = stripTimeSuffix(rawDoor);
  const m = noTime.match(/HQ\.\s*(\d{1,2})\b/);
  if (m) {
    return `Floor ${m[1]}`;
  }
  // fallback: attempt to map via doorFloorMap
  const keyIn  = normalizeKey(noTime, 'InDirection');
  const keyOut = normalizeKey(noTime, 'OutDirection');
  if (doorFloorMap[keyIn])  return doorFloorMap[keyIn];
  if (doorFloorMap[keyOut]) return doorFloorMap[keyOut];
  if (!warnedKeys.has(noTime)) {
    console.warn(`⛔ Unmapped door for floor extraction: "${noTime}"`);
    warnedKeys.add(noTime);
  }
  return 'Unknown Floor';
}

/**
  Fetch all swipe events from Jan 1, 2025 up to now.
 * Returns an array of records with fields:
 *   LocaleMessageTime (Date),
 *   Dateonly (YYYY-MM-DD string),
 *   Swipe_Time (HH:mm:ss string),
 *   EmployeeID (string),
 *   PersonGUID (string),
 *   ObjectName1 (employee name),
 *   PersonnelType (string),
 *   CardNumber (string),
 *   AdmitCode (string),
 *   Direction ('InDirection' or 'OutDirection'),
 *   Door (string).
 */
async function fetchHistoricalEvents() {
  const pool = await denver.poolPromise;
  const req  = pool.request();

  // Start from January 1, 2025 at midnight (America/Denver)
  const since = DateTime.fromObject(
    { year: 2025, month: 1, day: 1, hour: 0, minute: 0, second: 0 },
    { zone: 'America/Denver' }
  ).toJSDate();


    // Up to (but not including) today at midnight (America/Denver)
  const until = DateTime.now()
    .setZone('America/Denver')
    .startOf('day')
    .toJSDate();


  req.input('since', sql.DateTime2, since);
  req.input('until', sql.DateTime2, until);

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
      FROM ACVSUJournal_00010027.dbo.ACVSUJournalLog t1
      LEFT JOIN ACVSCore.Access.Personnel     t2 ON t1.ObjectIdentity1 = t2.GUID
      LEFT JOIN ACVSCore.Access.PersonnelType t3 ON t2.PersonnelTypeId  = t3.ObjectID
      LEFT JOIN ACVSUJournal_00010027.dbo.ACVSUJournalLogxmlShred t5a
        ON t1.XmlGUID = t5a.GUID AND t5a.Name = 'AdmitCode'
      LEFT JOIN ACVSUJournal_00010027.dbo.ACVSUJournalLogxmlShred t5d
        ON t1.XmlGUID = t5d.GUID AND t5d.Name = 'Direction'
      LEFT JOIN ACVSUJournal_00010027.dbo.ACVSUJournalLogxml t_xml
        ON t1.XmlGUID = t_xml.GUID
      LEFT JOIN (
        SELECT GUID, value
        FROM ACVSUJournal_00010027.dbo.ACVSUJournalLogxmlShred
        WHERE Name IN ('Card','CHUID')
      ) sc ON t1.XmlGUID = sc.GUID
      WHERE
        t1.MessageType   = 'CardAdmitted'
        AND t1.ObjectName2 LIKE '%HQ%'
        AND DATEADD(MINUTE, t1.MessageLocaleOffset, t1.MessageUTC) >= @since
          AND DATEADD(MINUTE, t1.MessageLocaleOffset, t1.MessageUTC) <  @until
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

  return recordset;
}

/**
 * Compute in/out inconsistency metrics, adding:
 *   - dailyFloorStats: [
 *       {
 *         date,
 *         month,
 *         floor,
 *         inCount,
 *         outCount,
 *         totalPersons,
 *         inconsistentCount,
 *         inconsistencyPercentage,
 *         instances: [
 *           { employeeId, name, personnelType }
 *         ]
 *       }
 *     ]
 *   - floorInconsistency: [
 *       { floor, totalPersonDays, inconsistentPersonDays, inconsistencyPercentage }
 *     ]
 *   - employeeInconsistency: [
 *       { employeeId, totalDays, inconsistentDays, inconsistencyPercentage }
 *     ]
 *
 * Only strict‐door events (per monitoredDoors) are considered.
 */
function computeInOutInconsistency(events) {
  // STEP A: Build per‐person‐day‐floor buckets
  // Key: `${personId}__${date}__${floor}`
  const bucketMap = new Map();

  events.forEach(evt => {
    const dateOnly   = evt.Dateonly;           // 'YYYY-MM-DD'
    const direction  = evt.Direction.trim();    // 'InDirection' or 'OutDirection'
    const rawDoor    = evt.Door.trim();
    const doorNoTime = stripTimeSuffix(rawDoor);
    const normKey    = normalizeKey(doorNoTime, direction);

    if (!normalizedMonitoredKeys.has(normKey)) return;

    const personId = evt.PersonGUID || evt.EmployeeID || evt.CardNumber;
    if (!personId) return;

    const name          = evt.ObjectName1 || null;
    const personnelType = evt.PersonnelType || null;
    const floor         = extractFloor(doorNoTime);
    const groupKey      = `${personId}__${dateOnly}__${floor}`;

    if (!bucketMap.has(groupKey)) {
      bucketMap.set(groupKey, {
        personId,
        name,
        personnelType,
        dateOnly,
        floor,
        firstInTime: null,
        lastOutTime: null
      });
    }

    const bucket    = bucketMap.get(groupKey);
    const swipeTime = DateTime.fromFormat(evt.Swipe_Time, 'HH:mm:ss');

    if (direction === 'InDirection') {
      if (!bucket.firstInTime || swipeTime < bucket.firstInTime) {
        bucket.firstInTime = swipeTime;
      }
    } else if (direction === 'OutDirection') {
      if (!bucket.lastOutTime || swipeTime > bucket.lastOutTime) {
        bucket.lastOutTime = swipeTime;
      }
    }
  });

  // STEP B: Aggregate per date‐floor for dailyFloorStats
  // Key: `${dateOnly}__${floor}`
  const dateFloorMap = new Map();

  bucketMap.forEach(bucket => {
    const { personId, name, personnelType, dateOnly, floor, firstInTime, lastOutTime } = bucket;
    const dfKey = `${dateOnly}__${floor}`;

    if (!dateFloorMap.has(dfKey)) {
      dateFloorMap.set(dfKey, {
        date: dateOnly,
        month: DateTime.fromISO(dateOnly).toFormat('LLLL'),
        floor,
        totalPersons: 0,
        inCount: 0,
        outCount: 0,
        inconsistentCount: 0,
        instances: []
      });
    }

    const stats = dateFloorMap.get(dfKey);
    stats.totalPersons += 1;

    const hasIn  = Boolean(firstInTime);
    const hasOut = Boolean(lastOutTime);
    if (hasIn)  stats.inCount += 1;
    if (hasOut) stats.outCount += 1;

    if (!(hasIn && hasOut)) {
      stats.inconsistentCount += 1;
      stats.instances.push({
        employeeId: personId,
        name,
        personnelType
      });
    }
  });

  // After populating, compute inconsistencyPercentage for each date‐floor
  const dailyFloorStats = [];
  dateFloorMap.forEach(stats => {
    const { totalPersons, inconsistentCount } = stats;
    const pct = totalPersons > 0 ? (inconsistentCount / totalPersons) * 100 : 0;
    dailyFloorStats.push({
      date: stats.date,
      month: stats.month,
      floor: stats.floor,
      inCount: stats.inCount,
      outCount: stats.outCount,
      totalPersons: stats.totalPersons,
      inconsistentCount: stats.inconsistentCount,
      inconsistencyPercentage: parseFloat(pct.toFixed(2)),
      instances: stats.instances
    });
  });

  // STEP C: Floor‐level aggregated over entire period
  const floorAgg = new Map();
  bucketMap.forEach(bucket => {
    const { dateOnly, floor, firstInTime, lastOutTime } = bucket;
    const isInconsistent = !(firstInTime && lastOutTime);

    if (!floorAgg.has(floor)) {
      floorAgg.set(floor, {
        totalPersonDays: 0,
        inconsistentPersonDays: 0
      });
    }
    const fAgg = floorAgg.get(floor);
    fAgg.totalPersonDays += 1;
    if (isInconsistent) {
      fAgg.inconsistentPersonDays += 1;
    }
  });

  const floorInconsistency = [];
  floorAgg.forEach((vals, floor) => {
    const { totalPersonDays, inconsistentPersonDays } = vals;
    const pct =
      totalPersonDays > 0
        ? (inconsistentPersonDays / totalPersonDays) * 100
        : 0;
    floorInconsistency.push({
      floor,
      totalPersonDays,
      inconsistentPersonDays,
      inconsistencyPercentage: parseFloat(pct.toFixed(2))
    });
  });

  // STEP D: Employee‐level aggregated over entire period
  const empAgg = new Map();
  bucketMap.forEach(bucket => {
    const { personId, dateOnly, firstInTime, lastOutTime } = bucket;
    const isInconsistent = !(firstInTime && lastOutTime);

    if (!empAgg.has(personId)) {
      empAgg.set(personId, {
        totalDaysSet: new Set(),
        inconsistentDaysSet: new Set()
      });
    }
    const eAgg = empAgg.get(personId);
    eAgg.totalDaysSet.add(dateOnly);
    if (isInconsistent) {
      eAgg.inconsistentDaysSet.add(dateOnly);
    }
  });

  const employeeInconsistency = [];
  empAgg.forEach((vals, personId) => {
    const totalDays = vals.totalDaysSet.size;
    const inconsistentDays = vals.inconsistentDaysSet.size;
    const pct =
      totalDays > 0 ? (inconsistentDays / totalDays) * 100 : 0;
    employeeInconsistency.push({
      employeeId: personId,
      totalDays,
      inconsistentDays,
      inconsistencyPercentage: parseFloat(pct.toFixed(2))
    });
  });

  return {
    asOf: new Date().toISOString(),
    dailyFloorStats,
    floorInconsistency,
    employeeInconsistency
  };
}

/**
 * Controller endpoint: GET /api/denver/inout-inconsistency
 *
 * Fetches all strict-door swipe events from Jan 1, 2025 to now,
 * computes:
 *   1. dailyFloorStats (by date + floor)
 *   2. floorInconsistency (overall per floor)
 *   3. employeeInconsistency (overall per employee)
 * and returns a JSON payload.
 */


async function withRetry(fn, retries = 2) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if ((err.code === 'ECONNRESET' || err.code === 'ESOCKET') && i < retries) {
        console.warn(`🔁 Retrying due to ${err.code} (${i + 1}/${retries})`);
        await new Promise(res => setTimeout(res, 1000));
        continue;
      }
      break;
    }
  }
  throw lastErr;
}

exports.getDenverInOutInconsistency = async (req, res) => {
  try {
    const events = await withRetry(fetchHistoricalEvents, 3);
    const result = computeInOutInconsistency(events);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Error computing in/out inconsistency:', err);
    res.status(500).json({
      error: 'Failed to compute in/out inconsistency'
    });
  }
};






