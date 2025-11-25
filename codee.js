

ok. i want to thsi color white so how to add color for 

/*********************************
 * CITY RISK SCORING (3 LEVELS)
 *********************************/

function computeCityRiskScore(city) {
  if (!city || !city.offline) return 0;

  const cam = city.offline.camera || 0;
  const arch = city.offline.archiver || 0;
  const srv = city.offline.server || 0;
  const ctrl = city.offline.controller || 0;

  return (cam * 1) + (arch * 2) + (srv * 3) + (ctrl * 4);
}

function mapScoreToRisk(score) {
  if (score <= 2) {
    return { label: "Low", color: "#16A34A" };
  }
  if (score <= 6) {
    return { label: "Medium", color: "#FACC15" };
  }
  return { label: "High", color: "#DC2626" };
}


/*********************************
 * LEGEND (TOP RIGHT)
 *********************************/

function createCityLegend(containerId = "cityBarLegend") {

  const holder = document.getElementById("Loc-Count-chart");
  if (!holder) return;

  holder.style.position = "relative"; // important for top-right

  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    holder.appendChild(container);
  }

  container.style.position = "absolute";
  container.style.top = "5px";
  container.style.right = "10px";
  container.style.fontSize = "12px";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "6px";
  // container.style.background = "rgba(255,255,255,0.9)";
  container.style.padding = "6px 10px";
  container.style.borderRadius = "6px";
  container.style.boxShadow = "0px 2px 6px rgba(0,0,0,0.15)";

  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:6px;">
      <span style="width:12px;height:12px;background:#16A34A;border-radius:3px;"></span> Low
    </div>
    <div style="display:flex;align-items:center;gap:6px;">
      <span style="width:12px;height:12px;background:#FACC15;border-radius:3px;"></span> Medium
    </div>
    <div style="display:flex;align-items:center;gap:6px;">
      <span style="width:12px;height:12px;background:#DC2626;border-radius:3px;"></span> High
    </div>
  `;
}


/*********************************
 * CITY BAR CHART
 *********************************/

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
    if (lg) lg.remove();
    return;
  }

  const labels = CITY_LIST.map(c => c.city);

  const data = CITY_LIST.map(c => {
    if (!c.devices) return 0;
    return Object.values(c.devices).reduce((a, b) => a + b, 0);
  });

  const riskInfo = CITY_LIST.map(c => {
    const score = computeCityRiskScore(c);
    return mapScoreToRisk(score);
  });

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
          callbacks: {
            title: function (items) {
              return labels[items[0].dataIndex];
            },
            label: function (item) {
              const idx = item.dataIndex;
              const c = CITY_LIST[idx] || {};

              const total = c.devices
                ? Object.values(c.devices).reduce((a, b) => a + b, 0)
                : 0;

              const camOff = (c.offline && c.offline.camera) || 0;
              const ctrlOff = (c.offline && c.offline.controller) || 0;
              const srvOff = (c.offline && c.offline.server) || 0;
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
  ticks: {
    display: true,
    autoSkip: false,
      // FORCE straight text (no slant)
    maxRotation: 0,
    minRotation: 0,
    callback: function(value, index) {
      const risk = riskLabels[index];

      // Show city name ONLY if risk is Medium or High
      if (risk === "Medium" || risk === "High") {
        return labels[index];
      }

      // Hide Low risk city labels
      return "";
    }
  },
  grid: {
    display: true
  }
}

      }
    }
  });

  // Add legend in top-right
  createCityLegend("cityBarLegend");

  console.log("✅ City bar chart updated with top-right legend");
}
