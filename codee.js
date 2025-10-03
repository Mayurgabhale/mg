import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const exportToExcel = () => {
  const wb = XLSX.utils.book_new();

  // Extract table data
  const table = document.getElementById("companyTable");
  const ws = XLSX.utils.table_to_sheet(table, { raw: true });

  // Apply styles
  const range = XLSX.utils.decode_range(ws["!ref"]);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellAddress]) continue;

      // Header style
      if (R === 0) {
        ws[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "2965CC" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }

      // Totals row style
      if (R === range.e.r) {
        ws[cellAddress].s = {
          font: { bold: true, color: { rgb: "000000" } },
          fill: { fgColor: { rgb: "aacef2" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    }
  }

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Company Distribution");

  // Save as Excel
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array", cellStyles: true });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "Company_Distribution.xlsx");
};