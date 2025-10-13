const exportReportCsv = () => {
    if (!regionObj) return;

    // Determine exact dates to export based on user's inputs (singleDate or start/end)
    let datesFiltered = [];
    if (!useRange && singleDate) {
      datesFiltered = [singleDate];
    } else if (useRange && startDate && endDate) {
      datesFiltered = generateDatesBetween(startDate, endDate);
    } else if (singleDate) {
      // fallback if singleDate is present even though useRange may be true
      datesFiltered = [singleDate];
    } else {
      // final fallback - use whatever dates are present in the server response
      datesFiltered = Array.isArray(regionObj.dates) ? [...regionObj.dates] : [];
    }

    // If still empty, abort
    if (!datesFiltered || datesFiltered.length === 0) {
      alert("No dates available for export.");
      return;
    }

    // Compute week starts only based on the filtered dates (fixes 1-week rendering as 2 weeks)
    const weekStarts = computeWeekStarts(datesFiltered);

    // Build headers: base + perDay (in filtered order) + perWeek + Dominant + Compliance
    const baseHeader = ["Sr.No", "EmployeeID", "EmployeeName", "CardNumber", "PersonnelType", "PartitionName2", "TotalSecondsPresentInRange"];
    const perDayHeaders = datesFiltered.map((iso) => isoToLongDateNoCommas(iso));
    const perWeekHeaders = weekStarts.map((ws) => `Week compliance ${ws}`);
    const header = [...baseHeader, ...perDayHeaders, ...perWeekHeaders, "DominantCategory", "ComplianceSummary"];

    // Build HTML table (Excel-friendly) with inline styles: thick outer border, all borders, bold header, center alignment
    const tableStyle = `
      border-collapse: collapse;
      border: 3px solid #000; 
      text-align: center;
      font-family: Arial, Helvetica, sans-serif;
    `;
    const thStyle = `
      border: 2px solid #000;
      padding: 6px;
      font-weight: bold;
      text-align: center;
      vertical-align: middle;
    `;
    const tdStyle = `
      border: 1px solid #000;
      padding: 5px;
      text-align: center;
      vertical-align: middle;
    `;

    let html = `<html><head><meta charset="UTF-8"></head><body><table style="${tableStyle}">`;

    // Header row
    html += "<thead><tr>";
    header.forEach((h) => {
      html += `<th style="${thStyle}">${String(h).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</th>`;
    });
    html += "</tr></thead>";

    // Body rows: one per employee
    html += "<tbody>";
    const rows = regionObj.employees || [];
    rows.forEach((r, idx) => {
      const srNo = idx + 1;
      const employeeId = r.EmployeeID ?? "";
      const employeeName = r.EmployeeName ?? "";
      const cardNumber = r.CardNumber ?? "";
      const personnelType = r.PersonnelType ?? r.PersonnelTypeName ?? "";
      const partition = r.PartitionName2 ?? "";
      const totalSeconds = r.total_seconds_present_in_range ?? "";

      // per day values (for the filtered dates)
      const perDayVals = datesFiltered.map((iso) => {
        // Try compliance weeks first for matching seconds, else durations, else durations_seconds fallback
        const wkStartForIso = (() => {
          // find the weekStart that contains this iso
          for (let ws of weekStarts) {
            const wsDate = new Date(ws + "T00:00:00Z");
            const curDate = new Date(iso + "T00:00:00Z");
            if (curDate >= wsDate && curDate < new Date(wsDate.getTime() + 7 * 24 * 3600 * 1000)) {
              return ws;
            }
          }
          return null;
        })();

        let outVal = "0";

        if (wkStartForIso && r.compliance && r.compliance.weeks && r.compliance.weeks[wkStartForIso] && r.compliance.weeks[wkStartForIso].dates && Object.prototype.hasOwnProperty.call(r.compliance.weeks[wkStartForIso].dates, iso)) {
          const secs = r.compliance.weeks[wkStartForIso].dates[iso];
          if (secs !== null && secs !== undefined) {
            outVal = r.durations && r.durations[iso] ? r.durations[iso] : secondsToHMS(secs);
          } else {
            outVal = "0";
          }
        } else if (r.durations && Object.prototype.hasOwnProperty.call(r.durations, iso) && r.durations[iso]) {
          outVal = r.durations[iso];
        } else if (r.durations_seconds && Object.prototype.hasOwnProperty.call(r.durations_seconds, iso) && r.durations_seconds[iso]) {
          outVal = secondsToHMS(r.durations_seconds[iso]);
        } else {
          outVal = "0";
        }

        return outVal;
      });

      const perWeekVals = weekStarts.map((ws) => {
        const wk = r.compliance && r.compliance.weeks ? r.compliance.weeks[ws] : null;
        return wk && wk.compliant ? "Yes" : "No";
      });

      const complianceText = r.compliance?.month_summary || "";

      html += "<tr>";
      // base columns
      html += `<td style="${tdStyle}">${srNo}</td>`;
      html += `<td style="${tdStyle}">${String(employeeId).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</td>`;
      html += `<td style="${tdStyle}">${String(employeeName).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</td>`;
      html += `<td style="${tdStyle}">${String(cardNumber).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</td>`;
      html += `<td style="${tdStyle}">${String(personnelType).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</td>`;
      html += `<td style="${tdStyle}">${String(partition).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</td>`;
      html += `<td style="${tdStyle}">${totalSeconds}</td>`;

      // per-day
      perDayVals.forEach((v) => {
        html += `<td style="${tdStyle}">${String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</td>`;
      });

      // per-week
      perWeekVals.forEach((v) => {
        html += `<td style="${tdStyle}">${String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</td>`;
      });

      // dominant and compliance summary
      html += `<td style="${tdStyle}">${String(r.duration_categories?.dominant_category || "").replace(/&/g, "&amp;").replace(/</g, "&lt;")}</td>`;
      html += `<td style="${tdStyle}">${String(complianceText).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</td>`;

      html += "</tr>";
    });

    html += "</tbody></table></body></html>";

    // Create blob and download as .xls (Excel will open the HTML and preserve styling)
    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename = `duration_report_${region}_${datesFiltered[0] || ""}_to_${datesFiltered[datesFiltered.length - 1] || ""}.xls`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
 
