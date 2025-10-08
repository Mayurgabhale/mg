// ---------- SHEET 1: WU Employee ----------
const wsDetails = wb.addWorksheet('WU Employee');

// Headers
const detailsHeaders = [
  'Sr.No', 'Date', 'Time',
  'Employee Name', 'Employee ID', 'Personal Type',
  'Door Name', 'Location'
];

// Leave 2 rows empty at top
wsDetails.addRow([]);
wsDetails.addRow([]);

// Title row (row 3, starting at col B)
const startCol = 2; // column B
const endCol = startCol + detailsHeaders.length - 1;
wsDetails.mergeCells(3, startCol, 3, endCol); // merge B3..I3
const detailsTitle = wsDetails.getCell(3, startCol);
detailsTitle.value = `WU Employee — ${format(pickedDate, 'EEEE, d MMMM, yyyy')}`;
detailsTitle.alignment = { horizontal: 'center', vertical: 'middle' };
detailsTitle.font = { name: 'Calibri', size: 14, bold: true };

// Header row (row 4, starting at col B)
const hdrRow = wsDetails.addRow(['', ...detailsHeaders]); // empty col A
hdrRow.eachCell((cell, colNumber) => {
  if (colNumber === 1) return; // skip the empty col A
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC107' } };
  cell.font = { bold: true, color: { argb: 'FF000000' } };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
});

// Data rows (shifted to start at column B)
(detailRows || []).forEach((r, i) => {
  const dateVal = (r.LocaleMessageTime?.slice(0, 10)) || (r.SwipeDate?.slice(0, 10)) || '';
  const timeVal = formatApiTime12(r.LocaleMessageTime) || '';
  const name = r.ObjectName1 || '';
  const empId = r.EmployeeID || '';
  const ptype = r.PersonnelType || '';
  const door = r.Door || r.ObjectName2 || '';
  const location = r.PartitionName2 || r.PrimaryLocation || '';

  const row = wsDetails.addRow([
    '', // col A stays empty
    i + 1, dateVal, timeVal, name, empId, ptype, door, location
  ]);

  row.eachCell((cell, colNumber) => {
    if (colNumber === 1) return; // skip formatting for col A
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    cell.font = { name: 'Calibri', size: 11 };
    cell.alignment = colNumber === 2 ? { horizontal: 'center', vertical: 'middle' } : { horizontal: 'left', vertical: 'middle' };
  });

  if (i % 2 === 1) {
    row.eachCell((cell, colNumber) => {
      if (colNumber !== 1) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F7F7' } };
      }
    });
  }
});






// ---------- SHEET 2: WU Summary ----------
const ws = wb.addWorksheet('WU Summary');

// Leave 2 rows empty at top
ws.addRow([]);
ws.addRow([]);

// Header Row 1 (row 3, shifted right by 1 col → starts at B)
const r1 = ws.addRow([
  '', // keep column A empty
  'Country',
  'City',
  format(pickedDate, 'EEEE, d MMMM, yyyy'),
  null
]);

// Merge date across D3:E3 (because we started at col B)
ws.mergeCells('D3:E3');
const dateCell = ws.getCell('D3');
dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
dateCell.font = { bold: true, size: 16 };
dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };

// Style for row 3
r1.eachCell((cell, colNumber) => {
  if (colNumber === 1) return; // skip empty col A
  if (colNumber <= 3) {
    cell.font = { bold: true, size: 15 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
  } else if (colNumber === 4) {
    cell.font = { bold: true, size: 15 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
  }
  cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
});

// Header Row 2 (row 4)
const r2 = ws.addRow(['', '', 'Employee', 'Contractors', 'Total']);
r2.eachCell((cell, colNumber) => {
  if (colNumber === 1) return;
  cell.font = { bold: true, size: 15 };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
  cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
});

// Data Rows (row 5+)
(partitionRows || []).forEach(r => {
  const row = ws.addRow([
    '', // empty col A
    r.country || '',
    r.city || '',
    r.employee || 0,
    r.contractor || 0,
    r.total || 0
  ]);

  row.eachCell((cell, colNumber) => {
    if (colNumber === 1) return;
    cell.alignment = { vertical: 'middle', horizontal: colNumber >= 4 ? 'center' : 'left' };
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    if (colNumber === 6) {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
      cell.font = { bold: true, size: 15 };
    }
  });
});

// Totals Row
const totalEmployees = (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0);
const totalContractors = (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0);
const totalTotals = (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0);

const totalsRow = ws.addRow(['', 'Total', '', totalEmployees, totalContractors, totalTotals]);
totalsRow.eachCell(cell => {
  if (cell.col === 1) return;
  cell.font = { bold: true, size: 15, color: { argb: 'FFFFFFFF' } };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF808080' } };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
});

// Auto-fit
ws.columns.forEach(col => {
  let maxLen = 6;
  col.eachCell({ includeEmpty: true }, c => {
    const v = c.value ? String(c.value) : '';
    maxLen = Math.max(maxLen, v.length + 2);
  });
  col.width = Math.min(Math.max(maxLen, 10), 40);
});

// Freeze top 4 rows (2 empty + 2 header rows)
ws.views = [{ state: 'frozen', ySplit: 4 }];