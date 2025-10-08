when i download the excle sheet,
  in this boht sheet are not correct formatin not disply correct, some part are hidden in boht 
this sheet 
---- SHEET 1: WU Employee ----------
    const wsDetails = wb.addWorksheet('WU Employee');
Employee Name and Door Name colunmn data not disply correct, data is hide ok 
and second 

    // ---------- SHEET 2: WU Summary ----------
    const ws = wb.addWorksheet('WU Summary');
in this alos Country not disply correct so fix this ok 



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

    wsDetails.spliceRows(1, 0, [], []);
    wsDetails.spliceColumns(1, 0, [], []);

    const detailsHeaders = [
      'Sr.No', 'Date', 'Time',
      'Employee Name', 'Employee ID', 'Personal Type',
      'Door Name', 'Location'
    ];

    // Title row
    wsDetails.mergeCells(`C3:${String.fromCharCode(66 + detailsHeaders.length)}3`);
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
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      }
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

      const row = wsDetails.addRow([null, null, i + 1, dateVal, timeVal, name, empId, ptype, door, location]);

      row.eachCell((cell, colNumber) => {
        if (colNumber > 2) {
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          cell.font = { name: 'Calibri', size: 11 };
          cell.alignment = colNumber === 3 ? { horizontal: 'center', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
        }
      });

      if (i % 2 === 1) {
        row.eachCell((cell, colNumber) => {
          if (colNumber > 2) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
          }
        });
      }
    });

    // Auto-width with formatting limits
    wsDetails.columns.forEach((col, idx) => {
      if (idx <= 1) { col.width = 2; return; } // padding columns
      let maxLen = 0;
      col.eachCell({ includeEmpty: true }, c => {
        const v = c.value === null || c.value === undefined ? '' : String(c.value).trim();
        if (v.length > maxLen) maxLen = v.length;
      });

      let width = maxLen + 2;
      if (idx === 2) width = 6;        // extra padding col
      else if (idx === 3) width = Math.min(Math.max(width, 6), 10);     // Sr.No
      else if (idx === 4) width = Math.min(Math.max(width, 12), 15);    // Date
      else if (idx === 5) width = Math.min(Math.max(width, 8), 12);     // Time
      else if (idx === 6) width = Math.min(Math.max(width, 25), 30);    // Employee Name
      else if (idx === 7) width = Math.min(Math.max(width, 10), 18);    // Employee ID
      else if (idx === 8) width = Math.min(Math.max(width, 12), 20);    // Personal Type
      else if (idx === 9) width = Math.min(Math.max(width, 30), 40);    // Door
      else if (idx === 10) width = Math.min(Math.max(width, 18), 40);   // Location

      col.width = width;
    });

    wsDetails.views = [{ state: 'frozen', ySplit: 4, xSplit: 2 }];

    // Outer border
    const firstDetailRow = 4;
    const lastDetailRow = wsDetails.lastRow.number;
    const firstDetailCol = 3;
    const lastDetailCol = 10;

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
      const row = ws.addRow([null, null, r.country || '', r.city || '', r.employee || 0, r.contractor || 0, r.total || 0]);
      row.eachCell((cell, colNumber) => {
        if (colNumber >= 3) {
          cell.alignment = { vertical: 'middle', horizontal: colNumber >= 5 ? 'center' : 'left' };
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          if (colNumber === 7) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
            cell.font = { bold: true, size: 14 };
          }
        }
      });
    });

    const totalEmployees = (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0);
    const totalContractors = (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0);
    const totalTotals = (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0);

    const totalsRow = ws.addRow([null, null, 'Total', '', totalEmployees, totalContractors, totalTotals]);
    totalsRow.eachCell((cell, colNumber) => {
      if (colNumber >= 3) {
        cell.font = { bold: true, size: 15, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF808080' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      }
    });

    // Auto-width with limits for summary sheet
    ws.columns.forEach((col, idx) => {
      if (idx <= 2) { col.width = 2; return; }
      let maxLen = 0;
      col.eachCell({ includeEmpty: true }, c => {
        const v = c.value === null || c.value === undefined ? '' : String(c.value).trim();
        if (v.length > maxLen) maxLen = v.length;
      });
      let width = maxLen + 2;
      if (idx === 3) width = Math.min(Math.max(width, 12), 20); // Country
      else if (idx === 4) width = Math.min(Math.max(width, 12), 20); // City
      else if (idx === 5 || idx === 6 || idx === 7) width = Math.min(Math.max(width, 8), 12); // Numbers
      col.width = width;
    });

    ws.views = [{ state: 'frozen', ySplit: 4, xSplit: 2 }];

    ws.pageSetup = {
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      horizontalCentered: true,
      verticalCentered: false,
      margins: { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 }
    };

    // ---------- Save file ----------
    const filename = `Western Union APAC Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;
    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), filename);

  } catch (err) {
    console.error('handleExport error:', err);
  }
};
