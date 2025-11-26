// Cache controller data for reuse
            if (Array.isArray(controllerData)) {
                window.controllerDataCached = controllerData; // <-- ADDED: cache controllers globally
            } else {
                window.controllerDataCached = null;
            }

            // Compute door + reader summary from controllers API
            const controllerExtras = processDoorAndReaderData(controllerData);

            // Attach extras into the same structure updateSummary expects:
            if (!summary.summary) summary.summary = {};
            summary.summary.controllerExtras = controllerExtras;