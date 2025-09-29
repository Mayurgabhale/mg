// (Assumes `poolPromise` and `sql` are in scope as they were before)
exports.fetchHistoricalData = async ({ location = null }) => {
  const pool = await poolPromise;

  // 1) Get the last 2 ACVSUJournal_* DB names only (avoid enumerating ALL databases)
  const dbResult = await pool.request().query(`
    SELECT TOP (2) name
    FROM sys.databases
    WHERE name LIKE 'ACVSUJournal[_]%'
    ORDER BY CAST(REPLACE(name, 'ACVSUJournal_', '') AS INT) DESC
  `);
  const databases = dbResult.recordset.map(r => r.name).reverse(); // keep ascending order like your old logic (older, newest)
  if (databases.length === 0) {
    throw new Error("No ACVSUJournal_* databases found.");
  }

  // 2) Build a SQL fragment to narrow scans by ObjectName2 / PartitionName2 when possible.
  // This maps the same patterns you used in the original SELECT's COALESCE CASE.
  // When `location` is provided, we attempt to filter by the relevant pattern for that single location.
  // When null, we restrict to the set of partitions you previously used.
  const locationPatterns = {
    'Taguig City': "(t1.ObjectName2 LIKE 'APAC_PI%')",
    'Quezon City': "(t1.ObjectName2 LIKE 'APAC_PH%')",
    'Pune': "(t1.ObjectName2 LIKE '%PUN%')",
    'JP.Tokyo': "(t1.ObjectName2 LIKE 'APAC_JPN%')",
    'MY.Kuala Lumpur': "(t1.ObjectName2 LIKE 'APAC_MY%')",
    'IN.HYD': "(t1.ObjectName2 LIKE 'APAC_HYD%')"
  };

  const defaultPartitionsList = [
    'Pune','Quezon City','JP.Tokyo','MY.Kuala Lumpur','Taguig City','IN.HYD'
  ];

  let perDbWhereClause = '';

  if (location) {
    // If location matches one of the known partitions, use pattern to push down filter.
    if (locationPatterns[location]) {
      perDbWhereClause = `AND ${locationPatterns[location]}`;
    } else {
      // fallback: if unknown location string is passed, use the PartitionName2 equality check (still helps).
      perDbWhereClause = `AND t1.PartitionName2 = @location`;
    }
  } else {
    // restrict to the small set of partitions we care about (push filter into each DB query)
    // Use both ObjectName2 patterns and PartitionName2 fallback to catch both forms.
    const patterns = [
      "t1.ObjectName2 LIKE 'APAC_PI%'",   // Taguig City
      "t1.ObjectName2 LIKE 'APAC_PH%'",   // Quezon City
      "t1.ObjectName2 LIKE '%PUN%'",      // Pune
      "t1.ObjectName2 LIKE 'APAC_JPN%'",  // JP.Tokyo
      "t1.ObjectName2 LIKE 'APAC_MY%'",   // MY.Kuala Lumpur
      "t1.ObjectName2 LIKE 'APAC_HYD%'"   // IN.HYD
    ];
    const partitionEquals = defaultPartitionsList.map(p => `t1.PartitionName2 = '${p.replace("'", "''")}'`);
    perDbWhereClause = `AND ( ${patterns.join(' OR ')} OR ${partitionEquals.join(' OR ')} )`;
  }

  // 3) For each selected DB, build a per-db query and run them in parallel.
  // We avoid a giant UNION ALL in SQL Server which can cause long compile/scan times.
  // We parse the XML once per-row via OUTER APPLY to get CardNumber, and select only required columns.
  const perDbQueries = databases.map(db => {
    // per-db SQL - keep same projected columns and same PartitionNameFriendly CASE as before
    // Note: use OUTER APPLY to parse Xml once per row and to fetch shredded values efficiently
    return `
      SELECT
        DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
        t1.ObjectName1,
        t1.ObjectName2               AS Door,
        CASE WHEN t2.Int1 = 0 THEN t2.Text12 ELSE CAST(t2.Int1 AS NVARCHAR) END AS EmployeeID,
        t3.Name                      AS PersonnelType,
        t1.ObjectIdentity1           AS PersonGUID,
        t2.Text4                   AS CompanyName,
        t2.Text5                   AS PrimaryLocation,
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
          xmlvals.CardValue,
          xmlvals.CHUIDValue,
          sc.value
        ) AS CardNumber,
        t5d.value AS Direction
      FROM ${db}.dbo.ACVSUJournalLog t1
      JOIN ACVSCore.Access.Personnel       t2 ON t1.ObjectIdentity1 = t2.GUID
      JOIN ACVSCore.Access.PersonnelType   t3 ON t2.PersonnelTypeID = t3.ObjectID

      -- parse XML once per row
      OUTER APPLY (
        SELECT
          TRY_CAST(t_xml.XmlMessage AS XML) AS xm
      ) AS parsed

      OUTER APPLY (
        SELECT
          parsed.xm.value('(/LogMessage/CHUID/Card)[1]','varchar(50)') AS CardValue,
          parsed.xm.value('(/LogMessage/CHUID)[1]','varchar(50)') AS CHUIDValue
      ) AS xmlvals

      LEFT JOIN ${db}.dbo.ACVSUJournalLogxmlShred t5d
        ON t1.XmlGUID = t5d.GUID 
        AND t5d.Value IN ('InDirection','OutDirection')

      LEFT JOIN ${db}.dbo.ACVSUJournalLogxml t_xml
        ON t1.XmlGUID = t_xml.GUID

      LEFT JOIN (
        SELECT TOP (1) GUID, value
        FROM ${db}.dbo.ACVSUJournalLogxmlShred
        WHERE Name IN ('Card','CHUID')
      ) AS sc
        ON t1.XmlGUID = sc.GUID

      WHERE t1.MessageType = 'CardAdmitted'
        ${perDbWhereClause}
    `;
  });

  // 4) Execute all per-db queries in parallel (each using its own request)
  const queryPromises = perDbQueries.map(q => {
    const req = pool.request();
    if (location && !locationPatterns[location]) {
      // only bind `@location` when we will use it (the case when unknown location string passed)
      req.input('location', sql.NVarChar, location);
    }
    return req.query(q);
  });

  // Await all queries concurrently and merge results client-side
  const results = await Promise.all(queryPromises);
  const rows = results.flatMap(r => r.recordset);

  // 5) Apply the outerFilter if `location` was provided but matched a known pattern that we used
  // to pushdown the filter earlier. When the location was a pattern-mapped value we already applied
  // the equivalent filter in SQL; but to be identical to original behavior we can additionally
  // do a final JS-level filter using PartitionNameFriendly when the caller explicitly passed `location`.
  let finalRows = rows;
  if (location) {
    // keep exactly same behavior as original: filter by PartitionNameFriendly = @location
    finalRows = rows.filter(r => r.PartitionNameFriendly === location);
  } else {
    // when no location provided, original used outer filter: WHERE PartitionNameFriendly IN (the set)
    // we already pushed a similar filter into SQL, so no-op here.
  }

  // 6) Sort on LocaleMessageTime ASC (your original final ORDER BY)
  finalRows.sort((a, b) => new Date(a.LocaleMessageTime) - new Date(b.LocaleMessageTime));

  return finalRows;
};