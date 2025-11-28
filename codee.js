document.addEventListener("DOMContentLoaded", () => {
  initRealMap();

  placeCityMarkers(); // optional: will show markers if CITY_LIST already has data

  function setOnClick(id, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
  }

  setOnClick("toggle-heat", toggleHeat);
  setOnClick("fit-all", fitAllCities);
  setOnClick("show-global", populateGlobalCityList);

  window.updateMapData = updateMapData;
});