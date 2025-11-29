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

  // Normalize city names
  function normalizeCityName(city) {
    if (!city) return "Unknown";
    city = city.toString().toLowerCase().trim();

    if (city.startsWith("pune")) return "Pune";

    if (
      city.includes("vilnius") ||
      city.includes("gama") ||
      city.includes("delta")
    ) {
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

  // ---------------------------------------------------------------------
  // SAFE BAR BUILDER (FIXED) — no shuffle, consistent city-order
  // ---------------------------------------------------------------------
  function safeBuildCityBarDataWithBreakdown(combinedDevices) {
    if (typeof window.buildCityBarDataWithBreakdown === "function") {
      try {
        return window.buildCityBarDataWithBreakdown(combinedDevices);
      } catch (e) {
        console.warn("map.js: external builder failed, using fallback", e);
      }
    }

    const map = {};
    if (!Array.isArray(combinedDevices)) return { labels: [], values: [], details: [] };

    combinedDevices.forEach(entry => {
      const dev = (entry && entry.device) ? entry.device : entry;
      if (!dev) return;

      const city = normalizeCityName(dev.city || "Unknown");

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
      const short = TYPE_MAP[(dev.type || "").toLowerCase()];
      if (status === "offline" && short && map[city].offline.hasOwnProperty(short)) {
        map[city].offline[short]++;
      }
    });

    // risk
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

    const entries = Object.values(map); // NO SHUFFLE

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

  // ---------------------------------------------------------------------
  // Device type totals used for map
  // ---------------------------------------------------------------------
  function buildTypeTotalsFromCombined(combinedDevices = []) {
    const result = {};

    (combinedDevices || []).forEach(entry => {
      const dev = (entry && entry.device) ? entry.device : entry;
      if (!dev) return;

      const city = normalizeCityName(dev.city || "Unknown");
      const status = (dev.status || "").toLowerCase();
      const short = TYPE_MAP[(dev.type || "").toLowerCase()];

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

      if (short) {
        result[city].counts[short]++;
        if (status === "offline") {
          result[city].offline[short]++;
          result[city].offlineTotal++;
        }
      } else if (status === "offline") {
        result[city].offlineTotal++;
      }
    });

    Object.values(result).forEach(c => {
      c.online = c.total - c.offlineTotal;
    });

    return result;
  }

  // ---------------------------------------------------------------------
  // Coordinates matching
  // ---------------------------------------------------------------------
  function fuzzyCoords(city) {
    if (!city) return null;
    if (CITY_COORDS[city]) return CITY_COORDS[city];
    const low = city.toLowerCase();

    const matchKey = Object.keys(CITY_COORDS).find(
      k => k.toLowerCase().includes(low) || low.includes(k.toLowerCase())
    );

    return matchKey ? CITY_COORDS[matchKey] : null;
  }

  // ---------------------------------------------------------------------
  // Map initialization
  // ---------------------------------------------------------------------
  function initRealMap() {
    ensureMapDivHeight();
    if (!isLeafletLoaded()) {
      console.error("Leaflet not loaded");
      return;
    }
    if (realMap) return;

    realMap = L.map("realmap", {
      preferCanvas: true,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true
    }).setView([15, 0], 2.5);

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 20, attribution: "Tiles © Esri" }
    ).addTo(realMap);

    window.cityMarkerLayer = L.layerGroup().addTo(realMap);
  }

  // ---------------------------------------------------------------------
  // Marker creation
  // ---------------------------------------------------------------------
  function createCityMarker(cityStats, extraDetail) {
    const offlineTotal = cityStats.offlineTotal;

    const html = `
      <div class="city-pin">
        <i class="bi bi-geo-alt-fill"></i>
        <div class="city-count">${cityStats.total}</div>
      </div>`;

    const icon = L.divIcon({
      className: "city-marker",
      html,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    const marker = L.marker([cityStats.lat, cityStats.lon], { icon });

    const off = cityStats.offline || { camera: 0, controller: 0, archiver: 0, server: 0 };
    const risk = cityStats.risk || "Low";

    const tip = `
      <div>
        <strong>${cityStats.city}</strong><br/>
        Total: ${cityStats.total}<br/>
        Online: ${cityStats.online} | Offline: ${offlineTotal}<br/><br/>

        Cameras: ${cityStats.counts.camera} (Offline ${off.camera})<br/>
        Archivers: ${cityStats.counts.archiver} (Offline ${off.archiver})<br/>
        Controllers: ${cityStats.counts.controller} (Offline ${off.controller})<br/>
        Servers: ${cityStats.counts.server} (Offline ${off.server})<br/><br/>

        Risk: ${risk}
      </div>
    `;

    marker.bindTooltip(tip, { sticky: true, direction: "top", opacity: 0.95 });
    marker.bindPopup(tip);

    return marker;
  }

  // ---------------------------------------------------------------------
  // Convert details object -> combinedDevices array
  // ---------------------------------------------------------------------
  function flattenDetailsToCombined(details) {
    const combined = [];
    if (!details) return combined;

    const buckets = details.details || details;
    if (!buckets) return combined;

    Object.values(buckets).forEach(arr => {
      if (Array.isArray(arr)) {
        arr.forEach(d => combined.push({ device: d }));
      }
    });

    return combined;
  }

  // ---------------------------------------------------------------------
  // REGION PANEL (OPTION A — NO-OP, SAFE)
  // ---------------------------------------------------------------------
  function buildRegionPanelFromUnified(unified) {
    // prevents crashes — but does nothing (Option A)
    return;
  }

  // ---------------------------------------------------------------------
  // Main map update using summary + details
  // ---------------------------------------------------------------------
  function updateMapData(summary, details) {
    if (!isLeafletLoaded()) return;
    if (!realMap) initRealMap();
    if (!window.cityMarkerLayer) window.cityMarkerLayer = L.layerGroup().addTo(realMap);

    const combined = flattenDetailsToCombined(details);
    const bar = safeBuildCityBarDataWithBreakdown(combined);
    const typeTotals = buildTypeTotalsFromCombined(combined);

    const labels = bar.labels.length ? bar.labels : Object.keys(typeTotals);
    const unified = {};

    labels.forEach(cityName => {
      const tt = typeTotals[cityName] || {
        counts: { camera: 0, archiver: 0, controller: 0, server: 0 },
        offline: { camera: 0, archiver: 0, controller: 0, server: 0 },
        total: 0,
        online: 0,
        offlineTotal: 0
      };

      const barDetail = bar.details.find(d => d.city === cityName) || null;
      const coords = fuzzyCoords(cityName);

      const offlineBreakdown = barDetail ? barDetail.offline : tt.offline;
      const offlineTotal =
        barDetail ?
        Object.values(barDetail.offline).reduce((a, b) => a + b, 0) :
        tt.offlineTotal;

      unified[cityName] = {
        city: cityName,
        total: tt.total || (barDetail ? barDetail.total : 0),
        counts: tt.counts,
        offline: offlineBreakdown,
        offlineTotal,
        online: tt.total - offlineTotal,
        lat: coords ? coords[0] : null,
        lon: coords ? coords[1] : null,
        risk: (barDetail ? barDetail.risk : "Low"),
        barDetail
      };
    });

    buildRegionPanelFromUnified(unified);

    window.cityMarkerLayer.clearLayers();
    window._cityMarkerIndex = {};

    const bounds = [];

    Object.values(unified).forEach(city => {
      if (!city.lat || !city.lon) return;

      const marker = createCityMarker(city, city.barDetail);
      marker.addTo(window.cityMarkerLayer);
      window._cityMarkerIndex[city.city] = marker;
      bounds.push([city.lat, city.lon]);
    });

    if (bounds.length) {
      realMap.fitBounds(L.latLngBounds(bounds).pad(0.25));
    } else {
      realMap.setView([15, 0], 2.5);
    }
  }

  // ---------------------------------------------------------------------
  // Secondary updater using combinedDevices array directly
  // ---------------------------------------------------------------------
  function updateMapFromCombined(combined) {
    const bar = safeBuildCityBarDataWithBreakdown(combined);
    const typeTotals = buildTypeTotalsFromCombined(combined);

    const labels = bar.labels.length ? bar.labels : Object.keys(typeTotals);
    const unified = {};

    labels.forEach(cityName => {
      const tt = typeTotals[cityName] || {
        counts: { camera: 0, archiver: 0, controller: 0, server: 0 },
        offline: { camera: 0, archiver: 0, controller: 0, server: 0 },
        total: 0,
        online: 0,
        offlineTotal: 0
      };

      const barDetail = bar.details.find(d => d.city === cityName) || null;
      const coords = fuzzyCoords(cityName);

      const offlineBreakdown = barDetail ? barDetail.offline : tt.offline;
      const offlineTotal =
        barDetail ?
        Object.values(barDetail.offline).reduce((a, b) => a + b, 0) :
        tt.offlineTotal;

      unified[cityName] = {
        city: cityName,
        total: tt.total || (barDetail ? barDetail.total : 0),
        counts: tt.counts,
        offline: offlineBreakdown,
        offlineTotal,
        online: tt.total - offlineTotal,
        lat: coords ? coords[0] : null,
        lon: coords ? coords[1] : null,
        risk: (barDetail ? barDetail.risk : "Low"),
        barDetail
      };
    });

    buildRegionPanelFromUnified(unified);

    window.cityMarkerLayer.clearLayers();
    window._cityMarkerIndex = {};

    const bounds = [];

    Object.values(unified).forEach(city => {
      if (!city.lat || !city.lon) return;

      const marker = createCityMarker(city, city.barDetail);
      marker.addTo(window.cityMarkerLayer);
      window._cityMarkerIndex[city.city] = marker;
      bounds.push([city.lat, city.lon]);
    });

    if (bounds.length) {
      realMap.fitBounds(L.latLngBounds(bounds).pad(0.25));
    } else {
      realMap.setView([15, 0], 2.5);
    }
  }

  // ---------------------------------------------------------------------
  // Export
  // ---------------------------------------------------------------------
  window.updateMapData = updateMapData;
  window.updateMapFromCombined = updateMapFromCombined;

})();