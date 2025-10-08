const handleExport = async () => {
  if (!pickedDate) return;

  try {
    const excelModule = await import('exceljs');
    const Excel = excelModule.default || excelModule;
    let wb;

    if (Excel && Excel.Workbook) wb = new Excel.Workbook();
    else if (typeof Excel === 'function') wb = new Excel();
    else throw new Error('ExcelJS Workbook constructor not found');

    // ---------- SHEET 1: WU Employee ----------
    const wsDetails = wb.addWorksheet('WU Employee');

    // Add 2 top empty rows
    wsDetails.addRow([]);
    wsDetails.addRow([]);

    // Headers
    const detailsHeaders = [
      'Sr.No', 'Date', 'Time',
      'Employee Name', 'Employee ID', 'Personal Type',
      'Door Name', 'Location'
    ];

    // Title row (shifted to row 3, col C)
    wsDetails.mergeCells(3, 3, 3, 2 + detailsHeaders.length); // Merge from C3 onward
    const detailsTitle = wsDetails.getCell(3, 3);
    detailsTitle.value = `WU Employee — ${format(pickedDate, 'EEEE, d MMMM, yyyy')}`;
    detailsTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    detailsTitle.font = { name: 'Calibri', size: 14, bold: true };

    // Header row (row 4, starting col C)
    const hdrRow = wsDetails.addRow(['', '', ...detailsHeaders]); // 2 empty cols
    hdrRow.eachCell((cell, colNumber) => {
      if (colNumber <= 2) return; // skip 2 empty cols
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC107' } };
      cell.font = { bold: true, color: { argb: 'FF000000' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // Data rows (shifted right)
    (detailRows || []).forEach((r, i) => {
      const dateVal = (r.LocaleMessageTime?.slice(0, 10)) || (r.SwipeDate?.slice(0, 10)) || '';
      const timeVal = formatApiTime12(r.LocaleMessageTime) || '';
      const name = r.ObjectName1 || '';
      const empId = r.EmployeeID || '';
      const ptype = r.PersonnelType || '';
      const door = r.Door || r.ObjectName2 || '';
      const location = r.PartitionName2 || r.PrimaryLocation || '';

      const row = wsDetails.addRow([
        '', '', // 2 empty cols
        i + 1, dateVal, timeVal, name, empId, ptype, door, location
      ]);

      row.eachCell((cell, colNumber) => {
        if (colNumber <= 2) return; // skip empty cols
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.font = { name: 'Calibri', size: 11 };
        cell.alignment = colNumber === 3 ? { horizontal: 'center', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
      });

      if (i % 2 === 1) {
        row.eachCell((cell, colNumber) => {
          if (colNumber > 2) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
          }
        });
      }
    });

    // ---------- SHEET 2: WU Summary ----------
    const ws = wb.addWorksheet('WU Summary');

    // Add 2 top empty rows
    ws.addRow([]);
    ws.addRow([]);

    // First row (row 3, shifted by 2 cols)
    const r1 = ws.addRow(['', '', 'Country', 'City', format(pickedDate, 'EEEE, d MMMM, yyyy'), null, null]);
    ws.mergeCells(3, 5, 3, 7); // merge date in col E-G
    const dateCell = ws.getCell(3, 5);
    dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
    dateCell.font = { bold: true, size: 16 };
    dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };

    r1.eachCell((cell, colNumber) => {
      if (colNumber === 3 || colNumber === 4) {
        cell.font = { bold: true, size: 15 };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // Second row (row 4, shifted by 2 cols)
    const r2 = ws.addRow(['', '', '', '', 'Employee', 'Contractors', 'Total']);
    r2.eachCell((cell, colNumber) => {
      if (colNumber >= 5) {
        cell.font = { bold: true, size: 15 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      }
    });

    // Data rows (shifted by 2 cols)
    (partitionRows || []).forEach(r => {
      const row = ws.addRow(['', '', r.country || '', r.city || '', r.employee || 0, r.contractor || 0, r.total || 0]);
      row.eachCell((cell, colNumber) => {
        if (colNumber >= 5) cell.alignment = { vertical: 'middle', horizontal: 'center' };
        else if (colNumber >= 3) cell.alignment = { vertical: 'middle', horizontal: 'left' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        if (colNumber === 7) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
          cell.font = { bold: true, size: 15 };
        }
      });
    });

    // Totals row (shifted by 2 cols)
    const totalsRow = ws.addRow(['', '', 'Total', '', totalEmployees, totalContractors, totalTotals]);
    totalsRow.eachCell((cell, colNumber) => {
      if (colNumber >= 3) {
        cell.font = { bold: true, size: 15, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF808080' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      }
    });

    // ---------- Save file ----------
    const filename = `apac_export_${format(pickedDate, 'yyyyMMdd')}.xlsx`;
    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), filename);

  } catch (err) {
    console.error('handleExport error:', err);
  }
};