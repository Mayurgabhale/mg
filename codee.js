

// ⬇️⬇️⬇️⬇️⬇️⬇️----- LOC Count Bar Chart -----
i want loc bar chart wiht dynamic. 
   lie our pie chart fetching the data.
   that type fet the ciyt i mean lcaont and ddiplsy the data in bar chart ok 

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

// --- LOC Count: Grouped bar chart (Chart.js) ----------------------

let locChart = null;

// Sample data: replace this array with your real data source (API / DOM)
const locData = [
  { city: 'DEL', Cameras: 12, ACS: 3, 'NVR/DVR': 4, Server: 2 },
  { city: 'CCU', Cameras: 8,  ACS: 4, 'NVR/DVR': 6, Server: 1 },
  { city: 'HYD', Cameras: 18, ACS: 7, 'NVR/DVR': 10, Server: 3 },
  { city: 'PUNE',Cameras: 5,  ACS: 2, 'NVR/DVR': 3, Server: 1 },
  { city: 'KOL', Cameras: 10, ACS: 5, 'NVR/DVR': 7, Server: 2 }
];

// color palette (adapt to your theme variables if needed)
const deviceColors = {
  Cameras: '#10b981',   // green
  ACS: '#f59e0b',       // amber
  'NVR/DVR': '#2563eb', // blue
  Server: '#ef4444'     // red
};

/**
 * Find the placeholder element (re-uses your helper)
 * returns the .chart-placeholder or null
 */
function findLocPlaceholder() {
  return findChartPlaceholderByTitle('LOC Count');
}

/**
 * Build chart datasets from locData for the selected device types
 */
function buildDatasets(data, deviceKeys) {
  return deviceKeys.map(key => ({
    label: key,
    data: data.map(d => d[key] || 0),
    backgroundColor: deviceColors[key] || '#94a3b8',
    borderRadius: 4,
    barThickness: 18
  }));
}

/**
 * Render the LOC bar chart (all cities)
 */
function renderLocChart(showCities = null) {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded');
    return;
  }

  const placeholder = findLocPlaceholder();
  if (!placeholder) return;

  // create canvas if needed
  let canvas = placeholder.querySelector('canvas');
  if (!canvas) {
    placeholder.innerHTML = '';
    canvas = document.createElement('canvas');
    placeholder.appendChild(canvas);
  }

  // filter cities if showCities is provided (array or single string)
  let dataToUse = locData.slice(); // copy
  if (showCities) {
    const set = new Set(Array.isArray(showCities) ? showCities : [showCities]);
    dataToUse = locData.filter(d => set.has(d.city));
  }

  const cities = dataToUse.map(d => d.city);

  // device keys (order matters)
  const deviceKeys = ['Cameras', 'ACS', 'NVR/DVR', 'Server'];

  // if chart exists, destroy it and recreate cleanly
  if (locChart) {
    locChart.destroy();
    locChart = null;
  }

  const ctx = canvas.getContext('2d');

  locChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: cities,
      datasets: buildDatasets(dataToUse, deviceKeys)
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true } },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}`
          }
        }
      },
      scales: {
        x: {
          stacked: false,
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
          grid: {
            color: getComputedStyle(document.body).getPropertyValue('--graph-grid') || 'rgba(255,255,255,0.04)'
          }
        }
      }
    }
  });
}

/**
 * Update locData (when new data arrives) and refresh chart
 * newData must be an array of {city, Cameras, ACS, 'NVR/DVR', Server}
 */
function updateLocData(newData) {
  // naive replace — adapt to merge behavior if you need
  // Example: merge on city key
  const map = new Map();
  newData.forEach(d => map.set(String(d.city).toUpperCase(), Object.assign({}, d)));
  // keep existing cities that are not in newData
  locData.forEach(d => {
    const key = String(d.city).toUpperCase();
    if (!map.has(key)) map.set(key, d);
  });

  // Rebuild locData array
  const updated = Array.from(map.values());
  // sort by city for consistent ordering
  updated.sort((a, b) => a.city.localeCompare(b.city));
  // replace contents
  locData.length = 0;
  updated.forEach(x => locData.push(x));

  // Re-render chart
  renderLocChart();
}

/**
 * Populate the #city-filter select with cities (optional)
 * The page already has a #city-filter; this will add cities and an "All Cities" option.
 */
function populateCityFilter() {
  const sel = document.getElementById('city-filter');
  if (!sel) return;
  // clear except keep first option (All Cities) if present
  sel.innerHTML = '<option value="all">All Cities</option>';
  locData.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.city;
    opt.textContent = d.city;
    sel.appendChild(opt);
  });

  sel.addEventListener('change', () => {
    const v = sel.value;
    if (!v || v === 'all') {
      renderLocChart();
    } else {
      renderLocChart(v);
    }
  });
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // initial render
  renderLocChart();
  populateCityFilter();

  // OPTIONAL: call updateLocData(...) whenever you fetch new data
  // Example to simulate an update in 6s:
  // setTimeout(() => {
  //   updateLocData([
  //     { city: 'DEL', Cameras: 14, ACS: 4, 'NVR/DVR': 6, Server: 2 },
  //     { city: 'NEW', Cameras: 3, ACS: 1, 'NVR/DVR': 0, Server: 0 }
  //   ]);
  // }, 6000);
});
