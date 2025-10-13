const handleExport = async () => {
  if (!pickedDate) return;

  try {
    const excelModule = await import('exceljs');
    const Excel = excelModule.default || excelModule;
    const wb = new Excel.Workbook();

    // ---------------------- SHEET 1: WU Employee ----------------------
    const wsDetails = wb.addWorksheet('WU Employee');

    // Title Row
    const title = `${format(pickedDate, 'EEEE, d MMMM, yyyy')}`;
    wsDetails.mergeCells('A1:H1');
    const titleCell = wsDetails.getCell('A1');
    titleCell.value = title;
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF000000' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDEBD0' } };

    // Headers
    const headers = [
      'Sr.No', 'Date', 'Time',
      'Employee Name', 'Employee ID',
      'Personal Type', 'Door Name', 'Location'
    ];
    const hdrRow = wsDetails.addRow(headers);
    hdrRow.eachCell(cell => {
      cell.font = { bold: true, size: 12 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' }
      };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
    });

    // Data Rows
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
        cell.font = { name: 'Calibri', size: 11 };
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
        cell.alignment = colNumber === 1
          ? { horizontal: 'center', vertical: 'middle' }
          : { horizontal: 'left', vertical: 'middle' };
      });

      // alternate shading for readability
      if (i % 2 === 1) {
        row.eachCell(cell => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9F9F9' } };
        });
      }
    });

    // Auto width columns
    wsDetails.columns.forEach((col, i) => {
      let maxLen = 0;
      col.eachCell({ includeEmpty: true }, c => {
        const v = c.value ? String(c.value) : '';
        maxLen = Math.max(maxLen, v.length);
      });
      col.width = Math.min(Math.max(maxLen + 3, 10), 40);
    });

    // Apply thick outer border (like HTML)
    const firstRow = 2;
    const lastRow = wsDetails.lastRow.number;
    const firstCol = 1;
    const lastCol = headers.length;
    for (let r = firstRow; r <= lastRow; r++) {
      for (let c = firstCol; c <= lastCol; c++) {
        const cell = wsDetails.getCell(r, c);
        const b = { ...cell.border };
        if (r === firstRow) b.top = { style: 'medium' };
        if (r === lastRow) b.bottom = { style: 'medium' };
        if (c === firstCol) b.left = { style: 'medium' };
        if (c === lastCol) b.right = { style: 'medium' };
        cell.border = b;
      }
    }

    // Margin & centering setup
    wsDetails.pageSetup = {
      orientation: 'landscape',
      horizontalCentered: true,
      verticalCentered: false,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: { left: 0.6, right: 0.6, top: 0.8, bottom: 0.8 }
    };

    wsDetails.views = [{ state: 'frozen', ySplit: 2 }];

    // ---------------------- SHEET 2: WU Summary ----------------------
    const ws = wb.addWorksheet('WU Summary');

    // Top merged title
    ws.mergeCells('A1:E1');
    const sumTitle = ws.getCell('A1');
    sumTitle.value = `Western Union - Summary Report (${format(pickedDate, 'd MMMM yyyy')})`;
    sumTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    sumTitle.font = { size: 14, bold: true };
    sumTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDEBD0' } };

    // Headers
    const hdr2 = ws.addRow(['Country', 'City', 'Employee', 'Contractors', 'Total']);
    hdr2.eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' }
      };
    });

    // Data
    (partitionRows || []).forEach(r => {
      const row = ws.addRow([r.country || '', r.city || '', r.employee || 0, r.contractor || 0, r.total || 0]);
      row.eachCell((cell, colNumber) => {
        cell.alignment = { vertical: 'middle', horizontal: colNumber >= 3 ? 'center' : 'left' };
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
        if (colNumber === 5) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF99' } };
          cell.font = { bold: true };
        }
      });
    });

    // Totals
    const totalsRow = ws.addRow([
      'Total', '',
      (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0),
      (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0),
      (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0),
    ]);
    totalsRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' }
      };
    });

    // Adjust widths
    ws.columns.forEach(col => {
      let maxLen = 6;
      col.eachCell({ includeEmpty: true }, c => {
        const v = c.value ? String(c.value) : '';
        maxLen = Math.max(maxLen, v.length + 2);
      });
      col.width = Math.min(Math.max(maxLen, 10), 40);
    });

    // Thick outer border
    const firstRowSum = 2;
    const lastRowSum = ws.lastRow.number;
    for (let r = firstRowSum; r <= lastRowSum; r++) {
      for (let c = 1; c <= 5; c++) {
        const cell = ws.getCell(r, c);
        const b = { ...cell.border };
        if (r === firstRowSum) b.top = { style: 'medium' };
        if (r === lastRowSum) b.bottom = { style: 'medium' };
        if (c === 1) b.left = { style: 'medium' };
        if (c === 5) b.right = { style: 'medium' };
        cell.border = b;
      }
    }

    ws.pageSetup = {
      orientation: 'landscape',
      horizontalCentered: true,
      verticalCentered: false,
      fitToPage: true,
      fitToWidth: 1,
      margins: { left: 0.6, right: 0.6, top: 0.8, bottom: 0.8 }
    };

    ws.views = [{ state: 'frozen', ySplit: 2 }];

    // ---------------------- Save file ----------------------
    let cityName = '';
    if (backendFilterKey) {
      const fe = Object.keys(apacPartitionDisplay).find(
        code => apacForwardKey[code] === backendFilterKey || code === backendFilterKey
      );
      cityName = fe ? apacPartitionDisplay[fe].city : backendFilterKey;
    }

    const filename = cityName
      ? `Western Union APAC (${cityName}) Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`
      : `Western Union APAC Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), filename);
  } catch (err) {
    console.error('handleExport error:', err);
  }
};