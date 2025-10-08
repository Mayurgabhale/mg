// Apply outer border around the entire table
const firstRow = 1; // starts at header row
const lastRow = ws.lastRow.number; // last row = totals row
const firstCol = 1; // column A
const lastCol = 5;  // column E

for (let r = firstRow; r <= lastRow; r++) {
  for (let c = firstCol; c <= lastCol; c++) {
    const cell = ws.getCell(r, c);
    const border = { ...cell.border }; // keep existing thin borders

    if (r === firstRow) border.top = { style: 'medium' };
    if (r === lastRow) border.bottom = { style: 'medium' };
    if (c === firstCol) border.left = { style: 'medium' };
    if (c === lastCol) border.right = { style: 'medium' };

    cell.border = border;
  }
}