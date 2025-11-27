ok, now tell me wher ot add this
in graph.js or map.js 

// ---------- SHARED HELPERS: flatten + detect-type + aggregator ----------

/**
 * Detect simplified device type (camera/controller/server/archiver)
 * from either the bucket key or device.type/product/model strings.
 */
function detectDeviceType(bucketKeyOrType, deviceObj) {
  const key = (bucketKeyOrType || '').toString().toLowerCase();
  const typeField = (deviceObj && (deviceObj.type || deviceObj.deviceType || deviceObj.product || deviceObj.model)) || '';
  const tf = typeField.toString().toLowerCase();

  // check explicit fields first
  if (tf.includes('camera')) return 'camera';
  if (tf.includes('archiver') || tf.includes('archive')) return 'archiver';
  if (tf.includes('controller')) return 'controller';
  if (tf.includes('server') || tf.includes('ccure') || tf.includes('db')) return 'server';

  // fallback to bucket key (like 'cameras', 'controllers', etc)
  if (key.includes('camera')) return 'camera';
  if (key.includes('archiver')) return 'archiver';
  if (key.includes('controller')) return 'controller';
  if (key.includes('server') || key.includes('ccure')) return 'server';

  // unknown
  return null;
}

/**
 * Flatten a "buckets" object-of-arrays (or array) into a simple devices array.
 * Accepts either:
 * - an object mapping bucketName -> [device,...]
 * - OR a plain array of device entries
 *
 * Each returned device has canonical properties:
 *   { city, lat, lon, type, status, online, region, original: <original object> }
 */
function flattenDeviceBuckets(buckets) {
  const res = [];

  if (!buckets) return res;

  // If buckets is a plain array of devices
  if (Array.isArray(buckets)) {
    buckets.forEach(d => {
      const source = d.device ? d.device : d;
      res.push({
        city: (source.city || source.location || source.site || "Unknown"),
        lat: toNum(source.lat),
        lon: toNum(source.lon),
        type: detectDeviceType(source.type || '', source),
        status: source.status || source.state || null,
        online: typeof source.online === 'boolean' ? source.online : undefined,
        region: source.region || source.zone || null,
        original: source
      });
    });
    return res;
  }

  // If buckets is object of arrays
  Object.entries(buckets).forEach(([key, arr]) => {
    if (!Array.isArray(arr)) return;
    arr.forEach(item => {
      const source = item.device ? item.device : item;
      res.push({
        city: (source.city || source.location || source.site || "Unknown"),
        lat: toNum(source.lat),
        lon: toNum(source.lon),
        type: detectDeviceType(key, source),
        status: source.status || source.state || null,
        online: typeof source.online === 'boolean' ? source.online : undefined,
        region: source.region || source.zone || null,
        original: source
      });
    });
  });

  return res;
}

/**
 * Build CITY_LIST (array) from a flat devices array.
 * This produces the same structure used elsewhere: { city, lat, lon, devices:{...}, offline:{...}, total, devicesList, region }
 */
function buildCityMapFromDevices(flatDevices) {
  const cityMap = {};

  flatDevices.forEach(dev => {
    // normalize the city to the parent/standardized name
    const rawName = dev.city || "Unknown";
    const cityName = (typeof normalizeCityForMap === 'function') ? normalizeCityForMap(rawName) : (String(rawName).trim() || 'Unknown');

    if (!cityMap[cityName]) {
      cityMap[cityName] = {
        city: cityName,
        lat: (dev.lat !== undefined && dev.lat !== null) ? dev.lat : null,
        lon: (dev.lon !== undefined && dev.lon !== null) ? dev.lon : null,
        devices: { camera: 0, controller: 0, server: 0, archiver: 0 },
        offline: { camera: 0, controller: 0, server: 0, archiver: 0 },
        total: 0,
        devicesList: [],
        region: dev.region || null
      };
    }

    const entry = cityMap[cityName];
    const t = dev.type;

    if (t && entry.devices.hasOwnProperty(t)) {
      entry.devices[t] = (entry.devices[t] || 0) + 1;
    } else {
      // unknown types: place them into devicesList but still count total
    }

    entry.total = (entry.total || 0) + 1;
    entry.devicesList.push(dev.original || dev);

    // update lat/lon if device has a coordinate
    if (dev.lat !== null && dev.lon !== null) {
      entry.lat = dev.lat;
      entry.lon = dev.lon;
    }

    // offline detection
    const s = ((dev.status || '') + '').toLowerCase();
    const isOffline = (s === 'offline' || s === 'down' || dev.online === false);
    if (isOffline) {
      if (t && entry.offline.hasOwnProperty(t)) {
        entry.offline[t] = (entry.offline[t] || 0) + 1;
      } else {
        // nothing
      }
    }
  });

  // Convert to array and ensure coords + uniquify coords
  let list = Object.values(cityMap);
  list.forEach(c => {
    if (c.lat === null || c.lon === null) {
      // will be geocoded later by getCityCoordinates if needed
      c.lat = null;
      c.lon = null;
    }
  });

  // keep same shape used by other code
  return list;
}

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
function renderOfflineChartFromCombined(combinedDevices) {
  const offlineDevices = combinedDevices
    .filter(d => d.device.status === "offline")
    .map(d => ({
      device: d.device,
      type: d.device.type
    }));

  updateOfflineChart(offlineDevices);
}

