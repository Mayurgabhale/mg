http://10.138.161.4:3000/api/controllers/status
Cannot GET /api/controllers/status
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
const { fetchAllIpAddress, ipRegionMap, getDeviceInfo } = require('./services/excelService');
const { sendTeamsAlert } = require('./services/teamsService');

const app = express();

// Configuration
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3000;

// Basic auth (defaults) - move to env in production
const USERNAME = process.env.BASIC_AUTH_USER || 'admin';
const PASSWORD = process.env.BASIC_AUTH_PASS || '12345';

// Helpers
function safeJsonParse(filePath) {
  try {
    if (!fs.existsSync(filePath)) return {};
    const content = fs.readFileSync(filePath, 'utf8').trim();
    if (!content) return {};
    return JSON.parse(content);
  } catch (err) {
    console.error(`❌ Failed to parse JSON file: ${filePath}`);
    console.error(err.message);
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

// Basic-auth middleware (skips health and public frontend routes)
function basicAuthMiddleware(req, res, next) {
  // allow health checks and static frontend assets without auth
  if (req.path === '/health' || req.path.startsWith('/Frontend/Device Dashboard') || req.path.startsWith('/dashboard')) {
    return next();
  }

  const user = basicAuth(req);
  if (!user || user.name !== USERNAME || user.pass !== PASSWORD) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Authorization required"');
    return res.status(401).send('Access denied');
  }
  next();
}

app.use(basicAuthMiddleware);

// Middleware
app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));
app.use(bodyParser.json());
app.use(express.json());

// Static frontend (adjust the relative path if your build lives elsewhere)
app.use('/Frontend/Device Dashboard', express.static(path.join(__dirname, '../../Frontend/Device Dashboard')));
app.use('/dashboard', express.static(path.join(__dirname, '../../Frontend/Device Dashboard')));

// Routes
app.get('/health', (req, res) => res.json({ status: 'up' }));
app.use('/api/regions', regionRoutes);

// Load controller data (attempt common locations)
let controllerData = [];
const possibleControllerPaths = [
  path.join(__dirname, './src/data/ControllerDataWithDoorReader.json'),
  path.join(__dirname, '../src/data/ControllerDataWithDoorReader.json'),
  path.join(__dirname, 'src/data/ControllerDataWithDoorReader.json'),
];
for (const p of possibleControllerPaths) {
  try {
    if (fs.existsSync(p)) {
      controllerData = safeJsonParse(p);
      console.log('Loaded controller data from', p);
      break;
    }
  } catch (err) {
    // continue trying other paths
  }
}
if (!controllerData || !controllerData.length) {
  console.warn('⚠️ Controller data not found or empty. /api/controllers/status will return an empty array.');
}

// Device tracking
const devices = fetchAllIpAddress();
let deviceStatus = {};

// Load today's logs safely
const today = DateTime.now().setZone('Asia/Kolkata');
const todayLogFile = getLogFileForDate(today);
let todayLogs = fs.existsSync(todayLogFile) ? safeJsonParse(todayLogFile) : {};

function saveTodayLogs() {
  try {
    fs.writeFileSync(todayLogFile, JSON.stringify(todayLogs, null, 2));
  } catch (err) {
    console.error('Failed to write today logs:', err.message);
  }
}

function logDeviceChange(ip, status) {
  const timestamp = DateTime.now().setZone('Asia/Kolkata').toISO();
  const arr = (todayLogs[ip] = todayLogs[ip] || []);
  const last = arr[arr.length - 1];
  if (!last || last.status !== status) {
    arr.push({ status, timestamp });
    todayLogs[ip] = pruneOldEntries(arr, 30);
    saveTodayLogs();
  }
}

// Ping loop
async function pingDevices() {
  const pLimit = require('p-limit');
  const limit = pLimit(20);

  await Promise.all(
    devices.map(ip =>
      limit(async () => {
        try {
          const newStatus = await pingHost(ip);
          if (deviceStatus[ip] !== newStatus) {
            logDeviceChange(ip, newStatus);
          }
          deviceStatus[ip] = newStatus;
        } catch (err) {
          console.error('ping error for', ip, err.message);
        }
      })
    )
  );

  buildControllerStatus();
  console.log('Updated device status for', Object.keys(deviceStatus).length, 'devices');
}

// Controller + Door status builder (from controllerData)
let fullStatus = [];
function buildControllerStatus() {
  fullStatus = (controllerData || []).map(controller => {
    const ip = (controller.IP_address || '').toString().trim();
    const status = deviceStatus[ip] || 'Unknown';

    const doors = (controller.Doors || []).map(d => ({
      ...d,
      status: status === 'Online' ? 'Online' : 'Offline',
    }));

    return {
      controllername: controller.controllername,
      IP_address: ip,
      Location: controller.Location || 'Unknown',
      City: controller.City || 'Unknown',
      controllerStatus: status,
      Doors: doors,
    };
  });
}

// Start ping loop
setInterval(() => {
  pingDevices().catch(err => console.error('pingDevices error', err.message));
}, 60_000); // every minute

// initial run
(async () => {
  try {
    await pingDevices();
  } catch (err) {
    console.error('Initial pingDevices run failed:', err.message);
  }
})();

// API endpoints
app.get('/api/region/devices/status', (req, res) => {
  res.json(deviceStatus);
});

app.get('/api/devices/history', (req, res) => {
  const files = fs.readdirSync('.')
    .filter(f => f.startsWith('deviceLogs-') && f.endsWith('.json'));
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

app.get('/api/region/:region/history', (req, res) => {
  const region = req.params.region.toLowerCase();
  const files = fs.readdirSync('.')
    .filter(f => f.startsWith('deviceLogs-') && f.endsWith('.json'));
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

app.get('/api/device/history/:ip', (req, res) => {
  const ip = req.params.ip;
  const files = fs.readdirSync('.')
    .filter(f => f.startsWith('deviceLogs-') && f.endsWith('.json'));
  let history = [];
  for (const f of files) {
    const dayLogs = safeJsonParse(f);
    if (dayLogs[ip]) history = history.concat(dayLogs[ip]);
  }
  if (!history.length) {
    return res.status(404).json({ message: 'No history found for this device' });
  }
  history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  res.json({ ip, history });
});

app.get('/api/controllers/status', (req, res) => {
  res.json(fullStatus);
});

// Fallback to frontend index for SPA routes
app.get('/Frontend/Device Dashboard/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../Frontend/Device Dashboard/index.html'));
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
