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