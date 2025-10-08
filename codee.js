const handleExport = async () => {
  if (!pickedDate || !detailRows || detailRows.length === 0) return;

  const wb = new ExcelJS.Workbook();

  // ---------------- SHEET 1: Details ----------------
  const wsDetails = wb.addWorksheet('Details');

  const cols = [
    { header: 'Sr', key: 'sr', width: 4 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Time', key: 'time', width: 15 },
    { header: 'EmployeeID', key: 'employee', width: 15 },
    { header: 'CardNumber', key: 'card', width: 14 },
    { header: 'Name', key: 'name', width: 25 },
    { header: 'PersonnelType', key: 'type', width: 14 },
    { header: 'CompanyName', key: 'company', width: 30 },
    { header: 'PrimaryLocation', key: 'location', width: 30 },
    { header: 'Door', key: 'door', width: 40 },
    { header: 'Partition', key: 'partition', width: 18 },
  ];
  wsDetails.columns = cols;

  // Title row
  const lastColLetter = String.fromCharCode('A'.charCodeAt(0) + cols.length - 1);
  wsDetails.mergeCells(`A1:${lastColLetter}1`);
  const titleCell = wsDetails.getCell('A1');
  titleCell.value = `${format(pickedDate, 'EEEE, d MMMM, yyyy')} — Details`;
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF000000' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };

  wsDetails.addRow([]); // spacer

  // Header row
  const headerRow = wsDetails.addRow(cols.map(c => c.header));
  headerRow.eachCell(cell => {
    cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF000000' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } },
    };
  });

  // Data rows
  detailRows.forEach((r, i) => {
    const row = wsDetails.addRow([
      i + 1,
      getIsoDate(r),
      formatApiTime12(r.LocaleMessageTime),
      r.EmployeeID ?? '',
      r.CardNumber ?? '',
      r.ObjectName1 ?? '',
      r.PersonnelType ?? '',
      (r.CompanyNameComputed || r.CompanyName) ?? '',
      r.PrimaryLocation ?? '',
      r.Door ?? '',
      partitionToDisplay[r.PartitionName2]?.city || r.PartitionName2 || ''
    ]);

    row.eachCell((cell, colNumber) => {
      cell.alignment = { vertical: 'middle', horizontal: (colNumber >= 4 && colNumber <= 5) ? 'right' : 'left' };
      cell.font = { name: 'Calibri', size: 11, color: { argb: 'FF000000' } };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };
    });

    if (i % 2 === 1) {
      row.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
      });
    }
  });

  // Totals row
  const totalRow = wsDetails.addRow(['', '', '', '', '', '', '', '', '', 'Total', detailRows.length]);
  totalRow.eachCell((cell, colNumber) => {
    cell.font = { name: 'Calibri', size: 12, bold: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
    cell.alignment = { horizontal: colNumber === 11 ? 'right' : 'center', vertical: 'middle' };
  });

  wsDetails.views = [{ state: 'frozen', ySplit: 3 }];

  // ---------------- SHEET 2: Summary ----------------
  const wsSummary = wb.addWorksheet('Summary');

  // Header row 1
  const r1 = wsSummary.addRow(['Country', 'City', format(pickedDate, 'EEEE, d MMMM, yyyy'), null, null]);
  wsSummary.mergeCells('C1:E1');
  const dateCell = wsSummary.getCell('C1');
  dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
  dateCell.font = { bold: true, size: 16 };
  dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };

  r1.eachCell((cell, colNumber) => {
    if (colNumber <= 2) cell.font = { bold: true, size: 15 };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  });

  // Header row 2
  const r2 = wsSummary.addRow(['', '', 'Employee', 'Contractors', 'Total']);
  r2.eachCell(cell => {
    cell.font = { bold: true, size: 15 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  });

  // Data rows
  (partitionRows || []).forEach(r => {
    const row = wsSummary.addRow([r.country || '', r.city || '', r.employee || 0, r.contractor || 0, r.total || 0]);
    row.eachCell((cell, colNumber) => {
      cell.alignment = { vertical: 'middle', horizontal: colNumber >= 3 ? 'center' : 'left' };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      if (colNumber === 5) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
    });
  });

  wsSummary.views = [{ state: 'frozen', ySplit: 2 }];

  // Save workbook
  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `history_${format(pickedDate, 'yyyyMMdd')}.xlsx`);
};