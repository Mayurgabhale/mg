document.addEventListener("DOMContentLoaded", () => {
  initRealMap();
  placeCityMarkers();

  document.getElementById("toggle-heat")?.addEventListener("click", toggleHeat);
  document.getElementById("fit-all")?.addEventListener("click", fitAllCities);
  document.getElementById("show-global")?.addEventListener("click", populateGlobalCityList);

  window.updateMapData = updateMapData;
});