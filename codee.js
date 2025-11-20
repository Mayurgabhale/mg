i also show count 

in right side show doughnut
cameras - 21
Archivers - 21 
Controllers - 71 
like all ok 
and in pie chart center totla ok 

  // Create doughnut
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
      cutout: '55%', // donut thickness
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            padding: 12,
            boxWidth: 10
          }
        },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              const label = ctx.label || '';
              const value = ctx.parsed || 0;
              return label + ': ' + value;
            }
          }
        }
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
    { id: 'server-total', label: 'CCURE' },     // your CCURE value lives in server-total id
    { id: 'doorReader-total', label: 'Door' },
    { id: 'reader-total-inline', label: 'Reader' },
    { id: 'pc-total', label: 'Desktop' },
    { id: 'db-total', label: 'DB Server' }
  ];

  const labels = [];
  const values = [];

  keys.forEach(k => {
    const el = document.getElementById(k.id);
    const v = el ? parseInt(el.textContent || '0', 10) : 0;
    if (v && v > 0) {                // only include device types with count > 0
      labels.push(k.label);
      values.push(v);
    }
  });

  // If nothing > 0, include a single 'No devices' slice to keep chart valid
  if (values.length === 0) {
    return { labels: ['No devices'], values: [1] };
  }
  return { labels, values };
}

/**
 * Render or update the Total Count doughnut.
 */
function renderTotalCountChart() {
  // require Chart to be loaded
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded — add https://cdn.jsdelivr.net/npm/chart.js');
    return;
  }

  const placeholder = findChartPlaceholderByTitle('Total Count');
  if (!placeholder) return;

  // create canvas if not present
  let canvas = placeholder.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    placeholder.innerHTML = ''; // clear placeholder contents
    placeholder.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');

  const data = collectTotalCounts();

  // destroy previous chart if exists to avoid leaks
  if (_totalCountChart) {
    try { _totalCountChart.destroy(); } catch (e) {}
    _totalCountChart = null;
  }

  // color palette (adjust as you like)

  const palette = [
    '#10b981', '#f97316', '#2563eb', '#7c3aed',
    '#06b6d4', '#ef4444', '#f59e0b', '#94a3b8'
  ];


  // Create doughnut
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
      cutout: '55%', // donut thickness
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            padding: 12,
            boxWidth: 10
          }
        },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              const label = ctx.label || '';
              const value = ctx.parsed || 0;
              return label + ': ' + value;
            }
          }
        }
      }
    }
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
    
    '#10b981','#f97316','#2563eb','#7c3aed','#06b6d4','#ef4444','#f59e0b','#94a3b8'
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

