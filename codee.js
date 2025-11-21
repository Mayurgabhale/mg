now map is diplsy full screen
  not only show map. in map we apply some logic. that alos
  so 
  see we creat alread map just this map i want to disply in full screen dont use your extra logic ok 
  we alread create   <div id="realmap"></div> this map just this my we want to diplsy n full 
    screen futu clikc on  View Full this button  ok
      create like that 

<div class="worldmap-card">
                    <!-- Fullscreen Button -->
                    <button id="mapFullscreenBtn" class="map-fullscreen-btn">
                      ⛶ View Full
                    </button>

                    <div id="realmap"></div>

                    <!-- Legend + Controls Row -->
                    <div class="map-bottom-bar">

                      <!-- Legend -->
                      <div class="legend">
                        <div class="legend-item">
                          <i class="bi bi-camera"></i>
                          Camera
                        </div>
                        <div class="legend-item">
                          <i class="bi bi-hdd"></i> Controller
                        </div>
                        <div class="legend-item">
                          <i class="fa-duotone fa-solid fa-server"></i> Server
                        </div>
                        <div class="legend-item">
                          <i class="fas fa-database "></i> Archiver
                        </div>
                      </div>

                      <!-- Controls -->
                      <div class="map-controls">
                        <button id="fit-all" class="btn-ghost">Fit All</button>
                        <button id="show-global" class="btn-gv">Global View</button>
                      </div>

                    </div>
                  </div>

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
  "Delta Building": [37.7749, -122.4194],  
  "Denver": [39.7392, -104.9903],
  "Denver Colorado": [39.7392, -104.9903],
  "Florida, Miami": [25.7617, -80.1918],
  "Frankfurt": [50.1109, 8.6821],
  "Gama Building": [37.7749, -122.4194],  
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
  "Quezon": [14.6760, 121.0437],
  "Sao Paulo, Brazil": [-23.5505, -46.6333],
  "Taguig City": [14.5176, 121.0509],
  "HYDERABAD": [17.3850, 78.4867],
  "Singapore": [1.3521, 103.8198]
};


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

    // 🌎 SHOW ONLY APAC + EMEA + NAMER + LACA
    maxBounds: [
      // [70, -150],   // top-left limit (cuts Arctic)
      [70, -135],   // top-left limit (cuts Arctic)
      [-60, 160]    // bottom-right limit (cuts Antarctica)
      // [-60, 160]    // bottom-right limit (cuts Antarctica)
    ],
    maxBoundsViscosity: 1.0,

    minZoom: 2.1,    // prevent zooming out too far
    maxZoom: 20
  })
    .setView([15, 0], 2.4);  // perfect center for all 4 regions

  // Satellite map
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    attribution: 'Tiles © Esri'
  }).addTo(realMap);

  // clusters, layers, etc
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
    // can't draw devices with no valid coords
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
      const moreHtml = `<div class="city-label-box" style="padding:6px 8px; font-size:12px;">${type}: ${cnt}</div>`;
      const labelLat = cityObj.lat + 0.045;
      const labelLon = cityObj.lon + (type === 'camera' ? 0.03 : (type === 'controller' ? -0.03 : 0));
      const labelMarker = L.marker([labelLat, labelLon], { icon: L.divIcon({ html: moreHtml, className: "" }) });
      layer.addLayer(labelMarker);
    }
  });
}

function buildCitySummaryHTML(city) {
  const total = city.total || 0;

  // compute offline count
  const offline = (city.devicesList || []).reduce((acc, d) => {
    const s = ((d.status || d.state || '') + '').toLowerCase();
    if (s === 'offline' || s === 'down') return acc + 1;
    if (d.online === false) return acc + 1;
    return acc;
  }, 0);

  // ICONS (your icons)
  const ICONS = {
    camera: `<i class="bi bi-camera "></i>`,
    controller: `<i class="bi bi-hdd"></i>`,
    server: `<i class="fa-duotone fa-solid fa-server"></i>`,
    archiver: `<i class="fas fa-database"></i>`
  };


  let html = `
  <div style="
    font-family: Inter, Roboto, Arial, sans-serif;
    font-size:13px;
    display: inline-block;
    width: auto;
    max-width: 240px;
  ">
    <div style="
      font-weight:700;
      margin-bottom:6px;
      font-size:14px;
      white-space: nowrap;
    ">
      ${city.city}
    </div>

    <div style="font-weight:600; margin-bottom:8px;">
      ${total}/<span style="color:#ff3b3b;">${offline}</span>
    </div>
`;


  // Known device types (with icons)
  const mapList = ["camera", "controller", "server", "archiver"];

  mapList.forEach(type => {
    const count = city.devices?.[type] || 0;
    if (count > 0) {
      html += `
        <div style="margin-bottom:4px; display:flex; align-items:center; gap:6px; font-size:10px;">
          ${ICONS[type]} <span>${count}</span>
        </div>
      `;
    }
  });

  // Detect extra types (e.g. CCURE)
  const extraCounts = {};
  (city.devicesList || []).forEach(d => {
    const candidates = [d.type, d.product, d.deviceType, d.model];
    for (let v of candidates) {
      if (!v) continue;
      const name = String(v).trim();
      if (!name) continue;

      const low = name.toLowerCase();
      if (low.includes("camera") || low.includes("server") || low.includes("controller") || low.includes("archiver"))
        continue;

      extraCounts[name] = (extraCounts[name] || 0) + 1;
      break;
    }
  });

  Object.keys(extraCounts).forEach(key => {
    html += `
      <div style="margin-bottom:4px;">
        ${key} ${extraCounts[key]}
      </div>
    `;
  });

  html += `</div>`;
  return html;
}


/**
 * placeCityMarkers: creates city markers and attaches hover + click summary
 * Replaces your previous placeCityMarkers implementation.
 */
function placeCityMarkers() {
  if (!window.cityMarkerLayer) window.cityMarkerLayer = L.layerGroup().addTo(realMap);
  window.cityMarkerLayer.clearLayers();

  CITY_LIST.forEach(c => {
    if (toNum(c.lat) === null || toNum(c.lon) === null) return;

    // City icon with pin only (keeps your existing class)
    const cityIcon = L.divIcon({
      className: 'city-marker',
      // html: `<div><span class="pin"><i class="bi bi-geo-alt-fill"></i></span></div>`,
      html: `<div><span class="pin"><i class="fa-solid fa-location-dot fa-bounce"></i></span></div>`,
      iconAnchor: [10, 10],
    
    });

    const marker = L.marker([c.lat, c.lon], { icon: cityIcon });

    // Build summary HTML on demand (keeps memory light)
    const getSummary = () => buildCitySummaryHTML(c);

    // Hover: show compact tooltip (summary only)
    marker.on('mouseover', function () {
      // open a tooltip with summary (no permanent name, plain text)
      marker.bindTooltip(getSummary(), {
        direction: 'top',
        offset: [0, -12],
        opacity: 1,
        permanent: false,
        className: 'city-summary-tooltip' // optional for custom CSS
      }).openTooltip();
    });
    marker.on('mouseout', function () {
      try { marker.closeTooltip(); } catch (e) {}
    });

    // Click: open a popup with same content (keeps it visible)
    marker.on('click', function () {
      marker.bindPopup(getSummary(), { maxWidth: 260 }).openPopup();
    });

    // Add marker to layer
    marker.addTo(window.cityMarkerLayer);
  });

  window.cityMarkerLayer.bringToFront();
}




/* ============================================================
   3. CITY SUMMARY POPUP
   (left out popup implementation — keep for your UI needs)
   ============================================================ */

/* ============================================================
   4. HEATMAP
   ============================================================ */
function drawHeatmap() {
  // compute points only for valid coordinates
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
  // requires leaflet-heat plugin
  heatLayer = L.heatLayer(heatPoints, { radius: 40, blur: 25, gradient: { 0.2: '#34d399', 0.5: '#fbbf24', 0.8: '#f97316' } }).addTo(realMap);
}

function toggleHeat() {
  if (!heatLayer) return;
  if (realMap.hasLayer(heatLayer)) realMap.removeLayer(heatLayer);
  else realMap.addLayer(heatLayer);
}


/* ============================================================
   5. FIT ALL CITIES
   ============================================================ */
function fitAllCities() {
  const validCoords = CITY_LIST
    .map(c => [toNum(c.lat), toNum(c.lon)])
    .filter(([lat, lon]) => lat !== null && lon !== null);

  if (!validCoords.length) return;
  const bounds = L.latLngBounds(validCoords);
  realMap.fitBounds(bounds.pad(0.25));
}

/* ============================================================
   6. SIDE PANEL
   ============================================================ */
function populateGlobalCityList() {
  const panel = document.getElementById("region-panel-content");
  if (!panel) return;
  let html = `<h4></h4><hr>`;
  CITY_LIST.forEach((c, idx) => {
    const total = c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0;
    // attach a data-index for robust click handling
    html += `<div class="city-item" data-city-index="${idx}">
                <div style="font-weight:700">${c.city}</div>
                <div class="small-muted">${c.region || '—'} • ${total} devices</div>
             </div>`;
  });
  panel.innerHTML = html;

  // attach click handlers
  panel.querySelectorAll('.city-item').forEach(el => {
    el.addEventListener('click', () => {
      const idx = Number(el.getAttribute('data-city-index'));
      const c = CITY_LIST[idx];
      if (c && toNum(c.lat) !== null && toNum(c.lon) !== null) {
        realMap.flyTo([c.lat, c.lon], 7, { duration: 1.0 });
      }
      populateCityPanel(c ? c.city : null);
    });
  });
}


function onCityItemClick(cityName) {
  const c = CITY_LIST.find(x => x.city === cityName);
  if (c && toNum(c.lat) !== null && toNum(c.lon) !== null) {
    realMap.setView([c.lat, c.lon], 5, { animate: true });
  }
  populateCityPanel(cityName);
}




function populateCityPanel(cityName) {
  const panel = document.getElementById("region-panel-content");
  const c = CITY_LIST.find(x => x.city === cityName);
  if (!panel || !c) return;
  const total = c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0;
  panel.innerHTML = `
    <h4>${cityName} — ${total} devices</h4><hr>
    <div><b>Camera:</b> ${c.devices.camera || 0}</div>
    <div><b>Controller:</b> ${c.devices.controller || 0}</div>
    <div><b>Server:</b> ${c.devices.server || 0}</div>
    <div><b>Archiver:</b> ${c.devices.archiver || 0}</div>
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
  // Only consider valid coordinates
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

    const radius = 0.02; // ~2km
    group.forEach((c, i) => {
      const angle = (2 * Math.PI * i) / group.length;
      c.lat = baseLat + Math.cos(angle) * radius;
      c.lon = baseLon + Math.sin(angle) * radius;
    });
  });
}

/* ============================================================
   8. GEOCODE MISSING CITIES
   ============================================================ */


// Override getCityCoordinates to use local list
async function getCityCoordinates(cityName) {
  cityName = cityName.trim();
  if (CITY_COORDS[cityName]) {
    return CITY_COORDS[cityName];
  }
  console.warn("City not found in CITY_COORDS:", cityName);
  return null;
}

/* ============================================================
   9. UPDATE MAP DYNAMICALLY
   ============================================================ */

async function updateMapData(summary, details) {
  try {
    if (!realMap || !details) return;

    const deviceBuckets = details.details || details;
    if (!deviceBuckets) return;

    const cityMap = {};
    Object.entries(deviceBuckets).forEach(([rawKey, arr]) => {
      if (!Array.isArray(arr)) return;
      arr.forEach(dev => {
        const cityNameRaw = dev.city || dev.location || dev.site || "Unknown";
        const cityName = (typeof cityNameRaw === 'string') ? cityNameRaw.trim() : String(cityNameRaw);
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
          total: 0,
          devicesList: [],
          region: dev.region || dev.zone || null
        };

        if (type) cityMap[cityName].devices[type] += 1;
        cityMap[cityName].total += 1;
        cityMap[cityName].devicesList.push(dev);

        // If we have coordinates on the device, prefer them (last wins)
        if (lat !== null && lon !== null) {
          cityMap[cityName].lat = lat;
          cityMap[cityName].lon = lon;
        }
      });
    });

    CITY_LIST = Object.values(cityMap);

    // Geocode cities with missing coordinates (sequentially to avoid hammering service).
    for (let c of CITY_LIST) {
      if (toNum(c.lat) === null || toNum(c.lon) === null) {
        const coords = await getCityCoordinates(c.city);
        if (coords && coords.length === 2) {
          c.lat = coords[0];
          c.lon = coords[1];
        } else {
          // keep as null to avoid placing at 0,0
          c.lat = null;
          c.lon = null;
        }
      }
    }

    // Avoid overlapping city coordinates (only on valid coords)
    ensureUniqueCityCoordinates(CITY_LIST);

    // Place device markers
    CITY_LIST.forEach(c => {
      if (!cityLayers[c.city]) cityLayers[c.city] = { deviceLayer: L.layerGroup().addTo(realMap), summaryMarker: null };
      cityLayers[c.city].deviceLayer.clearLayers();
      _placeDeviceIconsForCity(c, c.devices, c.devicesList);
    });

    // optional: create simple summary markers for cities with coordinates
    Object.values(cityLayers).forEach(l => { /* left as-is, marker layering handled in _placeDeviceIconsForCity */ });

    drawHeatmap();
    populateGlobalCityList();
    drawRegionBadges();
  } catch (err) {
    console.error("updateMapData error", err);
  }
  drawCityBarChart()
  placeCityMarkers();
  fitAllCities()
  
}

/* ============================================================
   10. EXPORTS / BUTTON HOOKS
   - hookup all event listeners after DOM ready to avoid null refs
   ============================================================ */
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
const overlay = document.getElementById("mapFullscreenOverlay");
const closeBtn = document.getElementById("closeFullscreenMap");

let fullscreenMap = null;

fullscreenBtn.addEventListener("click", () => {

  overlay.style.display = "flex";

  setTimeout(() => {

    // Create new map only once
    if (!fullscreenMap) {

      fullscreenMap = L.map('fullscreenMapContainer', {
        preferCanvas: true,
        center: realMap.getCenter(),
        zoom: realMap.getZoom()
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 20
      }).addTo(fullscreenMap);

      // copy markers
      window.cityMarkerLayer?.eachLayer(m => m.addTo(fullscreenMap));

      // copy heatmap
      if (heatLayer) {
        heatLayer.addTo(fullscreenMap);
      }
    } else {
      fullscreenMap.setView(realMap.getCenter(), realMap.getZoom());
    }

    fullscreenMap.invalidateSize(true);

  }, 200);   // VERY IMPORTANT delay fixes your error

});






closeBtn.addEventListener("click", () => {
  overlay.style.display = "none";
});



<!-- FULLSCREEN MAP POPUP -->
<div id="mapFullscreenOverlay" class="map-overlay">
  <div class="map-popup">

    <button id="closeFullscreenMap" class="close-map-btn">
      ✖ Close
    </button>

    <div id="fullscreenMapContainer"></div>

  </div>
</div>





/* Overlay background */
.map-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 999999;
}

/* Popup container */
.map-popup {
  width: 96vw;
  height: 94vh;
  background: #0f172a;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(0,0,0,0.6);
  animation: zoomIn 0.35s ease;
}

/* Actual fullscreen map */
#fullscreenMapContainer {
  width: 100%;
  height: 100%;
}

/* Close button */
.close-map-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10000;
  padding: 6px 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  cursor: pointer;
  border-radius: 4px;
}

/* Animation */
@keyframes zoomIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}



.....


const fullscreenBtn = document.getElementById("mapFullscreenBtn");
const overlay = document.getElementById("mapFullscreenOverlay");
const closeBtn = document.getElementById("closeFullscreenMap");

let fullscreenMap = null;

fullscreenBtn.addEventListener("click", () => {

  overlay.style.display = "flex";

  setTimeout(() => {

    // Create new map only once
    if (!fullscreenMap) {

      fullscreenMap = L.map('fullscreenMapContainer', {
        preferCanvas: true,
        center: realMap.getCenter(),
        zoom: realMap.getZoom()
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 20
      }).addTo(fullscreenMap);

      // copy markers
      window.cityMarkerLayer?.eachLayer(m => m.addTo(fullscreenMap));

      // copy heatmap
      if (heatLayer) {
        heatLayer.addTo(fullscreenMap);
      }
    } else {
      fullscreenMap.setView(realMap.getCenter(), realMap.getZoom());
    }

    fullscreenMap.invalidateSize(true);

  }, 200);   // VERY IMPORTANT delay fixes your error

});






closeBtn.addEventListener("click", () => {
  overlay.style.display = "none";
});
