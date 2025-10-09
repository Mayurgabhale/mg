// Auto-fit columns for WU Summary
ws.columns.forEach((col, idx) => {
  let maxLen = 0;
  col.eachCell({ includeEmpty: true }, c => {
    const v = c.value === null || c.value === undefined ? '' : String(c.value).trim();
    if (v.length > maxLen) maxLen = v.length;
  });

  let width = maxLen + 2; // padding

  // Optional: fine-tune per column
  if (idx === 0) width = Math.min(Math.max(width, 10), 20);   // Country
  else if (idx === 1) width = Math.min(Math.max(width, 10), 25); // City
  else if (idx === 2) width = Math.min(Math.max(width, 12), 20); // Employee
  else if (idx === 3) width = Math.min(Math.max(width, 12), 20); // Contractors
  else if (idx === 4) width = Math.min(Math.max(width, 12), 20); // Total

  col.width = width;
});

// Freeze headers (top 2 rows)
ws.views = [{ state: 'frozen', ySplit: 2 }];