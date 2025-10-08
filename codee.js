const handleExport = async () => {
  if (!pickedDate || !detailRows || detailRows.length === 0) return;

  try {
    const excelModule = await import('exceljs');
    const Excel = excelModule.default || excelModule;
    let wb;

    if (Excel && Excel.Workbook) wb = new Excel.Workbook();
    else if (typeof Excel === 'function') wb = new Excel();
    else throw new Error('ExcelJS Workbook constructor not found');

    // ---------------- SHEET 1: Details ----------------
    const wsDetails = wb.addWorksheet('Details');

    const cols = [
      { header: 'Sr', key: 'sr' },
      { header: 'Date', key: 'date' },
      { header: 'Time', key: 'time' },
      { header: 'EmployeeID', key: 'employee' },
      { header: 'CardNumber', key: 'card' },
      { header: 'Name', key: 'name' },
      { header: 'PersonnelType', key: 'type' },
      { header: 'CompanyName', key: 'company' },
      { header: 'PrimaryLocation', key: 'location' },
      { header: 'Door', key: 'door' },
      { header: 'Partition', key: 'partition' },
    ];
    wsDetails.columns = cols;

    // Title row
    const lastColLetter = String.fromCharCode('A'.charCodeAt(0) + cols.length - 1);
    wsDetails.mergeCells(`A1:${lastColLetter}1`);
    const titleCell = wsDetails.getCell('A1');
    titleCell.value = `${format(pickedDate, 'EEEE, d MMMM, yyyy')} — Details`;
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.font = { name: 'Calibri', size: 14, bold: true };
    
    // Header row
    const headerRow = wsDetails.addRow(cols.map(c => c.header));
    headerRow.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC107' } };
      cell.font = { bold: true, color: { argb: 'FF000000' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
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
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.font = { name: 'Calibri', size: 11 };
        cell.alignment = colNumber === 1 ? { horizontal: 'center', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
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
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
      cell.alignment = { horizontal: colNumber === 11 ? 'right' : 'center', vertical: 'middle' };
    });

    // Auto-width
    wsDetails.columns.forEach((col, idx) => {
      let maxLen = 0;
      col.eachCell({ includeEmpty: true }, c => {
        const v = c.value === null || c.value === undefined ? '' : String(c.value).trim();
        if (v.length > maxLen) maxLen = v.length;
      });
      col.width = maxLen + 2;
    });

    wsDetails.views = [{ state: 'frozen', ySplit: 2 }];

    // Outer border
    const firstRowDetail = 2;
    const lastRowDetail = wsDetails.lastRow.number;
    const firstColDetail = 1;
    const lastColDetail = cols.length;
    for (let r = firstRowDetail; r <= lastRowDetail; r++) {
      for (let c = firstColDetail; c <= lastColDetail; c++) {
        const cell = wsDetails.getCell(r, c);
        const border = { ...cell.border };
        if (r === firstRowDetail) border.top = { style: 'medium' };
        if (r === lastRowDetail) border.bottom = { style: 'medium' };
        if (c === firstColDetail) border.left = { style: 'medium' };
        if (c === lastColDetail) border.right = { style: 'medium' };
        cell.border = border;
      }
    }

    wsDetails.pageSetup = {
      horizontalCentered: true,
      verticalCentered: false,
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 }
    };

    // ---------------- SHEET 2: Summary ----------------
    const wsSummary = wb.addWorksheet('Summary');

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

    const r2 = wsSummary.addRow(['', '', 'Employee', 'Contractors', 'Total']);
    r2.eachCell(cell => {
      cell.font = { bold: true, size: 15 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    (partitionRows || []).forEach(r => {
      const row = wsSummary.addRow([r.country || '', r.city || '', r.employee || 0, r.contractor || 0, r.total || 0]);
      row.eachCell((cell, colNumber) => {
        cell.alignment = { vertical: 'middle', horizontal: colNumber >= 3 ? 'center' : 'left' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        if (colNumber === 5) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
          cell.font = { bold: true, size: 15 };
        }
      });
    });

    // Totals Row
    const totalEmployees = (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0);
    const totalContractors = (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0);
    const totalTotals = (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0);
    const totalsRow = wsSummary.addRow(['Total', '', totalEmployees, totalContractors, totalTotals]);
    totalsRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF808080' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    wsSummary.columns.forEach(col => {
      let maxLen = 6;
      col.eachCell({ includeEmpty: true }, c => {
        const v = c.value ? String(c.value) : '';
        maxLen = Math.max(maxLen, v.length + 2);
      });
      col.width = Math.min(Math.max(maxLen, 10), 40);
    });

    wsSummary.views = [{ state: 'frozen', ySplit: 2 }];

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `history_${format(pickedDate, 'yyyyMMdd')}.xlsx`);

  } catch (err) {
    console.error('handleExport error:', err);
  }
};