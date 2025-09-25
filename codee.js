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

function stripTimeSuffix(doorRaw) {
  return doorRaw.replace(/_[0-9]{2}:[0-9]{2}:[0-9]{2}$/, '').trim();
}

function extractFloor(rawDoor) {
  const noTime = stripTimeSuffix(rawDoor);
  const m = noTime.match(/HQ\.\s*(\d{1,2})\b/);
  if (m) return `Floor ${m[1]}`;

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

// Retry wrapper for transient errors
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

// Fetch events in monthly chunks to avoid ECONNRESET
async function fetchHistoricalEventsChunked() {
  const events = [];
  const pool = await denver.poolPromise;

  let start = DateTime.fromObject({ year: 2025, month: 1, day: 1 }, { zone: 'America/Denver' });
  const end = DateTime.now().setZone('America/Denver');

  while (start < end) {
    const until = start.plus({ months: 1 });
    console.log(`Fetching ${start.toISODate()} -> ${until.toISODate()}`);

    const chunk = await withRetry(async () => {
      const req = pool.request();
      req.input('since', sql.DateTime2, start.toJSDate());
      req.input('until', sql.DateTime2, until.toJSDate());

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
    }, 3);

    events.push(...chunk);
    start = until;
  }

  return events;
}

// Compute in/out inconsistency metrics
function computeInOutInconsistency(events) {
  const bucketMap = new Map();
  events.forEach(evt => {
    const dateOnly   = evt.Dateonly;
    const direction  = evt.Direction?.trim();
    const rawDoor    = evt.Door?.trim();
    if (!direction || !rawDoor) return;

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
      bucketMap.set(groupKey, { personId, name, personnelType, dateOnly, floor, firstInTime: null, lastOutTime: null });
    }

    const bucket    = bucketMap.get(groupKey);
    const swipeTime = DateTime.fromFormat(evt.Swipe_Time, 'HH:mm:ss');

    if (direction === 'InDirection') {
      if (!bucket.firstInTime || swipeTime < bucket.firstInTime) bucket.firstInTime = swipeTime;
    } else if (direction === 'OutDirection') {
      if (!bucket.lastOutTime || swipeTime > bucket.lastOutTime) bucket.lastOutTime = swipeTime;
    }
  });

  // Aggregate per date-floor
  const dateFloorMap = new Map();
  bucketMap.forEach(bucket => {
    const { personId, name, personnelType, dateOnly, floor, firstInTime, lastOutTime } = bucket;
    const dfKey = `${dateOnly}__${floor}`;
    if (!dateFloorMap.has(dfKey)) {
      dateFloorMap.set(dfKey, { date: dateOnly, month: DateTime.fromISO(dateOnly).toFormat('LLLL'), floor, totalPersons: 0, inCount: 0, outCount: 0, inconsistentCount: 0, instances: [] });
    }
    const stats = dateFloorMap.get(dfKey);
    stats.totalPersons += 1;
    const hasIn  = Boolean(firstInTime);
    const hasOut = Boolean(lastOutTime);
    if (hasIn)  stats.inCount += 1;
    if (hasOut) stats.outCount += 1;
    if (!(hasIn && hasOut)) {
      stats.inconsistentCount += 1;
      stats.instances.push({ employeeId: personId, name, personnelType });
    }
  });

  const dailyFloorStats = [];
  dateFloorMap.forEach(stats => {
    const pct = stats.totalPersons > 0 ? (stats.inconsistentCount / stats.totalPersons) * 100 : 0;
    dailyFloorStats.push({ ...stats, inconsistencyPercentage: parseFloat(pct.toFixed(2)) });
  });

  // Floor-level aggregation
  const floorAgg = new Map();
  bucketMap.forEach(bucket => {
    const { floor, firstInTime, lastOutTime } = bucket;
    const isInconsistent = !(firstInTime && lastOutTime);
    if (!floorAgg.has(floor)) floorAgg.set(floor, { totalPersonDays: 0, inconsistentPersonDays: 0 });
    const fAgg = floorAgg.get(floor);
    fAgg.totalPersonDays += 1;
    if (isInconsistent) fAgg.inconsistentPersonDays += 1;
  });

  const floorInconsistency = [];
  floorAgg.forEach((vals, floor) => {
    const pct = vals.totalPersonDays > 0 ? (vals.inconsistentPersonDays / vals.totalPersonDays) * 100 : 0;
    floorInconsistency.push({ floor, ...vals, inconsistencyPercentage: parseFloat(pct.toFixed(2)) });
  });

  // Employee-level aggregation
  const empAgg = new Map();
  bucketMap.forEach(bucket => {
    const { personId, dateOnly, firstInTime, lastOutTime } = bucket;
    const isInconsistent = !(firstInTime && lastOutTime);
    if (!empAgg.has(personId)) empAgg.set(personId, { totalDaysSet: new Set(), inconsistentDaysSet: new Set() });
    const eAgg = empAgg.get(personId);
    eAgg.totalDaysSet.add(dateOnly);
    if (isInconsistent) eAgg.inconsistentDaysSet.add(dateOnly);
  });

  const employeeInconsistency = [];
  empAgg.forEach((vals, personId) => {
    const totalDays = vals.totalDaysSet.size;
    const inconsistentDays = vals.inconsistentDaysSet.size;
    const pct = totalDays > 0 ? (inconsistentDays / totalDays) * 100 : 0;
    employeeInconsistency.push({ employeeId: personId, totalDays, inconsistentDays, inconsistencyPercentage: parseFloat(pct.toFixed(2)) });
  });

  return { asOf: new Date().toISOString(), dailyFloorStats, floorInconsistency, employeeInconsistency };
}

// Controller endpoint
exports.getDenverInOutInconsistency = async (req, res) => {
  try {
    const events = await fetchHistoricalEventsChunked();
    const result = computeInOutInconsistency(events);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Error computing in/out inconsistency:', err);
    res.status(500).json({ error: 'Failed to compute in/out inconsistency' });
  }
};