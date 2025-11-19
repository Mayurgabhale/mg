in map city licatin arenot dispoly i want to point wiht location wiht icon ok and name ok 





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

// Predefined coordinates for your cities (add/update as needed)
const CITY_COORDS = {
  "Casablanca": [33.5731, -7.5898],
  "Dubai": [25.276987, 55.296249],
  "Argentina": [-38.4161, -63.6167],
  "Austin TX": [30.2672, -97.7431],
  "Austria, Vienna": [48.2082, 16.3738],
  "Costa Rica": [9.7489, -83.7534],
  "Delta Building": [37.7749, -122.4194],  // Example, replace with real coords
  "Denver": [39.7392, -104.9903],
  "Denver Colorado": [39.7392, -104.9903],
  "Florida, Miami": [25.7617, -80.1918],
  "Frankfurt": [50.1109, 8.6821],
  "Gama Building": [37.7749, -122.4194],  // Example, replace
  "Ireland, Dublin": [53.3331, -6.2489],
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
  "Pune 2nd Floor": [18.5204, 73.8567],
  "Pune Podium": [18.5204, 73.8567],
  "Pune Tower B": [18.5204, 73.8567],
  "Quezon": [14.6760, 121.0437],
  "Sao Paulo, Brazil": [-23.5505, -46.6333],
  "Taguig City": [14.5176, 121.0509]
};


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


// Override getCityCoordinates to use local list
async function getCityCoordinates(cityName) {
  cityName = cityName.trim();
  if (CITY_COORDS[cityName]) {
    return CITY_COORDS[cityName];
  }
  console.warn("City not found in CITY_COORDS:", cityName);
  return null;
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




<div class="right-panel">
              <div class="gcard tall">
                <div class="worldmap-wrapper">

                  <!-- MAP CARD -->
                  <div class="worldmap-card">

                    <div id="realmap"></div>

                    <!-- Legend + Controls Row -->
                    <div class="map-bottom-bar">

                      <!-- Legend -->
                      <div class="legend">
                        <div class="legend-item">
                          <div class="legend-box" style="background:#10b981"></div> Camera
                        </div>
                        <div class="legend-item">
                          <div class="legend-box" style="background:#f97316"></div> Controller
                        </div>
                        <div class="legend-item">
                          <div class="legend-box" style="background:#7c3aed"></div> Server
                        </div>
                        <div class="legend-item">
                          <div class="legend-box" style="background:#2563eb"></div> Archiver
                        </div>
                      </div>

                      <!-- Controls -->
                      <div class="map-controls">
                        <button id="fit-all" class="btn-ghost">Fit All</button>
                        <button id="show-global" class="btn">Global View</button>
                      </div>

                    </div>
                  </div>

                  <!-- SIDE PANEL -->
                <div class="region-panel" id="region-panel">
                    <h4 class="panel-title">Global (City Overview)</h4>

                    <div id="region-panel-content" class="panel-content"></div>

                    <div class="filter-block">
                      <h5>Filters</h5>

                      <select id="filter-type" class="filter-select">
                        <option value="all">All device types</option>
                        <option value="camera">Camera</option>
                        <option value="controller">Controller</option>
                        <option value="server">Server</option>
                        <option value="archiver">Archiver</option>
                      </select>

                      <select id="filter-status" class="filter-select">
                        <option value="all">All Status</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                      </select>

                      <div class="filter-actions">
                        <button id="apply-filters" class="btn">Apply</button>
                        <button id="reset-filters" class="btn-ghost">Reset</button>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </div>

/* WRAPPER - Map + Side Panel */
.worldmap-wrapper {
    display: flex;
    gap: 14px;
    width: 100%;
    align-items: flex-start;
}

/* MAIN MAP CARD */
.worldmap-card {
    flex: 1;
    background: #fff;
    border-radius: 12px;
    /* padding: 12px; */
    box-shadow: 0 6px 20px rgba(0,0,0,0.06);
    display: flex;
    flex-direction: column;
}

/* MAP CANVAS */
#realmap {
    height: 500px;
    width: 100%;
    border-radius: 10px;
}

/* BOTTOM ROW UNDER MAP */
.map-bottom-bar {
    /* margin-top: 10px; */
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* LEGEND */
.legend {
    display: flex;
    /* gap: 10px; */
    flex-wrap: wrap;
}

.legend-item {
    display: flex;
  
    align-items: center;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.08);
    /* padding: 5px 8px; */
    /* border-radius: 6px; */
    font-size: 10px;
}

.legend-box {
    width: 10px;
    height: 10px;
    
    
}

/* CONTROL BUTTONS */
.map-controls {
    display: flex;
    /* gap: 8px; */
}

.btn {
    /* padding: 7px 12px; */
    background: #111827;
    color: #fff;
    border: none;
    /* border-radius: 6px; */
    /* font-weight: 600; */
    cursor: pointer;
    font-size: 10px;
}

.btn-ghost {
    padding: 7px 12px;
    background: transparent;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}

/* SIDE PANEL */
.region-panel {
    width: 330px;
    height: 100%;
    background: #fff;
    border-radius: 12px;
    padding: 14px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.06);
}

.panel-title {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 12px;
}

.panel-content {
    max-height: 340px;
    overflow-y: auto;
    margin-bottom: 18px;
}

/* FILTER SECTION */
.filter-block {
    border-top: 1px solid rgba(0,0,0,0.08);
    padding-top: 14px;
}

.filter-select {
    width: 100%;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid rgba(0,0,0,0.15);
    margin-bottom: 10px;
}

.filter-actions {
    display: flex;
    gap: 10px;
}
    
.city-label-box {
  background: rgba(0,0,0,0.75);
  padding: 6px 10px;
  border-radius: 6px;
  color: #00ff99;
  font-size: 13px;
  border: 1px solid #00ff99;
  box-shadow: 0 0 8px rgba(0,255,120,0.5);
}

.city-dotted-path {
  color: #ffaa00;
  weight: 2;
  dashArray: "4 6";
}    
    
    
    
    
    body { margin:0; font-family: Inter, Roboto, Arial, sans-serif; background:#f6f7fb; color:#0f172a; }
    .container { display:flex; gap:12px; padding:12px; align-items:flex-start; }
    .map-card { flex:1; min-width:720px; background:#fff; border-radius:10px; padding:12px; box-shadow:0 6px 20px rgba(10,10,20,0.06); }
    .panel { width:360px; background:#fff; border-radius:10px; padding:12px; box-shadow:0 6px 20px rgba(10,10,20,0.06); overflow:auto; max-height:920px; }

    #realmap { height: 720px; width: 100%; border-radius:8px; }

    .dev-icon { display:flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:8px; color:#fff; }
    .dev-glow { box-shadow: 0 0 10px 3px rgba(0,200,0,0.22); }
    .dev-glow-off { box-shadow: 0 0 10px 3px rgba(200,0,0,0.14); opacity:0.95; }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(0,200,0,0.30); }
      70% { box-shadow: 0 0 0 12px rgba(0,200,0,0); }
      100% { box-shadow: 0 0 0 0 rgba(0,200,0,0); }
    }
    .pulse { animation: pulse 2s infinite; border-radius: 50%; }

    .region-label { background: rgba(0,0,0,0.6); color:#fff; padding:6px 8px; border-radius:6px; font-weight:700; }
    .stat-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(15,23,42,0.04); }
    .badge { display:inline-block; padding:4px 8px; border-radius:999px; font-weight:700; font-size:13px; }
    .badge-apac { background:#0ea5e9; color:#fff; }
    .badge-emea { background:#34d399; color:#fff; }
    .badge-namer { background:#fb923c; color:#fff; }
    .badge-laca { background:#a78bfa; color:#fff; }

    .legend { display:flex; gap:8px; flex-wrap:wrap; margin-top:8px; }
    .legend-item { display:flex; gap:8px; align-items:center; padding:4px 8px; border-radius:6px; background:#fff; border:1px solid rgba(10,10,20,0.04); }

    .controls { display:flex; gap:8px; align-items:center; }

    .city-list { margin-top:8px; max-height:380px; overflow:auto; }
    .city-item { padding:8px 6px; border-radius:6px; cursor:pointer; display:flex; justify-content:space-between; align-items:center; border:1px solid rgba(15,23,42,0.03); margin-bottom:6px; }
    .city-item:hover { background: #f1f5f9; }
    .small-muted { color:#475569; font-size:13px; }
    .btn { padding:6px 10px; border-radius:6px; border: none; cursor:pointer; background:#111827; color:#fff; font-weight:600; }
    .btn-ghost { background:transparent; color:#111827; border:1px solid rgba(15,23,42,0.06); }
