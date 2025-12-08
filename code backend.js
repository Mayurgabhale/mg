keep as it is ony remove headr in analysis_table.html and get header in analysis_table.html fomr header.html file ok
without cahing any logic and code, just seprete it ok, and give me boht update file carefullly
ok, now give me boht file correct header.html and frontend\analysis_table.html
ok and more carefully. ok 
C:\Users\W0024618\Trend-Analysis\frontend\header.html

<!-- shared_header.html -->
<div class="topbar" role="banner" id="shared-topbar" style="display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 16px;background:#fff;border-radius:8px;">
  <div class="wu-brand" aria-hidden="false" style="display:flex;gap:12px;align-items:center">
    <div class="wu-logo" style="font-weight:800">WU</div>
    <div class="title-block">
      <h1 style="margin:0;font-size:18px">Western Union — Trend Analysis</h1>
      <p id="shared-region-subtitle" style="margin:0;font-size:13px;color:#475569;">APAC</p>
    </div>
  </div>

  <div style="display:flex;align-items:center;gap:12px">
    <!-- Open table page (both pages can use) -->
    <button id="shared-open-table" class="btn-ghost" type="button" title="Open table page">Open table page</button>

    <!-- header controls -->
    <div class="header-actions" role="region" aria-label="controls" style="display:flex;gap:8px;align-items:center">
      <div class="control" style="display:flex;flex-direction:column">
        <label class="small" for="shared-fromDate">From</label>
        <input id="shared-fromDate" class="date-input" type="date" placeholder="YYYY-MM-DD" />
      </div>

      <div class="control" style="display:flex;flex-direction:column">
        <label class="small" for="shared-toDate">To</label>
        <input id="shared-toDate" class="date-input" type="date" placeholder="YYYY-MM-DD" />
      </div>

      <div style="display:flex;flex-direction:column">
        <label class="small" for="shared-region">Region</label>
        <select id="shared-region" style="padding:6px;border-radius:6px;">
          <option value="apac">APAC</option>
          <option value="emea">EMEA</option>
          <option value="laca">LACA</option>
          <option value="namer">NAMER</option>
        </select>
      </div>

      <div style="display:flex;flex-direction:column">
        <label class="small" for="shared-location">Location</label>
        <select id="shared-location" style="padding:6px;border-radius:6px;">
          <option>All locations</option>
        </select>
      </div>

      <button id="shared-run" class="btn-primary" type="button">Run</button>
      <button id="shared-load-latest" class="btn-ghost" type="button">Load latest</button>
    </div>
  </div>
</div>

<script>
/*
  This script inside shared_header.html will:
  - populate location options using a small REGION map (keeps same lists you used)
  - dispatch custom events on relevant interactions, which pages (React or plain) should listen to.
  - events dispatched:
      - 'sharedHeader:run'           -> detail: { from, to, region, location }
      - 'sharedHeader:loadLatest'    -> detail: {}
      - 'sharedHeader:regionChanged' -> detail: { region }
      - 'sharedHeader:openTable'     -> detail: {}
      - 'sharedHeader:dateChanged'   -> detail: { from, to }  (fired when either date input changes)
*/
(function () {
  const REGION_OPTIONS = {
    "apac": { label: "APAC", partitions: ["Pune","Quezon City","Taguig City","MY.Kuala Lumpur","IN.HYD","SG.Singapore"] },
    "emea": { label: "EMEA", partitions: ["LT.Vilnius","IT.Rome","UK.London","IE.DUblin","DU.Abu Dhab","ES.Madrid"] },
    "laca": { label: "LACA", partitions: ["AR.Cordoba","BR.Sao Paulo","CR.Costa Rica Partition","PA.Panama City","PE.Lima","MX.Mexico City"] },
    "namer": { label: "NAMER", partitions: ["Denver","Austin Texas","Miami","New York"] }
  };

  function el(id){ return document.getElementById(id); }
  function setRegionSubtitle(regionKey){
    const lbl = REGION_OPTIONS[regionKey] ? REGION_OPTIONS[regionKey].label : regionKey.toUpperCase();
    el('shared-region-subtitle').textContent = lbl;
  }
  // populate location select for region
  function populateLocations(regionKey){
    const sel = el('shared-location');
    sel.innerHTML = '';
    const allOpt = document.createElement('option'); allOpt.value = 'All locations'; allOpt.textContent = 'All locations'; sel.appendChild(allOpt);
    const parts = (REGION_OPTIONS[regionKey] && REGION_OPTIONS[regionKey].partitions) || [];
    parts.forEach(p => { const o = document.createElement('option'); o.value = p; o.textContent = p; sel.appendChild(o); });
  }

  // init
  const rsel = el('shared-region');
  populateLocations(rsel.value);
  setRegionSubtitle(rsel.value);

  // emit helper
  function emit(name, detail){
    window.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
  }

  // events
  el('shared-run').addEventListener('click', function(){
    emit('sharedHeader:run', { from: el('shared-fromDate').value, to: el('shared-toDate').value, region: el('shared-region').value, location: el('shared-location').value });
  });

  el('shared-load-latest').addEventListener('click', function(){
    emit('sharedHeader:loadLatest', {});
  });

  el('shared-open-table').addEventListener('click', function(){
    emit('sharedHeader:openTable', {});
    // default behaviour: go to analysis_table.html — pages may override by listening
    window.location.href = 'analysis_table.html';
  });

  rsel.addEventListener('change', function(){
    populateLocations(rsel.value);
    setRegionSubtitle(rsel.value);
    emit('sharedHeader:regionChanged', { region: rsel.value });
  });

  el('shared-fromDate').addEventListener('change', function(){ emit('sharedHeader:dateChanged', { from: el('shared-fromDate').value, to: el('shared-toDate').value }); });
  el('shared-toDate').addEventListener('change', function(){ emit('sharedHeader:dateChanged', { from: el('shared-fromDate').value, to: el('shared-toDate').value }); });

})();
</script>


C:\Users\W0024618\Trend-Analysis\frontend\analysis_table.html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Behaviour Analysis — Table Only (static)</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
  <link rel="stylesheet" href="style.css">
  <style>
    body { background:#f7fafc; font-family: Inter, system-ui, Arial, sans-serif; color:#0f172a; margin:0; padding:0; }
    .container { max-width:1200px; margin:18px auto; padding:16px; }
    .topbar { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:12px 16px; background:#fff; border-radius:8px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
    .wu-logo { font-weight:800; color:#0f172a; }
    .small { font-size:12px; color:#475569; }
    .muted { color:#64748b; }
    .table-scroll { background:#fff; border-radius:8px; padding:12px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); margin-top:12px; }
    table { width:100%; border-collapse:collapse; }
    thead th { text-align:left; padding:10px 8px; border-bottom:1px solid #eef2f7; }
    tbody td { padding:8px; border-bottom:1px solid #f1f5f9; vertical-align:top; }
    input, select, button { font:inherit; }
    .pill { display:inline-block; background:#eef2f7; padding:4px 8px; border-radius:999px; margin-right:6px; font-size:12px; color:#0f172a; }
    .controls { display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap; }
    .controls > div { display:flex; flex-direction:column; }
    .btn-primary { background:#2563eb; color:#fff; border:none; padding:8px 10px; border-radius:6px; cursor:pointer; }
    .btn-ghost { background:#fff; border:1px solid #e6edf3; padding:8px 10px; border-radius:6px; cursor:pointer; }
    .small-button { background:#f1f5f9; border:none; padding:6px 8px; border-radius:6px; cursor:pointer; }
    .muted-block { color:#64748b; margin-left:6px; }
    .status { padding:8px; font-size:13px; color:#334155; }
    .error { color:#b91c1c; }
  </style>
</head>
<body>
  <div class="container" id="app">
    <div class="topbar">
      <div style="display:flex; align-items:center; gap:12px;">
        <div class="wu-logo">WU</div>
        <div>
          <div style="font-weight:700">Trend — Table Only</div>
          <div class="small muted" id="region-label">APAC</div>
        </div>
      </div>
      <div>
        <button class="btn-ghost" id="open-full">Open full app</button>
      </div>
    </div>

    <div class="controls" style="margin-top:12px;">
      <div>
        <label class="small">From</label>
        <input id="fromDate" type="date" />
      </div>
      <div>
        <label class="small">To</label>
        <input id="toDate" type="date" />
      </div>
      <div>
        <label class="small">Region</label>
        <select id="regionSelect">
          <option value="apac">APAC</option>
          <option value="emea">EMEA</option>
          <option value="laca">LACA</option>
          <option value="namer">NAMER</option>
        </select>
      </div>
      <div>
        <label class="small">Location</label>
        <select id="locationSelect"><option>All locations</option></select>
      </div>
      <div>
        <label class="small">Employee ID</label>
        <input id="employeeId" placeholder="e.g. 326131" />
      </div>
      <div style="display:flex; flex-direction:column; gap:6px;">
        <button class="btn-primary" id="runBtn">Run</button>
        <button class="btn-ghost" id="loadLatestBtn">Load latest</button>
      </div>
    </div>

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
(function () {
  // CONFIG: change to your API host if needed
  const API_BASE = "http://10.138.161.4:8002";

  const REGION_OPTIONS = {
    "apac": { label: "APAC", partitions: ["Pune","Quezon City","Taguig City","MY.Kuala Lumpur","IN.HYD","SG.Singapore"] },
    "emea": { label: "EMEA", partitions: ["LT.Vilnius","IT.Rome","UK.London","IE.DUblin","DU.Abu Dhab","ES.Madrid"] },
    "laca": { label: "LACA", partitions: ["AR.Cordoba","BR.Sao Paulo","CR.Costa Rica Partition","PA.Panama City","PE.Lima","MX.Mexico City"] },
    "namer": { label: "NAMER", partitions: ["Denver","Austin Texas","Miami","New York"] }
  };

  // DOM refs
  const fromDate = document.getElementById('fromDate');
  const toDate = document.getElementById('toDate');
  const regionSelect = document.getElementById('regionSelect');
  const locationSelect = document.getElementById('locationSelect');
  const employeeId = document.getElementById('employeeId');
  const runBtn = document.getElementById('runBtn');
  const loadLatestBtn = document.getElementById('loadLatestBtn');
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

  // basic helpers
  function pad(n){ return String(n).padStart(2,'0'); }
  function formatDateISO(d) { if(!d) return ''; const dt = new Date(d); return dt.getFullYear() + '-' + pad(dt.getMonth()+1) + '-' + pad(dt.getDate()); }
  function sanitizeName(r){ if(!r) return ''; return r.EmployeeName_feat || r.EmployeeName_dur || r.EmployeeName || r.ObjectName1 || r.objectname1 || r.employee_name || r.person_uid || ''; }

  // CSV download util
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

  // aggregation (same as your JS)
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
      // prefer ViolationDays as candidate
      let candidateCount = null;
      if (r.ViolationDays !== undefined && r.ViolationDays !== null && r.ViolationDays !== "") candidateCount = Number(r.ViolationDays);
      else if (r.ViolationDaysLast !== undefined && r.ViolationDaysLast !== null && r.ViolationDaysLast !== "") candidateCount = Number(r.ViolationDaysLast);
      else if (r.ViolationDaysLast90 !== undefined && r.ViolationDaysLast90 !== null && r.ViolationDaysLast90 !== "") candidateCount = Number(r.ViolationDaysLast90);
      else if (r.ViolationDaysLast_90 !== undefined && r.ViolationDaysLast_90 !== null && r.ViolationDaysLast_90 !== "") candidateCount = Number(r.ViolationDaysLast_90);
      if(candidateCount !== null && !isNaN(candidateCount)) agg.ViolationDays = Math.max(agg.ViolationDays || 0, candidateCount);
      if (r.ViolationWindowDays !== undefined && r.ViolationWindowDays !== null && r.ViolationWindowDays !== "") agg.ViolationWindowDays = r.ViolationWindowDays;
      // risk selection (best-effort)
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
    statusEl.textContent = text;
    statusEl.className = isError ? 'status error' : 'status';
  }

  function populateLocationOptions(regionKey){
    locationSelect.innerHTML = '';
    const optAll = document.createElement('option'); optAll.textContent = 'All locations'; optAll.value = 'All locations'; locationSelect.appendChild(optAll);
    const parts = (REGION_OPTIONS[regionKey] && REGION_OPTIONS[regionKey].partitions) || [];
    parts.forEach(p => {
      const o = document.createElement('option'); o.textContent = p; o.value = p; locationSelect.appendChild(o);
    });
    regionLabel.textContent = (REGION_OPTIONS[regionKey] && REGION_OPTIONS[regionKey].label) || regionKey.toUpperCase();
  }

  function renderTable(){
    const filter = (filterText.value || '').toLowerCase().trim();
    const collapse = collapseToggle.checked;
    // filter
    const filtered = (rows || []).filter(r => {
      const hay = (sanitizeName(r) + ' ' + (r.EmployeeID||'') + ' ' + (r.CardNumber||'') + ' ' + (r.Reasons||r.DetectedScenarios||'')).toLowerCase();
      return !filter || hay.indexOf(filter) !== -1;
    });
    const source = collapse ? buildAggregated(filtered) : filtered;
    const totalPages = Math.max(1, Math.ceil((source.length || 0) / pageSize));
    if(page > totalPages) page = totalPages;
    const pageRows = (source || []).slice((page-1)*pageSize, page*pageSize);
    // clear body
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
        // columns
        const tdName = document.createElement('td'); tdName.innerHTML = sanitizeName(displayRow) || '<span class="muted">—</span>';
        const tdId = document.createElement('td'); tdId.className = 'small'; tdId.textContent = isAgg ? (r.EmployeeID||displayRow.EmployeeID||'') : (displayRow.EmployeeID||'');
        const tdCard = document.createElement('td'); tdCard.className = 'small'; tdCard.textContent = isAgg ? (r.CardNumber||displayRow.CardNumber||'') : (displayRow.CardNumber||'');
        const tdDate = document.createElement('td'); tdDate.className = 'small'; tdDate.textContent = displayRow && (displayRow.DisplayDate || displayRow.Date || displayRow.DateOnly || displayRow.FirstSwipe || displayRow.LastSwipe) || '-';
        const tdDur = document.createElement('td'); tdDur.className = 'small'; tdDur.textContent = isAgg ? (displayRow && (displayRow.Duration || (displayRow.DurationSeconds ? formatSecondsToHmJS(Number(displayRow.DurationSeconds)) : '-'))) : (displayRow && (displayRow.Duration || (displayRow.DurationSeconds ? formatSecondsToHmJS(Number(displayRow.DurationSeconds)) : '-') ) || '');
        // violation
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
        // append cells
        tr.appendChild(tdName); tr.appendChild(tdId); tr.appendChild(tdCard); tr.appendChild(tdDate); tr.appendChild(tdDur); tr.appendChild(tdViol); tr.appendChild(tdReasons); tr.appendChild(tdEvidence);
        resultsBody.appendChild(tr);
      });
    }
    pageInfo.textContent = 'Page ' + page + ' / ' + totalPages;
  }

  // fetch data from /run
  async function fetchRun(start, end){
    setStatus('Loading…');
    try {
      let url = API_BASE + '/run?start=' + encodeURIComponent(start) + '&end=' + encodeURIComponent(end) + '&full=true';
      const reg = regionSelect.value;
      if(reg) url += '&region=' + encodeURIComponent(reg);
      const loc = locationSelect.value;
      if(loc && loc !== 'All locations'){
        url += '&city=' + encodeURIComponent(loc);
      }
      const eid = employeeId.value && String(employeeId.value).trim();
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

  // load latest (yesterday)
  function loadLatest(){
    const d = new Date(); d.setDate(d.getDate()-1);
    const iso = formatDateISO(d);
    fromDate.value = iso; toDate.value = iso;
    fetchRun(iso, iso);
  }

  // wire controls
  runBtn.addEventListener('click', () => {
    const f = fromDate.value; const t = toDate.value;
    if(!f || !t){ alert('Please set both From and To dates'); return; }
    fetchRun(f, t);
  });
  loadLatestBtn.addEventListener('click', loadLatest);
  filterText.addEventListener('input', () => { page = 1; renderTable(); });
  collapseToggle.addEventListener('change', () => { page = 1; renderTable(); });
  prevBtn.addEventListener('click', () => { if(page>1){ page--; renderTable(); } });
  nextBtn.addEventListener('click', () => {
    // compute number of pages based on current filters
    const filtered = (rows || []).filter(r => {
      const hay = (sanitizeName(r) + ' ' + (r.EmployeeID||'') + ' ' + (r.CardNumber||'') + ' ' + (r.Reasons||r.DetectedScenarios||'')).toLowerCase();
      return !filterText.value || hay.indexOf(filterText.value.toLowerCase()) !== -1;
    });
    const source = collapseToggle.checked ? buildAggregated(filtered) : filtered;
    const totalPages = Math.max(1, Math.ceil((source.length || 0) / pageSize));
    if(page < totalPages){ page++; renderTable(); }
  });
  exportBtn.addEventListener('click', () => {
    const filter = (filterText.value || '').toLowerCase().trim();
    const filtered = (rows || []).filter(r => {
      const hay = (sanitizeName(r) + ' ' + (r.EmployeeID||'') + ' ' + (r.CardNumber||'') + ' ' + (r.Reasons||r.DetectedScenarios||'')).toLowerCase();
      return !filter || hay.indexOf(filter) !== -1;
    });
    const source = collapseToggle.checked ? buildAggregated(filtered) : filtered;
    downloadCSV(source, 'analysis_table_export.csv');
  });

  openFull.addEventListener('click', () => { window.location.href = 'index.html'; });

  // region select change -> update locations
  regionSelect.addEventListener('change', () => populateLocationOptions(regionSelect.value));

  // init defaults
  (function init(){
    const today = new Date();
    const yesterday = new Date(); yesterday.setDate(today.getDate()-1);
    fromDate.value = formatDateISO(yesterday);
    toDate.value = formatDateISO(today);
    populateLocationOptions(regionSelect.value);
    regionLabel.textContent = (REGION_OPTIONS[regionSelect.value] && REGION_OPTIONS[regionSelect.value].label) || regionSelect.value;
    // attempt initial loadLatest
    loadLatest();
  })();

})();
</script>
</body>
</html>
