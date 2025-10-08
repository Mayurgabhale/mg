const handleExport = async () => {
  if (!pickedDate) return;

  try {
    const excelModule = await import('exceljs');
    const Excel = excelModule.default || excelModule;
    const wb = new Excel.Workbook();

    // ---------- SHEET 1: WU Employee ----------
    const wsDetails = wb.addWorksheet('WU Employee');

    wsDetails.spliceRows(1, 0, [], []);
    wsDetails.spliceColumns(1, 0, [], []);

    const detailsHeaders = [
      'Sr.No', 'Date', 'Time',
      'Employee Name', 'Employee ID', 'Personal Type',
      'Door Name', 'Location'
    ];

    // Title row
    wsDetails.mergeCells(`C3:J3`);
    const detailsTitle = wsDetails.getCell('C3');
    detailsTitle.value = `Western Union APAC Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}`;
    detailsTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    detailsTitle.font = { name: 'Calibri', size: 14, bold: true };

    // Header row
    const hdrRow = wsDetails.addRow([null, null, ...detailsHeaders]);
    hdrRow.eachCell((cell, colNumber) => {
      if (colNumber > 2) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC107' } };
        cell.font = { bold: true, color: { argb: 'FF000000' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      }
    });

    // Data rows
    (detailRows || []).forEach((r, i) => {
      const row = wsDetails.addRow([
        null, null,
        i + 1,
        r.ObjectName1 || '',
        r.EmployeeID || '',
        r.PersonnelType || '',
        r.Door || r.ObjectName2 || '',
        r.PartitionName2 || r.PrimaryLocation || ''
      ]);

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        if (colNumber > 2) {
          cell.alignment = { horizontal: colNumber === 3 ? 'center' : 'left', vertical: 'middle', wrapText: true };
          cell.font = { name: 'Calibri', size: 11 };
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        }
      });

      if (i % 2 === 1) {
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          if (colNumber > 2) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
        });
      }
    });

    // Column widths
    const colWidths = [2, 2, 6, 30, 18, 20, 30, 25];
    wsDetails.columns.forEach((col, idx) => { col.width = colWidths[idx] || 15; });

    wsDetails.views = [{ state: 'frozen', ySplit: 4, xSplit: 2 }];

    // ---------- SHEET 2: WU Summary ----------
    const ws = wb.addWorksheet('WU Summary');
    ws.spliceRows(1, 0, [], []);
    ws.spliceColumns(1, 0, [], []);

    const r1 = ws.addRow([null, null, 'Country', 'City', format(pickedDate, 'EEEE, d MMMM, yyyy'), null, null]);
    ws.mergeCells('E3:G3');
    const dateCell = ws.getCell('E3');
    dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
    dateCell.font = { bold: true, size: 14 };
    dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };

    const r2 = ws.addRow([null, null, '', '', 'Employee', 'Contractors', 'Total']);
    r2.eachCell((cell, colNumber) => {
      if (colNumber >= 5) {
        cell.font = { bold: true, size: 14 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      }
    });

    (partitionRows || []).forEach(r => {
      const row = ws.addRow([
        null, null,
        r.country || '',
        r.city || '',
        r.employee || 0,
        r.contractor || 0,
        r.total || 0
      ]);

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        if (colNumber >= 3) {
          cell.alignment = { vertical: 'middle', horizontal: colNumber >= 5 ? 'center' : 'left', wrapText: true };
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          if (colNumber === 7) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
            cell.font = { bold: true, size: 14 };
          }
        }
      });
    });

    const totalsRow = ws.addRow([
      null, null,
      'Total', '',
      (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0),
      (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0),
      (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0)
    ]);

    totalsRow.eachCell((cell, colNumber) => {
      if (colNumber >= 3) {
        cell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF808080' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      }
    });

    ws.columns.forEach((col, idx) => {
      const widths = [2, 2, 20, 20, 12, 12, 12];
      col.width = widths[idx] || 15;
    });

    ws.views = [{ state: 'frozen', ySplit: 4, xSplit: 2 }];
    ws.pageSetup = { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0, horizontalCentered: true };

    // ---------- Save file ----------
    const filename = `Western Union APAC Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;
    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), filename);

  } catch (err) {
    console.error('handleExport error:', err);
  }
};