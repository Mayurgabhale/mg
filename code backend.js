function openAddDevice() {
    showDeviceModal("add");
}



....



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

        document.getElementById("device-type").value = deviceObj._type_for_ui || deviceObj.type || "camera";
        document.getElementById("device-name").value = deviceObj.name || deviceObj.cameraname || "";
        document.getElementById("device-ip").value = deviceObj.ip_address || deviceObj.IP_address || "";
        document.getElementById("device-location").value = deviceObj.location || deviceObj.Location || "";
        document.getElementById("device-city").value = deviceObj.city || deviceObj.City || "";
        document.getElementById("device-details").value = deviceObj.details || "";
        document.getElementById("device-hyperlink").value = deviceObj.hyperlink || "";
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



....
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
            // ADD
            const resp = await fetch("http://localhost/api/devices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, device: deviceBody })
            });

            if (!resp.ok) throw new Error("Add failed");
        } else {
            // EDIT
            const resp = await fetch(`http://localhost/api/devices/${encodeURIComponent(oldIp)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(deviceBody)
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


...
async function openEditForDeviceFromIP(ip) {
    if (!latestDetails || !latestDetails.details) {
        await fetchData(currentRegion);
    }

    let found = null;

    for (const list of Object.values(latestDetails.details)) {
        const m = (list || []).find(d => (d.ip_address || d.IP_address || "").trim() === ip);
        if (m) { found = m; break; }
    }

    if (!found) {
        alert("Device not found");
        return;
    }

    found._type_for_ui = detectTypeFromDeviceObj(found);
    showDeviceModal("edit", found);
}

function detectTypeFromDeviceObj(obj) {
    if (obj.cameraname) return "camera";
    if (obj.archivername) return "archiver";
    if (obj.controllername) return "controller";
    if (obj.servername) return "server";
    if (obj.hostname) return "pcdetails";
    return "camera";
}