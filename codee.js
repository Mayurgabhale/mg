i want to bar show in any order not low midunm, ok
and in x axis, i want to show ony city name for high and midumn, 
  ok and alos city name color high and midumn ok ok, 

// ---------------- START: City BAR chart (Total devices + offline breakdown tooltip) ----------------
let offlineCityBarChart = null;

/**
 * Map device.type values (from your script) to short keys used for offline counts.
 * Adjust mapping if your device.type uses different keys.
 */
const TYPE_MAP = {
  cameras: 'camera',
  archivers: 'archiver',
  controllers: 'controller',
  servers: 'server',
  // other types exist (pcdetails, dbdetails) — we ignore them for the offline breakdown fields
};

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

    const city = (dev.city || "Unknown").toString();

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
  const entries = Object.values(map);

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
          ticks: { color: colors.text, maxRotation: 30, minRotation: 30, autoSkip: false },
          grid: { color: colors.grid }
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
