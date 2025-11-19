
.city-marker div {
  background: #2563eb;
  color: #fff;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}




..
function placeCityMarkers() {
  // Clear previous markers
  if (!window.cityMarkerLayer) window.cityMarkerLayer = L.layerGroup().addTo(realMap);
  window.cityMarkerLayer.clearLayers();

  Object.entries(CITY_COORDS).forEach(([cityName, coords]) => {
    const [lat, lon] = coords;
    if (lat == null || lon == null) return;

    // Use a simple div icon for the city
    const cityIcon = L.divIcon({
      className: 'city-marker',
      html: `<div style="background:#2563eb;color:#fff;padding:4px 6px;border-radius:4px;font-size:12px;font-weight:700;">${cityName}</div>`,
      iconAnchor: [10, 10]
    });

    const marker = L.marker([lat, lon], { icon: cityIcon });
    marker.addTo(window.cityMarkerLayer);
  });
}






...
document.addEventListener("DOMContentLoaded", () => {
  initRealMap();

  placeCityMarkers(); // ← Add this line to show all cities

  // safe hookup helper
  function setOnClick(id, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
  }

  setOnClick("toggle-heat", toggleHeat);
  setOnClick("fit-all", fitAllCities);
  setOnClick("show-global", populateGlobalCityList);

  // expose updateMapData for external calls
  window.updateMapData = updateMapData;
});
