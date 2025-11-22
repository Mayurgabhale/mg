bottom side city nam i want streght ok..
  _____ i want like 
  ////  not like that ok 

<div class="gcard wide" style="height:300px; width: 1208px; margin-bottom: 50px">
                <h4 class="gcard-title">LOC Count</h4>
                <canvas id="cityBarChart"></canvas>
              </div>



// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️ bar chart
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
        data: data
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
          beginAtZero: true
        }
      }
    }
  });

  console.log("✅ City bar chart drawn");
}





