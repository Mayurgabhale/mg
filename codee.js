// map.js

// Existing helpers
function toNum(v) { ... }
function normalizeCityForMap(name) { ... }

// ✅ ADD YOUR HELPERS HERE
// ---------- SHARED HELPERS: flatten + detect-type + aggregator ----------
function detectDeviceType(...) { ... }
function flattenDeviceBuckets(...) { ... }
function buildCityMapFromDevices(...) { ... }

// Then later in map.js:
const flatDevices = flattenDeviceBuckets(deviceBuckets);
CITY_LIST = buildCityMapFromDevices(flatDevices);