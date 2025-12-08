
                  <div style={{ marginTop: 10 }} className="table-scroll" role="region" aria-label="results table">
                    <table>
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th className="small">ID</th>
                          <th className="small">Card</th>
                          <th className="small">Date</th>
                          <th className="small">Duration</th>
                          <th className="small">Violation Days</th>


                          <th className="small">Reasons</th>
                          <th className="small">Evidence</th>
                        </tr>
                      </thead>
                      <tbody>







{pageRows.map(function (r, idx) {
  // if aggregated mode, r will be aggregated object (has ViolationCount and FirstRow/_rows)
  var isAgg = collapseDuplicates && r && r.ViolationCount !== undefined;
  var displayRow = isAgg ? r.FirstRow : r; // use FirstRow for details/evidence
  var empName = isAgg ? (r.EmployeeName || sanitizeName(displayRow)) : sanitizeName(r);
  var empId = isAgg ? (r.EmployeeID || displayRow.EmployeeID || "") : (r.EmployeeID || "");
  var card = isAgg ? (r.CardNumber || displayRow.CardNumber || "") : (r.CardNumber || "");
  var displayDate = safeDateDisplay(displayRow.DisplayDate || displayRow.Date || displayRow.DateOnly || displayRow.FirstSwipe || displayRow.LastSwipe);

  var durText = (displayRow.Duration)
    || (displayRow.DurationSeconds ? formatSecondsToHmJS(Number(displayRow.DurationSeconds))
      : (displayRow.DurationMinutes ? formatSecondsToHmJS(Number(displayRow.DurationMinutes) * 60) : ""));

  var reasonsText = isAgg ? (r.Reasons || displayRow.Reasons || displayRow.DetectedScenarios) : (r.Reasons || r.DetectedScenarios);

  // --- compute violationCount & window BEFORE returning JSX (this fixes the Babel parse error) ---
  var violationCount = "";
  var violationWindow = null;

  if (isAgg) {
    // prefer aggregated ViolationDays (set in buildAggregated), then fallbacks
    if (r.ViolationDays !== undefined && r.ViolationDays !== null && r.ViolationDays !== "") violationCount = String(r.ViolationDays);
    else if (r.ViolationDaysLast !== undefined && r.ViolationDaysLast !== null && r.ViolationDaysLast !== "") violationCount = String(r.ViolationDaysLast);
    else if (r.ViolationDaysLast90 !== undefined && r.ViolationDaysLast90 !== null && r.ViolationDaysLast90 !== "") violationCount = String(r.ViolationDaysLast90);
    else if (r.ViolationDaysLast_90 !== undefined && r.ViolationDaysLast_90 !== null && r.ViolationDaysLast_90 !== "") violationCount = String(r.ViolationDaysLast_90);
    violationWindow = r.ViolationWindowDays || r.ViolationWindow || null;
  } else {
    // single-row displayRow: prefer ViolationDays, then ViolationDaysLast, then last90 variants
    if (displayRow.ViolationDays !== undefined && displayRow.ViolationDays !== null && displayRow.ViolationDays !== "") violationCount = String(displayRow.ViolationDays);
    else if (displayRow.ViolationDaysLast !== undefined && displayRow.ViolationDaysLast !== null && displayRow.ViolationDaysLast !== "") violationCount = String(displayRow.ViolationDaysLast);
    else if (displayRow.ViolationDaysLast90 !== undefined && displayRow.ViolationDaysLast90 !== null && displayRow.ViolationDaysLast90 !== "") violationCount = String(displayRow.ViolationDaysLast90);
    else if (displayRow.ViolationDaysLast_90 !== undefined && displayRow.ViolationDaysLast_90 !== null && displayRow.ViolationDaysLast_90 !== "") violationCount = String(displayRow.ViolationDaysLast_90);
    violationWindow = displayRow.ViolationWindowDays || displayRow.ViolationWindow || null;
  }

  return (
    <tr key={idx} className={(displayRow.Reasons && String(displayRow.Reasons).trim()) ? "flagged-row" : ""}>
      <td className="row-click" onClick={function () { openEvidence(displayRow); }}>
        {empName || <span className="muted">—</span>}
        {isAgg ? <div className="small muted" style={{ marginTop: 4 }}>violation Count - {r.ViolationCount}</div> : null}
      </td>
      <td className="small">{empId}</td>
      <td className="small">{card}</td>
      <td className="small">{displayDate}</td>
      <td className="small">{isAgg ? (displayRow.Duration || (displayRow.DurationSeconds ? formatSecondsToHmJS(Number(displayRow.DurationSeconds)) : "-")) : durText}</td>

      <td className="small">
        {violationCount !== "" ? violationCount : <span className="muted">—</span>}
        {/* NOTE: intentionally not showing "window: {violationWindow}d" in table per request */}
      </td>

      <td className="small">{renderReasonChips(reasonsText)}</td>
      <td className="small">
        <button className="evidence-btn" onClick={function () { openEvidence(displayRow); }}>Evidence</button>
        {isAgg ? <span className="muted" style={{ marginLeft: 8 }}>({r.ViolationCount} rows)</span> : null}
      </td>
    </tr>
  );
})}



                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
                    <button onClick={function () { setPage(function (p) { return Math.max(1, p - 1); }); }} disabled={page <= 1}>Prev</button>
