/* ============================================================
   map.js — Improved version with better coordinate handling
   ============================================================ */

let realMap;
let CITY_LIST = []; // dynamically populated from API
let cityLayers = {}; // cityName -> { summaryMarker, deviceLayer }
let heatLayer = null;
const regionColors = { APAC: "#0ea5e9", EMEA: "#34d399", NAMER: "#fb923c", LACA: "#a78bfa" };
const regionCenter = { APAC: [20, 100], EMEA: [30, 10], NAMER: [40, -100], LACA: [-10, -60] };
window._mapRegionMarkers = [];

// Store original coordinates to prevent duplicate geocoding
const coordinateCache = {};

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
   2. IMPROVED GEOCODING WITH BETTER LOCATION HANDLING
   ============================================================ */
async function getCityCoordinates(cityName, region = "Unknown") {
    // Check cache first
    const cacheKey = `${cityName}_${region}`;
    if (coordinateCache[cacheKey]) {
        return coordinateCache[cacheKey];
    }

    try {
        // Add region to search query for better accuracy
        const query = region !== "Unknown" ? `${cityName}, ${region}` : cityName;
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        
        if (data && data.length > 0) {
            // Prefer results that match the city name closely
            const exactMatch = data.find(item => 
                item.display_name.toLowerCase().includes(cityName.toLowerCase())
            );
            
            const result = exactMatch || data[0];
            const coords = [parseFloat(result.lat), parseFloat(result.lon)];
            
            // Cache the result
            coordinateCache[cacheKey] = coords;
            return coords;
        }
    } catch(err) {
        console.warn("Geocode failed for", cityName, err);
    }
    
    // Fallback: generate coordinates based on region to avoid overlap
    const fallbackCoords = getFallbackCoordinates(cityName, region);
    coordinateCache[cacheKey] = fallbackCoords;
    return fallbackCoords;
}

function getFallbackCoordinates(cityName, region) {
    // Create consistent but spread out coordinates based on city name hash
    let hash = 0;
    for (let i = 0; i < cityName.length; i++) {
        hash = cityName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Base coordinates by region
    const regionBases = {
        APAC: [20, 100],
        EMEA: [30, 10], 
        NAMER: [40, -100],
        LACA: [-10, -60]
    };
    
    const base = regionBases[region] || [0, 0];
    
    // Add some variation based on hash to prevent overlap
    const latVariation = (hash % 100) / 1000; // ±0.05 degrees
    const lonVariation = ((hash >> 8) % 100) / 1000; // ±0.05 degrees
    
    return [base[0] + latVariation, base[1] + lonVariation];
}

/* ============================================================
   3. IMPROVED DEVICE PLACEMENT WITH BETTER SPACING
   ============================================================ */
function _deviceIconDiv(type) {
    const cls = `device-icon device-${type}`;
    return L.divIcon({ className: cls, iconSize: [14, 14], iconAnchor: [7, 7] });
}

function _placeDeviceIconsForCity(cityObj, deviceCounts, devicesListForCity = []) {
    if (!cityLayers[cityObj.city]) cityLayers[cityObj.city] = { 
        deviceLayer: L.layerGroup().addTo(realMap), 
        summaryMarker: null 
    };
    
    const layer = cityLayers[cityObj.city].deviceLayer;
    layer.clearLayers();

    const deviceTypes = ['camera', 'controller', 'server', 'archiver'];
    const maxDevicesPerType = 20; // Reduced for better visibility
    
    deviceTypes.forEach((type, typeIndex) => {
        const cnt = deviceCounts[type] || 0;
        const displayCount = Math.min(cnt, maxDevicesPerType);
        
        // Calculate positions in a spiral pattern to avoid overlap
        for (let i = 0; i < displayCount; i++) {
            const angle = (i * 2 * Math.PI) / Math.max(displayCount, 1);
            const radius = 0.02 + (typeIndex * 0.015); // Different radius per device type
            const lat = cityObj.lat + Math.cos(angle) * radius;
            const lon = cityObj.lon + Math.sin(angle) * radius;
            
            const marker = L.marker([lat, lon], { icon: _deviceIconDiv(type) });
            marker.bindTooltip(`${type.toUpperCase()} ${i + 1}`, { 
                direction: 'top', 
                offset: [0, -8], 
                opacity: 0.95 
            });
            layer.addLayer(marker);
        }

        // Show count label if there are more devices
        if (cnt > displayCount) {
            const moreHtml = `<div class="city-label-box" style="padding:4px 6px; font-size:11px; background:rgba(0,0,0,0.7); color:white; border-radius:4px;">
                ${type}: ${cnt}</div>`;
            
            // Position labels in different quadrants
            const labelAngle = (typeIndex * Math.PI / 2) + Math.PI / 4;
            const labelRadius = 0.045;
            const labelLat = cityObj.lat + Math.cos(labelAngle) * labelRadius;
            const labelLon = cityObj.lon + Math.sin(labelAngle) * labelRadius;
            
            const labelMarker = L.marker([labelLat, labelLon], { 
                icon: L.divIcon({ 
                    html: moreHtml, 
                    className: "count-label",
                    iconSize: [60, 25],
                    iconAnchor: [30, 12]
                }) 
            });
            layer.addLayer(labelMarker);
        }
    });
}

/* ============================================================
   4. IMPROVED CITY PROCESSING WITH UNIQUE LOCATIONS
   ============================================================ */
async function updateMapData(summary, details) {
    if (!realMap || !details) return;

    const deviceBuckets = details.details || details;
    if (!deviceBuckets) return;

    const cityMap = {};
    
    // First pass: collect all cities and their devices
    Object.entries(deviceBuckets).forEach(([rawKey, arr]) => {
        if (!Array.isArray(arr)) return;
        
        arr.forEach(dev => {
            const cityName = (dev.city || dev.location || dev.site || "Unknown").trim();
            const region = dev.region || "Unknown";
            let lat = dev.lat || 0;
            let lon = dev.lon || 0;

            const type = (rawKey || "").toLowerCase().includes("camera") ? "camera" :
                         (rawKey || "").toLowerCase().includes("controller") ? "controller" :
                         (rawKey || "").toLowerCase().includes("server") ? "server" :
                         (rawKey || "").toLowerCase().includes("archiver") ? "archiver" : null;

            if (!cityMap[cityName]) {
                cityMap[cityName] = {
                    city: cityName,
                    region,
                    lat,
                    lon,
                    devices: { camera: 0, controller: 0, server: 0, archiver: 0 },
                    total: 0,
                    devicesList: [],
                    hasExactCoords: (lat !== 0 && lon !== 0) // Track if we have exact coordinates
                };
            }

            if (type) cityMap[cityName].devices[type] += 1;
            cityMap[cityName].total += 1;
            cityMap[cityName].devicesList.push(dev);
            
            // If any device has exact coordinates, use them
            if (lat !== 0 && lon !== 0) {
                cityMap[cityName].lat = lat;
                cityMap[cityName].lon = lon;
                cityMap[cityName].hasExactCoords = true;
            }
        });
    });

    // Second pass: geocode cities that need coordinates
    const geocodePromises = Object.values(cityMap).map(async (city) => {
        if (!city.hasExactCoords || (city.lat === 0 && city.lon === 0)) {
            const coords = await getCityCoordinates(city.city, city.region);
            city.lat = coords[0];
            city.lon = coords[1];
        }
        return city;
    });

    CITY_LIST = await Promise.all(geocodePromises);

    // Third pass: create map markers
    CITY_LIST.forEach(city => {
        if (!cityLayers[city.city]) {
            cityLayers[city.city] = { 
                deviceLayer: L.layerGroup().addTo(realMap), 
                summaryMarker: null 
            };
        }
        
        _placeDeviceIconsForCity(city, city.devices, city.devicesList);

        const icon = _renderCitySummary(city, city.devices);
        if (cityLayers[city.city].summaryMarker) {
            cityLayers[city.city].summaryMarker.setIcon(icon);
            cityLayers[city.city].summaryMarker.setLatLng([city.lat, city.lon]);
        } else {
            cityLayers[city.city].summaryMarker = L.marker([city.lat, city.lon], { icon })
                .addTo(realMap)
                .on("click", () => { 
                    realMap.flyTo([city.lat, city.lon], 8, { duration: 1.0 }); 
                    populateCityPanel(city.city); 
                });
        }
    });

    drawHeatmap();
    drawRegionBadges();
    populateGlobalCityList();
    
    // Auto-fit to show all cities
    setTimeout(fitAllCities, 500);
}

// Keep all other functions the same as your original code...
// [Rest of your functions remain unchanged - _renderCitySummary, drawHeatmap, fitAllCities, etc.]

/* ============================================================
   EXISTING FUNCTIONS (UNCHANGED)
   ============================================================ */

function _renderCitySummary(cityObj, counts) {
    const total = counts.total || 0;
    const html = `
      <div style="
        background:rgba(15,23,42,0.95);
        color:white;
        padding:10px 12px;
        border-radius:12px;
        width:170px;
        box-shadow:0 8px 30px rgba(2,6,23,0.45);
        font-family:Inter, system-ui, sans-serif;
      ">
        <div style="font-size:15px;font-weight:700">${cityObj.city}</div>
        <div style="margin-top:6px;font-size:13px; line-height:1.35;">
          <b>Total:</b> ${total}<br>
          <span style="color:#10b981">Camera: ${counts.camera || 0}</span><br>
          <span style="color:#f97316">Controller: ${counts.controller || 0}</span><br>
          <span style="color:#7c3aed">Server: ${counts.server || 0}</span><br>
          <span style="color:#2563eb">Archiver: ${counts.archiver || 0}</span>
        </div>
      </div>
    `;
    return L.divIcon({ html, className: "", iconSize: [180, 130], iconAnchor: [90, 65] });
}

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

function fitAllCities() {
    if (!CITY_LIST.length) return;
    const bounds = L.latLngBounds(CITY_LIST.map(c => [c.lat, c.lon]));
    realMap.fitBounds(bounds.pad(0.25));
}

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
    if (c) realMap.flyTo([c.lat, c.lon], 8, { duration: 1.0 });
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

/* ============================================================
   EXPORTS / BUTTON HOOKS
   ============================================================ */
document.addEventListener("DOMContentLoaded", initRealMap);
document.getElementById("toggle-heat").onclick = toggleHeat;
document.getElementById("fit-all").onclick = fitAllCities;
document.getElementById("show-global").onclick = populateGlobalCityList;
window.updateMapData = updateMapData;