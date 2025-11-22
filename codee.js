read alos privisue code that i uploed in this chart. summmary.js and trend.js
that help you to slove this issue ok 
graph.js:556 ❌ No table found at all
findDeviceTable	@	graph.js:556
collectFailureData	@	graph.js:583
renderFailureChart	@	graph.js:638
setInterval		
(anonymous)	@	graph.js:712

let failureChartInstance = null;

// Auto detect device table if ID fails
function findDeviceTable() {
  let table = document.getElementById("device-table");

  if (!table) {
    console.warn("⚠️ device-table not found. Trying auto-detect...");
    table = document.querySelector("table"); // fallback: first table
  }

  if (!table) {
    console.error("❌ No table found at all");
    return null;
  }

  console.log("✅ Device table found:", table);
  return table;
}

// Normalize device type
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

// Main data collector
function collectFailureData() {

  const table = findDeviceTable();
  if (!table) return {};

  const rows = table.querySelectorAll("tbody tr");
  console.log("✅ Table rows found:", rows.length);

  let data = {};

  rows.forEach(row => {

    const cells = row.querySelectorAll("td");

    // Protect from broken rows
    if (cells.length < 7) return;

    const ip = cells[1]?.innerText.trim();
    const name = cells[2]?.innerText.trim();
    const rawType = cells[3]?.innerText.trim();
    const city = cells[4]?.innerText.trim();

    let failureCount = parseInt(cells[6]?.innerText.trim()) || 0;

    const deviceType = normalizeType(rawType);

    // Temporary downtime calc
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

// Render chart
function renderFailureChart() {

  const canvas = document.getElementById("failureChartCanvas");

  if (!canvas) {
    console.error("❌ failureChartCanvas not found");
    return;
  }

  const ctx = canvas.getContext("2d");

  const deviceData = collectFailureData();

  if (Object.keys(deviceData).length === 0) {
    console.warn("⚠️ No failure data found");
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

  const datasets = Object.keys(deviceData).map(type => ({
    label: type,
    data: deviceData[type],
    backgroundColor: COLORS[type] || COLORS.Other,
    pointRadius: 6
  }));

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
                `Name: ${m.name}`,
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

// Load
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(renderFailureChart, 2000);
});

// Auto refresh
setInterval(renderFailureChart, 10000);
