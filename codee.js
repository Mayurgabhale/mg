
      // ---------- SHEET 2: WU Summary ----------
      const ws = wb.addWorksheet('WU Summary');

      // Header Row 1
      const r1 = ws.addRow(['Country', 'City', format(pickedDate, 'EEEE, d MMMM, yyyy'), null, null]);
      ws.mergeCells('C1:E1');
      const dateCell = ws.getCell('C1');
      dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
      dateCell.font = { bold: true, size: 12 };
      dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };

     
      r1.eachCell((cell, colNumber) => {
        if (colNumber <= 2) { // Bold Country and City
          cell.font = { bold: true , size: 12};
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        } else if (colNumber === 3) { // Date cell is merged C1:E1
          cell.font = { bold: true, size: 12 };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      // Header Row 2
      const r2 = ws.addRow(['', '', 'Employee', 'Contractors', 'Total']);
      r2.eachCell(cell => {
        cell.font = { bold: true , size: 12};
        cell.alignment = { horizontal: 'center', vertical: 'middle' };  
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      // Data Rows
      (partitionRows || []).forEach(r => {
        const row = ws.addRow([r.country || '', r.city || '', r.employee || 0, r.contractor || 0, r.total || 0]);
        row.eachCell((cell, colNumber) => {
          cell.alignment = { vertical: 'middle', horizontal: colNumber >= 3 ? 'center' : 'left' };
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          if (colNumber === 5) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
            cell.font = { bold: true, size: 12 };
          }
        });
      });

      // Totals Row
      const totalEmployees = (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0);
      const totalContractors = (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0);
      const totalTotals = (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0);

      const totalsRow = ws.addRow(['Total', '', totalEmployees, totalContractors, totalTotals]);
      totalsRow.eachCell((cell) => {
        cell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF808080' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      // Auto-fit columns
      // ws.columns.forEach(col => {
      //   let maxLen = 6;
      //   col.eachCell({ includeEmpty: true }, c => {
      //     const v = c.value ? String(c.value) : '';
      //     maxLen = Math.max(maxLen, v.length + 1);
      //   });
      //   col.width = Math.min(Math.max(maxLen, 7), 30);
      // });


       wsDetails.columns.forEach((col, idx) => {
        let maxLen = 0;
        col.eachCell({ includeEmpty: true }, c => {
          const v = c.value === null || c.value === undefined ? '' : String(c.value).trim();
          if (v.length > maxLen) maxLen = v.length;
        });
        let width = maxLen + 2;

        if (idx === 0) width = Math.min(Math.max(width, 15), 10);
        else if (idx === 1) width = Math.min(Math.max(width, 15), 30);
        else if (idx === 2) width = Math.min(Math.max(width, 8), 30);
        else if (idx === 3) width = Math.min(Math.max(width, 15), 30);
        else if (idx === 4) width = Math.min(Math.max(width, 10), 30);
        
        col.width = width;
      });

      // Freeze headers
      ws.views = [{ state: 'frozen', ySplit: 2 }];
