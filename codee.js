Offline Device this chart is disply correct information ok 

Offline Device maxico has totla 9 camers if offline it is correct but in loc coount chart not diplsy any offline camerere count why,
  read teh belwo all code carefullyma and chek 
  and panama not any offline camere, but in loc and map show 2 camere is offline ok..
    so how to slvoe this issue..
    

          <!-- Updated Offline Device Card with new class -->
          <div class="offline-device-card">
            <h4 class="gcard-title">Offline Device</h4>
            <div class="chart-container">
              <canvas id="DotOfflineDevice"></canvas>
            </div>
          </div>

..... in this chart is loc count.. 
            
 <div class="gcard wide" id="Loc-Count-chart">
            <h4 class="gcard-title">LOC Count</h4>
            <canvas id="cityBarChart"></canvas>
          </div>
red the below all code carfully,
  ----------
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


// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️ bar chart


// let cityChart = null;

function drawCityBarChart() {

  const chartCanvas = document.getElementById("cityBarChart");
  if (!chartCanvas) {
    console.warn("Canvas not found");
    return;
  }

  if (!CITY_LIST || CITY_LIST.length === 0) {
    console.warn("CITY_LIST empty. Chart not drawn.");
    return;
  }

  const labels = CITY_LIST.map(c => c.city);

  const data = CITY_LIST.map(c => {
    if (!c.devices) return 0;
    return Object.values(c.devices).reduce((a, b) => a + b, 0);
  });

  if (cityChart) {
    cityChart.destroy();
  }

  cityChart = new Chart(chartCanvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Total Devices",
        data: data
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true
        },
        x: {
          ticks: {
            display: true,
            autoSkip: false,

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

  console.log("✅ City bar chart drawn");
}



document.getElementById("mapCityOverviewBtn").addEventListener("click", function () {
  const panel = document.getElementById("region-panel");

  if (panel.style.display === "block") {
    panel.style.display = "none";
  } else {
    panel.style.display = "block";
  }
});

// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️


function computeCityRiskLevel(city) {
  if (!city || !city.offline) return { label: "Low", color: "#16A34A" };

  const cam = city.offline.camera || 0;
  const arch = city.offline.archiver || 0;
  const srv = city.offline.server || 0;
  const ctrl = city.offline.controller || 0;

  const othersOffline = (arch > 0 || srv > 0 || ctrl > 0);

  // Case 1: Only cameras offline → MEDIUM
  if (cam > 0 && !othersOffline) {
    return { label: "Medium", color: "#FACC15" };
  }

  // Case 2: Camera + any other device offline → HIGH
  if (cam > 0 && othersOffline) {
    return { label: "High", color: "#DC2626" };
  }

  // Case 3: Everything else → LOW
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

  // const riskInfo = CITY_LIST.map(c => {
  //   const score = computeCityRiskScore(c);
  //   return mapScoreToRisk(score);
  // });

  const riskInfo = CITY_LIST.map(c => computeCityRiskLevel(c));

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
