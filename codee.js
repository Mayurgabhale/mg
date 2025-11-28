// ================= OFFLINE CITY COUNT =================
function buildOfflineCityCount(devices) {
    const cityMap = {};

    devices.forEach(item => {
        const dev = item.device;

        if (dev.status !== "offline") return;

        const city = dev.city || "Unknown";
        const type = dev.type;

        if (!cityMap[city]) {
            cityMap[city] = {
                city: city,
                offline: { camera: 0, controller: 0, server: 0, archiver: 0 }
            };
        }

        if (cityMap[city].offline[type] !== undefined) {
            cityMap[city].offline[type]++;
        }
    });

    return Object.values(cityMap);
}