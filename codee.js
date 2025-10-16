
  // const handleExport = async () => {
  //   if (!pickedDate) return;
  //   try {
  //     const excelModule = await import('exceljs');
  //     const Excel = excelModule.default || excelModule;
  //     let wb;

  //     if (Excel && Excel.Workbook) wb = new Excel.Workbook();
  //     else if (typeof Excel === 'function') wb = new Excel();
  //     else throw new Error('ExcelJS Workbook constructor not found');

  //     // ---------- SHEET 1: WU Employee ----------
  //     const wsDetails = wb.addWorksheet('WU Employee');

  //     // Headers
  //     const detailsHeaders = [
  //       'Sr.No', 'Date', 'Time',
  //       'Employee Name', 'Employee ID', 'Personal Type',
  //       'Door Name', 'Location'
  //     ];

  //     // Title row
  //     wsDetails.mergeCells(`A1:${String.fromCharCode(64 + detailsHeaders.length)}1`);
  //     const detailsTitle = wsDetails.getCell('A1');
  //     detailsTitle.value = `${format(pickedDate, 'EEEE, d MMMM, yyyy')}`;
  //     detailsTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  //     detailsTitle.font = { name: 'Calibri', size: 12, bold: true };

  //     // Header row
  //     const hdrRow = wsDetails.addRow(detailsHeaders);
  //     hdrRow.eachCell(cell => {
  //       cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC107' } };
  //       cell.font = { bold: true, color: { argb: 'FF000000' } };
  //       cell.alignment = { horizontal: 'center', vertical: 'middle' };
  //       cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  //     });

  //     // Data rows
  //     (detailRows || []).forEach((r, i) => {
  //       const dateVal = (r.LocaleMessageTime?.slice(0, 10)) || (r.SwipeDate?.slice(0, 10)) || '';
  //       const timeVal = formatApiTime12(r.LocaleMessageTime) || '';
  //       const name = r.ObjectName1 || '';
  //       const empId = r.EmployeeID || '';
  //       const ptype = r.PersonnelType || '';
  //       const door = r.Door || r.ObjectName2 || '';
  //       const location = r.PartitionName2 || r.PrimaryLocation || '';

  //       const row = wsDetails.addRow([i + 1, dateVal, timeVal, name, empId, ptype, door, location]);

  //       row.eachCell((cell, colNumber) => {
  //         cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  //         cell.font = { name: 'Calibri', size: 12 };
  //         cell.alignment = colNumber === 1 ? { horizontal: 'center', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
  //       });

  //       if (i % 2 === 1) {
  //         row.eachCell(cell => {
  //           cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
  //         });
  //       }
  //     });

  //     // Auto-width columns
  //     wsDetails.columns.forEach((col, idx) => {
  //       let maxLen = 0;
  //       col.eachCell({ includeEmpty: true }, c => {
  //         const v = c.value === null || c.value === undefined ? '' : String(c.value).trim();
  //         if (v.length > maxLen) maxLen = v.length;
  //       });
  //       let width = maxLen + 2;

  //       if (idx === 0) width = Math.min(Math.max(width, 6), 10);
  //       else if (idx === 1) width = Math.min(Math.max(width, 10), 15);
  //       else if (idx === 2) width = Math.min(Math.max(width, 8), 12);
  //       else if (idx === 3) width = Math.min(Math.max(width, 15), 30);
  //       else if (idx === 4) width = Math.min(Math.max(width, 10), 18);
  //       else if (idx === 5) width = Math.min(Math.max(width, 12), 20);
  //       else if (idx === 6) width = Math.min(Math.max(width, 24), 55);
  //       else if (idx === 7) width = Math.min(Math.max(width, 18), 40);

  //       col.width = width;
  //     });

  //     wsDetails.views = [{ state: 'frozen', ySplit: 2 }];

  //     // Outer border for WU Employee
  //     const firstDetailRow = 2;
  //     const lastDetailRow = wsDetails.lastRow.number;
  //     const firstDetailCol = 1;
  //     const lastDetailCol = detailsHeaders.length;

  //     for (let r = firstDetailRow; r <= lastDetailRow; r++) {
  //       for (let c = firstDetailCol; c <= lastDetailCol; c++) {
  //         const cell = wsDetails.getCell(r, c);
  //         const border = { ...cell.border };
  //         if (r === firstDetailRow) border.top = { style: 'medium' };
  //         if (r === lastDetailRow) border.bottom = { style: 'medium' };
  //         if (c === firstDetailCol) border.left = { style: 'medium' };
  //         if (c === lastDetailCol) border.right = { style: 'medium' };
  //         cell.border = border;
  //       }
  //     }

  //     wsDetails.pageSetup = {
  //       horizontalCentered: true,
  //       verticalCentered: false,
  //       orientation: 'landscape',
  //       fitToPage: true,
  //       fitToWidth: 1,
  //       fitToHeight: 0,
  //       margins: { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 }
  //     };

  //     // ---------- SHEET 2: WU Summary ----------
  //     const ws = wb.addWorksheet('WU Summary');

  //     // Header Row 1
  //     const r1 = ws.addRow(['Country', 'City', format(pickedDate, 'EEEE, d MMMM, yyyy'), null, null]);
  //     ws.mergeCells('C1:E1');
  //     const dateCell = ws.getCell('C1');
  //     dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
  //     dateCell.font = { bold: true, size: 12 };
  //     dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };


  //     r1.eachCell((cell, colNumber) => {
  //       if (colNumber <= 2) { // Bold Country and City
  //         cell.font = { bold: true, size: 12 };
  //         cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
  //       } else if (colNumber === 3) { // Date cell is merged C1:E1
  //         cell.font = { bold: true, size: 12 };
  //         cell.alignment = { horizontal: 'center', vertical: 'middle' };
  //         cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
  //       }
  //       cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  //     });

  //     // Header Row 2
  //     const r2 = ws.addRow(['', '', 'Employee', 'Contractors', 'Total']);
  //     r2.eachCell(cell => {
  //       cell.font = { bold: true, size: 12 };
  //       cell.alignment = { horizontal: 'center', vertical: 'middle' };
  //       cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
  //       cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  //     });

  //     // Data Rows
  //     (partitionRows || []).forEach(r => {
  //       const row = ws.addRow([r.country || '', r.city || '', r.employee || 0, r.contractor || 0, r.total || 0]);
  //       row.eachCell((cell, colNumber) => {
  //         cell.alignment = { vertical: 'middle', horizontal: colNumber >= 3 ? 'center' : 'left' };
  //         cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  //         if (colNumber === 5) {
  //           cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
  //           cell.font = { bold: true, size: 12 };
  //         }
  //       });
  //     });

  //     // Totals Row
  //     const totalEmployees = (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0);
  //     const totalContractors = (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0);
  //     const totalTotals = (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0);

  //     const totalsRow = ws.addRow(['Total', '', totalEmployees, totalContractors, totalTotals]);
  //     totalsRow.eachCell((cell) => {
  //       cell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
  //       cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF808080' } };
  //       cell.alignment = { horizontal: 'center', vertical: 'middle' };
  //       cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  //     });

  //     // Auto-fit columns
  //     ws.columns.forEach(col => {
  //       let maxLen = 6;
  //       col.eachCell({ includeEmpty: true }, c => {
  //         const v = c.value ? String(c.value) : '';
  //         maxLen = Math.max(maxLen, v.length + 2);
  //       });
  //       col.width = Math.min(Math.max(maxLen, 10), 40);
  //     });

  //     // Freeze headers
  //     ws.views = [{ state: 'frozen', ySplit: 2 }];

  //     // Outer border for Summary
  //     const firstRow = 1;
  //     const lastRow = ws.lastRow.number;
  //     const firstCol = 1;
  //     const lastCol = 5;

  //     for (let r = firstRow; r <= lastRow; r++) {
  //       for (let c = firstCol; c <= lastCol; c++) {
  //         const cell = ws.getCell(r, c);
  //         const border = { ...cell.border };
  //         if (r === firstRow) border.top = { style: 'medium' };
  //         if (r === lastRow) border.bottom = { style: 'medium' };
  //         if (c === firstCol) border.left = { style: 'medium' };
  //         if (c === lastCol) border.right = { style: 'medium' };
  //         cell.border = border;
  //       }
  //     }

  //     ws.pageSetup = {
  //       orientation: 'landscape',
  //       fitToPage: true,
  //       fitToWidth: 1,
  //       fitToHeight: 0,
  //       horizontalCentered: true,
  //       verticalCentered: false,
  //       margins: { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 }
  //     };

  //     // ---------- Dynamic Filename Logic ----------
  //     let cityName = '';

  //     // If a summary partition (like "Austria||Vienna") is selected, extract the city
  //     if (selectedSummaryPartition) {
  //       const [, selCity] = selectedSummaryPartition.split('||');
  //       cityName = selCity?.trim() || '';
  //     } else if (filteredPartitionKeys?.length === 1) {
  //       // fallback: if a single partition is in view (from URL param), infer from partitionToDisplay
  //       const key = filteredPartitionKeys[0];
  //       const disp = partitionToDisplay[key];
  //       cityName = disp?.city || '';
  //     }

  //     const filename = cityName
  //       ? `Western Union EMEA (${cityName}) Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`
  //       : `Western Union EMEA Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;

  //     const buf = await wb.xlsx.writeBuffer();
  //     saveAs(new Blob([buf]), filename);

  //   } catch (err) {
  //     console.error('handleExport error:', err);
  //   }
  // };


read above commend code and in below code add / ---------- SHEET 2: WU Summary ----------
  this sheet ok wiht same formatin ok 

  // --- Excel export for company summary (EMEA) ---
  
  
  const handleExport = async () => {
  if (!pickedDate) return;
  try {
    const Excel = (await import('exceljs')).default;

    let wb = new Excel.Workbook();
    // SHEET 1: WU Employee
    const wsDetails = wb.addWorksheet('WU Employee');
    const offsetRow = 2, offsetCol = 2; // match APAC
    const detailsHeaders = [
      'Sr.No', 'Date', 'Time',
      'Employee Name', 'Employee ID', 'Personal Type',
      'Door Name', 'Location'
    ];
    const firstCol = offsetCol;
    const lastCol = offsetCol + detailsHeaders.length - 1;
    // Title row
    const titleStart = String.fromCharCode(64 + firstCol) + offsetRow;
    const titleEnd = String.fromCharCode(64 + lastCol) + offsetRow;
    wsDetails.mergeCells(`${titleStart}:${titleEnd}`);
    const detailsTitle = wsDetails.getCell(offsetRow, firstCol);
    detailsTitle.value = `${format(pickedDate, 'EEEE, d MMMM, yyyy')}`;
    detailsTitle.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FF000000'}};
    detailsTitle.font = {name: 'Calibri', size: 12, bold: true, color: {argb: 'FFFFC107'}};
    detailsTitle.alignment = {horizontal: 'center', vertical: 'middle'};
    wsDetails.getRow(offsetRow).height = 22;
    // Fill outer cells in merged range for appearance
    for (let c = firstCol; c <= lastCol; c++) {
      const cell = wsDetails.getCell(offsetRow, c);
      cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FF000000'}};
      cell.font = {name: 'Calibri', size: 12, bold: true, color: {argb: 'FFFFC107'}};
      cell.border = {top: {style: 'medium'}, bottom: {style: 'medium'}, left: {style: 'medium'}, right: {style: 'medium'}};
    }
    // Header row
    const headerRowIndex = offsetRow + 1;
    const headerRow = wsDetails.getRow(headerRowIndex);
    headerRow.height = 22;
    detailsHeaders.forEach((h, idx) => {
      const colIndex = firstCol + idx;
      const cell = wsDetails.getCell(headerRowIndex, colIndex);
      cell.value = h;
      cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFFFC107'}};
      cell.font = {name: 'Calibri', size: 11, bold: true, color: {argb: 'FF000000'}};
      cell.border = {top: {style: 'medium'}, left: {style: 'medium'}, bottom: {style: 'medium'}, right: {style: 'medium'}};
      cell.alignment = {horizontal: 'center', vertical: 'middle'};
    });
    // Data rows start at headerRowIndex + 1
    const dataStartRow = headerRowIndex + 1;
    (detailRows || []).forEach((r, i) => {
      const rowIndex = dataStartRow + i;
      const row = wsDetails.getRow(rowIndex);
      row.height = 22;
      const values = [
        i + 1,
        (r.LocaleMessageTime?.slice(0, 10)) || (r.SwipeDate?.slice(0, 10)) || '',
        formatApiTime12(r.LocaleMessageTime) || '',
        r.ObjectName1 || '',
        r.EmployeeID || '',
        r.PersonnelType || '',
        r.Door || r.ObjectName2 || '',
        r.PartitionNameFriendly || ''
      ];
      values.forEach((val, idx) => {
        const colIndex = firstCol + idx;
        const cell = wsDetails.getCell(rowIndex, colIndex);
        cell.value = val;
        cell.border = {top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'}};
        cell.font = {name: 'Calibri', size: 10, color: {argb: 'FF000000'}};
        // Door Name column left-align, rest center
        cell.alignment = (colIndex === (firstCol + 6))
          ? {horizontal: 'left', vertical: 'middle'}
          : {horizontal: 'center', vertical: 'middle'};
      });
      if (i % 2 === 1) {
        values.forEach((_, idx) => {
          const colIndex = firstCol + idx;
          const cell = wsDetails.getCell(rowIndex, colIndex);
          cell.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFF7F7F7'}};
        });
      }
    });
    // After data, one empty row
    const lastDataRow = (detailRows?.length ? dataStartRow + detailRows.length - 1 : headerRowIndex);
    wsDetails.addRow([]).height = 22;
    wsDetails.views = [{state: 'frozen', ySplit: headerRowIndex, showGridLines: false}];
    // Autosize columns for used area
    for (let c = firstCol; c <= lastCol; c++) {
      let maxLen = 0;
      for (let r = offsetRow; r <= lastDataRow; r++) {
        const cell = wsDetails.getCell(r, c);
        const v = cell.value === null || cell.value === undefined ? '' : String(cell.value);
        maxLen = Math.max(maxLen, v.length);
      }
      wsDetails.getColumn(c).width = Math.min(Math.max(maxLen + 2, 6), 50);
    }
    wsDetails.getColumn(lastCol + 1).width = 4;
    // Outer border: medium
    for (let r = headerRowIndex; r <= lastDataRow; r++) {
      for (let c = firstCol; c <= lastCol; c++) {
        const cell = wsDetails.getCell(r, c);
        const border = { ...cell.border };
        if (r === headerRowIndex) border.top = {style: 'medium'};
        if (r === lastDataRow) border.bottom = {style: 'medium'};
        if (c === firstCol) border.left = {style: 'medium'};
        if (c === lastCol) border.right = {style: 'medium'};
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
      margins: {left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3}
    };

  
    // Save file
    const filename = `Western Union EMEA Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;
    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), filename);

  } catch (err) {
    console.error('handleExport error:', err);
  }
}
