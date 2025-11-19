in map locatin are not show 
Global Devices
Global Devices
Taguig City
Unknown • 6 devices
Pune Podium
Unknown • 8 devices
Pune Tower B
Unknown • 3 devices
Pune 2nd Floor
Unknown • 2 devices
Kuala lumpur
Unknown • 2 devices
Delta Building
Unknown • 6 devices
Ireland, Dublin
Unknown • 2 devices
Italy, Rome
Unknown • 2 devices
Gama Building
Unknown • 8 devices
Moscow
Unknown • 2 devices
Madrid
Unknown • 2 devices
Costa Rica
Unknown • 12 devices
Argentina
Unknown • 7 devices
Mexico
Unknown • 2 devices
Sao Paulo, Brazil
Unknown • 1 devices
Denver Colorado
Unknown • 23 devices
Japan Tokyo
Unknown • 1 devices
Quezon
Unknown • 4 devices
Austria, Vienna
Unknown • 4 devices
Dubai
Unknown • 1 devices
Casablanca
Unknown • 1 devices
London
Unknown • 3 devices
Brazil
Unknown • 1 devices
thi is wokr 
but in map not show location 


/* ============================================================
   map.js — Fully dynamic version (no static CITY_LIST)
   ============================================================ */

let realMap;
let CITY_LIST = []; // dynamically populated from API
let cityLayers = {}; // cityName -> { summaryMarker, deviceLayer: L.LayerGroup, labelMarker }
let heatLayer = null;
const regionColors = { APAC: "#0ea5e9", EMEA: "#34d399", NAMER: "#fb923c", LACA: "#a78bfa" };
const regionCenter = { APAC: [20, 100], EMEA: [30, 10], NAMER: [40, -100], LACA: [-10, -60] };
window._mapRegionMarkers = []; // track region badges

/* ============================================================
   1. INIT MAP
   ============================================================ */
function initRealMap() {
  realMap = L.map('realmap', { preferCanvas:true }).setView([20,0],2);

  // ESRI World Imagery (satellite)
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom:20, attribution:'Tiles © Esri'
  }).addTo(realMap);

  // groups
  markerCluster = L.markerClusterGroup({ chunkedLoading:true, showCoverageOnHover:false });
  countryLayerGroup = L.layerGroup().addTo(realMap);
  realMap.addLayer(markerCluster);

  // draw countries (optional) then show everything
  drawCountryBorders()
    .catch(err => { console.warn("Country geojson failed:", err); })
    .finally(() => {
      renderDevices();            // show ALL markers
      populateGlobalCityList();   // default panel: grouped city-wise
      drawRegionBadges();         // region badges with counts
      toggleHeatOn();             // heat on by default
    });

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
    if (!cityLayers[cityObj.city]) cityLayers[cityObj.city] = { deviceLayer: L.layerGroup().addTo(realMap), summaryMarker: null };
    const layer = cityLayers[cityObj.city].deviceLayer;
    layer.clearLayers();

    const deviceTypes = ['camera', 'controller', 'server', 'archiver'];
    deviceTypes.forEach(type => {
        const cnt = deviceCounts[type] || 0;
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
   ============================================================ */
function _renderCitySummary(cityObj, counts) {
    const total = counts.total || 0;
    const html = `
      <div style="
        background:rgba(15,23,42,0.95);
        color:white;
        padding:10px 12px;
        border-radius:12px;
        width:170px;
        box-shadow:0 8px 30px rgba(2,6,23,0.45);
        font-family:Inter, system-ui, sans-serif;
      ">
        <div style="font-size:15px;font-weight:700">${cityObj.city}</div>
        <div style="margin-top:6px;font-size:13px; line-height:1.35;">
          <b>Total:</b> ${total}<br>
          <span style="color:#10b981">Camera: ${counts.camera || 0}</span><br>
          <span style="color:#f97316">Controller: ${counts.controller || 0}</span><br>
          <span style="color:#7c3aed">Server: ${counts.server || 0}</span><br>
          <span style="color:#2563eb">Archiver: ${counts.archiver || 0}</span>
        </div>
      </div>
    `;
    return L.divIcon({ html, className: "", iconSize: [180, 130], iconAnchor: [90, 65] });
}

/* ============================================================
   4. HEATMAP
   ============================================================ */
function drawHeatmap() {
    if (!CITY_LIST.length) return;
    const totals = CITY_LIST.map(c => {
        const total = c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0;
        return { lat: c.lat, lon: c.lon, total };
    });
    let maxTotal = Math.max(...totals.map(t => t.total), 1);
    const heatPoints = totals.map(t => [t.lat, t.lon, Math.min(1.5, (t.total / maxTotal) + 0.2)]);
    if (heatLayer) realMap.removeLayer(heatLayer);
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
    if (!CITY_LIST.length) return;
    const bounds = L.latLngBounds(CITY_LIST.map(c => [c.lat, c.lon]));
    realMap.fitBounds(bounds.pad(0.25));
}

/* ============================================================
   6. SIDE PANEL
   ============================================================ */
function populateGlobalCityList() {
    const panel = document.getElementById("region-panel-content");
    if (!panel) return;
    let html = `<h4>Global Devices</h4><hr>`;
    CITY_LIST.forEach(c => {
        const total = c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0;
        html += `<div class="city-item" onclick="onCityItemClick('${c.city}')">
                    <div style="font-weight:700">${c.city}</div>
                    <div class="small-muted">${c.region} • ${total} devices</div>
                 </div>`;
    });
    panel.innerHTML = html;
}

function onCityItemClick(cityName) {
    const c = CITY_LIST.find(x => x.city === cityName);
    if (c) realMap.flyTo([c.lat, c.lon], 7, { duration: 1.0 });
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
    cities.forEach(c => {
        const total = c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0;
        html += `<div class="city-item" onclick="onCityItemClick('${c.city}')"><b>${c.city}</b> — ${total} devices</div>`;
    });
    panel.innerHTML = html;
}

/* ============================================================
   8. UPDATE MAP DYNAMICALLY
   ============================================================ */
function updateMapData(summary, details) {
    if (!realMap || !details) return;

    const deviceBuckets = details.details || details;
    if (!deviceBuckets) return;

    // Build CITY_LIST dynamically
    const cityMap = {}; // cityName -> cityObj
    Object.entries(deviceBuckets).forEach(([rawKey, arr]) => {
        if (!Array.isArray(arr)) return;
        arr.forEach(dev => {
            const cityName = (dev.city || dev.location || dev.site || "Unknown").trim();
            const region = dev.region || "Unknown";
            const lat = dev.lat || 0;
            const lon = dev.lon || 0;
            const type = (rawKey || "").toLowerCase().includes("camera") ? "camera" :
                         (rawKey || "").toLowerCase().includes("controller") ? "controller" :
                         (rawKey || "").toLowerCase().includes("server") ? "server" :
                         (rawKey || "").toLowerCase().includes("archiver") ? "archiver" : null;

            if (!cityMap[cityName]) cityMap[cityName] = { city: cityName, region, lat, lon, devices: { camera:0, controller:0, server:0, archiver:0 }, total:0, devicesList: [] };
            if (type) cityMap[cityName].devices[type] += 1;
            cityMap[cityName].total += 1;
            cityMap[cityName].devicesList.push(dev);
        });
    });

    CITY_LIST = Object.values(cityMap);

    // Ensure cityLayers exists
    CITY_LIST.forEach(c => {
        if (!cityLayers[c.city]) cityLayers[c.city] = { deviceLayer: L.layerGroup().addTo(realMap), summaryMarker: null };
        const counts = c.devices;
        _placeDeviceIconsForCity(c, counts, c.devicesList);

        // Update summary marker
        const icon = _renderCitySummary(c, counts);
        if (cityLayers[c.city].summaryMarker) cityLayers[c.city].summaryMarker.setIcon(icon);
        else cityLayers[c.city].summaryMarker = L.marker([c.lat, c.lon], { icon }).addTo(realMap)
            .on("click", () => { realMap.flyTo([c.lat, c.lon], 7); populateCityPanel(c.city); });
    });

    drawHeatmap();
    drawRegionBadges();
    populateGlobalCityList();
}

/* ============================================================
   9. EXPORTS / BUTTON HOOKS
   ============================================================ */
document.getElementById("toggle-heat").onclick = toggleHeat;
document.getElementById("fit-all").onclick = fitAllCities;
document.getElementById("show-global").onclick = populateGlobalCityList;
window.updateMapData = updateMapData;
document.addEventListener("DOMContentLoaded", initRealMap);
<section id="main-graph" class="graphs-section">
        <div class="graphs-inner">

          <div class="graphs-grid dashboard-layout">

            <!-- Left 2x2 cards -->
            <div class="left-grid">

              <div class="gcard">
                <h4 class="gcard-title">Total No. of Cameras</h4>
                <div class="semi-donut gauge" id="gauge-cameras" data-fill="#12b76a"
                  style="--percentage:0; --fill:#12b76a">
                  <div class="gtext">
                    <b class="total">0</b>
                    <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
                  </div>
                </div>
              </div>

              <div class="gcard">
                <h4 class="gcard-title">Total No. of Archivers</h4>
                <div class="semi-donut gauge" id="gauge-archivers" data-fill="#12b76a"
                  style="--percentage:0; --fill:#12b76a">
                  <div class="gtext">
                    <b class="total">0</b>
                    <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
                  </div>
                </div>
              </div>

              <div class="gcard">
                <h4 class="gcard-title">Total No. of Controllers</h4>
                <div class="semi-donut gauge" id="gauge-controllers" data-fill="#12b76a"
                  style="--percentage:0; --fill:#12b76a">
                  <div class="gtext">
                    <b class="total">0</b>
                    <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
                  </div>
                </div>
              </div>

              <div class="gcard">
                <h4 class="gcard-title">TOTAL No. of CCURE</h4>
                <div class="semi-donut gauge" id="gauge-ccure" data-fill="#12b76a"
                  style="--percentage:0; --fill:#12b76a">
                  <div class="gtext">
                    <b class="total">0</b>
                    <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
                  </div>
                </div>
              </div>

            </div>

            <!-- Right SIDE MAP PANEL -->
            <!-- <div class="right-panel">
              <div class="gcard tall">
                <h4 class="gcard-title">World Device Map</h4>

                <div class="map-placeholder">

                  <div class="map-card">
                    
                    <div id="realmap"></div>

                    <div style="margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
                      <div class="legend">
                        <div class="legend-item">
                          <div style="width:18px;height:18px;background:#10b981;border-radius:4px"></div> Camera
                        </div>
                        <div class="legend-item">
                          <div style="width:18px;height:18px;background:#f97316;border-radius:4px"></div> Controller
                        </div>
                        <div class="legend-item">
                          <div style="width:18px;height:18px;background:#7c3aed;border-radius:4px"></div> Server
                        </div>
                        <div class="legend-item">
                          <div style="width:18px;height:18px;background:#2563eb;border-radius:4px"></div> Archiver
                        </div>
                      </div>

                      <div class="controls" id="map-controls" style="font-size:13px; color:#334155;">
                        <button id="toggle-heat" class="btn-ghost">Toggle Heat</button>
                        <button id="fit-all" class="btn-ghost">Fit All</button>
                        <button id="show-global" class="btn">Show Global</button>
                      </div>
                    </div>
                  </div>

                  <div class="panel" id="region-panel">
                    <h4>Global (city-wise)</h4>
                    <div id="region-panel-content"></div>

                    <div style="margin-top:12px">
                      <h5>Filters (optional)</h5>
                      <select id="filter-type" style="width:100%; padding:8px; margin-bottom:8px;">
                        <option value="all">All device types</option>
                        <option value="camera">Camera</option>
                        <option value="controller">Controller</option>
                        <option value="server">Server</option>
                        <option value="archiver">Archiver</option>
                      </select>

                      <select id="filter-status" style="width:100%; padding:8px; margin-bottom:8px;">
                        <option value="all">All status</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                      </select>

                      <div style="display:flex; gap:8px;">
                        <button id="apply-filters" class="btn">Apply</button>
                        <button id="reset-filters" class="btn-ghost">Reset</button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div> -->


            <!-- ..... -->

            <!-- RIGHT PANEL — WORLD MAP -->
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
                        <button id="toggle-heat" class="btn-ghost">Heat</button>
                        <button id="fit-all" class="btn-ghost">Fit All</button>
                        <button id="show-global" class="btn">Global View</button>
                      </div>

                    </div>
                  </div>

                  <!-- SIDE PANEL -->
                  <div class="region-panel" id="region-panel">
                    <h4 class="panel-title">Global (City Overview)</h4>

                    <div id="region-panel-content" class="panel-content"></div>

                    <!-- Filters -->
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

            <!-- ..... -->
            <div class="bottom-row">

              <div class="gcard wide">
                <h4 class="gcard-title">Weekly Failures</h4>
                <div class="chart-placeholder"></div>
              </div>

              <div class="gcard wide">
                <h4 class="gcard-title">Failure Count</h4>
                <div class="chart-placeholder"></div>
              </div>

              <div class="gcard wide">
                <h4 class="gcard-title">LOC Count</h4>
                <div class="chart-placeholder"></div>
              </div>

            </div>

          </div>
        </div>
      </section>
