/* ============================================================
   map.js — Dynamic geocoding + correct city placement
   ============================================================ */

let realMap;
let CITY_LIST = [];
let cityLayers = {};
let heatLayer = null;
window._mapRegionMarkers = [];
const regionColors = { APAC: "#0ea5e9", EMEA: "#34d399", NAMER: "#fb923c", LACA: "#a78bfa" };
const regionCenter = { APAC:[20,100], EMEA:[30,10], NAMER:[40,-100], LACA:[-10,-60] };

// Cache geocoding results
const geoCache = JSON.parse(localStorage.getItem('geoCache') || "{}");

/* ============================================================
   1. INIT MAP
   ============================================================ */
function initRealMap() {
  realMap = L.map('realmap', { preferCanvas:true }).setView([20,0],2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom:19, attribution:'&copy; OpenStreetMap contributors'
  }).addTo(realMap);

  window.markerCluster = L.markerClusterGroup({ chunkedLoading:true, showCoverageOnHover:false });
  realMap.addLayer(markerCluster);
  L.control.scale().addTo(realMap);
}

/* ============================================================
   2. GEOCODE CITY NAME (OpenStreetMap Nominatim)
   ============================================================ */
async function geocodeCity(cityName) {
  if(geoCache[cityName]) return geoCache[cityName]; // cached

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if(data && data.length) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      geoCache[cityName] = { lat, lon };
      localStorage.setItem('geoCache', JSON.stringify(geoCache));
      return { lat, lon };
    }
  } catch(e) { console.warn("Geocode failed:", cityName, e); }
  return { lat:0, lon:0 }; // fallback
}

/* ============================================================
   3. DEVICE ICON
   ============================================================ */
function _deviceIconDiv(type){
    return L.divIcon({ className:`device-icon device-${type}`, iconSize:[14,14], iconAnchor:[7,7] });
}

/* ============================================================
   4. PLACE DEVICES FOR CITY
   ============================================================ */
async function _placeDeviceIconsForCity(cityObj, deviceCounts){
    if(!cityLayers[cityObj.city]) cityLayers[cityObj.city]={ deviceLayer:L.layerGroup().addTo(realMap), summaryMarker:null };
    const layer = cityLayers[cityObj.city].deviceLayer;
    layer.clearLayers();

    const deviceTypes=['camera','controller','server','archiver'];
    deviceTypes.forEach(type=>{
        const cnt = deviceCounts[type]||0;
        for(let i=0;i<cnt;i++){
            const marker=L.marker([cityObj.lat, cityObj.lon], {icon:_deviceIconDiv(type)});
            marker.bindTooltip(`${type.toUpperCase()} ${i+1}`, {direction:'top', offset:[0,-8], opacity:0.95});
            layer.addLayer(marker);
        }
    });

    // Summary marker
    const icon = _renderCitySummary(cityObj, deviceCounts);
    if(cityLayers[cityObj.city].summaryMarker) cityLayers[cityObj.city].summaryMarker.setIcon(icon);
    else cityLayers[cityObj.city].summaryMarker = L.marker([cityObj.lat, cityObj.lon], {icon})
        .addTo(realMap)
        .on("click", ()=>{ realMap.flyTo([cityObj.lat, cityObj.lon], 7); populateCityPanel(cityObj.city); });

    markerCluster.addLayer(layer);
}

/* ============================================================
   5. CITY SUMMARY ICON
   ============================================================ */
function _renderCitySummary(cityObj, counts){
    const total = counts.total||0;
    const html=`<div style="background:rgba(15,23,42,0.95); color:white; padding:10px; border-radius:12px; width:170px;">
        <b>${cityObj.city}</b><br>Total: ${total}<br>
        Camera: ${counts.camera||0}<br>Controller: ${counts.controller||0}<br>
        Server: ${counts.server||0}<br>Archiver: ${counts.archiver||0}
    </div>`;
    return L.divIcon({ html, className:"", iconSize:[180,130], iconAnchor:[90,65] });
}

/* ============================================================
   6. UPDATE MAP DYNAMICALLY
   ============================================================ */
async function updateMapData(summary, details){
    if(!details) return;
    const deviceBuckets = details.details || details;
    if(!deviceBuckets) return;

    const cityMap = {};

    for(const [key, arr] of Object.entries(deviceBuckets)){
        if(!Array.isArray(arr)) continue;

        for(const dev of arr){
            const cityName=(dev.city||dev.location||dev.site||"Unknown").trim();
            const region=dev.region||"Unknown";

            let lat=parseFloat(dev.lat)||0;
            let lon=parseFloat(dev.lon)||0;

            if(lat===0 && lon===0){
                const geo = await geocodeCity(cityName);
                lat=geo.lat; lon=geo.lon;
            }

            const type = key.toLowerCase().includes("camera")?"camera":
                         key.toLowerCase().includes("controller")?"controller":
                         key.toLowerCase().includes("server")?"server":
                         key.toLowerCase().includes("archiver")?"archiver":null;

            if(!cityMap[cityName]) cityMap[cityName]={ city:cityName, region, lat, lon, devices:{camera:0,controller:0,server:0,archiver:0}, total:0, devicesList:[] };
            if(type) cityMap[cityName].devices[type]+=1;
            cityMap[cityName].total+=1;
            cityMap[cityName].devicesList.push(dev);
        }
    }

    CITY_LIST = Object.values(cityMap);

    // Place devices
    for(const c of CITY_LIST) await _placeDeviceIconsForCity(c, c.devices);

    drawHeatmap();
    drawRegionBadges();
    populateGlobalCityList();
}

/* ============================================================
   7. BUTTONS
   ============================================================ */
document.addEventListener("DOMContentLoaded", initRealMap);
document.getElementById("toggle-heat").onclick = ()=>{ if(heatLayer) realMap.hasLayer(heatLayer)?realMap.removeLayer(heatLayer):realMap.addLayer(heatLayer); };
document.getElementById("fit-all").onclick = ()=>{
    if(!CITY_LIST.length) return;
    const bounds=L.latLngBounds(CITY_LIST.map(c=>[c.lat,c.lon]));
    realMap.fitBounds(bounds.pad(0.25));
};
document.getElementById("show-global").onclick = populateGlobalCityList;
window.updateMapData = updateMapData;