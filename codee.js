read below graph.js file all code carefully. and check why bar graph not disply 

C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\graph.js

function updateGauge(id, activeId, inactiveId, totalId) {
  const active = parseInt(document.getElementById(activeId).textContent) || 0;
  const inactive = parseInt(document.getElementById(inactiveId).textContent) || 0;
  const total = active + inactive;

  // element
  const gauge = document.getElementById(id);
  if (!gauge) return;

  // % calculation
  let percentage = total === 0 ? 0 : Math.round((active / total) * 100);

  // set values
  gauge.style.setProperty("--percentage", percentage);

  // update text inside semicircle
  gauge.querySelector(".total").textContent = total;
  gauge.querySelector(".active").textContent = active;
  gauge.querySelector(".inactive").textContent = inactive;

  // card footer also updates
  document.getElementById(totalId).textContent = total;
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
  const cards = document.querySelectorAll('.gcard.wide');
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
    { id: 'doorReader-total', label: 'Door' },
    { id: 'reader-total-inline', label: 'Reader' },
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
    afterDraw(chart) {
      const { ctx, chartArea } = chart;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Total label
      ctx.font = '14px Inter, Arial';
      // ctx.fillStyle = '#aaa';
      // Total label
      ctx.fillStyle = getComputedStyle(document.body)
        .getPropertyValue('--graph-card-footer-dark');

      ctx.fillText('TOTAL', centerX, centerY - 12);

      // Total value
      ctx.font = 'bold 20px Inter, Arial';
      // ctx.fillStyle = '#fff';
      // Total value
      ctx.fillStyle = getComputedStyle(document.body)
        .getPropertyValue('--graph-card-title-dark');
      ctx.fillText(totalValue, centerX, centerY + 12);

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
      cutout: '65%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            padding: 12,

            // 🔥 THIS adds count next to label
            generateLabels: function (chart) {
              const dataset = chart.data.datasets[0];
              const labels = chart.data.labels;
              const bgColors = dataset.backgroundColor;

              return labels.map((label, i) => {
                return {
                  text: `${label} - ${dataset.data[i]}`,
                  fillStyle: bgColors[i],
                  strokeStyle: bgColors[i],
                  hidden: false,
                  index: i
                };
              });
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
    }, 200);
  });
});

// Call updateTotalCountChart() whenever your data changes.
// We'll call it inside renderGauges() so it updates after gauges refresh.
function renderGauges() {
  updateGauge("gauge-cameras", "camera-online", "camera-offline", "camera-total");
  updateGauge("gauge-archivers", "archiver-online", "archiver-offline", "archiver-total");
  updateGauge("gauge-controllers", "controller-online", "controller-offline", "controller-total");
  updateGauge("gauge-ccure", "server-online", "server-offline", "server-total");

  // update Total Count pie
  updateTotalCountChart();
}










// ⬇️⬇️⬇️⬇️⬇️⬇️----- LOC Count Bar Chart -----

// =============================================
// LOC COUNT BAR CHART (AUTO HANDLES CITY_LIST)
// =============================================

let _locCountChart = null;

/** Collect data from CITY_LIST */
function collectLocCounts() {
  if (!Array.isArray(window.CITY_LIST) || window.CITY_LIST.length === 0) {
    return { labels: [], values: [] };
  }

  const sorted = window.CITY_LIST
    .map(c => ({
      city: c.city || "Unknown",
      total: Number(c.total) || 0
    }))
    .filter(x => x.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  return {
    labels: sorted.map(x => x.city),
    values: sorted.map(x => x.total)
  };
}

/** Render chart */
function renderLocCountChart() {
  if (typeof Chart === "undefined") {
    console.warn("Chart.js not loaded");
    return;
  }

  const placeholder = findChartPlaceholderByTitle("LOC Count");
  if (!placeholder) return;

  let canvas = placeholder.querySelector("canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    placeholder.innerHTML = "";
    placeholder.appendChild(canvas);
  }

  placeholder.style.height = "300px";

  const ctx = canvas.getContext("2d");
  const data = collectLocCounts();

  if (_locCountChart) {
    _locCountChart.destroy();
  }

  _locCountChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [{
        label: "Devices",
        data: data.values,
        backgroundColor: "#10b981",
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#9ca3af", maxRotation: 45 }
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(255,255,255,0.05)" },
          ticks: { color: "#9ca3af" }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(ctx) {
              return `${ctx.label} : ${ctx.parsed.y}`;
            }
          }
        }
      }
    }
  });
}

/** Update chart manually if needed */
function updateLocCountChart() {
  if (!_locCountChart) {
    renderLocCountChart();
    return;
  }

  const data = collectLocCounts();
  _locCountChart.data.labels = data.labels;
  _locCountChart.data.datasets[0].data = data.values;
  _locCountChart.update();
}

/** Auto wait for CITY_LIST (no map.js changes needed) */
function waitForCityList() {
  let attempts = 0;

  const timer = setInterval(() => {
    attempts++;

    if (Array.isArray(window.CITY_LIST) && window.CITY_LIST.length > 0) {
      console.log("CITY_LIST ready → Updating LOC Chart");
      updateLocCountChart();
      clearInterval(timer);
    }

    if (attempts > 50) {
      console.warn("CITY_LIST not found after timeout.");
      clearInterval(timer);
    }
  }, 300);
}

// ===== Initialize LOC chart =====
document.addEventListener("DOMContentLoaded", () => {
  renderLocCountChart();   // Draw empty chart first
  waitForCityList();       // Fill when data arrives

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderLocCountChart();
      waitForCityList();
    }, 200);
  });
});

------------
  C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\index.html
 <div class="bottom-row">

              <!-- <div class="gcard wide gcard-pie">
                <h4 class="gcard-title">Total Count </h4>
                <div class="chart-placeholder"></div>
              </div> -->
              <div class="gcard wide">
                <h4 class="gcard-title">LOC Count</h4>
                <div class="chart-placeholder"></div>
              </div>

              <div class="gcard wide">
                <h4 class="gcard-title">Failure Count</h4>
                <div class="chart-placeholder"></div>
              </div>

              

               <div class="gcard wide gcard-pie">
                <h4 class="gcard-title">Total Count </h4>
                <div class="chart-placeholder"></div>
              </div>

            </div>

    <!-- Sidebar -->
    <aside id="sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-title"><i class="fas fa-sliders-h"></i> </h2>
        <div class="header-controls">
          <button class="theme-toggle" id="themeToggle">
            <i class="fas fa-moon"></i>
          </button>
        </div>
        <button class="close-sidebar" id="closeSidebar">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <button class="nav-button" id="toggle-main-btn"><i class="fas fa-window-maximize"></i>Device Details</button>

      <div class="region-buttons">
        <button class="region-button" data-region="global"><i class="fas fa-globe"></i> Global</button>
        <button class="region-button" data-region="apac"><i class="fas fa-map-marker-alt"></i> APAC</button>
        <button class="region-button" data-region="emea"><i class="fas fa-map-marker-alt"></i> EMEA</button>
        <button class="region-button" data-region="laca"><i class="fas fa-map-marker-alt"></i> LACA</button>
        <button class="region-button" data-region="namer"><i class="fas fa-map-marker-alt"></i> NAMER</button>
      </div>

      <button class="nav-button" onclick="location.href='trend.html'"><i class="fas fa-chart-line"></i> View Trend
        Analysis</button>
      <button class="nav-button" onclick="location.href='summary.html'"><i class="fas fa-table"></i> View Devices
        Summary</button>
      <button class="nav-button" onclick="location.href='controllers.html'"><i class="fas fa-table"></i> View Devices
        Door</button>

      <div id="countdown" class="countdown-timer">Loading Timer...</div>

      <div class="filter-buttons">
        <button id="filter-all" class="status-filter active" data-status="all"><i class="fas fa-layer-group"></i> All
          Devices</button>
        <button id="filter-online" class="status-filter" data-status="online"><i class="fas fa-wifi"></i> Online
          Devices</button>
        <button id="filter-offline" class="status-filter" data-status="offline"><i class="fas fa-plug-circle-xmark"></i>
          Offline Devices</button>
      </div>

      <label for="device-filter">Filter by Device Type:</label>
      <select id="device-filter">
        <option value="all">All</option>
        <option value="cameras">Cameras</option>
        <option value="archivers">Archivers</option>
        <option value="controllers">Controllers</option>
        <option value="servers">CCURE</option>
        <option value="pcdetails">Desktop Details</option>
        <option value="dbdetails">DB Server</option>
      </select>

      <label for="vendorFilter" id="vendorFilterLabel">Filter by Camera:</label>
      <select id="vendorFilter">
        <option value="all">All camera</option>
      </select>

      <label for="city-filter">Filter by Location:</label>
      <select id="city-filter">
        <option value="all">All Cities</option>
      </select>
    </aside>
