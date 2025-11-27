// ====== Globals ======
let cityChart = null;
let CITY_LIST = []; // global canonical city list used by LOC Count
// ====== Helpers: normalization ======
function normalizeTypeKey(type) {
  if (!type) return '';
  const t = type.toString().trim().toLowerCase();
  // map many variants to canonical keys used everywhere below
  if (t === 'cameras' || t === 'camera') return 'camera';
  if (t === 'archivers' || t === 'archiver') return 'archiver';
  if (t === 'controllers' || t === 'controller') return 'controller';
  if (t === 'servers' || t === 'server' || t === 'ccure') return 'server';
  if (t === 'doors' || t === 'door' || t === 'doorreader' || t === 'door_reader') return 'door';
  if (t === 'readers' || t === 'reader') return 'reader';
  if (t === 'pc' || t === 'desktop') return 'pc';
  if (t === 'db' || t === 'db server' || t === 'db_server') return 'db';
  return t; // fallback: use raw lower-case token
}

function normalizeCityName(city) {
  if (!city) return 'Unknown';
  return city.toString().trim();
}

// ====== Build CITY_LIST from combinedDevices ======
function buildCityListFromCombined(combinedDevices) {
  const map = {};

  (combinedDevices || []).forEach(item => {
    const dev = item.device || item; // accept both shapes
    const rawCity = dev.city || 'Unknown';
    const city = normalizeCityName(rawCity);
    const rawType = dev.type || dev.deviceType || '';
    const type = normalizeTypeKey(rawType);
    const status = (dev.status || '').toString().toLowerCase();

    if (!map[city]) {
      map[city] = {
        city: city,
        devices: {}, // total devices by normalized type
        offline: { camera: 0, archiver: 0, controller: 0, server: 0, door: 0, reader: 0, pc: 0, db: 0 }
      };
    }

    // increment total devices count for that type
    if (type) {
      map[city].devices[type] = (map[city].devices[type] || 0) + 1;
    }

    // if device is offline, increment offline[type] (only for known keys)
    if (status === 'offline' && type) {
      if (!(type in map[city].offline)) map[city].offline[type] = 0;
      map[city].offline[type] = (map[city].offline[type] || 0) + 1;
    }
  });

  // convert to array and optionally sort by city name
  CITY_LIST = Object.values(map);
  CITY_LIST.sort((a, b) => a.city.localeCompare(b.city));
}

// ====== Compute risk level per city ======
function computeCityRiskLevel(city) {
  if (!city || !city.offline) return { label: "Low", color: "#16A34A" };

  const cam = city.offline.camera || 0;
  const arch = city.offline.archiver || 0;
  const srv = city.offline.server || 0;
  const ctrl = city.offline.controller || 0;

  const othersOffline = (arch > 0 || srv > 0 || ctrl > 0);

  // Only cameras offline -> MEDIUM
  if (cam > 0 && !othersOffline) return { label: "Medium", color: "#FACC15" };

  // Camera + any other offline -> HIGH
  if (cam > 0 && othersOffline) return { label: "High", color: "#DC2626" };

  // Everything else -> LOW
  return { label: "Low", color: "#16A34A" };
}

// ====== Legend creation (top-right inside Loc-Count-chart) ======
function createCityLegend(containerId = "cityBarLegend") {
  const holder = document.getElementById("Loc-Count-chart");
  if (!holder) return;

  holder.style.position = holder.style.position || "relative"; // ensure relative for absolute legend

  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    holder.appendChild(container);
  }

  container.style.position = "absolute";
  container.style.top = "6px";
  container.style.right = "10px";
  container.style.fontSize = "12px";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "6px";
  container.style.padding = "6px 10px";
  container.style.borderRadius = "6px";
  container.style.boxShadow = "0px 2px 6px rgba(0,0,0,0.15)";
  container.style.background = "rgba(0,0,0,0.35)"; // subtle bg for readability

  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;"><span style="width:12px;height:12px;background:#16A34A;border-radius:3px;"></span> Low</div>
    <div style="display:flex;align-items:center;gap:8px;"><span style="width:12px;height:12px;background:#FACC15;border-radius:3px;"></span> Medium</div>
    <div style="display:flex;align-items:center;gap:8px;"><span style="width:12px;height:12px;background:#DC2626;border-radius:3px;"></span> High</div>
  `;
}

// ====== Draw / update City bar chart ======
function drawCityBarChart() {
  const chartCanvas = document.getElementById("cityBarChart");
  if (!chartCanvas) {
    console.warn("Canvas #cityBarChart not found");
    return;
  }

  if (!CITY_LIST || CITY_LIST.length === 0) {
    console.warn("CITY_LIST empty. Chart not drawn.");
    const lg = document.getElementById("cityBarLegend");
    if (lg) lg.remove();
    if (cityChart) { cityChart.destroy(); cityChart = null; }
    return;
  }

  const labels = CITY_LIST.map(c => c.city);
  const data = CITY_LIST.map(c => {
    if (!c.devices) return 0;
    return Object.values(c.devices).reduce((a, b) => a + b, 0);
  });

  const riskInfo = CITY_LIST.map(c => computeCityRiskLevel(c));
  const colors = riskInfo.map(r => r.color);
  const riskLabels = riskInfo.map(r => r.label);

  // destroy previous chart to avoid duplication
  if (cityChart) cityChart.destroy();

  // build chart
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
        borderRadius: 6,
        barPercentage: 0.8,
        categoryPercentage: 0.9
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false, // we use external tooltip
          external: function (context) {
            let tooltipEl = document.getElementById('chartjs-tooltip');
            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-tooltip';
              tooltipEl.className = 'chartjs-tooltip';
              tooltipEl.style.position = 'absolute';
              tooltipEl.style.pointerEvents = 'none';
              tooltipEl.style.background = 'rgba(0,0,0,0.7)';
              tooltipEl.style.color = '#fff';
              tooltipEl.style.padding = '8px';
              tooltipEl.style.borderRadius = '6px';
              tooltipEl.style.fontSize = '12px';
              document.body.appendChild(tooltipEl);
            }

            const tooltipModel = context.tooltip;
            if (!tooltipModel || tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0;
              return;
            }

            const dataIndex = tooltipModel.dataPoints && tooltipModel.dataPoints.length ? tooltipModel.dataPoints[0].dataIndex : null;
            if (dataIndex === null) {
              tooltipEl.style.opacity = 0;
              return;
            }

            const c = CITY_LIST[dataIndex] || {};
            const total = c.devices ? Object.values(c.devices).reduce((a,b)=>a+b,0) : 0;
            const camOff = (c.offline && c.offline.camera) || 0;
            const ctrlOff = (c.offline && c.offline.controller) || 0;
            const srvOff = (c.offline && c.offline.server) || 0;
            const archOff = (c.offline && c.offline.archiver) || 0;
            const risk = riskLabels[dataIndex] || 'Low';

            let innerHtml = `<div style="font-weight:bold;margin-bottom:6px;">${labels[dataIndex]}</div>`;
            innerHtml += `<div style="margin-bottom:4px;">Total Devices: <strong>${total}</strong></div>`;
            innerHtml += `<div style="margin-bottom:6px;">Risk Level: <strong>${risk}</strong></div>`;
            innerHtml += `<div>Offline Camera: ${camOff}</div>`;
            innerHtml += `<div>Offline Controller: ${ctrlOff}</div>`;
            innerHtml += `<div>Offline Server: ${srvOff}</div>`;
            innerHtml += `<div>Offline Archiver: ${archOff}</div>`;

            tooltipEl.innerHTML = innerHtml;
            tooltipEl.style.opacity = 1;

            const canvas = context.chart.canvas;
            const canvasRect = canvas.getBoundingClientRect();
            const left = canvasRect.left + window.pageXOffset + tooltipModel.caretX;
            const top = canvasRect.top + window.pageYOffset + tooltipModel.caretY;

            tooltipEl.style.left = `${left + 8}px`;
            tooltipEl.style.top = `${top - 40}px`;
          }
        }
      },
      scales: {
        y: { beginAtZero: true },
        x: {
          ticks: {
            display: true,
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
            callback: function (value, index) {
              const risk = (CITY_LIST[index] && computeCityRiskLevel(CITY_LIST[index]).label) || 'Low';
              // show city label only for Medium/High (as per original intent) or always show — change as desired
              if (risk === "Medium" || risk === "High") return this.getLabelForValue(index);
              return "";
            },
            color: function (context) {
              const idx = context.index;
              const risk = (CITY_LIST[idx] && computeCityRiskLevel(CITY_LIST[idx]).label) || 'Low';
              return (risk === "Medium" || risk === "High") ? "red" : "#666";
            }
          },
          grid: { display: true }
        }
      }
    }
  });

  // add top-right legend inside holder
  createCityLegend("cityBarLegend");
  console.log("✅ City bar chart updated");
}

// ====== Render entrypoint for combinedDevices ======
function renderOfflineChartFromCombined(combinedDevices) {
  // 1) build normalized CITY_LIST
  buildCityListFromCombined(combinedDevices);

  // 2) draw the bar chart (LOC Count)
  drawCityBarChart();

  // (optional) If you also have a scatter/offline chart that needs the same normalization
  // call updateOfflineChart(...) here (ensure updateOfflineChart expects normalized keys).
}

// ====== Example usage ======
// When your combined data arrives, call:
// renderOfflineChartFromCombined(combinedDevices);

// If you already have combined data in a global, run once:
// renderOfflineChartFromCombined(window.COMBINED_DEVICES || []);