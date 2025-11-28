
let simpleMap;

const CITY_COORDS = {
  "Casablanca": [33.5731, -7.5898],
  "Dubai": [25.276987, 55.296249],
  "Argentina": [-38.4161, -63.6167],
  "Austin TX": [30.2672, -97.7431],
  "Austria, Vienna": [48.2082, 16.3738],
  "Costa Rica": [9.7489, -83.7534],
  "Denver": [39.7392, -104.9903],
  "Florida, Miami": [25.7617, -80.1918],
  "Frankfurt": [50.1109, 8.6821],
  "Ireland, Dublin": [53.3331, -6.2489],
  "Italy, Rome": [41.9028, 12.4964],
  "Japan Tokyo": [35.6762, 139.6503],
  "London": [51.5074, -0.1278],
  "Madrid": [40.4168, -3.7038],
  "Moscow": [55.7558, 37.6173],
  "NEW YORK": [40.7128, -74.0060],
  "Pune": [18.5204, 73.8567],
  "HYDERABAD": [17.3850, 78.4867],
  "Singapore": [1.3521, 103.8198],
  "Vilnius": [54.6872, 25.2797]
};

function initSimpleMap() {
  simpleMap = L.map("simpleMap").setView([20, 0], 2);

  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 18
  }).addTo(simpleMap);

  placeCityMarkers();
}

function placeCityMarkers() {

  for (const city in CITY_COORDS) {
    const coords = CITY_COORDS[city];

    const marker = L.marker(coords).addTo(simpleMap);

    marker.bindTooltip(city, {
      permanent: false,
      direction: "top"
    });

    marker.bindPopup(`<b>${city}</b>`);
  }
}

document.addEventListener("DOMContentLoaded", initSimpleMap);