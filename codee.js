// inside fetchData(regionName) .then(([summary, details]) => { ... })
.then(async ([summary, details]) => {
    console.log("Summary Data:", summary);
    console.log("Details Data:", details);

    updateSummary(summary);

    if (JSON.stringify(details) !== JSON.stringify(deviceDetailsCache)) {
        updateDetails(details);
        deviceDetailsCache = details; // Update cache
    }

    // Cache details for pinging
    latestDetails = details;

    // <-- NEW: update the map using the freshly fetched summary/details
    if (window.updateMapData_Disabled) {
        try {
            await window.updateMapData_Disabled(summary, details);
            console.log("Map updated, CITY_LIST length:", (window.CITY_LIST || []).length);
        } catch (err) {
            console.error("updateMapData_Disabled failed:", err);
        }
    } else {
        console.warn("updateMapData_Disabled is not available on window");
    }
})