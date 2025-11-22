// ================================
// FAILURE COUNT SCATTER CHART
// ================================

let failureChartInstance = null;

// 🔥 CONFIGURE YOUR TABLE ID HERE
const DEVICE_TABLE_ID = "networkDeviceTable";

// =====================================
// WAIT UNTIL TABLE EXISTS (supports dynamic loading)
// =====================================
function waitForTable(callback) {
  let attempts = 0;

  const check = setInterval(() => {

    const table = document.getElementById(DEVICE_TABLE_ID);

    if (table) {
      clearInterval(check);
      console.log("✅ Device table detected:", table);
      callback();
      return;
    }

    attempts++;

    if (attempts > 50) {
      clearInterval(check);
      console.error("❌ Table not found after waiting. Check ID or load order.");
    }

  }, 200);
}

// =====================================
// DEVICE TYPE NORMALIZER
// =====================================
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

// =====================================
// FAILURE DATA COLLECTOR
// =====================================
function collectFailureData() {

  const table = document.getElementById(DEVICE_TABLE_ID);

  if (!table) {
    console.error("❌ Table not found:", DEVICE_TABLE_ID);
    return {};
  }

  const rows = table.querySelectorAll("tbody tr");
  console.log("✅ Table Rows Found:", rows.length);

  let data = {};

  rows.forEach(row => {

    const cells = row.querySelectorAll("td");

    if (cells.length < 7) return;

    const ip = cells[1]?.innerText.trim();
    const name = cells[2]?.innerText.trim();
    const rawType = cells[3]?.innerText.trim();
    const city = cells[4]?.innerText.trim();
    const failureCount = parseInt(cells[6]?.innerText.trim()) || 0;

    const deviceType = normalizeType(rawType);
    const downtimeMinutes = failureCount * 5;

    if (!data[deviceType]) data[deviceType] = [];

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

// =====================================
// RENDER FAILURE CHART
// =====================================
function renderFailureChart() {

  const canvas = document.getElementById("failureChartCanvas");

  if (!canvas) {
    console.error("❌ failureChartCanvas not found");
    return;
  }

  const ctx = canvas.getContext("2d");

  const deviceData = collectFailureData();

  if (Object.keys(deviceData).length === 0) {
    console.warn("⚠️ No failure data yet - waiting for data load...");
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
          beginAtZero: true
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

// =====================================
// AUTO BOOTSTRAP SYSTEM
// =====================================
waitForTable(() => {
  renderFailureChart();

  // Keep updating every 10s after table exists
  setInterval(renderFailureChart, 10000);
});