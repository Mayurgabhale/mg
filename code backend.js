read this and give me 
C:\Users\W0024618\Desktop\Backend\src\services\excelService.js this file ok 

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
