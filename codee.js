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