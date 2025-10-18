//C:\Users\W0024618\Desktop\laca-occupancy-backend\src\controllers\occupancy.controller.js


const service = require('../services/occupancy.service');
const doorMap = require('../utils/doorMap'); 



exports.getLiveOccupancy = async (req, res) => {
  try {
    const data = await service.fetchLiveOccupancy();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Live occupancy fetch failed' });
  }
};


/**
 * Returns true if this PersonnelType counts as Employee.
 * Everything else (including blank) counts as Contractor.
 */

function isEmployeeType(pt) {
  return pt === 'Employee'
      || pt === 'Terminated Employee'
      || pt === 'Terminated Personnel';
}

/**
 * Returns true if this PersonnelType is a Temp Badge.
 */
// function isTempBadgeType(pt) {
//   return pt === 'Temp Badge';
// }


function isTempBadgeType(pt) {
  // handle both variants from the database
  return pt === 'Temp Badge' || pt === 'TempBadge';
}



/**
 * Look up floor for a given record by matching door + partition.
 */
function lookupFloor(partition, door, direction, unmappedSet) {
  const entry = doorMap.find(d =>
    d.partition === partition && d.door === door
  );
  if (!entry) {
    unmappedSet.add(`${partition} | ${door}`);
    return null;
  }
  return direction === 'InDirection'
    ? entry.inDirectionFloor
    : entry.outDirectionFloor;
}






exports.getLiveSummary = async (req, res) => {
  try {
    const swipes = await service.fetchLiveOccupancy();

    // 1. TODAY’S HEADCOUNT: first swipe per person
    const firstByPerson = {};
    swipes.forEach(r => {
      const prev = firstByPerson[r.PersonGUID];
      const t = new Date(r.LocaleMessageTime).getTime();
      if (!prev || t < new Date(prev.LocaleMessageTime).getTime()) {
        firstByPerson[r.PersonGUID] = r;
      }
    });
    const todayRecs = Object.values(firstByPerson);
    const today = { total: 0, Employee: 0, Contractor: 0, TempBadge: 0 };
    todayRecs.forEach(r => {
      today.total++;
      if (isTempBadgeType(r.PersonnelType)) today.TempBadge++;
      else if (isEmployeeType(r.PersonnelType)) today.Employee++;
      else today.Contractor++;
    });

    // 2. REAL-TIME: last swipe per person, with strict removal for Floor == "Out of office"
    const lastByPerson = {};
    swipes.forEach(r => {
      const prev = lastByPerson[r.PersonGUID];
      const t = new Date(r.LocaleMessageTime).getTime();
      if (!prev || t > new Date(prev.LocaleMessageTime).getTime()) {
        lastByPerson[r.PersonGUID] = r;
      }
    });

    const realtime = {};
    const unmappedDoors = new Set();




    Object.values(lastByPerson).forEach(r => {
      // Resolve mapped floor up-front (populates unmappedDoors when needed)
      const rawFloor = lookupFloor(r.PartitionName2, r.Door, r.Direction, unmappedDoors);
      const floorNorm = rawFloor ? String(rawFloor).trim().toLowerCase() : '';

      // STRICT RULE: if resolved Floor equals "out of office" -> skip counting entirely
      if (floorNorm === 'out of office') {
        return;
      }

      const p = r.PartitionName2;
      // initialize, including TempBadge for CR
      if (!realtime[p]) {
        realtime[p] = { total: 0, Employee: 0, Contractor: 0 };
        if (p === 'CR.Costa Rica Partition') realtime[p].TempBadge = 0;
        realtime[p].floors = {};
      }

      realtime[p].total++;
      if (isTempBadgeType(r.PersonnelType)) realtime[p].TempBadge++;
      else if (isEmployeeType(r.PersonnelType)) realtime[p].Employee++;
      else realtime[p].Contractor++;

      // add to floor bucket, using 'Unmapped' when lookup fails
      const normFloor = rawFloor ? String(rawFloor).trim() : 'Unmapped';
      realtime[p].floors[normFloor] = (realtime[p].floors[normFloor] || 0) + 1;
    });

    if (unmappedDoors.size) {
      console.warn('Unmapped doors:\n' + Array.from(unmappedDoors).join('\n'));
    }

    // Build enriched details with Floor added, but filter out any whose Floor is "Out of office"
    const details = Object.values(lastByPerson)
      .map(r => {
        const rawFloor = lookupFloor(r.PartitionName2, r.Door, r.Direction, unmappedDoors);
        const floor = rawFloor ? String(rawFloor).trim() : null;
        return {
          ...r,
          Floor: floor
        };
      })
      .filter(d => {
        const f = d.Floor;
        return !(f && String(f).trim().toLowerCase() === 'out of office');
      });

    return res.json({
      success: true,
      today,
      realtime,
      details
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Live summary failed' });
  }
};









exports.getHistoricalOccupancy = async (req, res) => {
  const location = req.params.location || null;
  try {
    const raw = await service.fetchHistoricalOccupancy(location);

    // first swipe per person per date
    const byDate = raw.reduce((acc, r) => {
      const iso = (r.LocaleMessageTime instanceof Date)
        ? r.LocaleMessageTime.toISOString()
        : r.LocaleMessageTime;
      const date = iso.slice(0,10);
      acc[date] = acc[date] || {};
      const prev = acc[date][r.PersonGUID];
      if (!prev || new Date(iso) < new Date(prev.LocaleMessageTime)) {
        acc[date][r.PersonGUID] = { ...r, LocaleMessageTime: iso };
      }
      return acc;
    }, {});

    const summaryByDate = [];
    const details = [];

    Object.keys(byDate).sort().forEach(date => {
      const recs = Object.values(byDate[date]);
      details.push(...recs);

      // initialize region counts, including TempBadge for CR location
      const regionCounts = { total: 0, Employee: 0, Contractor: 0 };
      if (location === 'CR.Costa Rica Partition') regionCounts.TempBadge = 0;

      const partitionCounts = {};
      recs.forEach(r => {
        regionCounts.total++;
        if (isTempBadgeType(r.PersonnelType)) regionCounts.TempBadge++;
        else if (isEmployeeType(r.PersonnelType)) regionCounts.Employee++;
        else regionCounts.Contractor++;

        if (!location) {
          const p = r.PartitionName2;
          if (!partitionCounts[p]) {
            partitionCounts[p] = { total: 0, Employee: 0, Contractor: 0 };
            if (p === 'CR.Costa Rica Partition') partitionCounts[p].TempBadge = 0;
          }
          partitionCounts[p].total++;
          if (isTempBadgeType(r.PersonnelType)) partitionCounts[p].TempBadge++;
          else if (isEmployeeType(r.PersonnelType)) partitionCounts[p].Employee++;
          else partitionCounts[p].Contractor++;
        }
      });

      summaryByDate.push({
        date,
        day: new Date(date).toLocaleDateString('en-US', { weekday:'long' }),
        region: location
          ? { name: location, ...regionCounts }
          : { name: 'LACA', ...regionCounts },
        partitions: location ? undefined : partitionCounts
      });
    });

    return res.json({ success: true, summaryByDate, details });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Historical fetch failed' });
  }
};




// ////////////////////



exports.getSnapshotAtDateTime = async (req, res) => {
  try {
    const { date, time, location } = req.query;
    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: 'missing query params: expected ?date=YYYY-MM-DD&time=HH:MM[:SS]&location=<optional partition>'
      });
    }

    // validate formats (same regex style used elsewhere)
    const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    const timeMatch = /^([0-1]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(time);
    if (!dateMatch) {
      return res.status(400).json({ success:false, message: 'invalid "date" format; expected YYYY-MM-DD' });
    }
    if (!timeMatch) {
      return res.status(400).json({ success:false, message: 'invalid "time" format; expected HH:MM or HH:MM:SS' });
    }

    // fetch raw rows
    const svcRes = await service.fetchSnapshotAtDateTime({ date, time, location });
    const rows = svcRes.rows || [];
    const asOfLocal = svcRes.atDtISO;
    const asOfZone = svcRes.atDtZone || 'utc';

    // convert LocaleMessageTime to ISO string and filter to requested local date (YYYY-MM-DD)
    const filtered = rows.map(r => {
      // LocaleMessageTime from SQL may be a Date or string; normalize to ISO
      const lmt = r.LocaleMessageTime instanceof Date ? r.LocaleMessageTime.toISOString() : (r.LocaleMessageTime || null);
      return { ...r, LocaleMessageTime: lmt };
    }).filter(r => {
      if (!r.LocaleMessageTime) return false;
      return r.LocaleMessageTime.slice(0,10) === date;
    });

    // compute unique visited-up-to-snapshot counts (first swipe per PersonGUID on that date)
    const firstByPerson = {};
    filtered.forEach(r => {
      const prev = firstByPerson[r.PersonGUID];
      const t = new Date(r.LocaleMessageTime).getTime();
      if (!prev || t < new Date(prev.LocaleMessageTime).getTime()) {
        firstByPerson[r.PersonGUID] = r;
      }
    });
    const visitedRecs = Object.values(firstByPerson);
    const visitedCounts = { total: 0, Employee: 0, Contractor: 0, TempBadge: 0 };
    visitedRecs.forEach(r => {
      visitedCounts.total++;
      if (isTempBadgeType(r.PersonnelType)) visitedCounts.TempBadge++;
      else if (isEmployeeType(r.PersonnelType)) visitedCounts.Employee++;
      else visitedCounts.Contractor++;
    });

    return res.json({
      success: true,
      asOfLocal,          // ISO in requested partition zone
      asOfZone,
      asOfUTC: `${date}T${String(timeMatch[1]).padStart(2,'0')}:${String(timeMatch[2]).padStart(2,'0')}:${String(timeMatch[3] || '00').padStart(2,'0')}Z`,
      // totalRecords: filtered.length,
      totalVisitedToday: visitedCounts.total,
      visitedByType: visitedCounts,
      data: visitedRecs
    });

  } catch (err) {
    console.error('getSnapshotAtDateTime error:', err);
    return res.status(500).json({ success: false, message: 'Snapshot fetch failed' });
  }
};



