require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const { pingHost } = require("./services/pingService");
const { DateTime } = require("luxon");

const regionRoutes = require("./routes/regionRoutes");
const deviceRoutes = require("./routes/deviceRoutes");

const {
  fetchAllIpAddress,
  ipRegionMap,
  getDeviceInfo,
  getControllersList,
  getControllerDoors
} = require("./services/excelService");

const { sendTeamsAlert } = require("./services/teamsService");

const app = express();
const PORT = process.env.PORT || 80;

// ------------------ Helpers ------------------
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
    if (!content) return {};
    return JSON.parse(content);
  } catch (err) {
    console.error("❌ Corrupted JSON file detected:", filePath);
    console.error("Error:", err.message);
    return {};
  }
}

// ------------------ Middleware ------------------
app.use(cors({
  origin: "http://127.0.0.1:5500",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));
app.use(bodyParser.json());

// ------------------ Routes ------------------
app.use("/api/regions", regionRoutes);
app.use("/api/devices", deviceRoutes);

// ------------------ Device Status ------------------
let deviceStatus = {};
const today = DateTime.now().setZone("Asia/Kolkata");
const todayLogFile = getLogFileForDate(today);
let todayLogs = fs.existsSync(todayLogFile) ? safeJsonParse(todayLogFile) : {};

function saveTodayLogs() {
  fs.writeFileSync(todayLogFile, JSON.stringify(todayLogs, null, 2));
}

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
  const devices = fetchAllIpAddress();

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

  buildControllerStatus();
  console.log("Updated device status:", deviceStatus);
}

// ------------------ Controller + Door Status ------------------
let fullStatus = [];

function buildControllerStatus() {
  const controllers = getControllersList(); // from DB

  fullStatus = controllers.map(ctrl => {
    const ip = (ctrl.IP_address || ctrl.ip_address || "").toString().trim();
    const status = deviceStatus[ip] || "Unknown";

    // Doors linked to this controller
    const doors = getControllerDoors(ip).map(d => ({
      door: d.door,
      reader: d.reader,
      status: status === "Online" ? "Online" : "Offline",
    }));

    return {
      controllername: ctrl.controllername,
      IP_address: ip,
      Location: ctrl.location || "Unknown",
      City: ctrl.city || "Unknown",
      controllerStatus: status,
      Doors: doors,
    };
  });
}

const notifiedOffline = new Set();

// ------------------ Ping Loop ------------------
setInterval(async () => {
  pingDevices();
}, 60_000);

(async () => {
  pingDevices();
})();

// ------------------ API Endpoints ------------------

// Real-time device status
app.get("/api/region/devices/status", (req, res) => {
  res.json(deviceStatus);
});

// Full history
app.get("/api/devices/history", (req, res) => {
  const files = fs.readdirSync(".").filter(f => f.startsWith("deviceLogs-") && f.endsWith(".json"));
  const combined = {};
  for (const f of files) {
    const dayLogs = safeJsonParse(f);
    for (const ip of Object.keys(dayLogs)) {
      combined[ip] = (combined[ip] || []).concat(dayLogs[ip]);
    }
  }
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

// Get all controllers + doors
app.get("/api/controllers/status", (req, res) => {
  res.json(fullStatus);
});

// ------------------ Start Server ------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});