Wednesday, 15 October, 2025
Country	City	Company	Total
Austria	Vienna	Cyber Search Ltd	1
Austria	Vienna	PKE Facility Management GmbH	1
Austria	Vienna	PS3 PERSONALSERVICE GMBH	1
Austria	Vienna	PwC	1
Austria	Vienna	Temp Badge	3
Austria	Vienna	WU Srvcs Private Ltd	61
Ireland	Dublin	Cleaning	1
Ireland	Dublin	G4S Secure Solutions	1
Ireland	Dublin	Temp Badge	2
Ireland	Dublin	WU Srvcs Private Ltd	33
Italy	Rome	Addendum Solutions	1
Italy	Rome	Finint Srl Italy	18
Italy	Rome	HCL America	1
Italy	Rome	I1X Finint Srl Italy	5
Italy	Rome	WU Srvcs Private Ltd	10
Italy	Rome	WURS Italy Srl	2

UAE	Dubai	WU Srvcs Private Ltd	32
UK	London	Mitie Cleaning	1
UK	London	Temp Badge	1
UK	London	WU Srvcs Private Ltd	37
Total		906

in excle sheet data not disply 

/* ------------------ handleExportCompanies ------------------ */
const handleExportCompanies = async () => {
  if (!pickedDate || !companyRows.length) return;

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Company Summary');

  const offsetRow = 2;
  const offsetCol = 2;
  const firstCol = offsetCol;
  const headers = ['Country', 'City', 'Company', 'Total'];
  const lastCol = firstCol + headers.length - 1;

  ws.mergeCells(`${colLetter(firstCol)}${offsetRow}:${colLetter(lastCol)}${offsetRow}`);
  for (let c = firstCol; c <= lastCol; c++) {
    const cell = ws.getCell(offsetRow, c);
    cell.value = c === firstCol ? format(pickedDate, 'EEEE, d MMMM, yyyy') : '';
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    cell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFC107' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { top: { style: 'medium' }, bottom: { style: 'medium' }, left: { style: 'medium' }, right: { style: 'medium' } };
  }

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

  // Data rows
  const dataStartRow = headerRowIndex + 1;
  companyRows.forEach((r, i) => {
    const rowIndex = dataStartRow + i;
    const rowValues = [r.country, r.city, r.company, r.total];
    rowValues.forEach((val, idx) => {
      const c = firstCol + idx;
      const cell = ws.getCell(rowIndex, c);
      cell.value = val;
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      if (idx === 3 && typeof val === 'number') cell.numFmt = '#,##0';
      cell.font = { name: 'Calibri', size: 10 };
    });
  });

  // Totals
  const lastDataRow = dataStartRow + companyRows.length - 1;
  const totalsRowIndex = lastDataRow + 1;
  const total = companyRows.reduce((s, r) => s + r.total, 0);
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

  ws.addRow([]);
  ws.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];

  // Autosize
  for (let c = firstCol; c <= lastCol; c++) {
    let maxLen = 0;
    for (let r = offsetRow; r <= totalsRowIndex; r++) {
      const v = ws.getCell(r, c).value ?? '';
      maxLen = Math.max(maxLen, String(v).length);
    }
    ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 8), 50);
  }

  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `emea_companies_${format(pickedDate, "d MMMM yyyy")}.xlsx`);
};
