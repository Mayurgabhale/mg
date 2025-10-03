// controllers/dailyReportController.js
const nodemailer = require("nodemailer");

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