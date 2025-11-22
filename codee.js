// Global variable to store chart instance
let failureChart = null;

function refreshFailureChart(failureData) {
  if (!failureChart) {
    failureChart = createFailureCountChart();
  }
  
  failureChart.data.datasets[0].data = Object.values(failureData);
  failureChart.update();
}

....
// Enhanced Failure Count Chart with real data
function createFailureCountChart() {
  const ctx = document.getElementById('failureCountChart');
  if (!ctx) return null;
  
  failureChart = new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['Cameras', 'Controllers', 'Archivers', 'Servers', 'Desktops', 'DB Servers'],
      datasets: [{
        label: 'Total Failures',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: '#ff6b6b',
        borderColor: '#ff5252',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed.y} failures`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Failure Count'
          },
          ticks: {
            precision: 0
          }
        },
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 45
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      }
    }
  });

  return failureChart;
}

// Calculate failure counts from your device data
function calculateFailureCounts(deviceDetails) {
  const counts = {
    cameras: 0,
    controllers: 0,
    archivers: 0,
    servers: 0,
    desktops: 0,
    dbServers: 0
  };

  if (!deviceDetails || !window.deviceHistoryData) return counts;

  // Process each device type
  Object.keys(deviceDetails).forEach(type => {
    const devices = deviceDetails[type] || [];
    devices.forEach(device => {
      const ip = device.ip_address;
      const history = window.deviceHistoryData[ip] || [];
      const filteredHistory = filterHistoryForDisplay(history, type.toUpperCase());
      const failureCount = filteredHistory.filter(e => e.status === 'Offline').length;
      
      // Map to appropriate category
      switch(type) {
        case 'cameras': counts.cameras += failureCount; break;
        case 'controllers': counts.controllers += failureCount; break;
        case 'archivers': counts.archivers += failureCount; break;
        case 'servers': counts.servers += failureCount; break;
        case 'pcDetails': counts.desktops += failureCount; break;
        case 'DBDetails': counts.dbServers += failureCount; break;
      }
    });
  });

  return counts;
}

