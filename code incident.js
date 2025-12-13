// suppress green background for Quezon & Vilnius
const suppressGreen = isNoGreenLocation(r);

const cls = [];
if (isDayStart && !suppressGreen) cls.push('row-day-start');
if (flags[idx].outReturn) cls.push('row-out-return');

const rowStyle =
  (isDayStart && !suppressGreen)
    ? { background: '#e6ffed' }
    : {};