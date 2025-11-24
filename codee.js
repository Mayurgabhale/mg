function updateOfflineChart(offlineDevices) {

    // ✅ Only allow these 4 types
    const allowedTypes = ["cameras", "archivers", "controllers", "servers"]; 
    // servers = CCURE based on your logic

    const typeMap = {
        cameras: 0,
        archivers: 1,
        controllers: 2,
        servers: 3   // CCURE
    };

    const points = offlineDevices
        .filter(dev => allowedTypes.includes(dev.type))   // 🔴 FILTER HERE
        .map(dev => ({
            x: Date.parse(dev.lastSeen) || Date.now(),
            y: typeMap[dev.type],
            name: dev.name || "Unknown",
            ip: dev.ip || "N/A",
            city: dev.city || "N/A",
            lastSeen: dev.lastSeen
        }));

    offlineChart.data.datasets[0].data = points;
    offlineChart.update();
}