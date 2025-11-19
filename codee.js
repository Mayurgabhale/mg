ok, now create map desin wiht correct and more atractive and looking more privium map ok 
carefully.. and this more atractive Map UI.. 
/* ============================================================
   1. CITY DEFINITIONS (your WU locations)
   ============================================================ */

const CITY_LIST = [
    {
        city: "Pune",
        lat: 18.5204,
        lon: 73.8567,
        region: "APAC",
        devices: {
            camera: 60,
            controller: 40,
            server: 2,
            archiver: 20
        }
    },
    {
        city: "Hyderabad",
        lat: 17.3850,
        lon: 78.4867,
        region: "APAC",
        devices: {
            camera: 40,
            controller: 28,
            server: 10,
            archiver: 20
        }
    },
    {
        city: "London",
        lat: 51.5074,
        lon: -0.1278,
        region: "EMEA",
        devices: {
            camera: 22,
            controller: 14,
            server: 5,
            archiver: 10
        }
    },
    {
        city: "New York",
        lat: 40.7128,
        lon: -74.0060,
        region: "NAMER",
        devices: {
            camera: 35,
            controller: 20,
            server: 15,
            archiver: 12
        }
    },
    {
        city: "Sao Paulo",
        lat: -23.5505,
        lon: -46.6333,
        region: "LACA",
        devices: {
            camera: 18,
            controller: 12,
            server: 5,
            archiver: 6
        }
    }
];

/* ============================================================
   2. MAP VARIABLES
   ============================================================ */

let realMap;
let cityMarkers = [];
let heatLayer = null;

/* region colors */
const regionColors = {
    APAC: "#0ea5e9",
    EMEA: "#34d399",
    NAMER: "#fb923c",
    LACA: "#a78bfa"
};

/* ============================================================
   3. INIT MAP
   ============================================================ */

function initRealMap() {
    realMap = L.map("realmap", { preferCanvas: true }).setView([20, 0], 2);

    L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 20 }
    ).addTo(realMap);

    renderCitySummary();       // DEFAULT VIEW
    populateGlobalCityList();  // Right-side panel
    drawRegionBadges();        // Region markers
    drawHeatmap();             // Heat default ON
    // ADD THIS LINE
    CITY_LIST.forEach(c => drawCityHighlight(c));

    L.control.scale().addTo(realMap);
}

/* ============================================================
   4. CITY SUMMARY MARKERS ONLY
   ============================================================ */

function renderCitySummary() {
    // clear markers
    cityMarkers.forEach(m => realMap.removeLayer(m));
    cityMarkers = [];

    CITY_LIST.forEach(c => {
        const total =
            c.devices.camera +
            c.devices.controller +
            c.devices.server +
            c.devices.archiver;

        const html = `
      <div style="
        background:#0f172a;
        color:white;
        padding:10px 12px;
        border-radius:12px;
        width:160px;
        box-shadow:0 4px 20px rgba(0,0,0,0.3);
        font-family:Inter;
      ">
        <div style="font-size:15px;font-weight:700">${c.city}</div>
        <div style="margin-top:6px;font-size:13px">
          <b>Total:</b> ${total}<br>
          Camera: ${c.devices.camera}<br>
          Controller: ${c.devices.controller}<br>
          Server: ${c.devices.server}<br>
          Archiver: ${c.devices.archiver}
        </div>
      </div>
    `;

        const icon = L.divIcon({
            html,
            className: "",
            iconSize: [170, 120],
            iconAnchor: [85, 60]
        });

        const marker = L.marker([c.lat, c.lon], { icon }).addTo(realMap);
        cityMarkers.push(marker);

        marker.on("click", () => {
            realMap.setView([c.lat, c.lon], 8);
            populateCityPanel(c.city);
        });
    });

    fitAllCities();
}

/* ============================================================
   5. HEATMAP
   ============================================================ */

function drawHeatmap() {
    const heatPoints = CITY_LIST.map(c => [
        c.lat,
        c.lon,
        0.8 // intensity
    ]);

    if (heatLayer) realMap.removeLayer(heatLayer);

    heatLayer = L.heatLayer(heatPoints, { radius: 35, blur: 25 }).addTo(realMap);
}

/* toggle */
function toggleHeat() {
    if (!heatLayer) return;
    if (realMap.hasLayer(heatLayer)) realMap.removeLayer(heatLayer);
    else realMap.addLayer(heatLayer);
}

/* ============================================================
   6. FIT ALL CITIES
   ============================================================ */

function fitAllCities() {
    const bounds = L.latLngBounds(
        CITY_LIST.map(c => [c.lat, c.lon])
    );
    realMap.fitBounds(bounds.pad(0.25));
}

/* ============================================================
   7. GLOBAL PANEL (CITY LIST)
   ============================================================ */

function populateGlobalCityList() {
    const panel = document.getElementById("region-panel-content");

    let html = `<h4>Global Devices</h4><hr>`;
    CITY_LIST.forEach(c => {
        const total = c.devices.camera + c.devices.controller + c.devices.server + c.devices.archiver;
        html += `
      <div class="city-item" onclick="onCityItemClick('${c.city}')">
        <div style="font-weight:700">${c.city}</div>
        <div class="small-muted">${c.region} • ${total} devices</div>
      </div>
    `;
    });

    panel.innerHTML = html;
}

/* ============================================================
   8. CITY PANEL DETAIL
   ============================================================ */

function onCityItemClick(cityName) {
    const c = CITY_LIST.find(x => x.city === cityName);
    if (c) realMap.setView([c.lat, c.lon], 8);
    populateCityPanel(cityName);
}

function populateCityPanel(cityName) {
    const panel = document.getElementById("region-panel-content");
    const c = CITY_LIST.find(x => x.city === cityName);
    if (!c) return;

    const total = c.devices.camera + c.devices.controller + c.devices.server + c.devices.archiver;

    panel.innerHTML = `
    <h4>${cityName} — ${total} devices</h4>
    <hr>
    <div><b>Camera:</b> ${c.devices.camera}</div>
    <div><b>Controller:</b> ${c.devices.controller}</div>
    <div><b>Server:</b> ${c.devices.server}</div>
    <div><b>Archiver:</b> ${c.devices.archiver}</div>
  `;
}

/* ============================================================
   9. REGION BADGES
   ============================================================ */

const regionCenter = {
    APAC: [20, 100],
    EMEA: [30, 10],
    NAMER: [40, -100],
    LACA: [-10, -60]
};

function drawRegionBadges() {
    Object.keys(regionCenter).forEach(region => {
        const devices = CITY_LIST
            .filter(c => c.region === region)
            .reduce((sum, c) => {
                return sum +
                    c.devices.camera +
                    c.devices.controller +
                    c.devices.server +
                    c.devices.archiver;
            }, 0);

        const html = `
      <div style="
        background:${regionColors[region]};
        padding:6px 12px;
        color:white;
        border-radius:8px;
        font-size:13px;
        text-align:center;
        font-weight:600;
      ">
        ${region}<br>${devices} devices
      </div>
    `;

        const marker = L.marker(regionCenter[region], {
            icon: L.divIcon({ html, className: "", iconSize: [120, 60], iconAnchor: [60, 30] })
        }).addTo(realMap);

        marker.on("click", () => populateRegionPanel(region));
    });
}

/* region panel */
function populateRegionPanel(region) {
    const panel = document.getElementById("region-panel-content");

    const cities = CITY_LIST.filter(c => c.region === region);

    let html = `<h4>${region} Region</h4><hr>`;

    cities.forEach(c => {
        const total = c.devices.camera + c.devices.controller + c.devices.server + c.devices.archiver;
        html += `
      <div class="city-item" onclick="onCityItemClick('${c.city}')">
        <b>${c.city}</b> — ${total} devices
      </div>
    `;
    });

    panel.innerHTML = html;
}



// /////////


function drawCityHighlight(cityObj) {
    const { city, lat, lon } = cityObj;

    // offset point slightly to place the label
    const labelLat = lat + 2.5;
    const labelLon = lon + 3;

    // 1. Draw dotted connection line
    const dotted = L.polyline(
        [
            [lat, lon],
            [labelLat, labelLon]
        ],
        {
            className: "city-dotted-path"
        }
    ).addTo(realMap);

    // 2. Create label box
    const devs = STATIC_DEVICES.filter(d => d.city === city);
    const total = devs.length;
    const online = devs.filter(d => d.status === "online").length;
    const inactive = total - online;

    const html = `
    <div class="city-label-box">
      <b>${city}</b><br>
      TOTAL: ${total}<br>
      ACTIVE: ${online}<br>
      INACTIVE: ${inactive}
    </div>
  `;

    L.marker([labelLat, labelLon], {
        icon: L.divIcon({
            html,
            className: "",
            iconAnchor: [0, 0]
        })
    }).addTo(realMap);
}



/* ============================================================
   10. BUTTON EVENTS
   ============================================================ */

document.getElementById("toggle-heat").onclick = toggleHeat;
document.getElementById("fit-all").onclick = fitAllCities;
document.getElementById("show-global").onclick = populateGlobalCityList;

/* ============================================================
   START MAP
   ============================================================ */
document.addEventListener("DOMContentLoaded", initRealMap);


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
    padding: 12px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.06);
    display: flex;
    flex-direction: column;
}

/* MAP CANVAS */
#realmap {
    height: 650px;
    width: 100%;
    border-radius: 10px;
}

/* BOTTOM ROW UNDER MAP */
.map-bottom-bar {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* LEGEND */
.legend {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.legend-item {
    display: flex;
    gap: 6px;
    align-items: center;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.08);
    padding: 5px 8px;
    border-radius: 6px;
}

.legend-box {
    width: 16px;
    height: 16px;
    border-radius: 4px;
}

/* CONTROL BUTTONS */
.map-controls {
    display: flex;
    gap: 8px;
}

.btn {
    padding: 7px 12px;
    background: #111827;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
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
