
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="path/to/graph.js"></script>
<script src="path/to/summary.js"></script>
<script src="path/to/trend.js"></script>




<!-- Chart.js CDN (must be before your graph.js) -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<!-- Failure Count Chart Card -->
<div class="gcard wide" id="failure-chart-card">
  <h4 class="gcard-title">Failure Count</h4>
  <div id="failure-chart-container" style="height:300px; width:100%;">
    <canvas id="failureChartCanvas"></canvas>
  </div>
</div>

<!-- Example device table (your real table will be produced by summary.js / trend.js).
     Ensure the table ID matches what JS expects. We'll support both IDs in graph.js. -->
<table id="device-table" style="display:none;">
  <thead>
    <tr>
      <th>#</th>
      <th>IP</th>
      <th>Name</th>
      <th>Category</th>
      <th>City</th>
      <th>Uptime</th>
      <th>DowntimeCount</th>
      <th>DowntimeTime</th>
      <th>Actions</th>
      <th>Remark</th>
    </tr>
  </thead>
  <tbody>
    <!-- populated by summary.js / trend.js -->
  </tbody>
</table>

<!-- (If you had networkDeviceTable earlier and other parts depend on it, keep it too) -->
<table id="networkDeviceTable" style="display:none;"></table>

<!-- SCRIPT ORDER (Important):
     1) Chart.js
     2) graph.js (below)
     3) summary.js and trend.js (these populate the table and call renderFailureChart)
-->








....
// graph.js (failure chart portion) - drop into your graph.js or include as separate file
// Assumes Chart.js is already loaded (include CDN before this script)

// Global chart instance
let failureChartInstance = null;

/**
 * Try to find the device table. Support multiple possible IDs (device-table, networkDeviceTable).
 * Returns HTMLTableElement or null.
 */
function findDeviceTable() {
  let table = document.getElementById('device-table')
            || document.getElementById('networkDeviceTable')
            || document.querySelector('#device-table')
            || document.querySelector('#networkDeviceTable')
            || document.querySelector('table'); // fallback to first table

  if (!table) {
    console.error('❌ findDeviceTable: No table found in DOM');
    return null;
  }
  return table;
}

/**
 * Normalize category text to friendly type for legend/colouring.
 */
function normalizeType(type) {
  if (!type) return 'Other';
  const t = ('' + type).toLowerCase();
  if (t.includes('camera') || t.includes('cctv')) return 'CCTV';
  if (t.includes('acs') || t.includes('controller')) return 'ACS';
  if (t.includes('nvr') || t.includes('dvr') || t.includes('archiver')) return 'NVR/DVR';
  if (t.includes('desktop') || t.includes('pc')) return 'Desktop';
  if (t.includes('server') && !t.includes('db')) return 'SERVER';
  if (t.includes('db')) return 'DB Server';
  return type;
}

/**
 * Build dataset from device table rows.
 * Expects columns roughly: 0 idx, 1 IP, 2 Name, 3 Category, 4 City, 6 DowntimeCount
 * If your table structure differs, update the index mappings below.
 */
function collectFailureData() {
  const table = findDeviceTable();
  if (!table) return {};

  const tbody = table.tBodies[0];
  if (!tbody) {
    console.warn('⚠️ collectFailureData: table has no tbody');
    return {};
  }

  const rows = Array.from(tbody.querySelectorAll('tr')).filter(r => r.cells && r.cells.length > 0);
  if (!rows.length) {
    console.warn('⚠️ collectFailureData: no rows found in device table');
    return {};
  }

  const dataByType = {};

  rows.forEach(row => {
    // protect against malformed rows
    const cells = row.cells;
    // prefer known indexes; fallback to text searching if not present
    const ip = (cells[1]?.textContent || '').trim();
    const name = (cells[2]?.textContent || '').trim();
    // category cell might use data-category attribute in some files (trend.js uses data-category)
    let rawCategory = '';
    try {
      rawCategory = (cells[3]?.getAttribute && cells[3].getAttribute('data-category')) || (cells[3]?.textContent || '');
    } catch (e) {
      rawCategory = (cells[3]?.textContent || '');
    }
    const city = (cells[4]?.textContent || '').trim();

    // Downtime count often in cell index 6 (per your code). Try several fallbacks.
    let failureCount = 0;
    const maybeIds = [
      `downtime-count-${(ip || '').replace(/[^a-zA-Z0-9]/g, '_')}`
    ];
    const foundEl = maybeIds.map(id => document.getElementById(id)).find(Boolean);
    if (foundEl) {
      failureCount = parseInt(foundEl.textContent || '0', 10) || 0;
    } else {
      // try cell positions
      const tryVals = [
        cells[6]?.textContent,
        cells[7]?.textContent,
        cells[5]?.textContent
      ];
      for (const v of tryVals) {
        if (v != null && v.toString().trim() !== '') {
          const n = parseInt(v.toString().trim(), 10);
          if (!isNaN(n)) { failureCount = n; break; }
        }
      }
    }

    const deviceType = normalizeType(rawCategory || 'Other');

    // If there is no meaningful IP or name skip
    if (!ip && !name) return;

    // Simple downtime minutes estimate if you don't have full history:  failureCount * 5
    const downtimeMinutes = failureCount * 5;

    if (!dataByType[deviceType]) dataByType[deviceType] = [];

    dataByType[deviceType].push({
      x: failureCount,
      y: downtimeMinutes,
      ip,
      name,
      city
    });
  });

  return dataByType;
}

/**
 * Ensure canvas present and return its 2d context.
 */
function ensureCanvasContext(canvasId = 'failureChartCanvas') {
  let canvas = document.getElementById(canvasId);
  if (!canvas) {
    // create fallback canvas inside #failure-chart-container if present
    const container = document.getElementById('failure-chart-container');
    if (container) {
      container.innerHTML = ''; // clear
      canvas = document.createElement('canvas');
      canvas.id = canvasId;
      container.appendChild(canvas);
    } else {
      console.error(`❌ ensureCanvasContext: no canvas with id "${canvasId}" and no failure-chart-container found`);
      return null;
    }
  }
  const ctx = canvas.getContext && canvas.getContext('2d');
  if (!ctx) {
    console.error('❌ ensureCanvasContext: canvas.getContext not available');
    return null;
  }
  return ctx;
}

/**
 * Public function: renderFailureChart
 * Called by trend.js / summary.js once table is populated.
 */
function renderFailureChart() {
  if (typeof Chart === 'undefined') {
    console.error('❌ renderFailureChart: Chart.js not loaded. Include Chart.js before graph.js');
    return;
  }

  const ctx = ensureCanvasContext('failureChartCanvas');
  if (!ctx) return;

  const dataByType = collectFailureData();
  if (!dataByType || Object.keys(dataByType).length === 0) {
    console.warn('⚠️ renderFailureChart: no data to render');
    // destroy existing chart if present (so blank canvas)
    if (failureChartInstance) {
      failureChartInstance.destroy();
      failureChartInstance = null;
    }
    return;
  }

  const COLORS = {
    CCTV: '#22c55e', ACS: '#f97316', 'NVR/DVR': '#3b82f6',
    SERVER: '#9333ea', Desktop: '#0ea5e9', 'DB Server': '#ef4444', Other: '#6b7280'
  };

  const datasets = Object.keys(dataByType).map(type => ({
    label: type,
    data: dataByType[type].map(p => ({ x: p.x, y: p.y, meta: p })),
    backgroundColor: COLORS[type] || COLORS.Other,
    pointRadius: 7
  }));

  // destroy previous
  if (failureChartInstance) {
    try { failureChartInstance.destroy(); } catch (e) { /* ignore */ }
    failureChartInstance = null;
  }

  failureChartInstance = new Chart(ctx, {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            title: items => items[0]?.dataset?.label || '',
            label: ctx => {
              const p = ctx.raw.meta || ctx.raw;
              return [
                `Name: ${p.name || '-'}`,
                `IP: ${p.ip || '-'}`,
                `City: ${p.city || '-'}`,
                `Failures: ${p.x}`,
                `Downtime(min): ${p.y}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Failure Count' },
          beginAtZero: true,
          ticks: { stepSize: 1 }
        },
        y: {
          title: { display: true, text: 'Downtime (minutes)' },
          beginAtZero: true
        }
      }
    }
  });

  console.log('✅ renderFailureChart: success (datasets: ' + Object.keys(dataByType).length + ')');
}

// Expose alias (if any older code calls a different name)
function renderFailureCountChart() { return renderFailureChart(); }

// Optional: auto-refresh (disabled by default). If you want periodic re-render, uncomment below.
// setInterval(renderFailureChart, 10000);

// Ensure chart redraw on resize
window.addEventListener('resize', () => {
  if (failureChartInstance) try { failureChartInstance.resize(); } catch (e) {}
});