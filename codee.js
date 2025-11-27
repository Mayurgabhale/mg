// safe usage example (do NOT run at module top-level)
function rebuildCityListFromData(deviceBuckets) {
  const flatDevices = flattenDeviceBuckets(deviceBuckets);
  CITY_LIST = buildCityMapFromDevices(flatDevices);
  ensureUniqueCityCoordinates(CITY_LIST);
  placeCityMarkers();
  drawHeatmap();
  drawCityBarChart && drawCityBarChart();
}