not work,,, 

Employee Name	Employee ID	Card	Date	Time	SwipeGap	Door	Direction	Zone	Note
Surgailyte, Inga	302708	603513	2025-12-01	6:11:50 AM	00:00:00	EMEA_LT_VNO_GAMA_2nd Flr_First Parking Door	InDirection	Red Zone	- (swipes_ltvilnius_20251201.csv) <<< this is show in green..

Orig: 01-Dec-25
Surgailyte, Inga	302708	603513	2025-12-01	6:11:57 AM	00:00:07	EMEA_LT_VNO_GAMA_2nd Flr_Parking	InDirection	Working Area	- (swipes_ltvilnius_20251201.csv)
Orig: 01-Dec-25

Surgailyte, Inga	302708	603513	2025-12-02	6:20:39 AM	00:00:00	EMEA_LT_VNO_GAMA_2nd Flr_First Parking Door	InDirection	Red Zone	- (swipes_ltvilnius_20251202.csv) <<< this is show in green 
Orig: 02-Dec-25
Surgailyte, Inga	302708	603513	2025-12-02	6:20:47 AM	00:00:08	EMEA_LT_VNO_GAMA_2nd Flr_Parking	InDirection	Working Area	- (swipes_ltvilnius_20251202.csv)
Orig: 02-Dec-25

Surgailyte, Inga	302708	603513	2025-12-03	6:16:57 AM	00:00:00	EMEA_LT_VNO_GAMA_2nd Flr_First Parking Door	InDirection	Red Zone	- (swipes_ltvilnius_20251203.csv) this alos in green
Orig: 03-Dec-25
Surgailyte, Inga	302708	603513	2025-12-03	6:17:05 AM	00:00:08	EMEA_LT_VNO_GAMA_2nd Flr_Parking	InDirection	Working Area	- (swipes_ltvilnius_20251203.csv)
Orig: 03-Dec-25
Surgailyte, Inga	302708	603513	2025-12-03	6:18:22 AM	00:01:17	EMEA_LTU_VNO_GAMA_10th floor elevator lobby	InDirection	Red Zone	- (swipes_ltvilnius_20251203.csv)
Orig: 03-Dec-25
Surgailyte, Inga	302708	603513	2025-12-03	2:20:21 PM	08:01:59	EMEA_LT_VNO_GAMA_2nd Flr_Parking	OutDirection	Out of office	- (swipes_ltvilnius_20251203.csv)
Orig: 03-Dec-25 — Out
Surgailyte, Inga	302708	603513	2025-12-08	6:17:40 AM	00:00:00	EMEA_LT_VNO_GAMA_2nd Flr_First Parking Door	InDirection	Red Zone	- (swipes_ltvilnius_20251208.csv) thee green 
Orig: 08-Dec-25

read the code and chekc i dont want green for quezon city and vilnius



  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
  <link rel="stylesheet" href="style.css">
</head>

<body>
  <div id="root"></div>

  <script type="text/babel">
    (function () {
      const { useState, useEffect, useRef } = React;

      // CHANGE IF YOUR API HOST DIFFERS
      const API_BASE = "http://localhost:8002";

      function resolveApiImageUrl(imgUrl) {
        if (!imgUrl) return null;
        try {
          if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) return imgUrl;
          // ensure API_BASE has no trailing slash
          var base = API_BASE.replace(/\/$/, '');
          if (imgUrl.startsWith('/')) return base + imgUrl;
          return base + '/' + imgUrl;
        } catch (e) {
          return imgUrl;
        }
      }


      // --- Region / Location mapping copied from backend/duration_report.REGION_CONFIG (friendly / UI names) ---
      // Keep the keys lowercase to match backend region keys.
      const REGION_OPTIONS = {
        "apac": {
          label: "APAC",
          // Friendly names used by backend normalisation (duration_report) for APAC
          partitions: ["Pune", "Quezon City", "Taguig City", "MY.Kuala Lumpur", "IN.HYD", "SG.Singapore"]
        },
        "emea": {
          label: "EMEA",
          partitions: ["LT.Vilnius", "IT.Rome", "UK.London", "IE.DUblin", "DU.Abu Dhab", "ES.Madrid"]
        },
        "laca": {
          label: "LACA",
          partitions: ["AR.Cordoba", "BR.Sao Paulo", "CR.Costa Rica Partition", "PA.Panama City", "PE.Lima", "MX.Mexico City"]
        },
        "namer": {
          label: "NAMER",
          // show friendly names to the user, but we map them to backend partition tokens before sending
          partitions: ["Denver", "Austin Texas", "Miami", "New York"]
        }
      };

      // Map from UI-friendly location label -> backend search token (used for &city=)
      // For APAC, friendly labels match backend PartitionName2 normalised values so they map to themselves.
      // For NAMER, backend normalisation sets PartitionName2 to tokens like "US.CO.OBS", "USA/Canada Default" etc.
      const LOCATION_QUERY_VALUE = {
        "apac": {
          "Pune": "Pune",
          "Quezon City": "Quezon City",
          "Taguig City": "Taguig City",
          "MY.Kuala Lumpur": "MY.Kuala Lumpur",
          "IN.HYD": "IN.HYD",
          "SG.Singapore": "SG.Singapore"
        },
        "namer": {
          // friendly->backend tokens (this matches the backend duration_report normalisation)
          "Denver": "US.CO.OBS",
          "Austin Texas": "USA/Canada Default",
          "Miami": "US.FL.Miami",
          "New York": "US.NYC"
        },
        // default passthrough for other regions 
        "emea": {},
        "laca": {}
      };

      // Map risk text/colors (same as backend map_score_to_label buckets)
      const RISK_COLORS = {
        "Low": "#10b981",
        "Low Medium": "#86efac",
        "Medium": "#facc15",
        "Medium High": "#fb923c",
        "High": "#ef4444"
      };
      const RISK_LABELS = ["Low", "Low Medium", "Medium", "Medium High", "High"];

      // (rest unchanged) Explanations...
      const SCENARIO_EXPLANATIONS = {
        "long_gap_>=4.5h": "Long gap between swipes (>=4.5 hours).",
        "short_duration_<4h": "Short total presence (<4 hours).",
        "coffee_badging": "Multiple short swipes — possible coffee badging.",
        "low_swipe_count_<=5": "Very few swipes recorded for day (<=2).",
        "single_door": "Single door used during day.",
        "only_in": "Only IN events present.",
        "only_out": "Only OUT events present.",
        "overtime_>=14h": "Overtime (>=14 hours).",
        "very_long_duration_>=16h": "Very long presence (>=16 hours).",
        "unusually_high_swipes": "Unusually high number of swipes vs history.",
        "repeated_short_breaks": "Multiple short breaks in day.",
        "multiple_location_same_day": "Multiple locations used same day.",
        "weekend_activity": "Activity on weekend.",
        "repeated_rejection_count": "Multiple rejections.",
        "badge_sharing_suspected": "Same card used by multiple persons on same day.",
        "early_arrival_before_06": "First swipe earlier than 06:00.",
        "late_exit_after_23": "Last swipe after 23:30.",
        "shift_inconsistency": "Duration inconsistent with historical shift.",
        "trending_decline": "Historical trending decline.",
        "consecutive_absent_days": "Consecutive absent days historically.",
        "high_variance_duration": "High variance in durations historically.",
        "short_duration_on_high_presence_days": "Short duration despite high typical presence.",
        "swipe_overlap": "Swipes overlapping other users (possible tailgating).",
        "shortstay_longout_repeat": "Short in -> long out -> short return pattern."
      };

      // small utilities
      function pad(n) { return n.toString().padStart(2, '0'); }
      function formatDateISO(d) {
        if (!d) return "";
        const dt = (d instanceof Date) ? d : new Date(d);
        return dt.getFullYear() + "-" + pad(dt.getMonth() + 1) + "-" + pad(dt.getDate());
      }


      function safeDateDisplay(val) {
        if (!val && val !== 0) return "";
        try {
          const d = (val instanceof Date) ? val : new Date(val);
          if (isNaN(d.getTime())) return String(val);
          return d.toLocaleString();
        } catch (e) {
          return String(val);
        }
      }

      function sanitizeName(row) {
        if (!row) return "";
        // prefer feature/duration versions if present
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

      // duration formatting helper
      function formatSecondsToHmsJS(seconds) {
        if (seconds === null || seconds === undefined || seconds === '') return "-";
        const n = Number(seconds);
        if (isNaN(n) || !isFinite(n)) return "-";
        const s = Math.max(0, Math.floor(n));
        const hh = Math.floor(s / 3600);
        const mm = Math.floor((s % 3600) / 60);
        const ss = s % 60;
        return pad(hh) + ":" + pad(mm) + ":" + pad(ss);
      }



      // duration formatting helper (HH:MM) — used for Duration fields (strict HH:MM)
      function formatSecondsToHmJS(seconds) {
        if (seconds === null || seconds === undefined || seconds === '') return "-";
        const n = Number(seconds);
        if (isNaN(n) || !isFinite(n)) return "-";
        const s = Math.max(0, Math.floor(n));
        const hh = Math.floor(s / 3600);
        const mm = Math.floor((s % 3600) / 60);
        // return HH:MM (hours may be >23)
        return String(hh) + ":" + String(mm).padStart(2, '0');
      }


      // ----- Day-boundary helpers -----
      // Backend assigns Date using LocaleMessageTime.date() (no 2AM shift).
      // Keep frontend day-boundary at 0 so logical dates match backend.
      const DAY_BOUNDARY_HOUR = 0;

      function logicalDateForTs(dt, boundaryHour = DAY_BOUNDARY_HOUR) {
        if (!dt || !(dt instanceof Date) || isNaN(dt.getTime())) return null;
        const hour = dt.getHours();
        const year = dt.getFullYear();
        const month = dt.getMonth();
        const day = dt.getDate();
        const out = new Date(year, month, day, 0, 0, 0, 0);
        // with boundaryHour = 0, this never subtracts a day -> matches backend date assignment
        if (hour < boundaryHour) {
          out.setDate(out.getDate() - 1);
        }
        const y = out.getFullYear();
        const m = String(out.getMonth() + 1).padStart(2, '0');
        const d = String(out.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }

      function makeLocalDateFromRow(r) {
        try {
          if (!r) return null;

          // backend usually includes LocaleMessageTime (ISO string). Prefer that.
          if (r.LocaleMessageTime) {
            const t = new Date(r.LocaleMessageTime);
            if (!isNaN(t.getTime())) return t;
          }

          function toInt(v, fallback = 0) {
            const n = Number(v);
            return Number.isFinite(n) ? n : fallback;
          }

          // Backend also supplies DateOnly + Time for frontend convenience — use those if present.
          if (r.DateOnly && r.Time) {
            try {
              // DateOnly might be a Date object or 'YYYY-MM-DD' string.
              const dateStr = String(r.DateOnly).slice(0, 10).replace(/\//g, '-');
              const dateParts = dateStr.split('-').map(p => toInt(p, NaN));
              if (dateParts.length === 3 && !isNaN(dateParts[0])) {
                const year = dateParts[0];
                const month = dateParts[1];
                const day = dateParts[2];

                const timeRaw = String(r.Time).split(/[.+Z ]/)[0];
                const timeParts = timeRaw.split(':').map(p => toInt(p, 0));
                const hh = timeParts[0] || 0;
                const mm = timeParts[1] || 0;
                const ss = timeParts[2] || 0;

                return new Date(year, month - 1, day, hh, mm, ss, 0);
              }
            } catch (e) { /* fallthrough */ }
          }

          // fallback: if Date and Time fields exist (older API formats)
          if (r.Date && r.Time) {
            try {
              const dateStr = String(r.Date).slice(0, 10).replace(/\//g, '-');
              const dateParts = dateStr.split('-').map(p => toInt(p, NaN));
              if (dateParts.length === 3 && !isNaN(dateParts[0])) {
                const year = dateParts[0];
                const month = dateParts[1];
                const day = dateParts[2];

                const timeRaw = String(r.Time).split(/[.+Z ]/)[0];
                const timeParts = timeRaw.split(':').map(p => toInt(p, 0));
                const hh = timeParts[0] || 0;
                const mm = timeParts[1] || 0;
                const ss = timeParts[2] || 0;

                return new Date(year, month - 1, day, hh, mm, ss, 0);
              }
            } catch (e) { /* fallthrough */ }
          }

          // if only DateOnly present, return midnight of that date
          if (r.DateOnly) {
            try {
              const parts = String(r.DateOnly).slice(0, 10).replace(/\//g, '-').split('-');
              if (parts.length === 3) {
                const y = toInt(parts[0], NaN);
                const m = toInt(parts[1], NaN);
                const d = toInt(parts[2], NaN);
                if (!isNaN(y)) return new Date(y, m - 1, d, 0, 0, 0, 0);
              }
  
        const NO_GREEN_LOCATIONS = new Set([
          "quezon city",
          "lt.vilnius"
        ]);

        function isNoGreenLocation(row) {
          const z = String(row.Zone || '').toLowerCase();
          for (const loc of NO_GREEN_LOCATIONS) {
            if (z.includes(loc)) return true;
          }
          return false;
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

                    // const cls = [];
                    // if (isDayStart) cls.push('row-day-start');
                    // if (flags[idx].outReturn) cls.push('row-out-return');
                    // const rowStyle = isDayStart ? { background: '#e6ffed' } : {};


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
