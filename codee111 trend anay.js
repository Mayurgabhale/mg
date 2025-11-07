ok.. now how to do this..
  for example  thus "controllername": "IN-PUN-2NDFLR-ISTAR PRO",
        "IP_address": "10.199.13.10",
goes to offline that again i want ot show  "Doors": [
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
  this door and read alos offline so how to do this   
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
    {
        "controllername": "IN-PUN-PODIUM-ISTAR PRO-01",
        "IP_address": "10.199.8.20",
        "Location": "APAC",
        "City": "Pune Podium",
        "Doors": [
            {
                "Door": "APAC_IN-PUN-PODIUM-RED-RECREATION AREA FIRE EXIT 1-DOOR",
                "Reader": ""
            },
            {
                "Door": "APAC_IN_PUN_PODIUM_RED_IDF ROOM-02-Restricted Door",
                "Reader": "in:1"
            },
            {
                "Door": "APAC_IN-PUN-PODIUM-MAIN PODIUM LEFT ENTRY-DOOR",
                "Reader": "in:1"
            },
            {
                "Door": "APAC_IN_PUN_PODIUM_MAIN PODIUM RIGHT ENTRY-DOOR",
                "Reader": "in:1"
            },
            {
                "Door": "APAC_IN-PUN-PODIUM-RED-RECEPTION TO WS ENTRY 1-DOOR",
                "Reader": ""
            },
            {
                "Door": "APAC_IN_PUN_PODIUM_ST2 DOOR 1 (RED)",
                "Reader": "in:1"
            },
            {
                "Door": "APAC_IN_PUN_PODIUM_RED_MAIN LIFT LOBBY ENTRY 1-DOOR",
                "Reader": "in:1"
            },
            {
                "Door": "APAC_IN_PUN_PODIUM_RED_MAIN LIFT LOBBY ENTRY 1-DOOR",
                "Reader": "out:1"
            },
            {
                "Door": "APAC_IN_PUN_PODIUM_ST 1-DOOR 1 (RED)",
                "Reader": "in:1"
            },
            {
                "Door": "APAC_IN_PUN_PODIUM_ST 1-DOOR 1 (RED)",
                "Reader": "out:1"
            },
            {
                "Door": "APAC_IN-PUN-PODIUM-YELLOW- SERVICE PASSAGE 1 ENTRY-DOOR",
                "Reader": ""
            },
            {
                "Door": "APAC_IN-PUN-PODIUM-YELLOW-MAIN LIFT LOBBY-DOOR",
                "Reader": ""
            },
            {
                "Door": "APAC_IN_PUN_PODIUM_ST2 DOOR 2 (YELLOW)",
                "Reader": "in:1"
            },
            {
                "Door": "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 1-DOOR",
                "Reader": "in:1"
            },
            {
                "Door": "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 2-DOOR",
                "Reader": "in:1"
            },
            {
                "Door": "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 3-DOOR",
                "Reader": "in:1"
            },
            {
                "Door": "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 4-DOOR",
                "Reader": "in:1"
            },
            {
                "Door": "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 2 -OUT DOOR",
                "Reader": "out:1"
            },
            {
                "Door": "APAC_IN_PUN-PODIUM_P-1 TURNSTILE 3 -OUT DOOR",
                "Reader": "out:1"
            },
            {
                "Door": "APAC_IN_PUN_PODIUM_P-1 TURNSTILE 1-OUT DOOR",
                "Reader": "out:1"
            }
        ]
    },
    {
        "controllername": "IN-PUN-PODIUM-ISTAR PRO-02",
        "IP_address": "10.199.8.21",


      this is my privius code ;;; 

read belwo all code carefully and how ot do this... 
  
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
  console.log("Updated device status:", deviceStatus);
 }



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


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



-----------


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



