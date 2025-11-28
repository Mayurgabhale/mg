// ---------- GLOBAL ----------
let CITY_LIST = [];   // ensure global

// Map common incoming type names -> canonical singular keys we use everywhere
const TYPE_KEY_MAP = {
  cameras: 'camera',
  camera: 'camera',
  archivers: 'archiver',
  archiver: 'archiver',
  controllers: 'controller',
  controller: 'controller',
  servers: 'server',
  server: 'server',
  // add more mappings if you have other names
};

// ---------- BUILD CITY_LIST FROM combinedDevices (normalized) ----------
function rebuildCityListFromDevices(combinedDevices = []) {
  const result = {};

  combinedDevices.forEach(d => {
    if (!d || !d.device) return;

    const city = (d.device.city || 'Unknown').toString();
    const rawType = (d.device.type || '').toString().toLowerCase();
    const type = TYPE_KEY_MAP[rawType] || rawType || 'unknown';

    if (!result[city]) {
      result[city] = {
        city: city,
        // canonical keys; keep consistent across code
        devices: { camera: 0, controller: 0, server: 0, archiver: 0 },
        offline:  { camera: 0, controller: 0, server: 0, archiver: 0 }
      };
    }

    // ensure key exists (in case you have additional types)
    if (!result[city].devices.hasOwnProperty(type)) {
      result[city].devices[type] = 0;
    }
    if (!result[city].offline.hasOwnProperty(type)) {
      result[city].offline[type] = 0;
    }

    // increment total devices for that type
    result[city].devices[type]++;

    // increment offline counter when status says offline
    if (d.device.status && d.device.status.toString().toLowerCase() === 'offline') {
      result[city].offline[type]++;
    }
  });

  CITY_LIST = Object.values(result);

  // DEBUG: quickly inspect what's built
  console.debug('rebuildCityListFromDevices -> CITY_LIST:', CITY_LIST);
}

// ---------- HELPER: call this when you have combinedDevices ----------
function renderLOCFromCombined(combinedDevices) {
  rebuildCityListFromDevices(combinedDevices);
  drawCityBarChart();
}

// ---------- Ensure computeCityRisk uses canonical keys ----------
function computeCityRisk(city) {
  if (!city || !city.offline) {
    return { label: "Low", color: "#16A34A" };
  }

  // use singular canonical names
  const cam = city.offline.camera || 0;
  const arch = city.offline.archiver || 0;
  const srv = city.offline.server || 0;
  const ctrl = city.offline.controller || 0;

  const camerasOffline = cam > 0;
  const otherOffline = (arch > 0 || srv > 0 || ctrl > 0);

  if (camerasOffline && !otherOffline) return { label: "Medium", color: "#FACC15" };
  if (camerasOffline && otherOffline) return { label: "High", color: "#DC2626" };
  if (!camerasOffline && otherOffline) return { label: "High", color: "#DC2626" };
  return { label: "Low", color: "#16A34A" };
}

// ---------- DRAW / UPDATE BAR CHART ----------
let cityChart = null;

function drawCityBarChart() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not found. Make sure Chart.js is loaded before drawing charts.');
    return;
  }

  const chartCanvas = document.getElementById("cityBarChart");
  if (!chartCanvas) {
    console.warn("Canvas #cityBarChart not found");
    return;
  }

  if (!CITY_LIST || CITY_LIST.length === 0) {
    console.warn("CITY_LIST empty. Nothing to draw.");
    // optionally clear any existing chart
    if (cityChart) { cityChart.destroy(); cityChart = null; }
    return;
  }

  const labels = CITY_LIST.map(c => c.city);

  // totals per city
  const data = CITY_LIST.map(c => {
    // ensure devices object exists
    const devs = c.devices || {};
    return Object.values(devs).reduce((s, v) => s + (Number(v) || 0), 0);
  });

  const hasAnyNonZero = data.some(v => v > 0);
  if (!hasAnyNonZero) {
    console.warn('All totals are zero — check rebuildCityListFromDevices type mapping and combinedDevices contents.');
    // you can still draw empty chart, but user might think it's not working
  }

  const riskInfo = CITY_LIST.map(c => computeCityRisk(c));
  const colors = riskInfo.map(r => r.color);
  const riskLabels = riskInfo.map(r => r.label);

  if (cityChart) cityChart.destroy();

  cityChart = new Chart(chartCanvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Total Devices",
        data: data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false,
          external: function (context) {
            const tooltipModel = context.tooltip;
            let tooltipEl = document.getElementById('chartjs-tooltip');
            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-tooltip';
              tooltipEl.className = 'chartjs-tooltip';
              document.body.appendChild(tooltipEl);
            }
            if (!tooltipModel || tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0;
              return;
            }
            const index = tooltipModel.dataPoints[0].dataIndex;
            const c = CITY_LIST[index] || {};
            const total = Object.values(c.devices || {}).reduce((a, b) => a + (b || 0), 0);
            const risk = riskLabels[index] || 'Low';
            const html = `
              <div style="font-weight:bold">${c.city || 'Unknown'}</div>
              <div>Total Devices: ${total}</div>
              <div>Risk Level: ${risk}</div>
              <div>Offline Camera: ${c.offline?.camera || 0}</div>
              <div>Offline Controller: ${c.offline?.controller || 0}</div>
              <div>Offline Server: ${c.offline?.server || 0}</div>
              <div>Offline Archiver: ${c.offline?.archiver || 0}</div>
            `;
            tooltipEl.innerHTML = html;
            const canvasRect = context.chart.canvas.getBoundingClientRect();
            tooltipEl.style.left = canvasRect.left + window.pageXOffset + tooltipModel.caretX + 'px';
            tooltipEl.style.top = canvasRect.top + window.pageYOffset + tooltipModel.caretY - 40 + 'px';
            tooltipEl.style.opacity = 1;
          }
        }
      },
      scales: {
        y: { beginAtZero: true },
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
            callback: function (value, index) {
              return (riskLabels[index] === "Medium" || riskLabels[index] === "High")
                ? labels[index]
                : "";
            },
            color: function (ctx) {
              const idx = ctx.index;
              const risk = riskLabels[idx];
              return (risk === "Medium" || risk === "High") ? "red" : "#666";
            }
          }
        }
      }
    }
  });

  createCityLegend && createCityLegend();
}