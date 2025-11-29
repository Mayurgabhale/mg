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