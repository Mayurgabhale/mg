// Accept combinedDevices = [{ device: {type,status,city,...} }, ...]
// and build a CITY_LIST aligned with chart data
function updateOfflineMapFromCombined(combinedDevices) {
  if (!Array.isArray(combinedDevices)) return;

  const cityMap = {};
  combinedDevices.forEach(entry => {
    if (!entry || !entry.device) return;
    const dev = entry.device;
    const rawCity = dev.city || "Unknown";
    const cityName = normalizeCityForMap(String(rawCity || "Unknown"));
    const type = (dev.type || "").toString().toLowerCase();
    const allowed = ['camera','controller','server','archiver'];
    if (!allowed.includes(type)) return; // ignore other types for map totals

    if (!cityMap[cityName]) cityMap[cityName] = {
      city: cityName,
      lat: null, lon: null,
      devices: { camera:0, controller:0, server:0, archiver:0 },
      offline: { camera:0, controller:0, server:0, archiver:0 },
      total: 0, devicesList: []
    };

    cityMap[cityName].devices[type] += 1;
    cityMap[cityName].total += 1;
    cityMap[cityName].devicesList.push(dev);
    if (isDeviceOffline(dev)) cityMap[cityName].offline[type]++;
  });

  // convert to CITY_LIST and try geocoding
  CITY_LIST = Object.values(cityMap);
  // assign coords from CITY_COORDS if available
  CITY_LIST.forEach(c => {
    const coords = CITY_COORDS[c.city];
    if (coords && coords.length === 2) {
      c.lat = coords[0]; c.lon = coords[1];
    }
  });

  ensureUniqueCityCoordinates(CITY_LIST);
  placeCityMarkers();
  drawHeatmap();
}