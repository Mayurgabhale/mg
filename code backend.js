<div class="modal-footer">
  <button type="submit" id="device-save-btn">Save</button>
  <span id="save-loader" style="display:none; margin-left:10px;">Saving...</span>
  <button type="button" onclick="hideDeviceModal()">Cancel</button>
  <button type="button" id="device-delete-btn" style="display:none;">Delete</button>
</div>






/* --- helper: remove 'required' attributes on conditional fields so browser won't block hidden inputs --- */
(function removeStaticRequiredAttrs() {
    // remove any required attributes that might be present on conditional inputs
    document.querySelectorAll(
      "#pc-fields input, #db-fields input, #camera-fields input, #added-by-box input, #updated-by-box input"
    ).forEach(i => i.removeAttribute("required"));
})();

/* --- updateFormFields (keeps showing/hiding sections) --- */
function updateFormFields() {
    const type = document.getElementById("device-type").value;

    const nameField = document.getElementById("name-field");
    const cameraFields = document.getElementById("camera-fields");
    const pcFields = document.getElementById("pc-fields");
    const doorSec = document.getElementById("door-reader-container");
    const dbFields = document.getElementById("db-fields");

    // reset visibility
    nameField.style.display = "block";
    cameraFields.style.display = "none";
    pcFields.style.display = "none";
    doorSec.style.display = "none";
    dbFields.style.display = "none";

    if (type === "camera") cameraFields.style.display = "block";
    if (type === "controller") doorSec.style.display = "block";
    if (type === "pcdetails") {
        nameField.style.display = "none";
        pcFields.style.display = "block";
    }
    if (type === "dbdetails") {
        nameField.style.display = "none";
        pcFields.style.display = "none";
        cameraFields.style.display = "none";
        doorSec.style.display = "none";
        dbFields.style.display = "block";
    }
}

/* --- single validateRequiredFields (same behavior but kept here so submit handler calls it) --- */
function validateRequiredFields() {
    let type = document.getElementById("device-type").value;

    // Base required fields
    let required = [
        { id: "device-name", label: "Device Name" },
        { id: "device-ip", label: "IP Address" },
        { id: "device-location", label: "Location" },
        { id: "device-city", label: "City" }
    ];

    // Add "added by" when ADD mode is active (box visible)
    if (document.getElementById("added-by-box").style.display !== "none") {
        required.push({ id: "device-added-by", label: "Added By" });
    }

    // Add "updated by" when UPDATE mode is active (box visible)
    if (document.getElementById("updated-by-box").style.display !== "none") {
        required.push({ id: "device-updated-by", label: "Updated By" });
    }

    // CAMERA fields
    if (type === "camera") {
        required.push({ id: "form-device-details", label: "Camera Details" });
    }

    // PC DETAILS replaces base list
    if (type === "pcdetails") {
        required = [
            { id: "Host-Name", label: "Host Name" },
            { id: "PC-Name", label: "PC Name" }
        ];
        if (document.getElementById("added-by-box").style.display !== "none") {
            required.push({ id: "device-added-by", label: "Added By" });
        }
        if (document.getElementById("updated-by-box").style.display !== "none") {
            required.push({ id: "device-updated-by", label: "Updated By" });
        }
    }

    // DB DETAILS replaces base list
    if (type === "dbdetails") {
        required = [
            { id: "db-hostname", label: "DB Host Name" },
            { id: "db-application", label: "DB Application" },
            { id: "db-windows-server", label: "Windows Server Version" }
        ];
        if (document.getElementById("added-by-box").style.display !== "none") {
            required.push({ id: "device-added-by", label: "Added By" });
        }
        if (document.getElementById("updated-by-box").style.display !== "none") {
            required.push({ id: "device-updated-by", label: "Updated By" });
        }
    }

    // Validate
    for (let field of required) {
        let el = document.getElementById(field.id);
        if (!el) continue;

        // check visibility (offsetParent null if hidden via display:none)
        if (el.offsetParent !== null) {
            if (el.value.trim() === "") {
                // highlight, alert exact message, focus
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

/* --- helper: collect form body depending on UI type (keeps your previous mapping logic) --- */
function collectBodyForSave(uiType) {
    return {
        name: document.getElementById("device-name").value,
        ip_address: document.getElementById("device-ip").value,
        location: document.getElementById("device-location").value,
        city: document.getElementById("device-city").value,
        device_details: document.getElementById("form-device-details").value,
        hyperlink: document.getElementById("device-hyperlink").value,
        remark: document.getElementById("device-remark").value,
        hostname: document.getElementById("Host-Name").value,
        pc_name: document.getElementById("PC-Name").value,
        added_by: document.getElementById("device-added-by").value,
        updated_by: document.getElementById("device-updated-by").value,
        db_hostname: document.getElementById("db-hostname").value,
        application: document.getElementById("db-application").value,
        windows_server: document.getElementById("db-windows-server").value
    };
}

/* --- single submit handler with loading state --- */
(function attachFormSubmit() {
    const form = document.getElementById("device-form");
    const saveBtn = document.getElementById("device-save-btn");
    const saveLoader = document.getElementById("save-loader");

    // Prevent attaching twice
    if (form.dataset.listenerAttached) return;
    form.dataset.listenerAttached = "1";

    form.addEventListener("submit", async function (ev) {
        ev.preventDefault();

        // Prevent double submit
        if (form.dataset.saving === "1") return;

        // run custom validation
        if (!validateRequiredFields()) {
            return;
        }

        // prepare
        form.dataset.saving = "1";
        saveBtn.disabled = true;
        saveLoader.style.display = "inline-block";

        const oldIp = document.getElementById("device-old-ip").value;
        const uiType = document.getElementById("device-type").value;
        const backendType = mapUITypeToBackend(uiType);

        let body = collectBodyForSave(uiType);
        body = convertToBackendFields(backendType, body);

        if (backendType === "controllers") {
            const doors = [];
            document.querySelectorAll("#door-reader-body tr").forEach(tr => {
                doors.push({
                    door: tr.querySelector(".door-input").value,
                    reader: tr.querySelector(".reader-input").value
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
                // try to read server message if present
                let text = "";
                try { text = await resp.text(); } catch (e) { /* ignore */ }
                throw new Error(`Server returned ${resp.status}${ text ? ": " + text : "" }`);
            }

            alert("Saved successfully!");
            hideDeviceModal();

            // if you have async fetchData, call it; don't block UI if not defined
            if (typeof fetchData === "function" && typeof currentRegion !== "undefined") {
                try { await fetchData(currentRegion); } catch (e) { console.warn("fetchData failed:", e); }
            }

        } catch (err) {
            console.error("Save error:", err);
            alert("Error saving device: " + (err.message || "Unknown error"));
        } finally {
            form.dataset.saving = "0";
            saveBtn.disabled = false;
            saveLoader.style.display = "none";
        }
    });
})();