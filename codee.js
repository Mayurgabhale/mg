// controllers/dailyReportController.js
const nodemailer = require("nodemailer"); // Nodemailer for sending emails

// In-memory store (note: will be lost on restart — consider DB/file if persistence required)
let latestCompanyData = null;

// Save company data from frontend
exports.saveCompanyData = (req, res) => {
  latestCompanyData = req.body;
  // Log a trimmed version to avoid huge dumps; full object can be logged conditionally
  console.log("✅ Company data saved for daily report. totalCount:", latestCompanyData?.totalCount || 0);
  res.json({ success: true });
};

// Debug endpoint: return if there's data
exports.getSavedData = (req, res) => {
  res.json({ hasData: !!latestCompanyData, latestCompanyData });
};

// Clear saved data (useful for testing)
exports.clearSavedData = (req, res) => {
  latestCompanyData = null;
  console.log("🧹 Cleared saved daily report data.");
  res.json({ success: true });
};

// Send daily email (kept side-effect free so cron can call it from server.js)
exports.sendDailyEmail = async () => {
  if (!latestCompanyData) {
    console.log("⚠️ No company data to send for daily report.");
    return;
  }

  const { filteredCompanies = [], buildingTotals = {}, totalCount = 0 } = latestCompanyData;

  // Build plain text email content
  let textData = "📊 Daily Company Distribution Report\n\n";
  textData += "Rank | Company | Podium Floor | 2nd Floor | Tower B | Total\n";
  textData += "------------------------------------------------------------\n";

  filteredCompanies.forEach((c, i) => {
    textData += `${i + 1} | ${c.name} | ${c.byBuilding?.["Podium Floor"] || 0} | ${c.byBuilding?.["2nd Floor"] || 0} | ${c.byBuilding?.["Tower B"] || 0} | ${c.total}\n`;
  });

  textData += "------------------------------------------------------------\n";
  textData += `Totals | - | ${buildingTotals["Podium Floor"] || 0} | ${buildingTotals["2nd Floor"] || 0} | ${buildingTotals["Tower B"] || 0} | ${totalCount}\n\n`;
  textData += `Generated at: ${new Date().toISOString()}\n`;

  console.log("📧 Preparing to send daily report email...");

  try {
    // Use environment variables for SMTP config
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "mail.mayoai.tech",
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
      secure: process.env.SMTP_SECURE === "false" ? false : true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // For local/testing with self-signed certs you can temporarily allow:
      // tls: { rejectUnauthorized: process.env.SMTP_REJECT_UNAUTH === "false" ? false : true }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.DAILY_REPORT_TO || process.env.SMTP_USER,
      subject: "Daily Company Distribution Report",
      text: textData,
    });

    console.log("✅ Daily report email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending daily report email:", error);
  }
};