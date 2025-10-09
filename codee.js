 {/* Clearance row: shows ClearanceCount and clickable to open details */}
            <tr
              className="clickable-row"
              ref={clearanceRef}
            >
              <td className="label"><FaCheckCircle color='#FFDD00' /> Clearance</td>
              <td
                className="value v-color clickable-cell"
                onClick={(e) => { e.stopPropagation(); setShowClearancePopup(prev => !prev); }}
                title="Click to view clearance details"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setShowClearancePopup(prev => !prev); } }}
              >
                {emp.ClearanceCount ?? 0}
              </td>

              {showClearancePopup && (
                <td className="popup-td" colSpan="2">
                  <div className="popup-card fancy-popup">
                    <div className="popup-header">
                      <strong>Clearance Details</strong>
                      <button
                        className="popup-close fancy-close"
                        onClick={() => setShowClearancePopup(false)}
                        title="Close"
                      >
                        🕓
                      </button>
                    </div>

                    <div className="popup-body">
                      <div><strong>Clearance Count:</strong> {emp.ClearanceCount ?? 0}</div>
                      <div style={{ marginTop: 8 }}>
                        <strong>Clearances</strong>
                        <ul className="popup-list">
                          {(!emp.Clearances || emp.Clearances.trim() === '') && <li>—</li>}
                          {emp.Clearances && emp.Clearances.split(',').map((c, i) => (
                            <li key={`clr-${i}`}>{c.trim()}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </td>
              )}
            </tr>
