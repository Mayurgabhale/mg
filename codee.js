http://localhost:3007/api/occupancy/live-summary

i want to show Hyderabad

IN.HYD": { <<< 
      "total": 2,
      "Employee": 0,
      "Contractor": 2,
      "floors": {

      },
{
  "success": true,
  "today": {
    "total": 125,
    "Employee": 56,
    "Contractor": 69
  },
  "realtime": {
    "Pune": {
      "total": 26,
      "Employee": 0,
      "Contractor": 26,
      "floors": {
        "Podium Floor": 22,
        "Tower B": 2,
        "2nd Floor": 2
      },
      "zones": {
        "Reception Area": 5,
        "Yellow Zone - Outer Area": 4,
        "Orange Zone": 1,
        "Yellow Zone": 10,
        "Red Zone": 1,
        "Tower B": 2,
        "Green Zone": 1,
        "2nd Floor, Pune": 2
      }
    },
    "Quezon City": {
      "total": 29,
      "Employee": 13,
      "Contractor": 16,
      "floors": {
        "6th Floor": 20,
        "7th Floor": 9
      },
      "zones": {
        "6th Floor": 20,
        "7th Floor": 9
      }
    },
    "IN.HYD": {
      "total": 2,
      "Employee": 0,
      "Contractor": 2,
      "floors": {

      },
      "zones": {
        "HYD_2NDFLR": 2
      }
    },
    "JP.Tokyo": {
      "total": 1,
      "Employee": 1,
      "Contractor": 0,
      "floors": {


        
//C:\Users\W0024618\Desktop\apac-occupancy-backend\src\services\occupancy.service.js

const { poolPromise, sql } = require('../config/db');

const partitionList = [
  'APAC.Default',
  'JP.Tokyo',
  'PH.Manila',
  'MY.Kuala Lumpur',
  'IN.Pune',
  'IN.HYD'
];



function quoteList(arr) {
  return arr.map(p => `'${p.replace("'", "''")}'`).join(',');
}

/**
 * Live occupancy (today) for APAC
 */
exports.fetchLiveOccupancy = async () => {
  const pool = await poolPromise;
  const parts = quoteList(partitionList);

  const query = `

    WITH CombinedEmployeeData AS (
      SELECT
        t1.ObjectName1,
        t1.ObjectName2             AS Door,               -- include Door
        CASE WHEN t2.Int1 = 0 THEN t2.Text12 ELSE CAST(t2.Int1 AS NVARCHAR) END AS EmployeeID,
        t3.Name                    AS PersonnelType,
        t1.ObjectIdentity1         AS PersonGUID,
        -- extract CardNumber from XML or shred table
        COALESCE(
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
          sc.value
        )                          AS CardNumber,
        CASE
          WHEN t1.ObjectName2 LIKE 'APAC_PI%' THEN 'Taguig City'
          WHEN t1.ObjectName2 LIKE 'APAC_PH%' THEN 'Quezon City'
          WHEN t1.ObjectName2 LIKE '%PUN%'   THEN 'Pune'
          WHEN t1.ObjectName2 LIKE 'APAC_JPN%' THEN 'JP.Tokyo'
          WHEN t1.ObjectName2 LIKE 'APAC_MY%'  THEN 'MY.Kuala Lumpur'
          WHEN t1.ObjectName2 LIKE 'IN.HYD%'  THEN 'Hydrabad'
          ELSE t1.PartitionName2
        END                        AS PartitionName2,
        DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
        t5d.value                  AS Direction,
        t2.Text4                   AS CompanyName,        -- ✅ added
        t2.Text5                   AS PrimaryLocation     -- ✅ added
      FROM ACVSUJournal_00010029.dbo.ACVSUJournalLog t1
      JOIN ACVSCore.Access.Personnel       t2 ON t1.ObjectIdentity1 = t2.GUID
      JOIN ACVSCore.Access.PersonnelType   t3 ON t2.PersonnelTypeID = t3.ObjectID

      LEFT JOIN ACVSUJournal_00010029.dbo.ACVSUJournalLogxmlShred t5d
      ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')

      LEFT JOIN ACVSUJournal_00010029.dbo.ACVSUJournalLogxml t_xml
        ON t1.XmlGUID = t_xml.GUID
      LEFT JOIN (
        SELECT GUID, value
        FROM ACVSUJournal_00010029.dbo.ACVSUJournalLogxmlShred
        WHERE Name IN ('Card','CHUID')
      ) AS sc
        ON t1.XmlGUID = sc.GUID
      WHERE
        t1.MessageType = 'CardAdmitted'
        AND t1.PartitionName2 IN (${parts})
        AND CONVERT(DATE, DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC))
            = CONVERT(DATE, GETDATE())
    ), Ranked AS (
      SELECT *,
        ROW_NUMBER() OVER (PARTITION BY PersonGUID ORDER BY LocaleMessageTime DESC) AS rn
      FROM CombinedEmployeeData
      
    )
    SELECT
      ObjectName1,
      Door,                            -- door
      PersonnelType,
      EmployeeID,
      CardNumber,                      -- now returned
      PartitionName2,
      LocaleMessageTime,
      Direction,
      PersonGUID,
      CompanyName,                      -- ✅ added
      PrimaryLocation                   -- ✅ added
    FROM Ranked
    WHERE rn = 1;
  `;

  const result = await pool.request().query(query);
  return result.recordset;
};




exports.fetchHistoricalOccupancy = async (location) =>
  exports.fetchHistoricalData({ location: location || null });

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
        'Pune','Quezon City','JP.Tokyo','MY.Kuala Lumpur','Taguig City','Hydrabad'
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
          WHEN t1.ObjectName2 LIKE 'APAC_HYD%'   THEN 'Hydrabad'
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

  // 4. Final query
  const query = `
    WITH Hist AS (
      ${unionQueries}
    )
    SELECT *
    FROM Hist
    ${outerFilter}
    ORDER BY LocaleMessageTime ASC;
  `;

  const req = pool.request();
  if (location) {
    req.input('location', sql.NVarChar, location);
  }
  const result = await req.query(query);
  return result.recordset;
};

// keep this for occupancy
exports.fetchHistoricalOccupancy = async (location) =>
  exports.fetchHistoricalData({ location: location || null });


        "Tokyo": 1
