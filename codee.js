now i want only low, Medium, High
only this there i want, so do ony this there risk ok 
function computeCityRiskScore(city) {
  // weights: camera=1, archiver=2, server=3, controller=4
  // uses offline counts collected in updateMapData (city.offline)
  if (!city || !city.offline) return 0;
  const cam = city.offline.camera || 0;
  const arch = city.offline.archiver || 0;
  const srv = city.offline.server || 0;
  const ctrl = city.offline.controller || 0;
  const score = cam * 1 + arch * 2 + srv * 3 + ctrl * 4;
  return score;
}

function mapScoreToRisk(score) {
  // map numeric score to category and color matching a risk matrix feel
  // thresholds here are conservative — tweak to taste
  if (score <= 0) return { label: "Low", color: "#16A34A" };        // green
  if (score <= 2) return { label: "Low-Med", color: "#34D399" };    // light green
  if (score <= 4) return { label: "Medium", color: "#FACC15" };     // yellow
  if (score <= 6) return { label: "Med-Hi", color: "#F97316" };     // orange
  return { label: "High", color: "#DC2626" };                       // red
}

function createCityLegend(containerId = "cityBarLegend") {
  // create or refresh a legend element under the chart
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    const holder = document.getElementById("Loc-Count-chart");
    if (holder) holder.appendChild(container);
  }
  container.style.marginTop = "8px";
  container.style.fontSize = "12px";
  container.style.display = "flex";
  container.style.gap = "12px";
  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:6px"><span style="width:14px;height:14px;background:#16A34A;border-radius:3px;display:inline-block"></span>Low</div>
    <div style="display:flex;align-items:center;gap:6px"><span style="width:14px;height:14px;background:#34D399;border-radius:3px;display:inline-block"></span>Low-Med</div>
    <div style="display:flex;align-items:center;gap:6px"><span style="width:14px;height:14px;background:#FACC15;border-radius:3px;display:inline-block"></span>Medium</div>
    <div style="display:flex;align-items:center;gap:6px"><span style="width:14px;height:14px;background:#F97316;border-radius:3px;display:inline-block"></span>Med-Hi</div>
    <div style="display:flex;align-items:center;gap:6px"><span style="width:14px;height:14px;background:#DC2626;border-radius:3px;display:inline-block"></span>High</div>
  `;
}

/* -----------------------------------
   Replacement drawCityBarChart
   ----------------------------------- */
let cityChart = null;

function drawCityBarChart() {

  const chartCanvas = document.getElementById("cityBarChart");
  if (!chartCanvas) {
    console.warn("Canvas not found");
    return;
  }

  if (!CITY_LIST || CITY_LIST.length === 0) {
    console.warn("CITY_LIST empty. Chart not drawn.");
    // remove legend if present
    const lg = document.getElementById("cityBarLegend");
    if (lg) lg.innerHTML = "";
    return;
  }

  const labels = CITY_LIST.map(c => c.city);

  // total devices per city (same as before)
  const data = CITY_LIST.map(c => {
    if (!c.devices) return 0;
    return Object.values(c.devices).reduce((a, b) => a + b, 0);
  });

  // compute color/risk per city
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
        borderColor: colors.map(c => c), // simple border same as fill
        borderWidth: 1,
        borderRadius: 4,
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
          enabled: true,
          callbacks: {
            title: function(tooltipItems) {
              const idx = tooltipItems[0].dataIndex;
              return `${labels[idx]}`;
            },
            label: function(tooltipItem) {
              const idx = tooltipItem.dataIndex;
              const c = CITY_LIST[idx] || {};
              const total = (c.devices) ? Object.values(c.devices).reduce((a,b)=>a+b,0) : 0;
              const camOff = (c.offline && c.offline.camera) || 0;
              const ctrlOff = (c.offline && c.offline.controller) || 0;
              const srvOff = (c.offline && c.offline.server) || 0;
              const archOff = (c.offline && c.offline.archiver) || 0;
              const risk = riskLabels[idx] || "Low";
              const parts = [
                `Total devices: ${total}`,
                `Risk: ${risk}`,
                `Offline → Camera: ${camOff}, Controller: ${ctrlOff}, Server: ${srvOff}, Archiver: ${archOff}`
              ];
              return parts;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: Math.max(1, Math.ceil(Math.max(...data) / 5)) }
        },
        x: {
          ticks: {
            display: false   // hide city names on x-axis (as before)
          },
          grid: {
            display: true
          }
        }
      }
    }
  });

  // render legend under chart
  createCityLegend("cityBarLegend");

  console.log("✅ City bar chart drawn (risk colored)");
}
