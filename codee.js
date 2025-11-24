const offlineDevices = filteredSummaryDevices
    .filter(d => d.status === "offline")
    .map(d => ({
        name: d.name || "Unknown",
        ip: d.ip,
        city: d.city,
        type: d.type,
        lastSeen: new Date().toISOString()
    }));

if (window.updateOfflineChart) {
    window.updateOfflineChart(offlineDevices);
}