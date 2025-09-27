const byDate = raw.reduce((acc, r) => {
  if (!r.LocaleMessageTime) {
    console.warn('⚠️ Missing LocaleMessageTime for record:', r.PersonGUID);
    return acc; // skip missing times
  }

  const d = new Date(r.LocaleMessageTime);
  if (isNaN(d.getTime())) {
    console.warn('⚠️ Invalid LocaleMessageTime:', r.LocaleMessageTime, r.PersonGUID);
    return acc;
  }

  const date = d.toISOString().slice(0, 10);

  acc[date] = acc[date] || {};
  if (
    !acc[date][r.PersonGUID] ||
    d < new Date(acc[date][r.PersonGUID].LocaleMessageTime)
  ) {
    acc[date][r.PersonGUID] = r;
  }
  return acc;
}, {});l