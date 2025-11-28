// map.js - Dynamic map that uses the same city data logic as your bar chart
// Drop this in C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\map.js
// Requirements satisfied:
//  - Uses your existing combinedDevices array
//  - Re-uses buildCityBarDataWithBreakdown() if available (keeps same logic & risk levels)
//  - Falls back to internal aggregation if needed
//  - Creates side-panel list (Global (City Overview)) matching bar chart cities
//  - Click a city -> flyTo on map and open popup
//  - Hover marker shows counts and offline/online info
//  - Safe checks and helpful console logs

/* global L, buildCityBarDataWithBreakdown */ // for linters (buildCityBarDataWithBreakdown may exist in graph.js)

let realMap = null;
window.cityMarkerLayer = null;
window._cityMarkerIndex = {}; // city -> marker

// City coordinate lookup (extend as needed)
const CITY_COORDS = {
  "Casablanca": [33.5731, -7.5898],
  "Dubai": [25.276987, 55.296249],
  "Argentina": [-38.4161, -63.6167],
  "Austin TX": [30.2672, -97.7431],
  "Austria": [48.2082, 16.3738],
  "Costa Rica": [9.7489, -83.7534],
  "Denver": [39.7392, -104.9903],
  "Florida, Miami": [25.7617, -80.1918],
  "Frankfurt": [50.1109, 8.6821],
  "Ireland": [53.3331, -6.2489],
  "Italy, Rome": [41.9028, 12.4964],
  "Japan Tokyo": [35.6762, 139.6503],
  "Kuala lumpur": [3.1390, 101.6869],
  "London": [51.5074, -0.1278],
  "Madrid": [40.4168, -3.7038],
  "Mexico": [23.6345, -102.5528],
  "Moscow": [55.7558, 37.6173],
  "NEW YORK": [40.7128, -74.0060],
  "Panama": [8.5380, -80.7821],
  "Peru": [-9.1900, -75.0152],
  "Pune": [18.5204, 73.8567],
  "Vilnius": [54.6872, 25.2797],
  "Singapore": [1.3521, 103.8198],
  "HYDERABAD": [17.3850, 78.4867],
  "Taguig City": [14.5176, 121.0509],
  "Quezon": [14.6760, 121.0437]
};

// ---------- Helpers ----------
function ensureMapContainerHeight() {
  const el = document.getElementById('realmap');
  if (!el) return;
  const h = (el.clientHeight || 0);
  if (h === 0) {
    // ensure visibility: set a sensible default height if CSS forgot
    el.style.minHeight = '420px';
  }
}

function isLeafletLoaded() {
  return typeof L !== 'undefined' && !!L;
}

function fuzzyCityCoords(cityName) {
  if (!cityName) return null;
  // exact
  if (CITY_COORDS[cityName]) return CITY_COORDS[cityName];
  const low = cityName.toLowerCase();
  // find key that includes the city or vice versa
  const match = Object.keys(CITY_COORDS).find(k => k.toLowerCase().includes(low) || low.includes(k.toLowerCase()));
  return match ? CITY_COORDS[match] : null;
}

function normalizeCityForMap(raw) {
  if (!raw) return 'Unknown';
  const s = raw.toString().trim().toLowerCase();
  if (s.startsWith('pune')) return 'Pune';
  if (s.includes('vilnius') || s.includes('gama') || s.includes('delta')) return 'Vilnius';
  if (s.includes('taguig')) return 'Taguig City';
  if (s.includes('quezon')) return 'Quezon';
  // fallback: capitalize first letter
  return raw.toString().trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Build detailed city stats (ensures we have totals + online/offline + per-type counts)
function computeFullCityStats(combinedDevices = []) {
  const map = {};
  (combinedDevices || []).forEach(entry => {
    const dev = entry.device ? entry.device : entry;
    if (!dev) return;
    const rawCity = dev.city || dev.location || 'Unknown';
    const city = normalizeCityForMap(rawCity);
    if (!map[city]) {
      map[city] = {
        city,
        total: 0,
        online: 0,
        offline: 0,
        types: { camera: 0, archiver: 0, controller: 0, server: 0 } // counts
      };
    }
    const status = (dev.status || '').toString().toLowerCase();
    const type = (dev.type || '').toString().toLowerCase();

    map[city].total++;
    if (status === 'offline' || status === 'down') map[city].offline++;
    else map[city].online++;

    if (type.includes('camera')) map[city].types.camera++;
    else if (type.includes('archiver')) map[city].types.archiver++;
    else if (type.includes('controller')) map[city].types.controller++;
    else if (type.includes('server') || type.includes('ccure')) map[city].types.server++;
    // else ignore unknown types for the per-type count
  });
  return map;
}

// ---------- Map init ----------
function initRealMap() {
  ensureMapContainerHeight();

  if (!isLeafletLoaded()) {
    console.error('Leaflet not loaded. Add <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>');
    return;
  }
  if (realMap) return;

  realMap = L.map('realmap', {
    preferCanvas: true,
    minZoom: 2,
    maxZoom: 18,
    worldCopyJump: true
  }).setView([15, 0], 2.5);

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    attribution: 'Tiles © Esri'
  }).addTo(realMap);

  window.cityMarkerLayer = L.layerGroup().addTo(realMap);
  console.debug('initRealMap: initialized');
}

// ---------- Create marker (divIcon) ----------
function createCityDivMarker(stats, extra = {}) {
  const color = stats.offline > 0 ? '#d32f2f' : '#388e3c'; // red if any offline, else green
  const html = `
    <div class="city-pin" style="display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:20px;background:rgba(0,0,0,0.6);color:#fff;">
      <span style="font-size:14px"><i class="bi bi-geo-alt-fill"></i></span>
      <span class="city-pin-count" style="font-weight:700">${stats.total}</span>
    </div>`.trim();

  const icon = L.divIcon({
    html,
    className: 'city-pin-wrapper',
    iconSize: [44, 36],
    iconAnchor: [22, 36]
  });

  const marker = L.marker([stats.lat, stats.lon], { icon });

  // Tooltip / popup content: combine bar-chart details (offline per type & risk) if available (extra.details)
  let tooltipHtml = `<div style="min-width:220px">
    <div style="font-weight:700;margin-bottom:6px">${stats.city}</div>
    <div><strong>Total:</strong> ${stats.total}</div>
    <div><strong>Online:</strong> ${stats.online} &nbsp; | &nbsp; <strong>Offline:</strong> ${stats.offline}</div>
    <hr style="margin:6px 0"/>
    <div><i class="bi bi-camera"></i> Cameras: ${stats.types.camera}</div>
    <div><i class="fas fa-database"></i> Archivers: ${stats.types.archiver}</div>
    <div><i class="bi bi-hdd"></i> Controllers: ${stats.types.controller}</div>
    <div><i class="fa-solid fa-server"></i> CCURE: ${stats.types.server}</div>
  `;

  if (extra && extra.details) {
    const d = extra.details; // { offline: {...}, risk: 'High' }
    tooltipHtml += `<hr style="margin:6px 0"/><div><strong>Risk:</strong> ${d.risk}</div>`;
    tooltipHtml += `<div style="font-size:13px;color:#eee;margin-top:6px">Offline breakdown:<br>
      Cameras: ${d.offline.camera || 0}, Controllers: ${d.offline.controller || 0}, Archivers: ${d.offline.archiver || 0}, Servers: ${d.offline.server || 0}
    </div>`;
  }

  tooltipHtml += `</div>`;

  marker.bindTooltip(tooltipHtml, { sticky: true, direction: 'top', opacity: 0.95, className: 'city-tooltip' });
  marker.bindPopup(tooltipHtml, { maxWidth: 320 });

  return marker;
}

// ---------- Build side panel content (uses same order/labels as bar chart) ----------
function buildRegionPanelFromBarData(barResult, fullStatsMap) {
  const panel = document.getElementById('region-panel-content');
  if (!panel) return;
  panel.innerHTML = '';

  // barResult.details is like [{city, total, offline: {...}, risk}, ...]
  const details = (barResult && Array.isArray(barResult.details)) ? barResult.details : [];

  // if no details, fallback to fullStatsMap keys
  const rows = details.length ? details : Object.values(fullStatsMap).map(s => ({
    city: s.city,
    total: s.total,
    offline: { camera: 0, controller: 0, archiver: 0, server: 0 },
    risk: 'Low'
  }));

  rows.forEach(r => {
    const c = document.createElement('div');
    c.className = 'city-item';
    c.style.padding = '8px';
    c.style.cursor = 'pointer';
    c.dataset.city = r.city;

    const left = document.createElement('div');
    left.textContent = r.city;
    left.style.fontWeight = '600';

    const right = document.createElement('div');
    right.innerHTML = `— • ${r.total} devices`;
    right.style.color = '#666';
    right.style.fontSize = '13px';

    c.appendChild(left);
    c.appendChild(right);

    c.addEventListener('click', () => {
      // find full stat entry for lat/lon
      const full = fullStatsMap[r.city];
      if (!full || full.lat == null) {
        alert(`${r.city} does not have coordinates configured. Add to CITY_COORDS.`);
        return;
      }
      if (!realMap) initRealMap();
      realMap.flyTo([full.lat, full.lon], 12, { duration: 0.6 });
      const m = window._cityMarkerIndex[r.city];
      if (m) m.openPopup();
    });

    c.addEventListener('mouseenter', () => c.classList.add('hover'));
    c.addEventListener('mouseleave', () => c.classList.remove('hover'));

    panel.appendChild(c);
  });

  if (rows.length === 0) {
    panel.innerHTML = '<div class="no-cities">No city data available</div>';
  }
}

// ---------- MAIN: use bar chart logic if available, else compute ourselves ----------
function updateMapFromCombined(combinedDevices = []) {
  if (!isLeafletLoaded()) {
    console.error('Leaflet not loaded - cannot render map.');
    return;
  }
  if (!realMap) initRealMap();

  // compute full stats (per-city totals + per-type + online/offline)
  const fullStats = computeFullCityStats(combinedDevices); // map: city -> stats

  // Try to reuse the bar-chart function to get the same city list/order + risk/offline details
  let barResult = null;
  try {
    if (typeof buildCityBarDataWithBreakdown === 'function') {
      barResult = buildCityBarDataWithBreakdown(combinedDevices);
      console.debug('updateMapFromCombined: obtained barResult from buildCityBarDataWithBreakdown');
    } else {
      console.debug('updateMapFromCombined: buildCityBarDataWithBreakdown not found, falling back.');
    }
  } catch (e) {
    console.warn('updateMapFromCombined: error calling buildCityBarDataWithBreakdown(), falling back.', e);
    barResult = null;
  }

  // Merge details: barResult.details gives offline breakdown and risk, fullStats gives totals + lat candidates
  // Build unified map: city -> { city, total, online, offline, types: {...}, lat, lon, details: {...} }
  const unified = {};

  // Use keys from barResult.labels (if present) for ordering
  const cityKeys = (barResult && Array.isArray(barResult.labels) && barResult.labels.length) ? barResult.labels : Object.keys(fullStats);

  cityKeys.forEach(key => {
    const cityName = key;
    const fs = fullStats[cityName] || { city: cityName, total: 0, online: 0, offline: 0, types: { camera:0, archiver:0, controller:0, server:0 } };
    const detail = (barResult && Array.isArray(barResult.details)) ? barResult.details.find(d => d.city === cityName) : null;

    // find coords
    let coords = fuzzyCityCoords(cityName);
    if (!coords) {
      // try searching in fullStats devices for lat/lon in device objects - but we don't have device-level coords here
      // leave coords null and warn
    }

    unified[cityName] = {
      city: cityName,
      total: fs.total,
      online: fs.online,
      offline: fs.offline,
      types: fs.types,
      lat: coords ? coords[0] : null,
      lon: coords ? coords[1] : null,
      details: detail || { offline: { camera:0, controller:0, archiver:0, server:0 }, risk: (fs.offline>0 ? 'Medium' : 'Low') }
    };
  });

  // Build side panel using barResult (to keep consistent with chart)
  buildRegionPanelFromBarData(barResult || { labels: Object.keys(unified), details: Object.values(unified).map(u => ({ city: u.city, total: u.total, offline: u.details.offline, risk: u.details.risk })) }, fullStats);

  // Clear existing markers
  if (!window.cityMarkerLayer) window.cityMarkerLayer = L.layerGroup().addTo(realMap);
  window.cityMarkerLayer.clearLayers();
  window._cityMarkerIndex = {};

  const coordsForBounds = [];

  // Add markers for cities that have coords
  Object.values(unified).forEach(city => {
    if (city.lat == null || city.lon == null) {
      // skip adding marker but keep in panel
      console.debug(`No coords for city '${city.city}' - skipping marker`);
      return;
    }

    const marker = createCityDivMarker(city, { details: city.details });
    marker.addTo(window.cityMarkerLayer);
    window._cityMarkerIndex[city.city] = marker;
    coordsForBounds.push([city.lat, city.lon]);
  });

  // Fit map to markers if any
  if (coordsForBounds.length) {
    try {
      realMap.fitBounds(L.latLngBounds(coordsForBounds).pad(0.25));
    } catch (e) {
      console.warn('fitBounds failed', e);
    }
  } else {
    // If no markers, go to global view
    realMap.setView([15, 0], 2.5);
  }
}

// ---------- Utility UI wiring ----------
function setupButtons() {
  document.getElementById('fit-all')?.addEventListener('click', () => {
    if (!window.cityMarkerLayer) return;
    const layers = window.cityMarkerLayer.getLayers();
    if (!layers || !layers.length) return;
    const group = L.featureGroup(layers);
    realMap.fitBounds(group.getBounds().pad(0.25));
  });

  document.getElementById('show-global')?.addEventListener('click', () => {
    realMap.setView([15, 0], 2.5);
  });

  document.getElementById('mapFullscreenBtn')?.addEventListener('click', () => {
    const card = document.querySelector('.worldmap-card');
    if (card) card.classList.toggle('fullscreen');
    setTimeout(() => realMap.invalidateSize(), 300);
  });

  document.getElementById('mapCityOverviewBtn')?.addEventListener('click', () => {
    const panel = document.getElementById('region-panel');
    if (panel) panel.classList.toggle('open');
    setTimeout(() => realMap.invalidateSize(), 300);
  });
}

// ---------- Init on DOM ready ----------
document.addEventListener('DOMContentLoaded', () => {
  try {
    initRealMap();
    setupButtons();
    const panel = document.getElementById('region-panel-content');
    if (panel) panel.innerHTML = '<div class="no-cities">Waiting for data…</div>';
    console.debug('map.js loaded and initialized');
  } catch (e) {
    console.error('map.js init error', e);
  }
});

// ---------- Export for other scripts to call ----------
// `graph.js` should call updateMapFromCombined(combinedDevices) inside renderOfflineChartFromCombined
window.updateMapFromCombined = updateMapFromCombined;