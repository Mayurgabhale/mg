http://localhost/api/controllers/status
this new api end point ok  
[
  {
    "controllername": "IN-PUN-2NDFLR-ISTAR PRO",
    "IP_address": "10.199.13.10",
    "Location": "APAC",
    "City": "Pune 2nd Floor",
    "controllerStatus": "Online",
    "Doors": [
      {
        "Door": "APAC_IN_PUN_2NDFLR_IDF ROOM_10:05:86 Restricted Door",
        "Reader": "in:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_2NDFLR_UPS/ELEC ROOM Restricted Door_10:05:FE",
        "Reader": "in:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR_10:05:4B",
        "Reader": "in:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR_10:05:4B",
        "Reader": "out:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_2NDFLR_LIFTLOBBY TO RECEPTION EMTRY DOOR_10:05:74",
        "Reader": "in:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_2NDFLR_LIFTLOBBY TO WORKSTATION DOOR_10:05:F0",
        "Reader": "",
        "status": "Online"
      }
    ]
  },
  {
    "controllername": "IN-PUN-PODIUM-ISTAR PRO-01",
    "IP_address": "10.199.8.20",
    "Location": "APAC",
    "City": "Pune Podium",
    "controllerStatus": "Online",
    "Doors": [
      {
        "Door": "APAC_IN-PUN-PODIUM-RED-RECREATION AREA FIRE EXIT 1-DOOR",
        "Reader": "",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_PODIUM_RED_IDF ROOM-02-Restricted Door",
        "Reader": "in:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN-PUN-PODIUM-MAIN PODIUM LEFT ENTRY-DOOR",
        "Reader": "in:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_PODIUM_MAIN PODIUM RIGHT ENTRY-DOOR",
        "Reader": "in:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN-PUN-PODIUM-RED-RECEPTION TO WS ENTRY 1-DOOR",
        "Reader": "",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_PODIUM_ST2 DOOR 1 (RED)",
        "Reader": "in:1",
        "status": "Online"
      },
      {
        "Door": "APAC_IN_PUN_PODIUM_RED_MAIN LIFT LOBBY ENTRY 1-DOOR",
        "Reader": "in:1",
        "status": "Online"

        in this whot to add this in totla devive
        
         Total Devices
Total
257
Online
226
Offline
31
Cameras
Total
133
Online
106
Offline
27
Archivers
Total
21
Online
21
Offline
0
Controllers
Total
71
Online
70
Offline
1
CCURE
Total
5
Online
5
Offline
0
Desktop
Total
17
Online
14
Offline
3
DB Server
Total
10
Online
10
Offline

in this code how ot user this 
        
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
function fetchData(regionName) {
    Promise.all([
        fetch(`${baseUrl}/summary/${regionName}`).then(res => res.json()),
        fetch(`${baseUrl}/details/${regionName}`).then(res => res.json())
    ])
        .then(([summary, details]) => {
            console.log("Summary Data:", summary);
            console.log("Details Data:", details);

            updateSummary(summary);

            if (JSON.stringify(details) !== JSON.stringify(deviceDetailsCache)) {
                updateDetails(details);
                deviceDetailsCache = details; // Update cache
            }
            // Cache details for pinging
            latestDetails = details;
        })
        .catch((error) => console.error("Error fetching data:", error));
}

/*
   Updated pingAllDevices:
   Instead of calling a non-existent ping endpoint, we now use the history API to fetch 
   device history and update each device’s status by updating the separate status dot and text.
*/

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




function updateSummary(data) {
    const summary = data.summary || {};

    // ✅ Always keep last known values if new data doesn’t have them
    window.lastSummary = window.lastSummary || {};

    // Merge new data into cached one (keeps old if missing)
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
    };

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
}
