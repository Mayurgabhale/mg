// ================= SHOW / HIDE MODAL ==================
function showDeviceModal(mode = "add", deviceObj = null) {
    const modal = document.getElementById("device-modal");
    const title = document.getElementById("device-modal-title");
    const deleteBtn = document.getElementById("device-delete-btn");

    document.getElementById("device-form").reset();
    document.getElementById("door-reader-body").innerHTML = "";
    document.getElementById("device-old-ip").value = "";

    if (mode === "add") {
        title.textContent = "Add Device";
        deleteBtn.style.display = "none";
        document.getElementById("device-type").disabled = false;

    } else {
        title.textContent = "Edit Device";
        deleteBtn.style.display = "inline-block";
        document.getElementById("device-type").disabled = true;

        // Fill fields
        const name =
            deviceObj.cameraname ||
            deviceObj.controllername ||
            deviceObj.archivername ||
            deviceObj.servername ||
            deviceObj.hostname || "";

        document.getElementById("device-name").value = name;
        document.getElementById("device-ip").value = deviceObj.IP_address || deviceObj.ip_address;
        document.getElementById("device-location").value = deviceObj.Location || deviceObj.location || "";
        document.getElementById("device-city").value = deviceObj.City || deviceObj.city || "";
        document.getElementById("device-details").value = deviceObj.device_details || "";
        document.getElementById("device-hyperlink").value = deviceObj.hyperlink || "";
        document.getElementById("device-remark").value = deviceObj.remark || "";
        document.getElementById("device-person").value = deviceObj.person_name || "";
        document.getElementById("device-old-ip").value = deviceObj.IP_address || deviceObj.ip_address;

        // Doors (controllers only)
        if (deviceObj.Doors && Array.isArray(deviceObj.Doors)) {
            document.getElementById("device-type").value = "controller";
            updateFormFields();
            deviceObj.Doors.forEach(d => {
                addDoorRow(d.door || d.Door, d.reader || "");
            });
        }
    }

    modal.style.display = "block";
}

function hideDeviceModal() {
    document.getElementById("device-modal").style.display = "none";
}



// ================== TYPE-BASED FIELD HANDLING ==================
function updateFormFields() {
    const type = document.getElementById("device-type").value;
    const doorSec = document.getElementById("door-reader-container");

    // hide by default
    doorSec.style.display = "none";

    if (type === "controller") {
        doorSec.style.display = "block";
    }
}



// ================== DOOR + READER TABLE ==================
function addDoorRow(door = "", reader = "") {
    const tbody = document.getElementById("door-reader-body");

    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" class="door-input" value="${door}"></td>
        <td><input type="text" class="reader-input" value="${reader}"></td>
        <td><button type="button" class="remove-door-row">X</button></td>
    `;

    tbody.appendChild(row);

    row.querySelector(".remove-door-row").addEventListener("click", () => {
        row.remove();
    });
}

document.getElementById("add-door-row").addEventListener("click", () => {
    addDoorRow();
});



// ================== TYPE → BACKEND MAP ==================
function mapUITypeToBackend(type) {
    switch (type) {
        case "camera": return "cameras";
        case "controller": return "controllers";
        case "archiver": return "archivers";
        case "server": return "servers";
        case "pcdetails": return "pcDetails";
        case "DBDetails": return "DBDetails";
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
        case "pcDetails": mapped.hostname = body.name; break;
        case "DBDetails": mapped.hostname = body.name; break;
    }

    delete mapped.name;
    return mapped;
}



// ================== SAVE ADD/EDIT ==================
document.getElementById("device-form").addEventListener("submit", async function (ev) {
    ev.preventDefault();

    const oldIp = document.getElementById("device-old-ip").value;
    const uiType = document.getElementById("device-type").value;
    const backendType = mapUITypeToBackend(uiType);

    let body = {
        name: document.getElementById("device-name").value,
        ip_address: document.getElementById("device-ip").value,
        location: document.getElementById("device-location").value,
        city: document.getElementById("device-city").value,
        device_details: document.getElementById("device-details").value,
        hyperlink: document.getElementById("device-hyperlink").value,
        remark: document.getElementById("device-remark").value,
        person_name: document.getElementById("device-person").value
    };

    // convert field names
    body = convertToBackendFields(backendType, body);

    // controllers: add doors list
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
        if (!oldIp) {
            // ADD
            await fetch("http://localhost/api/devices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: backendType, device: body })
            });
        } else {
            // EDIT
            await fetch(`http://localhost/api/devices/${oldIp}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
        }

        alert("Saved!");
        hideDeviceModal();

    } catch (err) {
        alert("Error saving device");
    }
});