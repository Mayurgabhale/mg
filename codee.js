// --- Cached DB list helper (keeps list in memory for 1 hour) ---
let cachedDbs = null;
let lastDbFetch = 0;

async function getJournalDbs(pool) {
  const now = Date.now();
  if (cachedDbs && (now - lastDbFetch) < 60 * 60 * 1000) {
    return cachedDbs;
  }
  const dbResult = await pool.request().query(`
    SELECT name 
    FROM sys.databases
    WHERE name LIKE 'ACVSUJournal[_]%'
    ORDER BY CAST(REPLACE(name, 'ACVSUJournal_', '') AS INT)
  `);
  cachedDbs = dbResult.recordset.map(r => r.name);
  lastDbFetch = now;
  return cachedDbs;
}


// --- Optimized fetchHistoricalData (no date filter, all columns kept) ---
exports.fetchHistoricalData = async ({ location = null }) => {
  const pool = await poolPromise;

  // 1️⃣ Cached DB list
  const databases = await getJournalDbs(pool);
  const selectedDbs = databases.slice(-2); // newest + previous

  if (selectedDbs.length === 0) {
    throw new Error("No ACVSUJournal_* databases found.");
  }

  // 2️⃣ Build location filter
  const outerFilter = location
    ? `WHERE PartitionNameFriendly = @location`
    : `WHERE PartitionNameFriendly IN (${quoteList([
        'Pune','Quezon City','JP.Tokyo','MY.Kuala Lumpur','Taguig City','IN.HYD'
      ])})`;

  // 3️⃣ Build UNION query dynamically (same columns, all kept)
  const unionQueries = selectedDbs.map(db => `
    SELECT
      DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
      t1.ObjectName1,
      t1.ObjectName2               AS Door,
      CASE WHEN t2.Int1 = 0 THEN t2.Text12 ELSE CAST(t2.Int1 AS NVARCHAR) END AS EmployeeID,
      t3.Name                      AS PersonnelType,
      t1.ObjectIdentity1           AS PersonGUID,
      t2.Text4                     AS CompanyName,
      t2.Text5                     AS PrimaryLocation,
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
      ) AS PartitionNameFriendly,
      COALESCE(
        TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
        TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
        sc.value
      ) AS CardNumber,
      t5d.value AS Direction
    FROM ${db}.dbo.ACVSUJournalLog t1
    JOIN ACVSCore.Access.Personnel       t2 ON t1.ObjectIdentity1 = t2.GUID
    JOIN ACVSCore.Access.PersonnelType   t3 ON t2.PersonnelTypeID = t3.ObjectID
    LEFT JOIN ${db}.dbo.ACVSUJournalLogxmlShred t5d
      ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')
    LEFT JOIN ${db}.dbo.ACVSUJournalLogxml t_xml
      ON t1.XmlGUID = t_xml.GUID
    LEFT JOIN (
      SELECT GUID, value
      FROM ${db}.dbo.ACVSUJournalLogxmlShred
      WHERE Name IN ('Card','CHUID')
    ) AS sc
      ON t1.XmlGUID = sc.GUID
    WHERE t1.MessageType = 'CardAdmitted'
  `).join('\nUNION ALL\n');

  // 4️⃣ SQL dedupe inside SQL itself (instead of Node.js reduce)
  const query = `
    WITH Hist AS (
      ${unionQueries}
    ),
    Ranked AS (
      SELECT *,
             ROW_NUMBER() OVER (
               PARTITION BY CONVERT(date, LocaleMessageTime), PersonGUID
               ORDER BY LocaleMessageTime ASC
             ) AS rn
      FROM Hist
    )
    SELECT *
    FROM Ranked
    WHERE rn = 1
    ${outerFilter}
    ORDER BY LocaleMessageTime ASC;
  `;

  // 5️⃣ Run SQL
  const req = pool.request();
  if (location) req.input('location', sql.NVarChar, location);
  const result = await req.query(query);
  return result.recordset;
};

// keep alias for compatibility
exports.fetchHistoricalOccupancy = async (location) =>
  exports.fetchHistoricalData({ location: location || null });