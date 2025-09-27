const byDate = raw.reduce((acc, r) => {
  const d = new Date(r.LocaleMessageTime);

  // Skip rows with invalid or missing dates
  if (isNaN(d.getTime())) {
    console.warn('⚠️ Skipping invalid LocaleMessageTime:', r.LocaleMessageTime, r.PersonGUID);
    return acc;
  }

  // Get YYYY-MM-DD
  const date = d.toISOString().slice(0, 10);

  acc[date] = acc[date] || {};
  if (
    !acc[date][r.PersonGUID] ||
    d < new Date(acc[date][r.PersonGUID].LocaleMessageTime)
  ) {
    acc[date][r.PersonGUID] = r;
  }
  return acc;
}, {});