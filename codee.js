<!-- Failure Count Chart Card -->
<div class="gcard wide" id="failure-chart-card">
  <h4 class="gcard-title">Failure Count</h4>

  <div id="failure-chart-container" style="height:300px; width:100%;">
    <canvas id="failureChartCanvas"></canvas>
  </div>
</div>

<!-- Example device table (your real table will be produced by summary.js / trend.js).
     Make sure your real table has the same column order:
     0: Sr, 1: IP, 2: Name, 3: Category, 4: City, 5: Uptime, 6: downtime-count, 7: downtime-time, ...
-->
<table id="networkDeviceTable" style="display:none;">
  <thead>
    <tr><th>#</th><th>IP</th><th>Name</th><th>Category</th><th>City</th><th>Uptime</th><th>DowntimeCount</th></tr>
  </thead>
  <tbody>
    <!-- populated by summary.js / trend.js in your app -->
  </tbody>
</table>



....
<!-- Chart.js CDN (if you don't already include it) -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
/* Robust Failure Count chart module
   - automatically finds your device table
   - exposes renderFailureChart() and renderFailureCountChart()
   - observes table body changes and re-renders
*/

(function () {
  // single chart instance
  let failureChartInstance = null;
  let tableObserver = null;
  const canvasId = 'failureChartCanvas';

  // Look for device table by several possible ids (fallback to first table)
  function findDeviceTable() {
    const ids = ['device-table', 'networkDeviceTable', 'networkDeviceTable', 'deviceTable'];
    for (const id of ids) {
      const t = document.getElementById(id);
      if (t && t.querySelector && t.querySelector('tbody')) {
        console.log('✅ Found device table by id:', id);
        return t;
      }
    }
    // fallback to first table with tbody
    const firstTable = document.querySelector('table tbody') ? document.querySelector('table') : null;
    if (firstTable) {
      console.log('⚠️ Found fallback table (first <table>)');
      return firstTable;
    }
    console.warn('❌ No device table found by id or fallback');
    return null;
  }

  // Normalize device type string to short group
  function normalizeType(type) {
    if (!type) return 'Other';
    const c = type.toString().toLowerCase();
    if (c.includes('camera') || c.includes('cctv')) return 'CCTV';
    if (c.includes('controller') || c.includes('acs')) return 'ACS';
    if (c.includes('archiver') || c.includes('nvr') || c.includes('dvr')) return 'NVR/DVR';
    if (c.includes('server') && !c.includes('db')) return 'SERVER';
    if (c.includes('desktop') || c.includes('pc')) return 'Desktop';
    if (c.includes('db')) return 'DB Server';
    return 'Other';
  }

  // Read rows and build grouped dataset
  function collectFailureData() {
    const table = findDeviceTable();
    if (!table) return {};

    const tbody = table.querySelector('tbody');
    if (!tbody) return {};

    const rows = Array.from(tbody.querySelectorAll('tr')).filter(r => r.cells && r.cells.length > 0);
    console.log('collectFailureData → rows:', rows.length);

    const groups = {}; // { type: [ {x,y,ip,name,city} ] }

    rows.forEach(row => {
      const cells = row.cells;

      // Defensive column discovery:
      // prefer ids like downtime-count-<safeip> if present, else fallback to columns (6 or 7)
      let ip = (cells[1]?.innerText || '').trim();
      let name = (cells[2]?.innerText || '').trim();
      let rawType = (cells[3]?.getAttribute('data-category') || cells[3]?.innerText || '').trim();
      let city = (cells[4]?.innerText || '').trim();

      // If your markup uses <span id="downtime-count-..."> find it
      let safe = ip ? ip.replace(/[^a-zA-Z0-9]/g, '_') : null;
      let downCount = 0;
      if (safe) {
        const inline = document.getElementById(`downtime-count-${safe}`);
        if (inline && inline.innerText) {
          downCount = parseInt(inline.innerText.trim()) || 0;
        }
      }
      if (!downCount) {
        // fallback: try column 6 or 7 (0-based)
        downCount = parseInt((cells[6]?.innerText || cells[7]?.innerText || '0').trim()) || 0;
      }

      // If row is hidden/placeholder or missing ip -> skip
      if (!ip) return;

      const type = normalizeType(rawType);
      const downtimeMinutes = Math.max(0, downCount * 5); // simple estimate; replace with real calc if history available

      if (!groups[type]) groups[type] = [];
      groups[type].push({
        x: downCount,
        y: downtimeMinutes,
        ip, name, city
      });
    });

    return groups;
  }

  function buildDatasets(groups) {
    const COLORS = {
      CCTV: "#22c55e",
      ACS: "#f97316",
      "NVR/DVR": "#3b82f6",
      SERVER: "#9333ea",
      Desktop: "#0ea5e9",
      "DB Server": "#ef4444",
      Other: "#6b7280"
    };

    return Object.keys(groups).map(type => ({
      label: type,
      data: groups[type],
      backgroundColor: COLORS[type] || COLORS.Other,
      pointRadius: 7
    }));
  }

  // Create or update Chart
  function renderFailureChart() {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.error('❌ failure chart canvas not found:', canvasId);
      return;
    }

    if (typeof Chart === 'undefined') {
      console.error('❌ Chart.js is not loaded. Add Chart.js before this script.');
      return;
    }

    const groups = collectFailureData();
    if (Object.keys(groups).length === 0) {
      console.warn('⚠️ No failure data to render (groups empty). Chart will not render.');
      // optionally destroy existing chart to avoid stale visuals:
      if (failureChartInstance) {
        failureChartInstance.destroy();
        failureChartInstance = null;
      }
      return;
    }

    const ctx = canvas.getContext('2d');
    const datasets = buildDatasets(groups);

    if (failureChartInstance) {
      failureChartInstance.destroy();
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
              label: function (ctx) {
                const m = ctx.raw;
                return [
                  `Name: ${m.name || '-'}`,
                  `IP: ${m.ip || '-'}`,
                  `City: ${m.city || '-'}`,
                  `Failures: ${m.x}`,
                  `Downtime(min): ${m.y}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Failure Count (occurrences)' },
            beginAtZero: true,
            ticks: { stepSize: 1 }
          },
          y: {
            title: { display: true, text: 'Total Downtime (minutes)' },
            beginAtZero: true
          }
        }
      }
    });

    console.log('✅ Failure Chart rendered. groups:', Object.keys(groups));
  }

  // Alias to keep older callers working
  window.renderFailureChart = renderFailureChart;
  window.renderFailureCountChart = renderFailureChart; // IMPORTANT: fixes ReferenceError

  // Re-render when table tbody changes (so when populateDeviceTable updates rows)
  function observeTableChanges() {
    const table = findDeviceTable();
    if (!table) return;

    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    // disconnect previous observer
    if (tableObserver) tableObserver.disconnect();

    tableObserver = new MutationObserver((mutations) => {
      // small debounce
      clearTimeout(tableObserver._t);
      tableObserver._t = setTimeout(() => {
        console.log('🔁 Table mutation detected — re-render failure chart');
        renderFailureChart();
      }, 150);
    });

    tableObserver.observe(tbody, { childList: true, subtree: true, characterData: true });
    console.log('👀 Observing device table changes to auto-refresh chart');
  }

  // try to start observer when DOM ready; also try again later if table appears later
  function start() {
    // If Chart is not available yet, wait a bit
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not found yet — will retry in 300ms');
      setTimeout(start, 300);
      return;
    }

    // Setup observer and initial render
    observeTableChanges();
    renderFailureChart();

    // Periodic refresh (in case changes happen without DOM mutations)
    setInterval(renderFailureChart, 10000);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Wait a short time to allow summary.js / trend.js to populate the table if they run on DOMContentLoaded too.
    setTimeout(() => {
      start();
    }, 600);
  });

  // also expose a manual refresh
  window.refreshFailureChart = renderFailureChart;

})();
</script>