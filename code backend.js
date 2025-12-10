in this <option value="dbdetails">DB Details</option> data is not upload or going on backend or no upload in database waht is the issue, can you 
    read the beloow all code carefully and tell me what is the issue 
<div id="device-modal" class="modal">
    <div class="modal-content">
      <h3 id="device-modal-title">Add Device</h3>
      <form id="device-form">
        <input type="hidden" id="device-old-ip">

        <label>Type<span class="required">*</span></label>
        <select id="device-type" required onchange="updateFormFields()">
          <option value="camera">Camera</option>
          <option value="archiver">Archiver</option>
          <option value="controller">Controller</option>
          <option value="server">Server</option>
          <option value="pcdetails">PC Details</option>
          <option value="dbdetails">DB Details</option>
        </select>

        <span id="name-field">
          <label>Name<span class="required">*</span></label>
          <input id="device-name" type="text" placeholder="e.g Device Name">
        </span>


        <label>IP Address<span class="required">*</span></label>
        <input id="device-ip" type="text" placeholder="e.g 10.100.111.11">

        <div id="pc-fields" style="display:none;">
          <label>Host Name<span class="required">*</span></label>
          <input id="Host-Name" type="text" placeholder="e.g ">
          <label>PC Name<span class="required">*</span></label>
          <input id="PC-Name" type="text" placeholder="e.g ">
        </div>

        <div id="db-fields" style="display:none;">
          <label>Host Name<span class="required">*</span></label>
          <input id="db-hostname" type="text" placeholder="e.g SRVWUDEN0890v">

          <label>Application<span class="required">*</span></label>
          <input id="db-application" type="text" placeholder="e.g CCURE SAS App">

          <label>Windows Server<span class="required">*</span></label>
          <input id="db-windows-server" type="text" placeholder="e.g Windows Server 2019 Standard">
        </div>

        <label>Location<span class="required">*</span></label>
        <input id="device-location" type="text" placeholder="e.g APAC, EMEA, LACA, NAMER">

        <label>City<span class="required">*</span></label>
        <input id="device-city" type="text" placeholder="e.g Pune, Denver">


        <!-- CAMERA FIELDS ONLY -->
        <div id="camera-fields">
          <label>Details<span class="required">*</span></label>
          <input id="form-device-details" type="text" placeholder="e.g FLIR, Verkada">

          <label>Hyperlink</label>
          <input id="device-hyperlink" type="url" placeholder="e.g https://link">

          <label>Remark</label>
          <input id="device-remark" type="text" placeholder="e.g Not accessible">
        </div>





        <!-- Added By -->
        <div id="added-by-box" style="display:none;">
          <label>Added By<span class="required">*</span></label>
          <input id="device-added-by" type="text" placeholder="Your Name">
        </div>

        <!-- Updated By -->
        <div id="updated-by-box" style="display:none;">
          <label>Updated B<span class="required">*</span></label>
          <input id="device-updated-by" type="text">
        </div>

        <!-- Controller Doors -->
        <div id="door-reader-container" style="display:none;" class="door-reader">
          <h4>Doors & Readers</h4>
          <table>
            <thead>
              <tr>
                <th>Door</th>
                <th>Reader</th>
                <th>Action</th>
              </tr>
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


// src/services/excelService.js
const fs = require("fs");
const path = require("path");
const pLimit = require("p-limit");
const { DateTime } = require("luxon");
const { pingHost } = require("./pingService");
const Database = require("better-sqlite3");

// DB path
const dbPath = path.join(__dirname, "../data/devices.db");
if (!fs.existsSync(dbPath)) {
  throw new Error(`Database file not found at ${dbPath}. Run setupDatabase.js first.`);
}
const db = new Database(dbPath, { readonly: false });

// In-memory cache (shape expected by the rest of your app)
let allData = {
  archivers: [],
  controllers: [],
  cameras: [],
  servers: [],
  pcDetails: [],
  DBDetails: [],
  controller_doors: [], // doors with controller metadata
};

// ip -> region map
let ipRegionMap = {};

// Helper: prune old entries (keeps history entries with timestamp within `days`)
function pruneOldEntries(entries = [], days = 30) {
  try {
    const cutoff = DateTime.now().minus({ days }).toMillis();
    return entries.filter(e => {
      if (!e || !e.timestamp) return false;
      try {
        return DateTime.fromISO(e.timestamp).toMillis() >= cutoff;
      } catch {
        return false;
      }
    });
  } catch (err) {
    return entries;
  }
}

// small helper: normalize keys (same approach used elsewhere)
function normalizeKey(k) {
  return k == null ? k : k.toString().trim().toLowerCase().replace(/\s+/g, "_");
}

// Map DB row for a table to the object shape other code expects
function mapRowToDevice(table, row) {
  if (!row) return null;
  const dev = {};

  switch (table) {
    case "cameras":
      dev.cameraname = row.cameraname || row.camera_name || null;
      dev.ip_address = row.ip_address || null;
      dev.IP_address = row.ip_address || null;
      dev.location = row.location || null;
      dev.city = row.city || null;
      dev.device_details = row.device_details || row.deviec_details || null;
      dev.hyperlink = row.hyperlink || null;
      dev.remark = row.remark || null;
       dev.added_by = row.added_by || null;      // ✅ ADD THIS
      dev.updated_by = row.updated_by || null;  // ✅ ADD THIS
      break;

    case "archivers":
      dev.archivername = row.archivername || null;
      dev.ip_address = row.ip_address || null;
      dev.IP_address = row.ip_address || null;
      dev.location = row.location || null;
      dev.city = row.city || null;
      dev.added_by = row.added_by || null;      // ✅ ADD THIS
      dev.updated_by = row.updated_by || null;  // ✅ ADD THIS
      break;

    case "controllers":
      dev.controllername = row.controllername || null;
      dev.ip_address = row.ip_address || null;
      dev.IP_address = row.ip_address || null;
      dev.location = row.location || null;
      dev.city = row.city || null;
      dev.added_by = row.added_by || null;      // ✅ ADD THIS
      dev.updated_by = row.updated_by || null;  // ✅ ADD THIS
      break;

    case "servers":
      dev.servername = row.servername || null;
      dev.ip_address = row.ip_address || null;
      dev.IP_address = row.ip_address || null;
      dev.location = row.location || null;
      dev.city = row.city || null;
      dev.added_by = row.added_by || null;      // ✅ ADD THIS
      dev.updated_by = row.updated_by || null;  // ✅ ADD THIS
      break;

    case "dbdetails":
      dev.location = row.location || null;
      dev.city = row.city || null;
      dev.hostname = row.hostname || null;
      dev.ip_address = row.ip_address || null;
      dev.IP_address = row.ip_address || null;
      dev.application = row.application || null;
      dev.windows_server = row.windows_server || null;
      dev.added_by = row.added_by || null;      // ✅ ADD THIS
      dev.updated_by = row.updated_by || null;  // ✅ ADD THIS
      break;

    case "pc_details":
      dev.hostname = row.hostname || null;
      dev.ip_address = row.ip_address || null;
      dev.IP_address = row.ip_address || null;
      dev.location = row.location || null;
      dev.city = row.city || null;
      dev.pc_name = row.pc_name || null;
      dev.added_by = row.added_by || null;      // ✅ ADD THIS
      dev.updated_by = row.updated_by || null;  // ✅ ADD THIS
      break;

    default:
      // fallback: copy keys normalized
      Object.keys(row).forEach(k => {
        dev[normalizeKey(k)] = row[k];
      });
  }

  // common metadata used by other parts of the app
  // ensure history is an array and prune old entries (preserve shape)
  if (Array.isArray(row.history)) {
    dev.history = pruneOldEntries(row.history, 30);
  } else if (row.history && typeof row.history === "string") {
    try {
      const parsed = JSON.parse(row.history);
      dev.history = Array.isArray(parsed) ? pruneOldEntries(parsed, 30) : [];
    } catch {
      dev.history = [];
    }
  } else {
    dev.history = [];
  }

  // keep status if provided (some operations may set it)
  if (row.status) dev.status = row.status;
  return dev;
}

// rebuild ipRegionMap (called after any mutation or load)
function rebuildIpRegionMap() {
  ipRegionMap = {};
  [
    ...allData.cameras,
    ...allData.archivers,
    ...allData.controllers,
    ...allData.servers,
    ...allData.pcDetails,
    ...allData.DBDetails,
  ].forEach(dev => {
    const ip = (dev.ip_address || dev.IP_address || "").toString().trim();
    if (ip && dev.location) {
      ipRegionMap[ip] = (dev.location || "").toString().toLowerCase();
    }
  });
}

// Load all rows from DB into allData (including controller_doors)
function loadDbData() {
  try {
    // cameras
    const cams = db.prepare("SELECT * FROM cameras").all();
    allData.cameras = cams.map(r => mapRowToDevice("cameras", r));

    // archivers
    const archs = db.prepare("SELECT * FROM archivers").all();
    allData.archivers = archs.map(r => mapRowToDevice("archivers", r));

    // controllers
    const ctrls = db.prepare("SELECT * FROM controllers").all();
    allData.controllers = ctrls.map(r => mapRowToDevice("controllers", r));

    // servers
    const srvs = db.prepare("SELECT * FROM servers").all();
    allData.servers = srvs.map(r => mapRowToDevice("servers", r));

    // dbdetails
    const dbs = db.prepare("SELECT * FROM dbdetails").all();
    allData.DBDetails = dbs.map(r => mapRowToDevice("dbdetails", r));

    // pc_details
    const pcs = db.prepare("SELECT * FROM pc_details").all();
    allData.pcDetails = pcs.map(r => mapRowToDevice("pc_details", r));

    // controller_doors: join controllers to get location/city/controller metadata
    const doors = db.prepare(`
      SELECT d.*,
             c.controllername AS controllername,
             c.location      AS controller_location,
             c.city          AS controller_city
      FROM controller_doors d
      LEFT JOIN controllers c ON c.ip_address = d.controller_ip
    `).all();

    allData.controller_doors = doors.map(r => ({
      id: r.id,
      controller_ip: r.controller_ip,
      controllername: r.controllername || null,
      door: r.door,
      reader: r.reader,
      // prefer door-level location/city if present, otherwise controller's
      location: r.location || r.controller_location || null,
      city: r.city || r.controller_city || null,
      added_by: r.added_by || null,
      added_at: r.added_at || null,
      updated_by: r.updated_by || null,
      updated_at: r.updated_at || null,
    }));

    rebuildIpRegionMap();

    console.log("Loaded data from DB. counts:", {
      cameras: allData.cameras.length,
      controllers: allData.controllers.length,
      archivers: allData.archivers.length,
      servers: allData.servers.length,
      pcDetails: allData.pcDetails.length,
      DBDetails: allData.DBDetails.length,
      controller_doors: allData.controller_doors.length,
    });
  } catch (err) {
    console.error("Error loading DB data:", err.message);
    throw err;
  }
}

// Initialize DB load
loadDbData();

// ⬇️⬇️⬇️ for door 
// reload controller_doors from DB into allData.controller_doors
function reloadControllerDoors() {
  const doors = db.prepare(`
    SELECT d.*, 
           c.controllername AS controllername,
           c.location      AS controller_location,
           c.city          AS controller_city
    FROM controller_doors d
    LEFT JOIN controllers c ON c.ip_address = d.controller_ip
  `).all();

  allData.controller_doors = doors.map(r => ({
    id: r.id,
    controller_ip: r.controller_ip,
    controllername: r.controllername || null,
    door: r.door,
    reader: r.reader,
    location: r.location || r.controller_location || null,
    city: r.city || r.controller_city || null,
    added_by: r.added_by || null,
    added_at: r.added_at || null,
    updated_by: r.updated_by || null,
    updated_at: r.updated_at || null,
  }));
}
// ⬇️⬇️⬇️ for door 


// Fetch all IP addresses (array of ip strings) — used by ping loop
function fetchAllIpAddress() {
  return [
    ...allData.cameras,
    ...allData.archivers,
    ...allData.controllers,
    ...allData.servers,
    ...allData.pcDetails,
    ...allData.DBDetails,
  ]
    .map(d => (d.ip_address || d.IP_address || "").toString().trim())
    .filter(Boolean);
}

// ping helpers (cache + concurrency)
const cache = new Map();
async function pingDevice(ip) {
  if (!ip) return "IP Address Missing";
  return await pingHost(ip);
}
// mirror earlier file behavior: clear cache once at startup (same as old file)
cache.clear();

async function pingDevices(devices) {
  const limit = pLimit(20);
  await Promise.all(
    (devices || []).map(dev =>
      limit(async () => {
        const ip = (dev.ip_address || dev.IP_address || "").toString().trim();
        const status = cache.get(ip) || (await pingDevice(ip));
        cache.set(ip, status);
        dev.status = status;
      })
    )
  );
}

// Summary calculators
function calculateSummary(groups) {
  const summary = {};
  for (const [k, list] of Object.entries(groups)) {
    const total = (list || []).length;
    const online = (list || []).filter(d => d.status === "Online").length;
    summary[k] = { total, online, offline: total - online };
  }

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
        if (deviceObj._type_for_ui.toLowerCase() === "dbdetails") {
            document.getElementById("device-type").value = "dbdetails";
        }

        // Device fields
        document.getElementById("device-name").value =
            deviceObj.cameraname || deviceObj.controllername || deviceObj.archivername || deviceObj.servername || deviceObj.hostname || "";
        document.getElementById("device-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";
        document.getElementById("device-location").value = deviceObj.Location || deviceObj.location || "";
        document.getElementById("device-city").value = deviceObj.City || deviceObj.city || "";
        document.getElementById("form-device-details").value = deviceObj.device_details || "";
        document.getElementById("device-hyperlink").value = deviceObj.hyperlink || "";
        document.getElementById("device-remark").value = deviceObj.remark || "";
        document.getElementById("device-old-ip").value = deviceObj.IP_address || deviceObj.ip_address || "";
        document.getElementById("Host-Name").value = deviceObj.hostname || "";
        document.getElementById("PC-Name").value = deviceObj.pc_name || "";
        document.getElementById("db-hostname").value = deviceObj.hostname || "";
        document.getElementById("db-application").value = deviceObj.application || "";
        document.getElementById("db-windows-server").value =deviceObj.windows_server || "";




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
        case "dbdetails": return "dbdetails";
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
            mapped.db_hostname = body.db_hostname;
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
        device_details: document.getElementById("form-device-details").value,
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




function validateRequiredFields() {
    let type = document.getElementById("device-type").value;

    // Base required fields
    let required = [
        { id: "device-name", label: "Device Name" },
        { id: "device-ip", label: "IP Address" },
        { id: "device-location", label: "Location" },
        { id: "device-city", label: "City" }
    ];

    // Add "added by" when ADD mode is active (box visible)
    if (document.getElementById("added-by-box").style.display !== "none") {
        required.push({ id: "device-added-by", label: "Added By" });
    }

    // Add "updated by" when UPDATE mode is active (box visible)
    if (document.getElementById("updated-by-box").style.display !== "none") {
        required.push({ id: "device-updated-by", label: "Updated By" });
    }

    // CAMERA fields
    if (type === "camera") {
        required.push({ id: "form-device-details", label: "Camera Details" });
    }

    // PC DETAILS replaces all except name/ip/location/city
    if (type === "pcdetails") {
        required = [
            { id: "Host-Name", label: "Host Name" },
            { id: "PC-Name", label: "PC Name" }
        ];

        // Add / Update boxes still required
        if (document.getElementById("added-by-box").style.display !== "none") {
            required.push({ id: "device-added-by", label: "Added By" });
        }
        if (document.getElementById("updated-by-box").style.display !== "none") {
            required.push({ id: "device-updated-by", label: "Updated By" });
        }
    }

    // DB DETAILS replaces all fields
    if (type === "dbdetails") {
        required = [
            { id: "db-hostname", label: "DB Host Name" },
            { id: "db-application", label: "DB Application" },
            { id: "db-windows-server", label: "Windows Server Version" }
        ];

        // Add / Update boxes still required
        if (document.getElementById("added-by-box").style.display !== "none") {
            required.push({ id: "device-added-by", label: "Added By" });
        }
        if (document.getElementById("updated-by-box").style.display !== "none") {
            required.push({ id: "device-updated-by", label: "Updated By" });
        }
    }

    // Validate each field
    for (let field of required) {
        let el = document.getElementById(field.id);

        // Check only if field is visible
        if (el && el.offsetParent !== null) {
            if (el.value.trim() === "") {
                el.style.border = "2px solid red";
                alert(`Please enter ${field.label}`);
                el.focus();
                return false;
            } else {
                el.style.border = "";
            }
        }
    }

    return true;
}
