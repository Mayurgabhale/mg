import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Add this inside your component:

// Export a floor table to Excel, styled like dashboard
const exportFloorToExcel = (floor) => {
  const rows = getRowsForFloor(floor);
  if (!rows || rows.length === 0) return;

  const dataForExcel = rows.map((r) => ({
    "Employee ID": r.EmployeeID,
    Name: r.ObjectName1,
    "Swipe Time": formatApiTime12(r.LocaleMessageTime, r.Swipe_Time),
    Type: r.PersonnelType,
    Card: r.CardNumber,
    Door: r.Door,
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { origin: "A2" });

  // Header row with dashboard-style color
  const headerRow = ["Employee ID", "Name", "Swipe Time", "Type", "Card", "Door"];
  XLSX.utils.sheet_add_aoa(worksheet, [headerRow], { origin: "A1" });

  // Column widths
  worksheet['!cols'] = [
    { wpx: 80 }, // Employee ID
    { wpx: 120 }, // Name
    { wpx: 100 }, // Swipe Time
    { wpx: 80 }, // Type
    { wpx: 80 }, // Card
    { wpx: 80 }, // Door
  ];

  // Apply basic header styling (yellow bg like dashboard)
  headerRow.forEach((_, colIdx) => {
    const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: colIdx })];
    if (cell) {
      cell.s = {
        fill: { fgColor: { rgb: "FFC107" } },
        font: { bold: true, color: { rgb: "000000" } },
        alignment: { horizontal: "center" },
      };
    }
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, floor);

  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), `${floor}-Details.xlsx`);
};