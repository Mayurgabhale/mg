summary.js:112 Error fetching device history: ReferenceError: renderFailureCountChart is not defined
    at populateDeviceTable (summary.js:253:5)
    at summary.js:110:13
(anonymous)	@	summary.js:112
Promise.catch		
fetchDeviceHistory	@	summary.js:112
(anonymous)	@	summary.js:92
Promise.then		
fetchDeviceData	@	summary.js:56
(anonymous)	@	summary.html:188

Error fetching device history: ReferenceError: renderFailureCountChart is not defined
    at populateDeviceTable (summary.js:253:5)
    at summary.js:110:13


.........
      
ReferenceError: renderFailureCountChart is not defined
    at populateDeviceTable (trend.js:1071:3)
    at trend.js:916:7
Promise.catch
fetchDeviceHistory @ trend.js:919
(anonymous) @ trend.js:908
Promise.then
fetchDeviceData @ trend.js:908
(anonymous) @ trend.html:306Understand this error
ReferenceError: renderFailureCountChart is not defined
    at populateDeviceTable (trend.js:1071:3)
    at trend.js:916:7
Promise.catch
fetchDeviceHistory @ trend.js:919
(anonymous) @ trend.js:908
Promise.then
fetchDeviceData @ trend.js:908
(anonymous) @ trend.js:1466Understand this error
....
      
C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\summary.js

// C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\summary.js

let deviceUptimeTimers = {};
let deviceDowntimeTimers = {};

// Utility to turn an IP (or any string) into a safe DOM-ID fragment
function sanitizeId(str) {
    return (str || '').replace(/[^a-zA-Z0-9]/g, '_');
}

// Map device arrays to human-friendly singular category names
const deviceTypeMap = {
    cameras: 'Camera',
    archivers: 'Archiver',
    controllers: 'Controller',
    servers: 'Server',
    pcDetails: 'Desktop',
    DBDetails: 'DB Server'
};

function getDeviceName(dev, type) {
    // preserve previous logic where possible but handle pcDetails/DBDetails
    if (type === 'pcDetails') return dev.pc_name || dev.hostname || dev.name || 'Unknown';
    if (type === 'DBDetails') return dev.application || dev.hostname || dev.name || 'Unknown';
    // fallback for other device types - original code tried e.g. cameraname etc.
    return dev[(type.slice(0, -1)) + 'name'] || dev.hostname || dev.name || 'Unknown';
}

function fetchDeviceData() {
    const selectedRegion = document.getElementById('region').value;

    if (selectedRegion === 'All') {
        fetch(`http://localhost/api/regions/all-details`)
            .then(res => res.json())
            .then(allRegionsData => {
                // include pcDetails and DBDetails while keeping previous logic identical
                let combinedDetails = { cameras: [], archivers: [], controllers: [], servers: [], pcDetails: [], DBDetails: [] };
                Object.values(allRegionsData).forEach(regionData => {
                    if (regionData.details) {
                        ['cameras', 'archivers', 'controllers', 'servers', 'pcDetails', 'DBDetails'].forEach(type => {
                            combinedDetails[type].push(...(regionData.details[type] || []));
                        });
                    }
                });
                fetchDeviceHistory(combinedDetails);
            })
            .catch(err => console.error('Error fetching all regions data:', err));
    } else {

        fetch(`http://localhost/api/regions/details/${selectedRegion}`)
            .then(res => res.json())


            // inside fetchDeviceData(), in the selectedRegion !== 'All' branch
            .then(regionData => {
                const d = regionData.details || {};
                const total = (d.cameras?.length || 0) + (d.archivers?.length || 0) + (d.controllers?.length || 0) + (d.servers?.length || 0) + (d.pcDetails?.length || 0) + (d.DBDetails?.length || 0);
                const online = ([...(d.cameras || []), ...(d.archivers || []), ...(d.controllers || []), ...(d.servers || []), ...(d.pcDetails || []), ...(d.DBDetails || [])]
                    .filter(dev => dev.status === "Online").length);

                const setWithIcon = (id, iconClass, label, value, colorClass = "") => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.innerHTML = `<i class="${iconClass}"></i> ${label}: <span class="${colorClass}" style="font-weight: 700;">${value}</span>`;
                    }
                };

                // Update UI
                setWithIcon("total-devices", "fas fa-network-wired", "Total Devices", total, "text-green");
                setWithIcon("total-online", "fas fa-signal", "Online Devices", online, "text-green");
                setWithIcon("total-cameras", "fas fa-video", "Total Cameras", d.cameras?.length || 0, "text-green");
                setWithIcon("total-controllers", "fas fa-microchip", "Total Controllers", d.controllers?.length || 0, "text-green");
                setWithIcon("total-archivers", "fas fa-database", "Total Archivers", d.archivers?.length || 0, "text-green");
                setWithIcon("total-servers", "fas fa-server", "Total Servers", d.servers?.length || 0, "text-green");
                setWithIcon("total-pcs", "fas fa-desktop", "Total Desktop", d.pcDetails?.length || 0, "text-green");
                setWithIcon("total-dbs", "fas fa-database", "Total DB Server", d.DBDetails?.length || 0, "text-green");

                // Save the authoritative region totals so filterData() can keep them
                window.regionSummary = {
                    totalDevices: total,
                    totalOnline: online,
                    totalCameras: d.cameras?.length || 0,
                    totalControllers: d.controllers?.length || 0,
                    totalArchivers: d.archivers?.length || 0,
                    totalServers: d.servers?.length || 0,
                    totalPCs: d.pcDetails?.length || 0,
                    totalDBs: d.DBDetails?.length || 0
                };

                // then fetch history and build table
                fetchDeviceHistory(d);
            })




            .catch(err => console.error('Error fetching device data:', err));
    }
}



function fetchDeviceHistory(details) {
    fetch(`http://localhost/api/devices/history`)
        .then(res => res.json())
        .then(historyData => {
            // set global first to avoid race when user clicks fast
            window.deviceHistoryData = historyData;
            populateDeviceTable(details, historyData);
        })
        .catch(err => console.error('Error fetching device history:', err));
}


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



// 📝📝📝📝📝  new server time add code 07-11-2025
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
                // ✅ For SERVER: keep only downtime > 5 minutes
                if (diff > 300) {
                    filtered.push(lastOff, e);
                }
            } else {
                // ✅ For other devices: keep original rule (downtime ≥ 5 min)
                if (diff >= 300) {
                    filtered.push(lastOff, e);
                } else {
                    // If your original non-server logic allowed short events, you can adjust here.
                }
            }
            lastOff = null;
        } else {
            // Keep Online or single events for non-servers
            if (cat !== 'SERVER') filtered.push(e);
        }
    });

    // Handle the last Offline event (still down)
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
// 📝📝📝📝📝




function startUptime(ip, hist) {
    const safe = sanitizeId(ip);
    clearInterval(deviceDowntimeTimers[safe]);
    const lastOn = hist.filter(e => e.status === 'Online').pop();
    if (!lastOn) return;
    const start = new Date(lastOn.timestamp).getTime();
    deviceUptimeTimers[safe] = setInterval(() => {
        const secs = Math.floor((Date.now() - start) / 1000);
        const el = document.getElementById(`uptime-${safe}`);
        if (el) el.innerText = formatDuration(secs);
    }, 1000);
}

function startDowntime(ip, hist, category) {
    const safe = sanitizeId(ip);
    clearInterval(deviceUptimeTimers[safe]);
    const lastOff = hist.filter(e => e.status === 'Offline').pop();
    if (!lastOff) return;
    const start = new Date(lastOff.timestamp).getTime();
    deviceDowntimeTimers[safe] = setInterval(() => {
        const secs = Math.floor((Date.now() - start) / 1000);
        const el = document.getElementById(`downtime-${safe}`);
        if (el) el.innerText = formatDuration(secs);
        updateDowntimeCount(ip, hist, category);
    }, 1000);
}

function updateDowntimeCount(ip, hist, category) {
    const safe = sanitizeId(ip);
    const offs = filterHistoryForDisplay(hist, category).filter(e => e.status === 'Offline');
    const count = offs.length;
    const el = document.getElementById(`downtime-count-${safe}`);
    if (el) el.innerText = count;
    updateRemarks(ip, hist, category);
}

function updateRemarks(ip, hist, category) {
    const safe = sanitizeId(ip);
    const filteredOffs = filterHistoryForDisplay(hist, category).filter(e => e.status === 'Offline');
    const count = filteredOffs.length;
    const lastStatus = hist.length ? hist[hist.length - 1].status : 'Unknown';
    const el = document.getElementById(`remark-${safe}`);
    if (!el) return;

    if (lastStatus === 'Offline') {
        el.innerText = count >= 10 ? "Device is Offline, needs repair." : "Device is Offline.";
    }
    else if (lastStatus === 'Online') {
        if (count >= 10) el.innerText = "Device is Online, needs repair.";
        else if (count > 0) el.innerText = `Device is Online, it had ${count} downtime occurrences.`;
        else el.innerText = "Device is Online.";
    }
    else {
        el.innerText = "Device status unknown.";
    }
    const dc = document.getElementById(`downtime-count-${safe}`);
    if (dc) dc.innerText = count;
}

function formatDuration(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    const parts = [];
    if (d) parts.push(`${d}d`);
    if (h) parts.push(`${h}h`);
    if (m) parts.push(`${m}m`);
    if (s || !parts.length) parts.push(`${s}s`);
    return parts.join('/');
}


function openDeviceHistory(ip, name, category) {
    if (!window.deviceHistoryData) {
        console.error("No history loaded");
        showToast("History still loading — please try again in a moment.");
        return;
    }
    const raw = window.deviceHistoryData[ip] || [];
    const hist = filterHistoryForDisplay(raw, (category || '').toUpperCase());
    displayDeviceHistory(ip, name, category, hist);
    const modal = document.getElementById('device-history-modal');
    if (modal) modal.style.display = 'block';
}

function calculateDowntimeDuration(ts, hist) {
    const start = new Date(ts).getTime();
    const nextUp = hist.find(e => e.status === 'Online' && new Date(e.timestamp).getTime() > start);
    if (nextUp) return formatDuration((new Date(nextUp.timestamp).getTime() - start) / 1000);
    return formatDuration((Date.now() - start) / 1000);
}

function displayDeviceHistory(ip, name, category, hist) {
    const header = document.getElementById('device-history-header');
    const container = document.getElementById('device-history');

    if (header) {
        header.innerHTML = `
            <h2 style="color: var(--yellow); font-size: 24px; margin-bottom: 10px;">Device History</h2>
            <p><strong>Device Name:</strong> ${name}</p>
            <p><strong>Device IP:</strong> ${ip}</p>
            <hr style="margin: 15px 0; border-color: var(--gray);">`;
    }

    if (!container) return;

    container.innerHTML = '';

    if (!hist.length) {
        container.innerHTML = `<p style="font-style: italic; color: #555;">No significant history (all brief outages &lt; 5 min).</p>`;
        return;
    }

    let html = `
        <div class="history-table-wrapper" >
          <table class="history-table">
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Date</th>
                <th>Day</th>
                <th>Time</th>
                <th>Status</th>
                <th>Downtime Duration</th>
              </tr>
            </thead>
            <tbody>
    `;

    let lastOff = null;
    hist.forEach((e, i) => {
        const d = new Date(e.timestamp);
        const date = d.toLocaleDateString();
        const day = d.toLocaleString('en-US', { weekday: 'long' });
        const time = d.toLocaleTimeString();
        let dur = '-';
        if (e.status === 'Offline') lastOff = e.timestamp;
        else if (e.status === 'Online' && lastOff) {
            dur = calculateDowntimeDuration(lastOff, hist);
            lastOff = null;
        }

        html += `
          <tr>
            <td>${i + 1}</td>
            <td>${date}</td>
            <td>${day}</td>
            <td>${time}</td>
            <td class="${e.status === 'Offline' ? 'status-offline' : 'status-online'}">${e.status}</td>
            <td>${dur}</td>
          </tr>`;
    });

    html += `</tbody></table></div>`;
    container.innerHTML = html;
}

function closeHistoryModal() {
    const modal = document.getElementById('device-history-modal');
    if (modal) modal.style.display = 'none';
}




function filterData() {
    const searchValue = (document.getElementById('searchBox')?.value || "").toLowerCase();
    const selectedCity = (document.getElementById('cityFilter')?.value || "").toLowerCase().trim(); // note id: cityFilter
    const selectedDeviceType = (document.getElementById('device-type')?.value || "all").toLowerCase().trim();
    const selectedRemark = (document.getElementById('remark-filter')?.value || "all").toLowerCase().trim();

    const rows = document.querySelectorAll('#device-table tbody tr');
    let visibleCount = 0;

    let totalDevices = 0;
    let totalOnline = 0;
    let totalCameras = 0;
    let totalControllers = 0;
    let totalArchivers = 0;
    let totalServers = 0;
    let totalPCs = 0;
    let totalDBs = 0;
    let currentlyOffline = 0;
    let downtimeOver15 = 0;

    rows.forEach(row => {
        // skip header / placeholder rows if any
        if (!row.cells || row.cells.length < 8) return;

        const ip = row.cells[1].textContent.trim();
        const name = (row.cells[2].textContent || "").toLowerCase();
        const category = (row.cells[3].textContent || "").toLowerCase().trim();
        const region = (row.cells[4].textContent || "").toLowerCase().trim();
        const city = (row.cells[5].textContent || "").toLowerCase().trim();
        const remark = (document.getElementById(`remark-${sanitizeId(ip)}`)?.innerText || "").toLowerCase().trim();
        const currentStatus = row.classList.contains("row-offline") ? "offline" : "online";
        const downtimeCount = parseInt(row.cells[7].textContent.trim()) || 0;

        const matchesSearch = [ip.toLowerCase(), name, category, region, city].some(text =>
            text.includes(searchValue)
        );

        const matchesCity = !selectedCity || selectedCity === "all" || city === selectedCity;
        const matchesType = selectedDeviceType === "all" || category === selectedDeviceType;
        const matchesRemark = selectedRemark === "all" || remark.includes(selectedRemark);

        const shouldDisplay = matchesSearch && matchesCity && matchesType && matchesRemark;
        row.style.display = shouldDisplay ? "" : "none";

        if (shouldDisplay) {
            visibleCount++;
            totalDevices++;
            if (currentStatus === "online") totalOnline++;
            if (currentStatus === "offline") currentlyOffline++;
            if (downtimeCount > 15) downtimeOver15++;

            if (category === "camera") totalCameras++;
            else if (category === "controller") totalControllers++;
            else if (category === "archiver") totalArchivers++;
            else if (category === "server") totalServers++;
            else if (category === "desktop") totalPCs++;
            else if (category === "db server") totalDBs++;
        }
    });

    updateDisplayedDeviceCount(visibleCount);

    // Update summary cards based on filtered data
    const setSummary = (id, iconClass, label, value) => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = `<i class="${iconClass}"></i> ${label}: <span style="font-weight:700;">${value}</span>`;
        }
    };

    // use the correct variables (not undefined ones)
    setSummary("total-devices", "fas fa-network-wired", "Total Devices", totalDevices);
    setSummary("total-online", "fas fa-signal", "Online Devices", totalOnline);
    setSummary("total-cameras", "fas fa-video", "Total Cameras", totalCameras);
    setSummary("total-controllers", "fas fa-microchip", "Total Controllers", totalControllers);
    setSummary("total-archivers", "fas fa-database", "Total Archivers", totalArchivers);
    setSummary("total-servers", "fas fa-server", "Total Servers", totalServers);
    setSummary("total-pcs", "fas fa-desktop", "Total Desktop", totalPCs);
    setSummary("total-dbs", "fas fa-database", "Total DB Server", totalDBs);

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.innerText = value;
    };

    setText("count-downtime-over-15", `Devices with >15 downtimes: ${downtimeOver15}`);
    setText("count-currently-offline", `Devices currently Offline: ${currentlyOffline}`);
}



function updateDisplayedDeviceCount(count) {
    const el = document.getElementById('device-count');
    if (el) el.innerText = `Displayed Devices: ${count}`;
}

document.addEventListener("DOMContentLoaded", () => {
    ['region', 'device-type', 'remark-filter'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', id === 'region' ? fetchDeviceData : filterData);
    });

    const cityFilter = document.getElementById('city-filter');
    if (cityFilter) {
        cityFilter.addEventListener('change', filterData);
    }

    fetchDeviceData();
});

function exportDeviceTableToExcel() {
    const tbl = document.getElementById("device-table");
    if (!tbl) return;
    const wb = XLSX.utils.table_to_book(tbl, { sheet: "Device Table" });
    XLSX.writeFile(wb, "Device_Table.xlsx");
}

function exportDeviceHistoryToExcel() {
    const histTbl = document.querySelector("#device-history-modal table");
    if (!histTbl) return alert("Please open a device's history first.");
    const wb = XLSX.utils.table_to_book(histTbl, { sheet: "Device History" });
    XLSX.writeFile(wb, "Device_History.xlsx");
}

function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => showToast(`Copied: ${text}`))
            .catch(err => console.error("Copy failed: ", err));
    } else {
        // fallback
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            showToast(`Copied: ${text}`);
        } catch (err) {
            console.error("Fallback copy failed:", err);
        }
        document.body.removeChild(textarea);
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = "toast show";
    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 2500);
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId)?.innerText;
    if (text) {
        navigator.clipboard.writeText(text)
            .then(() => showToast(`Copied: ${text}`))
            .catch(err => console.error("Failed to copy:", err));
    }
}


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

    const matchesType   = (typeSel === 'ALL' || type === typeSel);
    const matchesRemark = (remarkSel === 'ALL' || remark.includes(remarkSel));
    const matchesCity   = (citySel === 'ALL' || city === citySel);
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

