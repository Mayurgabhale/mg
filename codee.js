require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const basicAuth = require('basic-auth');
const { pingHost } = require('./services/pingService');
const { DateTime } = require('luxon');
const regionRoutes = require('./routes/regionRoutes');
const { fetchAllIpAddress, ipRegionMap } = require('./services/excelService');

const app = express();
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3000;

// AUTH (move to .env in production)
const USERNAME = process.env.BASIC_AUTH_USER || 'admin';
const PASSWORD = process.env.BASIC_AUTH_PASS || '12345';

/* ================= HELPERS ================= */

function safeJsonParse(filePath) {
  try {
    if (!fs.existsSync(filePath)) return {};
    const content = fs.readFileSync(filePath, 'utf8').trim();
    if (!content) return {};
    return JSON.parse(content);
  } catch (err) {
    console.error("❌ Corrupted JSON:", filePath);
    return {};
  }
}

function pruneOldEntries(entries, days = 30) {
  const cutoff = DateTime.now().minus({ days }).toMillis();
  return entries.filter(e => DateTime.fromISO(e.timestamp).toMillis() >= cutoff);
}

function getLogFileForDate(dt) {
  return `./deviceLogs-${dt.toISODate()}.json`;
}

/* ================= BASIC AUTH ================= */

// ✅ DO NOT LOCK API WITH AUTH — unless you want it.
// If you want auth, uncomment below

/*
app.use((req, res, next) => {
  if (
    req.path === '/health' ||
    req.path.startsWith('/api') || 
    req.path.startsWith('/Frontend') || 
    req.path.startsWith('/dashboard')
  ) {
    return next();
  }

  const user = basicAuth(req);
  if (!user || user.name !== USERNAME || user.pass !== PASSWORD) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Authorization required"');
    return res.status(401).send('Access denied');
  }
  next();
});
*/

/* ================= MIDDLEWARE ================= */

app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE", allowedHeaders: "Content-Type,Authorization" }));
app.use(bodyParser.json());
app.use(express.json());

/* ================= STATIC FRONTEND ================= */

app.use('/Frontend/Device Dashboard', express.static(path.join(__dirname, '../../Frontend/Device Dashboard')));
app.use('/dashboard', express.static(path.join(__dirname, '../../Frontend/Device Dashboard')));

/* ================= ROUTES ================= */

app.get('/health', (req, res) => res.json({ status: 'up' }));
app.use('/api/regions', regionRoutes);

/* ================= CONTROLLER DATA ================= */

let controllerData = [];

const controllerPath = path.join(__dirname, './src/data/ControllerDataWithDoorReader.json');

if (fs.existsSync(controllerPath)) {
  controllerData = safeJsonParse(controllerPath);
  console.log("✅ Controller data loaded");
} else {
  console.warn("⚠️ Controller data file NOT found:", controllerPath);
}

/* ================= DEVICE MONITORING ================= */

const devices = fetchAllIpAddress();
let deviceStatus = {};
let fullStatus = [];

// Load logs
const today = DateTime.now().setZone("Asia/Kolkata");
const todayLogFile = getLogFileForDate(today);
let todayLogs = safeJsonParse(todayLogFile);

// Save logs
function saveTodayLogs() {
  fs.writeFileSync(todayLogFile, JSON.stringify(todayLogs, null, 2));
}

// Log changes
function logDeviceChange(ip, status) {
  const timestamp = DateTime.now().setZone("Asia/Kolkata").toISO();
  const arr = todayLogs[ip] = todayLogs[ip] || [];
  const last = arr[arr.length - 1];

  if (!last || last.status !== status) {
    arr.push({ status, timestamp });
    todayLogs[ip] = pruneOldEntries(arr, 30);
    saveTodayLogs();
  }
}

// ✅ Controller + Door Status Builder
function buildControllerStatus() {
  fullStatus = controllerData.map(controller => {
    const ip = controller.IP_address?.trim();
    const status = deviceStatus[ip] || "Unknown";

    const doors = (controller.Doors || []).map(d => ({
      ...d,
      status: status === "Online" ? "Online" : "Offline"
    }));

    return {
      controllername: controller.controllername,
      IP_address: ip,
      Location: controller.Location || "Unknown",
      City: controller.City || "Unknown",
      controllerStatus: status,
      Doors: doors
    };
  });
}

// ✅ PING LOOP
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

  buildControllerStatus();
  console.log("✅ Device Status Updated");
}

// Ping every 60 seconds
setInterval(pingDevices, 60000);
pingDevices();

/* ================= API ENDPOINTS ================= */

// ✅ THIS IS YOUR MISSING ROUTE — NOW FIXED
app.get('/api/controllers/status', (req, res) => {
  res.json(fullStatus);
});

app.get('/api/region/devices/status', (req, res) => {
  res.json(deviceStatus);
});

app.get('/api/devices/history', (req, res) => {
  const files = fs.readdirSync('.').filter(f => f.startsWith("deviceLogs-"));
  const combined = {};

  for (const f of files) {
    const logs = safeJsonParse(f);
    for (const ip in logs) {
      combined[ip] = (combined[ip] || []).concat(logs[ip]);
    }
  }

  for (const ip in combined)
    combined[ip] = pruneOldEntries(combined[ip], 30);

  res.json(combined);
});

/* ================= FRONTEND FALLBACK ================= */

app.get('/Frontend/Device Dashboard/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../Frontend/Device Dashboard/index.html'));
});

/* ================= START SERVER ================= */

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running at http://${HOST}:${PORT}`);
});