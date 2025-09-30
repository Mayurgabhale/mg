Error fetching rejection data: TypeError: Cannot read properties of undefined (reading 'request')
    at getRejections (C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\controllers\denverRejection.js:73:31)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

Read above eror and how to slove it, and why this came 
// C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\controllers\denverRejection.js
const { denver } = require("../config/siteConfig");
const doorFloorMap = require("../data/denverDoorFloorMap");
const normalizeKey = require("../data/normalizeKey");

// helper: regex fallback to extract floor number from Door string
function extractFloorFromDoor(door) {
  if (!door) return "Unknown";
  const match = door.match(/HQ\.\s*(\d{2})\./i);
  if (match) {
    return `Floor ${parseInt(match[1], 10)}`;
  }
  return "Unknown";
}

async function getRejections(req, res) {
  try {
    const pool = await denver.poolPromise;

    const query = `
      WITH CombinedQuery AS (
        SELECT
          DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
          t2.Int1      As EmployeeID,
          t1.ObjectName1      AS ObjectName1,
          t1.ObjectName2      AS Door,
          t1.PartitionName2   AS PartitionName2,
          COALESCE(
            TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
            TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
            sc.value
          )                    AS CardNumber,
          t3.Name              AS PersonnelType,
          t5_rej.value         AS RejectionType
        FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLog] AS t1
        LEFT JOIN [ACVSCore].[Access].[Personnel] AS t2
          ON t1.ObjectIdentity1 = t2.GUID
        LEFT JOIN [ACVSCore].[Access].[PersonnelType] AS t3
          ON t2.PersonnelTypeId = t3.ObjectID
        LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxml] AS t_xml
          ON t1.XmlGUID = t_xml.GUID
        LEFT JOIN (
          SELECT GUID, value
          FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred]
          WHERE Name IN ('Card','CHUID')
        ) AS sc
          ON t1.XmlGUID = sc.GUID
        LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] AS t5_rej
          ON t1.XmlGUID = t5_rej.GUID AND t5_rej.Name = 'RejectCode'
        WHERE
          t1.MessageType = 'CardRejected'
          AND t1.PartitionName2 = 'US.CO.OBS'
          AND CONVERT(DATE,
               DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC)
              ) >= DATEADD(DAY, -7, CONVERT(DATE, GETDATE()))
      )
      SELECT
        LocaleMessageTime,
        CONVERT(date, LocaleMessageTime)    AS DateOnly,
        CONVERT(time(0), LocaleMessageTime) AS SwipeTime,
        EmployeeID,
        ObjectName1,
        CardNumber,
        PersonnelType,
        PartitionName2                     AS Location,
        Door,
        RejectionType
      FROM CombinedQuery
      ORDER BY LocaleMessageTime DESC;
    `;

    const result = await pool.request().query(query);

    // Post-process in JS
    const details = result.recordset.map(r => {
      let floor = "Unknown";

      try {
        const [doorRaw, dirRaw] = (r.Door || "").split("___");
        const normKey = normalizeKey(doorRaw || "", dirRaw || "");
        const mapped = doorFloorMap[normKey];

        if (mapped && mapped !== "Out of office") {
          floor = mapped;
        } else {
          floor = extractFloorFromDoor(r.Door);
        }
      } catch (e) {
        console.warn("Failed to resolve floor for door:", r.Door, e.message);
      }

      return { ...r, floor };
    });

    // Floor-wise rejection count (all days combined)
    const summary = details.reduce((acc, row) => {
      if (row.floor !== "Unknown") {
        if (!acc[row.floor]) acc[row.floor] = 0;
        acc[row.floor]++;
      }
      return acc;
    }, {});
    const summaryArr = Object.entries(summary).map(([floor, rejectionCount]) => ({
      floor,
      rejectionCount,
    }));

    // Date + Floor-wise rejection count
    const dateWiseMap = {};
    details.forEach(row => {
      if (row.floor === "Unknown") return;
      const date = row.DateOnly.toISOString().split("T")[0]; // yyyy-mm-dd
      if (!dateWiseMap[date]) dateWiseMap[date] = {};
      if (!dateWiseMap[date][row.floor]) dateWiseMap[date][row.floor] = 0;
      dateWiseMap[date][row.floor]++;
    });

    const dateWiseArr = Object.entries(dateWiseMap).map(([date, floors]) => ({
      date,
      floors: Object.entries(floors).map(([floor, rejectionCount]) => ({
        floor,
        rejectionCount,
      })),
    }));

    res.json({
      summary: summaryArr,
      dateWise: dateWiseArr,
      details,
    });
  } catch (err) {
    console.error("Error fetching rejection data:", err);
    res.status(500).send("Server Error");
  }
}

module.exports = { getRejections };




// routes/occupancyDenverRoutes.js
const express = require('express');
const router = express.Router();

const { getDenverLiveOccupancy, getDenverSnapshotAtDateTime } = require('../controllers/denverLiveOccupancyController');

const { getRejections } = require("../controllers/denverRejection");

router.get('/live-occupancy-denver', getDenverLiveOccupancy);

router.get('/occupancy-at-time-denver', getDenverSnapshotAtDateTime);

router.get("/rejections", getRejections);


module.exports = router;
