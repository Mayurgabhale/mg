in note sectin i want ot add thsi reson sectin ok so who to add
  
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

        function handleRiskBarClick(label) {
          if (!label) return;
          if (selectedRiskFilter === label) {
            setSelectedRiskFilter("");
          } else {
