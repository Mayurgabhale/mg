// inside updateMapData() — where you build cityMap[cityName]
if (!cityMap[cityName]) cityMap[cityName] = {
  city: cityName,
  lat: (lat !== null ? lat : null),
  lon: (lon !== null ? lon : null),
  devices: { camera: 0, controller: 0, server: 0, archiver: 0 },
  offline: { camera: 0, controller: 0, server: 0, archiver: 0 }, // <-- added
  total: 0,
  devicesList: [],
  region: dev.region || dev.zone || null
};

if (type) cityMap[cityName].devices[type] += 1;
cityMap[cityName].total += 1;
cityMap[cityName].devicesList.push(dev);

// If we have coordinates on the device, prefer them (last wins)
if (lat !== null && lon !== null) {
  cityMap[cityName].lat = lat;
  cityMap[cityName].lon = lon;
}

// --- offline detection (same logic as buildCitySummary)
const s = ((dev.status || dev.state || '') + '').toLowerCase();
const isOffline = (s === 'offline' || s === 'down' || dev.online === false);
if (isOffline && type) {
  cityMap[cityName].offline[type] = (cityMap[cityName].offline[type] || 0) + 1;
}






....
...


// after CITY_LIST creation (and after geocoding, if you prefer)
CITY_LIST.forEach(c => {
  // flag to blink if archiver/controller/server (CCURE) have offline devices
  const offlineArchiver = (c.offline && c.offline.archiver) || 0;
  const offlineController = (c.offline && c.offline.controller) || 0;
  const offlineServer = (c.offline && c.offline.server) || 0;

  c.shouldBlink = (offlineArchiver + offlineController + offlineServer) > 0;

  // optional: attach severity for faster blink or color change
  c.blinkSeverity = Math.min(3, offlineArchiver + offlineController + offlineServer);
});




.....
....
...
// inside placeCityMarkers() loop, when creating cityIcon:
const blinkClass = c.shouldBlink ? 'blink' : '';
// optionally add severity class for stronger visual: blink-high for severity >= 3
const severityClass = (c.blinkSeverity && c.blinkSeverity >= 3) ? ' blink-high' : '';

// Build the pin HTML: only add blink class if shouldBlink
const cityIconHtml = `<div><span class="pin ${blinkClass}${severityClass}"><i class="bi bi-geo-alt-fill"></i></span></div>`;

const cityIcon = L.divIcon({
  className: 'city-marker', // keep this stable for CSS scope
  html: cityIconHtml,
  iconAnchor: [12, 12]
});

const marker = L.marker([c.lat, c.lon], { icon: cityIcon });