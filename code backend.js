in this loc chart tooltip;;;
i want to diplsy ony if offlne count is has present that time ony show 
for examle Offline Controllers: 1 only this show 
  Offline Servers:0 this is not show ok and remove risk leve laos in tootlp, 
    how ot do this tell me 
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
    // console.warn('initOfflineCityBarChart: Chart.js not loaded.');
    return;
  }
  const canvas = document.getElementById("OfflineCityBarChart");
  if (!canvas) {
    // console.warn('initOfflineCityBarChart: #OfflineCityBarChart canvas not found.');
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
  // console.debug('initOfflineCityBarChart: initialized');
}

/**
 * Update the bar chart with combinedDevices (array of {device: {...}})
 */
function updateOfflineCityBarChart(combinedDevices) {
  if (!offlineCityBarChart) {
    initOfflineCityBarChart();
    if (!offlineCityBarChart) {
      // console.warn('updateOfflineCityBarChart: chart not initialized (canvas missing or Chart.js not loaded).');
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
    // console.debug('updateOfflineCityBarChart: no data.');
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
  // console.debug('updateOfflineCityBarChart: updated with', labels.length, 'cities.');
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
