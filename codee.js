i just want to show count in map wiht perfect locatin ok.. 
    in inidia wester union office
    in pune and hyderbad ok 
    in pune location i want to show like
    total 122
    camera 60
    controller 40
    archiver 20
    server 2
    in active and inactive ok 
<div class="right-panel">
              <div class="gcard tall">
                <div class="worldmap-wrapper">

                  <!-- MAP CARD -->
                  <div class="worldmap-card">

                    <div id="realmap"></div>

                    <!-- Legend + Controls Row -->
                    <div class="map-bottom-bar">

                      <!-- Legend -->
                      <div class="legend">
                        <div class="legend-item">
                          <div class="legend-box" style="background:#10b981"></div> Camera
                        </div>
                        <div class="legend-item">
                          <div class="legend-box" style="background:#f97316"></div> Controller
                        </div>
                        <div class="legend-item">
                          <div class="legend-box" style="background:#7c3aed"></div> Server
                        </div>
                        <div class="legend-item">
                          <div class="legend-box" style="background:#2563eb"></div> Archiver
                        </div>
                      </div>

                      <!-- Controls -->
                      <div class="map-controls">
                        <button id="toggle-heat" class="btn-ghost">Heat</button>
                        <button id="fit-all" class="btn-ghost">Fit All</button>
                        <button id="show-global" class="btn">Global View</button>
                      </div>

                    </div>
                  </div>

                  <!-- SIDE PANEL -->
                  <div class="region-panel" id="region-panel">
                    <h4 class="panel-title">Global (City Overview)</h4>

                    <div id="region-panel-content" class="panel-content"></div>

                    <!-- Filters -->
                    <div class="filter-block">
                      <h5>Filters</h5>

                      <select id="filter-type" class="filter-select">
                        <option value="all">All device types</option>
                        <option value="camera">Camera</option>
                        <option value="controller">Controller</option>
                        <option value="server">Server</option>
                        <option value="archiver">Archiver</option>
                      </select>

                      <select id="filter-status" class="filter-select">
                        <option value="all">All Status</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                      </select>

                      <div class="filter-actions">
                        <button id="apply-filters" class="btn">Apply</button>
                        <button id="reset-filters" class="btn-ghost">Reset</button>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </div>

C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\map.js
/* ============================
   CONFIG & DEVICE GENERATION
   ============================ */

/* City list (APAC/EMEA/NAMER/LACA) */
const CITY_LIST = [
  { city:"Mumbai", lat:19.0760, lon:72.8777, region:"APAC" },
  { city:"Pune", lat:18.5204, lon:73.8567, region:"APAC" },
  { city:"Hyderabad", lat:17.3850, lon:78.4867, region:"APAC" },
  { city:"Tokyo", lat:35.6762, lon:139.6503, region:"APAC" },
  { city:"Manila", lat:14.5995, lon:120.9842, region:"APAC" },
  { city:"Singapore", lat:1.3521, lon:103.8198, region:"APAC" },

  { city:"London", lat:51.5074, lon:-0.1278, region:"EMEA" },
  { city:"Paris", lat:48.8566, lon:2.3522, region:"EMEA" },
  { city:"Berlin", lat:52.52, lon:13.4050, region:"EMEA" },
  { city:"Dubai", lat:25.2048, lon:55.2708, region:"EMEA" },
  { city:"Johannesburg", lat:-26.2041, lon:28.0473, region:"EMEA" },

  { city:"New York", lat:40.7128, lon:-74.0060, region:"NAMER" },
  { city:"Los Angeles", lat:34.0522, lon:-118.2437, region:"NAMER" },
  { city:"Toronto", lat:43.6532, lon:-79.3832, region:"NAMER" },
  { city:"Mexico City", lat:19.4326, lon:-99.1332, region:"NAMER" },

  { city:"Sao Paulo", lat:-23.5505, lon:-46.6333, region:"LACA" },
  { city:"Rio de Janeiro", lat:-22.9068, lon:-43.1729, region:"LACA" },
  { city:"Bogota", lat:4.7110, lon:-74.0721, region:"LACA" },
  { city:"Lima", lat:-12.0464, lon:-77.0428, region:"LACA" }
];

const DEVICE_TYPES = ["camera","controller","server","archiver"];
const DEVICES_PER_TYPE = 4; // change to increase total devices

/* generate devices for testing */
function generateDevices(devicesPerType = DEVICES_PER_TYPE) {
  const arr = [];
  CITY_LIST.forEach(city => {
    DEVICE_TYPES.forEach(type => {
      for (let i=1;i<=devicesPerType;i++) {
        const jitterLat = city.lat + (Math.random()*0.02 - 0.01);
        const jitterLon = city.lon + (Math.random()*0.02 - 0.01);
        arr.push({
          type,
          city: city.city,
          region: city.region,
          lat: jitterLat,
          lon: jitterLon,
          name: `${type.toUpperCase()}-${city.city.substring(0,3).toUpperCase()}-${i}`,
          status: Math.random() > 0.25 ? "online" : "offline"
        });
      }
    });
  });
  return arr;
}

/* main devices collection (default: all devices) */
let STATIC_DEVICES = generateDevices();

/* REGION -> countries mapping (used for badges & shading) */
const REGION_COUNTRIES = {
  APAC: ["India","China","Japan","Australia","Singapore","South Korea","Indonesia","Philippines","Thailand"],
  EMEA: ["United Kingdom","Germany","France","Italy","Spain","United Arab Emirates","Saudi Arabia","South Africa","Egypt"],
  NAMER: ["United States of America","Canada","Mexico"],
  LACA:  ["Brazil","Argentina","Colombia","Peru","Chile","Mexico"]
};

/* ============================
   MAP + LAYERS
   ============================ */

let realMap, markerCluster, heatLayer, countryLayerGroup;
const regionColors = { APAC:"#0ea5e9", EMEA:"#34d399", NAMER:"#fb923c", LACA:"#a78bfa" };

/* create device icon (divIcon with inline svg) */
function createDeviceIcon(type, status) {
  const color = status === "online" ? "#10b981" : "#ef4444";
  const bg = status === "online" ? "rgba(16,185,129,0.95)" : "rgba(239,68,68,0.95)";
  let svg = "";
  switch(type) {
    case "camera":
      svg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M3 7C3 5.895 3.895 5 5 5H7L9 3H15L17 5H19C20.105 5 21 5.895 21 7V17C21 18.105 20.105 19 19 19H5C3.895 19 3 18.105 3 17V7Z" stroke="white" stroke-width="1.2"/>
               <circle cx="12" cy="12" r="3" fill="white"/></svg>`;
      break;
    case "controller":
      svg = `<svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 6H18V18H6V6Z" stroke="white" stroke-width="1.2"/><path d="M9 9H9.01" stroke="white" stroke-width="1.5"/><path d="M15 12H15.01" stroke="white" stroke-width="1.5"/></svg>`;
      break;
    case "server":
      svg = `<svg width="18" height="18" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="6" rx="1.5" stroke="white" stroke-width="1.2"/><rect x="3" y="14" width="18" height="6" rx="1.5" stroke="white" stroke-width="1.2"/></svg>`;
      break;
    case "archiver":
      svg = `<svg width="18" height="18" viewBox="0 0 24 24"><path d="M3 7H21V19H3V7Z" stroke="white" stroke-width="1.2"/><path d="M8 11H16" stroke="white" stroke-width="1.4"/></svg>`;
      break;
    default:
      svg = `<svg width="18" height="18"><circle cx="9" cy="9" r="8" fill="white"/></svg>`;
  }

  const html = `<div class="dev-icon ${status === "online" ? "dev-glow pulse" : "dev-glow-off"}" style="background:${bg}; border:2px solid ${color};">${svg}</div>`;
  return L.divIcon({ html, className:'', iconSize:[36,36], iconAnchor:[18,18] });
}

/* initialize map */
function initRealMap() {
  realMap = L.map('realmap', { preferCanvas:true }).setView([20,0],2);

  // ESRI World Imagery (satellite)
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom:20, attribution:'Tiles © Esri'
  }).addTo(realMap);

  // groups
  markerCluster = L.markerClusterGroup({ chunkedLoading:true, showCoverageOnHover:false });
  countryLayerGroup = L.layerGroup().addTo(realMap);
  realMap.addLayer(markerCluster);

  // draw countries (optional) then show everything
  drawCountryBorders()
    .catch(err => { console.warn("Country geojson failed:", err); })
    .finally(() => {
      renderDevices();            // show ALL markers
      populateGlobalCityList();   // default panel: grouped city-wise
      drawRegionBadges();         // region badges with counts
      toggleHeatOn();             // heat on by default
    });

  L.control.scale().addTo(realMap);
}

/* draw country borders using a lightweight geojson */
async function drawCountryBorders() {
  const url = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json';
  const res = await fetch(url);
  if (!res.ok) throw new Error("countries geojson not available");
  const world = await res.json();

  L.geoJSON(world, {
    style: { color:'#334155', weight:1, fillOpacity:0 },
    onEachFeature: (feature, layer) => {
      const name = feature.properties.name || "Unknown";
      layer.bindTooltip(name, { sticky:true, direction:'center' });
    }
  }).addTo(countryLayerGroup);
}

/* render devices (markers + cluster + heatmap), accepts optional filter */
function renderDevices(filter={ type:'all', status:'all' }) {
  markerCluster.clearLayers();
  const heatPoints = [];

  STATIC_DEVICES.forEach(dev => {
    if (filter.type !== 'all' && dev.type !== filter.type) return;
    if (filter.status !== 'all' && dev.status !== filter.status) return;

    const icon = createDeviceIcon(dev.type, dev.status);
    const marker = L.marker([dev.lat, dev.lon], { icon: icon, title: dev.name });

    const popupHtml = `
      <div style="min-width:200px">
        <b>${dev.name}</b><br/>
        <small>${dev.type.toUpperCase()} — ${dev.city} (${dev.region})</small><br/>
        Status: <strong style="color:${dev.status==='online'?'green':'red'}">${dev.status}</strong>
      </div>
    `;
    marker.bindPopup(popupHtml);

    marker.on('click', () => populateCityPanel(dev.city));

    markerCluster.addLayer(marker);
    heatPoints.push([dev.lat, dev.lon, dev.status === 'online' ? 0.9 : 0.4]);
  });

  realMap.addLayer(markerCluster);

  if (heatLayer) realMap.removeLayer(heatLayer);
  heatLayer = L.heatLayer(heatPoints, { radius: 28, blur: 20 }).addTo(realMap);

  // fit bounds to devices (not forced here; user can click Fit All)
}

/* populate right panel with global city grouped list (default) */
function populateGlobalCityList() {
  const panel = document.getElementById('region-panel-content');
  const cities = {}; // cityName -> aggregates

  STATIC_DEVICES.forEach(d => {
    cities[d.city] = cities[d.city] || { total:0, online:0, offline:0, byType:{} , region: d.region};
    cities[d.city].total++;
    if (d.status === 'online') cities[d.city].online++; else cities[d.city].offline++;
    cities[d.city].byType[d.type] = cities[d.city].byType[d.type] || { total:0, online:0, offline:0 };
    cities[d.city].byType[d.type].total++;
    if (d.status === 'online') cities[d.city].byType[d.type].online++; else cities[d.city].byType[d.type].offline++;
  });

  // build HTML
  const rows = [];
  rows.push(`<div class="stat-row"><div><b>Global Summary</b></div><div>${STATIC_DEVICES.length} devices</div></div>`);
  rows.push(`<div class="small-muted">Click any city to see details in the panel.</div>`);
  rows.push(`<div style="margin-top:10px" class="city-list">`);
  Object.keys(cities).sort().forEach(cityName => {
    const c = cities[cityName];
    const typesSummary = Object.keys(c.byType).map(t => `${t.toUpperCase()}: ${c.byType[t].total}`).join(' • ');
    rows.push(`
      <div class="city-item" data-city="${cityName}" onclick="onCityItemClick('${cityName}')">
        <div>
          <div style="font-weight:700">${cityName}</div>
          <div class="small-muted">${c.region} • ${c.total} devices • On:${c.online}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:12px">${typesSummary}</div>
          <div style="font-size:11px" class="small-muted">${c.online} online</div>
        </div>
      </div>
    `);
  });
  rows.push(`</div>`);
  panel.innerHTML = rows.join('');
}

/* when user clicks city item in panel */
function onCityItemClick(cityName) {
  // zoom to city bounds and open panel with city details
  const dev = STATIC_DEVICES.find(d => d.city === cityName);
  if (dev) {
    realMap.setView([dev.lat, dev.lon], 8);
  }
  populateCityPanel(cityName);
}

/* populate city panel with all devices in that city */
function populateCityPanel(cityName) {
  const panel = document.getElementById('region-panel-content');
  const devs = STATIC_DEVICES.filter(d => d.city === cityName);
  const total = devs.length, online = devs.filter(d => d.status==='online').length;
  let html = `<h4>${cityName} — ${total} devices</h4>`;
  html += `<div class="small-muted">Online: ${online} &nbsp; Offline: ${total-online}</div><hr/>`;
  devs.forEach(d => {
    html += `<div style="padding:6px 0">
      <b>${d.name}</b> — ${d.type.toUpperCase()} — <span style="color:${d.status==='online'?'green':'red'}">${d.status}</span>
    </div>`;
  });
  panel.innerHTML = html;
}

/* Count devices by region (simple via region field) */
function countDevicesInRegion(regionName) {
  const devs = STATIC_DEVICES.filter(d => d.region === regionName);
  const agg = { total: devs.length, online:0, offline:0, byType:{} };
  devs.forEach(d => {
    if (d.status === 'online') agg.online++; else agg.offline++;
    agg.byType[d.type] = agg.byType[d.type] || { total:0, online:0, offline:0 };
    agg.byType[d.type].total++;
    if (d.status === 'online') agg.byType[d.type].online++; else agg.byType[d.type].offline++;
  });
  return agg;
}

/* draw region badges (count) — places badge on first found country from the region */
function drawRegionBadges() {
  // remove previous badges if any
  if (window._regionBadgeMarkers) {
    window._regionBadgeMarkers.forEach(m => realMap.removeLayer(m));
  }
  window._regionBadgeMarkers = [];

  // If country layer exists, use it to find a placement; otherwise use preset centers
  const regionCenters = {
    APAC: [20, 100],
    EMEA: [30, 10],
    NAMER: [40, -100],
    LACA: [-10, -60]
  };

  Object.keys(REGION_COUNTRIES).forEach(regionName => {
    const counts = countDevicesInRegion(regionName);
    const badgeHTML = `<div class="badge badge-${regionName.toLowerCase()}"><b>${regionName}</b><div style="font-size:12px">${counts.total} devices</div></div>`;

    const center = regionCenters[regionName] || [0,0];
    const m = L.marker(center, {
      icon: L.divIcon({ className:'region-label', html: badgeHTML })
    }).addTo(realMap);

    m.on('click', () => {
      // zoom to region by rough bounding boxes using regionName
      if (regionName === 'APAC') realMap.fitBounds([[ -50, 60 ], [ 60, 180 ]]);
      if (regionName === 'EMEA') realMap.fitBounds([[ -35, -25 ], [ 70, 60 ]]);
      if (regionName === 'NAMER') realMap.fitBounds([[ -20, -170 ], [ 75, -30 ]]);
      if (regionName === 'LACA') realMap.fitBounds([[ -60, -120 ], [ 20, -30 ]]);
      // populate panel with region summary
      populateRegionPanel(regionName);
    });

    window._regionBadgeMarkers.push(m);
  });
}

/* populate region panel */
function populateRegionPanel(regionName) {
  const panel = document.getElementById('region-panel-content');
  const agg = countDevicesInRegion(regionName);

  const rows = [];
  rows.push(`<div class="stat-row"><div><b>Region</b></div><div>${regionName}</div></div>`);
  rows.push(`<div class="stat-row"><div><b>Total devices</b></div><div>${agg.total}</div></div>`);
  rows.push(`<div class="stat-row"><div>Online</div><div>${agg.online}</div></div>`);
  rows.push(`<div class="stat-row"><div>Offline</div><div>${agg.offline}</div></div>`);
  rows.push(`<hr/>`);

  Object.keys(agg.byType).forEach(t => {
    const v = agg.byType[t];
    rows.push(`<div class="stat-row"><div><b>${t.toUpperCase()}</b></div><div>${v.total} (On:${v.online}/Off:${v.offline})</div></div>`);
  });

  // top cities
  const cities = {};
  STATIC_DEVICES.filter(d => d.region === regionName).forEach(d => {
    cities[d.city] = cities[d.city] || { total:0, online:0 };
    cities[d.city].total++;
    if (d.status==='online') cities[d.city].online++;
  });

  const cityList = Object.keys(cities).map(c => `<li>${c}: ${cities[c].total} (On:${cities[c].online})</li>`).join('');
  rows.push(`<div style="margin-top:8px"><b>Cities</b><ul>${cityList}</ul></div>`);

  panel.innerHTML = rows.join('');
}

/* toggle heatmap on/off */
function toggleHeatOn() {
  if (!heatLayer) return;
  if (realMap.hasLayer(heatLayer)) { realMap.removeLayer(heatLayer); } else { realMap.addLayer(heatLayer); }
}

/* fit all devices */
function fitAll() {
  const bounds = L.latLngBounds(STATIC_DEVICES.map(d => [d.lat, d.lon]));
  if (bounds.isValid()) realMap.fitBounds(bounds.pad(0.2));
}

/* filters */
document.getElementById('apply-filters').addEventListener('click', () => {
  const type = document.getElementById('filter-type').value;
  const status = document.getElementById('filter-status').value;
  renderDevices({ type: type === 'all' ? 'all' : type, status: status === 'all' ? 'all' : status });
  // also update panel: if filters applied, show filtered global grouping
  populateFilteredCityList(type, status);
});

document.getElementById('reset-filters').addEventListener('click', () => {
  document.getElementById('filter-type').value = 'all';
  document.getElementById('filter-status').value = 'all';
  STATIC_DEVICES = generateDevices(); // regenerate fresh (if you want stable data, don't regenerate)
  renderDevices({ type:'all', status:'all' });
  populateGlobalCityList();
  drawRegionBadges();
});

document.getElementById('toggle-heat').addEventListener('click', () => {
  toggleHeatOn();
});

document.getElementById('fit-all').addEventListener('click', () => fitAll());

document.getElementById('show-global').addEventListener('click', () => {
  populateGlobalCityList();
  renderDevices({ type:'all', status:'all' });
});

/* populate filtered city list (when filters applied) */
function populateFilteredCityList(type, status) {
  const panel = document.getElementById('region-panel-content');
  const cities = {};
  STATIC_DEVICES.forEach(d => {
    if (type !== 'all' && d.type !== type) return;
    if (status !== 'all' && d.status !== status) return;
    cities[d.city] = cities[d.city] || { total:0, online:0, byType:{}, region:d.region };
    cities[d.city].total++;
    if (d.status === 'online') cities[d.city].online++;
    cities[d.city].byType[d.type] = cities[d.city].byType[d.type] || 0;
    cities[d.city].byType[d.type]++;
  });

  const rows = [];
  rows.push(`<div class="stat-row"><div><b>Filtered Summary</b></div><div>${Object.keys(cities).length} cities</div></div>`);
  rows.push(`<div class="city-list">`);
  Object.keys(cities).sort().forEach(city => {
    const c = cities[city];
    const typesSummary = Object.keys(c.byType).map(t => `${t.toUpperCase()}: ${c.byType[t]}`).join(' • ');
    rows.push(`
      <div class="city-item" data-city="${city}" onclick="onCityItemClick('${city}')">
        <div>
          <div style="font-weight:700">${city}</div>
          <div class="small-muted">${c.region} • ${c.total} devices • On:${c.online}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:12px">${typesSummary}</div>
        </div>
      </div>
    `);
  });
  rows.push(`</div>`);
  panel.innerHTML = rows.join('');
}

/* init */
document.addEventListener('DOMContentLoaded', initRealMap);
