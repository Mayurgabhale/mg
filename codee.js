  // helper: convert 1-based column number to Excel letter (works for up to Z)
  const colLetter = (n) => String.fromCharCode(64 + n);
  /* ------------------ handleExport (Details) ------------------ */
  const handleExport = async () => {
    if (!pickedDate) return;

    try {
      const excelModule = await import('exceljs');
      const Excel = excelModule.default || excelModule;
      let wb;

      if (Excel && Excel.Workbook) wb = new Excel.Workbook();
      else if (typeof Excel === 'function') wb = new Excel();
      else throw new Error('ExcelJS Workbook constructor not found');

      const wsDetails = wb.addWorksheet('WU Employee');

      // layout offsets: skip one row and one column before/after data
      const offsetRow = 2; // leave row 1 blank, put title in row 2
      const offsetCol = 2; // leave column A blank, start data at column B

      // Headers
      const detailsHeaders = [
        'Sr.No', 'Date', 'Time',
        'Employee Name', 'Employee ID', 'Personal Type',
        'Door Name', 'Location'
      ];
      const firstCol = offsetCol;
      const lastCol = offsetCol + detailsHeaders.length - 1;

      // Title row (at offsetRow)
      const titleStart = colLetter(firstCol) + offsetRow;
      const titleEnd = colLetter(lastCol) + offsetRow;
      wsDetails.mergeCells(`${titleStart}:${titleEnd}`);
      const detailsTitle = wsDetails.getCell(offsetRow, firstCol);
      detailsTitle.value = `${format(pickedDate, 'EEEE, d MMMM, yyyy')}`;
      // Colour & font for title (black bg, yellow text)
      detailsTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
      detailsTitle.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFC107' } };
      detailsTitle.alignment = { horizontal: 'center', vertical: 'middle' };

      // Make title row height tighter (will be overridden to 22 below globally)
      wsDetails.getRow(offsetRow).height = 22;

      // Also apply same fill & border to each cell in merged range for consistent appearance
      for (let c = firstCol; c <= lastCol; c++) {
        const cell = wsDetails.getCell(offsetRow, c);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
        cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFC107' } };
        // thick outside border for top header (we'll set medium around the title row cells)
        cell.border = {
          top: { style: 'medium' },
          bottom: { style: 'medium' },
          left: { style: 'medium' },
          right: { style: 'medium' }
        };
      }

      // Header row index
      const headerRowIndex = offsetRow + 1; // e.g., 3
      const headerRow = wsDetails.getRow(headerRowIndex);
      headerRow.height = 22;

      // Insert header values at correct columns
      detailsHeaders.forEach((h, idx) => {
        const colIndex = firstCol + idx;
        const cell = wsDetails.getCell(headerRowIndex, colIndex);
        cell.value = h;
        // header style: yellow fill, bold, centered (except Door column data alignment)
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
        // medium border for header (thick)
        cell.border = {
          top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' }
        };
        // default header alignment center
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });

      // Data rows start at headerRowIndex + 1
      const dataStartRow = headerRowIndex + 1;
      (detailRows || []).forEach((r, i) => {
        const rowIndex = dataStartRow + i;
        const row = wsDetails.getRow(rowIndex);
        // set data row height to 22
        row.height = 22;

        const dateVal = (r.LocaleMessageTime?.slice(0, 10)) || (r.SwipeDate?.slice(0, 10)) || '';
        const timeVal = formatApiTime12(r.LocaleMessageTime) || '';
        const name = r.ObjectName1 || '';
        const empId = r.EmployeeID || '';
        const ptype = r.PersonnelType || '';
        const door = r.Door || r.ObjectName2 || '';
        const location = r.PartitionNameFriendly || '';

        const values = [i + 1, dateVal, timeVal, name, empId, ptype, door, location];

        values.forEach((val, idx) => {
          const colIndex = firstCol + idx;
          const cell = wsDetails.getCell(rowIndex, colIndex);
          cell.value = val;
          // default inner cell border thin
          cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
          };
          // font + vertical center
          cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF000000' } };
          // Door Name column (7th header) -> index 6 (0-based), column number = firstCol + 6
          const doorColIndex = firstCol + 6;
          if (colIndex === doorColIndex) {
            cell.alignment = { horizontal: 'left', vertical: 'middle' };
          } else {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          }
        });

        // optional alternating fill for readability (keeps gridlines hidden but visual rows)
        if (i % 2 === 1) {
          values.forEach((_, idx) => {
            const colIndex = firstCol + idx;
            const cell = wsDetails.getCell(rowIndex, colIndex);
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
          });
        }
      });

      // After data: add one empty row (skip one row after)
      const lastDataRow = (detailRows?.length ? dataStartRow + detailRows.length - 1 : headerRowIndex);
      const blankRow = wsDetails.addRow([]); // blank row after data
      blankRow.height = 22;

      // Hide gridlines and freeze panes so header stays visible
      wsDetails.views = [{ state: 'frozen', ySplit: headerRowIndex, showGridLines: false }];

      // Autosize columns for the used area (firstCol..lastCol)
      for (let c = firstCol; c <= lastCol; c++) {
        let maxLen = 0;
        for (let r = offsetRow; r <= lastDataRow; r++) {
          const cell = wsDetails.getCell(r, c);
          const v = cell.value === null || cell.value === undefined ? '' : String(cell.value);
          maxLen = Math.max(maxLen, v.length);
        }
        // add padding
        const width = Math.min(Math.max(maxLen + 2, 6), 50);
        wsDetails.getColumn(c).width = width;
      }

      // Ensure there's a blank column after the last column (skip one column after data)
      wsDetails.getColumn(lastCol + 1).width = 4;

      // Outer border: medium border around the occupied data area (header..lastDataRow, firstCol..lastCol)
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

      // Page setup similar to before
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
      // reuse same offset logic for summary sheet
      const sOffsetRow = 2;
      const sOffsetCol = 2;
      const sFirstCol = sOffsetCol;
      // Header cols: Country, City, Employee, Contractors, Total
      const sHeaders = ['Country', 'City', 'Employee', 'Contractors', 'Total'];
      const sLastCol = sFirstCol + sHeaders.length - 1;

      // Title at offsetRow (merged + coloured + thick border)
      ws.mergeCells(`${colLetter(sFirstCol)}${sOffsetRow}:${colLetter(sLastCol)}${sOffsetRow}`);
      const sDateCell = ws.getCell(sOffsetRow, sFirstCol);
      sDateCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
      sDateCell.alignment = { horizontal: 'center', vertical: 'middle' };
      // Colour & font for summary title (black bg, yellow text)
      for (let c = sFirstCol; c <= sLastCol; c++) {
        const cell = ws.getCell(sOffsetRow, c);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
        cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFC107' } };
        // thick border around title row
        cell.border = { top: { style: 'medium' }, bottom: { style: 'medium' }, left: { style: 'medium' }, right: { style: 'medium' } };
      }
      ws.getRow(sOffsetRow).height = 22;

      const sHeaderRowIndex = sOffsetRow + 1;
      // set header row height
      ws.getRow(sHeaderRowIndex).height = 22;

      // write header values
      sHeaders.forEach((h, idx) => {
        const c = sFirstCol + idx;
        const cell = ws.getCell(sHeaderRowIndex, c);
        cell.value = h;
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
        cell.font = { name: 'Calibri', size: 11, bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        // medium border for header
        cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
      });

      // Data rows start
      const sDataStartRow = sHeaderRowIndex + 1;
      partitionRows.forEach((r, i) => {
        const rowIndex = sDataStartRow + i;
        ws.getRow(rowIndex).height = 22; // set data row height to 22
        sHeaders.forEach((_, idx) => {
          const c = sFirstCol + idx;
          const cell = ws.getCell(rowIndex, c);
          const val = idx === 0 ? (r.country || '') : idx === 1 ? (r.city || '') : idx === 2 ? (r.employee || 0) : idx === 3 ? (r.contractor || 0) : (r.total || 0);
          cell.value = val;
          // numeric columns center + number format
          const isNumeric = idx >= 2;
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          if (isNumeric && typeof val === 'number') cell.numFmt = '#,##0';
          // thin border
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          cell.font = { name: 'Calibri', size: 10 };
        });
      });

      // totals row: add thick border + coloured background (dark gray with white text)
      const sLastDataRow = (partitionRows?.length ? sDataStartRow + partitionRows.length - 1 : sHeaderRowIndex);
      const totalsRowIndex = sLastDataRow + 1;
      const totalEmployees = (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0);
      const totalContractors = (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0);
      const totalTotals = (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0);

      const totalsFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
      const totalsFont = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };

      // write totals cells and style
      for (let c = sFirstCol; c <= sLastCol; c++) {
        const cell = ws.getCell(totalsRowIndex, c);
        if (c === sFirstCol) cell.value = 'Total';
        else if (c === sFirstCol + 2) cell.value = totalEmployees;
        else if (c === sFirstCol + 3) cell.value = totalContractors;
        else if (c === sFirstCol + 4) cell.value = totalTotals;
        cell.fill = totalsFill;
        cell.font = totalsFont;
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        // medium border around totals row
        cell.border = { top: { style: 'medium' }, left: { style: 'medium' }, bottom: { style: 'medium' }, right: { style: 'medium' } };
        if ((c === sFirstCol + 2 || c === sFirstCol + 3 || c === sFirstCol + 4) && typeof cell.value === 'number') {
          cell.numFmt = '#,##0';
        }
      }
      ws.getRow(totalsRowIndex).height = 22;

      // --- NEW: Ensure full outside medium border around WU Summary occupied area (title..totals)
      for (let r = sOffsetRow; r <= totalsRowIndex; r++) {
        for (let c = sFirstCol; c <= sLastCol; c++) {
          const cell = ws.getCell(r, c);
          const border = { ...cell.border };
          if (r === sOffsetRow) border.top = { style: 'medium' };
          if (r === totalsRowIndex) border.bottom = { style: 'medium' };
          if (c === sFirstCol) border.left = { style: 'medium' };
          if (c === sLastCol) border.right = { style: 'medium' };
          cell.border = border;
        }
      }

      // add one blank row & blank column after data
      const blank = ws.addRow([]);
      blank.height = 22;
      ws.getColumn(sLastCol + 1).width = 4;

      // hide gridlines & freeze
      ws.views = [{ state: 'frozen', ySplit: sHeaderRowIndex, showGridLines: false }];

      // autosize for summary sheet (sFirstCol..sLastCol)
      for (let c = sFirstCol; c <= sLastCol; c++) {
        let maxLen = 0;
        for (let r = sOffsetRow; r <= totalsRowIndex; r++) {
          const v = ws.getCell(r, c).value === undefined || ws.getCell(r, c).value === null ? '' : String(ws.getCell(r, c).value);
          maxLen = Math.max(maxLen, v.length);
        }
        ws.getColumn(c).width = Math.min(Math.max(maxLen + 2, 6), 40);
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

      // save file (filename logic preserved)
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

i want below handleExport same as above strcue , layout and color ok 
...............

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

      // Headers
      const detailsHeaders = [
        'Sr.No', 'Date', 'Time',
        'Employee Name', 'Employee ID', 'Personal Type',
        'Door Name', 'Location'
      ];

      // Title row
      wsDetails.mergeCells(`A1:${String.fromCharCode(64 + detailsHeaders.length)}1`);
      const detailsTitle = wsDetails.getCell('A1');
      detailsTitle.value = `${format(pickedDate, 'EEEE, d MMMM, yyyy')}`;
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

      // Header Row 1
      const r1 = ws.addRow(['Country', 'City', format(pickedDate, 'EEEE, d MMMM, yyyy'), null, null]);
      ws.mergeCells('C1:E1');
      const dateCell = ws.getCell('C1');
      dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
      dateCell.font = { bold: true, size: 16 };
      dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };


      r1.eachCell((cell, colNumber) => {
        if (colNumber <= 2) { // Bold Country and City
          cell.font = { bold: true, size: 15 };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        } else if (colNumber === 3) { // Date cell is merged C1:E1
          cell.font = { bold: true, size: 15 };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      // Header Row 2
      const r2 = ws.addRow(['', '', 'Employee', 'Contractors', 'Total']);
      r2.eachCell(cell => {
        cell.font = { bold: true, size: 15 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      // Data Rows
      (partitionRows || []).forEach(r => {
        const row = ws.addRow([r.country || '', r.city || '', r.employee || 0, r.contractor || 0, r.total || 0]);
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

      const totalsRow = ws.addRow(['Total', '', totalEmployees, totalContractors, totalTotals]);
      totalsRow.eachCell((cell) => {
        cell.font = { bold: true, size: 15, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF808080' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      // Auto-fit columns
      ws.columns.forEach(col => {
        let maxLen = 6;
        col.eachCell({ includeEmpty: true }, c => {
          const v = c.value ? String(c.value) : '';
          maxLen = Math.max(maxLen, v.length + 2);
        });
        col.width = Math.min(Math.max(maxLen, 10), 40);
      });

      // Freeze headers
      ws.views = [{ state: 'frozen', ySplit: 2 }];

      // Outer border for Summary
      const firstRow = 1;
      const lastRow = ws.lastRow.number;
      const firstCol = 1;
      const lastCol = 5;

      for (let r = firstRow; r <= lastRow; r++) {
        for (let c = firstCol; c <= lastCol; c++) {
          const cell = ws.getCell(r, c);
          const border = { ...cell.border };
          if (r === firstRow) border.top = { style: 'medium' };
          if (r === lastRow) border.bottom = { style: 'medium' };
          if (c === firstCol) border.left = { style: 'medium' };
          if (c === lastCol) border.right = { style: 'medium' };
          cell.border = border;
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

      // ---------- Save file ----------
      // const filename = `Western Union LACA Headcount Report -${format(pickedDate, 'd MMMM yyyy')}.xlsx`;
      // Determine city name for filename (like APAC logic)
      let cityName = '';
      if (selectedSummaryPartition) {
        const [, selCity] = selectedSummaryPartition.split('||');
        cityName = selCity || '';
      } else if (filterCode) {
        // fallback: get the first city from companyRows for that country
        const firstRow = companyRows.find(r => r.country === codeToCountry[filterCode]);
        cityName = firstRow?.city || '';
      }

      // Build dynamic filename
      const filename = cityName
        ? `Western Union LACA (${cityName}) Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`
        : `Western Union LACA Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;

      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), filename);

    } catch (err) {
      console.error('handleExport error:', err);
    }
  };
