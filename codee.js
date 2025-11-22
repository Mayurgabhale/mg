<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Device Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>

  <!-- Failure Chart Box -->
  <div style="width: 700px; margin: 30px auto; background: #f2f2f2; padding: 15px; border-radius: 8px;">
    <h2 style="text-align:center;">Device Failure Summary</h2>
    <canvas id="failureChart"></canvas>
  </div>

  <!-- Your JS -->
  <script src="trend.js"></script>

</body>
</html>





let failureChartInstance = null;

function renderFailureChart(devices) {

  let failureCounts = {
    CAMERA: 0,
    ARCHIVER: 0,
    CONTROLLER: 0,
    SERVER: 0
  };

  // Count failures by type
  devices.forEach(dev => {
    if (failureCounts.hasOwnProperty(dev.category)) {
      failureCounts[dev.category] += dev.downCount;
    }
  });

  const canvas = document.getElementById("failureChart");

  if (!canvas) {
    console.error("Canvas failureChart not found!");
    return;
  }

  const ctx = canvas.getContext("2d");

  // Destroy previous chart if exists
  if (failureChartInstance) {
    failureChartInstance.destroy();
  }

  failureChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Cameras", "Archivers", "Controllers", "Servers"],
      datasets: [{
        label: "Failure Count",
        data: [
          failureCounts.CAMERA,
          failureCounts.ARCHIVER,
          failureCounts.CONTROLLER,
          failureCounts.SERVER
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true
        },
        title: {
          display: true,
          text: "Failure Count Dashboard"
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  console.log("✅ Failure chart drawn:", failureCounts);
}