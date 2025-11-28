// compute summary for filtered devices
const summary = calculateCitySummary(filteredSummaryDevices);

// compute controller extras (you already had this)
const controllerExtrasFiltered = computeFilteredControllerExtras(selectedCity, selectedStatus);
if (!summary.summary) summary.summary = {};
summary.summary.controllerExtras = controllerExtrasFiltered;

// Now safely call the map update with the full details object (not data.details)
if (typeof window.updateMapData === 'function') {
    try {
        // pass summary and the original details object that was passed into updateDetails()
        window.updateMapData(summary, data);
    } catch (err) {
        console.warn("updateMapData failed:", err);
    }
} else {
    console.debug("updateMapData not available yet.");
}

// Then update UI summary and other charts
updateSummary(summary);