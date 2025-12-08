Western Union — Trend Analysis
APAC

Open table page
From
2025-12-01
To
2025-12-07
Run
Load latest

in heder i want ony this not 

Region

APAC
Location

All locations
Employee ID
i dont want this Region,Location, and, Employee ID

C:\Users\W0024618\Trend-Analysis\frontend\header.html
<!-- header.html -->
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
  <!-- Header will mount here -->
  <div id="header-root"></div>

  <!-- Header React component (type="text/babel" so Babel compiles JSX at runtime) -->
  <script type="text/babel">
    (function () {
      const { useState, useEffect, useRef } = React;

      // Minimal helpers (copied from your snippet)
      function pad(n) { return n.toString().padStart(2, '0'); }
      function formatDateISO(d) {
        if (!d) return "";
        const dt = (d instanceof Date) ? d : new Date(d);
        return dt.getFullYear() + "-" + pad(dt.getMonth() + 1) + "-" + pad(dt.getDate());
      }

      // Region / Location config (kept as in your snippet)
      const REGION_OPTIONS = {
        "apac": { label: "APAC", partitions: ["Pune", "Quezon City", "Taguig City", "MY.Kuala Lumpur", "IN.HYD", "SG.Singapore"] },
        "emea": { label: "EMEA", partitions: ["LT.Vilnius", "IT.Rome", "UK.London", "IE.DUblin", "DU.Abu Dhab", "ES.Madrid"] },
        "laca": { label: "LACA", partitions: ["AR.Cordoba", "BR.Sao Paulo", "CR.Costa Rica Partition", "PA.Panama City", "PE.Lima", "MX.Mexico City"] },
        "namer": { label: "NAMER", partitions: ["Denver", "Austin Texas", "Miami", "New York"] }
      };
      const LOCATION_QUERY_VALUE = {
        "apac": { "Pune":"Pune","Quezon City":"Quezon City","Taguig City":"Taguig City","MY.Kuala Lumpur":"MY.Kuala Lumpur","IN.HYD":"IN.HYD","SG.Singapore":"SG.Singapore" },
        "namer": { "Denver":"US.CO.OBS","Austin Texas":"USA/Canada Default","Miami":"US.FL.Miami","New York":"US.NYC" },
        "emea": {}, "laca": {}
      };

      function HeaderStandalone() {
        // local state to mirror your React snippet's variables (so the JSX lines you gave map directly)
        const [selectedRegion, setSelectedRegion] = useState("apac");
        const [selectedLocation, setSelectedLocation] = useState("All locations");
        const [loading, setLoading] = useState(false);
        const [dateFrom, setDateFrom] = useState(() => {
          const d = new Date(); d.setDate(d.getDate() - 1); return formatDateISO(d);
        });
        const [dateTo, setDateTo] = useState(() => formatDateISO(new Date()));
        const [employeeId, setEmployeeId] = useState("");

        const fromRef = useRef(null);
        const toRef = useRef(null);
        const fromFp = useRef(null);
        const toFp = useRef(null);

        // populate location list for selectedRegion
        function populateLocationOptions(regionKey) {
          const parts = (REGION_OPTIONS[regionKey] && REGION_OPTIONS[regionKey].partitions) || [];
          const sel = document.getElementById('locationSelect');
          if (!sel) return;
          sel.innerHTML = '';
          const optAll = document.createElement('option'); optAll.text = 'All locations'; optAll.value = 'All locations'; sel.appendChild(optAll);
          parts.forEach(p => { const o = document.createElement('option'); o.text = p; o.value = p; sel.appendChild(o); });
          const lbl = document.getElementById('region-label');
          if (lbl) lbl.textContent = (REGION_OPTIONS[regionKey] && REGION_OPTIONS[regionKey].label) || regionKey.toUpperCase();
        }

        useEffect(() => {
          // init flatpickr on the two inputs (if available)
          if (window.flatpickr && fromRef.current && toRef.current) {
            try { if (fromFp.current) fromFp.current.destroy(); } catch (e) {}
            try { if (toFp.current) toFp.current.destroy(); } catch (e) {}
            fromFp.current = window.flatpickr(fromRef.current, {
              dateFormat: "Y-m-d",
              defaultDate: dateFrom,
              allowInput: true,
              onChange: function (selectedDates) {
                if (selectedDates && selectedDates.length) {
                  const iso = formatDateISO(selectedDates[0]);
                  setDateFrom(iso);
                  try { if (toFp.current) toFp.current.set('minDate', iso); } catch(e){}
                }
              }
            });
            toFp.current = window.flatpickr(toRef.current, {
              dateFormat: "Y-m-d",
              defaultDate: dateTo,
              allowInput: true,
              onChange: function (selectedDates) {
                if (selectedDates && selectedDates.length) {
                  const iso = formatDateISO(selectedDates[0]);
                  setDateTo(iso);
                  try { if (fromFp.current) fromFp.current.set('maxDate', iso); } catch(e){}
                }
              }
            });
          }
          // populate initial locations
          populateLocationOptions(selectedRegion);

          // cleanup on unmount
          return function () {
            try { if (fromFp.current) fromFp.current.destroy(); } catch (e) {}
            try { if (toFp.current) toFp.current.destroy(); } catch (e) {}
          };
        }, []);

        // keep flatpickr inputs in sync with state
        useEffect(() => {
          try { if (fromFp.current && dateFrom) fromFp.current.setDate(dateFrom, false); } catch (e) {}
          try { if (toFp.current && dateTo) toFp.current.setDate(dateTo, false); } catch (e) {}
        }, [dateFrom, dateTo]);

        // when region changes, reset location
        useEffect(() => {
          setSelectedLocation("All locations");
          populateLocationOptions(selectedRegion);
        }, [selectedRegion]);

        // Handler: runForRange — dispatch a DOM CustomEvent with details so table page can listen
        function runForRange() {
          setLoading(true);
          try {
            const detail = { start: dateFrom, end: dateTo, region: selectedRegion, location: selectedLocation, employee_id: employeeId };
            // dispatch event
            window.dispatchEvent(new CustomEvent('header-run', { detail }));
          } finally {
            setLoading(false);
          }
        }

        function loadLatest() {
          setLoading(true);
          try {
            const d = new Date(); d.setDate(d.getDate() - 1); const iso = formatDateISO(d);
            setDateFrom(iso); setDateTo(iso);
            const detail = { start: iso, end: iso, region: selectedRegion, location: selectedLocation, employee_id: employeeId };
            window.dispatchEvent(new CustomEvent('header-load-latest', { detail }));
          } finally {
            setLoading(false);
          }
        }

        function regionDisplayLabel(key) {
          if (!key) return '';
          return (REGION_OPTIONS[key] && REGION_OPTIONS[key].label) ? REGION_OPTIONS[key].label : key.toUpperCase();
        }

        return (
          <div className="topbar" role="banner" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,padding:'12px 16px',background:'#fff',borderRadius:8}}>
            <div className="wu-brand" aria-hidden={false} style={{display:'flex',alignItems:'center',gap:12}}>
              <div className="wu-logo">WU</div>
              <div className="title-block">
                <h1 style={{margin:0}}>Western Union — Trend Analysis</h1>
                <p style={{ margin: 0, fontSize: 13 }}>
                  {regionDisplayLabel(selectedRegion)} {selectedLocation && selectedLocation !== "All locations" ? "— " + selectedLocation : ""}
                </p>
              </div>
            </div>

            <button
              className="btn-ghost"
              onClick={() => { window.location.href = 'analysis_table.html'; }}
              disabled={loading}
            >
              Open table page
            </button>

            <div className="header-actions" role="region" aria-label="controls" style={{display:'flex',alignItems:'center',gap:8}}>
              <div className="control" style={{display:'flex',flexDirection:'column'}}>
                <label className="small" htmlFor="fromDate">From</label>
                <input id="fromDate" ref={fromRef} className="date-input" type="text" placeholder="YYYY-MM-DD" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
              </div>

              <div className="control" style={{display:'flex',flexDirection:'column'}}>
                <label className="small" htmlFor="toDate">To</label>
                <input id="toDate" ref={toRef} className="date-input" type="text" placeholder="YYYY-MM-DD" value={dateTo} onChange={e => setDateTo(e.target.value)} />
              </div>

              <div style={{display:'flex',flexDirection:'column'}}>
                <label className="small" htmlFor="regionSelect">Region</label>
                <select id="regionSelect" value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)}>
                  <option value="apac">APAC</option>
                  <option value="emea">EMEA</option>
                  <option value="laca">LACA</option>
                  <option value="namer">NAMER</option>
                </select>
              </div>

              <div style={{display:'flex',flexDirection:'column'}}>
                <label className="small" htmlFor="locationSelect">Location</label>
                <select id="locationSelect" value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
                  <option>All locations</option>
                </select>
              </div>

              <div style={{display:'flex',flexDirection:'column'}}>
                <label className="small" htmlFor="employeeId">Employee ID</label>
                <input id="employeeId" placeholder="e.g. 326131" value={employeeId} onChange={e => setEmployeeId(e.target.value)} />
              </div>

              <button className="btn-primary" onClick={runForRange} disabled={loading}>Run</button>
              <button className="btn-ghost" onClick={loadLatest} disabled={loading}>Load latest</button>
            </div>
          </div>
        );
      }

      // mount header component to #header-root
      try {
        const rootEl = document.getElementById('header-root');
        if (rootEl) {
          ReactDOM.createRoot(rootEl).render(React.createElement(HeaderStandalone));
        }
      } catch (e) {
        console.error('Header mount failed', e);
      }
    })();
  </script>
  
</body>
