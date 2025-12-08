<!-- header.html -->
<div id="header-root"></div>
<script type="text/babel">
  const { useState, useEffect, useRef } = React;

  function pad(n){ return String(n).padStart(2,'0'); }
  function formatDateISO(d){ 
    if(!d) return ''; 
    const dt = (d instanceof Date) ? d : new Date(d);
    return dt.getFullYear() + '-' + pad(dt.getMonth()+1) + '-' + pad(dt.getDate());
  }

  function HeaderStandalone() {
    const [dateFrom, setDateFrom] = useState(() => {
      const d = new Date(); d.setDate(d.getDate()-1); return formatDateISO(d);
    });
    const [dateTo, setDateTo] = useState(() => formatDateISO(new Date()));
    const [loading, setLoading] = useState(false);

    const fromRef = useRef(null);
    const toRef = useRef(null);
    const fromFp = useRef(null);
    const toFp = useRef(null);

    useEffect(() => {
      if(window.flatpickr && fromRef.current && toRef.current){
        fromFp.current = flatpickr(fromRef.current, {
          dateFormat:"Y-m-d",
          defaultDate: dateFrom,
          allowInput: true,
          onChange: sd => {
            if(sd.length){
              setDateFrom(formatDateISO(sd[0]));
              if(toFp.current) toFp.current.set('minDate', formatDateISO(sd[0]));
            }
          }
        });
        toFp.current = flatpickr(toRef.current, {
          dateFormat:"Y-m-d",
          defaultDate: dateTo,
          allowInput: true,
          onChange: sd => {
            if(sd.length){
              setDateTo(formatDateISO(sd[0]));
              if(fromFp.current) fromFp.current.set('maxDate', formatDateISO(sd[0]));
            }
          }
        });
      }
      return () => { if(fromFp.current) fromFp.current.destroy(); if(toFp.current) toFp.current.destroy(); }
    }, []);

    useEffect(() => {
      if(fromFp.current) fromFp.current.setDate(dateFrom, false);
      if(toFp.current) toFp.current.setDate(dateTo, false);
    }, [dateFrom, dateTo]);

    function runForRange(){
      setLoading(true);
      const detail = { start: dateFrom, end: dateTo };
      window.dispatchEvent(new CustomEvent('header-run', { detail }));
      setLoading(false);
    }

    function loadLatest(){
      setLoading(true);
      const d = new Date(); d.setDate(d.getDate()-1);
      const iso = formatDateISO(d);
      setDateFrom(iso); setDateTo(iso);
      window.dispatchEvent(new CustomEvent('header-load-latest', { detail: { start: iso, end: iso } }));
      setLoading(false);
    }

    return (
      <div className="topbar" style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, padding:'12px 16px', background:'#fff', borderRadius:8}}>
        <div className="wu-brand">
          <h1>Western Union — Trend Analysis</h1>
        </div>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <input ref={fromRef} type="text" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} />
          <input ref={toRef} type="text" value={dateTo} onChange={e=>setDateTo(e.target.value)} />
          <button onClick={runForRange} disabled={loading}>Run</button>
          <button onClick={loadLatest} disabled={loading}>Load latest</button>
        </div>
      </div>
    );
  }

  document.addEventListener('DOMContentLoaded', () => {
    const rootEl = document.getElementById('header-root');
    if(rootEl) ReactDOM.createRoot(rootEl).render(<HeaderStandalone />);
  });
</script>