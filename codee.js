function updateSummary(data) {
    const summaryData = data.summary || data;

    // Merge previous state with new summary values
    let merged = { ...previousData, ...summaryData };

    // 🟦 REPLACE BACKEND SUMMARY WITH CORRECT VALUES FROM details API
    if (window.latestDetails && window.latestDetails.details) {
        const allDevices = Object.values(window.latestDetails.details).flat();

        merged.totalDevices = allDevices.length;
        merged.totalOnlineDevices = allDevices.filter(x => x.status === "online").length;
        merged.totalOfflineDevices = allDevices.filter(x => x.status === "offline").length;
    }

    // Continue your existing code….
    // update DOM cards, animations, charts, etc.