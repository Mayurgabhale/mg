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