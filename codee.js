ok good,
  data i want in center and, alos all table i want in center includ maring top and left side, ok like in center 
const handleExport = () => {
  if (!pickedDate) return;

  try {
    // Styles for Excel-friendly HTML
    const tableStyle = `
      border-collapse: collapse;
      border: 3px solid #000;
      text-align: center;
      font-family: Calibri, Arial, sans-serif;
    `;
    const thStyle = `
      border: 2px solid #000;
      padding: 6px;
      font-weight: bold;
      text-align: center;
      background-color: #FFC107;
      color: #000;
    `;
    const tdStyle = `
      border: 1px solid #000;
      padding: 5px;
      text-align: center;
      vertical-align: middle;
    `;
    const tdBold = `
      border: 1px solid #000;
      padding: 5px;
      text-align: center;
      font-weight: bold;
      background-color: #f0f0f0;
    `;

    let html = `<html><head><meta charset="UTF-8"></head><body>`;

    // ================= SHEET 1: WU Employee =================
    html += `<h2 style="text-align:center;">Western Union - Employee Report (${format(pickedDate, "d MMMM yyyy")})</h2>`;
    html += `<table style="${tableStyle}">`;

    const empHeaders = [
      "Sr.No", "Date", "Time", "Employee Name",
      "Employee ID", "Personal Type", "Door Name", "Location"
    ];

    // Header
    html += "<thead><tr>";
    empHeaders.forEach(h => html += `<th style="${thStyle}">${h}</th>`);
    html += "</tr></thead><tbody>";

    // Rows
    (detailRows || []).forEach((r, i) => {
      const dateVal = (r.LocaleMessageTime?.slice(0, 10)) || (r.SwipeDate?.slice(0, 10)) || "";
      const timeVal = formatApiTime12(r.LocaleMessageTime) || "";
      const name = r.ObjectName1 || "";
      const empId = r.EmployeeID || "";
      const ptype = r.PersonnelType || "";
      const door = r.Door || r.ObjectName2 || "";
      const location = r.PartitionName2 || r.PrimaryLocation || "";

      html += "<tr>";
      html += `<td style="${tdStyle}">${i + 1}</td>`;
      html += `<td style="${tdStyle}">${dateVal}</td>`;
      html += `<td style="${tdStyle}">${timeVal}</td>`;
      html += `<td style="${tdStyle}">${name}</td>`;
      html += `<td style="${tdStyle}">${empId}</td>`;
      html += `<td style="${tdStyle}">${ptype}</td>`;
      html += `<td style="${tdStyle}">${door}</td>`;
      html += `<td style="${tdStyle}">${location}</td>`;
      html += "</tr>";
    });

    html += "</tbody></table><br><br>";

    // ================= SHEET 2: WU Summary =================
    html += `<h2 style="text-align:center;">Western Union - Summary Report (${format(pickedDate, "d MMMM yyyy")})</h2>`;
    html += `<table style="${tableStyle}">`;

    // ✅ Include City column
    const sumHeaders = ["Country", "City", "Employee", "Contractors", "Total"];
    html += "<thead><tr>";
    sumHeaders.forEach(h => html += `<th style="${thStyle}">${h}</th>`);
    html += "</tr></thead><tbody>";

    (partitionRows || []).forEach(r => {
      html += "<tr>";
      html += `<td style="${tdStyle}">${r.country || ""}</td>`;
      html += `<td style="${tdStyle}">${r.city || ""}</td>`;
      html += `<td style="${tdStyle}">${r.employee || 0}</td>`;
      html += `<td style="${tdStyle}">${r.contractor || 0}</td>`;
      html += `<td style="${tdBold}">${r.total || 0}</td>`;
      html += "</tr>";
    });

    // Total Row
    const totalEmp = (partitionRows || []).reduce((s, r) => s + (r.employee || 0), 0);
    const totalCont = (partitionRows || []).reduce((s, r) => s + (r.contractor || 0), 0);
    const totalAll = (partitionRows || []).reduce((s, r) => s + (r.total || 0), 0);

    html += `<tr style="background-color:#666; color:#fff;">`;
    html += `<td colspan="2" style="${tdBold}text-align:right;">Total</td>`;
    html += `<td style="${tdBold}">${totalEmp}</td>`;
    html += `<td style="${tdBold}">${totalCont}</td>`;
    html += `<td style="${tdBold}">${totalAll}</td>`;
    html += "</tr>";

    html += "</tbody></table>";

    html += "</body></html>";

    // ================= DOWNLOAD =================
    const cityName = backendFilterKey
      ? Object.keys(apacPartitionDisplay).find(
          code => apacForwardKey[code] === backendFilterKey || code === backendFilterKey
        )
      : "";
    const city = cityName ? apacPartitionDisplay[cityName]?.city || backendFilterKey : "";

    const filename = city
      ? `Western Union APAC (${city}) Headcount Report - ${format(pickedDate, "d MMMM yyyy")}.xls`
      : `Western Union APAC Headcount Report - ${format(pickedDate, "d MMMM yyyy")}.xls`;

    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("handleExport (HTML) error:", err);
  }
};
