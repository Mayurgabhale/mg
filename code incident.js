react-dom.development.js:29905 Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
Inline Babel script:1286 Uncaught ReferenceError: row is not defined
    at <anonymous>:1585:19
    at Array.map (<anonymous>)
    at renderSwipeTimeline (<anonymous>:1501:17)
    at App (<anonymous>:2708:32)
    at renderWithHooks (react-dom.development.js:15496:20)
    at updateFunctionComponent (react-dom.development.js:19627:22)
    at beginWork (react-dom.development.js:21650:18)
    at HTMLUnknownElement.callCallback (react-dom.development.js:4151:16)
    at Object.invokeGuardedCallbackDev (react-dom.development.js:4200:18)
    at invokeGuardedCallback (react-dom.development.js:4264:33)
Inline Babel script:1286 Uncaught ReferenceError: row is not defined
    at <anonymous>:1585:19
    at Array.map (<anonymous>)
    at renderSwipeTimeline (<anonymous>:1501:17)
    at App (<anonymous>:2708:32)
    at renderWithHooks (react-dom.development.js:15496:20)
    at updateFunctionComponent (react-dom.development.js:19627:22)
    at beginWork (react-dom.development.js:21650:18)
    at HTMLUnknownElement.callCallback (react-dom.development.js:4151:16)
    at Object.invokeGuardedCallbackDev (react-dom.development.js:4200:18)
    at invokeGuardedCallback (react-dom.development.js:4264:33)
react-dom.development.js:18714 The above error occurred in the <App> component:

    at App (<anonymous>:311:21)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
logCapturedError @ react-dom.development.js:18714
react-dom.development.js:26972 Uncaught ReferenceError: row is not defined
    at <anonymous>:1585:19
    at Array.map (<anonymous>)
    at renderSwipeTimeline (<anonymous>:1501:17)
    at App (<anonymous>:2708:32)
    at renderWithHooks (react-dom.development.js:15496:20)
    at updateFunctionComponent (react-dom.development.js:19627:22)
    at beginWork (react-dom.development.js:21650:18)
    at beginWork$1 (react-dom.development.js:27475:16)
    at performUnitOfWork (react-dom.development.js:26609:14)
    at workLoopSync (react-dom.development.js:26515:7)

        const NO_GREEN_LOCATIONS = new Set([
          "quezon",
          "vilnius"
        ]);

        function isNoGreenLocation(row) {
          const haystack = [
            row.Door,
            row._source,      // swipes_ltvilnius_20251201.csv
            row.SourceFile,   // if present
            row.FileName      // if present
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          for (const loc of NO_GREEN_LOCATIONS) {
            if (haystack.includes(loc)) return true;
          }
          return false;
        }

        // Swipe timeline rendering uses DAY_BOUNDARY_HOUR = 0 to match backend date assignment
        function renderSwipeTimeline(details, modalRow) {


          if (!details || !details.raw_swipes || details.raw_swipes.length === 0) {
            return <div className="muted">No raw swipe evidence available (person not flagged or raw file missing).</div>;
          }

          const all = details.raw_swipes.map(r => {
            const obj = Object.assign({}, r);
            try { obj.__ts = makeLocalDateFromRow(obj); } catch (e) { obj.__ts = null; }

            let gap = null;
            if (obj.SwipeGapSeconds !== undefined && obj.SwipeGapSeconds !== null) {
              gap = Number(obj.SwipeGapSeconds);
              if (isNaN(gap)) gap = null;
            } else if (obj.SwipeGap) {
              try {
                const parts = String(obj.SwipeGap).split(':').map(p => Number(p));
                if (parts.length === 3 && parts.every(p => !isNaN(p))) gap = parts[0] * 3600 + parts[1] * 60 + parts[2];
              } catch (e) { gap = null; }
            }
            obj.__gap = gap;
            obj.__zone_l = String((obj.Zone || '')).toLowerCase();

            // Prefer backend-provided date fields (DateOnly) or computed timestamp
            if (obj.__ts) {
              obj.__logical_date = logicalDateForTs(obj.__ts, DAY_BOUNDARY_HOUR);
            } else if (obj.DateOnly) {
              // DateOnly may be a string or object; coerce to YYYY-MM-DD
              obj.__logical_date = String(obj.DateOnly).slice(0, 10);
            } else if (obj.Date) {
              obj.__logical_date = String(obj.Date).slice(0, 10);
            } else {
              obj.__logical_date = null;
            }
            return obj;
          }).sort((a, b) => {
            // Primary sort: parsed timestamp if present
            if (a.__ts && b.__ts) return a.__ts - b.__ts;
            if (a.__ts) return -1;
            if (b.__ts) return 1;
            // Fallback: use DateOnly + Time or Date+Time strings
            const ka = (a.DateOnly || a.Date || '') + ' ' + (a.Time || '');
            const kb = (b.DateOnly || b.Date || '') + ' ' + (b.Time || '');
            return ka.localeCompare(kb);
          });

          // flags: dayStart for first row OR when logical date changes between rows
          const flags = new Array(all.length).fill(null).map(() => ({ dayStart: false, outReturn: false }));
          for (let i = 0; i < all.length; i++) {
            const cur = all[i];
            const prev = all[i - 1];
            const curDate = cur.__logical_date || (cur.DateOnly ? String(cur.DateOnly).slice(0, 10) : (cur.Date ? String(cur.Date).slice(0, 10) : null));
            const prevDate = prev ? (prev.__logical_date || (prev.DateOnly ? String(prev.DateOnly).slice(0, 10) : (prev.Date ? String(prev.Date).slice(0, 10) : null))) : null;
            if (!prev || prevDate !== curDate) {
              flags[i].dayStart = true;
            }
          }

          const OUT_RETURN_GAP_SECONDS = 60 * 60;
          for (let i = 0; i < all.length - 1; i++) {
            const a = all[i], b = all[i + 1];
            const aZone = a.__zone_l || ''; const bZone = b.__zone_l || ''; const bGap = b.__gap || 0;
            if (aZone.includes('out of office') || aZone.includes('out_of_office') || aZone.includes('out of')) {
              if (!bZone.includes('out of office') && (bGap >= OUT_RETURN_GAP_SECONDS || (bGap === null && aZone.includes('out')))) {
                flags[i].outReturn = true; flags[i + 1].outReturn = true;
              }
            }
          }

          for (let i = 0; i < all.length; i++) {
            if (flags[i].dayStart) {
              all[i].__gap = 0;
            }
          }

          return (
            <div className="table-scroll">
              <table className="evidence-table" role="table" aria-label="Swipe timeline">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Employee ID</th>
                    <th>Card</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>SwipeGap</th>
                    <th>Door</th>
                    <th>Direction</th>
                    <th>Zone</th>
                    <th>Reasons Flagged</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {all.map((rObj, idx) => {
                    const r = rObj || {};
                    const g = (r.__gap !== undefined && r.__gap !== null) ? Number(r.__gap) : null;
                    const isDayStart = flags[idx].dayStart;
                    const gapFormatted = (isDayStart)
                      ? formatSecondsToHmsJS(0)
                      : (
                        (r.SwipeGap && String(r.SwipeGap).trim())
                          ? String(r.SwipeGap)
                          : (g !== null && g !== undefined)
                            ? formatSecondsToHmsJS(g)
                            : "-"
                      );

                    // display date: prefer logical (backend date), then DateOnly, then Date
                    const displayDate = r.__logical_date || (r.DateOnly ? String(r.DateOnly).slice(0, 10) : (r.Date ? String(r.Date).slice(0, 10) : '-'));
                    const displayTime = r.Time || (r.__ts ? r.__ts.toTimeString().slice(0, 8) : '-');

                    // suppress green background for Quezon & Vilnius
                    const suppressGreen = isNoGreenLocation(r);

                    const cls = [];
                    if (isDayStart && !suppressGreen) cls.push('row-day-start');
                    if (flags[idx].outReturn) cls.push('row-out-return');

                    const rowStyle =
                      (isDayStart && !suppressGreen)
                        ? { background: '#e6ffed' }
                        : {};


                    let extraNote = "";
                    try {
                      const originalDate = r.Date ? String(r.Date).slice(0, 10) : null;
                      const logical = r.__logical_date || null;
                      if (originalDate && logical && originalDate !== logical) {
                        extraNote = `Orig: ${originalDate}`;
                        if ((String(r.Direction || '').toLowerCase().indexOf('out') !== -1)) {
                          extraNote += " — Out";
                        }
                      }
                    } catch (e) { extraNote = ""; }

                    return (
                      <tr key={idx} className={cls.join(' ')} style={rowStyle}>
                        <td className="small">{r.EmployeeName || '-'}</td>
                        <td className="small">{r.EmployeeID || '-'}</td>
                        <td className="small">{r.CardNumber || r.Card || '-'}</td>
                        <td className="small">{displayDate}</td>
                        <td className="small">{displayTime}</td>
                        <td className="small">{gapFormatted}</td>
                        <td className="small" style={{ minWidth: 160 }}>{r.Door || '-'}</td>
                        <td className="small">{r.Direction || '-'}</td>
                        <td className="small">{r.Zone || '-'}</td>
                        <td>
                          {row.Reasons
                            ? renderReasonChips(row.Reasons)
                            : <span className="muted">—</span>}
                        </td>
                        <td className="small">{r.Note || '-'}{r._source ? <span className="muted"> ({r._source})</span> : null}
                          {extraNote ? <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>{extraNote}</div> : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }

                      <div className="modal-details">
                        <div className="details-header">
                          <div className="emp-info">
                            <div className="emp-name">
                              {sanitizeName(modalRow) || "—"}
                              <span
                                className="risk-badge"
                                style={{
                                  marginLeft: "12px",
                                  background:
                                    RISK_COLORS[modalRow.RiskLevel] ||
                                    RISK_COLORS[getRiskLabelForRow(modalRow)] ||
                                    RISK_COLORS["Low"],
                                }}
                              >
                                {modalRow.RiskLevel ||
                                  (modalRow.RiskScore ? "Score " + modalRow.RiskScore : "Low")}
                              </span>
                            </div>
                            <div className="emp-badge">
                              <i className="bi bi-person-badge"></i>
                              ID: {modalRow.EmployeeID || "—"}
                            </div>
                          </div>
                        </div>
                        <div className="details-grid">
                          <div className="detail-item">
                            <div className="detail-icon">
                              <i className="bi bi-credit-card"></i>
                            </div>
                            <div className="detail-content">
                              <label>Card Number</label>
                              <span>{modalRow.CardNumber || "—"}</span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <div className="detail-icon">
                              <i className="bi bi-envelope"></i>
                            </div>
                            <div className="detail-content">
                              <label>EmployeeEmail</label>

                              <span>
                                {(
                                  // prefer aggregated_rows[0], then raw_swipes[0], then modalRow
                                  (modalDetails && modalDetails.aggregated_rows && modalDetails.aggregated_rows[0] && (modalDetails.aggregated_rows[0].EmployeeEmail || modalDetails.aggregated_rows[0].Email))
                                  || (modalDetails && modalDetails.raw_swipes && modalDetails.raw_swipes[0] && (modalDetails.raw_swipes[0].EmployeeEmail || modalDetails.raw_swipes[0].Email))
                                  || modalRow.EmployeeEmail
                                  || modalRow.Email
                                  || (modalDetails && modalDetails.aggregated_rows && modalDetails.aggregated_rows[0] && (modalDetails.aggregated_rows[0].WorkEmail || modalDetails.aggregated_rows[0].EMail))
                                ) ? (
                                  (modalDetails && modalDetails.aggregated_rows && modalDetails.aggregated_rows[0] && (modalDetails.aggregated_rows[0].EmployeeEmail || modalDetails.aggregated_rows[0].Email))
                                  || (modalDetails && modalDetails.raw_swipes && modalDetails.raw_swipes[0] && (modalDetails.raw_swipes[0].EmployeeEmail || modalDetails.raw_swipes[0].Email))
                                  || modalRow.EmployeeEmail
                                  || modalRow.Email
                                  || (modalDetails && modalDetails.aggregated_rows && modalDetails.aggregated_rows[0] && (modalDetails.aggregated_rows[0].WorkEmail || modalDetails.aggregated_rows[0].EMail))
                                ) : <span className="muted">—</span>}
                              </span>





                            </div>
                          </div>
                          <div className="detail-item">
                            <div className="detail-icon">
                              <i className="bi bi-calendar-date"></i>
                            </div>
                            <div className="detail-content">
                              <label>Date</label>
                              <span>{safeDateDisplay(modalRow.DisplayDate || modalRow.Date || modalRow.DateOnly || modalRow.FirstSwipe)}</span>
                            </div>
                          </div>
                          <div className="detail-item">
                            <div className="detail-icon">
                              <i className="bi bi-clock"></i>
                            </div>
                            <div className="detail-content">
                              <label>Duration</label>

                              <span className="duration-badge">
                                {modalRow.Duration
                                  || (modalRow.DurationSeconds ? formatSecondsToHmJS(Number(modalRow.DurationSeconds))
                                    : (modalRow.DurationMinutes ? formatSecondsToHmJS(Number(modalRow.DurationMinutes) * 60) : "—"))}
                              </span>


                            </div>
                            <div style={{ marginTop: 8, textAlign: 'right' }}>



                              <div className="muted">
                                Violation days
                              </div>
                              <div style={{ fontWeight: 700 }}>
                                {(modalRow && modalRow.ViolationDays !== undefined && modalRow.ViolationDays !== null) ? modalRow.ViolationDays
                                  : (modalRow && modalRow.ViolationDaysLast !== undefined && modalRow.ViolationDaysLast !== null) ? modalRow.ViolationDaysLast
                                    : (modalRow && modalRow.ViolationDaysLast90 !== undefined && modalRow.ViolationDaysLast90 !== null) ? modalRow.ViolationDaysLast90
                                      : 0}
                              </div>


                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="modal-reasons">
                        <div className="explanation-section" style={{ marginTop: 12 }}>
                          <div style={{ fontWeight: 700 }}>Explanation</div>
                          <div style={{
                            marginTop: 8,
                            maxHeight: 160,
                            overflow: 'auto',
                            background: '#fff',
                            border: '1px solid #eef2f7',
                            padding: 8,
                            borderRadius: 6
                          }}>
                            {(modalRow.Explanation || modalRow.ViolationExplanation)
                              ? <div style={{ whiteSpace: 'pre-wrap' }}>{modalRow.Explanation || modalRow.ViolationExplanation}</div>
                              : <div className="muted">No explanation provided.</div>}

                          </div>
                        </div>
                        <div className="reasons-section">
                          <div className="section-title">
                            <i className="bi bi-list-check"></i>
                            Reasons Flagged
                          </div>
                          <div className="reasons-list">
                            {renderReasonChips(modalRow.Reasons || modalRow.DetectedScenarios)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="timeline-section">
                      <div className="section-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <i className="bi bi-clock-history"></i>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <h4 style={{ margin: 0 }}>Swipe Timeline</h4>
                          <span className="subtitle">Filtered for this person/date</span>
                        </div>

                        {/* Export button added here (Excel-friendly .xls HTML table) */}
                        <div style={{ marginLeft: 'auto' }}>
                          <button
                            className="small-button"
                            onClick={exportTimelineExcel}
                            disabled={!modalDetails || !(modalDetails.raw_swipes && modalDetails.raw_swipes.length)}
                          >
                            Export report
                          </button>
                        </div>
                      </div>


                      <div className="timeline-content">
                        {modalDetails ? renderSwipeTimeline(modalDetails, modalRow) : (
                          <div className="loading-timeline">
                            <i className="bi bi-hourglass-split"></i>
                            <span>Evidence not loaded yet.</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="raw-json-section">
                      <label className="toggle-label">
                        <input
                          type="checkbox"
                          id="showraw"
                          onChange={function (e) {
                            const el = document.getElementById('rawpayload');
                            if (el) el.style.display = e.target.checked ? 'block' : 'none';
                          }}
                        />
                        <span className="toggle-slider"></span>
                        <span className="toggle-text">
                          <i className="bi bi-code-slash"></i>
                          Show raw aggregated JSON
                        </span>
                      </label>
                      <div id="rawpayload" className="raw-json" style={{ display: 'none' }}>
                        <pre>{JSON.stringify(modalRow, null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
}

        function renderReasonChips(reasonText) {
          if (!reasonText) return <span className="muted">—</span>;
          const parts = String(reasonText).split(";").map(s => s.trim()).filter(Boolean);
          return parts.map((p, idx) => (<span key={idx} className="pill" title={SCENARIO_EXPLANATIONS[p] || p}>{p}</span>));
        }

        function renderReasonExplanations(reasonText) {
          if (!reasonText) return <div className="muted">No flags</div>;
          const parts = String(reasonText).split(";").map(s => s.trim()).filter(Boolean);
          return (
            <div>
              {parts.map((p, idx) => (
                <div key={idx} className="why-item" style={{ marginBottom: 8 }}>
                  <b>{p}</b>
                  <div className="small">{SCENARIO_EXPLANATIONS[p] || "No explanation available."}</div>
                </div>
              ))}
            </div>
          );
}
