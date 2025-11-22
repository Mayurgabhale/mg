this chart i want to diplsy like in imag failure count chart 
<div class="gcard wide" style="height:300px; width: 728px;">
                <h4 class="gcard-title">Failure Count</h4>
                <canvas id="failureCountChart"></canvas>
              </div>


// Add this function to graph.js - it's referenced but not defined
function filterHistoryForDisplay(hist, category) {
  const cat = (category || '').toString().toUpperCase();
  const filtered = [];
  let lastOff = null;

  hist.forEach(e => {
    if (e.status === 'Offline') {
      lastOff = e;
    } else if (e.status === 'Online' && lastOff) {
      const diff = (new Date(e.timestamp) - new Date(lastOff.timestamp)) / 1000;

      if (cat === 'SERVER') {
        if (diff > 300) {
          filtered.push(lastOff, e);
        }
      } else {
        if (diff >= 300) {
          filtered.push(lastOff, e);
        }
      }
      lastOff = null;
    } else {
      if (cat !== 'SERVER') filtered.push(e);
    }
  });

  if (lastOff) {
    const diff = (Date.now() - new Date(lastOff.timestamp)) / 1000;
    if (cat === 'SERVER') {
      if (diff > 300) filtered.push(lastOff);
    } else {
      if (diff >= 300) filtered.push(lastOff);
    }
  }

  return filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

// Global variable to store chart instance
let failureChart = null;

function refreshFailureChart(failureData) {
  console.log('FAILURE COUNT CHART: Refreshing with data:', failureData);
  
  if (!failureChart) {
    console.log('FAILURE COUNT CHART: No chart instance, creating new one');
    failureChart = createFailureCountChart();
  }
  
  if (failureChart) {
    failureChart.data.datasets[0].data = Object.values(failureData);
    failureChart.update();
    console.log('FAILURE COUNT CHART: Chart updated successfully');
    
    // Force canvas to be visible
    const canvas = document.getElementById('failureCountChart');
    if (canvas) {
      canvas.style.display = 'block';
      canvas.style.visibility = 'visible';
      canvas.style.opacity = '1';
      canvas.style.zIndex = '10';
      canvas.style.position = 'relative';
    }
  } else {
    console.error('FAILURE COUNT CHART: Failed to create chart instance');
  }
}

// Enhanced Failure Count Chart with real data
function createFailureCountChart() {
  const ctx = document.getElementById('failureCountChart');
  if (!ctx) {
    console.error('FAILURE COUNT CHART: Canvas element not found!');
    return null;
  }
  
  console.log('FAILURE COUNT CHART: Creating chart...');
  
  // Ensure canvas is visible
  ctx.style.display = 'block';
  ctx.style.visibility = 'visible';
  ctx.style.opacity = '1';
  ctx.style.width = '100%';
  ctx.style.height = '100%';
  
  failureChart = new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['Cameras', 'Controllers', 'Archivers', 'Servers', 'Desktops', 'DB Servers'],
      datasets: [{
        label: 'Total Failures',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: [
          '#ff6b6b',
          '#4ecdc4', 
          '#45b7d1',
          '#96ceb4',
          '#ffa726',
          '#ffee58'
        ],
        borderColor: [
          '#ff5252',
          '#26a69a',
          '#29b6f6', 
          '#81c784',
          '#ff9800',
          '#fdd835'
        ],
        borderWidth: 2,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        title: {
          display: true,
          text: 'Device Failure Count',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: 2
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
            text: 'Number of Failures',
            font: {
              weight: 'bold'
            }
          },
          ticks: {
            precision: 0,
            stepSize: 1
          },
          grid: {
            color: 'rgba(0,0,0,0.1)'
          }
        },
        x: {
          ticks: {
            autoSkip: false,
            // maxRotation: 45,
            // minRotation: 45
          },
          grid: {
            display: false
          }
        },
        x: {
          ticks: {
            autoSkip: false,
            // maxRotation: 45,
            // minRotation: 45
          },
          grid: {
            display: false
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      }
    }
  });

  console.log('FAILURE COUNT CHART: Chart created successfully');
  return failureChart;
}

// Calculate failure counts from your device data
function calculateFailureCounts(deviceDetails) {
  console.log('CALCULATING FAILURE COUNTS:', deviceDetails);
  
  const counts = {
    cameras: 0,
    controllers: 0,
    archivers: 0,
    servers: 0,
    desktops: 0,
    dbServers: 0
  };

  if (!deviceDetails) {
    console.warn('No device details provided');
    return counts;
  }

  if (!window.deviceHistoryData) {
    console.warn('No device history data available');
    return counts;
  }

  // Process each device type
  ['cameras', 'archivers', 'controllers', 'servers', 'pcDetails', 'DBDetails'].forEach(type => {
    const devices = deviceDetails[type] || [];
    console.log(`Processing ${type}: ${devices.length} devices`);
    
    devices.forEach(device => {
      const ip = device.ip_address;
      const history = window.deviceHistoryData[ip] || [];
      const filteredHistory = filterHistoryForDisplay(history, type.toUpperCase());
      const failureCount = filteredHistory.filter(e => e.status === 'Offline').length;
      
      console.log(`Device ${ip} (${type}): ${failureCount} failures`);
      
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

  console.log('FINAL FAILURE COUNTS:', counts);
  return counts;
}

// Enhanced initialization for Failure Count Chart
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded - initializing Failure Count Chart');
  
  // Initialize the chart with empty data first
  createFailureCountChart();
  
  // Set up a global reference for device details
  window.currentDeviceDetails = window.currentDeviceDetails || {};
  
  // Add test data to verify chart works
  setTimeout(() => {
    if (failureChart) {
      console.log('Setting test data to verify chart visibility');
      const testData = {
        cameras: 15,
        controllers: 4,
        archivers: 19,
        servers: 7,
        desktops: 9,
        dbServers: 10
      };
      refreshFailureChart(testData);
    }
  }, 2000);
});

// Global function to update device details - call this from your main data loading
window.updateDeviceDetails = function(details) {
  console.log('UPDATING DEVICE DETAILS:', details);
  window.currentDeviceDetails = details;
  
  // Update failure chart if it exists
  if (failureChart && window.deviceHistoryData) {
    const failureData = calculateFailureCounts(details);
    refreshFailureChart(failureData);
  }
};

// Test function to manually trigger chart update
window.testFailureChart = function() {
  console.log('Manual test of failure chart');
  const testData = {
    cameras: Math.floor(Math.random() * 20),
    controllers: Math.floor(Math.random() * 15),
    archivers: Math.floor(Math.random() * 10),
    servers: Math.floor(Math.random() * 8),
    desktops: Math.floor(Math.random() * 25),
    dbServers: Math.floor(Math.random() * 5)
  };
  refreshFailureChart(testData);
};
