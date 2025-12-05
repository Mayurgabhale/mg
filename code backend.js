in frntend we disply all device but,
 i dont want to show 
 CONTROLLER_DOORS
in the 

IN-PUN-2NDFLR-ISTAR PRO
 CONTROLLER_DOORS

 N/A

 APAC

 Pune 2nd Floor

Offline
in this card only this CONTROLLER_DOORS ok so who to do this
 read the below all code and tell me ony CONTROLLER_DOORS ok

US. FL.MIAMI ULTRA CONTROLLER
 CONTROLLERS

 10.21.8.66

 NAMER

 Florida, Miami

Offline


WKSPUN-392353
 Screen 04

 WKSPUN-392353

 APAC

 Pune Podium

Offline


WKSPUN-492142
 Screen 07

 WKSPUN-492142

 APAC

 Pune Podium

Offline


WKSWUPUN2709
 GSOC Laptop

 WKSWUPUN2709

 APAC

 Pune Podium

Offline


IN-PUN-2NDFLR-ISTAR PRO
 CONTROLLER_DOORS

 N/A

 APAC

 Pune 2nd Floor

Offline


IN-PUN-2NDFLR-ISTAR PRO
 CONTROLLER_DOORS

 N/A

 APAC

 Pune 2nd Floor

Offline
<section id="details-section" class="details-section">
        <div class="details-header">
          <h2><i class="fas fa-microchip"></i> Device Details</h2>
          <input type="text" id="device-search" placeholder="🔍 Search by IP, Location, City..." />

        </div>
        <div id="device-details" class="device-grid">Loading device data...</div>
        <div id="details-container" class="device-grid"></div>
      </section>

// Fetch summary, details and controllers together
function fetchData(regionName) {
    Promise.all([
        fetch(`${baseUrl}/summary/${regionName}`).then(res => res.json()),
        fetch(`${baseUrl}/details/${regionName}`).then(res => res.json()),
        fetch(`http://localhost/api/controllers/status`).then(res => res.json()) // <-- controllers endpoint
        // fetch(`http://10.138.161.4:3000/api/controllers/status`).then(res => res.json()) // <-- controllers endpoint
    ])
        .then(([summary, details, controllerData]) => {
          
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
            // Update UI and details
            updateSummary(summary);

            // ⬇️⬇️
            // Tell the map about new live counts if map exists
            if (typeof window.updateMapData === 'function') {
                window.updateMapData(summary, details);
            }

            if (JSON.stringify(details) !== JSON.stringify(deviceDetailsCache)) {
                updateDetails(details);
                deviceDetailsCache = details; // Update cache
            }
            latestDetails = details;
        })
        .catch((error) => console.error("Error fetching data:", error));
}


function updateSummary(data) {
    const summary = data.summary || {};

    // ✅ Always keep last known values if new data doesn’t have them
    window.lastSummary = window.lastSummary || {};
    const merged = {
        totalDevices: summary.totalDevices ?? window.lastSummary.totalDevices ?? 0,
        totalOnlineDevices: summary.totalOnlineDevices ?? window.lastSummary.totalOnlineDevices ?? 0,
        totalOfflineDevices: summary.totalOfflineDevices ?? window.lastSummary.totalOfflineDevices ?? 0,

        cameras: { ...window.lastSummary.cameras, ...summary.cameras },
        archivers: { ...window.lastSummary.archivers, ...summary.archivers },
        controllers: { ...window.lastSummary.controllers, ...summary.controllers },
        servers: { ...window.lastSummary.servers, ...summary.servers },
        pcdetails: { ...window.lastSummary.pcdetails, ...summary.pcdetails },
        dbdetails: { ...window.lastSummary.dbdetails, ...summary.dbdetails },
        // 🆕 door/reader extras merged (summary.controllerExtras is created in fetchData)
        controllerExtras: { ...window.lastSummary.controllerExtras, ...summary.controllerExtras }
    };


    // 🆕 Recalculate totals to include Door counts (but not Readers)
    const doors = merged.controllerExtras?.doors || { total: 0, online: 0, offline: 0 };

    // Recompute totals including doors
    merged.totalDevices =
        (merged.cameras?.total || 0) +
        (merged.archivers?.total || 0) +
        (merged.controllers?.total || 0) +
        (merged.servers?.total || 0) +
        (merged.pcdetails?.total || 0) +
        (merged.dbdetails?.total || 0) +
        doors.total; // ✅ include doors only

    merged.totalOnlineDevices =
        (merged.cameras?.online || 0) +
        (merged.archivers?.online || 0) +
        (merged.controllers?.online || 0) +
        (merged.servers?.online || 0) +
        (merged.pcdetails?.online || 0) +
        (merged.dbdetails?.online || 0) +
        doors.online; // ✅ include doors only

    merged.totalOfflineDevices =
        merged.totalDevices - merged.totalOnlineDevices;




    // ✅ Save merged result for next refresh
    window.lastSummary = merged;

    // Update UI safely
    document.getElementById("total-devices").textContent = merged.totalDevices;
    document.getElementById("online-devices").textContent = merged.totalOnlineDevices;
    document.getElementById("offline-devices").textContent = merged.totalOfflineDevices;

    document.getElementById("camera-total").textContent = merged.cameras?.total || 0;
    document.getElementById("camera-online").textContent = merged.cameras?.online || 0;
    document.getElementById("camera-offline").textContent = merged.cameras?.offline || 0;

    document.getElementById("archiver-total").textContent = merged.archivers?.total || 0;
    document.getElementById("archiver-online").textContent = merged.archivers?.online || 0;
    document.getElementById("archiver-offline").textContent = merged.archivers?.offline || 0;

    document.getElementById("controller-total").textContent = merged.controllers?.total || 0;
    document.getElementById("controller-online").textContent = merged.controllers?.online || 0;
    document.getElementById("controller-offline").textContent = merged.controllers?.offline || 0;

    document.getElementById("server-total").textContent = merged.servers?.total || 0;
    document.getElementById("server-online").textContent = merged.servers?.online || 0;
    document.getElementById("server-offline").textContent = merged.servers?.offline || 0;

    // ✅ Fix for Desktop and DB Server
    document.getElementById("pc-total").textContent = merged.pcdetails?.total || 0;
    document.getElementById("pc-online").textContent = merged.pcdetails?.online || 0;
    document.getElementById("pc-offline").textContent = merged.pcdetails?.offline || 0;

    document.getElementById("db-total").textContent = merged.dbdetails?.total || 0;
    document.getElementById("db-online").textContent = merged.dbdetails?.online || 0;
    document.getElementById("db-offline").textContent = merged.dbdetails?.offline || 0;


    // ✅  new for Door and Reader 


    // //////////////////////////////////


    // ====== Door / Reader card updates (from controllers API) ======
    const extras = merged.controllerExtras || {};

    // Prefer the combined doorReader-* IDs (your summary card)
    const doorTotalEl = document.getElementById("doorReader-total");
    const doorOnlineEl = document.getElementById("doorReader-online");
    const doorOfflineEl = document.getElementById("doorReader-offline");

    // Also mirror IDs expected by graph.js / other scripts (safe to set only if they exist)
    const doorOnlineAlt = document.getElementById("door-online");
    const doorOfflineAlt = document.getElementById("door-offline");

    const readerTotalEl = document.getElementById("reader-total-inline");
    const readerOnlineEl = document.getElementById("reader-online-inline");
    const readerOfflineEl = document.getElementById("reader-offline-inline");

    // Also mirror IDs expected by graph.js
    const readerOnlineAlt = document.getElementById("reader-online");
    const readerOfflineAlt = document.getElementById("reader-offline");

    if (extras.doors) {
        if (doorTotalEl) doorTotalEl.textContent = extras.doors.total || 0;
        if (doorOnlineEl) doorOnlineEl.textContent = extras.doors.online || 0;
        if (doorOfflineEl) doorOfflineEl.textContent = extras.doors.offline || 0;

        // mirror
        if (doorOnlineAlt) doorOnlineAlt.textContent = extras.doors.online || 0;
        if (doorOfflineAlt) doorOfflineAlt.textContent = extras.doors.offline || 0;
    } else {
        if (doorTotalEl) doorTotalEl.textContent = 0;
        if (doorOnlineEl) doorOnlineEl.textContent = 0;
        if (doorOfflineEl) doorOfflineEl.textContent = 0;

        if (doorOnlineAlt) doorOnlineAlt.textContent = 0;
        if (doorOfflineAlt) doorOfflineAlt.textContent = 0;
    }

    if (extras.readers) {
        if (readerTotalEl) readerTotalEl.textContent = extras.readers.total || 0;
        if (readerOnlineEl) readerOnlineEl.textContent = extras.readers.online || 0;
        if (readerOfflineEl) readerOfflineEl.textContent = extras.readers.offline || 0;

        // mirror
        if (readerOnlineAlt) readerOnlineAlt.textContent = extras.readers.online || 0;
        if (readerOfflineAlt) readerOfflineAlt.textContent = extras.readers.offline || 0;
    } else {
        if (readerTotalEl) readerTotalEl.textContent = 0;
        if (readerOnlineEl) readerOnlineEl.textContent = 0;
        if (readerOfflineEl) readerOfflineEl.textContent = 0;

        if (readerOnlineAlt) readerOnlineAlt.textContent = 0;
        if (readerOfflineAlt) readerOfflineAlt.textContent = 0;
    }

    // ⬇️⬇️ this is call from graph.js
    // --- Immediately refresh gauges/total-chart so UI updates right away after filtering ---
    if (typeof renderGauges === "function") {
        try { renderGauges(); } catch (e) { console.warn("renderGauges failed:", e); }
    }
    if (typeof updateTotalCountChart === "function") {
        try { updateTotalCountChart(); } catch (e) { console.warn("updateTotalCountChart failed:", e); }
    }


}


function updateDetails(data) {
    const detailsContainer = document.getElementById("device-details");
    const deviceFilter = document.getElementById("device-filter");
    const onlineFilterButton = document.getElementById("filter-online");
    const offlineFilterButton = document.getElementById("filter-offline");
    const allFilterButton = document.getElementById("filter-all");
    const cityFilter = document.getElementById("city-filter");



    detailsContainer.innerHTML = "";
    cityFilter.innerHTML = '<option value="all">All Cities</option>';

    let combinedDevices = [];
    let citySet = new Set();
    let vendorSet = new Set(); // collect normalized vendor values
    let typeCityMap = {}; // <-- NEW: map deviceType -> Set of cities

    // Icon utility based on device type
    function getDeviceIcon(type = "") {
        type = type.toLowerCase();
        if (type.includes("camera")) return "fas fa-video";
        if (type.includes("controller")) return "fas fa-cogs";
        if (type.includes("archiver")) return "fas fa-database";
        if (type.includes("server")) return "fas fa-server";
        if (type.includes("pc")) return "fas fa-desktop";
        if (type.includes("dbdetails")) return "fa-solid fa-life-ring";
        return "fas fa-microchip"; // fallback
    }



    // Helper to find matching controller (by IP or name)
    function findControllerForDevice(device) {
        const controllers = Array.isArray(window.controllerDataCached) ? window.controllerDataCached : null;
        const ipToMatch = (device.ip || device.ip_address || "").toString().trim();
        const nameToMatch = (device.controllername || device.controller_name || device.cameraname || "").toString().trim();

        if (controllers) {
            // Try IP match first
            if (ipToMatch) {
                const byIp = controllers.find(c => c.IP_address && c.IP_address.toString().trim() === ipToMatch);
                if (byIp) return byIp;
            }
            // Try controller name match (loose contains)
            if (nameToMatch) {
                const nameLower = nameToMatch.toLowerCase();
                const byName = controllers.find(c => (c.controllername || "").toLowerCase().includes(nameLower) || nameLower.includes((c.controllername || "").toLowerCase()));
                if (byName) return byName;
            }
            // Last resort: try city match + online status (heuristic)
            if (device.city) {
                const byCity = controllers.find(c => (c.City || "").toLowerCase() === (device.city || "").toLowerCase());
                if (byCity) return byCity;
            }
        }
        return null;
    }

    // If controllers aren't cached, we will fetch them when necessary (lazy)
    function ensureControllersCached() {
        if (Array.isArray(window.controllerDataCached)) return Promise.resolve(window.controllerDataCached);
        return fetch("http://localhost/api/controllers/status")
            // return fetch("http://10.138.161.4:3000/api/controllers/status")
            .then(res => res.json())
            .then(data => {
                window.controllerDataCached = Array.isArray(data) ? data : null;
                return window.controllerDataCached;
            })
            .catch(err => {
                console.error("Failed to fetch controllers:", err);
                return null;
            });
    }


    // Fetch real-time status if available.
    fetch("http://localhost:80/api/region/devices/status")
        // fetch("http://10.138.161.4:3000/api/region/devices/status")
        .then((response) => response.json())
        .then((realTimeStatus) => {
            // console.log("Live Status Data:", realTimeStatus);

            for (const [key, devices] of Object.entries(data.details)) {
                if (!Array.isArray(devices) || devices.length === 0) continue;
                const deviceType = key.toLowerCase();

                // ensure map entry exists
                if (!typeCityMap[deviceType]) typeCityMap[deviceType] = new Set();

                devices.forEach((device) => {
                    const deviceIP = device.ip_address || "N/A";
                    let currentStatus = (realTimeStatus[deviceIP] || device.status || "offline").toLowerCase();
                    const city = device.city || "Unknown";

                    // collect city globally and per device type
                    citySet.add(city);
                    typeCityMap[deviceType].add(city);

                    // --- VENDOR: read possible fields, normalize, skip empty/unknown ---
                    // NOTE: your JSON uses the key "deviec_details" (typo) — we read that first.
                    let rawVendor = device.deviec_details || device.device_details || (device.device_details && device.device_details.vendor) || device.vendor || device.vendor_name || device.manufacturer || "";
                    rawVendor = (rawVendor || "").toString().trim();

                    // Normalize: empty -> null, otherwise uppercase for consistent set values
                    let vendorNormalized = rawVendor ? rawVendor.toUpperCase() : null;

                    // Only add real vendors (skip "UNKNOWN", "", null)
                    if (vendorNormalized && vendorNormalized !== "UNKNOWN") {
                        vendorSet.add(vendorNormalized);
                    }

                    const datasetVendorValue = vendorNormalized || "";

                    // Create card element.
                    const card = document.createElement("div");
                    card.className = "device-card";
                    card.dataset.type = deviceType;
                    card.dataset.status = currentStatus;
                    card.dataset.city = city;
                    if (datasetVendorValue) card.dataset.vendor = datasetVendorValue; // only set if valid
                    card.setAttribute("data-ip", deviceIP);

                    // Apply background color based on online/offline status (kept your placeholders)
                    card.style.backgroundColor = currentStatus === "online" ? "" : "";
                    card.style.borderColor = currentStatus === "online" ? "" : "";

                    // Create a container for status
                    const statusContainer = document.createElement("p");
                    statusContainer.className = "device-status";

                    // Status text
                    const statusText = document.createElement("span");
                    statusText.className = "status-text";
                    statusText.textContent = currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1);
                    statusText.style.color = currentStatus === "online" ? "green" : "red";

                    // Status dot
                    const statusDot = document.createElement("span");
                    statusDot.classList.add(currentStatus === "online" ? "online-dot" : "offline-dot");
                    statusDot.style.backgroundColor = (currentStatus === "online") ? "green" : "red";
                    statusDot.style.display = "inline-block";
                    statusDot.style.width = "10px";
                    statusDot.style.height = "10px";
                    statusDot.style.marginLeft = "5px";
                    statusDot.style.marginRight = "5px";
                    statusDot.style.borderRadius = "50%";

                    // Combine status parts
                    statusContainer.appendChild(statusDot);
                    statusContainer.appendChild(statusText);

                    // compute a nicer label for the device-type area
                    let deviceLabel;

                    if (deviceType === "dbdetails") {
                        // For DB Details: show the application if available, else fallback
                        deviceLabel = device.application || deviceType.toUpperCase();
                    } else if (deviceType.includes("pc")) {
                        deviceLabel = device.pc_name || device.hostname || "PC";
                    } else {
                        deviceLabel = deviceType.toUpperCase();
                    }

                    card.insertAdjacentHTML("beforeend", `
                        <button class="edit-device-btn" 
                            onclick="openEditForDeviceFromIP('${deviceIP}', '${detectTypeFromDeviceObj(device)}')"
                            style="margin-left:8px; padding:4px;">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                    <h3 class="device-name" style="font-size:20px; font-weight:500; font-family: PP Right Grotesk; margin-bottom: 10px;">
                        ${device.cameraname || device.controllername || device.archivername || device.servername || device.hostname || "Unknown Device"}
                    </h3>

                    <div class="card-content">
                    <p class="device-type-label ${deviceType}" 
                    style="font-size:17px;  font-family: Roboto; font-weight:100; margin-bottom: 10px; display:flex; justify-content:space-between; align-items:center;">
                    
                    <strong>
                        <i class="${getDeviceIcon(deviceType)}" style="margin-right: 5px;"></i> 
                        ${deviceLabel}
                    </strong>
                    
                    ${deviceType.includes("camera")
                                        ? `<button class="open-camera-btn"
                    onclick="openCamera('${deviceIP}', '${(device.cameraname || device.controllername || "").replace(/'/g, "\\'")}', '${device.hyperlink || ""}')"
                    title="Open Camera"
                    style="border:none; cursor:pointer; font-weight:100; border-radius:50%; width:34px; height:34px; display:flex; justify-content:center; align-items:center;">
                    <img src="images/cctv.png" alt="Logo" style="width:33px; height:33px;"/>
                    </button>`: ""}
                    </p>

                    <p style="font-size: ;  font-family: Roboto; margin-bottom: 8px;">
                    <strong style="color:rgb(8, 8, 8);"><i class="fas fa-network-wired" style="margin-right: 6px;"></i></strong>
                        <span 
                        class="device-ip" 
                        style="font-weight:100; color: #00adb5; cursor: pointer; text-shadow: 0 0 1px rgba(0, 173, 181, 0.3);  font-family: Roboto;"
                        onclick="copyToClipboard('${deviceIP}')"
                        title="Click to copy IP">
                        ${deviceIP}
                    </span>
                    </p>

                    <p style="font-size: ;  font-family: Roboto; margin-bottom: 6px;">
                    <strong ><i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i></strong>
                    <span style="font-size:; font-weight:100; margin-left: 12px;  font-family: Roboto; font-size: ;">${device.location || "N/A"}</span>
                    </p>

                    <p style="font-size:;  font-family: Roboto;>
                    <strong "><i class="fas fa-city" style="margin-right: 5px;"></i></strong>
                    <span style="font-weight:100;margin-left: 4px;  font-family: Roboto; font-size:;">${city}</span>
                    </p>
                    </div>
                `);
                    card.appendChild(statusContainer);

                    // --- ADDED: if this is a controller card, attach click to open doors modal ---
                    if (deviceType.includes("controller")) {
                        card.style.cursor = "pointer";
                        card.title = "Click to view Doors for this controller";
                        card.setAttribute("role", "button");
                        card.setAttribute("tabindex", "0");

                        // click handler that uses cached controllers when possible
                        const openControllerDoors = async () => {
                            // try to find matching controller from cache
                            let ctrl = findControllerForDevice({ ip: deviceIP, controllername: device.controllername, city: city });
                            if (!ctrl) {
                                // ensure controllers are cached then try again
                                await ensureControllersCached();
                                ctrl = findControllerForDevice({ ip: deviceIP, controllername: device.controllername, city: city });
                            }
                            if (ctrl) {
                                showDoorsReaders(ctrl);
                            } else {
                                // fallback: open controllers list then highlight nearest by city/IP
                                loadControllersInDetails();
                                // show a quick toast/message to indicate we couldn't find exact match
                                console.warn("Controller details not found in cache for IP/name:", deviceIP, device.controllername);
                            }
                        };

                        card.addEventListener("click", (ev) => {
                            openControllerDoors();
                        });

                        // keyboard accessibility (Enter / Space)
                        card.addEventListener("keydown", (ev) => {
                            if (ev.key === "Enter" || ev.key === " ") {
                                ev.preventDefault();
                                openControllerDoors();
                            }
                        });
                    }
                    // --- END ADDED CLICK HANDLER ---

                    // --- show policy tooltip for devices marked "Not accessible" ---
                    const remarkText = (device.remark || "").toString().trim();
                    if (remarkText && /not\s+access/i.test(remarkText)) {
                        if (!card.style.position) card.style.position = "relative";

                        const tooltip = document.createElement("div");
                        tooltip.className = "device-access-tooltip";
                        tooltip.textContent = "Due to Network policy, this camera is Not accessible";

                        tooltip.style.position = "absolute";
                        tooltip.style.bottom = "100%";
                        tooltip.style.left = "8px";
                        tooltip.style.padding = "6px 8px";
                        tooltip.style.background = "rgba(0,0,0,0.85)";
                        tooltip.style.color = "#fff";
                        tooltip.style.borderRadius = "4px";
                        tooltip.style.fontSize = "12px";
                        tooltip.style.whiteSpace = "nowrap";
                        tooltip.style.pointerEvents = "none";
                        tooltip.style.opacity = "0";
                        tooltip.style.transform = "translateY(-6px)";
                        tooltip.style.transition = "opacity 0.12s ease, transform 0.12s ease";
                        tooltip.style.zIndex = "999";

                        card.appendChild(tooltip);

                        card.addEventListener("mouseenter", () => {
                            tooltip.style.opacity = "1";
                            tooltip.style.transform = "translateY(-10px)";
                        });
                        card.addEventListener("mouseleave", () => {
                            tooltip.style.opacity = "0";
                            tooltip.style.transform = "translateY(-6px)";
                        });

                        card.title = tooltip.textContent;
                    }

                    // push device with normalized vendor (may be empty string if unknown)
                    combinedDevices.push({
                        card: card,
                        device: {
                            ip: deviceIP,
                            type: deviceType,
                            status: currentStatus,
                            city: city,
                            vendor: datasetVendorValue // already normalized (uppercase) or ""
                        }
                    });
                });
            }

            combinedDevices.sort((a, b) => {
                const statusA = (a.device.status === "offline") ? 0 : 1;
                const statusB = (b.device.status === "offline") ? 0 : 1;
                return statusA - statusB;
            });

            const allDevices = combinedDevices.map(item => item.card);
            const deviceObjects = combinedDevices.map(item => item.device);

            // --- NEW: function to populate city select based on selected device type ---
            function populateCityOptions(selectedType = "all") {
                // preserve current selected city if possible
                const prevSelected = cityFilter.value;

                cityFilter.innerHTML = '<option value="all">All Cities</option>';

                let citiesToShow = new Set();

                if (!selectedType || selectedType === "all") {
                    citiesToShow = citySet;
                } else {
                    const setForType = typeCityMap[selectedType];
                    if (setForType && setForType.size > 0) {
                        citiesToShow = setForType;
                    } else {
                        // no cities for selected type -> keep empty (except "All Cities")
                        citiesToShow = new Set();
                    }
                }

                // Add cities in sorted order for stable UI
                Array.from(citiesToShow).sort().forEach((city) => {
                    const option = document.createElement("option");
                    option.value = city;
                    option.textContent = city;
                    cityFilter.appendChild(option);
                });

                // restore previous if still valid, otherwise set to 'all'
                if (prevSelected && Array.from(citiesToShow).includes(prevSelected)) {
                    cityFilter.value = prevSelected;
                } else {
                    cityFilter.value = "all";
                }
            }

            // populate vendor options
            let vendorFilter = document.getElementById("vendorFilter");
            if (!vendorFilter) {
                vendorFilter = document.createElement("select");
                vendorFilter.id = "vendorFilter";
                vendorFilter.style.marginTop = "8px";
                deviceFilter.parentNode.insertBefore(vendorFilter, cityFilter);
            }

            vendorFilter.innerHTML = `<option value="all">All camera</option>`;
            [...vendorSet].sort().forEach(v => {
                if (!v) return;
                const opt = document.createElement("option");
                opt.value = v;
                opt.textContent = v;
                vendorFilter.appendChild(opt);
            });

            // hide vendor filter by default unless cameras selected
            vendorFilter.style.display = (deviceFilter.value === "cameras") ? "block" : "none";

            vendorFilter.onchange = filterDevices; // uses filterDevices defined below

            // Build initial city options for the current deviceFilter selection
            populateCityOptions(deviceFilter.value || "all");

            // avoid duplicate listeners on repeated updates
            deviceFilter.value = "all";
            cityFilter.value = "all";
            document.querySelectorAll(".status-filter").forEach(btn => btn.classList.remove("active"));
            allFilterButton.classList.add("active");


            // new -----
            // --- Add this helper inside updateDetails (same scope as filterDevices) ---



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

            // new -----



            function filterDevices() {
                const selectedType = deviceFilter.value;
                const selectedStatus = document.querySelector(".status-filter.active")?.dataset.status || "all";
                const selectedCity = cityFilter.value;
                const vendorFilterLabel = document.getElementById("vendorFilterLabel");

                // toggle vendor UI
                vendorFilter.style.display = (deviceFilter.value === "cameras") ? "block" : "none";
                if (vendorFilterLabel) {
                    vendorFilterLabel.style.display = vendorFilter.style.display;
                }

                // get vendor selection (if filter exists)
                const vendorFilterElem = document.getElementById("vendorFilter");
                const selectedVendor = vendorFilterElem ? vendorFilterElem.value : "all";

                // Search bar input
                const searchTerm = document.getElementById("device-search").value.toLowerCase();

                // Show/hide vendor filter based on type
                if (vendorFilterElem) {
                    vendorFilterElem.style.display = (selectedType === "cameras") ? "block" : "none";
                }

                detailsContainer.innerHTML = "";

                const filteredDevices = allDevices.filter((device) =>
                    (selectedType === "all" || device.dataset.type === selectedType) &&
                    (selectedStatus === "all" || device.dataset.status === selectedStatus) &&
                    (selectedCity === "all" || device.dataset.city === selectedCity) &&
                    (selectedVendor === "all" || (device.dataset.vendor || "") === selectedVendor) &&
                    (
                        !searchTerm ||
                        device.innerText.toLowerCase().includes(searchTerm)
                    )
                );

                filteredDevices.forEach((deviceCard) => {
                    detailsContainer.appendChild(deviceCard);
                });

                const region = currentRegion?.toUpperCase() || "GLOBAL";
                const titleElement = document.getElementById("region-title");

                const logoHTML = `
                    <span class="region-logo">
                        <a href="http://10.199.22.57:3014/" class="tooltip">
                            <i class="fa-solid fa-house"></i>
                            <span class="tooltiptext">Dashboard Hub</span>
                        </a>
                    </span>
                    `;
                if (selectedCity !== "all") {
                    titleElement.innerHTML = `${logoHTML}<span>${region}, ${selectedCity} Summary</span>`;
                } else {
                    titleElement.innerHTML = `${logoHTML}<span>${region} Summary</span>`;
                }


                const filteredSummaryDevices = deviceObjects.filter((deviceObj, index) => {
                    const correspondingCard = allDevices[index];
                    return (
                        (selectedType === "all" || correspondingCard.dataset.type === selectedType) &&
                        (selectedStatus === "all" || correspondingCard.dataset.status === selectedStatus) &&
                        (selectedCity === "all" || correspondingCard.dataset.city === selectedCity) &&
                        (selectedVendor === "all" || (correspondingCard.dataset.vendor || "") === selectedVendor)
                    );
                });
                const offlineDevices = filteredSummaryDevices
                    .filter(d => d.status === "offline")
                    .map(d => ({
                        name: d.name || "Unknown",
                        ip: d.ip,
                        city: d.city,
                        type: d.type,
                        lastSeen: new Date().toISOString()
                    }));


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

                const summary = calculateCitySummary(filteredSummaryDevices);

                // --- NEW: compute controller door/reader counts for the current filters ---
                // We pass selectedCity and selectedStatus so door counts reflect the active filters.
                const controllerExtrasFiltered = computeFilteredControllerExtras(selectedCity, selectedStatus);
                if (!summary.summary) summary.summary = {};
                summary.summary.controllerExtras = controllerExtrasFiltered;

                updateSummary(summary);
            }

            function calculateCitySummary(devices) {
                const summary = {
                    summary: {
                        totalDevices: devices.length,
                        totalOnlineDevices: devices.filter(d => d.status === "online").length,
                        totalOfflineDevices: devices.filter(d => d.status === "offline").length,
                        cameras: { total: 0, online: 0, offline: 0 },
                        archivers: { total: 0, online: 0, offline: 0 },
                        controllers: { total: 0, online: 0, offline: 0 },
                        servers: { total: 0, online: 0, offline: 0 },
                        pcdetails: { total: 0, online: 0, offline: 0 },
                        dbdetails: { total: 0, online: 0, offline: 0 }
                    }
                };

                devices.forEach((device) => {
                    if (!summary.summary[device.type]) return;
                    summary.summary[device.type].total += 1;
                    if (device.status === "online") summary.summary[device.type].online += 1;
                    else summary.summary[device.type].offline += 1;
                });

                return summary;
            }

            // initial filter run
            filterDevices();

            setTimeout(() => {
                const selectedCity = cityFilter.value;
                const selectedType = deviceFilter.value;
                const selectedStatus = document.querySelector(".status-filter.active")?.dataset.status || "all";
                const vendorFilterElem = document.getElementById("vendorFilter");
                const selectedVendor = vendorFilterElem ? vendorFilterElem.value : "all";

                const filteredSummaryDevices = deviceObjects.filter((deviceObj, index) => {
                    const correspondingCard = allDevices[index];
                    return (
                        (selectedType === "all" || correspondingCard.dataset.type === selectedType) &&
                        (selectedStatus === "all" || correspondingCard.dataset.status === selectedStatus) &&
                        (selectedCity === "all" || correspondingCard.dataset.city === selectedCity) &&
                        (selectedVendor === "all" || (correspondingCard.dataset.vendor || "") === selectedVendor)
                    );
                });

                const summary = calculateCitySummary(filteredSummaryDevices);
                updateSummary(summary);
            }, 100);

            // ---- EVENTS ----
            // When device type changes, rebuild city options first then apply filters.
            deviceFilter.addEventListener("change", () => {
                populateCityOptions(deviceFilter.value || "all");
                filterDevices();
            });

            // Search bar input
            document.getElementById("device-search").addEventListener("input", filterDevices);
            cityFilter.addEventListener("change", filterDevices);
            allFilterButton.addEventListener("click", () => {
                document.querySelectorAll(".status-filter").forEach(btn => btn.classList.remove("active"));
                allFilterButton.classList.add("active");
                filterDevices();
            });
            onlineFilterButton.addEventListener("click", () => {
                document.querySelectorAll(".status-filter").forEach(btn => btn.classList.remove("active"));
                onlineFilterButton.classList.add("active");
                filterDevices();
            });
            offlineFilterButton.addEventListener("click", () => {
                document.querySelectorAll(".status-filter").forEach(btn => btn.classList.remove("active"));
                offlineFilterButton.classList.add("active");
                filterDevices();
            });
        })
        .catch((error) => {
            console.error("Error fetching real-time device status:", error);
            detailsContainer.innerHTML = "<p>Failed to load device details.</p>";
        });
}
