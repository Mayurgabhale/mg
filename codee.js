PS C:\Users\W0024618\desktop\laca-occupancy-backend> npm run dev

> laca-occupancy-backend@1.0.0 dev
> nodemon src/server.js

[nodemon] 3.1.10
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node src/server.js`
🚀 Server running on port 3001
✅ MSSQL connected
RequestError: Connection lost - 648B0000:error:0A00010B:SSL routines:ssl3_get_record:wrong version number:c:\ws\deps\openssl\openssl\ssl\record\ssl3_record.c:332:

    at handleError (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\mssql\lib\tedious\request.js:384:15)
    at Connection.emit (node:events:530:35)
    at Connection.emit (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\tedious\lib\connection.js:970:18)
    at Connection.socketError (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\tedious\lib\connection.js:1359:12)
    at Socket.<anonymous> (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\tedious\lib\connection.js:1060:12)
    at Socket.emit (node:events:530:35)
    at emitErrorNT (node:internal/streams/destroy:170:8)
    at emitErrorCloseNT (node:internal/streams/destroy:129:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
  code: 'EREQUEST',
  originalError: Error: Connection lost - 648B0000:error:0A00010B:SSL routines:ssl3_get_record:wrong version number:c:\ws\deps\openssl\openssl\ssl\record\ssl3_record.c:332:

      at handleError (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\mssql\lib\tedious\request.js:382:19)
      at Connection.emit (node:events:530:35)
      at Connection.emit (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\tedious\lib\connection.js:970:18)
      at Connection.socketError (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\tedious\lib\connection.js:1359:12)
      at Socket.<anonymous> (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\tedious\lib\connection.js:1060:12)
      at Socket.emit (node:events:530:35)
      at emitErrorNT (node:internal/streams/destroy:170:8)
      at emitErrorCloseNT (node:internal/streams/destroy:129:3)
      at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
    info: ConnectionError: Connection lost - 648B0000:error:0A00010B:SSL routines:ssl3_get_record:wrong version number:c:\ws\deps\openssl\openssl\ssl\record\ssl3_record.c:332:

        at Connection.socketError (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\tedious\lib\connection.js:1359:26)
        at Socket.<anonymous> (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\tedious\lib\connection.js:1060:12)
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





// C:\Users\W0024618\Desktop\laca-occupancy-backend\src\config\db.js
const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  user:             process.env.DB_USER,
  password:         process.env.DB_PASSWORD,
  server:           process.env.DB_SERVER,
  database:         process.env.DB_DATABASE,
  port:             parseInt(process.env.DB_PORT, 10),
  pool: {
    max:            10,
    min:            0,
    idleTimeoutMillis: 30000
  },
  options: {
    // Force TLS 1.2+ and explicit cipher negotiation
    encrypt:              true,                     // require encryption
    trustServerCertificate: true,                   // dev only; accept self-signed cert
    enableArithAbort:     true,                     // recommended for modern SQL Server
    cryptoCredentialsDetails: {
      minVersion:         'TLSv1.2',               // enforce minimum TLS 1.2
      maxVersion:         'TLSv1.3'                // allow up to TLS 1.3 if available
    }
  }
};

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    console.log('✅ MSSQL connected');
    return pool;
  })
  .catch(err => {
    console.error('❌ MSSQL connection failed ➞', err);
    // crash early so front-end 500s disappear
    process.exit(1);
  });

module.exports = {
  sql,
  poolPromise
};

===================

  //C:\Users\W0024618\Desktop\laca-occupancy-backend\src\controllers\occupancy.controller.js


const service = require('../services/occupancy.service');
const doorMap = require('../utils/doorMap'); 



exports.getLiveOccupancy = async (req, res) => {
  try {
    const data = await service.fetchLiveOccupancy();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Live occupancy fetch failed' });
  }
};


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
 * Returns true if this PersonnelType is a Temp Badge.
 */
// function isTempBadgeType(pt) {
//   return pt === 'Temp Badge';
// }


function isTempBadgeType(pt) {
  // handle both variants from the database
  return pt === 'Temp Badge' || pt === 'TempBadge';
}



/**
 * Look up floor for a given record by matching door + partition.
 */
function lookupFloor(partition, door, direction, unmappedSet) {
  const entry = doorMap.find(d =>
    d.partition === partition && d.door === door
  );
  if (!entry) {
    unmappedSet.add(`${partition} | ${door}`);
    return null;
  }
  return direction === 'InDirection'
    ? entry.inDirectionFloor
    : entry.outDirectionFloor;
}






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
    const today = { total: 0, Employee: 0, Contractor: 0, TempBadge: 0 };
    todayRecs.forEach(r => {
      today.total++;
      if (isTempBadgeType(r.PersonnelType)) today.TempBadge++;
      else if (isEmployeeType(r.PersonnelType)) today.Employee++;
      else today.Contractor++;
    });

    // 2. REAL-TIME: last swipe per person, with strict removal for Floor == "Out of office"
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
      // Resolve mapped floor up-front (populates unmappedDoors when needed)
      const rawFloor = lookupFloor(r.PartitionName2, r.Door, r.Direction, unmappedDoors);
      const floorNorm = rawFloor ? String(rawFloor).trim().toLowerCase() : '';

      // STRICT RULE: if resolved Floor equals "out of office" -> skip counting entirely
      if (floorNorm === 'out of office') {
        return;
      }

      const p = r.PartitionName2;
      // initialize, including TempBadge for CR
      if (!realtime[p]) {
        realtime[p] = { total: 0, Employee: 0, Contractor: 0 };
        if (p === 'CR.Costa Rica Partition') realtime[p].TempBadge = 0;
        realtime[p].floors = {};
      }

      realtime[p].total++;
      if (isTempBadgeType(r.PersonnelType)) realtime[p].TempBadge++;
      else if (isEmployeeType(r.PersonnelType)) realtime[p].Employee++;
      else realtime[p].Contractor++;

      // add to floor bucket, using 'Unmapped' when lookup fails
      const normFloor = rawFloor ? String(rawFloor).trim() : 'Unmapped';
      realtime[p].floors[normFloor] = (realtime[p].floors[normFloor] || 0) + 1;
    });

    if (unmappedDoors.size) {
      console.warn('Unmapped doors:\n' + Array.from(unmappedDoors).join('\n'));
    }

    // Build enriched details with Floor added, but filter out any whose Floor is "Out of office"
    const details = Object.values(lastByPerson)
      .map(r => {
        const rawFloor = lookupFloor(r.PartitionName2, r.Door, r.Direction, unmappedDoors);
        const floor = rawFloor ? String(rawFloor).trim() : null;
        return {
          ...r,
          Floor: floor
        };
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

      // initialize region counts, including TempBadge for CR location
      const regionCounts = { total: 0, Employee: 0, Contractor: 0 };
      if (location === 'CR.Costa Rica Partition') regionCounts.TempBadge = 0;

      const partitionCounts = {};
      recs.forEach(r => {
        regionCounts.total++;
        if (isTempBadgeType(r.PersonnelType)) regionCounts.TempBadge++;
        else if (isEmployeeType(r.PersonnelType)) regionCounts.Employee++;
        else regionCounts.Contractor++;

        if (!location) {
          const p = r.PartitionName2;
          if (!partitionCounts[p]) {
            partitionCounts[p] = { total: 0, Employee: 0, Contractor: 0 };
            if (p === 'CR.Costa Rica Partition') partitionCounts[p].TempBadge = 0;
          }
          partitionCounts[p].total++;
          if (isTempBadgeType(r.PersonnelType)) partitionCounts[p].TempBadge++;
          else if (isEmployeeType(r.PersonnelType)) partitionCounts[p].Employee++;
          else partitionCounts[p].Contractor++;
        }
      });

      summaryByDate.push({
        date,
        day: new Date(date).toLocaleDateString('en-US', { weekday:'long' }),
        region: location
          ? { name: location, ...regionCounts }
          : { name: 'LACA', ...regionCounts },
        partitions: location ? undefined : partitionCounts
      });
    });

    return res.json({ success: true, summaryByDate, details });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Historical fetch failed' });
  }
};




// ////////////////////



exports.getSnapshotAtDateTime = async (req, res) => {
  try {
    const { date, time, location } = req.query;
    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: 'missing query params: expected ?date=YYYY-MM-DD&time=HH:MM[:SS]&location=<optional partition>'
      });
    }

    // validate formats (same regex style used elsewhere)
    const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    const timeMatch = /^([0-1]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(time);
    if (!dateMatch) {
      return res.status(400).json({ success:false, message: 'invalid "date" format; expected YYYY-MM-DD' });
    }
    if (!timeMatch) {
      return res.status(400).json({ success:false, message: 'invalid "time" format; expected HH:MM or HH:MM:SS' });
    }

    // fetch raw rows
    const svcRes = await service.fetchSnapshotAtDateTime({ date, time, location });
    const rows = svcRes.rows || [];
    const asOfLocal = svcRes.atDtISO;
    const asOfZone = svcRes.atDtZone || 'utc';

    // convert LocaleMessageTime to ISO string and filter to requested local date (YYYY-MM-DD)
    const filtered = rows.map(r => {
      // LocaleMessageTime from SQL may be a Date or string; normalize to ISO
      const lmt = r.LocaleMessageTime instanceof Date ? r.LocaleMessageTime.toISOString() : (r.LocaleMessageTime || null);
      return { ...r, LocaleMessageTime: lmt };
    }).filter(r => {
      if (!r.LocaleMessageTime) return false;
      return r.LocaleMessageTime.slice(0,10) === date;
    });

    // compute unique visited-up-to-snapshot counts (first swipe per PersonGUID on that date)
    const firstByPerson = {};
    filtered.forEach(r => {
      const prev = firstByPerson[r.PersonGUID];
      const t = new Date(r.LocaleMessageTime).getTime();
      if (!prev || t < new Date(prev.LocaleMessageTime).getTime()) {
        firstByPerson[r.PersonGUID] = r;
      }
    });
    const visitedRecs = Object.values(firstByPerson);
    const visitedCounts = { total: 0, Employee: 0, Contractor: 0, TempBadge: 0 };
    visitedRecs.forEach(r => {
      visitedCounts.total++;
      if (isTempBadgeType(r.PersonnelType)) visitedCounts.TempBadge++;
      else if (isEmployeeType(r.PersonnelType)) visitedCounts.Employee++;
      else visitedCounts.Contractor++;
    });

    return res.json({
      success: true,
      asOfLocal,          // ISO in requested partition zone
      asOfZone,
      asOfUTC: `${date}T${String(timeMatch[1]).padStart(2,'0')}:${String(timeMatch[2]).padStart(2,'0')}:${String(timeMatch[3] || '00').padStart(2,'0')}Z`,
      // totalRecords: filtered.length,
      totalVisitedToday: visitedCounts.total,
      visitedByType: visitedCounts,
      data: visitedRecs
    });

  } catch (err) {
    console.error('getSnapshotAtDateTime error:', err);
    return res.status(500).json({ success: false, message: 'Snapshot fetch failed' });
  }
};



==============
  // src/services/occupancy.service.js

const { poolPromise, sql } = require('../config/db');
const partitionList = [
  'AR.Cordoba', 
  'BR.Sao Paulo',
  'CR.Costa Rica Partition',
  'MX.Mexico City',
  'PA.Panama City',
  'PE.Lima'
];


const { DateTime } = require('luxon'); // add at top of file if not already present

// Simple map from partition name -> IANA timezone. Update if you have a canonical map.
const partitionTimezoneMap = {
  'AR.Cordoba': 'America/Argentina/Cordoba',
  'BR.Sao Paulo': 'America/Sao_Paulo',
  'CR.Costa Rica Partition': 'America/Costa_Rica',
  'MX.Mexico City': 'America/Mexico_City',
  'PA.Panama City': 'America/Panama',
  'PE.Lima': 'America/Lima'
};




/**
 * Live occupancy (today) query unchanged.
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
      FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLog] AS t1
      LEFT JOIN [ACVSCore].[Access].[Personnel]     AS t2
        ON t1.ObjectIdentity1 = t2.GUID
      LEFT JOIN [ACVSCore].[Access].[PersonnelType] AS t3
        ON t2.PersonnelTypeId = t3.ObjectID
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] AS t5a
        ON t1.XmlGUID = t5a.GUID AND t5a.Name = 'AdmitCode'
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] AS t5d
        ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxml] AS t_xml
        ON t1.XmlGUID = t_xml.GUID
      LEFT JOIN (
        SELECT GUID, value
        FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred]
        WHERE Name IN ('Card','CHUID')
      ) AS sc
        ON t1.XmlGUID = sc.GUID
      
        WHERE
       t1.MessageType = 'CardAdmitted'
        AND t1.PartitionName2 IN (${partitionsSql})
        AND CONVERT(
            DATE,
            DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC)
        )
          = CONVERT(
              DATE,
              DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, GETUTCDATE())
            )        
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
      FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLog] AS t1
      LEFT JOIN [ACVSCore].[Access].[Personnel]     AS t2
        ON t1.ObjectIdentity1 = t2.GUID
      LEFT JOIN [ACVSCore].[Access].[PersonnelType] AS t3
        ON t2.PersonnelTypeId = t3.ObjectID
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] AS t5a
        ON t1.XmlGUID = t5a.GUID AND t5a.Name = 'AdmitCode'
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] AS t5d
        ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxml] AS t_xml
        ON t1.XmlGUID = t_xml.GUID
      LEFT JOIN (
        SELECT GUID, value
        FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred]
        WHERE Name IN ('Card','CHUID')
      ) AS sc
        ON t1.XmlGUID = sc.GUID
     
       WHERE
        t1.MessageType = 'CardAdmitted'
        ${locationFilter}
        AND CONVERT(
            DATE,
            DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC)
        )
          >= DATEADD(
              DAY,
              -${days},
              CONVERT(
                DATE,
                DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, GETUTCDATE())
              )
            )

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





// ////////////////////////////////////////////////////



/**
 * Fetch occupancy snapshot for a specific date+time.
 * - date: 'YYYY-MM-DD'
 * - time: 'HH:MM' or 'HH:MM:SS'
 * - location: optional partition name (must match one in partitionList)
 *
 * Returns an array of raw rows (same shape as fetchLiveOccupancy / fetchHistoricalData),
 * where each row includes LocaleMessageTime (as a SQL datetime -> JS Date).
 */
exports.fetchSnapshotAtDateTime = async ({ date, time, location = null }) => {
  // validate simple formats (caller should already validate, but keep defensive)
  if (!date || !time) throw new Error('missing date or time');

  // choose timezone for the requested partition (default to UTC if unknown)
  const tz = location && partitionTimezoneMap[location]
    ? partitionTimezoneMap[location]
    : 'utc';

  // build a Luxon DateTime in that timezone
  const dtMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const timeMatch = /^([0-1]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(time);
  if (!dtMatch || !timeMatch) {
    throw new Error('invalid date/time format');
  }
  const year = Number(dtMatch[1]);
  const month = Number(dtMatch[2]);
  const day = Number(dtMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  const second = timeMatch[3] ? Number(timeMatch[3]) : 0;

  const atDt = DateTime.fromObject(
    { year, month, day, hour, minute, second, millisecond: 0 },
    { zone: tz }
  );

  if (!atDt.isValid) {
    throw new Error('invalid date+time combination');
  }

  // Convert to UTC Date for SQL parameter (SQL stores MessageUTC)
  const untilUtc = atDt.toUTC().toJSDate();

  const pool = await poolPromise;
  const req = pool.request();
  req.input('until', sql.DateTime, untilUtc);

  // partition filter: either single partition param or use configured partitionList
  let partitionFilterSql = `t1.PartitionName2 IN (${partitionList.map(p => `'${p.replace("'", "''")}'`).join(',')})`;
  if (location) {
    partitionFilterSql = `t1.PartitionName2 = @location`;
    req.input('location', sql.NVarChar, location);
  }

  // Query: compute LocaleMessageTime same as other service functions, but filter by MessageUTC window
  const q = `
    WITH CombinedQuery AS (
      SELECT
        DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
        t1.MessageUTC,
        t1.ObjectName1,
        t1.ObjectName2            AS Door,
        CASE
          WHEN t3.Name IN ('Contractor','Terminated Contractor') THEN t2.Text12
          ELSE CAST(t2.Int1 AS NVARCHAR)
        END                       AS EmployeeID,
        t2.text5                  AS Text5,
        t1.PartitionName2         AS PartitionName2,
        t1.ObjectIdentity1        AS PersonGUID,
        t3.Name                   AS PersonnelType,
        t2.Text4                  AS CompanyName,
        t2.Text5                  AS PrimaryLocation,
        COALESCE(
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
          sc.value
        )                         AS CardNumber,
        t5a.value                 AS AdmitCode,
        t5d.value                 AS Direction
      FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLog] AS t1
      LEFT JOIN [ACVSCore].[Access].[Personnel]     AS t2
        ON t1.ObjectIdentity1 = t2.GUID
      LEFT JOIN [ACVSCore].[Access].[PersonnelType] AS t3
        ON t2.PersonnelTypeId = t3.ObjectID
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] AS t5a
        ON t1.XmlGUID = t5a.GUID AND t5a.Name = 'AdmitCode'
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] AS t5d
        ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxml] AS t_xml
        ON t1.XmlGUID = t_xml.GUID
      LEFT JOIN (
        SELECT GUID, value
        FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred]
        WHERE Name IN ('Card','CHUID')
      ) AS sc
        ON t1.XmlGUID = sc.GUID
      WHERE
        t1.MessageType = 'CardAdmitted'
        AND ${partitionFilterSql}
        AND t1.MessageUTC <= @until
        AND DATEADD(HOUR, -24, @until) < t1.MessageUTC
    )
    SELECT *
    FROM CombinedQuery
    ORDER BY MessageUTC ASC;
  `;

  const result = await req.query(q);
  return { rows: result.recordset, atDtISO: atDt.toISO(), atDtZone: tz };
};


/**
 * Public wrapper: always last 7 days, all or by location.
 */
exports.fetchHistoricalOccupancy = async (location) => {
  return exports.fetchHistoricalData({ days: 7, location: location || null });
};

module.exports.partitionList = partitionList;
