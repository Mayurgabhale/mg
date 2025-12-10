// =========================
// script.js — updated (centered device-themed saving loader)
// =========================

/* ========= Utility ========= */
function $id(id) { return document.getElementById(id); }
function q(sel) { return document.querySelector(sel); }

/* ========= Create centered device-themed loader + CSS (auto-insert) ========= */
(function createCenteredLoader() {
    // Only create once
    if ($id("save-loader-center")) return;

    // CSS for centered loader (device-themed)
    const css = `
    /* Centered device-themed saving overlay */
    .device-save-overlay {
      display: none;               /* hidden initially */
      position: fixed;
      inset: 0;                    /* cover full viewport */
      background: rgba(2,8,12,0.45);
      backdrop-filter: blur(4px);
      z-index: 2147483646;         /* extremely high */
      align-items: center;
      justify-content: center;
    }
    .device-save-card {
      display: flex;
      gap: 16px;
      align-items: center;
      background: linear-gradient(135deg, #07121a 0%, #081921 100%);
      border: 1px solid rgba(0,200,255,0.18);
      box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 30px rgba(0,200,255,0.06);
      color: #bff7ff;
      padding: 20px 26px;
      border-radius: 12px;
      min-width: 320px;
      max-width: 90%;
      text-align: center;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    }
    .device-save-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: grid;
      place-items: center;
      background: radial-gradient(circle at 30% 30%, rgba(0,220,255,0.12), rgba(0,200,255,0.02));
      box-shadow: 0 0 18px rgba(0,200,255,0.12);
      flex: 0 0 56px;
    }
    .device-save-ring {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 4px solid rgba(0,200,255,0.15);
      border-top-color: rgba(0,200,255,0.9);
      animation: device-save-spin 0.9s linear infinite;
      box-shadow: 0 0 8px rgba(0,200,255,0.2);
    }
    @keyframes device-save-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .device-save-text {
      text-align: left;
    }
    .device-save-text h4 {
      margin: 0 0 4px 0;
      font-size: 18px;
      color: #e6ffff;
      letter-spacing: 0.2px;
    }
    .device-save-text p {
      margin: 0;
      font-size: 13px;
      color: #9feeff;
      opacity: 0.95;
    }
    /* small variants for types */
    .device-save-card.type-camera { border-color: rgba(0,200,255,0.28); box-shadow: 0 10px 30px rgba(0,100,140,0.25); }
    .device-save-card.type-server { border-color: rgba(80,255,120,0.28); box-shadow: 0 10px 30px rgba(24,140,40,0.18); }
    .device-save-card.type-pc { border-color: rgba(255,170,70,0.28); box-shadow: 0 10px 30px rgba(120,70,0,0.18); }
    .device-save-card.type-controller { border-color: rgba(255,215,90,0.28); box-shadow: 0 10px 30px rgba(140,110,20,0.18); }
    .device-save-card.type-db { border-color: rgba(180,120,255,0.28); box-shadow: 0 10px 30px rgba(80,40,140,0.12); }
    `;

    // inject styles
    const style = document.createElement("style");
    style.setAttribute("data-generated", "save-loader-styles");
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // create overlay DOM
    const overlay = document.createElement("div");
    overlay.id = "save-loader-center";
    overlay.className = "device-save-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.setAttribute("role", "status");
    overlay.innerHTML = `
      <div id="device-save-card" class="device-save-card type-camera" aria-live="polite">
        <div class="device-save-icon" aria-hidden="true">
          <div class="device-save-ring"></div>
        </div>
        <div class="device-save-text">
          <h4>Saving…</h4>
          <p>Please wait — applying changes to the device.</p>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
})();

/* ========= Core modal & form logic (kept & improved) ========= */

/* --- helpers --- */
function showLoaderForType(uiType) {
    const overlay = $id("save-loader-center");
    const card = $id("device-save-card");
    if (!overlay || !card) return;
    // map uiType to class
    let cls = "type-camera";
    switch ((uiType || "").toLowerCase()) {
        case "camera": cls = "type-camera"; break;
        case "server": cls = "type-server"; break;
        case "pcdetails": cls = "type-pc"; break;
        case "controller": cls = "type-controller"; break;
        case "dbdetails": cls = "type-db"; break;
        case "archiver": cls = "type-camera"; break;
        default: cls = "type-camera";
    }
    // set class
    card.className = "device-save-card " + cls;
    overlay.style.display = "flex";
    overlay.setAttribute("aria-hidden", "false");
}

function hideLoader() {
    const overlay = $id("save-loader-center");
    if (!overlay) return;
    overlay.style.display = "none";
    overlay.setAttribute("aria-hidden", "true");
}

/* --- Modal functions (cleaned & merged) --- */

function showDeviceModal(mode = "add", deviceObj = null, userName = "") {
    const modal = $id("device-modal");
    const title = $id("device-modal-title");
    const deleteBtn = $id("device-delete-btn");

    // Always hide loader when opening modal (prevents leftover visible state)
    hideLoader();

    // Reset form + state
    const form = $id("device-form");
    if (form) form.reset();
    if ($id("door-reader-body")) $id("door-reader-body").innerHTML = "";
    if ($id("device-old-ip")) $id("device-old-ip").value = "";

    const currentUserName = userName || "";

    if (mode === "add") {
        if (title) title.textContent = "Add Device";
        if (deleteBtn) deleteBtn.style.display = "none";
        if ($id("device-type")) $id("device-type").disabled = false;
        if ($id("device-type")) $id("device-type").value = "camera";

        if ($id("added-by-box")) $id("added-by-box").style.display = "block";
        if ($id("updated-by-box")) $id("updated-by-box").style.display = "none";

        if ($id("device-added-by")) {
            $id("device-added-by").value = currentUserName;
            $id("device-added-by").readOnly = false;
        }
    } else if (mode === "edit" && deviceObj) {
        if (title) title.textContent = "Edit Device";
        if (deleteBtn) deleteBtn.style.display = "inline-block";
        if ($id("device-type")) $id("device-type").disabled = true;

        // Fill fields
        if ($id("device-type")) $id("device-type").value = deviceObj._type_for_ui || "camera";
        if ((deviceObj._type_for_ui || "").toLowerCase() === "dbdetails" && $id("device-type")) $id("device-type").value = "dbdetails";

        if ($id("device-name")) $id("device-name").value =
            deviceObj.cameraname || deviceObj.controllername || deviceObj.archivername || deviceObj.servername || deviceObj.hostname || "";
        if ($id("device-ip")) $id("device-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";
        if ($id("device-location")) $id("device-location").value = deviceObj.Location || deviceObj.location || "";
        if ($id("device-city")) $id("device-city").value = deviceObj.City || deviceObj.city || "";
        if ($id("form-device-details")) $id("form-device-details").value = deviceObj.device_details || "";
        if ($id("device-hyperlink")) $id("device-hyperlink").value = deviceObj.hyperlink || "";
        if ($id("device-remark")) $id("device-remark").value = deviceObj.remark || "";
        if ($id("device-old-ip")) $id("device-old-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";
        if ($id("Host-Name")) $id("Host-Name").value = deviceObj.hostname || "";
        if ($id("PC-Name")) $id("PC-Name").value = deviceObj.pc_name || "";
        if ($id("db-hostname")) $id("db-hostname").value = deviceObj.hostname || "";
        if ($id("db-application")) $id("db-application").value = deviceObj.application || "";
        if ($id("db-windows-server")) $id("db-windows-server").value = deviceObj.windows_server || "";

        // Controller doors
        if (deviceObj.Doors && Array.isArray(deviceObj.Doors)) {
            if ($id("device-type")) $id("device-type").value = "controller";
            updateFormFields();
            deviceObj.Doors.forEach(d => addDoorRow(d.door || d.Door, d.reader || ""));
        }

        // Added/Updated By boxes
        if ($id("added-by-box")) $id("added-by-box").style.display = "block";
        if ($id("updated-by-box")) $id("updated-by-box").style.display = "block";

        if ($id("device-added-by")) {
            $id("device-added-by").value =
                deviceObj.added_by ??
                deviceObj.AddedBy ??
                deviceObj.addedBy ??
                deviceObj.addedby ??
                "Unknown";
            $id("device-added-by").readOnly = true;
        }
        if ($id("device-updated-by")) {
            $id("device-updated-by").value =
                deviceObj.updated_by ??
                deviceObj.UpdatedBy ??
                deviceObj.updatedBy ??
                deviceObj.updatedby ??
                "";
            $id("device-updated-by").readOnly = false;
        }
    }

    // Apply visibility & dynamic behavior
    updateFormFields();

    // Show modal
    if (modal) modal.style.display = "flex";
}

function hideDeviceModal() {
    const modal = $id("device-modal");
    if (modal) modal.style.display = "none";
    hideLoader(); // also hide loader defensively
}

/* ========= Form UI helpers ========= */

function updateFormFields() {
    const typeEl = $id("device-type");
    const type = typeEl ? typeEl.value : "camera";

    const nameField = $id("name-field");
    const cameraFields = $id("camera-fields");
    const pcFields = $id("pc-fields");
    const doorSec = $id("door-reader-container");
    const dbFields = $id("db-fields");

    if (nameField) nameField.style.display = "block";
    if (cameraFields) cameraFields.style.display = "none";
    if (pcFields) pcFields.style.display = "none";
    if (doorSec) doorSec.style.display = "none";
    if (dbFields) dbFields.style.display = "none";

    if (type === "camera" && cameraFields) cameraFields.style.display = "block";
    if (type === "controller" && doorSec) doorSec.style.display = "block";
    if (type === "pcdetails") {
        if (nameField) nameField.style.display = "none";
        if (pcFields) pcFields.style.display = "block";
    }
    if (type === "dbdetails") {
        if (nameField) nameField.style.display = "none";
        if (pcFields) pcFields.style.display = "none";
        if (cameraFields) cameraFields.style.display = "none";
        if (doorSec) doorSec.style.display = "none";
        if (dbFields) dbFields.style.display = "block";
    }
}

// ensure change listener attached once
if ($id("device-type")) {
    $id("device-type").addEventListener("change", updateFormFields);
}

/* ========= Door rows ========= */
function addDoorRow(door = "", reader = "") {
    const tbody = $id("door-reader-body");
    if (!tbody) return;
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" class="door-input" value="${escapeHtml(door)}" placeholder="Door Name"></td>
        <td><input type="text" class="reader-input" value="${escapeHtml(reader)}" placeholder="e.g in:1, out:1"></td>
        <td><button type="button" class="remove-door-row">X</button></td>
    `;
    tbody.appendChild(row);
    row.querySelector(".remove-door-row").addEventListener("click", () => row.remove());
}
if ($id("add-door-row")) {
    $id("add-door-row").addEventListener("click", () => addDoorRow());
}
function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* ========= Mapping & conversion ========= */
function mapUITypeToBackend(type) {
    switch ((type || "").toLowerCase()) {
        case "camera": return "cameras";
        case "controller": return "controllers";
        case "archiver": return "archivers";
        case "server": return "servers";
        case "pcdetails": return "pcDetails";
        case "dbdetails": return "dbdetails";
        default: return "cameras";
    }
}

function convertToBackendFields(type, body) {
    const mapped = { ...body };
    switch (type) {
        case "cameras": mapped.cameraname = body.name; break;
        case "controllers": mapped.controllername = body.name; break;
        case "archivers": mapped.archivername = body.name; break;
        case "servers": mapped.servername = body.name; break;
        case "pc_details":
            mapped.hostname = body.hostname;
            mapped.pc_name = body.pc_name;
            break;
        case "dbdetails":
            mapped.db_hostname = body.db_hostname;
            mapped.application = body.application;
            mapped.windows_server = body.windows_server;
            break;
    }
    delete mapped.name;
    return mapped;
}

/* ========= Validation ========= */

/* Remove any static 'required' attributes on conditional inputs (defensive) */
(function removeStaticRequiredAttrs() {
    try {
        document.querySelectorAll("#pc-fields input, #db-fields input, #camera-fields input, #added-by-box input, #updated-by-box input")
            .forEach(i => i.removeAttribute("required"));
    } catch (e) { /* ignore */ }
})();

function validateRequiredFields() {
    const type = $id("device-type") ? $id("device-type").value : "camera";

    // base required
    let required = [
        { id: "device-name", label: "Device Name" },
        { id: "device-ip", label: "IP Address" },
        { id: "device-location", label: "Location" },
        { id: "device-city", label: "City" }
    ];

    // added/updated by if visible
    if ($id("added-by-box") && $id("added-by-box").style.display !== "none") {
        required.push({ id: "device-added-by", label: "Added By" });
    }
    if ($id("updated-by-box") && $id("updated-by-box").style.display !== "none") {
        required.push({ id: "device-updated-by", label: "Updated By" });
    }

    // camera details
    if (type === "camera") required.push({ id: "form-device-details", label: "Camera Details" });

    // pcdetails overrides
    if (type === "pcdetails") {
        required = [
            { id: "Host-Name", label: "Host Name" },
            { id: "PC-Name", label: "PC Name" }
        ];
        if ($id("added-by-box") && $id("added-by-box").style.display !== "none") required.push({ id: "device-added-by", label: "Added By" });
        if ($id("updated-by-box") && $id("updated-by-box").style.display !== "none") required.push({ id: "device-updated-by", label: "Updated By" });
    }

    // dbdetails overrides
    if (type === "dbdetails") {
        required = [
            { id: "db-hostname", label: "DB Host Name" },
            { id: "db-application", label: "DB Application" },
            { id: "db-windows-server", label: "Windows Server Version" }
        ];
        if ($id("added-by-box") && $id("added-by-box").style.display !== "none") required.push({ id: "device-added-by", label: "Added By" });
        if ($id("updated-by-box") && $id("updated-by-box").style.display !== "none") required.push({ id: "device-updated-by", label: "Updated By" });
    }

    // validate first missing visible field
    for (const field of required) {
        const el = $id(field.id);
        if (!el) continue;
        if (el.offsetParent !== null) {
            if (el.value.trim() === "") {
                el.style.border = "2px solid #ff6b6b";
                alert(`Please enter ${field.label}`);
                el.focus();
                return false;
            } else {
                el.style.border = "";
            }
        }
    }
    return true;
}

/* ========= Collect & Submit ========= */
function collectBodyForSave() {
    return {
        name: ($id("device-name") ? $id("device-name").value : "").trim(),
        ip_address: ($id("device-ip") ? $id("device-ip").value : "").trim(),
        location: ($id("device-location") ? $id("device-location").value : "").trim(),
        city: ($id("device-city") ? $id("device-city").value : "").trim(),
        device_details: ($id("form-device-details") ? $id("form-device-details").value : "").trim(),
        hyperlink: ($id("device-hyperlink") ? $id("device-hyperlink").value : "").trim(),
        remark: ($id("device-remark") ? $id("device-remark").value : "").trim(),
        hostname: ($id("Host-Name") ? $id("Host-Name").value : "").trim(),
        pc_name: ($id("PC-Name") ? $id("PC-Name").value : "").trim(),
        added_by: ($id("device-added-by") ? $id("device-added-by").value : "").trim(),
        updated_by: ($id("device-updated-by") ? $id("device-updated-by").value : "").trim(),
        db_hostname: ($id("db-hostname") ? $id("db-hostname").value : "").trim(),
        application: ($id("db-application") ? $id("db-application").value : "").trim(),
        windows_server: ($id("db-windows-server") ? $id("db-windows-server").value : "").trim()
    };
}

/* Attach a single submit handler (prevents double attach) */
(function attachFormSubmit() {
    const form = $id("device-form");
    if (!form) return;
    if (form.dataset.listenerAttached) return;
    form.dataset.listenerAttached = "1";

    const saveBtn = $id("device-save-btn");

    form.addEventListener("submit", async function (ev) {
        ev.preventDefault();

        if (form.dataset.saving === "1") return;

        // validation
        if (!validateRequiredFields()) return;

        // show loader (center) and style based on type
        const uiType = ($id("device-type") ? $id("device-type").value : "camera");
        showLoaderForType(uiType);

        // disable UI
        form.dataset.saving = "1";
        if (saveBtn) saveBtn.disabled = true;

        const oldIp = ($id("device-old-ip") ? $id("device-old-ip").value : "").trim();
        const backendType = mapUITypeToBackend(uiType);

        // build body
        let body = collectBodyForSave();
        body = convertToBackendFields(backendType, body);

        if (backendType === "controllers") {
            const doors = [];
            document.querySelectorAll("#door-reader-body tr").forEach(tr => {
                const doorInput = tr.querySelector(".door-input");
                const readerInput = tr.querySelector(".reader-input");
                doors.push({
                    door: doorInput ? doorInput.value.trim() : "",
                    reader: readerInput ? readerInput.value.trim() : ""
                });
            });
            body.Doors = doors;
        }

        try {
            let resp;
            if (!oldIp) {
                resp = await fetch("http://localhost/api/devices", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: backendType, device: body })
                });
            } else {
                resp = await fetch(`http://localhost/api/devices/${encodeURIComponent(oldIp)}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });
            }

            if (!resp.ok) {
                let text = "";
                try { text = await resp.text(); } catch (e) {}
                throw new Error(`Server returned ${resp.status}${text ? ": " + text : ""}`);
            }

            alert("Saved successfully!");
            hideDeviceModal();

            // refresh data if available
            if (typeof fetchData === "function") {
                try { await fetchData(typeof currentRegion !== "undefined" ? currentRegion : undefined); } catch (e) { console.warn("fetchData failed:", e); }
            }

        } catch (err) {
            console.error("Save error:", err);
            alert("Error saving device: " + (err && err.message ? err.message : "Unknown error"));
        } finally {
            // hide loader & restore UI
            hideLoader();
            form.dataset.saving = "0";
            if (saveBtn) saveBtn.disabled = false;
        }
    });
})();

/* ========= Delete handler ========= */
if ($id("device-delete-btn")) {
    $id("device-delete-btn").addEventListener("click", async function () {
        const oldIp = ($id("device-old-ip") ? $id("device-old-ip").value : "").trim();
        if (!oldIp) return;
        if (!confirm("Delete this device permanently?")) return;

        // show small loader (use center loader) while deleting
        showLoaderForType(($id("device-type") ? $id("device-type").value : "camera"));
        try {
            const resp = await fetch(`http://localhost/api/devices/${encodeURIComponent(oldIp)}`, { method: "DELETE" });
            if (!resp.ok) throw new Error("Delete failed");
            alert("Device deleted successfully!");
            hideDeviceModal();
            if (typeof fetchData === "function") {
                try { await fetchData(typeof currentRegion !== "undefined" ? currentRegion : undefined); } catch (e) { console.warn("fetchData failed:", e); }
            }
        } catch (err) {
            alert("Error deleting device: " + (err && err.message ? err.message : "Unknown error"));
        } finally {
            hideLoader();
        }
    });
}

/* ========= Open edit by IP/hostname ========= */
async function openEditForDeviceFromIP(ipOrHost, detectedType = null) {
    try {
        if (!latestDetails || !latestDetails.details) {
            if (typeof fetchData === "function") await fetchData(typeof currentRegion !== "undefined" ? currentRegion : undefined);
        }

        let found = null;
        for (const list of Object.values(latestDetails.details || {})) {
            const m = (list || []).find(d =>
                ((d.ip_address || d.IP_address || "").trim() === ipOrHost) ||
                ((d.hostname || d.HostName || "").trim() === ipOrHost)
            );
            if (m) { found = m; break; }
        }

        if (!found) {
            alert("Device not found");
            return;
        }

        found._type_for_ui = detectedType || (typeof detectTypeFromDeviceObj === "function" ? detectTypeFromDeviceObj(found) : "camera");
        showDeviceModal("edit", found);

    } catch (err) {
        console.error(err);
        alert("Cannot load device details: " + (err && err.message ? err.message : "Unknown error"));
    }
}

/* fallback detect function */
if (typeof detectTypeFromDeviceObj !== "function") {
    function detectTypeFromDeviceObj(obj) {
        if (obj.controllername || (obj.Doors && obj.Doors.length)) return "controller";
        if (obj.application || obj.windows_server) return "dbdetails";
        if (obj.pc_name || obj.hostname) return "pcdetails";
        if (obj.cameraname) return "camera";
        return "camera";
    }
}

/* End of script.js */