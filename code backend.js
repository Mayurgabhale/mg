
Edit Device
Type* 
DB Details
 IP Address* 
10.64.10.65
Host Name* 
SRVWUSJO0986V
 Application 
CCURE SAS DB LACA
 Windows Server 
Windows Server 2019 Standard
Location* 
LACA
 City* 
Costa Rica
Added By 
system-import
Updated By 
Save
Cancel\

one db dtai show inofo but anohte one is not show 
Edit Device
Type* 
DB Details
 IP Address* 
10.64.10.50
Host Name* 
e.g db-prod-01
 Application 
e.g MySQL, MSSQL
 Windows Server 
e.g 2016, 2019
Location* 
LACA
 City* 
Brazil
Added By 
system-import
Updated By 
Save
Cancel
can you rechekc the below all code and correct it, 
    and tell me where is teh issuee

// ================= SHOW DEVICE MODAL =================
function showDeviceModal(mode = "add", deviceObj = null, userName = "") {
    const modal = document.getElementById("device-modal");
    const title = document.getElementById("device-modal-title");
    const deleteBtn = document.getElementById("device-delete-btn");

    // Reset form
    document.getElementById("device-form").reset();
    document.getElementById("door-reader-body").innerHTML = "";
    document.getElementById("device-old-ip").value = "";

    const currentUserName = userName; // passed username

    if (mode === "add") {
        title.textContent = "Add Device";
        deleteBtn.style.display = "none";
        document.getElementById("device-type").disabled = false;
        document.getElementById("device-type").value = "camera";


        // Added By / Updated By boxes
        document.getElementById("added-by-box").style.display = "block";
        document.getElementById("updated-by-box").style.display = "none";

        const added = document.getElementById("device-added-by");
        added.value = currentUserName || "";
        added.readOnly = false;

    } else if (mode === "edit" && deviceObj) {
        title.textContent = "Edit Device";
        deleteBtn.style.display = "inline-block";
        document.getElementById("device-type").disabled = true;

        // Device type
        document.getElementById("device-type").value = deviceObj._type_for_ui || "camera";

        // Device fields
        document.getElementById("device-name").value =
            deviceObj.cameraname || deviceObj.controllername || deviceObj.archivername || deviceObj.servername || deviceObj.hostname || "";
        document.getElementById("device-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";
        document.getElementById("device-location").value = deviceObj.Location || deviceObj.location || "";
        document.getElementById("device-city").value = deviceObj.City || deviceObj.city || "";
        document.getElementById("device-details").value = deviceObj.device_details || "";
        document.getElementById("device-hyperlink").value = deviceObj.hyperlink || "";
        document.getElementById("device-remark").value = deviceObj.remark || "";
        document.getElementById("device-old-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";
        // PC Details fields
        document.getElementById("Host-Name").value = deviceObj.hostname || "";
        document.getElementById("PC-Name").value = deviceObj.pc_name || "";


        // ✅ DB Details fields (handles all casing variations)
        document.getElementById("db-hostname").value =
            deviceObj.db_hostname ??
            deviceObj.hostname ??
            deviceObj.HostName ??
            deviceObj.host_name ??
            "";

        document.getElementById("db-application").value =
            deviceObj.application ??
            deviceObj.Application ??
            deviceObj.app ??
            deviceObj.App ??
            "";

        document.getElementById("db-windows-server").value =
            deviceObj.windows_server ??
            deviceObj.Windows_Server ??
            deviceObj.windowsServer ??
            deviceObj.WindowsServer ??
            "";


        // Controller doors
        if (deviceObj.Doors && Array.isArray(deviceObj.Doors)) {
            document.getElementById("device-type").value = "controller";
            updateFormFields();
            deviceObj.Doors.forEach(d => addDoorRow(d.door || d.Door, d.reader || ""));
        }

        // Added By / Updated By
        document.getElementById("added-by-box").style.display = "block";
        document.getElementById("updated-by-box").style.display = "block";

        const added = document.getElementById("device-added-by");
        const updated = document.getElementById("device-updated-by");

        // Robust assignment: handle different key casings
        added.value =
            deviceObj.added_by ??
            deviceObj.AddedBy ??
            deviceObj.addedBy ??
            deviceObj.addedby ??
            "Unknown";
        added.readOnly = true;

        // updated.value = currentUserName || "";
        // Updated By (show stored value first)
        updated.value =
            deviceObj.updated_by ??
            deviceObj.UpdatedBy ??
            deviceObj.updatedBy ??
            deviceObj.updatedby ??
            "";
        updated.readOnly = false;
    }

    // Show/hide controller door section
    updateFormFields();

    // Display modal
    modal.style.display = "flex";
}


// ================= UPDATE FORM FIELDS BASED ON TYPE =================

function updateFormFields() {
    const type = document.getElementById("device-type").value;

    const nameField = document.getElementById("name-field");
    const cameraFields = document.getElementById("camera-fields");
    const pcFields = document.getElementById("pc-fields");
    const doorSec = document.getElementById("door-reader-container");
    document.getElementById("db-fields").style.display = "none";

    // RESET ALL
    nameField.style.display = "block";
    cameraFields.style.display = "none";
    pcFields.style.display = "none";
    doorSec.style.display = "none";

    if (type === "camera") {
        cameraFields.style.display = "block";
    }

    if (type === "controller") {
        doorSec.style.display = "block";
    }

    if (type === "pcdetails") {
        nameField.style.display = "none";
        pcFields.style.display = "block";
    }

    if (type === "dbdetails") {
        nameField.style.display = "none";
        pcFields.style.display = "none";
        cameraFields.style.display = "none";
        doorSec.style.display = "none";
        document.getElementById("db-fields").style.display = "block";
    }
}

// Event listener for type change
document.getElementById("device-type").addEventListener("change", updateFormFields);

// ================= HIDE MODAL =================
function hideDeviceModal() {
    document.getElementById("device-modal").style.display = "none";
}

// ================= ADD DOOR ROW =================
function addDoorRow(door = "", reader = "") {
    const tbody = document.getElementById("door-reader-body");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" class="door-input" value="${door}" placeholder="Door Name"></td>
        <td><input type="text" class="reader-input" value="${reader}" placeholder="e.g in:1, out:1"></td>
        <td><button type="button" class="remove-door-row">X</button></td>
    `;
    tbody.appendChild(row);
    row.querySelector(".remove-door-row").addEventListener("click", () => row.remove());
}
document.getElementById("add-door-row").addEventListener("click", () => addDoorRow());

// ================= MAP UI TYPE TO BACKEND =================
function mapUITypeToBackend(type) {
    switch (type) {
        case "camera": return "cameras";
        case "controller": return "controllers";
        case "archiver": return "archivers";
        case "server": return "servers";
        case "pcdetails": return "pcDetails";
        case "DBDetails": return "dbdetails";
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
        case "pc_details":  // backend type
            mapped.hostname = body.hostname;
            mapped.pc_name = body.pc_name;
            break;
        case "dbdetails":
            mapped.hostname = body.db_hostname;
            mapped.application = body.application;
            mapped.windows_server = body.windows_server;
            break;
    }
    delete mapped.name;
    return mapped;
}

// ================= SAVE / ADD / EDIT =================
document.getElementById("device-form").addEventListener("submit", async function (ev) {
    ev.preventDefault();

    const oldIp = document.getElementById("device-old-ip").value;
    const uiType = document.getElementById("device-type").value;
    const backendType = mapUITypeToBackend(uiType);

    // Collect all fields (no person_name)
    let body = {
        name: document.getElementById("device-name").value,
        ip_address: document.getElementById("device-ip").value,
        location: document.getElementById("device-location").value,
        city: document.getElementById("device-city").value,
        device_details: document.getElementById("device-details").value,
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
        if (!oldIp) {
            // ADD new device
            await fetch("http://localhost/api/devices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: backendType, device: body })
            });
        } else {
            // UPDATE existing device
            await fetch(`http://localhost/api/devices/${encodeURIComponent(oldIp)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
        }

        alert("Saved successfully!");
        hideDeviceModal();
        await fetchData(currentRegion);

    } catch (err) {
        alert("Error saving device: " + err.message);
    }
});

// ================= DELETE DEVICE =================
document.getElementById("device-delete-btn").addEventListener("click", async function () {
    const oldIp = document.getElementById("device-old-ip").value;
    if (!oldIp) return;

    if (!confirm("Delete this device permanently?")) return;

    try {
        const resp = await fetch(`http://localhost/api/devices/${encodeURIComponent(oldIp)}`, {
            method: "DELETE"
        });

        if (!resp.ok) throw new Error("Delete failed");

        alert("Device deleted successfully!");
        hideDeviceModal();
        await fetchData(currentRegion);

    } catch (err) {
        alert("Error deleting device: " + err.message);
    }
});

// ================= OPEN EDIT BY IP OR HOSTNAME =================
async function openEditForDeviceFromIP(ipOrHost, detectedType = null) {
    try {
        if (!latestDetails || !latestDetails.details) {
            await fetchData(currentRegion); // fetch devices if not loaded
        }

        let found = null;

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

        // Use detected type from button if passed, otherwise detect from object
        found._type_for_ui = detectedType || detectTypeFromDeviceObj(found);

        showDeviceModal("edit", found);

    } catch (err) {
        console.error(err);
        alert("Cannot load device details: " + err.message);
    }
}
