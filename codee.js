

in history page 
Unknown	SG.Singapore	23	1	24
why show unknown.. 

    

Thursday, 6 November, 2025
Country	City	Employees	Contractors	Total
Philippines	Quezon City	281	37	318
India	Pune	573	73	646
India	Hyderabad	14	50	64
Japan	Tokyo	10	1	11
Philippines	Taguig	12	3	15
Malaysia	Kuala Lumpur	9	1	10
Unknown	SG.Singapore	23	1	24
Total	922	166	1088import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';


import { format } from 'date-fns';


import { subDays } from 'date-fns';


import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchHistory } from '../api/occupancy.service';

// APAC display mapping
const apacPartitionDisplay = {
  'IN.Pune': { country: 'India', city: 'Pune' },
  'MY.Kuala Lumpur': { country: 'Malaysia', city: 'Kuala Lumpur' },
  'PH.Quezon': { country: 'Philippines', city: 'Quezon City' },
  'PH.Taguig': { country: 'Philippines', city: 'Taguig' },
  'JP.Tokyo': { country: 'Japan', city: 'Tokyo' },
  'IN.HYD': { country: 'India', city: 'Hyderabad' },
  'SG.Singapore': { country: 'Singapore', city: 'Singapore' },

};

// FE ↔ BE keys
const apacForwardKey = {
  'IN.Pune': 'Pune',
  'MY.Kuala Lumpur': 'MY.Kuala Lumpur',
  'PH.Quezon': 'Quezon City',
  'PH.Taguig': 'Taguig City',
  'JP.Tokyo': 'JP.Tokyo',
  'IN.HYD': 'IN.HYD',
  'SG.Singapore': 'Singapore',

};
const apacReverseKey = Object.fromEntries(
  Object.entries(apacForwardKey).map(([fe, be]) => [be, fe])
);

// helper to display “Quezon City” → “Quezon City”
const formatPartition = key => {
  const fe = apacReverseKey[key];
  return fe
    ? apacPartitionDisplay[fe].city
    : key;
};
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
          WHEN t1.ObjectName2 LIKE 'SG.Singapore%'   THEN 'Singapore'
          

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



// src/api/occupancy.service.js

const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3007';

// In‐memory cache
const cache = {
  liveSummary: null,
  history: new Map(),  // key: either 'global' or the partition name the backend expects
};

/**
 * Fetch live summary (always fresh).
 */
export async function fetchLiveSummary() {
  const res = await fetch(`${BASE}/api/occupancy/live-summary`);
  if (!res.ok) {
    throw new Error(`Live summary fetch failed: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch history (global or per‐partition), with in‐memory caching.
 * @param {string} [location] — e.g. 'IN.Pune' from your front‐end router param
 */

export async function fetchHistory(location) {
  const codeMap = {
    'IN.Pune': 'Pune',
    'MY.Kuala Lumpur': 'MY.Kuala Lumpur',
    'PH.Quezon': 'Quezon City',
    'PH.Taguig': 'Taguig City',
    'JP.Tokyo': 'JP.Tokyo',
    'IN.HYD':'IN.HYD',
    'SG.Singapore':'Singapore'

  };
  
  const key = location ? codeMap[location] || location : 'global';
  
  if (cache.history.has(key)) {
    return cache.history.get(key);
  }

  const url = key === 'global' 
    ? `${BASE}/api/occupancy/history`
    : `${BASE}/api/occupancy/history/${encodeURIComponent(key)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`History fetch failed: ${res.status}`);
  
  let json = await res.json();
  
  // Normalize single-city response to match global structure
  if (key !== 'global') {
    json.summaryByDate = json.summaryByDate.map(entry => ({
      ...entry,
      partitions: {
        [key]: {
          Employee: entry.region?.Employee,
          Contractor: entry.region?.Contractor,
          total: entry.region?.total
        }
      }
    }));
  }
  
  cache.history.set(key, json);
  return json;
}
/** Clear in‐memory caches (for dev/testing) */
export function clearCache() {
  cache.liveSummary = null;
  cache.history.clear();
}

// APAC partition list for any selector UI
export const partitionList = [
  'IN.Pune',
  'MY.Kuala Lumpur',
  'PH.Quezon',
  'PH.Taguig',
  'JP.Tokyo',
  'IN.HYD',
  'SG.Singapore'
];


//src/services/occupancy.service.js

// APAC partition list
export const partitionList = [
  'Pune',
  'Quezon City',
  'JP.Tokyo',
  'MY.Kuala Lumpur',
  'Taguig City',
  'IN.HYD',
  'Singapore'
];

