Country	City	Monday, 6 October, 2025		
		Employee	Contractors	Total
Costa Rica	Costa Rica	447	57	504
Argentina	Cordoba	210	48	258
Brazil	Sao Paulo	47	12	59
Mexico	Mexico City	31	5	36
Panama	Panama City	24	3	27
Peru	Lima	48	8	56
Total		807	133	940

this sheet i want in center,
  and perfect layout, border and colors to fille differnt, country and city, wiht 

 | Country	City	 |_______________ Monday, 6 October, 2025		
 |	               |Employee	Contractors	Total
 
==============


    const handleExport = async () => {
  if (!pickedDate) return;
  try {
    const excelModule = await import('exceljs');
    const Excel = excelModule.default || excelModule;

    let wb;
    if (Excel && Excel.Workbook) wb = new Excel.Workbook();
    else if (typeof Excel === 'function') wb = new Excel();
    else throw new Error('ExcelJS Workbook constructor not found');

    // ---------- SHEET 1: Details ----------
    const wsDetails = wb.addWorksheet('Details');

    // Headers exactly as requested
    const detailsHeaders = [
      'Sr.No', 'Date', 'Time',
      'Employee Name', 'Employee ID', 'Personal Type',
      'Door Name', 'Location'
    ];

    // Title row (merged across all detail columns)
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
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' }
      };
    });

    // Data rows (use detailRows from your component)
    // Ensure you use the same date/time mapping that you already use (formatApiTime12)
    (detailRows || []).forEach((r, i) => {
      const dateVal = (r.LocaleMessageTime && r.LocaleMessageTime.slice(0, 10))
        || (r.SwipeDate && r.SwipeDate.slice(0, 10)) || '';
      const timeVal = formatApiTime12(r.LocaleMessageTime) || '';
      const name = r.ObjectName1 || '';
      const empId = r.EmployeeID || '';
      const ptype = r.PersonnelType || '';
      const door = r.Door || r.ObjectName2 || '';
      // Use PartitionName2 as location (adjust to PrimaryLocation if you prefer)
      const location = r.PartitionName2 || r.PrimaryLocation || '';

      const row = wsDetails.addRow([
        i + 1,
        dateVal,
        timeVal,
        name,
        empId,
        ptype,
        door,
        location
      ]);

      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
        cell.font = { name: 'Calibri', size: 11 };
        cell.alignment = (colNumber === 1)
          ? { horizontal: 'center', vertical: 'middle' }
          : { horizontal: 'left', vertical: 'middle' };
      });

      if (i % 2 === 1) {
        row.eachCell(cell => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
        });
      }
    });

    // Auto-fit-ish columns for details
    wsDetails.columns.forEach(col => {
      let maxLen = 2;
      col.eachCell({ includeEmpty: true }, c => {
        const v = c.value === null || c.value === undefined ? '' : String(c.value);
        maxLen = Math.max(maxLen, v.trim().length + 2);
      });
      col.width = Math.min(Math.max(maxLen, 8), 60);
    });
    wsDetails.views = [{ state: 'frozen', ySplit: 2 }];

    // ---------- SHEET 2: Summary ----------
    const ws = wb.addWorksheet('Summary');

    // We'll create a layout:
    // Row 1: Country | City | [merged date across next 3 cols]
    // Row 2: ''      ''     Employee | Contractors | Total
    // Row 3+: data rows

    const headersCount = 5; // Country, City, Employee, Contractors, Total
    // Row 1 - place date in columns C..E merged
    const titleRowVals = ['Country', 'City', format(pickedDate, 'EEEE, d MMMM, yyyy'), null, null];
    ws.addRow(titleRowVals);
    // Merge C1:E1
    ws.mergeCells('C1:E1');
    const titleCell = ws.getCell('C1');
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.font = { name: 'Calibri', size: 13, bold: true };

    // Row 2 - subheaders
    const subHeaderRow = ws.addRow(['', '', 'Employee', 'Contractors', 'Total']);
    // Style Country & City header cells (we keep them blank on row 2, but style headers at row3 if you prefer)
    subHeaderRow.eachCell((cell, idx) => {
      if (idx >= 3) {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC107' } };
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
      } else {
        // small styling for the blank cells (Country/City column)
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }
    });

    // Data rows from partitionRows (your computed partitionRows)
    (partitionRows || []).forEach((r, i) => {
      // Make sure i+3 -> but addRow will append automatically
      const rowVals = [
        r.country || '',
        r.city || '',
        r.employee || 0,
        r.contractor || 0,
        r.total || 0
      ];
      const row = ws.addRow(rowVals);
      row.eachCell((cell, colNumber) => {
        // right-align numbers (cols 3..5)
        cell.alignment = { vertical: 'middle', horizontal: (colNumber >= 3) ? 'right' : 'left' };
        cell.font = { name: 'Calibri', size: 11 };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        };
      });

      if (i % 2 === 1) {
        row.eachCell(cell => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
        });
      }
    });

    // Totals row
    const totalEmployees = (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0);
    const totalContractors = (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0);
    const totalTotals = (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0);

    const totalsRow = ws.addRow(['Total', '', totalEmployees, totalContractors, totalTotals]);
    totalsRow.eachCell((cell, colNumber) => {
      cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF666666' } };
      cell.alignment = { horizontal: (colNumber >= 3) ? 'right' : 'left', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } },
      };
      if (colNumber >= 3) cell.numFmt = '#,##0';
    });

    // Auto-fit-ish columns for summary
    ws.columns.forEach(col => {
      let maxLen = 6;
      col.eachCell({ includeEmpty: true }, c => {
        const v = c.value === null || c.value === undefined ? '' : String(c.value);
        maxLen = Math.max(maxLen, v.trim().length + 2);
      });
      col.width = Math.min(Math.max(maxLen, 8), 50);
    });
    // Freeze header rows (freeze after row 2)
    ws.views = [{ state: 'frozen', ySplit: 2 }];

    // Save file
    const filename = `laca_export_${format(pickedDate, 'yyyyMMdd')}.xlsx`;
    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), filename);

  } catch (err) {
    console.error('handleExport error:', err);
  }
};
