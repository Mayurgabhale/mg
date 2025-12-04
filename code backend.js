/* ----- Device Add/Edit/Delete UI helpers ----- */
function openAddDevice() {
    showDeviceModal("add");
}

// Map UI type → backend type
function mapUITypeToBackend(type) {
    switch (type) {
        case "camera": return "cameras";
        case "controller": return "controllers";
        case "archiver": return "archivers";
        case "server": return "servers";
        case "pcdetails": return "pcDetails";
        case "dbdetails": return "DBDetails";
        default: return "cameras";
    }
}

// Convert UI device fields → backend field names
function convertToBackendFields(type, body) {
    const mapped = { ...body };

    switch (type) {
        case "cameras":
            mapped.cameraname = body.name;
            break;
        case "controllers":
            mapped.controllername = body.name;
            break;
        case "archivers":
            mapped.archivername = body.name;
            break;
        case "servers":
            mapped.servername = body.name;
            break;
        case "pcDetails":
            mapped.hostname = body.name;
            break;
        case "DBDetails":
            mapped.hostname = body.name;
            break;
    }

    delete mapped.name;
    return mapped;
}

// show modal
function showDeviceModal(mode = "add", deviceObj = null) {
    const modal = document.getElementById("device-modal");
    const title = document.getElementById("device-modal-title");
    const deleteBtn = document.getElementById("device-delete-btn");
    const oldIpInput = document.getElementById("device-old-ip");

    document.getElementById("device-form").reset();
    oldIpInput.value = "";

    if (mode === "add") {
        title.textContent = "Add New Device";
        deleteBtn.style.display = "none";
        document.getElementById("device-type").disabled = false;
    } else {
        title.textContent = "Edit Device";
        deleteBtn.style.display = "inline-block";

        document.getElementById("device-type").value =
            deviceObj._type_for_ui || "camera";

        document.getElementById("device-name").value =
            deviceObj.cameraname ||
            deviceObj.controllername ||
            deviceObj.archivername ||
            deviceObj.servername ||
            deviceObj.hostname ||
            "";

        document.getElementById("device-ip").value =
            deviceObj.ip_address || deviceObj.IP_address || "";

        document.getElementById("device-location").value = deviceObj.location || "";
        document.getElementById("device-city").value = deviceObj.city || "";
        document.getElementById("device-details").value =
            deviceObj.device_details || "";
        document.getElementById("device-hyperlink").value =
            deviceObj.hyperlink || "";
        document.getElementById("device-remark").value = deviceObj.remark || "";
        document.getElementById("device-person").value = deviceObj.person_name || "";

        oldIpInput.value = deviceObj.ip_address || deviceObj.IP_address;
        document.getElementById("device-type").disabled = true;
    }

    modal.style.display = "block";
}

function hideDeviceModal() {
    document.getElementById("device-modal").style.display = "none";
}

// Submit Add/Edit
document.getElementById("device-form").addEventListener("submit", async function (ev) {
    ev.preventDefault();

    const oldIp = document.getElementById("device-old-ip").value;
    const uiType = document.getElementById("device-type").value;
    const backendType = mapUITypeToBackend(uiType);

    let body = {
        name: document.getElementById("device-name").value || null,
        ip_address: document.getElementById("device-ip").value || null,
        location: document.getElementById("device-location").value || null,
        city: document.getElementById("device-city").value || null,
        device_details: document.getElementById("device-details").value || null,
        hyperlink: document.getElementById("device-hyperlink").value || null,
        remark: document.getElementById("device-remark").value || null,
        person_name: document.getElementById("device-person").value || null
    };

    // convert name → correct backend field (cameraname, controllername, hostname...)
    body = convertToBackendFields(backendType, body);

    try {
        if (!oldIp) {
            // ADD
            const resp = await fetch("http://localhost/api/devices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: backendType, device: body })
            });
            if (!resp.ok) throw new Error("Add failed");
        } else {
            // EDIT
            const resp = await fetch(`http://localhost/api/devices/${encodeURIComponent(oldIp)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            if (!resp.ok) throw new Error("Update failed");
        }

        hideDeviceModal();
        await fetchData(currentRegion);
        alert("Saved successfully!");

    } catch (err) {
        alert("Error: " + err.message);
    }
});

// Delete Device
document.getElementById("device-delete-btn").addEventListener("click", async function () {
    const oldIp = document.getElementById("device-old-ip").value;
    if (!oldIp) return;

    if (!confirm("Delete this device permanently?")) return;

    try {
        const resp = await fetch(`http://localhost/api/devices/${encodeURIComponent(oldIp)}`, {
            method: "DELETE"
        });
        if (!resp.ok) throw new Error("Delete failed");

        hideDeviceModal();
        await fetchData(currentRegion);

        alert("Deleted");

    } catch (err) {
        alert("Error: " + err.message);
    }
});