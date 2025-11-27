i want to combine this boht graph.js and map.js file in one file in graph.js file
ok but withou changing any logic, ok, and get all data wiht same function and pipl line ok 
but carefully, wihtu changing nay privius logic, and our code, 
  can you do this 
C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\graph.js

function updateGauge(id, activeId, inactiveId, totalId) {
  // read elements safely (avoid exception if missing)
  const activeEl = document.getElementById(activeId);
  const inactiveEl = document.getElementById(inactiveId);

  const active = activeEl ? parseInt((activeEl.textContent || '0').replace(/,/g, ''), 10) || 0 : 0;
  const inactive = inactiveEl ? parseInt((inactiveEl.textContent || '0').replace(/,/g, ''), 10) || 0 : 0;
  const total = active + inactive;

  // element (gauge card)
  const gauge = document.getElementById(id);
  if (!gauge) return;

  // % calculation (safe)
  let percentage = total === 0 ? 0 : Math.round((active / total) * 100);

  // set CSS variable if supported
  try {
    gauge.style.setProperty("--percentage", percentage);
  } catch (e) {
    // ignore if style can't be set
  }

  // update text inside semicircle (if those elements exist)
  const totalLabel = gauge.querySelector(".total");
  const activeLabel = gauge.querySelector(".active");
  const inactiveLabel = gauge.querySelector(".inactive");

  if (totalLabel) totalLabel.textContent = total;
  if (activeLabel) activeLabel.textContent = active;
  if (inactiveLabel) inactiveLabel.textContent = inactive;

  // card footer also updates (if exists)
  const footerEl = document.getElementById(totalId);
  if (footerEl) footerEl.textContent = total;
}

function renderGauges() {
  updateGauge("gauge-cameras", "camera-online", "camera-offline", "camera-total");
  updateGauge("gauge-archivers", "archiver-online", "archiver-offline", "archiver-total");
  updateGauge("gauge-controllers", "controller-online", "controller-offline", "controller-total");
  updateGauge("gauge-ccure", "server-online", "server-offline", "server-total");
}

document.addEventListener("DOMContentLoaded", () => {
  renderGauges();
  setInterval(renderGauges, 6000);
});





// ⬇️⬇️⬇️⬇️⬇️⬇️ PIE chart

// --- Total Count doughnut chart (uses Chart.js) ---

let _totalCountChart = null;

function findChartPlaceholderByTitle(titleText) {
  const cards = document.querySelectorAll('.totacl-gcard.wide');
  for (let card of cards) {
    const h = card.querySelector('.gcard-title');
    if (h && h.textContent.trim().toLowerCase() === titleText.trim().toLowerCase()) {
      return card.querySelector('.chart-placeholder');
    }
  }
  return null;
}

/**
 * Collect totals from DOM. Add/remove device keys as needed.
 * Make sure IDs used here exist in your summary-section.
 */


function collectTotalCounts() {
  const keys = [
    { id: 'camera-total', label: 'Cameras' },
    { id: 'archiver-total', label: 'Archivers' },
    { id: 'controller-total', label: 'Controllers' },
    { id: 'server-total', label: 'CCURE' },
    { id: 'doorReader-total', label: 'Doors' },
    { id: 'reader-total-inline', label: 'Readers' },
    { id: 'pc-total', label: 'Desktop' },
    { id: 'db-total', label: 'DB Server' }
  ];

  const labels = [];
  const values = [];

  keys.forEach(k => {
    const el = document.getElementById(k.id);
    const v = el
      ? parseInt((el.textContent || '0').replace(/,/g, '').trim(), 10)
      : 0;

    if (v > 0) {
      labels.push(k.label);
      values.push(v);
    }
  });

  if (values.length === 0) {
    return { labels: ['No devices'], values: [0] };  // ✅ fixed
  }

  return { labels, values };
}

/**
 * Render or update the Total Count doughnut.
 */

function renderTotalCountChart() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded — add https://cdn.jsdelivr.net/npm/chart.js');
    return;
  }

  const placeholder = findChartPlaceholderByTitle('Total Count');
  if (!placeholder) return;

  let canvas = placeholder.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    placeholder.innerHTML = '';
    placeholder.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  const data = collectTotalCounts();

  // calculate total
  //   const totalValue = data.values.reduce((a, b) => a + b, 0);
  const totalValue = data.labels[0] === 'No devices'
    ? 0
    : data.values.reduce((a, b) => a + b, 0);

  if (_totalCountChart) {
    _totalCountChart.destroy();
  }

  const palette = [
    '#10b981', '#f97316', '#2563eb',
    '#7c3aed', '#06b6d4', '#ef4444',
    '#f59e0b', '#94a3b8'
  ];

  // ---- Plugin for CENTER TEXT ----

  const centerTextPlugin = {
    id: 'centerText',
    afterDatasetsDraw(chart) {   // ✅ better than afterDraw
      const { ctx, chartArea, data } = chart;

      if (!chartArea) return;    // ✅ prevents crash on first render

      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      // ✅ fresh total calculation every time
      const total = data.datasets[0].data.reduce((a, b) => a + b, 0);

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // ✅ Safe color fallback
      const labelColor = getComputedStyle(document.body)
        .getPropertyValue('--graph-card-footer-dark')
        .trim() || "#888";  // fallback gray

      const valueColor = getComputedStyle(document.body)
        .getPropertyValue('--graph-card-title-dark')
        .trim() || "#ffffff"; // fallback white

      // TOTAL label
      ctx.font = "14px Arial";
      ctx.fillStyle = labelColor;
      ctx.fillText("TOTAL", centerX, centerY - 20);

      // TOTAL value
      ctx.font = "bold 22px Arial";
      ctx.fillStyle = valueColor;
      ctx.fillText(total.toString(), centerX, centerY + 15);

      ctx.restore();
    }
  };

  _totalCountChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.values,
        backgroundColor: palette.slice(0, data.values.length),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '45%',
      radius: '90%',  // ✅ shrink only circle size
      plugins: {
        legend: {
          position: 'right',

          labels: {
            usePointStyle: true,
            padding: 12,
            color: getComputedStyle(document.body)
              .getPropertyValue('--graph-card-title-dark'),

            generateLabels: function (chart) {
              const dataset = chart.data.datasets[0];
              const labels = chart.data.labels;
              const colors = dataset.backgroundColor;

              return labels.map((label, i) => ({
                text: `${label} - ${dataset.data[i]}`,
                fillStyle: colors[i],
                strokeStyle: colors[i],
                fontColor: getComputedStyle(document.body)
                  .getPropertyValue('--graph-card-title-dark'),
                hidden: false,
                index: i
              }));
            }
          }

        },

        tooltip: {
          callbacks: {
            label: function (ctx) {
              const label = ctx.label || '';
              const value = ctx.parsed || 0;
              return `${label} : ${value}`;
            }
          }
        }
      }
    },

    plugins: [centerTextPlugin]   // ✅ center total plugin
  });
}


/**
 * Update the Total Count chart data in-place (if chart exists) otherwise render
 */
function updateTotalCountChart() {
  if (!_totalCountChart) {
    renderTotalCountChart();
    return;
  }
  const data = collectTotalCounts();
  _totalCountChart.data.labels = data.labels;
  _totalCountChart.data.datasets[0].data = data.values;
  _totalCountChart.data.datasets[0].backgroundColor = [

    '#10b981', '#f97316', '#2563eb', '#7c3aed', '#06b6d4', '#ef4444', '#f59e0b', '#94a3b8'
  ].slice(0, data.values.length);
  _totalCountChart.update();
}

// Hook it up: render on DOMContentLoaded and update when gauges refresh
document.addEventListener('DOMContentLoaded', () => {
  // initial render (if Chart.js loaded)
  renderTotalCountChart();

  // re-render on window resize (debounced)
  let resizeTO;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTO);
    resizeTO = setTimeout(() => {
      renderTotalCountChart(); // re-create with correct sizing
    }, 10);
  });
});

// Call updateTotalCountChart() whenever your data changes.
// We'll call it inside renderGauges() so it updates after gauges refresh.
function renderGauges() {
  updateGauge("gauge-cameras", "camera-online", "camera-offline", "camera-total");
  updateGauge("gauge-archivers", "archiver-online", "archiver-offline", "archiver-total");
  updateGauge("gauge-controllers", "controller-online", "controller-offline", "controller-total");
  updateGauge("gauge-ccure", "server-online", "server-offline", "server-total");

  // ✅ ADD THESE TWO
  updateGauge("gauge-doors", "door-online", "door-offline", "doorReader-total");
  updateGauge("gauge-readers", "reader-online", "reader-offline", "reader-total-inline");

  updateTotalCountChart();
  // update Total Count pie
}

// ☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️
// ========== GLOBALS ==========
let offlineChart;
let cityIndexMap = {};
let cityCounter = 0;
let dynamicTypeIndexMap = {};
let dynamicTypeList = [];

// ========== GET CHART COLORS BASED ON THEME ==========
function getChartColors() {
  const isLightTheme = document.body.classList.contains('theme-light');

  if (isLightTheme) {
    return {
      backgroundColor: '#0a0a0a',
      text: '#e6eef7', // Visible text color
    };
  } else {
    // Dark theme colors - fixed for visibility
    return {
      camera: '#ff4d4d',
      archiver: '#4da6ff',
      controller: '#ffaa00',
      ccure: '#7d3cff',
      grid: 'rgba(255, 255, 255, 0.2)', // Visible grid lines
      text: '#e6eef7', // Visible text color
      background: '#0a0a0a'
    };
  }
}

// ========== UPDATE CHART THEME ==========
function updateChartTheme() {
  if (!offlineChart) return;

  const colors = getChartColors();

  // Update grid lines and borders
  offlineChart.options.scales.x.grid.color = colors.grid;
  offlineChart.options.scales.y.grid.color = colors.grid;

  // Update text colors
  offlineChart.options.scales.x.ticks.color = colors.text;
  offlineChart.options.scales.y.ticks.color = colors.text;

  // Update legend text color
  if (offlineChart.options.plugins.legend) {
    offlineChart.options.plugins.legend.labels.color = colors.text;
  }

  offlineChart.update();
}

// ========== INIT CHART ==========
function initOfflineChart() {
  const canvas = document.getElementById("DotOfflineDevice");
  const ctx = canvas.getContext("2d");

  const colors = getChartColors();

  offlineChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Camera",
          data: [],
          backgroundColor: colors.camera,
          pointStyle: "circle",
          pointRadius: 6
        },
        {
          label: "Archiver",
          data: [],
          backgroundColor: colors.archiver,
          pointStyle: "rect",
          pointRadius: 6
        },
        {
          label: "Controller",
          data: [],
          backgroundColor: colors.controller,
          pointStyle: "triangle",
          pointRadius: 7
        },
        {
          label: "CCURE",
          data: [],
          backgroundColor: colors.ccure,
          pointStyle: "rectRot",
          pointRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: colors.text, // Set legend text color
            font: {
              size: 12
            },
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const d = ctx.raw;
              return `${d.count || 0}`;
            }
          }
        }

      },
      scales: {
        x: {
          title: {
            display: false,
            text: "City"
          },
          grid: {
            color: colors.grid, // Set grid line color
            drawBorder: true
          },
          ticks: {
            color: colors.text, // Set x-axis text color
            maxRotation: 0,
            minRotation: 0,
            callback: (value) => {
              return Object.keys(cityIndexMap).find(
                key => cityIndexMap[key] === value
              ) || "";
            }
          }
        },
        y: {
          title: {
            display: false,
            text: "Device Type"
          },
          grid: {
            color: colors.grid, // Set grid line color
            drawBorder: true
          },
          ticks: {
            color: colors.text, // Set y-axis text color
            callback: v => dynamicTypeList[v] || ""
          },
          min: -0.5,
          max: () => Math.max(dynamicTypeList.length - 0.5, 0.5)
        }
      }
    }
  });
}


function updateOfflineChart(offlineDevices) {
  const typeNames = {
    cameras: "Camera",
    archivers: "Archiver",
    controllers: "Controller",
    servers: "CCURE"
  };

  dynamicTypeList = [];
  dynamicTypeIndexMap = {};
  cityIndexMap = {};
  cityCounter = 0;

  // Only valid types
  const filtered = offlineDevices.filter(dev =>
    typeNames.hasOwnProperty(dev.type)
  );

  // Build dynamic Y indexes
  filtered.forEach(dev => {
    const label = typeNames[dev.type];
    if (!(label in dynamicTypeIndexMap)) {
      dynamicTypeIndexMap[label] = dynamicTypeList.length;
      dynamicTypeList.push(label);
    }
  });

  // ✅ GROUP BY CITY + TYPE
  const grouped = {};

  filtered.forEach(dev => {
    const source = dev.device ? dev.device : dev;
    const city = source.city || "Unknown";
    const label = typeNames[dev.type];

    const key = city + "|" + label;

    if (!grouped[key]) {
      grouped[key] = {
        city: city,
        label: label,
        count: 0
      };
    }

    grouped[key].count++;
  });

  // Clear datasets
  offlineChart.data.datasets.forEach(ds => ds.data = []);

  // ✅ Add grouped points (only ONE point per city+type)
  Object.values(grouped).forEach(item => {

    if (!cityIndexMap[item.city]) {
      cityCounter++;
      cityIndexMap[item.city] = cityCounter;
    }

    const dynamicY = dynamicTypeIndexMap[item.label];

    const point = {
      x: cityIndexMap[item.city],
      y: dynamicY,
      count: item.count   // ✅ count stored here
    };

    const dataset = offlineChart.data.datasets.find(
      ds => ds.label === item.label
    );

    if (dataset) {
      dataset.data.push(point);
    }
  });

  // Hide empty
  offlineChart.data.datasets.forEach(ds => {
    ds.hidden = ds.data.length === 0;
  });

  offlineChart.update();
}


// ========== THEME CHANGE DETECTION ==========
function setupThemeObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        setTimeout(updateChartTheme, 100);
      }
    });
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });
}

// ========== INITIALIZE EVERYTHING ==========
function initializeChartSystem() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initOfflineChart();
      setupThemeObserver();
    });
  } else {
    initOfflineChart();
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
}
##################################################
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
  "Denver Colorado": [39.7392, -104.9903],
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


// ---------- ADD THIS (after CITY_COORDS) ----------
const CITY_PARENT_PATTERNS = [
  { patterns: [/^vilnius\b/i, /gama building/i, /delta building/i], parent: "Vilnius" },
  { patterns: [/^pune\b/i, /\bpune\b/i, /pune 2nd floor/i, /pune podium/i, /pune tower/i], parent: "Pune" }
];

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

  const offline = (city.devicesList || []).reduce((acc, d) => {
    const s = ((d.status || d.state || '') + '').toLowerCase();
    if (s === 'offline' || s === 'down') return acc + 1;
    if (d.online === false) return acc + 1;
    return acc;
  }, 0);

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

  const mapList = ["camera", "controller", "server", "archiver"];
  mapList.forEach(type => {
    const count = city.devices?.[type] || 0;
    if (count > 0) {
      html += `<div style="margin-bottom:4px; display:flex; align-items:center; gap:6px; font-size:10px;">${ICONS[type]} <span>${count}</span></div>`;
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
  drawCityBarChart && drawCityBarChart();
  placeCityMarkers();
  fitAllCities();
}


// /* ============================================================
//    10. EXPORTS / BUTTON HOOKS
//    - hookup all event listeners after DOM ready to avoid null refs
//    ============================================================ */
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


document.addEventListener("DOMContentLoaded", () => {
  initRealMap();

  placeCityMarkers(); // ← Add this line to show all cities

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


// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ bar chart

/*********************************
 * CITY RISK SCORING (3 LEVELS)
 *********************************/
function computeCityRisk(city) {
  if (!city || !city.offline) {
    return { label: "Low", color: "#16A34A" };
  }

  const cam = city.offline.camera || 0;
  const arch = city.offline.archiver || 0;
  const srv = city.offline.server || 0;   // CCURE
  const ctrl = city.offline.controller || 0;

  const camerasOffline = cam > 0;
  const otherOffline = (arch > 0 || srv > 0 || ctrl > 0);

  // RULE 1: Only Cameras offline → Medium
  if (camerasOffline && !otherOffline) {
    return { label: "Medium", color: "#FACC15" };
  }

  // RULE 2: Cameras + Others offline → High
  if (camerasOffline && otherOffline) {
    return { label: "High", color: "#DC2626" };
  }

  // RULE 3: Only Archiver / Controller / CCURE offline → High
  if (!camerasOffline && otherOffline) {
    return { label: "High", color: "#DC2626" };
  }

  // RULE 4: Nothing offline → Low
  return { label: "Low", color: "#16A34A" };
}

/*********************************
 * LEGEND (TOP RIGHT)
 *********************************/

function createCityLegend(containerId = "cityBarLegend") {

  const holder = document.getElementById("Loc-Count-chart");
  if (!holder) return;

  holder.style.position = "relative"; // important for top-right

  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    holder.appendChild(container);
  }

  container.style.position = "absolute";
  container.style.top = "5px";
  container.style.right = "10px";
  container.style.fontSize = "12px";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "6px";
  container.style.padding = "6px 10px";
  container.style.borderRadius = "6px";
  container.style.boxShadow = "0px 2px 6px rgba(0,0,0,0.15)";

  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:6px;">
      <span style="width:12px;height:12px;background:#16A34A;border-radius:3px;"></span> Low
    </div>
    <div style="display:flex;align-items:center;gap:6px;">
      <span style="width:12px;height:12px;background:#FACC15;border-radius:3px;"></span> Medium
    </div>
    <div style="display:flex;align-items:center;gap:6px;">
      <span style="width:12px;height:12px;background:#DC2626;border-radius:3px;"></span> High
    </div>
  `;
}


/*********************************
 * CITY BAR CHART
 *********************************/
let cityChart = null;

function drawCityBarChart() {

  const chartCanvas = document.getElementById("cityBarChart");
  if (!chartCanvas) {
    console.warn("Canvas not found");
    return;
  }

  if (!CITY_LIST || CITY_LIST.length === 0) {
    console.warn("CITY_LIST empty. Chart not drawn.");
    const lg = document.getElementById("cityBarLegend");
    if (lg) lg.remove();
    return;
  }

  const labels = CITY_LIST.map(c => c.city);

  const data = CITY_LIST.map(c => {
    if (!c.devices) return 0;
    return Object.values(c.devices).reduce((a, b) => a + b, 0);
  });

 
const riskInfo = CITY_LIST.map(c => computeCityRisk(c));
  const colors = riskInfo.map(r => r.color);
  const riskLabels = riskInfo.map(r => r.label);

  if (cityChart) cityChart.destroy();

  cityChart = new Chart(chartCanvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Total Devices",
        data: data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.8,
        categoryPercentage: 0.9
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        // Replace existing tooltip: { ... } with this:
        tooltip: {
          enabled: false, // disable built-in tooltip rendering
          external: function (context) {
            // get/create tooltip element
            let tooltipEl = document.getElementById('chartjs-tooltip');
            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-tooltip';
              tooltipEl.className = 'chartjs-tooltip';
              document.body.appendChild(tooltipEl);
            }

            // Hide if no tooltip
            const tooltipModel = context.tooltip;
            if (!tooltipModel || tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0;
              return;
            }

            // Determine index for the hovered bar
            const dataIndex = tooltipModel.dataPoints && tooltipModel.dataPoints.length ? tooltipModel.dataPoints[0].dataIndex : null;
            if (dataIndex === null) {
              tooltipEl.style.opacity = 0;
              return;
            }

            // Build lines (same order you used)
            const c = CITY_LIST[dataIndex] || {};
            const total = c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0;
            const camOff = (c.offline && c.offline.camera) || 0;
            const ctrlOff = (c.offline && c.offline.controller) || 0;
            const srvOff = (c.offline && c.offline.server) || 0;
            const archOff = (c.offline && c.offline.archiver) || 0;
            const risk = riskLabels[dataIndex] || 'Low';

            const lines = [
              { key: 'Total Devices', val: total, color: '#ffffff' },
              { key: 'Risk Level', val: risk, color: '#ffffff' },
              { key: 'Offline Camera', val: camOff, color: camOff > 0 ? 'red' : '#ffffff' },
              { key: 'Offline Controller', val: ctrlOff, color: ctrlOff > 0 ? 'red' : '#ffffff' },
              { key: 'Offline Server', val: srvOff, color: srvOff > 0 ? 'red' : '#ffffff' },
              { key: 'Offline Archiver', val: archOff, color: archOff > 0 ? 'red' : '#ffffff' }
            ];

            // Build HTML
            let innerHtml = `<div class="tt-title">${labels[dataIndex]}</div>`;
            lines.forEach(line => {
              // don't show 0 offline lines? you said show but not red — keep visible but not red
              innerHtml += `<div class="tt-line"><span class="tt-key">${line.key}:</span> <span class="tt-val" style="color:${line.color}">${line.val}</span></div>`;
            });

            tooltipEl.innerHTML = innerHtml;
            tooltipEl.style.opacity = 1;

            // Positioning: try to place tooltip near the caret (Chart.js provides caretX/caretY in tooltipModel)
            const canvas = context.chart.canvas;
            const canvasRect = canvas.getBoundingClientRect();
            // caret coordinates are in chart pixels; convert to page coords
            const left = canvasRect.left + window.pageXOffset + tooltipModel.caretX;
            const top = canvasRect.top + window.pageYOffset + tooltipModel.caretY;

            // Position slightly above the cursor
            tooltipEl.style.left = `${left}px`;
            tooltipEl.style.top = `${top - 10}px`;
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        },
        x: {
          ticks: {
            display: true,
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,

            callback: function (value, index) {
              const risk = riskLabels[index];

              if (risk === "Medium" || risk === "High") {
                return labels[index];
              }
              return "";
            },

            color: function (context) {
              const idx = context.index;
              const risk = riskLabels[idx];
              return (risk === "Medium" || risk === "High") ? "red" : "#666";
            }
          },
          grid: {
            display: true
          }
        }
      }
    }
  });

  // Add legend in top-right
  createCityLegend("cityBarLegend");
  console.log("✅ City bar chart updated with top-right legend");
}


