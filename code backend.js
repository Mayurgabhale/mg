// ================= OPEN EDIT BY IP OR HOSTNAME =================
async function openEditForDeviceFromIP(ipOrHost) {
    try {
        // Ensure devices are loaded
        if (!latestDetails || !latestDetails.details) {
            await fetchData(currentRegion);
        }

        let found = null;

        // Search all device lists
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

        // Detect type
        found._type_for_ui = detectTypeFromDeviceObj(found);

        // Open modal in edit mode
        showDeviceModal("edit", found);

    } catch (err) {
        console.error(err);
        alert("Cannot load device details: " + err.message);
    }
}

// ================= DETECT DEVICE TYPE =================
function detectTypeFromDeviceObj(obj) {
    if (obj.cameraname) return "camera";
    if (obj.controllername) return "controller";
    if (obj.archivername) return "archiver";
    if (obj.servername) return "server";
    if (obj.hostname && obj.is_pc_details) return "pcdetails";
    if (obj.hostname && obj.is_db_details) return "DBDetails";
    return "camera"; // fallback
}

// ================= SHOW DEVICE MODAL =================
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

        // ✅ Set the Type dropdown correctly
        document.getElementById("device-type").value = deviceObj._type_for_ui || "camera";

        // Fill common fields
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

        // ✅ Handle controller doors
        if (deviceObj.Doors && Array.isArray(deviceObj.Doors)) {
            updateFormFields(); // show doors section
            deviceObj.Doors.forEach(d => {
                addDoorRow(d.door || d.Door, d.reader || "");
            });
        }
    }

    updateFormFields(); // ensure doors section visibility is correct
    modal.style.display = "flex";
}

// ================= UPDATE FORM FIELDS BASED ON TYPE =================
function updateFormFields() {
    const type = document.getElementById("device-type").value;
    const doorSec = document.getElementById("door-reader-container");
    doorSec.style.display = (type === "controller") ? "block" : "none";
}