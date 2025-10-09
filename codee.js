// controllers/occupancy.controller.js (replace getHistoricalOccupancy)
exports.getHistoricalOccupancy = async (req, res) => {
  const location = req.params.location || null;
  try {
    // raw is already one-row-per-person-per-day (because service uses SQL dedupe)
    const raw = await service.fetchHistoricalOccupancy(location);

    // group by date -> arrays (lightweight grouping)
    const byDate = raw.reduce((acc, r) => {
      const date = new Date(r.LocaleMessageTime).toISOString().slice(0,10);
      if (!acc[date]) acc[date] = [];
      acc[date].push(r);
      return acc;
    }, {});

    const summaryByDate = [];
    const details = []; // raw details (already deduped)

    Object.keys(byDate).sort().forEach(date => {
      const recs = byDate[date];
      details.push(...recs);

      const region = { total: 0, Employee: 0, Contractor: 0 };
      const partitions = {};

      recs.forEach(r => {
        region.total++;
        if (isEmployeeType(r.PersonnelType)) region.Employee++;
        else region.Contractor++;

        if (!location) {
          const key = r.PartitionNameFriendly || 'APAC.Default';
          if (!partitions[key]) partitions[key] = { total: 0, Employee: 0, Contractor: 0 };
          partitions[key].total++;
          if (isEmployeeType(r.PersonnelType)) partitions[key].Employee++;
          else partitions[key].Contractor++;
        }
      });

      summaryByDate.push({
        date,
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
        region: location ? { name: location, ...region } : { name: 'APAC', ...region },
        partitions: location ? {} : partitions
      });
    });

    res.json({ success: true, summaryByDate, details });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Historical failed' });
  }
};