//-----------------------------------------------------------
//  WORLD MAP MODULE — CLEAN & SEPARATED
//-----------------------------------------------------------

let realMap;
let CITY_LIST = [];
let cityLayers = {};
let heatLayer = null;

window._mapRegionMarkers = [];

const CITY_COORDS = {
  "Casablanca": [33.5731, -7.5898],
  "Dubai": [25.276987, 55.296249],
  "Argentina": [-38.4161, -63.6167],
  "Austin TX": [30.2672, -97.7431],
  "Austria, Vienna": [48.2082, 16.3738],
  "Costa Rica": [9.7489, -83.7534],
  "Denver": [39.7392, -104.9903],
  "Denver Colorado": [39.7392, -104.9903],
  "Florida, Miami": [25.7617, -80.1918],
  "Frankfurt": [50.1109, 8.6821],
  "Gama Building": [37.7749, -122.4194],
  "Delta Building": [37.7749, -122.4194],
  "Ireland, Dublin": [53.3331, -6.2489],
  "Italy, Rome": [41.9028, 12.4964],
  "Japan Tokyo": [35.6762, 139.6503],
  "Kuala lumpur": [3.1390, 101.6869],
  "London": [51.5074, -0.1278],
  "Madrid": [40.4168, -3.7038],
  "Mexico": [23.6345, -102.5528],
  "Moscow": [55.7558, 37.6173],
  "NEW YORK": [40.7128, -74.0060],
  "Panama": [8.5380, -80.7821],
  "Peru": [-9.1900, -75.0152],
  "Pune": [18.5204, 73.8567],
  "Pune 2nd Floor": [18.5204, 73.8567],
  "Pune Podium": [18.5204, 73.8567],
  "Pune Tower B": [18.5204, 73.8567],
  "Quezon": [20.6760, 121.0437],
  "Sao Paulo, Brazil": [-23.5505, -46.6333],
  "Taguig City": [14.5176, 121.0509],
  "HYDERABAD": [17.3850, 78.4867],
  "Singapore": [1.3521, 103.8198],
  "Vilnius": [54.6872, 25.2797],
};

//-----------------------------------------------------------
// HELPERS
//-----------------------------------------------------------

function toNum(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function normalizeCity(raw) {
  if (!raw) return "Unknown";
  raw = String(raw).trim();

  if (raw.includes(" - ")) return raw.split(" - ")[0];
  if (raw.includes(",")) return raw.split(",")[0];

  return raw;
}

//-----------------------------------------------------------
// 1. INIT MAP
//-----------------------------------------------------------

function initRealMap() {
  realMap = L.map("realmap", {
    preferCanvas: true,
    minZoom: 2,
    maxZoom: 20,
  }).setView([20, 0], 2.4);

  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 20 }
  ).addTo(realMap);

  L.control.scale().addTo(realMap);
  window.cityMarkerLayer = L.layerGroup().addTo(realMap);
}

//-----------------------------------------------------------
// 2. MARKERS
//-----------------------------------------------------------

function placeCityMarkers() {
  window.cityMarkerLayer.clearLayers();

  CITY_LIST.forEach((c) => {
    if (toNum(c.lat) === null || toNum(c.lon) === null) return;

    const icon = L.divIcon({
      className: "city-marker",
      html: `<div class="pin"><i class="bi bi-geo-alt-fill"></i></div>`,
      iconAnchor: [12, 12],
    });

    const marker = L.marker([c.lat, c.lon], { icon });

    marker.bindPopup(`${c.city}<br>${c.total} devices`);
    marker.addTo(window.cityMarkerLayer);
  });
}

function fitAllCities() {
  const all = CITY_LIST
    .map((c) => [toNum(c.lat), toNum(c.lon)])
    .filter(([a, b]) => a !== null && b !== null);

  if (all.length) realMap.fitBounds(all);
}

//-----------------------------------------------------------
// 3. GET LOCAL COORDS
//-----------------------------------------------------------

async function getCityCoords(city) {
  return CITY_COORDS[city] || null;
}

//-----------------------------------------------------------
// 4. MAIN UPDATE FUNCTION
//-----------------------------------------------------------

async function updateMapData_Disabled(summary, details) {
  const bucket = details.details || details;
  if (!bucket) return;

  const map = {};

  Object.entries(bucket).forEach(([rawType, arr]) => {
    arr.forEach((dev) => {
      const cityName = normalizeCity(dev.city || dev.location || "Unknown");
      const type = rawType.toLowerCase().includes("camera")
        ? "camera"
        : rawType.includes("server")
        ? "server"
        : rawType.includes("controller")
        ? "controller"
        : rawType.includes("archiver")
        ? "archiver"
        : null;

      if (!map[cityName])
        map[cityName] = {
          city: cityName,
          lat: toNum(dev.lat),
          lon: toNum(dev.lon),
          devices: { camera: 0, server: 0, controller: 0, archiver: 0 },
          total: 0,
        };

      if (type) map[cityName].devices[type]++;
      map[cityName].total++;
    });
  });

  CITY_LIST = Object.values(map);

  // fill missing coords
  for (const c of CITY_LIST) {
    if (toNum(c.lat) === null || toNum(c.lon) === null) {
      const coords = await getCityCoords(c.city);
      if (coords) {
        c.lat = coords[0];
        c.lon = coords[1];
      }
    }
  }

  placeCityMarkers();
  fitAllCities();
}

//-----------------------------------------------------------
// INIT on LOAD
//-----------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  initRealMap();
  window.updateMapData_Disabled = updateMapData_Disabled;
});