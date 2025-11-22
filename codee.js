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
    } catch (e) {/* ignore */}
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
  const rows = [['Type','Name','IP','City','Failures','TotalDowntimeMin']];
  Object.keys(metrics).forEach(type => {
    metrics[type].forEach(pt => {
      rows.push([type, pt.name, pt.ip, pt.city, pt.x, pt.y]);
    });
  });
  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `failure-count-${(new Date()).toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`;
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
(function() {
  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      if (failureCountChart) failureCountChart.resize();
    }, 200);
  });
})();