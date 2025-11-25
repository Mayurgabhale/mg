/* ================================
   CITY RISK SCORING (3 LEVELS)
   ================================ */

function computeCityRiskScore(city) {
  // weights: camera=1, archiver=2, server=3, controller=4
  if (!city || !city.offline) return 0;

  const cam  = city.offline.camera || 0;
  const arch = city.offline.archiver || 0;
  const srv  = city.offline.server || 0;
  const ctrl = city.offline.controller || 0;

  return (cam * 1) + (arch * 2) + (srv * 3) + (ctrl * 4);
}

function mapScoreToRisk(score) {
  // ONLY 3 LEVELS: Low, Medium, High
  if (score <= 2) {
    return { label: "Low", color: "#16A34A" };     // Green
  }
  if (score <= 6) {
    return { label: "Medium", color: "#FACC15" };  // Yellow
  }
  return { label: "High", color: "#DC2626" };      // Red
}

/* ================================
   LEGEND (ONLY 3 LEVELS)
   ================================ */

function createCityLegend(containerId = "cityBarLegend") {
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    const holder = document.getElementById("Loc-Count-chart");
    if (holder) holder.appendChild(container);
  }

  container.style.marginTop = "10px";
  container.style.fontSize = "12px";
  container.style.display = "flex";
  container.style.gap = "16px";

  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:6px">
      <span style="width:14px;height:14px;background:#16A34A;border-radius:3px;display:inline-block"></span> Low
    </div>
    <div style="display:flex;align-items:center;gap:6px">
      <span style="width:14px;height:14px;background:#FACC15;border-radius:3px;display:inline-block"></span> Medium
    </div>
    <div style="display:flex;align-items:center;gap:6px">
      <span style="width:14px;height:14px;background:#DC2626;border-radius:3px;display:inline-block"></span> High
    </div>
  `;
}

/* ================================
   CITY BAR CHART (RISK COLORED)
   ================================ */

let cityChart = null;

function drawCityBarChart() {

  const chartCanvas = document.getElementById("cityBarChart");

  if (!chartCanvas) {
    console.warn("Canvas not found");
    return;
  }

  if (!CITY_LIST || CITY_LIST.length === 0) {
    console.warn("CITY_LIST empty. Chart not drawn.");
    const lg = document.getElementById("cityBarLegend");
    if (lg) lg.innerHTML = "";
    return;
  }

  const labels = CITY_LIST.map(c => c.city);

  const data = CITY_LIST.map(c => {
    if (!c.devices) return 0;
    return Object.values(c.devices).reduce((a, b) => a + b, 0);
  });

  // Compute risk for each city
  const riskInfo = CITY_LIST.map(c => {
    const score = computeCityRiskScore(c);
    return mapScoreToRisk(score);
  });

  const colors = riskInfo.map(r => r.color);
  const riskLabels = riskInfo.map(r => r.label);

  if (cityChart) {
    cityChart.destroy();
  }

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
        borderRadius: 5,
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
          callbacks: {
            title: function(tooltipItems) {
              const idx = tooltipItems[0].dataIndex;
              return labels[idx];
            },
            label: function(tooltipItem) {
              const idx = tooltipItem.dataIndex;
              const c = CITY_LIST[idx] || {};

              const total = c.devices
                ? Object.values(c.devices).reduce((a,b)=>a+b,0)
                : 0;

              const camOff  = (c.offline && c.offline.camera) || 0;
              const ctrlOff = (c.offline && c.offline.controller) || 0;
              const srvOff  = (c.offline && c.offline.server) || 0;
              const archOff = (c.offline && c.offline.archiver) || 0;

              const risk = riskLabels[idx] || "Low";

              return [
                `Total Devices: ${total}`,
                `Risk Level: ${risk}`,
                `Offline Camera: ${camOff}`,
                `Offline Controller: ${ctrlOff}`,
                `Offline Server: ${srvOff}`,
                `Offline Archiver: ${archOff}`
              ];
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        },
        x: {
          ticks: { display: false },
          grid: { display: true }
        }
      }
    }
  });

  // Draw legend
  createCityLegend("cityBarLegend");

  console.log("✅ City bar chart updated: Risk = Low / Medium / High");
}