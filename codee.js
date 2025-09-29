exports.fetchHistoricalData = async ({ location = null }) => {
  const pool = await poolPromise;

  const dbResult = await pool.request().query(`
    SELECT TOP (2) name
    FROM sys.databases
    WHERE name LIKE 'ACVSUJournal[_]%'
    ORDER BY CAST(REPLACE(name, 'ACVSUJournal_', '') AS INT) DESC
  `);
  const databases = dbResult.recordset.map(r => r.name).reverse();
  if (databases.length === 0) {
    throw new Error("No ACVSUJournal_* databases found.");
  }

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
    if (locationPatterns[location]) {
      perDbWhereClause = `AND ${locationPatterns[location]}`;
    } else {
      perDbWhereClause = `AND t1.PartitionName2 = @location`;
    }
  } else {
    const patterns = [
      "t1.ObjectName2 LIKE 'APAC_PI%'", "t1.ObjectName2 LIKE 'APAC_PH%'", "t1.ObjectName2 LIKE '%PUN%'", "t1.ObjectName2 LIKE 'APAC_JPN%'", "t1.ObjectName2 LIKE 'APAC_MY%'", "t1.ObjectName2 LIKE 'APAC_HYD%'"
    ];
    const partitionEquals = defaultPartitionsList.map(p => `t1.PartitionName2 = '${p.replace("'", "''")}'`);
    perDbWhereClause = `AND ( ${patterns.join(' OR ')} OR ${partitionEquals.join(' OR ')} )`;
  }

  const perDbQueries = databases.map(db => {
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
          scVal.value
        ) AS CardNumber,
        t5d.value AS Direction
      FROM ${db}.dbo.ACVSUJournalLog t1
      JOIN ACVSCore.Access.Personnel       t2 ON t1.ObjectIdentity1 = t2.GUID
      JOIN ACVSCore.Access.PersonnelType   t3 ON t2.PersonnelTypeID = t3.ObjectID

      -- bring t_xml into scope before using it in OUTER APPLY
      LEFT JOIN ${db}.dbo.ACVSUJournalLogxml t_xml
        ON t1.XmlGUID = t_xml.GUID

      -- parse XML once per row (t_xml is now available)
      OUTER APPLY (
        SELECT TRY_CAST(t_xml.XmlMessage AS XML) AS xm
      ) AS parsed

      OUTER APPLY (
        SELECT
          parsed.xm.value('(/LogMessage/CHUID/Card)[1]','varchar(50)') AS CardValue,
          parsed.xm.value('(/LogMessage/CHUID)[1]','varchar(50)') AS CHUIDValue
      ) AS xmlvals

      LEFT JOIN ${db}.dbo.ACVSUJournalLogxmlShred t5d
        ON t1.XmlGUID = t5d.GUID 
        AND t5d.Value IN ('InDirection','OutDirection')

      -- correlated OUTER APPLY to fetch first Card/CHUID shred value for this row (avoids unbound/ambig joins)
      OUTER APPLY (
        SELECT TOP (1) s.value
        FROM ${db}.dbo.ACVSUJournalLogxmlShred s
        WHERE s.GUID = t1.XmlGUID AND s.Name IN ('Card','CHUID')
      ) AS scVal(value)

      WHERE t1.MessageType = 'CardAdmitted'
        ${perDbWhereClause}
    `;
  });

  const queryPromises = perDbQueries.map(q => {
    const req = pool.request();
    if (location && !locationPatterns[location]) {
      req.input('location', sql.NVarChar, location);
    }
    return req.query(q);
  });

  const results = await Promise.all(queryPromises);
  const rows = results.flatMap(r => r.recordset);

  let finalRows = rows;
  if (location) {
    finalRows = rows.filter(r => r.PartitionNameFriendly === location);
  }

  finalRows.sort((a, b) => new Date(a.LocaleMessageTime) - new Date(b.LocaleMessageTime));

  return finalRows;
};