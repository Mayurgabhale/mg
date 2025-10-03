// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");

const employeeRoutes        = require('./routes/employeeRoutes');
const liveOccupancyRoutes   = require('./routes/liveOccupancyRoutes');
const occupancyDenverRoutes = require('./routes/occupancyDenverRoutes');
const dailyReportRoutes     = require("./routes/dailyReportRoutes");
const dailyReportController = require("./controllers/dailyReportController");

const app = express();
app.use(cors());
app.use(express.json());

// Your existing routes
app.use('/api', employeeRoutes);
app.use('/api', liveOccupancyRoutes);
app.use('/api', occupancyDenverRoutes);
app.use("/api/dailyReport", dailyReportRoutes);

// Schedule daily report at 11:00 AM
cron.schedule("0 11 * * *", () => {
    console.log("Running daily report email task...");
    dailyReportController.sendDailyEmail();
});

// Serve React build (if any)
const buildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(buildPath));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));


_____

This is my old where to add new code dailyReport
// C:\Users\W0024618\Desktop\swipeData\employee-ai-insights\server.js
// server.js
const express = require('express');
const cors    = require('cors');
const path    = require('path');


const employeeRoutes        = require('./routes/employeeRoutes');
const liveOccupancyRoutes   = require('./routes/liveOccupancyRoutes');
const occupancyDenverRoutes = require('./routes/occupancyDenverRoutes');
const dailyReportRoutes     = require("./routes/dailyReportRoutes");
const dailyReportController = require("./controllers/dailyReportController");

const app = express();
app.use(cors());
app.use(express.json());


// --- middleware to disable proxy buffering for SSE endpoints ---
const noBuffering = (req, res, next) => {
  // Nginx or other proxies honor this header to stream chunks immediately
  res.set('X-Accel-Buffering', 'no');
  next();
};


// simple sanity-check
app.get('/ping', (req, res) => res.send('pong'));




app.use('/api', employeeRoutes);

// Pune SSE (live occupancy)
app.use(
  '/api',
  noBuffering,
  liveOccupancyRoutes
);

// Denver SSE (live occupancy)

app.use(
  '/api',
  noBuffering,
  occupancyDenverRoutes
);



// debug: list registered endpoints
if (app._router && Array.isArray(app._router.stack)) {
  console.log('\n📋 Registered endpoints:');
  app._router.stack.forEach(layer => {
    if (layer.route && layer.route.path) {
      const methods = Object
        // .keys(layer.route.methods)
        // .map(m => m.toUpperCase())
        // .join(',');

        .keys(layer.route.methods)
        .map(m => m.toUpperCase())
        .join(',');

      console.log(`  ${methods}\t${layer.route.path}`);
    }
  });
}

// serve React build (if any)
const buildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(buildPath));

// health check
app.get('/health', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));





