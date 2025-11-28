// ---------------- START: robust Offline City BAR chart ----------------
let offlineCityBarChart = null;

/**
 * Get colors: prefer the file-level getChartColors() if present,
 * otherwise fall back to safe defaults.
 */
function getBarColors() {
  if (typeof getChartColors === 'function') {
    const c = getChartColors();
    return {
      bar: c.camera || c.bar || '#d32f2f',
      text: c.text || '#e6eef7',
      grid: c.grid || 'rgba(0,0,0,0.08)'
    };
  }
  const isDark = document.body.classList.contains("dark-mode");
  return {
    bar: isDark ? "#ff5252" : "#d32f2f",
    text: isDark ? "#ffffff" : "#333333",
    grid: isDark ? "#444" : "#ddd"
  };
}

/**
 * Build labels & values from combinedDevices (counts only offline devices).
 * Returns { labels: [], values: [] }.
 */
function buildOfflineCityBarData(combinedDevices = []) {
  const cityCounts = {};

  if (!Array.isArray(combinedDevices)) {
    console.warn('buildOfflineCityBarData: combinedDevices is not an array');
    return { labels: [], values: [] };
  }

  combinedDevices.forEach(d => {
    if (!d || !d.device) return;
    if ((d.device.status || '').toString().toLowerCase() !== 'offline') return;

    const city = (d.device.city || 'Unknown').toString();
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  });

  // Sort by count descending so chart is useful (optional but recommended)
  const entries = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);

  const labels = entries.map(e => e[0]);
  const values = entries.map(e => e[1]);

  return { labels, values };
}

/**
 * Initialize bar chart (creates a placeholder chart even if no data yet).
 * Safe to call multiple times.
 */
function initOfflineCityBarChart() {
  // Chart.js must be loaded
  if (typeof Chart === 'undefined') {
    console.warn('initOfflineCityBarChart: Chart.js not loaded. Include Chart.js before graph.js.');
    return;
  }

  const canvas = document.getElementById("OfflineCityBarChart");
  if (!canvas) {
    console.warn('initOfflineCityBarChart: #OfflineCityBarChart canvas not found in DOM yet.');
    return;
  }

  // If already initialized, don't recreate
  if (offlineCityBarChart) return;

  const ctx = canvas.getContext("2d");
  const colors = getBarColors();

  offlineCityBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ['No Data'],
      datasets: [{
        label: "Offline Devices",
        data: [0],
        backgroundColor: ['#8a8a8a'], // placeholder grey
        borderRadius: 8,
        barThickness: 35
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: colors.text } }
      },
      scales: {
        x: {
          ticks: { color: colors.text, maxRotation: 30, minRotation: 30 },
          grid: { color: colors.grid }
        },
        y: {
          beginAtZero: true,
          ticks: { color: colors.text },
          grid: { color: colors.grid }
        }
      }
    }
  });

  console.debug('initOfflineCityBarChart: chart created (placeholder).');
}

/**
 * Update the bar chart with real data.
 * If chart is not initialized yet, try to initialize it.
 */
function updateOfflineCityBarChart(combinedDevices) {
  // Create chart if not present yet
  if (!offlineCityBarChart) {
    initOfflineCityBarChart();
    // If still not present, abort
    if (!offlineCityBarChart) {
      console.warn('updateOfflineCityBarChart: chart not initialized (canvas missing or Chart.js not loaded).');
      return;
    }
  }

  const colors = getBarColors();
  const { labels, values } = buildOfflineCityBarData(combinedDevices);

  if (!labels || labels.length === 0) {
    // No data → show placeholder
    offlineCityBarChart.data.labels = ['No Offline Devices'];
    offlineCityBarChart.data.datasets[0].data = [0];
    offlineCityBarChart.data.datasets[0].backgroundColor = ['#8a8a8a'];
    offlineCityBarChart.update();
    console.debug('updateOfflineCityBarChart: no offline devices found.');
    return;
  }

  // Set bars (color per bar could be changed to a palette if desired)
  offlineCityBarChart.data.labels = labels;
  offlineCityBarChart.data.datasets[0].data = values;
  offlineCityBarChart.data.datasets[0].backgroundColor = labels.map(() => colors.bar);

  offlineCityBarChart.update();
  console.debug('updateOfflineCityBarChart: updated with', labels.length, 'cities.');
}

/**
 * initializeChartSystem: ensure bar init is called in the same place you init scatter chart.
 * Replace your previous initializeChartSystem with this final version if needed.
 * (You already added initOfflineCityBarChart there — keep it.)
 */
function ensureBarInitOnDomReady() {
  // Call this from the same DOMContentLoaded area you already use.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initOfflineCityBarChart();
    });
  } else {
    initOfflineCityBarChart();
  }
}

// Call the ensure function just in case (harmless if already initialized)
ensureBarInitOnDomReady();

// ---------------- END: robust Offline City BAR chart ----------------