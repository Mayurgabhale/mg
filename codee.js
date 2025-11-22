document.addEventListener('DOMContentLoaded', function() {
  // Your existing initialization code...
  
  // Initialize failure count chart
  createFailureCountChart();
  
  // Update chart when region changes
  document.getElementById('region')?.addEventListener('change', function() {
    setTimeout(() => {
      if (window.currentDeviceDetails) {
        const failureData = calculateFailureCounts(window.currentDeviceDetails);
        refreshFailureChart(failureData);
      }
    }, 1500);
  });
});