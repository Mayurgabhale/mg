in this history i want ot remove Shift only this 

exports.fetchHistoricalData = async ({ location = null }) => {
  const pool = await poolPromise;

  // 1. Get all ACVSUJournal_* database names dynamically
  const dbResult = await pool.request().query(`
    SELECT name 
    FROM sys.databases
    WHERE name LIKE 'ACVSUJournal[_]%'
    ORDER BY CAST(REPLACE(name, 'ACVSUJournal_', '') AS INT)
  `);

  // Map DBs and pick last 2 only
  const databases = dbResult.recordset.map(r => r.name);
  const selectedDbs = databases.slice(-2); // newest and previous

  if (selectedDbs.length === 0) {
    throw new Error("No ACVSUJournal_* databases found.");
  }

  // 2. Outer filter
  const outerFilter = location
    ? `WHERE PartitionNameFriendly = @location`
    : `WHERE PartitionNameFriendly IN (${quoteList([
        'Pune','Quezon City','JP.Tokyo','MY.Kuala Lumpur','Taguig City','IN.HYD'
      ])})`;

  // 3. Build UNION ALL query across selected DBs only



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
          WHEN t1.ObjectName2 LIKE 'IN.HYD%'   THEN 'IN.HYD'
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




////////////////////////////


//Abhishek//


const query = `
  WITH CombinedEmployeeData AS (
    -- As before
    SELECT
        t1.[ObjectName1] AS EmployeeName,
        CASE WHEN t2.[Int1] = 0 THEN t2.[Text12] ELSE CAST(t2.[Int1] AS NVARCHAR) END AS EmployeeID,
        t3.[Name] AS PersonnelType,
        DATEADD(MINUTE, -1 * t1.[MessageLocaleOffset], t1.[MessageUTC]) AS LocaleMessageTime,
        CASE
            WHEN t1.[PartitionName2] IN ('US.CO.OBS', 'USA/Canada Default') THEN 'HQ'
            ELSE t1.[PartitionName2]
        END AS Location
    FROM [ACVSUJournal_00010028].[dbo].[ACVSUJournalLog] AS t1
    INNER JOIN [ACVSCore].[Access].[Personnel] AS t2
        ON t1.ObjectIdentity1 = t2.GUID
    INNER JOIN [ACVSCore].[Access].[PersonnelType] AS t3
        ON t2.[PersonnelTypeID] = t3.[ObjectID]
),
SwipeSequence AS (
    SELECT
        EmployeeName,
        EmployeeID,
        PersonnelType,
        Location,
        LocaleMessageTime,
        LAG(LocaleMessageTime) OVER (PARTITION BY EmployeeID ORDER BY LocaleMessageTime) AS PrevTime,
        CONVERT(DATE, LocaleMessageTime) AS SwipeDate
    FROM CombinedEmployeeData
),

ShiftBoundaryDetection AS (
    SELECT
        EmployeeName,
        EmployeeID,
        PersonnelType,
        Location,
        LocaleMessageTime,
        SwipeDate,
        CASE WHEN PrevTime IS NULL THEN 1 ELSE 0 END AS IsFirstSwipe,
        -- Large gap (>6 hours, or >16 hours for same-day)
        CASE WHEN DATEDIFF(MINUTE, PrevTime, LocaleMessageTime) > 360 THEN 1 ELSE 0 END AS IsLargeGap,
        -- Is previous swipe on a different calendar day, or did the night pass?
        -- If so, "MaybeDailyReset" -- needs more logic below.
        CASE
            WHEN CONVERT(DATE, PrevTime) = CONVERT(DATE, LocaleMessageTime)
                AND DATEDIFF(MINUTE, PrevTime, LocaleMessageTime) > 960 THEN 1
            WHEN CONVERT(DATE, PrevTime) < CONVERT(DATE, LocaleMessageTime) THEN 1
            ELSE 0
        END AS MaybeDailyReset,
        -- Is this a night shift spanning midnight?
        -- If PrevTime on previous date, LocaleMessageTime early next day, and gap is "reasonable" (e.g., <3hrs), treat as same shift
        CASE
            WHEN PrevTime IS NULL THEN 0
            WHEN CONVERT(DATE, PrevTime) < CONVERT(DATE, LocaleMessageTime)
                AND DATEDIFF(MINUTE, PrevTime, LocaleMessageTime) <= 360  -- Up to 3 hours allowed
                AND CAST(PrevTime AS TIME) >= '20:00:00'                  -- Previous swipe late in the day
                AND CAST(LocaleMessageTime AS TIME) <= '09:00:00'         -- Next swipe early morning
                THEN 1                                                    -- THIS IS A NIGHT SHIFT
            ELSE 0
        END AS IsNightShiftSpan
    FROM SwipeSequence
),
-- Mark new shifts: either first swipe, large gap, daily reset, BUT NOT for night span
NewShiftMarkers AS (
    SELECT
        *,
        CASE
            WHEN IsFirstSwipe = 1 OR IsLargeGap = 1 OR (MaybeDailyReset = 1 AND IsNightShiftSpan = 0)
                THEN 1
                ELSE 0
        END AS IsNewShift
    FROM ShiftBoundaryDetection
),
ShiftGroups AS (
    SELECT
        EmployeeName,
        EmployeeID,
        PersonnelType,
        Location,
        LocaleMessageTime,
        SwipeDate,
        IsNightShiftSpan,
        SUM(IsNewShift) OVER (PARTITION BY EmployeeID ORDER BY LocaleMessageTime) AS ShiftID
    FROM NewShiftMarkers
),
-- Calculate shift duration only for shift-based locations
ShiftBoundaries AS (
    SELECT
        EmployeeName,
        EmployeeID,
        PersonnelType,
        Location,
        ShiftID,
        MIN(LocaleMessageTime) AS ShiftStart,
        MAX(LocaleMessageTime) AS ShiftEnd,
        DATEDIFF(MINUTE, MIN(LocaleMessageTime), MAX(LocaleMessageTime)) AS DurationMinutes
    FROM ShiftGroups
    WHERE Location IN ('PH.Manila', 'LT.Vilnius', 'CR.Costa Rica Partition')
    GROUP BY EmployeeName, EmployeeID, PersonnelType, Location, ShiftID
)
SELECT
    EmployeeName,
    EmployeeID,
    PersonnelType,
    Location,
    CONVERT(DATE, ShiftStart) AS AttendanceDate,
    ShiftStart,
    ShiftEnd,
    RIGHT('00' + CAST(DurationMinutes / 60 AS NVARCHAR), 2)
    + ':' +
    RIGHT('00' + CAST(DurationMinutes % 60 AS NVARCHAR), 2) AS DurationHours,
    CASE
        WHEN DurationMinutes < 5 THEN '0-5 mins'
        WHEN DurationMinutes < 30 THEN '5-30 mins'
        WHEN DurationMinutes < 60 THEN '30-60 mins'
        WHEN DurationMinutes < 180 THEN '1-3 hrs'
        WHEN DurationMinutes < 360 THEN '3-6 hrs'
        ELSE '6+ hrs'
    END AS TimeCategory
FROM ShiftBoundaries
 
UNION ALL
 
-- Daily-based calculation for all other locations (which now includes HQ)
SELECT
    EmployeeName,
    EmployeeID,
    PersonnelType,
    Location,
    SwipeDate AS AttendanceDate,
    MIN(LocaleMessageTime) AS FirstSwipeTime,
    MAX(LocaleMessageTime) AS LastSwipeTime,
    RIGHT('00' + CAST(DATEDIFF(MINUTE, MIN(LocaleMessageTime), MAX(LocaleMessageTime)) / 60 AS NVARCHAR), 2)
    + ':' +
    RIGHT('00' + CAST(DATEDIFF(MINUTE, MIN(LocaleMessageTime), MAX(LocaleMessageTime)) % 60 AS NVARCHAR), 2) AS DurationHours,
    CASE
        WHEN DATEDIFF(MINUTE, MIN(LocaleMessageTime), MAX(LocaleMessageTime)) < 5 THEN '0-5 mins'
        WHEN DATEDIFF(MINUTE, MIN(LocaleMessageTime), MAX(LocaleMessageTime)) < 30 THEN '5-30 mins'
        WHEN DATEDIFF(MINUTE, MIN(LocaleMessageTime), MAX(LocaleMessageTime)) < 60 THEN '30-60 mins'
        WHEN DATEDIFF(MINUTE, MIN(LocaleMessageTime), MAX(LocaleMessageTime)) < 180 THEN '1-3 hrs'
        WHEN DATEDIFF(MINUTE, MIN(LocaleMessageTime), MAX(LocaleMessageTime)) < 360 THEN '3-6 hrs'
        ELSE '6+ hrs'
    END AS TimeCategory
FROM ShiftGroups
WHERE Location NOT IN ('PH.Manila', 'LT.Vilnius', 'CR.Costa Rica Partition')
GROUP BY EmployeeName, EmployeeID, PersonnelType, Location, SwipeDate
ORDER BY EmployeeID, AttendanceDate DESC, ShiftStart DESC;
`;



/////////////////////////////

  const req = pool.request();
  if (location) {
    req.input('location', sql.NVarChar, location);
  }

// ---- Replace the simple query/mapping at the end with this mapping ----
const result = await req.query(query);

return result.recordset.map(r => {
  // ensure DurationSeconds is numeric (SQL may return as number or bigint)
  const durSec = r.DurationSeconds != null ? Number(r.DurationSeconds) : null;

  // format HH:MM:SS from seconds in a safe way (handles >24h if it occurs)
  const formatHMS = (secs) => {
    if (secs == null || Number.isNaN(secs)) return null;
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return {
    ...r,
    // keep raw DurationSeconds (optional) and add readable duration per day
    DurationSeconds: durSec,
    duration: durSec != null ? formatHMS(durSec) : null,
    // normalize FirstSwipe/LastSwipe to ISO strings (if they come back as Date objects)
    FirstSwipe: r.FirstSwipe ? (r.FirstSwipe instanceof Date ? r.FirstSwipe.toISOString() : String(r.FirstSwipe)) : null,
    LastSwipe: r.LastSwipe ? (r.LastSwipe instanceof Date ? r.LastSwipe.toISOString() : String(r.LastSwipe)) : null
  };
});

};
