gie me correct code for failure count chart ok 

trend.js:1087 TREND.JS: Updating failure chart with dynamic data
trend.js:1093 Failure chart update function not available
populateDeviceTable @ trend.js:1093
trend.js:1087 TREND.JS: Updating failure chart with dynamic data
trend.js:1093 Failure chart update function not available
populateDeviceTable @ trend.js:1093


C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\trend.js


let deviceUptimeTimers = {};
let deviceDowntimeTimers = {};

let deviceOfflineAlerted = {};
let deviceOnlineAlerted = {};

function notifyWindows(title, message) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body: message });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, { body: message });
      }
    });
  }

  showToastAlert(title, message);
}


// function notifyWindows(title, message) {
//   showToastAlert(title, message);
// }

function showToastAlert(title, message) {
  const container = document.getElementById('alert-toast-container');

  const toast = document.createElement('div');
  toast.className = 'alert-toast';

  // toast.innerHTML = `
  //   <div class="close-btn" onclick="this.parentElement.remove()">×</div>
  //   <h4>${title}</h4>
  //   <pre>${message}</pre>
  // `;

  toast.innerHTML = `
  <div class="close-btn">×</div>
  <h4>${title}</h4>
  <pre>${message}</pre>
`;

  const closeBtn = toast.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => {
    toast.remove();
  });

  container.appendChild(toast);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    toast.remove();
  }, 180000);
}


function startDowntime(ip, hist, category) {
  const safe = sanitizeId(ip);
  clearInterval(deviceUptimeTimers[safe]);

  const off = hist.filter(e => e.status === 'Offline').pop();
  if (!off) return;

  const t0 = new Date(off.timestamp).getTime();

  deviceOfflineAlerted[safe] = false;  // Reset per event

  deviceDowntimeTimers[safe] = setInterval(() => {
    const secs = Math.floor((Date.now() - t0) / 1000);
    document.getElementById(`downtime-${safe}`).innerText = formatDuration(secs);
    document.getElementById(`downtime-count-${safe}`).innerText = hist.filter(e => e.status === 'Offline').length;
    updateRemarks(ip, hist, null, null);

    // 🔔 Notify if offline ≥ 3 min
    if (secs >= 180 && !deviceOfflineAlerted[safe]) {
      deviceOfflineAlerted[safe] = true;

      const name = document.getElementById(`name-${safe}`).innerText;
      const type = document.querySelector(`#ip-${safe}`).parentNode.nextElementSibling.textContent;
      const city = document.getElementById(`remark-${safe}`).dataset.city || 'Unknown';

      const title = "⚠️ Device Offline ≥ 3 min";
      const message =
        `Device Name: ${name}\n` +
        `Device Type: ${category}\n` +
        `Device IP: ${ip}\n` +
        `City: ${city}\n` +
        `Status: Device is Offline\n` +
        `Offline Time: ${formatDuration(secs)}`;

      // notifyWindows(title, message);
    }
  }, 1000);
}



function startUptime(ip, hist, category) {
  const safe = sanitizeId(ip);
  clearInterval(deviceDowntimeTimers[safe]);

  const on = hist.filter(e => e.status === 'Online').pop();
  if (!on) return;

  const tOn = new Date(on.timestamp).getTime();

  // Calculate how long it was offline
  const lastOff = hist.slice().reverse().find(e => e.status === 'Offline');
  const offlineSecs = lastOff ? Math.floor((tOn - new Date(lastOff.timestamp)) / 1000) : 0;

  deviceOnlineAlerted[safe] = false;

  if (offlineSecs >= 120 && !deviceOnlineAlerted[safe]) {
    deviceOnlineAlerted[safe] = true;

    const name = document.getElementById(`name-${safe}`).innerText;
    const type = document.querySelector(`#ip-${safe}`).parentNode.nextElementSibling.textContent;
    const city = document.getElementById(`remark-${safe}`).dataset.city || 'Unknown';

    const title = "✅ Device is Online after 2+ min";
    const message =
      `Device Name: ${name}\n` +
      `Device Type: ${category}\n` +
      `Device IP: ${ip}\n` +
      `City: ${city}`;

    notifyWindows(title, message);
  }

  const t0 = new Date(on.timestamp).getTime();
  deviceUptimeTimers[safe] = setInterval(() => {
    document.getElementById(`uptime-${safe}`).innerText =
      formatDuration(Math.floor((Date.now() - t0) / 1000));
  }, 1000);
}



// Utility to turn an IP (or any string) into a safe DOM-ID fragment
function sanitizeId(str) {
  return (str || '').replace(/[^a-zA-Z0-9]/g, '_');
}

function fetchDeviceData() {
  const region = document.getElementById('region').value;
  fetch(`http://localhost/api/regions/details/${region}`)
    .then(r => r.json())
    .then(d => fetchDeviceHistory(d.details))
    .catch(console.error);
}

// function fetchDeviceHistory(details) {
//   fetch(`http://localhost/api/devices/history`)
//     .then(r => r.json())
//     .then(historyData => {
//       populateDeviceTable(details, historyData);
//       window.deviceHistoryData = historyData;
//     })
//     .catch(console.error);
// }


function fetchDeviceHistory(details) {
  fetch(`http://localhost/api/devices/history`)
    .then(r => r.json())
    .then(historyData => {
      populateDeviceTable(details, historyData);
      window.deviceHistoryData = historyData; // Set global
      
      // Trigger chart update if chart is ready
      if (typeof window.updateFailureChartWithData === 'function') {
        window.updateFailureChartWithData(details, historyData);
      }
    })
    .catch(console.error);
}




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


    //     row.innerHTML = `
    // <td>${i+1}</td>
    // <td><span id="ip-${d.safe}" class="copy-text" onclick="copyToClipboard('ip-${d.safe}')">${d.ip}</span></td>
    // <td><span id="name-${d.safe}" class="copy-text" onclick="copyToClipboard('name-${d.safe}')">${d.name}</span></td>
    // <td>${d.category}</td>
    // <td id="uptime-${d.safe}">0h/0m/0s</td>
    // <td id="downtime-count-${d.safe}">${d.downCount}</td>
    // <td id="downtime-${d.safe}">0h/0m/0s</td>
    // <td><button class="history-btn" onclick="openDeviceHistory('${d.ip}','${d.name}','${d.category}')">View History</button></td>
    // <td id="remark-${d.safe}">–</td>
    // `;


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



  // ✅ Add this block AFTER `devices.forEach(...)` inside populateDeviceTable
  // const cityFilter = document.getElementById('cityFilter');
  // if (cityFilter) {
  //   const uniqueCities = [...new Set(devices.map(dev => dev.city).filter(Boolean))].sort();
  //   cityFilter.innerHTML = '<option value="all">All Cities</option>';
  //   uniqueCities.forEach(city => {
  //     const option = document.createElement('option');
  //     option.value = city;
  //     option.textContent = city;
  //     cityFilter.appendChild(option);
  //   });
  // }


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

  // After populating the table, update the failure chart DYNAMICALLY
  console.log('TREND.JS: Updating failure chart with dynamic data');

    // Use the global update function
  if (typeof window.updateFailureChartWithData === 'function') {
    window.updateFailureChartWithData(details, historyData);
  } else {
    console.error('Failure chart update function not available');
    // Fallback to direct calculation
    if (typeof calculateFailureCounts === 'function' && typeof refreshFailureChart === 'function') {
      const failureData = calculateFailureCounts(details);
      refreshFailureChart(failureData);
    }
  }



  filterData();


}

function filterHistoryForDisplay(hist, category) {
  if (category === 'SERVER') return hist.slice();

  const out = [];

  let lastOff = null;
  hist.forEach(e => {
    if (e.status === 'Offline') lastOff = e;
    else if (e.status === 'Online' && lastOff) {
      const diff = (new Date(e.timestamp) - new Date(lastOff.timestamp)) / 1000;
      if (diff >= 300) out.push(lastOff, e);

      lastOff = null;
    }
  });

  if (lastOff) {

    const diff = (Date.now() - new Date(lastOff.timestamp)) / 1000;
    if (diff >= 300) out.push(lastOff);

  }

  return out.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

function startUptime(ip, hist) {
  const safe = sanitizeId(ip);
  clearInterval(deviceDowntimeTimers[safe]);
  const on = hist.filter(e => e.status === 'Online').pop();
  if (!on) return;
  const t0 = new Date(on.timestamp).getTime();
  deviceUptimeTimers[safe] = setInterval(() => {
    document.getElementById(`uptime-${safe}`).innerText = formatDuration(Math.floor((Date.now() - t0) / 1000));
  }, 1000);
}

// function startDowntime(ip, hist) {
//   const safe = sanitizeId(ip);
//   clearInterval(deviceUptimeTimers[safe]);
//   const off = hist.filter(e => e.status==='Offline').pop();
//   if (!off) return;
//   const t0 = new Date(off.timestamp).getTime();
//   deviceDowntimeTimers[safe] = setInterval(() => {
//     const secs = Math.floor((Date.now()-t0)/1000);
//     document.getElementById(`downtime-${safe}`).innerText = formatDuration(secs);
//     document.getElementById(`downtime-count-${safe}`).innerText = hist.filter(e => e.status==='Offline').length;
//     updateRemarks(ip, hist, null, null);
//   }, 1000);
// }

function updateRemarks(ip, hist, forcedStatus, forcedCount) {
  const safe = sanitizeId(ip);
  // Determine status
  let status = forcedStatus;
  if (!status) {
    const last = hist[hist.length - 1]?.status || 'Unknown';
    status = last === 'Offline' && ((Date.now() - new Date(hist[hist.length - 1].timestamp)) / 1000) < 300
      ? 'Online' : last;
  }
  const count = forcedCount ?? hist.filter(e => e.status === 'Offline').length;
  const el = document.getElementById(`remark-${safe}`);
  if (!el) return;
  if (status === 'Offline') {
    el.innerText = count > 0 ? 'Device is Offline, needs check.' : 'Device is Offline.';
  } else if (status === 'Online') {
    el.innerText = count > 0
      ? `Device is Online, had ${count} downtime events ≥5 min.`
      : 'Device is Online.';
  } else {
    el.innerText = 'Device status unknown.';
  }
}

function formatDuration(sec) {
  const d = Math.floor(sec / 86400), h = Math.floor((sec % 86400) / 3600),
    m = Math.floor((sec % 3600) / 60), s = Math.round(sec % 60);
  const parts = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  if (s || !parts.length) parts.push(`${s}s`);
  return parts.join('/');
}

function openDeviceHistory(ip, name, category) {
  const raw = window.deviceHistoryData[ip] || [];
  const hist = filterHistoryForDisplay(raw, category);
  displayDeviceHistory(ip, name, category, hist);
  document.getElementById('device-history-modal').style.display = 'block';
}



function displayDeviceHistory(ip, name, category, hist) {
  const header = document.getElementById('device-history-header');
  const container = document.getElementById('device-history');
  header.innerHTML = `
    <h2 style="color: var(--yellow); font-size: 24px;">${name} <span style="font-size:16px;">(${ip})</span></h2>
    <hr style="margin: 10px 0; border-color: var(--gray);">
  `;

  if (!hist.length) {
    container.innerHTML = `<p style="font-style: italic; color: #777;">No downtime ≥5 min in history.</p>`;
    return;
  }

  let html = `
    <div class="scrollable-history-table">
      <table class="history-table">
        <thead>
          <tr>
            <th>Sr.No</th><th>Date</th><th>Day</th><th>Time</th><th>Status</th><th>Duration</th>
          </tr>
        </thead>
        <tbody>
  `;

  let idx = 1;
  let lastOff = null;

  hist.forEach(e => {
    const t = new Date(e.timestamp);
    const date = t.toLocaleDateString();
    const day = t.toLocaleString('en-US', { weekday: 'long' });
    const time = t.toLocaleTimeString();
    let dur = '-';

    if (e.status === 'Offline') {
      if (!lastOff) {
        lastOff = e.timestamp;
        html += `
          <tr>
            <td>${idx++}</td><td>${date}</td><td>${day}</td><td>${time}</td>
            <td class="status-offline">${e.status}</td><td>${dur}</td>
          </tr>`;
      }
    } else if (e.status === 'Online') {
      if (lastOff) {
        const diff = (new Date(e.timestamp) - new Date(lastOff)) / 1000;
        dur = formatDuration(diff);
        const offTime = new Date(lastOff);
        const offDate = offTime.toLocaleDateString();
        const offDay = offTime.toLocaleString('en-US', { weekday: 'long' });
        const offClock = offTime.toLocaleTimeString();

        html += `
          <tr>
            <td>${idx++}</td><td>${offDate}</td><td>${offDay}</td><td>${offClock}</td>
            <td class="status-offline">Offline</td><td>${dur}</td>
          </tr>
          <tr>
            <td>${idx++}</td><td>${date}</td><td>${day}</td><td>${time}</td>
            <td class="status-online">${e.status}</td><td>${formatDuration(0)}</td>
          </tr>`;

        lastOff = null;
      } else {
        html += `
          <tr>
            <td>${idx++}</td><td>${date}</td><td>${day}</td><td>${time}</td>
            <td class="status-online">${e.status}</td><td>${dur}</td>
          </tr>`;
      }
    }
  });

  if (lastOff) {
    const t = new Date(lastOff);
    const date = t.toLocaleDateString();
    const day = t.toLocaleString('en-US', { weekday: 'long' });
    const time = t.toLocaleTimeString();
    const now = Date.now();
    const dur = formatDuration((now - new Date(lastOff)) / 1000);

    html += `
      <tr>
        <td>${idx++}</td><td>${date}</td><td>${day}</td><td>${time}</td>
        <td class="status-offline">Offline</td><td>${dur}</td>
      </tr>`;
  }

  html += `</tbody></table></div>`;
  container.innerHTML = html;
}




function closeHistoryModal() {
  document.getElementById('device-history-modal').style.display = 'none';
}

function exportDeviceTableToExcel() {
  const table = document.getElementById("device-table");
  const workbook = XLSX.utils.table_to_book(table, { sheet: "Device Table" });
  XLSX.writeFile(workbook, "Device_Table.xlsx");
}


function exportDeviceHistoryToExcel() {
  const historyTable = document.querySelector("#device-history-modal table");
  if (!historyTable) {
    alert("Please open a device's history first.");
    return;
  }
  const workbook = XLSX.utils.table_to_book(historyTable, { sheet: "Device History" });
  XLSX.writeFile(workbook, "Device_History.xlsx");
}



// function filterData() {
//   const rawTypeSel = document.getElementById('device-type').value.toUpperCase();
//   // normalize select values to match the Category text in the table
//   const typeSel = rawTypeSel === 'PCDETAILS' ? 'PCDETAIL'
//                 : rawTypeSel === 'DBDETAILS' ? 'DBDETAIL'
//                 : rawTypeSel;

//   const remarkSel = document.getElementById('remark-filter').value.toUpperCase();
//   const citySel   = document.getElementById('cityFilter')?.value.toUpperCase() || "ALL";
//   const searchTxt = document.getElementById('search-input').value.toUpperCase();

//   document.querySelectorAll('#device-table tbody tr').forEach(r => {
//     const ip     = r.cells[1].textContent.toUpperCase();
//     const name   = r.cells[2].textContent.toUpperCase();
//     const type   = r.cells[3].textContent.toUpperCase(); // e.g., CONTROLLER, PCDETAIL, DBDETAIL
//     const city   = r.cells[4].textContent.toUpperCase();
//     const remark = r.cells[9]?.textContent.toUpperCase();

//     const matchesType   = (typeSel === 'ALL' || type === typeSel);
//     const matchesRemark = (remarkSel === 'ALL' || remark.includes(remarkSel));
//     const matchesCity   = (citySel === 'ALL' || city === citySel);
//     const matchesSearch = (ip.includes(searchTxt) || name.includes(searchTxt));

//     r.style.display = matchesType && matchesRemark && matchesCity && matchesSearch ? '' : 'none';
//   });
// }

// new 

function filterData() {
  // Read UI selections
  const rawTypeSel = (document.getElementById('device-type')?.value || '');
  const rt = rawTypeSel.toUpperCase();

  // Normalize displayed device-type values to the internal data-category values
  let typeSel;
  if (rt === 'DESKTOP') typeSel = 'PCDETAIL';
  else if (rt === 'DB SERVER' || rt === 'DBSERVER') typeSel = 'DBDETAIL';
  else typeSel = rt; // e.g., ALL, CONTROLLER, CAMERA, SERVER, ARCHIVER

  const remarkSel = (document.getElementById('remark-filter')?.value || '').toUpperCase();
  const cityFilterEl = document.getElementById('cityFilter');
  const prevCityVal = cityFilterEl?.value || 'ALL';
  const searchTxt = (document.getElementById('search-input')?.value || '').toUpperCase();

  // Collect rows
  const tbodyRows = Array.from(document.querySelectorAll('#device-table tbody tr'));

  // First: figure out which cities are possible given type+remark+search (preserve original casing)
  const possibleCitiesMap = new Map(); // key: UPPERCASE city -> value: original city text
  tbodyRows.forEach(r => {
    const ip = r.cells[1].textContent.toUpperCase();
    const name = r.cells[2].textContent.toUpperCase();

    const typeCell = r.cells[3];
    const typeVal = (typeCell && typeCell.getAttribute('data-category'))
      ? typeCell.getAttribute('data-category').toUpperCase()
      : typeCell.textContent.toUpperCase();

    const cityOriginal = (r.cells[4].textContent || '').trim();
    const cityUp = cityOriginal.toUpperCase();
    const remark = (r.cells[9]?.textContent || '').toUpperCase();

    const matchesType = (typeSel === 'ALL' || typeVal === typeSel);
    const matchesRemark = (remarkSel === 'ALL' || remark.includes(remarkSel));
    const matchesSearch = (ip.includes(searchTxt) || name.includes(searchTxt));

    if (matchesType && matchesRemark && matchesSearch && cityOriginal) {
      possibleCitiesMap.set(cityUp, cityOriginal);
    }
  });

  // Sort possible cities (preserve case)
  const possibleCities = Array.from(possibleCitiesMap.values()).sort((a, b) => a.localeCompare(b));

  // Rebuild the city dropdown so it contains only available cities + All Cities
  if (cityFilterEl) {
    const prev = prevCityVal;
    cityFilterEl.innerHTML = '';

    const allOpt = document.createElement('option');
    allOpt.value = 'ALL';
    allOpt.textContent = 'All Cities';
    cityFilterEl.appendChild(allOpt);

    possibleCities.forEach(cityName => {
      const opt = document.createElement('option');
      opt.value = cityName;
      opt.textContent = cityName;
      cityFilterEl.appendChild(opt);
    });

    // Restore previous selection if still valid; else choose ALL
    const restored = (prev && (prev.toUpperCase() === 'ALL' || possibleCitiesMap.has(prev.toUpperCase()))) ? prev : 'ALL';
    cityFilterEl.value = restored;
  }

  // Now apply visibility of rows using the (possibly updated) city selection
  const citySel = (document.getElementById('cityFilter')?.value || 'ALL').toUpperCase();

  tbodyRows.forEach(r => {
    const ip = r.cells[1].textContent.toUpperCase();
    const name = r.cells[2].textContent.toUpperCase();

    const typeCell = r.cells[3];
    const type = (typeCell && typeCell.getAttribute('data-category'))
      ? typeCell.getAttribute('data-category').toUpperCase()
      : typeCell.textContent.toUpperCase();

    const city = (r.cells[4].textContent || '').toUpperCase();
    const remark = (r.cells[9]?.textContent || '').toUpperCase();

    const matchesType = (typeSel === 'ALL' || type === typeSel);
    const matchesRemark = (remarkSel === 'ALL' || remark.includes(remarkSel));
    const matchesCity = (citySel === 'ALL' || city === citySel);
    const matchesSearch = (ip.includes(searchTxt) || name.includes(searchTxt));

    r.style.display = (matchesType && matchesRemark && matchesCity && matchesSearch) ? '' : 'none';
  });
}




function copyToClipboard(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const text = el.innerText;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => showToast(`Copied: ${text}`))
      .catch(err => console.error("Clipboard error:", err));
  } else {
    // fallback
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";  // avoid scrolling
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      showToast(`Copied: ${text}`);
    } catch (err) {
      console.error("Fallback copy failed", err);
    }
    document.body.removeChild(textarea);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }

  ['region', 'device-type', 'remark-filter'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', id === 'region' ? fetchDeviceData : filterData);
  });

  document.getElementById('search-input')?.addEventListener('input', filterData);
  document.getElementById('cityFilter')?.addEventListener('change', filterData);

  fetchDeviceData();
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 2500);
}



C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\graph.js

function updateGauge(id, activeId, inactiveId, totalId) {
  const active = parseInt(document.getElementById(activeId).textContent) || 0;
  const inactive = parseInt(document.getElementById(inactiveId).textContent) || 0;
  const total = active + inactive;

  // element
  const gauge = document.getElementById(id);
  if (!gauge) return;

  // % calculation
  let percentage = total === 0 ? 0 : Math.round((active / total) * 100);

  // set values
  gauge.style.setProperty("--percentage", percentage);

  // update text inside semicircle
  gauge.querySelector(".total").textContent = total;
  gauge.querySelector(".active").textContent = active;
  gauge.querySelector(".inactive").textContent = inactive;

  // card footer also updates
  document.getElementById(totalId).textContent = total;
}

function renderGauges() {
  updateGauge("gauge-cameras", "camera-online", "camera-offline", "camera-total");
  updateGauge("gauge-archivers", "archiver-online", "archiver-offline", "archiver-total");
  updateGauge("gauge-controllers", "controller-online", "controller-offline", "controller-total");
  updateGauge("gauge-ccure", "server-online", "server-offline", "server-total");
}

document.addEventListener("DOMContentLoaded", () => {
  renderGauges();
  setInterval(renderGauges, 6000);
});


// ⬇️⬇️⬇️⬇️⬇️⬇️ PIE chart




// --- Total Count doughnut chart (uses Chart.js) ---

let _totalCountChart = null;

/**
 * Find the chart-placeholder element inside the card whose title matches text.
 * Returns the placeholder element or null.
 */
function findChartPlaceholderByTitle(titleText) {
  const cards = document.querySelectorAll('.gcard.wide');
  for (let card of cards) {
    const h = card.querySelector('.gcard-title');
    if (h && h.textContent.trim().toLowerCase() === titleText.trim().toLowerCase()) {
      return card.querySelector('.chart-placeholder');
    }
  }
  return null;
}

/**
 * Collect totals from DOM. Add/remove device keys as needed.
 * Make sure IDs used here exist in your summary-section.
 */


function collectTotalCounts() {
  const keys = [
    { id: 'camera-total', label: 'Cameras' },
    { id: 'archiver-total', label: 'Archivers' },
    { id: 'controller-total', label: 'Controllers' },
    { id: 'server-total', label: 'CCURE' },
    { id: 'doorReader-total', label: 'Door' },
    { id: 'reader-total-inline', label: 'Reader' },
    { id: 'pc-total', label: 'Desktop' },
    { id: 'db-total', label: 'DB Server' }
  ];

  const labels = [];
  const values = [];

  keys.forEach(k => {
    const el = document.getElementById(k.id);
    const v = el
      ? parseInt((el.textContent || '0').replace(/,/g, '').trim(), 10)
      : 0;

    if (v > 0) {
      labels.push(k.label);
      values.push(v);
    }
  });

  if (values.length === 0) {
    return { labels: ['No devices'], values: [0] };  // ✅ fixed
  }

  return { labels, values };
}

/**
 * Render or update the Total Count doughnut.
 */



function renderTotalCountChart() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded — add https://cdn.jsdelivr.net/npm/chart.js');
    return;
  }

  const placeholder = findChartPlaceholderByTitle('Total Count');
  if (!placeholder) return;

  let canvas = placeholder.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    placeholder.innerHTML = '';
    placeholder.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  const data = collectTotalCounts();

  // calculate total
  //   const totalValue = data.values.reduce((a, b) => a + b, 0);
  const totalValue = data.labels[0] === 'No devices'
    ? 0
    : data.values.reduce((a, b) => a + b, 0);

  if (_totalCountChart) {
    _totalCountChart.destroy();
  }

  const palette = [
    '#10b981', '#f97316', '#2563eb',
    '#7c3aed', '#06b6d4', '#ef4444',
    '#f59e0b', '#94a3b8'
  ];

  // ---- Plugin for CENTER TEXT ----
  const centerTextPlugin = {
    id: 'centerText',
    afterDraw(chart) {
      const { ctx, chartArea } = chart;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Total label
      ctx.font = '14px Inter, Arial';
      // ctx.fillStyle = '#aaa';
      // Total label
      ctx.fillStyle = getComputedStyle(document.body)
        .getPropertyValue('--graph-card-footer-dark');

      ctx.fillText('TOTAL', centerX, centerY - 12);

      // Total value
      ctx.font = 'bold 20px Inter, Arial';
      // ctx.fillStyle = '#fff';
      // Total value
      ctx.fillStyle = getComputedStyle(document.body)
        .getPropertyValue('--graph-card-title-dark');
      ctx.fillText(totalValue, centerX, centerY + 12);

      ctx.restore();
    }
  };

  _totalCountChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.values,
        backgroundColor: palette.slice(0, data.values.length),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            padding: 12,

            // 🔥 THIS adds count next to label
            generateLabels: function (chart) {
              const dataset = chart.data.datasets[0];
              const labels = chart.data.labels;
              const bgColors = dataset.backgroundColor;

              return labels.map((label, i) => {
                return {
                  text: `${label} - ${dataset.data[i]}`,
                  fillStyle: bgColors[i],
                  strokeStyle: bgColors[i],
                  hidden: false,
                  index: i
                };
              });
            }
          }
        },

        tooltip: {
          callbacks: {
            label: function (ctx) {
              const label = ctx.label || '';
              const value = ctx.parsed || 0;
              return `${label} : ${value}`;
            }
          }
        }
      }
    },

    plugins: [centerTextPlugin]   // ✅ center total plugin
  });
}




/**
 * Update the Total Count chart data in-place (if chart exists) otherwise render
 */
function updateTotalCountChart() {
  if (!_totalCountChart) {
    renderTotalCountChart();
    return;
  }
  const data = collectTotalCounts();
  _totalCountChart.data.labels = data.labels;
  _totalCountChart.data.datasets[0].data = data.values;
  _totalCountChart.data.datasets[0].backgroundColor = [

    '#10b981', '#f97316', '#2563eb', '#7c3aed', '#06b6d4', '#ef4444', '#f59e0b', '#94a3b8'
  ].slice(0, data.values.length);
  _totalCountChart.update();
}

// Hook it up: render on DOMContentLoaded and update when gauges refresh
document.addEventListener('DOMContentLoaded', () => {
  // initial render (if Chart.js loaded)
  renderTotalCountChart();

  // re-render on window resize (debounced)
  let resizeTO;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTO);
    resizeTO = setTimeout(() => {
      renderTotalCountChart(); // re-create with correct sizing
    }, 200);
  });
});

// Call updateTotalCountChart() whenever your data changes.
// We'll call it inside renderGauges() so it updates after gauges refresh.
function renderGauges() {
  updateGauge("gauge-cameras", "camera-online", "camera-offline", "camera-total");
  updateGauge("gauge-archivers", "archiver-online", "archiver-offline", "archiver-total");
  updateGauge("gauge-controllers", "controller-online", "controller-offline", "controller-total");
  updateGauge("gauge-ccure", "server-online", "server-offline", "server-total");

  // update Total Count pie
  updateTotalCountChart();
}






// ☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️
// ☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️

// Add this function to graph.js - it's referenced but not defined
function filterHistoryForDisplay(hist, category) {
  const cat = (category || '').toString().toUpperCase();
  const filtered = [];
  let lastOff = null;

  hist.forEach(e => {
    if (e.status === 'Offline') {
      lastOff = e;
    } else if (e.status === 'Online' && lastOff) {
      const diff = (new Date(e.timestamp) - new Date(lastOff.timestamp)) / 1000;

      if (cat === 'SERVER') {
        if (diff > 300) {
          filtered.push(lastOff, e);
        }
      } else {
        if (diff >= 300) {
          filtered.push(lastOff, e);
        }
      }
      lastOff = null;
    } else {
      if (cat !== 'SERVER') filtered.push(e);
    }
  });

  if (lastOff) {
    const diff = (Date.now() - new Date(lastOff.timestamp)) / 1000;
    if (cat === 'SERVER') {
      if (diff > 300) filtered.push(lastOff);
    } else {
      if (diff >= 300) filtered.push(lastOff);
    }
  }

  return filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

// Global variable to store chart instance
let failureChart = null;

function refreshFailureChart(failureData) {
  console.log('FAILURE COUNT CHART: Refreshing with data:', failureData);
  
  if (!failureChart) {
    console.log('FAILURE COUNT CHART: No chart instance, creating new one');
    failureChart = createFailureCountChart();
  }
  
  if (failureChart) {
    failureChart.data.datasets[0].data = Object.values(failureData);
    failureChart.update();
    console.log('FAILURE COUNT CHART: Chart updated successfully');
    
    // Force canvas to be visible
    const canvas = document.getElementById('failureCountChart');
    if (canvas) {
      canvas.style.display = 'block';
      canvas.style.visibility = 'visible';
      canvas.style.opacity = '1';
      canvas.style.zIndex = '10';
      canvas.style.position = 'relative';
    }
  } else {
    console.error('FAILURE COUNT CHART: Failed to create chart instance');
  }
}

// Enhanced Failure Count Chart with real data
function createFailureCountChart() {
  const ctx = document.getElementById('failureCountChart');
  if (!ctx) {
    console.error('FAILURE COUNT CHART: Canvas element not found!');
    return null;
  }
  
  console.log('FAILURE COUNT CHART: Creating chart...');
  
  // Ensure canvas is visible
  ctx.style.display = 'block';
  ctx.style.visibility = 'visible';
  ctx.style.opacity = '1';
  ctx.style.width = '100%';
  ctx.style.height = '100%';
  
  failureChart = new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['Cameras', 'Controllers', 'Archivers', 'Servers', 'Desktops', 'DB Servers'],
      datasets: [{
        label: 'Total Failures',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: [
          '#ff6b6b',
          '#4ecdc4', 
          '#45b7d1',
          '#96ceb4',
          '#ffa726',
          '#ffee58'
        ],
        borderColor: [
          '#ff5252',
          '#26a69a',
          '#29b6f6', 
          '#81c784',
          '#ff9800',
          '#fdd835'
        ],
        borderWidth: 2,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        title: {
          display: true,
          text: 'Device Failure Count',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: 20
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed.y} failures`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Failures',
            font: {
              weight: 'bold'
            }
          },
          ticks: {
            precision: 0,
            stepSize: 1
          },
          grid: {
            color: 'rgba(0,0,0,0.1)'
          }
        },
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45
          },
          grid: {
            display: false
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      }
    }
  });

  console.log('FAILURE COUNT CHART: Chart created successfully');
  return failureChart;
}

// Calculate failure counts from your device data - DYNAMIC VERSION
function calculateFailureCounts(deviceDetails) {
  console.log('CALCULATING FAILURE COUNTS from device details:', deviceDetails);
  
  const counts = {
    cameras: 0,
    controllers: 0,
    archivers: 0,
    servers: 0,
    desktops: 0,
    dbServers: 0
  };

  if (!deviceDetails || typeof deviceDetails !== 'object') {
    console.warn('No valid device details provided');
    return counts;
  }

  if (!window.deviceHistoryData) {
    console.warn('No device history data available yet');
    return counts;
  }

  console.log('Available device history data keys:', Object.keys(window.deviceHistoryData).length);

  // Process each device type with proper error handling
  const deviceTypes = ['cameras', 'archivers', 'controllers', 'servers', 'pcDetails', 'DBDetails'];
  
  deviceTypes.forEach(type => {
    const devices = deviceDetails[type] || [];
    console.log(`Processing ${type}: ${devices.length} devices`);
    
    devices.forEach(device => {
      if (!device || !device.ip_address) return;
      
      const ip = device.ip_address;
      const history = window.deviceHistoryData[ip] || [];
      const category = type.toUpperCase();
      
      console.log(`Device ${ip} (${type}): ${history.length} history entries`);
      
      const filteredHistory = filterHistoryForDisplay(history, category);
      const failureCount = filteredHistory.filter(e => e && e.status === 'Offline').length;
      
      if (failureCount > 0) {
        console.log(`→ ${ip}: ${failureCount} failures`);
      }
      
      // Map to appropriate category
      switch(type) {
        case 'cameras': counts.cameras += failureCount; break;
        case 'controllers': counts.controllers += failureCount; break;
        case 'archivers': counts.archivers += failureCount; break;
        case 'servers': counts.servers += failureCount; break;
        case 'pcDetails': counts.desktops += failureCount; break;
        case 'DBDetails': counts.dbServers += failureCount; break;
        default: console.warn(`Unknown device type: ${type}`);
      }
    });
  });

  console.log('FINAL DYNAMIC FAILURE COUNTS:', counts);
  return counts;
}



// Enhanced initialization for Failure Count Chart - DYNAMIC VERSION
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded - initializing Failure Count Chart for dynamic data');
  
  // Initialize the chart with empty data first
  createFailureCountChart();
  
  // Set up a global reference for device details
  window.currentDeviceDetails = window.currentDeviceDetails || {};
  
  // Check if we already have data (in case graph.js loads after other scripts)
  setTimeout(() => {
    if (window.deviceHistoryData && window.currentDeviceDetails && 
        Object.keys(window.currentDeviceDetails).length > 0) {
      console.log('Found existing device data, updating chart dynamically');
      const failureData = calculateFailureCounts(window.currentDeviceDetails);
      refreshFailureChart(failureData);
    } else {
      console.log('Waiting for device data to load...');
      // Show loading state
      if (failureChart) {
        failureChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0];
        failureChart.data.datasets[0].backgroundColor = '#cccccc';
        failureChart.update();
      }
    }
  }, 1000);
});



// Global update function that other scripts can call
window.updateFailureChartWithData = function(deviceDetails, historyData) {
  console.log('UPDATE FAILURE CHART CALLED with:', {
    deviceDetails: deviceDetails,
    historyDataCount: historyData ? Object.keys(historyData).length : 0
  });
  
  // Update global references
  if (deviceDetails) {
    window.currentDeviceDetails = deviceDetails;
  }
  
  if (historyData) {
    window.deviceHistoryData = historyData;
  }
  
  // Calculate and update chart if we have both data sources
  if (window.currentDeviceDetails && window.deviceHistoryData) {
    const failureData = calculateFailureCounts(window.currentDeviceDetails);
    refreshFailureChart(failureData);
  } else {
    console.warn('Cannot update chart - missing data:', {
      hasDeviceDetails: !!window.currentDeviceDetails,
      hasHistoryData: !!window.deviceHistoryData
    });
  }
};



// Global function to update device details - call this from your main data loading
window.updateDeviceDetails = function(details) {
  console.log('UPDATING DEVICE DETAILS:', details);
  window.currentDeviceDetails = details;
  
  // Update failure chart if it exists
  if (failureChart && window.deviceHistoryData) {
    const failureData = calculateFailureCounts(details);
    refreshFailureChart(failureData);
  }
};

// Test function to manually trigger chart update
window.testFailureChart = function() {
  console.log('Manual test of failure chart');
  const testData = {
    cameras: Math.floor(Math.random() * 20),
    controllers: Math.floor(Math.random() * 15),
    archivers: Math.floor(Math.random() * 10),
    servers: Math.floor(Math.random() * 8),
    desktops: Math.floor(Math.random() * 25),
    dbServers: Math.floor(Math.random() * 5)
  };
  refreshFailureChart(testData);
};



// Enhanced test function to show real data status
window.showDataStatus = function() {
  console.log('=== FAILURE CHART DATA STATUS ===');
  console.log('Chart instance:', failureChart ? 'Exists' : 'NULL');
  console.log('Current device details:', window.currentDeviceDetails ? 
    `Has ${Object.keys(window.currentDeviceDetails).length} device types` : 'NULL');
  console.log('Device history data:', window.deviceHistoryData ?
    `Has ${Object.keys(window.deviceHistoryData).length} IPs` : 'NULL');
  
  if (window.currentDeviceDetails && window.deviceHistoryData) {
    const realData = calculateFailureCounts(window.currentDeviceDetails);
    console.log('Calculated real data:', realData);
    
    if (failureChart) {
      console.log('Current chart data:', failureChart.data.datasets[0].data);
    }
  }
};
