so read this camented and no commente code boht and alos above 
C:\Users\W0024618\Desktop\Backend\src\services\excelService.js
this file and commented code is our main code ok
and give me correct app.js file 
without chanig any privisu logic ok.. 

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





