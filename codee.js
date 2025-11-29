// after updating details and latestDetails:
            if (JSON.stringify(details) !== JSON.stringify(deviceDetailsCache)) {
                updateDetails(details);
                deviceDetailsCache = details; // Update cache
            }
            latestDetails = details;

            // --- NEW: tell the map to update with latest summary/details ---
            try {
                if (typeof window.updateMapData === "function") {
                    // call it now (map code expects signature updateMapData(summary, details))
                    try {
                        window.updateMapData(summary, details);
                    } catch (callErr) {
                        console.warn("updateMapData threw:", callErr);
                    }
                } else {
                    // map script not loaded yet: stash payload so the map can consume it when ready
                    window.pendingMapData = { summary: summary, details: details };
                    console.info("updateMapData not found yet — saved pendingMapData for later.");
                }
            } catch (err) {
                console.error("Map update attempt failed:", err);
            }