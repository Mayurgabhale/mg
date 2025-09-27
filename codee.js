PS C:\Users\W0024618\Desktop\apac-occupancy-backend> node server.js
🚀 APAC server listening on port 3007
✅ MSSQL (APAC) connected
RangeError: Invalid time value
    at Date.toISOString (<anonymous>)
    at C:\Users\W0024618\Desktop\apac-occupancy-backend\src\controllers\occupancy.controller.js:246:50
    at Array.reduce (<anonymous>)
    at exports.getHistoricalOccupancy (C:\Users\W0024618\Desktop\apac-occupancy-backend\src\controllers\occupancy.controller.js:244:24)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
RangeError: Invalid time value
    at Date.toISOString (<anonymous>)
    at C:\Users\W0024618\Desktop\apac-occupancy-backend\src\controllers\occupancy.controller.js:246:50
    at Array.reduce (<anonymous>)
    at exports.getHistoricalOccupancy (C:\Users\W0024618\Desktop\apac-occupancy-backend\src\controllers\occupancy.controller.js:244:24)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
RangeError: Invalid time value
    at Date.toISOString (<anonymous>)
    at C:\Users\W0024618\Desktop\apac-occupancy-backend\src\controllers\occupancy.controller.js:246:50
    at Array.reduce (<anonymous>)
    at exports.getHistoricalOccupancy (C:\Users\W0024618\Desktop\apac-occupancy-backend\src\controllers\occupancy.controller.js:244:24)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)


//C:\Users\W0024618\Desktop\apac-occupancy-backend\src\controllers\occupancy.controller.js

const service = require('../services/occupancy.service');

const {
  doorMap,
  normalizedDoorZoneMap,
  doorZoneMap,
  zoneFloorMap,
  normalizeDoorName
} = require('../utils/doorMap');


function isEmployeeType(pt) {
  return ['Employee', 'Terminated Employee', 'Terminated Personnel'].includes(pt);
}


function lookupFloor(partition, rawDoor, direction, unmapped) {
  const norm = normalizeDoorName(rawDoor);
  const key = `${norm}___${direction}`;

  // 1) Try normalized lookup
  const zone = normalizedDoorZoneMap[key];
  if (zone) {
    const f = zoneFloorMap[zone];
    // if zone has a known floor -> return it
    if (f) return f;
    // zone exists but has no floor (e.g. "Out of office") -> treat as known but Unknown floor
    // return immediately to avoid falling back to per-partition doorMap and marking as unmapped
    return 'Unknown';
  }




  // 2) Fallback to per-partition doorMap
  const entry = doorMap.find(d =>
    d.normalizedDoor === norm && d.partition === partition
  );
  if (entry) {
    const fl = direction === 'InDirection'
      ? entry.inDirectionFloor
      : entry.outDirectionFloor;
    if (fl) return fl;
  }

  // 3) Nothing matched → record & return Unknown
  unmapped.add(`${partition}|${rawDoor}`);
  return 'Unknown';
}



function mapDoorToZone(rawDoor, rawDir) {
  const key = normalizeDoorName(rawDoor) + '___' + (rawDir === 'InDirection' ? 'InDirection' : 'OutDirection');
  const zone = normalizedDoorZoneMap[key];
  if (!zone) return 'Unknown Zone';
  // for OutDirection that aren’t true “Out of office”, strip trailing “ Zone”
  if (rawDir === 'OutDirection' && zone !== 'Out of office') {
    return zone.replace(/\s+Zone$/i, '');
  }
  return zone;
}



exports.getLiveOccupancy = async (req, res) => {
  try {
    const data = await service.fetchLiveOccupancy();
    res.json({ success: true, count: data.length, data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Live fetch failed' });
  }
};

exports.getLiveSummary = async (req, res) => {
  try {
    const swipes = await service.fetchLiveOccupancy();

    // first swipe per person = TODAY
    const first = {};
    swipes.forEach(r => {
      const t = new Date(r.LocaleMessageTime).getTime();
      if (!first[r.PersonGUID] || t < new Date(first[r.PersonGUID].LocaleMessageTime).getTime()) {
        first[r.PersonGUID] = r;
      }
    });
    const today = { total: 0, Employee: 0, Contractor: 0 };
    Object.values(first).forEach(r => {
      today.total++;
      if (isEmployeeType(r.PersonnelType)) today.Employee++;
      else today.Contractor++;
    });

    // last swipe per person for realtime
    const last = {};
    swipes.forEach(r => {
      const t = new Date(r.LocaleMessageTime).getTime();
      if (!last[r.PersonGUID] || t > new Date(last[r.PersonGUID].LocaleMessageTime).getTime()) {
        last[r.PersonGUID] = r;
      }
    });

    const realtime = {};
    const unmapped = new Set();


    const enriched = Object.values(last).map(r => {
      // determine zone (try normalized lookup + fallback)
      const zone = mapDoorToZone(r.Door, r.Direction);

      // lookupFloor returns 'Unknown' for unmapped (and adds to unmapped set)
      const floor = lookupFloor(r.PartitionName2, r.Door, r.Direction, unmapped);

      return {
        ...r,
        // keep Unknown Zone as null, keep actual zone strings (including "Out of office")
        Zone: zone === 'Unknown Zone' ? null : zone,
        Floor: floor === 'Unknown' ? null : floor

      };
    });

    // Strictly remove "Out of office" records from details (and from counting below)
    const details = enriched.filter(r => r.Zone !== 'Out of office');

    // Counting loop (keeps Pune special logic but enforces strict drop on "Out of office")
    Object.values(last).forEach(r => {
      const p = r.PartitionName2;

      // determine zone again for each record (use mapDoorToZone to be consistent)
      const zoneRaw = mapDoorToZone(r.Door, r.Direction);

      // STRICT RULE: if zone resolved to exact "Out of office" -> skip counting
      if (zoneRaw === 'Out of office') return;

      // Unknown keys → drop
      if (zoneRaw === 'Unknown Zone') return;

      // ensure bucket exists when we decide to count
      const ensureBucket = (part) => {
        if (!realtime[part]) realtime[part] = { total: 0, Employee: 0, Contractor: 0, floors: {}, zones: {} };
      };


      if (r.Direction === 'OutDirection') {
        // allow certain valid OutDirection zones (Assembly Area, Reception Area, ...)
        const allowedOutZones = new Set(['Assembly Area', 'Reception Area']);
        if (!zoneRaw.endsWith('Outer Area') && !allowedOutZones.has(zoneRaw)) {
          return;
        }

        // safe to count
        ensureBucket(p);
        realtime[p].total++;
        if (isEmployeeType(r.PersonnelType)) realtime[p].Employee++;
        else realtime[p].Contractor++;

        // floor bucket
        const fl = lookupFloor(p, r.Door, r.Direction, unmapped);
        if (fl !== 'Unknown') {
          realtime[p].floors[fl] = (realtime[p].floors[fl] || 0) + 1;
        }

        // zone bucket (clean trailing " Zone" for OutDirection cases where appropriate)
        const z = (r.Direction === 'OutDirection' && zoneRaw !== 'Out of office')
          ? zoneRaw.replace(/\s+Zone$/i, '')
          : zoneRaw;
        if (z) realtime[p].zones[z] = (realtime[p].zones[z] || 0) + 1;

        return;
      }

      // ── All other partitions (existing logic) ──
      // fallback logic to determine zone (keeps previous behaviour if normalized lookup not present)
      const normKey = normalizeDoorName(r.Door) + '___' + r.Direction;
      let zone = normalizedDoorZoneMap[normKey];
      if (!zone) {
        const entry = doorMap.find(d =>
          d.normalizedDoor === normalizeDoorName(r.Door) &&
          d.partition === p
        );
        zone = entry
          ? (r.Direction === 'InDirection'
            ? normalizedDoorZoneMap[`${entry.normalizedDoor}___InDirection`]
            : normalizedDoorZoneMap[`${entry.normalizedDoor}___OutDirection`])
          : null;
      }

      // if resolved zone (via fallback) is "Out of office" → skip (strict)
      if (zone === 'Out of office') return;
      if (!zone && zone !== null) {
        // keep going — zone could be null if no mapping found, but Unknown Zone was handled above
      }

      // ok to count
      ensureBucket(p);
      realtime[p].total++;
      if (isEmployeeType(r.PersonnelType)) realtime[p].Employee++;
      else realtime[p].Contractor++;

      const fl = lookupFloor(p, r.Door, r.Direction, unmapped);
      if (fl !== 'Unknown') {
        realtime[p].floors[fl] = (realtime[p].floors[fl] || 0) + 1;
      }

      const z = zone ? (r.Direction === 'OutDirection' && zone !== 'Out of office' ? zone.replace(/\s+Zone$/i, '') : zone) : null;
      if (z) realtime[p].zones[z] = (realtime[p].zones[z] || 0) + 1;
    });

    // Log to server console for quick dev feedback:
    if (unmapped.size) console.warn('Unmapped doors:', Array.from(unmapped));

    res.json({
      success: true,
      today,
      realtime,
      // expose the raw list of partition|door keys that had no mapping:
      unmapped: Array.from(unmapped),
      details    // enriched details with Zone & Floor, with "Out of office" removed
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Summary failed' });
  }
};





//C:\Users\W0024618\Desktop\apac-occupancy-backend\src\controllers\occupancy.controller.js

exports.getHistoricalOccupancy = async (req, res) => {
  const location = req.params.location || null;
  try {
    // 1) Pull in rows — each now has non-null PartitionNameFriendly
    const raw = await service.fetchHistoricalOccupancy(location);

    // 2) Dedupe to first swipe per person per day
    const byDate = raw.reduce((acc, r) => {
      // force into a "YYYY-MM-DD" string
      const date = new Date(r.LocaleMessageTime).toISOString().slice(0, 10);
      acc[date] = acc[date] || {};
      if (
        !acc[date][r.PersonGUID] ||
        new Date(r.LocaleMessageTime) < new Date(acc[date][r.PersonGUID].LocaleMessageTime)
      ) {
        acc[date][r.PersonGUID] = r;
      }
      return acc;
    }, {});

    const summaryByDate = [];
    const details = [];

    // 3) Build summaries
    Object.keys(byDate).sort().forEach(date => {
      const recs = Object.values(byDate[date]);
      details.push(...recs);

      // region totals
      const region = { total: 0, Employee: 0, Contractor: 0 };
      // per-partition buckets
      const partitions = {};

      recs.forEach(r => {
        // increment region
        region.total++;
        if (isEmployeeType(r.PersonnelType)) region.Employee++;
        else region.Contractor++;

        // only build partitions if we're not filtering to a single location
        if (!location) {
          // use the friendly name (guaranteed non-null!), with fallback
          const key = r.PartitionNameFriendly || 'APAC.Default';
          if (!partitions[key]) {
            partitions[key] = { total: 0, Employee: 0, Contractor: 0 };
          }
          partitions[key].total++;
          if (isEmployeeType(r.PersonnelType)) partitions[key].Employee++;
          else partitions[key].Contractor++;
        }
      });

      summaryByDate.push({
        date,
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
        region: location
          ? { name: location, ...region }
          : { name: 'APAC', ...region },
        // if location is provided, you can still emit an empty object (`{}`) or skip:
        partitions: location ? {} : partitions
      });
    });

    // 4) Return
    res.json({ success: true, summaryByDate, details });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Historical failed' });
  }
};

