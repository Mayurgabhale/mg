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