
<div class="gcard wide">
  <h4 class="gcard-title">Failure Count</h4>

  <div class="chart-placeholder" style="height:260px;">
    <!-- Chart.js canvas will be injected here by JS -->
  </div>
</div>


// ========== Failure Count Chart ==========
let failureCountChart = null;

/** Find Failure Count chart container safely (no conflict) */
function findFailureChartPlaceholder(titleText) {
  const cards = document.querySelectorAll('.gcard');
  for (const card of cards) {
    const title = card.querySelector('.gcard-title');
    if (title && title.textContent.trim().toLowerCase() === titleText.toLowerCase()) {
      return card.querySelector('.chart-placeholder');
    }
  }
  return null;
}

/** Normalize device types */
function normalizeDeviceType(cat) {
  if (!cat) return 'Other';
  const c = cat.toLowerCase();
  if (c.includes('camera') || c.includes('cctv')) return 'CCTV';
  if (c.includes('controller') || c.includes('acs')) return 'ACS';
  if (c.includes('archiver') || c.includes('nvr') || c.includes('dvr')) return 'NVR/DVR';
  if (c.includes('server') && !c.includes('db')) return 'SERVER';
  if (c.includes('desktop') || c.includes('pc')) return 'Desktop';
  if (c.includes('db')) return 'DB Server';
  return cat;
}

/** Collect metrics from device table */
function collectFailureMetricsFromTable() {

  const table = document.querySelector('#device-table');
  if (!table) {
    console.warn("❌ #device-table not found");
    return {};
  }

  const rows = Array.from(table.querySelectorAll('tbody tr'));

  const metrics = {};
  const histMap = window.deviceHistoryData || {};

  console.log("✅ Rows found:", rows.length);
  console.log("✅ History entries:", Object.keys(histMap).length);

  rows.forEach(row => {

    const ip = (row.cells[1]?.textContent || '').trim();
    const name = (row.cells[2]?.textContent || '').trim();
    let category = (row.cells[3]?.dataset.category || row.cells[3]?.textContent || '').trim();
    const city = (row.cells[4]?.textContent || '').trim();

    if (!ip) return;

    // Failure Count detection (flexible)
    let failureCount = 0;
    const safeId = ip.replace(/[^a-zA-Z0-9]/g, '_');
    const downEl = row.querySelector(`#downtime-count-${safeId}`);

    if (downEl) {
      failureCount = parseInt(downEl.textContent || '0', 10) || 0;
    } else {
      failureCount = parseInt(row.cells[6]?.textContent || '0', 10) || 0;
    }

    // Calculate downtime minutes from history
    const history = histMap[ip] || [];
    let totalDownSec = 0;

    for (let i = 0; i < history.length; i++) {
      if (history[i].status === 'Offline') {
        const downTime = new Date(history[i].timestamp).getTime();

        const nextUp = history.slice(i + 1).find(ev =>
          ev.status === 'Online' && 
          new Date(ev.timestamp).getTime() > downTime
        );

        const upTime = nextUp 
          ? new Date(nextUp.timestamp).getTime()
          : Date.now();

        totalDownSec += (upTime - downTime) / 1000;
      }
    }

    const totalDownMin = Math.round(totalDownSec / 60);

    const type = normalizeDeviceType(category);

    if (!metrics[type]) metrics[type] = [];

    metrics[type].push({
      x: failureCount,
      y: totalDownMin,
      ip,
      name,
      city
    });

  });

  return metrics;
}

/** Main render function */
function renderFailureCountChart() {

  const placeholder = findFailureChartPlaceholder('Failure Count');

  if (!placeholder) {
    console.warn("❌ Failure Count card not found");
    return;
  }

  placeholder.style.height = '260px';

  let canvas = placeholder.querySelector('canvas');

  if (!canvas) {
    canvas = document.createElement('canvas');
    placeholder.innerHTML = '';
    placeholder.appendChild(canvas);
  }

  const metrics = collectFailureMetricsFromTable();

  if (!metrics || Object.keys(metrics).length === 0) {
    console.warn("⚠️ No failure data found");
    return;
  }

  const COLORS = {
    CCTV: '#10b981',
    ACS: '#f97316',
    'NVR/DVR': '#2563eb',
    SERVER: '#7c3aed',
    Desktop: '#06b6d4',
    'DB Server': '#ef4444',
    Other: '#94a3b8'
  };

  const datasets = Object.entries(metrics).map(([type, points]) => ({
    label: type,
    data: points.map(p => ({ x: p.x, y: p.y, meta: p })),
    backgroundColor: COLORS[type] || COLORS.Other,
    pointRadius: 7,
    pointHoverRadius: 10,
    showLine: false
  }));

  if (failureCountChart) {
    failureCountChart.destroy();
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
            title: items => items[0].dataset.label,
            label: ctx => {
              const d = ctx.raw.meta;
              return [
                `Device: ${d.name}`,
                `IP: ${d.ip}`,
                `City: ${d.city}`,
                `Failures: ${d.x}`,
                `Downtime (min): ${d.y}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: { display: true, text: 'Failure Count' },
          ticks: { stepSize: 1 }
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Downtime (minutes)' }
        }
      }
    }
  });

  console.log("✅ Failure Count chart rendered successfully");
}

/** Auto render after load */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(renderFailureCountChart, 2000);
});

/** Auto refresh every 10 seconds */
setInterval(() => {
  renderFailureCountChart();
}, 10000);