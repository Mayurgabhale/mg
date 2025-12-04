ok. now this edit and add new device code is correct or not
if no then read the bellow al bakend code and give me correct code, ok
alos when i slect controlle that time alos i door and reader is ok it is correct or no
what is the logic for this 

// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️
/* ----- Device Add/Edit/Delete UI helpers ----- */
function openAddDevice() {
    showDeviceModal("add");
}

// show modal (mode = 'add' | 'edit'), deviceObj is optional for edit

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

// hide modal


// submit handler for add/edit

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



// cancel & close
document.getElementById("device-cancel").addEventListener("click", hideDeviceModal);

// delete handler
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


/* ---------- helper to wire edit action to device cards ----------
   Call openEditForDeviceFromIP(ip) when you want to open edit modal for a specific device.
   For example: add an 'Edit' button on each device card that calls this with the data-ip attribute.
*/
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
// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️




// src/services/excelService.js
// DB-backed version that matches the logic/shape of the old Excel-based service.
// Exports:
// fetchGlobalData, fetchRegionData, fetchAllIpAddress, ipRegionMap,
// getDeviceInfo, addDevice, updateDevice, deleteDevice, getControllersList, getControllerDoors

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
      break;

    case "archivers":
      dev.archivername = row.archivername || null;
      dev.ip_address = row.ip_address || null;
      dev.IP_address = row.ip_address || null;
      dev.location = row.location || null;
      dev.city = row.city || null;
      break;

    case "controllers":
      dev.controllername = row.controllername || null;
      dev.ip_address = row.ip_address || null;
      dev.IP_address = row.ip_address || null;
      dev.location = row.location || null;
      dev.city = row.city || null;
      break;

    case "servers":
      dev.servername = row.servername || null;
      dev.ip_address = row.ip_address || null;
      dev.IP_address = row.ip_address || null;
      dev.location = row.location || null;
      dev.city = row.city || null;
      break;

    case "dbdetails":
      dev.location = row.location || null;
      dev.city = row.city || null;
      dev.hostname = row.hostname || null;
      dev.ip_address = row.ip_address || null;
      dev.IP_address = row.ip_address || null;
      dev.application = row.application || null;
      dev.windows_server = row.windows_server || null;
      break;

    case "pc_details":
      dev.hostname = row.hostname || null;
      dev.ip_address = row.ip_address || null;
      dev.IP_address = row.ip_address || null;
      dev.location = row.location || null;
      dev.city = row.city || null;
      dev.pc_name = row.pc_name || null;
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
  return {
    totalDevices: Object.values(summary).reduce((s, g) => s + g.total, 0),
    totalOnlineDevices: Object.values(summary).reduce((s, g) => s + g.online, 0),
    totalOfflineDevices: Object.values(summary).reduce((s, g) => s + g.offline, 0),
    ...summary,
  };
}

// Accessors
function getDeviceInfo(ip) {
  for (const list of Object.values(allData)) {
    if (!Array.isArray(list)) continue; // skip controller_doors map entries if any
    const dev = list.find(d => (d.ip_address || d.IP_address) === ip);
    if (dev) return dev;
  }
  return null;
}

function getControllersList() {
  return (allData.controllers || []).map(c => ({ ...c }));
}

// get doors for a controller IP (returns door objects with location/city)
function getControllerDoors(controllerIp) {
  return allData.controller_doors.filter(d => d.controller_ip === controllerIp);
}

// find device by ip in allData and return {listName, idx, device}
function findInAllData(ip) {
  for (const [listName, list] of Object.entries(allData)) {
    if (!Array.isArray(list)) continue;
    const idx = (list || []).findIndex(d => (d.ip_address || d.IP_address) === ip);
    if (idx !== -1) return { listName, idx, device: list[idx] };
  }
  return null;
}

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

// Delete device
function deleteDevice(ip) {
  const found = findInAllData(ip);
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
  if (!table) throw new Error("Unsupported device type for delete: " + listName);

  db.prepare(`DELETE FROM ${table} WHERE ip_address = ?`).run(ip);
  allData[listName].splice(idx, 1);
  rebuildIpRegionMap();
  return true;
}

// Public functions: fetchGlobalData, fetchRegionData
async function fetchGlobalData() {
  const all = [
    ...allData.cameras,
    ...allData.archivers,
    ...allData.controllers,
    ...allData.servers,
    ...allData.pcDetails,
    ...allData.DBDetails,
  ];
  await pingDevices(all);
  return { summary: calculateSummary(allData), details: allData };
}

async function fetchRegionData(regionName) {
  const filter = list =>
    (list || []).filter(d => (d.location || "").toString().toLowerCase() === regionName.toLowerCase());

  const regionDevices = {
    cameras: filter(allData.cameras),
    archivers: filter(allData.archivers),
    controllers: filter(allData.controllers),
    servers: filter(allData.servers),
    pcDetails: filter(allData.pcDetails),
    DBDetails: filter(allData.DBDetails),
    controller_doors: allData.controller_doors.filter(d =>
      // include door if its location matches OR its parent controller has that region
      ((d.location || "").toString().toLowerCase() === regionName.toLowerCase()) ||
      allData.controllers.some(ctrl =>
        ((ctrl.ip_address || ctrl.IP_address) === d.controller_ip) &&
        ((ctrl.location || "").toString().toLowerCase() === regionName.toLowerCase())
      )
    ),
  };

  // Ping devices for this region (only device lists, not doors)
  const allToPing = [].concat(
    regionDevices.cameras,
    regionDevices.archivers,
    regionDevices.controllers,
    regionDevices.servers,
    regionDevices.pcDetails,
    regionDevices.DBDetails
  );
  await pingDevices(allToPing);
  return { summary: calculateSummary(regionDevices), details: regionDevices };
}

// Export public API
module.exports = {
  fetchGlobalData,
  fetchRegionData,
  fetchAllIpAddress,
  ipRegionMap,
  getDeviceInfo,
  addDevice,
  updateDevice,
  deleteDevice,
  getControllersList,
  getControllerDoors,
};




// ⬇️⬇️⬇️⬇️⬇️ from DB used

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const { pingHost } = require("./services/pingService");
const { DateTime } = require("luxon");

const regionRoutes = require("./routes/regionRoutes");
const deviceRoutes = require("./routes/deviceRoutes");

const {
  fetchAllIpAddress,
  ipRegionMap,
  getDeviceInfo,
  getControllersList,
  getControllerDoors
} = require("./services/excelService");

const { sendTeamsAlert } = require("./services/teamsService");

const app = express();
const PORT = process.env.PORT || 80;

// ------------------ Helpers ------------------
function pruneOldEntries(entries, days = 30) {
  const cutoff = DateTime.now().minus({ days }).toMillis();
  return entries.filter(e => DateTime.fromISO(e.timestamp).toMillis() >= cutoff);
}

function getLogFileForDate(dt) {
  return `./deviceLogs-${dt.toISODate()}.json`;
}

function safeJsonParse(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8").trim();
    if (!content) return {};
    return JSON.parse(content);
  } catch (err) {
    console.error("❌ Corrupted JSON file detected:", filePath);
    console.error("Error:", err.message);
    return {};
  }
}

// ------------------ Middleware ------------------
app.use(cors({
  origin: "http://127.0.0.1:5500",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));
app.use(bodyParser.json());

// ------------------ Routes ------------------
app.use("/api/regions", regionRoutes);
app.use("/api/devices", deviceRoutes);

// ------------------ Device Status ------------------
let deviceStatus = {};
const today = DateTime.now().setZone("Asia/Kolkata");
const todayLogFile = getLogFileForDate(today);
let todayLogs = fs.existsSync(todayLogFile) ? safeJsonParse(todayLogFile) : {};

function saveTodayLogs() {
  fs.writeFileSync(todayLogFile, JSON.stringify(todayLogs, null, 2));
}

function logDeviceChange(ip, status) {
  const timestamp = DateTime.now().setZone("Asia/Kolkata").toISO();
  const arr = (todayLogs[ip] = todayLogs[ip] || []);
  const last = arr[arr.length - 1];
  if (!last || last.status !== status) {
    arr.push({ status, timestamp });
    todayLogs[ip] = pruneOldEntries(arr, 30);
    saveTodayLogs();
  }
}

async function pingDevices() {
  const limit = require("p-limit")(20);
  const devices = fetchAllIpAddress();

  await Promise.all(
    devices.map(ip =>
      limit(async () => {
        const newStatus = await pingHost(ip);
        if (deviceStatus[ip] !== newStatus) {
          logDeviceChange(ip, newStatus);
        }
        deviceStatus[ip] = newStatus;
      })
    )
  );

  buildControllerStatus();
  console.log("Updated device status:", deviceStatus);
}

// ------------------ Controller + Door Status ------------------
let fullStatus = [];

function buildControllerStatus() {
  const controllers = getControllersList(); // from DB

  fullStatus = controllers.map(ctrl => {
    const ip = (ctrl.IP_address || ctrl.ip_address || "").toString().trim();
    const status = deviceStatus[ip] || "Unknown";

    // Doors linked to this controller
    const doors = getControllerDoors(ip).map(d => ({
      door: d.door,
      reader: d.reader,
      status: status === "Online" ? "Online" : "Offline",
    }));

    return {
      controllername: ctrl.controllername,
      IP_address: ip,
      Location: ctrl.location || "Unknown",
      City: ctrl.city || "Unknown",
      controllerStatus: status,
      Doors: doors,
    };
  });
}

const notifiedOffline = new Set();

// ------------------ Ping Loop ------------------
setInterval(async () => {
  pingDevices();
}, 60_000);

(async () => {
  pingDevices();
})();

// ------------------ API Endpoints ------------------

// Real-time device status
app.get("/api/region/devices/status", (req, res) => {
  res.json(deviceStatus);
});

// Full history
app.get("/api/devices/history", (req, res) => {
  const files = fs.readdirSync(".").filter(f => f.startsWith("deviceLogs-") && f.endsWith(".json"));
  const combined = {};
  for (const f of files) {
    const dayLogs = safeJsonParse(f);
    for (const ip of Object.keys(dayLogs)) {
      combined[ip] = (combined[ip] || []).concat(dayLogs[ip]);
    }
  }
  for (const ip of Object.keys(combined)) {
    combined[ip] = pruneOldEntries(combined[ip], 30);
  }
  res.json(combined);
});

// Region-wise history
app.get("/api/region/:region/history", (req, res) => {
  const region = req.params.region.toLowerCase();
  const files = fs.readdirSync(".").filter(f => f.startsWith("deviceLogs-") && f.endsWith(".json"));
  const regionLogs = {};

  for (const f of files) {
    const dayLogs = safeJsonParse(f);
    for (const ip of Object.keys(dayLogs)) {
      if (ipRegionMap[ip] === region) {
        regionLogs[ip] = (regionLogs[ip] || []).concat(dayLogs[ip]);
      }
    }
  }

  if (!Object.keys(regionLogs).length) {
    return res.status(404).json({ message: `No device history found for region: ${region}` });
  }

  for (const ip of Object.keys(regionLogs)) {
    regionLogs[ip] = pruneOldEntries(regionLogs[ip], 30);
  }

  res.json(regionLogs);
});

// Single-device history
app.get("/api/device/history/:ip", (req, res) => {
  const ip = req.params.ip;
  const files = fs.readdirSync(".").filter(f => f.startsWith("deviceLogs-") && f.endsWith(".json"));
  let history = [];
  for (const f of files) {
    const dayLogs = safeJsonParse(f);
    if (dayLogs[ip]) history = history.concat(dayLogs[ip]);
  }
  if (!history.length) {
    return res.status(404).json({ message: "No history found for this device" });
  }
  history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  res.json({ ip, history });
});

// Get all controllers + doors
app.get("/api/controllers/status", (req, res) => {
  res.json(fullStatus);
});

// ------------------ Start Server ------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
