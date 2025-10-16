Wednesday, 15 October, 2025
Country	City	Employees	Contractors	Total
Lithuania	Vilnius	563	31	594
Morocco	Casablanca	25	1	26
UK	London	37	2	39
Austria	Vienna	61	7	68
Ireland	Dublin	33	4	37
UAE	Dubai	34	1	35
Spain	Madrid	53	3	56
Italy	Rome	35	2	37
Russia	Moscow	12	2	14
Total	853	53	906

data not disply in exclee sheet  i want alos date 
const colLetter = (n) => String.fromCharCode(64 + n);

  /* ------------------ handleExportSummary ------------------ */
const handleExportSummary = async () => {
  if (!pickedDate) return;

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Summary');

  const offsetRow = 2;
  const offsetCol = 2;
  const firstCol = offsetCol;
  const headers = ['Country', 'City', 'Employees', 'Contractors', 'Total'];
  const lastCol = firstCol + headers.length - 1;

  // Title (merged) with black background and yellow bold text
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

  // Header row
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

  // Data rows
  const dataStartRow = headerRowIndex + 1;
  partitionRows.forEach((r, i) => {
    const rowIndex = dataStartRow + i;
    ws.getRow(rowIndex).height = 22;
    headers.forEach((_, idx) => {
      const c = firstCol + idx;
      const cell = ws.getCell(rowIndex, c);
      const val = idx === 0 ? (r.country || '') :
                  idx === 1 ? (r.city || '') :
                  idx === 2 ? (r.employee || 0) :
                  idx === 3 ? (r.contractor || 0) : (r.total || 0);
      cell.value = val;
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      if (idx >= 2 && typeof val === 'number') cell.numFmt = '#,##0';
      cell.font = { name: 'Calibri', size: 10 };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
  });

  // Totals row
  const lastDataRow = (partitionRows?.length ? dataStartRow + partitionRows.length - 1 : headerRowIndex);
  const totalsRowIndex = lastDataRow + 1;
  const totalEmployees = partitionRows.reduce((s, r) => s + r.employee, 0);
  const totalContractors = partitionRows.reduce((s, r) => s + r.contractor, 0);
  const totalTotal = partitionRows.reduce((s, r) => s + r.total, 0);

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
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
    if ((c >= firstCol + 2 && typeof cell.value === 'number')) cell.numFmt = '#,##0';
  }

  // Outer borders and extras
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

  ws.addRow([]);
  ws.getColumn(lastCol + 1).width = 4;
  ws.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];

  // Autosize columns
  for (let c = firstCol; c <= lastCol; c++) {
    let maxLen = 0;
    for (let r = offsetRow; r <= totalsRowIndex; r++) {
      const v = ws.getCell(r, c).value ?? '';
      maxLen = Math.max(maxLen, String(v).length);
    }
    ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 6), 40);
  }

  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `emea_summary_${format(pickedDate, 'd MMMM yyyy')}.xlsx`);
};
