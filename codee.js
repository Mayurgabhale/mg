exports.getTimeTravelOccupancy = async (req, res) => {
  try {
    const { date, time, location } = req.query;
    if (!date || !time) {
      return res.status(400).json({
        success: false,
        error: 'missing query params: expected ?date=YYYY-MM-DD&time=HH:MM[:SS][&location=<Partition>]'
      });
    }

    // Default to all partitions (EMEA) if no specific location
    const targetPartitions = location
      ? [location]
      : service.partitionList; // imported from service

    // Pick timezone: if one location, use its local tz; otherwise default to London
    const tz = location
      ? partitionTimezones[location] || 'Europe/London'
      : 'Europe/London';

    const atDt = DateTime.fromISO(`${date}T${time}`, { zone: tz });
    if (!atDt.isValid)
      return res.status(400).json({ success: false, error: 'invalid date/time format' });

    const untilUtc = atDt.setZone('utc').toJSDate();

    let allEvents = [];
    for (const loc of targetPartitions) {
      const partEvents = await service.fetchOccupancyAtTime(loc, untilUtc);
      allEvents.push(...partEvents);
    }

    // Build last swipe per person as of atDt
    const lastByPerson = {};
    allEvents.forEach(r => {
      const localTs = DateTime.fromJSDate(r.MessageUTC, { zone: 'utc' }).setZone(tz);
      if (localTs <= atDt) {
        const prev = lastByPerson[r.PersonGUID];
        if (!prev || localTs > DateTime.fromJSDate(prev.MessageUTC, { zone: 'utc' }).setZone(tz)) {
          lastByPerson[r.PersonGUID] = { ...r, LocaleMessageTime: localTs.toISO() };
        }
      }
    });

    // Aggregate snapshot
    const snapshot = { total: 0, Employee: 0, Contractor: 0, byPartition: {} };
    Object.values(lastByPerson).forEach(r => {
      if (r.PersonnelType === 'Employee') snapshot.Employee++;
      else snapshot.Contractor++;
      snapshot.total++;

      const p = r.PartitionName2;
      if (!snapshot.byPartition[p]) snapshot.byPartition[p] = { total: 0, Employee: 0, Contractor: 0 };
      snapshot.byPartition[p].total++;
      if (r.PersonnelType === 'Employee') snapshot.byPartition[p].Employee++;
      else snapshot.byPartition[p].Contractor++;
    });

    res.json({
      success: true,
      scope: location ? location : 'EMEA',
      asOfLocal: atDt.toISO(),
      asOfUTC: atDt.setZone('utc').toISO(),
      snapshot,
      details: Object.values(lastByPerson)
    });
  } catch (err) {
    console.error('getTimeTravelOccupancy error:', err);
    res.status(500).json({ success: false, message: 'TimeTravel snapshot failed' });
  }
};