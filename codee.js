


add in this code
/* ============================================================
   map.js — Fixed & hardened dynamic version (with geocoding)
   ============================================================ */

let realMap;
let CITY_LIST = []; // dynamically populated from API
let cityLayers = {}; // cityName -> { summaryMarker, deviceLayer }
let heatLayer = null;
const regionColors = { APAC: "#0ea5e9", EMEA: "#34d399", NAMER: "#fb923c", LACA: "#a78bfa" };
const regionCenter = { APAC: [20, 100], EMEA: [30, 10], NAMER: [40, -100], LACA: [-10, -60] };
window._mapRegionMarkers = [];

/* ----------------------
   Helper: safe number parse
   ---------------------- */
function toNum(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/* ============================================================
   1. INIT MAP
   ============================================================ */
function initRealMap() {
  // Create map centered world view
  realMap = L.map('realmap', { preferCanvas: true }).setView([20, 0], 2);

  // ESRI World Imagery (satellite) — keep if you want satellite tiles
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20, attribution: 'Tiles © Esri'
  }).addTo(realMap);

  // marker cluster & groups
  window.markerCluster = L.markerClusterGroup({ chunkedLoading: true, showCoverageOnHover: false });
  window.countryLayerGroup = L.layerGroup().addTo(realMap);
  realMap.addLayer(window.markerCluster);

  L.control.scale().addTo(realMap);
}

/* ============================================================
   2. DEVICE ICON HELPERS
   ============================================================ */
function _deviceIconDiv(type) {
  const cls = `device-icon device-${type}`;
  return L.divIcon({ className: cls, iconSize: [14, 14], iconAnchor: [7, 7] });
}

function _placeDeviceIconsForCity(cityObj, deviceCounts, devicesListForCity = []) {
  if (!cityObj || toNum(cityObj.lat) === null || toNum(cityObj.lon) === null) {
    // can't draw devices with no valid coords
    return;
  }

  if (!cityLayers[cityObj.city]) cityLayers[cityObj.city] = { deviceLayer: L.layerGroup().addTo(realMap), summaryMarker: null };
  const layer = cityLayers[cityObj.city].deviceLayer;
  layer.clearLayers();

  const deviceTypes = ['camera', 'controller', 'server', 'archiver'];
  deviceTypes.forEach(type => {
    const cnt = (deviceCounts && deviceCounts[type]) || 0;
    const displayCount = Math.min(cnt, 30);
    for (let i = 0; i < displayCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radiusDeg = 0.02 + Math.random() * 0.035;
      const lat = cityObj.lat + Math.cos(angle) * radiusDeg;
      const lon = cityObj.lon + Math.sin(angle) * radiusDeg;
      const marker = L.marker([lat, lon], { icon: _deviceIconDiv(type) });
      marker.bindTooltip(`${type.toUpperCase()} ${i + 1}`, { direction: 'top', offset: [0, -8], opacity: 0.95 });
      layer.addLayer(marker);
    }

    if (cnt > displayCount) {
      const moreHtml = `<div class="city-label-box" style="padding:6px 8px; font-size:12px;">${type}: ${cnt}</div>`;
      const labelLat = cityObj.lat + 0.045;
      const labelLon = cityObj.lon + (type === 'camera' ? 0.03 : (type === 'controller' ? -0.03 : 0));
      const labelMarker = L.marker([labelLat, labelLon], { icon: L.divIcon({ html: moreHtml, className: "" }) });
      layer.addLayer(labelMarker);
    }
  });
}

/* ============================================================
   3. CITY SUMMARY POPUP
   (left out popup implementation — keep for your UI needs)
   ============================================================ */

/* ============================================================
   4. HEATMAP
   ============================================================ */
function drawHeatmap() {
  // compute points only for valid coordinates
  const totals = CITY_LIST
    .map(c => ({
      lat: toNum(c.lat),
      lon: toNum(c.lon),
      total: c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0
    }))
    .filter(x => x.lat !== null && x.lon !== null && x.total > 0);

  if (!totals.length) {
    if (heatLayer) {
      try { realMap.removeLayer(heatLayer); } catch (e) {}
      heatLayer = null;
    }
    return;
  }

  let maxTotal = Math.max(...totals.map(t => t.total), 1);
  const heatPoints = totals.map(t => [t.lat, t.lon, Math.min(1.5, (t.total / maxTotal) + 0.2)]);
  if (heatLayer) realMap.removeLayer(heatLayer);
  // requires leaflet-heat plugin
  heatLayer = L.heatLayer(heatPoints, { radius: 40, blur: 25, gradient: { 0.2: '#34d399', 0.5: '#fbbf24', 0.8: '#f97316' } }).addTo(realMap);
}

function toggleHeat() {
  if (!heatLayer) return;
  if (realMap.hasLayer(heatLayer)) realMap.removeLayer(heatLayer);
  else realMap.addLayer(heatLayer);
}

/* ============================================================
   5. FIT ALL CITIES
   ============================================================ */
function fitAllCities() {
  const validCoords = CITY_LIST
    .map(c => [toNum(c.lat), toNum(c.lon)])
    .filter(([lat, lon]) => lat !== null && lon !== null);

  if (!validCoords.length) return;
  const bounds = L.latLngBounds(validCoords);
  realMap.fitBounds(bounds.pad(0.25));
}

/* ============================================================
   6. SIDE PANEL
   ============================================================ */
function populateGlobalCityList() {
  const panel = document.getElementById("region-panel-content");
  if (!panel) return;
  let html = `<h4>Global Devices</h4><hr>`;
  CITY_LIST.forEach((c, idx) => {
    const total = c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0;
    // attach a data-index for robust click handling
    html += `<div class="city-item" data-city-index="${idx}">
                <div style="font-weight:700">${c.city}</div>
                <div class="small-muted">${c.region || '—'} • ${total} devices</div>
             </div>`;
  });
  panel.innerHTML = html;

  // attach click handlers
  panel.querySelectorAll('.city-item').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.getAttribute('data-city-index'));
      const c = CITY_LIST[idx];
      if (c && toNum(c.lat) !== null && toNum(c.lon) !== null) {
        realMap.flyTo([c.lat, c.lon], 7, { duration: 1.0 });
      }
      populateCityPanel(c ? c.city : null);
    });
  });
}

function onCityItemClick(cityName) {
  const c = CITY_LIST.find(x => x.city === cityName);
  if (c && toNum(c.lat) !== null && toNum(c.lon) !== null) realMap.flyTo([c.lat, c.lon], 7, { duration: 1.0 });
  populateCityPanel(cityName);
}

function populateCityPanel(cityName) {
  const panel = document.getElementById("region-panel-content");
  const c = CITY_LIST.find(x => x.city === cityName);
  if (!panel || !c) return;
  const total = c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0;
  panel.innerHTML = `
    <h4>${cityName} — ${total} devices</h4><hr>
    <div><b>Camera:</b> ${c.devices.camera || 0}</div>
    <div><b>Controller:</b> ${c.devices.controller || 0}</div>
    <div><b>Server:</b> ${c.devices.server || 0}</div>
    <div><b>Archiver:</b> ${c.devices.archiver || 0}</div>
  `;
}

/* ============================================================
   7. REGION BADGES
   ============================================================ */
function drawRegionBadges() {
  window._mapRegionMarkers.forEach(m => realMap.removeLayer(m));
  window._mapRegionMarkers = [];

  Object.keys(regionCenter).forEach(region => {
    const devices = CITY_LIST.filter(c => c.region === region)
      .reduce((sum, c) => sum + Object.values(c.devices || {}).reduce((a, b) => a + b, 0), 0);
    const html = `<div class="region-badge" style="background:${regionColors[region]};">${region}<br>${devices} devices</div>`;
    const marker = L.marker(regionCenter[region], {
      icon: L.divIcon({ html, className: "", iconSize: [120, 60], iconAnchor: [60, 30] })
    }).addTo(realMap).on("click", () => populateRegionPanel(region));
    window._mapRegionMarkers.push(marker);
  });
}

function populateRegionPanel(region) {
  const panel = document.getElementById("region-panel-content");
  if (!panel) return;
  const cities = CITY_LIST.filter(c => c.region === region);
  let html = `<h4>${region} Region</h4><hr>`;
  cities.forEach((c, idx) => {
    const total = c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0;
    html += `<div class="city-item" data-city-index="${CITY_LIST.indexOf(c)}"><b>${c.city}</b> — ${total} devices</div>`;
  });
  panel.innerHTML = html;

  panel.querySelectorAll('.city-item').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.getAttribute('data-city-index'));
      const c = CITY_LIST[idx];
      if (c && toNum(c.lat) !== null && toNum(c.lon) !== null) realMap.flyTo([c.lat, c.lon], 7, { duration: 1.0 });
      populateCityPanel(c ? c.city : null);
    });
  });
}

function ensureUniqueCityCoordinates(cityArray) {
  // Only consider valid coordinates
  const map = {};
  cityArray.forEach(c => {
    const lat = toNum(c.lat);
    const lon = toNum(c.lon);
    if (lat === null || lon === null) return;
    const key = `${lat.toFixed(6)}_${lon.toFixed(6)}`;
    if (!map[key]) map[key] = [];
    map[key].push(c);
  });

  Object.values(map).forEach(group => {
    if (group.length <= 1) return;
    const baseLat = toNum(group[0].lat);
    const baseLon = toNum(group[0].lon);
    if (baseLat === null || baseLon === null) return;

    const radius = 0.02; // ~2km
    group.forEach((c, i) => {
      const angle = (2 * Math.PI * i) / group.length;
      c.lat = baseLat + Math.cos(angle) * radius;
      c.lon = baseLon + Math.sin(angle) * radius;
    });
  });
}

/* ============================================================
   8. GEOCODE MISSING CITIES
   ============================================================ */

async function getCityCoordinates(cityName) {
  if (!cityName) return null;
  try {
    // limit=1 to reduce results; Nominatim policy expects a proper Referer/identification for heavy use
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(cityName)}`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) {
      console.warn("Geocode HTTP error", res.status, cityName);
      return null;
    }
    const data = await res.json();
    if (data && data.length > 0) {
      const lat = toNum(data[0].lat);
      const lon = toNum(data[0].lon);
      if (lat !== null && lon !== null) return [lat, lon];
    }
  } catch (err) {
    console.warn("Geocode failed for", cityName, err);
  }
  return null; // fallback
}

/* ============================================================
   9. UPDATE MAP DYNAMICALLY
   ============================================================ */

async function updateMapData(summary, details) {
  try {
    if (!realMap || !details) return;

    const deviceBuckets = details.details || details;
    if (!deviceBuckets) return;

    const cityMap = {};
    Object.entries(deviceBuckets).forEach(([rawKey, arr]) => {
      if (!Array.isArray(arr)) return;
      arr.forEach(dev => {
        const cityNameRaw = dev.city || dev.location || dev.site || "Unknown";
        const cityName = (typeof cityNameRaw === 'string') ? cityNameRaw.trim() : String(cityNameRaw);
        let lat = toNum(dev.lat);
        let lon = toNum(dev.lon);

        const keyLower = (rawKey || "").toLowerCase();
        const type = keyLower.includes("camera") ? "camera" :
                     keyLower.includes("controller") ? "controller" :
                     keyLower.includes("server") ? "server" :
                     keyLower.includes("archiver") ? "archiver" : null;

        if (!cityMap[cityName]) cityMap[cityName] = {
          city: cityName,
          lat: (lat !== null ? lat : null),
          lon: (lon !== null ? lon : null),
          devices: { camera: 0, controller: 0, server: 0, archiver: 0 },
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
      });
    });

    CITY_LIST = Object.values(cityMap);

    // Geocode cities with missing coordinates (sequentially to avoid hammering service).
    for (let c of CITY_LIST) {
      if (toNum(c.lat) === null || toNum(c.lon) === null) {
        const coords = await getCityCoordinates(c.city);
        if (coords && coords.length === 2) {
          c.lat = coords[0];
          c.lon = coords[1];
        } else {
          // keep as null to avoid placing at 0,0
          c.lat = null;
          c.lon = null;
        }
      }
    }

    // Avoid overlapping city coordinates (only on valid coords)
    ensureUniqueCityCoordinates(CITY_LIST);

    // Place device markers
    CITY_LIST.forEach(c => {
      if (!cityLayers[c.city]) cityLayers[c.city] = { deviceLayer: L.layerGroup().addTo(realMap), summaryMarker: null };
      cityLayers[c.city].deviceLayer.clearLayers();
      _placeDeviceIconsForCity(c, c.devices, c.devicesList);
    });

    // optional: create simple summary markers for cities with coordinates
    Object.values(cityLayers).forEach(l => { /* left as-is, marker layering handled in _placeDeviceIconsForCity */ });

    drawHeatmap();
    populateGlobalCityList();
    drawRegionBadges();
  } catch (err) {
    console.error("updateMapData error", err);
  }
}

/* ============================================================
   10. EXPORTS / BUTTON HOOKS
   - hookup all event listeners after DOM ready to avoid null refs
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initRealMap();

  // safe hookup helper
  function setOnClick(id, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
  }

  setOnClick("toggle-heat", toggleHeat);
  setOnClick("fit-all", fitAllCities);
  setOnClick("show-global", populateGlobalCityList);

  // expose updateMapData for external calls
  window.updateMapData = updateMapData;
});
