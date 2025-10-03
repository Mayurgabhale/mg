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

      // Default border style
      ws[cellAddress].s = {
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
        alignment: { horizontal: "center", vertical: "center" }
      };

      // Header style (Row 0)
      if (R === 0) {
        ws[cellAddress].s = {
          ...ws[cellAddress].s,
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "2965CC" } },
        };
      }

      // Totals row style (last row)
      if (R === range.e.r) {
        ws[cellAddress].s = {
          ...ws[cellAddress].s,
          font: { bold: true, color: { rgb: "000000" } },
          fill: { fgColor: { rgb: "aacef2" } },
        };
      }
    }
  }

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Company Distribution");

  // Save file
  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
    cellStyles: true, // keep styles
  });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "Company_Distribution.xlsx");
};