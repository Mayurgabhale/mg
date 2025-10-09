history api gettng more time to loading the data,
we want api return response within 3 to 5 seconds only,
  ok
see belwo code and postman respons time ok 
http://localhost:3007/api/occupancy/history
Response Time
2 m 48.90 s
Prepare
7.01 ms
Socket Initialization
1.14 ms
DNS Lookup
0.11 ms
TCP Handshake
0 ms
Waiting (TTFB)
2 m 48.78 s
Download
88.34 ms
Process
17.75 ms


Read belwo all cdeo each line carefully, 
  and how to imprive responve time 
for this api http://localhost:3007/api/occupancy/history

// C:\Users\W0024618\Desktop\apac-occupancy-backend\src\config\db.js
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
    console.log('✅ MSSQL (APAC) connected');
    return pool;
  })
  .catch(err => {
    console.error('❌ MSSQL (APAC) connection failed', err);
    process.exit(1);
  });

module.exports = { sql, poolPromise };





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
    const byDate = raw.reduce((acc, r) => {
      // force into a "YYYY-MM-DD" string
      const date = new Date(r.LocaleMessageTime).toISOString().slice(0, 10);
      acc[date] = acc[date] || {};
      if (
        !acc[date][r.PersonGUID] ||
        new Date(r.LocaleMessageTime) < new Date(acc[date][r.PersonGUID].LocaleMessageTime)
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
          WHEN t1.ObjectName2 LIKE 'APAC_HYD%'   THEN 'IN.HYD'
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

  // 4. Final query
  const query = `
    WITH Hist AS (
      ${unionQueries}
    )
    SELECT *
    FROM Hist
    ${outerFilter}
    ORDER BY LocaleMessageTime ASC;
  `;

  const req = pool.request();
  if (location) {
    req.input('location', sql.NVarChar, location);
  }
  const result = await req.query(query);
  return result.recordset;
};

// keep this for occupancy
exports.fetchHistoricalOccupancy = async (location) =>
  exports.fetchHistoricalData({ location: location || null });

// src/routes/occupancy.routes.js
const express    = require('express');
const controller = require('../controllers/occupancy.controller');
const router     = express.Router();

router.get('/live',         controller.getLiveOccupancy);
router.get('/live-summary', controller.getLiveSummary);
router.get('/history',           controller.getHistoricalOccupancy);
router.get('/history/:location', controller.getHistoricalOccupancy);

module.exports = router;
