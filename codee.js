const handleExport = async () => {
  if (!pickedDate) return;
  try {
    const Excel = (await import('exceljs')).default;

    let wb = new Excel.Workbook();

    // SHEET 1: WU Employee (Your existing code)
    // ... [all your wsDetails setup code here] ...

    // SHEET 2: Custom sheet (NOT the old "WU Summary")
    const wsCustom = wb.addWorksheet('My Second Sheet');

    // Example: setup header row for second sheet
    wsCustom.columns = [
      { header: 'Example 1', width: 20 },
      { header: 'Example 2', width: 30 }
    ];
    wsCustom.addRow(['Value A', 'Value B']);
    wsCustom.addRow(['Value C', 'Value D']);
    // ... (add your custom data and formatting as needed) ...

    // Save file
    const filename = `Western Union EMEA Headcount Report - ${format(pickedDate, 'd MMMM yyyy')}.xlsx`;
    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), filename);

  } catch (err) {
    console.error('handleExport error:', err);
  }
};