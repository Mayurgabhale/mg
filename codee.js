  ctx.fillText('TOTAL', centerX, centerY - 22);
i say this TOTAL is not diplsy, read the belwoo all code carefully and chekc why this tola is not disply ..
  

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

      ctx.fillText('TOTAL', centerX, centerY - 22);

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
      cutout: '45%',
      radius: '90%',  // ✅ shrink only circle size
      plugins: {
        legend: {
          position: 'right',

          // labels: {
          //   usePointStyle: true,
          //   padding: 12,

          //   // 🔥 THIS adds count next to label
          //   generateLabels: function (chart) {
          //     const dataset = chart.data.datasets[0];
          //     const labels = chart.data.labels;
          //     const bgColors = dataset.backgroundColor;

          //     return labels.map((label, i) => {
          //       return {
          //         text: `${label} - ${dataset.data[i]}`,
          //         fillStyle: bgColors[i],
          //         strokeStyle: bgColors[i],
          //         hidden: false,
          //         index: i
          //       };
          //     });
          //   }
          // }

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
  updateTotalCountChart();
  updateGauge("gauge-cameras", "camera-online", "camera-offline", "camera-total");
  updateGauge("gauge-archivers", "archiver-online", "archiver-offline", "archiver-total");
  updateGauge("gauge-controllers", "controller-online", "controller-offline", "controller-total");
  updateGauge("gauge-ccure", "server-online", "server-offline", "server-total");

  // update Total Count pie
}
