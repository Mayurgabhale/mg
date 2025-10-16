// --- Excel export for company summary (EMEA) ---
const handleExport = async () => {
  if (!pickedDate) return;
  try {
    const Excel = (await import('exceljs')).default;
    let wb = new Excel.Workbook();

    /* ------------------ SHEET 1: WU Employee ------------------ */
    const wsDetails = wb.addWorksheet('WU Employee');
    const offsetRow = 2, offsetCol = 2; // match APAC layout
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
    detailsTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    detailsTitle.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFC107' } };
    detailsTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    wsDetails.getRow(offsetRow).height = 22;
    for (let c = firstCol; c <= lastCol; c++) {
      const cell = wsDetails.getCell(offsetRow, c);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
      cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFC107' } };
      cell.border = { top: { style: 'medium' }, bottom: { style: 'medium' }, left: { style: 'medium' }, right: { style: 'medium' } };
    }

    // Header row
    const headerRowIndex = offsetRow + 1;
    const headerRow = wsDetails.getRow(headerRowIndex);
    headerRow.height = 22;
    detailsHeaders.forEach((h, idx) => {
      const colIndex = firstCol + idx;
      const cell = wsDetails.getCell(headerRowIndex, colIndex);
      cell.value = h;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
      cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Data rows
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
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF000000' } };
        cell.alignment = (colIndex === (firstCol + 6))
          ? { horizontal: 'left', vertical: 'middle' }
          : { horizontal: 'center', vertical: 'middle' };
      });
      if (i % 2 === 1) {
        values.forEach((_, idx) => {
          const colIndex = firstCol + idx;
          wsDetails.getCell(rowIndex, colIndex).fill =
            { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
        });
      }
    });

    const lastDataRow = (detailRows?.length ? dataStartRow + detailRows.length - 1 : headerRowIndex);
    wsDetails.addRow([]).height = 22;
    wsDetails.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];
    for (let c = firstCol; c <= lastCol; c++) {
      let maxLen = 0;
      for (let r = offsetRow; r <= lastDataRow; r++) {
        const val = wsDetails.getCell(r, c).value;
        maxLen = Math.max(maxLen, (val ? String(val).length : 0));
      }
      wsDetails.getColumn(c).width = Math.min(Math.max(maxLen + 2, 6), 50);
    }
    wsDetails.getColumn(lastCol + 1).width = 4;

    for (let r = headerRowIndex; r <= lastDataRow; r++) {
      for (let c = firstCol; c <= lastCol; c++) {
        const cell = wsDetails.getCell(r, c);
        const border = { ...cell.border };
        if (r === headerRowIndex) border.top = { style: 'medium' };
        if (r === lastDataRow) border.bottom = { style: 'medium' };
        if (c === firstCol) border.left = { style: 'medium' };
        if (c === lastCol) border.right = { style: 'medium' };
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

    /* ------------------ SHEET 2: WU Summary ------------------ */
    const ws = wb.addWorksheet('WU Summary');
    const sOffsetRow = 2, sOffsetCol = 2;
    const sFirstCol = sOffsetCol;
    const sHeaders = ['Country', 'City', 'Employee', 'Contractors', 'Total'];
    const sLastCol = sFirstCol + sHeaders.length - 1;

    ws.mergeCells(`${String.fromCharCode(64 + sFirstCol)}${sOffsetRow}:${String.fromCharCode(64 + sLastCol)}${sOffsetRow}`);
    const sDateCell = ws.getCell(sOffsetRow, sFirstCol);
    sDateCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
    sDateCell.alignment = { horizontal: 'center', vertical: 'middle' };

    for (let c = sFirstCol; c <= sLastCol; c++) {
      const cell = ws.getCell(sOffsetRow, c);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
      cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFC107' } };
      cell.border = { top: { style: 'medium' }, bottom: { style: 'medium' }, left: { style: 'medium' }, right: { style: 'medium' } };
    }

    const sHeaderRowIndex = sOffsetRow + 1;
    ws.getRow(sHeaderRowIndex).height = 22;
    sHeaders.forEach((h, idx) => {
      const c = sFirstCol + idx;
      const cell = ws.getCell(sHeaderRowIndex, c);
      cell.value = h;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
      cell.font = { name: 'Calibri', size: 11, bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
    });

    const sDataStartRow = sHeaderRowIndex + 1;
    (partitionRows || []).forEach((r, i) => {
      const rowIndex = sDataStartRow + i;
      ws.getRow(rowIndex).height = 22;
      const rowVals = [
        r.country || '',
        r.city || '',
        r.employee || 0,
        r.contractor || 0,
        r.total || 0
      ];
      rowVals.forEach((val, idx) => {
        const c = sFirstCol + idx;
        const cell = ws.getCell(rowIndex, c);
        cell.value = val;
        const isNum = idx >= 2;
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        if (isNum && typeof val === 'number') cell.numFmt = '#,##0';
        cell.font = { name: 'Calibri', size: 10 };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });

    const sLastDataRow = (partitionRows?.length ? sDataStartRow + partitionRows.length - 1 : sHeaderRowIndex);
    const totalsRowIndex = sLastDataRow + 1;
    const totalEmployees = (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0);
    const totalContractors = (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0);
    const totalTotals = (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0);

    for (let c = sFirstCol; c <= sLastCol; c++) {
      const cell = ws.getCell(totalsRowIndex, c);
      if (c === sFirstCol) cell.value = 'Total';
      else if (c === sFirstCol + 2) cell.value = totalEmployees;
      else if (c === sFirstCol + 3) cell.value = totalContractors;
      else if (c === sFirstCol + 4) cell.value = totalTotals;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
      if ((c >= sFirstCol + 2) && typeof cell.value === 'number') cell.numFmt = '#,##0';
    }

    ws.getRow(totalsRowIndex).height = 22;
    ws.views = [{ state: 'frozen', ySplit: sHeaderRowIndex, showGridLines: false }];

    for (let c = sFirstCol; c <= sLastCol; c++) {
      let maxLen = 0;
      for (let r = sOffsetRow; r <= totalsRowIndex; r++) {
        const val = ws.getCell(r, c).value;
        maxLen = Math.max(maxLen, (val ? String(val).length : 0));
      }
      ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 6), 40);
    }
    ws.getColumn(sLastCol + 1).width = 4;
    ws.pageSetup = {
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      horizontalCentered: true,
      verticalCentered: false,
      margins: { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 }
    };

    /* ------------------ Save File ------------------ */
    const filename = `Western Union EMEA Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;
    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), filename);
  } catch (err) {
    console.error('handleExport error:', err);
  }
};