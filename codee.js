map.js:513 updateMapData error ReferenceError: drawRegionBadges is not defined
    at updateMapData (map.js:510:5)
updateMapData	@	map.js:513

graph.js:1221 Uncaught (in promise) ReferenceError: computeCityRiskLevel is not defined
    at graph.js:1221:39
    at Array.map (<anonymous>)
    at drawCityBarChart (graph.js:1221:30)
    at updateMapData (map.js:517:23)
graph.js:1221 Uncaught (in promise) ReferenceError: computeCityRiskLevel is not defined
    at graph.js:1221:39
    at Array.map (<anonymous>)
    at drawCityBarChart (graph.js:1221:30)
    at updateMapData (map.js:517:23)

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
        // tooltip: {
        //   callbacks: {
        //     label: (ctx) => {
        //       const d = ctx.raw;
        //       const lines = [];
        //       if (d.ip) lines.push(`IP: ${d.ip}`);
        //       if (d.city) lines.push(`City: ${d.city}`);
        //       return lines;
        //     }
        //   }
        // }
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const d = ctx.raw;

              // If you already added count per point
              if (d.count !== undefined) {
                return `${d.count}`;
              }

              // If not grouped yet, return 1 for each device
              return `1`;
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
  // Build canonical CITY_LIST from combined data
  buildCityListFromCombined(combinedDevices);

  // Build data used by offline scatter (same normalization)
  const offlineDevices = combinedDevices
    .filter(d => (d.device || d).status === "offline")
    .map(d => {
      const device = d.device || d;
      return {
        device: device,
        type: device.type  // keep type as-is; updateOfflineChart() maps this with typeNames
      };
    });

  // Update both charts so they use the same aggregated data
  updateOfflineChart(offlineDevices);
  drawCityBarChart(); // redraw bar chart after CITY_LIST has been updated
}

// Normalize type keys used by CITY_LIST.offline and other code (singular form)
function normalizeTypeKey(type) {
  if (!type) return type;
  const t = type.toString().trim().toLowerCase();
  if (t === 'cameras') return 'camera';
  if (t === 'camera') return 'camera';
  if (t === 'archivers') return 'archiver';
  if (t === 'archiver') return 'archiver';
  if (t === 'controllers') return 'controller';
  if (t === 'controller') return 'controller';
  if (t === 'servers' || t === 'ccure' || t === 'server') return 'server';
  return t;
}

// Normalize city names (trim and collapse whitespace; optionally lowercase)
function normalizeCityName(city) {
  if (!city) return 'Unknown';
  return city.toString().trim(); // keep case, or use .toLowerCase() if you prefer case-insensitive
}

/**
 * Build/replace global CITY_LIST from combinedDevices.
 * Ensures CITY_LIST entries look like:
 * { city: "Panama", devices: { camera: 10, controller: 2 }, offline: { camera: 2, controller: 0 } }
 */
function buildCityListFromCombined(combinedDevices) {
  const map = {};

  combinedDevices.forEach(item => {
    const dev = item.device || item; // accommodate both shapes
    const rawCity = dev.city || 'Unknown';
    const city = normalizeCityName(rawCity);
    const rawType = dev.type || dev.deviceType || '';
    const type = normalizeTypeKey(rawType);

    if (!map[city]) {
      map[city] = {
        city: city,
        devices: {},    // total devices by type
        offline: { camera: 0, archiver: 0, controller: 0, server: 0 } // ensure keys exist
      };
    }

    // increment total devices count for that type
    if (type) {
      map[city].devices[type] = (map[city].devices[type] || 0) + 1;
    }

    // if device is offline, increment offline[type]
    const status = (dev.status || '').toString().toLowerCase();
    if (status === 'offline') {
      if (type) {
        // ensure offline key exists
        if (!(type in map[city].offline)) {
          map[city].offline[type] = 0;
        }
        map[city].offline[type] = (map[city].offline[type] || 0) + 1;
      }
    }
  });

  // Convert map to array and assign to global CITY_LIST
  CITY_LIST = Object.values(map);

  // If you want deterministic order, sort by city name:
  CITY_LIST.sort((a, b) => a.city.localeCompare(b.city));
}


// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️ bar chart


// // let cityChart = null;

// function drawCityBarChart() {

//   const chartCanvas = document.getElementById("cityBarChart");
//   if (!chartCanvas) {
//     console.warn("Canvas not found");
//     return;
//   }

//   if (!CITY_LIST || CITY_LIST.length === 0) {
//     console.warn("CITY_LIST empty. Chart not drawn.");
//     return;
//   }

//   const labels = CITY_LIST.map(c => c.city);

//   const data = CITY_LIST.map(c => {
//     if (!c.devices) return 0;
//     return Object.values(c.devices).reduce((a, b) => a + b, 0);
//   });

//   if (cityChart) {
//     cityChart.destroy();
//   }

//   cityChart = new Chart(chartCanvas.getContext("2d"), {
//     type: "bar",
//     data: {
//       labels: labels,
//       datasets: [{
//         label: "Total Devices",
//         data: data
//       }]
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: { display: false }
//       },
//       scales: {
//         y: {
//           beginAtZero: true
//         },
//         x: {
//           ticks: {
//             display: true,
//             autoSkip: false,

//             callback: function (value, index) {
//               const risk = riskLabels[index];

//               if (risk === "Medium" || risk === "High") {
//                 return labels[index];
//               }
//               return "";
//             },

//             color: function (context) {
//               const idx = context.index;
//               const risk = riskLabels[idx];
//               return (risk === "Medium" || risk === "High") ? "red" : "#666";
//             }
//           },
//           grid: {
//             display: true
//           }
//         }

//       }
//     }
//   });

//   console.log("✅ City bar chart drawn");
// }



// document.getElementById("mapCityOverviewBtn").addEventListener("click", function () {
//   const panel = document.getElementById("region-panel");

//   if (panel.style.display === "block") {
//     panel.style.display = "none";
//   } else {
//     panel.style.display = "block";
//   }
// });

// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️


// function computeCityRiskLevel(city) {
//   if (!city || !city.offline) return { label: "Low", color: "#16A34A" };

//   const cam = city.offline.camera || 0;
//   const arch = city.offline.archiver || 0;
//   const srv = city.offline.server || 0;
//   const ctrl = city.offline.controller || 0;

//   const othersOffline = (arch > 0 || srv > 0 || ctrl > 0);

//   // Case 1: Only cameras offline → MEDIUM
//   if (cam > 0 && !othersOffline) {
//     return { label: "Medium", color: "#FACC15" };
//   }

//   // Case 2: Camera + any other device offline → HIGH
//   if (cam > 0 && othersOffline) {
//     return { label: "High", color: "#DC2626" };
//   }

//   // Case 3: Everything else → LOW
//   return { label: "Low", color: "#16A34A" };
// }



// /*********************************
//  * LEGEND (TOP RIGHT)
//  *********************************/

// function createCityLegend(containerId = "cityBarLegend") {

//   const holder = document.getElementById("Loc-Count-chart");
//   if (!holder) return;

//   holder.style.position = "relative"; // important for top-right

//   let container = document.getElementById(containerId);

//   if (!container) {
//     container = document.createElement("div");
//     container.id = containerId;
//     holder.appendChild(container);
//   }

//   container.style.position = "absolute";
//   container.style.top = "5px";
//   container.style.right = "10px";
//   container.style.fontSize = "12px";
//   container.style.display = "flex";
//   container.style.flexDirection = "column";
//   container.style.gap = "6px";
//   container.style.padding = "6px 10px";
//   container.style.borderRadius = "6px";
//   container.style.boxShadow = "0px 2px 6px rgba(0,0,0,0.15)";

//   container.innerHTML = `
//     <div style="display:flex;align-items:center;gap:6px;">
//       <span style="width:12px;height:12px;background:#16A34A;border-radius:3px;"></span> Low
//     </div>
//     <div style="display:flex;align-items:center;gap:6px;">
//       <span style="width:12px;height:12px;background:#FACC15;border-radius:3px;"></span> Medium
//     </div>
//     <div style="display:flex;align-items:center;gap:6px;">
//       <span style="width:12px;height:12px;background:#DC2626;border-radius:3px;"></span> High
//     </div>
//   `;
// }


// /*********************************
//  * CITY BAR CHART
//  *********************************/

// let cityChart = null;

// function drawCityBarChart() {

//   const chartCanvas = document.getElementById("cityBarChart");
//   if (!chartCanvas) {
//     console.warn("Canvas not found");
//     return;
//   }

//   if (!CITY_LIST || CITY_LIST.length === 0) {
//     console.warn("CITY_LIST empty. Chart not drawn.");
//     const lg = document.getElementById("cityBarLegend");
//     if (lg) lg.remove();
//     return;
//   }

//   const labels = CITY_LIST.map(c => c.city);

//   const data = CITY_LIST.map(c => {
//     if (!c.devices) return 0;
//     return Object.values(c.devices).reduce((a, b) => a + b, 0);
//   });

//   // const riskInfo = CITY_LIST.map(c => {
//   //   const score = computeCityRiskScore(c);
//   //   return mapScoreToRisk(score);
//   // });

//   const riskInfo = CITY_LIST.map(c => computeCityRiskLevel(c));

//   const colors = riskInfo.map(r => r.color);
//   const riskLabels = riskInfo.map(r => r.label);

//   if (cityChart) cityChart.destroy();

//   cityChart = new Chart(chartCanvas.getContext("2d"), {
//     type: "bar",
//     data: {
//       labels: labels,
//       datasets: [{
//         label: "Total Devices",
//         data: data,
//         backgroundColor: colors,
//         borderColor: colors,
//         borderWidth: 1,
//         borderRadius: 6,
//         barPercentage: 0.8,
//         categoryPercentage: 0.9
//       }]
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: { display: false },

//         // tooltip: {
//         //   callbacks: {
//         //     title: function (items) {
//         //       return labels[items[0].dataIndex];
//         //     },

//         //     label: function (item) {
//         //       const idx = item.dataIndex;
//         //       const c = CITY_LIST[idx] || {};

//         //       const total = c.devices
//         //         ? Object.values(c.devices).reduce((a, b) => a + b, 0)
//         //         : 0;

//         //       const camOff = (c.offline && c.offline.camera) || 0;
//         //       const ctrlOff = (c.offline && c.offline.controller) || 0;
//         //       const srvOff = (c.offline && c.offline.server) || 0;
//         //       const archOff = (c.offline && c.offline.archiver) || 0;

//         //       const risk = riskLabels[idx] || "Low";

//         //       return [
//         //         `Total Devices: ${total}`,
//         //         `Risk Level: ${risk}`,
//         //         `Offline Camera: ${camOff}`,
//         //         `Offline Controller: ${ctrlOff}`,
//         //         `Offline Server: ${srvOff}`,
//         //         `Offline Archiver: ${archOff}`
//         //       ];
//         //     }


//         //   }
//         // }

//         // Replace existing tooltip: { ... } with this:
//         tooltip: {
//           enabled: false, // disable built-in tooltip rendering
//           external: function (context) {
//             // get/create tooltip element
//             let tooltipEl = document.getElementById('chartjs-tooltip');
//             if (!tooltipEl) {
//               tooltipEl = document.createElement('div');
//               tooltipEl.id = 'chartjs-tooltip';
//               tooltipEl.className = 'chartjs-tooltip';
//               document.body.appendChild(tooltipEl);
//             }

//             // Hide if no tooltip
//             const tooltipModel = context.tooltip;
//             if (!tooltipModel || tooltipModel.opacity === 0) {
//               tooltipEl.style.opacity = 0;
//               return;
//             }

//             // Determine index for the hovered bar
//             const dataIndex = tooltipModel.dataPoints && tooltipModel.dataPoints.length ? tooltipModel.dataPoints[0].dataIndex : null;
//             if (dataIndex === null) {
//               tooltipEl.style.opacity = 0;
//               return;
//             }

//             // Build lines (same order you used)
//             const c = CITY_LIST[dataIndex] || {};
//             const total = c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0;
//             const camOff = (c.offline && c.offline.camera) || 0;
//             const ctrlOff = (c.offline && c.offline.controller) || 0;
//             const srvOff = (c.offline && c.offline.server) || 0;
//             const archOff = (c.offline && c.offline.archiver) || 0;
//             const risk = riskLabels[dataIndex] || 'Low';

//             const lines = [
//               { key: 'Total Devices', val: total, color: '#ffffff' },
//               { key: 'Risk Level', val: risk, color: '#ffffff' },
//               { key: 'Offline Camera', val: camOff, color: camOff > 0 ? 'red' : '#ffffff' },
//               { key: 'Offline Controller', val: ctrlOff, color: ctrlOff > 0 ? 'red' : '#ffffff' },
//               { key: 'Offline Server', val: srvOff, color: srvOff > 0 ? 'red' : '#ffffff' },
//               { key: 'Offline Archiver', val: archOff, color: archOff > 0 ? 'red' : '#ffffff' }
//             ];

//             // Build HTML
//             let innerHtml = `<div class="tt-title">${labels[dataIndex]}</div>`;
//             lines.forEach(line => {
//               // don't show 0 offline lines? you said show but not red — keep visible but not red
//               innerHtml += `<div class="tt-line"><span class="tt-key">${line.key}:</span> <span class="tt-val" style="color:${line.color}">${line.val}</span></div>`;
//             });

//             tooltipEl.innerHTML = innerHtml;
//             tooltipEl.style.opacity = 1;

//             // Positioning: try to place tooltip near the caret (Chart.js provides caretX/caretY in tooltipModel)
//             const canvas = context.chart.canvas;
//             const canvasRect = canvas.getBoundingClientRect();
//             // caret coordinates are in chart pixels; convert to page coords
//             const left = canvasRect.left + window.pageXOffset + tooltipModel.caretX;
//             const top = canvasRect.top + window.pageYOffset + tooltipModel.caretY;

//             // Position slightly above the cursor
//             tooltipEl.style.left = `${left}px`;
//             tooltipEl.style.top = `${top - 10}px`;
//           }
//         }



//       },
//       scales: {
//         y: {
//           beginAtZero: true
//         },


//         x: {
//           ticks: {
//             display: true,
//             autoSkip: false,
//             maxRotation: 0,
//             minRotation: 0,

//             callback: function (value, index) {
//               const risk = riskLabels[index];

//               if (risk === "Medium" || risk === "High") {
//                 return labels[index];
//               }
//               return "";
//             },

//             color: function (context) {
//               const idx = context.index;
//               const risk = riskLabels[idx];
//               return (risk === "Medium" || risk === "High") ? "red" : "#666";
//             }
//           },
//           grid: {
//             display: true
//           }
//         }


//       }
//     }
//   });

//   // Add legend in top-right
//   createCityLegend("cityBarLegend");

//   console.log("✅ City bar chart updated with top-right legend");
// }





// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️
// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️
// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️
// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️






// SINGLE INSTANCE
let cityChart = null;

function drawCityBarChart() {
  // guard: Chart.js loaded?
  if (typeof Chart === 'undefined') {
    console.error("Chart.js not found. Please include Chart.js before calling drawCityBarChart.");
    return;
  }

  const chartCanvas = document.getElementById("cityBarChart");
  if (!chartCanvas) {
    console.warn("Canvas #cityBarChart not found");
    return;
  }

  // If the canvas (or parent) has zero height/width, Chart will draw nothing.
  // Defensive: ensure canvas has reasonable height if not provided by CSS.
  const canvasStyle = window.getComputedStyle(chartCanvas);
  if ((chartCanvas.clientHeight === 0) || (chartCanvas.clientWidth === 0) ||
      canvasStyle.display === 'none' || canvasStyle.visibility === 'hidden') {
    // Try to set a sensible default height so Chart.js can render.
    // If you prefer CSS to control this, remove/adjust the line below.
    chartCanvas.style.minHeight = chartCanvas.style.height || '220px';
  }

  if (!CITY_LIST || CITY_LIST.length === 0) {
    console.warn("CITY_LIST empty. Chart not drawn.");
    // cleanup legend + existing chart + tooltip if present
    const lg = document.getElementById("cityBarLegend");
    if (lg) lg.remove();
    if (cityChart) {
      try { cityChart.destroy(); } catch (e) { /* ignore */ }
      cityChart = null;
    }
    const tt = document.getElementById('chartjs-tooltip');
    if (tt) tt.remove();
    return;
  }

  // Build labels & data
  const labels = CITY_LIST.map(c => c.city || "—");
  const data = CITY_LIST.map(c => {
    if (!c.devices) return 0;
    return Object.values(c.devices).reduce((a, b) => a + b, 0);
  });

  // Risk info (keeps your computeCityRiskLevel logic)
  const riskInfo = CITY_LIST.map(c => computeCityRiskLevel(c));
  const colors = riskInfo.map(r => r.color);
  const riskLabels = riskInfo.map(r => r.label);

  // Remove previous chart + tooltip element if present
  if (cityChart) {
    try { cityChart.destroy(); } catch (e) { /* ignore */ }
    cityChart = null;
  }
  const existingTooltip = document.getElementById('chartjs-tooltip');
  if (existingTooltip) existingTooltip.remove();

  // Create the chart (riskLabels and labels are closed over and available to callbacks)
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

        // custom external tooltip (keeps your tooltip content)
        tooltip: {
          enabled: false,
          external: function (context) {
            let tooltipEl = document.getElementById('chartjs-tooltip');
            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-tooltip';
              tooltipEl.className = 'chartjs-tooltip';
              // minimal inline styles; move to CSS if desired
              tooltipEl.style.position = 'absolute';
              tooltipEl.style.pointerEvents = 'none';
              tooltipEl.style.background = 'rgba(0,0,0,0.75)';
              tooltipEl.style.color = '#fff';
              tooltipEl.style.padding = '8px 10px';
              tooltipEl.style.borderRadius = '6px';
              tooltipEl.style.fontSize = '12px';
              tooltipEl.style.zIndex = 10000;
              document.body.appendChild(tooltipEl);
            }

            const tooltipModel = context.tooltip;
            if (!tooltipModel || tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0;
              return;
            }

            const dataIndex = tooltipModel.dataPoints && tooltipModel.dataPoints.length ? tooltipModel.dataPoints[0].dataIndex : null;
            if (dataIndex === null) {
              tooltipEl.style.opacity = 0;
              return;
            }

            // Build tooltip text from CITY_LIST and riskLabels (unchanged logic)
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

            let innerHtml = `<div class="tt-title" style="font-weight:700;margin-bottom:6px;">${labels[dataIndex]}</div>`;
            lines.forEach(line => {
              innerHtml += `<div class="tt-line" style="margin-bottom:4px;"><span class="tt-key" style="opacity:0.85;">${line.key}:</span> <span class="tt-val" style="color:${line.color}; margin-left:6px;">${line.val}</span></div>`;
            });

            tooltipEl.innerHTML = innerHtml;
            tooltipEl.style.opacity = 1;

            // Position near the caret (chart → page coords). caretX/caretY may be undefined in some interactions, guard them.
            const canvas = context.chart.canvas;
            const canvasRect = canvas.getBoundingClientRect();
            const caretX = (tooltipModel.caretX != null) ? tooltipModel.caretX : (canvasRect.width / 2);
            const caretY = (tooltipModel.caretY != null) ? tooltipModel.caretY : (canvasRect.height / 2);
            const left = canvasRect.left + window.pageXOffset + caretX;
            const top = canvasRect.top + window.pageYOffset + caretY;

            // Place tooltip above caret if possible
            tooltipEl.style.left = `${left}px`;
            tooltipEl.style.top = `${top - tooltipEl.offsetHeight - 8}px`;
          }
        }
      },
      // scales: keep your ticks logic (riskLabels closed over)
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
              if (risk === "Medium" || risk === "High") return labels[index];
              return "";
            },
            color: function (context) {
              const idx = context.index;
              const risk = riskLabels[idx];
              return (risk === "Medium" || risk === "High") ? "red" : "#666";
            }
          },
          grid: { display: true }
        }
      }
    }
  });

  // if canvas was previously hidden, force an update/resize to ensure visible rendering
  try {
    cityChart.resize();
    cityChart.update();
  } catch (e) { /* ignore */ }

  // Add / refresh legend in top-right (your existing function)
  createCityLegend("cityBarLegend");

  console.log("✅ City bar chart drawn/updated");
}
