<!DOCTYPE html>
<html>
<head>
  <title>Offline Devices Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <style>
    body {
      background: #0f172a;
      color: white;
      font-family: Arial, sans-serif;
    }

    .container {
      display: flex;
      gap: 20px;
      padding: 20px;
    }

    .chart-box {
      width: 50%;
      height: 400px;
      background: #111827;
      padding: 15px;
      border-radius: 12px;
    }

    canvas {
      width: 100% !important;
      height: 100% !important;
    }
  </style>
</head>
<body>

<h2 style="text-align:center;">Offline Devices Monitoring Dashboard</h2>

<div class="container">
  <div class="chart-box">
    <h3>Offline Scatter</h3>
    <canvas id="offlineScatter"></canvas>
  </div>

  <div class="chart-box">
    <h3>Offline Devices (City-wise)</h3>
    <canvas id="CityBarChart"></canvas>
  </div>
</div>

<script>
let offlineChart;
let cityBarChart;

// 🔵 Fake Offline Data (replace with your real data)
const offlineDevices = [
  { city: "Delhi", type: "camera", x: 10, y: 20 },
  { city: "Delhi", type: "camera", x: 12, y: 23 },
  { city: "Mumbai", type: "archiver", x: 30, y: 55 },
  { city: "Mumbai", type: "controller", x: 33, y: 60 },
  { city: "Kolkata", type: "ccure", x: 80, y: 10 },
  { city: "Chennai", type: "camera", x: 20, y: 70 },
  { city: "Chennai", type: "controller", x: 25, y: 75 },
];

function getChartColors() {
  return {
    text: "#ffffff"
  };
}

// ✅ Scatter Chart
function updateOfflineChart(devices) {

  const scatterData = devices.map(d => ({
    x: d.x,
    y: d.y,
    city: d.city,
    type: d.type
  }));

  const ctx = document.getElementById("offlineScatter").getContext("2d");

  if (offlineChart) {
    offlineChart.destroy();
  }

  offlineChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [{
        label: "Offline Devices",
        data: scatterData,
        backgroundColor: "#38bdf8"
      }]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label(ctx) {
              const d = ctx.raw;
              return `${d.city} - ${d.type}`;
            }
          }
        }
      }
    }
  });
}

// ✅ Build City Statistics
function buildCityStatsFromScatter() {
  const stats = {};

  offlineChart.data.datasets[0].data.forEach(point => {
    const city = point.city;
    const type = point.type;

    if (!stats[city]) {
      stats[city] = {
        total: 0,
        cameras: 0,
        archivers: 0,
        controllers: 0,
        ccure: 0
      };
    }

    stats[city].total++;

    if (type === "camera") stats[city].cameras++;
    if (type === "archiver") stats[city].archivers++;
    if (type === "controller") stats[city].controllers++;
    if (type === "ccure") stats[city].ccure++;

  });

  return stats;
}

// ✅ Risk Calculation
function determineRisk(cityStats) {
  if (cityStats.total > 3) return "High";
  if (cityStats.total > 1) return "Medium";
  return "None";
}

// ✅ Upgraded City Bar Chart
function drawCityBarChart() {

  const stats = buildCityStatsFromScatter();
  const rows = [];

  Object.keys(stats).forEach(city => {
    const s = stats[city];
    const risk = determineRisk(s);

    rows.push({
      city,
      total: s.total,
      cameras: s.cameras,
      archivers: s.archivers,
      controllers: s.controllers,
      ccure: s.ccure,
      risk
    });
  });

  if (rows.length === 0) {
    rows.push({ city: "No Offline Devices", total: 0, risk: "None" });
  }

  const riskPriority = { High: 1, Medium: 2, None: 3 };

  rows.sort((a, b) => {
    if (riskPriority[a.risk] !== riskPriority[b.risk])
      return riskPriority[a.risk] - riskPriority[b.risk];
    return b.total - a.total;
  });

  const labels = rows.map(r => r.city);
  const totals = rows.map(r => r.total);

  const colors = rows.map(r => {
    if (r.risk === "High") return "#ef4444";
    if (r.risk === "Medium") return "#f97316";
    return "#10b981";
  });

  const ctx = document.getElementById("CityBarChart").getContext("2d");

  if (cityBarChart) cityBarChart.destroy();

  cityBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Offline Devices",
        data: totals,
        backgroundColor: colors,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Offline Devices (City Wise)",
          color: getChartColors().text
        },
        tooltip: {
          callbacks: {
            afterLabel(ctx) {
              const r = rows[ctx.dataIndex];
              return [
                `Risk: ${r.risk}`,
                `Cameras: ${r.cameras}`,
                `Archivers: ${r.archivers}`,
                `Controllers: ${r.controllers}`,
                `CCURE: ${r.ccure}`
              ];
            }
          }
        }
      },
      scales: {
        x: { ticks: { color: "#fff" }},
        y: { ticks: { color: "#fff" }}
      }
    }
  });
}

// ✅ Main Render
function renderOfflineChartFromCombined() {
  updateOfflineChart(offlineDevices);

  requestAnimationFrame(() => {
    drawCityBarChart();
  });
}

// Run everything
renderOfflineChartFromCombined();
</script>

</body>
</html>