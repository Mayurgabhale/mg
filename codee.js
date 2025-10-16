this is my old cocd in this disply but new code not diplsy '
  const companyRows = useMemo(() => {
    if (!data || !pickedDate) return [];

    const ds = format(pickedDate, 'yyyy-MM-dd');

    // filter details for this date and our partitions
    const filtered = data.details.filter(r =>
      r.LocaleMessageTime && r.LocaleMessageTime.slice(0, 10) === ds &&
      filteredPartitionKeys.includes(r.PartitionName2)
    );

    // Apply personnel header filter and optional summary-partition filter before aggregating
    const afterPersonnel = filtered.filter(r => {
      // selectedSummaryPartition (partition-specific) filter
      if (selectedSummaryPartition) {
        const [selCountry, selCity] = selectedSummaryPartition.split('||');
        const rowCity = partitionToDisplay[r.PartitionName2]?.city || r.PartitionName2 || '';
        const rowCountry = partitionToDisplay[r.PartitionName2]?.country || 'Unknown';
        if (rowCity !== selCity || rowCountry !== selCountry) return false;
      }

      // personnel filter
      if (selectedPersonnel) {
        const pt = String(r.PersonnelType || '').toLowerCase();
        if (selectedPersonnel === 'Employee') {
          if (!(pt.includes('employee') || pt.includes('staff') || pt === 'employee')) return false;
        } else if (selectedPersonnel === 'Contractor') {
          if (!(pt.includes('contractor') || pt.includes('vendor') || pt.includes('subcontract') || pt.includes('cont'))) return false;
        }
      }
      return true;
    });

    const map = new Map();
    afterPersonnel.forEach(r => {
      const city = partitionToDisplay[r.PartitionName2]?.city || (r.PartitionName2 || 'Unknown');
      const country = partitionToDisplay[r.PartitionName2]?.country || 'Unknown';
      const company = getCanonicalCompany(r);
      const key = `${country}||${city}||${company}`;
      const existing = map.get(key);
      if (existing) existing.total += 1;
      else map.set(key, { country, city, company, total: 1 });
    });

    return Array.from(map.values()).sort((a, b) => {
      if (a.country !== b.country) return a.country.localeCompare(b.country);
      if (a.city !== b.city) return a.city.localeCompare(b.city);
      return a.company.localeCompare(b.company);
    });
  }, [data, pickedDate, filteredPartitionKeys, selectedPersonnel, selectedSummaryPartition]);




  // --- Excel export for company summary (EMEA) ---
  const handleExportCompanies = async () => {
    if (!pickedDate || !companyRows.length) return;

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Company Summary');

    // set up columns
    ws.columns = [
      { header: 'Country', key: 'country', width: 20 },
      { header: 'City', key: 'city', width: 25 },
      { header: 'Company', key: 'company', width: 40 },
      { header: 'Total', key: 'total', width: 12 },
    ];

    // merge top row for date
    ws.mergeCells('A1:D1');
    const dateCell = ws.getCell('A1');
    dateCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
    dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
    dateCell.font = { name: 'Calibri', size: 14, bold: true };

    // blank spacer
    ws.addRow([]);

    // header row
    const headerRow = ws.addRow(['Country', 'City', 'Company', 'Total']);
    headerRow.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
      cell.font = { bold: true, color: { argb: 'FF000000' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // data rows
    companyRows.forEach(r => {
      const row = ws.addRow([r.country, r.city, r.company, r.total]);
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (colNumber === 4) {
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
          cell.numFmt = '#,##0';
        } else {
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
        }
      });
    });

    // totals row
    const total = companyRows.reduce((s, r) => s + r.total, 0);
    const totalRow = ws.addRow(['Total', '', '', total]);
    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      if (colNumber === 4) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.numFmt = '#,##0';
      } else {
        cell.alignment = { horizontal: colNumber === 1 ? 'left' : 'center', vertical: 'middle' };
      }
    });

    // save
    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `emea_companies_${format(pickedDate, "yyyyMMdd")}.xlsx`);
  };


  const handleExportSummary = async () => {
    if (!pickedDate) return;

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Summary');

    // Row 1: merged date centered 
    ws.mergeCells('A1:E1');
    const dateCell = ws.getCell('A1');
    dateCell.value = format(pickedDate, 'EEEE, d MMMM, yyyy');
    dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
    dateCell.font = { name: 'Calibri', size: 14, bold: true };

    // Row 3: header row
    const headerRow = ws.addRow(['Country', 'City', 'Employees', 'Contractors', 'Total']);
    headerRow.height = 20;

    // style helpers
    const thinBorder = { style: 'thin', color: { argb: 'FF000000' } };
    const allThinBorder = { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder };

    // header style: yellow fill, bold, centered
    headerRow.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
      cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF000000' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = allThinBorder;
    });

    // Data rows start after the spacer
    partitionRows.forEach(r => {
      const row = ws.addRow([r.country, r.city, r.employee, r.contractor, r.total]);
      row.eachCell((cell, colNumber) => {
        cell.border = allThinBorder;
        if (colNumber >= 3) {
          // numeric columns: right align, number format
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
          if (cell.value !== null && cell.value !== undefined && cell.value !== '') {
            cell.numFmt = '#,##0';
          }
        } else {
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
        }
        cell.font = { name: 'Calibri', size: 11, color: { argb: 'FF000000' } };
      });
    });

    // Final total row
    const totalEmployees = partitionRows.reduce((s, r) => s + r.employee, 0);
    const totalContractors = partitionRows.reduce((s, r) => s + r.contractor, 0);
    const totalTotal = partitionRows.reduce((s, r) => s + r.total, 0);
    const totalRow = ws.addRow(['Total', '', totalEmployees, totalContractors, totalTotal]);

    totalRow.eachCell((cell, colNumber) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } }; // light gray
      cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF000000' } };
      cell.border = allThinBorder;
      if (colNumber >= 3) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.numFmt = '#,##0';
      } else {
        cell.alignment = { horizontal: colNumber === 1 ? 'left' : 'center', vertical: 'middle' };
      }
    });

    // Freeze panes so header is visible (freeze above data rows: after the header + spacer rows)
    ws.views = [{ state: 'frozen', ySplit: 2 }];

    // Autosize columns (reasonable limits)
    ws.columns.forEach(col => {
      let maxLen = 10;
      col.eachCell({ includeEmpty: true }, c => {
        const v = c.value === null || c.value === undefined ? '' : String(c.value);
        maxLen = Math.max(maxLen, v.trim().length + 2);
      });
      col.width = Math.min(Math.max(maxLen, 8), 40);
    });

    // export
    const buf = await wb.xlsx.writeBuffer();
    const safeDate = format(pickedDate, 'yyyyMMdd');
    const filename = `emea_summary_${safeDate}.xlsx`;
    saveAs(new Blob([buf]), filename);
  };


new code
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
  }


  const companyRows = useMemo(() => {
    if (!data || !pickedDate) return [];

    const ds = format(pickedDate, 'yyyy-MM-dd');

    // filter details for this date and our partitions
    const filtered = data.details.filter(r =>
      r.LocaleMessageTime && r.LocaleMessageTime.slice(0, 10) === ds &&
      filteredPartitionKeys.includes(r.PartitionName2)
    );

    // Apply personnel header filter and optional summary-partition filter before aggregating
    const afterPersonnel = filtered.filter(r => {
      // selectedSummaryPartition (partition-specific) filter
      if (selectedSummaryPartition) {
        const [selCountry, selCity] = selectedSummaryPartition.split('||');
        const rowCity = partitionToDisplay[r.PartitionName2]?.city || r.PartitionName2 || '';
        const rowCountry = partitionToDisplay[r.PartitionName2]?.country || 'Unknown';
        if (rowCity !== selCity || rowCountry !== selCountry) return false;
      }

      // personnel filter
      if (selectedPersonnel) {
        const pt = String(r.PersonnelType || '').toLowerCase();
        if (selectedPersonnel === 'Employee') {
          if (!(pt.includes('employee') || pt.includes('staff') || pt === 'employee')) return false;
        } else if (selectedPersonnel === 'Contractor') {
          if (!(pt.includes('contractor') || pt.includes('vendor') || pt.includes('subcontract') || pt.includes('cont'))) return false;
        }
      }
      return true;
    });

    const map = new Map();
    afterPersonnel.forEach(r => {
      const city = partitionToDisplay[r.PartitionName2]?.city || (r.PartitionName2 || 'Unknown');
      const country = partitionToDisplay[r.PartitionName2]?.country || 'Unknown';
      const company = getCanonicalCompany(r);
      const key = `${country}||${city}||${company}`;
      const existing = map.get(key);
      if (existing) existing.total += 1;
      else map.set(key, { country, city, company, total: 1 });
    });

    return Array.from(map.values()).sort((a, b) => {
      if (a.country !== b.country) return a.country.localeCompare(b.country);
      if (a.city !== b.city) return a.city.localeCompare(b.city);
      return a.company.localeCompare(b.company);
    });
  }, [data, pickedDate, filteredPartitionKeys, selectedPersonnel, selectedSummaryPartition]);


  const colLetter = (n) => String.fromCharCode(64 + n);
