function renderOfflineChartFromCombined(combinedDevices) {
  // Build canonical CITY_LIST from combined data
  buildCityListFromCombined(combinedDevices);

  // Build data used by offline scatter (same normalization)
  const offlineDevices = combinedDevices
    .filter(d => (d.device || d).status === "offline")
    .map(d => {
      const device = d.device || d;
      return {
        device: device,
        type: device.type  // keep type as-is; updateOfflineChart() maps this with typeNames
      };
    });

  // Update both charts so they use the same aggregated data
  updateOfflineChart(offlineDevices);
  drawCityBarChart(); // redraw bar chart after CITY_LIST has been updated
}