const timezones = require('../utils/timezones');




....



exports.getLiveSummary = async (req, res) => {
  try {
    const swipes = await service.fetchLiveOccupancy();

    // helper: returns YYYY-MM-DD for a given date in the partition's timezone
    function getLocalDateString(dateInput, partition) {
      const tz = timezones[partition] || 'UTC';
      try {
        const d = new Date(dateInput);
        // en-CA produces ISO-like YYYY-MM-DD in most Node runtimes
        return new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(d);
      } catch (e) {
        // fallback to UTC iso date
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

    // 1. TODAY’S HEADCOUNT: first swipe per person **but only for swipes that fall on
    //    the partition's current local date** (so each region's "today" is used).
    const filteredSwipesForToday = swipes.filter(r => {
      const p = r.PartitionName2;
      return getLocalDateString(r.LocaleMessageTime, p) === partitionToday[p];
    });

    const firstByPerson = {};
    filteredSwipesForToday.forEach(r => {
      const prev = firstByPerson[r.PersonGUID];
      const t = new Date(r.LocaleMessageTime).getTime();
      if (!prev || t < new Date(prev.LocaleMessageTime).getTime()) {
        firstByPerson[r.PersonGUID] = r;
      }
    });

    const todayRecs = Object.values(firstByPerson);
    const today = { total: 0, Employee: 0, Contractor: 0 };
    todayRecs.forEach(r => {
      today.total++;
      if (isEmployeeType(r.PersonnelType)) today.Employee++;
      else today.Contractor++;
    });

    // 2. REAL-TIME: last swipe per person (unchanged)
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
      const rawFloor = lookupFloor(r.PartitionName2, r.Door, r.Direction, unmappedDoors);
      const floorNorm = rawFloor ? String(rawFloor).trim().toLowerCase() : '';

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