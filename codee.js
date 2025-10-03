import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const exportModalTableToExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Employee Details");

  // 🔹 Build header row
  const headers = ["Sr", ...(modalRows[0]?.company ? ["Company"] : []), "Name", "Employee ID", "Personnel Type", "Zone"];
  const headerRow = worksheet.addRow(headers);

  // Style header
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "2965CC" },
    };
    cell.font = { bold: true, color: { argb: "FFFFFF" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // 🔹 Add table rows
  modalRows.forEach((row, idx) => {
    const rowData = [
      row.idx,
      ...(row.company ? [row.company] : []),
      row.name,
      row.employeeId || "-",
      row.personnelType || "-",
      row.zone || "-",
    ];

    const newRow = worksheet.addRow(rowData);

    newRow.eachCell((cell) => {
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      // Alternate row shading
      if (idx % 2 === 0) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F2F2F2" } };
      }
    });
  });

  // 🔹 Auto-fit columns
  worksheet.columns.forEach((col) => {
    let maxLength = 10;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const val = cell.value ? cell.value.toString() : "";
      if (val.length > maxLength) maxLength = val.length;
    });
    col.width = maxLength + 2;
  });

  // Save Excel
  const buf = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buf]), "Employee_Details.xlsx");
};





......
<div className="table-responsive">
  <div className="d-flex justify-content-end mb-2">
    <Button variant="success" onClick={exportModalTableToExcel}>
      Export to Excel
    </Button>
  </div>

  <Table striped bordered hover size="sm">
    <thead>
      <tr>
        <th>Sr</th>
        {modalRows[0]?.company && <th>Company</th>}
        <th>Name</th>
        <th>Employee ID</th>
        <th>Personnel Type</th>
        <th>Zone</th>
      </tr>
    </thead>
    <tbody>
      {modalRows.map((r, i) => (
        <tr key={`${r.employeeId || r.idx}-${i}`}>
          <td>{r.idx}</td>
          {r.company && <td>{r.company}</td>}
          <td>{r.name}</td>
          <td>{r.employeeId || "-"}</td>
          <td>{r.personnelType || "-"}</td>
          <td>{r.zone || "-"}</td>
        </tr>
      ))}
    </tbody>
  </Table>
</div>