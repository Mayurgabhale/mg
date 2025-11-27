but in this 
  Offline Device 
in this graph, panama is not show, this is correct 
    ok read thsi and give me in map.js file correct code  ok 
 <!-- Updated Offline Device Card with new class -->
          <div class="offline-device-card">
            <h4 class="gcard-title">Offline Device</h4>
            <div class="chart-container">
              <canvas id="DotOfflineDevice"></canvas>
            </div>
          </div>

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

// ⬇️⬇️ this is call in scrip.js
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
// ⬇️⬇️ this is call in scrip.js file
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
// ⬇️⬇️ this call in scrip.js
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
// ⬇️⬇️ this is call in scrip.js 
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

// ⬇️⬇️ this is call in scrip.js 
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
red alos this script.js

// C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\script.js
// const baseUrl = "http://localhost:80/api/regions";
const baseUrl = "http://10.138.161.4:3000/api/regions";
let refreshInterval = 300000; // 5 minutes
let pingInterval = 60000; // 30 seconds
let countdownTime = refreshInterval / 1000; // Convert to seconds
let currentRegion = "global";
let deviceDetailsCache = {}; // Store previous details to prevent redundant updates
let latestDetails = null; // Cache the latest fetched details




// Controller cache (populated inside fetchData)
window.controllerDataCached = null; // <-- ADDED: global cache for controllers

document.addEventListener("DOMContentLoaded", () => {
    // ⬇️⬇️ this is call from graph.js
    initOfflineChart()
    fetchData("global"); // Load initial data
    startAutoRefresh("global");



    // Attach Door click
    const doorCard = document.getElementById("door-card");
    if (doorCard) {
        doorCard.style.cursor = "pointer";
        doorCard.title = "Click to view Controllers";
        doorCard.addEventListener("click", loadControllersInDetails);
    }


    document.querySelectorAll(".region-button").forEach((button) => {
        button.addEventListener("click", () => {
            const region = button.getAttribute("data-region");
            document.getElementById("region-title").textContent = `${region.toUpperCase()} Summary`;
            switchRegion(region);
        });
    });

    document.getElementById("close-modal").addEventListener("click", () => {
        document.getElementById("modal").style.display = "none";
    });


    // ---------------------------
    // NEW: Summary card click/dblclick filter behavior
    // Single click: set device-filter to that type and trigger change (show only that type)
    // Double click: set device-filter to 'all' and trigger change (show all)
    // ---------------------------

    (function attachSummaryCardFilterHandlers() {
        const summaryCards = document.querySelectorAll(".summary .card");
        if (!summaryCards || summaryCards.length === 0) return;

        // helper: derive deviceFilter value from card title text
        function mapCardTitleToFilterValue(title) {
            if (!title) return "all";
            const t = title.toLowerCase();

            if (t.includes("camera")) return "cameras";
            if (t.includes("archiver")) return "archivers";
            if (t.includes("controller")) return "controllers";
            if (t.includes("ccure")) return "servers";       // CCURE servers
            if (t.includes("db")) return "dbdetails";        // DB servers
            if (t.includes("desktop")) return "pcdetails";
            if (t.includes("total")) return "all";

            return "all";
        }

        document.addEventListener("DOMContentLoaded", () => {
            const doorCard = document.getElementById("door-card");
            if (doorCard) {
                doorCard.style.cursor = "pointer";
                doorCard.title = "Click to view Controllers";
                doorCard.addEventListener("click", loadControllersInDetails);
            }
        });



        summaryCards.forEach((card) => {
            // make interactive
            card.style.cursor = "pointer";

            let clickTimer = null;
            const clickDelay = 100; // ms


            card.addEventListener("click", (ev) => {
                if (clickTimer) clearTimeout(clickTimer);
                clickTimer = setTimeout(() => {
                    const h3 = card.querySelector("h3");
                    const titleText = h3 ? h3.innerText.trim() : card.innerText.trim();
                    const filterValue = mapCardTitleToFilterValue(titleText);

                    const deviceFilterElem = document.getElementById("device-filter");
                    if (!deviceFilterElem) return;

                    deviceFilterElem.value = filterValue;
                    deviceFilterElem.dispatchEvent(new Event("change", { bubbles: true }));

                    // 🔥 Highlight clicked card, remove from others
                    document.querySelectorAll(".summary .card").forEach(c => c.classList.remove("active"));
                    if (filterValue !== "all") {
                        card.classList.add("active");
                    }
                }, clickDelay);
            });

            card.addEventListener("dblclick", (ev) => {
                if (clickTimer) {
                    clearTimeout(clickTimer);
                    clickTimer = null;
                }
                const deviceFilterElem = document.getElementById("device-filter");
                if (!deviceFilterElem) return;

                deviceFilterElem.value = "all";
                deviceFilterElem.dispatchEvent(new Event("change", { bubbles: true }));

                // 🔥 Remove all highlights on double-click (reset)
                document.querySelectorAll(".summary .card").forEach(c => c.classList.remove("active"));
            });



        });
    })();



});

// // --- Camera URL auto-detect helpers ---

function buildUrlFromHints(ip, cameraname = "", hyperlink = "") {
    ip = (ip || "").trim();
    hyperlink = (hyperlink || "").trim();

    // 🔑 Always prefer Excel's hyperlink if present
    if (hyperlink && /^https?:\/\//.test(hyperlink)) {
        return hyperlink;
    }

    // Direct IP
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
        return `http://${ip}`;
    }

    // Brand-based fallback
    const name = (cameraname || "").toLowerCase();
    if (/\bverkada\b/.test(name)) return `https://${ip}/#/login`;
    if (/\bflir\b/.test(name)) return `http://${ip}/control/userimage.html`;
    if (/\bhoneywell\b/.test(name)) return `http://${ip}/www/index.html`;
    if (/axis/.test(name)) return `http://${ip}/view/view.shtml`;

    return `http://${ip}`;
}

function openCamera(ip, name, hyperlink = "") {
    const url = buildUrlFromHints(ip, name, hyperlink);
    console.log("Opening URL:", url);  // Debug
    window.open(url, "_blank", "noopener");
}





function switchRegion(region) {
    clearExistingIntervals(); // Avoid interval duplication
    currentRegion = region;
    deviceDetailsCache = {};
    fetchData(region);
    startAutoRefresh(region);
}

// **Auto-refresh mechanism**
function startAutoRefresh(regionName) {
    fetchData(regionName); // Fetch initial data

    clearExistingIntervals();

    // Start countdown timer
    window.countdownTimer = setInterval(() => {
        document.getElementById("countdown").innerText = `Refreshing in ${countdownTime} seconds`;
        countdownTime--;
        if (countdownTime < 0) countdownTime = refreshInterval / 1000;
    }, 1000);

    // Refresh summary & details every 5 minutes
    window.refreshTimer = setInterval(() => {
        fetchData(regionName);
        countdownTime = refreshInterval / 1000;
    }, refreshInterval);

    // Ping devices every 30 seconds using history API
    window.pingTimer = setInterval(() => {
        pingAllDevices(regionName);
    }, pingInterval);
}

function clearExistingIntervals() {
    clearInterval(window.countdownTimer);
    clearInterval(window.refreshTimer);
    clearInterval(window.pingTimer);
}

// **Fetch summary and details together**





// Fetch summary, details and controllers together
function fetchData(regionName) {
    Promise.all([
        fetch(`${baseUrl}/summary/${regionName}`).then(res => res.json()),
        fetch(`${baseUrl}/details/${regionName}`).then(res => res.json()),
        // fetch(`http://localhost/api/controllers/status`).then(res => res.json()) // <-- controllers endpoint
        fetch(`http://10.138.161.4:3000/api/controllers/status`).then(res => res.json()) // <-- controllers endpoint
    ])
        .then(([summary, details, controllerData]) => {
            console.log("Summary Data:", summary);
            console.log("Details Data:", details);
            console.log("Controller Data:", controllerData);

            // Cache full controller data for reuse (keep unfiltered copy)
            if (Array.isArray(controllerData)) {
                window.controllerDataCached = controllerData; // full cache
            } else {
                window.controllerDataCached = null;
            }

            // Build controllers list filtered by the requested region (so summary reflects region)
            let controllersForRegion = Array.isArray(controllerData) ? controllerData.slice() : [];
            try {
                const regionLower = (regionName || "global").toString().toLowerCase();
                if (regionLower !== "global") {
                    controllersForRegion = controllersForRegion.filter(c => {
                        const loc = (c.Location || c.location || "").toString().toLowerCase();
                        // also allow matching by City if you ever pass city as region
                        const city = (c.City || c.city || "").toString().toLowerCase();
                        return loc === regionLower || city === regionLower;
                    });
                }
            } catch (e) {
                // fallback: keep full list if something goes wrong
                controllersForRegion = Array.isArray(controllerData) ? controllerData.slice() : [];
            }

            // Compute door + reader summary from controllers API but using region-filtered controllers
            const controllerExtras = processDoorAndReaderData(controllersForRegion);

            // Attach extras into the same structure updateSummary expects:
            if (!summary.summary) summary.summary = {};
            summary.summary.controllerExtras = controllerExtras;
            // Update UI and details
            updateSummary(summary);

            // ⬇️⬇️
            // Tell the map about new live counts if map exists
            if (typeof window.updateMapData === 'function') {
                window.updateMapData(summary, details);
            }

            if (JSON.stringify(details) !== JSON.stringify(deviceDetailsCache)) {
                updateDetails(details);
                deviceDetailsCache = details; // Update cache
            }
            latestDetails = details;
        })
        .catch((error) => console.error("Error fetching data:", error));
}

/*
   Updated pingAllDevices:
   Instead of calling a non-existent ping endpoint, we now use the history API to fetch 
   device history and update each device’s status by updating the separate status dot and text.
*/

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert("IP copied: " + text);
            })
            .catch(err => {
                console.error("Clipboard API failed", err);
                fallbackCopyTextToClipboard(text);
            });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    // Create a temporary textarea
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Prevent scrolling to bottom
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand("copy");
        if (successful) {
            alert("IP copied (fallback): " + text);
        } else {
            alert("Fallback copy failed");
        }
    } catch (err) {
        console.error("Fallback copy failed", err);
        alert("Unable to copy");
    }

    document.body.removeChild(textArea);
}

function pingAllDevices(regionName) {
    let details = latestDetails;
    if (!details || !details.details) return;

    // fetch("http://localhost/api/devices/history")
    fetch("http://10.138.161.4:3000/api/devices/history")
        .then(response => response.json())
        .then(historyData => {
            let statusChanged = false;

            for (const [key, devices] of Object.entries(details.details)) {
                if (!Array.isArray(devices) || devices.length === 0) continue;

                devices.forEach((device) => {
                    const ip = device.ip_address || "N/A";
                    const card = document.querySelector(`[data-ip="${ip}"]`);
                    if (!card) return;

                    // Determine new status from history API if available.
                    const historyArray = historyData[ip];
                    let newStatus = (device.status || "offline").toLowerCase();
                    if (Array.isArray(historyArray) && historyArray.length > 0) {
                        const latestEntry = historyArray[historyArray.length - 1];
                        newStatus = (latestEntry.status || "offline").toLowerCase();
                    }
                    const currentStatus = card.dataset.status;

                    // Update UI: update the dot and the text.
                    const statusDot = card.querySelector(".status-dot");
                    const statusText = card.querySelector(".status-text");
                    if (statusDot) {
                        statusDot.style.backgroundColor = newStatus === "online" ? "green" : "red";
                        statusDot.classList.remove("online-dot", "offline-dot");
                        statusDot.classList.add(newStatus === "online" ? "online-dot" : "offline-dot");
                    }
                    else {
                        console.warn(`Status dot element not found for IP: ${ip}`);
                    }
                    if (statusText) {
                        const textColor = newStatus === "online" ? "green" : "red";

                        statusText.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
                        statusText.style.color = textColor;
                        statusText.style.backgroundColor = "transparent";
                        statusText.style.padding = "0";
                        statusText.style.borderRadius = "0";
                    } else {
                        console.warn(`Status text element not found for IP: ${ip}`);
                    }

                    if (newStatus !== currentStatus) {
                        statusChanged = true;
                        card.dataset.status = newStatus;
                    }
                });
            }

            setTimeout(() => {
                if (statusChanged) {
                    fetchData(regionName);
                }
            }, 5000);
        })
        .catch(error => {
            console.error("Error fetching device history:", error);
        });
}





// Process controllers API to compute doors & readers totals
function processDoorAndReaderData(controllerData) {
    // controllerData is expected to be an array of controller objects (per your example)
    if (!Array.isArray(controllerData)) {
        return {
            doors: { total: 0, online: 0, offline: 0 },
            readers: { total: 0, online: 0, offline: 0 }
        };
    }

    let doorsTotal = 0, doorsOnline = 0;
    let readersTotal = 0, readersOnline = 0;

    controllerData.forEach(ctrl => {
        if (!Array.isArray(ctrl.Doors)) return;

        ctrl.Doors.forEach(door => {
            // Count door
            doorsTotal++;
            if ((door.status || "").toLowerCase() === "online") doorsOnline++;

            // Count reader only if Reader field is present & non-empty
            if (door.Reader && door.Reader.toString().trim() !== "") {
                readersTotal++;
                if ((door.status || "").toLowerCase() === "online") readersOnline++;
            }
        });
    });

    return {
        doors: {
            total: doorsTotal,
            online: doorsOnline,
            offline: doorsTotal - doorsOnline
        },
        readers: {
            total: readersTotal,
            online: readersOnline,
            offline: readersTotal - readersOnline
        }
    };
}


function updateSummary(data) {
    const summary = data.summary || {};

    // ✅ Always keep last known values if new data doesn’t have them
    window.lastSummary = window.lastSummary || {};
    const merged = {
        totalDevices: summary.totalDevices ?? window.lastSummary.totalDevices ?? 0,
        totalOnlineDevices: summary.totalOnlineDevices ?? window.lastSummary.totalOnlineDevices ?? 0,
        totalOfflineDevices: summary.totalOfflineDevices ?? window.lastSummary.totalOfflineDevices ?? 0,

        cameras: { ...window.lastSummary.cameras, ...summary.cameras },
        archivers: { ...window.lastSummary.archivers, ...summary.archivers },
        controllers: { ...window.lastSummary.controllers, ...summary.controllers },
        servers: { ...window.lastSummary.servers, ...summary.servers },
        pcdetails: { ...window.lastSummary.pcdetails, ...summary.pcdetails },
        dbdetails: { ...window.lastSummary.dbdetails, ...summary.dbdetails },

        // 🆕 door/reader extras merged (summary.controllerExtras is created in fetchData)
        controllerExtras: { ...window.lastSummary.controllerExtras, ...summary.controllerExtras }
    };


    // 🆕 Recalculate totals to include Door counts (but not Readers)
    const doors = merged.controllerExtras?.doors || { total: 0, online: 0, offline: 0 };

    // Recompute totals including doors
    merged.totalDevices =
        (merged.cameras?.total || 0) +
        (merged.archivers?.total || 0) +
        (merged.controllers?.total || 0) +
        (merged.servers?.total || 0) +
        (merged.pcdetails?.total || 0) +
        (merged.dbdetails?.total || 0) +
        doors.total; // ✅ include doors only

    merged.totalOnlineDevices =
        (merged.cameras?.online || 0) +
        (merged.archivers?.online || 0) +
        (merged.controllers?.online || 0) +
        (merged.servers?.online || 0) +
        (merged.pcdetails?.online || 0) +
        (merged.dbdetails?.online || 0) +
        doors.online; // ✅ include doors only

    merged.totalOfflineDevices =
        merged.totalDevices - merged.totalOnlineDevices;




    // ✅ Save merged result for next refresh
    window.lastSummary = merged;

    // Update UI safely
    document.getElementById("total-devices").textContent = merged.totalDevices;
    document.getElementById("online-devices").textContent = merged.totalOnlineDevices;
    document.getElementById("offline-devices").textContent = merged.totalOfflineDevices;

    document.getElementById("camera-total").textContent = merged.cameras?.total || 0;
    document.getElementById("camera-online").textContent = merged.cameras?.online || 0;
    document.getElementById("camera-offline").textContent = merged.cameras?.offline || 0;

    document.getElementById("archiver-total").textContent = merged.archivers?.total || 0;
    document.getElementById("archiver-online").textContent = merged.archivers?.online || 0;
    document.getElementById("archiver-offline").textContent = merged.archivers?.offline || 0;

    document.getElementById("controller-total").textContent = merged.controllers?.total || 0;
    document.getElementById("controller-online").textContent = merged.controllers?.online || 0;
    document.getElementById("controller-offline").textContent = merged.controllers?.offline || 0;

    document.getElementById("server-total").textContent = merged.servers?.total || 0;
    document.getElementById("server-online").textContent = merged.servers?.online || 0;
    document.getElementById("server-offline").textContent = merged.servers?.offline || 0;

    // ✅ Fix for Desktop and DB Server
    document.getElementById("pc-total").textContent = merged.pcdetails?.total || 0;
    document.getElementById("pc-online").textContent = merged.pcdetails?.online || 0;
    document.getElementById("pc-offline").textContent = merged.pcdetails?.offline || 0;

    document.getElementById("db-total").textContent = merged.dbdetails?.total || 0;
    document.getElementById("db-online").textContent = merged.dbdetails?.online || 0;
    document.getElementById("db-offline").textContent = merged.dbdetails?.offline || 0;


    // ✅  new for Door and Reader 
    

    // //////////////////////////////////


    // ====== Door / Reader card updates (from controllers API) ======
    const extras = merged.controllerExtras || {};

    // Prefer the combined doorReader-* IDs (your summary card)
    const doorTotalEl = document.getElementById("doorReader-total");
    const doorOnlineEl = document.getElementById("doorReader-online");
    const doorOfflineEl = document.getElementById("doorReader-offline");

    // Also mirror IDs expected by graph.js / other scripts (safe to set only if they exist)
    const doorOnlineAlt = document.getElementById("door-online");
    const doorOfflineAlt = document.getElementById("door-offline");

    const readerTotalEl = document.getElementById("reader-total-inline");
    const readerOnlineEl = document.getElementById("reader-online-inline");
    const readerOfflineEl = document.getElementById("reader-offline-inline");

    // Also mirror IDs expected by graph.js
    const readerOnlineAlt = document.getElementById("reader-online");
    const readerOfflineAlt = document.getElementById("reader-offline");

    if (extras.doors) {
        if (doorTotalEl) doorTotalEl.textContent = extras.doors.total || 0;
        if (doorOnlineEl) doorOnlineEl.textContent = extras.doors.online || 0;
        if (doorOfflineEl) doorOfflineEl.textContent = extras.doors.offline || 0;

        // mirror
        if (doorOnlineAlt) doorOnlineAlt.textContent = extras.doors.online || 0;
        if (doorOfflineAlt) doorOfflineAlt.textContent = extras.doors.offline || 0;
    } else {
        if (doorTotalEl) doorTotalEl.textContent = 0;
        if (doorOnlineEl) doorOnlineEl.textContent = 0;
        if (doorOfflineEl) doorOfflineEl.textContent = 0;

        if (doorOnlineAlt) doorOnlineAlt.textContent = 0;
        if (doorOfflineAlt) doorOfflineAlt.textContent = 0;
    }

    if (extras.readers) {
        if (readerTotalEl) readerTotalEl.textContent = extras.readers.total || 0;
        if (readerOnlineEl) readerOnlineEl.textContent = extras.readers.online || 0;
        if (readerOfflineEl) readerOfflineEl.textContent = extras.readers.offline || 0;

        // mirror
        if (readerOnlineAlt) readerOnlineAlt.textContent = extras.readers.online || 0;
        if (readerOfflineAlt) readerOfflineAlt.textContent = extras.readers.offline || 0;
    } else {
        if (readerTotalEl) readerTotalEl.textContent = 0;
        if (readerOnlineEl) readerOnlineEl.textContent = 0;
        if (readerOfflineEl) readerOfflineEl.textContent = 0;

        if (readerOnlineAlt) readerOnlineAlt.textContent = 0;
        if (readerOfflineAlt) readerOfflineAlt.textContent = 0;
    }

    // ⬇️⬇️ this is call from graph.js
    // --- Immediately refresh gauges/total-chart so UI updates right away after filtering ---
    if (typeof renderGauges === "function") {
        try { renderGauges(); } catch (e) { console.warn("renderGauges failed:", e); }
    }
    if (typeof updateTotalCountChart === "function") {
        try { updateTotalCountChart(); } catch (e) { console.warn("updateTotalCountChart failed:", e); }
    }


}

            function filterDevices() {
                const selectedType = deviceFilter.value;
                const selectedStatus = document.querySelector(".status-filter.active")?.dataset.status || "all";
                const selectedCity = cityFilter.value;
                const vendorFilterLabel = document.getElementById("vendorFilterLabel");

                // toggle vendor UI
                vendorFilter.style.display = (deviceFilter.value === "cameras") ? "block" : "none";
                if (vendorFilterLabel) {
                    vendorFilterLabel.style.display = vendorFilter.style.display;
                }

                // get vendor selection (if filter exists)
                const vendorFilterElem = document.getElementById("vendorFilter");
                const selectedVendor = vendorFilterElem ? vendorFilterElem.value : "all";

                // Search bar input
                const searchTerm = document.getElementById("device-search").value.toLowerCase();

                // Show/hide vendor filter based on type
                if (vendorFilterElem) {
                    vendorFilterElem.style.display = (selectedType === "cameras") ? "block" : "none";
                }

                detailsContainer.innerHTML = "";

                const filteredDevices = allDevices.filter((device) =>
                    (selectedType === "all" || device.dataset.type === selectedType) &&
                    (selectedStatus === "all" || device.dataset.status === selectedStatus) &&
                    (selectedCity === "all" || device.dataset.city === selectedCity) &&
                    (selectedVendor === "all" || (device.dataset.vendor || "") === selectedVendor) &&
                    (
                        !searchTerm ||
                        device.innerText.toLowerCase().includes(searchTerm)
                    )
                );

                filteredDevices.forEach((deviceCard) => {
                    detailsContainer.appendChild(deviceCard);
                });

                const region = currentRegion?.toUpperCase() || "GLOBAL";
                const titleElement = document.getElementById("region-title");

                const logoHTML = `
                    <span class="region-logo">
                        <a href="http://10.199.22.57:3014/" class="tooltip">
                            <i class="fa-solid fa-house"></i>
                            <span class="tooltiptext">Dashboard Hub</span>
                        </a>
                    </span>
                    `;
                if (selectedCity !== "all") {
                    titleElement.innerHTML = `${logoHTML}<span>${region}, ${selectedCity} Summary</span>`;
                } else {
                    titleElement.innerHTML = `${logoHTML}<span>${region} Summary</span>`;
                }


                const filteredSummaryDevices = deviceObjects.filter((deviceObj, index) => {
                    const correspondingCard = allDevices[index];
                    return (
                        (selectedType === "all" || correspondingCard.dataset.type === selectedType) &&
                        (selectedStatus === "all" || correspondingCard.dataset.status === selectedStatus) &&
                        (selectedCity === "all" || correspondingCard.dataset.city === selectedCity) &&
                        (selectedVendor === "all" || (correspondingCard.dataset.vendor || "") === selectedVendor)
                    );
                });
                const offlineDevices = filteredSummaryDevices
                    .filter(d => d.status === "offline")
                    .map(d => ({
                        name: d.name || "Unknown",
                        ip: d.ip,
                        city: d.city,
                        type: d.type,
                        lastSeen: new Date().toISOString()
                    }));

                    // ⬇️⬇️ this is call from graph.js
                if (window.updateOfflineChart) {
                    window.updateOfflineChart(offlineDevices);
                }

                const summary = calculateCitySummary(filteredSummaryDevices);

                // --- NEW: compute controller door/reader counts for the current filters ---
                // We pass selectedCity and selectedStatus so door counts reflect the active filters.
                const controllerExtrasFiltered = computeFilteredControllerExtras(selectedCity, selectedStatus);
                if (!summary.summary) summary.summary = {};
                summary.summary.controllerExtras = controllerExtrasFiltered;

                updateSummary(summary);
            }
