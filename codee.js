// inside controllers/denverLiveOccupancyController.js
// make sure at top you still have:
// const { denver } = require('../config/siteConfig');
// const sql = require('mssql');

async function fetchNewEvents(since) {
  let pool;
  try {
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
  // rely on pool/request requestTimeout (configured in siteConfig)
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
  `;

  const t0 = Date.now();
  try {
    const { recordset } = await req.query(queryText);
    const took = Date.now() - t0;
    // helpful debug log — remove or lower log-level in production
    console.log(`[DENVER] fetchNewEvents: got ${recordset.length} rows (took ${took}ms)`);
    return recordset || [];
  } catch (err) {
    // Something timed out or tarn failed to acquire a connection
    console.error('❌ fetchNewEvents query error — resetting Denver poolPromise:', err);

    // Reset pool reference so next call triggers a fresh getDenverPool()
    try { 
      // set underlying stored promise variable to null (so getDenverPool can recreate)
      // NOTE: siteConfig stores denverPoolPromise internally; we don't have direct access to it,
      // but clearing any existing resolved pool connection is important. If connection object is present,
      // try closing it to free resources.
      if (pool && typeof pool.close === 'function') {
        try { await pool.close(); } catch (e) { /* ignore close errors */ }
      }
    } catch (e) { /* ignore */ }

    // Invalidate exported pool promise by setting denver._forceReset = true (optional)
    // The most reliable pattern: let the next caller call denver.getPool() which will recreate.
    // Return empty result so caller can back off gracefully.
    return [];
  }
}