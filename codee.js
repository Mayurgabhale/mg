/* ==========================
   GLOBAL VARIABLES
========================== */
var realMap;
var cityMarkers = L.layerGroup();
var CITY_LIST = [];

// ✅ City coordinates (you can edit / add more)
const CITY_COORDS = {
  "Pune": [18.5204, 73.8567],
  "Vilnius": [54.6872, 25.2797],
  "Dubai": [25.2048, 55.2708],
  "London": [51.5074, -0.1278],
  "New York": [40.7128, -74.0060]
};

/* ==========================
   MAP INITIALIZATION
========================== */
function initRealMap() {

  realMap = L.map("real-map").setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(realMap);

  cityMarkers.addTo(realMap);

  updateMapData();
}

/* ==========================
   UPDATE MAP WITH COORDS
========================== */
function updateMapData() {

  cityMarkers.clearLayers();
  CITY_LIST = [];

  Object.entries(CITY_COORDS).forEach(([city, coords]) => {

    const lat = coords[0];
    const lng = coords[1];

    const marker = L.marker([lat, lng]).bindPopup(
      `<b>${city}</b><br>Lat: ${lat}<br>Lng: ${lng}`
    );

    cityMarkers.addLayer(marker);

    CITY_LIST.push({
      city: city,
      lat: lat,
      lng: lng
    });
  });

  populateCityPanel();
  fitAllCities();
}

/* ==========================
   FIT MAP TO ALL CITIES
========================== */
function fitAllCities() {
  if (CITY_LIST.length === 0) return;

  const bounds = CITY_LIST.map(c => [c.lat, c.lng]);
  realMap.fitBounds(bounds, { padding: [50, 50] });
}

/* ==========================
   CITY PANEL LIST
========================== */
function populateCityPanel() {

  const container = document.getElementById("city-list");
  if (!container) return;

  container.innerHTML = "";

  CITY_LIST.forEach(c => {

    const div = document.createElement("div");
    div.textContent = c.city;

    div.style.cursor = "pointer";
    div.style.padding = "5px";
    div.style.borderBottom = "1px solid #ddd";

    div.onclick = function () {
      realMap.setView([c.lat, c.lng], 8);
    };

    container.appendChild(div);
  });
}

/* ==========================
   PANEL TOGGLE BUTTON
========================== */
const mapCityOverviewBtn = document.getElementById("mapCityOverviewBtn");

if (mapCityOverviewBtn) {
  mapCityOverviewBtn.addEventListener("click", function () {
    const panel = document.getElementById("region-panel");
    if (!panel) return;

    panel.style.display = (panel.style.display === "block") ? "none" : "block";
  });
}

/* ==========================
   AUTO INIT ON LOAD
========================== */
document.addEventListener("DOMContentLoaded", function () {
  initRealMap();
});