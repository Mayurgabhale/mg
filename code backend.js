// excelService.js

const Database = require("better-sqlite3");
const path = require("path");

// Path to SQLite DB
const dbPath = path.join(__dirname, "data", "devices.db");
const db = new Database(dbPath);

// ------------------------------------------------------
// MEMORY DATA STRUCTURE
// ------------------------------------------------------
let allData = {
  archivers: [],
  controllers: [],
  cameras: [],
  servers: [],
  pcDetails: [],
  DBDetails: [],
  controller_doors: []   // ⬅ NEW
};

// ------------------------------------------------------
// UTILITY: MAP A DB ROW INTO A GENERIC DEVICE OBJECT
// ------------------------------------------------------
function mapRowToDevice(deviceType, row) {
  return {
    deviceType,
    region: row.region || "Unknown",
    building: row.building || "Unknown",
    floor: row.floor || "Unknown",
    deviceName: row.name || row.deviceName || "Unknown",
    ipAddress: row.ip_address || row.ip || null,
    macAddress: row.mac_address || row.mac || null,
    status: "Unknown"
  };
}

// ------------------------------------------------------
// LOAD DATA FROM SQLITE ON STARTUP
// ------------------------------------------------------
function loadDbData() {
  try {
    // ARCHIVERS
    const arch = db.prepare("SELECT * FROM archiver").all();
    allData.archivers = arch.map(r => mapRowToDevice("archiver", r));

    // CONTROLLERS
    const ctrls = db.prepare("SELECT * FROM controller").all();
    allData.controllers = ctrls.map(r => mapRowToDevice("controller", r));

    // CAMERAS
    const cams = db.prepare("SELECT * FROM camera").all();
    allData.cameras = cams.map(r => mapRowToDevice("camera", r));

    // SERVERS
    const srvs = db.prepare("SELECT * FROM server").all();
    allData.servers = srvs.map(r => mapRowToDevice("server", r));

    // PC DETAILS
    const pcs = db.prepare("SELECT * FROM pc_details").all();
    allData.pcDetails = pcs.map(r => mapRowToDevice("pc_details", r));

    // DB DETAILS
    const dbs = db.prepare("SELECT * FROM dbdetails").all();
    allData.DBDetails = dbs.map(r => mapRowToDevice("dbdetails", r));

    // -------------------------------------------------
    // 🔥 NEW: LOAD CONTROLLER DOORS FROM SQLite
    // -------------------------------------------------
    const doors = db.prepare("SELECT * FROM controller_doors").all();
    allData.controller_doors = doors.map(r => ({
      controller_ip: r.controller_ip,
      door: r.door,
      reader: r.reader
    }));

    console.log("✔ SQLite data loaded successfully.");

  } catch (err) {
    console.error("❌ Error loading DB data:", err);
  }
}

// Call once on server start
loadDbData();

// ------------------------------------------------------
// SUMMARY CALCULATION (No changes needed)
// ------------------------------------------------------
function calculateSummary(data) {
  return {
    totalArchivers: data.archivers.length,
    totalControllers: data.controllers.length,
    totalCameras: data.cameras.length,
    totalServers: data.servers.length,
    totalPCs: data.pcDetails.length,
    totalDBs: data.DBDetails.length,
    totalControllerDoors: data.controller_doors.length
  };
}

// ------------------------------------------------------
// FETCH ALL DATA (for Global Dashboard)
// ------------------------------------------------------
function fetchGlobalData() {
  return {
    summary: calculateSummary(allData),
    details: allData
  };
}

// ------------------------------------------------------
// REGION-BASED API (controller_doors included automatically)
// ------------------------------------------------------
function fetchRegionData(regionName) {
  let filtered = {
    archivers: allData.archivers.filter(d => d.region === regionName),
    controllers: allData.controllers.filter(d => d.region === regionName),
    cameras: allData.cameras.filter(d => d.region === regionName),
    servers: allData.servers.filter(d => d.region === regionName),
    pcDetails: allData.pcDetails.filter(d => d.region === regionName),
    DBDetails: allData.DBDetails.filter(d => d.region === regionName),

    // Doors grouped by controllers in that region
    controller_doors: allData.controller_doors.filter(d =>
      allData.controllers.some(ctrl =>
        ctrl.ipAddress === d.controller_ip && ctrl.region === regionName
      )
    )
  };

  return {
    summary: calculateSummary(filtered),
    details: filtered
  };
}

// ------------------------------------------------------
// CONTROLLER DOOR LOOKUP
// ------------------------------------------------------
function getControllerDoors(controllerIp) {
  return allData.controller_doors.filter(d => d.controller_ip === controllerIp);
}

// ------------------------------------------------------
// EXPORTS
// ------------------------------------------------------
module.exports = {
  fetchGlobalData,
  fetchRegionData,
  getControllerDoors
};