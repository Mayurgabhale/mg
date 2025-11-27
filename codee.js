// Normalize type keys used by CITY_LIST.offline and other code (singular form)
function normalizeTypeKey(type) {
  if (!type) return type;
  const t = type.toString().trim().toLowerCase();
  if (t === 'cameras') return 'camera';
  if (t === 'camera') return 'camera';
  if (t === 'archivers') return 'archiver';
  if (t === 'archiver') return 'archiver';
  if (t === 'controllers') return 'controller';
  if (t === 'controller') return 'controller';
  if (t === 'servers' || t === 'ccure' || t === 'server') return 'server';
  return t;
}

// Normalize city names (trim and collapse whitespace; optionally lowercase)
function normalizeCityName(city) {
  if (!city) return 'Unknown';
  return city.toString().trim(); // keep case, or use .toLowerCase() if you prefer case-insensitive
}

/**
 * Build/replace global CITY_LIST from combinedDevices.
 * Ensures CITY_LIST entries look like:
 * { city: "Panama", devices: { camera: 10, controller: 2 }, offline: { camera: 2, controller: 0 } }
 */
function buildCityListFromCombined(combinedDevices) {
  const map = {};

  combinedDevices.forEach(item => {
    const dev = item.device || item; // accommodate both shapes
    const rawCity = dev.city || 'Unknown';
    const city = normalizeCityName(rawCity);
    const rawType = dev.type || dev.deviceType || '';
    const type = normalizeTypeKey(rawType);

    if (!map[city]) {
      map[city] = {
        city: city,
        devices: {},    // total devices by type
        offline: { camera: 0, archiver: 0, controller: 0, server: 0 } // ensure keys exist
      };
    }

    // increment total devices count for that type
    if (type) {
      map[city].devices[type] = (map[city].devices[type] || 0) + 1;
    }

    // if device is offline, increment offline[type]
    const status = (dev.status || '').toString().toLowerCase();
    if (status === 'offline') {
      if (type) {
        // ensure offline key exists
        if (!(type in map[city].offline)) {
          map[city].offline[type] = 0;
        }
        map[city].offline[type] = (map[city].offline[type] || 0) + 1;
      }
    }
  });

  // Convert map to array and assign to global CITY_LIST
  CITY_LIST = Object.values(map);

  // If you want deterministic order, sort by city name:
  CITY_LIST.sort((a, b) => a.city.localeCompare(b.city));
}