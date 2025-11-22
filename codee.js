/* Ensure chart containers are visible */
.gcard wide {
  position: relative;
}

#failureCountChart {
  width: 100% !important;
  height: 100% !important;
}
..

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




... 

// Enhanced initialization for Failure Count Chart
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded - initializing Failure Count Chart');
  
  // Initialize the chart with empty data first
  createFailureCountChart();
  
  // Set up a global reference for device details
  window.currentDeviceDetails = window.currentDeviceDetails || {};
  
  // If we already have device data, update the chart immediately
  if (window.deviceHistoryData && Object.keys(window.deviceHistoryData).length > 0) {
    console.log('Found existing device data, updating chart');
    const failureData = calculateFailureCounts(window.currentDeviceDetails);
    refreshFailureChart(failureData);
  }
});

// Global function to update device details - call this from your main data loading
window.updateDeviceDetails = function(details) {
  window.currentDeviceDetails = details;
  
  // Update failure chart if it exists
  if (failureChart && window.deviceHistoryData) {
    const failureData = calculateFailureCounts(details);
    refreshFailureChart(failureData);
  }
};



....

function populateDeviceTable(details, historyData) {
  // ... your existing code ...
  
  // After populating the table, update the failure chart
  if (typeof calculateFailureCounts === 'function' && typeof refreshFailureChart === 'function') {
    console.log('Updating Failure Count Chart with new data');
    const failureData = calculateFailureCounts(details);
    refreshFailureChart(failureData);
    
    // Also update global reference
    if (typeof window.updateDeviceDetails === 'function') {
      window.updateDeviceDetails(details);
    }
  } else {
    console.warn('Failure chart functions not available');
  }
  
  filterData();
}




....


function createFailureCountChart() {
  const ctx = document.getElementById('failureCountChart');
  if (!ctx) {
    console.error('FAILURE COUNT CHART: Canvas element not found!');
    return null;
  }
  
  console.log('FAILURE COUNT CHART: Creating chart...');
  
  failureChart = new Chart(ctx.getContext('2d'), {
    // ... your existing chart configuration ...
  });

  console.log('FAILURE COUNT CHART: Chart created successfully');
  return failureChart;
}

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
  } else {
    console.error('FAILURE COUNT CHART: Failed to create chart instance');
  }
}



