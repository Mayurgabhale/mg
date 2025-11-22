
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