
Swipe Timeline
Filtered for this person/date
Export report
Employee Name	Employee ID	Card	Date	Time	SwipeGap	Door	Direction	Zone	Note
Beduria, Reshellyn Baroca	323630	608269	2025-12-01	12:55:07 PM	00:00:00	APAC_PH_Manila_7th Floor_Recption Door 2-701	InDirection	Red Zone	- (swipes_quezon-city_20251201.csv) <<< this row is diplsy in green background, 
for example, when new day is stat that time is row background color is green ok 
so i dont want this green bckground logic, for  quizon and vilnius 
day dayboundry ok 
so how to remove this green backgorun ony for  quizon and vilnius 
Orig: 01-Dec-25
Beduria, Reshellyn Baroca	323630	608269	2025-12-01	5:03:28 PM	04:08:21	APAC_PH_Manila_7th Floor_Recption Door 1-701	OutDirection	Out of office	- (swipes_quezon-city_20251201.csv)
Orig: 01-Dec-25 — Out


            {modalRow &&
              <div className="modal" onClick={closeModal}>
                <div className="modal-inner" onClick={function (e) { e.stopPropagation(); }}>
                  <div className="modal-header">
                    <div className="header-content">
                      <div className="header-icon">
                        <i className="bi bi-clipboard2-data-fill"></i>
                      </div>
                      <div className="header-text">
                        <h3>Details — Evidence</h3>
                        <div className="header-subtitle small">Evidence & explanation for selected row</div>
                      </div>
                    </div>
                    <button className="close-btn" onClick={closeModal}>
                      <i className="bi bi-x-lg"></i>
                      Close
                    </button>
                  </div>
                  <div className="modal-body">
                    {modalLoading && (
                      <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <span>Loading evidence…</span>
                      </div>
                    )}
                    <div className="modal-top" role="region" aria-label="evidence summary">
                      <div className="image-section">
                        <div className="image-container">
                          <div className="multi-color-border">
                            <div className="color-ring color-1"></div>
                            <div className="color-ring color-2"></div>
                            <div className="color-ring color-3"></div>
                            <div className="color-ring color-4"></div>
                            <div className="image-content">

                              {/* Improved modal image block — prefer ObjectID/GUID and try more fallbacks */}

                              {(modalDetails && ((modalDetails.aggregated_rows && modalDetails.aggregated_rows.length > 0) || (modalDetails.raw_swipes && modalDetails.raw_swipes.length > 0))) ? (

                                (() => {
                                  // helper: candidate image key names (same as before)
                                  const candidateImageKeys = ['imageUrl', 'image_url', 'ImageUrl', 'image', 'Image', 'img', 'imgUrl', 'ImagePath', 'Photo', 'PhotoUrl', 'EmployeePhoto', 'photo', 'photoUrl'];

                                  // pick first md (aggregated/raw) row if exists
                                  const md = (modalDetails && modalDetails.aggregated_rows && modalDetails.aggregated_rows[0])
                                    || (modalDetails && modalDetails.raw_swipes && modalDetails.raw_swipes[0])
                                    || {};

                                  // try to obtain an explicit image path from md first
                                  let imgPath = candidateImageKeys.map(k => (md && md[k]) ? md[k] : null).find(Boolean) || null;

                                  // if not present yet, use any image_url included in full record response (js.image_url -> set below in openEvidence)
                                  if (!imgPath && modalRow && modalRow.ImageUrl) {
                                    imgPath = modalRow.ImageUrl;
                                  }

                                  // Build ordered id candidates preferring modalRow
                                  const idCandidates = [];
                                  if (modalRow && modalRow.EmployeeID) idCandidates.push(String(modalRow.EmployeeID));
                                  if (modalRow && modalRow.person_uid) idCandidates.push(String(modalRow.person_uid));
                                  if (md && md.EmployeeID) idCandidates.push(String(md.EmployeeID));
                                  if (md && md.person_uid) idCandidates.push(String(md.person_uid));
                                  if (md && md.ObjectID) idCandidates.push(String(md.ObjectID));
                                  if (md && md.GUID) idCandidates.push(String(md.GUID));

                                  const uniqIds = idCandidates.filter((v, i) => v && idCandidates.indexOf(v) === i);

                                  // If still no explicit path, build a likely image endpoint from the top id candidate
                                  if (!imgPath && uniqIds.length) {
                                    imgPath = `/employee/${encodeURIComponent(uniqIds[0])}/image`;
                                  }

                                  if (imgPath) {
                                    const imgSrc = resolveApiImageUrl(imgPath) || imgPath;
                                    return (
                                      <img
                                        className="modal-image"
                                        src={imgSrc}
                                        alt={sanitizeName(modalRow) || "Employee image"}
                                        onLoad={(e) => { try { console.info("employee image loaded:", e.target.src); } catch (e) { } }}
                                        onError={async (e) => {
                                          try {
                                            e.target.onerror = null;
                                            console.warn("image load failed for:", e.target.src);

                                            // cache-busted retry + API variants for all uniqIds
                                            const tryUrls = [];
                                            const original = e.target.src;
                                            tryUrls.push(original + (original.indexOf('?') === -1 ? '?cb=' + Date.now() : '&cb=' + Date.now()));
                                            uniqIds.forEach(id => {
                                              if (!id) return;
                                              const a = resolveApiImageUrl(`/api/employees/${encodeURIComponent(id)}/image`);
                                              const b = resolveApiImageUrl(`/employee/${encodeURIComponent(id)}/image`);
                                              if (a && tryUrls.indexOf(a) === -1) tryUrls.push(a);
                                              if (b && tryUrls.indexOf(b) === -1) tryUrls.push(b);
                                            });

                                            let found = null;
                                            for (const url of tryUrls) {
                                              try {
                                                const getr = await fetch(url, { method: 'GET', cache: 'no-store' });
                                                if (getr && getr.ok) {
                                                  const ct = (getr.headers.get('content-type') || '').toLowerCase();
                                                  if (ct.startsWith('image')) { found = url; break; }
                                                }
                                              } catch (err) { /* ignore */ }
                                            }

                                            if (found) {
                                              e.target.src = found + (found.indexOf('?') === -1 ? ('?cb=' + Date.now()) : ('&cb=' + Date.now()));
                                              return;
                                            }

                                            // final fallback SVG
                                            const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect fill="#eef2f7" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-size="18">No image</text></svg>';
                                            e.target.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
                                          } catch (err) {
                                            try { e.target.style.display = 'none'; } catch (err2) { }
                                            console.error("image fallback error", err);
                                          }
                                        }}
                                      />
                                    );
                                  } else {
                                    // no id/path available -> simple placeholder (unchanged)
                                    return (
                                      <div className="modal-image-placeholder">
                                        <i className="bi bi-person-square"></i>
                                        <span>No image</span>
                                      </div>
                                    );
                                  }
                                })()

                              ) : (
                                <div className="modal-image-placeholder">
                                  <i className="bi bi-person-square"></i>
                                  <span>No image</span>
                                </div>

                              )}

                            </div>
                          </div>
                        </div>
                      </div>

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
