'10.199.22.62': 'Online',
  '10.58.118.23': 'Online'
}
SyntaxError: Unexpected end of JSON input
    at JSON.parse (<anonymous>)
    at C:\Users\W0024618\Desktop\Backend\src\app.js:195:26
    at Layer.handle [as handle_request] (C:\Users\W0024618\Desktop\Backend\node_modules\express\lib\router\layer.js:95:5)
    at next (C:\Users\W0024618\Desktop\Backend\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (C:\Users\W0024618\Desktop\Backend\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (C:\Users\W0024618\Desktop\Backend\node_modules\express\lib\router\layer.js:95:5)
    at C:\Users\W0024618\Desktop\Backend\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (C:\Users\W0024618\Desktop\Backend\node_modules\express\lib\router\index.js:346:12)
    at next (C:\Users\W0024618\Desktop\Backend\node_modules\express\lib\router\index.js:280:10)
    at jsonParser (C:\Users\W0024618\Desktop\Backend\node_modules\body-parser\lib\types\json.js:113:7)
SyntaxError: Unexpected end of JSON input
    at JSON.parse (<anonymous>)
    at C:\Users\W0024618\Desktop\Backend\src\app.js:195:26
    at Layer.handle [as handle_request] (C:\Users\W0024618\Desktop\Backend\node_modules\express\lib\router\layer.js:95:5)
    at next (C:\Users\W0024618\Desktop\Backend\node_modules\express\lib\router\route.js:149:13)
    at Route.dispatch (C:\Users\W0024618\Desktop\Backend\node_modules\express\lib\router\route.js:119:3)
    at Layer.handle [as handle_request] (C:\Users\W0024618\Desktop\Backend\node_modules\express\lib\router\layer.js:95:5)
    at C:\Users\W0024618\Desktop\Backend\node_modules\express\lib\router\index.js:284:15
    at Function.process_params (C:\Users\W0024618\Desktop\Backend\node_modules\express\lib\router\index.js:346:12)
    at next (C:\Users\W0024618\Desktop\Backend\node_modules\express\lib\router\index.js:280:10)
    at jsonParser (C:\Users\W0024618\Desktop\Backend\node_modules\body-parser\lib\types\json.js:113:7)
Updated device status: {
  '172.21.34.200': 'Online',
  '10.64.21.85': 'Online',
  '10.64.21.67': 'Online',
  '10.64.21.66': 'Online',
  '10.128.194.70': 'Online',
  '10.136.63.236': 'Online',
  '10.138.161.4': 'Online',
  '10.138.33.9': 'Online',
  '10.131.106.133': 'Online',
  '10.128.218.70': 'Online',
  '10.128.203.3': 'Online',
  '10.192.5.9': 'Online',
  '10.199.8.12': 'Online',
  '10.199.16.45': 'Online',
  '10.199.8.10': 'Online',
  '10.194.2.190': 'Online'



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
  ? JSON.parse(fs.readFileSync(todayLogFile, "utf8"))
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

// Ping devices
// async function pingDevices() {
// const limit = require("p-limit")(20);
//   await Promise.all(
//     devices.map(ip =>
//     limit(async () => {
//         const newStatus = await pingHost(ip);
//         if (deviceStatus[ip] !== newStatus) {
//           logDeviceChange(ip, newStatus);
//         }
//         deviceStatus[ip] = newStatus;
//       })
//     )
//   );
//   console.log("Updated device status:", deviceStatus);
//  }

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
//       controllerStatus: status,
//       Doors: doors,
//     };
//   });
// }


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
    const dayLogs = JSON.parse(fs.readFileSync(f, "utf8"));
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
    const dayLogs = JSON.parse(fs.readFileSync(f, "utf8"));
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
    const dayLogs = JSON.parse(fs.readFileSync(f, "utf8"));
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





// async function checkNotifications() {
//   const now = DateTime.now().setZone("Asia/Kolkata");
//   for (const [ip, status] of Object.entries(deviceStatus)) {
//     // get the last timestamp this ip changed state
//     const logs = todayLogs[ip] || [];
//     const lastEntry = logs[logs.length - 1];
//     if (!lastEntry) continue;
//     const changedAt = DateTime.fromISO(lastEntry.timestamp);
//     const minutesDown = now.diff(changedAt, 'minutes').minutes;

//     const dev = getDeviceInfo(ip);
//     if (!dev) continue;
//     const { device_name, location, region, device_type } = dev;

//     // 1) OFFLINE > 5m and not yet notified
//     if (
//       status === "Offline" &&
//       minutesDown >= 5 &&
//       !notifiedOffline.has(ip)
//     ) {
//       const msg = `❗️ **${device_name}** (${ip}) in ${location}, ${region} (${device_type}) has been **OFFLINE** for over 5 minutes.`;
//       await sendTeamsAlert(region, msg);
//       notifiedOffline.add(ip);
//     }

//     // 2) Back ONLINE after offline alert
//     if (
//       status === "Online" &&
//       notifiedOffline.has(ip)
//     ) {
//       const msg = `✅ **${device_name}** (${ip}) in ${location}, ${region} (${device_type}) is **back ONLINE**.`;
//       await sendTeamsAlert(region, msg);
//       notifiedOffline.delete(ip);
//     }
//   }
// }









// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});











