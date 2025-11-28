// ⬇️⬇️ this is call from graph.js (scatter)
                if (window.updateOfflineChart) {
                    try {
                      window.updateOfflineChart(offlineDevices);
                    } catch (e) {
                      console.warn("updateOfflineChart failed:", e);
                    }
                }

                // ✅ ALSO update the Offline City BAR chart
                // updateOfflineCityBarChart expects combinedDevices items with a `.device` property,
                // so map our flat deviceObjects into that shape.
                if (typeof window.updateOfflineCityBarChart === "function") {
                    try {
                        const barInput = (Array.isArray(deviceObjects) ? deviceObjects : []).map(dev => ({ device: dev }));
                        window.updateOfflineCityBarChart(barInput);
                    } catch (e) {
                        console.warn("updateOfflineCityBarChart failed:", e);
                    }
                } else {
                    console.debug("updateOfflineCityBarChart() not found - ensure graph.js was loaded.");
                }