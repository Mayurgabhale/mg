saving loder is dipsly after i click on save button 
    this button <button type="submit" id="device-save-btn">Save</button>
in this case saving lodre is diplsy when i opne edit form ok, so this is wrong 
saving loder is dipsy afte i click on save buttion not before ok 
right now what is happing, when i opne edit form that time dispy saving loder so it is wrong 
    ok how to fix this , and give me update code 
<div id="save-loader" class="device-saving-box">
            <div class="saving-icon"></div>
            <span>Saving...</span>
      
<div id="device-modal" class="modal">
    <div class="modal-content">
      <h3 id="device-modal-title">Add Device</h3>
      <form id="device-form">
        <input type="hidden" id="device-old-ip">

        <label>Type<span class="required">*</span></label>
        <select id="device-type" required onchange="updateFormFields()">
          <option value="camera">Camera</option>
          <option value="archiver">Archiver</option>
          <option value="controller">Controller</option>
          <option value="server">Server</option>
          <option value="pcdetails">PC Details</option>
          <option value="dbdetails">DB Details</option>
        </select>

        <span id="name-field">
          <label>Name<span class="required">*</span></label>
          <input id="device-name" type="text" placeholder="e.g Device Name">
        </span>


        <label>IP Address<span class="required">*</span></label>
        <input id="device-ip" type="text" placeholder="e.g 10.100.111.11">

        <div id="pc-fields" style="display:none;">
          <label>Host Name<span class="required">*</span></label>
          <input id="Host-Name" type="text" placeholder="e.g ">
          <label>PC Name<span class="required">*</span></label>
          <input id="PC-Name" type="text" placeholder="e.g ">
        </div>

        <div id="db-fields" style="display:none;">
          <label>Host Name<span class="required">*</span></label>
          <input id="db-hostname" type="text" placeholder="e.g SRVWUDEN0890v">

          <label>Application<span class="required">*</span></label>
          <input id="db-application" type="text" placeholder="e.g CCURE SAS App">

          <label>Windows Server<span class="required">*</span></label>
          <input id="db-windows-server" type="text" placeholder="e.g Windows Server 2019 Standard">
        </div>

        <label>Location<span class="required">*</span></label>
        <input id="device-location" type="text" placeholder="e.g APAC, EMEA, LACA, NAMER">

        <label>City<span class="required">*</span></label>
        <input id="device-city" type="text" placeholder="e.g Pune, Denver">


        <!-- CAMERA FIELDS ONLY -->
        <div id="camera-fields">
          <label>Details<span class="required">*</span></label>
          <input id="form-device-details" type="text" placeholder="e.g FLIR, Verkada">

          <label>Hyperlink</label>
          <input id="device-hyperlink" type="url" placeholder="e.g https://link">

          <label>Remark</label>
          <input id="device-remark" type="text" placeholder="e.g Not accessible">
        </div>





        <!-- Added By -->
        <div id="added-by-box" style="display:none;">
          <label>Added By<span class="required">*</span></label>
          <input id="device-added-by" type="text" placeholder="Your Name">
        </div>

        <!-- Updated By -->
        <div id="updated-by-box" style="display:none;">
          <label>Updated B<span class="required">*</span></label>
          <input id="device-updated-by" type="text">
        </div>

        <!-- Controller Doors -->
        <div id="door-reader-container" style="display:none;" class="door-reader">
          <h4>Doors & Readers</h4>
          <table>
            <thead>
              <tr>
                <th>Door</th>
                <th>Reader</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="door-reader-body"></tbody>
          </table>
          <button type="button" id="add-door-row">Add Door</button>
        </div>

        <!-- <div class="modal-footer">
          <button type="submit">Save</button>
          <button type="button" onclick="hideDeviceModal()">Cancel</button>
          <button type="button" id="device-delete-btn" style="display:none;">Delete</button>
        </div> -->
        <div class="modal-footer">
          <button type="submit" id="device-save-btn">Save</button>
          <button type="button" onclick="hideDeviceModal()">Cancel</button>
          <button type="button" id="device-delete-btn" style="display:none;">Delete</button>
        </div>
        <!-- 🔥 NEW visible on-screen loader -->
        <div class="save-section">


          <div id="save-loader" class="device-saving-box">
            <div class="saving-icon"></div>
            <span>Saving...</span>
          </div>

        </div>
      </form>
    </div>
  </div>
// --- Utility: safe get element ---
function $id(id) { return document.getElementById(id); }

// ================= SHOW DEVICE MODAL =================
function showDeviceModal(mode = "add", deviceObj = null, userName = "") {
    const modal = $id("device-modal");
    const title = $id("device-modal-title");
    const deleteBtn = $id("device-delete-btn");

    // Reset form + state
    $id("device-form").reset();
    $id("door-reader-body").innerHTML = "";
    $id("device-old-ip").value = "";

    const currentUserName = userName || "";

    if (mode === "add") {
        title.textContent = "Add Device";
        deleteBtn.style.display = "none";
        $id("device-type").disabled = false;
        $id("device-type").value = "camera";

        // Added By / Updated By boxes
        $id("added-by-box").style.display = "block";
        $id("updated-by-box").style.display = "none";

        const added = $id("device-added-by");
        added.value = currentUserName;
        added.readOnly = false;

    } else if (mode === "edit" && deviceObj) {
        title.textContent = "Edit Device";
        deleteBtn.style.display = "inline-block";
        $id("device-type").disabled = true;

        // Device type mapping for UI
        $id("device-type").value = deviceObj._type_for_ui || "camera";
        if ((deviceObj._type_for_ui || "").toLowerCase() === "dbdetails") {
            $id("device-type").value = "dbdetails";
        }

        // Fill fields robustly (handle different key names)
        $id("device-name").value =
            deviceObj.cameraname || deviceObj.controllername || deviceObj.archivername || deviceObj.servername || deviceObj.hostname || "";
        $id("device-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";
        $id("device-location").value = deviceObj.Location || deviceObj.location || "";
        $id("device-city").value = deviceObj.City || deviceObj.city || "";
        $id("form-device-details").value = deviceObj.device_details || "";
        $id("device-hyperlink").value = deviceObj.hyperlink || "";
        $id("device-remark").value = deviceObj.remark || "";
        $id("device-old-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";
        $id("Host-Name").value = deviceObj.hostname || "";
        $id("PC-Name").value = deviceObj.pc_name || "";
        $id("db-hostname").value = deviceObj.hostname || "";
        $id("db-application").value = deviceObj.application || "";
        $id("db-windows-server").value = deviceObj.windows_server || "";

        // Controller doors (if present)
        if (deviceObj.Doors && Array.isArray(deviceObj.Doors)) {
            $id("device-type").value = "controller";
            updateFormFields(); // ensure controller section visible
            deviceObj.Doors.forEach(d => addDoorRow(d.door || d.Door, d.reader || ""));
        }

        // Added By / Updated By visibility & values
        $id("added-by-box").style.display = "block";
        $id("updated-by-box").style.display = "block";

        const added = $id("device-added-by");
        const updated = $id("device-updated-by");

        added.value =
            deviceObj.added_by ??
            deviceObj.AddedBy ??
            deviceObj.addedBy ??
            deviceObj.addedby ??
            "Unknown";
        added.readOnly = true;

        updated.value =
            deviceObj.updated_by ??
            deviceObj.UpdatedBy ??
            deviceObj.updatedBy ??
            deviceObj.updatedby ??
            "";
        updated.readOnly = false;
    }

    // Apply visibility for fields
    updateFormFields();

    // Show modal
    modal.style.display = "flex";
}

// ================= UPDATE FORM FIELDS BASED ON TYPE =================
// Also used to set/remove dynamic "required" behavior (we use custom validation)
function updateFormFields() {
    const type = $id("device-type").value;

    const nameField = $id("name-field");
    const cameraFields = $id("camera-fields");
    const pcFields = $id("pc-fields");
    const doorSec = $id("door-reader-container");
    const dbFields = $id("db-fields");

    // Reset all visibility
    if (nameField) nameField.style.display = "block";
    if (cameraFields) cameraFields.style.display = "none";
    if (pcFields) pcFields.style.display = "none";
    if (doorSec) doorSec.style.display = "none";
    if (dbFields) dbFields.style.display = "none";

    // Show whichever is needed
    if (type === "camera") {
        if (cameraFields) cameraFields.style.display = "block";
    } else if (type === "controller") {
        if (doorSec) doorSec.style.display = "block";
    } else if (type === "pcdetails") {
        if (nameField) nameField.style.display = "none";
        if (pcFields) pcFields.style.display = "block";
    } else if (type === "dbdetails") {
        if (nameField) nameField.style.display = "none";
        if (pcFields) pcFields.style.display = "none";
        if (cameraFields) cameraFields.style.display = "none";
        if (doorSec) doorSec.style.display = "none";
        if (dbFields) dbFields.style.display = "block";
    }
}

// attach onchange for device-type (ensure element exists)
if ($id("device-type")) {
    $id("device-type").addEventListener("change", updateFormFields);
}

// ================= HIDE MODAL =================
function hideDeviceModal() {
    const modal = $id("device-modal");
    if (modal) modal.style.display = "none";
}

// ================= ADD DOOR ROW =================
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

// small helper to escape inserted values into innerHTML template
function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// ================= MAP UI TYPE TO BACKEND =================
function mapUITypeToBackend(type) {
    switch (type) {
        case "camera": return "cameras";
        case "controller": return "controllers";
        case "archiver": return "archivers";
        case "server": return "servers";
        case "pcdetails": return "pcDetails";
        case "dbdetails": return "dbdetails";
        default: return "cameras";
    }
}

// ================= CONVERT FORM FIELDS FOR BACKEND =================
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

// ==================== Validation & Submit Handling ====================

/* Remove static `required` attributes on conditional inputs so browser won't block hidden fields.
   Run this early so any leftover `required` in HTML won't cause issues. */
(function removeStaticRequiredAttrs() {
    const selectors = [
        "#pc-fields input",
        "#db-fields input",
        "#camera-fields input",
        "#added-by-box input",
        "#updated-by-box input"
    ];
    try {
        document.querySelectorAll(selectors.join(",")).forEach(i => i.removeAttribute("required"));
    } catch (e) {
        // ignore if DOM not ready yet
    }
})();

/* validateRequiredFields: only checks visible fields and shows exact message */
function validateRequiredFields() {
    const type = $id("device-type") ? $id("device-type").value : "camera";

    // default required (for "normal" device types)
    let required = [
        { id: "device-name", label: "Device Name" },
        { id: "device-ip", label: "IP Address" },
        { id: "device-location", label: "Location" },
        { id: "device-city", label: "City" }
    ];

    // Added/Updated By depending on visibility
    if ($id("added-by-box") && $id("added-by-box").style.display !== "none") {
        required.push({ id: "device-added-by", label: "Added By" });
    }
    if ($id("updated-by-box") && $id("updated-by-box").style.display !== "none") {
        required.push({ id: "device-updated-by", label: "Updated By" });
    }

    // camera adds camera details
    if (type === "camera") {
        required.push({ id: "form-device-details", label: "Camera Details" });
    }

    // pcdetails replaces the main list
    if (type === "pcdetails") {
        required = [
            { id: "Host-Name", label: "Host Name" },
            { id: "PC-Name", label: "PC Name" }
        ];
        if ($id("added-by-box") && $id("added-by-box").style.display !== "none") {
            required.push({ id: "device-added-by", label: "Added By" });
        }
        if ($id("updated-by-box") && $id("updated-by-box").style.display !== "none") {
            required.push({ id: "device-updated-by", label: "Updated By" });
        }
    }

    // dbdetails replaces the main list
    if (type === "dbdetails") {
        required = [
            { id: "db-hostname", label: "DB Host Name" },
            { id: "db-application", label: "DB Application" },
            { id: "db-windows-server", label: "Windows Server Version" }
        ];
        if ($id("added-by-box") && $id("added-by-box").style.display !== "none") {
            required.push({ id: "device-added-by", label: "Added By" });
        }
        if ($id("updated-by-box") && $id("updated-by-box").style.display !== "none") {
            required.push({ id: "device-updated-by", label: "Updated By" });
        }
    }

    // Validate sequence: highlight first missing, alert message, focus
    for (const field of required) {
        const el = $id(field.id);
        if (!el) continue; // skip if field not present
        // only validate visible fields: offsetParent is null when display:none
        if (el.offsetParent !== null) {
            if (el.value.trim() === "") {
                el.style.border = "2px solid red";
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

/* Collect form body (UI layer) */
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

/* --- Single submit handler with loading state & proper validation --- */
(function attachFormSubmit() {
    const form = $id("device-form");
    if (!form) return;

    // Avoid double attachment
    if (form.dataset.listenerAttached) return;
    form.dataset.listenerAttached = "1";

    const saveBtn = $id("device-save-btn"); // assuming present in modal footer
    const saveLoader = $id("save-loader");

    form.addEventListener("submit", async function (ev) {
        ev.preventDefault();

        // Prevent double submission
        if (form.dataset.saving === "1") return;

        // Run validation
        if (!validateRequiredFields()) return;

        // Mark saving state (UI)
        form.dataset.saving = "1";
        if (saveBtn) saveBtn.disabled = true;
        if (saveLoader) saveLoader.style.display = "inline-block";

        const oldIp = ($id("device-old-ip") ? $id("device-old-ip").value : "").trim();
        const uiType = ($id("device-type") ? $id("device-type").value : "camera");
        const backendType = mapUITypeToBackend(uiType);

        // Build request body
        let body = collectBodyForSave();
        body = convertToBackendFields(backendType, body);

        // Controllers: collect door rows
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
                // ADD
                resp = await fetch("http://localhost/api/devices", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: backendType, device: body })
                });
            } else {
                // UPDATE
                resp = await fetch(`http://localhost/api/devices/${encodeURIComponent(oldIp)}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });
            }

            if (!resp.ok) {
                // show server error when available
                let text = "";
                try { text = await resp.text(); } catch (e) { /* ignore */ }
                throw new Error(`Server returned ${resp.status}${text ? ": " + text : ""}`);
            }

            alert("Saved successfully!");
            hideDeviceModal();

            // try to refresh data if functions/vars exist
            if (typeof fetchData === "function") {
                try { await fetchData(typeof currentRegion !== "undefined" ? currentRegion : undefined); } catch (e) { console.warn("fetchData failed:", e); }
            }

        } catch (err) {
            console.error("Save error:", err);
            alert("Error saving device: " + (err && err.message ? err.message : "Unknown error"));
        } finally {
            form.dataset.saving = "0";
            if (saveBtn) saveBtn.disabled = false;
            if (saveLoader) saveLoader.style.display = "none";
        }
    });
})();

// ================= DELETE DEVICE =================
if ($id("device-delete-btn")) {
    $id("device-delete-btn").addEventListener("click", async function () {
        const oldIp = ($id("device-old-ip") ? $id("device-old-ip").value : "").trim();
        if (!oldIp) return;

        if (!confirm("Delete this device permanently?")) return;

        try {
            const resp = await fetch(`http://localhost/api/devices/${encodeURIComponent(oldIp)}`, {
                method: "DELETE"
            });

            if (!resp.ok) throw new Error("Delete failed");

            alert("Device deleted successfully!");
            hideDeviceModal();

            if (typeof fetchData === "function") {
                try { await fetchData(typeof currentRegion !== "undefined" ? currentRegion : undefined); } catch (e) { console.warn("fetchData failed:", e); }
            }

        } catch (err) {
            alert("Error deleting device: " + (err && err.message ? err.message : "Unknown error"));
        }
    });
}

// ================= OPEN EDIT BY IP OR HOSTNAME =================
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

        found._type_for_ui = detectedType || detectTypeFromDeviceObj(found);
        showDeviceModal("edit", found);

    } catch (err) {
        console.error(err);
        alert("Cannot load device details: " + (err && err.message ? err.message : "Unknown error"));
    }
}

/* Optional placeholder: if detectTypeFromDeviceObj not defined elsewhere, define a safe fallback */
if (typeof detectTypeFromDeviceObj !== "function") {
    function detectTypeFromDeviceObj(obj) {
        // naive detection: check keys
        if (obj.controllername || (obj.Doors && obj.Doors.length)) return "controller";
        if (obj.application || obj.windows_server) return "dbdetails";
        if (obj.pc_name || obj.hostname) return "pcdetails";
        if (obj.cameraname) return "camera";
        return "camera";
    }
}

// End of script.js
