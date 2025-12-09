can you rechagne all code each line carefully..
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

    <!-- header.html -->
    <div id="header-ui"></div>
    <script type="text/babel">
        const { useState, useEffect, useRef } = React;

        function pad(n) { return String(n).padStart(2, '0'); }
        function formatDateISO(d) {
            if (!d) return '';
            const dt = (d instanceof Date) ? d : new Date(d);
            return dt.getFullYear() + '-' + pad(dt.getMonth() + 1) + '-' + pad(dt.getDate());
        }

        function HeaderStandalone() {
            const [dateFrom, setDateFrom] = useState(() => {
                const d = new Date(); d.setDate(d.getDate() - 1); return formatDateISO(d);
            });
            const [dateTo, setDateTo] = useState(() => formatDateISO(new Date()));
            const [loading, setLoading] = useState(false);

            const fromRef = useRef(null);
            const toRef = useRef(null);
            const fromFp = useRef(null);
            const toFp = useRef(null);

            useEffect(() => {
                if (window.flatpickr && fromRef.current && toRef.current) {
                    fromFp.current = flatpickr(fromRef.current, {
                        dateFormat: "Y-m-d",
                        defaultDate: dateFrom,
                        allowInput: true,
                        onChange: sd => {
                            if (sd.length) {
                                setDateFrom(formatDateISO(sd[0]));
                                if (toFp.current) toFp.current.set('minDate', formatDateISO(sd[0]));
                            }
                        }
                    });
                    toFp.current = flatpickr(toRef.current, {
                        dateFormat: "Y-m-d",
                        defaultDate: dateTo,
                        allowInput: true,
                        onChange: sd => {
                            if (sd.length) {
                                setDateTo(formatDateISO(sd[0]));
                                if (fromFp.current) fromFp.current.set('maxDate', formatDateISO(sd[0]));
                            }
                        }
                    });
                }
                return () => { if (fromFp.current) fromFp.current.destroy(); if (toFp.current) toFp.current.destroy(); }
            }, []);

            useEffect(() => {
                if (fromFp.current) fromFp.current.setDate(dateFrom, false);
                if (toFp.current) toFp.current.setDate(dateTo, false);
            }, [dateFrom, dateTo]);

            function runForRange() {
                setLoading(true);
                const detail = { start: dateFrom, end: dateTo };
                window.dispatchEvent(new CustomEvent('header-run', { detail }));
                setLoading(false);
            }

            function loadLatest() {
                setLoading(true);
                const d = new Date(); d.setDate(d.getDate() - 1);
                const iso = formatDateISO(d);
                setDateFrom(iso); setDateTo(iso);
                window.dispatchEvent(new CustomEvent('header-load-latest', { detail: { start: iso, end: iso } }));
                setLoading(false);
            }

            return (
                <div className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#fff', borderRadius: 8 }}>
                    <div className="wu-brand">
                        <h1>Western Union — Trend Analysis</h1>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input ref={fromRef} type="text" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                        <input ref={toRef} type="text" value={dateTo} onChange={e => setDateTo(e.target.value)} />
                        <button onClick={runForRange} disabled={loading}>Run</button>
                        <button onClick={loadLatest} disabled={loading}>Load latest</button>
                    </div>
                </div>
            );
        }

        document.addEventListener('DOMContentLoaded', () => {
            const rootEl = document.getElementById('header-ui');
            if (rootEl) ReactDOM.createRoot(rootEl).render(<HeaderStandalone />);
        });
    </script>

</body>
C:\Users\W0024618\Trend-Analysis\frontend\analysis_table.html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Behaviour Analysis — Table Only (static)</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />

  <!-- Include React/Babel/Flatpickr too because header.html uses them -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script crossorigin src="https://unpkg.com/babel-standalone@6.26.0/babel.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
  <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
  <link rel="stylesheet" href="style.css">

  <style>
    body { background:#f7fafc; font-family: Inter, system-ui, Arial, sans-serif; color:#0f172a; margin:0; padding:0; }
    .container { max-width:1200px; margin:18px auto; padding:16px; }
    .small { font-size:12px; color:#475569; }
    .muted { color:#64748b; }
    .table-scroll { background:#fff; border-radius:8px; padding:12px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); margin-top:12px; }
    table { width:100%; border-collapse:collapse; }
    thead th { text-align:left; padding:10px 8px; border-bottom:1px solid #eef2f7; }
    tbody td { padding:8px; border-bottom:1px solid #f1f5f9; vertical-align:top; }
    input, select, button { font:inherit; }
    .pill { display:inline-block; background:#eef2f7; padding:4px 8px; border-radius:999px; margin-right:6px; font-size:12px; color:#0f172a; }
    .btn-primary { background:#2563eb; color:#fff; border:none; padding:8px 10px; border-radius:6px; cursor:pointer; }
    .btn-ghost { background:#fff; border:1px solid #e6edf3; padding:8px 10px; border-radius:6px; cursor:pointer; }
    .small-button { background:#f1f5f9; border:none; padding:6px 8px; border-radius:6px; cursor:pointer; }
    .muted-block { color:#64748b; margin-left:6px; }
    .status { padding:8px; font-size:13px; color:#334155; }
  </style>
</head>
<body>
  <div class="container" id="app">

    <!-- header is loaded from header.html at runtime -->
    <div id="header-ui"></div>

    <div style="display:flex; gap:12px; align-items:center; margin-top:12px;">
      <input id="filterText" placeholder="Search name, employee id, card or reason..." style="flex:1; padding:8px; border-radius:6px; border:1px solid #e6edf3;" />
      <label style="display:flex; align-items:center; gap:8px;">
        <input id="collapseToggle" type="checkbox" checked /> <span class="small muted">Collapse duplicates</span>
      </label>
      <button class="small-button" id="exportBtn">Export filtered</button>
      <div id="status" class="status muted-block">Ready</div>
    </div>

    <div class="table-scroll" role="region" aria-label="results table" id="tableWrap">
      <table id="resultsTable" aria-live="polite">
        <thead>
          <tr>
            <th>Employee</th>
            <th class="small">ID</th>
            <th class="small">Card</th>
            <th class="small">Date</th>
            <th class="small">Duration</th>
            <th class="small">Violation Days</th>
            <th class="small">Reasons</th>
            <th class="small">Evidence</th>
          </tr>
        </thead>
        <tbody id="resultsBody">
          <!-- rows injected here -->
        </tbody>
      </table>

      <div style="display:flex; gap:8px; align-items:center; margin-top:10px;">
        <button id="prevBtn" class="small-button">Prev</button>
        <div class="muted" id="pageInfo">Page 1 / 1</div>
        <button id="nextBtn" class="small-button">Next</button>
      </div>
    </div>
  </div>

<script>
/*
  analysis_table.html
  - loads header.html into #header-ui and executes its scripts
  - wires up table logic and listens to header events (header-run, header-load-latest)
*/

(function () {
  // load header.html and execute its scripts
  function insertHeaderAndRunScripts(htmlText) {
    const container = document.getElementById('header-ui');
    if (!container) return;

    // create a temporary DOM to parse header.html content
    const tmp = document.createElement('div');
    tmp.innerHTML = htmlText;

    // move any <head> children (like <link> or scripts referencing src) into document.head
    // and <body> children into the container.
    // If header.html contains inline scripts (type="text/babel"), we'll extract and run them after insertion.
    const scriptsToRun = [];

    // move links/styles from head (if present in fetched fragment)
    const headChildren = tmp.querySelectorAll('head > link, head > style, head > script');
    headChildren.forEach(n => {
      if (n.tagName.toLowerCase() === 'script') {
        // external script src -> append to head (so browser loads it)
        if (n.src) {
          const s = document.createElement('script');
          s.src = n.src;
          s.crossOrigin = n.crossOrigin || null;
          document.head.appendChild(s);
        } else {
          // inline script -> collect text
          scriptsToRun.push({ code: n.innerHTML, isBabel: n.type && n.type.indexOf('babel') !== -1 });
        }
      } else {
        document.head.appendChild(n.cloneNode(true));
      }
    });

    // append body content
    // const bodyChildren = tmp.querySelectorAll('body > *');
    const bodyChildren = tmp.querySelectorAll('div.topbar, script');
    bodyChildren.forEach(n => container.appendChild(n.cloneNode(true)));

    // also handle scripts that may be inside body (inline)
    const bodyScripts = tmp.querySelectorAll('script');
    bodyScripts.forEach(n => {
      if (n.src) {
        const s = document.createElement('script');
        s.src = n.src;
        document.head.appendChild(s);
      } else {
        scriptsToRun.push({ code: n.innerHTML, isBabel: n.type && n.type.indexOf('babel') !== -1 });
      }
    });

    // Execute non-babel scripts as normal JS
    scriptsToRun.forEach(s => {
      try {
        if (s.isBabel && window.Babel) {
          // transpile and run
          const transpiled = Babel.transform(s.code, { presets: ['react'] }).code;
          const f = new Function(transpiled);
          f();
        } else {
          const f = new Function(s.code);
          f();
        }
      } catch (e) {
        console.error('Error executing header script', e);
      }
    });
  }

  fetch('header.html').then(r => r.text()).then(htmlText => {
    insertHeaderAndRunScripts(htmlText);
    // after header loaded, init table wiring
    initTableApp();
  }).catch(err => {
    console.error('Failed to load header.html', err);
    // still init table so page works in degraded mode
    initTableApp();
  });

  function initTableApp() {
    // CONFIG: change to your API host if needed
    const API_BASE = "http://10.138.161.4:8002";

    const REGION_OPTIONS = {
      "apac": { label: "APAC", partitions: ["Pune","Quezon City","Taguig City","MY.Kuala Lumpur","IN.HYD","SG.Singapore"] },
      "emea": { label: "EMEA", partitions: ["LT.Vilnius","IT.Rome","UK.London","IE.DUblin","DU.Abu Dhab","ES.Madrid"] },
      "laca": { label: "LACA", partitions: ["AR.Cordoba","BR.Sao Paulo","CR.Costa Rica Partition","PA.Panama City","PE.Lima","MX.Mexico City"] },
      "namer": { label: "NAMER", partitions: ["Denver","Austin Texas","Miami","New York"] }
    };

    // DOM refs (these IDs are created by the header)
    const fromDate = () => document.getElementById('fromDate');
    const toDate = () => document.getElementById('toDate');
    const regionSelect = () => document.getElementById('regionSelect');
    const locationSelect = () => document.getElementById('locationSelect');
    const employeeId = () => document.getElementById('employeeId');
    const runBtn = () => document.getElementById('runBtn');
    const loadLatestBtn = () => document.getElementById('loadLatestBtn');
    const filterText = document.getElementById('filterText');
    const collapseToggle = document.getElementById('collapseToggle');
    const resultsBody = document.getElementById('resultsBody');
    const exportBtn = document.getElementById('exportBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');
    const statusEl = document.getElementById('status');
    const openFull = document.getElementById('open-full');
    const regionLabel = document.getElementById('region-label');

    function pad(n){ return String(n).padStart(2,'0'); }
    function formatDateISO(d) { if(!d) return ''; const dt = new Date(d); return dt.getFullYear() + '-' + pad(dt.getMonth()+1) + '-' + pad(dt.getDate()); }
    function sanitizeName(r){ if(!r) return ''; return r.EmployeeName_feat || r.EmployeeName_dur || r.EmployeeName || r.ObjectName1 || r.objectname1 || r.employee_name || r.person_uid || ''; }

    function downloadCSV(rows, filename){
      if(!rows || rows.length === 0){ alert('No rows to export'); return; }
      const cols = Object.keys(rows[0]);
      const lines = [cols.join(',')];
      rows.forEach(r => {
        const row = cols.map(c => JSON.stringify((r[c] === undefined || r[c] === null) ? '' : String(r[c]).replace(/\n/g,' '))).join(',');
        lines.push(row);
      });
      const blob = new Blob([lines.join('\\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = filename || 'export.csv'; a.click(); URL.revokeObjectURL(url);
    }

    function buildAggregated(rowsArr){
      const map = new Map();
      rowsArr.forEach(r=>{
        const id = r.EmployeeID || r.person_uid || (sanitizeName(r) + '|' + (r.CardNumber || r.Card || ''));
        const key = String(id);
        if(!map.has(key)) map.set(key, { EmployeeName:sanitizeName(r), EmployeeID: r.EmployeeID || r.person_uid || '', CardNumber: r.CardNumber || r.Card || '', ViolationCount:0, ReasonsSet:new Set(), ViolationDays:0, ViolationWindowDays:null, RiskLevel:null, RiskScore:null, FirstRow:r, _rows:[] });
        const agg = map.get(key);
        agg.ViolationCount += 1;
        agg._rows.push(r);
        const reasonsField = r.Reasons || r.DetectedScenarios || r.Detected || '';
        String(reasonsField).split(';').map(s=>s && s.trim()).filter(Boolean).forEach(p => agg.ReasonsSet.add(p));
        let candidateCount = null;
        if (r.ViolationDays !== undefined && r.ViolationDays !== null && r.ViolationDays !== "") candidateCount = Number(r.ViolationDays);
        else if (r.ViolationDaysLast !== undefined && r.ViolationDaysLast !== null && r.ViolationDaysLast !== "") candidateCount = Number(r.ViolationDaysLast);
        else if (r.ViolationDaysLast90 !== undefined && r.ViolationDaysLast90 !== null && r.ViolationDaysLast90 !== "") candidateCount = Number(r.ViolationDaysLast90);
        else if (r.ViolationDaysLast_90 !== undefined && r.ViolationDaysLast_90 !== null && r.ViolationDaysLast_90 !== "") candidateCount = Number(r.ViolationDaysLast_90);
        if(candidateCount !== null && !isNaN(candidateCount)) agg.ViolationDays = Math.max(agg.ViolationDays || 0, candidateCount);
        if (r.ViolationWindowDays !== undefined && r.ViolationWindowDays !== null && r.ViolationWindowDays !== "") agg.ViolationWindowDays = r.ViolationWindowDays;
        try {
          const rowRisk = r.RiskLevel || r.Risk || null;
          const rowScore = (r.RiskScore !== undefined && r.RiskScore !== null) ? Number(r.RiskScore) : null;
          const sevMap = { "Low":1, "Low Medium":2, "Medium":3, "Medium High":4, "High":5 };
          const severityFor = l => (l ? (sevMap[String(l)]||1) : 1);
          if(rowRisk){
            const cur = severityFor(agg.RiskLevel);
            const thisS = severityFor(rowRisk);
            if(!agg.RiskLevel || thisS > cur) agg.RiskLevel = rowRisk;
          }
          if(rowScore !== null && (!agg.RiskScore || Number(rowScore) > Number(agg.RiskScore))) agg.RiskScore = Number(rowScore);
        } catch(e){}
      });
      const out = [];
      map.forEach(v=>{
        out.push({
          EmployeeName: v.EmployeeName,
          EmployeeID: v.EmployeeID,
          CardNumber: v.CardNumber,
          ViolationCount: v.ViolationCount,
          Reasons: Array.from(v.ReasonsSet).join(';'),
          ViolationDays: v.ViolationDays || 0,
          ViolationWindowDays: v.ViolationWindowDays || null,
          RiskLevel: v.RiskLevel || null,
          RiskScore: v.RiskScore || null,
          FirstRow: v.FirstRow,
          _rows: v._rows
        });
      });
      out.sort((a,b)=>{
        const aVal = (a.ViolationDays !== undefined && a.ViolationDays !== null) ? Number(a.ViolationDays) : (a.ViolationCount || 0);
        const bVal = (b.ViolationDays !== undefined && b.ViolationDays !== null) ? Number(b.ViolationDays) : (b.ViolationCount || 0);
        if(bVal !== aVal) return bVal - aVal;
        return (a.EmployeeName||'').localeCompare(b.EmployeeName||'');
      });
      return out;
    }

    // UI / state
    let rows = []; // raw rows
    let page = 1;
    const pageSize = 25;

    function setStatus(text, isError){
      if (!statusEl) return;
      statusEl.textContent = text;
      statusEl.className = isError ? 'status error' : 'status';
    }

    function populateLocationOptions(regionKey){
      const sel = document.getElementById('locationSelect');
      if (!sel) return;
      sel.innerHTML = '';
      const optAll = document.createElement('option'); optAll.textContent = 'All locations'; optAll.value = 'All locations'; sel.appendChild(optAll);
      const parts = (REGION_OPTIONS[regionKey] && REGION_OPTIONS[regionKey].partitions) || [];
      parts.forEach(p => {
        const o = document.createElement('option'); o.textContent = p; o.value = p; sel.appendChild(o);
      });
      const lbl = document.getElementById('region-label');
      if (lbl) lbl.textContent = (REGION_OPTIONS[regionKey] && REGION_OPTIONS[regionKey].label) || regionKey.toUpperCase();
    }

    function renderTable(){
      const filter = (filterText.value || '').toLowerCase().trim();
      const collapse = collapseToggle.checked;
      const filtered = (rows || []).filter(r => {
        const hay = (sanitizeName(r) + ' ' + (r.EmployeeID||'') + ' ' + (r.CardNumber||'') + ' ' + (r.Reasons||r.DetectedScenarios||'')).toLowerCase();
        return !filter || hay.indexOf(filter) !== -1;
      });
      const source = collapse ? buildAggregated(filtered) : filtered;
      const totalPages = Math.max(1, Math.ceil((source.length || 0) / pageSize));
      if(page > totalPages) page = totalPages;
      const pageRows = (source || []).slice((page-1)*pageSize, page*pageSize);
      resultsBody.innerHTML = '';
      if(pageRows.length === 0){
        const tr = document.createElement('tr'); const td = document.createElement('td'); td.colSpan = 8; td.className = 'muted'; td.textContent = 'No rows';
        tr.appendChild(td); resultsBody.appendChild(tr);
      } else {
        pageRows.forEach((r, idx) => {
          const isAgg = collapse && r && r.ViolationCount !== undefined;
          const displayRow = isAgg ? r.FirstRow : r;
          const tr = document.createElement('tr');
          if(displayRow && displayRow.Reasons && String(displayRow.Reasons).trim()) tr.className = 'flagged-row';
          const tdName = document.createElement('td'); tdName.innerHTML = sanitizeName(displayRow) || '<span class="muted">—</span>';
          const tdId = document.createElement('td'); tdId.className = 'small'; tdId.textContent = isAgg ? (r.EmployeeID||displayRow.EmployeeID||'') : (displayRow.EmployeeID||'');
          const tdCard = document.createElement('td'); tdCard.className = 'small'; tdCard.textContent = isAgg ? (r.CardNumber||displayRow.CardNumber||'') : (displayRow.CardNumber||'');
          const tdDate = document.createElement('td'); tdDate.className = 'small'; tdDate.textContent = displayRow && (displayRow.DisplayDate || displayRow.Date || displayRow.DateOnly || displayRow.FirstSwipe || displayRow.LastSwipe) || '-';
          const tdDur = document.createElement('td'); tdDur.className = 'small'; tdDur.textContent = isAgg ? (displayRow && (displayRow.Duration || (displayRow.DurationSeconds ? formatSecondsToHmJS(Number(displayRow.DurationSeconds)) : '-'))) : (displayRow && (displayRow.Duration || (displayRow.DurationSeconds ? formatSecondsToHmJS(Number(displayRow.DurationSeconds)) : '-') ) || '');
          let violationCount = '';
          if(isAgg){
            if(r.ViolationDays !== undefined && r.ViolationDays !== null && r.ViolationDays !== '') violationCount = String(r.ViolationDays);
            else if(r.ViolationDaysLast !== undefined && r.ViolationDaysLast !== null && r.ViolationDaysLast !== '') violationCount = String(r.ViolationDaysLast);
            else if(r.ViolationDaysLast90 !== undefined && r.ViolationDaysLast90 !== null && r.ViolationDaysLast90 !== '') violationCount = String(r.ViolationDaysLast90);
            else if(r.ViolationDaysLast_90 !== undefined && r.ViolationDaysLast_90 !== null && r.ViolationDaysLast_90 !== '') violationCount = String(r.ViolationDaysLast_90);
          } else {
            if(displayRow && displayRow.ViolationDays !== undefined && displayRow.ViolationDays !== null && displayRow.ViolationDays !== '') violationCount = String(displayRow.ViolationDays);
            else if(displayRow && displayRow.ViolationDaysLast !== undefined && displayRow.ViolationDaysLast !== null && displayRow.ViolationDaysLast !== '') violationCount = String(displayRow.ViolationDaysLast);
            else if(displayRow && displayRow.ViolationDaysLast90 !== undefined && displayRow.ViolationDaysLast90 !== null && displayRow.ViolationDaysLast90 !== '') violationCount = String(displayRow.ViolationDaysLast90);
            else if(displayRow && displayRow.ViolationDaysLast_90 !== undefined && displayRow.ViolationDaysLast_90 !== null && displayRow.ViolationDaysLast_90 !== '') violationCount = String(displayRow.ViolationDaysLast_90);
          }
          const tdViol = document.createElement('td'); tdViol.className = 'small'; tdViol.innerHTML = violationCount !== '' ? violationCount : '<span class="muted">—</span>';
          const tdReasons = document.createElement('td'); tdReasons.className = 'small';
          const reasonsText = isAgg ? (r.Reasons || displayRow.Reasons || displayRow.DetectedScenarios) : (displayRow.Reasons || displayRow.DetectedScenarios || '');
          if(!reasonsText) tdReasons.innerHTML = '<span class="muted">—</span>';
          else {
            String(reasonsText).split(';').map(s=>s && s.trim()).filter(Boolean).forEach(p => {
              const s = document.createElement('span'); s.className='pill'; s.textContent = p; tdReasons.appendChild(s);
            });
          }
          const tdEvidence = document.createElement('td'); tdEvidence.className='small';
          const btnE = document.createElement('button'); btnE.className='small-button'; btnE.textContent = 'Evidence';
          btnE.onclick = function(){ alert('Evidence modal not implemented on this static page.'); };
          tdEvidence.appendChild(btnE);
          if(isAgg){ const span = document.createElement('span'); span.className='muted'; span.style.marginLeft='8px'; span.textContent = `(${r.ViolationCount} rows)`; tdEvidence.appendChild(span); }
          tr.appendChild(tdName); tr.appendChild(tdId); tr.appendChild(tdCard); tr.appendChild(tdDate); tr.appendChild(tdDur); tr.appendChild(tdViol); tr.appendChild(tdReasons); tr.appendChild(tdEvidence);
          resultsBody.appendChild(tr);
        });
      }
      pageInfo.textContent = 'Page ' + page + ' / ' + totalPages;
    }

    async function fetchRun(start, end){
      setStatus('Loading…');
      try {
        let url = API_BASE + '/run?start=' + encodeURIComponent(start) + '&end=' + encodeURIComponent(end) + '&full=true';
        const regEl = document.getElementById('regionSelect');
        const locEl = document.getElementById('locationSelect');
        const eidEl = document.getElementById('employeeId');
        const reg = regEl ? regEl.value : null;
        if(reg) url += '&region=' + encodeURIComponent(reg);
        const loc = locEl ? locEl.value : null;
        if(loc && loc !== 'All locations'){
          url += '&city=' + encodeURIComponent(loc);
        }
        const eid = eidEl ? String(eidEl.value).trim() : null;
        if(eid) url += '&employee_id=' + encodeURIComponent(eid);
        const r = await fetch(url, { method:'GET' });
        if(!r.ok){
          const txt = await r.text().catch(()=>'<no body>');
          throw new Error('API ' + r.status + ': ' + txt);
        }
        const js = await r.json();
        rows = Array.isArray(js.sample) ? js.sample : (Array.isArray(js.flagged_persons) ? js.flagged_persons : (Array.isArray(js.rows) ? js.rows : []));
        setStatus('Loaded ' + (rows.length||0) + ' rows');
        page = 1;
        renderTable();
      } catch (err){
        console.error(err);
        setStatus('Error: ' + err.message, true);
        rows = [];
        renderTable();
      }
    }

    function loadLatest(){
      const d = new Date(); d.setDate(d.getDate()-1);
      const iso = formatDateISO(d);
      const fd = document.getElementById('fromDate'); const td = document.getElementById('toDate');
      if(fd) fd.value = iso; if(td) td.value = iso;
      fetchRun(iso, iso);
    }

    // wire controls (some may be created by header)
    document.addEventListener('header-run', function (e) {
      try {
        const d = e.detail || {};
        const f = d.start; const t = d.end;
        // copy header inputs to DOM inputs (they already are same elements) but ensure fetch uses same
        fetchRun(f, t);
      } catch (err) { console.error(err); }
    });
    document.addEventListener('header-load-latest', function (e) {
      try {
        const d = e.detail || {};
        fetchRun(d.start, d.end);
      } catch (err) { console.error(err); }
    });

    // fallback bindings if header didn't load
    const localRunBtn = document.getElementById('runBtn');
    if (localRunBtn) localRunBtn.addEventListener('click', () => {
      const f = document.getElementById('fromDate') ? document.getElementById('fromDate').value : '';
      const t = document.getElementById('toDate') ? document.getElementById('toDate').value : '';
      if(!f || !t){ alert('Please set both From and To dates'); return; }
      fetchRun(f, t);
    });
    const localLoadBtn = document.getElementById('loadLatestBtn');
    if (localLoadBtn) localLoadBtn.addEventListener('click', loadLatest);

    if (filterText) filterText.addEventListener('input', () => { page = 1; renderTable(); });
    if (collapseToggle) collapseToggle.addEventListener('change', () => { page = 1; renderTable(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { if(page>1){ page--; renderTable(); } });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      const filtered = (rows || []).filter(r => {
        const hay = (sanitizeName(r) + ' ' + (r.EmployeeID||'') + ' ' + (r.CardNumber||'') + ' ' + (r.Reasons||r.DetectedScenarios||'')).toLowerCase();
        return !filterText.value || hay.indexOf(filterText.value.toLowerCase()) !== -1;
      });
      const source = collapseToggle.checked ? buildAggregated(filtered) : filtered;
      const totalPages = Math.max(1, Math.ceil((source.length || 0) / pageSize));
      if(page < totalPages){ page++; renderTable(); }
    });
    if (exportBtn) exportBtn.addEventListener('click', () => {
      const filter = (filterText.value || '').toLowerCase().trim();
      const filtered = (rows || []).filter(r => {
        const hay = (sanitizeName(r) + ' ' + (r.EmployeeID||'') + ' ' + (r.CardNumber||'') + ' ' + (r.Reasons||r.DetectedScenarios||'')).toLowerCase();
        return !filter || hay.indexOf(filter) !== -1;
      });
      const source = collapseToggle.checked ? buildAggregated(filtered) : filtered;
      downloadCSV(source, 'analysis_table_export.csv');
    });

    // region select change -> update locations (if header present)
    document.addEventListener('change', function (e) {
      if (e.target && e.target.id === 'regionSelect') {
        populateLocationOptions(e.target.value);
      }
    });

    // init defaults (safe if elements exist or not)
    (function init(){
      const today = new Date();
      const yesterday = new Date(); yesterday.setDate(today.getDate()-1);
      const fd = document.getElementById('fromDate'); const td = document.getElementById('toDate'); const rs = document.getElementById('regionSelect');
      if(fd) fd.value = formatDateISO(yesterday);
      if(td) td.value = formatDateISO(today);
      if(rs) populateLocationOptions(rs.value);
      // attempt initial loadLatest
      try { loadLatest(); } catch(e){}
    })();

    function formatSecondsToHmJS(seconds) {
      if (seconds === null || seconds === undefined || seconds === '') return "-";
      const n = Number(seconds);
      if (isNaN(n) || !isFinite(n)) return "-";
      const s = Math.max(0, Math.floor(n));
      const hh = Math.floor(s / 3600);
      const mm = Math.floor((s % 3600) / 60);
      return String(hh) + ":" + String(mm).padStart(2, '0');
    }

  } // end initTableApp

})();
</script>
</body>
</html>
