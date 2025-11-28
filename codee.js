see this code, in ths bar chart diplsy all,
  just this data i want to diplsy in map ok 
get this code referese and crete map.js file 
ok,...
  
// ========== INITIALIZE EVERYTHING ==========
  <div class="gcard wide" id="total-city-count">
            <h4 class="gcard-title">LOC Count</h4>
            <canvas id="OfflineCityBarChart"></canvas>
          </div>
// new
// ========== INITIALIZE EVERYTHING ==========
function initializeChartSystem() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initOfflineChart();
      initOfflineCityBarChart();   // ✅ ADD THIS
      setupThemeObserver();
    });
  } else {
    initOfflineChart();
    initOfflineCityBarChart();     // ✅ ADD THIS
    setupThemeObserver();
  }
}

// Initialize the chart system
initializeChartSystem();

// ========== YOUR EXISTING FUNCTION ==========


function renderOfflineChartFromCombined(combinedDevices) {
  const offlineDevices = combinedDevices
    .filter(d => d.device.status === "offline")
    .map(d => ({
      device: d.device,
      type: d.device.type
    }));

  updateOfflineChart(offlineDevices);

  // ✅ ADD BAR CHART UPDATE HERE
  updateOfflineCityBarChart(combinedDevices);
  updateMapFromCombined(combinedDevices)
}

// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️


// ---------------- START: City BAR chart (Total devices + offline breakdown tooltip) ----------------
let offlineCityBarChart = null;

const TYPE_MAP = {
  cameras: 'camera',
  archivers: 'archiver',
  controllers: 'controller',
  servers: 'server',
  // other types exist (pcdetails, dbdetails) — we ignore them for the offline breakdown fields
};

function normalizeCityName(city) {
  city = city.toLowerCase().trim();

  // Pune group
  if (city.startsWith("pune")) return "Pune";

  // Vilnius group
  if (city.includes("vilnius") || 
      city.includes("gama") || 
      city.includes("delta")) {
    return "Vilnius";
  }

  // Default – return as-is (capitalized first letter)
  return city.charAt(0).toUpperCase() + city.slice(1);
}

function getBarColors() {
  if (typeof getChartColors === 'function') {
    const c = getChartColors();
    return {
      bar: c.camera || c.bar || '#d32f2f',
      text: c.text || '#e6eef7',
      grid: c.grid || 'rgba(0,0,0,0.08)'
    };
  }
  const isDark = document.body.classList.contains("dark-mode");
  return {
    bar: isDark ? "#ff5252" : "#d32f2f",
    text: isDark ? "#ffffff" : "#333333",
    grid: isDark ? "#444" : "#ddd"
  };
}

/**
 * Build the per-city totals + offline breakdown.
 * Input: combinedDevices = [{ device: { type, status, city, ... } }, ...]
 * Output: { labels: [], values: [], details: [{ city, total, offline: { camera, controller, archiver, server } }, ...] }
 */

function buildCityBarDataWithBreakdown(combinedDevices = []) {
  const map = {}; // city -> info

  if (!Array.isArray(combinedDevices)) return { labels: [], values: [], details: [] };

  combinedDevices.forEach(entry => {
    if (!entry || !entry.device) return;
    const dev = entry.device;

    // const city = (dev.city || "Unknown").toString(); 
    const rawCity = (dev.city || "Unknown").toString();
const city = normalizeCityName(rawCity);

    if (!map[city]) {
      map[city] = {
        city,
        total: 0,
        offline: {
          camera: 0,
          controller: 0,
          archiver: 0,
          server: 0
        },
        risk: "Low" // default
      };
    }

    map[city].total++;

    const status = (dev.status || "").toLowerCase();
    const devTypeKey = (dev.type || "").toLowerCase();

    if (status === "offline") {
      const short = TYPE_MAP[devTypeKey];
      if (short && map[city].offline.hasOwnProperty(short)) {
        map[city].offline[short]++;
      }
    }
  });

  // ✅ APPLY RISK LOGIC
  Object.values(map).forEach(cityObj => {
    const off = cityObj.offline;

    const cam = off.camera;
    const ctrl = off.controller;
    const arch = off.archiver;
    const serv = off.server;

    // High conditions
    if (
      serv > 0 ||
      ctrl > 0 ||
      arch > 0 ||
      (cam > 0 && (ctrl > 0 || arch > 0 || serv > 0))
    ) {
      cityObj.risk = "High";
    }
    // Medium condition
    else if (cam > 0) {
      cityObj.risk = "Medium";
    }
    // Otherwise Low
    else {
      cityObj.risk = "Low";
    }
  });

  // ❌ NO SORTING – Keep original insertion order
  
  let entries = Object.values(map);

  // ✅ Shuffle entries into random order
  for (let i = entries.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [entries[i], entries[j]] = [entries[j], entries[i]];
  }

  const labels = entries.map(e => e.city);
  const values = entries.map(e => e.total);
  const details = entries.map(e => ({
    city: e.city,
    total: e.total,
    offline: { ...e.offline },
    risk: e.risk
  }));

  return { labels, values, details };
}

/**
 * Initialize the bar chart (placeholder). Safe to call multiple times.
 */
function initOfflineCityBarChart() {
  if (typeof Chart === 'undefined') {
    console.warn('initOfflineCityBarChart: Chart.js not loaded.');
    return;
  }
  const canvas = document.getElementById("OfflineCityBarChart");
  if (!canvas) {
    console.warn('initOfflineCityBarChart: #OfflineCityBarChart canvas not found.');
    return;
  }

  if (offlineCityBarChart) return; // already init

  const ctx = canvas.getContext("2d");
  const colors = getBarColors();

  offlineCityBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ['No Data'],
      datasets: [{
        label: "Total Devices",
        data: [0],
        backgroundColor: [colors.bar],
        borderRadius: 8,
        barThickness: 35
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: colors.text }, display: false },
        tooltip: {
          enabled: true,
          callbacks: {
            // Title is the city name
            title: function (items) {
              if (!items || !items.length) return '';
              return items[0].label;
            },
            // First line: total devices (use dataset value)
            label: function (context) {
              const value = context.parsed.y ?? context.parsed ?? 0;
              return `Total Devices: ${value}`;
            },
            // After body: show offline breakdown lines (one per line)
            afterBody: function (context) {
              if (!context || !context.length) return [];

              const dataIndex = context[0].dataIndex;
              const chart = context[0].chart || offlineCityBarChart;
              const details = chart.cityDetails[dataIndex];
              if (!details) return [];

              const off = details.offline;

              return [
                `Risk Level: ${details.risk}`,
                `Offline Cameras: ${off.camera || 0}`,
                `Offline Controllers: ${off.controller || 0}`,
                `Offline Archivers: ${off.archiver || 0}`,
                `Offline Servers: ${off.server || 0}`
              ];
            }

          }
        }
      },
      scales: {

        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,

            callback: function (value, index) {
              const chart = this.chart;
              const details = chart.cityDetails?.[index];

              // Show label ONLY for High and Medium
              if (!details || details.risk === "Low") {
                return "";
              }

              return details.city;
            },

            color: function (context) {
              const index = context.index;
              const chart = context.chart;
              const details = chart.cityDetails?.[index];

              if (!details) return colors.text;

              if (details.risk === "High") return "#d32f2f";    // red
              if (details.risk === "Medium") return "#fbc02d";  // yellow

              return "transparent"; // hide Low city label
            },

            font: function (context) {
              const index = context.index;
              const chart = context.chart;
              const details = chart.cityDetails?.[index];

              if (!details || details.risk === "Low") {
                return { size: 0 };  // Fully hide low labels
              }

              return { size: 12, weight: "bold" };
            }
          },
          grid: {
            color: colors.grid
          }
        },
        
     
        y: {
          beginAtZero: true,
          ticks: { color: colors.text, precision: 0 },
          grid: { color: colors.grid }
        }
      }
    }
  });

  // attach an empty cityDetails array to chart (populated on updates)
  offlineCityBarChart.cityDetails = [];
  console.debug('initOfflineCityBarChart: initialized');
}

/**
 * Update the bar chart with combinedDevices (array of {device: {...}})
 */
function updateOfflineCityBarChart(combinedDevices) {
  if (!offlineCityBarChart) {
    initOfflineCityBarChart();
    if (!offlineCityBarChart) {
      console.warn('updateOfflineCityBarChart: chart not initialized (canvas missing or Chart.js not loaded).');
      return;
    }
  }

  const colors = getBarColors();
  const { labels, values, details } = buildCityBarDataWithBreakdown(combinedDevices);

  if (!labels || labels.length === 0) {
    offlineCityBarChart.data.labels = ['No Data'];
    offlineCityBarChart.data.datasets[0].data = [0];
    offlineCityBarChart.data.datasets[0].backgroundColor = ['#8a8a8a'];
    offlineCityBarChart.cityDetails = [];
    offlineCityBarChart.update();
    console.debug('updateOfflineCityBarChart: no data.');
    return;
  }

  offlineCityBarChart.data.labels = labels;
  offlineCityBarChart.data.datasets[0].data = values;
  // offlineCityBarChart.data.datasets[0].backgroundColor = labels.map(() => colors.bar); 
  offlineCityBarChart.data.datasets[0].backgroundColor = details.map(d => {
    if (d.risk === "High") return "#d32f2f";    // red
    if (d.risk === "Medium") return "#fbc02d";  // yellow
    return "#388e3c";                           // green
  });
  offlineCityBarChart.cityDetails = details; // store details used by tooltip callbacks

  offlineCityBarChart.update();
  console.debug('updateOfflineCityBarChart: updated with', labels.length, 'cities.');
}

/**
 * Ensure initialization on DOM ready (harmless if already done elsewhere)
 */
function ensureBarInitOnDomReady() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOfflineCityBarChart);
  } else {
    initOfflineCityBarChart();
  }
}
ensureBarInitOnDomReady();
// ---------------- END: City BAR chart (Total devices + offline breakdown tooltip) -----------------------------------

 <div class="worldmap-wrapper">
              <!-- MAP CARD -->
              <div class="worldmap-card">
                <!-- Fullscreen Button -->
                <button id="mapFullscreenBtn" class="map-fullscreen-btn">
                  ⛶ View Full
                </button>
                <button id="mapCityOverviewBtn" class="map-CityOverview-btn">
                  City Overview
                </button>
                <!-- SIDE PANEL -->
                <div class="region-panel" id="region-panel">
                  <h4 class="panel-title">Global (City Overview)</h4>
                  <div id="region-panel-content" class="panel-content"></div>
                </div>

                <div id="realmap"></div>

                <!-- Legend + Controls Row -->
                <div class="map-bottom-bar">

                  <!-- Legend -->
                  <div class="legend">
                    <div class="legend-item">
                      <i class="bi bi-camera"></i>
                      Camera
                    </div>
                    <div class="legend-item">
                      <i class="bi bi-hdd"></i> Controller
                    </div>
                    <div class="legend-item">
                      <i class="fa-duotone fa-solid fa-server"></i> Server
                    </div>
                    <div class="legend-item">
                      <i class="fas fa-database "></i> Archiver
                    </div>
                  </div>

                  <!-- Controls -->
                  <div class="map-controls">
                    <button id="fit-all" class="btn-ghost">Fit All</button>
                    <button id="show-global" class="btn-gv">Global View</button>
                  </div>
                </div>
              </div>
            </div>



// ==================================================
// MAP.JS - FINAL CLEAN VERSION
// ==================================================

let realMap;
window.cityMarkerLayer = null;
window._cityMarkerIndex = {};

// ------------------ CITY COORDS ------------------
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

// ------------------ DEVICE TYPE MAP ------------------
const TYPE_KEYS = {
  camera: "camera",
  cameras: "camera",
  archiver: "archiver",
  archivers: "archiver",
  controller: "controller",
  controllers: "controller",
  server: "server",
  ccure: "server"
};

// ------------------ MAP INIT ------------------
function initRealMap() {
  realMap = L.map("realmap", {
    preferCanvas: true,
    minZoom: 2,
    maxZoom: 18,
    worldCopyJump: true
  }).setView([15, 0], 2.5);

  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 20 }
  ).addTo(realMap);

  window.cityMarkerLayer = L.layerGroup().addTo(realMap);
}

// ------------------ NORMALIZE CITY ------------------
function normalizeCity(city) {
  if (!city) return "Unknown";
  city = city.toLowerCase().trim();

  if (city.includes("pune")) return "Pune";
  if (city.includes("vilnius")) return "Vilnius";
  if (city.includes("taguig")) return "Taguig City";
  if (city.includes("quezon")) return "Quezon";

  return city.charAt(0).toUpperCase() + city.slice(1);
}

// ------------------ AGGREGATE DATA ------------------
function aggregateDevicesByCity(combinedDevices) {
  const result = {};

  combinedDevices.forEach(entry => {
    const dev = entry.device ? entry.device : entry;
    if (!dev) return;

    const city = normalizeCity(dev.city || dev.location);
    const status = (dev.status || "").toLowerCase();
    const type = TYPE_KEYS[(dev.type || "").toLowerCase()] || null;

    if (!result[city]) {
      result[city] = {
        city,
        total: 0,
        online: 0,
        offline: 0,
        counts: { camera: 0, archiver: 0, controller: 0, server: 0 },
        onlineCount: { camera: 0, archiver: 0, controller: 0, server: 0 },
        offlineCount: { camera: 0, archiver: 0, controller: 0, server: 0 },
        lat: null,
        lon: null
      };
    }

    const c = result[city];
    c.total++;

    const isOffline = status === "offline" || status === "down";
    isOffline ? c.offline++ : c.online++;

    if (type) {
      c.counts[type]++;
      isOffline ? c.offlineCount[type]++ : c.onlineCount[type]++;
    }
  });

  Object.values(result).forEach(c => {
    const coords = CITY_COORDS[c.city];
    if (coords) {
      c.lat = coords[0];
      c.lon = coords[1];
    }
  });

  return result;
}

// ------------------ CREATE MARKERS ------------------
function createCityMarker(cityStats) {

  const icon = L.divIcon({
    className: "city-marker",
    html: `
      <div class="city-pin">
        <i class="bi bi-geo-alt-fill"></i>
        <div class="city-count">${cityStats.total}</div>
      </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  const marker = L.marker([cityStats.lat, cityStats.lon], { icon });

  const tooltip = `
  <strong>${cityStats.city}</strong><br>
  <i class="bi bi-camera"></i> Cameras: ${cityStats.counts.camera}<br>
  <i class="fas fa-database"></i> Archivers: ${cityStats.counts.archiver}<br>
  <i class="bi bi-hdd"></i> Controllers: ${cityStats.counts.controller}<br>
  <i class="fa-solid fa-server"></i> CCURE: ${cityStats.counts.server}<br>
  Online: ${cityStats.online} | Offline: ${cityStats.offline}
  `;

  marker.bindTooltip(tooltip, { sticky: true });
  marker.bindPopup(tooltip);

  return marker;
}

// ------------------ SIDE PANEL ------------------
function buildRegionPanel(data) {
  const panel = document.getElementById("region-panel-content");
  if (!panel) return;

  panel.innerHTML = "";

  const cityList = Object.values(data).sort((a, b) => b.total - a.total);

  cityList.forEach(city => {
    const div = document.createElement("div");
    div.className = "city-item";
    div.innerHTML = `
      <div>${city.city}</div>
      <div>— • ${city.total} devices</div>
    `;

    div.onclick = () => {
      if (!city.lat) return alert(`No coordinates for ${city.city}`);
      realMap.flyTo([city.lat, city.lon], 12);
      if (window._cityMarkerIndex[city.city]) {
        window._cityMarkerIndex[city.city].openPopup();
      }
    };

    panel.appendChild(div);
  });
}

// ------------------ MAIN UPDATE ------------------
function updateMapFromCombined(combinedDevices) {
  const data = aggregateDevicesByCity(combinedDevices);

  buildRegionPanel(data);

  window.cityMarkerLayer.clearLayers();
  window._cityMarkerIndex = {};

  const allCoords = [];

  Object.values(data).forEach(city => {
    if (!city.lat) return;

    const marker = createCityMarker(city).addTo(window.cityMarkerLayer);
    window._cityMarkerIndex[city.city] = marker;

    allCoords.push([city.lat, city.lon]);
  });

  if (allCoords.length) {
    realMap.fitBounds(L.latLngBounds(allCoords).pad(0.3));
  }
}

// ------------------ UI BUTTONS ------------------
document.getElementById("fit-all")?.addEventListener("click", () => {
  if (!window.cityMarkerLayer) return;
  const group = L.featureGroup(window.cityMarkerLayer.getLayers());
  realMap.fitBounds(group.getBounds().pad(0.3));
});

document.getElementById("show-global")?.addEventListener("click", () => {
  realMap.setView([15, 0], 2.5);
});

// ------------------ FULLSCREEN ------------------
document.getElementById("mapFullscreenBtn")?.addEventListener("click", () => {
  document.querySelector(".worldmap-card").classList.toggle("fullscreen");
  setTimeout(() => realMap.invalidateSize(), 300);
});

// ------------------ PANEL TOGGLE ------------------
document.getElementById("mapCityOverviewBtn")?.addEventListener("click", () => {
  document.getElementById("region-panel").classList.toggle("open");
});

// ------------------ INIT ------------------
document.addEventListener("DOMContentLoaded", () => {
  initRealMap();
  document.getElementById("region-panel-content").innerHTML = "Loading…";
});
