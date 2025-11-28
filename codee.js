const allDevices = combinedDevices.map(item => item.card);
const deviceObjects = combinedDevices.map(item => item.device);

// ===== Build offline city data for map (safe: helper functions must be defined above) =====
const offlineCityData = buildOfflineCityCount(combinedDevices);
const mapCityData = convertOfflineCityForMap(offlineCityData);

// If you have a specialized offline-map update function, call it; otherwise the main map updater:
if (typeof window.updateOfflineMap === "function") {
    try { window.updateOfflineMap(mapCityData); } catch (e) { console.warn("updateOfflineMap() failed:", e); }
} else {
    // update main map with summary + details later (we will call updateMapData further below)
    console.debug("updateOfflineMap not found — mapCityData built", mapCityData);
}