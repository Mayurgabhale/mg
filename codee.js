/* ------------------ handleExportCompanies (EMEA) ------------------ */
const handleExportCompanies = async () => {
  if (!pickedDate || !companyRows.length) return;

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Company Summary');

  const offsetRow = 2;
  const offsetCol = 2;
  const firstCol = offsetCol;
  const headers = ['Country', 'City', 'Company', 'Total'];
  const lastCol = firstCol + headers.length - 1;

  // --- Title row: merged, black background, yellow text, thick border
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

  // --- Header row: yellow fill, bold, medium border
  const headerRowIndex = offsetRow + 1;
  headers.forEach((h, idx) => {
    const c = firstCol + idx;
    const cell = ws.getCell(headerRowIndex, c);
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
      const c = firstCol + idx;
      const cell = ws.getCell(rowIndex, c);
      const val = idx === 0 ? r.country : idx === 1 ? r.city : idx === 2 ? r.company : r.total;
      cell.value = val;
      cell.alignment = { horizontal: idx === 3 ? 'center' : 'center', vertical: 'middle' };
      if (idx === 3 && typeof val === 'number') cell.numFmt = '#,##0';
      cell.font = { name: 'Calibri', size: 10 };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
  });

  // --- Totals row: dark gray fill, white bold text, medium border
  const lastDataRow = dataStartRow + companyRows.length - 1;
  const totalsRowIndex = lastDataRow + 1;
  const total = companyRows.reduce((s, r) => s + (r.total || 0), 0);

  const totalsFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
  const totalsFont = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };

  for (let c = firstCol; c <= lastCol; c++) {
    const cell = ws.getCell(totalsRowIndex, c);
    if (c === firstCol) cell.value = 'Total';
    if (c === firstCol + 3) cell.value = total;
    cell.fill = totalsFill;
    cell.font = totalsFont;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
    if (c === firstCol + 3 && typeof cell.value === 'number') cell.numFmt = '#,##0';
  }
  ws.getRow(totalsRowIndex).height = 22;

  // --- Apply thick outside border around the entire summary (title → totals)
  for (let r = offsetRow; r <= totalsRowIndex; r++) {
    for (let c = firstCol; c <= lastCol; c++) {
      const cell = ws.getCell(r, c);
      const border = { ...cell.border };
      if (r === offsetRow) border.top = { style: 'medium' };
      if (r === totalsRowIndex) border.bottom = { style: 'medium' };
      if (c === firstCol) border.left = { style: 'medium' };
      if (c === lastCol) border.right = { style: 'medium' };
      cell.border = border;
    }
  }

  // --- Spacer row & blank column
  const blankRow = ws.addRow([]);
  blankRow.height = 22;
  ws.getColumn(lastCol + 1).width = 4;

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
  const safeDate = format(pickedDate, 'yyyyMMdd');
  saveAs(new Blob([buf]), `emea_companies_${safeDate}.xlsx`);
};