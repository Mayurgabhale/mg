not disoly offline count please chekc code carefully.. 
  
// map.js
// Ensures the map uses the exact same aggregation logic as the bar chart
// so map counts match the bar chart counts.

(function () {
  // ---------- Globals ----------
  let realMap = null;
  window.cityMarkerLayer = null;
  window._cityMarkerIndex = {};

  // ---------- Coordinates (extend as needed) ----------
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
    "Taguig City": [14.5176, 121.0509],
    "Quezon": [14.6760, 121.0437]
  };

  // ---------- TYPE MAP (same as bar code) ----------
  const TYPE_MAP = {
    cameras: 'camera',
    archivers: 'archiver',
    controllers: 'controller',
    servers: 'server'
  };

  // ---------- normalizeCityName (same logic as bar chart) ----------
  function normalizeCityName(city) {
    if (!city) return "Unknown";
    city = city.toString().toLowerCase().trim();

    if (city.startsWith("pune")) return "Pune";

    if (city.includes("vilnius") ||
      city.includes("gama") ||
      city.includes("delta")) {
      return "Vilnius";
    }

    return city.charAt(0).toUpperCase() + city.slice(1);
  }

  // ---------- Ensure map div height if CSS missing ----------
  function ensureMapDivHeight() {
    const el = document.getElementById("realmap");
    if (!el) return;
    const h = el.clientHeight;
    if (!h || h < 20) {
      el.style.minHeight = "420px";
      el.style.height = "420px";
    }
  }

  // ---------- Leaflet loaded check ----------
  function isLeafletLoaded() {
    return typeof L !== "undefined" && !!L;
  }

  // ---------- Use the exact buildCityBarDataWithBreakdown if present, otherwise include an identical copy ----------
  // function safeBuildCityBarDataWithBreakdown(combinedDevices) {
  //   if (typeof window.buildCityBarDataWithBreakdown === "function") {
  //     try {
  //       return window.buildCityBarDataWithBreakdown(combinedDevices);
  //     } catch (e) {
  //       console.warn("map.js: buildCityBarDataWithBreakdown threw, falling back to internal implementation", e);
  //     }
  //   }

  //   // Internal copy (identical behavior to the bar chart's version you posted)
  //   const map = {}; // city -> info

  //   if (!Array.isArray(combinedDevices)) return { labels: [], values: [], details: [] };

  //   combinedDevices.forEach(entry => {
  //     if (!entry || !entry.device) return;
  //     const dev = entry.device;

  //     const rawCity = (dev.city || "Unknown").toString();
  //     const city = normalizeCityName(rawCity);

  //     if (!map[city]) {
  //       map[city] = {
  //         city,
  //         total: 0,
  //         offline: {
  //           camera: 0,
  //           controller: 0,
  //           archiver: 0,
  //           server: 0
  //         },
  //         risk: "Low" // default
  //       };
  //     }

  //     map[city].total++;

  //     const status = (dev.status || "").toLowerCase();
  //     const devTypeKey = (dev.type || "").toLowerCase();

  //     if (status === "offline") {
  //       const short = TYPE_MAP[devTypeKey];
  //       if (short && map[city].offline.hasOwnProperty(short)) {
  //         map[city].offline[short]++;
  //       }
  //     }
  //   });

  //   // Apply risk logic
  //   Object.values(map).forEach(cityObj => {
  //     const off = cityObj.offline;
  //     const cam = off.camera;
  //     const ctrl = off.controller;
  //     const arch = off.archiver;
  //     const serv = off.server;

  //     if (
  //       serv > 0 ||
  //       ctrl > 0 ||
  //       arch > 0 ||
  //       (cam > 0 && (ctrl > 0 || arch > 0 || serv > 0))
  //     ) {
  //       cityObj.risk = "High";
  //     } else if (cam > 0) {
  //       cityObj.risk = "Medium";
  //     } else {
  //       cityObj.risk = "Low";
  //     }
  //   });

  //   // Keep insertion order; then shuffle (the bar chart shuffled)
  //   let entries = Object.values(map);
  //   for (let i = entries.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [entries[i], entries[j]] = [entries[j], entries[i]];
  //   }

  //   const labels = entries.map(e => e.city);
  //   const values = entries.map(e => e.total);
  //   const details = entries.map(e => ({
  //     city: e.city,
  //     total: e.total,
  //     offline: { ...e.offline },
  //     risk: e.risk
  //   }));

  //   return { labels, values, details };
  // }

  function safeBuildCityBarDataWithBreakdown(combinedDevices) {
  if (typeof window.buildCityBarDataWithBreakdown === "function") {
    try {
      return window.buildCityBarDataWithBreakdown(combinedDevices);
    } catch (e) {
      console.warn("map.js: buildCityBarDataWithBreakdown threw, falling back to internal implementation", e);
    }
  }

  const map = {}; 

  if (!Array.isArray(combinedDevices)) return { labels: [], values: [], details: [] };

  combinedDevices.forEach(entry => {
    if (!entry || !entry.device) return;
    const dev = entry.device;

    const rawCity = (dev.city || "Unknown").toString();
    const city = normalizeCityName(rawCity);

    if (!map[city]) {
      map[city] = {
        city,
        total: 0,
        offline: { camera: 0, controller: 0, archiver: 0, server: 0 },
        risk: "Low"
      };
    }

    map[city].total++;

    const status = (dev.status || "").toLowerCase();
    const devTypeKey = (dev.type || "").toLowerCase();
    const short = TYPE_MAP[devTypeKey];

    if (status === "offline" && short && map[city].offline.hasOwnProperty(short)) {
      map[city].offline[short]++;
    }
  });

  Object.values(map).forEach(cityObj => {
    const off = cityObj.offline;
    const cam = off.camera;
    const ctrl = off.controller;
    const arch = off.archiver;
    const serv = off.server;

    if (
      serv > 0 ||
      ctrl > 0 ||
      arch > 0 ||
      (cam > 0 && (ctrl > 0 || arch > 0 || serv > 0))
    ) {
      cityObj.risk = "High";
    } else if (cam > 0) {
      cityObj.risk = "Medium";
    } else {
      cityObj.risk = "Low";
    }
  });

  // ✅ FIXED: NO SHUFFLE — keeps city order consistent for the map
  let entries = Object.values(map);

  const labels = entries.map(e => e.city);
  const values = entries.map(e => e.total);
  const details = entries.map(e => ({
    city: e.city,
    total: e.total,
    offline: { ...e.offline },
    risk: e.risk
  }));

  return { labels, values, details };
}

  // ---------- Build per-city type totals (total + offline) using same rules as bar chart ----------
  function buildTypeTotalsFromCombined(combinedDevices = []) {
    const result = {}; // city -> { counts: {camera,..}, offline: {camera,..} }

    (combinedDevices || []).forEach(entry => {
      const dev = entry.device ? entry.device : entry;
      if (!dev) return;

      const city = normalizeCityName(dev.city || "Unknown");
      const status = (dev.status || "").toLowerCase();
      const devTypeKey = (dev.type || "").toLowerCase();
      const short = TYPE_MAP[devTypeKey];

      if (!result[city]) {
        result[city] = {
          city,
          counts: { camera: 0, archiver: 0, controller: 0, server: 0 },
          offline: { camera: 0, archiver: 0, controller: 0, server: 0 },
          total: 0,
          online: 0
        };
      }

      result[city].total++;
      // if (status === "offline") result[city].offlineCount = (result[city].offlineCount || 0) + 1; 
      if (status === "offline") {
        result[city].offlineCount = (result[city].offlineCount || 0) + 1;
      }

      // if (short && result[city].counts.hasOwnProperty(short)) {
      //   result[city].counts[short] = (result[city].counts[short] || 0) + 1;

      //   if (status === "offline") {
      //     result[city].offline[short] = (result[city].offline[short] || 0) + 1;
      //   }

      // }

      if (short && result[city].counts.hasOwnProperty(short)) {
        result[city].counts[short]++;
        if (status === "offline") {
          result[city].offline[short] = (result[city].offline[short] || 0) + 1;
        }
      }

    });

    // compute online per city (total - offline)
    Object.values(result).forEach(c => {
      c.online = c.total - (c.offline.camera + c.offline.controller + c.offline.archiver + c.offline.server);
    });

    return result;
  }

  // ---------- fuzzy coords lookup ----------
  function fuzzyCoords(city) {
    if (!city) return null;
    if (CITY_COORDS[city]) return CITY_COORDS[city];
    const low = city.toLowerCase();
    const matchKey = Object.keys(CITY_COORDS).find(k => k.toLowerCase().includes(low) || low.includes(k.toLowerCase()));
    if (matchKey) return CITY_COORDS[matchKey];
    return null;
  }

  // ---------- initMap ----------
  function initRealMap() {
    ensureMapDivHeight();
    if (!isLeafletLoaded()) {
      console.error("Leaflet is not loaded. Add <script src='https://unpkg.com/leaflet/dist/leaflet.js'></script>");
      return;
    }
    if (realMap) return;

    realMap = L.map("realmap", {
      preferCanvas: true,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true
    }).setView([15, 0], 2.5);

    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 20,
      attribution: "Tiles © Esri"
    }).addTo(realMap);

    window.cityMarkerLayer = L.layerGroup().addTo(realMap);
    console.debug("map.js: map initialized");
  }

  // ---------- createCityMarker ----------
  // function createCityMarker(cityStats, extraDetail) {
  //   const labelHTML = `<div class="city-pin"><i class="bi bi-geo-alt-fill"></i><div class="city-count">${cityStats.total}</div></div>`;
  //   const icon = L.divIcon({
  //     className: "city-marker",
  //     html: labelHTML,
  //     iconSize: [40, 40],
  //     iconAnchor: [20, 40]
  //   });

  //   const lat = cityStats.lat, lon = cityStats.lon;
  //   const marker = L.marker([lat, lon], { icon });

  //   // tooltip content: use type totals + offline breakdown from extraDetail (bar)
  //   const off = extraDetail && extraDetail.offline ? extraDetail.offline : { camera: 0, controller: 0, archiver: 0, server: 0 };
  //   const risk = extraDetail ? extraDetail.risk : (cityStats.offline > 0 ? "Medium" : "Low");

  //   const tooltip = `
  //     <div style="min-width:220px">
  //       <strong>${cityStats.city}</strong><br/>
  //       Total: ${cityStats.total} <br/>
  //       Online: ${cityStats.online} | Offline: ${cityStats.offline} <br/><br/>
  //       Cameras: ${cityStats.counts.camera} (Offline ${off.camera || 0})<br/>
  //       Archivers: ${cityStats.counts.archiver} (Offline ${off.archiver || 0})<br/>
  //       Controllers: ${cityStats.counts.controller} (Offline ${off.controller || 0})<br/>
  //       CCURE: ${cityStats.counts.server} (Offline ${off.server || 0})<br/>
  //       <hr style="margin:6px 0"/>
  //       Risk: ${risk}
  //     </div>
  //   `;

  //   marker.bindTooltip(tooltip, { sticky: true, direction: "top", opacity: 0.95, className: "city-tooltip" });
  //   marker.bindPopup(tooltip, { maxWidth: 320 });

  //   return marker;
  // }

  function createCityMarker(cityStats, extraDetail) {

    // ✅ calculate offline total correctly
    const offlineTotal =
      (cityStats.offline?.camera || 0) +
      (cityStats.offline?.controller || 0) +
      (cityStats.offline?.archiver || 0) +
      (cityStats.offline?.server || 0);

    const labelHTML = `
    <div class="city-pin">
      <i class="bi bi-geo-alt-fill"></i>
      <div class="city-count">${cityStats.total}</div>
    </div>`;

    const icon = L.divIcon({
      className: "city-marker",
      html: labelHTML,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    const lat = cityStats.lat, lon = cityStats.lon;
    const marker = L.marker([lat, lon], { icon });

    const off = extraDetail?.offline || {
      camera: 0, controller: 0, archiver: 0, server: 0
    };

    const risk = extraDetail?.risk || "Low";

    // ✅ TOOLTIP FIXED
    const tooltip = `
    <div style="min-width:220px">
      <strong>${cityStats.city}</strong><br/>
      Total: ${cityStats.total}<br/>
      Online: ${cityStats.online} | Offline: ${offlineTotal}<br/><br/>

      Cameras: ${cityStats.counts.camera} (Offline ${off.camera})<br/>
      Archivers: ${cityStats.counts.archiver} (Offline ${off.archiver})<br/>
      Controllers: ${cityStats.counts.controller} (Offline ${off.controller})<br/>
      Servers: ${cityStats.counts.server} (Offline ${off.server})<br/>

      <hr style="margin:6px 0"/>
      Risk: ${risk}
    </div>
  `;

    marker.bindTooltip(tooltip, {
      sticky: true,
      direction: "top",
      opacity: 0.95,
      className: "city-tooltip"
    });

    marker.bindPopup(tooltip, { maxWidth: 320 });

    return marker;
  }

  // ---------- flatten details.details -> combinedDevices array ----------
  function flattenDetailsToCombined(details) {
    const combined = [];
    if (!details) return combined;

    // details may be an object with key -> array (as in your code)
    const buckets = details.details || details;
    if (!buckets || typeof buckets !== "object") return combined;

    Object.values(buckets).forEach(arr => {
      if (Array.isArray(arr)) {
        arr.forEach(d => combined.push({ device: d }));
      }
    });

    return combined;
  }

  // ---------- MAIN update from (summary, details) used by fetchData() ----------
  function updateMapData(summary, details) {
    if (!isLeafletLoaded()) { console.error("Leaflet not loaded"); return; }
    if (!realMap) initRealMap();
    if (!window.cityMarkerLayer) window.cityMarkerLayer = L.layerGroup().addTo(realMap);

    // Flatten details -> combinedDevices (same shape bar chart expects)
    const combined = flattenDetailsToCombined(details);

    // Use bar logic to compute labels/values/details (offline per type + risk)
    const bar = safeBuildCityBarDataWithBreakdown(combined || []);

    // Build per-city type totals using same underlying data (so totals align)
    const typeTotals = buildTypeTotalsFromCombined(combined || []);

    // Build unified city objects (use bar.labels order if available)
    const labels = Array.isArray(bar.labels) && bar.labels.length ? bar.labels : Object.keys(typeTotals);
    const unified = {}; // city -> { city, total, counts, offlineCounts, online, lat, lon, barDetail }

    labels.forEach(cityName => {
      const tt = typeTotals[cityName] || { counts: { camera: 0, archiver: 0, controller: 0, server: 0 }, offline: { camera: 0, archiver: 0, controller: 0, server: 0 }, total: 0, online: 0 };
      const barDetail = (Array.isArray(bar.details) ? bar.details.find(d => d.city === cityName) : null) || null;
      const coords = fuzzyCoords(cityName);
      unified[cityName] = {
        city: cityName,
        total: tt.total || (barDetail ? barDetail.total : 0),
        counts: tt.counts || { camera: 0, archiver: 0, controller: 0, server: 0 },
        // offline: (tt.offline && (tt.offline.camera || tt.offline.controller || tt.offline.archiver || tt.offline.server)) ? tt.offline : (barDetail ? barDetail.offline : { camera: 0, controller: 0, archiver: 0, server: 0 }),
       offline: barDetail ? barDetail.offline : tt.offline,
        online: tt.online || ((barDetail ? barDetail.total - ((barDetail.offline.camera || 0) + (barDetail.offline.controller || 0) + (barDetail.offline.archiver || 0) + (barDetail.offline.server || 0)) : 0)),
        lat: coords ? coords[0] : null,
        lon: coords ? coords[1] : null,
        barDetail: barDetail
      };
    });

    // Populate side panel and markers
    buildRegionPanelFromUnified(unified);

    // markers
    window.cityMarkerLayer.clearLayers();
    window._cityMarkerIndex = {};

    const coordsForBounds = [];
    Object.values(unified).forEach(city => {
      if (!city.lat || !city.lon) {
        console.debug("map.js: skipping city (no coords):", city.city);
        return;
      }
      const marker = createCityMarker(city, city.barDetail);
      marker.addTo(window.cityMarkerLayer);
      window._cityMarkerIndex[city.city] = marker;
      coordsForBounds.push([city.lat, city.lon]);
    });

    if (coordsForBounds.length) {
      try { realMap.fitBounds(L.latLngBounds(coordsForBounds).pad(0.25)); } catch (e) { console.warn("fitBounds failed", e); }
    } else {
      realMap.setView([15, 0], 2.5);
    }

    console.debug("map.js: map updated using bar-logic (cities shown):", Object.keys(unified).length);
  }

  // ---------- Build side panel (Global City Overview) ----------
  function buildRegionPanelFromUnified(unified) {
    const panel = document.getElementById("region-panel-content");
    if (!panel) return;
    panel.innerHTML = "";

    // order by total descending
    const list = Object.values(unified).sort((a, b) => (b.total || 0) - (a.total || 0));

    list.forEach(item => {
      const row = document.createElement("div");
      row.className = "city-item";
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.padding = "8px";
      row.style.cursor = "pointer";

      row.innerHTML = `<div style="font-weight:600">${item.city}</div><div style="color:#666">— • ${item.total} devices</div>`;

      row.addEventListener("click", () => {
        if (!item.lat || !item.lon) {
          alert(`${item.city} does not have coordinates configured. Add to CITY_COORDS to enable map focus.`);
          return;
        }
        if (!realMap) initRealMap();
        realMap.flyTo([item.lat, item.lon], 12, { duration: 0.6 });
        const m = window._cityMarkerIndex[item.city];
        if (m) m.openPopup();
      });

      panel.appendChild(row);
    });

    if (list.length === 0) {
      panel.innerHTML = "<div class='no-cities'>No city data available</div>";
    }
  }

  // ---------- Accept combinedDevices directly (same shape used elsewhere) ----------
  function updateMapFromCombined(combinedDevices) {
    // Use bar logic directly on combinedDevices array
    if (!isLeafletLoaded()) { console.error("Leaflet not loaded"); return; }
    if (!realMap) initRealMap();
    if (!window.cityMarkerLayer) window.cityMarkerLayer = L.layerGroup().addTo(realMap);

    const bar = safeBuildCityBarDataWithBreakdown(combinedDevices || []);
    const typeTotals = buildTypeTotalsFromCombined(combinedDevices || []);

    const labels = Array.isArray(bar.labels) && bar.labels.length ? bar.labels : Object.keys(typeTotals);
    const unified = {};
    labels.forEach(cityName => {
      const tt = typeTotals[cityName] || { counts: { camera: 0, archiver: 0, controller: 0, server: 0 }, offline: { camera: 0, archiver: 0, controller: 0, server: 0 }, total: 0, online: 0 };
      const barDetail = (Array.isArray(bar.details) ? bar.details.find(d => d.city === cityName) : null) || null;
      const coords = fuzzyCoords(cityName);
      unified[cityName] = {
        city: cityName,
        total: tt.total || (barDetail ? barDetail.total : 0),
        counts: tt.counts,
        // offline: tt.offline && (tt.offline.camera + tt.offline.controller + tt.offline.archiver + tt.offline.server) ? tt.offline : (barDetail ? barDetail.offline : { camera: 0, controller: 0, archiver: 0, server: 0 }),
        offline: barDetail ? barDetail.offline : tt.offline,
        online: tt.online || (barDetail ? barDetail.total - ((barDetail.offline.camera || 0) + (barDetail.offline.controller || 0) + (barDetail.offline.archiver || 0) + (barDetail.offline.server || 0)) : 0),
        lat: coords ? coords[0] : null,
        lon: coords ? coords[1] : null,
        barDetail: barDetail
      };
    });

    buildRegionPanelFromUnified(unified);

    window.cityMarkerLayer.clearLayers();
    window._cityMarkerIndex = {};
    const coordsForBounds = [];

    Object.values(unified).forEach(city => {
      if (!city.lat || !city.lon) return;
      const marker = createCityMarker(city, city.barDetail);
      marker.addTo(window.cityMarkerLayer);
      window._cityMarkerIndex[city.city] = marker;
      coordsForBounds.push([city.lat, city.lon]);
    });

    if (coordsForBounds.length) {
      try { realMap.fitBounds(L.latLngBounds(coordsForBounds).pad(0.25)); } catch (e) { console.warn("fitBounds failed", e); }
    } else {
      realMap.setView([15, 0], 2.5);
    }
  }

  // ---------- Buttons wiring ----------
  function setupButtons() {
    document.getElementById("fit-all")?.addEventListener("click", () => {
      if (!window.cityMarkerLayer) return;
      const layers = window.cityMarkerLayer.getLayers();
      if (!layers || layers.length === 0) return;
      const group = L.featureGroup(layers);
      realMap.fitBounds(group.getBounds().pad(0.25));
    });

    document.getElementById("show-global")?.addEventListener("click", () => {
      realMap.setView([15, 0], 2.5);
    });

    document.getElementById("mapFullscreenBtn")?.addEventListener("click", () => {
      const card = document.querySelector(".worldmap-card");
      if (card) card.classList.toggle("fullscreen");
      setTimeout(() => realMap.invalidateSize(), 300);
    });

    document.getElementById("mapCityOverviewBtn")?.addEventListener("click", () => {
      const panel = document.getElementById("region-panel");
      if (panel) panel.classList.toggle("open");
      setTimeout(() => realMap.invalidateSize(), 300);
    });
  }

  // ---------- Init ----------
  document.addEventListener("DOMContentLoaded", () => {
    try {
      initRealMap();
      setupButtons();
      const panel = document.getElementById("region-panel-content");
      if (panel) panel.innerHTML = "<div class='no-cities'>Waiting for data…</div>";
      console.debug("map.js loaded");
    } catch (e) {
      console.error("map.js init failed", e);
    }
  });

  // ---------- Export ----------
  window.updateMapFromCombined = updateMapFromCombined;
  window.updateMapData = updateMapData; // used by fetchData() in your script

})();

.......
read this code alos, and slove above issue


function updateGauge(id, activeId, inactiveId, totalId) {
  // read elements safely (avoid exception if missing)
  const activeEl = document.getElementById(activeId);
  const inactiveEl = document.getElementById(inactiveId);

  const active = activeEl ? parseInt((activeEl.textContent || '0').replace(/,/g, ''), 10) || 0 : 0;
  const inactive = inactiveEl ? parseInt((inactiveEl.textContent || '0').replace(/,/g, ''), 10) || 0 : 0;
  const total = active + inactive;

  // element (gauge card)
  const gauge = document.getElementById(id);
  if (!gauge) return;

  // % calculation (safe)
  let percentage = total === 0 ? 0 : Math.round((active / total) * 100);

  // set CSS variable if supported
  try {
    gauge.style.setProperty("--percentage", percentage);
  } catch (e) {
    // ignore if style can't be set
  }

  // update text inside semicircle (if those elements exist)
  const totalLabel = gauge.querySelector(".total");
  const activeLabel = gauge.querySelector(".active");
  const inactiveLabel = gauge.querySelector(".inactive");

  if (totalLabel) totalLabel.textContent = total;
  if (activeLabel) activeLabel.textContent = active;
  if (inactiveLabel) inactiveLabel.textContent = inactive;

  // card footer also updates (if exists)
  const footerEl = document.getElementById(totalId);
  if (footerEl) footerEl.textContent = total;
}

// ⬇️⬇️ this is call in scrip.js
function renderGauges() {
  updateGauge("gauge-cameras", "camera-online", "camera-offline", "camera-total");
  updateGauge("gauge-archivers", "archiver-online", "archiver-offline", "archiver-total");
  updateGauge("gauge-controllers", "controller-online", "controller-offline", "controller-total");
  updateGauge("gauge-ccure", "server-online", "server-offline", "server-total");
}

document.addEventListener("DOMContentLoaded", () => {
  renderGauges();
  setInterval(renderGauges, 6000);
});





// ⬇️⬇️⬇️⬇️⬇️⬇️ PIE chart

// --- Total Count doughnut chart (uses Chart.js) ---

let _totalCountChart = null;

function findChartPlaceholderByTitle(titleText) {
  const cards = document.querySelectorAll('.totacl-gcard.wide');
  for (let card of cards) {
    const h = card.querySelector('.gcard-title');
    if (h && h.textContent.trim().toLowerCase() === titleText.trim().toLowerCase()) {
      return card.querySelector('.chart-placeholder');
    }
  }
  return null;
}

/**
 * Collect totals from DOM. Add/remove device keys as needed.
 * Make sure IDs used here exist in your summary-section.
 */


function collectTotalCounts() {
  const keys = [
    { id: 'camera-total', label: 'Cameras' },
    { id: 'archiver-total', label: 'Archivers' },
    { id: 'controller-total', label: 'Controllers' },
    { id: 'server-total', label: 'CCURE' },
    { id: 'doorReader-total', label: 'Doors' },
    { id: 'reader-total-inline', label: 'Readers' },
    { id: 'pc-total', label: 'Desktop' },
    { id: 'db-total', label: 'DB Server' }
  ];

  const labels = [];
  const values = [];

  keys.forEach(k => {
    const el = document.getElementById(k.id);
    const v = el
      ? parseInt((el.textContent || '0').replace(/,/g, '').trim(), 10)
      : 0;

    if (v > 0) {
      labels.push(k.label);
      values.push(v);
    }
  });

  if (values.length === 0) {
    return { labels: ['No devices'], values: [0] };  // ✅ fixed
  }

  return { labels, values };
}

/**
 * Render or update the Total Count doughnut.
 */

function renderTotalCountChart() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded — add https://cdn.jsdelivr.net/npm/chart.js');
    return;
  }

  const placeholder = findChartPlaceholderByTitle('Total Count');
  if (!placeholder) return;

  let canvas = placeholder.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    placeholder.innerHTML = '';
    placeholder.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  const data = collectTotalCounts();

  // calculate total
  //   const totalValue = data.values.reduce((a, b) => a + b, 0);
  const totalValue = data.labels[0] === 'No devices'
    ? 0
    : data.values.reduce((a, b) => a + b, 0);

  if (_totalCountChart) {
    _totalCountChart.destroy();
  }

  const palette = [
    '#10b981', '#f97316', '#2563eb',
    '#7c3aed', '#06b6d4', '#ef4444',
    '#f59e0b', '#94a3b8'
  ];

  // ---- Plugin for CENTER TEXT ----

  const centerTextPlugin = {
    id: 'centerText',
    afterDatasetsDraw(chart) {   // ✅ better than afterDraw
      const { ctx, chartArea, data } = chart;

      if (!chartArea) return;    // ✅ prevents crash on first render

      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      // ✅ fresh total calculation every time
      const total = data.datasets[0].data.reduce((a, b) => a + b, 0);

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // ✅ Safe color fallback
      const labelColor = getComputedStyle(document.body)
        .getPropertyValue('--graph-card-footer-dark')
        .trim() || "#888";  // fallback gray

      const valueColor = getComputedStyle(document.body)
        .getPropertyValue('--graph-card-title-dark')
        .trim() || "#ffffff"; // fallback white

      // TOTAL label
      ctx.font = "14px Arial";
      ctx.fillStyle = labelColor;
      ctx.fillText("TOTAL", centerX, centerY - 20);

      // TOTAL value
      ctx.font = "bold 22px Arial";
      ctx.fillStyle = valueColor;
      ctx.fillText(total.toString(), centerX, centerY + 15);

      ctx.restore();
    }
  };

  _totalCountChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.values,
        backgroundColor: palette.slice(0, data.values.length),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '45%',
      radius: '90%',  // ✅ shrink only circle size
      plugins: {
        legend: {
          position: 'right',

          labels: {
            usePointStyle: true,
            padding: 12,
            color: getComputedStyle(document.body)
              .getPropertyValue('--graph-card-title-dark'),

            generateLabels: function (chart) {
              const dataset = chart.data.datasets[0];
              const labels = chart.data.labels;
              const colors = dataset.backgroundColor;

              return labels.map((label, i) => ({
                text: `${label} - ${dataset.data[i]}`,
                fillStyle: colors[i],
                strokeStyle: colors[i],
                fontColor: getComputedStyle(document.body)
                  .getPropertyValue('--graph-card-title-dark'),
                hidden: false,
                index: i
              }));
            }
          }

        },

        tooltip: {
          callbacks: {
            label: function (ctx) {
              const label = ctx.label || '';
              const value = ctx.parsed || 0;
              return `${label} : ${value}`;
            }
          }
        }
      }
    },

    plugins: [centerTextPlugin]   // ✅ center total plugin
  });
}


/**
 * Update the Total Count chart data in-place (if chart exists) otherwise render
 */
// ⬇️⬇️ this is call in scrip.js file
function updateTotalCountChart() {
  if (!_totalCountChart) {
    renderTotalCountChart();
    return;
  }
  const data = collectTotalCounts();
  _totalCountChart.data.labels = data.labels;
  _totalCountChart.data.datasets[0].data = data.values;
  _totalCountChart.data.datasets[0].backgroundColor = [

    '#10b981', '#f97316', '#2563eb', '#7c3aed', '#06b6d4', '#ef4444', '#f59e0b', '#94a3b8'
  ].slice(0, data.values.length);
  _totalCountChart.update();
}

// Hook it up: render on DOMContentLoaded and update when gauges refresh
document.addEventListener('DOMContentLoaded', () => {
  // initial render (if Chart.js loaded)
  renderTotalCountChart();

  // re-render on window resize (debounced)
  let resizeTO;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTO);
    resizeTO = setTimeout(() => {
      renderTotalCountChart(); // re-create with correct sizing
    }, 10);
  });
});

// Call updateTotalCountChart() whenever your data changes.
// We'll call it inside renderGauges() so it updates after gauges refresh.
function renderGauges() {
  updateGauge("gauge-cameras", "camera-online", "camera-offline", "camera-total");
  updateGauge("gauge-archivers", "archiver-online", "archiver-offline", "archiver-total");
  updateGauge("gauge-controllers", "controller-online", "controller-offline", "controller-total");
  updateGauge("gauge-ccure", "server-online", "server-offline", "server-total");

  // ✅ ADD THESE TWO
  updateGauge("gauge-doors", "door-online", "door-offline", "doorReader-total");
  updateGauge("gauge-readers", "reader-online", "reader-offline", "reader-total-inline");

  updateTotalCountChart();
  // update Total Count pie
}



// ☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️


// ========== GLOBALS ==========
// ⬇️⬇️ this call in scrip.js
let offlineChart;
let cityIndexMap = {};
let cityCounter = 0;
let dynamicTypeIndexMap = {};
let dynamicTypeList = [];

// ========== GET CHART COLORS BASED ON THEME ==========
function getChartColors() {
  const isLightTheme = document.body.classList.contains('theme-light');

  if (isLightTheme) {
    return {
      backgroundColor: '#0a0a0a',
      text: '#e6eef7', // Visible text color
    };
  } else {
    // Dark theme colors - fixed for visibility
    return {
      camera: '#ff4d4d',
      archiver: '#4da6ff',
      controller: '#ffaa00',
      ccure: '#7d3cff',
      grid: 'rgba(255, 255, 255, 0.2)', // Visible grid lines
      text: '#e6eef7', // Visible text color
      background: '#0a0a0a'
    };
  }
}

// ========== UPDATE CHART THEME ==========
function updateChartTheme() {
  if (!offlineChart) return;

  const colors = getChartColors();

  // Update grid lines and borders
  offlineChart.options.scales.x.grid.color = colors.grid;
  offlineChart.options.scales.y.grid.color = colors.grid;

  // Update text colors
  offlineChart.options.scales.x.ticks.color = colors.text;
  offlineChart.options.scales.y.ticks.color = colors.text;

  // Update legend text color
  if (offlineChart.options.plugins.legend) {
    offlineChart.options.plugins.legend.labels.color = colors.text;
  }

  offlineChart.update();
}


// ========== INIT CHART ==========
// ⬇️⬇️ this is call in scrip.js 
function initOfflineChart() {
  const canvas = document.getElementById("DotOfflineDevice");
  const ctx = canvas.getContext("2d");

  const colors = getChartColors();

  offlineChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Camera",
          data: [],
          backgroundColor: colors.camera,
          pointStyle: "circle",
          pointRadius: 6
        },
        {
          label: "Archiver",
          data: [],
          backgroundColor: colors.archiver,
          pointStyle: "rect",
          pointRadius: 6
        },
        {
          label: "Controller",
          data: [],
          backgroundColor: colors.controller,
          pointStyle: "triangle",
          pointRadius: 7
        },
        {
          label: "CCURE",
          data: [],
          backgroundColor: colors.ccure,
          pointStyle: "rectRot",
          pointRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: colors.text, // Set legend text color
            font: {
              size: 12
            },
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const d = ctx.raw;
              return `${d.count || 0}`;
            }
          }
        }

      },
      scales: {
        x: {
          title: {
            display: false,
            text: "City"
          },
          grid: {
            color: colors.grid, // Set grid line color
            drawBorder: true
          },
          ticks: {
            color: colors.text, // Set x-axis text color
            maxRotation: 0,
            minRotation: 0,
            callback: (value) => {
              return Object.keys(cityIndexMap).find(
                key => cityIndexMap[key] === value
              ) || "";
            }
          }
        },
        y: {
          title: {
            display: false,
            text: "Device Type"
          },
          grid: {
            color: colors.grid, // Set grid line color
            drawBorder: true
          },
          ticks: {
            color: colors.text, // Set y-axis text color
            callback: v => dynamicTypeList[v] || ""
          },
          min: -0.5,
          max: () => Math.max(dynamicTypeList.length - 0.5, 0.5)
        }
      }
    }
  });
}

// ⬇️⬇️ this is call in scrip.js 
function updateOfflineChart(offlineDevices) {
  const typeNames = {
    cameras: "Camera",
    archivers: "Archiver",
    controllers: "Controller",
    servers: "CCURE"
  };

  dynamicTypeList = [];
  dynamicTypeIndexMap = {};
  cityIndexMap = {};
  cityCounter = 0;

  // Only valid types
  const filtered = offlineDevices.filter(dev =>
    typeNames.hasOwnProperty(dev.type)
  );

  // Build dynamic Y indexes
  filtered.forEach(dev => {
    const label = typeNames[dev.type];
    if (!(label in dynamicTypeIndexMap)) {
      dynamicTypeIndexMap[label] = dynamicTypeList.length;
      dynamicTypeList.push(label);
    }
  });

  // ✅ GROUP BY CITY + TYPE
  const grouped = {};

  filtered.forEach(dev => {
    const source = dev.device ? dev.device : dev;
    const city = source.city || "Unknown";
    const label = typeNames[dev.type];

    const key = city + "|" + label;

    if (!grouped[key]) {
      grouped[key] = {
        city: city,
        label: label,
        count: 0
      };
    }

    grouped[key].count++;
  });

  // Clear datasets
  offlineChart.data.datasets.forEach(ds => ds.data = []);

  // ✅ Add grouped points (only ONE point per city+type)
  Object.values(grouped).forEach(item => {

    if (!cityIndexMap[item.city]) {
      cityCounter++;
      cityIndexMap[item.city] = cityCounter;
    }

    const dynamicY = dynamicTypeIndexMap[item.label];

    const point = {
      x: cityIndexMap[item.city],
      y: dynamicY,
      count: item.count   // ✅ count stored here
    };

    const dataset = offlineChart.data.datasets.find(
      ds => ds.label === item.label
    );

    if (dataset) {
      dataset.data.push(point);
    }
  });

  // Hide empty
  offlineChart.data.datasets.forEach(ds => {
    ds.hidden = ds.data.length === 0;
  });

  offlineChart.update();
}


// ========== THEME CHANGE DETECTION ==========
function setupThemeObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        setTimeout(updateChartTheme, 100);
      }
    });
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });
}

// ========== INITIALIZE EVERYTHING ==========

// new
// ========== INITIALIZE EVERYTHING ==========
function initializeChartSystem() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initOfflineChart();
      initOfflineCityBarChart();   // ✅ ADD THIS
      setupThemeObserver();
    });
  } else {
    initOfflineChart();
    initOfflineCityBarChart();     // ✅ ADD THIS
    setupThemeObserver();
  }
}

// Initialize the chart system
initializeChartSystem();

// ========== YOUR EXISTING FUNCTION ==========


function renderOfflineChartFromCombined(combinedDevices) {
  const offlineDevices = combinedDevices
    .filter(d => d.device.status === "offline")
    .map(d => ({
      device: d.device,
      type: d.device.type
    }));

  updateOfflineChart(offlineDevices);

  // ✅ ADD BAR CHART UPDATE HERE
  updateOfflineCityBarChart(combinedDevices);
  updateMapFromCombined(combinedDevices)
}

// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️


// ---------------- START: City BAR chart (Total devices + offline breakdown tooltip) ----------------
let offlineCityBarChart = null;

const TYPE_MAP = {
  cameras: 'camera',
  archivers: 'archiver',
  controllers: 'controller',
  servers: 'server',
  // other types exist (pcdetails, dbdetails) — we ignore them for the offline breakdown fields
};

function normalizeCityName(city) {
  city = city.toLowerCase().trim();

  // Pune group
  if (city.startsWith("pune")) return "Pune";

  // Vilnius group
  if (city.includes("vilnius") || 
      city.includes("gama") || 
      city.includes("delta")) {
    return "Vilnius";
  }

  // Default – return as-is (capitalized first letter)
  return city.charAt(0).toUpperCase() + city.slice(1);
}

function getBarColors() {
  if (typeof getChartColors === 'function') {
    const c = getChartColors();
    return {
      bar: c.camera || c.bar || '#d32f2f',
      text: c.text || '#e6eef7',
      grid: c.grid || 'rgba(0,0,0,0.08)'
    };
  }
  const isDark = document.body.classList.contains("dark-mode");
  return {
    bar: isDark ? "#ff5252" : "#d32f2f",
    text: isDark ? "#ffffff" : "#333333",
    grid: isDark ? "#444" : "#ddd"
  };
}

/**
 * Build the per-city totals + offline breakdown.
 * Input: combinedDevices = [{ device: { type, status, city, ... } }, ...]
 * Output: { labels: [], values: [], details: [{ city, total, offline: { camera, controller, archiver, server } }, ...] }
 */

function buildCityBarDataWithBreakdown(combinedDevices = []) {
  const map = {}; // city -> info

  if (!Array.isArray(combinedDevices)) return { labels: [], values: [], details: [] };

  combinedDevices.forEach(entry => {
    if (!entry || !entry.device) return;
    const dev = entry.device;

    // const city = (dev.city || "Unknown").toString(); 
    const rawCity = (dev.city || "Unknown").toString();
const city = normalizeCityName(rawCity);

    if (!map[city]) {
      map[city] = {
        city,
        total: 0,
        offline: {
          camera: 0,
          controller: 0,
          archiver: 0,
          server: 0
        },
        risk: "Low" // default
      };
    }

    map[city].total++;

    const status = (dev.status || "").toLowerCase();
    const devTypeKey = (dev.type || "").toLowerCase();

    if (status === "offline") {
      const short = TYPE_MAP[devTypeKey];
      if (short && map[city].offline.hasOwnProperty(short)) {
        map[city].offline[short]++;
      }
    }
  });

  // ✅ APPLY RISK LOGIC
  Object.values(map).forEach(cityObj => {
    const off = cityObj.offline;

    const cam = off.camera;
    const ctrl = off.controller;
    const arch = off.archiver;
    const serv = off.server;

    // High conditions
    if (
      serv > 0 ||
      ctrl > 0 ||
      arch > 0 ||
      (cam > 0 && (ctrl > 0 || arch > 0 || serv > 0))
    ) {
      cityObj.risk = "High";
    }
    // Medium condition
    else if (cam > 0) {
      cityObj.risk = "Medium";
    }
    // Otherwise Low
    else {
      cityObj.risk = "Low";
    }
  });

  // ❌ NO SORTING – Keep original insertion order
  
  let entries = Object.values(map);

  // ✅ Shuffle entries into random order
  // for (let i = entries.length - 1; i > 0; i--) {
  //   const j = Math.floor(Math.random() * (i + 1));
  //   [entries[i], entries[j]] = [entries[j], entries[i]];
  // }

  const labels = entries.map(e => e.city);
  const values = entries.map(e => e.total);
  const details = entries.map(e => ({
    city: e.city,
    total: e.total,
    offline: { ...e.offline },
    risk: e.risk
  }));

  return { labels, values, details };
}

/**
 * Initialize the bar chart (placeholder). Safe to call multiple times.
 */
function initOfflineCityBarChart() {
  if (typeof Chart === 'undefined') {
    console.warn('initOfflineCityBarChart: Chart.js not loaded.');
    return;
  }
  const canvas = document.getElementById("OfflineCityBarChart");
  if (!canvas) {
    console.warn('initOfflineCityBarChart: #OfflineCityBarChart canvas not found.');
    return;
  }

  if (offlineCityBarChart) return; // already init

  const ctx = canvas.getContext("2d");
  const colors = getBarColors();

  offlineCityBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ['No Data'],
      datasets: [{
        label: "Total Devices",
        data: [0],
        backgroundColor: [colors.bar],
        borderRadius: 8,
        barThickness: 35
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: colors.text }, display: false },
        tooltip: {
          enabled: true,
          callbacks: {
            // Title is the city name
            title: function (items) {
              if (!items || !items.length) return '';
              return items[0].label;
            },
            // First line: total devices (use dataset value)
            label: function (context) {
              const value = context.parsed.y ?? context.parsed ?? 0;
              return `Total Devices: ${value}`;
            },
            // After body: show offline breakdown lines (one per line)
            afterBody: function (context) {
              if (!context || !context.length) return [];

              const dataIndex = context[0].dataIndex;
              const chart = context[0].chart || offlineCityBarChart;
              const details = chart.cityDetails[dataIndex];
              if (!details) return [];

              const off = details.offline;

              return [
                `Risk Level: ${details.risk}`,
                `Offline Cameras: ${off.camera || 0}`,
                `Offline Controllers: ${off.controller || 0}`,
                `Offline Archivers: ${off.archiver || 0}`,
                `Offline Servers: ${off.server || 0}`
              ];
            }

          }
        }
      },
      scales: {

        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,

            callback: function (value, index) {
              const chart = this.chart;
              const details = chart.cityDetails?.[index];

              // Show label ONLY for High and Medium
              if (!details || details.risk === "Low") {
                return "";
              }

              return details.city;
            },

            color: function (context) {
              const index = context.index;
              const chart = context.chart;
              const details = chart.cityDetails?.[index];

              if (!details) return colors.text;

              if (details.risk === "High") return "#d32f2f";    // red
              if (details.risk === "Medium") return "#fbc02d";  // yellow

              return "transparent"; // hide Low city label
            },

            font: function (context) {
              const index = context.index;
              const chart = context.chart;
              const details = chart.cityDetails?.[index];

              if (!details || details.risk === "Low") {
                return { size: 0 };  // Fully hide low labels
              }

              return { size: 12, weight: "bold" };
            }
          },
          grid: {
            color: colors.grid
          }
        },
        
     
        y: {
          beginAtZero: true,
          ticks: { color: colors.text, precision: 0 },
          grid: { color: colors.grid }
        }
      }
    }
  });

  // attach an empty cityDetails array to chart (populated on updates)
  offlineCityBarChart.cityDetails = [];
  console.debug('initOfflineCityBarChart: initialized');
}

/**
 * Update the bar chart with combinedDevices (array of {device: {...}})
 */
function updateOfflineCityBarChart(combinedDevices) {
  if (!offlineCityBarChart) {
    initOfflineCityBarChart();
    if (!offlineCityBarChart) {
      console.warn('updateOfflineCityBarChart: chart not initialized (canvas missing or Chart.js not loaded).');
      return;
    }
  }

  const colors = getBarColors();
  const { labels, values, details } = buildCityBarDataWithBreakdown(combinedDevices);

  if (!labels || labels.length === 0) {
    offlineCityBarChart.data.labels = ['No Data'];
    offlineCityBarChart.data.datasets[0].data = [0];
    offlineCityBarChart.data.datasets[0].backgroundColor = ['#8a8a8a'];
    offlineCityBarChart.cityDetails = [];
    offlineCityBarChart.update();
    console.debug('updateOfflineCityBarChart: no data.');
    return;
  }

  offlineCityBarChart.data.labels = labels;
  offlineCityBarChart.data.datasets[0].data = values;
  // offlineCityBarChart.data.datasets[0].backgroundColor = labels.map(() => colors.bar); 
  offlineCityBarChart.data.datasets[0].backgroundColor = details.map(d => {
    if (d.risk === "High") return "#d32f2f";    // red
    if (d.risk === "Medium") return "#fbc02d";  // yellow
    return "#388e3c";                           // green
  });
  offlineCityBarChart.cityDetails = details; // store details used by tooltip callbacks

  offlineCityBarChart.update();
  console.debug('updateOfflineCityBarChart: updated with', labels.length, 'cities.');
}

/**
 * Ensure initialization on DOM ready (harmless if already done elsewhere)
 */
function ensureBarInitOnDomReady() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOfflineCityBarChart);
  } else {
    initOfflineCityBarChart();
  }
}
ensureBarInitOnDomReady();
// ---------------- END: City BAR chart (Total devices + offline breakdown tooltip) ----------------
