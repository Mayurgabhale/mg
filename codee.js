<div class="gcard wide">
  <h4 class="gcard-title">LOC Count</h4>
  <canvas id="cityBarChart" style="height:300px;"></canvas>
</div>



....
let cityChart = null;

function drawCityBarChart() {
  const chartCanvas = document.getElementById("cityBarChart");
  if (!chartCanvas) return;

  // City names
  const labels = CITY_LIST.map(c => c.city);

  // Total device count per city
  const data = CITY_LIST.map(c => {
    if (!c.devices) return 0;
    return Object.values(c.devices).reduce((a, b) => a + b, 0);
  });

  // Destroy old chart before re-drawing
  if (cityChart) {
    cityChart.destroy();
  }

  cityChart = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Total Devices",
        data: data,
        borderWidth: 1,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 60,
            minRotation: 60
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Devices"
          }
        }
      }
    }
  });
}
