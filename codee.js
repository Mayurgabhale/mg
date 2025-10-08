// Header Row 1
const r1 = ws.addRow(['Country', 'City', format(pickedDate, 'EEEE, d MMMM, yyyy'), null, null]);
ws.mergeCells('C1:E1');

// Apply styles
r1.eachCell((cell, colNumber) => {
  if (colNumber <= 2) { // Bold Country and City
    cell.font = { bold: true };
  } else if (colNumber === 3) { // Date cell is merged C1:E1
    cell.font = { bold: true, size: 12 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
  }
  cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
});