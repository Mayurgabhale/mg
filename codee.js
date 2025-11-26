function computeFilteredControllerExtras(selectedCity = "all", selectedStatus = "all") {
                const controllersAll = Array.isArray(window.controllerDataCached) ? window.controllerDataCached : [];
                const result = { doors: { total: 0, online: 0, offline: 0 }, readers: { total: 0, online: 0, offline: 0 } };

                if (!controllersAll || controllersAll.length === 0) return result;

                const cityFilterLower = (selectedCity || "all").toString().toLowerCase();
                const statusFilterLower = (selectedStatus || "all").toString().toLowerCase();
                const regionFilterLower = (currentRegion || "global").toString().toLowerCase();

                controllersAll.forEach(ctrl => {
                    // Skip if controller has no Doors
                    if (!Array.isArray(ctrl.Doors) || ctrl.Doors.length === 0) return;

                    // Region filter (if a specific region other than 'global' is active)
                    if (regionFilterLower !== "global") {
                        const ctrlLocation = (ctrl.Location || ctrl.location || "").toString().toLowerCase();
                        const ctrlCity = (ctrl.City || ctrl.city || "").toString().toLowerCase();
                        if (ctrlLocation !== regionFilterLower && ctrlCity !== regionFilterLower) {
                            // controller not in selected region => skip
                            return;
                        }
                    }

                    // Apply city filter if any (match City OR Location)
                    if (cityFilterLower !== "all") {
                        const ctrlCity = (ctrl.City || ctrl.city || "").toString().toLowerCase();
                        const ctrlLocation = (ctrl.Location || ctrl.location || "").toString().toLowerCase();

                        // Match either City OR Location
                        if (ctrlCity !== cityFilterLower && ctrlLocation !== cityFilterLower) return;
                    }

                    // Apply status filter if any (match controllerStatus)
                    if (statusFilterLower !== "all") {
                        const ctrlStatus = (ctrl.controllerStatus || ctrl.status || "").toString().toLowerCase();
                        if (ctrlStatus !== statusFilterLower) return;
                    }

                    // Count doors/readers for this controller
                    ctrl.Doors.forEach(d => {
                        result.doors.total++;
                        if ((d.status || "").toString().toLowerCase() === "online") result.doors.online++;

                        if (d.Reader && d.Reader.toString().trim() !== "") {
                            result.readers.total++;
                            if ((d.status || "").toString().toLowerCase() === "online") result.readers.online++;
                        }
                    });
                });

                result.doors.offline = result.doors.total - result.doors.online;
                result.readers.offline = result.readers.total - result.readers.online;
                return result;
            }