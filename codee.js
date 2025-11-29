if (JSON.stringify(details) !== JSON.stringify(deviceDetailsCache)) {
    updateDetails(details);
    deviceDetailsCache = details; // Update cache
}

// 🔹 Update map here
if (window.updateMapData_Disabled) {
    try {
        updateMapData_Disabled(summary, details);
        console.log("Map updated");
    } catch (err) {
        console.error("updateMapData_Disabled failed:", err);
    }
} else {
    console.warn("updateMapData_Disabled is not available on window");
}

// Cache details for pinging
latestDetails = details;