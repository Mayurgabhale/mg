import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const handleExport = async (detailRows, pickedDate, selectedSummaryPartition) => {
  if (!detailRows?.length) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("EMEA Headcount");

  // Title row
  const reportTitle = `Western Union EMEA ${selectedSummaryPartition || ""} Headcount Report - ${pickedDate}`;
  worksheet.mergeCells("A1:I1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = reportTitle;
  titleCell.font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF002060" } };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  titleCell.border = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
  };

  worksheet.addRow([]);

  // Header styling
  const headerStyle = {
    font: { bold: true, color: { argb: "FFFFFFFF" } },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF305496" } },
    alignment: { vertical: "middle", horizontal: "center" },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    },
  };

  // Define columns
  worksheet.columns = [
    { header: "Employee ID", key: "empId", width: 15 },
    { header: "Name", key: "name", width: 25 },
    { header: "Company", key: "company", width: 20 },
    { header: "Country", key: "country", width: 20 },
    { header: "Department", key: "department", width: 25 },
    { header: "Job Title", key: "jobTitle", width: 25 },
    { header: "Status", key: "status", width: 15 },
    { header: "Join Date", key: "joinDate", width: 15 },
    { header: "End Date", key: "endDate", width: 15 },
  ];

  worksheet.getRow(3).eachCell((cell) => Object.assign(cell, { style: headerStyle }));

  // Add data rows
  detailRows.forEach((row, index) => {
    const addedRow = worksheet.addRow(row);
    const fillColor = index % 2 === 0 ? "FFFFFFFF" : "FFF2F2F2";
    addedRow.eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fillColor } };
      cell.border = headerStyle.border;
      cell.alignment = { vertical: "middle", horizontal: "left" };
    });
  });

  worksheet.columns.forEach((col) => {
    col.width = Math.max(15, ...col.values.map((v) => v?.toString().length || 0)) + 2;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${reportTitle}.xlsx`);
};






.......
export const handleExportSummaryEmea = async (partitionRows, selectedSummaryPartition, pickedDate) => {
  if (!partitionRows?.length) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("EMEA Summary");

  // Title
  const title = `Western Union EMEA ${selectedSummaryPartition || ""} Headcount Summary - ${pickedDate}`;
  worksheet.mergeCells("A1:C1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = title;
  titleCell.font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF002060" } };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  worksheet.addRow([]);

  const headerStyle = {
    font: { bold: true, color: { argb: "FFFFFFFF" } },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF305496" } },
    alignment: { vertical: "middle", horizontal: "center" },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    },
  };

  worksheet.columns = [
    { header: "Partition", key: "partition", width: 25 },
    { header: "Employee", key: "employee", width: 20 },
    { header: "Contractor", key: "contractor", width: 20 },
    { header: "Total", key: "total", width: 15 },
  ];

  worksheet.getRow(3).eachCell((cell) => Object.assign(cell, { style: headerStyle }));

  partitionRows.forEach((row, index) => {
    const addedRow = worksheet.addRow(row);
    const fillColor = index % 2 === 0 ? "FFFFFFFF" : "FFF2F2F2";
    addedRow.eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fillColor } };
      cell.border = headerStyle.border;
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `emea_summary_${pickedDate.replace(/\s+/g, "_")}.xlsx`);
};







......
export const handleExportCompaniesEmea = async (companyRows, pickedDate) => {
  if (!companyRows?.length) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("EMEA Companies");

  const title = `Western Union EMEA Companies Report - ${pickedDate}`;
  worksheet.mergeCells("A1:C1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = title;
  titleCell.font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF002060" } };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  worksheet.addRow([]);

  const headerStyle = {
    font: { bold: true, color: { argb: "FFFFFFFF" } },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF305496" } },
    alignment: { vertical: "middle", horizontal: "center" },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    },
  };

  worksheet.columns = [
    { header: "Company", key: "company", width: 25 },
    { header: "Country", key: "country", width: 20 },
    { header: "Headcount", key: "headcount", width: 15 },
  ];

  worksheet.getRow(3).eachCell((cell) => Object.assign(cell, { style: headerStyle }));

  companyRows.forEach((row, index) => {
    const addedRow = worksheet.addRow(row);
    const fillColor = index % 2 === 0 ? "FFFFFFFF" : "FFF2F2F2";
    addedRow.eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fillColor } };
      cell.border = headerStyle.border;
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `emea_companies_${pickedDate.replace(/\s+/g, "_")}.xlsx`);
};
