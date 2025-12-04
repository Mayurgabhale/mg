<div id="device-modal" class="modal">
  <div class="modal-content">
    <h3 id="device-modal-title">Add Device</h3>
    <form id="device-form">
      <input type="hidden" id="device-old-ip">

      <label>Type*</label>
      <select id="device-type" required onchange="updateFormFields()">
        <option value="camera">Camera</option>
        <option value="archiver">Archiver</option>
        <option value="controller">Controller</option>
        <option value="server">Server</option>
        <option value="pcdetails">PC Details</option>
        <option value="DBDetails">DB Details</option>
      </select>

      <label>Name*</label>
      <input id="device-name" type="text">

      <label>IP Address*</label>
      <input id="device-ip" type="text">

      <label>Location*</label>
      <input id="device-location" type="text">

      <label>City*</label>
      <input id="device-city" type="text">

      <label>Details</label>
      <input id="device-details" type="text">

      <label>Hyperlink</label>
      <input id="device-hyperlink" type="url">

      <label>Remark</label>
      <input id="device-remark" type="text">

      <label>Person Name*</label>
      <input id="device-person" type="text">

      <!-- Controller Doors -->
      <div id="door-reader-container" style="display:none;" class="door-reader">
        <h4>Doors & Readers</h4>
        <table>
          <thead>
            <tr><th>Door</th><th>Reader</th><th>Action</th></tr>
          </thead>
          <tbody id="door-reader-body"></tbody>
        </table>
        <button type="button" id="add-door-row">Add Door</button>
      </div>

      <div class="modal-footer">
        <button type="submit">Save</button>
        <button type="button" onclick="hideDeviceModal()">Cancel</button>
        <button type="button" id="device-delete-btn" style="display:none;">Delete</button>
      </div>
    </form>
  </div>
</div>

delete not work 
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
        document.getElementById("device-type").value = "camera"; // default
    } else {
        title.textContent = "Edit Device";
        deleteBtn.style.display = "inline-block";
        document.getElementById("device-type").disabled = true;

        // ✅ Set type correctly from _type_for_ui
        document.getElementById("device-type").value = deviceObj._type_for_ui;

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

        // Handle controller doors
        if (deviceObj.Doors && Array.isArray(deviceObj.Doors)) {
            document.getElementById("device-type").value = "controller";
            updateFormFields();
            deviceObj.Doors.forEach(d => addDoorRow(d.door || d.Door, d.reader || ""));
        }
    }

    updateFormFields();
    modal.style.display = "flex";
}

// ================= UPDATE FORM FIELDS BASED ON TYPE =================
function updateFormFields() {
    const type = document.getElementById("device-type").value;
    const doorSec = document.getElementById("door-reader-container");
    doorSec.style.display = (type === "controller") ? "block" : "none";
}


document.getElementById("device-type").addEventListener("change", updateFormFields);

function hideDeviceModal(){ document.getElementById("device-modal").style.display="none"; }

// ================= TYPE BASED FIELD =================
function updateFormFields(){
    const type = document.getElementById("device-type").value;
    const doorSec = document.getElementById("door-reader-container");
    doorSec.style.display = (type==="controller") ? "block" : "none";
}

// ================= DOOR ROW =================
function addDoorRow(door = "", reader = "") {
    const tbody = document.getElementById("door-reader-body");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" class="door-input" value="${door}"></td>
        <td><input type="text" class="reader-input" value="${reader}"></td>
        <td><button type="button" class="remove-door-row">X</button></td>
    `;
    tbody.appendChild(row);
    row.querySelector(".remove-door-row").addEventListener("click", () => row.remove());
}
document.getElementById("add-door-row").addEventListener("click", () => addDoorRow());


// ================= TYPE → BACKEND MAP =================
function mapUITypeToBackend(type){
    switch(type){
        case "camera": return "cameras";
        case "controller": return "controllers";
        case "archiver": return "archivers";
        case "server": return "servers";
        case "pcdetails": return "pcDetails";
        case "DBDetails": return "DBDetails";
        default: return "cameras";
    }
}

function convertToBackendFields(type, body){
    const mapped = {...body};
    switch(type){
        case "cameras": mapped.cameraname=body.name; break;
        case "controllers": mapped.controllername=body.name; break;
        case "archivers": mapped.archivername=body.name; break;
        case "servers": mapped.servername=body.name; break;
        case "pcDetails": mapped.hostname=body.name; break;
        case "DBDetails": mapped.hostname=body.name; break;
    }
    delete mapped.name;
    return mapped;
}

// ================= SAVE ADD/EDIT =================
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
            await fetch("http://localhost/api/devices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: backendType, device: body })
            });
        } else {
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
// ================= OPEN EDIT BY IP OR HOSTNAME =================
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

// ================= DETECT DEVICE TYPE =================
function detectTypeFromDeviceObj(obj) {
    // Cameras
    if (obj.cameraname) return "camera";

    // Controllers
    if (obj.controllername) return "controller";

    // Archivers
    if (obj.archivername) return "archiver";

    // Servers
    if (obj.servername) return "server";

    // PC / DB details
    if (obj.hostname) {
        if (obj.is_pc_details) return "pcdetails";
        if (obj.is_db_details) return "DBDetails";
    }

    // fallback to camera if unknown
    return "camera";
}
