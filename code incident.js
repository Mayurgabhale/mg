Reasons Flagged
  FLAG IS NOT DIPSLY... 
    REA THE BELOW ALL CODE WHY NOT NOT DILSY IN TABLE 

    Reasons Flagged
long_gap_>=4.5h

  THIS AS IT IS I WANT TO DI;LSY IN TABLE 
<th>Reasons Flagged</th>
 <td className="small">{r.Zone || '-'}</td>
                        <td>
                          {flags[idx].dayStart
                            ? renderReasonChips(modalRow?.Reasons || modalRow?.DetectedScenarios)
                            : <span className="muted">—</span>}
                        </td>




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
                          {flags[idx].dayStart
                            ? renderReasonChips(modalRow?.Reasons || modalRow?.DetectedScenarios)
                            : <span className="muted">—</span>}
                        </td>

                        {/* <td className="small">{r.Note || '-'}{r._source ? <span className="muted"> ({r._source})</span> : null}
                          {extraNote ? <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>{extraNote}</div> : null}
                        </td>
                       */ }
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }

        function handleRiskBarClick(label) {
          if (!label) return;
          if (selectedRiskFilter === label) {
            setSelectedRiskFilter("");
          } else {
            setSelectedRiskFilter(label);
          }
          setPage(1);
        }

        function clearRiskFilter() {
          setSelectedRiskFilter("");
        }


        var rowsCount = (summary && typeof summary.rows === 'number') ? summary.rows : (rows ? rows.length : 0);

        // compute unique flagged persons (dedupe by same key used above)
        var _flaggedKeys = new Set();
        (rows || []).forEach(function (r) {
          if (r && (r.Reasons || r.DetectedScenarios)) {
            var k = r.EmployeeID || r.person_uid || (sanitizeName(r) + '|' + (r.CardNumber || r.Card || ''));
            if (!k) k = JSON.stringify(r);
            _flaggedKeys.add(k);
          }
        });
        var flaggedCount = (summary && typeof summary.flagged_rows === 'number' && summary.flagged_rows > 0) ? summary.flagged_rows : _flaggedKeys.size;

        var flaggedPct = rowsCount ? Math.round((flaggedCount * 100) / (rowsCount || 1)) : 0;
