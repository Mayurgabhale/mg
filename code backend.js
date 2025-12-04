Controller Details
🔒
IN-PUN-2NDFLR-ISTAR PRO
10.199.13.10 • Pune 2nd Floor

Doors
6
Readers
0
Export (Excel)
Doors & Readers
Online
🚪
undefined
Reader: N/A
Online
🚪
undefined
Reader: N/A
Online
🚪
undefined
Reader: N/A
Online
🚪
undefined
Reader: N/A
Online
🚪
undefined
Reader: N/A
Online
🚪
undefined
Reader: N/A
Online


in this we getting one issue is the in this readers count not show and 
Doors & Readers is undefined ok ho to slove this issue ok read the excle servecie  code and slov this isseu ok 
Online
🚪
undefined
Reader: N/A

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

/*
   Updated updateDetails:
   Each device card is built with separate elements for the status dot and status text.
   This ensures that later updates from pingAllDevices can reliably find and update them.
*/




// 📝📝📝📝📝📝📝📝📝



/* loadControllersInDetails (mostly unchanged) */
function loadControllersInDetails() {
    const detailsContainer = document.getElementById("device-details");
    const extraContainer = document.getElementById("details-container");

    detailsContainer.innerHTML = "<p>Loading controllers...</p>";
    extraContainer.innerHTML = "";

    // Use cached controllers if available
    if (Array.isArray(window.controllerDataCached) && window.controllerDataCached.length > 0) {
        renderControllersInDetails(window.controllerDataCached, detailsContainer);
        return;
    }

    fetch("http://localhost/api/controllers/status")
    // fetch("http://10.138.161.4:3000/api/controllers/status")
        .then(res => res.json())
        .then(data => {
            window.controllerDataCached = Array.isArray(data) ? data : null; // cache
            renderControllersInDetails(data, detailsContainer);
        })
        .catch(err => {
            console.error("Error loading controllers:", err);
            detailsContainer.innerHTML = "<p style='color:red;'>Failed to load controllers.</p>";
        });
}


function renderControllersInDetails(data, detailsContainer) {
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
}


// --- REPLACE showDoorsReaders WITH THIS UPDATED VERSION ---
// Adds an "Export (Excel)" button which downloads a CSV file of the doors/readers.
function showDoorsReaders(controller) {
    if (!controller) return;

    // --- counts for header ---
    const totalDoors = Array.isArray(controller.Doors) ? controller.Doors.length : 0;
    const totalReaders = Array.isArray(controller.Doors)
        ? controller.Doors.reduce((acc, d) => acc + (d.Reader && d.Reader.toString().trim() ? 1 : 0), 0)
        : 0;

    // Export button (id used to attach handler after modal is opened)
    const exportButtonHtml = `
      <button id="export-doors-btn"
        style="background:#0b74ff; color:white; border:none; padding:8px 12px; border-radius:8px; cursor:pointer; font-weight:600;">
        Export (Excel)
      </button>
    `;

    let html = `
    <div style="margin-bottom:25px;">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:15px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="
            width:50px;
            height:50px;
            border-radius:12px;
            background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display:flex;
            align-items:center;
            justify-content:center;
            color:white;
            font-size:20px;
          ">🔒</div>
          <div>
            <h3 style="margin:0 0 4px 0; color:#1e293b; font-size:1.3rem;">${controller.controllername}</h3>
            <p style="margin:0; color:#64748b; font-size:14px;">${controller.IP_address || "N/A"} • ${controller.City || "Unknown"}</p>
          </div>
        </div>

        <!-- stats: total doors & readers + export -->
        <div style="display:flex; gap:12px; align-items:center;">
          <div style="text-align:center; background:#f8fafc; padding:8px 12px; border-radius:10px; border:1px solid #eef2ff;">
            <div style="font-size:12px; color:#64748b; margin-bottom:4px;">Doors</div>
            <div style="font-weight:700; color:#1f2937; font-size:16px;">${totalDoors}</div>
          </div>
          <div style="text-align:center; background:#f8fafc; padding:8px 12px; border-radius:10px; border:1px solid #eef2ff;">
            <div style="font-size:12px; color:#64748b; margin-bottom:4px;">Readers</div>
            <div style="font-weight:700; color:#1f2937; font-size:16px;">${totalReaders}</div>
          </div>

          ${exportButtonHtml}
        </div>
      </div>
    </div>

    <div style="margin:25px 0 15px 0; display:flex; align-items:center; justify-content:space-between;">
      <h4 style="margin:0; color:#374151; font-size:1.1rem;">Doors & Readers</h4>
      <span class="status-badge ${controller.controllerStatus === "Online" ? "status-online" : "status-offline"}">
        ${controller.controllerStatus}
      </span>
    </div>
  `;

    if (!controller.Doors || controller.Doors.length === 0) {
        html += `
      <div style="text-align:center; padding:40px 20px; background:#f8fafc; border-radius:12px;">
        <div style="font-size:48px; margin-bottom:15px;">🚪</div>
        <h4 style="color:#475569; margin-bottom:8px;">No Doors Found</h4>
        <p style="color:#64748b; margin:0;">This controller doesn't have any doors configured.</p>
      </div>
    `;
    } else {
        html += `<div style="display:flex; flex-direction:column; gap:12px;">`;

        controller.Doors.forEach((door, index) => {
            const doorStatusClass = door.status === "Online" ? "status-online" : "status-offline";

            html += `
        <div class="door-item" style="animation-delay: ${index * 0.1}s;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="
                width:36px;
                height:36px;
                border-radius:8px;
                background:#f1f5f9;
                display:flex;
                align-items:center;
                justify-content:center;
                color:#475569;
                font-size:16px;
              ">🚪</div>
              <div>
                <div style="font-weight:600; color:#1e293b;">${door.Door}</div>
                <div style="font-size:13px; color:#64748b;">Reader: ${door.Reader || "N/A"}</div>
              </div>
            </div>
            <span class="status-badge ${doorStatusClass}" style="font-size:0.8rem;">
              ${door.status}
            </span>
          </div>
        </div>
      `;
        });

        html += `</div>`;
    }

    // Add modal close button interaction
    const closeBtn = document.getElementById("close-door-modal");
    if (closeBtn) {
        closeBtn.addEventListener("mouseenter", function () {
            this.style.transform = "scale(1.1)";
        });
        closeBtn.addEventListener("mouseleave", function () {
            this.style.transform = "scale(1)";
        });
    }

    openDoorModal(html);

    // --- attach export handler after modal content is inserted ---
    const exportBtn = document.getElementById("export-doors-btn");
    if (exportBtn) {
        // remove previous listener if any (prevent duplicates on repeated opens)
        exportBtn.replaceWith(exportBtn.cloneNode(true));
        const newExportBtn = document.getElementById("export-doors-btn");
        newExportBtn.addEventListener("click", () => exportDoorsToCsv(controller));
    }
}

// --- helper: safely escape CSV values ---
function _escapeCsvValue(val) {
    if (val == null) return "";
    const s = String(val);
    // if contains double quotes, escape them by doubling
    const escaped = s.replace(/"/g, '""');
    // If contains comma, newline or quote wrap in quotes
    if (/[",\n]/.test(s)) {
        return `"${escaped}"`;
    }
    return escaped;
}

// --- helper: export controller doors to CSV and trigger download ---
function exportDoorsToCsv(controller) {
    if (!controller) return;

    const filenameBase = (controller.controllername || "controller").replace(/[^\w\-]/g, "_");
    const filename = `${filenameBase}_doors.csv`;

    const rows = [];

    // Header info
    rows.push([`Controller: ${controller.controllername || ""}`]);
    rows.push([`IP: ${controller.IP_address || ""}`, `City: ${controller.City || ""}`]);
    const totalDoors = Array.isArray(controller.Doors) ? controller.Doors.length : 0;
    const totalReaders = Array.isArray(controller.Doors)
        ? controller.Doors.reduce((acc, d) => acc + (d.Reader && d.Reader.toString().trim() ? 1 : 0), 0)
        : 0;
    rows.push([`Total Doors: ${totalDoors}`, `Total Readers: ${totalReaders}`]);
    rows.push([]); // blank row

    // Column headers
    rows.push(["Door", "Reader", "Status"]);

    // Door rows
    if (Array.isArray(controller.Doors)) {
        controller.Doors.forEach((d) => {
            rows.push([d.Door || "", d.Reader || "", d.status || ""]);
        });
    }

    // convert rows to CSV string
    const csvContent = rows.map(r => r.map(_escapeCsvValue).join(",")).join("\r\n");

    // create blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
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
        if (type.includes("dbdetails")) r
