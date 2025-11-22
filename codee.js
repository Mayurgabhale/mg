function populateDeviceTable(details, historyData) {
  // ... your existing code ...

  // After populating the table, update the failure chart DYNAMICALLY
  console.log('SUMMARY.JS: Updating failure chart with dynamic data');
  
  // Use the global update function
  if (typeof window.updateFailureChartWithData === 'function') {
    window.updateFailureChartWithData(details, historyData);
  } else {
    console.error('Failure chart update function not available');
    // Fallback to direct calculation
    if (typeof calculateFailureCounts === 'function' && typeof refreshFailureChart === 'function') {
      const failureData = calculateFailureCounts(details);
      refreshFailureChart(failureData);
    }
  }

  filterData();
}