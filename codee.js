if i want to test email is sending or not 
so i just use my person email,
    it can work no no tell me 
// controllers/dailyReportController.js

const nodemailer = require("nodemailer"); // ✅ Import nodemailer

let latestCompanyData = null; // store data received from frontend

// 1️⃣ Save data from frontend
exports.saveCompanyData = (req, res) => {
    latestCompanyData = req.body;
    console.log("✅ Company data saved for daily report:", latestCompanyData);
    res.json({ success: true });
};

// 2️⃣ Send daily email with plain text data
exports.sendDailyEmail = async () => {
    if (!latestCompanyData) {
        console.log("⚠️ No data to send for daily report.");
        return;
    }

    const { filteredCompanies, buildingTotals, totalCount } = latestCompanyData;

    // Build plain text message
    let textData = "📊 Daily Company Distribution Report\n\n";
    textData += "Rank | Company | Podium Floor | 2nd Floor | Tower B | Total\n";
    textData += "------------------------------------------------------------\n";

    filteredCompanies.forEach((c, i) => {
        textData += `${i + 1} | ${c.name} | ${c.byBuilding["Podium Floor"] || 0} | ${c.byBuilding["2nd Floor"] || 0} | ${c.byBuilding["Tower B"] || 0} | ${c.total}\n`;
    });

    textData += "------------------------------------------------------------\n";
    textData += `Totals | - | ${buildingTotals["Podium Floor"] || 0} | ${buildingTotals["2nd Floor"] || 0} | ${buildingTotals["Tower B"] || 0} | ${totalCount || 0}\n`;

    console.log("📧 Preparing to send daily report email...");

    try {
        // Configure your SMTP transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.yourcompany.com",   // replace with your SMTP host
            port: 587,                      // adjust if needed
            secure: false,                  // true for 465, false for 587
            auth: {
                user: "your_email@company.com", // replace with your email
                pass: "your_password",          // replace with your email password or app password
            },
        });

        // Send the email
        await transporter.sendMail({
            from: "mayurgabhale709@gmail.com",           // sender
            to: "mayurgabhale709@gmail.com",             // recipient(s)
            subject: "Daily Company Distribution Report",
            text: textData,                          // plain text body
        });

        console.log("✅ Daily report email sent successfully!");
    } catch (error) {
        console.error("❌ Error sending daily report email:", error);
    }
};
