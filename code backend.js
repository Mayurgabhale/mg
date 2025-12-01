/* ----- Device Add/Edit/Delete UI helpers ----- */

// show modal (mode = 'add' | 'edit'), deviceObj is optional for edit
function showDeviceModal(mode = "add", deviceObj = null) {
    const modal = document.getElementById("device-modal");
    const title = document.getElementById("device-modal-title");
    const deleteBtn = document.getElementById("device-delete-btn");
    const oldIpInput = document.getElementById("device-old-ip");

    // clear form
    document.getElementById("device-form").reset();
    oldIpInput.value = "";

    if (mode === "add") {
        title.textContent = "Add New Device";
        deleteBtn.style.display = "none";
        document.getElementById("device-type").disabled = false;
    } else {
        title.textContent = "Edit Device";
        deleteBtn.style.display = "inline-block";
        // populate form
        document.getElementById("device-type").value = deviceObj._type_for_ui || deviceObj.type || "camera";
        document.getElementById("device-name").value = deviceObj.name || deviceObj.cameraname || deviceObj.controllername || "";
        document.getElementById("device-ip").value = deviceObj.ip_address || deviceObj.IP_address || "";
        document.getElementById("device-location").value = deviceObj.location || deviceObj.Location || "";
        document.getElementById("device-city").value = deviceObj.city || deviceObj.City || "";
        document.getElementById("device-details").value = deviceObj.details || deviceObj.deviec_details || "";
        document.getElementById("device-hyperlink").value = deviceObj.hyperlink || deviceObj.Hyperlink || "";
        document.getElementById("device-remark").value = deviceObj.remark || deviceObj.Remark || "";
        document.getElementById("device-person").value = deviceObj.person_name || deviceObj.person || "";

        // store old ip so PUT knows which row to update
        oldIpInput.value = (deviceObj.ip_address || deviceObj.IP_address || "").toString().trim();
        // disable type selection when editing (optional)
        document.getElementById("device-type").disabled = true;
    }

    modal.style.display = "block";
}

// hide modal
function hideDeviceModal() {
    const modal = document.getElementById("device-modal");
    modal.style.display = "none";
}

// submit handler for add/edit
document.getElementById("device-form").addEventListener("submit", async function (ev) {
    ev.preventDefault();

    const oldIp = document.getElementById("device-old-ip").value;
    const type = document.getElementById("device-type").value;
    const deviceBody = {
        name: document.getElementById("device-name").value || null,
        ip_address: document.getElementById("device-ip").value || null,
        location: document.getElementById("device-location").value || null,
        city: document.getElementById("device-city").value || null,
        details: document.getElementById("device-details").value || null,
        hyperlink: document.getElementById("device-hyperlink").value || null,
        remark: document.getElementById("device-remark").value || null,
        person_name: document.getElementById("device-person").value || null
    };

    try {
        if (!oldIp) {
            // ADD => backend expects { type, device }
            const resp = await fetch("http://localhost/api/devices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: type, device: deviceBody })
            });
            if (!resp.ok) {
                const err = await resp.json().catch(()=>({message:resp.statusText}));
                throw new Error(err.error || err.message || "Add failed");
            }
        } else {
            // EDIT => backend expects PUT /:oldIp with update fields
            // send only changed fields would be nicer; we send full object
            const resp = await fetch(`http://localhost/api/devices/${encodeURIComponent(oldIp)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(deviceBody)
            });
            if (!resp.ok) {
                const err = await resp.json().catch(()=>({message:resp.statusText}));
                throw new Error(err.error || err.message || "Update failed");
            }
        }

        // success -> close modal and refresh data
        hideDeviceModal();
        await fetchData(currentRegion); // reuse your existing fetchData to reload UI
        alert("Saved successfully");
    } catch (err) {
        console.error("Save device failed:", err);
        alert("Save failed: " + err.message);
    }
});

// cancel & close
document.getElementById("device-cancel").addEventListener("click", hideDeviceModal);

// delete handler
document.getElementById("device-delete-btn").addEventListener("click", async function () {
    const oldIp = document.getElementById("device-old-ip").value;
    if (!oldIp) return;
    if (!confirm("Delete this device? This cannot be undone.")) return;

    try {
        const resp = await fetch(`http://localhost/api/devices/${encodeURIComponent(oldIp)}`, {
            method: "DELETE"
        });
        if (!resp.ok) {
            const err = await resp.json().catch(()=>({message:resp.statusText}));
            throw new Error(err.error || err.message || "Delete failed");
        }
        hideDeviceModal();
        await fetchData(currentRegion); // refresh UI
        alert("Deleted");
    } catch (err) {
        console.error("Delete failed:", err);
        alert("Delete failed: " + err.message);
    }
});

/* ---------- helper to wire edit action to device cards ----------
   Call openEditForDeviceFromIP(ip) when you want to open edit modal for a specific device.
   For example: add an 'Edit' button on each device card that calls this with the data-ip attribute.
*/
async function openEditForDeviceFromIP(ip) {
    // find the device object in latestDetails
    if (!latestDetails || !latestDetails.details) {
        await fetchData(currentRegion);
    }

    // flatten search through types
    let found = null;
    if (latestDetails && latestDetails.details) {
        for (const list of Object.values(latestDetails.details)) {
            const match = (list || []).find(d => (d.ip_address || d.IP_address || "").toString().trim() === ip);
            if (match) { found = match; break; }
        }
    }

    if (!found) {
        alert("Device not found in current data. Try refreshing.");
        return;
    }

    // pass a little marker so modal sets the type correctly when editing
    found._type_for_ui = detectTypeFromDeviceObj(found);
    showDeviceModal("edit", found);
}

function detectTypeFromDeviceObj(obj) {
    // try heuristics similar to server normalization
    if (obj.cameraname || (obj.deviec_details || "").toString().length) return "camera";
    if (obj.archivername) return "archiver";
    if (obj.controllername) return "controller";
    if (obj.servername) return "server";
    if (obj.hostname || obj.pc_name) return "pcdetails";
    return "camera";
}