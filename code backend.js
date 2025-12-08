<div id="header-root"></div>

<script type="text/babel">
(function () {
  const { useState, useEffect, useRef } = React;

  function pad(n){return n.toString().padStart(2,'0');}
  function formatDateISO(d){const dt=d instanceof Date?d:new Date(d);return dt.getFullYear()+"-"+pad(dt.getMonth()+1)+"-"+pad(dt.getDate());}

  function HeaderStandalone() {
    const [loading, setLoading] = useState(false);
    const [dateFrom, setDateFrom] = useState(() => { const d=new Date(); d.setDate(d.getDate()-1); return formatDateISO(d); });
    const [dateTo, setDateTo] = useState(() => formatDateISO(new Date()));
    const fromRef = useRef(null);
    const toRef = useRef(null);
    const fromFp = useRef(null);
    const toFp = useRef(null);

    useEffect(() => {
      if (window.flatpickr && fromRef.current && toRef.current) {
        fromFp.current = window.flatpickr(fromRef.current, { dateFormat:"Y-m-d", defaultDate:dateFrom, allowInput:true, onChange:sd => { if(sd.length){ setDateFrom(formatDateISO(sd[0])); toFp.current?.set('minDate', formatDateISO(sd[0])); } } });
        toFp.current = window.flatpickr(toRef.current, { dateFormat:"Y-m-d", defaultDate:dateTo, allowInput:true, onChange:sd => { if(sd.length){ setDateTo(formatDateISO(sd[0])); fromFp.current?.set('maxDate', formatDateISO(sd[0])); } } });
      }
      return ()=>{ fromFp.current?.destroy(); toFp.current?.destroy(); }
    }, []);

    function runForRange() {
      setLoading(true);
      try { window.dispatchEvent(new CustomEvent('header-run',{detail:{start:dateFrom,end:dateTo}})); }
      finally { setLoading(false); }
    }

    function loadLatest() {
      setLoading(true);
      try { const d=new Date(); d.setDate(d.getDate()-1); const iso=formatDateISO(d); setDateFrom(iso); setDateTo(iso); window.dispatchEvent(new CustomEvent('header-load-latest',{detail:{start:iso,end:iso}})); }
      finally { setLoading(false); }
    }

    return (
      <div className="topbar" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,padding:'12px 16px',background:'#fff',borderRadius:8}}>
        <div className="wu-brand" style={{display:'flex',alignItems:'center',gap:12}}>
          <div className="wu-logo">WU</div>
          <div className="title-block">
            <h1 style={{margin:0}}>Western Union — Trend Analysis</h1>
            <p style={{ margin: 0, fontSize: 13 }}>APAC</p>
          </div>
        </div>

        <button className="btn-ghost" onClick={()=>{window.location.href='analysis_table.html';}} disabled={loading}>Open table page</button>

        <div className="header-actions" style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{display:'flex',flexDirection:'column'}}>
            <label className="small" htmlFor="fromDate">From</label>
            <input id="fromDate" ref={fromRef} className="date-input" type="text" placeholder="YYYY-MM-DD" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} />
          </div>
          <div style={{display:'flex',flexDirection:'column'}}>
            <label className="small" htmlFor="toDate">To</label>
            <input id="toDate" ref={toRef} className="date-input" type="text" placeholder="YYYY-MM-DD" value={dateTo} onChange={e=>setDateTo(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={runForRange} disabled={loading}>Run</button>
          <button className="btn-ghost" onClick={loadLatest} disabled={loading}>Load latest</button>
        </div>
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById('header-root')).render(React.createElement(HeaderStandalone));
})();
</script>