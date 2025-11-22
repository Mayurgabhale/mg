
// Enhanced test function to show real data status
window.showDataStatus = function() {
  console.log('=== FAILURE CHART DATA STATUS ===');
  console.log('Chart instance:', failureChart ? 'Exists' : 'NULL');
  console.log('Current device details:', window.currentDeviceDetails ? 
    `Has ${Object.keys(window.currentDeviceDetails).length} device types` : 'NULL');
  console.log('Device history data:', window.deviceHistoryData ?
    `Has ${Object.keys(window.deviceHistoryData).length} IPs` : 'NULL');
  
  if (window.currentDeviceDetails && window.deviceHistoryData) {
    const realData = calculateFailureCounts(window.currentDeviceDetails);
    console.log('Calculated real data:', realData);
    
    if (failureChart) {
      console.log('Current chart data:', failureChart.data.datasets[0].data);
    }
  }
};

// Call this from console: showDataStatus()



...
function fetchDeviceHistory(details) {
  fetch(`http://localhost/api/devices/history`)
    .then(res => res.json())
    .then(historyData => {
      // set global first to avoid race when user clicks fast
      window.deviceHistoryData = historyData;
      populateDeviceTable(details, historyData);
      
      // Trigger chart update
      if (typeof window.updateFailureChartWithData === 'function') {
        window.updateFailureChartWithData(details, historyData);
      }
    })
    .catch(err => console.error('Error fetching device history:', err));
}

.....



function fetchDeviceHistory(details) {
  fetch(`http://localhost/api/devices/history`)
    .then(r => r.json())
    .then(historyData => {
      populateDeviceTable(details, historyData);
      window.deviceHistoryData = historyData; // Set global
      
      // Trigger chart update if chart is ready
      if (typeof window.updateFailureChartWithData === 'function') {
        window.updateFailureChartWithData(details, historyData);
      }
    })
    .catch(console.error);
}