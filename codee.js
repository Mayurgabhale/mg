const cron = require("node-cron");
const dailyReportController = require("./controllers/dailyReportController");

// Send report every day at 11:00 AM
cron.schedule("0 11 * * *", () => {
    console.log("🕚 Running daily report task...");
    dailyReportController.sendDailyEmail();
});