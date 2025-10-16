// --- Helper: convert column number to letter
const colLetter = (col) => {
  let temp, letter = '';
  while (col > 0) {
    temp = (col - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    col = (col - temp - 1) / 26;
  }
  return letter;
};

/* ------------------ handleExportSummary (EMEA) ------------------ */
const handleExportSummary = async () => {
  if (!pickedDate || !partitionRows?.length) return;

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Summary');

  const offsetRow = 2;
  const offsetCol = 2;
  const firstCol = offsetCol;
  const headers = ['Country', 'City', 'Employees', 'Contractors', 'Total'];
  const lastCol = firstCol + headers.length - 1;

  // --- Title row
  ws.mergeCells(`${colLetter(firstCol)}${offsetRow}:${colLetter(lastCol)}${offsetRow}`);
  for (let c = firstCol; c <= lastCol; c++) {
    const cell = ws.getCell(offsetRow, c);
    cell.value = c === firstCol ? format(pickedDate, 'EEEE, d MMMM, yyyy') : '';
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    cell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFC107' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'medium' }, bottom: { style: 'medium' }, left: { style: 'medium' }, right: { style: 'medium' } };
  }
  ws.getRow(offsetRow).height = 22;

  // --- Header row
  const headerRowIndex = offsetRow + 1;
  headers.forEach((h, idx) => {
    const c = firstCol + idx;
    const cell = ws.getCell(headerRowIndex, c);
    cell.value = h;
    cell.height = 22;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
    cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF000000' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
  });

  // --- Data rows
  const dataStartRow = headerRowIndex + 1;
  partitionRows.forEach((r, i) => {
    const rowIndex = dataStartRow + i;
    ws.getRow(rowIndex).height = 22;
    headers.forEach((_, idx) => {
      const cell = ws.getCell(rowIndex, firstCol + idx);
      const val = idx === 0 ? r.country : idx === 1 ? r.city : idx === 2 ? r.employee : idx === 3 ? r.contractor : r.total;
      cell.value = val;
      cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF000000' } };
      // Numeric columns: right-aligned
      if (idx >= 2 && typeof val === 'number') {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.numFmt = '#,##0';
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
  });

  // --- Totals row
  const lastDataRow = dataStartRow + partitionRows.length - 1;
  const totalsRowIndex = lastDataRow + 1;
  const totalEmployees = partitionRows.reduce((s, r) => s + (r.employee || 0), 0);
  const totalContractors = partitionRows.reduce((s, r) => s + (r.contractor || 0), 0);
  const totalTotal = partitionRows.reduce((s, r) => s + (r.total || 0), 0);

  const totalsFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
  const totalsFont = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };

  for (let c = firstCol; c <= lastCol; c++) {
    const cell = ws.getCell(totalsRowIndex, c);
    if (c === firstCol) cell.value = 'Total';
    if (c === firstCol + 2) cell.value = totalEmployees;
    if (c === firstCol + 3) cell.value = totalContractors;
    if (c === firstCol + 4) cell.value = totalTotal;
    cell.fill = totalsFill;
    cell.font = totalsFont;
    cell.alignment = { horizontal: 'right', vertical: 'middle' };
    cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
    if ((c >= firstCol + 2) && typeof cell.value === 'number') cell.numFmt = '#,##0';
  }
  ws.getRow(totalsRowIndex).height = 22;

  // --- Freeze header & hide gridlines
  ws.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];

  // --- Autosize columns
  for (let c = firstCol; c <= lastCol; c++) {
    let maxLen = 0;
    for (let r = offsetRow; r <= totalsRowIndex; r++) {
      const val = ws.getCell(r, c).value;
      maxLen = Math.max(maxLen, val ? String(val).length : 0);
    }
    ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 6), 50);
  }

  // --- Export
  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `emea_summary_${format(pickedDate, 'yyyyMMdd')}.xlsx`);
};

/* ------------------ handleExportCompanies (EMEA) ------------------ */
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
  for (let c = firstCol; c <= lastCol; c++) {
    const cell = ws.getCell(offsetRow, c);
    cell.value = c === firstCol ? format(pickedDate, 'EEEE, d MMMM, yyyy') : '';
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    cell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFC107' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'medium' }, bottom: { style: 'medium' }, left: { style: 'medium' }, right: { style: 'medium' } };
  }
  ws.getRow(offsetRow).height = 22;

  // --- Header row
  const headerRowIndex = offsetRow + 1;
  headers.forEach((h, idx) => {
    const cell = ws.getCell(headerRowIndex, firstCol + idx);
    cell.value = h;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
  });
  ws.getRow(headerRowIndex).height = 22;

  // --- Data rows
  const dataStartRow = headerRowIndex + 1;
  companyRows.forEach((r, i) => {
    const rowIndex = dataStartRow + i;
    ws.getRow(rowIndex).height = 22;
    headers.forEach((_, idx) => {
      const cell = ws.getCell(rowIndex, firstCol + idx);
      const val = idx === 0 ? r.country : idx === 1 ? r.city : idx === 2 ? r.company : r.total;
      cell.value = val;
      cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF000000' } };
      cell.alignment = idx === 3 ? { horizontal: 'right', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
      if (idx === 3 && typeof val === 'number') cell.numFmt = '#,##0';
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
  });

  // --- Totals row
  const lastDataRow = dataStartRow + companyRows.length - 1;
  const totalsRowIndex = lastDataRow + 1;
  const total = companyRows.reduce((s, r) => s + (r.total || 0), 0);

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

  // --- Freeze header & hide gridlines
  ws.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];

  // --- Autosize columns
  for (let c = firstCol; c <= lastCol; c++) {
    let maxLen = 0;
    for (let r = offsetRow; r <= totalsRowIndex; r++) {
      const val = ws.getCell(r, c).value;
      maxLen = Math.max(maxLen, val ? String(val).length : 0);
    }
    ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 6), 50);
  }

  // --- Export
  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `emea_companies_${format(pickedDate, 'yyyyMMdd')}.xlsx`);
};