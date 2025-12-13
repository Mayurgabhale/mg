const NO_GREEN_LOCATIONS = new Set([
  "quezon",
  "vilnius"
]);

function isNoGreenLocation(row) {
  const haystack = [
    row.Door,
    row._source,      // swipes_ltvilnius_20251201.csv
    row.SourceFile,   // if present
    row.FileName      // if present
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  for (const loc of NO_GREEN_LOCATIONS) {
    if (haystack.includes(loc)) return true;
  }
  return false;
}