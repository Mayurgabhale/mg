function renderOfflineChartFromCombined(combinedDevices) {
  const offlineDevices = combinedDevices
    .filter(d => d.device.status === "offline")
    .map(d => ({
      device: d.device,
      type: d.device.type
    }));

  updateOfflineChart(offlineDevices);

  // ✅ ADD BAR CHART UPDATE HERE
  updateOfflineCityBarChart(combinedDevices);
}