US. FL.MIAMI ULTRA CONTROLLER
 CONTROLLERS

 10.21.8.66

 NAMER

 Florida, Miami

Offline

US.NYC.199 Water St
 CONTROLLERS

 10.21.4.66

 NAMER

 NEW YORK

Offline

Unknown Device
 CAMERAS
Logo

 10.64.21.7

 LACA

 Costa Rica

Offline
in frontedn dipsly like this,
ok
so waht i want to do 
if i want to change ip addreess, ok so i wnt to chane ip addres fron frontend, or i want to add debice in future, so allo add opnetion like camera, controller, arachie i measn all
ok, write now we gett this all data form excle sheet ok, 
so i want to do above ok, so who to this, 
see below exle sheet format 
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
read the belwo all code and how to do, 
tell me step by step ok 

C:\Users\W0024618\Desktop\Backend\src\app.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
//const ping = require("ping");
const { pingHost } = require("./services/pingService");
const { DateTime } = require("luxon");
const regionRoutes = require("./routes/regionRoutes");
const { fetchAllIpAddress, ipRegionMap } = require("./services/excelService");
const { getDeviceInfo } = require("./services/excelService");
const { sendTeamsAlert }    = require("./services/teamsService");

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
    if (!content) return {};  // empty file = empty object
    return JSON.parse(content);
  } catch (err) {
    console.error("❌ Corrupted JSON file detected:", filePath);
    console.error("Error:", err.message);
    return {};  // fallback so server NEVER crashes
  }
}



// Middleware
app.use(cors({
    origin: "http://127.0.0.1:5500",
  //  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));
app.use(bodyParser.json());

// Routes
app.use("/api/regions", regionRoutes);

// Device Status Tracking
const devices = fetchAllIpAddress();
let deviceStatus = {};

// Load only today's logs
const today = DateTime.now().setZone("Asia/Kolkata");
const todayLogFile = getLogFileForDate(today);



let todayLogs = fs.existsSync(todayLogFile)
  ? safeJsonParse(todayLogFile)
  : {};



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


// 📝📝📝📝📝📝

let fullStatus = [];
function buildControllerStatus() {
  fullStatus = controllerData.map(controller => {
    const ip = controller.IP_address.trim();
    const status = deviceStatus[ip] || "Unknown";

    // If controller offline, mark all doors offline too
    const doors = controller.Doors.map(d => ({
      ...d,
      status: status === "Online" ? "Online" : "Offline",
    }));

    return {
      controllername: controller.controllername,
      IP_address: ip,
      Location: controller.Location || "Unknown",
      City: controller.City || "Unknown",
      controllerStatus: status,
      Doors: doors,
    };
  });
}

// 📝📝📝📝📝📝


const notifiedOffline=new Set();


// Start ping loop
// setInterval(pingDevices, 60_000);
// pingDevices();


setInterval(async () => {
   pingDevices();
 // await checkNotifications();
}, 60_000);

// initial run
(async () => {
   pingDevices();
  //await checkNotifications();
})();




// Real‑time status
app.get("/api/region/devices/status", (req, res) => {
  res.json(deviceStatus);
});

// Full history: stitch together all daily files
app.get("/api/devices/history", (req, res) => {
  const files = fs.readdirSync(".")
    .filter(f => f.startsWith("deviceLogs-") && f.endsWith(".json"));
  const combined = {};
  for (const f of files) {
    // const dayLogs = JSON.parse(fs.readFileSync(f, "utf8"));
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

// Region‑wise history
app.get("/api/region/:region/history", (req, res) => {
  const region = req.params.region.toLowerCase();
  const files = fs.readdirSync(".")
    .filter(f => f.startsWith("deviceLogs-") && f.endsWith(".json"));
  const regionLogs = {};

  for (const f of files) {
    // const dayLogs = JSON.parse(fs.readFileSync(f, "utf8"));
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
  // prune per‑IP
  for (const ip of Object.keys(regionLogs)) {
    regionLogs[ip] = pruneOldEntries(regionLogs[ip], 30);
  }
  res.json(regionLogs);
});

// Single‑device history
app.get("/api/device/history/:ip", (req, res) => {
  const ip = req.params.ip;
  const files = fs.readdirSync(".")
    .filter(f => f.startsWith("deviceLogs-") && f.endsWith(".json"));
  let history = [];
  for (const f of files) {
    // const dayLogs = JSON.parse(fs.readFileSync(f, "utf8"));
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
------------------
C:\Users\W0024618\Desktop\Backend\src\routes\regionRoutes.js
//  my code working 
 const express = require("express");
 const {
     getGlobalSummary,
     getGlobalDetails,
     getRegionSummary,
     getRegionDetails,
 } = require("../controllers/regionControllers");
 
 const router = express.Router();
 
 // Global Routes
 router.get("/summary/global", getGlobalSummary);
 router.get("/details/global", getGlobalDetails);
 
 
 // Region Routes
 router.get("/summary/:regionName", getRegionSummary);
 router.get("/details/:regionName", getRegionDetails)
 
 module.exports = router;


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
const { all } = require("axios");
 
// Excel paths
const archiverPath = path.join(__dirname, "../data/ArchiverData.xlsx");
const controllerPath = path.join(__dirname, "../data/ControllerData.xlsx");
const cameraPath = path.join(__dirname, "../data/CameraData.xlsx");
const serverPath = path.join(__dirname, "../data/ServerData.xlsx");
const pcDetailsPath = path.join(__dirname, "../data/PCDetails.xlsx");

const DBDetails = path.join(__dirname, "../data/DBDetails.xlsx");

 
// In‑memory cache
let allData = {};
 
// Helper: prune old entries
function pruneOldEntries(entries, days = 30) {
  const cutoff = DateTime.now().minus({ days }).toMillis();
  return entries.filter(e => DateTime.fromISO(e.timestamp).toMillis() >= cutoff);
}
 
// Load Excel sheets once
function loadExcelData() {
  if (Object.keys(allData).length) return;
  const loadSheet = file => {
    const wb = xlsx.readFile(file);
    const rows = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    return rows.map(r => {
      const norm = {};
      Object.entries(r).forEach(([k, v]) => {
        norm[k.trim().toLowerCase().replace(/\s+/g, "_")] = v;
      });
      norm.history = [];
      return norm;
    });
  };
  allData = {
    archivers: loadSheet(archiverPath),
    controllers: loadSheet(controllerPath),
    cameras: loadSheet(cameraPath),
    servers: loadSheet(serverPath),
    pcDetails:loadSheet(pcDetailsPath),
    DBDetails:loadSheet(DBDetails),
  };
  console.log("Excel Data Loaded:", Object.keys(allData));
}
loadExcelData();
 
// Build IP→region map
const ipRegionMap = {};
Object.values(allData).flat().forEach(dev => {
  if (dev.ip_address && dev.location) {
    ipRegionMap[dev.ip_address] = dev.location.toLowerCase();
  }
});
 
// Fetch all IPs
function fetchAllIpAddress() {
  return Object.values(allData)
    .flat()
    .map(d => d.ip_address)
    .filter(Boolean);
}
 
// Ping helpers
 const cache = new Map();
 async function pingDevice(ip) {
    if (!ip) return "IP Address Missing";
     return await pingHost(ip);
   }
 
 cache.clear();
 
 async function pingDevices(devices) {
   //cache.clear();
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
    const total = list.length;
    const online = list.filter(d => d.status === "Online").length;
    summary[k] = { total, online, offline: total - online };
  }
  return {
    totalDevices: Object.values(summary).reduce((s, g) => s + g.total, 0),
    totalOnlineDevices: Object.values(summary).reduce((s, g) => s + g.online, 0),
    totalOfflineDevices: Object.values(summary).reduce((s, g) => s + g.offline, 0),
    ...summary
  };
}
 
// Public APIs
async function fetchGlobalData() {
  const all = [...allData.cameras, ...allData.archivers, ...allData.controllers, ...allData.servers, ...allData.pcDetails, ...allData.DBDetails];
  await pingDevices(all);
  return { summary: calculateSummary(allData), details: allData };
}
 
async function fetchRegionData(regionName) {
  const filter = list => list.filter(d => d.location?.toLowerCase() === regionName.toLowerCase());
  const regionDevices = {
    cameras: filter(allData.cameras),
    archivers: filter(allData.archivers),
    controllers: filter(allData.controllers),
    servers: filter(allData.servers),
    pcDetails:filter(allData.pcDetails),
    DBDetails:filter(allData.DBDetails),
  };
  await pingDevices([].concat(...Object.values(regionDevices)));
  return { summary: calculateSummary(regionDevices), details: regionDevices };
}


function getDeviceInfo(ip) {
  for (const list of Object.values(allData)) {
    const dev = list.find(d => d.ip_address === ip);
    if (dev) return dev;
  }
  return null;
}



 
module.exports = {
  fetchGlobalData,
  fetchRegionData,
  fetchAllIpAddress,
  ipRegionMap,
  getDeviceInfo,       // ← new

};

## Frontend code::::
C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\index.html

    <!-- new mian code start📝📝📝📝📝 -->
    <main id="content">
      <section id="details-section" class="details-section">
        <div class="details-header">
          <h2><i class="fas fa-microchip"></i> Device Details</h2>
          <input type="text" id="device-search" placeholder="🔍 Search by IP, Location, City..." />
        </div>
        <div id="device-details" class="device-grid">Loading device data...</div>
        <div id="details-container" class="device-grid"></div>
      </section>

--------------
C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\script.js
function updateDetails(data) {
    const detailsContainer = document.getElementById("device-details");
    const deviceFilter = document.getElementById("device-filter");
    const onlineFilterButton = document.getElementById("filter-online");
    const offlineFilterButton = document.getElementById("filter-offline");
    const allFilterButton = document.getElementById("filter-all");
    const cityFilter = document.getElementById("city-filter");



    detailsContainer.innerHTML = "";
    cityFilter.innerHTML = '<option value="all">All Cities</option>';

    let combinedDevices = [];
    let citySet = new Set();
    let vendorSet = new Set(); // collect normalized vendor values
    let typeCityMap = {}; // <-- NEW: map deviceType -> Set of cities

    // Icon utility based on device type
    function getDeviceIcon(type = "") {
        type = type.toLowerCase();
        if (type.includes("camera")) return "fas fa-video";
        if (type.includes("controller")) return "fas fa-cogs";
        if (type.includes("archiver")) return "fas fa-database";
        if (type.includes("server")) return "fas fa-server";
        if (type.includes("pc")) return "fas fa-desktop";
        if (type.includes("dbdetails")) return "fa-solid fa-life-ring";
        return "fas fa-microchip"; // fallback
    }



    // Helper to find matching controller (by IP or name)
    function findControllerForDevice(device) {
        const controllers = Array.isArray(window.controllerDataCached) ? window.controllerDataCached : null;
        const ipToMatch = (device.ip || device.ip_address || "").toString().trim();
        const nameToMatch = (device.controllername || device.controller_name || device.cameraname || "").toString().trim();

        if (controllers) {
            // Try IP match first
            if (ipToMatch) {
                const byIp = controllers.find(c => c.IP_address && c.IP_address.toString().trim() === ipToMatch);
                if (byIp) return byIp;
            }
            // Try controller name match (loose contains)
            if (nameToMatch) {
                const nameLower = nameToMatch.toLowerCase();
                const byName = controllers.find(c => (c.controllername || "").toLowerCase().includes(nameLower) || nameLower.includes((c.controllername || "").toLowerCase()));
                if (byName) return byName;
            }
            // Last resort: try city match + online status (heuristic)
            if (device.city) {
                const byCity = controllers.find(c => (c.City || "").toLowerCase() === (device.city || "").toLowerCase());
                if (byCity) return byCity;
            }
        }
        return null;
    }

    // If controllers aren't cached, we will fetch them when necessary (lazy)
    function ensureControllersCached() {
        if (Array.isArray(window.controllerDataCached)) return Promise.resolve(window.controllerDataCached);
        return fetch("http://localhost/api/controllers/status")
        // return fetch("http://10.138.161.4:3000/api/controllers/status")
            .then(res => res.json())
            .then(data => {
                window.controllerDataCached = Array.isArray(data) ? data : null;
                return window.controllerDataCached;
            })
            .catch(err => {
                console.error("Failed to fetch controllers:", err);
                return null;
            });
    }


    // Fetch real-time status if available.
    fetch("http://localhost:80/api/region/devices/status")
    // fetch("http://10.138.161.4:3000/api/region/devices/status")
        .then((response) => response.json())
        .then((realTimeStatus) => {
            // console.log("Live Status Data:", realTimeStatus);

            for (const [key, devices] of Object.entries(data.details)) {
                if (!Array.isArray(devices) || devices.length === 0) continue;
                const deviceType = key.toLowerCase();

                // ensure map entry exists
                if (!typeCityMap[deviceType]) typeCityMap[deviceType] = new Set();

                devices.forEach((device) => {
                    const deviceIP = device.ip_address || "N/A";
                    let currentStatus = (realTimeStatus[deviceIP] || device.status || "offline").toLowerCase();
                    const city = device.city || "Unknown";

                    // collect city globally and per device type
                    citySet.add(city);
                    typeCityMap[deviceType].add(city);

                    // --- VENDOR: read possible fields, normalize, skip empty/unknown ---
                    // NOTE: your JSON uses the key "deviec_details" (typo) — we read that first.
                    let rawVendor = device.deviec_details || device.device_details || (device.device_details && device.device_details.vendor) || device.vendor || device.vendor_name || device.manufacturer || "";
                    rawVendor = (rawVendor || "").toString().trim();
   // If controllers aren't cached, we will fetch them when necessary (lazy)
    function ensureControllersCached() {
        if (Array.isArray(window.controllerDataCached)) return Promise.resolve(window.controllerDataCached);
        return fetch("http://localhost/api/controllers/status")
        // return fetch("http://10.138.161.4:3000/api/controllers/status")
            .then(res => res.json())
            .then(data => {
                window.controllerDataCached = Array.isArray(data) ? data : null;
                return window.controllerDataCached;
            })
            .catch(err => {
                console.error("Failed to fetch controllers:", err);
                return null;
            });
    }


    // Fetch real-time status if available.
    fetch("http://localhost:80/api/region/devices/status")
    // fetch("http://10.138.161.4:3000/api/region/devices/status")
        .then((response) => response.json())
        .then((realTimeStatus) => {
            // console.log("Live Status Data:", realTimeStatus);

            for (const [key, devices] of Object.entries(data.details)) {
                if (!Array.isArray(devices) || devices.length === 0) continue;
                const deviceType = key.toLowerCase();

                // ensure map entry exists
                if (!typeCityMap[deviceType]) typeCityMap[deviceType] = new Set();

                devices.forEach((device) => {
                    const deviceIP = device.ip_address || "N/A";
                    let currentStatus = (realTimeStatus[deviceIP] || device.status || "offline").toLowerCase();
                    const city = device.city || "Unknown";

                    // collect city globally and per device type
                    citySet.add(city);
                    typeCityMap[deviceType].add(city);

                    // --- VENDOR: read possible fields, normalize, skip empty/unknown ---
                    // NOTE: your JSON uses the key "deviec_details" (typo) — we read that first.
                    let rawVendor = device.deviec_details || device.device_details || (device.device_details && device.device_details.vendor) || device.vendor || device.vendor_name || device.manufacturer || "";
                    rawVendor = (rawVendor || "").toString().trim();

                    // Normalize: empty -> null, otherwise uppercase for consistent set values
                    let vendorNormalized = rawVendor ? rawVendor.toUpperCase() : null;

                    // Only add real vendors (skip "UNKNOWN", "", null)
                    if (vendorNormalized && vendorNormalized !== "UNKNOWN") {
                        vendorSet.add(vendorNormalized);
                    }

                    const datasetVendorValue = vendorNormalized || "";

                    // Create card element.
                    const card = document.createElement("div");
                    card.className = "device-card";
                    card.dataset.type = deviceType;
                    card.dataset.status = currentStatus;
                    card.dataset.city = city;
                    if (datasetVendorValue) card.dataset.vendor = datasetVendorValue; // only set if valid
                    card.setAttribute("data-ip", deviceIP);

                    // Apply background color based on online/offline status (kept your placeholders)
                    card.style.backgroundColor = currentStatus === "online" ? "" : "";
                    card.style.borderColor = currentStatus === "online" ? "" : "";

                    // Create a container for status
                    const statusContainer = document.createElement("p");
                    statusContainer.className = "device-status";

                    // Status text
                    const statusText = document.createElement("span");
                    statusText.className = "status-text";
                    statusText.textContent = currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1);
                    statusText.style.color = currentStatus === "online" ? "green" : "red";

                    // Status dot
                    const statusDot = document.createElement("span");
                    statusDot.classList.add(currentStatus === "online" ? "online-dot" : "offline-dot");
                    statusDot.style.backgroundColor = (currentStatus === "online") ? "green" : "red";
                    statusDot.style.display = "inline-block";
                    statusDot.style.width = "10px";
                    statusDot.style.height = "10px";
                    statusDot.style.marginLeft = "5px";
                    statusDot.style.marginRight = "5px";
                    statusDot.style.borderRadius = "50%";

                    // Combine status parts
                    statusContainer.appendChild(statusDot);
                    statusContainer.appendChild(statusText);

                    // compute a nicer label for the device-type area
                    let deviceLabel;

                    if (deviceType === "dbdetails") {
                        // For DB Details: show the application if available, else fallback
                        deviceLabel = device.application || deviceType.toUpperCase();
                    } else if (deviceType.includes("pc")) {
                        deviceLabel = device.pc_name || device.hostname || "PC";
                    } else {
                        deviceLabel = deviceType.toUpperCase();
                    }

                    card.insertAdjacentHTML("beforeend", `
  <h3 class="device-name" style="font-size:20px; font-weight:500; font-family: PP Right Grotesk; margin-bottom: 10px;">
      ${device.cameraname || device.controllername || device.archivername || device.servername || device.hostname || "Unknown Device"}
  </h3>

  <div class="card-content">
      <p class="device-type-label ${deviceType}" 
         style="font-size:17px;  font-family: Roboto; font-weight:100; margin-bottom: 10px; display:flex; justify-content:space-between; align-items:center;">
          
          <strong>
            <i class="${getDeviceIcon(deviceType)}" style="margin-right: 5px;"></i> 
            ${deviceLabel}
          </strong>
          
          ${deviceType.includes("camera")
                            ? `<button class="open-camera-btn"
        onclick="openCamera('${deviceIP}', '${(device.cameraname || device.controllername || "").replace(/'/g, "\\'")}', '${device.hyperlink || ""}')"
        title="Open Camera"
        style="border:none; cursor:pointer; font-weight:100; border-radius:50%; width:34px; height:34px; display:flex; justify-content:center; align-items:center;">
    <img src="images/cctv.png" alt="Logo" style="width:33px; height:33px;"/>
</button>`
                            : ""
                        }
      </p>

      <p style="font-size: ;  font-family: Roboto; margin-bottom: 8px;">
          <strong style="color:rgb(8, 8, 8);"><i class="fas fa-network-wired" style="margin-right: 6px;"></i></strong>
          <span 
              class="device-ip" 
              style="font-weight:100; color: #00adb5; cursor: pointer; text-shadow: 0 0 1px rgba(0, 173, 181, 0.3);  font-family: Roboto;"
              onclick="copyToClipboard('${deviceIP}')"
              title="Click to copy IP"
          >
              ${deviceIP}
          </span>
      </p>

      <p style="font-size: ;  font-family: Roboto; margin-bottom: 6px;">
          <strong ><i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i></strong>
          <span style="font-size:; font-weight:100; margin-left: 12px;  font-family: Roboto; font-size: ;">${device.location || "N/A"}</span>
      </p>

      <p style="font-size:;  font-family: Roboto;>
          <strong "><i class="fas fa-city" style="margin-right: 5px;"></i></strong>
          <span style="font-weight:100;margin-left: 4px;  font-family: Roboto; font-size:;">${city}</span>
      </p>
  </div>
`);
                    card.appendChild(statusContainer);

                    // --- ADDED: if this is a controller card, attach click to open doors modal ---
                    if (deviceType.includes("controller")) {
