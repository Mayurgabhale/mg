PS C:\Users\W0024618\desktop\swipeData\employee-ai-insights> npm start

> employee-ai-insights@1.0.0 start
> node server.js

Server running at http://localhost:5000
✅ MSSQL pool connected (Pune)
✅ Denver MSSQL pool connected
❌ fetchNewEvents query error — resetting Denver pool and returning empty: RequestError: Query timed out after 20000ms
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\mssql\lib\tedious\request.js:449:19
    at Array.forEach (<anonymous>)
    at Request.userCallback (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\mssql\lib\tedious\request.js:446:46)
    at Request.callback (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\request.js:239:14)
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:2694:24
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5) {
  code: 'ECANCEL',
  originalError: RequestError: Canceled.
      at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\tedious\lib\connection.js:2694:33
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5) {
    code: 'ECANCEL'
  },
  number: 'ECANCEL',
  lineNumber: undefined,
  state: undefined,
  class: undefined,
  serverName: undefined,
  procName: undefined,
  precedingErrors: []
}
❌ fetchNewEvents query error — resetting Denver pool and returning empty: ConnectionError: Connection is closed.
    at Request._query (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\mssql\lib\base\request.js:497:37)
    at Request._query (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\mssql\lib\tedious\request.js:363:11)
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\mssql\lib\base\request.js:461:12
    at new Promise (<anonymous>)
    at Request.query (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\node_modules\mssql\lib\base\request.js:460:12)
    at C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\controllers\denverLiveOccupancyController.js:1413:32
    at safeQueryWithTimeout (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\controllers\denverLiveOccupancyController.js:1418:5)
    at fetchNewEvents (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\controllers\denverLiveOccupancyController.js:1537:33)
    at async Timeout.push [as _onTimeout] (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\controllers\denverLiveOccupancyController.js:2039:21) {
  code: 'ECONNCLOSED'
}
++++++++++++++++++++++++++++
    async function fetchNewEvents(since) {
  let pool;
  try {
    // IMPORTANT: use denver.getPool() (not denver.poolPromise)
    pool = await denver.getPool();
  } catch (err) {
    console.error('❌ Failed to get Denver pool in fetchNewEvents():', err);
    return [];
  }
  if (!pool) {
    console.warn('⚠️ fetchNewEvents: no pool available, returning empty');
    return [];
  }

  const req = pool.request();
  req.input('since', sql.DateTime2, since);

  const queryText = `
  
    WITH CombinedQuery AS (
      SELECT
        DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
        t1.ObjectName1,
        CASE
          WHEN t3.Name IN ('Contractor','Terminated Contractor') THEN t2.Text12
          ELSE CAST(t2.Int1 AS NVARCHAR)
        END AS EmployeeID,
        t1.ObjectIdentity1 AS PersonGUID,
        t3.Name AS PersonnelType,
        COALESCE(
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]' ,'varchar(50)'),
          sc.value
        ) AS CardNumber,
        t5a.value AS AdmitCode,
        t5d.value AS Direction,
        t1.ObjectName2 AS Door
      FROM ACVSUJournal_00010029.dbo.ACVSUJournalLog t1
      LEFT JOIN ACVSCore.Access.Personnel     t2 ON t1.ObjectIdentity1 = t2.GUID
      LEFT JOIN ACVSCore.Access.PersonnelType t3 ON t2.PersonnelTypeId  = t3.ObjectID
      LEFT JOIN ACVSUJournal_00010029.dbo.ACVSUJournalLogxmlShred t5a
        ON t1.XmlGUID = t5a.GUID AND t5a.Name = 'AdmitCode'
      LEFT JOIN ACVSUJournal_00010029.dbo.ACVSUJournalLogxmlShred t5d
        ON t1.XmlGUID = t5d.GUID AND t5d.Name = 'Direction'
      LEFT JOIN ACVSUJournal_00010029.dbo.ACVSUJournalLogxml t_xml
        ON t1.XmlGUID = t_xml.GUID
      LEFT JOIN (
        SELECT GUID, value
        FROM ACVSUJournal_00010029.dbo.ACVSUJournalLogxmlShred
        WHERE Name IN ('Card','CHUID')
      ) sc ON t1.XmlGUID = sc.GUID
      WHERE
        t1.MessageType   = 'CardAdmitted'
        AND t1.ObjectName2 LIKE '%HQ%'
        AND DATEADD(MINUTE,-1* t1.MessageLocaleOffset, t1.MessageUTC) >= @since
    )
    SELECT
      LocaleMessageTime,
      CONVERT(VARCHAR(10), LocaleMessageTime, 23) AS Dateonly,
      CONVERT(VARCHAR(8),  LocaleMessageTime, 108) AS Swipe_Time,
      EmployeeID, PersonGUID, ObjectName1, PersonnelType,
      CardNumber, AdmitCode, Direction, Door
    FROM CombinedQuery
    ORDER BY LocaleMessageTime ASC;
  `; // paste the same long query you already have

  const t0 = Date.now();
  try {
    const { recordset } = await safeQueryWithTimeout(req, queryText, 20_000); // 20s timeout
    const took = Date.now() - t0;
    // console.log(`[DENVER] fetchNewEvents: got ${recordset ? recordset.length : 0} rows (took ${took}ms)`);
    return recordset || [];
  } catch (err) {
    console.error('❌ fetchNewEvents query error — resetting Denver pool and returning empty:', err);
    try {
      // Close pool to free resources; next getDenverPool will reconnect
      if (pool && typeof pool.close === 'function') {
        try { await pool.close(); } catch (e) { /* ignore */ }
      }
    } catch (e) { /* ignore */ }

    // set the exported promise to null so new callers will recreate
    try { denver._forceReset = true; } catch (e) { /* ignore */ }

    return [];
  }
}
