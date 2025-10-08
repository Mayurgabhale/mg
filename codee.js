Sr.No	Date	Time	Employee Name	Employee ID	Personal Type	Door Name	Location

sr.No or date  time gatting more space, i want to each column gatting auto space, depenidng on data, 
  sr,no is onl 11111 more like that but door name are big so adjust auto fill spca, ok ,
 because sheet is expande very big ok, thats way ok 
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

      // Header Row 1
      const r1 = ws.addRow(['Country', 'City', format(pickedDate, 'EEEE, d MMMM, yyyy'), null, null]);
      ws.mergeCells('C1:E1');
      const dateCell = ws.getCell('C1');
      dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
      dateCell.font = { bold: true, size: 12 };
      dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };

      // Apply border to header row 1 cells
      r1.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
      });

      // Header Row 2
      const r2 = ws.addRow(['', '', 'Employee', 'Contractors', 'Total']);
      r2.eachCell(cell => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
      });

      // Data Rows
      (partitionRows || []).forEach(r => {
        const row = ws.addRow([
          r.country || '',
          r.city || '',
          r.employee || 0,
          r.contractor || 0,
          r.total || 0
        ]);

        row.eachCell((cell, colNumber) => {
          cell.alignment = { vertical: 'middle', horizontal: (colNumber >= 3 ? 'center' : 'left') };
          cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' },
            bottom: { style: 'thin' }, right: { style: 'thin' }
          };
          if (colNumber === 5) {
            // Highlight TOTAL column
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } }; // Yellow
            cell.font = { bold: true };
          }
        });
      });

      // Totals Row
      const totalEmployees = (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0);
      const totalContractors = (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0);
      const totalTotals = (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0);

      const totalsRow = ws.addRow(['Total', '', totalEmployees, totalContractors, totalTotals]);
      totalsRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF808080' } }; // Dark gray
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
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

      // Freeze header rows
      ws.views = [{ state: 'frozen', ySplit: 2 }];

      // Page setup for printing
      ws.pageSetup = {
        orientation: 'landscape',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        horizontalCentered: true,
        verticalCentered: false,
        margins: {
          left: 0.5, right: 0.5,
          top: 0.75, bottom: 0.75,
          header: 0.3, footer: 0.3
        }
      };

      // Save file
      const filename = `laca_export_${format(pickedDate, 'yyyyMMdd')}.xlsx`;
      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), filename);

    } catch (err) {
      console.error('handleExport error:', err);
    }
  };
