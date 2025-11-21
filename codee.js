// ----- LOC Count Bar Chart -----
let _locCountChart = null;

function collectLocCounts(options = { topN: 12 }) {
  // Use global CITY_LIST created by updateMapData()
  if (!Array.isArray(window.CITY_LIST)) return { labels: [], values: [] };

  // Build array: { city, total } (total computed if missing)
  const arr = window.CITY_LIST
    .map(c => {
      const total = Number.isFinite(Number(c.total)) ? Number(c.total) :
                    (c.devices ? Object.values(c.devices).reduce((a,b)=>a+b,0) : 0);
      return { city: c.city || 'Unknown', total: total || 0 };
    })
    .filter(x => x.total > 0);

  // sort by total desc
  arr.sort((a, b) => b.total - a.total);

  const top = arr.slice(0, options.topN || 12);

  const labels = top.map(x => x.city);
  const values = top.map(x => x.total);
  return { labels, values };
}

function renderLocCountChart() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded — add https://cdn.jsdelivr.net/npm/chart.js');
    return;
  }

  const placeholder = findChartPlaceholderByTitle('LOC Count');
  if (!placeholder) return;

  // ensure a canvas exists
  let canvas = placeholder.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    placeholder.innerHTML = ''; // clear placeholder
    placeholder.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  const data = collectLocCounts({ topN: 12 });

  // Destroy previous chart to avoid leaks
  if (_locCountChart) {
    try { _locCountChart.destroy(); } catch (e) {}
    _locCountChart = null;
  }

  // color palette
  const palette = [
    '#10b981', '#f97316', '#2563eb', '#7c3aed',
    '#06b6d4', '#ef4444', '#f59e0b', '#94a3b8',
    '#60a5fa', '#34d399', '#f43f5e', '#f59e0b'
  ];

  // plugin to draw value labels on top of bars
  const valueLabelPlugin = {
    id: 'valueLabels',
    afterDatasetsDraw(chart) {
      const ctx = chart.ctx;
      chart.data.datasets.forEach((dataset, dsIndex) => {
        const meta = chart.getDatasetMeta(dsIndex);
        meta.data.forEach((bar, i) => {
          const val = dataset.data[i];
          if (val === undefined) return;
          const x = bar.x;
          const y = bar.y;
          ctx.save();
          ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--graph-card-footer-dark') || '#cbd5e1';
          ctx.font = '12px Inter, Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          // place label above bar
          ctx.fillText(val, x, y - 6);
          ctx.restore();
        });
      });
    }
  };

  _locCountChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Devices',
        data: data.values,
        backgroundColor: palette.slice(0, data.values.length),
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.85
      }]
    },
    options: {
      indexAxis: 'x', // vertical bars (use 'y' for horizontal)
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            color: getComputedStyle(document.body).getPropertyValue('--graph-map-text-dark') || '#b8f4c9',
            maxRotation: 45,
            minRotation: 0
          },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: { color: getComputedStyle(document.body).getPropertyValue('--graph-map-text-dark') || '#b8f4c9' },
          grid: {
            color: 'rgba(255,255,255,0.03)'
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              return `${ctx.label} : ${ctx.parsed.y ?? ctx.parsed || 0}`;
            }
          }
        }
      }
    },
    plugins: [valueLabelPlugin]
  });
}

function updateLocCountChart() {
  if (!_locCountChart) {
    renderLocCountChart();
    return;
  }
  const data = collectLocCounts({ topN: 12 });
  _locCountChart.data.labels = data.labels;
  _locCountChart.data.datasets[0].data = data.values;
  _locCountChart.data.datasets[0].backgroundColor = [
    '#10b981','#f97316','#2563eb','#7c3aed','#06b6d4','#ef4444','#f59e0b','#94a3b8'
  ].slice(0, data.values.length);
  _locCountChart.update();
}

// Hook: initial render and resize/refresh
document.addEventListener('DOMContentLoaded', () => {
  renderLocCountChart();
  let resizeTO;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTO);
    resizeTO = setTimeout(() => renderLocCountChart(), 250);
  });
});



....
..
updateLocCountChart();
updateTotalCountChart(); // also keep your total doughnut up-to-date



...
/* ensure chart-placeholder has flexible height across breakpoints */
.chart-placeholder {
  min-height: 220px;
  height: 100%;
  width: 100%;
}

/* smaller screens */
@media (max-width: 768px) {
  .chart-placeholder { min-height: 190px; }
}
@media (max-width: 480px) {
  .chart-placeholder { min-height: 160px; }
}