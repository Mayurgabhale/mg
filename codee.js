INFO:root:Connected to ACVSCore on SRVWUPNQ0986V using SQL auth (region apac).
INFO:root:get_personnel_info: found ObjectID=2097186314 Email=Lejemp.Abrea@wu.com for candidate=312458
INFO:root:Connected to ACVSCore on SRVWUPNQ0986V using SQL auth (region apac).
INFO:root:get_personnel_info: found ObjectID=2097186314 Email=Lejemp.Abrea@wu.com for candidate=312458
INFO:root:Connected to ACVSCore on SRVWUPNQ0986V using SQL auth (region apac).
INFO:root:get_personnel_info: found ObjectID=2097186314 Email=Lejemp.Abrea@wu.com for candidate=312458
INFO:root:Connected to ACVSCore on SRVWUPNQ0986V using SQL auth (region apac).
INFO:root:get_personnel_info: found ObjectID=2097186314 Email=Lejemp.Abrea@wu.com for candidate=312458    
INFO:root:Connected to ACVSCore on SRVWUPNQ0986V using SQL auth (region apac).
INFO:root:get_personnel_info: found ObjectID=2097186314 Email=Lejemp.Abrea@wu.com for candidate=312458    
INFO:werkzeug:127.0.0.1 - - [20/Nov/2025 16:30:03] "GET /record?employee_id=312458 HTTP/1.1" 200 -        


  img is not disply read belwo all code careflly, chekc why image is not disoly 
var flaggedCount = (summary && typeof summary.flagged_rows === 'number') ? summary.flagged_rows : (rows ? rows.filter(function (r) { return !!(r.Reasons || r.DetectedScenarios); }).length : 0);
        var flaggedPct = rowsCount ? Math.round((flaggedCount * 100) / (rowsCount || 1)) : 0;

        // helper to get display label for current region
        function regionDisplayLabel(key) {
          if (!key) return '';
          return (REGION_OPTIONS[key] && REGION_OPTIONS[key].label) ? REGION_OPTIONS[key].label : key.toUpperCase();
        }

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
                    <div className="muted">Showing {filtered.length} / {rows.length} rows</div>
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
                          <th className="small">ViolationDaysLast90</th>
                          <th className="small">Reasons</th>
                          <th className="small">Evidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageRows.map(function (r, idx) {
                          var empName = sanitizeName(r);
                          var displayDate = safeDateDisplay(r.DisplayDate || r.Date || r.DateOnly || r.FirstSwipe || r.LastSwipe);
                          // var durText = r.Duration || (r.DurationMinutes ? Math.round(r.DurationMinutes) + " min" : (r.DurationSeconds ? formatSecondsToHmsJS(r.DurationSeconds) : ""));

                          var durText = r.Duration
                            || (r.DurationSeconds ? formatSecondsToHmJS(Number(r.DurationSeconds))
                              : (r.DurationMinutes ? formatSecondsToHmJS(Number(r.DurationMinutes) * 60) : ""));


                          var flagged = r.Reasons && String(r.Reasons).trim();
                          return (
                            <tr key={idx} className={flagged ? "flagged-row" : ""}>
                              <td className="row-click" onClick={function () { openEvidence(r); }}>{empName || <span className="muted">—</span>}</td>
                              <td className="small">{r.EmployeeID || ""}</td>
                              <td className="small">{r.CardNumber || ""}</td>
                              <td className="small">{displayDate}</td>
                              <td className="small">{durText}</td>
                              <td className="small">
                                {(r.ViolationDaysLast90 !== undefined && r.ViolationDaysLast90 !== null && r.ViolationDaysLast90 !== "")
                                  ? (Number(r.ViolationDaysLast90).toString())
                                  : ((r.ViolationDaysLast_90 !== undefined && r.ViolationDaysLast_90 !== null && r.ViolationDaysLast_90 !== "")
                                    ? String(r.ViolationDaysLast_90)
                                    : ((r.ViolationDays !== undefined && r.ViolationDays !== null) ? String(r.ViolationDays) : "")
                                  )
                                }
                              </td>
                              <td className="small">{renderReasonChips(r.Reasons || r.DetectedScenarios)}</td>
                              <td className="small">
                                <button className="evidence-btn" onClick={function () { openEvidence(r); }}>Evidence</button>
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

{(modalDetails && modalDetails.aggregated_rows && modalDetails.aggregated_rows.length > 0) ? (


  (() => {
  // prefer aggregated row but fall back to raw_swipes first row
  const md = (modalDetails && modalDetails.aggregated_rows && modalDetails.aggregated_rows[0])
            || (modalDetails && modalDetails.raw_swipes && modalDetails.raw_swipes[0])
            || {};
  // candidate image key names (common variants)
  const candidateImageKeys = ['imageUrl','image_url','ImageUrl','image','Image','img','imgUrl','ImagePath','Photo','PhotoUrl','EmployeePhoto','photo','photoUrl'];
  let imgPath = candidateImageKeys.map(k => (md && md[k]) ? md[k] : null).find(Boolean) || null;

  // build a prioritized list of identifier tokens to try (prefer ObjectID / GUID)
  const idCandidates = [];
  if (md && md.ObjectID) idCandidates.push(String(md.ObjectID));
  if (md && md.ObjectId) idCandidates.push(String(md.ObjectId));
  if (md && md.GUID) idCandidates.push(String(md.GUID));
  if (md && md.GUID0) idCandidates.push(String(md.GUID0));
  if (md && md.EmployeeID) idCandidates.push(String(md.EmployeeID));
  if (md && md.person_uid) idCandidates.push(String(md.person_uid));
  if (modalRow && modalRow.EmployeeID) idCandidates.push(String(modalRow.EmployeeID));
  if (modalRow && modalRow.person_uid) idCandidates.push(String(modalRow.person_uid));

  // Deduplicate preserving order
  const uniqIds = idCandidates.filter((v, i) => v && idCandidates.indexOf(v) === i);

  // If we didn't get an explicit image path, build one from the top id candidate
  if (!imgPath && uniqIds.length) {
    imgPath = `/employee/${encodeURIComponent(uniqIds[0])}/image`;
  }

  if (imgPath) {
    const imgSrc = resolveApiImageUrl(imgPath) || imgPath;
      console.log("Final Image URL:", imgSrc);
    return (
      <img
        className="modal-image"
        src={imgSrc}
        alt={sanitizeName(modalRow) || "Employee image"}
        onLoad={(e) => { try { console.info("employee image loaded:", e.target.src); } catch (err) {} }}
        onError={async (e) => {
          try {
            e.target.onerror = null;
            console.warn("image load failed for:", e.target.src);

            // Try a single cache-busted retry for the same URL, then try the API variants once each.
            const tryUrls = [];
            const original = e.target.src;
            tryUrls.push(original + (original.indexOf('?') === -1 ? '?cb=' + Date.now() : '&cb=' + Date.now()));

            // try both API variants for the top id candidates (constructed earlier as uniqIds)
            uniqIds.forEach(id => {
              if (!id) return;
              const a = resolveApiImageUrl(`/api/employees/${encodeURIComponent(id)}/image`);
              const b = resolveApiImageUrl(`/employee/${encodeURIComponent(id)}/image`);
              if (a && tryUrls.indexOf(a) === -1) tryUrls.push(a);
              if (b && tryUrls.indexOf(b) === -1) tryUrls.push(b);
            });

            // Try each URL (GET) until one returns image content-type and ok
            let found = null;
            for (const url of tryUrls) {
              try {
                // some servers block fetch for cross-origin images — guard with try/catch
                const getr = await fetch(url, { method: 'GET', cache: 'no-store' });
                if (getr && getr.ok) {
                  const ct = (getr.headers.get('content-type') || '').toLowerCase();
                  if (ct.startsWith('image')) { found = url; break; }
                }
              } catch (err) {
                // ignore fetch/CORS errors and continue to next candidate
              }
            }

            if (found) {
              e.target.src = found + (found.indexOf('?') === -1 ? ('?cb=' + Date.now()) : ('&cb=' + Date.now()));
              return;
            }

            // Final fallback: inline SVG placeholder
            const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect fill="#eef2f7" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-size="18">No image</text></svg>';
            e.target.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
          } catch (err) {
            try { e.target.style.display = 'none'; } catch (err2) {}
            console.error("image fallback error", err);
          }
        }}
      />
    );
  } else {
    return <div className="modal-image-placeholder">No image</div>;
  }
})()


) : (
  <div className="-image-placeholder">
    <i className="bi bi-person-square"></i>
    <span>No image</span>
  </div>
)}
