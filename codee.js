
dont change map i want my privviuse map ont in black ok, 
   and why add const CITY_LIST =  this alos daynamic section ok getting throug the api ok remove const CITY_LIST and correct it 

/* map.js — upgraded to accept live counts from script.js (fetchData)
   Replaces previous map.js. Assumes script.js calls window.updateMapData(summary, details)
   after fetching and processing data.
*/

/* ============================================================
   1. CITY DEFINITIONS (fallback / initial static values)
   ============================================================ */

const CITY_LIST = [
    { city: "Pune", lat: 18.5204, lon: 73.8567, region: "APAC", devices: { camera: 60, controller: 40, server: 2, archiver: 20 } },
    { city: "Hyderabad", lat: 17.3850, lon: 78.4867, region: "APAC", devices: { camera: 40, controller: 28, server: 10, archiver: 20 } },
    { city: "London", lat: 51.5074, lon: -0.1278, region: "EMEA", devices: { camera: 22, controller: 14, server: 5, archiver: 10 } },
    { city: "New York", lat: 40.7128, lon: -74.0060, region: "NAMER", devices: { camera: 35, controller: 20, server: 15, archiver: 12 } },
    { city: "Sao Paulo", lat: -23.5505, lon: -46.6333, region: "LACA", devices: { camera: 18, controller: 12, server: 5, archiver: 6 } }
];

/* ============================================================
   2. MAP / LAYER VARIABLES
   ============================================================ */

let realMap;
let cityLayers = {}; // cityName -> { summaryMarker, deviceLayer: L.LayerGroup, labelMarker }
let heatLayer = null;

const regionColors = { APAC: "#0ea5e9", EMEA: "#34d399", NAMER: "#fb923c", LACA: "#a78bfa" };
const regionCenter = { APAC: [20, 100], EMEA: [30, 10], NAMER: [40, -100], LACA: [-10, -60] };

/* ============================================================
   3. INIT MAP
   ============================================================ */

function initRealMap() {
    realMap = L.map("realmap", { preferCanvas: true }).setView([20, 0], 2);

    // Premium dark basemap (Carto dark)
    // L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    //     maxZoom: 19,
    //     attribution: & copy; OpenStreetMap contributors
    // }).addTo(realMap);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(realMap);

    // prepare per-city layer containers
    CITY_LIST.forEach(c => {
        cityLayers[c.city] = {
            summaryMarker: null,
            deviceLayer: L.layerGroup().addTo(realMap),
            labelMarker: null
        };
    });

    drawRegionBadges();
    renderCitySummary();       // initial (static/fallback)
    drawHeatmap();             // initial
    fitAllCities();
    L.control.scale().addTo(realMap);
}

/* ============================================================
   4. RENDER / UPDATE CITY SUMMARY MARKERS (uses current CITY_LIST.devices)
   ============================================================ */

function renderCitySummary() {
    // for each city, create or update its summary marker
    CITY_LIST.forEach(c => {
        const total = (c.devices && typeof c.devices === "object")
            ? (c.devices.camera || 0) + (c.devices.controller || 0) + (c.devices.server || 0) + (c.devices.archiver || 0)
            : 0;

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
        <div style="font-size:15px;font-weight:700">${c.city}</div>
        <div style="margin-top:6px;font-size:13px; line-height:1.35;">
          <b>Total:</b> ${total}<br>
          <span style="color:#10b981">Camera: ${c.devices.camera || 0}</span><br>
          <span style="color:#f97316">Controller: ${c.devices.controller || 0}</span><br>
          <span style="color:#7c3aed">Server: ${c.devices.server || 0}</span><br>
          <span style="color:#2563eb">Archiver: ${c.devices.archiver || 0}</span>
        </div>
      </div>
    `;

        const icon = L.divIcon({ html, className: "", iconSize: [180, 130], iconAnchor: [90, 65] });

        // if marker exists, update icon; otherwise create
        if (cityLayers[c.city] && cityLayers[c.city].summaryMarker) {
            cityLayers[c.city].summaryMarker.setIcon(icon);
        } else {
            const marker = L.marker([c.lat, c.lon], { icon }).addTo(realMap);
            marker.on("click", () => {
                realMap.flyTo([c.lat, c.lon], 7, { duration: 1.1 });
                populateCityPanel(c.city);
            });
            cityLayers[c.city].summaryMarker = marker;
        }
    });
}

/* ============================================================
   5. HEATMAP (recreated from current CITY_LIST totals)
   ============================================================ */

function drawHeatmap() {
    // compute points and relative intensities
    const totals = CITY_LIST.map(c => {
        const total = (c.devices) ? (c.devices.camera || 0) + (c.devices.controller || 0) + (c.devices.server || 0) + (c.devices.archiver || 0) : 0;
        return { lat: c.lat, lon: c.lon, total };
    });

    let maxTotal = 1;
    totals.forEach(t => { if (t.total > maxTotal) maxTotal = t.total; });

    const heatPoints = totals.map(t => [t.lat, t.lon, Math.min(1.5, (t.total / maxTotal) + 0.2)]);

    if (heatLayer) realMap.removeLayer(heatLayer);
    heatLayer = L.heatLayer(heatPoints, { radius: 40, blur: 25, gradient: { 0.2: '#34d399', 0.5: '#fbbf24', 0.8: '#f97316' } }).addTo(realMap);
}

/* toggle helper (button already connected elsewhere) */
function toggleHeat() {
    if (!heatLayer) return;
    if (realMap.hasLayer(heatLayer)) realMap.removeLayer(heatLayer);
    else realMap.addLayer(heatLayer);
}

/* ============================================================
   6. FIT ALL CITIES
   ============================================================ */
function fitAllCities() {
    const bounds = L.latLngBounds(CITY_LIST.map(c => [c.lat, c.lon]));
    realMap.fitBounds(bounds.pad(0.25));
}

/* ============================================================
   7. SIDE PANEL / CITY LIST
   ============================================================ */

function populateGlobalCityList() {
    const panel = document.getElementById("region-panel-content");
    if (!panel) return;

    let html = `<h4>Global Devices</h4><hr>`;
    CITY_LIST.forEach(c => {
        const total = (c.devices) ? (c.devices.camera || 0) + (c.devices.controller || 0) + (c.devices.server || 0) + (c.devices.archiver || 0) : 0;
        html += `
      <div class="city-item" onclick="onCityItemClick('${c.city}')">
        <div style="font-weight:700">${c.city}</div>
        <div class="small-muted">${c.region} • ${total} devices</div>
      </div>
    `;
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

    const total = (c.devices) ? (c.devices.camera || 0) + (c.devices.controller || 0) + (c.devices.server || 0) + (c.devices.archiver || 0) : 0;

    panel.innerHTML = `
      <h4>${cityName} — ${total} devices</h4>
      <hr>
      <div><b>Camera:</b> ${c.devices.camera || 0}</div>
      <div><b>Controller:</b> ${c.devices.controller || 0}</div>
      <div><b>Server:</b> ${c.devices.server || 0}</div>
      <div><b>Archiver:</b> ${c.devices.archiver || 0}</div>
    `;
}

/* ============================================================
   8. REGION BADGES
   ============================================================ */

function drawRegionBadges() {
    // remove previous region markers if any: easiest is to just add them afresh.
    Object.keys(regionCenter).forEach(region => {
        // compute devices per region based on CITY_LIST
        const devices = CITY_LIST.filter(c => c.region === region)
            .reduce((sum, c) => sum + ((c.devices) ? (c.devices.camera || 0) + (c.devices.controller || 0) + (c.devices.server || 0) + (c.devices.archiver || 0) : 0), 0);

        const html = `
      <div class="region-badge" style="background:${regionColors[region]}">
        ${region}<br>${devices} devices
      </div>
    `;

        L.marker(regionCenter[region], {
            icon: L.divIcon({ html, className: "", iconSize: [120, 60], iconAnchor: [60, 30] })
        }).addTo(realMap).on("click", () => populateRegionPanel(region));
    });
}

function populateRegionPanel(region) {
    const panel = document.getElementById("region-panel-content");
    if (!panel) return;

    const cities = CITY_LIST.filter(c => c.region === region);
    let html = `<h4>${region} Region</h4><hr>`;
    cities.forEach(c => {
        const total = (c.devices) ? (c.devices.camera || 0) + (c.devices.controller || 0) + (c.devices.server || 0) + (c.devices.archiver || 0) : 0;
        html += `<div class="city-item" onclick="onCityItemClick('${c.city}')"><b>${c.city}</b> — ${total} devices</div>`;
    });
    panel.innerHTML = html;
}

/* ============================================================
   9. DEVICE ICONS AROUND CITY (animated, one marker per device)
   ============================================================ */

function _deviceIconDiv(type) {
    // small shapes using classes that should exist in the page CSS (see earlier suggestions)
    const cls = `device-icon device-${type}`; // expects .device-icon and .device-camera etc.
    return L.divIcon({ className: cls, iconSize: [14, 14], iconAnchor: [7, 7] });
}

function _placeDeviceIconsForCity(cityObj, deviceCounts, devicesListForCity = []) {
    // deviceCounts: { camera: n, controller: n, server: n, archiver: n }
    // devicesListForCity optional: array of device objects with status (for future hover)
    const layer = cityLayers[cityObj.city].deviceLayer;
    layer.clearLayers();

    // simple strategy: scatter icons around the city in a small cluster using random offsets
    const deviceTypes = ['camera', 'controller', 'server', 'archiver'];
    deviceTypes.forEach(type => {
        const cnt = (deviceCounts && deviceCounts[type]) ? deviceCounts[type] : 0;
        // If there are many devices, cluster into max 30 icons for readability
        const displayCount = Math.min(cnt, 30);
        for (let i = 0; i < displayCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radiusDeg = 0.02 + Math.random() * 0.035; // distance in degrees
            const lat = cityObj.lat + Math.cos(angle) * radiusDeg;
            const lon = cityObj.lon + Math.sin(angle) * radiusDeg;
            const marker = L.marker([lat, lon], { icon: _deviceIconDiv(type) });

            // optional tooltip with type + index
            marker.bindTooltip(`${type.toUpperCase()} ${i + 1}`, { direction: 'top', offset: [0, -8], opacity: 0.95 });
            layer.addLayer(marker);
        }

        // if there are more than displayCount, add a small label cluster +count
        if (cnt > displayCount) {
            const moreHtml = `<div class="city-label-box" style="padding:6px 8px; font-size:12px;">${type}: ${cnt}</div>`;
            const labelLat = cityObj.lat + 0.045; // place label a little above the city
            const labelLon = cityObj.lon + (type === 'camera' ? 0.03 : (type === 'controller' ? -0.03 : 0));
            const labelMarker = L.marker([labelLat, labelLon], { icon: L.divIcon({ html: moreHtml, className: "" }) });
            layer.addLayer(labelMarker);
        }
    });
}

/* ============================================================
   10. MAIN: accept live data from script.js and update map
   ============================================================ */

/**
 * updateMapData(summary, details)
 * - summary: the summary payload returned by your API (may be used in future)
 * - details: the details payload returned by your API. Expected shape used here:
 *     details.details -> { camera: [ { city: "Pune", status: "online", ...}, ... ], controller: [...], ... }
 */
function updateMapData(summary, details) {
    if (!realMap) {
        console.warn("Map not initialized yet; updateMapData will apply once map exists.");
        return;
    }

    // Defensive: locate the object holding device arrays
    const deviceBuckets = details && (details.details || details) || null;
    if (!deviceBuckets || typeof deviceBuckets !== "object") {
        console.warn("updateMapData: no usable details payload found.");
        return;
    }

    // Build cityCounts map: cityName -> { camera: n, controller: n, server: n, archiver: n, total: n, online: n }
    const cityCounts = {}; // dynamic counts
    const deviceTypeNormalize = (key) => {
        const k = (key || "").toLowerCase();
        if (k.includes("camera")) return "camera";
        if (k.includes("controller")) return "controller";
        if (k.includes("server") || k.includes("ccure")) return "server";
        if (k.includes("archiver")) return "archiver";
        // fallback: return normalized version of key
        return k.replace(/s$/, '');
    };

    Object.entries(deviceBuckets).forEach(([rawKey, arr]) => {
        const type = deviceTypeNormalize(rawKey);
        if (!Array.isArray(arr)) return;
        arr.forEach(dev => {
            const city = (dev.city || dev.location || dev.site || "Unknown").trim();
            if (!cityCounts[city]) {
                cityCounts[city] = { camera: 0, controller: 0, server: 0, archiver: 0, total: 0, online: 0, offline: 0, devices: [] };
            }
            // increment type if matches recognized types
            if (["camera", "controller", "server", "archiver"].includes(type)) {
                cityCounts[city][type] += 1;
            } else {
                // ignore unknown types for per-type counts but still count total
            }
            cityCounts[city].total += 1;

            const status = (dev.status || dev.state || "").toString().toLowerCase();
            if (status === "online" || status === "up" || status === "active") cityCounts[city].online += 1;
            else cityCounts[city].offline += 1;

            // keep raw device for possible tooltips/inspection
            cityCounts[city].devices.push(dev);
        });
    });

    // Apply counts back onto CITY_LIST for known cities (match by name)
    CITY_LIST.forEach(c => {
        const counts = cityCounts[c.city] || { camera: 0, controller: 0, server: 0, archiver: 0, total: 0, online: 0, offline: 0, devices: [] };

        // Update the in-memory CITY_LIST devices object so other map utilities render based on real counts
        c.devices = {
            camera: counts.camera || 0,
            controller: counts.controller || 0,
            server: counts.server || 0,
            archiver: counts.archiver || 0
        };

        // Update summary popup marker
        if (cityLayers[c.city] && cityLayers[c.city].summaryMarker) {
            // Just re-create the popup content by calling renderCitySummary which will set icons for all cities
            // But to minimize churn, we update only this city's marker icon:
            const total = counts.total;
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
                <div style="font-size:15px;font-weight:700">${c.city}</div>
                <div style="margin-top:6px;font-size:13px; line-height:1.35;">
                  <b>Total:</b> ${total}<br>
                  <span style="color:#10b981">Camera: ${c.devices.camera || 0}</span><br>
                  <span style="color:#f97316">Controller: ${c.devices.controller || 0}</span><br>
                  <span style="color:#7c3aed">Server: ${c.devices.server || 0}</span><br>
                  <span style="color:#2563eb">Archiver: ${c.devices.archiver || 0}</span>
                </div>
              </div>
            `;
            const icon = L.divIcon({ html, className: "", iconSize: [180, 130], iconAnchor: [90, 65] });
            cityLayers[c.city].summaryMarker.setIcon(icon);
        }

        // Update device cluster icons for this city
        _placeDeviceIconsForCity(c, counts, counts.devices);
    });

    // Recreate heatmap & region badges (they rely on CITY_LIST.devices)
    drawHeatmap();

    // Clear existing region badges and redraw (simple approach: remove all markers then redraw).
    // NOTE: because we don't keep track of region badge markers, easiest is to clear whole map overlays and redraw summary + badges.
    // For now, we will remove and re-add: (keep summary markers & deviceLayers in place)
    // To avoid removing current markers from the map, let's just draw fresh region markers (they will stack if you call repeatedly).
    // To avoid stacking, we'll keep a simple guard: remove existing elements with a CSS class we used earlier is not trivial.
    // Simpler: re-render all city summaries and region badges by removing previous region badges container element markers --
    // but to keep this code robust, call renderCitySummary() then drawRegionBadges() (region badges are small and ok to duplicate once per update).
    // To prevent duplicates, we clear map of previous region markers by remembering them:

    // remove any previously added region markers stored on map (we'll store them locally)
    if (window._mapRegionMarkers && Array.isArray(window._mapRegionMarkers)) {
        window._mapRegionMarkers.forEach(m => { try { realMap.removeLayer(m); } catch (e) { } });
    }
    window._mapRegionMarkers = [];

    // draw region badges and store them
    Object.keys(regionCenter).forEach(region => {
        const devices = CITY_LIST.filter(c => c.region === region)
            .reduce((sum, c) => sum + ((c.devices) ? (c.devices.camera || 0) + (c.devices.controller || 0) + (c.devices.server || 0) + (c.devices.archiver || 0) : 0), 0);

        const html = `<div class="region-badge" style="background:${regionColors[region]};">
            ${region}<br>${devices} devices
          </div>`;

        const marker = L.marker(regionCenter[region], {
            icon: L.divIcon({ html, className: "", iconSize: [120, 60], iconAnchor: [60, 30] })
        }).addTo(realMap).on("click", () => populateRegionPanel(region));

        window._mapRegionMarkers.push(marker);
    });

    // Update side panel list
    populateGlobalCityList();
}

/* ============================================================
   11. EXPORTS / BUTTON HOOKS
   ============================================================ */

document.getElementById("toggle-heat").onclick = toggleHeat;
document.getElementById("fit-all").onclick = fitAllCities;
document.getElementById("show-global").onclick = populateGlobalCityList;

// Expose updateMapData globally so script.js can call it after fetch
window.updateMapData = updateMapData;

// Initialize map after DOM
document.addEventListener("DOMContentLoaded", initRealMap);
