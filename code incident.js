const suppressGreen = isNoGreenLocation(r);

if (flags[i].dayStart && !suppressGreen) {
  cls.push('row-day-start');
}

const rowStyle =
  (flags[i].dayStart && !suppressGreen)
    ? { background: '#e6ffed' }
    : {};


...


function isNoGreenLocation(row) {
  const z = String(row.Zone || '').toLowerCase();
  return (
    z.includes('quezon') ||
    z.includes('vilnius')
  );
}