import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

/** ============================
 *  1️⃣  EMEA Employee Export
 *  ============================ */
export const handleExportEMEA = async (emeaData) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("WU Employee");

  // Title Row
  worksheet.mergeCells("A1:H1");
  const title = worksheet.getCell("A1");
  title.value = "WU Employee";
  title.font = { size: 16, bold: true };
  title.alignment = { vertical: "middle", horizontal: "center" };

  // Header Row
  const headers = [
    "Name",
    "Position",
    "Location",
    "Email",
    "Department",
    "Manager",
    "Start Date",
    "Status",
  ];
  worksheet.addRow(headers);

  const headerRow = worksheet.getRow(2);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF000000" }, // black header
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Data Rows
  emeaData.forEach((item) => {
    worksheet.addRow([
      item.name,
      item.position,
      item.location,
      item.email,
      item.department,
      item.manager,
      item.startDate,
      item.status,
    ]);
  });

  // Formatting rows
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 2) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    }
  });

  // Auto-fit columns
  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const length = cell.value ? cell.value.toString().length : 10;
      if (length > maxLength) maxLength = length;
    });
    column.width = maxLength + 2;
  });

  // Freeze top row
  worksheet.views = [{ state: "frozen", ySplit: 2 }];

  // Save file
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "WU_Employee_EMEA.xlsx");
};

/** ============================
 *  2️⃣  EMEA Summary Export
 *  ============================ */
export const handleExportEMEASummary = async (summaryData) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("WU Summary");

  worksheet.mergeCells("A1:E1");
  const title = worksheet.getCell("A1");
  title.value = "WU Summary";
  title.font = { size: 16, bold: true };
  title.alignment = { vertical: "middle", horizontal: "center" };

  const headers = ["Department", "Total Employees", "Active", "On Leave", "Turnover Rate"];
  worksheet.addRow(headers);

  const headerRow = worksheet.getRow(2);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF000000" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  summaryData.forEach((item) => {
    worksheet.addRow([
      item.department,
      item.totalEmployees,
      item.active,
      item.onLeave,
      `${item.turnoverRate}%`,
    ]);
  });

  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const length = cell.value ? cell.value.toString().length : 10;
      if (length > maxLength) maxLength = length;
    });
    column.width = maxLength + 2;
  });

  worksheet.views = [{ state: "frozen", ySplit: 2 }];

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "WU_Summary_EMEA.xlsx");
};

/** ============================
 *  3️⃣  EMEA Companies Export
 *  ============================ */
export const handleExportEMEACompanies = async (companyData) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Company Summary");

  worksheet.mergeCells("A1:F1");
  const title = worksheet.getCell("A1");
  title.value = "Company Summary";
  title.font = { size: 16, bold: true };
  title.alignment = { vertical: "middle", horizontal: "center" };

  const headers = [
    "Company Name",
    "Country",
    "Employees",
    "Revenue (USD)",
    "Industry",
    "Status",
  ];
  worksheet.addRow(headers);

  const headerRow = worksheet.getRow(2);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF000000" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  companyData.forEach((item) => {
    worksheet.addRow([
      item.companyName,
      item.country,
      item.employees,
      item.revenue,
      item.industry,
      item.status,
    ]);
  });

  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const length = cell.value ? cell.value.toString().length : 10;
      if (length > maxLength) maxLength = length;
    });
    column.width = maxLength + 2;
  });

  worksheet.views = [{ state: "frozen", ySplit: 2 }];

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "Company_Summary_EMEA.xlsx");
};