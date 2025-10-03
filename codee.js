const exportToExcel = () => {
  const wb = XLSX.utils.book_new();

  // Extract table data
  const table = document.getElementById("companyTable");
  const ws = XLSX.utils.table_to_sheet(table, { raw: true });

  // Get range of data
  const range = XLSX.utils.decode_range(ws["!ref"]);

  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellAddress]) continue;

      // Default style (all cells)
      ws[cellAddress].s = {
        font: { name: "Calibri", sz: 11 },
        border: {
          top: { style: "thin", color: { rgb: "DDDDDD" } },
          bottom: { style: "thin", color: { rgb: "DDDDDD" } },
          left: { style: "thin", color: { rgb: "DDDDDD" } },
          right: { style: "thin", color: { rgb: "DDDDDD" } },
        },
        alignment: { horizontal: "center", vertical: "center" }
      };

      // Header style (Row 0)
      if (R === 0) {
        ws[cellAddress].s = {
          ...ws[cellAddress].s,
          font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
          fill: { type: "pattern", pattern: "solid", fgColor: { rgb: "2965CC" } }
        };
      }

      // Totals row style (last row)
      if (R === range.e.r) {
        ws[cellAddress].s = {
          ...ws[cellAddress].s,
          font: { bold: true, color: { rgb: "000000" }, sz: 12 },
          fill: { type: "pattern", pattern: "solid", fgColor: { rgb: "AACEF2" } }
        };
      }

      // Alternate row shading
      if (R > 0 && R < range.e.r && R % 2 === 0) {
        ws[cellAddress].s = {
          ...ws[cellAddress].s,
          fill: { type: "pattern", pattern: "solid", fgColor: { rgb: "F2F2F2" } }
        };
      }

      // Company name column → left align
      if (C === 1 && R > 0) {
        ws[cellAddress].s.alignment = { horizontal: "left", vertical: "center" };
      }
    }
  }

  // Auto column widths
  const colWidths = [];
  for (let C = range.s.c; C <= range.e.c; ++C) {
    let maxLen = 10;
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const value = ws[cellAddress]?.v ? ws[cellAddress].v.toString() : "";
      if (value.length > maxLen) maxLen = value.length;
    }
    colWidths.push({ wch: maxLen + 2 });
  }
  ws["!cols"] = colWidths;

  // Add sheet and save
  XLSX.utils.book_append_sheet(wb, ws, "Company Distribution");
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array", cellStyles: true });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "Company_Distribution.xlsx");
};