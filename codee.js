// ================== MAP.JS ==================

let realMap;
window.cityMarkerLayer = null;
window._cityMarkerIndex = {};

// ------------------ CITY COORDS ------------------
const CITY_COORDS = {
  "Pune": [18.5204, 73.8567],
  "Vilnius": [54.6872, 25.2797],
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

// ✅ SAME LOGIC AS YOUR BAR CHART
function normalizeCityName(city) {
  if (!city) return "Unknown";

  city = city.toLowerCase().trim();

  if (city.startsWith("pune")) return "Pune";

  if (city.includes("vilnius") ||
      city.includes("gama") ||
      city.includes("delta")) {
    return "Vilnius";
  }

  return city.charAt(0).toUpperCase() + city.slice(1);
}

// ------------------ MAP INIT ------------------
function initRealMap() {

  const mapDiv = document.getElementById("realmap");

  if (!mapDiv) {
    console.error("❌ #realmap div not found");
    return;
  }

  realMap = L.map("realmap", {
    preferCanvas: true,
    minZoom: 2,
    maxZoom: 18,
    worldCopyJump: true
  }).setView([15, 0], 2.5);

  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  ).addTo(realMap);

  window.cityMarkerLayer = L.layerGroup().addTo(realMap);

  console.log("✅ Map initialized");
}

// ------------------ AGGREGATE DATA ------------------
function aggregateDevicesByCity(combinedDevices) {

  const result = {};

  if (!Array.isArray(combinedDevices)) {
    console.warn("❌ combinedDevices not array");
    return result;
  }

  combinedDevices.forEach(entry => {

    const dev = entry.device ? entry.device : entry;
    if (!dev) return;

    const city = normalizeCityName(dev.city || "Unknown");
    const status = (dev.status || "").toLowerCase();
    const type = TYPE_KEYS[(dev.type || "").toLowerCase()] || null;

    if (!result[city]) {
      result[city] = {
        city,
        total: 0,
        online: 0,
        offline: 0,
        counts: { camera: 0, archiver: 0, controller: 0, server: 0 },
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
    }
  });

  // Assign coordinates
  Object.values(result).forEach(c => {
    const coords = CITY_COORDS[c.city];
    if (coords) {
      c.lat = coords[0];
      c.lon = coords[1];
    } else {
      console.warn("⚠️ No coordinates for:", c.city);
    }
  });

  return result;
}

// ------------------ CREATE MARKER ------------------
function createCityMarker(cityStats) {

  const icon = L.divIcon({
    className: "city-marker",
    html: `
      <div class="city-pin">
        <i class="bi bi-geo-alt-fill"></i>
        <div class="city-count">${cityStats.total}</div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  const marker = L.marker([cityStats.lat, cityStats.lon], { icon });

  const tooltip = `
  <b>${cityStats.city}</b><br>
  Cameras: ${cityStats.counts.camera}<br>
  Archivers: ${cityStats.counts.archiver}<br>
  Controllers: ${cityStats.counts.controller}<br>
  Servers: ${cityStats.counts.server}<br>
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

  const cities = Object.values(data).sort((a, b) => b.total - a.total);

  cities.forEach(city => {

    const div = document.createElement("div");
    div.className = "city-item";

    div.innerHTML = `
      <strong>${city.city}</strong>
      <div>${city.total} Devices</div>
    `;

    div.onclick = () => {
      if (!city.lat) {
        alert(`No coordinates for ${city.city}`);
        return;
      }

      realMap.flyTo([city.lat, city.lon], 8);

      if (window._cityMarkerIndex[city.city]) {
        window._cityMarkerIndex[city.city].openPopup();
      }
    };

    panel.appendChild(div);
  });
}

// ------------------ MAIN FUNCTION ------------------
function updateMapFromCombined(combinedDevices) {

  if (!realMap || !window.cityMarkerLayer) {
    console.warn("⚠️ Map not initialized yet");
    return;
  }

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

  if (allCoords.length > 0) {
    realMap.fitBounds(allCoords, { padding: [50, 50] });
  } else {
    console.warn("⚠️ No valid coordinates to show");
  }
}

// ------------------ BUTTON CONTROLS ------------------
document.getElementById("fit-all")?.addEventListener("click", () => {
  const group = L.featureGroup(window.cityMarkerLayer.getLayers());
  realMap.fitBounds(group.getBounds(), { padding: [50, 50] });
});

document.getElementById("show-global")?.addEventListener("click", () => {
  realMap.setView([15, 0], 2.5);
});

document.getElementById("mapFullscreenBtn")?.addEventListener("click", () => {
  document.querySelector(".worldmap-card").classList.toggle("fullscreen");
  setTimeout(() => realMap.invalidateSize(), 300);
});

document.getElementById("mapCityOverviewBtn")?.addEventListener("click", () => {
  document.getElementById("region-panel").classList.toggle("open");
});

// ------------------ INIT ------------------
document.addEventListener("DOMContentLoaded", () => {

  initRealMap();

  const panel = document.getElementById("region-panel-content");
  if (panel) panel.innerHTML = "Waiting for data...";
});