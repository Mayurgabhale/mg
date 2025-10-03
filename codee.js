const nodemailer = require("nodemailer"); // ✅ Nodemailer for sending emails
const cron = require("node-cron");       // ✅ Cron for scheduling

// Store data received from frontend
let latestCompanyData = null;

// 1️⃣ Save company data from frontend
exports.saveCompanyData = (req, res) => {
  latestCompanyData = req.body;
  console.log("✅ Company data saved for daily report:", latestCompanyData);
  res.json({ success: true });
};

// 2️⃣ Send daily email with plain text data
exports.sendDailyEmail = async () => {
  if (!latestCompanyData) {
    console.log("⚠️ No company data to send for daily report.");
    return;
  }

  const { filteredCompanies, buildingTotals, totalCount } = latestCompanyData;

  // Build plain text email content
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
    // SMTP transporter using mayoai.tech settings
    const transporter = nodemailer.createTransport({
      host: "mail.mayoai.tech",
      port: 465,
      secure: true, // SSL
      auth: {
        user: "info@mayoai.tech",
        pass: "YOUR_EMAIL_PASSWORD", // <-- Replace with actual password
      },
    });

    // Send email
    await transporter.sendMail({
      from: "info@mayoai.tech",
      to: "info@mayoai.tech", // or any test email you want to send to
      subject: "Daily Company Distribution Report",
      text: textData,
    });

    console.log("✅ Daily report email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending daily report email:", error);
  }
};

// 3️⃣ Schedule daily report at 11:00 AM
cron.schedule("0 11 * * *", () => {
  console.log("🕚 Running daily report task...");
  exports.sendDailyEmail();
});