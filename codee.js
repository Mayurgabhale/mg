// --- 1) TODAY’S HEADCOUNT (fixed double counting)
const filteredSwipesForToday = swipes.filter(r => {
  const p = r.PartitionName2;
  return getLocalDateString(r.LocaleMessageTime, p) === partitionToday[p];
});

// ✅ use EmployeeID (fallback to GUID if missing)
const firstByEmployee = {};
filteredSwipesForToday.forEach(r => {
  const key = r.EmployeeID || r.PersonGUID;
  const prev = firstByEmployee[key];
  const t = new Date(r.LocaleMessageTime).getTime();
  if (!prev || t < new Date(prev.LocaleMessageTime).getTime()) {
    firstByEmployee[key] = r;
  }
});

const todayRecs = Object.values(firstByEmployee);
const today = { total: 0, Employee: 0, Contractor: 0 };
todayRecs.forEach(r => {
  today.total++;
  if (isEmployeeType(r.PersonnelType)) today.Employee++;
  else today.Contractor++;
});

http://localhost:3005/api/occupancy/live-summary
{
  "success": true,
  "today": {
    "total": 122,  why thus show more 
    "Employee": 111,
    "Contractor": 11
  },
see boht count are not match. 
  chekc why haping ths mor
  
  http://localhost:3005/api/occupancy/history
   "date": "2025-10-30",
      "day": "Thursday",
      "region": {
        "name": "EMEA",
        "total": 112,
        "Employee": 101,
        "Contractor": 11
      },


i am update above code but, not change anythinhk 


// C:\Users\W0024618\Desktop\emea-occupancy-backend\src\controllers\occupancy.controller.js

const service = require('../services/occupancy.service');
const doorMap = require('../utils/doorMap');
const timezones = require('../utils/timezones');
//  const normalize  = name => name.trim();        // simple normalizer

const normalize = s =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')   // non-alphanum → space
    .replace(/\s+/g, ' ')          // collapse multi-spaces
    .trim();

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
 * Look up floor for a given record by matching door + partition.
 */

function lookupFloor(partition, door, direction, unmappedSet) {
  const normDoor = normalize(door);
  // 1) try exact (post-normalization)
  let entry = doorMap.find(d =>
    d.partition === partition &&
    normalize(d.door) === normDoor
  );
  // 2) fallback: partial match if exact fails
  if (!entry) {
    entry = doorMap.find(d =>
      d.partition === partition &&
      normalize(d.door).includes(normDoor)
    );
  }
  if (!entry) {
    unmappedSet.add(`${partition} | ${door}`);
    return null;
  }
  return direction === 'InDirection'
    ? entry.inDirectionFloor
    : entry.outDirectionFloor;
}

exports.getLiveOccupancy = async (req, res) => {
  try {
    const data = await service.fetchLiveOccupancy();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Live occupancy fetch failed' });
  }
};



// 📝📝📝📝📝 new code wiht time zone  ⬇️⬇️start

// 📝 Updated getLiveSummary — enforces partition-local "today" for both today + realtime
exports.getLiveSummary = async (req, res) => {
  try {
    const swipes = await service.fetchLiveOccupancy();

    // helper: returns YYYY-MM-DD for a given date in the partition's timezone
    function getLocalDateString(dateInput, partition) {
      const tz = timezones[partition] || 'UTC';
      try {
        const d = new Date(dateInput);
        return new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(d);
      } catch (e) {
        return new Date(dateInput).toISOString().slice(0, 10);
      }
    }

    // PRE-CALCULATE "today" per partition (so we don't call Intl repeatedly)
    const partitionToday = {};
    swipes.forEach(r => {
      const p = r.PartitionName2;
      if (!partitionToday[p]) {
        partitionToday[p] = getLocalDateString(new Date(), p);
      }
    });

    // --- 1) TODAY’S HEADCOUNT: first swipe per person but ONLY for swipes where
    // the swipe's partition-local date === that partition's current local date.
    // const filteredSwipesForToday = swipes.filter(r => {
    //   const p = r.PartitionName2;
    //   return getLocalDateString(r.LocaleMessageTime, p) === partitionToday[p];
    // });

    // --- 1) TODAY’S HEADCOUNT (fixed double counting)
    const filteredSwipesForToday = swipes.filter(r => {
      const p = r.PartitionName2;
      return getLocalDateString(r.LocaleMessageTime, p) === partitionToday[p];
    });

    const firstByPerson = {};
    // filteredSwipesForToday.forEach(r => {
    //   const prev = firstByPerson[r.PersonGUID];
    //   const t = new Date(r.LocaleMessageTime).getTime();
    //   if (!prev || t < new Date(prev.LocaleMessageTime).getTime()) {
    //     firstByPerson[r.PersonGUID] = r;
    //   }
    // });


    // ✅ use EmployeeID (fallback to GUID if missing)
    const firstByEmployee = {};
    filteredSwipesForToday.forEach(r => {
      const key = r.EmployeeID || r.PersonGUID;
      const prev = firstByEmployee[key];
      const t = new Date(r.LocaleMessageTime).getTime();
      if (!prev || t < new Date(prev.LocaleMessageTime).getTime()) {
        firstByEmployee[key] = r;
      }
    });



    const todayRecs = Object.values(firstByEmployee);
    const today = { total: 0, Employee: 0, Contractor: 0 };
    todayRecs.forEach(r => {
      today.total++;
      if (isEmployeeType(r.PersonnelType)) today.Employee++;
      else today.Contractor++;
    });

    // const todayRecs = Object.values(firstByPerson);
    // const today = { total: 0, Employee: 0, Contractor: 0 };
    // todayRecs.forEach(r => {
    //   today.total++;
    //   if (isEmployeeType(r.PersonnelType)) today.Employee++;
    //   else today.Contractor++;
    // });

    // --- 2) REALTIME: build lastByPerson, but only from swipes that are on the partition's LOCAL "today".
    // This removes partitions that only have older swipes.
    const lastByPerson = {};
    swipes.forEach(r => {
      const p = r.PartitionName2;
      // skip any swipe that is NOT on this partition's current local date
      if (getLocalDateString(r.LocaleMessageTime, p) !== partitionToday[p]) return;

      const prev = lastByPerson[r.PersonGUID];
      const t = new Date(r.LocaleMessageTime).getTime();
      if (!prev || t > new Date(prev.LocaleMessageTime).getTime()) {
        lastByPerson[r.PersonGUID] = r;
      }
    });

    // Build realtime counts only from the filtered lastByPerson
    const realtime = {};
    const unmappedDoors = new Set();

    Object.values(lastByPerson).forEach(r => {
      const rawFloor = lookupFloor(r.PartitionName2, r.Door, r.Direction, unmappedDoors);
      const floorNorm = rawFloor ? String(rawFloor).trim().toLowerCase() : '';

      // STRICT: drop 'Out of office' from realtime details and counts
      if (floorNorm === 'out of office') return;

      const p = r.PartitionName2;
      if (!realtime[p]) {
        realtime[p] = { total: 0, Employee: 0, Contractor: 0, floors: {} };
      }

      realtime[p].total++;
      if (isEmployeeType(r.PersonnelType)) realtime[p].Employee++;
      else realtime[p].Contractor++;

      const normFloorLabel = rawFloor ? String(rawFloor).trim() : 'Unmapped';
      realtime[p].floors[normFloorLabel] = (realtime[p].floors[normFloorLabel] || 0) + 1;
    });

    if (unmappedDoors.size) {
      console.warn('Unmapped doors:\n' + Array.from(unmappedDoors).join('\n'));
    }

    // details: use the filtered lastByPerson values (and drop Out of office)
    const details = Object.values(lastByPerson)
      .map(r => {
        const rawFloor = lookupFloor(r.PartitionName2, r.Door, r.Direction, unmappedDoors);
        const floor = rawFloor ? String(rawFloor).trim() : null;
        return { ...r, Floor: floor };
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

// 📝📝📝📝📝📝new code wiht time zone end




exports.getHistoricalOccupancy = async (req, res) => {
  const location = req.params.location || null;
  try {
    const raw = await service.fetchHistoricalOccupancy(location);

    // first swipe per person per date
    const byDate = raw.reduce((acc, r) => {
      const iso = (r.LocaleMessageTime instanceof Date)
        ? r.LocaleMessageTime.toISOString()
        : r.LocaleMessageTime;
      const date = iso.slice(0, 10);
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

      // initialize counts
      const regionCounts = { total: 0, Employee: 0, Contractor: 0 };
      const partitionCounts = {};

      recs.forEach(r => {
        regionCounts.total++;
        if (isEmployeeType(r.PersonnelType)) regionCounts.Employee++;
        else regionCounts.Contractor++;

        if (!location) {
          const p = r.PartitionName2;
          if (!partitionCounts[p]) {
            partitionCounts[p] = { total: 0, Employee: 0, Contractor: 0 };
          }
          partitionCounts[p].total++;
          if (isEmployeeType(r.PersonnelType)) partitionCounts[p].Employee++;
          else partitionCounts[p].Contractor++;
        }
      });

      summaryByDate.push({
        date,
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
        region: location
          ? { name: location, ...regionCounts }
          : { name: 'EMEA', ...regionCounts },
        partitions: location ? undefined : partitionCounts
      });
    });

    return res.json({ success: true, summaryByDate, details });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Historical fetch failed' });
  }
};


