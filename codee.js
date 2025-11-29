in this right now we use bar chart,
  but i want to use line chart ok
  so how ot do 

<div style={{ background:'#fff', padding:12, borderRadius:10, boxShadow:'0 6px 18px rgba(2,6,23,0.04)' }}>
                <h3 style={{ marginTop:0 }}>Location wise (top)</h3>
                <div className="chart-wrap chart-small" style={{ marginBottom:12 }}>
                  <canvas ref={chartRef}></canvas>
                </div>
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>EMEA PIN Dashboard — Live</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script crossorigin src="https://unpkg.com/babel-standalone@6.26.0/babel.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <!-- reuse your style -->
  <link rel="stylesheet" href="style.css">
  <style>
    /* small overrides for this page */
    .topbar { margin-bottom: 8px; }
    .small-card { padding: 12px; text-align: center; }
    .top-controls { display:flex; gap:8px; align-items:center; }
    .chart-small { height:220px; }
    .compact-table td { padding:6px; font-size:13px; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
  (function () {
    const { useState, useEffect, useRef } = React;

    // CHANGE THESE as needed:
    const API_BASE = "http://localhost:8003"; // keep same host as other frontends
    // The frontend will call `${API_ENDPOINT}?year=2024&location=UK.London` (location optional)
    // Update to match your backend route if different.
    const API_ENDPOINT = API_BASE + "/api/emea_pin_live"; // <--- change if your backend uses a different route

    // Default region partitions for EMEA (keeps UI consistent)
    const EMEA_PARTITIONS = ["LT.Vilnius","IT.Rome","UK.London","IE.DUblin","DU.Abu Dhab","ES.Madrid","AUT.Vienna","MA.Casablanca","RU.Moscow"];

    function formatDateShort(d) {
      if (!d) return '-';
      try {
        const dt = new Date(d);
        if (isNaN(dt.getTime())) return String(d).slice(0,19);
        return dt.toLocaleString();
      } catch (e) { return String(d); }
    }

    function downloadCSV(rows, filename = 'export.csv') {
      if (!rows || rows.length === 0) { alert("No data to export"); return; }
      const cols = Object.keys(rows[0]);
      const lines = [];
      lines.push(cols.join(','));
      rows.forEach(r => {
        const line = cols.map(c => {
          const v = r[c] === null || r[c] === undefined ? '' : String(r[c]).replace(/\n/g,' ');
          return JSON.stringify(v);
        }).join(',');
        lines.push(line);
      });
      const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
    }

    function EmeaPinApp() {
      const [year, setYear] = useState(new Date().getFullYear());
      const [location, setLocation] = useState('All locations');
      const [live, setLive] = useState(true);
      const [loading, setLoading] = useState(false);
      const [lastFetch, setLastFetch] = useState(null);

      const [total, setTotal] = useState(0);
      const [uniqueEmployees, setUniqueEmployees] = useState(0);
      const [repeatersCount, setRepeatersCount] = useState(0);
      const [byLocation, setByLocation] = useState([]);
      const [byEmployee, setByEmployee] = useState([]);
      const [recent, setRecent] = useState([]);

      const pollingRef = useRef(null);
      const inFlightRef = useRef(false);
      const chartRef = useRef(null);
      const chartInst = useRef(null);

      async function fetchOnce() {
        if (inFlightRef.current) return;
        inFlightRef.current = true;
        setLoading(true);
        try {
          const params = new URLSearchParams();
          if (year) params.set('year', String(year));
          if (location && location !== 'All locations') params.set('location', location);
          const url = API_ENDPOINT + '?' + params.toString();

          const r = await fetch(url, { cache: 'no-store' });
          if (!r.ok) {
            // try to read body to help debugging
            const txt = await r.text().catch(() => '');
            throw new Error('API error: ' + r.status + ' ' + txt);
          }
          const js = await r.json();

          // Try to adapt multiple shapes
          // Preferred keys: total_rejections, by_location, by_employee, recent
          const total_rejections = (js.total_rejections !== undefined) ? js.total_rejections
            : (js.total !== undefined ? js.total : (js.totalRejections || 0));

          const rawByLoc = js.by_location || js.byLocation || js.location_counts || [];
          const normalizedByLoc = Array.isArray(rawByLoc) ? rawByLoc.map(x => {
            // accept either {PartitionName2, count} or {partition, count} or {location, count}
            const k = x.PartitionName2 || x.partition || x.location || x.name || x.PartitionName || '';
            const c = x.count !== undefined ? x.count : (x.value !== undefined ? x.value : 0);
            return { name: String(k || '').trim(), count: Number(c || 0) };
          }) : [];

          const rawByEmp = js.by_employee || js.byEmployee || js.employee_counts || [];
          const normalizedByEmp = Array.isArray(rawByEmp) ? rawByEmp.map(x => {
            // accept {person_uid, count} or {EmployeeID, count}
            const id = x.person_uid || x.EmployeeID || x.employee_id || x.id || x.person || '';
            const c = x.count !== undefined ? x.count : (x.value !== undefined ? x.value : 0);
            return { id: String(id || '').trim(), count: Number(c || 0) };
          }) : [];

          const rawRecent = js.recent || js.rows || js.events || js.recent_rows || [];

          setTotal(Number(total_rejections || 0));
          setByLocation(normalizedByLoc);
          setByEmployee(normalizedByEmp);
          setRecent(Array.isArray(rawRecent) ? rawRecent : []);
          // compute unique employees & repeaters
          const unique = new Set((normalizedByEmp || []).map(e => e.id).filter(Boolean));
          setUniqueEmployees(unique.size);
          const repeaters = (normalizedByEmp || []).filter(e => e.count > 1);
          setRepeatersCount(repeaters.length);

          setLastFetch(new Date().toISOString());
        } catch (err) {
          console.error("Fetch EMEA PIN failed", err);
        } finally {
          setLoading(false);
          inFlightRef.current = false;
        }
      }

      // start / stop polling
      useEffect(() => {
        // immediate first fetch
        fetchOnce();

        if (live) {
          // setInterval with 1 second
          pollingRef.current = setInterval(fetchOnce, 1000);
        }
        return () => {
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [live, year, location]);

      // build chart when byLocation updates
      useEffect(() => {
        const labels = (byLocation || []).slice(0, 12).map(x => x.name || 'Unknown');
        const values = (byLocation || []).slice(0, 12).map(x => x.count || 0);
        const ctx = chartRef.current && chartRef.current.getContext ? chartRef.current.getContext('2d') : null;
        if (!ctx) return;
        try { if (chartInst.current) chartInst.current.destroy(); } catch (e) {}
        chartInst.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'PIN rejections',
              data: values,
              backgroundColor: labels.map((l,i)=> 'rgba(37,99,235,0.9)'),
            }]
          },
          options: {
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { precision:0 } } }
          }
        });
        // eslint-disable-next-line
      }, [byLocation]);

      function exportAll() {
        // merge top lists into csv-friendly rows
        const rows = [];
        (recent || []).forEach(r => {
          rows.push({
            Timestamp: r.LocaleMessageTime || r.Date || r.time || '',
            EmployeeName: r.EmployeeName || r.Employee || '',
            EmployeeID: r.EmployeeID || r.person_uid || '',
            PartitionName2: r.PartitionName2 || r.location || '',
            Door: r.DoorName || r.Door || r.ObjectName2 || '',
            CardNumber: r.CardNumber || r.Card || ''
          });
        });
        if (rows.length === 0) {
          alert('No recent events to export');
          return;
        }
        downloadCSV(rows, `emea_pin_recent_${String(year)}.csv`);
      }

      return (
        <div className="container" >
          <div className="topbar" role="banner" style={{ marginBottom: 10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div className="wu-logo">WU</div>
              <div>
                <h1 style={{ margin: 0, color: 'var(--wu-yellow)' }}>EMEA PIN — Live Dashboard</h1>
                <div style={{ fontSize: 13, color: '#e6e6e6' }}>Live PIN rejections</div>
              </div>
            </div>

            <div className="header-actions" style={{ alignItems:'center' }}>
              <div style={{ display:'flex', gap:8, alignItems:'center' }} className="top-controls">
                <label className="small" style={{ color:'#e6e6e6' }}>Year</label>
                <input type="number" value={year} onChange={(e)=>setYear(Number(e.target.value||new Date().getFullYear()))} style={{ width:100, padding:6, borderRadius:6 }} />
                <label className="small" style={{ color:'#e6e6e6' }}>Location</label>
                <select value={location} onChange={e=>setLocation(e.target.value)} style={{ padding:6, borderRadius:6 }}>
                  <option>All locations</option>
                  {EMEA_PARTITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>

                <button className="btn-ghost" onClick={() => { setLive(!live); }}>{live ? 'Pause' : 'Resume'}</button>
                <button className="btn-primary" onClick={fetchOnce} disabled={loading}>Refresh</button>
                <button className="small-button" onClick={exportAll}>Export Recent</button>
              </div>
            </div>
          </div>

          <div style={{ display:'flex', gap:12 }}>
            <div style={{ flex:1 }}>
              <div className="cards" style={{ marginBottom:10 }}>
                <div className="card">
                  <div className="card-content">
                    <div className="card-text">
                      <h3>{total.toLocaleString()}</h3>
                      <p>Total rejections</p>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-content">
                    <div className="card-text">
                      <h3>{uniqueEmployees.toLocaleString()}</h3>
                      <p>Unique employees</p>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-content">
                    <div className="card-text">
                      <h3>{repeatersCount.toLocaleString()}</h3>
                      <p>Repeat offenders</p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background:'#fff', padding:12, borderRadius:10, boxShadow:'0 6px 18px rgba(2,6,23,0.04)' }}>
                <h3 style={{ marginTop:0 }}>Location wise (top)</h3>
                <div className="chart-wrap chart-small" style={{ marginBottom:12 }}>
                  <canvas ref={chartRef}></canvas>
                </div>

                <div style={{ display:'flex', gap:12 }}>
                  <div style={{ flex:1 }}>
                    <h4 style={{ margin: '6px 0' }}>Top repeaters</h4>
                    <div className="table-scroll" style={{ maxHeight:220 }}>
                      <table className="compact-table">
                        <thead>
                          <tr><th>Employee</th><th>Count</th></tr>
                        </thead>
                        <tbody>
                          {(byEmployee || []).slice(0,15).map((r,i) => (
                            <tr key={i}><td style={{ padding:'6px 8px' }}>{r.id}</td><td style={{ padding:'6px 8px' }}>{r.count}</td></tr>
                          ))}
                          {(!byEmployee || byEmployee.length===0) && <tr><td colSpan="2" className="muted">No data</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div style={{ width: 320 }}>
                    <h4 style={{ margin: '6px 0' }}>Recent events</h4>
                    <div className="table-scroll" style={{ maxHeight:220 }}>
                      <table className="compact-table">
                        <thead><tr><th>Time</th><th>Loc</th><th>Emp</th></tr></thead>
                        <tbody>
                          {(recent || []).slice(0,12).map((r,i) => (
                            <tr key={i}>
                              <td style={{ padding:'6px 8px' }}>{formatDateShort(r.LocaleMessageTime || r.Date || r.Timestamp)}</td>
                              <td style={{ padding:'6px 8px' }}>{r.PartitionName2 || r.Partition || r.location || '-'}</td>
                              <td style={{ padding:'6px 8px' }}>{r.EmployeeName || r.EmployeeID || r.person_uid || '-'}</td>
                            </tr>
                          ))}
                          {(!recent || recent.length===0) && <tr><td colSpan="3" className="muted">No recent events</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop:10, fontSize:13, color:'#64748b' }}>
                  Last fetch: {lastFetch ? new Date(lastFetch).toLocaleString() : 'never'} {loading ? ' • loading…' : ''}
                </div>
              </div>

            </div>

            <aside style={{ width: 340 }}>
              <div className="card" style={{ padding:10 }}>
                <h4 style={{ marginTop:0 }}>Details</h4>
                <div className="small muted">This dashboard polls the API every second. Use the Year / Location controls to scope results.</div>
                <hr />
                <div>
                  <b>Total rejections:</b> {total}
                </div>
                <div><b>Unique employees:</b> {uniqueEmployees}</div>
                <div><b>Repeaters:</b> {repeatersCount}</div>
                <hr />
                <div>
                  <h5 style={{ margin:'6px 0' }}>Top locations</h5>
                  <div style={{ maxHeight:300, overflow:'auto' }}>
                    <table className="compact-table">
                      <thead><tr><th>Location</th><th>Count</th></tr></thead>
                      <tbody>
                        {(byLocation || []).slice(0,50).map((r,i) => (
                          <tr key={i}><td style={{ padding:'6px 8px' }}>{r.name || '-'}</td><td style={{ padding:'6px 8px' }}>{r.count}</td></tr>
                        ))}
                        {(!byLocation || byLocation.length===0) && <tr><td colSpan="2" className="muted">No location data</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div style={{ height:12 }} />
              <div className="card" style={{ padding:10 }}>
                <h4 style={{ marginTop:0 }}>Actions</h4>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="small-button" onClick={() => { setLocation('All locations'); setYear(new Date().getFullYear()); }}>Reset</button>
                  <button className="small-button" onClick={() => downloadCSV((recent||[]).slice(0,200), `emea_pin_recent_${year}.csv`)}>Export Recent</button>
                </div>
              </div>

            </aside>
          </div>
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(EmeaPinApp));
  })();
  </script>
</body>
</html>
