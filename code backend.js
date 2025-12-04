Error: Cannot load device details
script.js:1989 
 GET http://localhost/api/devices/WKSPUN-492142 404 (Not Found)

script.js:2008 Error loading device: SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
openEditForDeviceFromIP	@	script.js:2008
await in openEditForDeviceFromIP		
onclick	@	index.html:1
script.js:1989 
 GET http://localhost/api/devices/WKSWUPUN2709 404 (Not Found)
script.js:2008 Error loading device: SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
openEditForDeviceFromIP	@	script.js:2008
await in openEditForDeviceFromIP		
onclick	@	index.html:1
// Status dot
                    const statusDot = document.createElement("span");
                    statusDot.classList.add(currentStatus === "online" ? "online-dot" : "offline-dot");
                    statusDot.style.backgroundColor = (currentStatus === "online") ? "green" : "red";
                    statusDot.style.display = "inline-block";
                    statusDot.style.width = "10px";
                    statusDot.style.height = "10px";
                    statusDot.style.marginLeft = "5px";
                    statusDot.style.marginRight = "5px";
                    statusDot.style.borderRadius = "50%";

                    // Combine status parts
                    statusContainer.appendChild(statusDot);
                    statusContainer.appendChild(statusText);

                    // compute a nicer label for the device-type area
                    let deviceLabel;

                    if (deviceType === "dbdetails") {
                        // For DB Details: show the application if available, else fallback
                        deviceLabel = device.application || deviceType.toUpperCase();
                    } else if (deviceType.includes("pc")) {
                        deviceLabel = device.pc_name || device.hostname || "PC";
                    } else {
                        deviceLabel = deviceType.toUpperCase();
                    }

                    card.insertAdjacentHTML("beforeend", `
                        <button class="edit-device-btn" onclick="openEditForDeviceFromIP('${deviceIP}')"
  style="margin-left:8px; padding:6px 8px;">Edit</button>
  <h3 class="device-name" style="font-size:20px; font-weight:500; font-family: PP Right Grotesk; margin-bottom: 10px;">
      ${device.cameraname || device.controllername || device.archivername || device.servername || device.hostname || "Unknown Device"}
  </h3>

  <div class="card-content">
      <p class="device-type-label ${deviceType}" 
         style="font-size:17px;  font-family: Roboto; font-weight:100; margin-bottom: 10px; display:flex; justify-content:space-between; align-items:center;">
          
          <strong>
            <i class="${getDeviceIcon(deviceType)}" style="margin-right: 5px;"></i> 
            ${deviceLabel}
          </strong>
          
          ${deviceType.includes("camera")
                            ? `<button class="open-camera-btn"
        onclick="openCamera('${deviceIP}', '${(device.cameraname || device.controllername || "").replace(/'/g, "\\'")}', '${device.hyperlink || ""}')"
        title="Open Camera"
        style="border:none; cursor:pointer; font-weight:100; border-radius:50%; width:34px; height:34px; display:flex; justify-content:center; align-items:center;">
    <img src="images/cctv.png" alt="Logo" style="width:33px; height:33px;"/>
</button>`
                            : ""
                        }
      </p>

      <p style="font-size: ;  font-family: Roboto; margin-bottom: 8px;">
          <strong style="color:rgb(8, 8, 8);"><i class="fas fa-network-wired" style="margin-right: 6px;"></i></strong>
          <span 
              class="device-ip" 
              style="font-weight:100; color: #00adb5; cursor: pointer; text-shadow: 0 0 1px rgba(0, 173, 181, 0.3);  font-family: Roboto;"
              onclick="copyToClipboard('${deviceIP}')"
              title="Click to copy IP"
          >
              ${deviceIP}
          </span>
      </p>

      <p style="font-size: ;  font-family: Roboto; margin-bottom: 6px;">
          <strong ><i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i></strong>
          <span style="font-size:; font-weight:100; margin-left: 12px;  font-family: Roboto; font-size: ;">${device.location || "N/A"}</span>
      </p>

      <p style="font-size:;  font-family: Roboto;>
          <strong "><i class="fas fa-city" style="margin-right: 5px;"></i></strong>
          <span style="font-weight:100;margin-left: 4px;  font-family: Roboto; font-size:;">${city}</span>
      </p>
  </div>
`);
                    card.appendChild(statusContainer);

                    // --- ADDED: if this is a controller card, attach click to open doors modal ---
                    if (deviceType.includes("controller")) {
                        card.style.cursor = "pointer";
                        card.title = "Click to view Doors for this controller";
                        card.setAttribute("role", "button");
                        card.setAttribute("tabindex", "0");

                        // click handler that uses cached controllers when possible
                        const openControllerDoors = async () => {
                            // try to find matching controller from cache
                            let ctrl = findControllerForDevice({ ip: deviceIP, controllername: device.controllername, city: city });
                            if (!ctrl) {
                                // ensure controllers are cached then try again
                                await ensureControllersCached();
                                ctrl = findControllerForDevice({ ip: deviceIP, controllername: device.controllername, city: city });
                            }
                            if (ctrl) {
                                showDoorsReaders(ctrl);
                            } else {
                                // fallback: open controllers list then highlight nearest by city/IP
                                loadControllersInDetails();
                                // show a quick toast/message to indicate we couldn't find exact match
                                console.warn("Controller details not found in cache for IP/name:", deviceIP, device.controllername);
                            }
                        };

                        card.addEventListener("click", (ev) => {
                            openControllerDoors();
                        });

                        // keyboard accessibility (Enter / Space)
                        card.addEventListener("keydown", (ev) => {
                            if (ev.key === "Enter" || ev.key === " ") {
                                ev.preventDefault();
                                openControllerDoors();
                            }
                        });
                    }
                    // --- END ADDED CLICK HANDLER ---


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



// ================= OPEN EDIT BY IP ==================
async function openEditForDeviceFromIP(ip) {
    try {
        const res = await fetch(`http://localhost/api/devices/${ip}`);
        const deviceObj = await res.json();

        // detect type from returned object
        let type = "";
        if (deviceObj.cameraname) type = "camera";
        else if (deviceObj.controllername) type = "controller";
        else if (deviceObj.archivername) type = "archiver";
        else if (deviceObj.servername) type = "server";
        else if (deviceObj.hostname && deviceObj.is_pc_details) type = "pcdetails";
        else if (deviceObj.hostname && deviceObj.is_db_details) type = "DBDetails";
        else type = "camera";

        document.getElementById("device-type").value = type;

        // open modal in edit mode
        showDeviceModal("edit", deviceObj);

    } catch (err) {
        console.error("Error loading device:", err);
        alert("Error: Cannot load device details");
    }
}
