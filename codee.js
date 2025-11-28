// ==================================================
// MAP.JS - FINAL CLEAN VERSION
// ==================================================

let realMap;
window.cityMarkerLayer = null;
window._cityMarkerIndex = {};

// ------------------ CITY COORDS ------------------
const CITY_COORDS = {
  "Casablanca": [33.5731, -7.5898],
  "Dubai": [25.276987, 55.296249],
  "Argentina": [-38.4161, -63.6167],
  "Austin TX": [30.2672, -97.7431],
  "Austria": [48.2082, 16.3738],
  "Costa Rica": [9.7489, -83.7534],
  "Denver": [39.7392, -104.9903],
  "Florida, Miami": [25.7617, -80.1918],
  "Frankfurt": [50.1109, 8.6821],
  "Ireland": [53.3331, -6.2489],
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
  "Vilnius": [54.6872, 25.2797],
  "Singapore": [1.3521, 103.8198],
  "HYDERABAD": [17.3850, 78.4867],
  "Taguig City": [14.5176, 121.0509],
  "Quezon": [14.6760, 121.0437]
};

// ------------------ DEVICE TYPE MAP ------------------
const TYPE_KEYS = {
  camera: "camera",
  cameras: "camera",
  archiver: "archiver",
  archivers: "archiver",
  controller: "controller",
  controllers: "controller",
  server: "server",
  ccure: "server"
};

// ------------------ MAP INIT ------------------
function initRealMap() {
  realMap = L.map("realmap", {
    preferCanvas: true,
    minZoom: 2,
    maxZoom: 18,
    worldCopyJump: true
  }).setView([15, 0], 2.5);

  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 20 }
  ).addTo(realMap);

  window.cityMarkerLayer = L.layerGroup().addTo(realMap);
}

// ------------------ NORMALIZE CITY ------------------
function normalizeCity(city) {
  if (!city) return "Unknown";
  city = city.toLowerCase().trim();

  if (city.includes("pune")) return "Pune";
  if (city.includes("vilnius")) return "Vilnius";
  if (city.includes("taguig")) return "Taguig City";
  if (city.includes("quezon")) return "Quezon";

  return city.charAt(0).toUpperCase() + city.slice(1);
}

// ------------------ AGGREGATE DATA ------------------
function aggregateDevicesByCity(combinedDevices) {
  const result = {};

  combinedDevices.forEach(entry => {
    const dev = entry.device ? entry.device : entry;
    if (!dev) return;

    const city = normalizeCity(dev.city || dev.location);
    const status = (dev.status || "").toLowerCase();
    const type = TYPE_KEYS[(dev.type || "").toLowerCase()] || null;

    if (!result[city]) {
      result[city] = {
        city,
        total: 0,
        online: 0,
        offline: 0,
        counts: { camera: 0, archiver: 0, controller: 0, server: 0 },
        onlineCount: { camera: 0, archiver: 0, controller: 0, server: 0 },
        offlineCount: { camera: 0, archiver: 0, controller: 0, server: 0 },
        lat: null,
        lon: null
      };
    }

    const c = result[city];
    c.total++;

    const isOffline = status === "offline" || status === "down";
    isOffline ? c.offline++ : c.online++;

    if (type) {
      c.counts[type]++;
      isOffline ? c.offlineCount[type]++ : c.onlineCount[type]++;
    }
  });

  Object.values(result).forEach(c => {
    const coords = CITY_COORDS[c.city];
    if (coords) {
      c.lat = coords[0];
      c.lon = coords[1];
    }
  });

  return result;
}

// ------------------ CREATE MARKERS ------------------
function createCityMarker(cityStats) {

  const icon = L.divIcon({
    className: "city-marker",
    html: `
      <div class="city-pin">
        <i class="bi bi-geo-alt-fill"></i>
        <div class="city-count">${cityStats.total}</div>
      </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  const marker = L.marker([cityStats.lat, cityStats.lon], { icon });

  const tooltip = `
  <strong>${cityStats.city}</strong><br>
  <i class="bi bi-camera"></i> Cameras: ${cityStats.counts.camera}<br>
  <i class="fas fa-database"></i> Archivers: ${cityStats.counts.archiver}<br>
  <i class="bi bi-hdd"></i> Controllers: ${cityStats.counts.controller}<br>
  <i class="fa-solid fa-server"></i> CCURE: ${cityStats.counts.server}<br>
  Online: ${cityStats.online} | Offline: ${cityStats.offline}
  `;

  marker.bindTooltip(tooltip, { sticky: true });
  marker.bindPopup(tooltip);

  return marker;
}

// ------------------ SIDE PANEL ------------------
function buildRegionPanel(data) {
  const panel = document.getElementById("region-panel-content");
  if (!panel) return;

  panel.innerHTML = "";

  const cityList = Object.values(data).sort((a, b) => b.total - a.total);

  cityList.forEach(city => {
    const div = document.createElement("div");
    div.className = "city-item";
    div.innerHTML = `
      <div>${city.city}</div>
      <div>— • ${city.total} devices</div>
    `;

    div.onclick = () => {
      if (!city.lat) return alert(`No coordinates for ${city.city}`);
      realMap.flyTo([city.lat, city.lon], 12);
      if (window._cityMarkerIndex[city.city]) {
        window._cityMarkerIndex[city.city].openPopup();
      }
    };

    panel.appendChild(div);
  });
}

// ------------------ MAIN UPDATE ------------------
function updateMapFromCombined(combinedDevices) {
  const data = aggregateDevicesByCity(combinedDevices);

  buildRegionPanel(data);

  window.cityMarkerLayer.clearLayers();
  window._cityMarkerIndex = {};

  const allCoords = [];

  Object.values(data).forEach(city => {
    if (!city.lat) return;

    const marker = createCityMarker(city).addTo(window.cityMarkerLayer);
    window._cityMarkerIndex[city.city] = marker;

    allCoords.push([city.lat, city.lon]);
  });

  if (allCoords.length) {
    realMap.fitBounds(L.latLngBounds(allCoords).pad(0.3));
  }
}

// ------------------ UI BUTTONS ------------------
document.getElementById("fit-all")?.addEventListener("click", () => {
  if (!window.cityMarkerLayer) return;
  const group = L.featureGroup(window.cityMarkerLayer.getLayers());
  realMap.fitBounds(group.getBounds().pad(0.3));
});

document.getElementById("show-global")?.addEventListener("click", () => {
  realMap.setView([15, 0], 2.5);
});

// ------------------ FULLSCREEN ------------------
document.getElementById("mapFullscreenBtn")?.addEventListener("click", () => {
  document.querySelector(".worldmap-card").classList.toggle("fullscreen");
  setTimeout(() => realMap.invalidateSize(), 300);
});

// ------------------ PANEL TOGGLE ------------------
document.getElementById("mapCityOverviewBtn")?.addEventListener("click", () => {
  document.getElementById("region-panel").classList.toggle("open");
});

// ------------------ INIT ------------------
document.addEventListener("DOMContentLoaded", () => {
  initRealMap();
  document.getElementById("region-panel-content").innerHTML = "Loading…";
});