PS C:\Users\W0024618\Desktop\emea-occupancy-backend> node server.js
🚀 Server running on port 3005
✅ MSSQL  connected
TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\tarn\dist\PendingOperation.js:17:27
    at runNextTicks (node:internal/process/task_queues:65:5)
    at listOnTimeout (node:internal/timers:549:9)
    at process.processTimers (node:internal/timers:523:7)
TimeoutError: operation timed out for an unknown reason
    at C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\tarn\dist\PendingOperation.js:17:27


how to slove above issu permentlay, not came again and again. 

require('dotenv').config();
const sql = require('mssql');

// Pull in and trim env-vars
const DB_USER     = (process.env.DB_USER     || '').trim();
const DB_PASSWORD = (process.env.DB_PASSWORD || '').trim();
const DB_SERVER   = (process.env.DB_SERVER   || '').trim();
const DB_DATABASE = (process.env.DB_DATABASE || '').trim();
const DB_PORT     = parseInt((process.env.DB_PORT || '').trim(), 10);

const dbConfig = {
  user: DB_USER,
  password: DB_PASSWORD,
  server: DB_SERVER,
  port: DB_PORT,
  database: DB_DATABASE,   // we keep it for compatibility, but not required for dynamic DB queries
  options: { 
    encrypt: false, 
    trustServerCertificate: true, 
    enableArithAbort: true 
  },
  pool: { 
    max: 10, 
    min: 0, 
    idleTimeoutMillis: 30000 
  },
  requestTimeout: 1800000,     // 30 minutes query timeout
  connectionTimeout: 60000    // 1 minute connection timeout
};

const poolPromise = sql.connect(dbConfig)
  .then(pool => {
    console.log('✅ MSSQL  connected');
    return pool;
  })
  .catch(err => {
    console.error('❌ MSSQL  connection failed', err);
    process.exit(1);
  });

module.exports = { sql, poolPromise };





// C:\Users\W0024618\Desktop\emea-occupancy-backend\src\controllers\occupancy.controller.js

const service = require('../services/occupancy.service');
const doorMap = require('../utils/doorMap');
const timezones = require('../utils/timezones');
//  const normalize  = name => name.trim();        // simple normalizer

const normalize = s =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')   // non-alphanum → space
    .replace(/\s+/g, ' ')          // collapse multi-spaces
    .trim();

/**
 * Returns true if this PersonnelType counts as Employee.
 * Everything else (including blank) counts as Contractor.
 */
function isEmployeeType(pt) {
  return pt === 'Employee'
    || pt === 'Terminated Employee'
    || pt === 'Terminated Personnel';
}

/**
 * Look up floor for a given record by matching door + partition.
 */

function lookupFloor(partition, door, direction, unmappedSet) {
  const normDoor = normalize(door);
  // 1) try exact (post-normalization)
  let entry = doorMap.find(d =>
    d.partition === partition &&
    normalize(d.door) === normDoor
  );
  // 2) fallback: partial match if exact fails
  if (!entry) {
    entry = doorMap.find(d =>
      d.partition === partition &&
      normalize(d.door).includes(normDoor)
    );
  }
  if (!entry) {
    unmappedSet.add(`${partition} | ${door}`);
    return null;
  }
  return direction === 'InDirection'
    ? entry.inDirectionFloor
    : entry.outDirectionFloor;
}

exports.getLiveOccupancy = async (req, res) => {
  try {
    const data = await service.fetchLiveOccupancy();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Live occupancy fetch failed' });
  }
};



// 📝📝📝📝📝 new code wiht time zone  ⬇️⬇️start

// 📝 Updated getLiveSummary — enforces partition-local "today" for both today + realtime
exports.getLiveSummary = async (req, res) => {
  try {
    const swipes = await service.fetchLiveOccupancy();

    // helper: returns YYYY-MM-DD for a given date in the partition's timezone
    function getLocalDateString(dateInput, partition) {
      const tz = timezones[partition] || 'UTC';
      try {
        const d = new Date(dateInput);
        return new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(d);
      } catch (e) {
        return new Date(dateInput).toISOString().slice(0, 10);
      }
    }

    // PRE-CALCULATE "today" per partition (so we don't call Intl repeatedly)
    const partitionToday = {};
    swipes.forEach(r => {
      const p = r.PartitionName2;
      if (!partitionToday[p]) {
        partitionToday[p] = getLocalDateString(new Date(), p);
      }
    });

    // --- 1) TODAY’S HEADCOUNT: first swipe per person but ONLY for swipes where
    // the swipe's partition-local date === that partition's current local date.
    // const filteredSwipesForToday = swipes.filter(r => {
    //   const p = r.PartitionName2;
    //   return getLocalDateString(r.LocaleMessageTime, p) === partitionToday[p];
    // });



    // --- 1) TODAY’S HEADCOUNT (only first IN swipe per Employee)
    const filteredSwipesForToday = swipes.filter(r => {
      const p = r.PartitionName2;
      // Only today's records AND only "InDirection" entries
      return (
        getLocalDateString(r.LocaleMessageTime, p) === partitionToday[p] &&
        r.Direction === 'InDirection'
      );
    });

    // const firstByPerson = {};
    // filteredSwipesForToday.forEach(r => {
    //   const prev = firstByPerson[r.PersonGUID];
    //   const t = new Date(r.LocaleMessageTime).getTime();
    //   if (!prev || t < new Date(prev.LocaleMessageTime).getTime()) {
    //     firstByPerson[r.PersonGUID] = r;
    //   }
    // });


    // ✅ use EmployeeID (fallback to GUID if missing)

    const firstByEmployee = {};
    filteredSwipesForToday.forEach(r => {
      const key = r.EmployeeID || r.PersonGUID;
      const prev = firstByEmployee[key];
      const t = new Date(r.LocaleMessageTime).getTime();
      if (!prev || t < new Date(prev.LocaleMessageTime).getTime()) {
        firstByEmployee[key] = r;
      }
    });


    const todayRecs = Object.values(firstByEmployee);
    const today = { total: 0, Employee: 0, Contractor: 0 };
    todayRecs.forEach(r => {
      today.total++;
      if (isEmployeeType(r.PersonnelType)) today.Employee++;
      else today.Contractor++;
    });




    // const todayRecs = Object.values(firstByPerson);
    // const today = { total: 0, Employee: 0, Contractor: 0 };
    // todayRecs.forEach(r => {
    //   today.total++;
    //   if (isEmployeeType(r.PersonnelType)) today.Employee++;
    //   else today.Contractor++;
    // });

    // --- 2) REALTIME: build lastByPerson, but only from swipes that are on the partition's LOCAL "today".
    // This removes partitions that only have older swipes.
    const lastByPerson = {};
    swipes.forEach(r => {
      const p = r.PartitionName2;
      // skip any swipe that is NOT on this partition's current local date
      if (getLocalDateString(r.LocaleMessageTime, p) !== partitionToday[p]) return;

      const prev = lastByPerson[r.PersonGUID];
      const t = new Date(r.LocaleMessageTime).getTime();
      if (!prev || t > new Date(prev.LocaleMessageTime).getTime()) {
        lastByPerson[r.PersonGUID] = r;
      }
    });

    // Build realtime counts only from the filtered lastByPerson
    const realtime = {};
    const unmappedDoors = new Set();

    Object.values(lastByPerson).forEach(r => {
      const rawFloor = lookupFloor(r.PartitionName2, r.Door, r.Direction, unmappedDoors);
      const floorNorm = rawFloor ? String(rawFloor).trim().toLowerCase() : '';

      // STRICT: drop 'Out of office' from realtime details and counts
      if (floorNorm === 'out of office') return;

      const p = r.PartitionName2;
      if (!realtime[p]) {
        realtime[p] = { total: 0, Employee: 0, Contractor: 0, floors: {} };
      }

      realtime[p].total++;
      if (isEmployeeType(r.PersonnelType)) realtime[p].Employee++;
      else realtime[p].Contractor++;

      const normFloorLabel = rawFloor ? String(rawFloor).trim() : 'Unmapped';
      realtime[p].floors[normFloorLabel] = (realtime[p].floors[normFloorLabel] || 0) + 1;
    });

    if (unmappedDoors.size) {
      console.warn('Unmapped doors:\n' + Array.from(unmappedDoors).join('\n'));
    }

    // details: use the filtered lastByPerson values (and drop Out of office)
    const details = Object.values(lastByPerson)
      .map(r => {
        const rawFloor = lookupFloor(r.PartitionName2, r.Door, r.Direction, unmappedDoors);
        const floor = rawFloor ? String(rawFloor).trim() : null;
        return { ...r, Floor: floor };
      })
      .filter(d => {
        const f = d.Floor;
        return !(f && String(f).trim().toLowerCase() === 'out of office');
      });

    return res.json({
      success: true,
      today,
      realtime,
      details
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Live summary failed' });
  }
};

// 📝📝📝📝📝📝new code wiht time zone end




exports.getHistoricalOccupancy = async (req, res) => {
  const location = req.params.location || null;
  try {
    const raw = await service.fetchHistoricalOccupancy(location);

    // first swipe per person per date
    const byDate = raw.reduce((acc, r) => {
      const iso = (r.LocaleMessageTime instanceof Date)
        ? r.LocaleMessageTime.toISOString()
        : r.LocaleMessageTime;
      const date = iso.slice(0, 10);
      acc[date] = acc[date] || {};
      const prev = acc[date][r.PersonGUID];
      if (!prev || new Date(iso) < new Date(prev.LocaleMessageTime)) {
        acc[date][r.PersonGUID] = { ...r, LocaleMessageTime: iso };
      }
      return acc;
    }, {});

    const summaryByDate = [];
    const details = [];

    Object.keys(byDate).sort().forEach(date => {
      const recs = Object.values(byDate[date]);
      details.push(...recs);

      // initialize counts
      const regionCounts = { total: 0, Employee: 0, Contractor: 0 };
      const partitionCounts = {};

      recs.forEach(r => {
        regionCounts.total++;
        if (isEmployeeType(r.PersonnelType)) regionCounts.Employee++;
        else regionCounts.Contractor++;

        if (!location) {
          const p = r.PartitionName2;
          if (!partitionCounts[p]) {
            partitionCounts[p] = { total: 0, Employee: 0, Contractor: 0 };
          }
          partitionCounts[p].total++;
          if (isEmployeeType(r.PersonnelType)) partitionCounts[p].Employee++;
          else partitionCounts[p].Contractor++;
        }
      });

      summaryByDate.push({
        date,
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
        region: location
          ? { name: location, ...regionCounts }
          : { name: 'EMEA', ...regionCounts },
        partitions: location ? undefined : partitionCounts
      });
    });

    return res.json({ success: true, summaryByDate, details });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Historical fetch failed' });
  }
};












//C:\Users\W0024618\Desktop\emea-occupancy-backend\src\services\occupancy.service.js
const { poolPromise, sql } = require('../config/db');

/**
 * EMEA partition list
 */
const partitionList = [
  'AUT.Vienna',
  'DU.Abu Dhab',
  'IE.Dublin',
  'IT.Rome',
  'LT.Vilnius',
  'MA.Casablanca',
  'RU.Moscow',
  'UK.London',
  'ES.Madrid'
];


/**
 * Live occupancy (today)
 */
exports.fetchLiveOccupancy = async () => {
  const pool = await poolPromise;
  const partitionsSql = partitionList.map(p => `'${p.replace("'", "''")}'`).join(',');

const query = `
  WITH CombinedQuery AS (
    SELECT
      DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
      t1.ObjectName1,
      t1.ObjectName2            AS Door,
      CASE
        WHEN t3.Name IN ('Contractor','Terminated Contractor')
          THEN t2.Text12
        ELSE CAST(t2.Int1 AS NVARCHAR)
      END                       AS EmployeeID,
      t2.text5                  AS Text5,
      t1.PartitionName2         AS PartitionName2,
      t1.ObjectIdentity1        AS PersonGUID,
      t3.Name                   AS PersonnelType,
      t2.Text4                   AS CompanyName,   -- ✅ company
      t2.Text5                   AS PrimaryLocation, -- ✅ location
      COALESCE(
        TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
        TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
        sc.value
      )                         AS CardNumber,
      t5a.value                 AS AdmitCode,
      t5d.value                 AS Direction
    FROM [ACVSUJournal_00011029].[dbo].[ACVSUJournalLog] AS t1
    LEFT JOIN [ACVSCore].[Access].[Personnel]     AS t2
      ON t1.ObjectIdentity1 = t2.GUID
    LEFT JOIN [ACVSCore].[Access].[PersonnelType] AS t3
      ON t2.PersonnelTypeId = t3.ObjectID
    LEFT JOIN [ACVSUJournal_00011029].[dbo].[ACVSUJournalLogxmlShred] AS t5a
      ON t1.XmlGUID = t5a.GUID AND t5a.Name = 'AdmitCode'
    LEFT JOIN [ACVSUJournal_00011029].[dbo].[ACVSUJournalLogxmlShred] AS t5d
      ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')
    LEFT JOIN [ACVSUJournal_00011029].[dbo].[ACVSUJournalLogxml] AS t_xml
      ON t1.XmlGUID = t_xml.GUID
    LEFT JOIN (
      SELECT GUID, value
      FROM [ACVSUJournal_00011029].[dbo].[ACVSUJournalLogxmlShred]
      WHERE Name IN ('Card','CHUID')
    ) AS sc
      ON t1.XmlGUID = sc.GUID
    WHERE
      t1.MessageType = 'CardAdmitted'
      AND t1.PartitionName2 IN (${partitionsSql})
      AND DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) >= DATEADD(HOUR, -48, GETDATE())
  )
  SELECT
    LocaleMessageTime,
    CONVERT(VARCHAR(10), LocaleMessageTime, 23) AS Dateonly,
    CONVERT(VARCHAR(8), LocaleMessageTime, 108) AS Swipe_Time,
    EmployeeID,
    PersonGUID,
    ObjectName1,
    Door,
    PersonnelType,
    CardNumber,
    Text5,
    PartitionName2,
    AdmitCode,
    Direction,
    CompanyName,
    PrimaryLocation
  FROM CombinedQuery
  ORDER BY LocaleMessageTime ASC;
`;

  const result = await pool.request().query(query);
  return result.recordset;
};

/**
 * Core raw‐data fetch for the past N days, all or by location.
 */
exports.fetchHistoricalData = async ({ days = 7, location = null }) => {
  const pool = await poolPromise;
  const partitionsSql = partitionList.map(p => `'${p.replace("'", "''")}'`).join(',');
  const locationFilter = location
    ? `AND t1.PartitionName2 = @location`
    : `AND t1.PartitionName2 IN (${partitionsSql})`;

  const query = `
    WITH Hist AS (
      SELECT
        DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
        t1.ObjectName1,
        t1.ObjectName2       AS Door,
        CASE
          WHEN t3.Name IN ('Contractor','Terminated Contractor') THEN t2.Text12
          ELSE CAST(t2.Int1 AS NVARCHAR)
        END                   AS EmployeeID,
        t2.text5             AS Text5,
        t1.PartitionName2    AS PartitionName2,
        t1.ObjectIdentity1   AS PersonGUID,
        t3.Name              AS PersonnelType,
        t2.Text4                   AS CompanyName,   -- ✅ company
     t2.Text5                   AS PrimaryLocation, -- ✅ location
        COALESCE(
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
          sc.value
        )                     AS CardNumber,
        t5a.value            AS AdmitCode,
        t5d.value            AS Direction,
        CONVERT(DATE, DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC)) AS SwipeDate
      FROM [ACVSUJournal_00011029].[dbo].[ACVSUJournalLog] AS t1
      LEFT JOIN [ACVSCore].[Access].[Personnel]     AS t2
        ON t1.ObjectIdentity1 = t2.GUID
      LEFT JOIN [ACVSCore].[Access].[PersonnelType] AS t3
        ON t2.PersonnelTypeId = t3.ObjectID
      LEFT JOIN [ACVSUJournal_00011029].[dbo].[ACVSUJournalLogxmlShred] AS t5a
        ON t1.XmlGUID = t5a.GUID AND t5a.Name = 'AdmitCode'
      LEFT JOIN [ACVSUJournal_00011029].[dbo].[ACVSUJournalLogxmlShred] AS t5d
        ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')
      LEFT JOIN [ACVSUJournal_00011029].[dbo].[ACVSUJournalLogxml] AS t_xml
        ON t1.XmlGUID = t_xml.GUID
      LEFT JOIN (
        SELECT GUID, value
        FROM [ACVSUJournal_00011029].[dbo].[ACVSUJournalLogxmlShred]
        WHERE Name IN ('Card','CHUID')
      ) AS sc
        ON t1.XmlGUID = sc.GUID
      WHERE
        t1.MessageType = 'CardAdmitted'
        ${locationFilter}
        AND CONVERT(DATE, DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC))
            >= DATEADD(DAY, -${days}, CONVERT(DATE, GETDATE()))
    )
    SELECT *
    FROM Hist
    ORDER BY LocaleMessageTime ASC;
  `;

  const req = pool.request();
  if (location) req.input('location', sql.NVarChar, location);
  const result = await req.query(query);
  return result.recordset;
};

/**
 * Public wrapper: always last 7 days, all or by location.
 */
exports.fetchHistoricalOccupancy = async (location) => {
  return exports.fetchHistoricalData({ days: 7, location: location || null });
};

module.exports.partitionList = partitionList;
































