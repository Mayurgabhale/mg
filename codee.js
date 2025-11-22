function populateDeviceTable(details, historyData) {
  // Your existing code...
  
  // After populating the table, update the failure chart
  if (typeof updateFailureCountChart === 'function') {
    const failureData = updateFailureCountChart(details);
    refreshFailureChart(failureData);
  }
  
  // Rest of your existing code...
}



....

<div class="gcard wide" style="height:300px;">
  <h4 class="gcard-title">Failure Count</h4>
  <canvas id="failureCountChart"></canvas>
</div>




// Function to create Failure Count chart
function createFailureCountChart() {
  const ctx = document.getElementById('failureCountChart').getContext('2d');
  
  // Sample data - you'll replace this with actual data from your API
  const failureData = {
    cameras: 12,
    controllers: 8,
    archivers: 5,
    servers: 3,
    desktops: 7,
    dbServers: 2
  };

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(failureData).map(key => 
        key.charAt(0).toUpperCase() + key.slice(1)
      ),
      datasets: [{
        label: 'Failure Count',
        data: Object.values(failureData),
        backgroundColor: [
          '#ff6b6b', '#ffa726', '#ffee58', '#4ecdc4', '#45b7d1', '#96ceb4'
        ],
        borderColor: [
          '#ff5252', '#ff9800', '#fdd835', '#26a69a', '#29b6f6', '#81c784'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Device Failures by Category',
          font: {
            size: 16
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Failures: ${context.parsed.y}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Failures'
          },
          ticks: {
            stepSize: 1
          }
        },
        x: {
          title: {
            display: true,
            text: 'Device Types'
          }
        }
      }
    }
  });

  return chart;
}

// Function to update chart with real data
function updateFailureCountChart(deviceData) {
  // This function will be called with actual device data
  const failureCounts = {
    cameras: 0,
    controllers: 0,
    archivers: 0,
    servers: 0,
    desktops: 0,
    dbServers: 0
  };

  // Count failures for each device type
  ['cameras', 'archivers', 'controllers', 'servers', 'pcDetails', 'DBDetails'].forEach(type => {
    const devices = deviceData[type] || [];
    devices.forEach(dev => {
      const ip = dev.ip_address;
      const hist = filterHistoryForDisplay(window.deviceHistoryData[ip] || [], type.toUpperCase());
      const failureCount = hist.filter(e => e.status === 'Offline').length;
      
      // Map to the correct category names
      if (type === 'cameras') failureCounts.cameras += failureCount;
      else if (type === 'controllers') failureCounts.controllers += failureCount;
      else if (type === 'archivers') failureCounts.archivers += failureCount;
      else if (type === 'servers') failureCounts.servers += failureCount;
      else if (type === 'pcDetails') failureCounts.desktops += failureCount;
      else if (type === 'DBDetails') failureCounts.dbServers += failureCount;
    });
  });

  return failureCounts;
}

// Initialize chart when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit for other components to load
  setTimeout(() => {
    createFailureCountChart();
  }, 1000);
});