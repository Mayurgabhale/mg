not disply 
C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\map.html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <div style="width: 600px; margin: 20px auto; background-color: aqua;">
  <canvas id="failureChart"></canvas>
</div>



<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="trend.js"></script>
</body>
</html>


...
  C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\trend.js


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

function fetchDeviceHistory(details) {
  fetch(`http://localhost/api/devices/history`)
    .then(r => r.json())
    .then(historyData => {
      populateDeviceTable(details, historyData);
      window.deviceHistoryData = historyData;
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


renderFailureChart(devices);


  filterData();


}



// ..........


let failureChartInstance = null;

function renderFailureChart(devices) {
  // Initialize failure counters
  let failureCounts = {
    CAMERA: 0,
    ARCHIVER: 0,
    CONTROLLER: 0,
    SERVER: 0
  };

  // Loop through devices and add their failure count
  devices.forEach(dev => {
    if (failureCounts[dev.category] !== undefined) {
      failureCounts[dev.category] += dev.downCount;
    }
  });

  const ctx = document.getElementById('failureChart');
  if (!ctx) return;

  // Destroy old chart if exists (important when region changes)
  if (failureChartInstance) {
    failureChartInstance.destroy();
  }

  failureChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Cameras', 'Archivers', 'Controllers', 'Servers'],
      datasets: [{
        label: 'Failure Count',
        data: [
          failureCounts.CAMERA,
          failureCounts.ARCHIVER,
          failureCounts.CONTROLLER,
          failureCounts.SERVER
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Device Failure Count Chart'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// ..........


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
