Reasons Flaggedi I WANT TO ADD IN TABLE, HOW TO ADD 

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
// compute dayStart flags so first-of-day gaps become 0 (mirror render logic)
          const flags = new Array(arr.length).fill(null).map(() => ({ dayStart: false }));
          for (let i = 0; i < arr.length; i++) {
            const cur = arr[i];
            const prev = arr[i - 1];
            const curDate = cur.__logical_date || (cur.DateOnly ? String(cur.DateOnly).slice(0, 10) : (cur.Date ? String(cur.Date).slice(0, 10) : null));
            const prevDate = prev ? (prev.__logical_date || (prev.DateOnly ? String(prev.DateOnly).slice(0, 10) : (prev.Date ? String(prev.Date).slice(0, 10) : null))) : null;
            if (!prev || prevDate !== curDate) flags[i].dayStart = true;
          }
          for (let i = 0; i < arr.length; i++) {
            if (flags[i].dayStart) arr[i].__gap = 0;
          }

          return arr;
        }

        // NEW: export timeline to an Excel-friendly file (HTML table xls)
        function exportTimelineExcel() {
          if (!modalDetails || !modalDetails.raw_swipes || modalDetails.raw_swipes.length === 0) {
            alert("No timeline data to export.");
            return;
          }
          try {
            const rows = getTimelineRows(modalDetails);
            const cols = ["Employee Name", "Employee ID", "Card", "Date", "Time", "SwipeGap", "Door", "Direction", "Zone", "Note"];
            let html = '<html><head><meta charset="utf-8" /></head><body>';
            html += '<table border="1"><thead><tr>';
            cols.forEach(c => { html += '<th>' + c + '</th>'; });
            html += '</tr></thead><tbody>';

            rows.forEach((r, idx) => {
              const g = (r.__gap !== undefined && r.__gap !== null) ? Number(r.__gap) : null;
              const isDayStart = (r.__gap === 0);
              const gapFormatted = isDayStart ? formatSecondsToHmsJS(0) : ((r.SwipeGap && String(r.SwipeGap).trim()) ? String(r.SwipeGap) : (g !== null && g !== undefined ? formatSecondsToHmsJS(g) : "-"));
              const displayDate = r.__logical_date || (r.DateOnly ? String(r.DateOnly).slice(0, 10) : (r.Date ? String(r.Date).slice(0, 10) : '-'));
              const displayTime = r.Time || (r.__ts ? r.__ts.toTimeString().slice(0, 8) : '-');

              html += '<tr>';
              html += '<td>' + (r.EmployeeName || '') + '</td>';
              html += '<td>' + (r.EmployeeID || r.person_uid || '') + '</td>';
              html += '<td>' + (r.CardNumber || r.Card || '') + '</td>';
              html += '<td>' + displayDate + '</td>';
              html += '<td>' + displayTime + '</td>';
              html += '<td>' + gapFormatted + '</td>';
              html += '<td>' + (r.Door || '') + '</td>';
              html += '<td>' + (r.Direction || '') + '</td>';
              html += '<td>' + (r.Zone || '') + '</td>';
              html += '<td>' + (r.Note || '') + '</td>';
              html += '</tr>';
            });

            html += '</tbody></table></body></html>';

            const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
            const pid = (modalRow && (modalRow.EmployeeID || modalRow.person_uid)) ? (modalRow.EmployeeID || modalRow.person_uid) : 'unknown';
            const dateTag = (modalRow && (modalRow.Date || modalRow.DateOnly)) ? String(modalRow.Date || modalRow.DateOnly).slice(0, 10).replace(/:/g, '-') : formatDateISO(new Date());
            const filename = `swipe_timeline_${pid}_${dateTag}.xls`;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
          } catch (err) {
            console.error("Export timeline failed", err);
            alert("Failed to export timeline: " + err.message);
          }
        }



        // REPLACE the existing buildAggregated(rowsArr) function with this version
        function buildAggregated(rowsArr) {
          var map = new Map();
          rowsArr.forEach(function (r) {
            var id = r.EmployeeID || r.person_uid || (sanitizeName(r) + '|' + (r.CardNumber || r.Card || ''));
            var key = String(id);
            if (!map.has(key)) {
              map.set(key, {
                EmployeeName: sanitizeName(r),
                EmployeeID: r.EmployeeID || r.person_uid || "",
                CardNumber: r.CardNumber || r.Card || "",
                ViolationCount: 0,
                ReasonsSet: new Set(),
                ViolationDays: 0,            // init
                ViolationWindowDays: null,
                ViolationDaysLast90: 0,
                RiskLevel: null,            // init chosen risk label
                RiskScore: null,            // optional numeric score if available
                FirstRow: r,
                _rows: []
              });
            }
            var agg = map.get(key);
            agg.ViolationCount += 1;
            agg._rows.push(r);

            // collect reasons
            var reasonsField = r.Reasons || r.DetectedScenarios || r.Detected || "";
            String(reasonsField).split(";").map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (p) { agg.ReasonsSet.add(p); });

            // pick a representative violation count (prefer explicit ViolationDays)
            var candidateCount = null;
            if (r.ViolationDays !== undefined && r.ViolationDays !== null && r.ViolationDays !== "") candidateCount = Number(r.ViolationDays);
            else if (r.ViolationDaysLast !== undefined && r.ViolationDaysLast !== null && r.ViolationDaysLast !== "") candidateCount = Number(r.ViolationDaysLast);
            else if (r.ViolationDaysLast90 !== undefined && r.ViolationDaysLast90 !== null && r.ViolationDaysLast90 !== "") candidateCount = Number(r.ViolationDaysLast90);
            else if (r.ViolationDaysLast_90 !== undefined && r.ViolationDaysLast_90 !== null && r.ViolationDaysLast_90 !== "") candidateCount = Number(r.ViolationDaysLast_90);
            if (candidateCount !== null && !isNaN(candidateCount)) {
              agg.ViolationDays = Math.max(agg.ViolationDays || 0, candidateCount);
            }

            // capture window if present
            if (r.ViolationWindowDays !== undefined && r.ViolationWindowDays !== null && r.ViolationWindowDays !== "") {
              agg.ViolationWindowDays = r.ViolationWindowDays;
            }

            // ---- NEW: pick highest severity risk label for this person across their rows ----
            try {
              var rowRisk = getRiskLabelForRow(r) || null;
              var rowScore = (r.RiskScore !== undefined && r.RiskScore !== null) ? Number(r.RiskScore) : null;
              function severityForLabel(label) {
                var map = { "Low": 1, "Low Medium": 2, "Medium": 3, "Medium High": 4, "High": 5 };
                if (!label) return 1;
                return map[String(label)] || 1;
              }
              if (rowRisk) {
                var currentSeverity = severityForLabel(agg.RiskLevel);
                var thisSeverity = severityForLabel(rowRisk);
                if (!agg.RiskLevel || thisSeverity > currentSeverity) {
                  agg.RiskLevel = rowRisk;
                }
              }
              if (rowScore !== null && (!agg.RiskScore || Number(rowScore) > Number(agg.RiskScore))) {
                agg.RiskScore = Number(rowScore);
              }
            } catch (err) {
              // ignore - keep fallbacks
            }
          });

          var out = [];
          map.forEach(function (val, key) {
            out.push({
              EmployeeName: val.EmployeeName,
              EmployeeID: val.EmployeeID,
              CardNumber: val.CardNumber,
              ViolationCount: val.ViolationCount,
              Reasons: Array.from(val.ReasonsSet).join(";"),
              ViolationDays: val.ViolationDays || 0,
              ViolationWindowDays: val.ViolationWindowDays || null,
              ViolationDaysLast90: val.ViolationDaysLast90 || 0,
              // NEW: expose aggregated risk to table rows
              RiskLevel: val.RiskLevel || null,
              RiskScore: val.RiskScore || null,
              FirstRow: val.FirstRow,
              _rows: val._rows
            });
          });

          // sort aggregated by ViolationDays (if present) else ViolationCount, descending, then by name
          out.sort(function (a, b) {
            var aVal = (a.ViolationDays !== undefined && a.ViolationDays !== null) ? Number(a.ViolationDays) : (a.ViolationCount || 0);
            var bVal = (b.ViolationDays !== undefined && b.ViolationDays !== null) ? Number(b.ViolationDays) : (b.ViolationCount || 0);
            if (bVal !== aVal) return bVal - aVal;
            return (a.EmployeeName || "").localeCompare(b.EmployeeName || "");
          });

          return out;
        }



        // build aggregatedFiltered only if collapseDuplicates is enabled
        var aggregatedFiltered = collapseDuplicates ? buildAggregated(filtered) : null;

        // set up pagination source
        var sourceForPaging = collapseDuplicates ? (aggregatedFiltered || []) : filtered;

        var totalPages = Math.max(1, Math.ceil((sourceForPaging.length || 0) / pageSize));
        var pageRows = (sourceForPaging || []).slice((page - 1) * pageSize, page * pageSize);




        var totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
        var pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);


        function exportFiltered() { downloadCSV(collapseDuplicates ? (aggregatedFiltered || []) : filtered, "trend_filtered_export.csv"); }


        function onReasonClick(reason) {
          if (!reason) { setSelectedReason(""); return; }
          if (selectedReason === reason) setSelectedReason(""); else setSelectedReason(reason);
          setPage(1);
        }


        async function openEvidence(row) {
          // open modal quickly with the basic clicked row so UI responds immediately
          setModalRow(row || {});
          setModalDetails(null);
          setModalLoading(true);

          try {
            // fetch full record for this employee
            const q = encodeURIComponent(row.EmployeeID || row.person_uid || "");
            const resp = await fetch(API_BASE + "/record?employee_id=" + q);
            if (!resp.ok) {
              const txt = await resp.text().catch(() => '');
              throw new Error("record failed: " + resp.status + " - " + txt);
            }
