not, wokr offline count is not diplsy in map, 
  please read teh bellow all code carefully, and 
slove the issue, and give me updae codeok

read the all code carefullym and 
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
  function safeBuildCityBarDataWithBreakdown(combinedDevices) {
    if (typeof window.buildCityBarDataWithBreakdown === "function") {
      try {
        return window.buildCityBarDataWithBreakdown(combinedDevices);
      } catch (e) {
        console.warn("map.js: buildCityBarDataWithBreakdown threw, falling back to internal implementation", e);
      }
    }

    // Internal copy (identical behavior to the bar chart's version you posted)
    const map = {}; // city -> info

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

    // Apply risk logic
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

    // Keep insertion order; then shuffle (the bar chart shuffled)
    let entries = Object.values(map);
    for (let i = entries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [entries[i], entries[j]] = [entries[j], entries[i]];
    }

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
