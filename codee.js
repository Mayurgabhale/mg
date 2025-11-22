<!-- Failure Count Chart Card -->
<div class="gcard wide" id="failure-chart-card">

  <h4 class="gcard-title">Failure Count</h4>

  <div id="failure-chart-container" style="height:300px; width:100%;">
    <canvas id="failureChartCanvas"></canvas>
  </div>

</div>







// ================================
// FAILURE COUNT SCATTER CHART
// ================================

let failureChartInstance = null;

// DEVICE TYPE NORMALIZER
function normalizeType(type) {
  if (!type) return 'Other';
  type = type.toLowerCase();

  if (type.includes('camera') || type.includes('cctv')) return 'CCTV';
  if (type.includes('acs') || type.includes('controller')) return 'ACS';
  if (type.includes('nvr') || type.includes('dvr')) return 'NVR/DVR';
  if (type.includes('desktop') || type.includes('pc')) return 'Desktop';
  if (type.includes('server') && !type.includes('db')) return 'SERVER';
  if (type.includes('db')) return 'DB Server';

  return 'Other';
}

// MAIN DATA COLLECTOR
function collectFailureData() {

  const table = document.getElementById("device-table");
  if (!table) {
    console.error("❌ device-table not found");
    return {};
  }

  const rows = table.querySelectorAll("tbody tr");
  console.log("✅ Table rows found:", rows.length);

  let data = {};

  rows.forEach(row => {

    const cells = row.querySelectorAll("td");

    const ip = cells[1]?.innerText.trim();
    const name = cells[2]?.innerText.trim();
    const rawType = cells[3]?.innerText.trim();
    const city = cells[4]?.innerText.trim();

    let failureCount = parseInt(cells[6]?.innerText.trim()) || 0;

    const deviceType = normalizeType(rawType);

    // Simulate downtime (if no history yet)
    let downtimeMinutes = failureCount * 5;

    if (!data[deviceType]) {
      data[deviceType] = [];
    }

    data[deviceType].push({
      x: failureCount,
      y: downtimeMinutes,
      ip,
      name,
      city
    });

  });

  return data;
}

// MAIN RENDER FUNCTION
function renderFailureChart() {

  const canvas = document.getElementById("failureChartCanvas");

  if (!canvas) {
    console.error("❌ failureChartCanvas not found");
    return;
  }

  const ctx = canvas.getContext("2d");

  const deviceData = collectFailureData();

  if (Object.keys(deviceData).length === 0) {
    console.warn("⚠️ No data for chart");
    return;
  }

  const COLORS = {
    CCTV: "#22c55e",
    ACS: "#f97316",
    "NVR/DVR": "#3b82f6",
    SERVER: "#9333ea",
    Desktop: "#0ea5e9",
    "DB Server": "#ef4444",
    Other: "#6b7280"
  };

  const datasets = Object.keys(deviceData).map(type => {
    return {
      label: type,
      data: deviceData[type],
      backgroundColor: COLORS[type] || COLORS.Other,
      pointRadius: 6
    };
  });

  if (failureChartInstance) {
    failureChartInstance.destroy();
  }

  failureChartInstance = new Chart(ctx, {
    type: "scatter",
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              const m = ctx.raw;
              return [
                `Device: ${m.name}`,
                `IP: ${m.ip}`,
                `City: ${m.city}`,
                `Failures: ${m.x}`,
                `Downtime(min): ${m.y}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: "Failure Count" },
          beginAtZero: true,
          ticks: { stepSize: 1 }
        },
        y: {
          title: { display: true, text: "Downtime (Minutes)" },
          beginAtZero: true
        }
      }
    }
  });

  console.log("✅ Failure Chart Rendered Successfully");
}

// AUTO LOAD AFTER PAGE LOAD
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(renderFailureChart, 1500);
});

// AUTO UPDATE EVERY 10 SECONDS
setInterval(renderFailureChart, 10000);