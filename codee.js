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
  realMap = L.map("realmap", { preferCanvas: true }).setView([20,0], 2);

  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 20 }
  ).addTo(realMap);

  renderCitySummary();       // DEFAULT VIEW
  populateGlobalCityList();  // Right-side panel
  drawRegionBadges();        // Region markers
  drawHeatmap();             // Heat default ON

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
      icon: L.divIcon({ html, className:"", iconSize:[120,60], iconAnchor:[60,30] })
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