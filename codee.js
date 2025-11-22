read the below all code careflly and chekc why our failur count chart is not dislply ok 
    read below code and alos above that uploeded priviuse time ok 
        chekc boht and why faillu count chart is not displ ok 
            carefully.... 
                
<div class="bottom-row">

              <!-- <div class="gcard wide gcard-pie">
                <h4 class="gcard-title">Total Count </h4>
                <div class="chart-placeholder"></div>
              </div> -->
              <!-- <div class="gcard wide">
                <h4 class="gcard-title">LOC Count</h4>
                <div class="chart-placeholder"></div>
              </div> -->
              <div class="gcard wide" style="height:300px;">
                <h4 class="gcard-title">LOC Count</h4>
                <canvas id="cityBarChart"></canvas>
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


// ☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️
// ☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️

// ---------- Failure Count Chart (add to graph.js) ----------
let failureCountChart = null;

/**
 * Build metrics for failure chart using device table + deviceHistoryData.
 * Returns { type -> [{x: failureCount, y: totalDowntimeMin, ip, name, city}] }
 */
function collectFailureMetricsFromTable() {
  const rows = Array.from(document.querySelectorAll('#device-table tbody tr'))
    .filter(r => r.cells && r.cells.length > 0);

  const metrics = {};
  const histMap = window.deviceHistoryData || {};

  rows.forEach(r => {
    // safe cell indexes (these match your table structure used elsewhere)
    const ip = (r.cells[1]?.textContent || '').trim();
    const name = (r.cells[2]?.textContent || '').trim();
    let category = (r.cells[3]?.textContent || '').trim();
    // older code sometimes stores data-category attr - prefer that
    try {
      const dataCat = r.cells[3]?.getAttribute?.('data-category');
      if (dataCat) category = dataCat;
    } catch (e) {/* ignore */ }
    const city = (r.cells[4]?.textContent || '').trim();

    if (!ip) return;

    // downtime count cell placement differs across files, try several fallbacks:
    let downCount = 0;
    const possibleIds = [
      `downtime-count-${(ip || '').replace(/[^a-zA-Z0-9]/g, '_')}`, // common id pattern
    ];
    // find in DOM row first, else fallback to numeric cell content (cell 6 typical)
    const found = rowQuerySelectorSafe(r, `#${possibleIds[0]}`);
    if (found) downCount = parseInt(found.textContent || '0') || 0;
    else downCount = parseInt(r.cells[6]?.textContent || r.cells[7]?.textContent || '0') || 0;

    // compute total downtime seconds from raw history (pair offline->online)
    const rawHist = histMap[ip] || [];
    const sigHist = typeof filterHistoryForDisplay === 'function'
      ? filterHistoryForDisplay(rawHist, (category || '').toUpperCase())
      : rawHist;

    let totalDownSec = 0;
    for (let i = 0; i < sigHist.length; i++) {
      const ev = sigHist[i];
      if (ev.status === 'Offline') {
        // find the next Online with later timestamp
        const nextUp = sigHist.slice(i + 1).find(x => x.status === 'Online' && new Date(x.timestamp).getTime() > new Date(ev.timestamp).getTime());
        if (nextUp) {
          totalDownSec += (new Date(nextUp.timestamp).getTime() - new Date(ev.timestamp).getTime()) / 1000;
        } else {
          // still down: count until now
          totalDownSec += (Date.now() - new Date(ev.timestamp).getTime()) / 1000;
        }
      }
    }

    const totalDownMin = Math.round(totalDownSec / 60);

    // Normalize device type to friendly group for legend
    const typeKey = normalizeDeviceType(category);

    if (!metrics[typeKey]) metrics[typeKey] = [];
    metrics[typeKey].push({
      x: downCount,
      y: totalDownMin,
      ip,
      name,
      city
    });
  });

  return metrics;
}

function rowQuerySelectorSafe(row, selector) {
  try { return row.querySelector(selector); } catch (e) { return null; }
}

function normalizeDeviceType(cat) {
  if (!cat) return 'Other';
  const c = cat.toLowerCase();
  if (c.includes('camera') || c.includes('cctv')) return 'CCTV';
  if (c.includes('controller') || c.includes('acs')) return 'ACS';
  if (c.includes('archiver') || c.includes('nvr') || c.includes('dvr')) return 'NVR/DVR';
  if (c.includes('server') && !c.includes('db')) return 'SERVER';
  if (c.includes('desktop') || c.includes('pc')) return 'Desktop';
  if (c.includes('db') || c.includes('db server')) return 'DB Server';
  return cat;
}

const FAILURE_COLORS = {
  'CCTV': '#10b981',
  'ACS': '#f97316',
  'NVR/DVR': '#2563eb',
  'SERVER': '#7c3aed',
  'Desktop': '#06b6d4',
  'DB Server': '#ef4444',
  'Other': '#94a3b8'
};


function findChartPlaceholderByTitle(titleText) {
  // Find the card whose title matches the text
  const cards = document.querySelectorAll('.gcard');
  for (const card of cards) {
    const title = card.querySelector('.gcard-title');
    if (title && title.textContent.trim().toLowerCase() === titleText.toLowerCase()) {
      return card.querySelector('.chart-placeholder');
    }
  }
  return null;
}

function createFailureChartInPlaceholder() {
  const placeholder = findChartPlaceholderByTitle('Failure Count');
  if (!placeholder) return;

  // Ensure a canvas exists
  let canvas = placeholder.querySelector('canvas');
  if (!canvas) {
    placeholder.innerHTML = ''; // clear placeholder contents
    canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '220px';
    placeholder.appendChild(canvas);
  }

  // add a simple header controls row with Download button (if not present)
  if (!placeholder.querySelector('.chart-controls')) {
    const controls = document.createElement('div');
    controls.className = 'chart-controls';
    controls.style.cssText = 'display:flex;justify-content:flex-end;margin-bottom:8px;';
    const btn = document.createElement('button');
    btn.className = 'btn-download';
    btn.textContent = 'Download Data';
    btn.style.cssText = 'background:#10b981;color:#fff;border-radius:6px;padding:6px 10px;border:0;cursor:pointer;font-weight:600;';
    btn.addEventListener('click', () => exportFailureCSV());
    controls.appendChild(btn);
    placeholder.prepend(controls);
  }

  const metrics = collectFailureMetricsFromTable();
  const datasets = Object.keys(metrics).map(type => ({
    label: type,
    data: metrics[type].map(pt => ({ x: pt.x, y: pt.y, meta: pt })),
    backgroundColor: FAILURE_COLORS[type] || FAILURE_COLORS['Other'],
    pointRadius: 7,
    pointHoverRadius: 10,
    showLine: false
  }));

  // If chart already exists destroy
  if (failureCountChart) {
    failureCountChart.destroy();
    failureCountChart = null;
  }

  const ctx = canvas.getContext('2d');
  failureCountChart = new Chart(ctx, {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            title: (items) => {
              const ds = items[0];
              return `${ds.dataset.label}`;
            },
            label: (ctx) => {
              const d = ctx.raw.meta;
              return [
                `Name: ${d.name}`,
                `IP: ${d.ip}`,
                `City: ${d.city}`,
                `Failures: ${d.x}`,
                `Total downtime (min): ${d.y}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Failure Count (occurrences)' },
          ticks: { stepSize: 1, beginAtZero: true }
        },
        y: {
          title: { display: true, text: 'Total Downtime (minutes)' },
          beginAtZero: true
        }
      }
    }
  });
}

/** Export all points as CSV */
function exportFailureCSV() {
  const metrics = collectFailureMetricsFromTable();
  const rows = [['Type', 'Name', 'IP', 'City', 'Failures', 'TotalDowntimeMin']];
  Object.keys(metrics).forEach(type => {
    metrics[type].forEach(pt => {
      rows.push([type, pt.name, pt.ip, pt.city, pt.x, pt.y]);
    });
  });
  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `failure-count-${(new Date()).toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Public: call this to render/update the failure chart */
function renderFailureCountChart() {
  createFailureChartInPlaceholder();
  console.log('✅ Failure Count chart rendered');
}

// helper: re-render on window resize (debounced)
(function () {
  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      if (failureCountChart) failureCountChart.resize();
    }, 200);
  });
})();
