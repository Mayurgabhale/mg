const NO_GREEN_LOCATIONS = new Set([
  "quezon city",
  "lt.vilnius"
]);

function isNoGreenLocation(row) {
  const z = String(row.Zone || '').toLowerCase();
  for (const loc of NO_GREEN_LOCATIONS) {
    if (z.includes(loc)) return true;
  }
  return false;
}