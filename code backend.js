// setupDatabase.js
// --------------------------------------------------------
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

// Create DB folder if missing
const dataDir = path.join(__dirname, "src/data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Open database
const db = new Database(path.join(dataDir, "devices.db"));

console.log("\n🚀 Creating SQLite Database and Tables...\n");
// --------------------------------------------------------
// CREATE TABLES
// --------------------------------------------------------
db.exec(`
CREATE TABLE IF NOT EXISTS cameras (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cameraname TEXT,
  ip_address TEXT UNIQUE,
  location TEXT,
  city TEXT,
  device_details TEXT,
  hyperlink TEXT,
  remark TEXT,
  added_by TEXT,
  updated_by TEXT,
  added_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS archivers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  archivername TEXT,
  ip_address TEXT UNIQUE,
  location TEXT,
  city TEXT,
  added_by TEXT,
  updated_by TEXT,
  added_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS controllers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  controllername TEXT,
  ip_address TEXT UNIQUE,
  location TEXT,
  city TEXT,
  added_by TEXT,
  updated_by TEXT,
  added_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS controller_doors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  controller_ip TEXT,
  door TEXT,
  reader TEXT,
  location TEXT,
  city TEXT,
  added_by TEXT,
  updated_by TEXT,
  added_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS servers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  servername TEXT,
  ip_address TEXT UNIQUE,
  location TEXT,
  city TEXT,
  added_by TEXT,
  updated_by TEXT,
  added_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS dbdetails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  location TEXT,
  city TEXT,
  hostname TEXT,
  ip_address TEXT UNIQUE,
  application TEXT,
  windows_server TEXT,
  added_by TEXT,
  updated_by TEXT,
  added_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS pc_details (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hostname TEXT,
  ip_address TEXT UNIQUE,
  location TEXT,
  city TEXT,
  pc_name TEXT,
  added_by TEXT,
  updated_by TEXT,
  added_at TEXT,
  updated_at TEXT
);
`);

console.log("✔ All tables created successfully.\n");

// --------------------------------------------------------
// CLEAN EXCEL KEYS (MAIN FIX FOR YOUR ISSUE)
// --------------------------------------------------------
function cleanKeys(row) {
  const cleaned = {};
  Object.keys(row).forEach(key => {
    const newKey = key.trim().toLowerCase().replace(/\s+/g, "_");
    cleaned[newKey] = row[key];
  });
  return cleaned;
}

// --------------------------------------------------------
// Helper: ALWAYS READ FIRST SHEET
// --------------------------------------------------------
function readSheet(file) {
  const fullPath = path.join(dataDir, file);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠ File missing: ${file}`);
    return [];
  }

  const workbook = xlsx.readFile(fullPath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    console.log(`⚠ Sheet missing: ${file}`);
    return [];
  }

  return xlsx.utils.sheet_to_json(worksheet).map(cleanKeys);
}

// --------------------------------------------------------
// IMPORT DATA
// --------------------------------------------------------

console.log("📥 Importing Excel data...\n");

// ---------- Camera ----------
readSheet("CameraData.xlsx").forEach(row => {
  db.prepare(`
    INSERT OR IGNORE INTO cameras 
    (cameraname, ip_address, location, city, device_details, hyperlink, remark, added_by, added_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    row.cameraname || null,
    row.ip_address || row.ipaddress || null,
    row.location || null,
    row.city || null,
    row.device_details || row.deviec_details || null,
    row.hyperlink || null,
    row.remark || null,
    "system-import"
  );
});
console.log("✔ Camera data imported");

// ---------- Archiver ----------
readSheet("ArchiverData.xlsx").forEach(row => {
  db.prepare(`
    INSERT OR IGNORE INTO archivers
    (archivername, ip_address, location, city, added_by, added_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `).run(
    row.archivername || null,
    row.ip_address || row.ipaddress || null,
    row.location || null,
    row.city || null,
    "system-import"
  );
});
console.log("✔ Archiver data imported");

// ---------- Controller ----------
readSheet("ControllerData.xlsx").forEach(row => {
  db.prepare(`
    INSERT OR IGNORE INTO controllers
    (controllername, ip_address, location, city, added_by, added_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `).run(
    row.controllername || null,
    row.ip_address || row.ipaddress || null,
    row.location || null,
    row.city || null,
    "system-import"
  );
});
console.log("✔ Controller data imported");

// ---------- Controller Doors JSON ----------
const doorsFile = path.join(dataDir, "ControllerDataWithDoorReader.json");
if (fs.existsSync(doorsFile)) {
  const controllerDoors = JSON.parse(fs.readFileSync(doorsFile));

  controllerDoors.forEach(ctrl => {
    ctrl.Doors.forEach(door => {
      db.prepare(`
        INSERT INTO controller_doors 
        (controller_ip, door, reader, location, city, added_by, added_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(
        ctrl.IP_address,
        door.Door,
        door.Reader,
        ctrl.Location || null,
        ctrl.City || null,
        "system-import"
      );
    });
  });

  console.log("✔ Controller doors imported");
} else {
  console.log("⚠ ControllerDataWithDoorReader.json missing — skipping");
}

// ---------- Servers ----------
readSheet("ServerData.xlsx").forEach(row => {
  db.prepare(`
    INSERT OR IGNORE INTO servers
    (servername, ip_address, location, city, added_by, added_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `).run(
    row.servername || null,
    row.ip_address || row.ipaddress || null,
    row.location || null,
    row.city || null,
    "system-import"
  );
});
console.log("✔ Server data imported");

// ---------- DB Details ----------
readSheet("DBDetails.xlsx").forEach(row => {
  db.prepare(`
    INSERT OR IGNORE INTO dbdetails
    (location, city, hostname, ip_address, application, windows_server, added_by, added_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    row.location || null,
    row.city || null,
    row.hostname || null,
    row.ip_address || row.ipaddress || null,
    row.application || null,
    row.windows_server || null,
    "system-import"
  );
});
console.log("✔ DB details imported");

// ---------- PC Details ----------
readSheet("PCDetails.xlsx").forEach(row => {
  db.prepare(`
    INSERT OR IGNORE INTO pc_details
    (hostname, ip_address, location, city, pc_name, added_by, added_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    row.hostname || null,
    row.ip_address || row.ipaddress || null,
    row.location || null,
    row.city || null,
    row.pc_name || null,
    "system-import"
  );
});
console.log("✔ PC details imported");

console.log("\n🎉 DATABASE SETUP COMPLETE!");
console.log("📁 Database created at: src/data/devices.db\n");


// // npm install better-sqlite3    ⬇️⬇️⬇️⬇️⬇️

ok, read the above file ony read for refrese that is not any use  in this ok 
and give me this corrrect fiel wiht perfect ok 


// src/services/excelService.js
// Uses SQLite (src/data/devices.db) as the single source of truth.
// Exports the same functions your app expects:
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

// In-memory cache (same shape as previous implementation) + controller_doors
let allData = {
  archivers: [],
  controllers: [],
  cameras: [],
  servers: [],
  pcDetails: [],
  DBDetails: [],
  controller_doors: [], // NEW: doors linked to controllers
};

// ip -> region map
let ipRegionMap = {};

// small helper: normalize keys the same way your old code did
function normalizeKey(k) {
  return k.toString().trim().toLowerCase().replace(/\s+/g, "_");
}

// Convert DB row for a given table into the normalized object shape your app expects
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
      Object.keys(row).forEach(k => {
        dev[normalizeKey(k)] = row[k];
      });
  }

  // common metadata used by other parts of your app
  dev.history = Array.isArray(row.history) ? row.history : [];
  if (row.status) dev.status = row.status;
  return dev;
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

    // controller_doors (NEW)
    // columns expected: id, controller_ip, door, reader
    const doors = db.prepare("SELECT * FROM controller_doors").all();
    allData.controller_doors = doors.map(r => ({
      id: r.id,
      controller_ip: r.controller_ip,
      door: r.door,
      reader: r.reader
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
loadDbData();

// rebuild ipRegionMap (called after any mutation)
function rebuildIpRegionMap() {
  ipRegionMap = {};
  Object.values(allData).flat().forEach(dev => {
    const ip = (dev.ip_address || dev.IP_address || "").toString().trim();
    if (ip && dev.location) {
      ipRegionMap[ip] = (dev.location || "").toString().toLowerCase();
    }
  });
}

// Fetch all IP addresses (array of ip strings) — used by ping loop
function fetchAllIpAddress() {
  // exclude non-ip entries (controller_doors don't have ip)
  return [
    ...allData.cameras,
    ...allData.archivers,
    ...allData.controllers,
    ...allData.servers,
    ...allData.pcDetails,
    ...allData.DBDetails,
  ].map(d => d.ip_address).filter(Boolean);
}

// ping helpers (cache + concurrency)
const cache = new Map();
async function pingDevice(ip) {
  if (!ip) return "IP Address Missing";
  return await pingHost(ip);
}

async function pingDevices(devices) {
  const limit = pLimit(20);
  await Promise.all(
    devices.map(dev =>
      limit(async () => {
        const ip = (dev.ip_address || dev.IP_address || "").toString().trim();
        const status = cache.get(ip) || await pingDevice(ip);
        cache.set(ip, status);
        dev.status = status;
      })
    )
  );
}

// Summary calculators (same logic as before)
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
    ...summary
  };
}

// Accessors
function getDeviceInfo(ip) {
  for (const list of Object.values(allData)) {
    const dev = list.find(d => (d.ip_address || d.IP_address) === ip);
    if (dev) return dev;
  }
  return null;
}

function getControllersList() {
  // return shallow copy
  return (allData.controllers || []).map(c => ({ ...c }));
}

// get doors for a controller IP
function getControllerDoors(controllerIp) {
  return allData.controller_doors.filter(d => d.controller_ip === controllerIp);
}

// Add device: type must match one of keys in allData
// Supported types (same as old code): archivers, controllers, cameras, servers, pcDetails, DBDetails
function addDevice(type, deviceObj) {
  if (!allData[type]) throw new Error("Invalid device type: " + type);

  // normalize keys to match DB columns
  const norm = {};
  Object.entries(deviceObj).forEach(([k, v]) => {
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

  // insert into DB (fields per table)
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

  // table mapping
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
  // Update DB — construct update statements per table
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

  // If IP changed (updateFields contains ip_address), handle DB ip update
  if (updateFields.ip_address && updateFields.ip_address !== oldIp) {
    const newIp = updateFields.ip_address.toString().trim();
    db.prepare(`UPDATE ${table} SET ip_address = ? WHERE ip_address = ?`).run(newIp, oldIp);
    // sync in-memory object ip_address field
    allData[listName][idx].ip_address = newIp;
    allData[listName][idx].IP_address = newIp;
  }

  rebuildIpRegionMap();
  return allData[listName][idx];
}

// find device by ip in allData and return {listName, idx, device}
function findInAllData(ip) {
  for (const [listName, list] of Object.entries(allData)) {
    const idx = list.findIndex(d => (d.ip_address || d.IP_address) === ip);
    if (idx !== -1) return { listName, idx, device: list[idx] };
  }
  return null;
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

// Public functions: fetchGlobalData, fetchRegionData (same semantics as before)
async function fetchGlobalData() {
  // gather all devices (flatten) and ping them
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
  const filter = list => list.filter(d => (d.location || "").toString().toLowerCase() === regionName.toLowerCase());
  const regionDevices = {
    cameras: filter(allData.cameras),
    archivers: filter(allData.archivers),
    controllers: filter(allData.controllers),
    servers: filter(allData.servers),
    pcDetails: filter(allData.pcDetails),
    DBDetails: filter(allData.DBDetails),
    // include doors for controllers in this region
    controller_doors: allData.controller_doors.filter(d =>
      allData.controllers.some(ctrl =>
        (ctrl.ip_address || ctrl.IP_address) === d.controller_ip && (ctrl.location || "").toString().toLowerCase() === regionName.toLowerCase()
      )
    )
  };
  const allToPing = [].concat(...Object.values(regionDevices).filter(v => Array.isArray(v)));
  await pingDevices(allToPing);
  return { summary: calculateSummary(regionDevices), details: regionDevices };
}

// Initialize cache from DB
// (already called earlier, but safe to call again if needed)
loadDbData();

// Export public API (same function names as before) including getControllerDoors
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
