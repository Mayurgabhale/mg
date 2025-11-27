in map 
in ths tool tooltip, 
    offline count show wrong, 
    can you chekc why showing this wrong count,
    for exampl in 
    panama; ther is no any offline device, 
    but in this show camers offline count is 2 but this is wrong count like  other ok 
read thsi below all code each line and find out the issue why show wrong offline count 
NOte: but in graph, we show alos offline device, but this data  is show correct ok 
  const ICONS = {
    camera: `<i class="bi bi-camera "></i>`,
    controller: `<i class="bi bi-hdd"></i>`,
    server: `<i class="fa-duotone fa-solid fa-server"></i>`,
    archiver: `<i class="fas fa-database"></i>`
  };

  let html = `
  <div style="font-family: Inter, Roboto, Arial, sans-serif; font-size:13px; display:inline-block; width:auto; max-width:240px;">
    <div style="font-weight:700; margin-bottom:6px; font-size:14px; white-space:nowrap;">${city.city}</div>
    <div style="font-weight:600; margin-bottom:8px;">${total}/<span style="color:#ff3b3b;">${offline}</span></div>
  `;

  const mapList = ["camera", "controller", "server", "archiver"];
  mapList.forEach(type => {
    const count = city.devices?.[type] || 0;
    if (count > 0) {
      html += `<div style="margin-bottom:4px; display:flex; align-items:center; gap:6px; font-size:10px;">${ICONS[type]} <span>${count}</span></div>`;
    }
  });
script.js 
 // Attach extras into the same structure updateSummary expects:
            if (!summary.summary) summary.summary = {};
            summary.summary.controllerExtras = controllerExtras;
            // Update UI and details
            updateSummary(summary);

            // ⬇️⬇️
            // Tell the map about new live counts if map exists
            if (typeof window.updateMapData === 'function') {
                window.updateMapData(summary, details);
            }

            if (JSON.stringify(details) !== JSON.stringify(deviceDetailsCache)) {
                updateDetails(details);
                deviceDetailsCache = details; // Update cache
            }
            latestDetails = details;
        })
/* ============================================================
   map.js — Updated: blinking pins for archiver/controller/server offline
   ============================================================ */
let realMap;
let CITY_LIST = []; // dynamically populated from API
let cityLayers = {}; // cityName -> { summaryMarker, deviceLayer }
let heatLayer = null;

window._mapRegionMarkers = [];

// Predefined coordinates for your cities (add/update as needed)
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


// ---------- ADD THIS (after CITY_COORDS) ----------
const CITY_PARENT_PATTERNS = [
  { patterns: [/^vilnius\b/i, /gama building/i, /delta building/i], parent: "Vilnius" },
  { patterns: [/^pune\b/i, /\bpune\b/i, /pune 2nd floor/i, /pune podium/i, /pune tower/i], parent: "Pune" }
];

function normalizeCityForMap(rawName) {
  if (!rawName) return "Unknown";
  const name = String(rawName).trim();

  for (const rule of CITY_PARENT_PATTERNS) {
    for (const p of rule.patterns) {
      if (p.test(name)) return rule.parent;
    }
  }

  if (name.includes(" - ")) return name.split(" - ")[0].trim();
  if (name.includes(",")) return name.split(",")[0].trim();
  return name;
}

// Ensure Vilnius coords exist (add if missing)
if (!CITY_COORDS["Vilnius"]) {
  CITY_COORDS["Vilnius"] = [54.6872, 25.2797];
}
if (!CITY_COORDS["Pune"]) {
  CITY_COORDS["Pune"] = [18.5204, 73.8567];
}

// ---------- END ADD ----------
/* ----------------------
   Helper: safe number parse
   ---------------------- */
function toNum(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}


/* ============================================================
   1. INIT MAP
   ============================================================ */
function initRealMap() {
  realMap = L.map('realmap', {
    preferCanvas: true,
    maxBounds: [
      [70, -135],
      [-60, 160]
    ],
    maxBoundsViscosity: 1.0,
    minZoom: 2.1,
    maxZoom: 20
  }).setView([15, 0], 2.4);

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    attribution: 'Tiles © Esri'
  }).addTo(realMap);

  window.markerCluster = L.markerClusterGroup({ chunkedLoading: true, showCoverageOnHover: false });
  window.countryLayerGroup = L.layerGroup().addTo(realMap);
  realMap.addLayer(window.markerCluster);
  L.control.scale().addTo(realMap);
}


/* ============================================================
   2. DEVICE ICON HELPERS
   ============================================================ */
function _deviceIconDiv(type) {
  const cls = `device-icon device-${type}`;
  return L.divIcon({ className: cls, iconSize: [14, 14], iconAnchor: [7, 7] });
}

function _placeDeviceIconsForCity(cityObj, deviceCounts, devicesListForCity = []) {
  if (!cityObj || toNum(cityObj.lat) === null || toNum(cityObj.lon) === null) {
    return;
  }

  if (!cityLayers[cityObj.city]) cityLayers[cityObj.city] = { deviceLayer: L.layerGroup().addTo(realMap), summaryMarker: null };
  const layer = cityLayers[cityObj.city].deviceLayer;
  layer.clearLayers();

  const deviceTypes = ['camera', 'controller', 'server', 'archiver'];
  deviceTypes.forEach(type => {
    const cnt = (deviceCounts && deviceCounts[type]) || 0;
    const displayCount = Math.min(cnt, 30);
    for (let i = 0; i < displayCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radiusDeg = 0.02 + Math.random() * 0.035;
      const lat = cityObj.lat + Math.cos(angle) * radiusDeg;
      const lon = cityObj.lon + Math.sin(angle) * radiusDeg;
      const marker = L.marker([lat, lon], { icon: _deviceIconDiv(type) });
      marker.bindTooltip(`${type.toUpperCase()} ${i + 1}`, { direction: 'top', offset: [0, -8], opacity: 0.95 });
      layer.addLayer(marker);
    }

    if (cnt > displayCount) {
      const moreHtml = `<div class="city-label-box" style="padding:6px 8px; font-size:12px; display:none;">${type}: ${cnt}</div>`;
      const labelLat = cityObj.lat + 0.045;
      const labelLon = cityObj.lon + (type === 'camera' ? 0.03 : (type === 'controller' ? -0.03 : 0));
      const labelMarker = L.marker([labelLat, labelLon], { icon: L.divIcon({ html: moreHtml, className: "" }) });
      layer.addLayer(labelMarker);
    }
  });
}

/* ============================================================
   3. CITY SUMMARY HTML
   ============================================================ */
function buildCitySummaryHTML(city) {
  const total = city.total || 0;

  const offline = (city.devicesList || []).reduce((acc, d) => {
    const s = ((d.status || d.state || '') + '').toLowerCase();
    if (s === 'offline' || s === 'down') return acc + 1;
    if (d.online === false) return acc + 1;
    return acc;
  }, 0);

  const ICONS = {
    camera: `<i class="bi bi-camera "></i>`,
    controller: `<i class="bi bi-hdd"></i>`,
    server: `<i class="fa-duotone fa-solid fa-server"></i>`,
    archiver: `<i class="fas fa-database"></i>`
  };

  let html = `
  <div style="font-family: Inter, Roboto, Arial, sans-serif; font-size:13px; display:inline-block; width:auto; max-width:240px;">
    <div style="font-weight:700; margin-bottom:6px; font-size:14px; white-space:nowrap;">${city.city}</div>
    <div style="font-weight:600; margin-bottom:8px;">${total}/<span style="color:#ff3b3b;">${offline}</span></div>
  `;

  const mapList = ["camera", "controller", "server", "archiver"];
  mapList.forEach(type => {
    const count = city.devices?.[type] || 0;
    if (count > 0) {
      html += `<div style="margin-bottom:4px; display:flex; align-items:center; gap:6px; font-size:10px;">${ICONS[type]} <span>${count}</span></div>`;
    }
  });

  const extraCounts = {};
  (city.devicesList || []).forEach(d => {
    const candidates = [d.type, d.product, d.deviceType, d.model];
    for (let v of candidates) {
      if (!v) continue;
      const name = String(v).trim();
      if (!name) continue;
      const low = name.toLowerCase();
      if (low.includes("camera") || low.includes("server") || low.includes("controller") || low.includes("archiver")) continue;
      extraCounts[name] = (extraCounts[name] || 0) + 1;
      break;
    }
  });
  Object.keys(extraCounts).forEach(key => {
    html += `<div style="margin-bottom:4px;">${key} ${extraCounts[key]}</div>`;
  });

  html += `</div>`;
  return html;
}


/* ============================================================
   4. placeCityMarkers — creates city markers
   ============================================================ */
function placeCityMarkers() {
  if (!window.cityMarkerLayer) window.cityMarkerLayer = L.layerGroup().addTo(realMap);
  window.cityMarkerLayer.clearLayers();

  CITY_LIST.forEach(c => {
    if (toNum(c.lat) === null || toNum(c.lon) === null) return;

    // compute blink classes from flags set in updateMapData
    const blinkClass = c.shouldBlink ? 'blink' : '';
    const severityClass = (c.blinkSeverity && c.blinkSeverity >= 3) ? ' blink-high' : '';

    const cityIconHtml = `<div><span class="pin ${blinkClass}${severityClass}"><i class="bi bi-geo-alt-fill"></i></span></div>`;
    const cityIcon = L.divIcon({
      className: 'city-marker',
      html: cityIconHtml,
      iconAnchor: [12, 12]
    });

    const marker = L.marker([c.lat, c.lon], { icon: cityIcon });

    // DEBUG: log blink status for each city (remove in production)
    console.log(`[placeCityMarkers] city="${c.city}" shouldBlink=${!!c.shouldBlink} severity=${c.blinkSeverity || 0}`);

    const getSummary = () => buildCitySummaryHTML(c);

    marker.on('mouseover', function () {
      marker.bindTooltip(getSummary(), {
        direction: 'top',
        offset: [0, -12],
        opacity: 1,
        permanent: false,
        className: 'city-summary-tooltip'
      }).openTooltip();
    });
    marker.on('mouseout', function () {
      try { marker.closeTooltip(); } catch (e) { }
    });
    marker.on('click', function () {
      marker.bindPopup(getSummary(), { maxWidth: 260 }).openPopup();
    });

    marker.addTo(window.cityMarkerLayer);
  });

  window.cityMarkerLayer.bringToFront();
}


/* ============================================================
   5. HEATMAP (unchanged)
   ============================================================ */
function drawHeatmap() {
  const totals = CITY_LIST
    .map(c => ({
      lat: toNum(c.lat),
      lon: toNum(c.lon),
      total: c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0
    }))
    .filter(x => x.lat !== null && x.lon !== null && x.total > 0);

  if (!totals.length) {
    if (heatLayer) {
      try { realMap.removeLayer(heatLayer); } catch (e) { }
      heatLayer = null;
    }
    return;
  }

  let maxTotal = Math.max(...totals.map(t => t.total), 1);
  const heatPoints = totals.map(t => [t.lat, t.lon, Math.min(1.5, (t.total / maxTotal) + 0.2)]);
  if (heatLayer) realMap.removeLayer(heatLayer);
  heatLayer = L.heatLayer(heatPoints, { radius: 40, blur: 25, gradient: { 0.2: '#34d399', 0.5: '#fbbf24', 0.8: '#f97316' } }).addTo(realMap);
}

function toggleHeat() {
  if (!heatLayer) return;
  if (realMap.hasLayer(heatLayer)) realMap.removeLayer(heatLayer);
  else realMap.addLayer(heatLayer);
}



// /* ============================================================
//    5. FIT ALL CITIES
//    ============================================================ */
function fitAllCities() {
  const validCoords = CITY_LIST
    .map(c => [toNum(c.lat), toNum(c.lon)])
    .filter(([lat, lon]) => lat !== null && lon !== null);

  if (!validCoords.length) return;
  const bounds = L.latLngBounds(validCoords);
  realMap.fitBounds(bounds.pad(0.25));
}

function populateGlobalCityList() {
  const panel = document.getElementById("region-panel-content");
  if (!panel) return;
  let html = `<h4></h4><hr>`;
  CITY_LIST.forEach((c, idx) => {
    const total = c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0;
    html += `<div class="city-item" data-city-index="${idx}">
                <div style="font-weight:700">${c.city}</div>
                <div class="small-muted">${c.region || '—'} • ${total} devices</div>
             </div>`;
  });
  panel.innerHTML = html;
  panel.querySelectorAll('.city-item').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.getAttribute('data-city-index'));
      const c = CITY_LIST[idx];
      if (c && toNum(c.lat) !== null && toNum(c.lon) !== null) realMap.flyTo([c.lat, c.lon], 7, { duration: 1.0 });
      populateCityPanel(c ? c.city : null);
    });
  });
}

function onCityItemClick(cityName) {
  const c = CITY_LIST.find(x => x.city === cityName);
  if (c && toNum(c.lat) !== null && toNum(c.lon) !== null) realMap.setView([c.lat, c.lon], 5, { animate: true });
  populateCityPanel(cityName);
}

function populateCityPanel(cityName) {
  const panel = document.getElementById("region-panel-content");
  const c = CITY_LIST.find(x => x.city === cityName);
  if (!panel || !c) return;
  const total = c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0;
  panel.innerHTML = `
    <h4 style="font-size: 12px;">${cityName} — ${total} devices</h4><hr>
    <div style="font-size: 10px;"><b>Camera:</b> ${c.devices.camera || 0}</div>
    <div style="font-size: 10px;"><b>Controller:</b> ${c.devices.controller || 0}</div>
    <div style="font-size: 10px;"><b>Server:</b> ${c.devices.server || 0}</div>
    <div style="font-size: 10px;"><b>Archiver:</b> ${c.devices.archiver || 0}</div>
  `;
}

function populateRegionPanel(region) {
  const panel = document.getElementById("region-panel-content");
  if (!panel) return;
  const cities = CITY_LIST.filter(c => c.region === region);
  let html = `<h4>${region} Region</h4><hr>`;
  cities.forEach((c, idx) => {
    const total = c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0;
    html += `<div class="city-item" data-city-index="${CITY_LIST.indexOf(c)}"><b>${c.city}</b> — ${total} devices</div>`;
  });
  panel.innerHTML = html;
  panel.querySelectorAll('.city-item').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.getAttribute('data-city-index'));
      const c = CITY_LIST[idx];
      if (c && toNum(c.lat) !== null && toNum(c.lon) !== null) realMap.flyTo([c.lat, c.lon], 7, { duration: 1.0 });
      populateCityPanel(c ? c.city : null);
    });
  });
}

function ensureUniqueCityCoordinates(cityArray) {
  const map = {};
  cityArray.forEach(c => {
    const lat = toNum(c.lat);
    const lon = toNum(c.lon);
    if (lat === null || lon === null) return;
    const key = `${lat.toFixed(6)}_${lon.toFixed(6)}`;
    if (!map[key]) map[key] = [];
    map[key].push(c);
  });
  Object.values(map).forEach(group => {
    if (group.length <= 1) return;
    const baseLat = toNum(group[0].lat);
    const baseLon = toNum(group[0].lon);
    if (baseLat === null || baseLon === null) return;
    const radius = 0.02;
    group.forEach((c, i) => {
      const angle = (2 * Math.PI * i) / group.length;
      c.lat = baseLat + Math.cos(angle) * radius;
      c.lon = baseLon + Math.sin(angle) * radius;
    });
  });
}

/* ============================================================
   7. GEOCODE MISSING CITIES (use local list)
   ============================================================ */
async function getCityCoordinates(cityName) {
  cityName = cityName.trim();
  if (CITY_COORDS[cityName]) return CITY_COORDS[cityName];
  console.warn("City not found in CITY_COORDS:", cityName);
  return null;
}

/* ============================================================
   8. UPDATE MAP DYNAMICALLY (MAIN)
   ============================================================ */
  //  this function is call in scrip.js file
async function updateMapData(summary, details) {
  try {
    if (!realMap || !details) return;

    const deviceBuckets = details.details || details;
    if (!deviceBuckets) return;

    const cityMap = {};
    Object.entries(deviceBuckets).forEach(([rawKey, arr]) => {
      if (!Array.isArray(arr)) return;
      arr.forEach(dev => {
        // const cityNameRaw = dev.city || dev.location || dev.site || "Unknown";
        // const cityName = (typeof cityNameRaw === 'string') ? cityNameRaw.trim() : String(cityNameRaw);
        // let lat = toNum(dev.lat);
        // let lon = toNum(dev.lon);

        // new:
        const cityNameRaw = dev.city || dev.location || dev.site || "Unknown";
        let cityNameCandidate = (typeof cityNameRaw === 'string') ? cityNameRaw.trim() : String(cityNameRaw);
        const cityName = normalizeCityForMap(cityNameCandidate);
        let lat = toNum(dev.lat);
        let lon = toNum(dev.lon);

        const keyLower = (rawKey || "").toLowerCase();
        const type = keyLower.includes("camera") ? "camera" :
          keyLower.includes("controller") ? "controller" :
            keyLower.includes("server") ? "server" :
              keyLower.includes("archiver") ? "archiver" : null;

        if (!cityMap[cityName]) cityMap[cityName] = {
          city: cityName,
          lat: (lat !== null ? lat : null),
          lon: (lon !== null ? lon : null),
          devices: { camera: 0, controller: 0, server: 0, archiver: 0 },
          offline: { camera: 0, controller: 0, server: 0, archiver: 0 },
          total: 0,
          devicesList: [],
          region: dev.region || dev.zone || null
        };

        if (type) cityMap[cityName].devices[type] += 1;
        cityMap[cityName].total += 1;
        cityMap[cityName].devicesList.push(dev);

        if (lat !== null && lon !== null) {
          cityMap[cityName].lat = lat;
          cityMap[cityName].lon = lon;
        }

        const s = ((dev.status || dev.state || '') + '').toLowerCase();
        const isOffline = (s === 'offline' || s === 'down' || dev.online === false);
        if (isOffline && type) {
          cityMap[cityName].offline[type] = (cityMap[cityName].offline[type] || 0) + 1;
        }
      });
    });

    // populate CITY_LIST (array)
    CITY_LIST = Object.values(cityMap);

    // geocode missing coords
    for (let c of CITY_LIST) {
      if (toNum(c.lat) === null || toNum(c.lon) === null) {
        const coords = await getCityCoordinates(c.city);
        if (coords && coords.length === 2) {
          c.lat = coords[0];
          c.lon = coords[1];
        } else {
          c.lat = null;
          c.lon = null;
        }
      }
    }

    // ensure unique coords
    ensureUniqueCityCoordinates(CITY_LIST);

    // --- IMPORTANT: compute shouldBlink and severity here (after CITY_LIST built) ---
    CITY_LIST.forEach(c => {
      const a = (c.offline && c.offline.archiver) || 0;
      const ctrl = (c.offline && c.offline.controller) || 0;
      const srv = (c.offline && c.offline.server) || 0;
      c.shouldBlink = (a + ctrl + srv) > 0;
      c.blinkSeverity = Math.min(5, a + ctrl + srv); // scale 0..5
    });

    // Place device icons & device layers
    CITY_LIST.forEach(c => {
      if (!cityLayers[c.city]) cityLayers[c.city] = { deviceLayer: L.layerGroup().addTo(realMap), summaryMarker: null };
      cityLayers[c.city].deviceLayer.clearLayers();
      _placeDeviceIconsForCity(c, c.devices, c.devicesList);
    });

    drawHeatmap();
    populateGlobalCityList();
    drawRegionBadges && drawRegionBadges();

  } catch (err) {
    console.error("updateMapData error", err);
  }

  // redraw UI overlays and markers
  drawCityBarChart && drawCityBarChart();
  placeCityMarkers();
  fitAllCities();
}


// /* ============================================================
//    10. EXPORTS / BUTTON HOOKS
//    - hookup all event listeners after DOM ready to avoid null refs
//    ============================================================ */
// ⬇️⬇️ two times
document.addEventListener("DOMContentLoaded", () => {
  initRealMap();

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

const fullscreenBtn = document.getElementById("mapFullscreenBtn");
const mapCard = document.querySelector(".worldmap-card");
let isFullscreen = false;

fullscreenBtn.addEventListener("click", () => {
  isFullscreen = !isFullscreen;

  if (isFullscreen) {
    mapCard.classList.add("fullscreen");
    document.body.classList.add("map-fullscreen-active");
    fullscreenBtn.innerText = "✖ Exit Full";
  } else {
    mapCard.classList.remove("fullscreen");
    document.body.classList.remove("map-fullscreen-active");
    fullscreenBtn.innerText = "⛶ View Full";
  }

  // VERY IMPORTANT: tell Leaflet the map size changed
  setTimeout(() => {
    realMap.invalidateSize(true);
  }, 300); // wait for CSS animation to finish
});



document.getElementById("mapCityOverviewBtn").addEventListener("click", function () {
  const panel = document.getElementById("region-panel");

  if (panel.style.display === "block") {
    panel.style.display = "none";
  } else {
    panel.style.display = "block";
  }
});

C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\script.js

// C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\script.js
// const baseUrl = "http://localhost:80/api/regions";
const baseUrl = "http://10.138.161.4:3000/api/regions";
let refreshInterval = 300000; // 5 minutes
let pingInterval = 60000; // 30 seconds
let countdownTime = refreshInterval / 1000; // Convert to seconds
let currentRegion = "global";
let deviceDetailsCache = {}; // Store previous details to prevent redundant updates
let latestDetails = null; // Cache the latest fetched details




// Controller cache (populated inside fetchData)
window.controllerDataCached = null; // <-- ADDED: global cache for controllers

document.addEventListener("DOMContentLoaded", () => {
    // ⬇️⬇️ this is call from graph.js
    initOfflineChart()
    fetchData("global"); // Load initial data
    startAutoRefresh("global");



    // Attach Door click
    const doorCard = document.getElementById("door-card");
    if (doorCard) {
        doorCard.style.cursor = "pointer";
        doorCard.title = "Click to view Controllers";
        doorCard.addEventListener("click", loadControllersInDetails);
    }


    document.querySelectorAll(".region-button").forEach((button) => {
        button.addEventListener("click", () => {
            const region = button.getAttribute("data-region");
            document.getElementById("region-title").textContent = `${region.toUpperCase()} Summary`;
            switchRegion(region);
        });
    });

    document.getElementById("close-modal").addEventListener("click", () => {
        document.getElementById("modal").style.display = "none";
    });


    // ---------------------------
    // NEW: Summary card click/dblclick filter behavior
    // Single click: set device-filter to that type and trigger change (show only that type)
    // Double click: set device-filter to 'all' and trigger change (show all)
    // ---------------------------

    (function attachSummaryCardFilterHandlers() {
        const summaryCards = document.querySelectorAll(".summary .card");
        if (!summaryCards || summaryCards.length === 0) return;

        // helper: derive deviceFilter value from card title text
        function mapCardTitleToFilterValue(title) {
            if (!title) return "all";
            const t = title.toLowerCase();

            if (t.includes("camera")) return "cameras";
            if (t.includes("archiver")) return "archivers";
            if (t.includes("controller")) return "controllers";
            if (t.includes("ccure")) return "servers";       // CCURE servers
            if (t.includes("db")) return "dbdetails";        // DB servers
            if (t.includes("desktop")) return "pcdetails";
            if (t.includes("total")) return "all";

            return "all";
        }

        document.addEventListener("DOMContentLoaded", () => {
            const doorCard = document.getElementById("door-card");
            if (doorCard) {
                doorCard.style.cursor = "pointer";
                doorCard.title = "Click to view Controllers";
                doorCard.addEventListener("click", loadControllersInDetails);
            }
        });



        summaryCards.forEach((card) => {
            // make interactive
            card.style.cursor = "pointer";

            let clickTimer = null;
            const clickDelay = 100; // ms


            card.addEventListener("click", (ev) => {
                if (clickTimer) clearTimeout(clickTimer);
                clickTimer = setTimeout(() => {
                    const h3 = card.querySelector("h3");
                    const titleText = h3 ? h3.innerText.trim() : card.innerText.trim();
                    const filterValue = mapCardTitleToFilterValue(titleText);

                    const deviceFilterElem = document.getElementById("device-filter");
                    if (!deviceFilterElem) return;

                    deviceFilterElem.value = filterValue;
                    deviceFilterElem.dispatchEvent(new Event("change", { bubbles: true }));

                    // 🔥 Highlight clicked card, remove from others
                    document.querySelectorAll(".summary .card").forEach(c => c.classList.remove("active"));
                    if (filterValue !== "all") {
                        card.classList.add("active");
                    }
                }, clickDelay);
            });

            card.addEventListener("dblclick", (ev) => {
                if (clickTimer) {
                    clearTimeout(clickTimer);
                    clickTimer = null;
                }
                const deviceFilterElem = document.getElementById("device-filter");
                if (!deviceFilterElem) return;

                deviceFilterElem.value = "all";
                deviceFilterElem.dispatchEvent(new Event("change", { bubbles: true }));

                // 🔥 Remove all highlights on double-click (reset)
                document.querySelectorAll(".summary .card").forEach(c => c.classList.remove("active"));
            });



        });
    })();



});

// // --- Camera URL auto-detect helpers ---

function buildUrlFromHints(ip, cameraname = "", hyperlink = "") {
    ip = (ip || "").trim();
    hyperlink = (hyperlink || "").trim();

    // 🔑 Always prefer Excel's hyperlink if present
    if (hyperlink && /^https?:\/\//.test(hyperlink)) {
        return hyperlink;
    }

    // Direct IP
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
        return `http://${ip}`;
    }

    // Brand-based fallback
    const name = (cameraname || "").toLowerCase();
    if (/\bverkada\b/.test(name)) return `https://${ip}/#/login`;
    if (/\bflir\b/.test(name)) return `http://${ip}/control/userimage.html`;
    if (/\bhoneywell\b/.test(name)) return `http://${ip}/www/index.html`;
    if (/axis/.test(name)) return `http://${ip}/view/view.shtml`;

    return `http://${ip}`;
}

function openCamera(ip, name, hyperlink = "") {
    const url = buildUrlFromHints(ip, name, hyperlink);
    console.log("Opening URL:", url);  // Debug
    window.open(url, "_blank", "noopener");
}





function switchRegion(region) {
    clearExistingIntervals(); // Avoid interval duplication
    currentRegion = region;
    deviceDetailsCache = {};
    fetchData(region);
    startAutoRefresh(region);
}

// **Auto-refresh mechanism**
function startAutoRefresh(regionName) {
    fetchData(regionName); // Fetch initial data

    clearExistingIntervals();

    // Start countdown timer
    window.countdownTimer = setInterval(() => {
        document.getElementById("countdown").innerText = `Refreshing in ${countdownTime} seconds`;
        countdownTime--;
        if (countdownTime < 0) countdownTime = refreshInterval / 1000;
    }, 1000);

    // Refresh summary & details every 5 minutes
    window.refreshTimer = setInterval(() => {
        fetchData(regionName);
        countdownTime = refreshInterval / 1000;
    }, refreshInterval);

    // Ping devices every 30 seconds using history API
    window.pingTimer = setInterval(() => {
        pingAllDevices(regionName);
    }, pingInterval);
}

function clearExistingIntervals() {
    clearInterval(window.countdownTimer);
    clearInterval(window.refreshTimer);
    clearInterval(window.pingTimer);
}

// **Fetch summary and details together**





// Fetch summary, details and controllers together
function fetchData(regionName) {
    Promise.all([
        fetch(`${baseUrl}/summary/${regionName}`).then(res => res.json()),
        fetch(`${baseUrl}/details/${regionName}`).then(res => res.json()),
        // fetch(`http://localhost/api/controllers/status`).then(res => res.json()) // <-- controllers endpoint
        fetch(`http://10.138.161.4:3000/api/controllers/status`).then(res => res.json()) // <-- controllers endpoint
    ])
        .then(([summary, details, controllerData]) => {
            console.log("Summary Data:", summary);
            console.log("Details Data:", details);
            console.log("Controller Data:", controllerData);

            // Cache full controller data for reuse (keep unfiltered copy)
            if (Array.isArray(controllerData)) {
                window.controllerDataCached = controllerData; // full cache
            } else {
                window.controllerDataCached = null;
            }

            // Build controllers list filtered by the requested region (so summary reflects region)
            let controllersForRegion = Array.isArray(controllerData) ? controllerData.slice() : [];
            try {
                const regionLower = (regionName || "global").toString().toLowerCase();
                if (regionLower !== "global") {
                    controllersForRegion = controllersForRegion.filter(c => {
                        const loc = (c.Location || c.location || "").toString().toLowerCase();
                        // also allow matching by City if you ever pass city as region
                        const city = (c.City || c.city || "").toString().toLowerCase();
                        return loc === regionLower || city === regionLower;
                    });
                }
            } catch (e) {
                // fallback: keep full list if something goes wrong
                controllersForRegion = Array.isArray(controllerData) ? controllerData.slice() : [];
            }

            // Compute door + reader summary from controllers API but using region-filtered controllers
            const controllerExtras = processDoorAndReaderData(controllersForRegion);

            // Attach extras into the same structure updateSummary expects:
            if (!summary.summary) summary.summary = {};
            summary.summary.controllerExtras = controllerExtras;
            // Update UI and details
            updateSummary(summary);

            // ⬇️⬇️
            // Tell the map about new live counts if map exists
            if (typeof window.updateMapData === 'function') {
                window.updateMapData(summary, details);
            }

            if (JSON.stringify(details) !== JSON.stringify(deviceDetailsCache)) {
                updateDetails(details);
                deviceDetailsCache = details; // Update cache
            }
            latestDetails = details;
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function updateSummary(data) {
    const summary = data.summary || {};

    // ✅ Always keep last known values if new data doesn’t have them
    window.lastSummary = window.lastSummary || {};
    const merged = {
        totalDevices: summary.totalDevices ?? window.lastSummary.totalDevices ?? 0,
        totalOnlineDevices: summary.totalOnlineDevices ?? window.lastSummary.totalOnlineDevices ?? 0,
        totalOfflineDevices: summary.totalOfflineDevices ?? window.lastSummary.totalOfflineDevices ?? 0,

        cameras: { ...window.lastSummary.cameras, ...summary.cameras },
        archivers: { ...window.lastSummary.archivers, ...summary.archivers },
        controllers: { ...window.lastSummary.controllers, ...summary.controllers },
        servers: { ...window.lastSummary.servers, ...summary.servers },
        pcdetails: { ...window.lastSummary.pcdetails, ...summary.pcdetails },
        dbdetails: { ...window.lastSummary.dbdetails, ...summary.dbdetails },

        // 🆕 door/reader extras merged (summary.controllerExtras is created in fetchData)
        controllerExtras: { ...window.lastSummary.controllerExtras, ...summary.controllerExtras }
    };


    // 🆕 Recalculate totals to include Door counts (but not Readers)
    const doors = merged.controllerExtras?.doors || { total: 0, online: 0, offline: 0 };

    // Recompute totals including doors
    merged.totalDevices =
        (merged.cameras?.total || 0) +
        (merged.archivers?.total || 0) +
        (merged.controllers?.total || 0) +
        (merged.servers?.total || 0) +
        (merged.pcdetails?.total || 0) +
        (merged.dbdetails?.total || 0) +
        doors.total; // ✅ include doors only

    merged.totalOnlineDevices =
        (merged.cameras?.online || 0) +
        (merged.archivers?.online || 0) +
        (merged.controllers?.online || 0) +
        (merged.servers?.online || 0) +
        (merged.pcdetails?.online || 0) +
        (merged.dbdetails?.online || 0) +
        doors.online; // ✅ include doors only

    merged.totalOfflineDevices =
        merged.totalDevices - merged.totalOnlineDevices;




    // ✅ Save merged result for next refresh
    window.lastSummary = merged;

    // Update UI safely
    document.getElementById("total-devices").textContent = merged.totalDevices;
    document.getElementById("online-devices").textContent = merged.totalOnlineDevices;
    document.getElementById("offline-devices").textContent = merged.totalOfflineDevices;

    document.getElementById("camera-total").textContent = merged.cameras?.total || 0;
    document.getElementById("camera-online").textContent = merged.cameras?.online || 0;
    document.getElementById("camera-offline").textContent = merged.cameras?.offline || 0;

    document.getElementById("archiver-total").textContent = merged.archivers?.total || 0;
    document.getElementById("archiver-online").textContent = merged.archivers?.online || 0;
    document.getElementById("archiver-offline").textContent = merged.archivers?.offline || 0;

    document.getElementById("controller-total").textContent = merged.controllers?.total || 0;
    document.getElementById("controller-online").textContent = merged.controllers?.online || 0;
    document.getElementById("controller-offline").textContent = merged.controllers?.offline || 0;

    document.getElementById("server-total").textContent = merged.servers?.total || 0;
    document.getElementById("server-online").textContent = merged.servers?.online || 0;
    document.getElementById("server-offline").textContent = merged.servers?.offline || 0;

    // ✅ Fix for Desktop and DB Server
    document.getElementById("pc-total").textContent = merged.pcdetails?.total || 0;
    document.getElementById("pc-online").textContent = merged.pcdetails?.online || 0;
    document.getElementById("pc-offline").textContent = merged.pcdetails?.offline || 0;

    document.getElementById("db-total").textContent = merged.dbdetails?.total || 0;
    document.getElementById("db-online").textContent = merged.dbdetails?.online || 0;
    document.getElementById("db-offline").textContent = merged.dbdetails?.offline || 0;


    // ✅  new for Door and Reader 
    

    // //////////////////////////////////


    // ====== Door / Reader card updates (from controllers API) ======
    const extras = merged.controllerExtras || {};

    // Prefer the combined doorReader-* IDs (your summary card)
    const doorTotalEl = document.getElementById("doorReader-total");
    const doorOnlineEl = document.getElementById("doorReader-online");
    const doorOfflineEl = document.getElementById("doorReader-offline");

    // Also mirror IDs expected by graph.js / other scripts (safe to set only if they exist)
    const doorOnlineAlt = document.getElementById("door-online");
    const doorOfflineAlt = document.getElementById("door-offline");

    const readerTotalEl = document.getElementById("reader-total-inline");
    const readerOnlineEl = document.getElementById("reader-online-inline");
    const readerOfflineEl = document.getElementById("reader-offline-inline");

    // Also mirror IDs expected by graph.js
    const readerOnlineAlt = document.getElementById("reader-online");
    const readerOfflineAlt = document.getElementById("reader-offline");

    if (extras.doors) {
        if (doorTotalEl) doorTotalEl.textContent = extras.doors.total || 0;
        if (doorOnlineEl) doorOnlineEl.textContent = extras.doors.online || 0;
        if (doorOfflineEl) doorOfflineEl.textContent = extras.doors.offline || 0;

        // mirror
        if (doorOnlineAlt) doorOnlineAlt.textContent = extras.doors.online || 0;
        if (doorOfflineAlt) doorOfflineAlt.textContent = extras.doors.offline || 0;
    } else {
        if (doorTotalEl) doorTotalEl.textContent = 0;
        if (doorOnlineEl) doorOnlineEl.textContent = 0;
        if (doorOfflineEl) doorOfflineEl.textContent = 0;

        if (doorOnlineAlt) doorOnlineAlt.textContent = 0;
        if (doorOfflineAlt) doorOfflineAlt.textContent = 0;
    }

    if (extras.readers) {
        if (readerTotalEl) readerTotalEl.textContent = extras.readers.total || 0;
        if (readerOnlineEl) readerOnlineEl.textContent = extras.readers.online || 0;
        if (readerOfflineEl) readerOfflineEl.textContent = extras.readers.offline || 0;

        // mirror
        if (readerOnlineAlt) readerOnlineAlt.textContent = extras.readers.online || 0;
        if (readerOfflineAlt) readerOfflineAlt.textContent = extras.readers.offline || 0;
    } else {
        if (readerTotalEl) readerTotalEl.textContent = 0;
        if (readerOnlineEl) readerOnlineEl.textContent = 0;
        if (readerOfflineEl) readerOfflineEl.textContent = 0;

        if (readerOnlineAlt) readerOnlineAlt.textContent = 0;
        if (readerOfflineAlt) readerOfflineAlt.textContent = 0;
    }

    // ⬇️⬇️ this is call from graph.js
    // --- Immediately refresh gauges/total-chart so UI updates right away after filtering ---
    if (typeof renderGauges === "function") {
        try { renderGauges(); } catch (e) { console.warn("renderGauges failed:", e); }
    }
    if (typeof updateTotalCountChart === "function") {
        try { updateTotalCountChart(); } catch (e) { console.warn("updateTotalCountChart failed:", e); }
    }


}
          }

                    // Apply city filter if any (match City OR Location)
                    if (cityFilterLower !== "all") {
                        const ctrlCity = (ctrl.City || ctrl.city || "").toString().toLowerCase();
                        const ctrlLocation = (ctrl.Location || ctrl.location || "").toString().toLowerCase();

                        // Match either City OR Location
                        if (ctrlCity !== cityFilterLower && ctrlLocation !== cityFilterLower) return;
                    }

                    // Apply status filter if any (match controllerStatus)
                    if (statusFilterLower !== "all") {
                        const ctrlStatus = (ctrl.controllerStatus || ctrl.status || "").toString().toLowerCase();
                        if (ctrlStatus !== statusFilterLower) return;
                    }

                    // Count doors/readers for this controller
                    ctrl.Doors.forEach(d => {
                        result.doors.total++;
                        if ((d.status || "").toString().toLowerCase() === "online") result.doors.online++;

                        if (d.Reader && d.Reader.toString().trim() !== "") {
                            result.readers.total++;
                            if ((d.status || "").toString().toLowerCase() === "online") result.readers.online++;
                        }
                    });
                });

                result.doors.offline = result.doors.total - result.doors.online;
                result.readers.offline = result.readers.total - result.readers.online;
                return result;
            }

            // new -----



            function filterDevices() {
                const selectedType = deviceFilter.value;
                const selectedStatus = document.querySelector(".status-filter.active")?.dataset.status || "all";
                const selectedCity = cityFilter.value;
                const vendorFilterLabel = document.getElementById("vendorFilterLabel");

                // toggle vendor UI
                vendorFilter.style.display = (deviceFilter.value === "cameras") ? "block" : "none";
                if (vendorFilterLabel) {
                    vendorFilterLabel.style.display = vendorFilter.style.display;
                }

                // get vendor selection (if filter exists)
                const vendorFilterElem = document.getElementById("vendorFilter");
                const selectedVendor = vendorFilterElem ? vendorFilterElem.value : "all";

                // Search bar input
                const searchTerm = document.getElementById("device-search").value.toLowerCase();

                // Show/hide vendor filter based on type
                if (vendorFilterElem) {
                    vendorFilterElem.style.display = (selectedType === "cameras") ? "block" : "none";
                }

                detailsContainer.innerHTML = "";

                const filteredDevices = allDevices.filter((device) =>
                    (selectedType === "all" || device.dataset.type === selectedType) &&
                    (selectedStatus === "all" || device.dataset.status === selectedStatus) &&
                    (selectedCity === "all" || device.dataset.city === selectedCity) &&
                    (selectedVendor === "all" || (device.dataset.vendor || "") === selectedVendor) &&
                    (
                        !searchTerm ||
                        device.innerText.toLowerCase().includes(searchTerm)
                    )
                );

                filteredDevices.forEach((deviceCard) => {
                    detailsContainer.appendChild(deviceCard);
                });

                const region = currentRegion?.toUpperCase() || "GLOBAL";
                const titleElement = document.getElementById("region-title");

                const logoHTML = `
                    <span class="region-logo">
                        <a href="http://10.199.22.57:3014/" class="tooltip">
                            <i class="fa-solid fa-house"></i>
                            <span class="tooltiptext">Dashboard Hub</span>
                        </a>
                    </span>
                    `;
                if (selectedCity !== "all") {
                    titleElement.innerHTML = `${logoHTML}<span>${region}, ${selectedCity} Summary</span>`;
                } else {
                    titleElement.innerHTML = `${logoHTML}<span>${region} Summary</span>`;
                }


                const filteredSummaryDevices = deviceObjects.filter((deviceObj, index) => {
                    const correspondingCard = allDevices[index];
                    return (
                        (selectedType === "all" || correspondingCard.dataset.type === selectedType) &&
                        (selectedStatus === "all" || correspondingCard.dataset.status === selectedStatus) &&
                        (selectedCity === "all" || correspondingCard.dataset.city === selectedCity) &&
                        (selectedVendor === "all" || (correspondingCard.dataset.vendor || "") === selectedVendor)
                    );
                });
                const offlineDevices = filteredSummaryDevices
                    .filter(d => d.status === "offline")
                    .map(d => ({
                        name: d.name || "Unknown",
                        ip: d.ip,
                        city: d.city,
                        type: d.type,
                        lastSeen: new Date().toISOString()
                    }));

                    // ⬇️⬇️ this is call from graph.js
                if (window.updateOfflineChart) {
                    window.updateOfflineChart(offlineDevices);
                }

                const summary = calculateCitySummary(filteredSummaryDevices);

                // --- NEW: compute controller door/reader counts for the current filters ---
                // We pass selectedCity and selectedStatus so door counts reflect the active filters.
                const controllerExtrasFiltered = computeFilteredControllerExtras(selectedCity, selectedStatus);
                if (!summary.summary) summary.summary = {};
                summary.summary.controllerExtras = controllerExtrasFiltered;

                updateSummary(summary);
            }

            function calculateCitySummary(devices) {
                const summary = {
                    summary: {
                        totalDevices: devices.length,
                        totalOnlineDevices: devices.filter(d => d.status === "online").length,
                        totalOfflineDevices: devices.filter(d => d.status === "offline").length,
                        cameras: { total: 0, online: 0, offline: 0 },
                        archivers: { total: 0, online: 0, offline: 0 },
                        controllers: { total: 0, online: 0, offline: 0 },
                        servers: { total: 0, online: 0, offline: 0 },
                        pcdetails: { total: 0, online: 0, offline: 0 },
                        dbdetails: { total: 0, online: 0, offline: 0 }
                    }
                };

                devices.forEach((device) => {
                    if (!summary.summary[device.type]) return;
                    summary.summary[device.type].total += 1;
                    if (device.status === "online") summary.summary[device.type].online += 1;
                    else summary.summary[device.type].offline += 1;
                });
