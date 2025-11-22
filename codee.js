let cityChart = null;

function drawCityBarChart() {

  const chartCanvas = document.getElementById("cityBarChart");
  if (!chartCanvas) {
    console.warn("Canvas not found");
    return;
  }

  if (!CITY_LIST || CITY_LIST.length === 0) {
    console.warn("CITY_LIST empty. Chart not drawn.");
    return;
  }

  const labels = CITY_LIST.map(c => c.city);

  const data = CITY_LIST.map(c => {
    if (!c.devices) return 0;
    return Object.values(c.devices).reduce((a, b) => a + b, 0);
  });

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
        backgroundColor: "#00ffcc"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: "#00ffcc" },
          grid: { color: "rgba(0,255,204,0.2)" }
        },
        x: {
          ticks: {
            maxRotation: 0,
            minRotation: 0,
            autoSkip: false,
            color: "#00ffcc"
          },
          grid: {
            display: false
          }
        }
      }
    }
  });

  console.log("✅ City bar chart with straight labels drawn");
}