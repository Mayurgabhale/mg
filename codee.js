// ---- Outer Border for WU Summary sheet ----
const sDetailsLastRow = totalsRow; // includes totals row
for (let r = sOffsetRow; r <= sDetailsLastRow; r++) {
  for (let c = sFirstCol; c <= sLastCol; c++) {
    const cell = ws.getCell(r, c);
    const border = {};
    if (r === sOffsetRow) border.top = { style: 'medium' };
    if (r === sDetailsLastRow) border.bottom = { style: 'medium' };
    if (c === sFirstCol) border.left = { style: 'medium' };
    if (c === sLastCol) border.right = { style: 'medium' };
    cell.border = { ...cell.border, ...border };
  }
}