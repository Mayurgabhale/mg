http://localhost:3001/api/occupancy/history
{
    "success": false,
    "message": "Historical fetch failed"
}
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
RequestError: Connection lost - 706E0000:error:1C800066:Provider routines:ossl_gcm_stream_update:cipher operation failed:c:\ws\deps\openssl\openssl\providers\implementations\ciphers\ciphercommon_gcm.c:325:

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
  originalError: Error: Connection lost - 706E0000:error:1C800066:Provider routines:ossl_gcm_stream_update:cipher operation failed:c:\ws\deps\openssl\openssl\providers\implementations\ciphers\ciphercommon_gcm.c:325:

      at handleError (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\mssql\lib\tedious\request.js:382:19)
      at Connection.emit (node:events:530:35)
      at Connection.emit (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\tedious\lib\connection.js:970:18)
      at Connection.socketError (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\tedious\lib\connection.js:1359:12)
      at Socket.<anonymous> (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\tedious\lib\connection.js:1060:12)
      at Socket.emit (node:events:530:35)
      at emitErrorNT (node:internal/streams/destroy:170:8)
      at emitErrorCloseNT (node:internal/streams/destroy:129:3)
      at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
    info: ConnectionError: Connection lost - 706E0000:error:1C800066:Provider routines:ossl_gcm_stream_update:cipher operation failed:c:\ws\deps\openssl\openssl\providers\implementations\ciphers\ciphercommon_gcm.c:325:

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


//Abhishek//1//

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
    // cryptoCredentialsDetails: {
    //   minVersion:         'TLSv1.2',               // enforce minimum TLS 1.2
    //   maxVersion:         'TLSv1.3'                // allow up to TLS 1.3 if available
    // }
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
};// src/routes/occupancy.routes.js

const express = require('express');
const router  = express.Router();
const controller = require('../controllers/occupancy.controller');

// Live raw and summary
router.get('/live',         controller.getLiveOccupancy);
router.get('/live-summary', controller.getLiveSummary);

// History: all partitions or a single one
router.get('/history',             controller.getHistoricalOccupancy);
router.get('/history/:location',   controller.getHistoricalOccupancy);

// GET /api/occupancy-at-time?date=YYYY-MM-DD&time=HH:MM[:SS]&location=MX.Mexico City
router.get('/occupancy-at-time', controller.getSnapshotAtDateTime);

module.exports = router;


