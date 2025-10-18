t handleExport = async () => {
    if (!pickedDate) return;

    try {
      const excelModule = await import('exceljs');
      const Excel = excelModule.default || excelModule;
      let wb;

      if (Excel && Excel.Workbook) wb = new Excel.Workbook();
      else if (typeof Excel === 'function') wb = new Excel();
      else throw new Error('ExcelJS Workbook constructor not found');

      /* ------------------ SHEET 1: WU Employee ------------------ */
      const wsDetails = wb.addWorksheet('WU Employee');

      const offsetRow = 2;
      const offsetCol = 2;

      const detailsHeaders = [
        'Sr.No', 'Date', 'Time',
        'Employee Name', 'Employee ID', 'Personal Type',
        'Door Name', 'Location'
      ];

      const firstCol = offsetCol;
      const lastCol = offsetCol + detailsHeaders.length - 1;

      // ---- Title Row ----
      const titleStart = colLetter(firstCol) + offsetRow;
      const titleEnd = colLetter(lastCol) + offsetRow;
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
        cell.border = {
          top: { style: 'medium' },
          bottom: { style: 'medium' },
          left: { style: 'medium' },
          right: { style: 'medium' }
        };
      }

      // ---- Header Row ----
      const headerRowIndex = offsetRow + 1;
      const headerRow = wsDetails.getRow(headerRowIndex);
      headerRow.height = 22;

      detailsHeaders.forEach((h, idx) => {
        const colIndex = firstCol + idx;
        const cell = wsDetails.getCell(headerRowIndex, colIndex);
        cell.value = h;
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
        cell.border = {
          top: { style: 'medium' }, left: { style: 'medium' },
          bottom: { style: 'medium' }, right: { style: 'medium' }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });

      // ---- Data Rows ----
      const dataStartRow = headerRowIndex + 1;
      (detailRows || []).forEach((r, i) => {
        const rowIndex = dataStartRow + i;
        const row = wsDetails.getRow(rowIndex);
        row.height = 22;

        const dateVal = (r.LocaleMessageTime?.slice(0, 10)) || (r.SwipeDate?.slice(0, 10)) || '';
        const timeVal = formatApiTime12(r.LocaleMessageTime) || '';
        const name = r.ObjectName1 || '';
        const empId = r.EmployeeID || '';
        const ptype = r.PersonnelType || '';
        const door = r.Door || r.ObjectName2 || '';
        const location = r.PartitionName2 || r.PrimaryLocation || '';

        const values = [i + 1, dateVal, timeVal, name, empId, ptype, door, location];

        values.forEach((val, idx) => {
          const colIndex = firstCol + idx;
          const cell = wsDetails.getCell(rowIndex, colIndex);
          cell.value = val;
          cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' },
            bottom: { style: 'thin' }, right: { style: 'thin' }
          };
          cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF000000' } };
          cell.alignment = { horizontal: idx === 6 ? 'left' : 'center', vertical: 'middle' };
        });

        // alternate row fill
        if (i % 2 === 1) {
          for (let c = firstCol; c <= lastCol; c++) {
            wsDetails.getCell(rowIndex, c).fill = {
              type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' }
            };
          }
        }
      });

      // Freeze + autosize
      wsDetails.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];
      for (let c = firstCol; c <= lastCol; c++) {
        let maxLen = 0;
        for (let r = offsetRow; r <= wsDetails.lastRow.number; r++) {
          const val = wsDetails.getCell(r, c).value;
          maxLen = Math.max(maxLen, val ? String(val).length : 0);
        }
        wsDetails.getColumn(c).width = Math.min(Math.max(maxLen + 2, 6), 40);
      }

      // ---- Outer Border for WU Employee sheet ----
const detailsLastRow = wsDetails.lastRow.number;
for (let r = offsetRow; r <= detailsLastRow; r++) {
  for (let c = firstCol; c <= lastCol; c++) {
    const cell = wsDetails.getCell(r, c);
    const border = {};
    if (r === offsetRow) border.top = { style: 'medium' };
    if (r === detailsLastRow) border.bottom = { style: 'medium' };
    if (c === firstCol) border.left = { style: 'medium' };
    if (c === lastCol) border.right = { style: 'medium' };
    cell.border = { ...cell.border, ...border };
  }
}




      wsDetails.pageSetup = {
        orientation: 'landscape',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        horizontalCentered: true,
        verticalCentered: false,
        margins: { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 }
      };

      /* ------------------ SHEET 2: WU Summary ------------------ */
      const ws = wb.addWorksheet('WU Summary');
      const sOffsetRow = 2, sOffsetCol = 2;
      const sHeaders = ['Country', 'City', 'Employee', 'Contractors', 'Total'];
      const sFirstCol = sOffsetCol, sLastCol = sOffsetCol + sHeaders.length - 1;

      // Title Row
      ws.mergeCells(`${colLetter(sFirstCol)}${sOffsetRow}:${colLetter(sLastCol)}${sOffsetRow}`);
      const sTitle = ws.getCell(sOffsetRow, sFirstCol);
      sTitle.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
      sTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
      sTitle.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFC107' } };
      sTitle.alignment = { horizontal: 'center', vertical: 'middle' };
      ws.getRow(sOffsetRow).height = 22;

      // Headers
      const sHeaderRow = sOffsetRow + 1;
      sHeaders.forEach((h, idx) => {
        const c = sFirstCol + idx;
        const cell = ws.getCell(sHeaderRow, c);
        cell.value = h;
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
        cell.font = { name: 'Calibri', size: 11, bold: true };
        cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });

      // Data Rows
      const sDataStart = sHeaderRow + 1;
      (partitionRows || []).forEach((r, i) => {
        const rowIndex = sDataStart + i;
        const vals = [r.country || '', r.city || '', r.employee || 0, r.contractor || 0, r.total || 0];
        vals.forEach((val, idx) => {
          const c = sFirstCol + idx;
          const cell = ws.getCell(rowIndex, c);
          cell.value = val;
          cell.alignment = { horizontal: idx >= 2 ? 'center' : 'left', vertical: 'middle' };
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          cell.font = { name: 'Calibri', size: 10 };
          if (i % 2 === 1) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
          }
        });
      });

      // Totals Row
      const lastDataRow = (partitionRows?.length ? sDataStart + partitionRows.length - 1 : sHeaderRow);
      const totalsRow = lastDataRow + 1;
      const totalEmployees = (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0);
      const totalContractors = (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0);
      const totalTotals = (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0);

      const totalsFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
      const totalsFont = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };

      for (let c = sFirstCol; c <= sLastCol; c++) {
        const cell = ws.getCell(totalsRow, c);
        if (c === sFirstCol) cell.value = 'Total';
        if (c === sFirstCol + 2) cell.value = totalEmployees;
        if (c === sFirstCol + 3) cell.value = totalContractors;
        if (c === sFirstCol + 4) cell.value = totalTotals;
        cell.fill = totalsFill;
        cell.font = totalsFont;
        cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }

      ws.views = [{ state: 'frozen', ySplit: sHeaderRow, showGridLines: false }];

      // Autosize columns
      for (let c = sFirstCol; c <= sLastCol; c++) {
        let maxLen = 0;
        for (let r = sOffsetRow; r <= totalsRow; r++) {
          const val = ws.getCell(r, c).value;
          maxLen = Math.max(maxLen, val ? String(val).length : 0);
        }
        ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 10), 40);
      }



      // ---- Outer Border for WU Summary sheet ----
const sDetailsLastRow = totalsRow; // includes totals row
for (let r = sOffsetRow; r <= sDetailsLastRow; r++) {
  for (let c = sFirstCol; c <= sLastCol; c++) {
    const cell = ws.getCell(r, c);
    const border = {};
    if (r === sOffsetRow) border.top = { style: 'medium' };
    if (r === sDetailsLastRow) border.bottom = { style: 'medium' };
    if (c === sFirstCol) border.left = { style: 'medium' };
    if (c === sLastCol) border.right = { style: 'medium' };
    cell.border = { ...cell.border, ...border };
  }
}

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
      let cityName = '';
      if (selectedSummaryPartition) {
        const [, selCity] = selectedSummaryPartition.split('||');
        cityName = selCity || '';
      } else if (filterCode) {
        const firstRow = companyRows.find(r => r.country === codeToCountry[filterCode]);
        cityName = firstRow?.city || '';
      }

      const filename = cityName
        ? `Western Union LACA (${cityName}) Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`
        : `Western Union LACA Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;

      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), filename);
    } catch (err) {
      console.error('handleExport error:', err);
    }
  };

  // Proper column-to-letter helper (supports >26 columns)
  const colLetter = (col) => {
    let letter = '';
    while (col > 0) {
      let rem = (col - 1) % 26;
      letter = String.fromCharCode(65 + rem) + letter;
      col = Math.floor((col - 1) / 26);
    }
    return letter;
  };

  // --------------------------------------------------

  // --------------------------------------------------
  const handleExportSummary = async () => {
    if (!pickedDate || !partitionRows?.length) return;

    try {
      const excelModule = await import('exceljs');
      const Excel = excelModule.default || excelModule;
      const wb = Excel && Excel.Workbook ? new Excel.Workbook() : new Excel();

      const ws = wb.addWorksheet('Summary');
      const offsetRow = 2;
      const offsetCol = 2;
      const firstCol = offsetCol;

      const headers = ['Country', 'City', 'Employees', 'Contractors'];
      if (isCostaRica) headers.push('Temp Badge');
      headers.push('Total');

      const lastCol = firstCol + headers.length - 1;

      // ---- Title row
      ws.mergeCells(`${colLetter(firstCol)}${offsetRow}:${colLetter(lastCol)}${offsetRow}`);
      const titleCell = ws.getCell(offsetRow, firstCol);
      titleCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
      titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFC107' } };
      titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      titleCell.border = {
        top: { style: 'medium' }, bottom: { style: 'medium' },
        left: { style: 'medium' }, right: { style: 'medium' },
      };
      ws.getRow(offsetRow).height = 22;

      // ---- Header row
      const headerRowIndex = offsetRow + 1;
      headers.forEach((h, i) => {
        const cell = ws.getCell(headerRowIndex, firstCol + i);
        cell.value = h;
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'medium' }, bottom: { style: 'medium' },
          left: { style: 'medium' }, right: { style: 'medium' },
        };
      });
      ws.getRow(headerRowIndex).height = 22;

      // ---- Data rows
      const dataStartRow = headerRowIndex + 1;
      partitionRows.forEach((r, i) => {
        const rowIndex = dataStartRow + i;
        const rowVals = [
          r.country,
          r.city,
          r.employee,
          r.contractor,
          ...(isCostaRica ? [r.tempBadge] : []),
          r.total,
        ];

        rowVals.forEach((val, j) => {
          const cell = ws.getCell(rowIndex, firstCol + j);
          cell.value = val;
          cell.font = { name: 'Calibri', size: 10 };
          cell.alignment = j >= 2 ? { horizontal: 'right', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
          if (j >= 2) cell.numFmt = '#,##0';
          cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' },
            bottom: { style: 'thin' }, right: { style: 'thin' },
          };
          if (i % 2 === 1) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
          }
        });
      });

      // ---- Totals row
      const lastDataRow = dataStartRow + partitionRows.length - 1;
      const totalsRowIndex = lastDataRow + 1;

      const totals = [
        'Total',
        '',
        partitionRows.reduce((s, r) => s + (r.employee || 0), 0),
        partitionRows.reduce((s, r) => s + (r.contractor || 0), 0),
        ...(isCostaRica ? [partitionRows.reduce((s, r) => s + (r.tempBadge || 0), 0)] : []),
        partitionRows.reduce((s, r) => s + (r.total || 0), 0),
      ];

      totals.forEach((val, j) => {
        const cell = ws.getCell(totalsRowIndex, firstCol + j);
        cell.value = val;
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
        cell.alignment = j >= 2 ? { horizontal: 'right', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
        if (j >= 2) cell.numFmt = '#,##0';
        cell.border = {
          top: { style: 'medium' }, left: { style: 'medium' },
          bottom: { style: 'medium' }, right: { style: 'medium' },
        };
      });
      ws.getRow(totalsRowIndex).height = 22;

      // ---- Freeze + Autosize
      ws.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];
      for (let c = firstCol; c <= lastCol; c++) {
        let maxLen = 0;
        for (let r = offsetRow; r <= totalsRowIndex; r++) {
          const v = ws.getCell(r, c).value ?? '';
          maxLen = Math.max(maxLen, String(v).length);
        }
        ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 8), 50);
      }

      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), `summary_${format(pickedDate, 'yyyyMMdd')}.xlsx`);
    } catch (err) {
      console.error('handleExportSummary error:', err);
    }
  };

  // --------------------------------------------------
 
  // --------------------------------------------------
  const handleExportCompanies = async () => {
    if (!pickedDate || !companyRows?.length) return;

    try {
      const excelModule = await import('exceljs');
      const Excel = excelModule.default || excelModule;
      const wb = Excel && Excel.Workbook ? new Excel.Workbook() : new Excel();

      const ws = wb.addWorksheet('Company Summary');
      const offsetRow = 2;
      const offsetCol = 2;
      const firstCol = offsetCol;
      const headers = ['Country', 'City', 'Company', 'Total'];
      const lastCol = firstCol + headers.length - 1;

      // ---- Title row
      ws.mergeCells(`${colLetter(firstCol)}${offsetRow}:${colLetter(lastCol)}${offsetRow}`);
      const titleCell = ws.getCell(offsetRow, firstCol);
      titleCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
      titleCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFC107' } };
      titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      titleCell.border = {
        top: { style: 'medium' }, bottom: { style: 'medium' },
        left: { style: 'medium' }, right: { style: 'medium' },
      };
      ws.getRow(offsetRow).height = 22;

      // ---- Header row
      const headerRowIndex = offsetRow + 1;
      headers.forEach((h, i) => {
        const cell = ws.getCell(headerRowIndex, firstCol + i);
        cell.value = h;
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'medium' }, left: { style: 'medium' },
          bottom: { style: 'medium' }, right: { style: 'medium' },
        };
      });

      // ---- Data rows
      const dataStartRow = headerRowIndex + 1;
      companyRows.forEach((r, i) => {
        const rowIndex = dataStartRow + i;
        const vals = [r.country, r.city, r.company, r.total];
        vals.forEach((val, j) => {
          const cell = ws.getCell(rowIndex, firstCol + j);
          cell.value = val;
          cell.font = { name: 'Calibri', size: 10 };
          cell.alignment = j === 3 ? { horizontal: 'right', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
          if (j === 3) cell.numFmt = '#,##0';
          cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' },
            bottom: { style: 'thin' }, right: { style: 'thin' },
          };
          if (i % 2 === 1) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
          }
        });
      });

      // ---- Totals row
      const lastDataRow = dataStartRow + companyRows.length - 1;
      const totalsRowIndex = lastDataRow + 1;
      const total = companyRows.reduce((s, r) => s + (r.total || 0), 0);

      headers.forEach((_, j) => {
        const cell = ws.getCell(totalsRowIndex, firstCol + j);
        if (j === 0) cell.value = 'Total';
        if (j === 3) cell.value = total;
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
        cell.alignment = j === 3 ? { horizontal: 'right', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
        if (j === 3) cell.numFmt = '#,##0';
        cell.border = {
          top: { style: 'medium' }, left: { style: 'medium' },
          bottom: { style: 'medium' }, right: { style: 'medium' },
        };
      });

      // ---- Freeze + Autosize
      ws.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];
      for (let c = firstCol; c <= lastCol; c++) {
        let maxLen = 0;
        for (let r = offsetRow; r <= totalsRowIndex; r++) {
          const v = ws.getCell(r, c).value ?? '';
          maxLen = Math.max(maxLen, String(v).length);
        }
        ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 8), 50);
      }

      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), `companies_${format(pickedDate, 'yyyyMMdd')}.xlsx`);
    } catch (err) {
      console.error('handleExportCompanies error:', err);
    }
  };
