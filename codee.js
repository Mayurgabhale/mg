// map.js - final integrated version for your dashboard
// Works with:
// 1) renderOfflineChartFromCombined(combinedDevices) -> window.updateMapFromCombined(combinedDevices)
// 2) fetchData() -> window.updateMapData(summary, details)
// Place this file after Leaflet is loaded in your HTML.

(function () {
  // ---------- Globals ----------
  let realMap = null;
  window.cityMarkerLayer = null;
  window._cityMarkerIndex = {}; // city -> marker

  // ---------- City coordinates (extend as needed) ----------
  const CITY_COORDS = {
    "Pune": [18.5204, 73.8567],
    "Vilnius": [54.6872, 25.2797],
    "Casablanca": [33.5731, -7.5898],
    "Dubai": [25.276987, 55.296249],
    "Taguig City": [14.5176, 121.0509],
    "Quezon": [14.6760, 121.0437],
    "NEW YORK": [40.7128, -74.0060],
    "Singapore": [1.3521, 103.8198],
    "HYDERABAD": [17.3850, 78.4867],
    "London": [51.5074, -0.1278],
    "Madrid": [40.4168, -3.7038],
    "Frankfurt": [50.1109, 8.6821],
    "Kuala lumpur": [3.1390, 101.6869],
    "Mexico": [23.6345, -102.5528],
    "Moscow": [55.7558, 37.6173],
    "Peru": [-9.1900, -75.0152],
    "Panama": [8.5380, -80.7821],
    "Argentina": [-38.4161, -63.6167],
    "Austin TX": [30.2672, -97.7431],
    "Denver": [39.7392, -104.9903],
    "Florida, Miami": [25.7617, -80.1918],
    "Italy, Rome": [41.9028, 12.4964],
    "Japan Tokyo": [35.6762, 139.6503]
  };

  // ---------- Utility helpers ----------
  function isLeafletLoaded() {
    return typeof L !== "undefined" && !!L;
  }

  function ensureMapDivHeight() {
    const el = document.getElementById("realmap");
    if (!el) return;
    const h = el.clientHeight;
    if (!h || h < 20) {
      // If CSS forgot to set a height, make it visible
      el.style.minHeight = "420px";
      el.style.height = "420px";
    }
  }

  function normalizeCityName(city) {
    // Uses same logic as your bar chart's normalizeCityName
    if (!city) return "Unknown";
    city = city.toString().toLowerCase().trim();

    if (city.startsWith("pune")) return "Pune";
    if (city.includes("vilnius") || city.includes("gama") || city.includes("delta")) return "Vilnius";
    if (city.includes("taguig")) return "Taguig City";
    if (city.includes("quezon")) return "Quezon";

    // fallback capitalization
    return city.charAt(0).toUpperCase() + city.slice(1);
  }

  function fuzzyCoordsForCity(city) {
    if (!city) return null;
    if (CITY_COORDS[city]) return CITY_COORDS[city];
    // try case-insensitive match or inclusion
    const low = city.toLowerCase();
    const match = Object.keys(CITY_COORDS).find(k => k.toLowerCase() === low || k.toLowerCase().includes(low) || low.includes(k.toLowerCase()));
    return match ? CITY_COORDS[match] : null;
  }

  // ---------- Map init ----------
  function initRealMap() {
    ensureMapDivHeight();
    if (!isLeafletLoaded()) {
      console.error("Leaflet is not loaded. Add leaflet css & js before map.js.");
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
      attribution: 'Tiles © Esri'
    }).addTo(realMap);

    window.cityMarkerLayer = L.layerGroup().addTo(realMap);
    console.debug("map.js: realMap initialized");
  }

  // ---------- Create marker ----------
  function createCityMarker(cityStats, barDetail) {
    const hasOffline = (cityStats.offline && cityStats.offline > 0);
    const color = hasOffline ? "#d32f2f" : "#388e3c";

    const html = `
      <div class="city-pin" style="
        display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:18px;
        background: rgba(0,0,0,0.65); color: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">
        <span style="font-size:16px"><i class="bi bi-geo-alt-fill"></i></span>
        <span style="font-weight:700">${cityStats.total}</span>
      </div>
    `;

    const icon = L.divIcon({ html, className: "city-pin-wrapper", iconSize: [44, 36], iconAnchor: [22, 36] });
    const marker = L.marker([cityStats.lat, cityStats.lon], { icon });

    // Build tooltip / popup consistent with bar chart details if available
    const offlineBreakdown = (barDetail && barDetail.offline) ? barDetail.offline : { camera: 0, controller: 0, archiver: 0, server: 0 };
    const risk = (barDetail && barDetail.risk) ? barDetail.risk : (cityStats.offline > 0 ? "Medium" : "Low");

    const tooltip = `
      <div style="min-width:220px">
        <div style="font-weight:700;margin-bottom:4px">${cityStats.city}</div>
        <div><strong>Total:</strong> ${cityStats.total}</div>
        <div><strong>Online:</strong> ${cityStats.online} &nbsp; | &nbsp; <strong>Offline:</strong> ${cityStats.offline}</div>
        <hr style="margin:6px 0"/>
        <div><i class="bi bi-camera"></i> Cameras: ${cityStats.types?.camera || 0}</div>
        <div><i class="fas fa-database"></i> Archivers: ${cityStats.types?.archiver || 0}</div>
        <div><i class="bi bi-hdd"></i> Controllers: ${cityStats.types?.controller || 0}</div>
        <div><i class="fa-solid fa-server"></i> CCURE: ${cityStats.types?.server || 0}</div>
        <hr style="margin:6px 0"/>
        <div><strong>Risk:</strong> ${risk}</div>
        <div style="font-size:12px;color:#eee;margin-top:6px">Offline breakdown: Cameras ${offlineBreakdown.camera||0}, Controllers ${offlineBreakdown.controller||0}, Archivers ${offlineBreakdown.archiver||0}, Servers ${offlineBreakdown.server||0}</div>
      </div>
    `;

    marker.bindTooltip(tooltip, { sticky: true, direction: "top", opacity: 0.95, className: "city-tooltip" });
    marker.bindPopup(tooltip, { maxWidth: 320 });

    return marker;
  }

  // ---------- Build full per-city stats from combinedDevices (fallback) ----------
  function computeFullStatsFromCombined(combinedDevices) {
    const map = {};
    (combinedDevices || []).forEach(entry => {
      const d = entry.device ? entry.device : entry;
      if (!d) return;
      const cityKey = normalizeCityName(d.city || d.location || "Unknown");
      if (!map[cityKey]) {
        map[cityKey] = { city: cityKey, total: 0, online: 0, offline: 0, types: { camera:0, archiver:0, controller:0, server:0 }, lat: null, lon: null };
      }
      const cs = map[cityKey];
      cs.total++;
      const s = (d.status || "").toString().toLowerCase();
      if (s === "offline" || s === "down") cs.offline++; else cs.online++;
      const t = (d.type || "").toString().toLowerCase();
      if (t.includes("camera")) cs.types.camera++;
      else if (t.includes("archiver")) cs.types.archiver++;
      else if (t.includes("controller")) cs.types.controller++;
      else if (t.includes("server") || t.includes("ccure")) cs.types.server++;
    });

    // attach coords if known
    Object.values(map).forEach(c => {
      const coords = fuzzyCoordsForCity(c.city);
      if (coords) { c.lat = coords[0]; c.lon = coords[1]; }
    });

    return map;
  }

  // ---------- Use bar-chart function if available, otherwise fallback ----------
  function buildUnifiedCityDataFromCombined(combinedDevices) {
    // First compute full stats from combined
    const fullStats = computeFullStatsFromCombined(combinedDevices); // city -> stats

    // Try to use buildCityBarDataWithBreakdown from graph.js to get same order & offline details
    let barResult = null;
    if (typeof window.buildCityBarDataWithBreakdown === 'function') {
      try {
        barResult = window.buildCityBarDataWithBreakdown(combinedDevices);
      } catch (e) {
        console.warn("map.js: buildCityBarDataWithBreakdown() threw:", e);
        barResult = null;
      }
    }

    const unified = {}; // city -> merged object
    const citiesInOrder = (barResult && Array.isArray(barResult.labels) && barResult.labels.length) ? barResult.labels : Object.keys(fullStats);

    citiesInOrder.forEach(cityName => {
      const fs = fullStats[cityName] || { city: cityName, total: 0, online: 0, offline: 0, types: { camera:0, archiver:0, controller:0, server:0 }, lat: null, lon: null };
      const detail = (barResult && Array.isArray(barResult.details)) ? barResult.details.find(d => d.city === cityName) : null;

      const coords = fuzzyCoordsForCity(cityName);
      const lat = coords ? coords[0] : fs.lat;
      const lon = coords ? coords[1] : fs.lon;

      unified[cityName] = {
        city: cityName,
        total: fs.total,
        online: fs.online,
        offline: fs.offline,
        types: fs.types,
        lat: lat,
        lon: lon,
        barDetail: detail
      };
    });

    return unified;
  }

  // ---------- Build unified city data directly from (summary, details) shape your fetch provides ----------
  // details is expected to be the same object you pass to updateDetails(details) — in your code you used details.details
  function buildUnifiedCityDataFromSummaryDetails(summary, details) {
    // Try to convert details into combinedDevices array
    const combined = [];
    try {
      if (details && typeof details === 'object') {
        // Many of your functions above iterate details.details where key-> array of devices
        const bucket = details.details || details;
        if (bucket && typeof bucket === 'object') {
          Object.values(bucket).forEach(arr => {
            if (Array.isArray(arr)) {
              arr.forEach(dev => {
                combined.push({ device: dev });
              });
            }
          });
        }
      }
    } catch (e) {
      console.warn("map.js: error flattening details -> combined", e);
    }

    // if combined is empty but summary has totals per city, build minimal entries
    if (combined.length === 0 && summary && summary.summary && typeof summary.summary === 'object') {
      // try to extract city totals from summary (common patterns)
      const summaryObj = summary.summary;
      Object.keys(summaryObj).forEach(k => {
        // skip nested controllerExtras etc.
        if (typeof summaryObj[k] === 'number' && k.toLowerCase().includes('total')) {
          // not helpful
        }
      });
      // nothing robust to do — fallback to empty combined
    }

    return buildUnifiedCityDataFromCombined(combined);
  }

  // ---------- SIDE PANEL builder ----------
  function buildRegionPanelFromUnified(unified) {
    const panel = document.getElementById("region-panel-content");
    if (!panel) return;
    panel.innerHTML = "";

    const list = Object.values(unified).sort((a,b) => b.total - a.total);

    list.forEach(item => {
      const row = document.createElement("div");
      row.className = "city-item";
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.padding = "8px";
      row.style.cursor = "pointer";

      const left = document.createElement("div");
      left.textContent = item.city;
      left.style.fontWeight = "600";

      const right = document.createElement("div");
      right.textContent = `— • ${item.total} devices`;
      right.style.color = "#666";

      row.appendChild(left);
      row.appendChild(right);

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

  // ---------- MAIN: accept combinedDevices array ----------
  function updateMapFromCombined(combinedDevices) {
    if (!isLeafletLoaded()) { console.error("Leaflet not loaded"); return; }
    if (!realMap) initRealMap();
    if (!window.cityMarkerLayer) window.cityMarkerLayer = L.layerGroup().addTo(realMap);

    const unified = buildUnifiedCityDataFromCombined(combinedDevices);

    // populate side panel consistent with bar chart
    buildRegionPanelFromUnified(unified);

    // clear previous markers
    window.cityMarkerLayer.clearLayers();
    window._cityMarkerIndex = {};

    const coords = [];

    Object.values(unified).forEach(city => {
      if (!city.lat || !city.lon) {
        console.debug("map.js: skipping marker (no coords) for", city.city);
        return;
      }
      const marker = createCityMarker(city, city.barDetail);
      marker.addTo(window.cityMarkerLayer);
      window._cityMarkerIndex[city.city] = marker;
      coords.push([city.lat, city.lon]);
    });

    if (coords.length) {
      try { realMap.fitBounds(L.latLngBounds(coords).pad(0.25)); } catch (e) { console.warn("fitBounds failed", e); }
    } else {
      realMap.setView([15,0], 2.5);
    }
  }

  // ---------- MAIN: accept (summary, details) from fetchData ----------
  function updateMapData(summary, details) {
    if (!isLeafletLoaded()) { console.error("Leaflet not loaded"); return; }
    if (!realMap) initRealMap();
    if (!window.cityMarkerLayer) window.cityMarkerLayer = L.layerGroup().addTo(realMap);

    // Try to build unified data using bar chart builder if available
    let unified = null;
    // Preferred path: try to call buildCityBarDataWithBreakdown(combinedDevices) if available (keeps exact offline/risk)
    try {
      if (typeof window.buildCityBarDataWithBreakdown === 'function' && details) {
        // Convert details.details -> combinedDevices array
        const combined = [];
        try {
          const bucket = details.details || details;
          Object.values(bucket || {}).forEach(arr => {
            if (Array.isArray(arr)) arr.forEach(d => combined.push({ device: d }));
          });
        } catch (e) {
          console.warn("map.js: failed to flatten details for bar builder", e);
        }

        const bar = window.buildCityBarDataWithBreakdown(combined);
        // bar has labels, values, details
        // Build unified using combined->full stats plus bar details
        const full = computeFullStatsFromCombined(combined);
        unified = {};
        (bar.labels || []).forEach(label => {
          const fs = full[label] || { city: label, total: 0, online: 0, offline: 0, types: {camera:0,archiver:0,controller:0,server:0} };
          const det = (bar.details || []).find(d => d.city === label);
          const coords = fuzzyCoordsForCity(label);
          unified[label] = {
            city: label,
            total: fs.total,
            online: fs.online,
            offline: fs.offline,
            types: fs.types,
            lat: coords ? coords[0] : fs.lat,
            lon: coords ? coords[1] : fs.lon,
            barDetail: det || null
          };
        });
      } else {
        // Fallback: build from details directly
        unified = buildUnifiedCityDataFromSummaryDetails(summary, details);
      }
    } catch (e) {
      console.warn("map.js: updateMapData error, falling back to details flatten", e);
      unified = buildUnifiedCityDataFromSummaryDetails(summary, details);
    }

    // build panel and markers
    buildRegionPanelFromUnified(unified);

    window.cityMarkerLayer.clearLayers();
    window._cityMarkerIndex = {};
    const coords = [];

    Object.values(unified).forEach(city => {
      if (!city.lat || !city.lon) {
        console.debug("map.js: no coords for", city.city);
        return;
      }
      const marker = createCityMarker(city, city.barDetail);
      marker.addTo(window.cityMarkerLayer);
      window._cityMarkerIndex[city.city] = marker;
      coords.push([city.lat, city.lon]);
    });

    if (coords.length) {
      try { realMap.fitBounds(L.latLngBounds(coords).pad(0.25)); } catch (e) { console.warn("fitBounds failed", e); }
    } else {
      realMap.setView([15,0], 2.5);
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
      realMap.setView([15,0], 2.5);
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

  // ---------- Init on DOM ready ----------
  document.addEventListener("DOMContentLoaded", () => {
    try {
      initRealMap();
      setupButtons();
      const panel = document.getElementById("region-panel-content");
      if (panel) panel.innerHTML = "<div class='no-cities'>Waiting for data…</div>";
      console.debug("map.js loaded");
    } catch (e) {
      console.error("map.js init error", e);
    }
  });

  // ---------- Export functions for other scripts ----------
  window.updateMapFromCombined = updateMapFromCombined;
  window.updateMapData = updateMapData;

})();