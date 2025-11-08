know when i click on 
Door
Total
698
Online
698
Offline
0
Reader
Total
645
Online
645
Offline

door  i want to show controller detiasl
i means this 
 {
    "controllername": "IN-PUN-2NDFLR-ISTAR PRO",
    "IP_address": "10.199.13.10",
    "Location": "APAC",
    "City": "Pune 2nd Floor",
    "controllerStatus": "Online",
and and after cilc on this controller then i want to disply door and reader ok 
  i measn after click on this controller in popup i want to show door ok,,,
      can you do this  


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

    // Fetch real-time status if available.
    fetch("http://localhost:80/api/region/devices/status")
        .then((response) => response.json())
        .then((realTimeStatus) => {
            console.log("Live Status Data:", realTimeStatus);

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
</button>`
                            : ""
                        }
      </p>

      <p style="font-size: ;  font-family: Roboto; margin-bottom: 8px;">
          <strong style="color:rgb(8, 8, 8);"><i class="fas fa-network-wired" style="margin-right: 6px;"></i></strong>
          <span 
              class="device-ip" 
              style="font-weight:100; color: #00adb5; cursor: pointer; text-shadow: 0 0 1px rgba(0, 173, 181, 0.3);  font-family: Roboto;"
              onclick="copyToClipboard('${deviceIP}')"
              title="Click to copy IP"
          >
              ${deviceIP}
          </span>
      </p>

      <p style="font-size: ;  font-family: Roboto; margin-bottom: 6px;">
          <strong style="color: rgb(13, 13, 13);"><i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i></strong>
          <span style="font-size:; font-weight:100; color: rgb(8, 9, 9); margin-left: 12px;  font-family: Roboto; font-size: ;">${device.location || "N/A"}</span>
      </p>

      <p style="font-size:;  font-family: Roboto;>
          <strong style="color: rgb(215, 217, 222);"><i class="fas fa-city" style="margin-right: 5px;"></i></strong>
          <span style="font-weight:100; color: rgb(7, 7, 7); margin-left: 4px;  font-family: Roboto; font-size:;">${city}</span>
      </p>
  </div>
`);



                                this is html 
                                <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Device Dashboard</title>


    <!-- >>>>>>>>>>>>>>>>>>>> -->
    <!-- <link rel="icon" type="image/png" href="images/favicon-96x96.png"/> -->

    <!-- >>>>>>>>>>>>>>>>>>>> -->
    <link rel="icon" href="images/favicon.png" sizes="32x32" type="images/png">

    <link rel="stylesheet" href="styles.css" />
    <!-- <link rel="stylesheet" href="incss.css" /> -->

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">


    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

</head>

<body>

    <button id="scrollToTopBtn" title="Go to top">
        <i class="bi bi-chevron-double-up"></i>
    </button>

    <div id="region-title" class="dashboard-header">
        <div class="region-logo">
        </div>
        <div class="header-controls">
            <button class="theme-toggle" id="themeToggle">
                <i class="fas fa-moon"></i>
            </button>
        </div>
    </div>


    <section class="summary-section">

        <div class="summary">
            <div class="card">

                <h3><i class="fas fa-microchip icon-3d"></i> Total Devices</h3>
                <div class="card-status total">Total <span id="total-devices">0</span></div>
                <div class="card-status online">Online <span id="online-devices">0</span></div>
                <div class="card-status offline">Offline <span id="offline-devices">0</span></div>
            </div>

            <div class="card">
                <h3><i class="fas fa-video icon-3d"></i> Cameras</h3>
                <div class="card-status total">Total <span id="camera-total">0</span></div>
                <div class="card-status online">Online <span id="camera-online">0</span></div>
                <div class="card-status offline">Offline <span id="camera-offline">0</span></div>
            </div>



            <div class="card">
                <h3><i class="fas fa-database icon-3d"></i> Archivers</h3>

                <div class="card-status total">Total <span id="archiver-total">0</span></div>
                <div class="card-status online">Online <span id="archiver-online">0</span></div>
                <div class="card-status offline">Offline <span id="archiver-offline">0</span></div>
            </div>

            <div class="card">
                <h3><i class="fas fa-id-card icon-3d"></i> Controllers</h3>
                <div class="card-status total">Total <span id="controller-total">0</span></div>
                <div class="card-status online">Online <span id="controller-online">0</span></div>
                <div class="card-status offline">Offline <span id="controller-offline">0</span></div>
            </div>

            <div class="card">
                <h3><i class="fa-solid fa-door-closed icon-3d"></i>Door</h3>
                <div class="card-status total">Total <span id="doorReader-total">0</span></div>
                <div class="card-status online">Online <span id="doorReader-online">0</span></div>
                <div class="card-status offline">Offline <span id="doorReader-offline">0</span></div>
            </div>
            <div class="card">
                <h3><i class="fas fa-id-badge icon-3d"></i>Reader</h3>
                <div class="card-status total">Total <span id="reader-total-inline">0</span></div>
                <div class="card-status online">Online <span id="reader-online-inline">0</span></div>
                <div class="card-status offline">Offline <span id="dreader-offline-inline">0</span></div>
            </div>
           
            <div class="card">
                <h3><i class="fas fa-server icon-3d"></i>CCURE</h3>
                <div class="card-status total">Total <span id="server-total">0</span></div>
                <div class="card-status online">Online <span id="server-online">0</span></div>
                <div class="card-status offline">Offline <span id="server-offline">0</span></div>
            </div>

            <div class="card">
                <h3><i class="fas fa-desktop icon-3d"></i>Desktop</h3>
                <div class="card-status total">Total <span id="pc-total">0</span></div>
                <div class="card-status online">Online <span id="pc-online">0</span></div>
                <div class="card-status offline">Offline <span id="pc-offline">0</span></div>
            </div>

            <div class="card">
                <h3><i class="fa-etch fa-solid fa-database icon-3d"></i>DB Server</h3>
                <div class="card-status total">Total <span id="db-total">0</span></div>
                <div class="card-status online">Online <span id="db-online">0</span></div>
                <div class="card-status offline">Offline <span id="db-offline">0</span></div>
            </div>


            <!-- <i class="fa-solid fa-door-closed"></i> -->


        </div>
    </section>

    <div class="container">
        <!-- Sidebar -->
        <aside id="sidebar">
            <!-- <h2><i class="fas fa-globe"></i></h2> -->
            <button class="region-button" data-region="global"><i class="fas fa-globe"></i> Global</button>
            <button class="region-button" data-region="apac"><i class="fas fa-map-marker-alt"></i> APAC</button>
            <button class="region-button" data-region="emea"><i class="fas fa-map-marker-alt"></i> EMEA</button>
            <button class="region-button" data-region="laca"><i class="fas fa-map-marker-alt"></i> LACA</button>
            <button class="region-button" data-region="namer"><i class="fas fa-map-marker-alt"></i> NAMER</button>

            <button class="nav-button" onclick="location.href='trend.html'"><i class="fas fa-chart-line"></i> View Trend
                Analysis</button>
            <button class="nav-button" onclick="location.href='summary.html'"><i class="fas fa-table"></i> View Devices
                Summary</button>
            <button class="nav-button" onclick="location.href='controllers.html'"><i class="fas fa-table"></i> View
                Devices
                Door</button>

            <div id="countdown" class="countdown-timer">Loading Timer...</div>

            <div class="filter-buttons">
                <button id="filter-all" class="status-filter active" data-status="all"><i
                        class="fas fa-layer-group"></i> All Devices</button>
                <button id="filter-online" class="status-filter" data-status="online"><i class="fas fa-wifi"></i> Online
                    Devices</button>
                <button id="filter-offline" class="status-filter" data-status="offline"><i
                        class="fas fa-plug-circle-xmark"></i> Offline Devices</button>
            </div>

            <label for="device-filter">Filter by Device Type:</label>
            <select id="device-filter">
                <option value="all">All</option>
                <option value="cameras">Cameras</option>
                <option value="archivers">Archivers</option>
                <option value="controllers">Controllers</option>
                <option value="servers">CCURE</option>
                <option value="pcdetails">Desktop Details</option>
                <option value="dbdetails">DB Server</option>
            </select>






            <label for="vendorFilter" id="vendorFilterLabel">Filter by Camera:</label>
            <select id="vendorFilter">
                <option value="all">All camera</option>
            </select>

            <label for="city-filter">Filter by Location:</label>
            <select id="city-filter">
                <option value="all">All Cities</option>
            </select>

        </aside>


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

        </main>
    </div>
