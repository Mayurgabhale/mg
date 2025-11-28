// ---- ADD THIS near the top of updateDetails(), before you use it ----
/**
 * Build a per-city offline counts from combinedDevices array.
 * combinedDevices is an array of { card, device } objects.
 */
function buildOfflineCityCount(devices) {
    const cityMap = {};
    (devices || []).forEach(item => {
        const dev = item.device;
        if (!dev) return;
        if ((dev.status || '').toString().toLowerCase() !== 'offline') return;
        const city = (dev.city || "Unknown").toString();
        const type = (dev.type || "").toString();
        if (!cityMap[city]) {
            cityMap[city] = { city, offline: { camera: 0, controller: 0, server: 0, archiver: 0 } };
        }
        if (cityMap[city].offline.hasOwnProperty(type)) {
            cityMap[city].offline[type] += 1;
        }
    });
    return Object.values(cityMap);
}

function convertOfflineCityForMap(offlineCities) {
    return (offlineCities || []).map(city => ({
        city: city.city,
        offlineDevices: city.offline,
        totalOffline: Object.values(city.offline || {}).reduce((a, b) => a + (b || 0), 0)
    }));
}