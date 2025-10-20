chekc this filese carefully, and readh each line and where is the issue in this code 
and how to slove it.. 
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

================
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

exports.fetchHistoricalOccupancy = async (location) => {
  return exports.fetchHistoricalData({ days: 7, location: location || null });
};

module.exports.partitionList = partitionList;



=========
  C:\Users\W0024618\Desktop\laca-occupancy-backend\src\server.js
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});












