// setupDatabase.js
// --------------------------------------------------------
// This script creates SQLite DB + tables + imports ALL Excel data
// Run:  node setupDatabase.js
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
// STEP 1: CREATE TABLES
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
  remark TEXT
);

CREATE TABLE IF NOT EXISTS archivers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  archivername TEXT,
  ip_address TEXT UNIQUE,
  location TEXT,
  city TEXT
);

CREATE TABLE IF NOT EXISTS controllers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  controllername TEXT,
  ip_address TEXT UNIQUE,
  location TEXT,
  city TEXT
);

CREATE TABLE IF NOT EXISTS controller_doors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  controller_ip TEXT,
  door TEXT,
  reader TEXT,
  FOREIGN KEY(controller_ip) REFERENCES controllers(ip_address)
);

CREATE TABLE IF NOT EXISTS servers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  servername TEXT,
  ip_address TEXT UNIQUE,
  location TEXT,
  city TEXT
);

CREATE TABLE IF NOT EXISTS dbdetails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  location TEXT,
  city TEXT,
  hostname TEXT,
  ip_address TEXT UNIQUE,
  application TEXT,
  windows_server TEXT
);

CREATE TABLE IF NOT EXISTS pc_details (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hostname TEXT,
  ip_address TEXT UNIQUE,
  location TEXT,
  city TEXT,
  pc_name TEXT
);
`);

console.log("✔ All tables created successfully.\n");

// --------------------------------------------------------
// STEP 2: HELPER FUNCTION TO READ EXCEL SHEETS
// --------------------------------------------------------

function readSheet(file, sheet) {
  const fullPath = path.join(dataDir, file);
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠ File missing: ${file}`);
    return [];
  }

  const wb = xlsx.readFile(fullPath);
  const ws = wb.Sheets[sheet];
  if (!ws) {
    console.log(`⚠ Sheet missing: ${sheet} in ${file}`);
    return [];
  }

  return xlsx.utils.sheet_to_json(ws);
}

// --------------------------------------------------------
// STEP 3: IMPORT DATA
// --------------------------------------------------------

console.log("📥 Importing Excel data...\n");

// ---------- Camera ----------
readSheet("CameraData.xlsx", "Camera").forEach(row => {
  db.prepare(`
    INSERT OR IGNORE INTO cameras 
    (cameraname, ip_address, location, city, device_details, hyperlink, remark)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    row.cameraname || null,
    row.Ip_address || null,
    row.Location || null,
    row.City || null,
    row.Deviec_details || null,
    row.hyperlink || null,
    row.Remark || null
  );
});
console.log("✔ Camera data imported");

// ---------- Archiver ----------
readSheet("ArchiverData.xlsx", "Archiver").forEach(row => {
  db.prepare(`
    INSERT OR IGNORE INTO archivers (archivername, ip_address, location, city)
    VALUES (?, ?, ?, ?)
  `).run(
    row.archivername || null,
    row.Ip_address || null,
    row.Location || null,
    row.City || null
  );
});
console.log("✔ Archiver data imported");

// ---------- Controller ----------
readSheet("ControllerData.xlsx", "Controller").forEach(row => {
  db.prepare(`
    INSERT OR IGNORE INTO controllers (controllername, ip_address, location, city)
    VALUES (?, ?, ?, ?)
  `).run(
    row.controllername || null,
    row.IP_address || null,
    row.Location || null,
    row.City || null
  );
});
console.log("✔ Controller data imported");

// ---------- Controller Doors from JSON ----------
const doorsPath = path.join(dataDir, "ControllerDoors.json");
if (fs.existsSync(doorsPath)) {
  const controllerDoors = JSON.parse(fs.readFileSync(doorsPath));
  controllerDoors.forEach(ctrl => {
    ctrl.Doors.forEach(door => {
      db.prepare(`
        INSERT INTO controller_doors (controller_ip, door, reader)
        VALUES (?, ?, ?)
      `).run(ctrl.IP_address, door.Door, door.Reader);
    });
  });
  console.log("✔ Controller door data imported");
} else {
  console.log("⚠ ControllerDoors.json missing — skipping doors.");
}

// ---------- Server ----------
readSheet("ServerData.xlsx", "Server").forEach(row => {
  db.prepare(`
    INSERT OR IGNORE INTO servers (servername, ip_address, location, city)
    VALUES (?, ?, ?, ?)
  `).run(
    row.servername || null,
    row.IP_address || null,
    row.Location || null,
    row.City || null
  );
});
console.log("✔ Server data imported");

// ---------- DB Details ----------
readSheet("DBDetails.xlsx", "DBDetails").forEach(row => {
  db.prepare(`
    INSERT OR IGNORE INTO dbdetails 
    (location, city, hostname, ip_address, application, windows_server)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    row.Location || null,
    row.City || null,
    row.HostName || null,
    row.Ip_address || null,
    row.Application || null,
    row["Windows Server"] || null
  );
});
console.log("✔ DB details imported");

// ---------- PC Details ----------
readSheet("PCDetails.xlsx", "PCDetails").forEach(row => {
  db.prepare(`
    INSERT OR IGNORE INTO pc_details 
    (hostname, ip_address, location, city, pc_name)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    row.HostName || null,
    row.Ip_address || null,
    row.Location || null,
    row.City || null,
    row["PC Name"] || null
  );
});
console.log("✔ PC details imported");

// --------------------------------------------------------

console.log("\n🎉 DATABASE SETUP COMPLETE!");
console.log("📁 Database file created at: src/data/devices.db\n");