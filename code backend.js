http://localhost:8080/analysis_table.html 
  C:\Users\W0024618\Trend-Analysis\frontend\analysis_table.html
this page disply emplty not disply anything in this page, 
  blank page show 
      <button
  className="btn-ghost"
  onClick={() => { window.location.href = 'analysis_table.html'; }}
  disabled={loading}
>
  Open table page
</button>

              <div classN
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Behaviour Analysis — Table Only</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <!-- React + ReactDOM + Babel (quick prototyping) -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script crossorigin src="https://unpkg.com/babel-standalone@6.26.0/babel.min.js"></script>

  <!-- Flatpickr (same as main) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
  <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
  <link rel="stylesheet" href="style.css">

  <style>
    /* slight local adjustments so this page looks clean even if style.css differs */
    body { background: #f7fafc; }
    .topbar { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:12px 16px; background:#fff; border-radius:8px; margin:12px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
    .container { max-width:1200px; margin:0 auto; padding-bottom: 40px; }
    .table-scroll { background:#fff; border-radius:8px; padding:12px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
    table { width:100%; border-collapse:collapse; }
    thead th { text-align:left; padding:10px 8px; border-bottom:1px solid #eef2f7; }
    tbody td { padding:8px; border-bottom:1px solid #f1f5f9; }
    .small { font-size:12px; color:#475569; }
    .muted { color:#64748b; }
    .btn-primary, .btn-ghost, .small-button { cursor:pointer; }
  </style>
</head>

<body>
  <div id="root"></div>

  <script type="text/babel">
    (function () {
      const { useState, useEffect, useRef } = React;

      // POINT AT YOUR API (same default as in your main app)
      const API_BASE = "http://10.138.161.4:8002";

      // copy helper functions (kept minimal & compatible)
      function pad(n) { return n.toString().padStart(2, '0'); }
      function formatDateISO(d) {
        if (!d) return "";
        const dt = (d instanceof Date) ? d : new Date(d);
        return dt.getFullYear() + "-" + pad(dt.getMonth() + 1) + "-" + pad(dt.getDate());
      }
      function formatSecondsToHmJS(seconds) {
        if (seconds === null || seconds === undefined || seconds === '') return "-";
        const n = Number(seconds);
        if (isNaN(n) || !isFinite(n)) return "-";
        const s = Math.max(0, Math.floor(n));
        const hh = Math.floor(s / 3600);
        const mm = Math.floor((s % 3600) / 60);
        return String(hh) + ":" + String(mm).padStart(2, '0');
      }
      function sanitizeName(row) {
        if (!row) return "";
        return row.EmployeeName_feat || row.EmployeeName_dur || row.EmployeeName || row.ObjectName1 || row.objectname1 || row.employee_name || row.person_uid || "";
      }

      function downloadCSV(rows, filename) {
        if (!rows || !rows.length) { alert("No rows to export"); return; }
        var cols = Object.keys(rows[0]);
        var lines = [cols.join(",")];
        rows.forEach(function (r) {
          var row = cols.map(function (c) {
            var v = (r[c] === undefined || r[c] === null) ? "" : String(r[c]).replace(/\n/g, ' ');
            return JSON.stringify(v);
          }).join(",");
          lines.push(row);
        });
        var blob = new Blob([lines.join("\n")], { type: 'text/csv' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a'); a.href = url; a.download = filename || 'export.csv'; a.click(); URL.revokeObjectURL(url);
      }

      // small render utilities (reasons chips simple)
      function renderReasonChips(reasonText) {
        if (!reasonText) return React.createElement('span', { className: 'muted' }, '—');
        const parts = String(reasonText).split(";").map(s => s.trim()).filter(Boolean);
        return parts.map((p, idx) => React.createElement('span', { key: idx, className: 'pill', title: p, style:{marginRight:6} }, p));
      }

      // buildAggregated (same behaviour as your app's aggregated function)
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
              ViolationDays: 0,
              ViolationWindowDays: null,
              ViolationDaysLast90: 0,
              RiskLevel: null,
              RiskScore: null,
              FirstRow: r,
              _rows: []
            });
          }
          var agg = map.get(key);
          agg.ViolationCount += 1;
          agg._rows.push(r);

          var reasonsField = r.Reasons || r.DetectedScenarios || r.Detected || "";
          String(reasonsField).split(";").map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (p) { agg.ReasonsSet.add(p); });

          var candidateCount = null;
          if (r.ViolationDays !== undefined && r.ViolationDays !== null && r.ViolationDays !== "") candidateCount = Number(r.ViolationDays);
          else if (r.ViolationDaysLast !== undefined && r.ViolationDaysLast !== null && r.ViolationDaysLast !== "") candidateCount = Number(r.ViolationDaysLast);
          else if (r.ViolationDaysLast90 !== undefined && r.ViolationDaysLast90 !== null && r.ViolationDaysLast90 !== "") candidateCount = Number(r.ViolationDaysLast90);
          else if (r.ViolationDaysLast_90 !== undefined && r.ViolationDaysLast_90 !== null && r.ViolationDaysLast_90 !== "") candidateCount = Number(r.ViolationDaysLast_90);
          if (candidateCount !== null && !isNaN(candidateCount)) {
            agg.ViolationDays = Math.max(agg.ViolationDays || 0, candidateCount);
          }

          if (r.ViolationWindowDays !== undefined && r.ViolationWindowDays !== null && r.ViolationWindowDays !== "") {
            agg.ViolationWindowDays = r.ViolationWindowDays;
          }

          // pick highest severity risk label across person's rows (best-effort)
          try {
            var rowRisk = r.RiskLevel || r.Risk || null;
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
          } catch (err) { /* ignore */ }
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
            RiskLevel: val.RiskLevel || null,
            RiskScore: val.RiskScore || null,
            FirstRow: val.FirstRow,
            _rows: val._rows
          });
        });

        out.sort(function (a, b) {
          var aVal = (a.ViolationDays !== undefined && a.ViolationDays !== null) ? Number(a.ViolationDays) : (a.ViolationCount || 0);
          var bVal = (b.ViolationDays !== undefined && b.ViolationDays !== null) ? Number(b.ViolationDays) : (b.ViolationCount || 0);
          if (bVal !== aVal) return bVal - aVal;
          return (a.EmployeeName || "").localeCompare(b.EmployeeName || "");
        });

        return out;
      }

      // Region mapping (small copy from main)
      const REGION_OPTIONS = {
        "apac": { label: "APAC", partitions: ["Pune", "Quezon City", "Taguig City", "MY.Kuala Lumpur", "IN.HYD", "SG.Singapore"] },
        "emea": { label: "EMEA", partitions: ["LT.Vilnius", "IT.Rome", "UK.London", "IE.DUblin", "DU.Abu Dhab", "ES.Madrid"] },
        "laca": { label: "LACA", partitions: ["AR.Cordoba", "BR.Sao Paulo", "CR.Costa Rica Partition", "PA.Panama City", "PE.Lima", "MX.Mexico City"] },
        "namer": { label: "NAMER", partitions: ["Denver", "Austin Texas", "Miami", "New York"] }
      };
      const LOCATION_QUERY_VALUE = {
        "apac": { "Pune": "Pune", "Quezon City": "Quezon City", "Taguig City": "Taguig City", "MY.Kuala Lumpur": "MY.Kuala Lumpur", "IN.HYD": "IN.HYD", "SG.Singapore": "SG.Singapore" },
        "namer": { "Denver": "US.CO.OBS", "Austin Texas": "USA/Canada Default", "Miami": "US.FL.Miami", "New York": "US.NYC" },
        "emea": {}, "laca": {}
      };

      function TableOnlyApp() {
        var yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
        const [dateFrom, setDateFrom] = useState(formatDateISO(yesterday));
        const [dateTo, setDateTo] = useState(formatDateISO(new Date()));
        const [rows, setRows] = useState([]);
        const [loading, setLoading] = useState(false);
        const [selectedRegion, setSelectedRegion] = useState("apac");
        const [selectedLocation, setSelectedLocation] = useState("All locations");
        const [employeeId, setEmployeeId] = useState("");
        const [filterText, setFilterText] = useState("");
        const [collapseDuplicates, setCollapseDuplicates] = useState(true);
        const [page, setPage] = useState(1);
        const pageSize = 25;

        const fromRef = useRef(null);
        const toRef = useRef(null);
        const fromFp = useRef(null);
        const toFp = useRef(null);

        useEffect(() => {
          if (window.flatpickr && fromRef.current && toRef.current) {
            try { if (fromFp.current) fromFp.current.destroy(); } catch (e) {}
            try { if (toFp.current) toFp.current.destroy(); } catch (e) {}
            fromFp.current = window.flatpickr(fromRef.current, { dateFormat: "Y-m-d", defaultDate: dateFrom, allowInput: true, onChange: (sel) => { if (sel && sel.length) setDateFrom(formatDateISO(sel[0])); } });
            toFp.current = window.flatpickr(toRef.current, { dateFormat: "Y-m-d", defaultDate: dateTo, allowInput: true, onChange: (sel) => { if (sel && sel.length) setDateTo(formatDateISO(sel[0])); } });
          }
          // load latest on mount
          loadLatest();
          return () => { try{ if(fromFp.current) fromFp.current.destroy(); }catch(e){} try{ if(toFp.current) toFp.current.destroy(); }catch(e){}};
          // eslint-disable-next-line
        }, []);

        useEffect(() => {
          try { if (fromFp.current && dateFrom) fromFp.current.setDate(dateFrom, false); } catch (e) {}
          try { if (toFp.current && dateTo) toFp.current.setDate(dateTo, false); } catch (e) {}
        }, [dateFrom, dateTo]);

        useEffect(() => {
          setSelectedLocation("All locations");
        }, [selectedRegion]);

        async function runForRange() {
          setLoading(true);
          setRows([]);
          try {
            const start = encodeURIComponent(dateFrom);
            const end = encodeURIComponent(dateTo);
            let url = API_BASE + "/run?start=" + start + "&end=" + end + "&full=true";
            if (selectedRegion) url += "&region=" + encodeURIComponent(selectedRegion);
            if (selectedLocation && selectedLocation !== "All locations") {
              const mapForRegion = LOCATION_QUERY_VALUE[selectedRegion] || {};
              const queryCity = mapForRegion[selectedLocation] || selectedLocation;
              url += "&city=" + encodeURIComponent(queryCity);
            }
            if (employeeId && String(employeeId).trim() !== "") {
              url += "&employee_id=" + encodeURIComponent(String(employeeId).trim());
            }
            const r = await fetch(url, { method: 'GET' });
            if (!r.ok) { const txt = await r.text().catch(()=>''); throw new Error("API returned " + r.status + ": " + txt); }
            const js = await r.json();
            const sample = Array.isArray(js.sample) ? js.sample : (Array.isArray(js.flagged_persons) ? js.flagged_persons : []);
            setRows(sample || []);
            setPage(1);
          } catch (err) {
            alert("Error: " + err.message);
            console.error(err);
          } finally {
            setLoading(false);
          }
        }

        async function loadLatest() {
          setLoading(true);
          try {
            var d = new Date(); d.setDate(d.getDate() - 1);
            var yesterday = formatDateISO(d);
            setDateFrom(yesterday);
            setDateTo(yesterday);
            const start = encodeURIComponent(yesterday);
            const end = encodeURIComponent(yesterday);
            let url = API_BASE + "/run?start=" + start + "&end=" + end + "&full=true";
            if (selectedRegion) url += "&region=" + encodeURIComponent(selectedRegion);
            if (selectedLocation && selectedLocation !== "All locations") {
              const mapForRegion = LOCATION_QUERY_VALUE[selectedRegion] || {};
              const queryCity = mapForRegion[selectedLocation] || selectedLocation;
              url += "&city=" + encodeURIComponent(queryCity);
            }
            if (employeeId && String(employeeId).trim() !== "") {
              url += "&employee_id=" + encodeURIComponent(String(employeeId).trim());
            }
            const r = await fetch(url, { method: 'GET' });
            if (!r.ok) { const txt = await r.text().catch(()=>''); throw new Error("API returned " + r.status + ": " + txt); }
            const js = await r.json();
            const sample = Array.isArray(js.sample) ? js.sample : (Array.isArray(js.flagged_persons) ? js.flagged_persons : []);
            setRows(sample || []);
            setPage(1);
          } catch (err) {
            alert("Error: " + err.message);
            console.error(err);
          } finally {
            setLoading(false);
          }
        }

        // filtering
        const filtered = (rows || []).filter(function (r) {
          const hay = (sanitizeName(r) + " " + (r.EmployeeID || "") + " " + (r.CardNumber || "") + " " + (r.Reasons || r.DetectedScenarios || "")).toLowerCase();
          return !filterText || hay.indexOf(filterText.toLowerCase()) !== -1;
        });

        const aggregatedFiltered = collapseDuplicates ? buildAggregated(filtered) : null;
        const sourceForPaging = collapseDuplicates ? (aggregatedFiltered || []) : filtered;
        const totalPages = Math.max(1, Math.ceil((sourceForPaging.length || 0) / pageSize));
        const pageRows = (sourceForPaging || []).slice((page - 1) * pageSize, page * pageSize);

        function exportFiltered() { downloadCSV(collapseDuplicates ? (aggregatedFiltered || []) : filtered, "table_filtered_export.csv"); }

        return (
          <div className="container" aria-live="polite">
            <div className="topbar" role="banner">
              <div style={{display:'flex', alignItems:'center', gap:12}}>
                <div className="wu-logo" style={{fontWeight:800}}>WU</div>
                <div>
                  <h2 style={{margin:0}}>Trend — Table Only</h2>
                  <div className="small muted">{REGION_OPTIONS[selectedRegion] && REGION_OPTIONS[selectedRegion].label}</div>
                </div>
              </div>

              <div style={{display:'flex', gap:8, alignItems:'center'}}>
                <button className="btn-ghost" onClick={() => { window.location.href = 'index.html'; }}>Open full app</button>
              </div>
            </div>

            <div style={{margin:12, display:'flex', gap:12, alignItems:'center'}}>
              <div>
                <label className="small">From</label><br/>
                <input ref={fromRef} type="text" className="date-input" placeholder="YYYY-MM-DD" defaultValue={dateFrom} />
              </div>
              <div>
                <label className="small">To</label><br/>
                <input ref={toRef} type="text" className="date-input" placeholder="YYYY-MM-DD" defaultValue={dateTo} />
              </div>

              <div>
                <label className="small">Region</label><br/>
                <select value={selectedRegion} onChange={(e)=>{ setSelectedRegion(e.target.value); setSelectedLocation("All locations"); }}>
                  {Object.keys(REGION_OPTIONS).map(k => <option key={k} value={k}>{REGION_OPTIONS[k].label}</option>)}
                </select>
              </div>

              <div>
                <label className="small">Location</label><br/>
                <select value={selectedLocation} onChange={(e)=>{ setSelectedLocation(e.target.value); }}>
                  <option value="All locations">All locations</option>
                  {(REGION_OPTIONS[selectedRegion] && REGION_OPTIONS[selectedRegion].partitions || []).map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>

              <div>
                <label className="small">Employee ID</label><br/>
                <input value={employeeId} onChange={(e)=>setEmployeeId(e.target.value)} placeholder="e.g. 326131" />
              </div>

              <div style={{display:'flex', flexDirection:'column', gap:6}}>
                <button className="btn-primary" onClick={runForRange} disabled={loading}>Run</button>
                <button className="btn-ghost" onClick={loadLatest} disabled={loading}>Load latest</button>
              </div>
            </div>

            <div style={{margin:12}} className="table-scroll" role="region" aria-label="results table">
              <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:8}}>
                <input placeholder="Search name, employee id, card or reason..." value={filterText} onChange={(e)=>{ setFilterText(e.target.value); setPage(1); }} style={{flex:1, padding:'8px', borderRadius:6}} />
                <label style={{display:'flex', alignItems:'center', gap:6}}>
                  <input type="checkbox" checked={collapseDuplicates} onChange={(e)=>{ setCollapseDuplicates(e.target.checked); setPage(1); }} />
                  <span className="small muted">Collapse duplicates</span>
                </label>
                <button className="small-button" onClick={exportFiltered}>Export filtered</button>
              </div>

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
                    var isAgg = collapseDuplicates && r && r.ViolationCount !== undefined;
                    var displayRow = isAgg ? r.FirstRow : r;
                    var empName = isAgg ? (r.EmployeeName || sanitizeName(displayRow)) : sanitizeName(r);
                    var empId = isAgg ? (r.EmployeeID || displayRow.EmployeeID || "") : (r.EmployeeID || "");
                    var card = isAgg ? (r.CardNumber || displayRow.CardNumber || "") : (r.CardNumber || "");
                    var displayDate = displayRow && (displayRow.DisplayDate || displayRow.Date || displayRow.DateOnly || displayRow.FirstSwipe || displayRow.LastSwipe) || "-";
                    var durText = (displayRow && displayRow.Duration)
                      || (displayRow && displayRow.DurationSeconds ? formatSecondsToHmJS(Number(displayRow.DurationSeconds))
                        : (displayRow && displayRow.DurationMinutes ? formatSecondsToHmJS(Number(displayRow.DurationMinutes) * 60) : ""));
                    var reasonsText = isAgg ? (r.Reasons || displayRow.Reasons || displayRow.DetectedScenarios) : (r.Reasons || r.DetectedScenarios);

                    var violationCount = "";
                    var violationWindow = null;
                    if (isAgg) {
                      if (r.ViolationDays !== undefined && r.ViolationDays !== null && r.ViolationDays !== "") violationCount = String(r.ViolationDays);
                      else if (r.ViolationDaysLast !== undefined && r.ViolationDaysLast !== null && r.ViolationDaysLast !== "") violationCount = String(r.ViolationDaysLast);
                      else if (r.ViolationDaysLast90 !== undefined && r.ViolationDaysLast90 !== null && r.ViolationDaysLast90 !== "") violationCount = String(r.ViolationDaysLast90);
                      else if (r.ViolationDaysLast_90 !== undefined && r.ViolationDaysLast_90 !== null && r.ViolationDaysLast_90 !== "") violationCount = String(r.ViolationDaysLast_90);
                      violationWindow = r.ViolationWindowDays || r.ViolationWindow || null;
                    } else {
                      if (displayRow && displayRow.ViolationDays !== undefined && displayRow.ViolationDays !== null && displayRow.ViolationDays !== "") violationCount = String(displayRow.ViolationDays);
                      else if (displayRow && displayRow.ViolationDaysLast !== undefined && displayRow.ViolationDaysLast !== null && displayRow.ViolationDaysLast !== "") violationCount = String(displayRow.ViolationDaysLast);
                      else if (displayRow && displayRow.ViolationDaysLast90 !== undefined && displayRow.ViolationDaysLast90 !== null && displayRow.ViolationDaysLast90 !== "") violationCount = String(displayRow.ViolationDaysLast90);
                      else if (displayRow && displayRow.ViolationDaysLast_90 !== undefined && displayRow.ViolationDaysLast_90 !== null && displayRow.ViolationDaysLast_90 !== "") violationCount = String(displayRow.ViolationDaysLast_90);
                      violationWindow = displayRow && (displayRow.ViolationWindowDays || displayRow.ViolationWindow) || null;
                    }

                    return (
                      <tr key={idx} className={(displayRow && displayRow.Reasons && String(displayRow.Reasons).trim()) ? "flagged-row" : ""}>
                        <td>{empName || React.createElement('span', { className: 'muted' }, '—')}</td>
                        <td className="small">{empId}</td>
                        <td className="small">{card}</td>
                        <td className="small">{displayDate}</td>
                        <td className="small">{isAgg ? (displayRow && (displayRow.Duration || (displayRow.DurationSeconds ? formatSecondsToHmJS(Number(displayRow.DurationSeconds)) : "-"))) : durText}</td>
                        <td className="small">{violationCount !== "" ? violationCount : React.createElement('span', { className: 'muted' }, '—')}</td>
                        <td className="small">{renderReasonChips(reasonsText)}</td>
                        <td className="small"><button onClick={() => alert('Open evidence not implemented on this page')}>Evidence</button>{isAgg ? React.createElement('span', { className: 'muted', style:{marginLeft:8} }, `(${r.ViolationCount} rows)`) : null}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div style={{ display:'flex', gap:8, alignItems:'center', marginTop:10 }}>
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page<=1}>Prev</button>
                <div className="muted">Page {page} / {totalPages}</div>
                <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page>=totalPages}>Next</button>
              </div>
            </div>
          </div>
        );
      }

      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(TableOnlyApp));
    })();
  </script>
</body>
</html>
