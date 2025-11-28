// ============================
// GLOBALS
// ============================
let map;
let cityMarkers = {};
let cityDeviceSummary = {};

// ============================
// INIT MAP
// ============================
function initMap() {
  if (map) return;

  map = L.map("map").setView([20.5937, 78.9629], 4); // India Default

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18
  }).addTo(map);
}

// ============================
// Normalize city names
// ============================
function normalizeCityName(city) {
  city = city.toLowerCase().trim();

  if (city.startsWith("pune")) return "Pune";

  if (city.includes("vilnius") ||
      city.includes("gama") ||
      city.includes("delta")) {
    return "Vilnius";
  }

  return city.charAt(0).toUpperCase() + city.slice(1);
}

// ============================
// BUILD MAP DATA DYNAMICALLY
// ============================
function buildCityMapData(combinedDevices = []) {

  cityDeviceSummary = {}; // reset

  combinedDevices.forEach(entry => {
    if (!entry || !entry.device) return;

    const dev = entry.device;
    const city = normalizeCityName(dev.city || "Unknown");
    const status = (dev.status || "").toLowerCase();
    const type = (dev.type || "").toLowerCase();

    if (!cityDeviceSummary[city]) {
      cityDeviceSummary[city] = {
        city,
        total: 0,
        offline: 0,
        online: 0,
        types: {
          cameras: 0,
          controllers: 0,
          archivers: 0,
          servers: 0
        }
      };
    }

    const cityObj = cityDeviceSummary[city];
    cityObj.total++;

    if (status === "offline") cityObj.offline++;
    else cityObj.online++;

    if (cityObj.types.hasOwnProperty(type)) {
      cityObj.types[type]++;
    }
  });
}

// ============================
// UPDATE MARKERS ON MAP
// ============================
function updateMapMarkers() {
  if (!map) initMap();

  Object.values(cityDeviceSummary).forEach(cityData => {
    const city = cityData.city;

    // If marker already exists -> update
    if (cityMarkers[city]) {
      const marker = cityMarkers[city];
      marker.setPopupContent(generatePopupContent(cityData));
      return;
    }

    // 🔵 Default coordinates (replace later if API available)
    const cityCoordinates = getCityCoordinates(city);

    if (!cityCoordinates) return;

    const marker = L.circleMarker(cityCoordinates, {
      radius: 10,
      fillColor: cityData.offline > 0 ? "red" : "green",
      color: "#000",
      weight: 1,
      fillOpacity: 0.8
    }).addTo(map);

    marker.bindPopup(generatePopupContent(cityData));

    cityMarkers[city] = marker;
  });
}

// ============================
// POPUP UI
// ============================
function generatePopupContent(data) {
  return `
    <div style="min-width:200px">
      <h4>${data.city}</h4>
      <b>Total Devices:</b> ${data.total}<br>
      <b>Online:</b> ${data.online}<br>
      <b>Offline:</b> ${data.offline}<br><br>

      <b>Breakdown:</b><br>
      Cameras: ${data.types.cameras}<br>
      Controllers: ${data.types.controllers}<br>
      Archivers: ${data.types.archivers}<br>
      Servers: ${data.types.servers}
    </div>
  `;
}

// ============================
// CITY COORDINATES MAPPING
// ============================
function getCityCoordinates(city) {

  const cityCoords = {
    "Pune": [18.5204, 73.8567],
    "Vilnius": [54.6872, 25.2797],
    "Mumbai": [19.0760, 72.8777],
    "Delhi": [28.6139, 77.2090],
    "Bangalore": [12.9716, 77.5946],
    "Chennai": [13.0827, 80.2707],
    "Hyderabad": [17.3850, 78.4867]
  };

  return cityCoords[city] || null;
}

// ============================
// MAIN FUNCTION (Same logic as your chart logic)
// ============================
function renderMapFromCombinedDevices(combinedDevices) {

  buildCityMapData(combinedDevices);

  updateMapMarkers();
}

// ============================
// Hook into your existing pipeline
// ============================

// Just add THIS inside your existing function:

// function renderOfflineChartFromCombined(combinedDevices) {
//   ...
//   renderMapFromCombinedDevices(combinedDevices);
// }