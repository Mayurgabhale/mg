// map.js - UPDATED - Dynamic city aggregation + side panel + hover tooltips + flyTo on click
// Assumes Leaflet is loaded and your HTML matches the IDs/classes you shared.

let realMap;
let CITY_LIST = [];

// Base coordinates - I added a few commonly requested cities (Taguig, Quezon) as examples.
// Add any missing city coords here.
const CITY_COORDS = {
  "Casablanca": [33.5731, -7.5898],
  "Dubai": [25.276987, 55.296249],
  "Argentina": [-38.4161, -63.6167],
  "Austin TX": [30.2672, -97.7431],
  "Austria, Vienna": [48.2082, 16.3738],
  "Costa Rica": [9.7489, -83.7534],
  "Denver": [39.7392, -104.9903],
  "Florida, Miami": [25.7617, -80.1918],
  "Frankfurt": [50.1109, 8.6821],
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
  "Vilnius": [54.6872, 25.2797],
  "Singapore": [1.3521, 103.8198],
  "HYDERABAD": [17.3850, 78.4867],
  // Added examples the UI text referenced:
  "Taguig City": [14.5176, 121.0509],
  "Quezon": [14.6760, 121.0437]  // (Quezon City approx)
};

// ---------- map init ----------
function initRealMap() {
  realMap = L.map('realmap', {
    preferCanvas: true,
    maxBounds: [[90, -180], [-90, 180]],
    maxBoundsViscosity: 1.0,
    minZoom: 2,
    maxZoom: 20,
    worldCopyJump: true
  }).setView([15, 0], 2.5);

  // Basemap - ESRI imagery (as before). Change to any other provider if you prefer.
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    attribution: 'Tiles © Esri'
  }).addTo(realMap);

  // layer for city markers
  window.cityMarkerLayer = L.layerGroup().addTo(realMap);
  L.control.scale().addTo(realMap);
}

// ---------- util: normalize city names ----------
function normalizeCityName(raw) {
  if (!raw) return "Unknown";
  let city = raw.toString().trim();
  city = city.replace(/\s+\(.*\)$/, ''); // strip trailing paren
  const low = city.toLowerCase();

  // common normalizations (extend as needed)
  if (low.includes('taguig')) return 'Taguig City';
  if (low.includes('quezon')) return 'Quezon';
  if (low.includes('pune')) return 'Pune';
  if (low.includes('kuala') || low.includes('kualalumpur') || low.includes('kuala lumpur')) return 'Kuala lumpur';
  if (low.includes('vienna')) return 'Austria, Vienna';
  if (low.includes('dublin')) return 'Ireland, Dublin';
  if (low.includes('vilnius') || low.includes('gama') || low.includes('delta')) return 'Vilnius';

  // fallback: capitalized first letter words
  return city.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// ---------- type mapping ----------
const TYPE_KEYS = {
  camera: 'camera',
  cameras: 'camera',
  archiver: 'archiver',
  archivers: 'archiver',
  controller: 'controller',
  controllers: 'controller',
  server: 'server',
  servers: 'server',
  ccure: 'server' // sometimes type might be 'ccure' - treat as server
};

// ---------- aggregate devices by city ----------
function aggregateDevicesByCity(combinedDevices = []) {
  const map = {}; // city -> stats

  (combinedDevices || []).forEach(entry => {
    const dev = entry.device ? entry.device : entry;
    if (!dev) return;

    const rawCity = dev.city || dev.location || 'Unknown';
    const city = normalizeCityName(rawCity);

    if (!map[city]) {
      map[city] = {
        city,
        counts: { camera: 0, archiver: 0, controller: 0, server: 0 },
        online: { camera: 0, archiver: 0, controller: 0, server: 0 },
        offline: { camera: 0, archiver: 0, controller: 0, server: 0 },
        total: 0,
        lat: null,
        lon: null
      };
    }

    const typeKey = (dev.type || '').toString().toLowerCase();
    const t = TYPE_KEYS[typeKey] || null;

    map[city].total++;

    const status = (dev.status || '').toString().toLowerCase();
    const isOffline = status === 'offline' || status === 'down' || status === 'false';

    if (t) {
      map[city].counts[t] = (map[city].counts[t] || 0) + 1;
      if (isOffline) {
        map[city].offline[t] = (map[city].offline[t] || 0) + 1;
      } else {
        map[city].online[t] = (map[city].online[t] || 0) + 1;
      }
    } else {
      // unknown types are still counted into total but not type-bucketed
    }
  });

  // attach lat/lon using CITY_COORDS (fuzzy match)
  Object.values(map).forEach(c => {
    const exact = CITY_COORDS[c.city];
    if (exact) {
      c.lat = exact[0];
      c.lon = exact[1];
    } else {
      // try to fuzzy match a key that contains the city text
      const lowCity = c.city.toLowerCase();
      const matchKey = Object.keys(CITY_COORDS).find(k => k.toLowerCase().includes(lowCity) || lowCity.includes(k.toLowerCase()));
      if (matchKey) {
        c.lat = CITY_COORDS[matchKey][0];
        c.lon = CITY_COORDS[matchKey][1];
      } else {
        // leave null - you can add coords to CITY_COORDS for these cities
      }
    }
  });

  return map;
}

// ---------- helper: build side panel HTML ----------
function buildRegionPanel(mapOfCities) {
  // container
  const cont = document.getElementById('region-panel-content');
  if (!cont) return;
  cont.innerHTML = ''; // clear

  // create an array of city objects
  const cities = Object.values(mapOfCities)
    .sort((a, b) => b.total - a.total); // sort by total descending for nice overview

  // build the "Global (City Overview)" list
  cities.forEach(c => {
    const row = document.createElement('div');
    row.className = 'city-item';
    row.dataset.city = c.city;

    // City name + total
    const left = document.createElement('div');
    left.className = 'city-name';
    left.textContent = c.city;

    const right = document.createElement('div');
    right.className = 'city-count';
    right.innerHTML = `— • ${c.total} devices`;

    // append sub info (hidden by default, shown on hover if needed)
    const sub = document.createElement('div');
    sub.className = 'city-sub';
    sub.style.fontSize = '12px';
    sub.style.marginTop = '6px';
    sub.innerHTML = `
      <div>Camera: ${c.counts.camera} (Online ${c.online.camera}, Offline ${c.offline.camera})</div>
      <div>Archiver: ${c.counts.archiver} (Online ${c.online.archiver}, Offline ${c.offline.archiver})</div>
      <div>Controller: ${c.counts.controller} (Online ${c.online.controller}, Offline ${c.offline.controller})</div>
      <div>CCURE: ${c.counts.server} (Online ${c.online.server}, Offline ${c.offline.server})</div>
    `;

    row.appendChild(left);
    row.appendChild(right);
    row.appendChild(sub);

    // click handler -> fly to city on map, open popup
    row.addEventListener('click', () => {
      if (c.lat != null && c.lon != null) {
        realMap.flyTo([c.lat, c.lon], 12, { duration: 0.6 });
        // if marker exists, open its popup
        const marker = (window._cityMarkerIndex || {})[c.city];
        if (marker) {
          marker.openPopup();
        }
      } else {
        // no coords - center global and show a small notice
        alert(`${c.city} does not have coordinates configured. Add it to CITY_COORDS to enable map focus.`);
      }
    });

    // hover toggles (optional) - show sub details on hover
    row.addEventListener('mouseenter', () => row.classList.add('hover'));
    row.addEventListener('mouseleave', () => row.classList.remove('hover'));

    cont.appendChild(row);
  });

  // If there are no cities, show message
  if (cities.length === 0) {
    cont.innerHTML = '<div class="no-cities">No city data available</div>';
  }
}

// ---------- marker creation ----------
function createCityMarker(cityStats) {
  // custom divIcon: city pin with total number
  const html = `<div class="city-pin">
    <span class="pin-icon"><i class="bi bi-geo-alt-fill"></i></span>
    <span class="pin-count">${cityStats.total}</span>
  </div>`;

  const cityIcon = L.divIcon({
    className: 'city-marker',
    html: html,
    iconSize: [38, 38],
    iconAnchor: [19, 38]
  });

  const marker = L.marker([cityStats.lat, cityStats.lon], { icon: cityIcon });

  // tooltip shown on hover (sticky: shows while mouse is over marker)
  const tooltipHTML = `
    <div class="tooltip-title"><strong>${cityStats.city}</strong></div>
    <div class="tooltip-body">
      <div>• Total: ${cityStats.total}</div>
      <div>• Cameras: ${cityStats.counts.camera} (Online ${cityStats.online.camera}, Offline ${cityStats.offline.camera})</div>
      <div>• Archivers: ${cityStats.counts.archiver} (Online ${cityStats.online.archiver}, Offline ${cityStats.offline.archiver})</div>
      <div>• Controllers: ${cityStats.counts.controller} (Online ${cityStats.online.controller}, Offline ${cityStats.offline.controller})</div>
      <div>• CCURE: ${cityStats.counts.server} (Online ${cityStats.online.server}, Offline ${cityStats.offline.server})</div>
    </div>
  `;

  marker.bindTooltip(tooltipHTML, { direction: 'top', offset: [0, -10], sticky: true, opacity: 0.95, className: 'city-tooltip' });

  // popup on click with same content
  marker.bindPopup(tooltipHTML, { maxWidth: 320 });

  // optional: open popup on click and zoom
  marker.on('click', () => {
    marker.openPopup();
  });

  return marker;
}

// ---------- main update function (call this with your combinedDevices array) ----------
function updateMapFromCombined(combinedDevices) {
  // aggregate
  const byCity = aggregateDevicesByCity(combinedDevices);

  // refresh side panel
  buildRegionPanel(byCity);

  // refresh markers
  if (!window.cityMarkerLayer) {
    window.cityMarkerLayer = L.layerGroup().addTo(realMap);
  }
  window.cityMarkerLayer.clearLayers();

  // keep an index for city -> marker (used when clicking side panel)
  window._cityMarkerIndex = window._cityMarkerIndex || {};

  Object.values(byCity).forEach(c => {
    // only place marker if coordinates are available
    if (c.lat == null || c.lon == null) {
      // skip marking but still show in side panel
      return;
    }
    const marker = createCityMarker(c);
    marker.addTo(window.cityMarkerLayer);
    window._cityMarkerIndex[c.city] = marker;
  });

  // fit to bounds of visible markers (if any)
  const coords = Object.values(byCity).filter(c => c.lat != null && c.lon != null).map(c => [c.lat, c.lon]);
  if (coords.length) {
    const bounds = L.latLngBounds(coords);
    // only fit if currently global zoom or many markers
    // subtle: use pad to provide breathing room
    realMap.fitBounds(bounds.pad(0.25));
  }
}

// ---------- UI buttons ----------
function fitAllCities() {
  const layers = window.cityMarkerLayer;
  if (!layers || layers.getLayers().length === 0) return;
  const group = L.featureGroup(layers.getLayers());
  realMap.fitBounds(group.getBounds().pad(0.25));
}

// "Global View" sets map to world view
function showGlobalView() {
  realMap.setView([15, 0], 2.5);
}

// region panel toggle
function setupPanelToggle() {
  const btn = document.getElementById("mapCityOverviewBtn");
  const panel = document.getElementById("region-panel");
  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    panel.classList.toggle('open');
    // refresh map size on toggle
    setTimeout(() => realMap.invalidateSize(true), 300);
  });
}

// fullscreen button code (kept same as your original)
function setupFullscreen() {
  const fullscreenBtn = document.getElementById("mapFullscreenBtn");
  const mapCard = document.querySelector(".worldmap-card");
  if (!fullscreenBtn || !mapCard) return;

  let isFullscreen = false;
  fullscreenBtn.addEventListener("click", () => {
    isFullscreen = !isFullscreen;

    if (isFullscreen) {
      mapCard.classList.add("fullscreen");
      document.body.style.overflow = "hidden";
      fullscreenBtn.innerText = "✖ Exit Full";
    } else {
      mapCard.classList.remove("fullscreen");
      document.body.style.overflow = "auto";
      fullscreenBtn.innerText = "⛶ View Full";
    }

    setTimeout(() => realMap.invalidateSize(true), 300);
  });
}

// setup Fit/Global buttons wired to UI
function setupBottomButtons() {
  const fitBtn = document.getElementById("fit-all");
  const globalBtn = document.getElementById("show-global");
  if (fitBtn) fitBtn.addEventListener('click', fitAllCities);
  if (globalBtn) globalBtn.addEventListener('click', showGlobalView);
}

// ---------- initialize everything ----------
document.addEventListener('DOMContentLoaded', () => {
  initRealMap();
  // build base CITY_LIST from CITY_COORDS (optional)
  CITY_LIST = Object.entries(CITY_COORDS).map(([city, coords]) => ({ city, lat: coords[0], lon: coords[1] }));

  // UI wiring
  setupPanelToggle();
  setupFullscreen();
  setupBottomButtons();

  // initial placeholder content in panel
  const panelContent = document.getElementById('region-panel-content');
  if (panelContent) panelContent.innerHTML = '<div class="no-cities">Loading city data…</div>';
});

// ---------- Example tiny usage note (call this from your app when data arrives) ----------
/*
  // combinedDevices should be an array like:
  // [{ device: { id:'c1', type:'camera', status:'online', city:'Taguig City', lat: 14.5176, lon: 121.0509, name:'Cam-1' } }, ... ]
  // OR devices can be plain objects as well; the function handles entry.device and entry itself.

  // Example:
  // updateMapFromCombined(combinedDevices);

  // If you want the map to update whenever you call renderOfflineChartFromCombined(combinedDevices),
  // simply add updateMapFromCombined(combinedDevices) in that function.
*/