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
    const sheetTitle = `Western Union EMEA Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}`;
    const wsDetails = wb.addWorksheet(sheetTitle);

    // Headers
    const detailsHeaders = [
      'Sr.No', 'Date', 'Time',
      'Employee Name', 'Employee ID', 'Personal Type',
      'Door Name', 'Location'
    ];

    // Title row
    wsDetails.mergeCells(`A1:${String.fromCharCode(64 + detailsHeaders.length)}1`);
    const detailsTitle = wsDetails.getCell('A1');
    detailsTitle.value = `Details — ${format(pickedDate, 'EEEE, d MMMM, yyyy')}`;
    detailsTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    detailsTitle.font = { name: 'Calibri', size: 14, bold: true };

    // Header row
    const hdrRow = wsDetails.addRow(detailsHeaders);
    hdrRow.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC107' } };
      cell.font = { bold: true, color: { argb: 'FF000000' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // Data rows
    (detailRows || []).forEach((r, i) => {
      const dateVal = (r.LocaleMessageTime?.slice(0, 10)) || (r.SwipeDate?.slice(0, 10)) || '';
      const timeVal = formatApiTime12(r.LocaleMessageTime) || '';
      const name = r.ObjectName1 || '';
      const empId = r.EmployeeID || '';
      const ptype = r.PersonnelType || '';
      const door = r.Door || r.ObjectName2 || '';
      const location = r.PartitionName2 || r.PrimaryLocation || '';

      const row = wsDetails.addRow([i + 1, dateVal, timeVal, name, empId, ptype, door, location]);

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

    // Auto-width columns
    wsDetails.columns.forEach((col, idx) => {
      let maxLen = 0;
      col.eachCell({ includeEmpty: true }, c => {
        const v = c.value === null || c.value === undefined ? '' : String(c.value).trim();
        if (v.length > maxLen) maxLen = v.length;
      });
      let width = maxLen + 2;

      if (idx === 0) width = Math.min(Math.max(width, 6), 10);
      else if (idx === 1) width = Math.min(Math.max(width, 10), 15);
      else if (idx === 2) width = Math.min(Math.max(width, 8), 12);
      else if (idx === 3) width = Math.min(Math.max(width, 15), 30);
      else if (idx === 4) width = Math.min(Math.max(width, 10), 18);
      else if (idx === 5) width = Math.min(Math.max(width, 12), 20);
      else if (idx === 6) width = Math.min(Math.max(width, 18), 40);
      else if (idx === 7) width = Math.min(Math.max(width, 18), 40);

      col.width = width;
    });

    wsDetails.views = [{ state: 'frozen', ySplit: 2 }];

    // Outer border for WU Employee
    const firstDetailRow = 2;
    const lastDetailRow = wsDetails.lastRow.number;
    const firstDetailCol = 1;
    const lastDetailCol = detailsHeaders.length;

    for (let r = firstDetailRow; r <= lastDetailRow; r++) {
      for (let c = firstDetailCol; c <= lastDetailCol; c++) {
        const cell = wsDetails.getCell(r, c);
        const border = { ...cell.border };
        if (r === firstDetailRow) border.top = { style: 'medium' };
        if (r === lastDetailRow) border.bottom = { style: 'medium' };
        if (c === firstDetailCol) border.left = { style: 'medium' };
        if (c === lastDetailCol) border.right = { style: 'medium' };
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

    // ---------- SHEET 2: WU Summary ----------
    const ws = wb.addWorksheet('WU Summary');

    // ... (rest of your summary sheet code unchanged) ...

    // ---------- Save file ----------
    const filename = `Western Union EMEA Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;
    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), filename);

  } catch (err) {
    console.error('handleExport error:', err);
  }
};