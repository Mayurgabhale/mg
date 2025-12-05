
};
  const table = tableMap[type];
  if (!table) throw new Error("Unsupported device type for DB: " + type);

  try {
    switch (table) {
      case "cameras":
        db.prepare(`
          INSERT INTO cameras (cameraname, ip_address, location, city, device_details, hyperlink, remark, added_by, added_at)
          VALUES (@cameraname, @ip_address, @location, @city, @device_details, @hyperlink, @remark, @added_by, datetime('now'))
        `).run({
          cameraname: norm.cameraname || norm.camera_name || null,
          ip_address: ip,
          location: norm.location || null,
          city: norm.city || null,
          device_details: norm.device_details || norm.deviec_details || null,
          hyperlink: norm.hyperlink || null,
          remark: norm.remark || null,
          added_by: norm.added_by || "api",
        });
        break;

      case "archivers":
        db.prepare(`
          INSERT INTO archivers (archivername, ip_address, location, city, added_by, added_at)
          VALUES (@archivername, @ip_address, @location, @city, @added_by, datetime('now'))
        `).run({
          archivername: norm.archivername || null,
          ip_address: ip,
          location: norm.location || null,
          city: norm.city || null,
          added_by: norm.added_by || "api",
        });
        break;

      case "controllers":
        db.prepare(`
          INSERT INTO controllers (controllername, ip_address, location, city, added_by, added_at)
          VALUES (@controllername, @ip_address, @location, @city, @added_by, datetime('now'))
        `).run({
          controllername: norm.controllername || null,
          ip_address: ip,
          location: norm.location || null,
          city: norm.city || null,
          added_by: norm.added_by || "api",
        });

        // ⬇️⬇️ for door

        // --- SAVE DOORS FOR THIS CONTROLLER (if provided) ---
        const doorsToInsert = norm.doors || norm.Doors;
        if (Array.isArray(doorsToInsert) && doorsToInsert.length) {
          const stmt = db.prepare(`
            INSERT INTO controller_doors (controller_ip, door, reader, location, city, added_by, added_at)
            VALUES (?, ?, ?, ?, ?, 'api', datetime('now'))
          `);
          for (const d of doorsToInsert) {
            const doorVal = (d && (d.door || d.Door || d.name)) || "";
            const readerVal = (d && (d.reader || d.Reader)) || "";
            const locVal = norm.location || null;
            const cityVal = norm.city || null;

            stmt.run(ip, doorVal, readerVal, locVal, cityVal);
          }
          // refresh doors cache
          reloadControllerDoors();
        }
        // ⬇️⬇️


        break;

      case "servers":
        db.prepare(`
          INSERT INTO servers (servername, ip_address, location, city, added_by, added_at)
          VALUES (@servername, @ip_address, @location, @city, @added_by, datetime('now'))
        `).run({
          servername: norm.servername || null,
          ip_address: ip,
          location: norm.location || null,
          city: norm.city || null,
          added_by: norm.added_by || "api",
        });
        break;

      case "dbdetails":
        db.prepare(`
          INSERT INTO dbdetails (location, city, hostname, ip_address, application, windows_server, added_by, added_at)
          VALUES (@location, @city, @hostname, @ip_address, @application, @windows_server, @added_by, datetime('now'))
        `).run({
          location: norm.location || null,
          city: norm.city || null,
          hostname: norm.hostname || null,
          ip_address: ip,
          application: norm.application || null,
          windows_server: norm.windows_server || null,
          added_by: norm.added_by || "api",
        });
        break;

      case "pc_details":
        db.prepare(`
          INSERT INTO pc_details (hostname, ip_address, location, city, pc_name, added_by, added_at)
          VALUES (@hostname, @ip_address, @location, @city, @pc_name, @added_by, datetime('now'))
        `).run({
          hostname: norm.hostname || null,
          ip_address: ip,
          location: norm.location || null,
          city: norm.city || null,
          pc_name: norm.pc_name || null,
          added_by: norm.added_by || "api",
        });
        break;
    }
  } catch (err) {
    // bubble up DB constraint errors (e.g., duplicate IP)
    throw err;
  }

  // refresh in-memory cache: load the newly inserted row and push to allData
  const insertedRow = db.prepare(`SELECT * FROM ${table} WHERE ip_address = ?`).get(ip);
  const mapped = mapRowToDevice(table, insertedRow);
  allData[type].push(mapped);
  rebuildIpRegionMap();
  return mapped;
}

// Update device (oldIp) with updateFields
function updateDevice(oldIp, updateFields) {
  const found = findInAllData(oldIp);
  if (!found) throw new Error("Device not found");
  const { listName, idx } = found;

  const tableMap = {
    archivers: "archivers",
    controllers: "controllers",
    cameras: "cameras",
    servers: "servers",
    pcDetails: "pc_details",
    DBDetails: "dbdetails",

read the above code and what is theupdate in below code ony for update and edit 
      
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

function hideDeviceModal() { document.getElementById("device-modal").style.display = "none"; }

// ================= TYPE BASED FIELD =================
function updateFormFields() {
    const type = document.getElementById("device-type").value;
    const doorSec = document.getElementById("door-reader-container");
    doorSec.style.display = (type === "controller") ? "block" : "none";
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
        await fetchData(currentRegion); // refresh the device list

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
      
if (mode === "add") {
    document.getElementById("added-by-box").style.display = "block";
    document.getElementById("updated-by-box").style.display = "none";

    const added = document.getElementById("device-added-by");
    added.value = currentUserName;      // fill with logged-in user
    added.readOnly = false;             // editable in ADD mode
}


...
if (mode === "edit") {
    document.getElementById("added-by-box").style.display = "block";
    document.getElementById("updated-by-box").style.display = "block";

    const added = document.getElementById("device-added-by");
    const updated = document.getElementById("device-updated-by");

    added.value = deviceObj.added_by || "";
    added.readOnly = true;              // read-only in EDIT mode

    updated.value = currentUserName;    // editable
    updated.readOnly = false;
}
