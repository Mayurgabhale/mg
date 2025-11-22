// let deviceUptimeTimers = {};
// let deviceDowntimeTimers = {};

// // Utility to turn an IP (or any string) into a safe DOM‑ID fragment
// function sanitizeId(str) {
//     return str.replace(/[^a-zA-Z0-9]/g, '_');
// }

// function fetchDeviceData() {
//     const selectedRegion = document.getElementById('region').value;
//     fetch(`http://localhost/api/regions/details/${selectedRegion}`)
//         .then(response => response.json())
//         .then(regionData => {
//             fetchDeviceHistory(regionData.details);
//         })
//         .catch(error => console.error('Error fetching device data:', error));
// }

// function fetchDeviceHistory(regionDetails) {
//     fetch(`http://localhost/api/devices/history`)
//         .then(response => response.json())
//         .then(historyData => {
//             populateDeviceTable(regionDetails, historyData);
//             window.deviceHistoryData = historyData; // Store history for reuse
//         })
//         .catch(error => console.error('Error fetching device history:', error));
// }

// function populateDeviceTable(details, historyData) {
//     const table = document.getElementById('device-table');
//     let tableBody = table.getElementsByTagName('tbody')[0];
//     if (!tableBody) {
//         tableBody = document.createElement('tbody');
//         table.appendChild(tableBody);
//     }



//     tableBody.innerHTML = ''; // Clear existing rows

//     let deviceList = [];
//     let citySet = new Set(); // ✅ moved here




//     // ............              .....                   .....             ....    ... 
//     if (details) {
//         ['cameras', 'archivers', 'controllers', 'servers'].forEach(deviceType => {
//             details[deviceType]?.forEach(device => {

//                 if (device.city) {
//                     citySet.add(device.city); // ✅ now this works
//                 }

//                 const deviceIp = device.ip_address;
//                 const safeIp = sanitizeId(deviceIp);
//                 const deviceName = device[deviceType.slice(0, -1) + 'name'];
//                 const deviceCategory = deviceType.slice(0, -1).toUpperCase();

//                 const deviceHistory = historyData[deviceIp] || [];
//                 const lastStatusEntry = deviceHistory.length > 0 ? deviceHistory[deviceHistory.length - 1] : null;
//                 const currentStatus = lastStatusEntry ? lastStatusEntry.status : "Unknown";

//                 // Calculate downtime count
//                 let downtimeCount = deviceHistory.filter(entry => entry.status === "Offline").length;

//                 deviceList.push({
//                     deviceIp,
//                     safeIp,
//                     deviceName,
//                     deviceCategory,
//                     currentStatus,
//                     deviceHistory,
//                     downtimeCount
//                 });
//             });
//         });



//         deviceList.sort((a, b) => {
//             const now = Date.now();

//             const aLast = a.deviceHistory[a.deviceHistory.length - 1];
//             const bLast = b.deviceHistory[b.deviceHistory.length - 1];

//             const aIsOffline = aLast?.status === "Offline";
//             const bIsOffline = bLast?.status === "Offline";

//             const aOfflineDuration = aIsOffline ? (now - new Date(aLast.timestamp)) / 1000 : 0;
//             const bOfflineDuration = bIsOffline ? (now - new Date(bLast.timestamp)) / 1000 : 0;

//             const aShouldPrioritize = aIsOffline && aOfflineDuration >= 300;
//             const bShouldPrioritize = bIsOffline && bOfflineDuration >= 300;

//             if (aShouldPrioritize && !bShouldPrioritize) return -1;
//             if (!aShouldPrioritize && bShouldPrioritize) return 1;

//             return b.downtimeCount - a.downtimeCount;
//         });





//         deviceList.forEach(({ deviceIp, safeIp, deviceName, deviceCategory, currentStatus, deviceHistory, downtimeCount }, index) => {
//             const row = tableBody.insertRow();
//             row.style.border = "1px solid black";

//             // row.innerHTML = `
//             //     <td>${index + 1}</td>
//             //     <td>${deviceIp}</td>
//             //     <td>${deviceName}</td>
//             //     <td>${deviceCategory}</td>
//             //     <td id="uptime-${safeIp}">0h/0m/0s</td>
//             //     <td id="downtime-count-${safeIp}">${downtimeCount}</td>
//             //     <td id="downtime-${safeIp}">0h/0m/0s</td>
//             //     <td><button class="history-btn" onclick="openDeviceHistory('${deviceIp}', '${deviceName}')">View History</button></td>
//             //     <td id="remark-${safeIp}">Device working properly</td>
//             // `;

//             row.innerHTML = `
//     <td>${index + 1}</td>
//     <td>
//         <span id="ip-${safeIp}" class="copy-text" onclick="copyToClipboard('ip-${safeIp}')">${deviceIp}</span>
//     </td>
//     <td>
//         <span id="name-${safeIp}" class="copy-text" onclick="copyToClipboard('name-${safeIp}')">${deviceName}</span>
//     </td>
//     <td>${deviceCategory}</td>
//     <td id="uptime-${safeIp}">0h/0m/0s</td>
//     <td id="downtime-count-${safeIp}">${downtimeCount}</td>
//     <td id="downtime-${safeIp}">0h/0m/0s</td>
//     <td><button class="history-btn" onclick="openDeviceHistory('${deviceIp}', '${deviceName}')">View History</button></td>
//     <td id="remark-${safeIp}">Device working properly</td>
// `;



//             row.classList.remove('status-online', 'status-offline', 'status-unknown');
//             if (currentStatus === "Online") {
//                 row.classList.add('status-online');
//             } else if (currentStatus === "Offline") {
//                 row.classList.add('status-offline');
//             } else {
//                 row.classList.add('status-unknown');
//             }

//             // .....

//             if (currentStatus === "Online") {
//                 startUptime(deviceIp, deviceHistory);
//             } else {
//                 startDowntime(deviceIp, deviceHistory, deviceCategory);
//             }

//             // Automatically update remark for each row based on downtime and status
//             updateRemarks(deviceIp, deviceHistory, deviceCategory);
//         });
//     } else {
//         console.error('No details found in the response');
//     }

//     filterData();
// }



// function startUptime(ip, hist) {
//     const safe = sanitizeId(ip);
//     clearInterval(deviceDowntimeTimers[safe]);
//     const lastOn = hist.filter(e => e.status === 'Online').pop();
//     if (!lastOn) return;
//     const start = new Date(lastOn.timestamp).getTime();
//     deviceUptimeTimers[safe] = setInterval(() => {
//         const secs = Math.floor((Date.now() - start) / 1000);
//         const el = document.getElementById(`uptime-${safe}`);
//         if (el) el.innerText = formatDuration(secs);
//     }, 1000);
// }



// function startDowntime(deviceIp, history, deviceCategory) {
//     const safeIp = sanitizeId(deviceIp);
//     clearInterval(deviceUptimeTimers[safeIp]);
//     let lastOfflineEntry = history.filter(entry => entry.status === "Offline").pop();
//     if (!lastOfflineEntry) return;

//     let startTime = new Date(lastOfflineEntry.timestamp).getTime();
//     deviceDowntimeTimers[safeIp] = setInterval(() => {
//         let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
//         document.getElementById(`downtime-${safeIp}`).innerText = formatDuration(elapsedTime);
//         updateDowntimeCount(deviceIp, history, deviceCategory);
//     }, 1000);
// }

// // **Fix Downtime Count and Remarks Update (with offline short‑circuit)**
// function updateDowntimeCount(deviceIp, history, deviceCategory) {
//     const safeIp = sanitizeId(deviceIp);

//     // If the last status is Offline, force remark and exit
//     const lastStatus = history.length > 0 ? history[history.length - 1].status : "Unknown";
//     let remarkElement = document.getElementById(`remark-${safeIp}`);
//     if (lastStatus === "Offline" && remarkElement) {
//         remarkElement.innerText = "Device is Offline.";
//         // Still update the count, but skip the "Device is Online" logic
//         let downtimeEntries = history.filter(entry => entry.status === "Offline");
//         let filteredDowntimeEntries = downtimeEntries.filter((entry, index, arr) => {
//             if (deviceCategory === "SERVER") return true;
//             if (index === 0) return true;
//             let previousEntry = arr[index - 1];
//             let duration = (new Date(entry.timestamp) - new Date(previousEntry.timestamp)) / 1000;
//             return duration >= 300;
//         });
//         document.getElementById(`downtime-count-${safeIp}`).innerText = filteredDowntimeEntries.length;
//         return;
//     }

//     // Otherwise, run the existing logic:
//     let downtimeEntries = history.filter(entry => entry.status === "Offline");

//     // Only count downtimes that last more than 5 minutes, except for servers
//     let filteredDowntimeEntries = downtimeEntries.filter((entry, index, arr) => {
//         if (deviceCategory === "SERVER") return true;
//         if (index === 0) return true;
//         let previousEntry = arr[index - 1];
//         let duration = (new Date(entry.timestamp) - new Date(previousEntry.timestamp)) / 1000;
//         return duration >= 300;
//     });

//     let downtimeCount = filteredDowntimeEntries.length;
//     let downtimeElement = document.getElementById(`downtime-count-${safeIp}`);
//     if (downtimeElement) downtimeElement.innerText = downtimeCount;

//     // Update remarks based on downtime count (for Online devices)
//     if (remarkElement) {
//         if (downtimeCount === 0) {
//             remarkElement.innerText = "Device is Online.";
//         } else if (downtimeCount >= 15) {
//             remarkElement.innerText = `Device is Online, but it had ${downtimeCount} offline occurrences. Needs repair!`;
//         } else {
//             remarkElement.innerText = `Device is Online, but it had ${downtimeCount} offline occurrences.`;
//         }
//     }
// }

// function updateRemarks(deviceIp, history, deviceCategory) {
//     const safeIp = sanitizeId(deviceIp);
//     let downtimeEntries = history.filter(entry => entry.status === "Offline");

//     // Filter downtimes that lasted more than 5 minutes (except for servers)
//     let filteredDowntimeEntries = downtimeEntries.filter((entry, index, arr) => {
//         if (deviceCategory === "SERVER") return true;
//         if (index === 0) return true;
//         let previousEntry = arr[index - 1];
//         let duration = (new Date(entry.timestamp) - new Date(previousEntry.timestamp)) / 1000;
//         return duration >= 300;
//     });

//     let downtimeCount = filteredDowntimeEntries.length;
//     let lastStatus = history.length > 0 ? history[history.length - 1].status : "Unknown";
//     let remarkElement = document.getElementById(`remark-${safeIp}`);

//     // Calculate total offline duration
//     let totalOfflineTime = 0;
//     let lastOfflineTime = null;
//     history.forEach(entry => {
//         if (entry.status === "Offline") {
//             if (!lastOfflineTime) lastOfflineTime = new Date(entry.timestamp);
//         } else if (entry.status === "Online" && lastOfflineTime) {
//             totalOfflineTime += (new Date(entry.timestamp) - lastOfflineTime) / 1000;
//             lastOfflineTime = null;
//         }
//     });
//     if (lastOfflineTime) {
//         totalOfflineTime += (new Date() - lastOfflineTime) / 1000;
//     }
//     let totalOfflineDays = Math.floor(totalOfflineTime / 86400);

//     let needsRepair = downtimeCount >= 15 || totalOfflineDays >= 1;


//     if (remarkElement) {
//         if (lastStatus === "Offline") {
//             remarkElement.innerText = needsRepair ? "Device is Offline, needs repair." : "Device is Offline.";
//             remarkElement.style.color = needsRepair ? "#c62828" : "#e65100";
//         } else if (lastStatus === "Online") {
//             if (needsRepair) {
//                 remarkElement.innerText = "Device is Online, needs repair.";
//                 remarkElement.style.color = "#e65100";
//             } else if (downtimeCount > 0) {
//                 remarkElement.innerText = `Device is Online, it had ${downtimeCount} downtime occurrences.`;
//                 remarkElement.style.color = "#f9a825";
//             } else {
//                 remarkElement.innerText = "Device is Online.";
//                 remarkElement.style.color = "#2e7d32";
//             }
//         } else {
//             remarkElement.innerText = "Device status unknown.";
//             remarkElement.style.color = "#6d6d6d";
//         }
//     }

//     let downtimeElement = document.getElementById(`downtime-count-${safeIp}`);
//     if (downtimeElement) downtimeElement.innerText = downtimeCount;
// }

// // **Updated function to format duration properly**
// function formatDuration(seconds) {
//     let days = Math.floor(seconds / 86400);
//     let hours = Math.floor((seconds % 86400) / 3600);
//     let minutes = Math.floor((seconds % 3600) / 60);
//     let secs = Math.round(seconds % 60);

//     let result = [];
//     if (days > 0) result.push(`${days}d`);
//     if (hours > 0) result.push(`${hours}h`);
//     if (minutes > 0) result.push(`${minutes}m`);
//     if (secs > 0 || result.length === 0) result.push(`${secs}s`);

//     return result.join('/');
// }

// function openDeviceHistory(deviceIp, deviceName) {
//     if (!window.deviceHistoryData) {
//         console.error("Device history data not loaded.");
//         return;
//     }
//     const history = window.deviceHistoryData[deviceIp] || [];
//     displayDeviceHistory(deviceIp, deviceName, history);
//     document.getElementById('device-history-modal').style.display = 'block';
// }

// function calculateDowntimeDuration(timestamp, history) {
//     let downtimeStart = new Date(timestamp).getTime();
//     let nextOnlineEntry = history.find(entry =>
//         entry.status === "Online" && new Date(entry.timestamp).getTime() > downtimeStart
//     );
//     if (nextOnlineEntry) {
//         let downtimeEnd = new Date(nextOnlineEntry.timestamp).getTime();
//         let durationInSeconds = (downtimeEnd - downtimeStart) / 1000;
//         return formatDuration(durationInSeconds);
//     }
//     let durationInSeconds = (Date.now() - downtimeStart) / 1000;
//     return formatDuration(durationInSeconds);
// }

// function displayDeviceHistory(deviceIp, deviceName, history) {
//     const modalHeader = document.getElementById('device-history-header');
//     const historyContainer = document.getElementById('device-history');
//     modalHeader.innerHTML = `
//         <h3>Device History</h3>
//         <p><strong>Device Name:</strong> ${deviceName}</p>
//         <p><strong>Device IP:</strong> ${deviceIp}</p>
//         <hr>
//     `;
//     historyContainer.innerHTML = '';
//     if (history.length === 0) {
//         historyContainer.innerHTML = `<p>No history available for this device.</p>`;
//         return;
//     }
//     let tableHTML = `
//         <table border="1" style="width:100%; text-align:center; border-collapse: collapse;">
//             <thead>
//                 <tr>
//                     <th>Sr.No</th>
//                     <th>Date</th>
//                     <th>Day</th>
//                     <th>Time</th>
//                     <th>Status</th>
//                     <th>Downtime Duration</th>
//                 </tr>
//             </thead>
//             <tbody>
//     `;
//     let lastOfflineTimestamp = null;
//     history.forEach((entry, index) => {
//         let entryDate = new Date(entry.timestamp);
//         let formattedDate = entryDate.toLocaleDateString();
//         let formattedTime = entryDate.toLocaleTimeString();
//         let formattedDay = entryDate.toLocaleString('en-US', { weekday: 'long' });
//         let downtimeDuration = "-";
//         if (entry.status === "Offline") {
//             lastOfflineTimestamp = entry.timestamp;
//         } else if (entry.status === "Online" && lastOfflineTimestamp) {
//             downtimeDuration = calculateDowntimeDuration(lastOfflineTimestamp, history);
//             lastOfflineTimestamp = null;
//         }
//         tableHTML += `
//             <tr>
//                 <td>${index + 1}</td>
//                 <td>${formattedDate}</td>
//                 <td>${formattedDay}</td>
//                 <td>${formattedTime}</td>
//                 <td style="color: ${entry.status === "Online" ? 'green' : 'red'};">${entry.status}</td>
//                 <td>${downtimeDuration}</td>
//             </tr>
//         `;
//     });
//     tableHTML += `</tbody></table>`;
//     // historyContainer.innerHTML = tableHTML;
//     historyContainer.innerHTML = `
//     <div class="scrollable-history-table">
//         ${tableHTML}
//     </div>
// `;
// }

// function closeHistoryModal() {
//     document.getElementById('device-history-modal').style.display = 'none';
// }

// function exportDeviceTableToExcel() {
//     const table = document.getElementById("device-table");
//     const workbook = XLSX.utils.table_to_book(table, { sheet: "Device Table" });
//     XLSX.writeFile(workbook, "Device_Table.xlsx");
// }

// function exportDeviceHistoryToExcel() {
//     const historyTable = document.querySelector("#device-history-modal table");
//     if (!historyTable) {
//         alert("Please open a device's history first.");
//         return;
//     }
//     const workbook = XLSX.utils.table_to_book(historyTable, { sheet: "Device History" });
//     XLSX.writeFile(workbook, "Device_History.xlsx");
// }


// function filterData() {
//     const selectedType = document.getElementById('device-type').value.toUpperCase();
//     const selectedRemark = document.getElementById('remark-filter').value.toUpperCase();
//     const searchText = document.getElementById('search-input').value.toUpperCase().trim();

//     const table = document.getElementById('device-table');
//     const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

//     for (let row of rows) {
//         const type = row.cells[3].textContent.toUpperCase(); // Device type
//         const remark = row.cells[8].textContent.toUpperCase(); // Remark
//         const ip = row.cells[1].textContent.toUpperCase(); // IP
//         const name = row.cells[2].textContent.toUpperCase(); // Device name (location)
//         const city = name.split(',').pop().trim(); // Optional: parse city if included in name

//         const matchesType = selectedType === "ALL" || type === selectedType;
//         const matchesRemark = selectedRemark === "ALL" || remark.includes(selectedRemark);

//         const matchesSearch = (
//             ip.includes(searchText) ||
//             name.includes(searchText) ||
//             city.includes(searchText)
//         );

//         row.style.display = (matchesType && matchesRemark && matchesSearch) ? "" : "none";
//     }
// }

// function populateCityFilter(cities) {
//     const cityFilter = document.getElementById('city-filter');
//     cityFilter.innerHTML = `<option value="all">All Cities</option>`;
//     cities.forEach(city => {
//         const option = document.createElement('option');
//         option.value = city;
//         option.textContent = city;
//         cityFilter.appendChild(option);
//     });
// }

// document.addEventListener("DOMContentLoaded", function () {
//     document.getElementById('region').addEventListener('change', fetchDeviceData);
//     // Automatically filter when dropdowns change
//     document.getElementById('device-type').addEventListener('change', filterData);
//     document.getElementById('remark-filter').addEventListener('change', filterData);
//     fetchDeviceData(); // Initial load
// });

// document.getElementById('search-input').addEventListener('input', filterData);

// function showToast(message) {
//     const toast = document.getElementById("toast");
//     toast.textContent = message;
//     toast.className = "toast show";
//     setTimeout(() => {
//         toast.className = toast.className.replace("show", "");
//     }, 2500);
// }

// function copyToClipboard(elementId) {
//     const text = document.getElementById(elementId)?.innerText;
//     if (text) {
//         navigator.clipboard.writeText(text)
//             .then(() => showToast(`Copied: ${text}`))
//             .catch(err => console.error("Failed to copy:", err));
//     }
// }


// // ******************************************************************







// C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\trend.js

// let deviceUptimeTimers = {};
// let deviceDowntimeTimers = {};

// // Utility to turn an IP (or any string) into a safe DOM-ID fragment
// function sanitizeId(str) {
//   return (str || '').replace(/[^a-zA-Z0-9]/g, '_');
// }

// function fetchDeviceData() {
//   const region = document.getElementById('region').value;
//   fetch(`http://localhost/api/regions/details/${region}`)
//     .then(r => r.json())
//     .then(d => fetchDeviceHistory(d.details))
//     .catch(console.error);
// }

// function fetchDeviceHistory(details) {
//   fetch(`http://localhost/api/devices/history`)
//     .then(r => r.json())
//     .then(historyData => {
//       populateDeviceTable(details, historyData);
//       window.deviceHistoryData = historyData;
//     })
//     .catch(console.error);
// }

// function populateDeviceTable(details, historyData) {
//   const tbody = document.querySelector('#device-table tbody');
//   tbody.innerHTML = '';

//   const devices = [];
//   ['cameras','archivers','controllers','servers'].forEach(type => {
//     (details[type] || []).forEach(dev => {
//       const ip        = dev.ip_address;
//       const safe      = sanitizeId(ip);
//       const name      = dev[type.slice(0,-1) + 'name'] || 'Unknown';
//       const category  = type.slice(0,-1).toUpperCase();
//       const rawHist   = historyData[ip] || [];
//       const hist      = filterHistoryForDisplay(rawHist, category);
//       const lastRaw   = rawHist[rawHist.length-1]?.status || 'Unknown';
//       // if last raw Offline but <5min, treat Online
//       let status = lastRaw;
//       if (lastRaw === 'Offline' && ((Date.now() - new Date(rawHist[rawHist.length-1].timestamp)) / 1000) < 300) {
//         status = 'Online';
//       }
//       const downCount = hist.filter(e => e.status === 'Offline').length;

//       devices.push({ ip, safe, name, category, rawHist, hist, status, downCount });
//     });
//   });

//   // sort by ongoing ≥5min offline first, then by downCount desc
//   devices.sort((a,b) => {
//     const now = Date.now();
//     const aLast = a.hist[a.hist.length-1], bLast = b.hist[b.hist.length-1];
//     const aOff  = aLast?.status==='Offline' ? (now-new Date(aLast.timestamp))/1000 : 0;
//     const bOff  = bLast?.status==='Offline' ? (now-new Date(bLast.timestamp))/1000 : 0;
//     if ((aOff>=300) !== (bOff>=300)) return aOff>=300 ? -1 : 1;
//     return b.downCount - a.downCount;
//   });

//   devices.forEach((d,i) => {
//     const row = tbody.insertRow();
//     row.classList.add(d.status==='Online' ? 'status-online' : 'status-offline');
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
//     if (d.status === 'Online') startUptime(d.ip, d.hist);
//     else startDowntime(d.ip, d.hist);

//     updateRemarks(d.ip, d.hist, d.status, d.downCount);
//   });

//   filterData();
// }

// function filterHistoryForDisplay(hist, category) {
//   if (category === 'SERVER') return hist.slice();

//   const out = [];
//   let lastOff = null;
//   hist.forEach(e => {
//     if (e.status === 'Offline') lastOff = e;
//     else if (e.status === 'Online' && lastOff) {
//       const diff = (new Date(e.timestamp) - new Date(lastOff.timestamp)) / 1000;
//       if (diff >= 300) out.push(lastOff, e);
//       lastOff = null;
//     }
//   });
//   if (lastOff) {
//     const diff = (Date.now() - new Date(lastOff.timestamp)) / 1000;
//     if (diff >= 300) out.push(lastOff);
//   }
//   return out.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
// }

// function startUptime(ip, hist) {
//   const safe = sanitizeId(ip);
//   clearInterval(deviceDowntimeTimers[safe]);
//   const on = hist.filter(e => e.status==='Online').pop();
//   if (!on) return;
//   const t0 = new Date(on.timestamp).getTime();
//   deviceUptimeTimers[safe] = setInterval(() => {
//     document.getElementById(`uptime-${safe}`).innerText = formatDuration(Math.floor((Date.now()-t0)/1000));
//   }, 1000);
// }

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

// function updateRemarks(ip, hist, forcedStatus, forcedCount) {
//   const safe = sanitizeId(ip);
//   // Determine status
//   let status = forcedStatus;
//   if (!status) {
//     const last = hist[hist.length-1]?.status || 'Unknown';
//     status = last==='Offline' && ((Date.now()-new Date(hist[hist.length-1].timestamp))/1000)<300
//       ? 'Online' : last;
//   }
//   const count = forcedCount ?? hist.filter(e => e.status==='Offline').length;
//   const el = document.getElementById(`remark-${safe}`);
//   if (!el) return;
//   if (status === 'Offline') {
//     el.innerText = count>0 ? 'Device is Offline, needs check.' : 'Device is Offline.';
//   } else if (status === 'Online') {
//     el.innerText = count>0
//       ? `Device is Online, had ${count} downtime events ≥5 min.`
//       : 'Device is Online.';
//   } else {
//     el.innerText = 'Device status unknown.';
//   }
// }

// function formatDuration(sec) {
//   const d = Math.floor(sec/86400), h = Math.floor((sec%86400)/3600),
//         m = Math.floor((sec%3600)/60), s = Math.round(sec%60);
//   const parts = [];
//   if (d) parts.push(`${d}d`);
//   if (h) parts.push(`${h}h`);
//   if (m) parts.push(`${m}m`);
//   if (s||!parts.length) parts.push(`${s}s`);
//   return parts.join('/');
// }

// function openDeviceHistory(ip, name, category) {
//   const raw = window.deviceHistoryData[ip] || [];
//   const hist = filterHistoryForDisplay(raw, category);
//   displayDeviceHistory(ip, name, category, hist);
//   document.getElementById('device-history-modal').style.display = 'block';
// }

// function displayDeviceHistory(ip, name, category, hist) {
//   const header = document.getElementById('device-history-header');
//   const container = document.getElementById('device-history');
//   header.innerHTML = `<h3>${name} (${ip})</h3><hr>`;
//   if (!hist.length) {
//     container.innerHTML = '<p>No downtime ≥5 min in history.</p>';
//     return;
//   }
//   let html = `<table border="1" style="width:100%;text-align:center;border-collapse:collapse;">
//     <thead><tr>
//       <th>#</th><th>Date</th><th>Day</th><th>Time</th><th>Status</th><th>Duration</th>
//     </tr></thead><tbody>`;
//   let idx = 1, lastOff = null;
//   hist.forEach(e => {
//     const t = new Date(e.timestamp);
//     const date = t.toLocaleDateString();
//     const day = t.toLocaleString('en-US',{weekday:'long'});
//     const time = t.toLocaleTimeString();
//     let dur = '-';
//     if (e.status==='Offline') lastOff = e.timestamp;
//     else if (e.status==='Online' && lastOff) {
//       const diff = (new Date(e.timestamp)-new Date(lastOff))/1000;
//       if (diff>=300) dur = formatDuration(diff);
//       lastOff = null;
//     }
//     html += `<tr>
//       <td>${idx++}</td><td>${date}</td><td>${day}</td><td>${time}</td>
//       <td style="color:${e.status==='Online'?'green':'red'}">${e.status}</td>
//       <td>${dur}</td>
//     </tr>`;
//   });
//   html += `</tbody></table>`;
//   container.innerHTML = `<div class="scrollable-history-table">${html}</div>`;
// }

// function closeHistoryModal() {
//   document.getElementById('device-history-modal').style.display = 'none';
// }

// function filterData() {
//   const typeSel   = document.getElementById('device-type').value.toUpperCase();
//   const remarkSel = document.getElementById('remark-filter').value.toUpperCase();
//   const searchTxt = document.getElementById('search-input').value.toUpperCase();
//   document.querySelectorAll('#device-table tbody tr').forEach(r => {
//     const type   = r.cells[3].textContent.toUpperCase();
//     const remark = r.cells[8].textContent.toUpperCase();
//     const ip     = r.cells[1].textContent.toUpperCase();
//     const name   = r.cells[2].textContent.toUpperCase();
//     const show   = (typeSel==='ALL'||type===typeSel)
//                  && (remarkSel==='ALL'||remark.includes(remarkSel))
//                  && (ip.includes(searchTxt)||name.includes(searchTxt));
//     r.style.display = show ? '' : 'none';
//   });
// }

// function copyToClipboard(id) {
//   const t = document.getElementById(id)?.innerText;
//   if (t) navigator.clipboard.writeText(t);
// }

// document.addEventListener('DOMContentLoaded', () => {
//   ['region','device-type','remark-filter'].forEach(id => {
//     document.getElementById(id)?.addEventListener('change', id==='region'?fetchDeviceData:filterData);
//   });
//   document.getElementById('search-input')?.addEventListener('input', filterData);
//   fetchDeviceData();
// });





// ************************
// ************************



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


// document.addEventListener('DOMContentLoaded', () => {
//   ['region', 'device-type', 'remark-filter'].forEach(id => {
//     document.getElementById(id)?.addEventListener('change', id === 'region' ? fetchDeviceData : filterData);
//   });

//   document.getElementById('search-input')?.addEventListener('input', filterData);

//   // ✅ Add cityFilter event
//   document.getElementById('cityFilter')?.addEventListener('change', filterData);

//   fetchDeviceData();
// });


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
