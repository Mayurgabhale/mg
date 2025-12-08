<!doctype html>
<html>

<head>
  <meta charset="utf-8" />
  <title>Behaviour Analysis — Dashboard</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <!-- React + ReactDOM + Babel (quick prototyping) -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script crossorigin src="https://unpkg.com/babel-standalone@6.26.0/babel.min.js"></script>

  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  
  <!-- Flatpickr -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
  <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
  <link rel="stylesheet" href="style.css">
</head>

<body>
  <div id="root"></div>

  <script type="text/babel">
    (function () {
      const { useState, useEffect, useRef } = React;

      // CHANGE IF YOUR API HOST DIFFERS
      const API_BASE = "http://10.138.161.4:8002";

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
            } catch (e) { /* fallthrough */ }
          }

          // if only Date present, use that
          if (r.Date) {
            try {
              const parts = String(r.Date).slice(0, 10).replace(/\//g, '-').split('-');
              if (parts.length === 3) {
                const y = toInt(parts[0], NaN);
                const m = toInt(parts[1], NaN);
                const d = toInt(parts[2], NaN);
                if (!isNaN(y)) return new Date(y, m - 1, d, 0, 0, 0, 0);
              }
            } catch (e) { /* fallthrough */ }
          }

        } catch (e) { }
        return null;
      }

      function App() {
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const [dateFrom, setDateFrom] = useState(formatDateISO(yesterday));
        const [dateTo, setDateTo] = useState(formatDateISO(new Date()));
        const [loading, setLoading] = useState(false);
        const [summary, setSummary] = useState({ rows: 0, flagged_rows: 0, files: [], end_date: null });
        const [rows, setRows] = useState([]);
        const [reasonsCount, setReasonsCount] = useState({});
        const [riskCounts, setRiskCounts] = useState({ "Low": 0, "Low Medium": 0, "Medium": 0, "Medium High": 0, "High": 0 });
        const [filterText, setFilterText] = useState("");
        const [page, setPage] = useState(1);
        const [selectedReason, setSelectedReason] = useState("");
        const [reasonFilterText, setReasonFilterText] = useState("");
        const [modalRow, setModalRow] = useState(null);
        const [modalDetails, setModalDetails] = useState(null);
        const [modalLoading, setModalLoading] = useState(false);
        const [collapseDuplicates, setCollapseDuplicates] = useState(true);
        const [selectedRiskFilter, setSelectedRiskFilter] = useState("");

        // New: region & location
        const [selectedRegion, setSelectedRegion] = useState("apac");
        const [selectedLocation, setSelectedLocation] = useState("All locations");

        // NEW: Employee ID (optional) — minimal addition
        const [employeeId, setEmployeeId] = useState("");

        const pageSize = 25;
        const chartRef = useRef(null);
        const chartInst = useRef(null);

        const fromRef = useRef(null);
        const toRef = useRef(null);
        const fromFp = useRef(null);
        const toFp = useRef(null);


        // Chat state
        const [chatOpen, setChatOpen] = useState(false);
        const [chatMessages, setChatMessages] = useState([]);
        const [chatInput, setChatInput] = useState("");
        const [chatLoading, setChatLoading] = useState(false);




        useEffect(function () {
          if (window.flatpickr && fromRef.current && toRef.current) {
            try { if (fromFp.current) fromFp.current.destroy(); } catch (e) { }
            try { if (toFp.current) toFp.current.destroy(); } catch (e) { }
            fromFp.current = window.flatpickr(fromRef.current, {
              dateFormat: "Y-m-d",
              defaultDate: dateFrom,
              allowInput: true,
              onChange: function (selectedDates, str) {
                if (selectedDates && selectedDates.length) {
                  const iso = formatDateISO(selectedDates[0]);
                  setDateFrom(iso);
                  try { if (toFp.current) toFp.current.set('minDate', iso); } catch (e) { }
                  if (dateTo && new Date(iso) > new Date(dateTo)) {
                    setDateTo(iso);
                    try { if (toFp.current) toFp.current.setDate(iso, true); } catch (e) { }
                  }
                }
              }
            });
            toFp.current = window.flatpickr(toRef.current, {
              dateFormat: "Y-m-d",
              defaultDate: dateTo,
              allowInput: true,
              onChange: function (selectedDates, str) {
                if (selectedDates && selectedDates.length) {
                  const iso = formatDateISO(selectedDates[0]);
                  setDateTo(iso);
                  try { if (fromFp.current) fromFp.current.set('maxDate', iso); } catch (e) { }
                  if (dateFrom && new Date(iso) < new Date(dateFrom)) {
                    setDateFrom(iso);
                    try { if (fromFp.current) fromFp.current.setDate(iso, true); } catch (e) { }
                  }
                }
              }
            });
            try { if (fromFp.current) fromFp.current.set('maxDate', dateTo); if (toFp.current) toFp.current.set('minDate', dateFrom); } catch (e) { }
          }
          loadLatest();
          return function () { try { if (fromFp.current) fromFp.current.destroy(); } catch (e) { } try { if (toFp.current) toFp.current.destroy(); } catch (e) { } };
          // eslint-disable-next-line
        }, []);









        useEffect(function () {
          try { if (fromFp.current && dateFrom) fromFp.current.setDate(dateFrom, false); } catch (e) { }
          try { if (toFp.current && dateTo) toFp.current.setDate(dateTo, false); } catch (e) { }
          try { if (fromFp.current) fromFp.current.set('maxDate', dateTo); } catch (e) { }
          try { if (toFp.current) toFp.current.set('minDate', dateFrom); } catch (e) { }
        }, [dateFrom, dateTo]);

        // When region changes, reset location to "All locations"
        useEffect(() => {
          setSelectedLocation("All locations");
        }, [selectedRegion]);

        async function runForRange() {
          setLoading(true);
          setRows([]);
          setSummary({ rows: 0, flagged_rows: 0, files: [], end_date: null });
          setReasonsCount({});
          setRiskCounts({ "Low": 0, "Low Medium": 0, "Medium": 0, "Medium High": 0, "High": 0 });
          try {
            const start = encodeURIComponent(dateFrom);
            const end = encodeURIComponent(dateTo);
            // include selected region & city if provided
            let url = API_BASE + "/run?start=" + start + "&end=" + end + "&full=true";
            if (selectedRegion) {
              url += "&region=" + encodeURIComponent(selectedRegion);
            }
            if (selectedLocation && selectedLocation !== "All locations") {
              // send backend-aware partition token (use mapping)
              const mapForRegion = LOCATION_QUERY_VALUE[selectedRegion] || {};
              const queryCity = mapForRegion[selectedLocation] || selectedLocation;
              url += "&city=" + encodeURIComponent(queryCity);
            }

            // NEW: include employee_id if provided (minimal addition)
            if (employeeId && String(employeeId).trim() !== "") {
              url += "&employee_id=" + encodeURIComponent(String(employeeId).trim());
            }

            let r = await fetch(url, { method: 'GET' });
            if (!r.ok) { const txt = await r.text(); throw new Error("API returned " + r.status + ": " + txt); }
            let js = await r.json();

            const totalRows = (typeof js.aggregated_unique_persons === 'number') ? js.aggregated_unique_persons
              : (typeof js.rows === 'number') ? js.rows : 0;
            const totalFlagged = (typeof js.flagged_rows === 'number') ? js.flagged_rows : 0;
            const files = js.files || [];

            const sample = Array.isArray(js.flagged_persons) && js.flagged_persons.length ? js.flagged_persons
              : (Array.isArray(js.sample) ? js.sample : []);
            setRows(sample);

            setSummary({ rows: totalRows, flagged_rows: totalFlagged, files: files, end_date: formatDateISO(new Date(dateTo)) });

            if (js.reasons_count && Object.keys(js.reasons_count).length > 0) {
              setReasonsCount(js.reasons_count);
            } else {
              computeReasonsAndRisks(sample);
            }
            if (js.risk_counts && Object.keys(js.risk_counts).length > 0) {
              const all = { "Low": 0, "Low Medium": 0, "Medium": 0, "Medium High": 0, "High": 0 };
              Object.keys(js.risk_counts).forEach(k => { all[k] = js.risk_counts[k]; });
              setRiskCounts(all);
            } else {
              computeReasonsAndRisks(sample);
            }
            setPage(1);
          } catch (err) {
            alert("Error: " + err.message);
            console.error(err);
          } finally {
            setLoading(false);
          }
        }

        function pushChatMessage(msg) {
          setChatMessages(prev => [...prev, msg]);
          setTimeout(() => {
            const el = document.querySelector('.chat-body');
            if (el) el.scrollTop = el.scrollHeight;
          }, 50);
        }



        // New: group rows by person and compute unique per-person reason + highest-severity risk
        function computeReasonsAndRisks(dataRows) {
          // helper severity mapping (higher => more severe)
          function severityForLabel(label) {
            const map = { "Low": 1, "Low Medium": 2, "Medium": 3, "Medium High": 4, "High": 5 };
            if (!label) return 1;
            return map[String(label)] || 1;
          }

          var personMap = {}; // key -> { rows:[], reasonsSet:Set, maxSeverity, chosenLabel }

          (dataRows || []).forEach(function (r) {
            try {
              var key = r.EmployeeID || r.person_uid || (sanitizeName(r) + '|' + (r.CardNumber || r.Card || ''));
              if (!key) {
                // fallback: unique by row index-ish (but try to avoid counting duplicates without id)
                key = JSON.stringify(r); // rare fallback
              }
              if (!personMap[key]) {
                personMap[key] = { rows: [], reasonsSet: new Set(), maxSeverity: 0, chosenLabel: null };
              }
              var p = personMap[key];
              p.rows.push(r);

              // collect reasons (set per person)
              var reasonsField = r.Reasons || r.DetectedScenarios || r.Detected || "";
              String(reasonsField).split(";").map(function (s) { return s && s.trim(); }).filter(Boolean).forEach(function (rs) {
                p.reasonsSet.add(rs);
              });

              // pick highest severity risk label across this person's rows
              var rl = getRiskLabelForRow(r);
              var sev = severityForLabel(rl);
              if (sev > p.maxSeverity) {
                p.maxSeverity = sev;
                p.chosenLabel = rl || "Low";
              }
            } catch (err) {
              // ignore malformed rows
              console.error("computeReasonsAndRisks row error", err);
            }
          });

          // Build aggregated counts: one contribution per person
          var reasonsCounts = {};
          var rcounts = { "Low": 0, "Low Medium": 0, "Medium": 0, "Medium High": 0, "High": 0 };

          Object.keys(personMap).forEach(function (k) {
            var p = personMap[k];
            // reasons: increment each reason once per person
            p.reasonsSet.forEach(function (rn) {
              reasonsCounts[rn] = (reasonsCounts[rn] || 0) + 1;
            });
            // risk: increment chosenLabel once per person (fallback to Low)
            var label = p.chosenLabel || "Low";
            if (!rcounts[label] && rcounts[label] !== 0) rcounts[label] = 0; // ensure key exists
            rcounts[label] = (rcounts[label] || 0) + 1;
          });

          setReasonsCount(reasonsCounts);
          setRiskCounts(rcounts);
        }


        async function loadLatest() {
          setLoading(true);
          try {
            // run for yesterday (to match backend's default behaviour)
            var d = new Date();
            d.setDate(d.getDate() - 1);
            var yesterday = formatDateISO(d);
            setDateFrom(yesterday);
            setDateTo(yesterday);

            const start = encodeURIComponent(yesterday);
            const end = encodeURIComponent(yesterday);
            let url = API_BASE + "/run?start=" + start + "&end=" + end + "&full=true";
            if (selectedRegion) {
              url += "&region=" + encodeURIComponent(selectedRegion);
            }
            if (selectedLocation && selectedLocation !== "All locations") {
              const mapForRegion = LOCATION_QUERY_VALUE[selectedRegion] || {};
              const queryCity = mapForRegion[selectedLocation] || selectedLocation;
              url += "&city=" + encodeURIComponent(queryCity);
            }

            // NEW: include employee_id if provided for loadLatest as well
            if (employeeId && String(employeeId).trim() !== "") {
              url += "&employee_id=" + encodeURIComponent(String(employeeId).trim());
            }

            let r = await fetch(url, { method: 'GET' });
            if (!r.ok) { const txt = await r.text(); throw new Error("API returned " + r.status + ": " + txt); }
            let js = await r.json();

            const totalRows = (typeof js.aggregated_unique_persons === 'number') ? js.aggregated_unique_persons
              : (typeof js.rows === 'number') ? js.rows : 0;
            const totalFlagged = (typeof js.flagged_rows === 'number') ? js.flagged_rows : 0;
            const files = js.files || [];

            const sample = Array.isArray(js.sample) ? js.sample : (Array.isArray(js.flagged_persons) ? js.flagged_persons : []);
            setRows(sample);
            setSummary({ rows: totalRows, flagged_rows: totalFlagged, files: files, end_date: yesterday });

            if (js.reasons_count && Object.keys(js.reasons_count).length > 0) {
              setReasonsCount(js.reasons_count);
            } else {
              computeReasonsAndRisks(sample);
            }
            if (js.risk_counts && Object.keys(js.risk_counts).length > 0) {
              const all = { "Low": 0, "Low Medium": 0, "Medium": 0, "Medium High": 0, "High": 0 };
              Object.keys(js.risk_counts).forEach(k => { all[k] = js.risk_counts[k]; });
              setRiskCounts(all);
            } else {
              computeReasonsAndRisks(sample);
            }
            setPage(1);
          } catch (err) {
            alert("Error: " + err.message);
            console.error(err);
          } finally {
            setLoading(false);
          }
        }




        function getRiskLabelForRow(r) {
          if (!r) return null;
          var rl = r.RiskLevel || r.Risk || null;
          if (rl) return String(rl);
          if (r.RiskScore !== undefined && r.RiskScore !== null) {
            const mapNum = { 1: "Low", 2: "Low Medium", 3: "Medium", 4: "Medium High", 5: "High" };
            return mapNum[String(r.RiskScore)] || null;
          }
          if (r.AnomalyScore !== undefined && r.AnomalyScore !== null) {
            if (r.AnomalyScore >= 5) return "High";
            if (r.AnomalyScore >= 4) return "Medium High";
            if (r.AnomalyScore >= 3) return "Medium";
            if (r.AnomalyScore >= 2) return "Low Medium";
            return "Low";
          }
          return null;
        }

        function buildChart(rcounts) {
          var labels = RISK_LABELS;
          var values = labels.map(l => rcounts && rcounts[l] ? rcounts[l] : 0);
          var colors = labels.map(l => {
            if (selectedRiskFilter) {
              return (l === selectedRiskFilter) ? RISK_COLORS[l] : '#e6edf3';
            } else {
              return RISK_COLORS[l] || '#cccccc';
            }
          });

          var ctx = chartRef.current && chartRef.current.getContext ? chartRef.current.getContext('2d') : null;
          if (!ctx) return;
          try { if (chartInst.current) chartInst.current.destroy(); } catch (e) { }

          chartInst.current = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: 'Flagged by Risk Level',
                data: values,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37,99,235,0.2)',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: colors,
                pointRadius: 5,
                pointHoverRadius: 7
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return context.parsed.y + ' cases';
                    }
                  }
                }
              },
              onClick: function (evt, elements) {
                if (elements && elements.length > 0) {
                  var idx = elements[0].index;
                  var label = this.data.labels[idx];
                  handleRiskBarClick(label);
                }
              },
              scales: {
                y: { beginAtZero: true, ticks: { precision: 0 } }
              }
            }
          });

        }

        useEffect(function () {
          buildChart(riskCounts);
        }, [riskCounts, selectedRiskFilter]);





        // Filtering & aggregation
        // Keep old filtering behaviour to produce 'filtered' (raw rows matching filters)
        var filtered = (rows || []).filter(function (r) {
          var hay = (sanitizeName(r) + " " + (r.EmployeeID || "") + " " + (r.CardNumber || "") + " " + (r.Reasons || r.DetectedScenarios || "")).toLowerCase();
          var textOk = !filterText || hay.indexOf(filterText.toLowerCase()) !== -1;
          var reasonOk = !selectedReason || (r.Reasons && ((";" + String(r.Reasons) + ";").indexOf(selectedReason) !== -1)) || (r.DetectedScenarios && ((";" + String(r.DetectedScenarios) + ";").indexOf(selectedReason) !== -1));
          var riskOk = true;
          if (selectedRiskFilter) {
            var rl = getRiskLabelForRow(r);
            if (!rl) { riskOk = false; }
            else riskOk = (String(rl) === String(selectedRiskFilter));
          }
          return textOk && reasonOk && riskOk;
        });

        // sort raw filtered (so aggregated picks same order for first-row)
        filtered.sort(function (a, b) {
          var va = Number(a.ViolationDays || a.ViolationDays || 0);
          var vb = Number(b.ViolationDays || b.ViolationDays || 0);
          if (isNaN(va)) va = 0;
          if (isNaN(vb)) vb = 0;
          if (vb !== va) return vb - va;
          return (sanitizeName(a) || "").localeCompare(sanitizeName(b) || "");
        });

        // NEW helper: build normalized timeline rows (reuse for export)
        function getTimelineRows(details) {
          if (!details || !Array.isArray(details.raw_swipes)) return [];
          const arr = details.raw_swipes.map(r => {
            const obj = Object.assign({}, r);
            try { obj.__ts = makeLocalDateFromRow(obj); } catch (_) { obj.__ts = null; }

            let gap = null;
            if (obj.SwipeGapSeconds !== undefined && obj.SwipeGapSeconds !== null) {
              gap = Number(obj.SwipeGapSeconds);
              if (isNaN(gap)) gap = null;
            } else if (obj.SwipeGap) {
              try {
                const parts = String(obj.SwipeGap).split(':').map(p => Number(p));
                if (parts.length === 3 && parts.every(p => !isNaN(p))) gap = parts[0] * 3600 + parts[1] * 60 + parts[2];
              } catch (e) { gap = null; }
            }
            obj.__gap = gap;
            obj.__zone_l = String((obj.Zone || '')).toLowerCase();
            if (obj.__ts) {
              obj.__logical_date = logicalDateForTs(obj.__ts, DAY_BOUNDARY_HOUR);
            } else if (obj.DateOnly) {
              obj.__logical_date = String(obj.DateOnly).slice(0, 10);
            } else if (obj.Date) {
              obj.__logical_date = String(obj.Date).slice(0, 10);
            } else {
              obj.__logical_date = null;
            }
            return obj;
          });

          arr.sort((a, b) => {
            if (a.__ts && b.__ts) return a.__ts - b.__ts;
            if (a.__ts) return -1;
            if (b.__ts) return 1;
            const ka = (a.DateOnly || a.Date || '') + ' ' + (a.Time || '');
            const kb = (b.DateOnly || b.Date || '') + ' ' + (b.Time || '');
            return ka.localeCompare(kb);
          });

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
            const dateTag = (modalRow && (modalRow.Date || modalRow.DateOnly)) ? String(modalRow.Date || modalRow.DateOnly).slice(0,10).replace(/:/g,'-') : formatDateISO(new Date());
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
    const js = await resp.json();

    // quick image candidate from response or build fallback by id
    const quickImageUrl = js.image_url || js.imageUrl || js.ImageUrl || null;
    const candidateId = (row && (row.EmployeeID || row.person_uid)) || null;
    const builtImage = quickImageUrl || (candidateId ? `/employee/${encodeURIComponent(candidateId)}/image` : null);

    // normalize details
    const details = {
      aggregated_rows: Array.isArray(js.aggregated_rows) ? js.aggregated_rows : (Array.isArray(js.sample) ? js.sample : []),
      raw_swipe_files: Array.isArray(js.raw_swipe_files) ? js.raw_swipe_files : (Array.isArray(js.files) ? js.files : []),
      raw_swipes: Array.isArray(js.raw_swipes) ? js.raw_swipes : []
    };

    // extract email (robustly)
    let newEmail = null;
    try {
      if (details.aggregated_rows && details.aggregated_rows.length) {
        const f = details.aggregated_rows[0];
        newEmail = newEmail || f.EmployeeEmail || f.Email || f.EmailAddress || f.WorkEmail || f.EMail || null;
     
