this is my map code,
ok wright now we are getting all dynamic data form script.js file
but i wnt to gett data for my summary file ok 
so how to gett this data, 
read the belwo summary file alos, 
and give me update map code, ok 
how to do step step ok 
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


const CITY_PARENT_PATTERNS = [
  { patterns: [/^vilnius\b/i, /gama building/i, /delta building/i], parent: "Vilnius" },
  { patterns: [/^pune\b/i, /\bpune\b/i, /pune 2nd floor/i, /pune podium/i, /pune tower/i], parent: "Pune" }
];

function isDeviceOffline(dev) {
  if (!dev) return false;
  const s = ((dev.status || dev.state || '') + '').toString().trim().toLowerCase();
  if (s === 'offline' || s === 'down') return true;
  if (typeof dev.online === 'boolean' && dev.online === false) return true;
  return false;
}

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



  const offline = Object.values(city.offline || {}).reduce((acc, v) => acc + (v || 0), 0);

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
    const off = city.offline?.[type] || 0;
    if (count > 0) {
      html += `<div style="margin-bottom:4px; display:flex; align-items:center; gap:6px; font-size:10px;">
               ${ICONS[type]} <span>${count}</span>
               ${off ? `<span style="color:#ff3b3b; margin-left:6px">(${off} offline)</span>` : ''}
             </div>`;
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
  // drawCityBarChart && drawCityBarChart();
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



C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\summary.js


// C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\summary.js

let deviceUptimeTimers = {};
let deviceDowntimeTimers = {};

// Utility to turn an IP (or any string) into a safe DOM-ID fragment
function sanitizeId(str) {
    return (str || '').replace(/[^a-zA-Z0-9]/g, '_');
}

// Map device arrays to human-friendly singular category names
const deviceTypeMap = {
    cameras: 'Camera',
    archivers: 'Archiver',
    controllers: 'Controller',
    servers: 'Server',
    pcDetails: 'Desktop',
    DBDetails: 'DB Server'
};

function getDeviceName(dev, type) {
    // preserve previous logic where possible but handle pcDetails/DBDetails
    if (type === 'pcDetails') return dev.pc_name || dev.hostname || dev.name || 'Unknown';
    if (type === 'DBDetails') return dev.application || dev.hostname || dev.name || 'Unknown';
    // fallback for other device types - original code tried e.g. cameraname etc.
    return dev[(type.slice(0, -1)) + 'name'] || dev.hostname || dev.name || 'Unknown';
}

function fetchDeviceData() {
    const selectedRegion = document.getElementById('region').value;

    if (selectedRegion === 'All') {
        // fetch(`http://localhost/api/regions/all-details`)
        fetch(`http://10.138.161.4:3000/api/regions/all-details`)
            .then(res => res.json())
            .then(allRegionsData => {
                // include pcDetails and DBDetails while keeping previous logic identical
                let combinedDetails = { cameras: [], archivers: [], controllers: [], servers: [], pcDetails: [], DBDetails: [] };
                Object.values(allRegionsData).forEach(regionData => {
                    if (regionData.details) {
                        ['cameras', 'archivers', 'controllers', 'servers', 'pcDetails', 'DBDetails'].forEach(type => {
                            combinedDetails[type].push(...(regionData.details[type] || []));
                        });
                    }
                });
                fetchDeviceHistory(combinedDetails);
            })
            .catch(err => console.error('Error fetching all regions data:', err));
    } else {

        // fetch(`http://localhost/api/regions/details/${selectedRegion}`)
        fetch(`http://10.138.161.4:3000/api/regions/details/${selectedRegion}`)
            .then(res => res.json())


            // inside fetchDeviceData(), in the selectedRegion !== 'All' branch
            .then(regionData => {
                const d = regionData.details || {};
                const total = (d.cameras?.length || 0) + (d.archivers?.length || 0) + (d.controllers?.length || 0) + (d.servers?.length || 0) + (d.pcDetails?.length || 0) + (d.DBDetails?.length || 0);
                const online = ([...(d.cameras || []), ...(d.archivers || []), ...(d.controllers || []), ...(d.servers || []), ...(d.pcDetails || []), ...(d.DBDetails || [])]
                    .filter(dev => dev.status === "Online").length);

                const setWithIcon = (id, iconClass, label, value, colorClass = "") => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.innerHTML = `<i class="${iconClass}"></i> ${label}: <span class="${colorClass}" style="font-weight: 700;">${value}</span>`;
                    }
                };

                // Update UI
                setWithIcon("total-devices", "fas fa-network-wired", "Total Devices", total, "text-green");
                setWithIcon("total-online", "fas fa-signal", "Online Devices", online, "text-green");
                setWithIcon("total-cameras", "fas fa-video", "Total Cameras", d.cameras?.length || 0, "text-green");
                setWithIcon("total-controllers", "fas fa-microchip", "Total Controllers", d.controllers?.length || 0, "text-green");
                setWithIcon("total-archivers", "fas fa-database", "Total Archivers", d.archivers?.length || 0, "text-green");
                setWithIcon("total-servers", "fas fa-server", "Total Servers", d.servers?.length || 0, "text-green");
                setWithIcon("total-pcs", "fas fa-desktop", "Total Desktop", d.pcDetails?.length || 0, "text-green");
                setWithIcon("total-dbs", "fas fa-database", "Total DB Server", d.DBDetails?.length || 0, "text-green");

                // Save the authoritative region totals so filterData() can keep them
                window.regionSummary = {
                    totalDevices: total,
                    totalOnline: online,
                    totalCameras: d.cameras?.length || 0,
                    totalControllers: d.controllers?.length || 0,
                    totalArchivers: d.archivers?.length || 0,
                    totalServers: d.servers?.length || 0,
                    totalPCs: d.pcDetails?.length || 0,
                    totalDBs: d.DBDetails?.length || 0
                };

                // then fetch history and build table
                fetchDeviceHistory(d);
            })




            .catch(err => console.error('Error fetching device data:', err));
    }
}



function fetchDeviceHistory(details) {
    // fetch(`http://localhost/api/devices/history`)
    fetch(`http://10.138.161.4:3000/api/devices/history`)
        .then(res => res.json())
        .then(historyData => {
            // set global first to avoid race when user clicks fast
            window.deviceHistoryData = historyData;
            populateDeviceTable(details, historyData);
        })
        .catch(err => console.error('Error fetching device history:', err));
}


function populateDeviceTable(details, historyData) {
    const tbody = document.getElementById('device-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    let list = [];

    // include PC and DB types alongside existing ones — keep previous logic unchanged otherwise
    ['cameras', 'archivers', 'controllers', 'servers', 'pcDetails', 'DBDetails'].forEach(type => {
        details[type]?.forEach(dev => {
            const ip = dev.ip_address;
            const safe = sanitizeId(ip);
            const name = getDeviceName(dev, type);
            const category = deviceTypeMap[type] || (type.slice(0, -1).toUpperCase());
            const region = dev.location || 'Unknown';
            const city = dev.city || 'Unknown';
            const hist = filterHistoryForDisplay(historyData[ip] || [], category.toUpperCase());
            const current = dev.status || (hist.length ? hist[hist.length - 1].status : 'Unknown');
            const downCount = hist.filter(e => e.status === 'Offline').length;

            if (current === 'Offline' || downCount > 15) {
                list.push({ ip, safe, name, category, region, city, current, hist, downCount, remark: dev.remark || '' });
            }
        });
    });

    // ✅ Populate the City Filter using the list
    const cityFilter = document.getElementById('cityFilter');
    if (cityFilter) {
        const uniqueCities = [...new Set(list.map(dev => dev.city).filter(Boolean))].sort();
        cityFilter.innerHTML = '<option value="all">All Cities</option>';
        uniqueCities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            cityFilter.appendChild(option);
        });

        // Ensure listener is only added once
        if (!cityFilter.dataset.listenerAdded) {
            cityFilter.addEventListener('change', filterData);
            cityFilter.dataset.listenerAdded = 'true';
        }
    }

    // Sort and count
    list.sort((a, b) => b.downCount - a.downCount);
    const downtimeOver15Count = list.filter(d => d.downCount > 15).length;
    const currentlyOfflineCount = list.filter(d => d.current === 'Offline').length;
    const setIf = (id, txt) => { const el = document.getElementById(id); if (el) el.innerText = txt; };
    setIf('count-downtime-over-15', `Devices with >15 downtimes: ${downtimeOver15Count}`);
    setIf('count-currently-offline', `Devices currently Offline: ${currentlyOfflineCount}`);

    if (!list.length) {
        const row = tbody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 10;
        cell.textContent = "No devices found";
        cell.style.textAlign = "center";
        cell.style.fontWeight = "bold";
        updateDisplayedDeviceCount(0);
        return;
    }

    list.forEach((dev, idx) => {
        const row = tbody.insertRow();
        row.classList.add(dev.current === 'Offline' ? 'row-offline' : dev.current === 'Online' ? 'row-online' : 'row-repair');
        row.style.border = "1px solid black";
        row.innerHTML = `
            <td>${idx + 1}</td>
            <td><span onclick="copyText('${dev.ip}')" style="cursor:pointer;">${dev.ip}</span></td>
            <td><span onclick="copyText('${dev.name}')" style="cursor:pointer;">${dev.name}</span></td>
            <td>${dev.category}</td>
            <td>${dev.region}</td>
            <td>${dev.city}</td>
            <td id="uptime-${dev.safe}">0h/0m/0s</td>
            <td id="downtime-count-${dev.safe}">${dev.downCount}</td>
            <td id="downtime-${dev.safe}">0h/0m/0s</td>
            <td><button class="history-btn" onclick="openDeviceHistory('${dev.ip}','${dev.name}','${dev.category}')">View History</button></td>
            <td id="remark-${dev.safe}">Device working properly</td>
        `;

        if (dev.current === "Online") {
            startUptime(dev.ip, dev.hist);
        } else {
            startDowntime(dev.ip, dev.hist, dev.category);
        }

        updateRemarks(dev.ip, dev.hist, dev.category);

        // show modern tooltip for devices marked "Not accessible"
        const remarkText = (dev.remark || '').toString().trim();
        if (remarkText && /not\s+access/i.test(remarkText)) {
            row.classList.add('row-not-accessible');

            // ensure row can position absolute children
            if (getComputedStyle(row).position === 'static') {
                row.style.position = 'relative';
            }

            const tooltip = document.createElement('div');
            tooltip.className = 'device-access-tooltip';
            tooltip.textContent = 'Due to Network policy, this camera is Not accessible';

            // inline styles so no external CSS edit required
            tooltip.style.position = 'absolute';
            tooltip.style.bottom = '65%';
            tooltip.style.left = '200px';
            tooltip.style.padding = '8px 10px';
            tooltip.style.background = '#313030'; // modern red
            tooltip.style.color = '#fff';
            tooltip.style.borderRadius = '6px';
            tooltip.style.fontSize = '13px';
            tooltip.style.fontWeight = '600';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(6px)';
            tooltip.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
            tooltip.style.zIndex = '9999';
            tooltip.style.boxShadow = '0 6px 14px rgba(0,0,0,0.18)';

            row.appendChild(tooltip);

            row.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(0)';
            });
            row.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(6px)';
            });

            // accessible fallback
            row.title = tooltip.textContent;
        }
    });

     // After populating the table, update the failure chart
  if (typeof calculateFailureCounts === 'function' && typeof refreshFailureChart === 'function') {
    console.log('Updating Failure Count Chart with new data');
    const failureData = calculateFailureCounts(details);
    refreshFailureChart(failureData);
    
    // Also update global reference
    if (typeof window.updateDeviceDetails === 'function') {
      window.updateDeviceDetails(details);
    }
  } else {
    console.warn('Failure chart functions not available');
  }

    filterData();
}




// function filterHistoryForDisplay(hist, category) {
//     const cat = (category || '').toString().toUpperCase();
//     if (cat === 'SERVER') return hist.slice(); // show all for servers

//     // remove any offline entries that resolve within 5 minutes
//     const filtered = [];
//     let lastOff = null;
//     hist.forEach(e => {
//         if (e.status === 'Offline') {
//             lastOff = e;
//         } else if (e.status === 'Online' && lastOff) {
//             const diff = (new Date(e.timestamp) - new Date(lastOff.timestamp)) / 1000;
//             if (diff >= 300) {
//                 filtered.push(lastOff, e);
//             }
//             lastOff = null;
//         } else {
//             filtered.push(e);
//         }
//     });
//     if (lastOff) {
//         const diff = (Date.now() - new Date(lastOff.timestamp)) / 1000;
//         if (diff >= 300) filtered.push(lastOff);
//     }
//     return filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
// }



// 📝📝📝📝📝  new server time add code 07-11-2025
function filterHistoryForDisplay(hist, category) {
    const cat = (category || '').toString().toUpperCase();
    const filtered = [];
    let lastOff = null;

    hist.forEach(e => {
        if (e.status === 'Offline') {
            lastOff = e;
        } else if (e.status === 'Online' && lastOff) {
            const diff = (new Date(e.timestamp) - new Date(lastOff.timestamp)) / 1000;

            if (cat === 'SERVER') {
                // ✅ For SERVER: keep only downtime > 5 minutes
                if (diff > 300) {
                    filtered.push(lastOff, e);
                }
            } else {
                // ✅ For other devices: keep original rule (downtime ≥ 5 min)
                if (diff >= 300) {
                    filtered.push(lastOff, e);
                } else {
                    // If your original non-server logic allowed short events, you can adjust here.
                }
            }
            lastOff = null;
        } else {
            // Keep Online or single events for non-servers
            if (cat !== 'SERVER') filtered.push(e);
        }
    });

    // Handle the last Offline event (still down)
    if (lastOff) {
        const diff = (Date.now() - new Date(lastOff.timestamp)) / 1000;
        if (cat === 'SERVER') {
            if (diff > 300) filtered.push(lastOff);
        } else {
            if (diff >= 300) filtered.push(lastOff);
        }
    }

    return filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}
// 📝📝📝📝📝




function startUptime(ip, hist) {
    const safe = sanitizeId(ip);
    clearInterval(deviceDowntimeTimers[safe]);
    const lastOn = hist.filter(e => e.status === 'Online').pop();
    if (!lastOn) return;
    const start = new Date(lastOn.timestamp).getTime();
    deviceUptimeTimers[safe] = setInterval(() => {
        const secs = Math.floor((Date.now() - start) / 1000);
        const el = document.getElementById(`uptime-${safe}`);
        if (el) el.innerText = formatDuration(secs);
    }, 1000);
}

function startDowntime(ip, hist, category) {
    const safe = sanitizeId(ip);
    clearInterval(deviceUptimeTimers[safe]);
    const lastOff = hist.filter(e => e.status === 'Offline').pop();
    if (!lastOff) return;
    const start = new Date(lastOff.timestamp).getTime();
    deviceDowntimeTimers[safe] = setInterval(() => {
        const secs = Math.floor((Date.now() - start) / 1000);
        const el = document.getElementById(`downtime-${safe}`);
        if (el) el.innerText = formatDuration(secs);
        updateDowntimeCount(ip, hist, category);
    }, 1000);
}

function updateDowntimeCount(ip, hist, category) {
    const safe = sanitizeId(ip);
    const offs = filterHistoryForDisplay(hist, category).filter(e => e.status === 'Offline');
    const count = offs.length;
    const el = document.getElementById(`downtime-count-${safe}`);
    if (el) el.innerText = count;
    updateRemarks(ip, hist, category);
}

function updateRemarks(ip, hist, category) {
    const safe = sanitizeId(ip);
    const filteredOffs = filterHistoryForDisplay(hist, category).filter(e => e.status === 'Offline');
    const count = filteredOffs.length;
    const lastStatus = hist.length ? hist[hist.length - 1].status : 'Unknown';
    const el = document.getElementById(`remark-${safe}`);
    if (!el) return;

    if (lastStatus === 'Offline') {
        el.innerText = count >= 10 ? "Device is Offline, needs repair." : "Device is Offline.";
    }
    else if (lastStatus === 'Online') {
        if (count >= 10) el.innerText = "Device is Online, needs repair.";
        else if (count > 0) el.innerText = `Device is Online, it had ${count} downtime occurrences.`;
        else el.innerText = "Device is Online.";
    }
    else {
        el.innerText = "Device status unknown.";
    }
    const dc = document.getElementById(`downtime-count-${safe}`);
    if (dc) dc.innerText = count;
}

function formatDuration(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    const parts = [];
    if (d) parts.push(`${d}d`);
    if (h) parts.push(`${h}h`);
    if (m) parts.push(`${m}m`);
    if (s || !parts.length) parts.push(`${s}s`);
    return parts.join('/');
}


function openDeviceHistory(ip, name, category) {
    if (!window.deviceHistoryData) {
        console.error("No history loaded");
        showToast("History still loading — please try again in a moment.");
        return;
    }
    const raw = window.deviceHistoryData[ip] || [];
    const hist = filterHistoryForDisplay(raw, (category || '').toUpperCase());
    displayDeviceHistory(ip, name, category, hist);
    const modal = document.getElementById('device-history-modal');
    if (modal) modal.style.display = 'block';
}

function calculateDowntimeDuration(ts, hist) {
    const start = new Date(ts).getTime();
    const nextUp = hist.find(e => e.status === 'Online' && new Date(e.timestamp).getTime() > start);
    if (nextUp) return formatDuration((new Date(nextUp.timestamp).getTime() - start) / 1000);
    return formatDuration((Date.now() - start) / 1000);
}

function displayDeviceHistory(ip, name, category, hist) {
    const header = document.getElementById('device-history-header');
    const container = document.getElementById('device-history');

    if (header) {
        header.innerHTML = `
            <h2 style="color: var(--yellow); font-size: 24px; margin-bottom: 10px;">Device History</h2>
            <p><strong>Device Name:</strong> ${name}</p>
            <p><strong>Device IP:</strong> ${ip}</p>
            <hr style="margin: 15px 0; border-color: var(--gray);">`;
    }

    if (!container) return;

    container.innerHTML = '';

    if (!hist.length) {
        container.innerHTML = `<p style="font-style: italic; color: #555;">No significant history (all brief outages &lt; 5 min).</p>`;
        return;
    }

    let html = `
        <div class="history-table-wrapper" >
          <table class="history-table">
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Date</th>
                <th>Day</th>
                <th>Time</th>
                <th>Status</th>
                <th>Downtime Duration</th>
              </tr>
            </thead>
            <tbody>
    `;

    let lastOff = null;
    hist.forEach((e, i) => {
        const d = new Date(e.timestamp);
        const date = d.toLocaleDateString();
        const day = d.toLocaleString('en-US', { weekday: 'long' });
        const time = d.toLocaleTimeString();
        let dur = '-';
        if (e.status === 'Offline') lastOff = e.timestamp;
        else if (e.status === 'Online' && lastOff) {
            dur = calculateDowntimeDuration(lastOff, hist);
            lastOff = null;
        }

        html += `
          <tr>
            <td>${i + 1}</td>
            <td>${date}</td>
            <td>${day}</td>
            <td>${time}</td>
            <td class="${e.status === 'Offline' ? 'status-offline' : 'status-online'}">${e.status}</td>
            <td>${dur}</td>
          </tr>`;
    });

    html += `</tbody></table></div>`;
    container.innerHTML = html;
}

function closeHistoryModal() {
    const modal = document.getElementById('device-history-modal');
    if (modal) modal.style.display = 'none';
}




function filterData() {
    const searchValue = (document.getElementById('searchBox')?.value || "").toLowerCase();
    const selectedCity = (document.getElementById('cityFilter')?.value || "").toLowerCase().trim(); // note id: cityFilter
    const selectedDeviceType = (document.getElementById('device-type')?.value || "all").toLowerCase().trim();
    const selectedRemark = (document.getElementById('remark-filter')?.value || "all").toLowerCase().trim();

    const rows = document.querySelectorAll('#device-table tbody tr');
    let visibleCount = 0;

    let totalDevices = 0;
    let totalOnline = 0;
    let totalCameras = 0;
    let totalControllers = 0;
    let totalArchivers = 0;
    let totalServers = 0;
    let totalPCs = 0;
    let totalDBs = 0;
    let currentlyOffline = 0;
    let downtimeOver15 = 0;

    rows.forEach(row => {
        // skip header / placeholder rows if any
        if (!row.cells || row.cells.length < 8) return;

        const ip = row.cells[1].textContent.trim();
        const name = (row.cells[2].textContent || "").toLowerCase();
        const category = (row.cells[3].textContent || "").toLowerCase().trim();
        const region = (row.cells[4].textContent || "").toLowerCase().trim();
        const city = (row.cells[5].textContent || "").toLowerCase().trim();
        const remark = (document.getElementById(`remark-${sanitizeId(ip)}`)?.innerText || "").toLowerCase().trim();
        const currentStatus = row.classList.contains("row-offline") ? "offline" : "online";
        const downtimeCount = parseInt(row.cells[7].textContent.trim()) || 0;

        const matchesSearch = [ip.toLowerCase(), name, category, region, city].some(text =>
            text.includes(searchValue)
        );

        const matchesCity = !selectedCity || selectedCity === "all" || city === selectedCity;
        const matchesType = selectedDeviceType === "all" || category === selectedDeviceType;
        const matchesRemark = selectedRemark === "all" || remark.includes(selectedRemark);

        const shouldDisplay = matchesSearch && matchesCity && matchesType && matchesRemark;
        row.style.display = shouldDisplay ? "" : "none";

        if (shouldDisplay) {
            visibleCount++;
            totalDevices++;
            if (currentStatus === "online") totalOnline++;
            if (currentStatus === "offline") currentlyOffline++;
            if (downtimeCount > 15) downtimeOver15++;

            if (category === "camera") totalCameras++;
            else if (category === "controller") totalControllers++;
            else if (category === "archiver") totalArchivers++;
            else if (category === "server") totalServers++;
            else if (category === "desktop") totalPCs++;
            else if (category === "db server") totalDBs++;
        }
    });

    updateDisplayedDeviceCount(visibleCount);

    // Update summary cards based on filtered data
    const setSummary = (id, iconClass, label, value) => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = `<i class="${iconClass}"></i> ${label}: <span style="font-weight:700;">${value}</span>`;
        }
    };

    // use the correct variables (not undefined ones)
    setSummary("total-devices", "fas fa-network-wired", "Total Devices", totalDevices);
    setSummary("total-online", "fas fa-signal", "Online Devices", totalOnline);
    setSummary("total-cameras", "fas fa-video", "Total Cameras", totalCameras);
    setSummary("total-controllers", "fas fa-microchip", "Total Controllers", totalControllers);
    setSummary("total-archivers", "fas fa-database", "Total Archivers", totalArchivers);
    setSummary("total-servers", "fas fa-server", "Total Servers", totalServers);
    setSummary("total-pcs", "fas fa-desktop", "Total Desktop", totalPCs);
    setSummary("total-dbs", "fas fa-database", "Total DB Server", totalDBs);

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.innerText = value;
    };

    setText("count-downtime-over-15", `Devices with >15 downtimes: ${downtimeOver15}`);
    setText("count-currently-offline", `Devices currently Offline: ${currentlyOffline}`);
}



function updateDisplayedDeviceCount(count) {
    const el = document.getElementById('device-count');
    if (el) el.innerText = `Displayed Devices: ${count}`;
}

document.addEventListener("DOMContentLoaded", () => {
    ['region', 'device-type', 'remark-filter'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', id === 'region' ? fetchDeviceData : filterData);
    });

    const cityFilter = document.getElementById('city-filter');
    if (cityFilter) {
        cityFilter.addEventListener('change', filterData);
    }

    fetchDeviceData();
});

function exportDeviceTableToExcel() {
    const tbl = document.getElementById("device-table");
    if (!tbl) return;
    const wb = XLSX.utils.table_to_book(tbl, { sheet: "Device Table" });
    XLSX.writeFile(wb, "Device_Table.xlsx");
}

function exportDeviceHistoryToExcel() {
    const histTbl = document.querySelector("#device-history-modal table");
    if (!histTbl) return alert("Please open a device's history first.");
    const wb = XLSX.utils.table_to_book(histTbl, { sheet: "Device History" });
    XLSX.writeFile(wb, "Device_History.xlsx");
}

function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => showToast(`Copied: ${text}`))
            .catch(err => console.error("Copy failed: ", err));
    } else {
        // fallback
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            showToast(`Copied: ${text}`);
        } catch (err) {
            console.error("Fallback copy failed:", err);
        }
        document.body.removeChild(textarea);
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = "toast show";
    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 2500);
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId)?.innerText;
    if (text) {
        navigator.clipboard.writeText(text)
            .then(() => showToast(`Copied: ${text}`))
            .catch(err => console.error("Failed to copy:", err));
    }
}

