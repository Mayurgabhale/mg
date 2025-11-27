async function updateMapData(summary, details) {
  try {
    if (!realMap || !details) return;

    const deviceBuckets = details.details || details;
    if (!deviceBuckets) return;

    // Flatten to a devices array using shared helper
    const flatDevices = flattenDeviceBuckets(deviceBuckets);

    // Build CITY_LIST using the canonical builder
    CITY_LIST = buildCityMapFromDevices(flatDevices);

    // geocode missing coords
    for (let c of CITY_LIST) {
      if (toNum(c.lat) === null || toNum(c.lon) === null) {
        const coords = await getCityCoordinates(c.city);
        if (coords && coords.length === 2) {
          c.lat = coords[0];
          c.lon = coords[1];
        } else {
          c.lat = null;
          c.lon = null;
        }
      }
    }

    // ensure unique coords
    ensureUniqueCityCoordinates(CITY_LIST);

    // compute blink/severity after CITY_LIST built (unchanged)
    CITY_LIST.forEach(c => {
      const a = (c.offline && c.offline.archiver) || 0;
      const ctrl = (c.offline && c.offline.controller) || 0;
      const srv = (c.offline && c.offline.server) || 0;
      c.shouldBlink = (a + ctrl + srv) > 0;
      c.blinkSeverity = Math.min(5, a + ctrl + srv); // scale 0..5
    });

    // Place device icons & device layers
    CITY_LIST.forEach(c => {
      if (!cityLayers[c.city]) cityLayers[c.city] = { deviceLayer: L.layerGroup().addTo(realMap), summaryMarker: null };
      cityLayers[c.city].deviceLayer.clearLayers();
      _placeDeviceIconsForCity(c, c.devices, c.devicesList);
    });

    drawHeatmap();
    populateGlobalCityList();
    if (typeof drawRegionBadges === 'function') drawRegionBadges();

  } catch (err) {
    console.error("updateMapData error", err);
  }

  // redraw UI overlays and markers
  if (typeof drawCityBarChart === 'function') drawCityBarChart();
  placeCityMarkers();
  fitAllCities();
}





...
function renderOfflineChartFromCombined(combinedDevices) {
  // combinedDevices may be an array of { device: <device> } or an array of devices
  const flatInput = combinedDevices && combinedDevices.map
    ? combinedDevices.map(d => (d.device ? d.device : d))
    : (Array.isArray(combinedDevices) ? combinedDevices : []);

  // Build canonical flat devices array using the same flatten helper (we accept array input)
  const flatDevices = flattenDeviceBuckets(flatInput);

  // Rebuild CITY_LIST so LOC Count (cityBarChart) and map stay consistent with offline chart
  CITY_LIST = buildCityMapFromDevices(flatDevices);

  // geocode missing coords asynchronously is optional here; map updateMapData normally handles it.
  // ensureUniqueCityCoordinates(CITY_LIST); // optional if already handled elsewhere

  // Build offline devices array for the scatter chart
  const offlineDevices = flatDevices.filter(d => {
    const s = ((d.status || '') + '').toLowerCase();
    return (s === 'offline' || s === 'down' || d.online === false);
  }).map(d => ({
    device: d,            // keep device info accessible (updateOfflineChart expects .device)
    type: d.type || ''    // type must match what updateOfflineChart expects (camera/archiver/controller/server)
  }));

  // Update the offline scatter chart (uses grouping logic inside)
  updateOfflineChart(offlineDevices);

  // Also update LOC Count bar chart and map overlays to stay in sync
  if (typeof drawCityBarChart === 'function') drawCityBarChart();
  placeCityMarkers && placeCityMarkers();
  drawHeatmap && drawHeatmap();
}