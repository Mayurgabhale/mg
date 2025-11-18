
Cameras Archivers Controllers CCURE 
    now in graph sectin i want to desing the all graphh 
         <section id="main-graph" style="background: black; color: white;">
        <h2>all graph</h2>

        
      </section>
        in this 
        i want half circle graph like above image i show this ok... 
 total cameras and and offline camares like all 
            Cameras Archivers Controllers CCURE  all for this ok 
                sam as like above image i want ok 

for this script i want differnt file name is graph.js ok  
    read below all code and how to do this ok
        can you do this more better and professal UI 
<!-- Main Content -->
    <main id="content">
      <section id="details-section" class="details-section">
        <div class="details-header">
          <h2><i class="fas fa-microchip"></i> Device Details</h2>
          <input type="text" id="device-search" placeholder="🔍 Search by IP, Location, City..." />
        </div>

        <div id="device-details" class="device-grid">Loading...</div>
        <div id="details-container" class="device-grid"></div>
      </section>

      <section id="main-graph" style="background: black; color: white;">
        <h2>all graph</h2>

        
      </section>
    </main>


// C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\script.js
const baseUrl = "http://localhost:80/api/regions";
let refreshInterval = 300000; // 5 minutes
let pingInterval = 60000; // 30 seconds
let countdownTime = refreshInterval / 1000; // Convert to seconds
let currentRegion = "global";
let deviceDetailsCache = {}; // Store previous details to prevent redundant updates
let latestDetails = null; // Cache the latest fetched details

document.addEventListener("DOMContentLoaded", () => {
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




// **Fetch summary, details and controllers together**
function fetchData(regionName) {
    Promise.all([
        fetch(`${baseUrl}/summary/${regionName}`).then(res => res.json()),
        fetch(`${baseUrl}/details/${regionName}`).then(res => res.json()),
        fetch(`http://localhost/api/controllers/status`).then(res => res.json()) // <-- controllers endpoint
    ])
        .then(([summary, details, controllerData]) => {
            console.log("Summary Data:", summary);
            console.log("Details Data:", details);
            console.log("Controller Data:", controllerData);

            // Compute door + reader summary from controllers API
            const controllerExtras = processDoorAndReaderData(controllerData);

            // Attach extras into the same structure updateSummary expects:
            // updateSummary expects an object with a .summary property, so keep that shape.
            if (!summary.summary) summary.summary = {};
            summary.summary.controllerExtras = controllerExtras;

            // Update UI and details
            updateSummary(summary);

            if (JSON.stringify(details) !== JSON.stringify(deviceDetailsCache)) {
                updateDetails(details);
                deviceDetailsCache = details; // Update cache
            }
            latestDetails = details;
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert("IP copied: " + text);
            })
            .catch(err => {
                console.error("Clipboard API failed", err);
                fallbackCopyTextToClipboard(text);
            });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    // Create a temporary textarea
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Prevent scrolling to bottom
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand("copy");
        if (successful) {
            alert("IP copied (fallback): " + text);
        } else {
            alert("Fallback copy failed");
        }
    } catch (err) {
        console.error("Fallback copy failed", err);
        alert("Unable to copy");
    }

    document.body.removeChild(textArea);
}

function pingAllDevices(regionName) {
    let details = latestDetails;
    if (!details || !details.details) return;

    fetch("http://localhost/api/devices/history")
        .then(response => response.json())
        .then(historyData => {
            let statusChanged = false;

            for (const [key, devices] of Object.entries(details.details)) {
                if (!Array.isArray(devices) || devices.length === 0) continue;

                devices.forEach((device) => {
                    const ip = device.ip_address || "N/A";
                    const card = document.querySelector(`[data-ip="${ip}"]`);
                    if (!card) return;

                    // Determine new status from history API if available.
                    const historyArray = historyData[ip];
                    let newStatus = (device.status || "offline").toLowerCase();
                    if (Array.isArray(historyArray) && historyArray.length > 0) {
                        const latestEntry = historyArray[historyArray.length - 1];
                        newStatus = (latestEntry.status || "offline").toLowerCase();
                    }
                    const currentStatus = card.dataset.status;

                    // Update UI: update the dot and the text.
                    const statusDot = card.querySelector(".status-dot");
                    const statusText = card.querySelector(".status-text");
                    if (statusDot) {
                        statusDot.style.backgroundColor = newStatus === "online" ? "green" : "red";
                        statusDot.classList.remove("online-dot", "offline-dot");
                        statusDot.classList.add(newStatus === "online" ? "online-dot" : "offline-dot");
                    }
                    else {
                        console.warn(`Status dot element not found for IP: ${ip}`);
                    }
                    if (statusText) {
                        const textColor = newStatus === "online" ? "green" : "red";

                        statusText.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
                        statusText.style.color = textColor;
                        statusText.style.backgroundColor = "transparent";
                        statusText.style.padding = "0";
                        statusText.style.borderRadius = "0";
                    } else {
                        console.warn(`Status text element not found for IP: ${ip}`);
                    }

                    if (newStatus !== currentStatus) {
                        statusChanged = true;
                        card.dataset.status = newStatus;
                    }
                });
            }

            setTimeout(() => {
                if (statusChanged) {
                    fetchData(regionName);
                }
            }, 5000);
        })
        .catch(error => {
            console.error("Error fetching device history:", error);
        });
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
    // ====== Door / Reader card updates (from controllers API) ======
    const extras = merged.controllerExtras || {};
    // If you used a single Door/Reader card with ids: doorReader-total, doorReader-online, doorReader-offline
    if (extras.doors) {
        const doorTotalEl = document.getElementById("doorReader-total");
        const doorOnlineEl = document.getElementById("doorReader-online");
        const doorOfflineEl = document.getElementById("doorReader-offline");
        if (doorTotalEl) doorTotalEl.textContent = extras.doors.total || 0;
        if (doorOnlineEl) doorOnlineEl.textContent = extras.doors.online || 0;
        if (doorOfflineEl) doorOfflineEl.textContent = extras.doors.offline || 0;
    } else {
        // fallback -> clear
        if (document.getElementById("doorReader-total")) document.getElementById("doorReader-total").textContent = 0;
        if (document.getElementById("doorReader-online")) document.getElementById("doorReader-online").textContent = 0;
        if (document.getElementById("doorReader-offline")) document.getElementById("doorReader-offline").textContent = 0;
    }

    if (extras.readers) {
        const rTotalEl = document.getElementById("reader-total-inline");
        const rOnlineEl = document.getElementById("reader-online-inline");
        const rOfflineEl = document.getElementById("reader-offline-inline");
        // NOTE: your HTML currently has the Door/Reader card as a single combined card.
        // If you want to surface readers separately on the same card, you can add spans with these IDs
        // inside the card or reuse the same doorReader-* elements. For now we only populate doorReader-*.
        // Keep these lines if you create these spans, otherwise they're safe (will be null).
        if (rTotalEl) rTotalEl.textContent = extras.readers.total || 0;
        if (rOnlineEl) rOnlineEl.textContent = extras.readers.online || 0;
        if (rOfflineEl) rOfflineEl.textContent = extras.readers.offline || 0;
    }
}

function loadControllersInDetails() {
    const detailsContainer = document.getElementById("device-details");
    const extraContainer = document.getElementById("details-container");

    detailsContainer.innerHTML = "<p>Loading controllers...</p>";
    extraContainer.innerHTML = "";

    fetch("http://localhost/api/controllers/status")
        .then(res => res.json())
        .then(data => {
            detailsContainer.innerHTML = "";
            if (!Array.isArray(data) || data.length === 0) {
                detailsContainer.innerHTML = "<p>No controllers found.</p>";
                return;
            }

            data.forEach(ctrl => {
                const card = document.createElement("div");
                card.className = "door-device-card";
                card.style.cssText = `
                    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                `;

                card.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                        <h3 style="font-size: 18px; font-weight: 700; margin: 0; color: #1f2937;">
                            ${ctrl.controllername || "Unknown Controller"}
                        </h3>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${ctrl.controllerStatus === "Online" ? "#10b981" : "#ef4444"};"></div>
                            <span style="font-size: 14px; color: ${ctrl.controllerStatus === "Online" ? "#059669" : "#dc2626"}; font-weight: 600;">
                                ${ctrl.controllerStatus}
                            </span>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 14px; color: #6b7280;">🌐</span>
                            <div>
                                <div style="font-size: 12px; color: #6b7280;">IP Address</div>
                                <div style="font-size: 14px; color: #374151; font-weight: 500;">${ctrl.IP_address || "N/A"}</div>
                            </div>
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 14px; color: #6b7280;">🏢</span>
                            <div>
                                <div style="font-size: 12px; color: #6b7280;">Location</div>
                                <div style="font-size: 14px; color: #374151; font-weight: 500;">${ctrl.City || "Unknown"}</div>
                            </div>
                        </div>
                    </div>
                `;

                // Hover effects
                card.addEventListener('mouseenter', function () {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                    this.style.borderColor = '#3b82f6';
                });

                card.addEventListener('mouseleave', function () {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    this.style.borderColor = '#e5e7eb';
                });

                // When a controller is clicked, show its doors + readers
                card.addEventListener("click", () => showDoorsReaders(ctrl));
                detailsContainer.appendChild(card);
            });
        })
        .catch(err => {
            console.error("Error loading controllers:", err);
            detailsContainer.innerHTML = "<p style='color:red;'>Failed to load controllers.</p>";
        });
}



