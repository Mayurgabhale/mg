// -----------------------
// NEW: TimeTravel endpoint
// GET /api/time-travel?location=UK.London&date=YYYY-MM-DD&time=HH:MM[:SS]
// -----------------------

const { DateTime } = require('luxon');

const partitionTimezones = {
  'AUT.Vienna': 'Europe/Vienna',
  'DU.Abu Dhab': 'Asia/Dubai',
  'IE.Dublin': 'Europe/Dublin',
  'IT.Rome': 'Europe/Rome',
  'LT.Vilnius': 'Europe/Vilnius',
  'MA.Casablanca': 'Africa/Casablanca',
  'RU.Moscow': 'Europe/Moscow',
  'UK.London': 'Europe/London',
  'ES.Madrid': 'Europe/Madrid'
};

exports.getTimeTravelOccupancy = async (req, res) => {
  try {
    const { date, time, location } = req.query;
    if (!date || !time || !location) {
      return res.status(400).json({
        success: false,
        error: 'missing query params: expected ?location=<Partition>&date=YYYY-MM-DD&time=HH:MM[:SS]'
      });
    }

    const tz = partitionTimezones[location];
    if (!tz) return res.status(400).json({ success: false, error: `unknown location/partition: ${location}` });

    const atDt = DateTime.fromISO(`${date}T${time}`, { zone: tz });
    if (!atDt.isValid) return res.status(400).json({ success: false, error: 'invalid date/time format' });

    const untilUtc = atDt.setZone('utc').toJSDate();
    const rawEvents = await service.fetchOccupancyAtTime(location, untilUtc);

    const lastByPerson = {};
    rawEvents.forEach(r => {
      const localTs = DateTime.fromJSDate(r.MessageUTC, { zone: 'utc' }).setZone(tz);
      if (localTs <= atDt) {
        const prev = lastByPerson[r.PersonGUID];
        if (!prev || localTs > DateTime.fromJSDate(prev.MessageUTC, { zone: 'utc' }).setZone(tz)) {
          lastByPerson[r.PersonGUID] = r;
        }
      }
    });

    const snapshot = { total: 0, Employee: 0, Contractor: 0 };
    Object.values(lastByPerson).forEach(r => {
      if (r.PersonnelType === 'Employee') snapshot.Employee++;
      else snapshot.Contractor++;
      snapshot.total++;
    });

    res.json({
      success: true,
      location,
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