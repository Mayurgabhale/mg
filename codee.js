Offline Devices (City-wise) bar char is not diplsy 
read the all code and chekc 
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

/**
 * Find the chart-placeholder element inside the card whose title matches text.
 * Returns the placeholder element or null.
 */
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

// ========== UPDATE CHART ==========
// function updateOfflineChart(offlineDevices) {
//   const typeNames = {
//     cameras: "Camera",
//     archivers: "Archiver",
//     controllers: "Controller",
//     servers: "CCURE"
//   };

//   // Reset mappings
//   dynamicTypeList = [];
//   dynamicTypeIndexMap = {};
//   cityIndexMap = {};
//   cityCounter = 0;

//   // Only valid types
//   const filtered = offlineDevices.filter(dev =>
//     typeNames.hasOwnProperty(dev.type)
//   );

//   // Build dynamic Y indexes
//   filtered.forEach(dev => {
//     const label = typeNames[dev.type];
//     if (!(label in dynamicTypeIndexMap)) {
//       dynamicTypeIndexMap[label] = dynamicTypeList.length;
//       dynamicTypeList.push(label);
//     }
//   });

//   // Clear all old points
//   offlineChart.data.datasets.forEach(ds => ds.data = []);

//   // Add points
//   filtered.forEach(dev => {
//     const source = dev.device ? dev.device : dev;
//     const deviceIP = source.ip || null;
//     const city = source.city || "Unknown";

//     if (!cityIndexMap[city]) {
//       cityCounter++;
//       cityIndexMap[city] = cityCounter;
//     }

//     const label = typeNames[dev.type];
//     const dynamicY = dynamicTypeIndexMap[label];

//     const point = {
//       x: cityIndexMap[city],
//       y: dynamicY,
//       ip: deviceIP,
//       city: city
//     };

//     const dataset = offlineChart.data.datasets.find(
//       ds => ds.label === label
//     );

//     if (dataset) {
//       dataset.data.push(point);
//     }
//   });

//   // Hide empty types
//   offlineChart.data.datasets.forEach(ds => {
//     ds.hidden = ds.data.length === 0;
//   });

//   offlineChart.update();
// }


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
// function renderOfflineChartFromCombined(combinedDevices) {
//   const offlineDevices = combinedDevices
//     .filter(d => d.device.status === "offline")
//     .map(d => ({
//       device: d.device,
//       type: d.device.type
//     }));

//   updateOfflineChart(offlineDevices);
// }


function renderOfflineChartFromCombined(combinedDevices) {
  // combinedDevices may be an array of { device: <device> } or an array of devices
  const flatInput = combinedDevices && combinedDevices.map
    ? combinedDevices.map(d => (d.device ? d.device : d))
    : (Array.isArray(combinedDevices) ? combinedDevices : []);

  // Build canonical flat devices array using the same flatten helper (we accept array input)
  const flatDevices = flattenDeviceBuckets(flatInput);

  // Rebuild CITY_LIST so LOC Count (cityBarChart) and map stay consistent with offline chart
  CITY_LIST = buildCityMapFromDevices(flatDevices);

  // geocode missing coords asynchronously is optional here; map updateMapData normally handles it.
  // ensureUniqueCityCoordinates(CITY_LIST); // optional if already handled elsewhere

  // Build offline devices array for the scatter chart
  const offlineDevices = flatDevices.filter(d => {
    const s = ((d.status || '') + '').toLowerCase();
    return (s === 'offline' || s === 'down' || d.online === false);
  }).map(d => ({
    device: d,            // keep device info accessible (updateOfflineChart expects .device)
    type: d.type || ''    // type must match what updateOfflineChart expects (camera/archiver/controller/server)
  }));

  // Update the offline scatter chart (uses grouping logic inside)
  updateOfflineChart(offlineDevices);

  // Also update LOC Count bar chart and map overlays to stay in sync
  if (typeof drawCityBarChart === 'function') drawCityBarChart();
  placeCityMarkers && placeCityMarkers();
  drawHeatmap && drawHeatmap();
}





// ///////
// ====== CITY BAR CHART ======
let cityBarChart = null;

/**
 * Build city stats from the existing offlineChart datasets and cityIndexMap.
 * Expected: offlineChart.data.datasets[].data[] points with {x, y, count}
 * and global cityIndexMap mapping cityName -> numeric index used on scatter.
 */
function buildCityStatsFromScatter() {
  const stats = {}; // city -> { cameras:0, archivers:0, controllers:0, ccure:0, total:0 }

  if (!offlineChart || !cityIndexMap) return stats;

  // reverse map for quick lookup: index -> cityName
  const indexToCity = {};
  Object.keys(cityIndexMap).forEach(city => {
    indexToCity[cityIndexMap[city]] = city;
  });

  // normalize dataset labels to keys we use
  const labelToKey = {
    'Camera': 'cameras',
    'Archiver': 'archivers',
    'Controller': 'controllers',
    'CCURE': 'ccure'
  };

  offlineChart.data.datasets.forEach(ds => {
    const key = labelToKey[ds.label] || ds.label.toLowerCase();
    (ds.data || []).forEach(pt => {
      const cityName = indexToCity[pt.x] || ('City-' + pt.x);
      if (!stats[cityName]) {
        stats[cityName] = { cameras:0, archivers:0, controllers:0, ccure:0, total:0 };
      }
      const c = Number(pt.count || 0);
      // accumulate into proper key (fallback to total if unknown)
      if (key in stats[cityName]) {
        stats[cityName][key] += c;
      } else {
        stats[cityName].total += c; // fallback
      }
      stats[cityName].total += c;
    });
  });

  return stats;
}

/**
 * Determine risk for a city according to rules:
 * - If total == 0 => 'None'
 * - If any archivers/controllers/ccure offline => 'High'
 * - Else if camera count > 0 => 'Medium'
 * - Else => 'None'
 */
function determineRisk(cityStat) {
  const { cameras, archivers, controllers, ccure } = cityStat;
  const totalNonCamera = (archivers || 0) + (controllers || 0) + (ccure || 0);
  if ((cityStat.total || 0) === 0) return 'None';
  if (totalNonCamera > 0) return 'High';
  if ((cameras || 0) > 0) return 'Medium';
  return 'None';
}

function drawCityBarChart() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded — add https://cdn.jsdelivr.net/npm/chart.js');
    return;
  }

  // Build stats from scatter data (keeps in sync)
  const stats = buildCityStatsFromScatter();
  const rows = [];

  Object.keys(stats).forEach(city => {
    const s = stats[city];
    const risk = determineRisk(s);
    // only include Medium or High
    if (risk === 'Medium' || risk === 'High') {
      rows.push({
        city,
        total: s.total || 0,
        cameras: s.cameras || 0,
        archivers: s.archivers || 0,
        controllers: s.controllers || 0,
        ccure: s.ccure || 0,
        risk
      });
    }
  });

  // nothing to show -> destroy chart and exit
  if (rows.length === 0) {
    if (cityBarChart) {
      cityBarChart.destroy();
      cityBarChart = null;
    }
    return;
  }

  // sort by total desc (optional)
  rows.sort((a,b) => b.total - a.total);

  const labels = rows.map(r => r.city);
  const dataTotals = rows.map(r => r.total);
  const barColors = rows.map(r => r.risk === 'High' ? '#ef4444' /*red*/ : '#f97316' /*orange*/);

  const ctx = document.getElementById('CityBarChart').getContext('2d');

  if (cityBarChart) {
    cityBarChart.data.labels = labels;
    cityBarChart.data.datasets[0].data = dataTotals;
    cityBarChart.data.datasets[0].backgroundColor = barColors;
    cityBarChart.update();
    return;
  }

  cityBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Offline Devices',
        data: dataTotals,
        backgroundColor: barColors,
        borderRadius: 6,
        maxBarThickness: 60
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: getComputedStyle(document.body).getPropertyValue('--graph-card-title-dark') || '#ddd' },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: { color: getComputedStyle(document.body).getPropertyValue('--graph-card-title-dark') || '#ddd' },
          grid: { color: 'rgba(255,255,255,0.06)' }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          // multi-line tooltip generation
          callbacks: {
            title: (ctx) => {
              // title is the city
              return ctx[0] ? ctx[0].label : '';
            },
            label: (ctx) => {
              // Use label lines array in afterLabel instead - return total line here
              const idx = ctx.dataIndex;
              const row = rows[idx];
              return `Total Device: ${row.total}`;
            },
            afterLabel: (ctx) => {
              const idx = ctx.dataIndex;
              const row = rows[idx];

              // Build lines for each device type with red indicator for offline counts
              const lines = [];

              // Risk line
              lines.push(`Risk Level: ${row.risk}`);

              // Offline counts with a red dot indicator (🔴) before the number to emphasize "offline in red"
              lines.push(`Offline Cameras: ${row.cameras > 0 ? '🔴 ' + row.cameras : row.cameras}`);
              lines.push(`Offline Archivers: ${row.archivers > 0 ? '🔴 ' + row.archivers : row.archivers}`);
              lines.push(`Offline Controllers: ${row.controllers > 0 ? '🔴 ' + row.controllers : row.controllers}`);
              lines.push(`Offline CCURE: ${row.ccure > 0 ? '🔴 ' + row.ccure : row.ccure}`);

              // Combined types summary (e.g. "Cameras + Controllers, CCURE, Archivers")
              const types = [];
              if (row.cameras) types.push('Cameras');
              if (row.controllers) types.push('Controllers');
              if (row.ccure) types.push('CCURE');
              if (row.archivers) types.push('Archivers');
              if (types.length > 0) {
                lines.push(`Types: ${types.join(' + ')}`);
              }

              return lines;
            }
          },
          // small styling tweaks
          bodyFont: { weight: '500' },
          titleFont: { weight: '700' }
        }
      }
    }
  });
}

// Hook into theme changes (so colors/ticks stay readable)
function updateCityBarTheme() {
  if (!cityBarChart) return;
  cityBarChart.options.scales.x.ticks.color = getChartColors().text;
  cityBarChart.options.scales.y.ticks.color = getChartColors().text;
  cityBarChart.update();
}

// Call updateCityBarTheme on theme changes
// re-use existing observer or ensure to call updateCityBarTheme whenever theme toggles
