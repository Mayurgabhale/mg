ok data base is crete but data is not add in data base this is path fo exle file 

C:\Users\W0024618\Desktop\Backend\src\data\ArchiverData.xlsx
Sheet1
archivername	Ip_address	Location	City
Archiver Manila	10.193.132.8	APAC	Taguig City
Archiver Taguig City Philippines	10.194.2.190	APAC	Taguig City

C:\Users\W0024618\Desktop\Backend\src\data\CameraData.xlsx
Sheet1
cameraname 	Ip_address	Location	City	Deviec_details 	hyperlink	Remark
Green Zone to yellow zone passage - 10.199.10.20 (FLIR CM-3102-11-I T71552107) - 350	10.199.10.20	APAC	Pune Podium	FLIR		
IN-PNQ-PF - Green Zone Exit Passage 10.199.10.139	10.199.10.139	APAC	Pune Podium	FLIR		

C:\Users\W0024618\Desktop\Backend\src\data\ControllerData.xlsx
Sheet1
controllername	IP_address	Location	City
IN-PUN-2NDFLR-ISTAR PRO	10.199.13.10	APAC	Pune 2nd Floor
IN-PUN-PODIUM-ISTAR PRO-01	10.199.8.20	APAC	Pune Podium

C:\Users\W0024618\Desktop\Backend\src\data\DBDetails.xlsx
Sheet1
Location	City	HostName	Ip_address	Application	Windows Server
NAMER	Denver	SRVWUDEN0890v	10.58.118.22	CCURE MAS SQL DB	Windows Server 2019 Standard
NAMER	Denver	SRVWUDEN0190V	10.58.118.20	CCURE MAS APP	Windows Server 2016 Standard

C:\Users\W0024618\Desktop\Backend\src\data\PCDetails.xlsx
Hostname
HostName	Ip_address	Location	City	PC Name
WKSWUPUN4501	WKSWUPUN4501	APAC	Pune Podium	Screen 03
WKSPUN-392353	WKSPUN-392353	APAC	Pune Podium	Screen 04

C:\Users\W0024618\Desktop\Backend\src\data\ServerData.xlsx
Sheet1
servername 	IP_address	Location	City
Master Server 	10.58.111.20	NAMER	Denver Colorado
NAMER Server 	10.58.100.21	NAMER	Denver Colorado

C:\Users\W0024618\Desktop\Backend\src\data\ControllerDataWithDoorReader.json
[
    {
        "controllername": "IN-PUN-2NDFLR-ISTAR PRO",
        "IP_address": "10.199.13.10",
        "Location": "APAC",
        "City": "Pune 2nd Floor",
        "Doors": [
            {
                "Door": "APAC_IN_PUN_2NDFLR_IDF ROOM_10:05:86 Restricted Door",
                "Reader": "in:1"
            },
            {
                "Door": "APAC_IN_PUN_2NDFLR_UPS/ELEC ROOM Restricted Door_10:05:FE",
                "Reader": "in:1"
            },
            {
                "Door": "APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR_10:05:4B",
                "Reader": "in:1"
            },
            {
                "Door": "APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR_10:05:4B",
                "Reader": "out:1"
            },
            {
                "Door": "APAC_IN_PUN_2NDFLR_LIFTLOBBY TO RECEPTION EMTRY DOOR_10:05:74",
                "Reader": "in:1"
            },
            {
                "Door": "APAC_IN_PUN_2NDFLR_LIFTLOBBY TO WORKSTATION DOOR_10:05:F0",
                "Reader": ""
            }
        ]
    },
  -------------------
  C:\Users\W0024618\Desktop\Backend\setupDatabase.js
// setupDatabase.js
// --------------------------------------------------------
// Creates SQLite DB + tables + imports ALL Excel data
// Run: node setupDatabase.js
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
// CREATE TABLES (with added_by, updated_by, timestamps)
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
  reader TEXT
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
// Helper – Read Excel Sheet
// --------------------------------------------------------

function readSheet(file, sheet) {
  const fullPath = path.join(dataDir, file);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠ File missing: ${file}`);
    return [];
  }

  const workbook = xlsx.readFile(fullPath);
  const worksheet = workbook.Sheets[sheet];

  if (!worksheet) {
    console.log(`⚠ Sheet missing: ${sheet} in ${file}`);
    return [];
  }

  return xlsx.utils.sheet_to_json(worksheet);
}

// --------------------------------------------------------
// IMPORT DATA
// --------------------------------------------------------

console.log("📥 Importing Excel data...\n");

// ---------- Camera ----------
readSheet("CameraData.xlsx", "Camera").forEach(row => {
  db.prepare(`
    INSERT OR IGNORE INTO cameras 
    (cameraname, ip_address, location, city, device_details, hyperlink, remark, added_by, added_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    row.cameraname || null,
    row.Ip_address || null,
    row.Location || null,
    row.City || null,
    row.Deviec_details || null,
    row.hyperlink || null,
    row.Remark || null,
    "system-import"
  );
});
console.log("✔ Camera data imported");

// ---------- Archiver ----------
readSheet("ArchiverData.xlsx", "Archiver").forEach(row => {
  db.prepare(`
    INSERT OR IGNORE INTO archivers
    (archivername, ip_address, location, city, added_by, added_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `).run(
    row.archivername || null,
    row.Ip_address || null,
    row.Location || null,
    row.City || null,
    "system-import"
  );
});
console.log("✔ Archiver data imported");

// ---------- Controller ----------
readSheet("ControllerData.xlsx", "Controller").forEach(row => {
  db.prepare(`
    INSERT OR IGNORE INTO controllers
    (controllername, ip_address, location, city, added_by, added_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `).run(
    row.controllername || null,
    row.IP_address || null,
    row.Location || null,
    row.City || null,
    "system-import"
  );
});
console.log("✔ Controller data imported");

// ---------- Controller Doors JSON ----------
const doorsFile = path.join(dataDir, "ControllerDoors.json");
if (fs.existsSync(doorsFile)) {
  const controllerDoors = JSON.parse(fs.readFileSync(doorsFile));
  controllerDoors.forEach(ctrl => {
    ctrl.Doors.forEach(door => {
      db.prepare(`
        INSERT INTO controller_doors (controller_ip, door, reader)
        VALUES (?, ?, ?)
      `).run(ctrl.IP_address, door.Door, door.Reader);
    });
  });
  console.log("✔ Controller doors imported");
} else {
  console.log("⚠ ControllerDoors.json missing — skipping");
}

// ---------- Servers ----------
readSheet("ServerData.xlsx", "Server").forEach(row => {
  db.prepare(`
    INSERT OR IGNORE INTO servers
    (servername, ip_address, location, city, added_by, added_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `).run(
    row.servername || null,
    row.IP_address || null,
    row.Location || null,
    row.City || null,
    "system-import"
  );
});
console.log("✔ Server data imported");

// ---------- DB Details ----------
readSheet("DBDetails.xlsx", "DBDetails").forEach(row => {
  db.prepare(`
    INSERT OR IGNORE INTO dbdetails
    (location, city, hostname, ip_address, application, windows_server, added_by, added_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    row.Location || null,
    row.City || null,
    row.HostName || null,
    row.Ip_address || null,
    row.Application || null,
    row["Windows Server"] || null,
    "system-import"
  );
});
console.log("✔ DB details imported");

// ---------- PC Details ----------
readSheet("PCDetails.xlsx", "PCDetails").forEach(row => {
  db.prepare(`
    INSERT OR IGNORE INTO pc_details
    (hostname, ip_address, location, city, pc_name, added_by, added_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    row.HostName || null,
    row.Ip_address || null,
    row.Location || null,
    row.City || null,
    row["PC Name"] || null,
    "system-import"
  );
});
console.log("✔ PC details imported");

console.log("\n🎉 DATABASE SETUP COMPLETE!");
console.log("📁 Database created at: src/data/devices.db\n");

-----------
  PS C:\Users\W0024618\Desktop\Backend> node setupDatabase.js

🚀 Creating SQLite Database and Tables...

✔ All tables created successfully.

📥 Importing Excel data...

⚠ Sheet missing: Camera in CameraData.xlsx
✔ Camera data imported
⚠ Sheet missing: Archiver in ArchiverData.xlsx
✔ Archiver data imported
⚠ Sheet missing: Controller in ControllerData.xlsx
✔ Controller data imported
⚠ ControllerDoors.json missing — skipping
⚠ Sheet missing: Server in ServerData.xlsx
✔ Server data imported
⚠ Sheet missing: DBDetails in DBDetails.xlsx
✔ DB details imported
⚠ Sheet missing: PCDetails in PCDetails.xlsx
✔ PC details imported

🎉 DATABASE SETUP COMPLETE!
📁 Database created at: src/data/devices.db

PS C:\Users\W0024618\Desktop\Backend> 
