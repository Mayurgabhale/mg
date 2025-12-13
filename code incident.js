  <th>Reasons Flagged</th>
    GIVE ME THIS CODE REASON FLAGGED CODE 
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
                    {/*<th>Note</th> */}
                  </tr>



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
