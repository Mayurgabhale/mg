// Auto-fit columns for details sheet
wsDetails.columns.forEach((col, idx) => {
  let maxLen = 0;

  col.eachCell({ includeEmpty: true }, c => {
    const v = c.value === null || c.value === undefined ? '' : String(c.value).trim();
    if (v.length > maxLen) maxLen = v.length;
  });

  // Base width = longest value length + padding
  let width = maxLen + 2;

  // Apply smarter min/max per column
  if (idx === 0) {
    // Sr.No
    width = Math.min(Math.max(width, 6), 10);
  } else if (idx === 1) {
    // Date
    width = Math.min(Math.max(width, 10), 15);
  } else if (idx === 2) {
    // Time
    width = Math.min(Math.max(width, 8), 12);
  } else if (idx === 3) {
    // Employee Name
    width = Math.min(Math.max(width, 15), 30);
  } else if (idx === 4) {
    // Employee ID
    width = Math.min(Math.max(width, 10), 18);
  } else if (idx === 5) {
    // Personal Type
    width = Math.min(Math.max(width, 12), 20);
  } else if (idx === 6) {
    // Door Name
    width = Math.min(Math.max(width, 18), 40);
  } else if (idx === 7) {
    // Location
    width = Math.min(Math.max(width, 18), 40);
  }

  col.width = width;
});