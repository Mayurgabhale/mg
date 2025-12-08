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

    <!-- ❌ HEADER REMOVED EXACTLY AS REQUESTED -->

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
/* YOUR FULL ORIGINAL JAVASCRIPT — UNCHANGED */
(function () {

  /* ---------------------------
     COMPLETE JS BLOCK STARTS
     (preserved exactly)
  ---------------------------- */

  let rawData = [];
  let filteredData = [];
  let collapsed = true;

  let currentPage = 1;
  const pageSize = 10;

  const statusEl = document.getElementById("status");
  const resultsBody = document.getElementById("resultsBody");
  const pageInfo = document.getElementById("pageInfo");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  function setStatus(msg, isError = false) {
    statusEl.textContent = msg;
    statusEl.classList.toggle("error", isError);
  }

  function loadLocations(region) {
    const locSel = document.getElementById("locationSelect");
    locSel.innerHTML = `<option>All locations</option>`;
    const locs = {
      apac: ["Malaysia", "Philippines", "Singapore", "Vietnam", "Indonesia"],
      emea: ["Germany", "France", "UK", "Poland"],
      laca: ["Brazil", "Argentina", "Chile", "Mexico"],
      namer: ["USA", "Canada"]
    };
    (locs[region] || []).forEach(l => {
      const opt = document.createElement("option");
      opt.value = l;
      opt.textContent = l;
      locSel.appendChild(opt);
    });
  }

  document.getElementById("regionSelect").addEventListener("change", (e) => {
    loadLocations(e.target.value);
  });

  loadLocations("apac");

  function renderTable() {
    resultsBody.innerHTML = "";

    const start = (currentPage - 1) * pageSize;
    const pageSlice = filteredData.slice(start, start + pageSize);

    for (const row of pageSlice) {
      const tr = document.createElement("tr");

      const reasonsHtml = row.reasons.map(r => `<div class="pill">${r}</div>`).join("");

      tr.innerHTML = `
        <td>${row.employeeName}</td>
        <td>${row.employeeId}</td>
        <td>${row.cardId}</td>
        <td>${row.date}</td>
        <td>${row.duration}</td>
        <td>${row.violationDays}</td>
        <td>${reasonsHtml}</td>
        <td><a href="${row.evidence}" target="_blank">View</a></td>
      `;
      resultsBody.appendChild(tr);
    }

    pageInfo.textContent = `Page ${currentPage} / ${Math.ceil(filteredData.length / pageSize) || 1}`;
  }

  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  };
  nextBtn.onclick = () => {
    if (currentPage < Math.ceil(filteredData.length / pageSize)) {
      currentPage++;
      renderTable();
    }
  };

  function applyFilters() {
    const text = document.getElementById("filterText").value.toLowerCase();
    const region = document.getElementById("regionSelect").value;
    const location = document.getElementById("locationSelect").value;
    const employeeId = document.getElementById("employeeId").value.trim();

    filteredData = rawData.filter(r => {
      if (region && r.region !== region) return false;
      if (location !== "All locations" && r.location !== location) return false;
      if (employeeId && r.employeeId !== employeeId) return false;

      if (text) {
        const match = (
          r.employeeName.toLowerCase().includes(text) ||
          r.employeeId.includes(text) ||
          r.cardId.includes(text) ||
          r.reasons.join(" ").toLowerCase().includes(text)
        );
        if (!match) return false;
      }
      return true;
    });

    currentPage = 1;
    renderTable();
  }

  document.getElementById("filterText").addEventListener("input", applyFilters);
  document.getElementById("regionSelect").addEventListener("change", applyFilters);
  document.getElementById("locationSelect").addEventListener("change", applyFilters);
  document.getElementById("employeeId").addEventListener("input", applyFilters);

  document.getElementById("runBtn").onclick = async () => {
    setStatus("Loading...");

    try {
      const from = document.getElementById("fromDate").value;
      const to = document.getElementById("toDate").value;

      const url = `/api/table_data?from=${from}&to=${to}`;
      const res = await fetch(url);
      rawData = await res.json();

      setStatus("Loaded.");
      applyFilters();

    } catch (err) {
      console.error(err);
      setStatus("Failed to load data.", true);
    }
  };

  document.getElementById("loadLatestBtn").onclick = async () => {
    setStatus("Loading latest...");

    try {
      const res = await fetch("/api/table_latest");
      rawData = await res.json();

      setStatus("Loaded latest.");
      applyFilters();

    } catch (err) {
      console.error(err);
      setStatus("Failed to load latest.", true);
    }
  };

  document.getElementById("exportBtn").onclick = () => {
    let csv = "Employee,ID,Card,Date,Duration,Violation Days,Reasons,Evidence\n";

    for (const r of filteredData) {
      csv += `"${r.employeeName}",${r.employeeId},${r.cardId},${r.date},${r.duration},${r.violationDays},"${r.reasons.join("; ")}",${r.evidence}\n`;
    }

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "filtered_export.csv";
    a.click();
  };

})();
</script>

</body>
</html>