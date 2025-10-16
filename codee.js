// Proper column-to-letter helper (supports >26 columns)
const colLetter = (col) => {
  let letter = '';
  while (col > 0) {
    let rem = (col - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    col = Math.floor((col - 1) / 26);
  }
  return letter;
};

// --------------------------------------------------
// 🌎 1. Summary Export (Employee/Contractor/Temp Badge)
// --------------------------------------------------
const handleExportSummary = async () => {
  if (!pickedDate || !partitionRows?.length) return;

  try {
    const excelModule = await import('exceljs');
    const Excel = excelModule.default || excelModule;
    const wb = Excel && Excel.Workbook ? new Excel.Workbook() : new Excel();

    const ws = wb.addWorksheet('Summary');
    const offsetRow = 2;
    const offsetCol = 2;
    const firstCol = offsetCol;

    const headers = ['Country', 'City', 'Employees', 'Contractors'];
    if (isCostaRica) headers.push('Temp Badge');
    headers.push('Total');

    const lastCol = firstCol + headers.length - 1;

    // ---- Title row
    ws.mergeCells(`${colLetter(firstCol)}${offsetRow}:${colLetter(lastCol)}${offsetRow}`);
    const titleCell = ws.getCell(offsetRow, firstCol);
    titleCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
    titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFC107' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.border = {
      top: { style: 'medium' }, bottom: { style: 'medium' },
      left: { style: 'medium' }, right: { style: 'medium' },
    };
    ws.getRow(offsetRow).height = 22;

    // ---- Header row
    const headerRowIndex = offsetRow + 1;
    headers.forEach((h, i) => {
      const cell = ws.getCell(headerRowIndex, firstCol + i);
      cell.value = h;
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'medium' }, bottom: { style: 'medium' },
        left: { style: 'medium' }, right: { style: 'medium' },
      };
    });
    ws.getRow(headerRowIndex).height = 22;

    // ---- Data rows
    const dataStartRow = headerRowIndex + 1;
    partitionRows.forEach((r, i) => {
      const rowIndex = dataStartRow + i;
      const rowVals = [
        r.country,
        r.city,
        r.employee,
        r.contractor,
        ...(isCostaRica ? [r.tempBadge] : []),
        r.total,
      ];

      rowVals.forEach((val, j) => {
        const cell = ws.getCell(rowIndex, firstCol + j);
        cell.value = val;
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = j >= 2 ? { horizontal: 'right', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
        if (j >= 2) cell.numFmt = '#,##0';
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' },
        };
        if (i % 2 === 1) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
        }
      });
    });

    // ---- Totals row
    const lastDataRow = dataStartRow + partitionRows.length - 1;
    const totalsRowIndex = lastDataRow + 1;

    const totals = [
      'Total',
      '',
      partitionRows.reduce((s, r) => s + (r.employee || 0), 0),
      partitionRows.reduce((s, r) => s + (r.contractor || 0), 0),
      ...(isCostaRica ? [partitionRows.reduce((s, r) => s + (r.tempBadge || 0), 0)] : []),
      partitionRows.reduce((s, r) => s + (r.total || 0), 0),
    ];

    totals.forEach((val, j) => {
      const cell = ws.getCell(totalsRowIndex, firstCol + j);
      cell.value = val;
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
      cell.alignment = j >= 2 ? { horizontal: 'right', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
      if (j >= 2) cell.numFmt = '#,##0';
      cell.border = {
        top: { style: 'medium' }, left: { style: 'medium' },
        bottom: { style: 'medium' }, right: { style: 'medium' },
      };
    });
    ws.getRow(totalsRowIndex).height = 22;

    // ---- Freeze + Autosize
    ws.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];
    for (let c = firstCol; c <= lastCol; c++) {
      let maxLen = 0;
      for (let r = offsetRow; r <= totalsRowIndex; r++) {
        const v = ws.getCell(r, c).value ?? '';
        maxLen = Math.max(maxLen, String(v).length);
      }
      ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 8), 50);
    }

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `summary_${format(pickedDate, 'yyyyMMdd')}.xlsx`);
  } catch (err) {
    console.error('handleExportSummary error:', err);
  }
};

// --------------------------------------------------
// 🏢 2. Company Summary Export (Country/City/Company/Total)
// --------------------------------------------------
const handleExportCompanies = async () => {
  if (!pickedDate || !companyRows?.length) return;

  try {
    const excelModule = await import('exceljs');
    const Excel = excelModule.default || excelModule;
    const wb = Excel && Excel.Workbook ? new Excel.Workbook() : new Excel();

    const ws = wb.addWorksheet('Company Summary');
    const offsetRow = 2;
    const offsetCol = 2;
    const firstCol = offsetCol;
    const headers = ['Country', 'City', 'Company', 'Total'];
    const lastCol = firstCol + headers.length - 1;

    // ---- Title row
    ws.mergeCells(`${colLetter(firstCol)}${offsetRow}:${colLetter(lastCol)}${offsetRow}`);
    const titleCell = ws.getCell(offsetRow, firstCol);
    titleCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
    titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFC107' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.border = {
      top: { style: 'medium' }, bottom: { style: 'medium' },
      left: { style: 'medium' }, right: { style: 'medium' },
    };
    ws.getRow(offsetRow).height = 22;

    // ---- Header row
    const headerRowIndex = offsetRow + 1;
    headers.forEach((h, i) => {
      const cell = ws.getCell(headerRowIndex, firstCol + i);
      cell.value = h;
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'medium' }, left: { style: 'medium' },
        bottom: { style: 'medium' }, right: { style: 'medium' },
      };
    });

    // ---- Data rows
    const dataStartRow = headerRowIndex + 1;
    companyRows.forEach((r, i) => {
      const rowIndex = dataStartRow + i;
      const vals = [r.country, r.city, r.company, r.total];
      vals.forEach((val, j) => {
        const cell = ws.getCell(rowIndex, firstCol + j);
        cell.value = val;
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = j === 3 ? { horizontal: 'right', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
        if (j === 3) cell.numFmt = '#,##0';
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' },
        };
        if (i % 2 === 1) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
        }
      });
    });

    // ---- Totals row
    const lastDataRow = dataStartRow + companyRows.length - 1;
    const totalsRowIndex = lastDataRow + 1;
    const total = companyRows.reduce((s, r) => s + (r.total || 0), 0);

    headers.forEach((_, j) => {
      const cell = ws.getCell(totalsRowIndex, firstCol + j);
      if (j === 0) cell.value = 'Total';
      if (j === 3) cell.value = total;
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
      cell.alignment = j === 3 ? { horizontal: 'right', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
      if (j === 3) cell.numFmt = '#,##0';
      cell.border = {
        top: { style: 'medium' }, left: { style: 'medium' },
        bottom: { style: 'medium' }, right: { style: 'medium' },
      };
    });

    // ---- Freeze + Autosize
    ws.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];
    for (let c = firstCol; c <= lastCol; c++) {
      let maxLen = 0;
      for (let r = offsetRow; r <= totalsRowIndex; r++) {
        const v = ws.getCell(r, c).value ?? '';
        maxLen = Math.max(maxLen, String(v).length);
      }
      ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 8), 50);
    }

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `companies_${format(pickedDate, 'yyyyMMdd')}.xlsx`);
  } catch (err) {
    console.error('handleExportCompanies error:', err);
  }
};