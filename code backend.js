// Open edit modal by IP or hostname using cached device data
async function openEditForDeviceFromIP(ipOrHost) {
    if (!latestDetails || !latestDetails.details) {
        await fetchData(currentRegion); // Ensure devices are loaded
    }

    let found = null;

    // Search all device lists in latestDetails
    for (const list of Object.values(latestDetails.details)) {
        const m = (list || []).find(d => 
            (d.ip_address || d.IP_address || "").trim() === ipOrHost ||
            (d.hostname || d.HostName || "").trim() === ipOrHost
        );
        if (m) {
            found = m;
            break;
        }
    }

    if (!found) {
        alert("Device not found");
        return;
    }

    // Detect type for modal
    found._type_for_ui = detectTypeFromDeviceObj(found);

    // Open modal in edit mode
    showDeviceModal("edit", found);
}

// Detect device type from object
function detectTypeFromDeviceObj(obj) {
    if (obj.cameraname) return "camera";
    if (obj.controllername) return "controller";
    if (obj.archivername) return "archiver";
    if (obj.servername) return "server";
    if (obj.hostname && obj.is_pc_details) return "pcdetails";
    if (obj.hostname && obj.is_db_details) return "DBDetails";
    return "camera"; // fallback
}



...


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
        const name = deviceObj.cameraname || deviceObj.controllername || deviceObj.archivername || deviceObj.servername || deviceObj.hostname || "";
        document.getElementById("device-name").value = name;
        document.getElementById("device-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";
        document.getElementById("device-location").value = deviceObj.Location || deviceObj.location || "";
        document.getElementById("device-city").value = deviceObj.City || deviceObj.city || "";
        document.getElementById("device-details").value = deviceObj.device_details || "";
        document.getElementById("device-hyperlink").value = deviceObj.hyperlink || "";
        document.getElementById("device-remark").value = deviceObj.remark || "";
        document.getElementById("device-person").value = deviceObj.person_name || "";
        document.getElementById("device-old-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";

        // Controller doors
        if (deviceObj.Doors && Array.isArray(deviceObj.Doors)) {
            document.getElementById("device-type").value = "controller";
            updateFormFields();
            deviceObj.Doors.forEach(d => {
                addDoorRow(d.door || d.Door, d.reader || "");
            });
        }
    }

    modal.style.display = "flex";
}


...
