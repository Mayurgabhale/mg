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


.....
.....

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


......
...
// normalize city names so grouping matches CITY_LIST
offlineDevices.forEach(dev => {
  const src = dev.device || dev;
  src.city = (typeof normalizeCityForMap === 'function') ? normalizeCityForMap(src.city || 'Unknown') : (src.city || 'Unknown');
});


....
..




...........



// ---------- SHARED HELPERS: flatten + detect-type + aggregator ----------

/**
 * Detect simplified device type (camera/controller/server/archiver)
 * from either the bucket key or device.type/product/model strings.
 */
function detectDeviceType(bucketKeyOrType, deviceObj) {
  const key = (bucketKeyOrType || '').toString().toLowerCase();
  const typeField = (deviceObj && (deviceObj.type || deviceObj.deviceType || deviceObj.product || deviceObj.model)) || '';
  const tf = typeField.toString().toLowerCase();

  // check explicit fields first
  if (tf.includes('camera')) return 'camera';
  if (tf.includes('archiver') || tf.includes('archive')) return 'archiver';
  if (tf.includes('controller')) return 'controller';
  if (tf.includes('server') || tf.includes('ccure') || tf.includes('db')) return 'server';

  // fallback to bucket key (like 'cameras', 'controllers', etc)
  if (key.includes('camera')) return 'camera';
  if (key.includes('archiver')) return 'archiver';
  if (key.includes('controller')) return 'controller';
  if (key.includes('server') || key.includes('ccure')) return 'server';

  // unknown
  return null;
}

/**
 * Flatten a "buckets" object-of-arrays (or array) into a simple devices array.
 * Accepts either:
 * - an object mapping bucketName -> [device,...]
 * - OR a plain array of device entries
 *
 * Each returned device has canonical properties:
 *   { city, lat, lon, type, status, online, region, original: <original object> }
 */
function flattenDeviceBuckets(buckets) {
  const res = [];

  if (!buckets) return res;

  // If buckets is a plain array of devices
  if (Array.isArray(buckets)) {
    buckets.forEach(d => {
      const source = d.device ? d.device : d;
      res.push({
        city: (source.city || source.location || source.site || "Unknown"),
        lat: toNum(source.lat),
        lon: toNum(source.lon),
        type: detectDeviceType(source.type || '', source),
        status: source.status || source.state || null,
        online: typeof source.online === 'boolean' ? source.online : undefined,
        region: source.region || source.zone || null,
        original: source
      });
    });
    return res;
  }

  // If buckets is object of arrays
  Object.entries(buckets).forEach(([key, arr]) => {
    if (!Array.isArray(arr)) return;
    arr.forEach(item => {
      const source = item.device ? item.device : item;
      res.push({
        city: (source.city || source.location || source.site || "Unknown"),
        lat: toNum(source.lat),
        lon: toNum(source.lon),
        type: detectDeviceType(key, source),
        status: source.status || source.state || null,
        online: typeof source.online === 'boolean' ? source.online : undefined,
        region: source.region || source.zone || null,
        original: source
      });
    });
  });

  return res;
}

/**
 * Build CITY_LIST (array) from a flat devices array.
 * This produces the same structure used elsewhere: { city, lat, lon, devices:{...}, offline:{...}, total, devicesList, region }
 */
function buildCityMapFromDevices(flatDevices) {
  const cityMap = {};

  flatDevices.forEach(dev => {
    // normalize the city to the parent/standardized name
    const rawName = dev.city || "Unknown";
    const cityName = (typeof normalizeCityForMap === 'function') ? normalizeCityForMap(rawName) : (String(rawName).trim() || 'Unknown');

    if (!cityMap[cityName]) {
      cityMap[cityName] = {
        city: cityName,
        lat: (dev.lat !== undefined && dev.lat !== null) ? dev.lat : null,
        lon: (dev.lon !== undefined && dev.lon !== null) ? dev.lon : null,
        devices: { camera: 0, controller: 0, server: 0, archiver: 0 },
        offline: { camera: 0, controller: 0, server: 0, archiver: 0 },
        total: 0,
        devicesList: [],
        region: dev.region || null
      };
    }

    const entry = cityMap[cityName];
    const t = dev.type;

    if (t && entry.devices.hasOwnProperty(t)) {
      entry.devices[t] = (entry.devices[t] || 0) + 1;
    } else {
      // unknown types: place them into devicesList but still count total
    }

    entry.total = (entry.total || 0) + 1;
    entry.devicesList.push(dev.original || dev);

    // update lat/lon if device has a coordinate
    if (dev.lat !== null && dev.lon !== null) {
      entry.lat = dev.lat;
      entry.lon = dev.lon;
    }

    // offline detection
    const s = ((dev.status || '') + '').toLowerCase();
    const isOffline = (s === 'offline' || s === 'down' || dev.online === false);
    if (isOffline) {
      if (t && entry.offline.hasOwnProperty(t)) {
        entry.offline[t] = (entry.offline[t] || 0) + 1;
      } else {
        // nothing
      }
    }
  });

  // Convert to array and ensure coords + uniquify coords
  let list = Object.values(cityMap);
  list.forEach(c => {
    if (c.lat === null || c.lon === null) {
      // will be geocoded later by getCityCoordinates if needed
      c.lat = null;
      c.lon = null;
    }
  });

  // keep same shape used by other code
  return list;
}