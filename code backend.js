Added By
IN EDIT DEVICE Added By NAME NOT SHOW WHY 

Edit Device
Type* 
Camera
 Name* 
mayur camera
 IP Address* 
10.0.0.0
 Location* 
APAC
 City* 
Pune
 Details 
 Hyperlink 
 Remark 
Added By 
Updated By 
Save
Cancel
Delete


function showDeviceModal(mode = "add", deviceObj = null, userName = "") {
    const modal = document.getElementById("device-modal");
    const title = document.getElementById("device-modal-title");
    const deleteBtn = document.getElementById("device-delete-btn");

    document.getElementById("device-form").reset();
    document.getElementById("door-reader-body").innerHTML = "";
    document.getElementById("device-old-ip").value = "";

    const currentUserName = userName; // use passed username

    if (mode === "add") {
        title.textContent = "Add Device";
        deleteBtn.style.display = "none";
        document.getElementById("device-type").disabled = false;
        document.getElementById("device-type").value = "camera";

        document.getElementById("added-by-box").style.display = "block";
        document.getElementById("updated-by-box").style.display = "none";

        const added = document.getElementById("device-added-by");
        added.value = currentUserName || "";
        added.readOnly = false;

    } else {
        title.textContent = "Edit Device";
        deleteBtn.style.display = "inline-block";
        document.getElementById("device-type").disabled = true;

        document.getElementById("device-type").value = deviceObj._type_for_ui;

        document.getElementById("device-name").value = deviceObj.cameraname || deviceObj.controllername || deviceObj.archivername || deviceObj.servername || deviceObj.hostname || "";
        document.getElementById("device-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";
        document.getElementById("device-location").value = deviceObj.Location || deviceObj.location || "";
        document.getElementById("device-city").value = deviceObj.City || deviceObj.city || "";
        document.getElementById("device-details").value = deviceObj.device_details || "";
        document.getElementById("device-hyperlink").value = deviceObj.hyperlink || "";
        document.getElementById("device-remark").value = deviceObj.remark || "";
        document.getElementById("device-old-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";

        if (deviceObj.Doors && Array.isArray(deviceObj.Doors)) {
            document.getElementById("device-type").value = "controller";
            updateFormFields();
            deviceObj.Doors.forEach(d => addDoorRow(d.door || d.Door, d.reader || ""));
        }

        document.getElementById("added-by-box").style.display = "block";
        document.getElementById("updated-by-box").style.display = "block";
        const added = document.getElementById("device-added-by");
        const updated = document.getElementById("device-updated-by");

        added.value = deviceObj.added_by || deviceObj.AddedBy || "";
        added.readOnly = true;

        updated.value = currentUserName || "";
        updated.readOnly = false;
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
        <td><input type="text" class="door-input" value="${door}"></td>
        <td><input type="text" class="reader-input" value="${reader}"></td>
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
        case "pcDetails": mapped.hostname = body.name; break;
        case "dbdetails": mapped.hostname = body.name; break;
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
        added_by: document.getElementById("device-added-by").value,
        updated_by: document.getElementById("device-updated-by").value
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

SEE BACKEND

// Add device: type must match one of keys in allData
// Supported types: archivers, controllers, cameras, servers, pcDetails, DBDetails
function addDevice(type, deviceObj) {
  if (!allData[type]) throw new Error("Invalid device type: " + type);

  // normalize keys to match DB columns
  const norm = {};
  Object.entries(deviceObj || {}).forEach(([k, v]) => {
    norm[normalizeKey(k)] = v;
  });
  norm.history = norm.history || [];

  // derive ip
  const ip = (norm.ip_address || norm.ip || norm.IP_address || "").toString().trim();
  if (!ip) throw new Error("ip_address is required");

  // Determine DB table name mapping
  const tableMap = {
    archivers: "archivers",
    controllers: "controllers",
    cameras: "cameras",
    servers: "servers",
    pcDetails: "pc_details",
    DBDetails: "dbdetails",
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
  };
  const table = tableMap[listName];
  if (!table) throw new Error("Unsupported device type for update: " + listName);

  // Merge in-memory
  allData[listName][idx] = { ...allData[listName][idx], ...updateFields };
  const ip = (allData[listName][idx].ip_address || allData[listName][idx].IP_address || "").toString().trim();

  try {
    switch (table) {
      case "cameras":
        db.prepare(`
          UPDATE cameras SET cameraname=@cameraname, location=@location, city=@city, device_details=@device_details, hyperlink=@hyperlink, remark=@remark, updated_by=@updated_by, updated_at=datetime('now')
          WHERE ip_address=@where_ip
        `).run({
          cameraname: allData[listName][idx].cameraname || null,
          location: allData[listName][idx].location || null,
          city: allData[listName][idx].city || null,
          device_details: allData[listName][idx].device_details || null,
          hyperlink: allData[listName][idx].hyperlink || null,
          remark: allData[listName][idx].remark || null,
          updated_by: updateFields.updated_by || "api",
          where_ip: oldIp,
        });
        break;

      case "archivers":
        db.prepare(`
          UPDATE archivers SET archivername=@archivername, location=@location, city=@city, updated_by=@updated_by, updated_at=datetime('now')
          WHERE ip_address=@where_ip
        `).run({
          archivername: allData[listName][idx].archivername || null,
          location: allData[listName][idx].location || null,
          city: allData[listName][idx].city || null,
          updated_by: updateFields.updated_by || "api",
          where_ip: oldIp,
        });
        break;

      case "controllers":
        db.prepare(`
          UPDATE controllers SET controllername=@controllername, location=@location, city=@city, updated_by=@updated_by, updated_at=datetime('now')
          WHERE ip_address=@where_ip
        `).run({
          controllername: allData[listName][idx].controllername || null,
          location: allData[listName][idx].location || null,
          city: allData[listName][idx].city || null,
          updated_by: updateFields.updated_by || "api",
          where_ip: oldIp,
        });

        // ⬇️⬇️ for door
        // --- UPDATE DOORS IF PROVIDED ---
        const doorsToUpdate = updateFields.Doors || updateFields.doors;
        if (Array.isArray(doorsToUpdate)) {
          // remove old door rows for this controller
          db.prepare("DELETE FROM controller_doors WHERE controller_ip = ?").run(oldIp);

          const stmt = db.prepare(`
          INSERT INTO controller_doors (controller_ip, door, reader, location, city, added_by, added_at)
          VALUES (?, ?, ?, ?, ?, 'api', datetime('now'))
        `);

          const locVal = allData[listName][idx].location || null;
          const cityVal = allData[listName][idx].city || null;

          for (const d of doorsToUpdate) {
            const doorVal = (d && (d.door || d.Door || d.name)) || "";
            const readerVal = (d && (d.reader || d.Reader)) || "";
            stmt.run(oldIp, doorVal, readerVal, locVal, cityVal);
          }

          // refresh doors cache
          reloadControllerDoors();
        }
        break;

      case "servers":
        db.prepare(`
          UPDATE servers SET servername=@servername, location=@location, city=@city, updated_by=@updated_by, updated_at=datetime('now')
          WHERE ip_address=@where_ip
        `).run({
          servername: allData[listName][idx].servername || null,
          location: allData[listName][idx].location || null,
          city: allData[listName][idx].city || null,
          updated_by: updateFields.updated_by || "api",
          where_ip: oldIp,
        });
        break;

      case "dbdetails":
        db.prepare(`
          UPDATE dbdetails SET location=@location, city=@city, hostname=@hostname, application=@application, windows_server=@windows_server, updated_by=@updated_by, updated_at=datetime('now')
          WHERE ip_address=@where_ip
        `).run({
          location: allData[listName][idx].location || null,
          city: allData[listName][idx].city || null,
          hostname: allData[listName][idx].hostname || null,
          application: allData[listName][idx].application || null,
          windows_server: allData[listName][idx].windows_server || null,
          updated_by: updateFields.updated_by || "api",
          where_ip: oldIp,
        });
        break;

      case "pc_details":
        db.prepare(`
          UPDATE pc_details SET hostname=@hostname, location=@location, city=@city, pc_name=@pc_name, updated_by=@updated_by, updated_at=datetime('now')
          WHERE ip_address=@where_ip
        `).run({
          hostname: allData[listName][idx].hostname || null,
          location: allData[listName][idx].location || null,
          city: allData[listName][idx].city || null,
          pc_name: allData[listName][idx].pc_name || null,
          updated_by: updateFields.updated_by || "api",
          where_ip: oldIp,
        });
        break;
    }
  } catch (err) {
    throw err;
  }

  // If IP changed in updateFields, update DB and in-memory
  if (updateFields.ip_address && updateFields.ip_address !== oldIp) {
    const newIp = updateFields.ip_address.toString().trim();
    db.prepare(`UPDATE ${table} SET ip_address = ? WHERE ip_address = ?`).run(newIp, oldIp);
    allData[listName][idx].ip_address = newIp;
    allData[listName][idx].IP_address = newIp;
  }

  rebuildIpRegionMap();
  return allData[listName][idx];
}
