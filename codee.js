so read this code carefully, this code is show correct data.
    offline and online, but in map.js file in map not showing correct count or offline and online data.
    read the below all both code carefully, and tell me what is the isseu, why in map count and data showng wrong.
    pk,,

// ========== INITIALIZE EVERYTHING ==========

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
// ---------------- END: City BAR chart (Total devices + offline breakdown tooltip) ----------------

C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\graph.js
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
// ---------------- END: City BAR chart (Total devices + offline breakdown tooltip) ----------------

C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\map.js

/* ============================================================
   map.js — Updated: blinking pins for archiver/controller/server offline
   ============================================================ */
let realMap;
let CITY_LIST = []; // dynamically populated from API
let cityLayers = {}; // cityName -> { summaryMarker, deviceLayer }
let heatLayer = null;

window._mapRegionMarkers = [];

// Predefined coordinates for your cities (add/update as needed)
const CITY_COORDS = {
  "Casablanca": [33.5731, -7.5898],
  "Dubai": [25.276987, 55.296249],
  "Argentina": [-38.4161, -63.6167],
  "Austin TX": [30.2672, -97.7431],
  "Austria, Vienna": [48.2082, 16.3738],
  "Costa Rica": [9.7489, -83.7534],
  "Denver": [39.7392, -104.9903],
  // "Denver Colorado": [39.7392, -104.9903],
  "Denver Colorado": [42.7392, -104.9903],
  "Florida, Miami": [25.7617, -80.1918],
  "Frankfurt": [50.1109, 8.6821],
  "Gama Building": [37.7749, -122.4194],
  "Delta Building": [37.7749, -122.4194],
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
  "Quezon": [20.6760, 121.0437],
  "Sao Paulo, Brazil": [-23.5505, -46.6333],
  "Taguig City": [14.5176, 121.0509],
  "HYDERABAD": [17.3850, 78.4867],
  "Singapore": [1.3521, 103.8198],
  "Vilnius": [54.6872, 25.2797],
};

// ⬇️⬇️⬇️


// ---------- ADD THIS (after CITY_COORDS) ----------
const CITY_PARENT_PATTERNS = [
  { patterns: [/^vilnius\b/i, /gama building/i, /delta building/i], parent: "Vilnius" },
  { patterns: [/^pune\b/i, /\bpune\b/i, /pune 2nd floor/i, /pune podium/i, /pune tower/i], parent: "Pune" }
];

function isDeviceOffline(dev) {
  if (!dev) return false;
  const s = ((dev.status || dev.state || '') + '').toString().trim().toLowerCase();
  if (s === 'offline' || s === 'down') return true;
  if (typeof dev.online === 'boolean' && dev.online === false) return true;
  return false;
}

function normalizeCityForMap(rawName) {
  if (!rawName) return "Unknown";
  const name = String(rawName).trim();

  for (const rule of CITY_PARENT_PATTERNS) {
    for (const p of rule.patterns) {
      if (p.test(name)) return rule.parent;
    }
  }

  if (name.includes(" - ")) return name.split(" - ")[0].trim();
  if (name.includes(",")) return name.split(",")[0].trim();
  return name;
}

// Ensure Vilnius coords exist (add if missing)
if (!CITY_COORDS["Vilnius"]) {
  CITY_COORDS["Vilnius"] = [54.6872, 25.2797];
}
if (!CITY_COORDS["Pune"]) {
  CITY_COORDS["Pune"] = [18.5204, 73.8567];
}

// ---------- END ADD ----------
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
  realMap = L.map('realmap', {
    preferCanvas: true,
    maxBounds: [
      [70, -135],
      [-60, 160]
    ],
    maxBoundsViscosity: 1.0,
    minZoom: 2.1,
    maxZoom: 20
  }).setView([15, 0], 2.4);

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    attribution: 'Tiles © Esri'
  }).addTo(realMap);

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
      const moreHtml = `<div class="city-label-box" style="padding:6px 8px; font-size:12px; display:none;">${type}: ${cnt}</div>`;
      const labelLat = cityObj.lat + 0.045;
      const labelLon = cityObj.lon + (type === 'camera' ? 0.03 : (type === 'controller' ? -0.03 : 0));
      const labelMarker = L.marker([labelLat, labelLon], { icon: L.divIcon({ html: moreHtml, className: "" }) });
      layer.addLayer(labelMarker);
    }
  });
}

/* ============================================================
   3. CITY SUMMARY HTML
   ============================================================ */
function buildCitySummaryHTML(city) {
  const total = city.total || 0;



  const offline = Object.values(city.offline || {}).reduce((acc, v) => acc + (v || 0), 0);

  const ICONS = {
    camera: `<i class="bi bi-camera "></i>`,
    controller: `<i class="bi bi-hdd"></i>`,
    server: `<i class="fa-duotone fa-solid fa-server"></i>`,
    archiver: `<i class="fas fa-database"></i>`
  };

  let html = `
  <div style="font-family: Inter, Roboto, Arial, sans-serif; font-size:13px; display:inline-block; width:auto; max-width:240px;">
    <div style="font-weight:700; margin-bottom:6px; font-size:14px; white-space:nowrap;">${city.city}</div>
    <div style="font-weight:600; margin-bottom:8px;">${total}/<span style="color:#ff3b3b;">${offline}</span></div>
  `;

  // const mapList = ["camera", "controller", "server", "archiver"];
  // mapList.forEach(type => {
  //   const count = city.devices?.[type] || 0;
  //   if (count > 0) {
  //     html += `<div style="margin-bottom:4px; display:flex; align-items:center; gap:6px; font-size:10px;">${ICONS[type]} <span>${count}</span></div>`;
  //   }
  // });

  const mapList = ["camera", "controller", "server", "archiver"];
  mapList.forEach(type => {
    const count = city.devices?.[type] || 0;
    const off = city.offline?.[type] || 0;
    if (count > 0) {
      html += `<div style="margin-bottom:4px; display:flex; align-items:center; gap:6px; font-size:10px;">
               ${ICONS[type]} <span>${count}</span>
               ${off ? `<span style="color:#ff3b3b; margin-left:6px">(${off} offline)</span>` : ''}
             </div>`;
    }
  });

  const extraCounts = {};
  (city.devicesList || []).forEach(d => {
    const candidates = [d.type, d.product, d.deviceType, d.model];
    for (let v of candidates) {
      if (!v) continue;
      const name = String(v).trim();
      if (!name) continue;
      const low = name.toLowerCase();
      if (low.includes("camera") || low.includes("server") || low.includes("controller") || low.includes("archiver")) continue;
      extraCounts[name] = (extraCounts[name] || 0) + 1;
      break;
    }
  });
  Object.keys(extraCounts).forEach(key => {
    html += `<div style="margin-bottom:4px;">${key} ${extraCounts[key]}</div>`;
  });

  html += `</div>`;
  return html;
}


/* ============================================================
   4. placeCityMarkers — creates city markers
   ============================================================ */
function placeCityMarkers() {
  if (!window.cityMarkerLayer) window.cityMarkerLayer = L.layerGroup().addTo(realMap);
  window.cityMarkerLayer.clearLayers();

  CITY_LIST.forEach(c => {
    if (toNum(c.lat) === null || toNum(c.lon) === null) return;

    // compute blink classes from flags set in updateMapData
    const blinkClass = c.shouldBlink ? 'blink' : '';
    const severityClass = (c.blinkSeverity && c.blinkSeverity >= 3) ? ' blink-high' : '';

    const cityIconHtml = `<div><span class="pin ${blinkClass}${severityClass}"><i class="bi bi-geo-alt-fill"></i></span></div>`;
    const cityIcon = L.divIcon({
      className: 'city-marker',
      html: cityIconHtml,
      iconAnchor: [12, 12]
    });

    const marker = L.marker([c.lat, c.lon], { icon: cityIcon });

    // DEBUG: log blink status for each city (remove in production)
    console.log(`[placeCityMarkers] city="${c.city}" shouldBlink=${!!c.shouldBlink} severity=${c.blinkSeverity || 0}`);

    const getSummary = () => buildCitySummaryHTML(c);

    marker.on('mouseover', function () {
      marker.bindTooltip(getSummary(), {
        direction: 'top',
        offset: [0, -12],
        opacity: 1,
        permanent: false,
        className: 'city-summary-tooltip'
      }).openTooltip();
    });
    marker.on('mouseout', function () {
      try { marker.closeTooltip(); } catch (e) { }
    });
    marker.on('click', function () {
      marker.bindPopup(getSummary(), { maxWidth: 260 }).openPopup();
    });

    marker.addTo(window.cityMarkerLayer);
  });

  window.cityMarkerLayer.bringToFront();
}


/* ============================================================
   5. HEATMAP (unchanged)
   ============================================================ */
function drawHeatmap() {
  const totals = CITY_LIST
    .map(c => ({
      lat: toNum(c.lat),
      lon: toNum(c.lon),
      total: c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0
    }))
    .filter(x => x.lat !== null && x.lon !== null && x.total > 0);

  if (!totals.length) {
    if (heatLayer) {
      try { realMap.removeLayer(heatLayer); } catch (e) { }
      heatLayer = null;
    }
    return;
  }

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



// /* ============================================================
//    5. FIT ALL CITIES
//    ============================================================ */
function fitAllCities() {
  const validCoords = CITY_LIST
    .map(c => [toNum(c.lat), toNum(c.lon)])
    .filter(([lat, lon]) => lat !== null && lon !== null);

  if (!validCoords.length) return;
  const bounds = L.latLngBounds(validCoords);
  realMap.fitBounds(bounds.pad(0.25));
}

function populateGlobalCityList() {
  const panel = document.getElementById("region-panel-content");
  if (!panel) return;
  let html = `<h4></h4><hr>`;
  CITY_LIST.forEach((c, idx) => {
    const total = c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0;
    html += `<div class="city-item" data-city-index="${idx}">
                <div style="font-weight:700">${c.city}</div>
                <div class="small-muted">${c.region || '—'} • ${total} devices</div>
             </div>`;
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

function onCityItemClick(cityName) {
  const c = CITY_LIST.find(x => x.city === cityName);
  if (c && toNum(c.lat) !== null && toNum(c.lon) !== null) realMap.setView([c.lat, c.lon], 5, { animate: true });
  populateCityPanel(cityName);
}

function populateCityPanel(cityName) {
  const panel = document.getElementById("region-panel-content");
  const c = CITY_LIST.find(x => x.city === cityName);
  if (!panel || !c) return;
  const total = c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0;
  panel.innerHTML = `
    <h4 style="font-size: 12px;">${cityName} — ${total} devices</h4><hr>
    <div style="font-size: 10px;"><b>Camera:</b> ${c.devices.camera || 0}</div>
    <div style="font-size: 10px;"><b>Controller:</b> ${c.devices.controller || 0}</div>
    <div style="font-size: 10px;"><b>Server:</b> ${c.devices.server || 0}</div>
    <div style="font-size: 10px;"><b>Archiver:</b> ${c.devices.archiver || 0}</div>
  `;
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
    const radius = 0.02;
    group.forEach((c, i) => {
      const angle = (2 * Math.PI * i) / group.length;
      c.lat = baseLat + Math.cos(angle) * radius;
      c.lon = baseLon + Math.sin(angle) * radius;
    });
  });
}

/* ============================================================
   7. GEOCODE MISSING CITIES (use local list)
   ============================================================ */
async function getCityCoordinates(cityName) {
  cityName = cityName.trim();
  if (CITY_COORDS[cityName]) return CITY_COORDS[cityName];
  console.warn("City not found in CITY_COORDS:", cityName);
  return null;
}

/* ============================================================
   8. UPDATE MAP DYNAMICALLY (MAIN)
   ============================================================ */
//  this function is call in scrip.js file
async function updateMapData(summary, details) {
  try {
    if (!realMap || !details) return;

    const deviceBuckets = details.details || details;
    if (!deviceBuckets) return;

    const cityMap = {};
    Object.entries(deviceBuckets).forEach(([rawKey, arr]) => {
      if (!Array.isArray(arr)) return;
      arr.forEach(dev => {
        // const cityNameRaw = dev.city || dev.location || dev.site || "Unknown";
        // const cityName = (typeof cityNameRaw === 'string') ? cityNameRaw.trim() : String(cityNameRaw);
        // let lat = toNum(dev.lat);
        // let lon = toNum(dev.lon);

        // new:
        const cityNameRaw = dev.city || dev.location || dev.site || "Unknown";
        let cityNameCandidate = (typeof cityNameRaw === 'string') ? cityNameRaw.trim() : String(cityNameRaw);
        const cityName = normalizeCityForMap(cityNameCandidate);
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
          offline: { camera: 0, controller: 0, server: 0, archiver: 0 },
          total: 0,
          devicesList: [],
          region: dev.region || dev.zone || null
        };

        if (type) cityMap[cityName].devices[type] += 1;
        cityMap[cityName].total += 1;
        cityMap[cityName].devicesList.push(dev);

        if (lat !== null && lon !== null) {
          cityMap[cityName].lat = lat;
          cityMap[cityName].lon = lon;
        }

        const s = ((dev.status || dev.state || '') + '').toLowerCase();
        const isOffline = (s === 'offline' || s === 'down' || dev.online === false);
        if (isOffline && type) {
          cityMap[cityName].offline[type] = (cityMap[cityName].offline[type] || 0) + 1;
        }
      });
    });

    // populate CITY_LIST (array)
    CITY_LIST = Object.values(cityMap);

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

    // --- IMPORTANT: compute shouldBlink and severity here (after CITY_LIST built) ---
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
    drawRegionBadges && drawRegionBadges();

  } catch (err) {
    console.error("updateMapData error", err);
  }

  // redraw UI overlays and markers
  // drawCityBarChart && drawCityBarChart();
  placeCityMarkers();
  fitAllCities();
}



document.addEventListener("DOMContentLoaded", () => {
  initRealMap();

  placeCityMarkers(); // optional: will show markers if CITY_LIST already has data

  function setOnClick(id, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
  }

  setOnClick("toggle-heat", toggleHeat);
  setOnClick("fit-all", fitAllCities);
  setOnClick("show-global", populateGlobalCityList);

  window.updateMapData = updateMapData;
});

const fullscreenBtn = document.getElementById("mapFullscreenBtn");
const mapCard = document.querySelector(".worldmap-card");
let isFullscreen = false;

fullscreenBtn.addEventListener("click", () => {
  isFullscreen = !isFullscreen;

  if (isFullscreen) {
    mapCard.classList.add("fullscreen");
    document.body.classList.add("map-fullscreen-active");
    fullscreenBtn.innerText = "✖ Exit Full";
  } else {
    mapCard.classList.remove("fullscreen");
    document.body.classList.remove("map-fullscreen-active");
    fullscreenBtn.innerText = "⛶ View Full";
  }

  // VERY IMPORTANT: tell Leaflet the map size changed
  setTimeout(() => {
    realMap.invalidateSize(true);
  }, 300); // wait for CSS animation to finish
});



document.getElementById("mapCityOverviewBtn").addEventListener("click", function () {
  const panel = document.getElementById("region-panel");

  if (panel.style.display === "block") {
    panel.style.display = "none";
  } else {
    panel.style.display = "block";
  }
});


