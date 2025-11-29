chart.js:13 Uncaught Error: Canvas is already in use. Chart with ID '0' must be destroyed before the canvas with ID 'DotOfflineDevice' can be reused.
script.js:232 Summary Data: Object
script.js:233 Details Data: Object
script.js:234 Controller Data: Array(71)
script.js:281 Error fetching data: ReferenceError: buildRegionPanelFromUnified is not defined
    at updateMapData (map.js:1729:5)
    at script.js:272:24
(anonymous) @ script.js:281
script.js:232 Summary Data: Object
script.js:233 Details Data: Object
script.js:234 Controller Data: Array(71)
script.js:281 Error fetching data: ReferenceError: buildRegionPanelFromUnified is not defined
    at updateMapData (map.js:1729:5)
    at script.js:272:24
(anonymous) @ script.js:281
script.js:232 Summary Data: Object
script.js:233 Details Data: Object
script.js:234 Controller Data: Array(71)
script.js:281 Error fetching data: ReferenceError: buildRegionPanelFromUnified is not defined
    at updateMapData (map.js:1729:5)
    at script.js:272:24
(anonymous) @ script.js:281
script.js:232 Summary Data: Object
script.js:233 Details Data: Object
script.js:234 Controller Data: Array(71)
script.js:281 Error fetching data: ReferenceError: buildRegionPanelFromUnified is not defined
    at updateMapData (map.js:1729:5)
    at script.js:272:24
(anonymous) @ script.js:281


(function () {
  // ---------- Globals ----------
  let realMap = null;
  window.cityMarkerLayer = null;
  window._cityMarkerIndex = {};

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

  const TYPE_MAP = {
    cameras: 'camera',
    archivers: 'archiver',
    controllers: 'controller',
    servers: 'server'
  };

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

  function ensureMapDivHeight() {
    const el = document.getElementById("realmap");
    if (!el) return;
    const h = el.clientHeight;
    if (!h || h < 20) {
      el.style.minHeight = "420px";
      el.style.height = "420px";
    }
  }

  function isLeafletLoaded() {
    return typeof L !== "undefined" && !!L;
  }

  // Robust safe builder: accepts either combinedDevices entries like { device: {...} } OR raw device objects
  function safeBuildCityBarDataWithBreakdown(combinedDevices) {
    if (typeof window.buildCityBarDataWithBreakdown === "function") {
      try {
        return window.buildCityBarDataWithBreakdown(combinedDevices);
      } catch (e) {
        console.warn("map.js: buildCityBarDataWithBreakdown threw, falling back to internal implementation", e);
      }
    }

    const map = {}; // city -> info
    if (!Array.isArray(combinedDevices)) return { labels: [], values: [], details: [] };

    combinedDevices.forEach(entry => {
      const dev = (entry && entry.device) ? entry.device : entry;
      if (!dev) return;

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

    // apply risk
    Object.values(map).forEach(cityObj => {
      const off = cityObj.offline;
      const cam = off.camera, ctrl = off.controller, arch = off.archiver, serv = off.server;
      if (serv > 0 || ctrl > 0 || arch > 0 || (cam > 0 && (ctrl > 0 || arch > 0 || serv > 0))) {
        cityObj.risk = "High";
      } else if (cam > 0) {
        cityObj.risk = "Medium";
      } else {
        cityObj.risk = "Low";
      }
    });

    // keep insertion order (no shuffle)
    const entries = Object.values(map);

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

  // Build per-city type totals (used by the map)
  function buildTypeTotalsFromCombined(combinedDevices = []) {
    const result = {};

    (combinedDevices || []).forEach(entry => {
      const dev = (entry && entry.device) ? entry.device : entry;
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
          online: 0,
          offlineTotal: 0
        };
      }

      result[city].total++;

      if (short && result[city].counts.hasOwnProperty(short)) {
        result[city].counts[short] = (result[city].counts[short] || 0) + 1;
        if (status === "offline") {
          result[city].offline[short] = (result[city].offline[short] || 0) + 1;
          result[city].offlineTotal = (result[city].offlineTotal || 0) + 1;
        }
      } else {
        // If type isn't in TYPE_MAP we still count total/offline
        if (status === "offline") {
          result[city].offlineTotal = (result[city].offlineTotal || 0) + 1;
        }
      }
    });

    // compute online
    Object.values(result).forEach(c => {
      c.online = c.total - (c.offlineTotal || 0);
      // also guarantee offline object keys exist (for tooltip printing)
      c.offline.camera = c.offline.camera || 0;
      c.offline.controller = c.offline.controller || 0;
      c.offline.archiver = c.offline.archiver || 0;
      c.offline.server = c.offline.server || 0;
    });

    return result;
  }

  function fuzzyCoords(city) {
    if (!city) return null;
    if (CITY_COORDS[city]) return CITY_COORDS[city];
    const low = city.toLowerCase();
    const matchKey = Object.keys(CITY_COORDS).find(k => k.toLowerCase().includes(low) || low.includes(k.toLowerCase()));
    if (matchKey) return CITY_COORDS[matchKey];
    return null;
  }

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

  function createCityMarker(cityStats, extraDetail) {
    // cityStats.offlineTotal is preferred (computed earlier).
    const offlineTotal = (typeof cityStats.offlineTotal === 'number')
      ? cityStats.offlineTotal
      : ((cityStats.offline?.camera || 0) + (cityStats.offline?.controller || 0) + (cityStats.offline?.archiver || 0) + (cityStats.offline?.server || 0));

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

    // prefer per-type offline from cityStats.offline (computed from typeTotals)
    const off = cityStats.offline && typeof cityStats.offline === 'object'
      ? cityStats.offline
      : (extraDetail && extraDetail.offline ? extraDetail.offline : { camera: 0, controller: 0, archiver: 0, server: 0 });

    const risk = (extraDetail && extraDetail.risk) || cityStats.risk || "Low";

    const tooltip = `
      <div style="min-width:220px">
        <strong>${cityStats.city}</strong><br/>
        Total: ${cityStats.total}<br/>
        Online: ${cityStats.online} | Offline: ${offlineTotal}<br/><br/>

        Cameras: ${cityStats.counts.camera} (Offline ${off.camera || 0})<br/>
        Archivers: ${cityStats.counts.archiver} (Offline ${off.archiver || 0})<br/>
        Controllers: ${cityStats.counts.controller} (Offline ${off.controller || 0})<br/>
        Servers: ${cityStats.counts.server} (Offline ${off.server || 0})<br/>

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

  // flatten details.details -> combinedDevices array
  function flattenDetailsToCombined(details) {
    const combined = [];
    if (!details) return combined;
    const buckets = details.details || details;
    if (!buckets || typeof buckets !== "object") return combined;

    Object.values(buckets).forEach(arr => {
      if (Array.isArray(arr)) {
        arr.forEach(d => combined.push({ device: d }));
      } else if (arr && typeof arr === 'object' && arr.device) {
        combined.push(arr);
      }
    });

    return combined;
  }

  function updateMapData(summary, details) {
    if (!isLeafletLoaded()) { console.error("Leaflet not loaded"); return; }
    if (!realMap) initRealMap();
    if (!window.cityMarkerLayer) window.cityMarkerLayer = L.layerGroup().addTo(realMap);

    const combined = flattenDetailsToCombined(details);
    const bar = safeBuildCityBarDataWithBreakdown(combined || []);
    const typeTotals = buildTypeTotalsFromCombined(combined || []);

    const labels = Array.isArray(bar.labels) && bar.labels.length ? bar.labels : Object.keys(typeTotals);
    const unified = {};

    labels.forEach(cityName => {
      const tt = typeTotals[cityName] || { counts: { camera:0,archiver:0,controller:0,server:0 }, offline: { camera:0,archiver:0,controller:0,server:0 }, total: 0, online: 0, offlineTotal: 0 };
      const barDetail = (Array.isArray(bar.details) ? bar.details.find(d => d.city === cityName) : null) || null;
      const coords = fuzzyCoords(cityName);

      // prefer barDetail.offline for per-type breakdown (bar logic authoritative),
      // but always compute offlineTotal deterministically.
      const perTypeOffline = barDetail ? { ...barDetail.offline } : { ...tt.offline };
      const offlineTotal = (barDetail && Object.values(barDetail.offline||{}).reduce((a,b)=>a+b,0)) || (tt.offlineTotal || Object.values(tt.offline||{}).reduce((a,b)=>a+b,0));

      unified[cityName] = {
        city: cityName,
        total: tt.total || (barDetail ? barDetail.total : 0),
        counts: tt.counts || { camera:0,archiver:0,controller:0,server:0 },
        offline: perTypeOffline,
        offlineTotal: offlineTotal,
        online: tt.online || ( (barDetail ? (barDetail.total - offlineTotal) : (tt.total - offlineTotal)) ),
        lat: coords ? coords[0] : null,
        lon: coords ? coords[1] : null,
        barDetail: barDetail,
        risk: barDetail ? barDetail.risk : "Low"
      };
    });

    buildRegionPanelFromUnified(unified);

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

  // same buildRegionPanelFromUnified & setupButtons & init DOM as before
  // (leave your existing implementations for buildRegionPanelFromUnified, setupButtons and DOMContentLoaded init)

  // expose
  window.updateMapFromCombined = updateMapFromCombined;
  window.updateMapData = updateMapData;

  // Provide updateMapFromCombined exported wrapper (same as before)
  function updateMapFromCombined(combinedDevices) {
    if (!isLeafletLoaded()) { console.error("Leaflet not loaded"); return; }
    if (!realMap) initRealMap();
    if (!window.cityMarkerLayer) window.cityMarkerLayer = L.layerGroup().addTo(realMap);

    const bar = safeBuildCityBarDataWithBreakdown(combinedDevices || []);
    const typeTotals = buildTypeTotalsFromCombined(combinedDevices || []);

    const labels = Array.isArray(bar.labels) && bar.labels.length ? bar.labels : Object.keys(typeTotals);
    const unified = {};

    labels.forEach(cityName => {
      const tt = typeTotals[cityName] || { counts: { camera:0, archiver:0, controller:0, server:0 }, offline: { camera:0, archiver:0, controller:0, server:0 }, total: 0, online: 0, offlineTotal: 0 };
      const barDetail = (Array.isArray(bar.details) ? bar.details.find(d => d.city === cityName) : null) || null;
      const coords = fuzzyCoords(cityName);

      const perTypeOffline = barDetail ? { ...barDetail.offline } : { ...tt.offline };
      const offlineTotal = (barDetail && Object.values(barDetail.offline||{}).reduce((a,b)=>a+b,0)) || (tt.offlineTotal || Object.values(tt.offline||{}).reduce((a,b)=>a+b,0));

      unified[cityName] = {
        city: cityName,
        total: tt.total || (barDetail ? barDetail.total : 0),
        counts: tt.counts,
        offline: perTypeOffline,
        offlineTotal: offlineTotal,
        online: tt.online || (barDetail ? (barDetail.total - offlineTotal) : (tt.total - offlineTotal)),
        lat: coords ? coords[0] : null,
        lon: coords ? coords[1] : null,
        barDetail: barDetail,
        risk: barDetail ? barDetail.risk : "Low"
      };
    });

    // reuse the same marker & panel logic as updateMapData
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

})();
