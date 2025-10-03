// controllers/dailyReportController.js

let latestCompanyData = null; // store data received from frontend

// Save data from frontend
exports.saveCompanyData = (req, res) => {
    latestCompanyData = req.body;
    console.log("✅ Company data saved for daily report:", latestCompanyData);
    res.json({ success: true });
};

// Send daily report (plain text)
exports.sendDailyEmail = async () => {
    if (!latestCompanyData) {
        console.log("⚠️ No company data to send.");
        return;
    }

    // Construct a simple text email message
    let emailText = "Daily Company Report\n\n";

    if (latestCompanyData.filteredCompanies && latestCompanyData.filteredCompanies.length) {
        latestCompanyData.filteredCompanies.forEach((company, idx) => {
            emailText += `${idx + 1}. ${company.name} - Total: ${company.total}\n`;
            emailText += `   Podium Floor: ${company.byBuilding["Podium Floor"] || 0}, `;
            emailText += `2nd Floor: ${company.byBuilding["2nd Floor"] || 0}, `;
            emailText += `Tower B: ${company.byBuilding["Tower B"] || 0}\n`;
        });
    }

    // Add overall totals if available
    if (latestCompanyData.buildingTotals) {
        emailText += `\nOverall Totals:\n`;
        emailText += `Podium Floor: ${latestCompanyData.buildingTotals["Podium Floor"] || 0}\n`;
        emailText += `2nd Floor: ${latestCompanyData.buildingTotals["2nd Floor"] || 0}\n`;
        emailText += `Tower B: ${latestCompanyData.buildingTotals["Tower B"] || 0}\n`;
    }

    if (latestCompanyData.totalCount !== undefined) {
        emailText += `Total Employees: ${latestCompanyData.totalCount}\n`;
    }

    // For now, just log the "email" to console
    console.log("📧 Sending daily report (plain text):\n", emailText);

    // TODO: Later, integrate real email sending or webhook here
};





const cron = require("node-cron");
const dailyReportController = require("./controllers/dailyReportController");

// Send report every day at 11:00 AM
cron.schedule("0 11 * * *", () => {
    console.log("🕚 Running daily report task...");
    dailyReportController.sendDailyEmail();
});