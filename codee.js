// Put these near the top of the module (once)
const RESULT_CACHE_TTL_MS = 30 * 1000; // 30s — tune as needed
const DBLIST_CACHE_TTL_MS = 60 * 1000;  // 60s — tune as needed

// simple in-memory caches
const _resultCache = new Map(); // key -> { ts, data }
let _cachedDbList = null;
let _cachedDbListTs = 0;

/**
 * Keep the same exported wrapper
 */
exports.fetchHistoricalOccupancy = async (location) =>
  exports.fetchHistoricalData({ location: location || null });

/**
 * Replacement fetchHistoricalData that preserves your SQL logic exactly
 * but adds: 1) result-level caching and 2) sys.databases caching + timing logs.
 */
exports.fetchHistoricalData = async ({ location = null }) => {
  const pool = await poolPromise;

  const overallStart = Date.now();
  const cacheKey = `hist:${location || '__ALL__'}`;

  // 0) If we have a fresh cached result, return immediately (no SQL run)
  const cached = _resultCache.get(cacheKey);
  if (cached && (Date.now() - cached.ts) < RESULT_CACHE_TTL_MS) {
    console.log(`[occupancy] returning cached historical result (location=${location}) age=${Date.now()-cached.ts}ms`);
    return cached.data;
  }

  // 1. Get all ACVSUJournal_* database names dynamically (cached)
  if (!_cachedDbList || (Date.now() - _cachedDbListTs) > DBLIST_CACHE_TTL_MS) {
    const dbStart = Date.now();
    const dbResult = await pool.request().query(`
      SELECT name 
      FROM sys.databases
      WHERE name LIKE 'ACVSUJournal[_]%'
      ORDER BY CAST(REPLACE(name, 'ACVSUJournal_', '') AS INT)
    `);
    _cachedDbList = dbResult.recordset.map(r => r.name);
    _cachedDbListTs = Date.now();
    console.log(`[occupancy] refreshed db list in ${Date.now()-dbStart}ms (count=${_cachedDbList.length})`);
  }

  // Map DBs and pick last 2 only
  const databases = _cachedDbList;
  const selectedDbs = databases.slice(-2); // newest and previous

  if (selectedDbs.length === 0) {
    throw new Error("No ACVSUJournal_* databases found.");
  }

  // 2. Outer filter (unchanged)
  const outerFilter = location
    ? `WHERE PartitionNameFriendly = @location`
    : `WHERE PartitionNameFriendly IN (${quoteList([
        'Pune','Quezon City','JP.Tokyo','MY.Kuala Lumpur','Taguig City','IN.HYD'
      ])})`;

  // 3. Build UNION ALL query across selected DBs only (UNCHANGED SQL)
  const unionQueries = selectedDbs.map(db => `
    SELECT
      DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
      t1.ObjectName1,
      t1.ObjectName2               AS Door,
      CASE WHEN t2.Int1 = 0 THEN t2.Text12 ELSE CAST(t2.Int1 AS NVARCHAR) END AS EmployeeID,
      t3.Name                      AS PersonnelType,
      t1.ObjectIdentity1           AS PersonGUID,
     t2.Text4                   AS CompanyName,   -- ✅ company
     t2.Text5                   AS PrimaryLocation, -- ✅ location
      COALESCE(
        CASE
          WHEN t1.ObjectName2 LIKE 'APAC_PI%'   THEN 'Taguig City'
          WHEN t1.ObjectName2 LIKE 'APAC_PH%'   THEN 'Quezon City'
          WHEN t1.ObjectName2 LIKE '%PUN%'      THEN 'Pune'
          WHEN t1.ObjectName2 LIKE 'APAC_JPN%'  THEN 'JP.Tokyo'
          WHEN t1.ObjectName2 LIKE 'APAC_MY%'   THEN 'MY.Kuala Lumpur'
          WHEN t1.ObjectName2 LIKE 'APAC_HYD%'   THEN 'IN.HYD'
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
      ON t1.XmlGUID = t5d.GUID 
      AND t5d.Value IN ('InDirection','OutDirection')

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

  // 4. Final query (unchanged)
  const query = `
    WITH Hist AS (
      ${unionQueries}
    )
    SELECT *
    FROM Hist
    ${outerFilter}
    ORDER BY LocaleMessageTime ASC;
  `;

  // instrumentation: log query length in case it's huge
  console.log(`[occupancy] executing historical query (location=${location}) SQL-len=${query.length}`);

  const reqStart = Date.now();
  const req = pool.request();
  if (location) {
    req.input('location', sql.NVarChar, location);
  }

  const result = await req.query(query);
  const dur = Date.now() - reqStart;
  console.log(`[occupancy] SQL executed in ${dur}ms, rows=${result.recordset.length}; overall ${(Date.now()-overallStart)}ms`);

  // save result in cache
  try {
    _resultCache.set(cacheKey, { ts: Date.now(), data: result.recordset });
  } catch (e) {
    // if caching fails for any reason, still return result
    console.warn('[occupancy] result caching failed', e);
  }

  return result.recordset;
};

// keep this for occupancy (no change)
exports.fetchHistoricalOccupancy = async (location) =>
  exports.fetchHistoricalData({ location: location || null });