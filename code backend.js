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