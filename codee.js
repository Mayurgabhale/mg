// C:UsersW0024618Desktoplaca-occupancy-backendsrc/servicesoccupancy.service.js
const { poolPromise, sql } = require('../config/db');
const partitionList = [
  'AR.Cordoba',
  'BR.Sao Paulo',
  'CR.Costa Rica Partition',
  'MX.Mexico City',
  'PA.Panama City',
  'PE.Lima'
];

const { DateTime } = require('luxon');

// Map used for time zone lookups (adjust as needed)
const partitionTimezoneMap = {
  'AR.Cordoba': 'America/Argentina/Cordoba',
  'BR.Sao Paulo': 'America/Sao_Paulo',
  'CR.Costa Rica Partition': 'America/Costa_Rica',
  'MX.Mexico City': 'America/Mexico_City',
  'PA.Panama City': 'America/Panama',
  'PE.Lima': 'America/Lima'
};

// Helper to safely quote partition names for IN (...) usage
function partitionsSqlLiteral(list) {
  return list.map(p => "'" + p.replace(/'/g, "''") + "'").join(',');
}

exports.fetchLiveOccupancy = async () => {
  const pool = await poolPromise;
  const partitionsSql = partitionsSqlLiteral(partitionList);

  const query = `
WITH CombinedQuery AS (
  SELECT
    DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
    t1.ObjectName1,
    t1.ObjectName2 AS Door,
    CASE
      WHEN t3.Name IN ('Contractor','Terminated Contractor') THEN t2.Text12
      ELSE CAST(t2.Int1 AS NVARCHAR)
    END AS EmployeeID,
    t2.text5 AS Text5,
    t1.PartitionName2 AS PartitionName2,
    t1.ObjectIdentity1 AS PersonGUID,
    t3.Name AS PersonnelType,
    t2.Text4 AS CompanyName,
    t2.Text5 AS PrimaryLocation,
    COALESCE(
      TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
      TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
      sc.value
    ) AS CardNumber,
    t5a.value AS AdmitCode,
    t5d.value AS Direction
  FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLog] AS t1
  LEFT JOIN [ACVSCore].[Access].[Personnel]     AS t2 ON t1.ObjectIdentity1 = t2.GUID
  LEFT JOIN [ACVSCore].[Access].[PersonnelType] AS t3 ON t2.PersonnelTypeId = t3.ObjectID
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
  ) AS sc ON t1.XmlGUID = sc.GUID
  WHERE t1.MessageType = 'CardAdmitted'
    AND t1.PartitionName2 IN (${partitionsSql})
) 
SELECT LocaleMessageTime,
       CONVERT(VARCHAR(10), LocaleMessageTime, 23) AS Dateonly,
       CONVERT(VARCHAR(8), LocaleMessageTime, 108) AS Swipe_Time,
       EmployeeID, PersonGUID, ObjectName1, Door, PersonnelType,
       CardNumber, Text5, PartitionName2, AdmitCode, Direction,
       CompanyName, PrimaryLocation
FROM CombinedQuery
ORDER BY LocaleMessageTime ASC;
  `;

  const result = await pool.request().query(query);
  return result.recordset;
};

exports.fetchHistoricalData = async ({ days = 7, location = null }) => {
  const pool = await poolPromise;
  const partitionsSql = partitionsSqlLiteral(partitionList);

  // Build a parameterized location filter if provided
  const req = pool.request();
  let whereLocation = '';
  if (location) {
    whereLocation = 'AND t1.PartitionName2 = @location';
    req.input('location', sql.NVarChar, location);
  } else {
    whereLocation = `AND t1.PartitionName2 IN (${partitionsSql})`;
  }

  const query = `
WITH Hist AS (
  SELECT
    DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
    t1.ObjectName1,
    t1.ObjectName2 AS Door,
    CASE WHEN t3.Name IN ('Contractor','Terminated Contractor') THEN t2.Text12 ELSE CAST(t2.Int1 AS NVARCHAR) END AS EmployeeID,
    t2.Text5 AS Text5,
    t1.PartitionName2 AS PartitionName2,
    t1.ObjectIdentity1 AS PersonGUID,
    t3.Name AS PersonnelType,
    t2.Text4 AS CompanyName,
    t2.Text5 AS PrimaryLocation,
    COALESCE(
      TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
      TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
      sc.value
    ) AS CardNumber,
    t5a.value AS AdmitCode,
    t5d.value AS Direction,
    CONVERT(DATE, DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC)) AS SwipeDate
  FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLog] AS t1
  LEFT JOIN [ACVSCore].[Access].[Personnel]     AS t2 ON t1.ObjectIdentity1 = t2.GUID
  LEFT JOIN [ACVSCore].[Access].[PersonnelType] AS t3 ON t2.PersonnelTypeId = t3.ObjectID
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
  ) AS sc ON t1.XmlGUID = sc.GUID
  WHERE t1.MessageType = 'CardAdmitted'
  ${location ? 'AND t1.PartitionName2 = @location' : 'AND t1.PartitionName2 IN (' + partitionsSql + ')'}
  AND t1.MessageUTC >= DATEADD(DAY, -${days}, GETUTCDATE())
)
SELECT * FROM Hist ORDER BY LocaleMessageTime ASC;
  `;

  const result = await req.query(query);
  return result.recordset;
};

exports.fetchSnapshotAtDateTime = async ({ date, time, location = null }) => {
  if (!date || !time) throw new Error('missing date or time');

  const tz = location && partitionTimezoneMap[location] ? partitionTimezoneMap[location] : 'UTC';
  const dtMatch = /^(d{4})-(d{2})-(d{2})$/.exec(date);
  const timeMatch = /^([0-1]d|2[0-3]):([0-5]d)(?::([0-5]d))?$/.exec(time);
  if (!dtMatch || !timeMatch) throw new Error('invalid date/time format');

  const year = Number(dtMatch[1]);
  const month = Number(dtMatch[2]);
  const day = Number(dtMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  const second = timeMatch[3] ? Number(timeMatch[3]) : 0;

  const atDt = DateTime.fromObject({ year, month, day, hour, minute, second, millisecond: 0 }, { zone: tz });
  if (!atDt.isValid) throw new Error('invalid date+time combination');

  const untilUtc = atDt.toUTC().toJSDate();

  const pool = await poolPromise;
  const req = pool.request();
  req.input('until', sql.DateTime, untilUtc);

  // Build partition filter safely
  const partitionsSql = partitionsSqlLiteral(partitionList);
  let partitionFilterSql = `t1.PartitionName2 IN (${partitionsSql})`;
  if (location) {
    partitionFilterSql = `t1.PartitionName2 = @location`;
    req.input('location', sql.NVarChar, location);
  }

  const q = `
WITH CombinedQuery AS (
  SELECT
    DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
    t1.MessageUTC,
    t1.ObjectName1,
    t1.ObjectName2 AS Door,
    CASE WHEN t3.Name IN ('Contractor','Terminated Contractor') THEN t2.Text12 ELSE CAST(t2.Int1 AS NVARCHAR) END AS EmployeeID,
    t2.Text5 AS Text5,
    t1.PartitionName2 AS PartitionName2,
    t1.ObjectIdentity1 AS PersonGUID,
    t3.Name AS PersonnelType,
    t2.Text4 AS CompanyName,
    t2.Text5 AS PrimaryLocation,
    COALESCE(
      TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
      TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
      sc.value
    ) AS CardNumber,
    t5a.value AS AdmitCode,
    t5d.value AS Direction
  FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLog] AS t1
  LEFT JOIN [ACVSCore].[Access].[Personnel] AS t2 ON t1.ObjectIdentity1 = t2.GUID
  LEFT JOIN [ACVSCore].[Access].[PersonnelType] AS t3 ON t2.PersonnelTypeId = t3.ObjectID
  LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] AS t5a ON t1.XmlGUID = t5a.GUID AND t5a.Name = 'AdmitCode'
  LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] AS t5d ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')
  LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxml] AS t_xml ON t1.XmlGUID = t_xml.GUID
  LEFT JOIN (
    SELECT GUID, value FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] WHERE Name IN ('Card','CHUID')
  ) AS sc ON t1.XmlGUID = sc.GUID
  WHERE t1.MessageType = 'CardAdmitted'
  AND ${partitionFilterSql}
  AND t1.MessageUTC <= @until
  AND DATEADD(HOUR, -24, @until) < t1.MessageUTC
)
SELECT * FROM CombinedQuery ORDER BY LocaleMessageTime ASC;
  `;

  const result = await req.query(q);
  return { rows: result.recordset, atDtISO: atDt.toISO(), atDtZone: tz };
};

exports.fetchHistoricalOccupancy = async (location) => {
  return exports.fetchHistoricalData({ days: 7, location: location || null });
};

module.exports.partitionList = partitionList;