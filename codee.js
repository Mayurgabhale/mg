const XLSX = require("xlsx-js-style");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

let latestCompanyData = null; // store data received from frontend

// Save data from frontend
exports.saveCompanyData = (req, res) => {
    latestCompanyData = req.body;
    console.log("Company data saved for daily report");
    res.json({ success: true });
};

// Generate Excel file
const generateExcel = () => {
    if (!latestCompanyData) return null;

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(latestCompanyData.filteredCompanies);

    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            if (!ws[cellAddress]) continue;

            // Header
            if (R === 0) {
                ws[cellAddress].s = {
                    font: { bold: true, color: { rgb: "FFFFFF" } },
                    fill: { fgColor: { rgb: "2965CC" } },
                    alignment: { horizontal: "center" },
                };
            }

            // Totals row (last row)
            if (R === range.e.r) {
                ws[cellAddress].s = {
                    font: { bold: true, color: { rgb: "000000" } },
                    fill: { fgColor: { rgb: "AACEF2" } },
                    alignment: { horizontal: "center" },
                };
            }

            // Alternate row shading
            if (R > 0 && R < range.e.r && R % 2 === 0) {
                ws[cellAddress].s = {
                    fill: { fgColor: { rgb: "F2F2F2" } },
                };
            }

            // Company column → left align
            if (C === 1 && R > 0) {
                ws[cellAddress].s.alignment = { horizontal: "left", vertical: "center" };
            }
        }
    }

    XLSX.utils.book_append_sheet(wb, ws, "Company Distribution");

    const filePath = path.join(__dirname, "../reports/Company_Distribution.xlsx");
    XLSX.writeFile(wb, filePath);
    return filePath;
};

// Send email with Excel attachment
exports.sendDailyEmail = async () => {
    if (!latestCompanyData) return console.log("No data to send.");

    const filePath = generateExcel();
    if (!filePath) return;

    const transporter = nodemailer.createTransport({
        host: "smtp.yourcompany.com",
        port: 587,
        secure: false,
        auth: { user: "your_email@company.com", pass: "your_password" },
    });

    await transporter.sendMail({
        from: "your_email@company.com",
        to: "recipient@company.com", // or multiple emails
        subject: "Daily Company Distribution Report",
        text: "Please find attached the daily company distribution report.",
        attachments: [{ filename: "Company_Distribution.xlsx", path: filePath }],
    });

    console.log("Daily report email sent!");
};