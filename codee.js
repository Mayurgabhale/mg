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


// controllers/dailyReportController.js

let latestCompanyData = null; // store data sent from frontend

// 1️⃣ Save data from frontend
exports.saveCompanyData = (req, res) => {
    latestCompanyData = req.body;
    console.log("Company data saved for daily report");
    res.json({ success: true });
};

// 2️⃣ Send daily email with simple text table
exports.sendDailyEmail = async () => {
    if (!latestCompanyData) return console.log("No data to send.");

    const { filteredCompanies, buildingTotals, totalCount } = latestCompanyData;

    // Convert data to text table
    let textData = "Daily Company Distribution Report\n\n";
    textData += "Rank | Company | Podium Floor | 2nd Floor | Tower B | Total\n";
    textData += "------------------------------------------------------------\n";

    filteredCompanies.forEach((c, i) => {
        textData += `${i + 1} | ${c.name} | ${c.byBuilding["Podium Floor"] || 0} | ${c.byBuilding["2nd Floor"] || 0} | ${c.byBuilding["Tower B"] || 0} | ${c.total}\n`;
    });

    // Totals row
    textData += "------------------------------------------------------------\n";
    textData += `Totals | - | ${buildingTotals["Podium Floor"] || 0} | ${buildingTotals["2nd Floor"] || 0} | ${buildingTotals["Tower B"] || 0} | ${totalCount || 0}\n`;

    // Configure email transporter
    const transporter = nodemailer.createTransport({
        host: "smtp.yourcompany.com",   // replace with your SMTP host
        port: 587,                      // adjust port if needed
        secure: false,                  // true for 465, false for 587
        auth: {
            user: "your_email@company.com",  // replace with your email
            pass: "your_password",           // replace with your email password
        },
    });

    // Send email
    await transporter.sendMail({
        from: "your_email@company.com",
        to: "recipient@company.com",  // replace with recipient email
        subject: "Daily Company Distribution Report",
        text: textData,
    });

    console.log("Daily report email sent with data!");
};
