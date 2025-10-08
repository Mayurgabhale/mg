const handleExport = async () => {
  if (!pickedDate) return;

  try {
    const excelModule = await import('exceljs');
    const Excel = excelModule.default || excelModule;
    const wb = new Excel.Workbook();

    // ---------- SHEET 1: Details ----------
    const wsDetails = wb.addWorksheet('Details');

    const cols = [
      { header: 'Sr', key: 'sr', width: 4 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Time', key: 'time', width: 15 },
      { header: 'EmployeeID', key: 'employee', width: 15 },
      { header: 'CardNumber', key: 'card', width: 14 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'PersonnelType', key: 'type', width: 14 },
      { header: 'CompanyName', key: 'company', width: 30 },
      { header: 'PrimaryLocation', key: 'location', width: 30 },
      { header: 'Door', key: 'door', width: 40 },
      { header: 'Partition', key: 'partition', width: 18 },
    ];
    wsDetails.columns = cols;

    // Title row
    const lastColLetter = String.fromCharCode('A'.charCodeAt(0) + cols.length - 1);
    wsDetails.mergeCells(`A1:${lastColLetter}1`);
    const titleCell = wsDetails.getCell('A1');
    titleCell.value = `${format(pickedDate, 'EEEE, d MMMM, yyyy')} — Details`;
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.font = { name: 'Calibri', size: 14, bold: true };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };

    wsDetails.addRow([]); // Spacer

    // Header row
    const headerRow = wsDetails.addRow(cols.map(c => c.header));
    headerRow.eachCell(cell => {
      cell.font = { bold: true, size: 12 };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
      };
    });

    // Data rows
    (detailRows || []).forEach((r, i) => {
      const row = wsDetails.addRow([
        i + 1,
        getIsoDate(r),
        formatApiTime12(r.LocaleMessageTime),
        r.EmployeeID ?? '',
        r.CardNumber ?? '',
        r.ObjectName1 ?? '',
        r.PersonnelType ?? '',
        r.CompanyNameComputed || r.CompanyName || '',
        r.PrimaryLocation ?? '',
        r.Door ?? '',
        partitionToDisplay[r.PartitionName2]?.city || r.PartitionName2 || ''
      ]);

      row.eachCell((cell, colNumber) => {
        cell.font = { name: 'Calibri', size: 11 };
        cell.alignment = { horizontal: colNumber >= 4 && colNumber <= 5 ? 'right' : 'left', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        };
      });

      if (i % 2 === 1) row.eachCell(cell => { cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } }; });
    });

    // Totals row
    const totalRow = wsDetails.addRow(['', '', '', '', '', '', '', '', '', 'Total', (detailRows || []).length]);
    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true, size: 12 };
      cell.alignment = { horizontal: colNumber === 11 ? 'right' : 'center', vertical: 'middle', wrapText: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
      };
    });

    wsDetails.views = [{ state: 'frozen', ySplit: 3 }];

    // ---------- SHEET 2: WU Summary ----------
    const wsSummary = wb.addWorksheet('WU Summary');
    wsSummary.spliceRows(1, 0, [], []);
    wsSummary.spliceColumns(1, 0, [], []);

    const r1 = wsSummary.addRow([null, null, 'Country', 'City', format(pickedDate, 'EEEE, d MMMM, yyyy'), null, null]);
    wsSummary.mergeCells('E3:G3');
    const dateCell = wsSummary.getCell('E3');
    dateCell.font = { bold: true, size: 14 };
    dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
    dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };

    // Header row
    const r2 = wsSummary.addRow([null, null, '', '', 'Employee', 'Contractors', 'Total']);
    r2.eachCell((cell, colNumber) => {
      if (colNumber >= 5) {
        cell.font = { bold: true, size: 15 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      }
    });

    (partitionRows || []).forEach(r => {
      const row = wsSummary.addRow([null, null, r.country || '', r.city || '', r.employee || 0, r.contractor || 0, r.total || 0]);
      row.eachCell((cell, colNumber) => {
        if (colNumber >= 3) {
          cell.alignment = { horizontal: colNumber >= 5 ? 'center' : 'left', vertical: 'middle', wrapText: true };
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        }
      });
    });

    // Totals row
    const totalEmployees = (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0);
    const totalContractors = (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0);
    const totalTotals = (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0);
    const totalsRow = wsSummary.addRow([null, null, 'Total', '', totalEmployees, totalContractors, totalTotals]);
    totalsRow.eachCell((cell, colNumber) => {
      if (colNumber >= 3) {
        cell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF808080' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      }
    });

    wsSummary.columns.forEach((col, idx) => {
      if (idx <= 2) { col.width = 2; return; }
      let maxLen = 10;
      col.eachCell({ includeEmpty: true }, c => {
        const v = c.value ? String(c.value) : '';
        maxLen = Math.max(maxLen, v.length + 2);
      });
      col.width = Math.min(Math.max(maxLen, 12), 40);
    });

    wsSummary.views = [{ state: 'frozen', ySplit: 4, xSplit: 2 }];

    // Save workbook
    const filename = `Western Union APAC Headcount Report - ${format(pickedDate, 'yyyyMMdd')}.xlsx`;
    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), filename);

  } catch (err) {
    console.error('handleExport error:', err);
  }
};