Read below boht files carefullym and slove this issueok 
careuflly, 
  ⚠️ Missing LocaleMessageTime for record: undefined
⚠️ Missing LocaleMessageTime for record: undefined
⚠️ Missing LocaleMessageTime for record: undefined
⚠️ Missing LocaleMessageTime for record: undefined
⚠️ Missing LocaleMessageTime for record: undefined

http://localhost:3007/api/occupancy/history
{
  "success": true,
  "summaryByDate": [],
  "details": []
}
***************************
  

//C:\Users\W0024618\Desktop\apac-occupancy-backend\src\controllers\occupancy.controller.js

const service = require('../services/occupancy.service');

const {
  doorMap,
  normalizedDoorZoneMap,
  doorZoneMap,
  zoneFloorMap,
  normalizeDoorName
} = require('../utils/doorMap');


function isEmployeeType(pt) {
  return ['Employee', 'Terminated Employee', 'Terminated Personnel'].includes(pt);
}


function lookupFloor(partition, rawDoor, direction, unmapped) {
  const norm = normalizeDoorName(rawDoor);
  const key = `${norm}___${direction}`;

  // 1) Try normalized lookup
  const zone = normalizedDoorZoneMap[key];
  if (zone) {
    const f = zoneFloorMap[zone];
    // if zone has a known floor -> return it
    if (f) return f;
    // zone exists but has no floor (e.g. "Out of office") -> treat as known but Unknown floor
    // return immediately to avoid falling back to per-partition doorMap and marking as unmapped
    return 'Unknown';
  }




  // 2) Fallback to per-partition doorMap
  const entry = doorMap.find(d =>
    d.normalizedDoor === norm && d.partition === partition
  );
  if (entry) {
    const fl = direction === 'InDirection'
      ? entry.inDirectionFloor
      : entry.outDirectionFloor;
    if (fl) return fl;
  }

  // 3) Nothing matched → record & return Unknown
  unmapped.add(`${partition}|${rawDoor}`);
  return 'Unknown';
}



function mapDoorToZone(rawDoor, rawDir) {
  const key = normalizeDoorName(rawDoor) + '___' + (rawDir === 'InDirection' ? 'InDirection' : 'OutDirection');
  const zone = normalizedDoorZoneMap[key];
  if (!zone) return 'Unknown Zone';
  // for OutDirection that aren’t true “Out of office”, strip trailing “ Zone”
  if (rawDir === 'OutDirection' && zone !== 'Out of office') {
    return zone.replace(/\s+Zone$/i, '');
  }
  return zone;
}



exports.getLiveOccupancy = async (req, res) => {
  try {
    const data = await service.fetchLiveOccupancy();
    res.json({ success: true, count: data.length, data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Live fetch failed' });
  }
};

exports.getLiveSummary = async (req, res) => {
  try {
    const swipes = await service.fetchLiveOccupancy();

    // first swipe per person = TODAY
    const first = {};
    swipes.forEach(r => {
      const t = new Date(r.LocaleMessageTime).getTime();
      if (!first[r.PersonGUID] || t < new Date(first[r.PersonGUID].LocaleMessageTime).getTime()) {
        first[r.PersonGUID] = r;
      }
    });
    const today = { total: 0, Employee: 0, Contractor: 0 };
    Object.values(first).forEach(r => {
      today.total++;
      if (isEmployeeType(r.PersonnelType)) today.Employee++;
      else today.Contractor++;
    });

    // last swipe per person for realtime
    const last = {};
    swipes.forEach(r => {
      const t = new Date(r.LocaleMessageTime).getTime();
      if (!last[r.PersonGUID] || t > new Date(last[r.PersonGUID].LocaleMessageTime).getTime()) {
        last[r.PersonGUID] = r;
      }
    });

    const realtime = {};
    const unmapped = new Set();


    const enriched = Object.values(last).map(r => {
      // determine zone (try normalized lookup + fallback)
      const zone = mapDoorToZone(r.Door, r.Direction);

      // lookupFloor returns 'Unknown' for unmapped (and adds to unmapped set)
      const floor = lookupFloor(r.PartitionName2, r.Door, r.Direction, unmapped);

      return {
        ...r,
        // keep Unknown Zone as null, keep actual zone strings (including "Out of office")
        Zone: zone === 'Unknown Zone' ? null : zone,
        Floor: floor === 'Unknown' ? null : floor

      };
    });

    // Strictly remove "Out of office" records from details (and from counting below)
    const details = enriched.filter(r => r.Zone !== 'Out of office');

    // Counting loop (keeps Pune special logic but enforces strict drop on "Out of office")
    Object.values(last).forEach(r => {
      const p = r.PartitionName2;

      // determine zone again for each record (use mapDoorToZone to be consistent)
      const zoneRaw = mapDoorToZone(r.Door, r.Direction);

      // STRICT RULE: if zone resolved to exact "Out of office" -> skip counting
      if (zoneRaw === 'Out of office') return;

      // Unknown keys → drop
      if (zoneRaw === 'Unknown Zone') return;

      // ensure bucket exists when we decide to count
      const ensureBucket = (part) => {
        if (!realtime[part]) realtime[part] = { total: 0, Employee: 0, Contractor: 0, floors: {}, zones: {} };
      };


      if (r.Direction === 'OutDirection') {
        // allow certain valid OutDirection zones (Assembly Area, Reception Area, ...)
        const allowedOutZones = new Set(['Assembly Area', 'Reception Area']);
        if (!zoneRaw.endsWith('Outer Area') && !allowedOutZones.has(zoneRaw)) {
          return;
        }

        // safe to count
        ensureBucket(p);
        realtime[p].total++;
        if (isEmployeeType(r.PersonnelType)) realtime[p].Employee++;
        else realtime[p].Contractor++;

        // floor bucket
        const fl = lookupFloor(p, r.Door, r.Direction, unmapped);
        if (fl !== 'Unknown') {
          realtime[p].floors[fl] = (realtime[p].floors[fl] || 0) + 1;
        }

        // zone bucket (clean trailing " Zone" for OutDirection cases where appropriate)
        const z = (r.Direction === 'OutDirection' && zoneRaw !== 'Out of office')
          ? zoneRaw.replace(/\s+Zone$/i, '')
          : zoneRaw;
        if (z) realtime[p].zones[z] = (realtime[p].zones[z] || 0) + 1;

        return;
      }

      // ── All other partitions (existing logic) ──
      // fallback logic to determine zone (keeps previous behaviour if normalized lookup not present)
      const normKey = normalizeDoorName(r.Door) + '___' + r.Direction;
      let zone = normalizedDoorZoneMap[normKey];
      if (!zone) {
        const entry = doorMap.find(d =>
          d.normalizedDoor === normalizeDoorName(r.Door) &&
          d.partition === p
        );
        zone = entry
          ? (r.Direction === 'InDirection'
            ? normalizedDoorZoneMap[`${entry.normalizedDoor}___InDirection`]
            : normalizedDoorZoneMap[`${entry.normalizedDoor}___OutDirection`])
          : null;
      }

      // if resolved zone (via fallback) is "Out of office" → skip (strict)
      if (zone === 'Out of office') return;
      if (!zone && zone !== null) {
        // keep going — zone could be null if no mapping found, but Unknown Zone was handled above
      }

      // ok to count
      ensureBucket(p);
      realtime[p].total++;
      if (isEmployeeType(r.PersonnelType)) realtime[p].Employee++;
      else realtime[p].Contractor++;

      const fl = lookupFloor(p, r.Door, r.Direction, unmapped);
      if (fl !== 'Unknown') {
        realtime[p].floors[fl] = (realtime[p].floors[fl] || 0) + 1;
      }

      const z = zone ? (r.Direction === 'OutDirection' && zone !== 'Out of office' ? zone.replace(/\s+Zone$/i, '') : zone) : null;
      if (z) realtime[p].zones[z] = (realtime[p].zones[z] || 0) + 1;
    });

    // Log to server console for quick dev feedback:
    if (unmapped.size) console.warn('Unmapped doors:', Array.from(unmapped));

    res.json({
      success: true,
      today,
      realtime,
      // expose the raw list of partition|door keys that had no mapping:
      unmapped: Array.from(unmapped),
      details    // enriched details with Zone & Floor, with "Out of office" removed
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Summary failed' });
  }
};





//C:\Users\W0024618\Desktop\apac-occupancy-backend\src\controllers\occupancy.controller.js

exports.getHistoricalOccupancy = async (req, res) => {
  const location = req.params.location || null;
  try {
    // 1) Pull in rows — each now has non-null PartitionNameFriendly
    const raw = await service.fetchHistoricalOccupancy(location);

    // 2) Dedupe to first swipe per person per day
    // const byDate = raw.reduce((acc, r) => {
    //   // force into a "YYYY-MM-DD" string
    //   const date = new Date(r.LocaleMessageTime).toISOString().slice(0, 10);
    //   acc[date] = acc[date] || {};
    //   if (
    //     !acc[date][r.PersonGUID] ||
    //     new Date(r.LocaleMessageTime) < new Date(acc[date][r.PersonGUID].LocaleMessageTime)
    //   ) {
    //     acc[date][r.PersonGUID] = r;
    //   }
    //   return acc;
    // }, {});


    // //// ⬇️⬇️⬇️⬇️⬇️ add mayur 

   const byDate = raw.reduce((acc, r) => {
  if (!r.LocaleMessageTime) {
    console.warn('⚠️ Missing LocaleMessageTime for record:', r.PersonGUID);
    return acc; // skip missing times
  }

  const d = new Date(r.LocaleMessageTime);
  if (isNaN(d.getTime())) {
    console.warn('⚠️ Invalid LocaleMessageTime:', r.LocaleMessageTime, r.PersonGUID);
    return acc;
  }

  const date = d.toISOString().slice(0, 10);

  acc[date] = acc[date] || {};
  if (
    !acc[date][r.PersonGUID] ||
    d < new Date(acc[date][r.PersonGUID].LocaleMessageTime)
  ) {
    acc[date][r.PersonGUID] = r;
  }
  return acc;
}, {});




    const summaryByDate = [];
    const details = [];

    // 3) Build summaries
    Object.keys(byDate).sort().forEach(date => {
      const recs = Object.values(byDate[date]);
      details.push(...recs);

      // region totals
      const region = { total: 0, Employee: 0, Contractor: 0 };
      // per-partition buckets
      const partitions = {};

      recs.forEach(r => {
        // increment region
        region.total++;
        if (isEmployeeType(r.PersonnelType)) region.Employee++;
        else region.Contractor++;

        // only build partitions if we're not filtering to a single location
        if (!location) {
          // use the friendly name (guaranteed non-null!), with fallback
          const key = r.PartitionNameFriendly || 'APAC.Default';
          if (!partitions[key]) {
            partitions[key] = { total: 0, Employee: 0, Contractor: 0 };
          }
          partitions[key].total++;
          if (isEmployeeType(r.PersonnelType)) partitions[key].Employee++;
          else partitions[key].Contractor++;
        }
      });

      summaryByDate.push({
        date,
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
        region: location
          ? { name: location, ...region }
          : { name: 'APAC', ...region },
        // if location is provided, you can still emit an empty object (`{}`) or skip:
        partitions: location ? {} : partitions
      });
    });

    // 4) Return
    res.json({ success: true, summaryByDate, details });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Historical failed' });
  }
};




//C:\Users\W0024618\Desktop\apac-occupancy-backend\src\services\occupancy.service.js

const { poolPromise, sql } = require('../config/db');

const partitionList = [
  'APAC.Default',
  'JP.Tokyo',
  'PH.Manila',
  'MY.Kuala Lumpur',
  'IN.Pune',
  'IN.HYD'
];



function quoteList(arr) {
  return arr.map(p => `'${p.replace("'", "''")}'`).join(',');
}

/**
 * Live occupancy (today) for APAC
 */
exports.fetchLiveOccupancy = async () => {
  const pool = await poolPromise;
  const parts = quoteList(partitionList);

  const query = `

    WITH CombinedEmployeeData AS (
      SELECT
        t1.ObjectName1,
        t1.ObjectName2             AS Door,               -- include Door
        CASE WHEN t2.Int1 = 0 THEN t2.Text12 ELSE CAST(t2.Int1 AS NVARCHAR) END AS EmployeeID,
        t3.Name                    AS PersonnelType,
        t1.ObjectIdentity1         AS PersonGUID,
        -- extract CardNumber from XML or shred table
        COALESCE(
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
          sc.value
        )                          AS CardNumber,
        CASE
          WHEN t1.ObjectName2 LIKE 'APAC_PI%' THEN 'Taguig City'
          WHEN t1.ObjectName2 LIKE 'APAC_PH%' THEN 'Quezon City'
          WHEN t1.ObjectName2 LIKE '%PUN%'   THEN 'Pune'
          WHEN t1.ObjectName2 LIKE 'APAC_JPN%' THEN 'JP.Tokyo'
          WHEN t1.ObjectName2 LIKE 'APAC_MY%'  THEN 'MY.Kuala Lumpur'
          WHEN t1.ObjectName2 LIKE 'IN.HYD%'  THEN 'IN.HYD'
          ELSE t1.PartitionName2
        END                        AS PartitionName2,
        DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
        t5d.value                  AS Direction,
        t2.Text4                   AS CompanyName,        -- ✅ added
        t2.Text5                   AS PrimaryLocation     -- ✅ added
      FROM ACVSUJournal_00010029.dbo.ACVSUJournalLog t1
      JOIN ACVSCore.Access.Personnel       t2 ON t1.ObjectIdentity1 = t2.GUID
      JOIN ACVSCore.Access.PersonnelType   t3 ON t2.PersonnelTypeID = t3.ObjectID

      LEFT JOIN ACVSUJournal_00010029.dbo.ACVSUJournalLogxmlShred t5d
      ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')

      LEFT JOIN ACVSUJournal_00010029.dbo.ACVSUJournalLogxml t_xml
        ON t1.XmlGUID = t_xml.GUID
      LEFT JOIN (
        SELECT GUID, value
        FROM ACVSUJournal_00010029.dbo.ACVSUJournalLogxmlShred
        WHERE Name IN ('Card','CHUID')
      ) AS sc
        ON t1.XmlGUID = sc.GUID
      WHERE
        t1.MessageType = 'CardAdmitted'
        AND t1.PartitionName2 IN (${parts})
        AND CONVERT(DATE, DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC))
            = CONVERT(DATE, GETDATE())
    ), Ranked AS (
      SELECT *,
        ROW_NUMBER() OVER (PARTITION BY PersonGUID ORDER BY LocaleMessageTime DESC) AS rn
      FROM CombinedEmployeeData
      
    )
    SELECT
      ObjectName1,
      Door,                            -- door
      PersonnelType,
      EmployeeID,
      CardNumber,                      -- now returned
      PartitionName2,
      LocaleMessageTime,
      Direction,
      PersonGUID,
      CompanyName,                      -- ✅ added
      PrimaryLocation                   -- ✅ added
    FROM Ranked
    WHERE rn = 1;
  `;

  const result = await pool.request().query(query);
  return result.recordset;
};




exports.fetchHistoricalOccupancy = async (location) =>
  exports.fetchHistoricalData({ location: location || null });

exports.fetchHistoricalData = async ({ location = null }) => {
  const pool = await poolPromise;

  // 1. Get all ACVSUJournal_* database names dynamically
  const dbResult = await pool.request().query(`
    SELECT name 
    FROM sys.databases
    WHERE name LIKE 'ACVSUJournal[_]%'
    ORDER BY CAST(REPLACE(name, 'ACVSUJournal_', '') AS INT)
  `);

  // Map DBs and pick last 2 only
  const databases = dbResult.recordset.map(r => r.name);
  const selectedDbs = databases.slice(-2); // newest and previous

  if (selectedDbs.length === 0) {
    throw new Error("No ACVSUJournal_* databases found.");
  }

  // 2. Outer filter
  const outerFilter = location
    ? `WHERE PartitionNameFriendly = @location`
    : `WHERE PartitionNameFriendly IN (${quoteList([
        'Pune','Quezon City','JP.Tokyo','MY.Kuala Lumpur','Taguig City','IN.HYD'
      ])})`;

  // 3. Build UNION ALL query across selected DBs only



  const unionQueries = selectedDbs.map(db => `
    SELECT
      DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
      t1.ObjectName1,
      t1.ObjectName2               AS Door,
      CASE WHEN t2.Int1 = 0 THEN t2.Text12 ELSE CAST(t2.Int1 AS NVARCHAR) END AS EmployeeID,
      t3.Name                      AS PersonnelType,
      t1.ObjectIdentity1           AS PersonGUID,
     t2.Text4                   AS CompanyName,   -- ✅ company
     t2.Text5                   AS PrimaryLocation, -- ✅ location
      COALESCE(
        CASE
          WHEN t1.ObjectName2 LIKE 'APAC_PI%'   THEN 'Taguig City'
          WHEN t1.ObjectName2 LIKE 'APAC_PH%'   THEN 'Quezon City'
          WHEN t1.ObjectName2 LIKE '%PUN%'      THEN 'Pune'
          WHEN t1.ObjectName2 LIKE 'APAC_JPN%'  THEN 'JP.Tokyo'
          WHEN t1.ObjectName2 LIKE 'APAC_MY%'   THEN 'MY.Kuala Lumpur'
          WHEN t1.ObjectName2 LIKE 'IN.HYD%'   THEN 'IN.HYD'
          ELSE t1.PartitionName2
        END,
        'APAC.Default'
      ) AS PartitionNameFriendly,


      
      COALESCE(
        TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
        TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
        sc.value
      ) AS CardNumber,
      t5d.value AS Direction
    FROM ${db}.dbo.ACVSUJournalLog t1
    JOIN ACVSCore.Access.Personnel       t2 ON t1.ObjectIdentity1 = t2.GUID
    JOIN ACVSCore.Access.PersonnelType   t3 ON t2.PersonnelTypeID = t3.ObjectID

    LEFT JOIN ${db}.dbo.ACVSUJournalLogxmlShred t5d
      ON t1.XmlGUID = t5d.GUID 
      AND t5d.Value IN ('InDirection','OutDirection')

    LEFT JOIN ${db}.dbo.ACVSUJournalLogxml t_xml
      ON t1.XmlGUID = t_xml.GUID

    LEFT JOIN (
      SELECT GUID, value
      FROM ${db}.dbo.ACVSUJournalLogxmlShred
      WHERE Name IN ('Card','CHUID')
    ) AS sc
      ON t1.XmlGUID = sc.GUID
    WHERE t1.MessageType = 'CardAdmitted'
  `).join('\nUNION ALL\n');




////////////////////////////


//Abhishek//


const query = `
  WITH CombinedEmployeeData AS (
    -- As before
    SELECT
        t1.[ObjectName1] AS EmployeeName,
        CASE WHEN t2.[Int1] = 0 THEN t2.[Text12] ELSE CAST(t2.[Int1] AS NVARCHAR) END AS EmployeeID,
        t3.[Name] AS PersonnelType,
        DATEADD(MINUTE, -1 * t1.[MessageLocaleOffset], t1.[MessageUTC]) AS LocaleMessageTime,
        CASE
            WHEN t1.[PartitionName2] IN ('US.CO.OBS', 'USA/Canada Default') THEN 'HQ'
            ELSE t1.[PartitionName2]
        END AS Location
    FROM [ACVSUJournal_00010028].[dbo].[ACVSUJournalLog] AS t1
    INNER JOIN [ACVSCore].[Access].[Personnel] AS t2
        ON t1.ObjectIdentity1 = t2.GUID
    INNER JOIN [ACVSCore].[Access].[PersonnelType] AS t3
        ON t2.[PersonnelTypeID] = t3.[ObjectID]
),
SwipeSequence AS (
    SELECT
        EmployeeName,
        EmployeeID,
        PersonnelType,
        Location,
        LocaleMessageTime,
        LAG(LocaleMessageTime) OVER (PARTITION BY EmployeeID ORDER BY LocaleMessageTime) AS PrevTime,
        CONVERT(DATE, LocaleMessageTime) AS SwipeDate
    FROM CombinedEmployeeData
),
ShiftBoundaryDetection AS (
    SELECT
        EmployeeName,
        EmployeeID,
        PersonnelType,
        Location,
        LocaleMessageTime,
        SwipeDate,
        CASE WHEN PrevTime IS NULL THEN 1 ELSE 0 END AS IsFirstSwipe,
        -- Large gap (>6 hours, or >16 hours for same-day)
        CASE WHEN DATEDIFF(MINUTE, PrevTime, LocaleMessageTime) > 360 THEN 1 ELSE 0 END AS IsLargeGap,
        -- Is previous swipe on a different calendar day, or did the night pass?
        -- If so, "MaybeDailyReset" -- needs more logic below.
        CASE
            WHEN CONVERT(DATE, PrevTime) = CONVERT(DATE, LocaleMessageTime)
                AND DATEDIFF(MINUTE, PrevTime, LocaleMessageTime) > 960 THEN 1
            WHEN CONVERT(DATE, PrevTime) < CONVERT(DATE, LocaleMessageTime) THEN 1
            ELSE 0
        END AS MaybeDailyReset,
        -- Is this a night shift spanning midnight?
        -- If PrevTime on previous date, LocaleMessageTime early next day, and gap is "reasonable" (e.g., <3hrs), treat as same shift
        CASE
            WHEN PrevTime IS NULL THEN 0
            WHEN CONVERT(DATE, PrevTime) < CONVERT(DATE, LocaleMessageTime)
                AND DATEDIFF(MINUTE, PrevTime, LocaleMessageTime) <= 360  -- Up to 3 hours allowed
                AND CAST(PrevTime AS TIME) >= '20:00:00'                  -- Previous swipe late in the day
                AND CAST(LocaleMessageTime AS TIME) <= '09:00:00'         -- Next swipe early morning
                THEN 1                                                    -- THIS IS A NIGHT SHIFT
            ELSE 0
        END AS IsNightShiftSpan
    FROM SwipeSequence
),
-- Mark new shifts: either first swipe, large gap, daily reset, BUT NOT for night span
NewShiftMarkers AS (
    SELECT
        *,
        CASE
            WHEN IsFirstSwipe = 1 OR IsLargeGap = 1 OR (MaybeDailyReset = 1 AND IsNightShiftSpan = 0)
                THEN 1
                ELSE 0
        END AS IsNewShift
    FROM ShiftBoundaryDetection
),
ShiftGroups AS (
    SELECT
        EmployeeName,
        EmployeeID,
        PersonnelType,
        Location,
        LocaleMessageTime,
        SwipeDate,
        IsNightShiftSpan,
        SUM(IsNewShift) OVER (PARTITION BY EmployeeID ORDER BY LocaleMessageTime) AS ShiftID
    FROM NewShiftMarkers
),
-- Calculate shift duration only for shift-based locations
ShiftBoundaries AS (
    SELECT
        EmployeeName,
        EmployeeID,
        PersonnelType,
        Location,
        ShiftID,
        MIN(LocaleMessageTime) AS ShiftStart,
        MAX(LocaleMessageTime) AS ShiftEnd,
        DATEDIFF(MINUTE, MIN(LocaleMessageTime), MAX(LocaleMessageTime)) AS DurationMinutes
    FROM ShiftGroups
    WHERE Location IN ('PH.Manila', 'LT.Vilnius', 'CR.Costa Rica Partition')
    GROUP BY EmployeeName, EmployeeID, PersonnelType, Location, ShiftID
)
SELECT
    EmployeeName,
    EmployeeID,
    PersonnelType,
    Location,
    CONVERT(DATE, ShiftStart) AS AttendanceDate,
    ShiftStart,
    ShiftEnd,
    RIGHT('00' + CAST(DurationMinutes / 60 AS NVARCHAR), 2)
    + ':' +
    RIGHT('00' + CAST(DurationMinutes % 60 AS NVARCHAR), 2) AS DurationHours,
    CASE
        WHEN DurationMinutes < 5 THEN '0-5 mins'
        WHEN DurationMinutes < 30 THEN '5-30 mins'
        WHEN DurationMinutes < 60 THEN '30-60 mins'
        WHEN DurationMinutes < 180 THEN '1-3 hrs'
        WHEN DurationMinutes < 360 THEN '3-6 hrs'
        ELSE '6+ hrs'
    END AS TimeCategory
FROM ShiftBoundaries
 
UNION ALL
 
-- Daily-based calculation for all other locations (which now includes HQ)
SELECT
    EmployeeName,
    EmployeeID,
    PersonnelType,
    Location,
    SwipeDate AS AttendanceDate,
    MIN(LocaleMessageTime) AS FirstSwipeTime,
    MAX(LocaleMessageTime) AS LastSwipeTime,
    RIGHT('00' + CAST(DATEDIFF(MINUTE, MIN(LocaleMessageTime), MAX(LocaleMessageTime)) / 60 AS NVARCHAR), 2)
    + ':' +
    RIGHT('00' + CAST(DATEDIFF(MINUTE, MIN(LocaleMessageTime), MAX(LocaleMessageTime)) % 60 AS NVARCHAR), 2) AS DurationHours,
    CASE
        WHEN DATEDIFF(MINUTE, MIN(LocaleMessageTime), MAX(LocaleMessageTime)) < 5 THEN '0-5 mins'
        WHEN DATEDIFF(MINUTE, MIN(LocaleMessageTime), MAX(LocaleMessageTime)) < 30 THEN '5-30 mins'
        WHEN DATEDIFF(MINUTE, MIN(LocaleMessageTime), MAX(LocaleMessageTime)) < 60 THEN '30-60 mins'
        WHEN DATEDIFF(MINUTE, MIN(LocaleMessageTime), MAX(LocaleMessageTime)) < 180 THEN '1-3 hrs'
        WHEN DATEDIFF(MINUTE, MIN(LocaleMessageTime), MAX(LocaleMessageTime)) < 360 THEN '3-6 hrs'
        ELSE '6+ hrs'
    END AS TimeCategory
FROM ShiftGroups
WHERE Location NOT IN ('PH.Manila', 'LT.Vilnius', 'CR.Costa Rica Partition')
GROUP BY EmployeeName, EmployeeID, PersonnelType, Location, SwipeDate
ORDER BY EmployeeID, AttendanceDate DESC, ShiftStart DESC;
`;



/////////////////////////////

  const req = pool.request();
  if (location) {
    req.input('location', sql.NVarChar, location);
  }

// ---- Replace the simple query/mapping at the end with this mapping ----
const result = await req.query(query);

return result.recordset.map(r => {
  // ensure DurationSeconds is numeric (SQL may return as number or bigint)
  const durSec = r.DurationSeconds != null ? Number(r.DurationSeconds) : null;

  // format HH:MM:SS from seconds in a safe way (handles >24h if it occurs)
  const formatHMS = (secs) => {
    if (secs == null || Number.isNaN(secs)) return null;
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return {
    ...r,
    // keep raw DurationSeconds (optional) and add readable duration per day
    DurationSeconds: durSec,
    duration: durSec != null ? formatHMS(durSec) : null,
    // normalize FirstSwipe/LastSwipe to ISO strings (if they come back as Date objects)
    FirstSwipe: r.FirstSwipe ? (r.FirstSwipe instanceof Date ? r.FirstSwipe.toISOString() : String(r.FirstSwipe)) : null,
    LastSwipe: r.LastSwipe ? (r.LastSwipe instanceof Date ? r.LastSwipe.toISOString() : String(r.LastSwipe)) : null
  };
});

};

// keep this for occupancy
exports.fetchHistoricalOccupancy = async (location) =>
  exports.fetchHistoricalData({ location: location || null });




