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
    "Italy, Rome": [41.9028, 12.4966],
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
    cameras: "camera",
    camera: "camera",
    archivers: "archiver",
    archiver: "archiver",
    controllers: "controller",
    controller: "controller",
    servers: "server",
    server: "server"
  };

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
  // UNIVERSAL STATUS & TYPE EXTRACTOR
  // ---------------------------------------------------------------------
  function getDeviceStatus(dev) {
    let statusRaw =
      dev.status ??
      dev.Status ??
      dev.deviceStatus ??
      dev.state ??
      dev.State ??
      dev.device_state ??
      "";

    let status = String(statusRaw).trim().toLowerCase();

    // numeric/boolean forms
    if (statusRaw === 0 || statusRaw === "0" || statusRaw === false) return "offline";
    if (statusRaw === 1 || statusRaw === "1" || statusRaw === true) return "online";

    // string forms
    if (status.includes("off")) return "offline";
    if (status.includes("on")) return "online";

    return status || "unknown";
  }

  function getDeviceType(dev) {
    let typeRaw =
      dev.type ??
      dev.Type ??
      dev.deviceType ??
      dev.device_type ??
      dev.category ??
      "";

    const type = String(typeRaw).trim().toLowerCase();
    return TYPE_MAP[type] ?? null;
  }

  // ---------------------------------------------------------------------
  // Safe city bar builder — NO SHUFFLE
  // ---------------------------------------------------------------------
  function safeBuildCityBarDataWithBreakdown(combinedDevices) {
    const map = {};

    combinedDevices.forEach(entry => {
      const dev = entry.device || entry;
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

      const status = getDeviceStatus(dev);
      const short = getDeviceType(dev);

      if (status === "offline" && short && map[city].offline[short] !== undefined) {
        map[city].offline[short]++;
      }
    });

    // risk calculation
    Object.values(map).forEach(c => {
      const o = c.offline;
      const risk =
        o.server > 0 ||
        o.controller > 0 ||
        o.archiver > 0 ||
        (o.camera > 0 && (o.controller > 0 || o.archiver > 0 || o.server > 0))
          ? "High"
          : o.camera > 0
          ? "Medium"
          : "Low";

      c.risk = risk;
    });

    const entries = Object.values(map); // NO SHUFFLE

    return {
      labels: entries.map(e => e.city),
      values: entries.map(e => e.total),
      details: entries.map(e => ({
        city: e.city,
        total: e.total,
        offline: { ...e.offline },
        risk: e.risk
      }))
    };
  }

  // ---------------------------------------------------------------------
  // Type Totals (map markers)
  // ---------------------------------------------------------------------
  function buildTypeTotalsFromCombined(combined = []) {
    const result = {};

    combined.forEach(entry => {
      const dev = entry.device || entry;
      if (!dev) return;

      const city = normalizeCityName(dev.city || "Unknown");
      const status = getDeviceStatus(dev);
      const short = getDeviceType(dev);

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
  // Coordinates
  // ---------------------------------------------------------------------
  function fuzzyCoords(city) {
    if (CITY_COORDS[city]) return CITY_COORDS[city];

    const low = city.toLowerCase();
    const match = Object.keys(CITY_COORDS).find(
      k => k.toLowerCase().includes(low) || low.includes(k.toLowerCase())
    );

    return match ? CITY_COORDS[match] : null;
  }

  // ---------------------------------------------------------------------
  // Map initialization
  // ---------------------------------------------------------------------
  function initRealMap() {
    ensureMapDivHeight();
    if (!isLeafletLoaded()) return;
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
  // Marker
  // ---------------------------------------------------------------------
  function createCityMarker(city) {
    const html = `
      <div class="city-pin">
        <i class="bi bi-geo-alt-fill"></i>
        <div class="city-count">${city.total}</div>
      </div>`;

    const icon = L.divIcon({
      className: "city-marker",
      html,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    const marker = L.marker([city.lat, city.lon], { icon });

    const o = city.offline;
    const tip = `
      <strong>${city.city}</strong><br>
      Total: ${city.total}<br>
      Online: ${city.online} | Offline: ${city.offlineTotal}<br><br>

      Cameras: ${city.counts.camera} (Offline ${o.camera})<br>
      Archivers: ${city.counts.archiver} (Offline ${o.archiver})<br>
      Controllers: ${city.counts.controller} (Offline ${o.controller})<br>
      Servers: ${city.counts.server} (Offline ${o.server})<br><br>

      Risk: ${city.risk}
    `;

    marker.bindTooltip(tip, { sticky: true, opacity: 0.95 });
    marker.bindPopup(tip);

    return marker;
  }

  // ---------------------------------------------------------------------
  // Region Panel — Option A (NO-OP)
  // ---------------------------------------------------------------------
  function buildRegionPanelFromUnified(_) {}

  // ---------------------------------------------------------------------
  // Convert details → combined list
  // ---------------------------------------------------------------------
  function flattenDetailsToCombined(details) {
    const result = [];
    if (!details) return result;

    const sections = details.details || details;
    Object.values(sections).forEach(arr => {
      if (Array.isArray(arr)) {
        arr.forEach(dev => result.push({ device: dev }));
      }
    });

    return result;
  }

  // ---------------------------------------------------------------------
  // Main update
  // ---------------------------------------------------------------------
  function updateMapData(summary, details) {
    if (!realMap) initRealMap();

    const combined = flattenDetailsToCombined(details);
    const bar = safeBuildCityBarDataWithBreakdown(combined);
    const totals = buildTypeTotalsFromCombined(combined);

    const unified = {};
    bar.labels.forEach(cityName => {
      const coords = fuzzyCoords(cityName);
      const info = totals[cityName] || {
        counts: { camera: 0, archiver: 0, controller: 0, server: 0 },
        offline: { camera: 0, archiver: 0, controller: 0, server: 0 },
        total: 0,
        offlineTotal: 0,
        online: 0
      };

      const barDetail = bar.details.find(d => d.city === cityName) || null;

      unified[cityName] = {
        city: cityName,
        total: info.total,
        counts: info.counts,
        offline: info.offline,
        offlineTotal: info.offlineTotal,
        online: info.online,
        lat: coords ? coords[0] : null,
        lon: coords ? coords[1] : null,
        risk: barDetail ? barDetail.risk : "Low"
      };
    });

    buildRegionPanelFromUnified(unified);

    window.cityMarkerLayer.clearLayers();
    window._cityMarkerIndex = {};

    const bounds = [];

    Object.values(unified).forEach(city => {
      if (!city.lat || !city.lon) return;

      const marker = createCityMarker(city);
      marker.addTo(window.cityMarkerLayer);
      window._cityMarkerIndex[city.city] = marker;

      bounds.push([city.lat, city.lon]);
    });

    if (bounds.length) {
      realMap.fitBounds(L.latLngBounds(bounds).pad(0.25));
    }
  }

  // ---------------------------------------------------------------------
  // Alternative updater
  // ---------------------------------------------------------------------
  function updateMapFromCombined(combined) {
    return updateMapData(null, { details: { all: combined.map(d => d.device || d) } });
  }

  window.updateMapData = updateMapData;
  window.updateMapFromCombined = updateMapFromCombined;
})();