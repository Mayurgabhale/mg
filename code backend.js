<!-- header.html -->
<head>
  <meta charset="utf-8" />
  <title>Western Union — Trend Analysis</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script crossorigin src="https://unpkg.com/babel-standalone@6.26.0/babel.min.js"></script>

  <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
  
  <link rel="stylesheet" href="style.css">
</head>

<body>
  <div id="header-root"></div>

  <script type="text/babel">
    (function () {
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
            fromFp.current = window.flatpickr(fromRef.current, {
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
            toFp.current = window.flatpickr(toRef.current, {
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
          return () => {
            if(fromFp.current) fromFp.current.destroy();
            if(toFp.current) toFp.current.destroy();
          }
        }, []);

        useEffect(() => {
          if(fromFp.current) fromFp.current.setDate(dateFrom, false);
          if(toFp.current) toFp.current.setDate(dateTo, false);
        }, [dateFrom, dateTo]);

        function runForRange(){
          setLoading(true);
          try {
            const detail = { start: dateFrom, end: dateTo };
            window.dispatchEvent(new CustomEvent('header-run', { detail }));
          } finally { setLoading(false); }
        }

        function loadLatest(){
          setLoading(true);
          try {
            const d = new Date(); d.setDate(d.getDate()-1);
            const iso = formatDateISO(d);
            setDateFrom(iso); setDateTo(iso);
            const detail = { start: iso, end: iso };
            window.dispatchEvent(new CustomEvent('header-load-latest', { detail }));
          } finally { setLoading(false); }
        }

        return (
          <div className="topbar" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,padding:'12px 16px',background:'#fff',borderRadius:8}}>
            <div className="wu-brand" style={{display:'flex',alignItems:'center',gap:12}}>
              <div className="wu-logo">WU</div>
              <div className="title-block">
                <h1 style={{margin:0}}>Western Union — Trend Analysis</h1>
                <p style={{margin:0,fontSize:13}}>APAC</p>
              </div>
            </div>

            <div style={{display:'flex',alignItems:'center',gap:8}}>
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

      try {
        const rootEl = document.getElementById('header-root');
        if(rootEl) ReactDOM.createRoot(rootEl).render(React.createElement(HeaderStandalone));
      } catch(e){
        console.error('Header mount failed', e);
      }
    })();
  </script>
</body>