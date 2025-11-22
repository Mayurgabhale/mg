// Global update function that other scripts can call
window.updateFailureChartWithData = function(deviceDetails, historyData) {
  console.log('UPDATE FAILURE CHART CALLED with:', {
    deviceDetails: deviceDetails,
    historyDataCount: historyData ? Object.keys(historyData).length : 0
  });
  
  // Update global references
  if (deviceDetails) {
    window.currentDeviceDetails = deviceDetails;
  }
  
  if (historyData) {
    window.deviceHistoryData = historyData;
  }
  
  // Calculate and update chart if we have both data sources
  if (window.currentDeviceDetails && window.deviceHistoryData) {
    const failureData = calculateFailureCounts(window.currentDeviceDetails);
    refreshFailureChart(failureData);
  } else {
    console.warn('Cannot update chart - missing data:', {
      hasDeviceDetails: !!window.currentDeviceDetails,
      hasHistoryData: !!window.deviceHistoryData
    });
  }
};




....

// Enhanced initialization for Failure Count Chart - DYNAMIC VERSION
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded - initializing Failure Count Chart for dynamic data');
  
  // Initialize the chart with empty data first
  createFailureCountChart();
  
  // Set up a global reference for device details
  window.currentDeviceDetails = window.currentDeviceDetails || {};
  
  // Check if we already have data (in case graph.js loads after other scripts)
  setTimeout(() => {
    if (window.deviceHistoryData && window.currentDeviceDetails && 
        Object.keys(window.currentDeviceDetails).length > 0) {
      console.log('Found existing device data, updating chart dynamically');
      const failureData = calculateFailureCounts(window.currentDeviceDetails);
      refreshFailureChart(failureData);
    } else {
      console.log('Waiting for device data to load...');
      // Show loading state
      if (failureChart) {
        failureChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0];
        failureChart.data.datasets[0].backgroundColor = '#cccccc';
        failureChart.update();
      }
    }
  }, 1000);
});