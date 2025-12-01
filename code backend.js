C:\Users\W0024618\Desktop\Backend\src\controllers\regionControllers.js
const { fetchGlobalData, fetchRegionData} = require("../services/excelService");


// Global Summary Controller
const getGlobalSummary = async (req, res) => {
    try {
        const globalData = await fetchGlobalData();
        res.status(200).json({ summary: globalData.summary });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

// Global Details Controller
const getGlobalDetails = async (req, res) => {
    try {
        const globalData = await fetchGlobalData();
        res.status(200).json({ details: globalData.details });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

// Region Summary Controller
const getRegionSummary = async (req, res) => {
    const { regionName } = req.params;
    try {
        const regionData = await fetchRegionData(regionName);
        res.status(200).json({ summary: regionData.summary });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};


// Region Details Controller
const getRegionDetails = async (req, res) => {
    const { regionName } = req.params;
    try {
        const regionData = await fetchRegionData(regionName);
        res.status(200).json({ details: regionData.details });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

module.exports = {
    getGlobalSummary,
    getGlobalDetails,
    getRegionSummary,
    getRegionDetails,
};



C:\Users\W0024618\Desktop\Backend\src\services\excelService.js


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

C:\Users\W0024618\Desktop\Backend\src\services\pingService.js
const ping = require("ping");
const DEFAULT_TIMEOUT = 5; // seconds
const ICMP_COUNT_FLAG = process.platform === "win32" ? "-n" : "-c";

async function pingHost(ip) {
  if(typeof ip =="string")ip=ip.trim();
  try {
    const res = await ping.promise.probe(ip, {
      timeout: DEFAULT_TIMEOUT,
      extra: [ICMP_COUNT_FLAG, "1"],
    });
    return res.alive ? "Online" : "Offline";
  } catch {
    return "Offline";
  }
}

module.exports = { pingHost };



C:\Users\W0024618\Desktop\Backend\src\app.js

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const fs = require("fs");
// //const ping = require("ping");
// const { pingHost } = require("./services/pingService");
// const { DateTime } = require("luxon");
// const regionRoutes = require("./routes/regionRoutes");
// const { fetchAllIpAddress, ipRegionMap } = require("./services/excelService");
// const { getDeviceInfo } = require("./services/excelService");
// const { sendTeamsAlert }    = require("./services/teamsService");

// const controllerData = JSON.parse(
//   fs.readFileSync("./src/data/ControllerDataWithDoorReader.json", "utf8")
// );

// const app = express();
// const PORT = process.env.PORT || 80;

// // Helpers
// function pruneOldEntries(entries, days = 30) {
//   const cutoff = DateTime.now().minus({ days }).toMillis();
//   return entries.filter(e => DateTime.fromISO(e.timestamp).toMillis() >= cutoff);
// }
// function getLogFileForDate(dt) {
//   return `./deviceLogs-${dt.toISODate()}.json`;
// }

// function safeJsonParse(filePath) {
//   try {
//     const content = fs.readFileSync(filePath, "utf8").trim();
//     if (!content) return {};  // empty file = empty object
//     return JSON.parse(content);
//   } catch (err) {
//     console.error("❌ Corrupted JSON file detected:", filePath);
//     console.error("Error:", err.message);
//     return {};  // fallback so server NEVER crashes
//   }
// }



// // Middleware
// app.use(cors({
//     origin: "http://127.0.0.1:5500",
//   //  origin: "http://localhost:3000",
//   methods: "GET,POST,PUT,DELETE",
//   allowedHeaders: "Content-Type,Authorization",
// }));
// app.use(bodyParser.json());

// // Routes
// app.use("/api/regions", regionRoutes);

// // Device Status Tracking
// const devices = fetchAllIpAddress();
// let deviceStatus = {};

// // Load only today's logs
// const today = DateTime.now().setZone("Asia/Kolkata");
// const todayLogFile = getLogFileForDate(today);



// let todayLogs = fs.existsSync(todayLogFile)
//   ? safeJsonParse(todayLogFile)
//   : {};



// // Persist today's logs
// function saveTodayLogs() {
//   fs.writeFileSync(todayLogFile, JSON.stringify(todayLogs, null, 2));
// }

// // Log a status change
// function logDeviceChange(ip, status) {
//   const timestamp = DateTime.now().setZone("Asia/Kolkata").toISO();
//   const arr = (todayLogs[ip] = todayLogs[ip] || []);
//   const last = arr[arr.length - 1];
//   if (!last || last.status !== status) {
//     arr.push({ status, timestamp });
//     todayLogs[ip] = pruneOldEntries(arr, 30);
//     saveTodayLogs();
//   }
// }


// async function pingDevices() {
//   const limit = require("p-limit")(20);

//   await Promise.all(
//     devices.map(ip =>
//       limit(async () => {
//         const newStatus = await pingHost(ip);
//         if (deviceStatus[ip] !== newStatus) {
//           logDeviceChange(ip, newStatus);
//         }
//         deviceStatus[ip] = newStatus;
//       })
//     )
//   );

//   // ✅ Build Controller + Door Status
//   buildControllerStatus();

//   console.log("Updated device status:", deviceStatus);
// }


// // 📝📝📝📝📝📝

// let fullStatus = [];
// function buildControllerStatus() {
//   fullStatus = controllerData.map(controller => {
//     const ip = controller.IP_address.trim();
//     const status = deviceStatus[ip] || "Unknown";

//     // If controller offline, mark all doors offline too
//     const doors = controller.Doors.map(d => ({
//       ...d,
//       status: status === "Online" ? "Online" : "Offline",
//     }));

//     return {
//       controllername: controller.controllername,
//       IP_address: ip,
//       Location: controller.Location || "Unknown",
//       City: controller.City || "Unknown",
//       controllerStatus: status,
//       Doors: doors,
//     };
//   });
// }

// // 📝📝📝📝📝📝


// const notifiedOffline=new Set();


// // Start ping loop
// // setInterval(pingDevices, 60_000);
// // pingDevices();


// setInterval(async () => {
//    pingDevices();
//  // await checkNotifications();
// }, 60_000);

// // initial run
// (async () => {
//    pingDevices();
//   //await checkNotifications();
// })();




// // Real‑time status
// app.get("/api/region/devices/status", (req, res) => {
//   res.json(deviceStatus);
// });

// // Full history: stitch together all daily files
// app.get("/api/devices/history", (req, res) => {
//   const files = fs.readdirSync(".")
//     .filter(f => f.startsWith("deviceLogs-") && f.endsWith(".json"));
//   const combined = {};
//   for (const f of files) {
//     // const dayLogs = JSON.parse(fs.readFileSync(f, "utf8"));
//     const dayLogs = safeJsonParse(f);

//     for (const ip of Object.keys(dayLogs)) {
//       combined[ip] = (combined[ip] || []).concat(dayLogs[ip]);
//     }
//   }
//   // prune to last 30 days
//   for (const ip of Object.keys(combined)) {
//     combined[ip] = pruneOldEntries(combined[ip], 30);
//   }
//   res.json(combined);
// });

// // Region‑wise history
// app.get("/api/region/:region/history", (req, res) => {
//   const region = req.params.region.toLowerCase();
//   const files = fs.readdirSync(".")
//     .filter(f => f.startsWith("deviceLogs-") && f.endsWith(".json"));
//   const regionLogs = {};

//   for (const f of files) {
//     // const dayLogs = JSON.parse(fs.readFileSync(f, "utf8"));
//     const dayLogs = safeJsonParse(f);

//     for (const ip of Object.keys(dayLogs)) {
//       if (ipRegionMap[ip] === region) {
//         regionLogs[ip] = (regionLogs[ip] || []).concat(dayLogs[ip]);
//       }
//     }
//   }

//   if (!Object.keys(regionLogs).length) {
//     return res.status(404).json({ message: `No device history found for region: ${region}` });
//   }
//   // prune per‑IP
//   for (const ip of Object.keys(regionLogs)) {
//     regionLogs[ip] = pruneOldEntries(regionLogs[ip], 30);
//   }
//   res.json(regionLogs);
// });

// // Single‑device history
// app.get("/api/device/history/:ip", (req, res) => {
//   const ip = req.params.ip;
//   const files = fs.readdirSync(".")
//     .filter(f => f.startsWith("deviceLogs-") && f.endsWith(".json"));
//   let history = [];
//   for (const f of files) {
//     // const dayLogs = JSON.parse(fs.readFileSync(f, "utf8"));
//     const dayLogs = safeJsonParse(f);

//     if (dayLogs[ip]) history = history.concat(dayLogs[ip]);
//   }
//   if (!history.length) {
//     return res.status(404).json({ message: "No history found for this device" });
//   }
//   history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
//   res.json({ ip, history });
// });


// // Get all controller + door statuses
// app.get("/api/controllers/status", (req, res) => {
//   res.json(fullStatus);
// });


// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });






// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ mayur 1-12




require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
//const ping = require("ping");
const { pingHost } = require("./services/pingService");
const { DateTime } = require("luxon");

const regionRoutes = require("./routes/regionRoutes");

// ← NEW imports from excelService (fetchAllIpAddress + ipRegionMap + getDeviceInfo + getControllersList)
const {
  fetchAllIpAddress,
  ipRegionMap,
  getDeviceInfo,
  getControllersList,
} = require("./services/excelService");

// ← NEW device router
const deviceRoutes = require("./routes/deviceRoutes");

const { sendTeamsAlert } = require("./services/teamsService");

// KEEP this JSON — used for door metadata / door structure
const controllerData = JSON.parse(
  fs.readFileSync("./src/data/ControllerDataWithDoorReader.json", "utf8")
);

const app = express();
const PORT = process.env.PORT || 80;

// Helpers
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
    if (!content) return {}; // empty file = empty object
    return JSON.parse(content);
  } catch (err) {
    console.error("❌ Corrupted JSON file detected:", filePath);
    console.error("Error:", err.message);
    return {}; // fallback so server NEVER crashes
  }
}

// Middleware
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    // origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use(bodyParser.json());

// Routes
app.use("/api/regions", regionRoutes);

// ← register device router
app.use("/api/devices", deviceRoutes);

// Device Status Tracking
// NOTE: we intentionally do NOT keep a static `devices` array here;
// instead pingDevices() fetches current IP list from excelService each run.
let deviceStatus = {};

// Load only today's logs
const today = DateTime.now().setZone("Asia/Kolkata");
const todayLogFile = getLogFileForDate(today);

let todayLogs = fs.existsSync(todayLogFile) ? safeJsonParse(todayLogFile) : {};

// Persist today's logs
function saveTodayLogs() {
  fs.writeFileSync(todayLogFile, JSON.stringify(todayLogs, null, 2));
}

// Log a status change
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

  // ← fetch fresh IP list each run so edits/adds are picked up immediately
  const devices = fetchAllIpAddress(); // returns array of IP strings

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

  // ✅ Build Controller + Door Status
  buildControllerStatus();

  console.log("Updated device status:", deviceStatus);
}

// 📝 Controller + Door status builder
let fullStatus = [];

function buildControllerStatus() {
  // Excel-sourced controllers (metadata may include Location/City)
  const excelControllers = getControllersList(); // array of controllers from excelService

  // We keep your controllerData JSON for door structure (Door list and names)
  fullStatus = controllerData.map(controller => {
    // some controller objects use IP_address, some ip_address — normalize
    const ipRaw = controller.IP_address || controller.ip_address || "";
    const ip = ipRaw.toString().trim();

    const status = deviceStatus[ip] || "Unknown";

    // If controller offline, mark all doors offline too
    const doors = (controller.Doors || []).map(d => ({
      ...d,
      status: status === "Online" ? "Online" : "Offline",
    }));

    // Try find excel entry to enrich Location/City (fall back to JSON values)
    const excelInfo = excelControllers.find(c => {
      const cIp = (c.IP_address || c.ip_address || "").toString().trim();
      return cIp === ip;
    }) || {};

    return {
      controllername: controller.controllername || controller.controller_name || excelInfo.controllername || "",
      IP_address: ip,
      Location: controller.Location || excelInfo.Location || excelInfo.location || "Unknown",
      City: controller.City || excelInfo.City || excelInfo.city || "Unknown",
      controllerStatus: status,
      Doors: doors,
    };
  });
}

const notifiedOffline = new Set();

// Start ping loop
setInterval(async () => {
  pingDevices();
  // await checkNotifications();
}, 60_000);

// initial run
(async () => {
  pingDevices();
  // await checkNotifications();
})();

// Real-time status
app.get("/api/region/devices/status", (req, res) => {
  res.json(deviceStatus);
});

// Full history: stitch together all daily files
app.get("/api/devices/history", (req, res) => {
  const files = fs.readdirSync(".").filter(f => f.startsWith("deviceLogs-") && f.endsWith(".json"));
  const combined = {};
  for (const f of files) {
    const dayLogs = safeJsonParse(f);
    for (const ip of Object.keys(dayLogs)) {
      combined[ip] = (combined[ip] || []).concat(dayLogs[ip]);
    }
  }
  // prune to last 30 days
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
  // prune per-IP
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

// Get all controller + door statuses
app.get("/api/controllers/status", (req, res) => {
  res.json(fullStatus);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});






