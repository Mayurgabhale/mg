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

   read this above for like this table i want to create anothe one table, but in different file 
ok, or as it is table, but this is opne differet page ok , fomr button or new rabout anything but same header, for boh index.html and now we create this new file, for boht 
in this ok, ok, so read the this code all, and i give you part one and part second code alos above ok , so read the all code, and create new file for this, 
 can you do this, but creae carefull, wiht same header ok, and right now i want one this tabel on this new file ok,
 so read all code carefully, and give me correct code ok, i hove you undrstadn better what i want 

        return (
          <div className="container" aria-live="polite">
            {loading && (
              <div className="spinner-overlay" role="status" aria-label="Loading">
                <div className="spinner-box">
                  <div className="spinner" />
                  <div style={{ fontWeight: 700 }}>Loading…</div>
                </div>
              </div>
            )}

            <div className="topbar" role="banner">
              <div className="wu-brand" aria-hidden={false}>
                <div className="wu-logo">WU</div>
                <div className="title-block">
                  <h1>Western Union — Trend Analysis</h1>
                  <p style={{ margin: 0, fontSize: 13 }}>
                    {regionDisplayLabel(selectedRegion)} {selectedLocation && selectedLocation !== "All locations" ? "— " + selectedLocation : ""}
                  </p>
                </div>
              </div>

              <div className="header-actions" role="region" aria-label="controls">
                <div className="control">
                  <label className="small" htmlFor="fromDate">From</label>
                  <input id="fromDate" ref={fromRef} className="date-input" type="text" placeholder="YYYY-MM-DD" />
                </div>

                <div className="control">
                  <label className="small" htmlFor="toDate">To</label>
                  <input id="toDate" ref={toRef} className="date-input" type="text" placeholder="YYYY-MM-DD" />
                </div>

                <button className="btn-primary" onClick={runForRange} disabled={loading}>Run</button>
                <button className="btn-ghost" onClick={loadLatest} disabled={loading}>Load latest</button>
              </div>
            </div>

            <div className="card-shell">
              <div className="cards" aria-hidden={loading}>
                <div className="card" title="Rows analysed">
                  <div className="card-content">
                    <div className="card-text">
                      <h3>{(rowsCount !== undefined && rowsCount !== null) ? rowsCount.toLocaleString() : 0}</h3>
                      <p>Rows analysed</p>
                    </div>
                  </div>
                </div>
                <div className="card card-flagged" title="Flagged rows">
                  <div className="card-content">
                    <div className="card-text">
                      <h3>{(flaggedCount !== undefined && flaggedCount !== null) ? flaggedCount.toLocaleString() : 0}</h3>
                      <p>Flagged rows</p>
                    </div>
                  </div>
                </div>
                <div className="card card-rate" title="Flagged rate">
                  <div className="card-content">
                    <div className="card-text">
                      <h3>{flaggedPct}%</h3>
                      <p>Flagged rate</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="main">
                <div className="left">
                  <div className="chart-wrap" aria-label="Risk level chart">
                    <canvas ref={chartRef}></canvas>
                  </div>




                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <input placeholder="Search name, employee id, card or reason..." value={filterText} onChange={function (e) { setFilterText(e.target.value); setPage(1); }} style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #e6edf3' }} />

                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
                      <input type="checkbox" checked={collapseDuplicates} onChange={(e) => { setCollapseDuplicates(e.target.checked); setPage(1); }} />
                      <span className="small muted">Collapse duplicates</span>
                    </label>

                    <div className="muted">
                      Showing {collapseDuplicates ? (Array.isArray(aggregatedFiltered) ? aggregatedFiltered.length : filtered.length) : filtered.length} / {rows.length} rows
                    </div>

                    <button className="small-button" onClick={exportFiltered}>Export filtered</button>
                    {selectedRiskFilter ? <button className="small-button" onClick={clearRiskFilter}>Clear risk filter</button> : null}
                  </div>



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
                    <div className="muted">Page {page} / {totalPages}</div>
                    <button onClick={function () { setPage(function (p) { return Math.min(totalPages, p + 1); }); }} disabled={page >= totalPages}>Next</button>
                  </div>
                </div>

                <aside className="right" aria-label="side panel">

                  {/* NEW: Region & Location controls */}
                  <div className="sidebar-section" style={{ marginBottom: 12 }}>
                    <strong>Risk filters</strong>
                    <div className="small muted" style={{ marginTop: 6 }}>Select Region and Location to scope the run.</div>

                    <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <label className="small">Region</label>
                        <select
                          value={selectedRegion}
                          onChange={(e) => { setSelectedRegion(e.target.value); setPage(1); }}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #e2e8f0' }}
                        >
                          {Object.keys(REGION_OPTIONS).map(k => (
                            <option key={k} value={k}>{REGION_OPTIONS[k].label}</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ flex: 1 }}>
                        <label className="small">Location</label>
                        <select
                          value={selectedLocation}
                          onChange={(e) => { setSelectedLocation(e.target.value); setPage(1); }}
                          style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #e2e8f0' }}
                        >
                          <option key="__all" value="All locations">All locations</option>
                          {(REGION_OPTIONS[selectedRegion] && REGION_OPTIONS[selectedRegion].partitions || []).map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>


                      {/* NEW: Employee ID input placed next to Region & Location */}

                      <div style={{ flex: 1 }}>
                        <label className="small">Employee ID </label>
                        <input
                          value={employeeId}
                          onChange={(e) => { setEmployeeId(e.target.value); setPage(1); }}
                          placeholder="Enter Employee ID e.g. 326131"
                          style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #e2e8f0' }}
                        />
                      </div>
                    </div>
                  </div>



                  {/* existing risk chips */}
                  <div className="sidebar-section">
                    <div className="risk-filter-list" style={{ marginTop: 8 }}>
                      {RISK_LABELS.map((lab) => {
                        const cnt = (riskCounts && riskCounts[lab]) ? riskCounts[lab] : 0;
                        const active = selectedRiskFilter === lab;
                        return (
                          <div key={lab} role="button" tabIndex={0} aria-pressed={active} className={"risk-chip " + (active ? "active" : "")} onClick={function () { handleRiskBarClick(lab); }} onKeyDown={function (e) { if (e.key === 'Enter' || e.key === ' ') { handleRiskBarClick(lab); } }}>
                            <div style={{ width: 10, height: 10, borderRadius: 999, background: RISK_COLORS[lab], boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}></div>
                            <div style={{ fontSize: 13 }}>{lab} <span className="muted" style={{ marginLeft: 6 }}>({cnt})</span></div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ marginTop: 8 }}>
                      <button className="small-button" onClick={clearRiskFilter}>Clear risk filter</button>
                    </div>
                  </div>


                  <div className="sidebar-section" style={{ marginTop: 12 }}>
                    <strong>Top reasons summary</strong>
                    <div className="small muted" style={{ marginTop: 6 }}>Click a reason to filter the table by that reason. Click again to clear.</div>

                    <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                      <input placeholder="Filter reason list..." value={reasonFilterText} onChange={function (e) { setReasonFilterText(e.target.value); }} style={{ flex: 1, padding: '6px 8px', borderRadius: 6, border: '1px solid #e2e8f0' }} />
                      <button className="small-button" onClick={function () { setSelectedReason(''); setReasonFilterText(''); }}>Clear</button>
                    </div>

                    <div style={{ marginTop: 8, maxHeight: 320, overflow: 'auto' }}>
                      {Object.keys(reasonsCount).length === 0 && <div className="muted">No flags found</div>}
                      {Object.entries(reasonsCount).sort(function (a, b) { return b[1] - a[1]; }).filter(function (kv) {
                        var name = kv[0];
                        if (!reasonFilterText) return true;
                        return name.toLowerCase().indexOf(reasonFilterText.toLowerCase()) !== -1;
                      }).slice(0, 50).map(function (kv) {
                        var name = kv[0], count = kv[1];
                        var active = selectedReason === name;
                        return (
                          <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                            <button className={"chip " + (active ? "active" : "")} style={{ textAlign: 'left', flex: 1 }} onClick={function () { onReasonClick(name); }}>
                              {name}
                            </button>
                            <div style={{ minWidth: 48, textAlign: 'right' }} className="small"><b>{count}</b></div>
                          </div>
                        );
                      })}

                    </div>
                  </div>
                </aside>
              </div>
            </div>




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

            <button className="chat-fab" title="Ask Trend Details (Ask Me )" onClick={() => setChatOpen(true)} aria-label="Open chat">
              <span className="meta-icon"><img src="chat-bot.png" alt="" /></span>
            </button>


            {chatOpen && (
              <div className="chat-modal" role="dialog" aria-modal="true" aria-label="Trend Chatbot">
                <div className="chat-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontWeight: 800 }}><img src="chat-bot.png" alt="" style={{ width: 36, height: 36, }} /></div>
                    <div>
                      <div className="title">Ask me — Trend Details</div>
                      <div style={{ fontSize: 12, opacity: 0.85 }}>Ask trend & risk questions</div>
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <button className="small-button bot-close" onClick={() => { setChatOpen(false); }}>Close</button>
                  </div>
                </div>

                <div className="chat-body">
                  {chatMessages.length === 0 && (
                    <div style={{ color: '#64748b', fontSize: 13 }}>
                      Hi — ask about trends (e.g. "Who is high risk today"). Use the quick prompts below.
                    </div>
                  )}
                  {chatMessages.map((m, i) => (
                    <div key={i} style={{ display: 'block' }}>
                      <div className={"chat-bubble " + (m.who === 'user' ? 'user' : 'bot')}>
                        {m.text}
                        {m.who === 'bot' && m.evidence && m.evidence.length > 0 && (
                          <div className="chat-evidence">
                            <strong>Evidence</strong>
                            <div style={{ marginTop: 6 }}>{m.evidence.slice(0, 5).map((e, j) => (<div key={j}>{typeof e === 'string' ? e : JSON.stringify(e)}</div>))}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {chatLoading && <div className="chat-loading" style={{ marginTop: 6 }}>Thinking…</div>}
                  <div style={{ marginTop: 8 }} className="quick-prompts" aria-hidden={chatLoading}>
                    {QUICK_PROMPTS.map((q, idx) => (
                      <button key={idx} onClick={() => useQuickPrompt(q)} disabled={chatLoading}>{q}</button>
                    ))}
                  </div>
                </div>

                <div className="chat-input-row">
                  <input
                    className="chat-input"
                    placeholder="Type a question, e.g. 'Who is high risk today'…"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(chatInput); } }}
                  />
                  <button className="chat-send-btn" onClick={() => sendChat(chatInput)} disabled={chatLoading}>Send</button>
                </div>
              </div>
            )}

          </div>
        );
      }
