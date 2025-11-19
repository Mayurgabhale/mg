/* ============================================================
   map.js — Fully dynamic, correct city coordinates
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

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(realMap);

  // marker cluster
  window.markerCluster = L.markerClusterGroup({ chunkedLoading:true, showCoverageOnHover:false });
  realMap.addLayer(markerCluster);

  L.control.scale().addTo(realMap);
}

/* ============================================================
   2. DEVICE ICON
   ============================================================ */
function _deviceIconDiv(type) {
    const cls = `device-icon device-${type}`;
    return L.divIcon({ className: cls, iconSize: [14, 14], iconAnchor: [7, 7] });
}

/* ============================================================
   3. PLACE DEVICES
   ============================================================ */
function _placeDeviceIconsForCity(cityObj, deviceCounts) {
    if (!cityLayers[cityObj.city]) cityLayers[cityObj.city] = { deviceLayer: L.layerGroup().addTo(realMap), summaryMarker: null };
    const layer = cityLayers[cityObj.city].deviceLayer;
    layer.clearLayers();

    const deviceTypes = ['camera', 'controller', 'server', 'archiver'];
    deviceTypes.forEach(type => {
        const cnt = deviceCounts[type] || 0;
        for (let i = 0; i < cnt; i++) {
            const marker = L.marker([cityObj.lat, cityObj.lon], { icon: _deviceIconDiv(type) });
            marker.bindTooltip(`${type.toUpperCase()} ${i + 1}`, { direction: 'top', offset: [0, -8], opacity: 0.95 });
            layer.addLayer(marker);
        }
    });

    // Summary marker
    const icon = _renderCitySummary(cityObj, deviceCounts);
    if (cityLayers[cityObj.city].summaryMarker) {
        cityLayers[cityObj.city].summaryMarker.setIcon(icon);
    } else {
        cityLayers[cityObj.city].summaryMarker = L.marker([cityObj.lat, cityObj.lon], { icon })
            .addTo(realMap)
            .on("click", () => { realMap.flyTo([cityObj.lat, cityObj.lon], 7); populateCityPanel(cityObj.city); });
    }

    markerCluster.addLayer(layer);
}

/* ============================================================
   4. CITY SUMMARY ICON
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

/* ============================================================
   5. HEATMAP
   ============================================================ */
function drawHeatmap() {
    if (!CITY_LIST.length) return;
    const points = CITY_LIST.map(c => [c.lat, c.lon, Object.values(c.devices).reduce((a,b)=>a+b,0)]);
    const maxTotal = Math.max(...points.map(p=>p[2]),1);
    const heatPoints = points.map(p => [p[0], p[1], Math.min(1.5, p[2]/maxTotal + 0.2)]);
    if (heatLayer) realMap.removeLayer(heatLayer);
    heatLayer = L.heatLayer(heatPoints, { radius: 40, blur: 25, gradient: { 0.2:'#34d399',0.5:'#fbbf24',0.8:'#f97316'} }).addTo(realMap);
}

/* ============================================================
   6. POPULATE CITY PANEL
   ============================================================ */
function populateGlobalCityList() {
    const panel = document.getElementById("region-panel-content");
    if (!panel) return;
    let html = `<h4>Global Devices</h4><hr>`;
    CITY_LIST.forEach(c => {
        const total = Object.values(c.devices || {}).reduce((a,b)=>a+b,0);
        html += `<div class="city-item" onclick="onCityItemClick('${c.city}')">
                    <b>${c.city}</b> — ${total} devices
                 </div>`;
    });
    panel.innerHTML = html;
}

function onCityItemClick(cityName) {
    const c = CITY_LIST.find(x=>x.city===cityName);
    if (!c) return;
    realMap.flyTo([c.lat, c.lon], 7, { duration:1 });
    populateCityPanel(cityName);
}

function populateCityPanel(cityName) {
    const panel = document.getElementById("region-panel-content");
    const c = CITY_LIST.find(x=>x.city===cityName);
    if (!c || !panel) return;
    panel.innerHTML = `
      <h4>${c.city}</h4>
      <div>Camera: ${c.devices.camera || 0}</div>
      <div>Controller: ${c.devices.controller || 0}</div>
      <div>Server: ${c.devices.server || 0}</div>
      <div>Archiver: ${c.devices.archiver || 0}</div>
    `;
}

/* ============================================================
   7. REGION BADGES
   ============================================================ */
function drawRegionBadges() {
    window._mapRegionMarkers.forEach(m=>realMap.removeLayer(m));
    window._mapRegionMarkers = [];

    Object.keys(regionCenter).forEach(region=>{
        const devices = CITY_LIST.filter(c=>c.region===region)
            .reduce((sum,c)=>sum+Object.values(c.devices||{}).reduce((a,b)=>a+b,0),0);
        const html = `<div class="region-badge" style="background:${regionColors[region]}">${region}<br>${devices} devices</div>`;
        const marker = L.marker(regionCenter[region], { icon:L.divIcon({ html, className:"", iconSize:[120,60], iconAnchor:[60,30] }) })
            .addTo(realMap)
            .on("click",()=>populateRegionPanel(region));
        window._mapRegionMarkers.push(marker);
    });
}

function populateRegionPanel(region) {
    const panel = document.getElementById("region-panel-content");
    if (!panel) return;
    let html = `<h4>${region} Region</h4><hr>`;
    CITY_LIST.filter(c=>c.region===region).forEach(c=>{
        const total = Object.values(c.devices||{}).reduce((a,b)=>a+b,0);
        html += `<div class="city-item" onclick="onCityItemClick('${c.city}')">${c.city} — ${total}</div>`;
    });
    panel.innerHTML = html;
}

/* ============================================================
   8. UPDATE MAP DYNAMICALLY
   ============================================================ */
function updateMapData(summary, details) {
    if (!details) return;

    const deviceBuckets = details.details || details;
    if (!deviceBuckets) return;

    const cityMap = {};
    Object.entries(deviceBuckets).forEach(([key, arr])=>{
        if (!Array.isArray(arr)) return;
        arr.forEach(dev=>{
            const cityName = (dev.city || dev.location || dev.site || "Unknown").trim();
            const region = dev.region || "Unknown";

            // IMPORTANT: Ensure lat/lon exists for correct placement
            const lat = parseFloat(dev.lat) || 0;
            const lon = parseFloat(dev.lon) || 0;

            const type = key.toLowerCase().includes("camera") ? "camera" :
                         key.toLowerCase().includes("controller") ? "controller" :
                         key.toLowerCase().includes("server") ? "server" :
                         key.toLowerCase().includes("archiver") ? "archiver" : null;

            if (!cityMap[cityName]) cityMap[cityName] = { city:cityName, region, lat, lon, devices:{camera:0,controller:0,server:0,archiver:0}, total:0, devicesList:[] };
            if (type) cityMap[cityName].devices[type] += 1;
            cityMap[cityName].total += 1;
            cityMap[cityName].devicesList.push(dev);
        });
    });

    CITY_LIST = Object.values(cityMap);

    CITY_LIST.forEach(c=>_placeDeviceIconsForCity(c, c.devices));

    drawHeatmap();
    drawRegionBadges();
    populateGlobalCityList();
}

/* ============================================================
   9. BUTTON HOOKS
   ============================================================ */
document.addEventListener("DOMContentLoaded", initRealMap);
document.getElementById("toggle-heat").onclick = ()=>{ if(heatLayer) realMap.hasLayer(heatLayer)?realMap.removeLayer(heatLayer):realMap.addLayer(heatLayer); };
document.getElementById("fit-all").onclick = ()=>{
    if(!CITY_LIST.length) return;
    const bounds = L.latLngBounds(CITY_LIST.map(c=>[c.lat,c.lon]));
    realMap.fitBounds(bounds.pad(0.25));
};
document.getElementById("show-global").onclick = populateGlobalCityList;
window.updateMapData = updateMapData;