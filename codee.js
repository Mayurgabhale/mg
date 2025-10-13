const handleExport = () => {
  if (!pickedDate) return;

  try {
    const pageStyle = `
      display: flex;
      flex-direction: row; /* side by side */
      align-items: flex-start;
      justify-content: center;
      margin-top: 40px;
      margin-left: 50px;
      margin-right: 50px;
      font-family: Calibri, Arial, sans-serif;
    `;
    const tableStyle = `
      border-collapse: collapse;
      border: 3px solid #000;
      text-align: center;
      margin: 0 20px;
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

    let html = `
      <html>
        <head><meta charset="UTF-8"></head>
        <body style="${pageStyle}">
          <div style="display:flex; flex-direction:row; align-items:flex-start; justify-content:center;">
            <!-- Employee Table -->
            <div>
              <h2 style="text-align:center;">Western Union - Employee Report (${format(
                pickedDate,
                "d MMMM yyyy"
              )})</h2>
              <table style="${tableStyle}">
    `;

    const empHeaders = [
      "Sr.No",
      "Date",
      "Time",
      "Employee Name",
      "Employee ID",
      "Personal Type",
      "Door Name",
      "City",
      "Location",
    ];

    html += "<thead><tr>";
    empHeaders.forEach((h) => (html += `<th style="${thStyle}">${h}</th>`));
    html += "</tr></thead><tbody>";

    (detailRows || []).forEach((r, i) => {
      const dateVal =
        r.LocaleMessageTime?.slice(0, 10) || r.SwipeDate?.slice(0, 10) || "";
      const timeVal = formatApiTime12(r.LocaleMessageTime) || "";
      const name = r.ObjectName1 || "";
      const empId = r.EmployeeID || "";
      const ptype = r.PersonnelType || "";
      const door = r.Door || r.ObjectName2 || "";
      const city = r.City || r.PartitionName1 || "";
      const location = r.PartitionName2 || r.PrimaryLocation || "";

      html += "<tr>";
      html += `<td style="${tdStyle}">${i + 1}</td>`;
      html += `<td style="${tdStyle}">${dateVal}</td>`;
      html += `<td style="${tdStyle}">${timeVal}</td>`;
      html += `<td style="${tdStyle}">${name}</td>`;
      html += `<td style="${tdStyle}">${empId}</td>`;
      html += `<td style="${tdStyle}">${ptype}</td>`;
      html += `<td style="${tdStyle}">${door}</td>`;
      html += `<td style="${tdStyle}">${city}</td>`;
      html += `<td style="${tdStyle}">${location}</td>`;
      html += "</tr>";
    });

    html += "</tbody></table></div>"; // end Employee table div

    // ------------------ Summary Table (Right Side) ------------------
    html += `
      <div style="margin-left:40px;">
        <h2 style="text-align:center;">Western Union - Summary Report (${format(
          pickedDate,
          "d MMMM yyyy"
        )})</h2>
        <table style="${tableStyle}">
    `;

    const sumHeaders = ["Country", "City", "Employee", "Contractors", "Total"];
    html += "<thead><tr>";
    sumHeaders.forEach((h) => (html += `<th style="${thStyle}">${h}</th>`));
    html += "</tr></thead><tbody>";

    (partitionRows || []).forEach((r) => {
      html += "<tr>";
      html += `<td style="${tdStyle}">${r.country || ""}</td>`;
      html += `<td style="${tdStyle}">${r.city || ""}</td>`;
      html += `<td style="${tdStyle}">${r.employee || 0}</td>`;
      html += `<td style="${tdStyle}">${r.contractor || 0}</td>`;
      html += `<td style="${tdBold}">${r.total || 0}</td>`;
      html += "</tr>";
    });

    const totalEmp = (partitionRows || []).reduce(
      (s, r) => s + (r.employee || 0),
      0
    );
    const totalCont = (partitionRows || []).reduce(
      (s, r) => s + (r.contractor || 0),
      0
    );
    const totalAll = (partitionRows || []).reduce(
      (s, r) => s + (r.total || 0),
      0
    );

    html += `
      <tr style="background-color:#666; color:#fff;">
        <td colspan="2" style="${tdBold} text-align:right;">Total</td>
        <td style="${tdBold}">${totalEmp}</td>
        <td style="${tdBold}">${totalCont}</td>
        <td style="${tdBold}">${totalAll}</td>
      </tr>
    `;

    html += "</tbody></table></div></div></body></html>";

    // ================= DOWNLOAD =================
    const cityName = backendFilterKey
      ? Object.keys(apacPartitionDisplay).find(
          (code) =>
            apacForwardKey[code] === backendFilterKey || code === backendFilterKey
        )
      : "";
    const city = cityName
      ? apacPartitionDisplay[cityName]?.city || backendFilterKey
      : "";

    const filename = city
      ? `Western Union APAC (${city}) Headcount Report - ${format(
          pickedDate,
          "d MMMM yyyy"
        )}.xls`
      : `Western Union APAC Headcount Report - ${format(
          pickedDate,
          "d MMMM yyyy"
        )}.xls`;

    const blob = new Blob([html], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
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