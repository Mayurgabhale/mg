know i want ot use time zone.
why i wnat ot use this,
  because when in this all region when start new day. that time count not update.
  they show priviuse count. i wan to use timezone to udpate count when state new day,ok

and listin in this dont chane anythikg. this code is fully woringk. ok, 
  in this dont chagne anythig priviuse. just update this ok 
  http://localhost:3005/api/occupancy/live-summary
this count 
{
    "success": true,
    "today": {
        "total": 804,
        "Employee": 768,
        "Contractor": 36
    },
  ***********
C:\Users\W0024618\Desktop\emea-occupancy-backend\src\utils\timezones.js

module.exports = {
  'AUT.Vienna':       'Europe/Vienna',
  'DU.Abu Dhab':      'Asia/Dubai',
  'IE.Dublin':        'Europe/Dublin',
  'IT.Rome':          'Europe/Rome',
  'LT.Vilnius':       'Europe/Vilnius',
  'MA.Casablanca':    'Africa/Casablanca',
  'RU.Moscow':        'Europe/Moscow',
  'UK.London':        'Europe/London',
  'ES.Madrid':        'Europe/Madrid',
};
---------------------

  // C:\Users\W0024618\Desktop\emea-occupancy-backend\src\controllers\occupancy.controller.js

const service = require('../services/occupancy.service');
 const doorMap = require('../utils/doorMap'); 
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


exports.getLiveSummary = async (req, res) => {
  try {
    const swipes = await service.fetchLiveOccupancy();

    // 1. TODAY’S HEADCOUNT: first swipe per person
    const firstByPerson = {};
    swipes.forEach(r => {
      const prev = firstByPerson[r.PersonGUID];
      const t = new Date(r.LocaleMessageTime).getTime();
      if (!prev || t < new Date(prev.LocaleMessageTime).getTime()) {
        firstByPerson[r.PersonGUID] = r;
      }
    });
    const todayRecs = Object.values(firstByPerson);
    const today = { total: 0, Employee: 0, Contractor: 0 };
    todayRecs.forEach(r => {
      today.total++;
      if (isEmployeeType(r.PersonnelType)) today.Employee++;
      else today.Contractor++;
    });

    // 2. REAL-TIME: last swipe per person
    const lastByPerson = {};
    swipes.forEach(r => {
      const prev = lastByPerson[r.PersonGUID];
      const t = new Date(r.LocaleMessageTime).getTime();
      if (!prev || t > new Date(prev.LocaleMessageTime).getTime()) {
        lastByPerson[r.PersonGUID] = r;
      }
    });

    const realtime = {};
    const unmappedDoors = new Set();

    Object.values(lastByPerson).forEach(r => {
      // Resolve floor up-front (this will also populate unmappedDoors if necessary)
      const rawFloor = lookupFloor(r.PartitionName2, r.Door, r.Direction, unmappedDoors);
      const floorNorm = rawFloor ? String(rawFloor).trim().toLowerCase() : '';

      // STRICT RULE: if resolved Floor equals "Out of office" -> skip counting
      if (floorNorm === 'out of office') {
        return;
      }

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

    // Build enriched details array, but filter out any whose resolved Floor is "Out of office"
    const details = Object.values(lastByPerson)
      .map(r => {
        const rawFloor = lookupFloor(r.PartitionName2, r.Door, r.Direction, unmappedDoors);
        const floor = rawFloor ? String(rawFloor).trim() : null;
        return {
          ...r,
          Floor: floor
        };
      })
      // Strictly remove records whose Floor is "Out of office"
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



exports.getHistoricalOccupancy = async (req, res) => {
  const location = req.params.location || null;
  try {
    const raw = await service.fetchHistoricalOccupancy(location);

    // first swipe per person per date
    const byDate = raw.reduce((acc, r) => {
      const iso = (r.LocaleMessageTime instanceof Date)
        ? r.LocaleMessageTime.toISOString()
        : r.LocaleMessageTime;
      const date = iso.slice(0,10);
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
        day: new Date(date).toLocaleDateString('en-US', { weekday:'long' }),
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

--------------------------------
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
        AND CONVERT(DATE, DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC))
            = CONVERT(DATE, GETDATE())
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

