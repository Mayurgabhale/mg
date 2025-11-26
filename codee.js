/* Updated script.js — enhanced controller->doors popup behavior
   - Keeps your existing features but fixes and hardens controller click -> door popup.
   - Adds accessible modal handling (ESC to close, click outside to close, focus trap basic).
   - Ensures close button exists even if HTML doesn't provide one.
   - Escapes door/controller text to avoid accidental HTML injection when using innerHTML.

   NOTE: This file replaces/overwrites your previous script.js. Keep a backup.
*/

const baseUrl = "http://localhost:80/api/regions";
let refreshInterval = 300000; // 5 minutes
let pingInterval = 60000; // 30 seconds
let countdownTime = refreshInterval / 1000; // Convert to seconds
let currentRegion = "global";
let deviceDetailsCache = {}; // Store previous details to prevent redundant updates
let latestDetails = null; // Cache the latest fetched details
let controllersCache = null; // cache controllers response to avoid repeated fetches

// ---------------- Utility helpers ----------------
function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return "";
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function createEl(tag, props = {}, children = []) {
    const el = document.createElement(tag);
    Object.keys(props).forEach(k => {
        if (k === 'className') el.className = props[k];
        else if (k === 'dataset') Object.assign(el.dataset, props[k]);
        else if (k === 'style') Object.assign(el.style, props[k]);
        else if (k.startsWith('on') && typeof props[k] === 'function') el.addEventListener(k.slice(2), props[k]);
        else el.setAttribute(k, props[k]);
    });
    children.forEach(c => {
        if (typeof c === 'string') el.appendChild(document.createTextNode(c));
        else if (c instanceof Node) el.appendChild(c);
    });
    return el;
}

// ---------------- DOMContentLoaded ----------------
document.addEventListener("DOMContentLoaded", () => {
    initOfflineChart && initOfflineChart();
    fetchData("global"); // Load initial data
    startAutoRefresh("global");

    // Attach Door click on the summary "door-card" if present
    const doorCard = document.getElementById("door-card");
    if (doorCard) {
        doorCard.style.cursor = "pointer";
        doorCard.title = "Click to view Controllers";
        doorCard.addEventListener("click", loadControllersInDetails);
    }

    document.querySelectorAll(".region-button").forEach((button) => {
        button.addEventListener("click", () => {
            const region = button.getAttribute("data-region");
            const titleElem = document.getElementById("region-title");
            if (titleElem) titleElem.textContent = `${region.toUpperCase()} Summary`;
            switchRegion(region);
        });
    });

    // Ensure modal close element exists for backward compatibility
    ensureDoorModalExists();

    // Close door modal close button
    const closeDoorBtn = document.getElementById("close-door-modal");
    if (closeDoorBtn) closeDoorBtn.addEventListener("click", closeDoorModal);

    // Accessibility: close modal with ESC
    document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape') closeDoorModal();
    });

    // existing summary card handlers (unchanged logic but moved here so that door-card attach runs once)
    attachSummaryCardFilterHandlers && attachSummaryCardFilterHandlers();
});

// ------------------- Existing helper functions -------------------
// (I kept your original helper functions intact so they work as before.)

function buildUrlFromHints(ip, cameraname = "", hyperlink = "") {
    ip = (ip || "").trim();
    hyperlink = (hyperlink || "").trim();

    if (hyperlink && /^https?:\/\//.test(hyperlink)) {
        return hyperlink;
    }

    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
        return `http://${ip}`;
    }

    const name = (cameraname || "").toLowerCase();
    if (/\bverkada\b/.test(name)) return `https://${ip}/#/login`;
    if (/\bflir\b/.test(name)) return `http://${ip}/control/userimage.html`;
    if (/\bhoneywell\b/.test(name)) return `http://${ip}/www/index.html`;
    if (/axis/.test(name)) return `http://${ip}/view/view.shtml`;

    return `http://${ip}`;
}

function openCamera(ip, name, hyperlink = "") {
    const url = buildUrlFromHints(ip, name, hyperlink);
    console.log("Opening URL:", url);
    window.open(url, "_blank", "noopener");
}

function switchRegion(region) {
    clearExistingIntervals();
    currentRegion = region;
    deviceDetailsCache = {};
    fetchData(region);
    startAutoRefresh(region);
}

function startAutoRefresh(regionName) {
    fetchData(regionName);
    clearExistingIntervals();

    window.countdownTimer = setInterval(() => {
        const el = document.getElementById("countdown");
        if (el) el.innerText = `Refreshing in ${countdownTime} seconds`;
        countdownTime--;
        if (countdownTime < 0) countdownTime = refreshInterval / 1000;
    }, 1000);

    window.refreshTimer = setInterval(() => {
        fetchData(regionName);
        countdownTime = refreshInterval / 1000;
    }, refreshInterval);

    window.pingTimer = setInterval(() => {
        pingAllDevices(regionName);
    }, pingInterval);
}

function clearExistingIntervals() {
    clearInterval(window.countdownTimer);
    clearInterval(window.refreshTimer);
    clearInterval(window.pingTimer);
}

function fetchData(regionName) {
    Promise.all([
        fetch(`${baseUrl}/summary/${regionName}`).then(res => res.json()),
        fetch(`${baseUrl}/details/${regionName}`).then(res => res.json()),
        fetch(`http://localhost/api/controllers/status`).then(res => res.json())
    ])
        .then(([summary, details, controllerData]) => {
            console.log("Summary Data:", summary);
            console.log("Details Data:", details);
            console.log("Controller Data:", controllerData);

            const controllerExtras = processDoorAndReaderData(controllerData);

            if (!summary.summary) summary.summary = {};
            summary.summary.controllerExtras = controllerExtras;

            updateSummary(summary);

            if (typeof window.updateMapData === 'function') {
                window.updateMapData(summary, details);
            }

            if (JSON.stringify(details) !== JSON.stringify(deviceDetailsCache)) {
                updateDetails(details);
                deviceDetailsCache = details;
            }
            latestDetails = details;

            // Update controllers cache for the controller popup so we don't refetch unnecessarily
            controllersCache = Array.isArray(controllerData) ? controllerData : null;
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
    const textArea = document.createElement("textarea");
    textArea.value = text;
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

                    const historyArray = historyData[ip];
                    let newStatus = (device.status || "offline").toLowerCase();
                    if (Array.isArray(historyArray) && historyArray.length > 0) {
                        const latestEntry = historyArray[historyArray.length - 1];
                        newStatus = (latestEntry.status || "offline").toLowerCase();
                    }
                    const currentStatus = card.dataset.status;

                    const statusDot = card.querySelector(".status-dot");
                    const statusText = card.querySelector(".status-text");
                    if (statusDot) {
                        statusDot.style.backgroundColor = newStatus === "online" ? "green" : "red";
                        statusDot.classList.remove("online-dot", "offline-dot");
                        statusDot.classList.add(newStatus === "online" ? "online-dot" : "offline-dot");
                    }
                    if (statusText) {
                        const textColor = newStatus === "online" ? "green" : "red";

                        statusText.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
                        statusText.style.color = textColor;
                        statusText.style.backgroundColor = "transparent";
                        statusText.style.padding = "0";
                        statusText.style.borderRadius = "0";
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

function processDoorAndReaderData(controllerData) {
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
            doorsTotal++;
            if ((door.status || "").toLowerCase() === "online") doorsOnline++;

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

// ---------------- Summary & Details keep unchanged ----------------
function updateSummary(data) {
    const summary = data.summary || {};
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
        controllerExtras: { ...window.lastSummary.controllerExtras, ...summary.controllerExtras }
    };

    const doors = merged.controllerExtras?.doors || { total: 0, online: 0, offline: 0 };

    merged.totalDevices =
        (merged.cameras?.total || 0) +
        (merged.archivers?.total || 0) +
        (merged.controllers?.total || 0) +
        (merged.servers?.total || 0) +
        (merged.pcdetails?.total || 0) +
        (merged.dbdetails?.total || 0) +
        doors.total;

    merged.totalOnlineDevices =
        (merged.cameras?.online || 0) +
        (merged.archivers?.online || 0) +
        (merged.controllers?.online || 0) +
        (merged.servers?.online || 0) +
        (merged.pcdetails?.online || 0) +
        (merged.dbdetails?.online || 0) +
        doors.online;

    merged.totalOfflineDevices = merged.totalDevices - merged.totalOnlineDevices;
    window.lastSummary = merged;

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

    document.getElementById("pc-total").textContent = merged.pcdetails?.total || 0;
    document.getElementById("pc-online").textContent = merged.pcdetails?.online || 0;
    document.getElementById("pc-offline").textContent = merged.pcdetails?.offline || 0;

    document.getElementById("db-total").textContent = merged.dbdetails?.total || 0;
    document.getElementById("db-online").textContent = merged.dbdetails?.online || 0;
    document.getElementById("db-offline").textContent = merged.dbdetails?.offline || 0;

    const extras = merged.controllerExtras || {};
    if (extras.doors) {
        const doorTotalEl = document.getElementById("doorReader-total");
        const doorOnlineEl = document.getElementById("doorReader-online");
        const doorOfflineEl = document.getElementById("doorReader-offline");
        if (doorTotalEl) doorTotalEl.textContent = extras.doors.total || 0;
        if (doorOnlineEl) doorOnlineEl.textContent = extras.doors.online || 0;
        if (doorOfflineEl) doorOfflineEl.textContent = extras.doors.offline || 0;
    } else {
        if (document.getElementById("doorReader-total")) document.getElementById("doorReader-total").textContent = 0;
        if (document.getElementById("doorReader-online")) document.getElementById("doorReader-online").textContent = 0;
        if (document.getElementById("doorReader-offline")) document.getElementById("doorReader-offline").textContent = 0;
    }

    if (extras.readers) {
        const rTotalEl = document.getElementById("reader-total-inline");
        const rOnlineEl = document.getElementById("reader-online-inline");
        const rOfflineEl = document.getElementById("reader-offline-inline");
        if (rTotalEl) rTotalEl.textContent = extras.readers.total || 0;
        if (rOnlineEl) rOnlineEl.textContent = extras.readers.online || 0;
        if (rOfflineEl) rOfflineEl.textContent = extras.readers.offline || 0;
    }
}

// ----------------- Controller list & popup (ENHANCED) -----------------

// Ensure the modal DOM exists (in case index.html didn't include it)
function ensureDoorModalExists() {
    if (document.getElementById('door-modal')) return;

    const modal = createEl('div', { id: 'door-modal', className: 'door-modal', style: { display: 'none', position: 'fixed', inset: 0, 'alignItems': 'center', 'justifyContent': 'center', 'backgroundColor': 'rgba(0,0,0,0.45)', zIndex: 9999 } });
    const dialog = createEl('div', { id: 'door-modal-content', className: 'door-modal-content', role: 'dialog', 'aria-modal': 'true', style: { 'maxWidth': '920px', width: '92%', background: '#fff', padding: '20px', borderRadius: '12px', maxHeight: '80vh', overflowY: 'auto', boxSizing: 'border-box' } });

    const closeBtn = createEl('button', { id: 'close-door-modal', className: 'close-door-modal', title: 'Close', style: { position: 'absolute', right: '18px', top: '12px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '20px' } }, ['✕']);

    // position close button inside dialog
    dialog.appendChild(closeBtn);
    modal.appendChild(dialog);
    document.body.appendChild(modal);

    // click outside to close
    modal.addEventListener('click', (ev) => {
        if (ev.target === modal) closeDoorModal();
    });
}

function loadControllersInDetails() {
    const detailsContainer = document.getElementById("device-details");
    const extraContainer = document.getElementById("details-container");

    if (!detailsContainer) return;

    detailsContainer.innerHTML = "<p>Loading controllers...</p>";
    extraContainer && (extraContainer.innerHTML = "");

    // Use cached controllers if available
    const fetchPromise = controllersCache ? Promise.resolve(controllersCache) : fetch("http://localhost/api/controllers/status").then(res => res.json());

    fetchPromise.then(data => {
        controllersCache = Array.isArray(data) ? data : controllersCache;

        detailsContainer.innerHTML = "";
        if (!Array.isArray(data) || data.length === 0) {
            detailsContainer.innerHTML = "<p>No controllers found.</p>";
            return;
        }

        renderControllerCards(detailsContainer, data);
    }).catch(err => {
        console.error("Error loading controllers:", err);
        if (detailsContainer) detailsContainer.innerHTML = "<p style='color:red;'>Failed to load controllers.</p>";
    });
}

function renderControllerCards(container, controllers) {
    container.innerHTML = '';

    controllers.forEach(ctrl => {
        const card = createEl('div', { className: 'door-device-card', style: {
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', marginBottom: '16px', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }});

        const statusColor = (ctrl.controllerStatus || '').toLowerCase() === 'online' ? '#10b981' : '#ef4444';
        const statusTextColor = (ctrl.controllerStatus ||