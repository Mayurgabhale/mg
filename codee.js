
ok, now i want to show 
totla device, 
Offline camers:
Offline controller:
alik ok 
and count of offline ok in tooltip ok,, 
// new
// ========== INITIALIZE EVERYTHING ==========
function initializeChartSystem() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initOfflineChart();
      initOfflineCityBarChart();   // ✅ ADD THIS
      setupThemeObserver();
    });
  } else {
    initOfflineChart();
    initOfflineCityBarChart();     // ✅ ADD THIS
    setupThemeObserver();
  }
}

// Initialize the chart system
initializeChartSystem();

// ========== YOUR EXISTING FUNCTION ==========
// function renderOfflineChartFromCombined(combinedDevices) {
//   const offlineDevices = combinedDevices
//     .filter(d => d.device.status === "offline")
//     .map(d => ({
//       device: d.device,
//       type: d.device.type
//     }));

//   updateOfflineChart(offlineDevices);
// }

function renderOfflineChartFromCombined(combinedDevices) {
  const offlineDevices = combinedDevices
    .filter(d => d.device.status === "offline")
    .map(d => ({
      device: d.device,
      type: d.device.type
    }));

  updateOfflineChart(offlineDevices);

  // ✅ ADD BAR CHART UPDATE HERE
  updateOfflineCityBarChart(combinedDevices);
}

// ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️


// ---------------- START: robust Offline City BAR chart ----------------
let offlineCityBarChart = null;

/**
 * Get colors: prefer the file-level getChartColors() if present,
 * otherwise fall back to safe defaults.
 */
function getBarColors() {
  if (typeof getChartColors === 'function') {
    const c = getChartColors();
    return {
      bar: c.camera || c.bar || '#d32f2f',
      text: c.text || '#e6eef7',
      grid: c.grid || 'rgba(0,0,0,0.08)'
    };
  }
  const isDark = document.body.classList.contains("dark-mode");
  return {
    bar: isDark ? "#ff5252" : "#d32f2f",
    text: isDark ? "#ffffff" : "#333333",
    grid: isDark ? "#444" : "#ddd"
  };
}

/**
 * Build labels & values from combinedDevices (counts only offline devices).
 * Returns { labels: [], values: [] }.
 */
// function buildOfflineCityBarData(combinedDevices = []) {
//   const cityCounts = {};

//   if (!Array.isArray(combinedDevices)) {
//     console.warn('buildOfflineCityBarData: combinedDevices is not an array');
//     return { labels: [], values: [] };
//   }

//   combinedDevices.forEach(d => {
//     if (!d || !d.device) return;
//     if ((d.device.status || '').toString().toLowerCase() !== 'offline') return;

//     const city = (d.device.city || 'Unknown').toString();
//     cityCounts[city] = (cityCounts[city] || 0) + 1;
//   });

//   // Sort by count descending so chart is useful (optional but recommended)
//   const entries = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);

//   const labels = entries.map(e => e[0]);
//   const values = entries.map(e => e[1]);

//   return { labels, values };
// }

// Counts ALL devices per city (not only offline). Expects combinedDevices = [{ device: {...} }, ...]
function buildOfflineCityBarData(combinedDevices = []) {
  const cityCounts = {};

  if (!Array.isArray(combinedDevices)) return { labels: [], values: [] };

  combinedDevices.forEach(entry => {
    if (!entry || !entry.device) return;

    // Count every device regardless of status
    const city = (entry.device.city || "Unknown").toString();

    cityCounts[city] = (cityCounts[city] || 0) + 1;
  });

  // Sort by count descending (useful for charts)
  const entries = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);

  const labels = entries.map(e => e[0]);
  const values = entries.map(e => e[1]);

  return { labels, values };
}

/**
 * Initialize bar chart (creates a placeholder chart even if no data yet).
 * Safe to call multiple times.
 */
function initOfflineCityBarChart() {
  // Chart.js must be loaded
  if (typeof Chart === 'undefined') {
    console.warn('initOfflineCityBarChart: Chart.js not loaded. Include Chart.js before graph.js.');
    return;
  }

  const canvas = document.getElementById("OfflineCityBarChart");
  if (!canvas) {
    console.warn('initOfflineCityBarChart: #OfflineCityBarChart canvas not found in DOM yet.');
    return;
  }

  // If already initialized, don't recreate
  if (offlineCityBarChart) return;

  const ctx = canvas.getContext("2d");
  const colors = getBarColors();

  offlineCityBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ['No Data'],
      datasets: [{
        label: "Offline Devices",
        data: [0],
        backgroundColor: ['#8a8a8a'], // placeholder grey
        borderRadius: 8,
        barThickness: 35
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: colors.text } }
      },
      scales: {
        x: {
          ticks: { color: colors.text, maxRotation: 30, minRotation: 30 },
          grid: { color: colors.grid }
        },
        y: {
          beginAtZero: true,
          ticks: { color: colors.text },
          grid: { color: colors.grid }
        }
      }
    }
  });

  console.debug('initOfflineCityBarChart: chart created (placeholder).');
}

/**
 * Update the bar chart with real data.
 * If chart is not initialized yet, try to initialize it.
 */
function updateOfflineCityBarChart(combinedDevices) {
  // Create chart if not present yet
  if (!offlineCityBarChart) {
    initOfflineCityBarChart();
    // If still not present, abort
    if (!offlineCityBarChart) {
      console.warn('updateOfflineCityBarChart: chart not initialized (canvas missing or Chart.js not loaded).');
      return;
    }
  }

  const colors = getBarColors();
  const { labels, values } = buildOfflineCityBarData(combinedDevices);

  if (!labels || labels.length === 0) {
    // No data → show placeholder
    offlineCityBarChart.data.labels = ['No Offline Devices'];
    offlineCityBarChart.data.datasets[0].data = [0];
    offlineCityBarChart.data.datasets[0].backgroundColor = ['#8a8a8a'];
    offlineCityBarChart.update();
    console.debug('updateOfflineCityBarChart: no offline devices found.');
    return;
  }

  // Set bars (color per bar could be changed to a palette if desired)
  offlineCityBarChart.data.labels = labels;
  offlineCityBarChart.data.datasets[0].data = values;
  offlineCityBarChart.data.datasets[0].backgroundColor = labels.map(() => colors.bar);

  offlineCityBarChart.update();
  console.debug('updateOfflineCityBarChart: updated with', labels.length, 'cities.');
}

/**
 * initializeChartSystem: ensure bar init is called in the same place you init scatter chart.
 * Replace your previous initializeChartSystem with this final version if needed.
 * (You already added initOfflineCityBarChart there — keep it.)
 */
function ensureBarInitOnDomReady() {
  // Call this from the same DOMContentLoaded area you already use.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initOfflineCityBarChart();
    });
  } else {
    initOfflineCityBarChart();
  }
}

// Call the ensure function just in case (harmless if already initialized)
ensureBarInitOnDomReady();

// ---------------- END: robust Offline City BAR chart ----------------

chekc allso this code
// C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\script.js
// const baseUrl = "http://localhost:80/api/regions";
const baseUrl = "http://10.138.161.4:3000/api/regions";
let refreshInterval = 300000; // 5 minutes
let pingInterval = 60000; // 30 seconds
let countdownTime = refreshInterval / 1000; // Convert to seconds
let currentRegion = "global";
let deviceDetailsCache = {}; // Store previous details to prevent redundant updates
let latestDetails = null; // Cache the latest fetched details




// Controller cache (populated inside fetchData)
window.controllerDataCached = null; // <-- ADDED: global cache for controllers

document.addEventListener("DOMContentLoaded", () => {
    // ⬇️⬇️ this is call from graph.js
    initOfflineChart();
    // ensure bar chart is also created (safe to call even if already initialized)
    if (typeof initOfflineCityBarChart === "function") {
      try { initOfflineCityBarChart(); } catch(e){ console.warn("initOfflineCityBarChart failed:", e); }
    }
    fetchData("global"); // Load initial data
    startAutoRefresh("global");



    // Attach Door click
    const doorCard = document.getElementById("door-card");
    if (doorCard) {
        doorCard.style.cursor = "pointer";
        doorCard.title = "Click to view Controllers";
        doorCard.addEventListener("click", loadControllersInDetails);
    }


    document.querySelectorAll(".region-button").forEach((button) => {
        button.addEventListener("click", () => {
            const region = button.getAttribute("data-region");
            document.getElementById("region-title").textContent = `${region.toUpperCase()} Summary`;
            switchRegion(region);
        });
    });

    document.getElementById("close-modal").addEventListener("click", () => {
        document.getElementById("modal").style.display = "none";
    });


    // ---------------------------
    // NEW: Summary card click/dblclick filter behavior
    // Single click: set device-filter to that type and trigger change (show only that type)
    // Double click: set device-filter to 'all' and trigger change (show all)
    // ---------------------------

    (function attachSummaryCardFilterHandlers() {
        const summaryCards = document.querySelectorAll(".summary .card");
        if (!summaryCards || summaryCards.length === 0) return;

        // helper: derive deviceFilter value from card title text
        function mapCardTitleToFilterValue(title) {
            if (!title) return "all";
            const t = title.toLowerCase();

            if (t.includes("camera")) return "cameras";
            if (t.includes("archiver")) return "archivers";
            if (t.includes("controller")) return "controllers";
            if (t.includes("ccure")) return "servers";       // CCURE servers
            if (t.includes("db")) return "dbdetails";        // DB servers
            if (t.includes("desktop")) return "pcdetails";
            if (t.includes("total")) return "all";

            return "all";
        }

        document.addEventListener("DOMContentLoaded", () => {
            const doorCard = document.getElementById("door-card");
            if (doorCard) {
                doorCard.style.cursor = "pointer";
                doorCard.title = "Click to view Controllers";
                doorCard.addEventListener("click", loadControllersInDetails);
            }
        });



        summaryCards.forEach((card) => {
            // make interactive
            card.style.cursor = "pointer";

            let clickTimer = null;
            const clickDelay = 100; // ms


            card.addEventListener("click", (ev) => {
                if (clickTimer) clearTimeout(clickTimer);
                clickTimer = setTimeout(() => {
                    const h3 = card.querySelector("h3");
                    const titleText = h3 ? h3.innerText.trim() : card.innerText.trim();
                    const filterValue = mapCardTitleToFilterValue(titleText);

                    const deviceFilterElem = document.getElementById("device-filter");
                    if (!deviceFilterElem) return;

                    deviceFilterElem.value = filterValue;
                    deviceFilterElem.dispatchEvent(new Event("change", { bubbles: true }));

                    // 🔥 Highlight clicked card, remove from others
                    document.querySelectorAll(".summary .card").forEach(c => c.classList.remove("active"));
                    if (filterValue !== "all") {
                        card.classList.add("active");
                    }
                }, clickDelay);
            });

            card.addEventListener("dblclick", (ev) => {
                if (clickTimer) {
                    clearTimeout(clickTimer);
                    clickTimer = null;
                }
                const deviceFilterElem = document.getElementById("device-filter");
                if (!deviceFilterElem) return;

                deviceFilterElem.value = "all";
                deviceFilterElem.dispatchEvent(new Event("change", { bubbles: true }));

                // 🔥 Remove all highlights on double-click (reset)
                document.querySelectorAll(".summary .card").forEach(c => c.classList.remove("active"));
            });



        });
    })();



});
function updateDetails(data) {
    const detailsContainer = document.getElementById("device-details");
    const deviceFilter = document.getElementById("device-filter");
    const onlineFilterButton = document.getElementById("filter-online");
    const offlineFilterButton = document.getElementById("filter-offline");
    const allFilterButton = document.getElementById("filter-all");
    const cityFilter = document.getElementById("city-filter");



    detailsContainer.innerHTML = "";
    cityFilter.innerHTML = '<option value="all">All Cities</option>';

    let combinedDevices = [];
    let citySet = new Set();
    let vendorSet = new Set(); // collect normalized vendor values
    let typeCityMap = {}; // <-- NEW: map deviceType -> Set of cities

    // Icon utility based on device type
    function getDeviceIcon(type = "") {
        type = type.toLowerCase();
        if (type.includes("camera")) return "fas fa-video";
        if (type.includes("controller")) return "fas fa-cogs";
        if (type.includes("archiver")) return "fas fa-database";
        if (type.includes("server")) return "fas fa-server";
        if (type.includes("pc")) return "fas fa-desktop";
        if (type.includes("dbdetails")) return "fa-solid fa-life-ring";
        return "fas fa-microchip"; // fallback
    }



    // Helper to find matching controller (by IP or name)
    function findControllerForDevice(device) {
        const controllers = Array.isArray(window.controllerDataCached) ? window.controllerDataCached : null;
        const ipToMatch = (device.ip || device.ip_address || "").toString().trim();
        const nameToMatch = (device.controllername || device.controller_name || device.cameraname || "").toString().trim();

        if (controllers) {
            // Try IP match first
            if (ipToMatch) {
                const byIp = controllers.find(c => c.IP_address && c.IP_address.toString().trim() === ipToMatch);
                if (byIp) return byIp;
            }
            // Try controller name match (loose contains)
            if (nameToMatch) {
                const nameLower = nameToMatch.toLowerCase();
                const byName = controllers.find(c => (c.controllername || "").toLowerCase().includes(nameLower) || nameLower.includes((c.controllername || "").toLowerCase()));
                if (byName) return byName;
            }
            // Last resort: try city match + online status (heuristic)
            if (device.city) {
                const byCity = controllers.find(c => (c.City || "").toLowerCase() === (device.city || "").toLowerCase());
                if (byCity) return byCity;
            }
        }
        return null;
    }

    // If controllers aren't cached, we will fetch them when necessary (lazy)
    function ensureControllersCached() {
        if (Array.isArray(window.controllerDataCached)) return Promise.resolve(window.controllerDataCached);
        // return fetch("http://localhost/api/controllers/status")
        return fetch("http://10.138.161.4:3000/api/controllers/status")
            .then(res => res.json())
            .then(data => {
                window.controllerDataCached = Array.isArray(data) ? data : null;
                return window.controllerDataCached;
            })
            .catch(err => {
                console.error("Failed to fetch controllers:", err);
                return null;
            });
    }


    // Fetch real-time status if available.
    // fetch("http://localhost:80/api/region/devices/status")
    fetch("http://10.138.161.4:3000/api/region/devices/status")
        .then((response) => response.json())
        .then((realTimeStatus) => {
            console.log("Live Status Data:", realTimeStatus);

            for (const [key, devices] of Object.entries(data.details)) {
                if (!Array.isArray(devices) || devices.length === 0) continue;
                const deviceType = key.toLowerCase();

                // ensure map entry exists
                if (!typeCityMap[deviceType]) typeCityMap[deviceType] = new Set();

                devices.forEach((device) => {
                    const deviceIP = device.ip_address || "N/A";
                    let currentStatus = (realTimeStatus[deviceIP] || device.status || "offline").toLowerCase();
                    const city = device.city || "Unknown";

                    // collect city globally and per device type
                    citySet.add(city);
                    typeCityMap[deviceType].add(city);

                    // --- VENDOR: read possible fields, normalize, skip empty/unknown ---
                    // NOTE: your JSON uses the key "deviec_details" (typo) — we read that first.
                    let rawVendor = device.deviec_details || device.device_details || (device.device_details && device.device_details.vendor) || device.vendor || device.vendor_name || device.manufacturer || "";
                    rawVendor = (rawVendor || "").toString().trim();

                    // Normalize: empty -> null, otherwise uppercase for consistent set values
                    let vendorNormalized = rawVendor ? rawVendor.toUpperCase() : null;

                    // Only add real vendors (skip "UNKNOWN", "", null)
                    if (vendorNormalized && vendorNormalized !== "UNKNOWN") {
                        vendorSet.add(vendorNormalized);
                    }

                    const datasetVendorValue = vendorNormalized || "";

                    // Create card element.
                    const card = document.createElement("div");
                    card.className = "device-card";
                    card.dataset.type = deviceType;
                    card.dataset.status = currentStatus;
                    card.dataset.city = city;
                    if (datasetVendorValue) card.dataset.vendor = datasetVendorValue; // only set if valid
                    card.setAttribute("data-ip", deviceIP);

                    // Apply background color based on online/offline status (kept your placeholders)
                    card.style.backgroundColor = currentStatus === "online" ? "" : "";
                    card.style.borderColor = currentStatus === "online" ? "" : "";

                    // Create a container for status
                    const statusContainer = document.createElement("p");
                    statusContainer.className = "device-status";

                    // Status text
                    const statusText = document.createElement("span");
                    statusText.className = "status-text";
                    statusText.textContent = currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1);
                    statusText.style.color = currentStatus === "online" ? "green" : "red";

                    // Status dot
                    const statusDot = document.createElement("span");
                    statusDot.classList.add(currentStatus === "online" ? "online-dot" : "offline-dot");
                    statusDot.style.backgroundColor = (currentStatus === "online") ? "green" : "red";
                    statusDot.style.display = "inline-block";
                    statusDot.style.width = "10px";
                    statusDot.style.height = "10px";
                    statusDot.style.marginLeft = "5px";
                    statusDot.style.marginRight = "5px";
                    statusDot.style.borderRadius = "50%";

                    // Combine status parts
                    statusContainer.appendChild(statusDot);
                    statusContainer.appendChild(statusText);

                    // compute a nicer label for the device-type area
                    let deviceLabel;

                    if (deviceType === "dbdetails") {
                        // For DB Details: show the application if available, else fallback
                        deviceLabel = device.application || deviceType.toUpperCase();
                    } else if (deviceType.includes("pc")) {
                        deviceLabel = device.pc_name || device.hostname || "PC";
                    } else {
                        deviceLabel = deviceType.toUpperCase();
                    }

                    card.insertAdjacentHTML("beforeend", `
  <h3 class="device-name" style="font-size:20px; font-weight:500; font-family: PP Right Grotesk; margin-bottom: 10px;">
      ${device.cameraname || device.controllername || device.archivername || device.servername || device.hostname || "Unknown Device"}
  </h3>

  <div class="card-content">
      <p class="device-type-label ${deviceType}" 
         style="font-size:17px;  font-family: Roboto; font-weight:100; margin-bottom: 10px; display:flex; justify-content:space-between; align-items:center;">
          
          <strong>
            <i class="${getDeviceIcon(deviceType)}" style="margin-right: 5px;"></i> 
            ${deviceLabel}
          </strong>
          
          ${deviceType.includes("camera")
                            ? `<button class="open-camera-btn"
        onclick="openCamera('${deviceIP}', '${(device.cameraname || device.controllername || "").replace(/'/g, "\\'")}', '${device.hyperlink || ""}')"
        title="Open Camera"
        style="border:none; cursor:pointer; font-weight:100; border-radius:50%; width:34px; height:34px; display:flex; justify-content:center; align-items:center;">
    <img src="images/cctv.png" alt="Logo" style="width:33px; height:33px;"/>
</button>`
                            : ""
                        }
      </p>

      <p style="font-size: ;  font-family: Roboto; margin-bottom: 8px;">
          <strong style="color:rgb(8, 8, 8);"><i class="fas fa-network-wired" style="margin-right: 6px;"></i></strong>
          <span 
              class="device-ip" 
              style="font-weight:100; color: #00adb5; cursor: pointer; text-shadow: 0 0 1px rgba(0, 173, 181, 0.3);  font-family: Roboto;"
              onclick="copyToClipboard('${deviceIP}')"
              title="Click to copy IP"
          >
              ${deviceIP}
          </span>
      </p>

      <p style="font-size: ;  font-family: Roboto; margin-bottom: 6px;">
          <strong ><i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i></strong>
          <span style="font-size:; font-weight:100; margin-left: 12px;  font-family: Roboto; font-size: ;">${device.location || "N/A"}</span>
      </p>

      <p style="font-size:;  font-family: Roboto;>
          <strong "><i class="fas fa-city" style="margin-right: 5px;"></i></strong>
          <span style="font-weight:100;margin-left: 4px;  font-family: Roboto; font-size:;">${city}</span>
      </p>
  </div>
`);
                    card.appendChild(statusContainer);

                    // --- ADDED: if this is a controller card, attach click to open doors modal ---
                    if (deviceType.includes("controller")) {
                        card.style.cursor = "pointer";
                        card.title = "Click to view Doors for this controller";
                        card.setAttribute("role", "button");
                        card.setAttribute("tabindex", "0");

                        // click handler that uses cached controllers when possible
                        const openControllerDoors = async () => {
                            // try to find matching controller from cache
                            let ctrl = findControllerForDevice({ ip: deviceIP, controllername: device.controllername, city: city });
                            if (!ctrl) {
                                // ensure controllers are cached then try again
                                await ensureControllersCached();
                                ctrl = findControllerForDevice({ ip: deviceIP, controllername: device.controllername, city: city });
                            }
                            if (ctrl) {
                                showDoorsReaders(ctrl);
                            } else {
                                // fallback: open controllers list then highlight nearest by city/IP
                                loadControllersInDetails();
                                // show a quick toast/message to indicate we couldn't find exact match
                                console.warn("Controller details not found in cache for IP/name:", deviceIP, device.controllername);
                            }
                        };

                        card.addEventListener("click", (ev) => {
                            openControllerDoors();
                        });

                        // keyboard accessibility (Enter / Space)
                        card.addEventListener("keydown", (ev) => {
                            if (ev.key === "Enter" || ev.key === " ") {
                                ev.preventDefault();
                                openControllerDoors();
                            }
                        });
                    }
                    // --- END ADDED CLICK HANDLER ---

                    // --- show policy tooltip for devices marked "Not accessible" ---
                    const remarkText = (device.remark || "").toString().trim();
                    if (remarkText && /not\s+access/i.test(remarkText)) {
                        if (!card.style.position) card.style.position = "relative";

                        const tooltip = document.createElement("div");
                        tooltip.className = "device-access-tooltip";
                        tooltip.textContent = "Due to Network policy, this camera is Not accessible";

                        tooltip.style.position = "absolute";
                        tooltip.style.bottom = "100%";
                        tooltip.style.left = "8px";
                        tooltip.style.padding = "6px 8px";
                        tooltip.style.background = "rgba(0,0,0,0.85)";
                        tooltip.style.color = "#fff";
                        tooltip.style.borderRadius = "4px";
                        tooltip.style.fontSize = "12px";
                        tooltip.style.whiteSpace = "nowrap";
                        tooltip.style.pointerEvents = "none";
                        tooltip.style.opacity = "0";
                        tooltip.style.transform = "translateY(-6px)";
                        tooltip.style.transition = "opacity 0.12s ease, transform 0.12s ease";
                        tooltip.style.zIndex = "999";

                        card.appendChild(tooltip);

                        card.addEventListener("mouseenter", () => {
                            tooltip.style.opacity = "1";
                            tooltip.style.transform = "translateY(-10px)";
                        });
                        card.addEventListener("mouseleave", () => {
                            tooltip.style.opacity = "0";
                            tooltip.style.transform = "translateY(-6px)";
                        });

                        card.title = tooltip.textContent;
                    }

                    // push device with normalized vendor (may be empty string if unknown)
                    combinedDevices.push({
                        card: card,
                        device: {
                            ip: deviceIP,
                            type: deviceType,
                            status: currentStatus,
                            city: city,
                            vendor: datasetVendorValue // already normalized (uppercase) or ""
                        }
                    });
                });
            }

            combinedDevices.sort((a, b) => {
                const statusA = (a.device.status === "offline") ? 0 : 1;
                const statusB = (b.device.status === "offline") ? 0 : 1;
                return statusA - statusB;
            });

            const allDevices = combinedDevices.map(item => item.card);
            const deviceObjects = combinedDevices.map(item => item.device);

            // --- NEW: function to populate city select based on selected device type ---
            function populateCityOptions(selectedType = "all") {
                // preserve current selected city if possible
                const prevSelected = cityFilter.value;

                cityFilter.innerHTML = '<option value="all">All Cities</option>';

                let citiesToShow = new Set();

                if (!selectedType || selectedType === "all") {
                    citiesToShow = citySet;
                } else {
                    const setForType = typeCityMap[selectedType];
                    if (setForType && setForType.size > 0) {
                        citiesToShow = setForType;
                    } else {
                        // no cities for selected type -> keep empty (except "All Cities")
                        citiesToShow = new Set();
                    }
                }

                // Add cities in sorted order for stable UI
                Array.from(citiesToShow).sort().forEach((city) => {
                    const option = document.createElement("option");
                    option.value = city;
                    option.textContent = city;
                    cityFilter.appendChild(option);
                });

                // restore previous if still valid, otherwise set to 'all'
                if (prevSelected && Array.from(citiesToShow).includes(prevSelected)) {
                    cityFilter.value = prevSelected;
                } else {
                    cityFilter.value = "all";
                }
            }

            // populate vendor options
            let vendorFilter = document.getElementById("vendorFilter");
            if (!vendorFilter) {
                vendorFilter = document.createElement("select");
                vendorFilter.id = "vendorFilter";
                vendorFilter.style.marginTop = "8px";
                deviceFilter.parentNode.insertBefore(vendorFilter, cityFilter);
            }

            vendorFilter.innerHTML = `<option value="all">All camera</option>`;
            [...vendorSet].sort().forEach(v => {
                if (!v) return;
                const opt = document.createElement("option");
                opt.value = v;
                opt.textContent = v;
                vendorFilter.appendChild(opt);
            });

            // hide vendor filter by default unless cameras selected
            vendorFilter.style.display = (deviceFilter.value === "cameras") ? "block" : "none";

            vendorFilter.onchange = filterDevices; // uses filterDevices defined below

            // Build initial city options for the current deviceFilter selection
            populateCityOptions(deviceFilter.value || "all");

            // avoid duplicate listeners on repeated updates
            deviceFilter.value = "all";
            cityFilter.value = "all";
            document.querySelectorAll(".status-filter").forEach(btn => btn.classList.remove("active"));
            allFilterButton.classList.add("active");


            // new -----
            // --- Add this helper inside updateDetails (same scope as filterDevices) ---
            


            function computeFilteredControllerExtras(selectedCity = "all", selectedStatus = "all") {
                const controllersAll = Array.isArray(window.controllerDataCached) ? window.controllerDataCached : [];
                const result = { doors: { total: 0, online: 0, offline: 0 }, readers: { total: 0, online: 0, offline: 0 } };

                if (!controllersAll || controllersAll.length === 0) return result;

                const cityFilterLower = (selectedCity || "all").toString().toLowerCase();
                const statusFilterLower = (selectedStatus || "all").toString().toLowerCase();
                const regionFilterLower = (currentRegion || "global").toString().toLowerCase();

                controllersAll.forEach(ctrl => {
                    // Skip if controller has no Doors
                    if (!Array.isArray(ctrl.Doors) || ctrl.Doors.length === 0) return;

                    // Region filter (if a specific region other than 'global' is active)
                    if (regionFilterLower !== "global") {
                        const ctrlLocation = (ctrl.Location || ctrl.location || "").toString().toLowerCase();
                        const ctrlCity = (ctrl.City || ctrl.city || "").toString().toLowerCase();
                        if (ctrlLocation !== regionFilterLower && ctrlCity !== regionFilterLower) {
                            // controller not in selected region => skip
                            return;
                        }
                    }

                    // Apply city filter if any (match City OR Location)
                    if (cityFilterLower !== "all") {
                        const ctrlCity = (ctrl.City || ctrl.city || "").toString().toLowerCase();
                        const ctrlLocation = (ctrl.Location || ctrl.location || "").toString().toLowerCase();

                        // Match either City OR Location
                        if (ctrlCity !== cityFilterLower && ctrlLocation !== cityFilterLower) return;
                    }

                    // Apply status filter if any (match controllerStatus)
                    if (statusFilterLower !== "all") {
                        const ctrlStatus = (ctrl.controllerStatus || ctrl.status || "").toString().toLowerCase();
                        if (ctrlStatus !== statusFilterLower) return;
                    }

                    // Count doors/readers for this controller
                    ctrl.Doors.forEach(d => {
                        result.doors.total++;
                        if ((d.status || "").toString().toLowerCase() === "online") result.doors.online++;

                        if (d.Reader && d.Reader.toString().trim() !== "") {
                            result.readers.total++;
                            if ((d.status || "").toString().toLowerCase() === "online") result.readers.online++;
                        }
                    });
                });

                result.doors.offline = result.doors.total - result.doors.online;
                result.readers.offline = result.readers.total - result.readers.online;
                return result;
            }

            // new -----



            function filterDevices() {
                const selectedType = deviceFilter.value;
                const selectedStatus = document.querySelector(".status-filter.active")?.dataset.status || "all";
                const selectedCity = cityFilter.value;
                const vendorFilterLabel = document.getElementById("vendorFilterLabel");

                // toggle vendor UI
                vendorFilter.style.display = (deviceFilter.value === "cameras") ? "block" : "none";
                if (vendorFilterLabel) {
                    vendorFilterLabel.style.display = vendorFilter.style.display;
                }

                // get vendor selection (if filter exists)
                const vendorFilterElem = document.getElementById("vendorFilter");
                const selectedVendor = vendorFilterElem ? vendorFilterElem.value : "all";

                // Search bar input
                const searchTerm = document.getElementById("device-search").value.toLowerCase();

                // Show/hide vendor filter based on type
                if (vendorFilterElem) {
                    vendorFilterElem.style.display = (selectedType === "cameras") ? "block" : "none";
                }

                detailsContainer.innerHTML = "";

                const filteredDevices = allDevices.filter((device) =>
                    (selectedType === "all" || device.dataset.type === selectedType) &&
                    (selectedStatus === "all" || device.dataset.status === selectedStatus) &&
                    (selectedCity === "all" || device.dataset.city === selectedCity) &&
                    (selectedVendor === "all" || (device.dataset.vendor || "") === selectedVendor) &&
                    (
                        !searchTerm ||
                        device.innerText.toLowerCase().includes(searchTerm)
                    )
                );

                filteredDevices.forEach((deviceCard) => {
                    detailsContainer.appendChild(deviceCard);
                });

                const region = currentRegion?.toUpperCase() || "GLOBAL";
                const titleElement = document.getElementById("region-title");

                const logoHTML = `
                    <span class="region-logo">
                        <a href="http://10.199.22.57:3014/" class="tooltip">
                            <i class="fa-solid fa-house"></i>
                            <span class="tooltiptext">Dashboard Hub</span>
                        </a>
                    </span>
                    `;
                if (selectedCity !== "all") {
                    titleElement.innerHTML = `${logoHTML}<span>${region}, ${selectedCity} Summary</span>`;
                } else {
                    titleElement.innerHTML = `${logoHTML}<span>${region} Summary</span>`;
                }


                const filteredSummaryDevices = deviceObjects.filter((deviceObj, index) => {
                    const correspondingCard = allDevices[index];
                    return (
                        (selectedType === "all" || correspondingCard.dataset.type === selectedType) &&
                        (selectedStatus === "all" || correspondingCard.dataset.status === selectedStatus) &&
                        (selectedCity === "all" || correspondingCard.dataset.city === selectedCity) &&
                        (selectedVendor === "all" || (correspondingCard.dataset.vendor || "") === selectedVendor)
                    );
                });
                const offlineDevices = filteredSummaryDevices
                    .filter(d => d.status === "offline")
                    .map(d => ({
                        name: d.name || "Unknown",
                        ip: d.ip,
                        city: d.city,
                        type: d.type,
                        lastSeen: new Date().toISOString()
                    }));

                //     // ⬇️⬇️ this is call from graph.js
                // if (window.updateOfflineChart) {
                //     window.updateOfflineChart(offlineDevices);
                // }

                // ⬇️⬇️ this is call from graph.js (scatter)
                if (window.updateOfflineChart) {
                    try {
                      window.updateOfflineChart(offlineDevices);
                    } catch (e) {
                      console.warn("updateOfflineChart failed:", e);
                    }
                }

                // ✅ ALSO update the Offline City BAR chart
                // updateOfflineCityBarChart expects combinedDevices items with a `.device` property,
                // so map our flat deviceObjects into that shape.
                if (typeof window.updateOfflineCityBarChart === "function") {
                    try {
                        const barInput = (Array.isArray(deviceObjects) ? deviceObjects : []).map(dev => ({ device: dev }));
                        window.updateOfflineCityBarChart(barInput);
                    } catch (e) {
                        console.warn("updateOfflineCityBarChart failed:", e);
                    }
                } else {
                    console.debug("updateOfflineCityBarChart() not found - ensure graph.js was loaded.");
                }

                const summary = calculateCitySummary(filteredSummaryDevices);

                // --- NEW: compute controller door/reader counts for the current filters ---
                // We pass selectedCity and selectedStatus so door counts reflect the active filters.
                const controllerExtrasFiltered = computeFilteredControllerExtras(selectedCity, selectedStatus);
                if (!summary.summary) summary.summary = {};
                summary.summary.controllerExtras = controllerExtrasFiltered;

                updateSummary(summary);
            }

            function calculateCitySummary(devices) {
                const summary = {
                    summary: {
                        totalDevices: devices.length,
                        totalOnlineDevices: devices.filter(d => d.status === "online").length,
                        totalOfflineDevices: devices.filter(d => d.status === "offline").length,
                        cameras: { total: 0, online: 0, offline: 0 },
                        archivers: { total: 0, online: 0, offline: 0 },
                        controllers: { total: 0, online: 0, offline: 0 },
                        servers: { total: 0, online: 0, offline: 0 },
                        pcdetails: { total: 0, online: 0, offline: 0 },
                        dbdetails: { total: 0, online: 0, offline: 0 }
                    }
                };

                devices.forEach((device) => {
                    if (!summary.summary[device.type]) return;
                    summary.summary[device.type].total += 1;
                    if (device.status === "online") summary.summary[device.type].online += 1;
                    else summary.summary[device.type].offline += 1;
                });

                return summary;
            }

            // initial filter run
            filterDevices();

            setTimeout(() => {
                const selectedCity = cityFilter.value;
                const selectedType = deviceFilter.value;
                const selectedStatus = document.querySelector(".status-filter.active")?.dataset.status || "all";
                const vendorFilterElem = document.getElementById("vendorFilter");
                const selectedVendor = vendorFilterElem ? vendorFilterElem.value : "all";

                const filteredSummaryDevices = deviceObjects.filter((deviceObj, index) => {
                    const correspondingCard = allDevices[index];
                    return (
                        (selectedType === "all" || correspondingCard.dataset.type === selectedType) &&
                        (selectedStatus === "all" || correspondingCard.dataset.status === selectedStatus) &&
                        (selectedCity === "all" || correspondingCard.dataset.city === selectedCity) &&
                        (selectedVendor === "all" || (correspondingCard.dataset.vendor || "") === selectedVendor)
                    );
                });

                const summary = calculateCitySummary(filteredSummaryDevices);
                updateSummary(summary);
            }, 100);

            // ---- EVENTS ----
            // When device type changes, rebuild city options first then apply filters.
            deviceFilter.addEventListener("change", () => {
                populateCityOptions(deviceFilter.value || "all");
                filterDevices();
            });

            // Search bar input
            document.getElementById("device-search").addEventListener("input", filterDevices);
            cityFilter.addEventListener("change", filterDevices);
            allFilterButton.addEventListener("click", () => {
                document.querySelectorAll(".status-filter").forEach(btn => btn.classList.remove("active"));
                allFilterButton.classList.add("active");
                filterDevices();
            });
            onlineFilterButton.addEventListener("click", () => {
                document.querySelectorAll(".status-filter").forEach(btn => btn.classList.remove("active"));
                onlineFilterButton.classList.add("active");
                filterDevices();
            });
            offlineFilterButton.addEventListener("click", () => {
                document.querySelectorAll(".status-filter").forEach(btn => btn.classList.remove("active"));
                offlineFilterButton.classList.add("active");
                filterDevices();
            });
        })
        .catch((error) => {
            console.error("Error fetching real-time device status:", error);
            detailsContainer.innerHTML = "<p>Failed to load device details.</p>";
        });
}
