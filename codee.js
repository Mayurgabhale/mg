

  const handleExportCompanies = async () => {
    if (!pickedDate || !companyRows.length) return;

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Company Summary');

    // set up columns
    ws.columns = [
      { header: 'Country', key: 'country', width: 20 },
      { header: 'City', key: 'city', width: 25 },
      { header: 'Company', key: 'company', width: 40 },
      { header: 'Total', key: 'total', width: 12 },
    ];

    // merge top row for date
    ws.mergeCells('A1:D1');
    const dateCell = ws.getCell('A1');
    dateCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
    dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
    dateCell.font = { name: 'Calibri', size: 14, bold: true };

    // blank spacer
    ws.addRow([]);

    // header row
    const headerRow = ws.addRow(['Country', 'City', 'Company', 'Total']);
    headerRow.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
      cell.font = { bold: true, color: { argb: 'FF000000' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // data rows
    companyRows.forEach(r => {
      const row = ws.addRow([r.country, r.city, r.company, r.total]);
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (colNumber === 4) {
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
          cell.numFmt = '#,##0';
        } else {
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
        }
      });
    });

    // totals row
    const total = companyRows.reduce((s, r) => s + r.total, 0);
    const totalRow = ws.addRow(['Total', '', '', total]);
    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      if (colNumber === 4) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.numFmt = '#,##0';
      } else {
        cell.alignment = { horizontal: colNumber === 1 ? 'left' : 'center', vertical: 'middle' };
      }
    });

    // save
    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `emea_companies_${format(pickedDate, "yyyyMMdd")}.xlsx`);
  };


  const handleExportSummary = async () => {
    if (!pickedDate) return;

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Summary');

    // Row 1: merged date centered 
    ws.mergeCells('A1:E1');
    const dateCell = ws.getCell('A1');
    dateCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
    dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
    dateCell.font = { name: 'Calibri', size: 14, bold: true };

    // Row 3: header row
    const headerRow = ws.addRow(['Country', 'City', 'Employees', 'Contractors', 'Total']);
    headerRow.height = 20;

    // style helpers
    const thinBorder = { style: 'thin', color: { argb: 'FF000000' } };
    const allThinBorder = { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder };

    // header style: yellow fill, bold, centered
    headerRow.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
      cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF000000' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = allThinBorder;
    });

    // Data rows start after the spacer
    partitionRows.forEach(r => {
      const row = ws.addRow([r.country, r.city, r.employee, r.contractor, r.total]);
      row.eachCell((cell, colNumber) => {
        cell.border = allThinBorder;
        if (colNumber >= 3) {
          // numeric columns: right align, number format
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
          if (cell.value !== null && cell.value !== undefined && cell.value !== '') {
            cell.numFmt = '#,##0';
          }
        } else {
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
        }
        cell.font = { name: 'Calibri', size: 11, color: { argb: 'FF000000' } };
      });
    });

    // Final total row
    const totalEmployees = partitionRows.reduce((s, r) => s + r.employee, 0);
    const totalContractors = partitionRows.reduce((s, r) => s + r.contractor, 0);
    const totalTotal = partitionRows.reduce((s, r) => s + r.total, 0);
    const totalRow = ws.addRow(['Total', '', totalEmployees, totalContractors, totalTotal]);

    totalRow.eachCell((cell, colNumber) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } }; // light gray
      cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF000000' } };
      cell.border = allThinBorder;
      if (colNumber >= 3) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.numFmt = '#,##0';
      } else {
        cell.alignment = { horizontal: colNumber === 1 ? 'left' : 'center', vertical: 'middle' };
      }
    });

    // Freeze panes so header is visible (freeze above data rows: after the header + spacer rows)
    ws.views = [{ state: 'frozen', ySplit: 2 }];

    // Autosize columns (reasonable limits)
    ws.columns.forEach(col => {
      let maxLen = 10;
      col.eachCell({ includeEmpty: true }, c => {
        const v = c.value === null || c.value === undefined ? '' : String(c.value);
        maxLen = Math.max(maxLen, v.trim().length + 2);
      });
      col.width = Math.min(Math.max(maxLen, 8), 40);
    });

    // export
    const buf = await wb.xlsx.writeBuffer();
    const safeDate = format(pickedDate, 'yyyyMMdd');
    const filename = `emea_summary_${safeDate}.xlsx`;
    saveAs(new Blob([buf]), filename);
  };
