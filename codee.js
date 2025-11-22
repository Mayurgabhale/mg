Failure Count chart is not diplsy.. 
<div class="bottom-row">

              <!-- <div class="gcard wide gcard-pie">
                <h4 class="gcard-title">Total Count </h4>
                <div class="chart-placeholder"></div>
              </div> -->
              <!-- <div class="gcard wide">
                <h4 class="gcard-title">LOC Count</h4>
                <div class="chart-placeholder"></div>
              </div> -->
              <div class="gcard wide" style="height:300px;">
                <h4 class="gcard-title">LOC Count</h4>
                <canvas id="cityBarChart"></canvas>
              </div>

              <div class="gcard wide">
                <h4 class="gcard-title">Failure Count</h4>
                <div class="chart-placeholder"></div>
              </div>



              <div class="gcard wide gcard-pie">
                <h4 class="gcard-title">Total Count </h4>
                <div class="chart-placeholder"></div>
              </div>



            </div>

C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\graph.js

// ---------- Failure Count Chart (add to graph.js) ----------
let failureCountChart = null;

/**
 * Build metrics for failure chart using device table + deviceHistoryData.
 * Returns { type -> [{x: failureCount, y: totalDowntimeMin, ip, name, city}] }
 */
function collectFailureMetricsFromTable() {
  const rows = Array.from(document.querySelectorAll('#device-table tbody tr'))
    .filter(r => r.cells && r.cells.length > 0);

  const metrics = {};
  const histMap = window.deviceHistoryData || {};

  rows.forEach(r => {
    // safe cell indexes (these match your table structure used elsewhere)
    const ip = (r.cells[1]?.textContent || '').trim();
    const name = (r.cells[2]?.textContent || '').trim();
    let category = (r.cells[3]?.textContent || '').trim();
    // older code sometimes stores data-category attr - prefer that
    try {
      const dataCat = r.cells[3]?.getAttribute?.('data-category');
      if (dataCat) category = dataCat;
    } catch (e) {/* ignore */}
    const city = (r.cells[4]?.textContent || '').trim();

    if (!ip) return;

    // downtime count cell placement differs across files, try several fallbacks:
    let downCount = 0;
    const possibleIds = [
      `downtime-count-${(ip || '').replace(/[^a-zA-Z0-9]/g, '_')}`, // common id pattern
    ];
    // find in DOM row first, else fallback to numeric cell content (cell 6 typical)
    const found = rowQuerySelectorSafe(r, `#${possibleIds[0]}`);
    if (found) downCount = parseInt(found.textContent || '0') || 0;
    else downCount = parseInt(r.cells[6]?.textContent || r.cells[7]?.textContent || '0') || 0;

    // compute total downtime seconds from raw history (pair offline->online)
    const rawHist = histMap[ip] || [];
    const sigHist = typeof filterHistoryForDisplay === 'function'
      ? filterHistoryForDisplay(rawHist, (category || '').toUpperCase())
      : rawHist;

    let totalDownSec = 0;
    for (let i = 0; i < sigHist.length; i++) {
      const ev = sigHist[i];
      if (ev.status === 'Offline') {
        // find the next Online with later timestamp
        const nextUp = sigHist.slice(i + 1).find(x => x.status === 'Online' && new Date(x.timestamp).getTime() > new Date(ev.timestamp).getTime());
        if (nextUp) {
          totalDownSec += (new Date(nextUp.timestamp).getTime() - new Date(ev.timestamp).getTime()) / 1000;
        } else {
          // still down: count until now
          totalDownSec += (Date.now() - new Date(ev.timestamp).getTime()) / 1000;
        }
      }
    }

    const totalDownMin = Math.round(totalDownSec / 60);

    // Normalize device type to friendly group for legend
    const typeKey = normalizeDeviceType(category);

    if (!metrics[typeKey]) metrics[typeKey] = [];
    metrics[typeKey].push({
      x: downCount,
      y: totalDownMin,
      ip,
      name,
      city
    });
  });

  return metrics;
}

function rowQuerySelectorSafe(row, selector) {
  try { return row.querySelector(selector); } catch (e) { return null; }
}

function normalizeDeviceType(cat) {
  if (!cat) return 'Other';
  const c = cat.toLowerCase();
  if (c.includes('camera') || c.includes('cctv')) return 'CCTV';
  if (c.includes('controller') || c.includes('acs')) return 'ACS';
  if (c.includes('archiver') || c.includes('nvr') || c.includes('dvr')) return 'NVR/DVR';
  if (c.includes('server') && !c.includes('db')) return 'SERVER';
  if (c.includes('desktop') || c.includes('pc')) return 'Desktop';
  if (c.includes('db') || c.includes('db server')) return 'DB Server';
  return cat;
}

const FAILURE_COLORS = {
  'CCTV': '#10b981',
  'ACS': '#f97316',
  'NVR/DVR': '#2563eb',
  'SERVER': '#7c3aed',
  'Desktop': '#06b6d4',
  'DB Server': '#ef4444',
  'Other': '#94a3b8'
};

function createFailureChartInPlaceholder() {
  const placeholder = findChartPlaceholderByTitle('Failure Count');
  if (!placeholder) return;

  // Ensure a canvas exists
  let canvas = placeholder.querySelector('canvas');
  if (!canvas) {
    placeholder.innerHTML = ''; // clear placeholder contents
    canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '220px';
    placeholder.appendChild(canvas);
  }

  // add a simple header controls row with Download button (if not present)
  if (!placeholder.querySelector('.chart-controls')) {
    const controls = document.createElement('div');
    controls.className = 'chart-controls';
    controls.style.cssText = 'display:flex;justify-content:flex-end;margin-bottom:8px;';
    const btn = document.createElement('button');
    btn.className = 'btn-download';
    btn.textContent = 'Download Data';
    btn.style.cssText = 'background:#10b981;color:#fff;border-radius:6px;padding:6px 10px;border:0;cursor:pointer;font-weight:600;';
    btn.addEventListener('click', () => exportFailureCSV());
    controls.appendChild(btn);
    placeholder.prepend(controls);
  }

  const metrics = collectFailureMetricsFromTable();
  const datasets = Object.keys(metrics).map(type => ({
    label: type,
    data: metrics[type].map(pt => ({ x: pt.x, y: pt.y, meta: pt })),
    backgroundColor: FAILURE_COLORS[type] || FAILURE_COLORS['Other'],
    pointRadius: 7,
    pointHoverRadius: 10,
    showLine: false
  }));

  // If chart already exists destroy
  if (failureCountChart) {
    failureCountChart.destroy();
    failureCountChart = null;
  }

  const ctx = canvas.getContext('2d');
  failureCountChart = new Chart(ctx, {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            title: (items) => {
              const ds = items[0];
              return `${ds.dataset.label}`;
            },
            label: (ctx) => {
              const d = ctx.raw.meta;
              return [
                `Name: ${d.name}`,
                `IP: ${d.ip}`,
                `City: ${d.city}`,
                `Failures: ${d.x}`,
                `Total downtime (min): ${d.y}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Failure Count (occurrences)' },
          ticks: { stepSize: 1, beginAtZero: true }
        },
        y: {
          title: { display: true, text: 'Total Downtime (minutes)' },
          beginAtZero: true
        }
      }
    }
  });
}

/** Export all points as CSV */
function exportFailureCSV() {
  const metrics = collectFailureMetricsFromTable();
  const rows = [['Type','Name','IP','City','Failures','TotalDowntimeMin']];
  Object.keys(metrics).forEach(type => {
    metrics[type].forEach(pt => {
      rows.push([type, pt.name, pt.ip, pt.city, pt.x, pt.y]);
    });
  });
  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `failure-count-${(new Date()).toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Public: call this to render/update the failure chart */
function renderFailureCountChart() {
  createFailureChartInPlaceholder();
  console.log('✅ Failure Count chart rendered');
}

// helper: re-render on window resize (debounced)
(function() {
  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      if (failureCountChart) failureCountChart.resize();
    }, 200);
  });
})();

.......
C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\summary.js

function populateDeviceTable(details, historyData) {
    const tbody = document.getElementById('device-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    let list = [];

    // include PC and DB types alongside existing ones — keep previous logic unchanged otherwise
    ['cameras', 'archivers', 'controllers', 'servers', 'pcDetails', 'DBDetails'].forEach(type => {
        details[type]?.forEach(dev => {
            const ip = dev.ip_address;
            const safe = sanitizeId(ip);
            const name = getDeviceName(dev, type);
            const category = deviceTypeMap[type] || (type.slice(0, -1).toUpperCase());
            const region = dev.location || 'Unknown';
            const city = dev.city || 'Unknown';
            const hist = filterHistoryForDisplay(historyData[ip] || [], category.toUpperCase());
            const current = dev.status || (hist.length ? hist[hist.length - 1].status : 'Unknown');
            const downCount = hist.filter(e => e.status === 'Offline').length;

            if (current === 'Offline' || downCount > 15) {
                list.push({ ip, safe, name, category, region, city, current, hist, downCount, remark: dev.remark || '' });
            }
        });
    });

    // ✅ Populate the City Filter using the list
    const cityFilter = document.getElementById('cityFilter');
    if (cityFilter) {
        const uniqueCities = [...new Set(list.map(dev => dev.city).filter(Boolean))].sort();
        cityFilter.innerHTML = '<option value="all">All Cities</option>';
        uniqueCities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            cityFilter.appendChild(option);
        });

        // Ensure listener is only added once
        if (!cityFilter.dataset.listenerAdded) {
            cityFilter.addEventListener('change', filterData);
            cityFilter.dataset.listenerAdded = 'true';
        }
    }

    // Sort and count
    list.sort((a, b) => b.downCount - a.downCount);
    const downtimeOver15Count = list.filter(d => d.downCount > 15).length;
    const currentlyOfflineCount = list.filter(d => d.current === 'Offline').length;
    const setIf = (id, txt) => { const el = document.getElementById(id); if (el) el.innerText = txt; };
    setIf('count-downtime-over-15', `Devices with >15 downtimes: ${downtimeOver15Count}`);
    setIf('count-currently-offline', `Devices currently Offline: ${currentlyOfflineCount}`);

    if (!list.length) {
        const row = tbody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 10;
        cell.textContent = "No devices found";
        cell.style.textAlign = "center";
        cell.style.fontWeight = "bold";
        updateDisplayedDeviceCount(0);
        return;
    }

    list.forEach((dev, idx) => {
        const row = tbody.insertRow();
        row.classList.add(dev.current === 'Offline' ? 'row-offline' : dev.current === 'Online' ? 'row-online' : 'row-repair');
        row.style.border = "1px solid black";
        row.innerHTML = `
            <td>${idx + 1}</td>
            <td><span onclick="copyText('${dev.ip}')" style="cursor:pointer;">${dev.ip}</span></td>
            <td><span onclick="copyText('${dev.name}')" style="cursor:pointer;">${dev.name}</span></td>
            <td>${dev.category}</td>
            <td>${dev.region}</td>
            <td>${dev.city}</td>
            <td id="uptime-${dev.safe}">0h/0m/0s</td>
            <td id="downtime-count-${dev.safe}">${dev.downCount}</td>
            <td id="downtime-${dev.safe}">0h/0m/0s</td>
            <td><button class="history-btn" onclick="openDeviceHistory('${dev.ip}','${dev.name}','${dev.category}')">View History</button></td>
            <td id="remark-${dev.safe}">Device working properly</td>
        `;

        if (dev.current === "Online") {
            startUptime(dev.ip, dev.hist);
        } else {
            startDowntime(dev.ip, dev.hist, dev.category);
        }

        updateRemarks(dev.ip, dev.hist, dev.category);

        // show modern tooltip for devices marked "Not accessible"
        const remarkText = (dev.remark || '').toString().trim();
        if (remarkText && /not\s+access/i.test(remarkText)) {
            row.classList.add('row-not-accessible');

            // ensure row can position absolute children
            if (getComputedStyle(row).position === 'static') {
                row.style.position = 'relative';
            }

            const tooltip = document.createElement('div');
            tooltip.className = 'device-access-tooltip';
            tooltip.textContent = 'Due to Network policy, this camera is Not accessible';

            // inline styles so no external CSS edit required
            tooltip.style.position = 'absolute';
            tooltip.style.bottom = '65%';
            tooltip.style.left = '200px';
            tooltip.style.padding = '8px 10px';
            tooltip.style.background = '#313030'; // modern red
            tooltip.style.color = '#fff';
            tooltip.style.borderRadius = '6px';
            tooltip.style.fontSize = '13px';
            tooltip.style.fontWeight = '600';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(6px)';
            tooltip.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
            tooltip.style.zIndex = '9999';
            tooltip.style.boxShadow = '0 6px 14px rgba(0,0,0,0.18)';

            row.appendChild(tooltip);

            row.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(0)';
            });
            row.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(6px)';
            });

            // accessible fallback
            row.title = tooltip.textContent;
        }
    });

    filterData();
    renderFailureCountChart();
}


................
C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\trend.js
function populateDeviceTable(details, historyData) {
  const Devices = [];
  const tbody = document.querySelector('#device-table tbody');
  tbody.innerHTML = '';

  const devices = [];
  ['cameras', 'archivers', 'controllers', 'servers', 'pcDetails', 'DBDetails'].forEach(type => {
    (details[type] || []).forEach(dev => {
      const ip = dev.ip_address;
      const safe = sanitizeId(ip);
      // const name      = dev[type.slice(0,-1) + 'name'] || 'Unknown';
      const name = dev.hostname || dev.pc_name || dev[type.slice(0, -1) + 'name'] || dev.name || dev.device_name || dev.ip_address || 'Unknown';
      const category = type.slice(0, -1).toUpperCase();
      const rawHist = historyData[ip] || [];
      const city = dev.city || 'Unknown';
      const hist = filterHistoryForDisplay(rawHist, category);
      const lastRaw = rawHist[rawHist.length - 1]?.status || 'Unknown';
      // if last raw Offline but <5min, treat Online
      let status = lastRaw;
      if (lastRaw === 'Offline' && ((Date.now() - new Date(rawHist[rawHist.length - 1].timestamp)) / 1000) < 300) {
        status = 'Online';
      }
      const downCount = hist.filter(e => e.status === 'Offline').length;

      // devices.push({ ip, safe, name, category, rawHist, hist, status, downCount,city  });
      devices.push({ ip, safe, name, category, rawHist, hist, status, downCount, city, remark: dev.remark || '' });

    });
  });

  // sort by ongoing ≥5min offline first, then by downCount desc
  devices.sort((a, b) => {
    const now = Date.now();
    const aLast = a.hist[a.hist.length - 1], bLast = b.hist[b.hist.length - 1];
    const aOff = aLast?.status === 'Offline' ? (now - new Date(aLast.timestamp)) / 1000 : 0;
    const bOff = bLast?.status === 'Offline' ? (now - new Date(bLast.timestamp)) / 1000 : 0;
    if ((aOff >= 300) !== (bOff >= 300)) return aOff >= 300 ? -1 : 1;
    return b.downCount - a.downCount;
  });

  devices.forEach((d, i) => {
    const row = tbody.insertRow();

    // row.classList.add(d.status==='Online' ? 'status-online' : 'status-offline');

    if (d.status === 'Offline') {
      row.classList.add('row-offline');
    } else if (d.status === 'Online') {
      row.classList.add('row-online');
    } else {
      // Optional: handle unknown or other cases
      row.classList.add('row-repair');
    }


    const displayCategory =
  d.category === 'PCDETAIL' ? 'Desktop'
  : d.category === 'DBDETAIL' ? 'DB Server'
  : d.category;



    row.innerHTML = `
<td>${i + 1}</td>
<td><span id="ip-${d.safe}" class="copy-text" onclick="copyToClipboard('ip-${d.safe}')">${d.ip}</span></td>
<td><span id="name-${d.safe}" class="copy-text" onclick="copyToClipboard('name-${d.safe}')">${d.name}</span></td>
<td data-category="${d.category}">${displayCategory}</td>
<td>${d.city}</td>
<td id="uptime-${d.safe}">0h/0m/0s</td>
<td id="downtime-count-${d.safe}">${d.downCount}</td>
<td id="downtime-${d.safe}">0h/0m/0s</td>
<td><button class="history-btn" onclick="openDeviceHistory('${d.ip}','${d.name}','${d.category}')">View History</button></td>
<td id="remark-${d.safe}" data-city="${d.city}">–</td>
`;



    // show policy tooltip on hover for rows with explicit "Not accessible" remark
    // modern hover message for "Not accessible" rows
    if (d.remark && /not\s+access/i.test(d.remark)) {
      row.classList.add('row-not-accessible');

      // create tooltip element
      const tooltip = document.createElement("div");
      tooltip.className = "modern-tooltip";
      tooltip.textContent = "Due to Network policy, this camera is Not accessible";
      row.appendChild(tooltip);
    }


    if (d.status === 'Online') startUptime(d.ip, d.hist, d.category);
    else startDowntime(d.ip, d.hist, d.category);

    updateRemarks(d.ip, d.hist, d.status, d.downCount);
  });



  const cityFilter = document.getElementById('cityFilter');
  if (cityFilter) {
    const uniqueCities = [...new Set(devices.map(dev => dev.city).filter(Boolean))].sort();

    // Build dropdown from scratch, ensure ALL option is uppercase and selected
    cityFilter.innerHTML = '';
    const allOpt = document.createElement('option');
    allOpt.value = 'ALL';            // use 'ALL' (uppercase) to match filterData()
    allOpt.textContent = 'All Cities';
    allOpt.selected = true;          // explicitly mark selected so it shows on first render
    cityFilter.appendChild(allOpt);

    uniqueCities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      cityFilter.appendChild(option);
    });

    // Force value + trigger change so UI and any listeners update immediately
    cityFilter.value = 'ALL';
    cityFilter.dispatchEvent(new Event('change'));
  }

  filterData();
  renderFailureCountChart();

}
