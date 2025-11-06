this const partitionList = [
  'APAC.Default',
  'JP.Tokyo',
  'PH.Manila',
  'MY.Kuala Lumpur',
  'IN.Pune',
  'IN.HYD',
  'SG.Singapore'
];

this otehr and give me correct for Singapore ok 
read all code line by line ok 

//C:\Users\W0024618\Desktop\apac-occupancy-backend\src\services\occupancy.service.js

const { poolPromise, sql } = require('../config/db');

const partitionList = [
  'APAC.Default',
  'JP.Tokyo',
  'PH.Manila',
  'MY.Kuala Lumpur',
  'IN.Pune',
  'IN.HYD',
  'SG.Singapore'
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
          WHEN t1.ObjectName2 LIKE 'IN.HYD%'  THEN 'IN.HYD'
          WHEN t1.ObjectName2 LIKE 'SG.Singapore%'  THEN 'Singapore'

          ELSE t1.PartitionName2
        END                        AS PartitionName2,
        DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
        t5d.value                  AS Direction,
        t2.Text4                   AS CompanyName,        -- ✅ added
        t2.Text5                   AS PrimaryLocation     -- ✅ added
      FROM ACVSUJournal_00010030.dbo.ACVSUJournalLog t1
      JOIN ACVSCore.Access.Personnel       t2 ON t1.ObjectIdentity1 = t2.GUID
      JOIN ACVSCore.Access.PersonnelType   t3 ON t2.PersonnelTypeID = t3.ObjectID

      LEFT JOIN ACVSUJournal_00010030.dbo.ACVSUJournalLogxmlShred t5d
      ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')

      LEFT JOIN ACVSUJournal_00010030.dbo.ACVSUJournalLogxml t_xml
        ON t1.XmlGUID = t_xml.GUID
      LEFT JOIN (
        SELECT GUID, value
        FROM ACVSUJournal_00010030.dbo.ACVSUJournalLogxmlShred
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
        'Pune','Quezon City','JP.Tokyo','MY.Kuala Lumpur','Taguig City','IN.HYD','SG.Singapore'
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
          WHEN t1.ObjectName2 LIKE 'APAC_HYD%'   THEN 'IN.HYD'
          WHEN t1.ObjectName2 LIKE 'SG.Singapore%'   THEN 'SG.Singapore'
          

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



  // Podium / Turnstiles
  "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 1-DOOR___InDirection": "Reception Area",
  "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 2-DOOR___InDirection": "Reception Area",
  "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 3-DOOR___InDirection": "Reception Area",
  "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 4-DOOR___InDirection": "Reception Area",
  "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 2 -OUT DOOR___OutDirection": "Out of office",
  "APAC_IN_PUN-PODIUM_P-1 TURNSTILE 3 -OUT DOOR___OutDirection": "Out of office",
  "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 4 -OUT DOOR___OutDirection": "Out of office",
  "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 1-OUT DOOR___OutDirection": "Out of office",

  "APAC_IN_PUN-PODIUM_P-1 TURNSTILE 3 -OUT DOOR___OutDirection": "Out of office",
  "APAC_IN_PUN-PODIUM_P-1 TURNSTILE 3 -OUT DOOR___InDirection": "Reception Area",




  // 2nd-Floor / IDF + UPS/ELEC + Reception→Workstation + LiftLobby→Reception
  "APAC_IN_PUN_2NDFLR_IDF ROOM_10:05:86 RESTRICTED DOOR___InDirection": "2nd Floor, Pune",
  "APAC_IN_PUN_2NDFLR_UPS/ELEC ROOM RESTRICTED DOOR___InDirection": "2nd Floor, Pune",
  "APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR___InDirection": "2nd Floor, Pune",
  "APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR___OutDirection": "Out of office",
  "APAC_IN_PUN_2NDFLR_LIFTLOBBY TO RECEPTION EMTRY DOOR___InDirection": "2nd Floor, Pune",
  "APAC_IN_PUN_2NDFLR_LIFTLOBBY TO RECEPTION EMTRY DOOR___OutDirection": "2nd Floor, Pune",

  // Tower B
  "APAC_IN_PUN_TOWER B_MAIN RECEPTION DOOR___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_MAIN RECEPTION DOOR___OutDirection": "Out of office",
  "APAC_IN_PUN_TOWER B_LIFT LOBBY DOOR___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_LIFT LOBBY DOOR___OutDirection": "Out of office",
  "APAC_IN_PUN_TOWER B_ST6_GYM SIDE DOOR___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_ST6_GYM SIDE DOOR___OutDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_ST6_WKS SIDE DOOR___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_ST6_WKS SIDE DOOR___OutDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_ST5_KAPIL DEV DOOR___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_ST5_KAPIL DEV DOOR___OutDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_ST5_WKS SIDE DOOR___InDirection": "Tower B",
  "APAC_IN_PUN_TOWER B_ST5_WKS SIDE DOOR___OutDirection": "Tower B",


      
  "APAC_IN_HYD_2NDFLR_AHU ROOM 2___InDirection": "HYD_2NDFLR",


  "APAC_IN_HYD_2NDFLR_AHU ROOM 1___InDirection": "HYD_2NDFLR",


  "APAC_IN_HYD_2NDFLR_F&A WING SIDE ENTRY 1___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_F&A WING SIDE ENTRY 1___OutDirection": "Out of Office",

  "APAC_IN_HYD_2NDFLR_MAIN LIFT LOBBY ENTRY 2___InDirection": "HYD_2NDFLR",
  "APAC_IN_HYD_2NDFLR_MAIN LIFT LOBBY ENTRY 2___OutDirection": "Out of Office",


  //Singapore

  "APAC_SG_11 FLR_BackDR___InDirection":"Singapore",
  "APAC_SG_11 FLR_BackDR___OutDirection":"Out of Office",

  "APAC_SG_11 FLR_Main Door___InDirection":"Singapore",
  "APAC_SG_11 FLR_Main Door___OutDirection:":"Out of Office",

  "APAC_SG_WU_11 FLR_Server Door___InDirection":"Singapore",
  "APAC_SG_WU_11 FLR_Server Door___OutDirection":"Singapore",




};




// 2) zone → floor
const zoneFloorMap = {

  "Red Zone": "Podium Floor",
  "Yellow Zone": "Podium Floor",
  "Reception Area": "Podium Floor",
  "Green Zone": "Podium Floor",
  "Orange Zone": "Podium Floor",
  "Gsoc Zone": "Podium Floor",
  "Assembly Area": "Podium Floor",
  "Red": "Podium Floor",

  // 2nd Floor
  "2nd Floor, Pune": "2nd Floor",

  // Tower B
  "Tower B": "Tower B",
  "Reception Area Tower B": "Tower B",
  "Tower B GYM": "Tower B",

  // Outer‐Area variants (same floors as their base zones)
  "Red Zone - Outer Area": "Podium Floor",
  "Yellow Zone - Outer Area": "Podium Floor",
  "Reception Area - Outer Area": "Podium Floor",
  "Green Zone - Outer Area": "Podium Floor",
  "Orange Zone - Outer Area": "Podium Floor",
  "Assembly Area - Outer Area": "Podium Floor",
  "2nd Floor, Pune - Outer Area": "2nd Floor",
  "Tower B - Outer Area": "Tower B",
  "Reception Area Tower B - Outer Area": "Tower B",
  "Tower B GYM - Outer Area": "Tower B",

  // True “Out of office” eviction (we filter these out in the controller)


  "Kuala Lumpur": "Kuala Lumpur",
  "6th Floor": "6th Floor",
  "7th Floor": "7th Floor",
  "Tokyo": "Tokyo",
  "Taguig": "Taguig",
  // All true “Out of office” go to Unknown:
  "Out of office": null,

  "HYD_2NDFLR":"Hyderabad",
  "APAC_SG":"Singapore"


};


// 3) How to derive partition for PartitionName2
// 3) Partition → friendly name
const partitionMap = {
  'APAC_IN_PUN': 'Pune',
  'APAC_PH_Manila': 'Quezon City',
  'APAC_JPN_Tokyo': 'JP.Tokyo',
  'APAC_MY_KL': 'MY.Kuala Lumpur',
  'APAC_PI_Manila': 'Taguig City',
  'APAC_IN_HYD_2NDFLR':'IN.HYD',
  'APAC_SG_11 FLR':'SG.Singapore'
};



function normalizeDoorName(name) {
  return name
    .replace(/[_/]/g, ' ')                      // underscores/slashes → spaces
    .replace(/[^\w\s-]/g, '')                   // drop punctuation except hyphens
    .replace(/\bRECPTION\b/gi, 'RECEPTION')     // typo fix
    .replace(/\bENRTY\b|\bENTRTY\b/gi, 'ENTRY') // typo fix
    // strip any trailing 6-digit hex string (e.g. "10054B")
    .replace(/\b[0-9A-F]{6}\b$/, '')
    .replace(/[\s-]+/g, ' ')                    // collapse spaces & hyphens
    .toUpperCase()
    .trim();
}



// 5) Build normalized door→zone lookup
const normalizedDoorZoneMap = Object.entries(doorZoneMap).reduce((acc, [rawKey, zone]) => {
  const [rawDoor, direction] = rawKey.split('___');
  const normKey = `${normalizeDoorName(rawDoor)}___${direction}`;
  acc[normKey] = zone;
  return acc;
}, {});

// 6) Build per-partition doorMap entries
const doorMap = Object.entries(doorZoneMap).reduce((acc, [rawKey, zone]) => {
  const [rawDoor, direction] = rawKey.split('___');
  const prefix = rawDoor.split('_').slice(0, 3).join('_');
  const partition = partitionMap[prefix] || prefix;
  const floor = zoneFloorMap[zone] || 'Unknown';

  if (!acc[rawDoor]) {
    acc[rawDoor] = {
      partition,
      door: rawDoor,
      inDirectionFloor: null,
      outDirectionFloor: null,
      normalizedDoor: normalizeDoorName(rawDoor)
    };
  }
  if (direction === 'InDirection') acc[rawDoor].inDirectionFloor = floor;
  else acc[rawDoor].outDirectionFloor = floor;

  return acc;
}, {});

// 7) Export
module.exports = {
  doorZoneMap,
  normalizedDoorZoneMap,
  zoneFloorMap,
  doorMap: Object.values(doorMap),
  normalizeDoorName
};

