exports.getHistoricalOccupancy = async (req, res) => {
  const location = req.params.location || null;

  try {
    const raw = await service.fetchHistoricalOccupancy(location);

    if (!Array.isArray(raw)) {
      console.warn('fetchHistoricalOccupancy returned invalid data:', raw);
      return res.status(500).json({ success: false, message: 'Invalid data from service' });
    }

    // first swipe per person per date
    const byDate = raw.reduce((acc, r) => {
      if (!r.PersonGUID) {
        console.warn('Skipping row without PersonGUID:', r);
        return acc;
      }

      let iso = null;
      if (r.LocaleMessageTime instanceof Date) {
        iso = r.LocaleMessageTime.toISOString();
      } else if (typeof r.LocaleMessageTime === 'string' && r.LocaleMessageTime.trim() !== '') {
        iso = r.LocaleMessageTime;
      } else {
        console.warn('Skipping row with invalid LocaleMessageTime:', r);
        return acc;
      }

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

      const regionCounts = { total: 0, Employee: 0, Contractor: 0 };
      if (location === 'CR.Costa Rica Partition') regionCounts.TempBadge = 0;

      const partitionCounts = {};

      recs.forEach(r => {
        regionCounts.total++;
        if (isTempBadgeType(r.PersonnelType)) regionCounts.TempBadge = (regionCounts.TempBadge || 0) + 1;
        else if (isEmployeeType(r.PersonnelType)) regionCounts.Employee++;
        else regionCounts.Contractor++;

        if (!location) {
          const p = r.PartitionName2 || 'Unknown';
          if (!partitionCounts[p]) {
            partitionCounts[p] = { total: 0, Employee: 0, Contractor: 0 };
            if (p === 'CR.Costa Rica Partition') partitionCounts[p].TempBadge = 0;
          }
          partitionCounts[p].total++;
          if (isTempBadgeType(r.PersonnelType)) partitionCounts[p].TempBadge = (partitionCounts[p].TempBadge || 0) + 1;
          else if (isEmployeeType(r.PersonnelType)) partitionCounts[p].Employee++;
          else partitionCounts[p].Contractor++;
        }
      });

      summaryByDate.push({
        date,
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
        region: location
          ? { name: location, ...regionCounts }
          : { name: 'LACA', ...regionCounts },
        partitions: location ? undefined : partitionCounts
      });
    });

    return res.json({ success: true, summaryByDate, details });
  } catch (err) {
    console.error('Historical fetch failed:', err);
    return res.status(500).json({ success: false, message: 'Historical fetch failed' });
  }
};