async function updateMapData(summary, details) {
  if (!realMap || !details) return;

  try {
    const deviceBuckets = details.details || details;
    if (!deviceBuckets) return;

    const cityMap = {};

    Object.entries(deviceBuckets).forEach(([rawKey, arr]) => {
      if (!Array.isArray(arr)) return;

      arr.forEach(dev => {
        const cityName = normalizeCityForMap(dev.city || dev.location || dev.site || "Unknown");
        let lat = toNum(dev.lat), lon = toNum(dev.lon);

        const type = ['camera','controller','server','archiver'].find(t => rawKey.toLowerCase().includes(t));

        if (!cityMap[cityName]) {
          cityMap[cityName] = {
            city: cityName,
            lat: lat || null,
            lon: lon || null,
            devices: { camera: 0, controller: 0, server: 0, archiver: 0 },
            offline: { camera: 0, controller: 0, server: 0, archiver: 0 },
            total: 0,
            devicesList: [],
            region: dev.region || dev.zone || null
          };
        }

        if (type) cityMap[cityName].devices[type] += 1;
        cityMap[cityName].total += 1;
        cityMap[cityName].devicesList.push(dev);

        if (lat !== null && lon !== null) {
          cityMap[cityName].lat = lat;
          cityMap[cityName].lon = lon;
        }

        if (isDeviceOffline(dev) && type) {
          cityMap[cityName].offline[type] += 1;
        }
      });
    });

    CITY_LIST = Object.values(cityMap);

    // Fill missing coordinates
    for (const c of CITY_LIST) {
      if (toNum(c.lat) === null || toNum(c.lon) === null) {
        const coords = await getCityCoordinates(c.city);
        if (coords) [c.lat, c.lon] = coords;
      }
    }

    ensureUniqueCityCoordinates(CITY_LIST);

    // Compute blinking
    CITY_LIST.forEach(c => {
      const offlineSum = c.offline.archiver + c.offline.controller + c.offline.server;
      c.shouldBlink = offlineSum > 0;
      c.blinkSeverity = Math.min(5, offlineSum);
    });

    // Update device layers
    CITY_LIST.forEach(c => {
      if (!cityLayers[c.city]) cityLayers[c.city] = { deviceLayer: L.layerGroup().addTo(realMap), summaryMarker: null };
      cityLayers[c.city].deviceLayer.clearLayers();
      _placeDeviceIconsForCity(c, c.devices, c.devicesList);
    });

    drawHeatmap();
    populateGlobalCityList();
    if (typeof drawRegionBadges === 'function') drawRegionBadges();

    placeCityMarkers();
    fitAllCities();

  } catch (err) {
    console.error("updateMapData error", err);
  }
}