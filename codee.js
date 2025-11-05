PS C:\Users\W0024618\Desktop\emea-occupancy-backend> node server.js
🚀 Server running on port 3005
✅ MSSQL  connected
TimeTravel error RequestError: Invalid object name 'EMEA_CardEvent'.
    at handleError (C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\mssql\lib\tedious\request.js:384:15)
    at Connection.emit (node:events:518:28)
    at Connection.emit (C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\tedious\lib\connection.js:970:18)
    at RequestTokenHandler.onErrorMessage (C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\tedious\lib\token\handler.js:284:21)
    at Readable.<anonymous> (C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\tedious\lib\token\token-stream-parser.js:19:33)
    at Readable.emit (node:events:518:28)
    at addChunk (node:internal/streams/readable:561:12)
    at readableAddChunkPushObjectMode (node:internal/streams/readable:538:3)
    at Readable.push (node:internal/streams/readable:393:5)
    at nextAsync (node:internal/streams/from:194:22) {
  code: 'EREQUEST',
  originalError: Error: Invalid object name 'EMEA_CardEvent'.
      at handleError (C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\mssql\lib\tedious\request.js:382:19)
      at Connection.emit (node:events:518:28)
      at Connection.emit (C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\tedious\lib\connection.js:970:18)
      at RequestTokenHandler.onErrorMessage (C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\tedious\lib\token\handler.js:284:21)
      at Readable.<anonymous> (C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\tedious\lib\token\token-stream-parser.js:19:33)
      at Readable.emit (node:events:518:28)
      at addChunk (node:internal/streams/readable:561:12)
      at readableAddChunkPushObjectMode (node:internal/streams/readable:538:3)
      at Readable.push (node:internal/streams/readable:393:5)
      at nextAsync (node:internal/streams/from:194:22) {
    info: ErrorMessageToken {
      name: 'ERROR',
      handlerName: 'onErrorMessage',
      number: 208,
      state: 1,
      class: 16,
      message: "Invalid object name 'EMEA_CardEvent'.",
      serverName: 'SRVWUFRA0986V',
      procName: '',
      lineNumber: 2
    }
  },
  number: 208,
  lineNumber: 2,
  state: 1,
  class: 16,
  serverName: 'SRVWUFRA0986V',
  procName: '',
  precedingErrors: []
}
TimeTravel error RequestError: Invalid object name 'EMEA_CardEvent'.
    at handleError (C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\mssql\lib\tedious\request.js:384:15)
    at Connection.emit (node:events:518:28)
    at Connection.emit (C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\tedious\lib\connection.js:970:18)
    at RequestTokenHandler.onErrorMessage (C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\tedious\lib\token\handler.js:284:21)
    at Readable.<anonymous> (C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\tedious\lib\token\token-stream-parser.js:19:33)
    at Readable.emit (node:events:518:28)
    at addChunk (node:internal/streams/readable:561:12)
    at readableAddChunkPushObjectMode (node:internal/streams/readable:538:3)
    at Readable.push (node:internal/streams/readable:393:5)
    at nextAsync (node:internal/streams/from:194:22) {
  code: 'EREQUEST',
  originalError: Error: Invalid object name 'EMEA_CardEvent'.
      at handleError (C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\mssql\lib\tedious\request.js:382:19)
      at Connection.emit (node:events:518:28)
      at Connection.emit (C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\tedious\lib\connection.js:970:18)
      at RequestTokenHandler.onErrorMessage (C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\tedious\lib\token\handler.js:284:21)
      at Readable.<anonymous> (C:\Users\W0024618\Desktop\emea-occupancy-backend\node_modules\tedious\lib\token\token-stream-parser.js:19:33)
      at Readable.emit (node:events:518:28)
      at addChunk (node:internal/streams/readable:561:12)
      at readableAddChunkPushObjectMode (node:internal/streams/readable:538:3)
      at Readable.push (node:internal/streams/readable:393:5)
      at nextAsync (node:internal/streams/from:194:22) {
    info: ErrorMessageToken {
      name: 'ERROR',
      handlerName: 'onErrorMessage',
      number: 208,
      state: 1,
      class: 16,
      message: "Invalid object name 'EMEA_CardEvent'.",
      serverName: 'SRVWUFRA0986V',
      procName: '',
      lineNumber: 2
    }
  },
  number: 208,
  lineNumber: 2,
  state: 1,
  class: 16,
  serverName: 'SRVWUFRA0986V',
  procName: '',
  precedingErrors: []
}


const query = `
    WITH AllSwipes AS (
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
        t2.Text4             AS CompanyName,
        t2.Text5             AS PrimaryLocation,
        COALESCE(
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
          sc.value
        )                     AS CardNumber,
        t5a.value            AS AdmitCode,
        t5d.value            AS Direction,
        CONVERT(DATETIME2, DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC)) AS LT
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
        AND DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC)
            <= TRY_CAST(@dt AS DATETIME2)
    ),
    LastPerPerson AS (
      SELECT *,
        ROW_NUMBER() OVER (PARTITION BY PersonGUID ORDER BY LT DESC) AS rn
      FROM AllSwipes
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
    FROM LastPerPerson
    WHERE rn = 1
    ORDER BY LocaleMessageTime ASC;
  `;


read alos above old query ^^^
exports.fetchTimeTravelOccupancy = async (datetimeISO, location = null) => {
  const pool = await poolPromise;
  const partitionsSql = partitionList.map(p => `'${p.replace("'", "''")}'`).join(',');

  const locationFilter = location
    ? `AND t1.PartitionName2 = @location`
    : `AND t1.PartitionName2 IN (${partitionsSql})`;


  const query = `
WITH AllSwipes AS (
  SELECT
    t1.PersonGUID,
    t1.PersonnelType,
    t1.EmployeeID,
    t1.CompanyName,
    t1.PartitionName2,
    t1.Text5 AS PrimaryLocation,
    t1.CardNumber,
    t1.ObjectName1,
    t1.Door,
    t1.AdmitCode,
    t1.Direction,
    DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
    CAST(DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS DATE) AS Dateonly,
    FORMAT(DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC), 'HH:mm:ss') AS Swipe_Time,
    t1.Floor
  FROM EMEA_CardEvent t1
  WHERE
    t1.MessageType = 'CardAdmitted'
    ${location ? "AND t1.PartitionName2 = @location" : ""}
    AND CONVERT(date, DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC))
        = CONVERT(date, TRY_CAST(@dt AS DATETIME2)) -- ✅ only same date
    AND DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC)
        <= TRY_CAST(@dt AS DATETIME2)                -- ✅ up to that exact time
),

LastPerPerson AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY PersonGUID ORDER BY LocaleMessageTime DESC) AS rn
  FROM AllSwipes
)
SELECT
  t.PersonGUID,
  t.EmployeeID,
  t.PersonnelType,
  t.CompanyName,
  t.PartitionName2,
  t.PrimaryLocation,
  t.CardNumber,
  t.ObjectName1,
  t.Door,
  t.AdmitCode,
  t.Direction,
  t.LocaleMessageTime,
  t.Dateonly,
  t.Swipe_Time,
  t.Floor
FROM LastPerPerson t
WHERE rn = 1 AND t.Direction = 'InDirection';
`;


  const req = pool.request();
  // Bind as NVARCHAR so node/mssql doesn't convert the string to a JS Date
  req.input('dt', sql.DateTime2, datetimeISO);
  if (location) req.input('location', sql.NVarChar, location);

  const result = await req.query(query);
  return result.recordset; t;
};





module.exports.partitionList = partitionList;



