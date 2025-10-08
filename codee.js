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