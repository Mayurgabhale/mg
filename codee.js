const handleExport = async () => {
  if (!pickedDate) return;

  try {
    const { default: ExcelJS } = await import('exceljs');
    const wb = new ExcelJS.Workbook();

    // ------------------ SHEET 1: WU Employee ------------------
    const wsEmp = wb.addWorksheet('WU Employee');

    const empHeaders = [
      "Sr.No", "Date", "Time", "Employee Name", "Employee ID",
      "Personal Type", "Door Name", "City", "Location"
    ];

    // Title row
    wsEmp.mergeCells(`A1:I1`);
    const titleCell = wsEmp.getCell('A1');
    titleCell.value = `Western Union - Employee Report (${format(pickedDate, "d MMMM yyyy")})`;
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.font = { bold: true, size: 14 };

    // Header row
    const hdrRow = wsEmp.addRow(empHeaders);
    hdrRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' }
      };
    });

    // Data rows
    (detailRows || []).forEach((r, i) => {
      const row = wsEmp.addRow([
        i + 1,
        r.LocaleMessageTime?.slice(0, 10) || r.SwipeDate?.slice(0, 10) || '',
        formatApiTime12(r.LocaleMessageTime) || '',
        r.ObjectName1 || '',
        r.EmployeeID || '',
        r.PersonnelType || '',
        r.Door || r.ObjectName2 || '',
        r.City || r.PartitionName1 || '',
        r.PartitionName2 || r.PrimaryLocation || ''
      ]);

      row.eachCell(cell => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
      });
    });

    wsEmp.columns.forEach(col => col.width = 18);

    wsEmp.views = [{ state: 'frozen', ySplit: 2 }];

    // ------------------ SHEET 2: WU Summary ------------------
    const wsSum = wb.addWorksheet('WU Summary');

    const sumHeaders = ["Country", "City", "Employee", "Contractors", "Total"];

    // Title row
    wsSum.mergeCells(`A1:E1`);
    const titleCell2 = wsSum.getCell('A1');
    titleCell2.value = `Western Union - Summary Report (${format(pickedDate, "d MMMM yyyy")})`;
    titleCell2.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell2.font = { bold: true, size: 14 };

    // Header row
    const hdrRow2 = wsSum.addRow(sumHeaders);
    hdrRow2.eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' }
      };
    });

    // Data rows
    (partitionRows || []).forEach(r => {
      const row = wsSum.addRow([
        r.country || '',
        r.city || '',
        r.employee || 0,
        r.contractor || 0,
        r.total || 0
      ]);

      row.eachCell((cell, colNumber) => {
        cell.alignment = { horizontal: colNumber >= 3 ? 'center' : 'left', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
        if (colNumber === 5) cell.font = { bold: true };
      });
    });

    wsSum.columns.forEach(col => col.width = 18);

    // ------------------ SAVE FILE ------------------
    const cityName = backendFilterKey
      ? Object.keys(apacPartitionDisplay).find(
          code => apacForwardKey[code] === backendFilterKey || code === backendFilterKey
        )
      : '';
    const city = cityName ? apacPartitionDisplay[cityName]?.city || backendFilterKey : '';

    const filename = city
      ? `Western Union APAC (${city}) Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`
      : `Western Union APAC Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), filename);

  } catch (err) {
    console.error('handleExport ExcelJS error:', err);
  }
};