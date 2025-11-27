<!-- City-wise Offline Bar Chart -->
<div class="totacl-gcard wide gcard-bar city-bar-card">
  <h4 class="gcard-title">Offline Devices (City-wise)</h4>
  <div class="chart-container" style="height:260px;min-height:220px;">
    <canvas id="CityBarChart"></canvas>
  </div>
</div>




....
// ====== CITY BAR CHART ======
let cityBarChart = null;

/**
 * Build city stats from the existing offlineChart datasets and cityIndexMap.
 * Expected: offlineChart.data.datasets[].data[] points with {x, y, count}
 * and global cityIndexMap mapping cityName -> numeric index used on scatter.
 */
function buildCityStatsFromScatter() {
  const stats = {}; // city -> { cameras:0, archivers:0, controllers:0, ccure:0, total:0 }

  if (!offlineChart || !cityIndexMap) return stats;

  // reverse map for quick lookup: index -> cityName
  const indexToCity = {};
  Object.keys(cityIndexMap).forEach(city => {
    indexToCity[cityIndexMap[city]] = city;
  });

  // normalize dataset labels to keys we use
  const labelToKey = {
    'Camera': 'cameras',
    'Archiver': 'archivers',
    'Controller': 'controllers',
    'CCURE': 'ccure'
  };

  offlineChart.data.datasets.forEach(ds => {
    const key = labelToKey[ds.label] || ds.label.toLowerCase();
    (ds.data || []).forEach(pt => {
      const cityName = indexToCity[pt.x] || ('City-' + pt.x);
      if (!stats[cityName]) {
        stats[cityName] = { cameras:0, archivers:0, controllers:0, ccure:0, total:0 };
      }
      const c = Number(pt.count || 0);
      // accumulate into proper key (fallback to total if unknown)
      if (key in stats[cityName]) {
        stats[cityName][key] += c;
      } else {
        stats[cityName].total += c; // fallback
      }
      stats[cityName].total += c;
    });
  });

  return stats;
}

/**
 * Determine risk for a city according to rules:
 * - If total == 0 => 'None'
 * - If any archivers/controllers/ccure offline => 'High'
 * - Else if camera count > 0 => 'Medium'
 * - Else => 'None'
 */
function determineRisk(cityStat) {
  const { cameras, archivers, controllers, ccure } = cityStat;
  const totalNonCamera = (archivers || 0) + (controllers || 0) + (ccure || 0);
  if ((cityStat.total || 0) === 0) return 'None';
  if (totalNonCamera > 0) return 'High';
  if ((cameras || 0) > 0) return 'Medium';
  return 'None';
}

function drawCityBarChart() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded — add https://cdn.jsdelivr.net/npm/chart.js');
    return;
  }

  // Build stats from scatter data (keeps in sync)
  const stats = buildCityStatsFromScatter();
  const rows = [];

  Object.keys(stats).forEach(city => {
    const s = stats[city];
    const risk = determineRisk(s);
    // only include Medium or High
    if (risk === 'Medium' || risk === 'High') {
      rows.push({
        city,
        total: s.total || 0,
        cameras: s.cameras || 0,
        archivers: s.archivers || 0,
        controllers: s.controllers || 0,
        ccure: s.ccure || 0,
        risk
      });
    }
  });

  // nothing to show -> destroy chart and exit
  if (rows.length === 0) {
    if (cityBarChart) {
      cityBarChart.destroy();
      cityBarChart = null;
    }
    return;
  }

  // sort by total desc (optional)
  rows.sort((a,b) => b.total - a.total);

  const labels = rows.map(r => r.city);
  const dataTotals = rows.map(r => r.total);
  const barColors = rows.map(r => r.risk === 'High' ? '#ef4444' /*red*/ : '#f97316' /*orange*/);

  const ctx = document.getElementById('CityBarChart').getContext('2d');

  if (cityBarChart) {
    cityBarChart.data.labels = labels;
    cityBarChart.data.datasets[0].data = dataTotals;
    cityBarChart.data.datasets[0].backgroundColor = barColors;
    cityBarChart.update();
    return;
  }

  cityBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Offline Devices',
        data: dataTotals,
        backgroundColor: barColors,
        borderRadius: 6,
        maxBarThickness: 60
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: getComputedStyle(document.body).getPropertyValue('--graph-card-title-dark') || '#ddd' },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: { color: getComputedStyle(document.body).getPropertyValue('--graph-card-title-dark') || '#ddd' },
          grid: { color: 'rgba(255,255,255,0.06)' }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          // multi-line tooltip generation
          callbacks: {
            title: (ctx) => {
              // title is the city
              return ctx[0] ? ctx[0].label : '';
            },
            label: (ctx) => {
              // Use label lines array in afterLabel instead - return total line here
              const idx = ctx.dataIndex;
              const row = rows[idx];
              return `Total Device: ${row.total}`;
            },
            afterLabel: (ctx) => {
              const idx = ctx.dataIndex;
              const row = rows[idx];

              // Build lines for each device type with red indicator for offline counts
              const lines = [];

              // Risk line
              lines.push(`Risk Level: ${row.risk}`);

              // Offline counts with a red dot indicator (🔴) before the number to emphasize "offline in red"
              lines.push(`Offline Cameras: ${row.cameras > 0 ? '🔴 ' + row.cameras : row.cameras}`);
              lines.push(`Offline Archivers: ${row.archivers > 0 ? '🔴 ' + row.archivers : row.archivers}`);
              lines.push(`Offline Controllers: ${row.controllers > 0 ? '🔴 ' + row.controllers : row.controllers}`);
              lines.push(`Offline CCURE: ${row.ccure > 0 ? '🔴 ' + row.ccure : row.ccure}`);

              // Combined types summary (e.g. "Cameras + Controllers, CCURE, Archivers")
              const types = [];
              if (row.cameras) types.push('Cameras');
              if (row.controllers) types.push('Controllers');
              if (row.ccure) types.push('CCURE');
              if (row.archivers) types.push('Archivers');
              if (types.length > 0) {
                lines.push(`Types: ${types.join(' + ')}`);
              }

              return lines;
            }
          },
          // small styling tweaks
          bodyFont: { weight: '500' },
          titleFont: { weight: '700' }
        }
      }
    }
  });
}

// Hook into theme changes (so colors/ticks stay readable)
function updateCityBarTheme() {
  if (!cityBarChart) return;
  cityBarChart.options.scales.x.ticks.color = getChartColors().text;
  cityBarChart.options.scales.y.ticks.color = getChartColors().text;
  cityBarChart.update();
}

// Call updateCityBarTheme on theme changes
// re-use existing observer or ensure to call updateCityBarTheme whenever theme toggles