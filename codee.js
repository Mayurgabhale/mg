// controllers/denverLiveOccupancyController.js

// Increase timeout and add retry logic
async function safeQueryWithTimeout(req, sqlText, timeoutMs = 60000) { // Increased to 60s
  let timer = null;
  let timedOut = false;

  const cancelIfTimeout = () => {
    timedOut = true;
    try {
      if (typeof req.cancel === 'function') req.cancel();
    } catch (e) {
      // ignore
    }
  };

  const qPromise = (async () => {
    try {
      const result = await req.query(sqlText);
      return result;
    } finally {
      if (timer) clearTimeout(timer);
    }
  })();

  timer = setTimeout(cancelIfTimeout, timeoutMs);

  try {
    const res = await qPromise;
    if (timedOut) throw new Error('Query canceled after timeout');
    return res;
  } catch (err) {
    if (timedOut) err.message = `Query timed out after ${timeoutMs}ms`;
    throw err;
  }
}

// Optimized query with better filtering
async function fetchNewEvents(since, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    let pool;
    try {
      pool = await denver.getPool();
    } catch (err) {
      console.error(`❌ Attempt ${attempt}: Failed to get Denver pool:`, err);
      if (attempt === maxRetries) return [];
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      continue;
    }

    if (!pool) {
      console.warn(`⚠️ Attempt ${attempt}: No pool available`);
      if (attempt === maxRetries) return [];
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      continue;
    }

    const req = pool.request();
    req.input('since', sql.DateTime2, since);

    // Optimized query - simplified and more efficient
    const queryText = `
      SELECT 
        DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
        CONVERT(VARCHAR(10), DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC), 23) AS Dateonly,
        CONVERT(VARCHAR(8), DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC), 108) AS Swipe_Time,
        t1.ObjectName1,
        CASE 
          WHEN t3.Name IN ('Contractor','Terminated Contractor') THEN t2.Text12
          ELSE CAST(t2.Int1 AS NVARCHAR)
        END AS EmployeeID,
        t1.ObjectIdentity1 AS PersonGUID,
        t3.Name AS PersonnelType,
        COALESCE(
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]', 'varchar(50)'),
          sc.value
        ) AS CardNumber,
        t5a.value AS AdmitCode,
        t5d.value AS Direction,
        t1.ObjectName2 AS Door
      FROM ACVSUJournal_00010029.dbo.ACVSUJournalLog t1
      LEFT JOIN ACVSCore.Access.Personnel t2 ON t1.ObjectIdentity1 = t2.GUID
      LEFT JOIN ACVSCore.Access.PersonnelType t3 ON t2.PersonnelTypeId = t3.ObjectID
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
      WHERE t1.MessageType = 'CardAdmitted'
        AND t1.ObjectName2 LIKE '%HQ%'
        AND t1.MessageUTC >= DATEADD(MINUTE, t1.MessageLocaleOffset, @since)
      ORDER BY t1.MessageUTC ASC
    `;

    const t0 = Date.now();
    try {
      const { recordset } = await safeQueryWithTimeout(req, queryText, 60000); // 60s timeout
      const took = Date.now() - t0;
      console.log(`[DENVER] fetchNewEvents: got ${recordset.length} rows in ${took}ms`);
      return recordset || [];
    } catch (err) {
      console.error(`❌ Attempt ${attempt}: fetchNewEvents query error:`, err.message);
      
      // Reset pool on timeout
      if (err.message.includes('timed out') || err.code === 'ECANCEL') {
        try {
          if (pool && typeof pool.close === 'function') {
            await pool.close();
          }
        } catch (e) { /* ignore */ }
        denverPoolPromise = null;
      }

      if (attempt === maxRetries) {
        console.error('❌ All retry attempts failed for fetchNewEvents');
        return [];
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 3000 * attempt));
    }
  }
  return [];
}