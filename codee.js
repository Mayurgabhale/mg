// Cache full controller data for reuse (keep unfiltered copy)
            if (Array.isArray(controllerData)) {
                window.controllerDataCached = controllerData; // full cache
            } else {
                window.controllerDataCached = null;
            }

            // Build controllers list filtered by the requested region (so summary reflects region)
            let controllersForRegion = Array.isArray(controllerData) ? controllerData.slice() : [];
            try {
                const regionLower = (regionName || "global").toString().toLowerCase();
                if (regionLower !== "global") {
                    controllersForRegion = controllersForRegion.filter(c => {
                        const loc = (c.Location || c.location || "").toString().toLowerCase();
                        // also allow matching by City if you ever pass city as region
                        const city = (c.City || c.city || "").toString().toLowerCase();
                        return loc === regionLower || city === regionLower;
                    });
                }
            } catch (e) {
                // fallback: keep full list if something goes wrong
                controllersForRegion = Array.isArray(controllerData) ? controllerData.slice() : [];
            }

            // Compute door + reader summary from controllers API but using region-filtered controllers
            const controllerExtras = processDoorAndReaderData(controllersForRegion);

            // Attach extras into the same structure updateSummary expects:
            if (!summary.summary) summary.summary = {};
            summary.summary.controllerExtras = controllerExtras;