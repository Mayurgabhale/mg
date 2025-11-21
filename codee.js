const best = matches[0];
const r = best.rec;   // ✅ Important line

const isOut =
  r.Direction &&
  r.Direction.toLowerCase().includes('out');

const payload = {
  found: !isOut,          
  isOut: isOut,
  source: r.__source || null,
  partition: r.PartitionName2 || r.Partition || null,
  floor: r.Floor || r.Zone || r.floor || null,
  Zone: r.Zone,
  door: r.Door || null,
  direction: r.Direction || null,
  timestampUTC: r.LocaleMessageTime || r.snapshotTime || `${r.Dateonly}T${r.Swipe_Time}Z` || null,
  personnelType: r.PersonnelType || null,
  cardNumber: r.CardNumber || null,

  lastSwipe: {
    door: r.Door || null,
    direction: r.Direction || null,
    time: r.LocaleMessageTime || r.snapshotTime || `${r.Dateonly}T${r.Swipe_Time}Z` || null
  },

  raw: r
};

cache[employeeObjId] = { ts: Date.now(), data: payload };
return res.json(payload);