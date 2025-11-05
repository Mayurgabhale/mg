const { DateTime } = require('luxon');
const service = require('../services/occupancy.service');
const doorMap = require('../utils/doorMap');

// Partition → timezone map
const siteTimezones = {
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

// --- NEW: Time Travel Endpoint ---
exports.getTimeTravelOccupancy = async (req, res) => {
  try {
    const { date, time, location } = req.query;
    if (!date || !time) {
      return res.status(400).json({ success: false, message: 'Missing date or time' });
    }

    const atDt = DateTime.fromISO(`${date}T${time}`, { zone: 'utc' });

    // Fetch last 7 days of swipes (historical)
    const raw = await service.fetchHistoricalData({ days: 7, location: location || null });
    if (!raw?.length) {
      return res.json({
        success: true,
        scope: location || 'EMEA',
        asOfLocal: atDt.toISO(),
        asOfUTC: atDt.toUTC().toISO(),
        snapshot: { total: 0, Employee: 0, Contractor: 0, byPartition: {} },
        details: []
      });
    }

    // Group by person
    const lastSwipe = {};
    raw.forEach(r => {
      const t = DateTime.fromISO(r.LocaleMessageTime, { zone: 'utc' });
      if (t <= atDt) {
        const prev = lastSwipe[r.PersonGUID];
        if (!prev || t > DateTime.fromISO(prev.LocaleMessageTime, { zone: 'utc' })) {
          lastSwipe[r.PersonGUID] = r;
        }
      }
    });

    const snapshot = { total: 0, Employee: 0, Contractor: 0, byPartition: {} };
    const details = [];
    const unmappedDoors = new Set();

    const isEmployeeType = pt =>
      pt === 'Employee' || pt === 'Terminated Employee' || pt === 'Terminated Personnel';

    const isMidnightAtSite = (partition, dtUTC) => {
      const zone = siteTimezones[partition] || 'Europe/London';
      const local = dtUTC.setZone(zone);
      return local.hour === 0 && local.minute === 0 && local.second === 0;
    };

    Object.values(lastSwipe).forEach(r => {
      const p = r.PartitionName2;
      if (!snapshot.byPartition[p]) {
        snapshot.byPartition[p] = { total: 0, Employee: 0, Contractor: 0 };
      }

      // Reset to zero if it's local midnight at that site
      if (isMidnightAtSite(p, atDt)) return;

      const floorEntry = doorMap.find(d => d.partition === p);
      const floorNorm = floorEntry ? String(floorEntry.inDirectionFloor || '').trim().toLowerCase() : '';

      // skip out of office
      if (floorNorm === 'out of office') return;

      snapshot.byPartition[p].total++;
      if (isEmployeeType(r.PersonnelType)) snapshot.byPartition[p].Employee++;
      else snapshot.byPartition[p].Contractor++;

      snapshot.total++;
      if (isEmployeeType(r.PersonnelType)) snapshot.Employee++;
      else snapshot.Contractor++;

      details.push({
        MessageUTC: r.MessageUTC,
        ObjectName1: r.ObjectName1,
        Door: r.Door,
        PartitionName2: r.PartitionName2,
        PersonGUID: r.PersonGUID,
        PersonnelType: r.PersonnelType,
        Direction: r.Direction,
        LocaleMessageTime: r.LocaleMessageTime
      });
    });

    return res.json({
      success: true,
      scope: location || 'EMEA',
      asOfLocal: atDt.toISO(),
      asOfUTC: atDt.toUTC().toISO(),
      snapshot,
      details
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Time Travel fetch failed' });
  }
};