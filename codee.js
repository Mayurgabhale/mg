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
          // r.PartitionNameFriendly || ''
          partitionToDisplay[r.PartitionName2]?.city || r.PartitionName2
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
      const sOffsetRow = 4, sOffsetCol = 4;
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
      // const filename = `Western Union EMEA Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;
      // ---------- Dynamic Filename Logic ----------
      let cityName = '';

      // If a summary partition (like "Austria||Vienna") is selected, extract the city
      if (selectedSummaryPartition) {
        const [, selCity] = selectedSummaryPartition.split('||');
        cityName = selCity?.trim() || '';
      } else if (filteredPartitionKeys?.length === 1) {
        // fallback: if a single partition is in view (from URL param), infer from partitionToDisplay
        const key = filteredPartitionKeys[0];
        const disp = partitionToDisplay[key];
        cityName = disp?.city || '';
      }

      const filename = cityName
        ? `Western Union EMEA (${cityName}) Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`
        : `Western Union EMEA Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;

      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), filename);
    } catch (err) {
      console.error('handleExport error:', err);
    }
  };

seee in
  Monday, 13 October, 2025							
Sr.No	Date	Time	Employee Name	Employee ID	Personal Type	Door Name	Location
1	2025-10-13	05:06:04 AM	Marhaba, Ahmed	W0020932	Contractor	EMEA_MOR_CASA_07_01_Main Entrance	Casablanca
2	2025-10-13	07:47:32 AM	Oueslati, Rym	315069	Employee	EMEA_MOR_CASA_07_01_Main Entrance	Casablanca

this data disply but 
in this two are not disply 
  /* ------------------ handleExportSummary (EMEA) ------------------ */
  const handleExportSummary = async () => {
    if (!pickedDate) return;

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Summary');

    const offsetRow = 2;
    const offsetCol = 2;
    const firstCol = offsetCol;
    const headers = ['Country', 'City', 'Employees', 'Contractors', 'Total'];
    const lastCol = firstCol + headers.length - 1;

    // Title (merged black background + yellow text + thick border)
    ws.mergeCells(`${colLetter(firstCol)}${offsetRow}:${colLetter(lastCol)}${offsetRow}`);
    for (let c = firstCol; c <= lastCol; c++) {
      const cell = ws.getCell(offsetRow, c);
      cell.value = c === firstCol ? format(pickedDate, 'EEEE, d MMMM, yyyy') : '';
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } }; // black
      cell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFC107' } }; // yellow text
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top: { style: 'medium' }, bottom: { style: 'medium' }, left: { style: 'medium' }, right: { style: 'medium' } };
    }
    ws.getRow(offsetRow).height = 22;

    // Header row
    const headerRowIndex = offsetRow + 1;
    headers.forEach((h, idx) => {
      const c = firstCol + idx;
      const cell = ws.getCell(headerRowIndex, c);
      cell.value = h;
      cell.height = 22;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } }; // yellow fill
      cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF000000' } }; // black text
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
    });
    ws.getRow(headerRowIndex).height = 22;

    // Data rows
    const dataStartRow = headerRowIndex + 1;
    partitionRows.forEach((r, i) => {
      const rowIndex = dataStartRow + i;
      ws.getRow(rowIndex).height = 22;
      headers.forEach((_, idx) => {
        const c = firstCol + idx;
        const cell = ws.getCell(rowIndex, c);
        const val =
          idx === 0 ? (r.country || '') :
            idx === 1 ? (r.city || '') :
              idx === 2 ? (r.employee || 0) :
                idx === 3 ? (r.contractor || 0) :
                  (r.total || 0);
        cell.value = val;
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        if (idx >= 2 && typeof val === 'number') cell.numFmt = '#,##0';
        cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF000000' } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });

    // Totals row (dark gray background, white bold text, thick border)
    const lastDataRow = (partitionRows?.length ? dataStartRow + partitionRows.length - 1 : headerRowIndex);
    const totalsRowIndex = lastDataRow + 1;
    const totalEmployees = partitionRows.reduce((s, r) => s + (r.employee || 0), 0);
    const totalContractors = partitionRows.reduce((s, r) => s + (r.contractor || 0), 0);
    const totalTotal = partitionRows.reduce((s, r) => s + (r.total || 0), 0);

    const totalsFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
    const totalsFont = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };

    for (let c = firstCol; c <= lastCol; c++) {
      const cell = ws.getCell(totalsRowIndex, c);
      if (c === firstCol) cell.value = 'Total';
      if (c === firstCol + 2) cell.value = totalEmployees;
      if (c === firstCol + 3) cell.value = totalContractors;
      if (c === firstCol + 4) cell.value = totalTotal;
      cell.fill = totalsFill;
      cell.font = totalsFont;
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
      if ((c >= firstCol + 2) && typeof cell.value === 'number') cell.numFmt = '#,##0';
    }
    ws.getRow(totalsRowIndex).height = 22;

    // Medium border outline for the full block (title..totals)
    for (let r = offsetRow; r <= totalsRowIndex; r++) {
      for (let c = firstCol; c <= lastCol; c++) {
        const cell = ws.getCell(r, c);
        const border = { ...cell.border };
        if (r === offsetRow) border.top = { style: 'medium' };
        if (r === totalsRowIndex) border.bottom = { style: 'medium' };
        if (c === firstCol) border.left = { style: 'medium' };
        if (c === lastCol) border.right = { style: 'medium' };
        cell.border = border;
      }
    }

    // Spacer row + right margin
    const blankRow = ws.addRow([]);
    blankRow.height = 22;
    ws.getColumn(lastCol + 1).width = 4;

    // Freeze header & hide gridlines
    ws.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];

    // Autosize columns
    for (let c = firstCol; c <= lastCol; c++) {
      let maxLen = 0;
      for (let r = offsetRow; r <= totalsRowIndex; r++) {
        const val = ws.getCell(r, c).value;
        maxLen = Math.max(maxLen, val ? String(val).length : 0);
      }
      ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 6), 40);
    }

    // Export
    const buf = await wb.xlsx.writeBuffer();
    const safeDate = format(pickedDate, 'yyyyMMdd');
    const filename = `emea_summary_${safeDate}.xlsx`;
    saveAs(new Blob([buf]), filename);
  };


  /* ------------------ handleExportCompanies (EMEA) ------------------ */
  const handleExportCompanies = async () => {
    if (!pickedDate || !companyRows.length) return;

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Company Summary');

    const offsetRow = 2;
    const offsetCol = 2;
    const firstCol = offsetCol;
    const headers = ['Country', 'City', 'Company', 'Total'];
    const lastCol = firstCol + headers.length - 1;

    // --- Helper to convert column number to letter
    const colLetter = (col) => {
      let temp, letter = '';
      while (col > 0) {
        temp = (col - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        col = (col - temp - 1) / 26;
      }
      return letter;
    };

    // --- Title row: merged, black background, yellow text
    ws.mergeCells(`${colLetter(firstCol)}${offsetRow}:${colLetter(lastCol)}${offsetRow}`);
    for (let c = firstCol; c <= lastCol; c++) {
      const cell = ws.getCell(offsetRow, c);
      cell.value = c === firstCol ? format(pickedDate, 'EEEE, d MMMM, yyyy') : '';
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
      cell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFC107' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top: { style: 'medium' }, bottom: { style: 'medium' }, left: { style: 'medium' }, right: { style: 'medium' } };
    }
    ws.getRow(offsetRow).height = 22;

    // --- Header row
    const headerRowIndex = offsetRow + 1;
    headers.forEach((h, idx) => {
      const cell = ws.getCell(headerRowIndex, firstCol + idx);
      cell.value = h;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
    });
    ws.getRow(headerRowIndex).height = 22;

    // --- Data rows
    const dataStartRow = headerRowIndex + 1;
    companyRows.forEach((r, i) => {
      const rowIndex = dataStartRow + i;
      ws.getRow(rowIndex).height = 22;
      headers.forEach((_, idx) => {
        const cell = ws.getCell(rowIndex, firstCol + idx);
        const val = idx === 0 ? r.country : idx === 1 ? r.city : idx === 2 ? r.company : r.total;
        cell.value = val;
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = { horizontal: idx === 3 ? 'center' : 'left', vertical: 'middle' };
        if (idx === 3 && typeof val === 'number') cell.numFmt = '#,##0';
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });

    // --- Totals row
    const lastDataRow = dataStartRow + companyRows.length - 1;
    const totalsRowIndex = lastDataRow + 1;
    const total = companyRows.reduce((sum, r) => sum + (r.total || 0), 0);
    for (let c = firstCol; c <= lastCol; c++) {
      const cell = ws.getCell(totalsRowIndex, c);
      if (c === firstCol) cell.value = 'Total';
      if (c === firstCol + 3) cell.value = total;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
      if (c === firstCol + 3 && typeof cell.value === 'number') cell.numFmt = '#,##0';
    }
    ws.getRow(totalsRowIndex).height = 22;

    // --- Thick outside border
    for (let r = offsetRow; r <= totalsRowIndex; r++) {
      for (let c = firstCol; c <= lastCol; c++) {
        const cell = ws.getCell(r, c);
        const border = { ...cell.border };
        if (r === offsetRow) border.top = { style: 'medium' };
        if (r === totalsRowIndex) border.bottom = { style: 'medium' };
        if (c === firstCol) border.left = { style: 'medium' };
        if (c === lastCol) border.right = { style: 'medium' };
        cell.border = border;
      }
    }

    // --- Spacer row & blank column
    const blankRow = ws.addRow([]);
    blankRow.height = 22;
    ws.getColumn(lastCol + 1).width = 4;

    // --- Freeze header & hide gridlines
    ws.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];

    // --- Autosize columns
    for (let c = firstCol; c <= lastCol; c++) {
      let maxLen = 0;
      for (let r = offsetRow; r <= totalsRowIndex; r++) {
        const val = ws.getCell(r, c).value;
        maxLen = Math.max(maxLen, val ? String(val).length : 0);
      }
      ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 6), 50);
    }

    // --- Export
    const buf = await wb.xlsx.writeBuffer();
    const safeDate = format(pickedDate, 'yyyyMMdd');
    saveAs(new Blob([buf]), `emea_companies_${safeDate}.xlsx`);
  };

