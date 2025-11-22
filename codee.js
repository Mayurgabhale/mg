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