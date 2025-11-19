read the below all code carefully, and in map not diisply anything,
    i want to disply city/location wiht correct cooredinate and correct place in map ok that we get in api dynamicaly ok 
rad below all code carefully, and correct it.. 
/* ============================================================
   map.js — Fully dynamic version (with geocoding)
   ============================================================ */

let realMap;
let CITY_LIST = []; // dynamically populated from API
let cityLayers = {}; // cityName -> { summaryMarker, deviceLayer }
let heatLayer = null;
const regionColors = { APAC: "#0ea5e9", EMEA: "#34d399", NAMER: "#fb923c", LACA: "#a78bfa" };
const regionCenter = { APAC: [20, 100], EMEA: [30, 10], NAMER: [40, -100], LACA: [-10, -60] };
window._mapRegionMarkers = [];

/* ============================================================
   1. INIT MAP
   ============================================================ */
function initRealMap() {
  realMap = L.map('realmap', { preferCanvas:true }).setView([20,0],2);

  // ESRI World Imagery (satellite)
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom:20, attribution:'Tiles © Esri'
  }).addTo(realMap);

  // groups
  window.markerCluster = L.markerClusterGroup({ chunkedLoading:true, showCoverageOnHover:false });
  window.countryLayerGroup = L.layerGroup().addTo(realMap);
  realMap.addLayer(markerCluster);

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
    if (!cityLayers[cityObj.city]) cityLayers[cityObj.city] = { deviceLayer: L.layerGroup().addTo(realMap), summaryMarker: null };
    const layer = cityLayers[cityObj.city].deviceLayer;
    layer.clearLayers();

    const deviceTypes = ['camera', 'controller', 'server', 'archiver'];
    deviceTypes.forEach(type => {
        const cnt = deviceCounts[type] || 0;
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

/* ============================================================
   3. CITY SUMMARY POPUP
   ============================================================ */


/* ============================================================
   4. HEATMAP
   ============================================================ */
function drawHeatmap() {
    if (!CITY_LIST.length) return;
    const totals = CITY_LIST.map(c => {
        const total = c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0;
        return { lat: c.lat, lon: c.lon, total };
    });
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

/* ============================================================
   5. FIT ALL CITIES
   ============================================================ */
function fitAllCities() {
    if (!CITY_LIST.length) return;
    const bounds = L.latLngBounds(CITY_LIST.map(c => [c.lat, c.lon]));
    realMap.fitBounds(bounds.pad(0.25));
}

/* ============================================================
   6. SIDE PANEL
   ============================================================ */
function populateGlobalCityList() {
    const panel = document.getElementById("region-panel-content");
    if (!panel) return;
    let html = `<h4>Global Devices</h4><hr>`;
    CITY_LIST.forEach(c => {
        const total = c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0;
        html += `<div class="city-item" onclick="onCityItemClick('${c.city}')">
                    <div style="font-weight:700">${c.city}</div>
                    <div class="small-muted">${c.region} • ${total} devices</div>
                 </div>`;
    });
    panel.innerHTML = html;
}

function onCityItemClick(cityName) {
    const c = CITY_LIST.find(x => x.city === cityName);
    if (c) realMap.flyTo([c.lat, c.lon], 7, { duration: 1.0 });
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

/* ============================================================
   7. REGION BADGES
   ============================================================ */
function drawRegionBadges() {
    window._mapRegionMarkers.forEach(m => realMap.removeLayer(m));
    window._mapRegionMarkers = [];

    Object.keys(regionCenter).forEach(region => {
        const devices = CITY_LIST.filter(c => c.region === region)
            .reduce((sum, c) => sum + Object.values(c.devices || {}).reduce((a, b) => a + b, 0), 0);
        const html = `<div class="region-badge" style="background:${regionColors[region]};">${region}<br>${devices} devices</div>`;
        const marker = L.marker(regionCenter[region], {
            icon: L.divIcon({ html, className: "", iconSize: [120, 60], iconAnchor: [60, 30] })
        }).addTo(realMap).on("click", () => populateRegionPanel(region));
        window._mapRegionMarkers.push(marker);
    });
}

function populateRegionPanel(region) {
    const panel = document.getElementById("region-panel-content");
    if (!panel) return;
    const cities = CITY_LIST.filter(c => c.region === region);
    let html = `<h4>${region} Region</h4><hr>`;
    cities.forEach(c => {
        const total = c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0;
        html += `<div class="city-item" onclick="onCityItemClick('${c.city}')"><b>${c.city}</b> — ${total} devices</div>`;
    });
    panel.innerHTML = html;
}
function ensureUniqueCityCoordinates(cityArray) {
    const map = {};
    cityArray.forEach(c => {
        const key = `${c.lat.toFixed(6)}_${c.lon.toFixed(6)}`;
        if (!map[key]) map[key] = [];
        map[key].push(c);
    });

    Object.values(map).forEach(group => {
        if (group.length <= 1) return;
        const baseLat = group[0].lat;
        const baseLon = group[0].lon;
        if (baseLat === 0 && baseLon === 0) return;

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




async function getCityCoordinates(cityName) {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`);
        const data = await res.json();
        if (data && data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } catch(err) {
        console.warn("Geocode failed for", cityName, err);
    }
    return [0, 0]; // fallback
}


/* ============================================================
   9. UPDATE MAP DYNAMICALLY
   ============================================================ */



async function updateMapData(summary, details) {
    if (!realMap || !details) return;

    const deviceBuckets = details.details || details;
    if (!deviceBuckets) return;

    const cityMap = {};
    Object.entries(deviceBuckets).forEach(([rawKey, arr]) => {
        if (!Array.isArray(arr)) return;
        arr.forEach(dev => {
            const cityName = (dev.city || dev.location || dev.site || "Unknown").trim();
            let lat = dev.lat || 0;
            let lon = dev.lon || 0;

            const type = (rawKey || "").toLowerCase().includes("camera") ? "camera" :
                         (rawKey || "").toLowerCase().includes("controller") ? "controller" :
                         (rawKey || "").toLowerCase().includes("server") ? "server" :
                         (rawKey || "").toLowerCase().includes("archiver") ? "archiver" : null;

            if (!cityMap[cityName]) cityMap[cityName] = {
                city: cityName,
                lat,
                lon,
                devices: { camera: 0, controller: 0, server: 0, archiver: 0 },
                total: 0,
                devicesList: []
            };

            if (type) cityMap[cityName].devices[type] += 1;
            cityMap[cityName].total += 1;
            cityMap[cityName].devicesList.push(dev);
        });
    });

    CITY_LIST = Object.values(cityMap);

    // Geocode cities with missing coordinates
    for (let c of CITY_LIST) {
        if (c.lat === 0 && c.lon === 0) {
            const coords = await getCityCoordinates(c.city);
            c.lat = coords[0];
            c.lon = coords[1];
        }
    }

    // Avoid overlapping city coordinates
    ensureUniqueCityCoordinates(CITY_LIST);

    // Place device markers
    CITY_LIST.forEach(c => {
        if (!cityLayers[c.city]) cityLayers[c.city] = { deviceLayer: L.layerGroup().addTo(realMap), summaryMarker: null };
        cityLayers[c.city].deviceLayer.clearLayers();
        _placeDeviceIconsForCity(c, c.devices, c.devicesList);
    });

    drawHeatmap();
    populateGlobalCityList();
}

/* ============================================================
   10. EXPORTS / BUTTON HOOKS
   ============================================================ */
document.addEventListener("DOMContentLoaded", initRealMap);
document.getElementById("toggle-heat").onclick = toggleHeat;
document.getElementById("fit-all").onclick = fitAllCities;
document.getElementById("show-global").onclick = populateGlobalCityList;
window.updateMapData = updateMapData;
















