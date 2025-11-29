ok, we get offline count, but this count is wrong,
            whe i add this in this place, ok
can you chekc bar chart code, in this show correct count and city count ok..
            ok i dont wnt to add updateMapData in this place ok 
see bar chart 
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
            }\

// C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\script.js
// const baseUrl = "http://localhost:80/api/regions";
const baseUrl = "http://10.138.161.4:3000/api/regions";
let refreshInterval = 300000; // 5 minutes
let pingInterval = 60000; // 30 seconds
let countdownTime = refreshInterval / 1000; // Convert to seconds
let currentRegion = "global";
let deviceDetailsCache = {}; // Store previous details to prevent redundant updates
let latestDetails = null; // Cache the latest fetched details




// Controller cache (populated inside fetchData)
window.controllerDataCached = null; // <-- ADDED: global cache for controllers

document.addEventListener("DOMContentLoaded", () => {
    // ⬇️⬇️ this is call from graph.js
    initOfflineChart();
    // ensure bar chart is also created (safe to call even if already initialized)
    if (typeof initOfflineCityBarChart === "function") {
      try { initOfflineCityBarChart(); } catch(e){ console.warn("initOfflineCityBarChart failed:", e); }
    }
    fetchData("global"); // Load initial data
    startAutoRefresh("global");



    // Attach Door click
    const doorCard = document.getElementById("door-card");
    if (doorCard) {
        doorCard.style.cursor = "pointer";
        doorCard.title = "Click to view Controllers";
        doorCard.addEventListener("click", loadControllersInDetails);
    }


    document.querySelectorAll(".region-button").forEach((button) => {
        button.addEventListener("click", () => {
            const region = button.getAttribute("data-region");
            document.getElementById("region-title").textContent = `${region.toUpperCase()} Summary`;
            switchRegion(region);
        });
    });

    document.getElementById("close-modal").addEventListener("click", () => {
        document.getElementById("modal").style.display = "none";
    });


    // ---------------------------
    // NEW: Summary card click/dblclick filter behavior
    // Single click: set device-filter to that type and trigger change (show only that type)
    // Double click: set device-filter to 'all' and trigger change (show all)
    // ---------------------------

    (function attachSummaryCardFilterHandlers() {
        const summaryCards = document.querySelectorAll(".summary .card");
        if (!summaryCards || summaryCards.length === 0) return;

        // helper: derive deviceFilter value from card title text
        function mapCardTitleToFilterValue(title) {
            if (!title) return "all";
            const t = title.toLowerCase();

            if (t.includes("camera")) return "cameras";
            if (t.includes("archiver")) return "archivers";
            if (t.includes("controller")) return "controllers";
            if (t.includes("ccure")) return "servers";       // CCURE servers
            if (t.includes("db")) return "dbdetails";        // DB servers
            if (t.includes("desktop")) return "pcdetails";
            if (t.includes("total")) return "all";

            return "all";
        }

        document.addEventListener("DOMContentLoaded", () => {
            const doorCard = document.getElementById("door-card");
            if (doorCard) {
                doorCard.style.cursor = "pointer";
                doorCard.title = "Click to view Controllers";
                doorCard.addEventListener("click", loadControllersInDetails);
            }
        });



        summaryCards.forEach((card) => {
            // make interactive
            card.style.cursor = "pointer";

            let clickTimer = null;
            const clickDelay = 100; // ms


            card.addEventListener("click", (ev) => {
                if (clickTimer) clearTimeout(clickTimer);
                clickTimer = setTimeout(() => {
                    const h3 = card.querySelector("h3");
                    const titleText = h3 ? h3.innerText.trim() : card.innerText.trim();
                    const filterValue = mapCardTitleToFilterValue(titleText);

                    const deviceFilterElem = document.getElementById("device-filter");
                    if (!deviceFilterElem) return;

                    deviceFilterElem.value = filterValue;
                    deviceFilterElem.dispatchEvent(new Event("change", { bubbles: true }));

                    // 🔥 Highlight clicked card, remove from others
                    document.querySelectorAll(".summary .card").forEach(c => c.classList.remove("active"));
                    if (filterValue !== "all") {
                        card.classList.add("active");
                    }
                }, clickDelay);
            });

            card.addEventListener("dblclick", (ev) => {
                if (clickTimer) {
                    clearTimeout(clickTimer);
                    clickTimer = null;
                }
                const deviceFilterElem = document.getElementById("device-filter");
                if (!deviceFilterElem) return;

                deviceFilterElem.value = "all";
                deviceFilterElem.dispatchEvent(new Event("change", { bubbles: true }));

                // 🔥 Remove all highlights on double-click (reset)
                document.querySelectorAll(".summary .card").forEach(c => c.classList.remove("active"));
            });



        });
    })();



}); 

// // --- Camera URL auto-detect helpers ---

function buildUrlFromHints(ip, cameraname = "", hyperlink = "") {
    ip = (ip || "").trim();
    hyperlink = (hyperlink || "").trim();

    // 🔑 Always prefer Excel's hyperlink if present
    if (hyperlink && /^https?:\/\//.test(hyperlink)) {
        return hyperlink;
    }

    // Direct IP
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
        return `http://${ip}`;
    }

    // Brand-based fallback
    const name = (cameraname || "").toLowerCase();
    if (/\bverkada\b/.test(name)) return `https://${ip}/#/login`;
    if (/\bflir\b/.test(name)) return `http://${ip}/control/userimage.html`;
    if (/\bhoneywell\b/.test(name)) return `http://${ip}/www/index.html`;
    if (/axis/.test(name)) return `http://${ip}/view/view.shtml`;

    return `http://${ip}`;
}

function openCamera(ip, name, hyperlink = "") {
    const url = buildUrlFromHints(ip, name, hyperlink);
    console.log("Opening URL:", url);  // Debug
    window.open(url, "_blank", "noopener");
}





function switchRegion(region) {
    clearExistingIntervals(); // Avoid interval duplication
    currentRegion = region;
    deviceDetailsCache = {};
    fetchData(region);
    startAutoRefresh(region);
}

// **Auto-refresh mechanism**
function startAutoRefresh(regionName) {
    fetchData(regionName); // Fetch initial data

    clearExistingIntervals();

    // Start countdown timer
    window.countdownTimer = setInterval(() => {
        document.getElementById("countdown").innerText = `Refreshing in ${countdownTime} seconds`;
        countdownTime--;
        if (countdownTime < 0) countdownTime = refreshInterval / 1000;
    }, 1000);

    // Refresh summary & details every 5 minutes
    window.refreshTimer = setInterval(() => {
        fetchData(regionName);
        countdownTime = refreshInterval / 1000;
    }, refreshInterval);

    // Ping devices every 30 seconds using history API
    window.pingTimer = setInterval(() => {
        pingAllDevices(regionName);
    }, pingInterval);
}

function clearExistingIntervals() {
    clearInterval(window.countdownTimer);
    clearInterval(window.refreshTimer);
    clearInterval(window.pingTimer);
}

// **Fetch summary and details together**







// Fetch summary, details and controllers together
function fetchData(regionName) {
    Promise.all([
        fetch(`${baseUrl}/summary/${regionName}`).then(res => res.json()),
        fetch(`${baseUrl}/details/${regionName}`).then(res => res.json()),
        // fetch(`http://localhost/api/controllers/status`).then(res => res.json()) // <-- controllers endpoint
        fetch(`http://10.138.161.4:3000/api/controllers/status`).then(res => res.json()) // <-- controllers endpoint
    ])
        .then(([summary, details, controllerData]) => {
            console.log("Summary Data:", summary);
            console.log("Details Data:", details);
            console.log("Controller Data:", controllerData);

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
        })
        .catch((error) => console.error("Error fetching data:", error));
}
// Process controllers API to compute doors & readers totals
function processDoorAndReaderData(controllerData) {
    // controllerData is expected to be an array of controller objects (per your example)
    if (!Array.isArray(controllerData)) {
        return {
            doors: { total: 0, online: 0, offline: 0 },
            readers: { total: 0, online: 0, offline: 0 }
        };
    }

    let doorsTotal = 0, doorsOnline = 0;
    let readersTotal = 0, readersOnline = 0;

    controllerData.forEach(ctrl => {
        if (!Array.isArray(ctrl.Doors)) return;

        ctrl.Doors.forEach(door => {
            // Count door
            doorsTotal++;
            if ((door.status || "").toLowerCase() === "online") doorsOnline++;

            // Count reader only if Reader field is present & non-empty
            if (door.Reader && door.Reader.toString().trim() !== "") {
                readersTotal++;
                if ((door.status || "").toLowerCase() === "online") readersOnline++;
            }
        });
    });

    return {
        doors: {
            total: doorsTotal,
            online: doorsOnline,
            offline: doorsTotal - doorsOnline
        },
        readers: {
            total: readersTotal,
            online: readersOnline,
            offline: readersTotal - readersOnline
        }
    };
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

                //     // ⬇️⬇️ this is call from graph.js
                // if (window.updateOfflineChart) {
                //     window.updateOfflineChart(offlineDevices);
                // }

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

