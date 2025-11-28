<div class="chart-container" style="height:350px;">
  <canvas id="OfflineCityBarChart"></canvas>
</div>



..
let offlineCityBarChart = null;

// Theme colors (reuse your existing theme logic if you have)
function getChartColors() {
  const isDark = document.body.classList.contains("dark-mode");

  return {
    bar: isDark ? "#ff5252" : "#d32f2f",
    text: isDark ? "#ffffff" : "#333333",
    grid: isDark ? "#444" : "#ddd"
  };
}

// ---------------- BUILD DATA FROM combinedDevices ----------------
function buildOfflineCityBarData(combinedDevices) {

  const cityCounts = {};

  combinedDevices.forEach(d => {
    if (!d || !d.device) return;

    if (d.device.status !== "offline") return;

    const city = d.device.city || "Unknown";

    if (!cityCounts[city]) {
      cityCounts[city] = 0;
    }

    cityCounts[city]++;
  });

  return {
    labels: Object.keys(cityCounts),
    values: Object.values(cityCounts)
  };
}

// ---------------- INIT BAR CHART ----------------
function initOfflineCityBarChart() {

  const canvas = document.getElementById("OfflineCityBarChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const colors = getChartColors();

  offlineCityBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [{
        label: "Offline Devices",
        data: [],
        backgroundColor: colors.bar,
        borderRadius: 8,
        barThickness: 35
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: colors.text }
        }
      },
      scales: {
        x: {
          ticks: { 
            color: colors.text, 
            maxRotation: 30, 
            minRotation: 30 
          },
          grid: { color: colors.grid }
        },
        y: {
          beginAtZero: true,
          ticks: { color: colors.text },
          grid: { color: colors.grid }
        }
      }
    }
  });
}

// ---------------- UPDATE BAR CHART ----------------
function updateOfflineCityBarChart(combinedDevices) {

  if (!offlineCityBarChart) return;

  const { labels, values } = buildOfflineCityBarData(combinedDevices);

  offlineCityBarChart.data.labels = labels;
  offlineCityBarChart.data.datasets[0].data = values;

  offlineCityBarChart.update();
}

// ---------------- INIT ON LOAD ----------------
function initializeOfflineBarSystem() {

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initOfflineCityBarChart);
  } else {
    initOfflineCityBarChart();
  }
}