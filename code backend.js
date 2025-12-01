ok, read this below all code,
  ok
now i want to add new camers, ok
on postman so how to add,
wiht api end point 
how to do this tell me 
src\data\~$CameraData.xlsx
For Camera --- 
cameraname 	Ip_address	Location	City	Deviec_details 	hyperlink	Remark
HYD_2FLR_B WING PASSAGE CAM 1 - 10.200.3.41- 136	10.200.3.41	APAC	HYDERABAD	axis	http://10.200.3.41/camera/index.html	
HYD_2FLR_B WING PASSAGE CAM 2 - 10.200.3.2 - 121	10.200.3.2 	APAC	HYDERABAD	FLIR		
10.192.3.244	APAC	Japan Tokyo	Verkada	https://wu.command.verkada.com/cameras/b0fc7895-87d6-4f0c-9667-ed821cedd5ca/	
10.128.202.136	EMEA	Austria, Vienna	FLIR		Not accessible 
-------------------------

  src\data\~$ArchiverData.xlsx
For Archiver ---
archivername	Ip_address	Location	City
Archiver Manila	10.193.132.8	APAC	Taguig City
Archiver Taguig City Philippines	10.194.2.190	APAC	Taguig City

---------------------
  src\data\~$ControllerData.xlsx
For Controller ---
controllername	IP_address	Location	City
IN-PUN-2NDFLR-ISTAR PRO	10.199.13.10	APAC	Pune 2nd Floor
IN-PUN-PODIUM-ISTAR PRO-01	10.199.8.20	APAC	Pune Podium
-----------------------
  src\data\~$ServerData.xlsx
For Server ---
  servername 	IP_address	Location	City
Master Server 	40.38.133.60	NAMER	Denver Colorado
NAMER Server 	14.58.108.01	NAMER	Denver Colorado

-----------------------------

  src\data\~$DBDetails.xlsx
for DBDetails --
Location	City	HostName	Ip_address	Application	Windows Server
NAMER	Denver	SRVWUDEN0890v	10.58.118.22	CCURE MAS SQL DB	Windows Server 2019 Standard
NAMER	Denver	SRVWUDEN0190V	10.58.118.20	CCURE MAS APP	Windows Server 2016 Standard
-------------------------

  src\data\~$PCDetails.xlsx
For PCDetails ---
HostName	Ip_address	Location	City	PC Name
WKSWUPUN4501	WKSWUPUN4501	APAC	Pune Podium	Screen 03
WKSPUN-392353	WKSPUN-392353	APAC	Pune Podium	Screen 04

const fs = require("fs");
const xlsx = require("xlsx");
const path = require("path");
const pLimit = require("p-limit");
const { pingHost } = require("./pingService");
const { DateTime } = require("luxon");

// Excel paths
const archiverPath = path.join(__dirname, "../data/ArchiverData.xlsx");
const controllerPath = path.join(__dirname, "../data/ControllerData.xlsx");
const cameraPath = path.join(__dirname, "../data/CameraData.xlsx");
const serverPath = path.join(__dirname, "../data/ServerData.xlsx");
const pcDetailsPath = path.join(__dirname, "../data/PCDetails.xlsx");
const DBDetailsPath = path.join(__dirname, "../data/DBDetails.xlsx");

// json fallback files (we will persist runtime edits here)
const jsonFiles = {
  archivers: path.join(__dirname, "../data/archivers.json"),
  controllers: path.join(__dirname, "../data/controllers.json"),
  cameras: path.join(__dirname, "../data/cameras.json"),
  servers: path.join(__dirname, "../data/servers.json"),
  pcDetails: path.join(__dirname, "../data/pcDetails.json"),
  DBDetails: path.join(__dirname, "../data/DBDetails.json"),
};

// In-memory cache
let allData = {};

// Helper: normalize keys
function normalizeRow(r) {
  const norm = {};
  Object.entries(r).forEach(([k, v]) => {
    const key = k.trim().toLowerCase().replace(/\s+/g, "_");
    norm[key] = v;
  });
  norm.history = norm.history || [];
  return norm;
}

// Load either JSON (if exists) or Excel
function loadSheetFromExcelOrJson(sheetName, excelPath) {
  const jsonPath = jsonFiles[sheetName];
  if (fs.existsSync(jsonPath)) {
    try {
      const raw = fs.readFileSync(jsonPath, "utf8");
      const rows = JSON.parse(raw);
      return rows.map(r => ({ ...r, history: r.history || [] }));
    } catch (e) {
      console.error("Failed to parse JSON for", sheetName, e.message);
      // fallback to excel
    }
  }
  // fallback: read excel
  if (!fs.existsSync(excelPath)) {
    console.warn("Excel file not found:", excelPath);
    return [];
  }
  const wb = xlsx.readFile(excelPath);
  const rows = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]] || {});
  return rows.map(normalizeRow);
}

// Initialize
function loadExcelData() {
  allData = {
    archivers: loadSheetFromExcelOrJson("archivers", archiverPath),
    controllers: loadSheetFromExcelOrJson("controllers", controllerPath),
    cameras: loadSheetFromExcelOrJson("cameras", cameraPath),
    servers: loadSheetFromExcelOrJson("servers", serverPath),
    pcDetails: loadSheetFromExcelOrJson("pcDetails", pcDetailsPath),
    DBDetails: loadSheetFromExcelOrJson("DBDetails", DBDetailsPath),
  };
  console.log("Data Loaded. counts:", {
    cameras: allData.cameras.length,
    controllers: allData.controllers.length,
    archivers: allData.archivers.length,
    servers: allData.servers.length,
    pcDetails: allData.pcDetails.length,
    DBDetails: allData.DBDetails.length,
  });
}
loadExcelData();

// Build IP→region map (and helper to rebuild after changes)
let ipRegionMap = {};
function rebuildIpRegionMap() {
  ipRegionMap = {};
  Object.values(allData).flat().forEach(dev => {
    if (dev.ip_address && dev.location) {
      ipRegionMap[dev.ip_address] = dev.location.toLowerCase();
    }
  });
}
rebuildIpRegionMap();

// Fetch all IPs
function fetchAllIpAddress() {
  return Object.values(allData).flat().map(d => d.ip_address).filter(Boolean);
}

// ping helpers (similar to your current code)
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
        const status = cache.get(dev.ip_address) || await pingDevice(dev.ip_address);
        cache.set(dev.ip_address, status);
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
    ...summary
  };
}

// Save functions: write each top-level array to json file
function persistAllDataToJson() {
  for (const [key, filePath] of Object.entries(jsonFiles)) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(allData[key], null, 2), "utf8");
    } catch (err) {
      console.error("Failed to persist", key, err.message);
    }
  }
}

// Utility: lookup device by ip and also provide list name
function findDeviceByIp(ip) {
  for (const [listName, list] of Object.entries(allData)) {
    const idx = list.findIndex(d => d.ip_address === ip);
    if (idx !== -1) return { listName, idx, device: list[idx] };
  }
  return null;
}

// Add device
function addDevice(type, deviceObj) {
  if (!allData[type]) throw new Error("Invalid device type: " + type);
  // minimal normalization
  const norm = {};
  Object.entries(deviceObj).forEach(([k, v]) => {
    norm[k.toString().trim().toLowerCase().replace(/\s+/g, "_")] = v;
  });
  norm.history = norm.history || [];
  allData[type].push(norm);
  rebuildIpRegionMap();
  persistAllDataToJson();
  return norm;
}

// Update device
function updateDevice(oldIp, updateFields) {
  const found = findDeviceByIp(oldIp);
  if (!found) throw new Error("Device not found");
  const { listName, idx } = found;
  // merge
  allData[listName][idx] = { ...allData[listName][idx], ...updateFields };
  // ensure ip key uses normalized name
  if (allData[listName][idx].ip_address) {
    allData[listName][idx].ip_address = allData[listName][idx].ip_address.toString().trim();
  }
  rebuildIpRegionMap();
  persistAllDataToJson();
  return allData[listName][idx];
}

// Delete device
function deleteDevice(ip) {
  const found = findDeviceByIp(ip);
  if (!found) throw new Error("Device not found");
  const { listName, idx } = found;
  allData[listName].splice(idx, 1);
  rebuildIpRegionMap();
  persistAllDataToJson();
  return true;
}

// Accessors used by other modules
function getDeviceInfo(ip) {
  const f = findDeviceByIp(ip);
  return f ? f.device : null;
}

// helper for controllers status (used by app.js)
function getControllersList() {
  // return shallow copy
  return (allData.controllers || []).map(c => ({ ...c }));
}

// Public APIs used by controllers/routers
async function fetchGlobalData() {
  // ping everything
  const all = [...allData.cameras, ...allData.archivers, ...allData.controllers, ...allData.servers, ...allData.pcDetails, ...allData.DBDetails];
  await pingDevices(all);
  return { summary: calculateSummary(allData), details: allData };
}

async function fetchRegionData(regionName) {
  const filter = list => list.filter(d => (d.location || "").toLowerCase() === regionName.toLowerCase());
  const regionDevices = {
    cameras: filter(allData.cameras),
    archivers: filter(allData.archivers),
    controllers: filter(allData.controllers),
    servers: filter(allData.servers),
    pcDetails: filter(allData.pcDetails),
    DBDetails: filter(allData.DBDetails),
  };
  await pingDevices([].concat(...Object.values(regionDevices)));
  return { summary: calculateSummary(regionDevices), details: regionDevices };
}

// export
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
};
