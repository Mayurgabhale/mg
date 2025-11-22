let failureChartInstance = null;

function renderFailureChart(devices) {
  // Initialize failure counters
  let failureCounts = {
    CAMERA: 0,
    ARCHIVER: 0,
    CONTROLLER: 0,
    SERVER: 0
  };

  // Loop through devices and add their failure count
  devices.forEach(dev => {
    if (failureCounts[dev.category] !== undefined) {
      failureCounts[dev.category] += dev.downCount;
    }
  });

  const ctx = document.getElementById('failureChart');
  if (!ctx) return;

  // Destroy old chart if exists (important when region changes)
  if (failureChartInstance) {
    failureChartInstance.destroy();
  }

  failureChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Cameras', 'Archivers', 'Controllers', 'Servers'],
      datasets: [{
        label: 'Failure Count',
        data: [
          failureCounts.CAMERA,
          failureCounts.ARCHIVER,
          failureCounts.CONTROLLER,
          failureCounts.SERVER
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Device Failure Count Chart'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}