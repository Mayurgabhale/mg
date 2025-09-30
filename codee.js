// controllers/liveOccupancyController.js
const { DateTime } = require('luxon');
const { sql, getPool } = require('../config/db');

const doorZoneMap = require('../data/doorZoneMap');
const zoneFloorMap = require('../data/zoneFloorMap');
const ertMembers = require('../data/puneErtMembers.json');

const warnedKeys = new Set();

// ---------------- Utility functions ----------------
function normalizeZoneKey(rawDoor, rawDir) {
  let door = String(rawDoor || '').trim();
  door = door.replace(/_[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}$/, '');
  door = door.replace(/\s+/g, ' ').toUpperCase();
  const dir = rawDir === 'InDirection' ? 'InDirection' : 'OutDirection';
  return `${door}___${dir}`;
}

function mapDoorToZone(rawDoor, rawDir) {
  const key = normalizeZoneKey(rawDoor, rawDir);
  const zone = doorZoneMap[key];
  if (!zone) {
    if (!warnedKeys.has(key)) {
      console.warn('⛔ Unmapped door–direction key:', key);
      warnedKeys.add(key);
    }
    return 'Unknown Zone';
  }
  return zone;
}

function normalizePersonName(raw) {
  let n = String(raw || '').trim();
  if (n.includes(',')) {
    const [last, rest] = n.split(',', 2);
    n = `${rest.trim()} ${last.trim()}`;
  }
  return n.toLowerCase();
}

// ---------------- Shared poller state ----------------
let lastSeenGlobal = new Date(Date.now() - 5 * 1000); // start a few sec earlier
let currentOccupancy = null;
let isPolling = false;
const sseClients = new Set();
const eventsCache = []; // store events for buildOccupancy

// ---------------- Fetch new events ----------------
async function fetchNewEvents(since) {
  const pool = await getPool();
  const req = pool.request();
  req.input('since', sql.DateTime2, since);

  const { recordset } = await req.query(`
    WITH CombinedQuery AS (
      SELECT
        DATEADD(MINUTE,-1 *t1.MessageLocaleOffset, t1.MessageUTC) AS LocaleMessageTime,
        t1.ObjectName1,
        CASE
          WHEN t3.Name IN ('Contractor','Terminated Contractor') THEN t2.Text12
          ELSE CAST(t2.Int1 AS NVARCHAR)
        END AS EmployeeID,
        t1.ObjectIdentity1 AS PersonGUID,
        t3.Name AS PersonnelType,
        COALESCE(
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID/Card)[1]','varchar(50)'),
          TRY_CAST(t_xml.XmlMessage AS XML).value('(/LogMessage/CHUID)[1]','varchar(50)'),
          sc.value
        ) AS CardNumber,
        t5a.value AS AdmitCode,
        t5d.value AS Direction,
        t1.ObjectName2 AS Door
      FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLog] t1
      LEFT JOIN [ACVSCore].[Access].[Personnel] t2 ON t1.ObjectIdentity1 = t2.GUID
      LEFT JOIN [ACVSCore].[Access].[PersonnelType] t3 ON t2.PersonnelTypeId = t3.ObjectID
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] t5a
        ON t1.XmlGUID = t5a.GUID AND t5a.Name = 'AdmitCode'
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred] t5d
        ON t1.XmlGUID = t5d.GUID AND t5d.Value IN ('InDirection','OutDirection')
      LEFT JOIN [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxml] t_xml
        ON t1.XmlGUID = t_xml.GUID
      LEFT JOIN (
        SELECT GUID, value
        FROM [ACVSUJournal_00010029].[dbo].[ACVSUJournalLogxmlShred]
        WHERE Name IN ('Card','CHUID')
      ) sc ON t1.XmlGUID = sc.GUID
      WHERE
        t1.MessageType = 'CardAdmitted'
        AND t1.PartitionName2 = 'APAC.Default'
        AND DATEADD(MINUTE, -1 * t1.MessageLocaleOffset, t1.MessageUTC) > @since
    )
    SELECT
      LocaleMessageTime,
      CONVERT(VARCHAR(10), LocaleMessageTime, 23) AS Dateonly,
      CONVERT(VARCHAR(8) , LocaleMessageTime, 108) AS Swipe_Time,
      EmployeeID,
      PersonGUID,
      ObjectName1,
      PersonnelType,
      CardNumber,
      AdmitCode,
      Direction,
      Door
    FROM CombinedQuery
    ORDER BY LocaleMessageTime ASC;
  `);

  return recordset;
}

// ---------------- Build occupancy ----------------
async function buildOccupancyWrapper(allEvents) {
  // call your existing buildOccupancy exactly as-is
  return await buildOccupancy(allEvents);
}

// ---------------- Global poller ----------------
async function startGlobalPoller() {
  if (isPolling) return;
  isPolling = true;

  while (isPolling) {
    try {
      const freshEvents = await fetchNewEvents(lastSeenGlobal);

      if (freshEvents.length) {
        lastSeenGlobal = new Date(freshEvents[freshEvents.length - 1].LocaleMessageTime);
        eventsCache.push(...freshEvents);
        currentOccupancy = await buildOccupancyWrapper(eventsCache);
      }

      // Broadcast to all SSE clients
      if (currentOccupancy) {
        const data = `data: ${JSON.stringify(currentOccupancy)}\n\n`;
        for (const res of sseClients) res.write(data);
      }
    } catch (err) {
      console.error('❌ Poller error:', err);
    }

    await new Promise(r => setTimeout(r, 2000)); // 2s poll interval
  }
}

// ---------------- SSE endpoint ----------------
exports.getLiveOccupancy = async (req, res) => {
  try {
    await getPool();

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n');

    sseClients.add(res);

    if (currentOccupancy) {
      res.write(`data: ${JSON.stringify(currentOccupancy)}\n\n`);
    }

    req.on('close', () => sseClients.delete(res));

    startGlobalPoller().catch(console.error);
  } catch (err) {
    console.error('Live occupancy SSE error:', err);
    if (!res.headersSent) res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ---------------- Snapshot endpoint ----------------
exports.getPuneSnapshotAtDateTime = async (req, res) => {
  try {
    const { date, time } = req.query;
    if (!date || !time) return res.status(400).json({ error: 'Missing ?date & ?time' });

    const atDt = DateTime.fromISO(`${date}T${time}`, { zone: 'Asia/Kolkata' });
    if (!atDt.isValid) return res.status(400).json({ error: 'Invalid date/time' });

    const pool = await getPool();
    const reqDb = pool.request();
    reqDb.input('until', sql.DateTime2, atDt.setZone('utc').toJSDate());

    const { recordset } = await reqDb.query(`
      -- your existing snapshot SQL exactly as-is
    `);

    // Convert UTC → Asia/Kolkata & filter
    const events = recordset.map(e => {
      const local = DateTime.fromJSDate(e.MessageUTC, { zone: 'utc' }).setZone('Asia/Kolkata');
      return {
        ...e,
        LocaleMessageTime: local.toISO(),
        Dateonly: local.toFormat('yyyy-LL-dd'),
        Swipe_Time: local.toFormat('HH:mm:ss')
      };
    }).filter(e => e.Dateonly === atDt.toFormat('yyyy-LL-dd'));

    const occupancy = await buildOccupancyWrapper(events);
    const visitedStats = buildVisitedToday(events, atDt);

    occupancy.asOfLocal = atDt.toISO();
    occupancy.asOfUTC = `${date}T${time}Z`;
    occupancy.totalVisitedToday = visitedStats.total;
    occupancy.visitedToday = visitedStats;

    return res.json(occupancy);
  } catch (err) {
    console.error('getPuneSnapshotAtDateTime error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};