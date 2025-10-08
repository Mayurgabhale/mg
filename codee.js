// ---------- SHEET 2: Summary ----------
const ws = wb.addWorksheet('Summary');

// Add a blank column at start for centering
ws.addRow([]);

// Row 1: Country | City | merged date
const titleRowVals = ['Country', 'City', format(pickedDate, 'EEEE, d MMMM, yyyy'), null, null];
const r1 = ws.addRow(titleRowVals);
ws.mergeCells('C2:E2'); // because of the blank col A, shift down 1
const titleCell = ws.getCell('C2');
titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
titleCell.font = { name: 'Calibri', size: 13, bold: true };
titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } }; // light blue

// Row 2: Subheaders
const subHeaderRow = ws.addRow(['', '', 'Employee', 'Contractors', 'Total']);
subHeaderRow.eachCell((cell, idx) => {
  cell.font = { bold: true, name: 'Calibri', size: 11 };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } }; // light yellow
  cell.border = {
    top: { style: 'thin' }, left: { style: 'thin' },
    bottom: { style: 'thin' }, right: { style: 'thin' }
  };
});

// Data rows
(partitionRows || []).forEach((r, i) => {
  const rowVals = [
    r.country || '',
    r.city || '',
    r.employee || 0,
    r.contractor || 0,
    r.total || 0
  ];
  const row = ws.addRow(rowVals);

  row.eachCell((cell, colNumber) => {
    cell.alignment = { vertical: 'middle', horizontal: (colNumber >= 3) ? 'center' : 'left' };
    cell.font = { name: 'Calibri', size: 11 };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF999999' } },
      left: { style: 'thin', color: { argb: 'FF999999' } },
      bottom: { style: 'thin', color: { argb: 'FF999999' } },
      right: { style: 'thin', color: { argb: 'FF999999' } },
    };
  });

  // Zebra fill
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
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF444444' } }; // dark gray
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  cell.border = {
    top: { style: 'thin', color: { argb: 'FF000000' } },
    left: { style: 'thin', color: { argb: 'FF000000' } },
    bottom: { style: 'thin', color: { argb: 'FF000000' } },
    right: { style: 'thin', color: { argb: 'FF000000' } },
  };
  if (colNumber >= 3) cell.numFmt = '#,##0';
});

// Auto-fit columns
ws.columns.forEach(col => {
  let maxLen = 6;
  col.eachCell({ includeEmpty: true }, c => {
    const v = c.value === null || c.value === undefined ? '' : String(c.value);
    maxLen = Math.max(maxLen, v.trim().length + 2);
  });
  col.width = Math.min(Math.max(maxLen, 10), 40);
});

// Freeze top 2 rows
ws.views = [{ state: 'frozen', ySplit: 2 }];