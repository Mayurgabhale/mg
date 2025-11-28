/************************************
 * GLOBALS
 ************************************/
let realMap;
let cityMarkers = {};

/************************************
 * INIT MAP
 ************************************/
function initRealMap() {
  const mapContainer = document.getElementById("realmap");

  if (!mapContainer) {
    console.error("❌ #realmap container not found");
    return;
  }

  if (realMap) return;

  realMap = L.map("realmap").setView([20.5937, 78.9629], 4); // India center

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18
  }).addTo(realMap);

  console.log("✅ Leaflet Map Initialized");
}

/************************************
 * CITY NORMALIZATION (Matches chart)
 ************************************/
function normalizeCity(city) {
  if (!city) return "Unknown";

  city = city.toLowerCase().trim();

  if (city.startsWith("pune")) return "Pune";

  if (
    city.includes("vilnius") ||
    city.includes("gama") ||
    city.includes("delta")
  ) {
    return "Vilnius";
  }

  if (city.includes("taguig")) return "Taguig City";
  if (city.includes("quezon")) return "Quezon";

  return city.charAt(0).toUpperCase() + city.slice(1);
}

/************************************
 * CITY COORDINATES
 ************************************/
function getCityCoordinates(city) {
  const cityCoords = {
    "Pune": [18.5204, 73.8567],
    "Mumbai": [19.0760, 72.8777],
    "Delhi": [28.6139, 77.2090],
    "Bangalore": [12.9716, 77.5946],
    "Chennai": [13.0827, 80.2707],
    "Hyderabad": [17.3850, 78.4867],
    "Vilnius": [54.6872, 25.2797],
    "Taguig City": [14.5176, 121.0509],
    "Quezon": [14.6760, 121.0437]
  };

  return cityCoords[city] || null;
}

/************************************
 * AGGREGATE DATA FROM combinedDevices
 ************************************/
function aggregateDevicesByCity(combinedDevices) {
  const cityData = {};

  combinedDevices.forEach(entry => {
    if (!entry || !entry.device) return;

    const dev = entry.device;
    const city = normalizeCity(dev.city);
    const status = dev.status?.toLowerCase();

    if (!cityData[city]) {
      cityData[city] = {
        city,
        total: 0,
        online: 0,
        offline: 0
      };
    }

    cityData[city].total++;

    if (status === "offline") {
      cityData[city].offline++;
    } else {
      cityData[city].online++;
    }
  });

  return cityData;
}

/************************************
 * UPDATE MAP FROM combinedDevices
 ************************************/
function updateMapFromCombined(combinedDevices) {
  if (!realMap) initRealMap();

  if (!combinedDevices || combinedDevices.length === 0) {
    console.warn("⚠ No devices sent to map");
    return;
  }

  const citySummary = aggregateDevicesByCity(combinedDevices);

  Object.values(citySummary).forEach(cityData => {
    const city = cityData.city;
    const coords = getCityCoordinates(city);

    if (!coords) {
      console.warn("⚠ No coordinates for:", city);
      return;
    }

    // Color logic
    const markerColor = cityData.offline > 0 ? "red" : "green";

    // If marker exists -> update
    if (cityMarkers[city]) {
      cityMarkers[city].setStyle({ fillColor: markerColor });
      cityMarkers[city].setPopupContent(createPopupContent(cityData));
      return;
    }

    // Else create marker
    const marker = L.circleMarker(coords, {
      radius: 10,
      fillColor: markerColor,
      color: "black",
      weight: 1,
      fillOpacity: 0.8
    }).addTo(realMap);

    marker.bindPopup(createPopupContent(cityData));

    cityMarkers[city] = marker;
  });
}

/************************************
 * POPUP UI
 ************************************/
function createPopupContent(data) {
  return `
    <div style="min-width:200px">
      <h4>${data.city}</h4>
      <b>Total Devices:</b> ${data.total}<br>
      <b>Online:</b> ${data.online}<br>
      <b>Offline:</b> ${data.offline}
    </div>
  `;
}

/************************************
 * AUTO INIT ON LOAD
 ************************************/
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ map.js Loaded");
  initRealMap();
});