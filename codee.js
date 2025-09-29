// node code snippet to replace fetchHistoricalData
const sql = require('mssql');

let cachedDbs = null;
let cachedDbsExpires = 0;
const DBS_TTL_MS = 60 * 1000; // 60s - tune as needed

exports.fetchHistoricalData = async ({ location = null, start = null, end = null } = {}) => {
  const pool = await poolPromise;

  // 0. validate / normalize date inputs - if none provided, restrict to last N days (VERY IMPORTANT)
  // If you can't accept start/end, set a default window (e.g. last 90 days) to avoid full-table scans.
  const now = new Date();
  if (!end) end = new Date(now); // now
  if (!start) {
    // default window: last 90 days (tune to your needs). This prevents huge scans.
    const d = new Date(end);
    d.setDate(d.getDate() - 90);
    start = d;
  }

  // 1. cache db names to avoid querying sys.databases on every request
  if (!cachedDbs || Date.now() > cachedDbsExpires) {
    const dbResult = await pool.request().query(`
      SELECT name 
      FROM sys.databases
      WHERE name LIKE 'ACVSUJournal[_]%'
      ORDER BY CAST(REPLACE(name, 'ACVSUJournal_', '') AS INT)
    `);
    cachedDbs = dbResult.recordset.map(r => r.name);
    cachedDbsExpires = Date.now() + DBS_TTL_MS;
  }

  // only use last 2 DBs
  const selectedDbs = cachedDbs.slice(-2);
  if (selectedDbs.length === 0) throw new Error("No ACVSUJournal_* databases found.");

  // 2. Build per-db SELECTs with CROSS APPLY (compute PartitionNameFriendly early) and XML parse once
  const perDbSelects = selectedDbs.map(db => `
    SELECT
      LocaleMessageTime, ObjectName1, Door, EmployeeID, PersonnelType, PersonGUID,
      CompanyName, PrimaryLocation, PartitionNameFriendly, CardNumber, Direction, MessageUTC
    FROM (
      SELECT 
        DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
        t1.MessageUTC,
        t1.ObjectName1,
        t1.ObjectName2 AS Door,
        CASE WHEN t2.Int1 = 0 THEN t2.Text12 ELSE CAST(t2.Int1 AS NVARCHAR) END AS EmployeeID,
        t3.Name AS PersonnelType,
        t1.ObjectIdentity1 AS PersonGUID,
        t2.Text4 AS CompanyName,
        t2.Text5 AS PrimaryLocation,
        -- compute PartitionNameFriendly once via CROSS APPLY below
        p.PartitionNameFriendly,
        x.CardNumber,
        t5d.value AS Direction
      FROM ${db}.dbo.ACVSUJournalLog t1
      JOIN ACVSCore.Access.Personnel t2 ON t1.ObjectIdentity1 = t2.GUID
      JOIN ACVSCore.Access.PersonnelType t3 ON t2.PersonnelTypeID = t3.ObjectID

      LEFT JOIN ${db}.dbo.ACVSUJournalLogxmlShred t5d
        ON t1.XmlGUID = t5d.GUID 
        AND t5d.Value IN ('InDirection','OutDirection')

      LEFT JOIN ${db}.dbo.ACVSUJournalLogxml t_xml
        ON t1.XmlGUID = t_xml.GUID

      -- parse XML once using CROSS APPLY
      CROSS APPLY (
        SELECT
          TRY_CAST(t_xml.XmlMessage AS XML) AS xm
      ) AS xmlparse
      CROSS APPLY (
        SELECT
          xmlparse.xm.value('(/LogMessage/CHUID/Card)[1]','varchar(50)') as Card1,
          xmlparse.xm.value('(/LogMessage/CHUID)[1]','varchar(50)') as Card2
      ) AS xmlvals
      CROSS APPLY (
        SELECT COALESCE(NULLIF(xmlvals.Card1,''), NULLIF(xmlvals.Card2,''), sc.value) AS CardNumber
      ) AS x

      LEFT JOIN (
        SELECT GUID, value
        FROM ${db}.dbo.ACVSUJournalLogxmlShred
        WHERE Name IN ('Card','CHUID')
      ) AS sc
        ON t1.XmlGUID = sc.GUID

      -- compute friendly partition name once and allow WHERE to filter on it
      CROSS APPLY (
        SELECT
          COALESCE(
            CASE
              WHEN t1.ObjectName2 LIKE 'APAC_PI%'   THEN 'Taguig City'
              WHEN t1.ObjectName2 LIKE 'APAC_PH%'   THEN 'Quezon City'
              WHEN t1.ObjectName2 LIKE '%PUN%'      THEN 'Pune'
              WHEN t1.ObjectName2 LIKE 'APAC_JPN%'  THEN 'JP.Tokyo'
              WHEN t1.ObjectName2 LIKE 'APAC_MY%'   THEN 'MY.Kuala Lumpur'
              WHEN t1.ObjectName2 LIKE 'APAC_HYD%'  THEN 'IN.HYD'
              ELSE t1.PartitionName2
            END,
            'APAC.Default'
          ) AS PartitionNameFriendly
      ) AS p

      WHERE t1.MessageType = 'CardAdmitted'
        AND t1.MessageUTC BETWEEN @start AND @end
    ) AS t_filtered
    WHERE (
      (@location IS NULL AND t_filtered.PartitionNameFriendly IN ('Pune','Quezon City','JP.Tokyo','MY.Kuala Lumpur','Taguig City','IN.HYD'))
      OR (@location IS NOT NULL AND t_filtered.PartitionNameFriendly = @location)
    )
  `).join('\nUNION ALL\n');

  // 3. Dedupe first swipe per person/day in SQL using ROW_NUMBER -> return only rn = 1
  const finalQuery = `
    WITH HistAll AS (
      ${perDbSelects}
    ),
    HistRanked AS (
      SELECT *,
        ROW_NUMBER() OVER (PARTITION BY PersonGUID, CAST(LocaleMessageTime AS DATE) ORDER BY LocaleMessageTime ASC) AS rn
      FROM HistAll
    )
    SELECT LocaleMessageTime, ObjectName1, Door, EmployeeID, PersonnelType, PersonGUID,
      CompanyName, PrimaryLocation, PartitionNameFriendly, CardNumber, Direction, MessageUTC
    FROM HistRanked
    WHERE rn = 1
    ORDER BY LocaleMessageTime ASC;
  `;

  const req = pool.request();
  req.input('start', sql.DateTime2, start);
  req.input('end', sql.DateTime2, end);
  req.input('location', sql.NVarChar, location);

  const result = await req.query(finalQuery);
  return result.recordset;
};