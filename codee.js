import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// inside PartitionDetailDetails
const exportFloorToExcel = async (floor) => {
  const rows = getRowsForFloor(floor);
  if (!rows || rows.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Entries");

  // --- Title row (merged) ---
  sheet.mergeCells("A1:H1");
  const titleCell = sheet.getCell("A1");
  titleCell.value = `${floor} — Entries`;
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  titleCell.font = { name: "Calibri", size: 14, bold: true, color: { argb: "FF000000" } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "8a8987" } };

  // --- Header row ---
  const headers = ["Sr No", "ID", "Name", "Time", "Type", "CompanyName", "Card", "Door"];
  const headerRow = sheet.addRow(headers);
  headerRow.eachCell((cell) => {
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF000000" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFC107" } };
    cell.border = {
      top: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } }
    };
  });

  // --- Data rows ---
  rows.forEach((r, i) => {
    const row = sheet.addRow([
      i + 1,
      r.EmployeeID ?? "",
      r.ObjectName1 ?? "",
      formatApiTime12(r.LocaleMessageTime),
      r.PersonnelType ?? "",
      r.CompanyName ?? "",
      r.CardNumber ?? "",
      r.Door ?? ""
    ]);

    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle" };
      cell.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } }
      };
    });

    // alternate row color
    if ((i + 1) % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF7F7F7" } };
      });
    }
  });

  // --- Column widths ---
  sheet.columns = [
    { key: "sr", width: 8 },
    { key: "id", width: 14 },
    { key: "name", width: 28 },
    { key: "time", width: 16 },
    { key: "type", width: 16 },
    { key: "company", width: 34 },
    { key: "card", width: 18 },
    { key: "door", width: 50 }
  ];

  // --- Freeze header ---
  sheet.views = [{ state: "frozen", ySplit: 2 }];

  // --- Save file ---
  const buf = await workbook.xlsx.writeBuffer();
  const safeFloor = String(floor).replace(/[^a-z0-9\-_]/gi, "_").slice(0, 80);
  const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  saveAs(new Blob([buf]), `${safeFloor}_entries_${ts}.xlsx`);
};