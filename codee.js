// Proper column-to-letter helper
const colLetter = (col) => {
  let letter = '';
  while (col > 0) {
    let rem = (col - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    col = Math.floor((col - 1) / 26);
  }
  return letter;
};

const handleExportSummary = async () => {
  if (!pickedDate || !partitionRows?.length) return;

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Summary');

  const offsetRow = 2;
  const offsetCol = 2;
  const firstCol = offsetCol;
  const headers = ['Country', 'City', 'Employees', 'Contractors', 'Total'];
  const lastCol = firstCol + headers.length - 1;

  // --- Title row with date
  ws.mergeCells(`${colLetter(firstCol)}${offsetRow}:${colLetter(lastCol)}${offsetRow}`);
  const titleCell = ws.getCell(offsetRow, firstCol);
  titleCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
  titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFC107' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  titleCell.border = { top: { style: 'medium' }, bottom: { style: 'medium' }, left: { style: 'medium' }, right: { style: 'medium' } };
  ws.getRow(offsetRow).height = 22;

  // --- Header row
  const headerRowIndex = offsetRow + 1;
  headers.forEach((h, idx) => {
    const c = firstCol + idx;
    const cell = ws.getCell(headerRowIndex, c);
    cell.value = h;
    cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF000000' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
  });
  ws.getRow(headerRowIndex).height = 22;

  // --- Data rows
  const dataStartRow = headerRowIndex + 1;
  partitionRows.forEach((r, i) => {
    const rowIndex = dataStartRow + i;
    ws.getRow(rowIndex).height = 22;
    headers.forEach((_, idx) => {
      const c = firstCol + idx;
      const cell = ws.getCell(rowIndex, c);
      const val = idx === 0 ? r.country
                : idx === 1 ? r.city
                : idx === 2 ? r.employee
                : idx === 3 ? r.contractor
                : r.total;
      cell.value = val;
      cell.font = { name: 'Calibri', size: 10 };
      cell.alignment = idx >= 2 ? { horizontal: 'right', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
      if (idx >= 2) cell.numFmt = '#,##0';
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
  });

  // --- Totals row
  const lastDataRow = dataStartRow + partitionRows.length - 1;
  const totalsRowIndex = lastDataRow + 1;
  const totalEmployees = partitionRows.reduce((s, r) => s + (r.employee || 0), 0);
  const totalContractors = partitionRows.reduce((s, r) => s + (r.contractor || 0), 0);
  const totalTotal = partitionRows.reduce((s, r) => s + (r.total || 0), 0);

  for (let c = firstCol; c <= lastCol; c++) {
    const cell = ws.getCell(totalsRowIndex, c);
    if (c === firstCol) cell.value = 'Total';
    if (c === firstCol + 2) cell.value = totalEmployees;
    if (c === firstCol + 3) cell.value = totalContractors;
    if (c === firstCol + 4) cell.value = totalTotal;
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
    cell.alignment = { horizontal: 'right', vertical: 'middle' };
    if (c >= firstCol + 2) cell.numFmt = '#,##0';
    cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
  }
  ws.getRow(totalsRowIndex).height = 22;

  // --- Freeze header
  ws.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];

  // --- Autosize columns
  for (let c = firstCol; c <= lastCol; c++) {
    let maxLen = 0;
    for (let r = offsetRow; r <= totalsRowIndex; r++) {
      const v = ws.getCell(r, c).value ?? '';
      maxLen = Math.max(maxLen, String(v).length);
    }
    ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 6), 50);
  }

  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `emea_summary_${format(pickedDate, 'yyyyMMdd')}.xlsx`);
};



// Proper column-to-letter helper

const handleExportCompanies = async () => {
  if (!pickedDate || !companyRows?.length) return;

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Company Summary');

  const offsetRow = 2;
  const offsetCol = 2;
  const firstCol = offsetCol;
  const headers = ['Country', 'City', 'Company', 'Total'];
  const lastCol = firstCol + headers.length - 1;

  // --- Title row
  ws.mergeCells(`${colLetter(firstCol)}${offsetRow}:${colLetter(lastCol)}${offsetRow}`);
  const titleCell = ws.getCell(offsetRow, firstCol);
  titleCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
  titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFC107' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  titleCell.border = { top: { style: 'medium' }, bottom: { style: 'medium' }, left: { style: 'medium' }, right: { style: 'medium' } };
  ws.getRow(offsetRow).height = 22;

  // --- Header row
  const headerRowIndex = offsetRow + 1;
  headers.forEach((h, idx) => {
    const c = firstCol + idx;
    const cell = ws.getCell(headerRowIndex, c);
    cell.value = h;
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
  });
  ws.getRow(headerRowIndex).height = 22;

  // --- Data rows
  const dataStartRow = headerRowIndex + 1;
  companyRows.forEach((r, i) => {
    const rowIndex = dataStartRow + i;
    ws.getRow(rowIndex).height = 22;
    const rowValues = [r.country, r.city, r.company, r.total];
    rowValues.forEach((val, idx) => {
      const c = firstCol + idx;
      const cell = ws.getCell(rowIndex, c);
      cell.value = val;
      cell.font = { name: 'Calibri', size: 10 };
      cell.alignment = idx === 3 ? { horizontal: 'right', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
      if (idx === 3 && typeof val === 'number') cell.numFmt = '#,##0';
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
  });

  // --- Totals row
  const lastDataRow = dataStartRow + companyRows.length - 1;
  const totalsRowIndex = lastDataRow + 1;
  const total = companyRows.reduce((sum, r) => sum + (r.total || 0), 0);
  for (let c = firstCol; c <= lastCol; c++) {
    const cell = ws.getCell(totalsRowIndex, c);
    if (c === firstCol) cell.value = 'Total';
    if (c === firstCol + 3) cell.value = total;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { horizontal: 'right', vertical: 'middle' };
    cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
    if (c === firstCol + 3 && typeof cell.value === 'number') cell.numFmt = '#,##0';
  }
  ws.getRow(totalsRowIndex).height = 22;

  // --- Freeze headers
  ws.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];

  // --- Autosize columns
  for (let c = firstCol; c <= lastCol; c++) {
    let maxLen = 0;
    for (let r = offsetRow; r <= totalsRowIndex; r++) {
      const val = ws.getCell(r, c).value ?? '';
      maxLen = Math.max(maxLen, String(val).length);
    }
    ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 8), 50);
  }

  // --- Export
  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `emea_companies_${format(pickedDate, "yyyyMMdd")}.xlsx`);

read above both and i want same strcute desing and color for below code ok 
for this ::
  
  const handleExportSummary = async () => {
    try {
      // dynamic import avoids issues with different bundler exports
      const excelModule = await import('exceljs');
      const Excel = excelModule.default || excelModule;

      // create workbook in a robust way depending on how exceljs was exported
      let wb;
      if (Excel && Excel.Workbook) {
        wb = new Excel.Workbook();
      } else if (typeof Excel === 'function') {
        // some builds export the constructor directly
        wb = new Excel();
      } else {
        throw new Error('ExcelJS Workbook constructor not found in imported module');
      }

      const ws = wb.addWorksheet('Summary');

      // Headers
      const headers = ['Country', 'City', 'Employee', 'Contractors'];
      if (isCostaRica) headers.push('Temp Badge');
      headers.push('Total');

      // Title row (date)
      ws.mergeCells(`A1:${String.fromCharCode(64 + headers.length)}1`);
      const titleCell = ws.getCell('A1');
      titleCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      titleCell.font = { name: 'Calibri', size: 14, bold: true };

      // spacer
      ws.addRow([]);
      // Header row (row 3)
      const headerRow = ws.addRow(headers);
      headerRow.eachCell(cell => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC107' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } },
        };
      });
      // Data rows
      partitionRows.forEach((r, i) => {
        const rowVals = [
          r.country,
          r.city,
          r.employee,
          r.contractor,
          ...(isCostaRica ? [r.tempBadge] : []),
          r.total
        ];
        const row = ws.addRow(rowVals);
        // borders & alignment
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
            right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          };
          cell.alignment = { vertical: 'middle', horizontal: (colNumber >= 3) ? 'right' : 'left' };
          cell.font = { name: 'Calibri', size: 11 };
        });
        // zebra
        if (i % 2 === 1) {
          row.eachCell(cell => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
          });
        }
      });
      // Totals row
      const totalEmployees = partitionRows.reduce((s, r) => s + (r.employee || 0), 0);
      const totalContractors = partitionRows.reduce((s, r) => s + (r.contractor || 0), 0);
      const totalTempBadge = partitionRows.reduce((s, r) => s + (r.tempBadge || 0), 0);
      const totalTotal = partitionRows.reduce((s, r) => s + (r.total || 0), 0);

      const totals = [
        'Total', '',
        totalEmployees,
        totalContractors,
        ...(isCostaRica ? [totalTempBadge] : []),
        totalTotal
      ];
      const totalRow = ws.addRow(totals);
      totalRow.eachCell((cell, colNumber) => {
        cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
        cell.alignment = { horizontal: colNumber >= 3 ? 'right' : 'left', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } },
        };
        if (colNumber >= 3) cell.numFmt = '#,##0';
      });
      // Auto-fit-ish columns
      ws.columns.forEach(col => {
        let maxLen = 10;
        col.eachCell({ includeEmpty: true }, c => {
          const v = c.value === null || c.value === undefined ? '' : String(c.value);
          maxLen = Math.max(maxLen, v.trim().length + 2);
        });
        col.width = Math.min(Math.max(maxLen, 8), 40);
      });
      // freeze header (title + spacer + header => freeze after row 3)
      ws.views = [{ state: 'frozen', ySplit: 3 }];
      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), `summary_${format(pickedDate, 'yyyyMMdd')}.xlsx`);
    } catch (err) {

      console.error('handleExportSummary error:', err);

    }
  };


  const handleExportCompanies = async () => {
    if (!pickedDate || !companyRows.length) return;
    try {
      const excelModule = await import('exceljs');
      const Excel = excelModule.default || excelModule;

      let wb;
      if (Excel && Excel.Workbook) wb = new Excel.Workbook();
      else if (typeof Excel === 'function') wb = new Excel();
      else throw new Error('ExcelJS Workbook constructor not found');

      const ws = wb.addWorksheet('Company Summary');

      ws.columns = [
        { header: 'Country', key: 'country', width: 20 },
        { header: 'City', key: 'city', width: 25 },
        { header: 'Company', key: 'company', width: 40 },
        { header: 'Total', key: 'total', width: 12 },
      ];

      // Title row
      ws.mergeCells('A1:D1');
      const dateCell = ws.getCell('A1');
      dateCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
      dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
      dateCell.font = { name: 'Calibri', size: 14, bold: true };

      ws.addRow([]);

      // Header styling
      const headerRow = ws.addRow(['Country', 'City', 'Company', 'Total']);
      headerRow.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
        cell.font = { bold: true, color: { argb: 'FF000000' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
      });

      companyRows.forEach((r, i) => {
        const row = ws.addRow([r.country, r.city, r.company, r.total]);
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' },
            bottom: { style: 'thin' }, right: { style: 'thin' }
          };
          if (colNumber === 4) {
            cell.alignment = { horizontal: 'right', vertical: 'middle' };
            cell.numFmt = '#,##0';
          } else {
            cell.alignment = { horizontal: 'left', vertical: 'middle' };
          }
        });
        // zebra
        if (i % 2 === 1) {
          row.eachCell(cell => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
          });
        }
      });

      // totals row
      const total = companyRows.reduce((s, r) => s + r.total, 0);
      const totalRow = ws.addRow(['Total', '', '', total]);
      totalRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
        if (colNumber === 4) {
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
          cell.numFmt = '#,##0';
        } else {
          cell.alignment = { horizontal: colNumber === 1 ? 'left' : 'center', vertical: 'middle' };
        }
      });

      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), `laca_companies_${format(pickedDate, 'yyyyMMdd')}.xlsx`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('handleExportCompanies error:', err);
    }
  };
  
};
