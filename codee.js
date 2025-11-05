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



