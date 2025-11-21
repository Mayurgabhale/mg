now ok, but this i want dyanamic ok 
we get our all location from api backend throut ok 

  <!-- Sidebar -->
    <aside id="sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-title"><i class="fas fa-sliders-h"></i> </h2>
        <div class="header-controls">
          <button class="theme-toggle" id="themeToggle">
            <i class="fas fa-moon"></i>
          </button>
        </div>
        <button class="close-sidebar" id="closeSidebar">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <button class="nav-button" id="toggle-main-btn"><i class="fas fa-window-maximize"></i>Device Details</button>

      <div class="region-buttons">
        <button class="region-button" data-region="global"><i class="fas fa-globe"></i> Global</button>
        <button class="region-button" data-region="apac"><i class="fas fa-map-marker-alt"></i> APAC</button>
        <button class="region-button" data-region="emea"><i class="fas fa-map-marker-alt"></i> EMEA</button>
        <button class="region-button" data-region="laca"><i class="fas fa-map-marker-alt"></i> LACA</button>
        <button class="region-button" data-region="namer"><i class="fas fa-map-marker-alt"></i> NAMER</button>
      </div>

      <button class="nav-button" onclick="location.href='trend.html'"><i class="fas fa-chart-line"></i> View Trend
        Analysis</button>
      <button class="nav-button" onclick="location.href='summary.html'"><i class="fas fa-table"></i> View Devices
        Summary</button>
      <button class="nav-button" onclick="location.href='controllers.html'"><i class="fas fa-table"></i> View Devices
        Door</button>

      <div id="countdown" class="countdown-timer">Loading Timer...</div>

      <div class="filter-buttons">
        <button id="filter-all" class="status-filter active" data-status="all"><i class="fas fa-layer-group"></i> All
          Devices</button>
        <button id="filter-online" class="status-filter" data-status="online"><i class="fas fa-wifi"></i> Online
          Devices</button>
        <button id="filter-offline" class="status-filter" data-status="offline"><i class="fas fa-plug-circle-xmark"></i>
          Offline Devices</button>
      </div>

      <label for="device-filter">Filter by Device Type:</label>
      <select id="device-filter">
        <option value="all">All</option>
        <option value="cameras">Cameras</option>
        <option value="archivers">Archivers</option>
        <option value="controllers">Controllers</option>
        <option value="servers">CCURE</option>
        <option value="pcdetails">Desktop Details</option>
        <option value="dbdetails">DB Server</option>
      </select>

      <label for="vendorFilter" id="vendorFilterLabel">Filter by Camera:</label>
      <select id="vendorFilter">
        <option value="all">All camera</option>
      </select>

      <label for="city-filter">Filter by Location:</label>
      <select id="city-filter">
        <option value="all">All Cities</option>
      </select>
    </aside>



            <!-- RIGHT PANEL — WORLD MAP -->
            <div class="right-panel">
              <!-- <div class="gcard tall"> -->
              <div class="">
                <div class="worldmap-wrapper">

                  <!-- MAP CARD -->
                  <div class="worldmap-card">

                    <div id="realmap"></div>

                    <!-- Legend + Controls Row -->
                    <div class="map-bottom-bar">

                      <!-- Legend -->
                      <div class="legend">
                        <div class="legend-item">
                          <i class="bi bi-camera"></i>
                          Camera
                        </div>
                        <div class="legend-item">
                          <i class="bi bi-hdd"></i> Controller
                        </div>
                        <div class="legend-item">
                          <i class="fa-duotone fa-solid fa-server"></i> Server
                        </div>
                        <div class="legend-item">
                          <i class="fas fa-database "></i> Archiver
                        </div>
                      </div>

                      <!-- Controls -->
                      <div class="map-controls">
                        <button id="fit-all" class="btn-ghost">Fit All</button>
                        <button id="show-global" class="btn-gv">Global View</button>
                      </div>

                    </div>
                  </div>

                  <!-- SIDE PANEL -->
                  <div class="region-panel" id="region-panel">
                    <h4 class="panel-title">Global (City Overview)</h4>

                    <div id="region-panel-content" class="panel-content"></div>

                    <!-- <div class="filter-block">
                      <h5>Filters</h5>

                      <select id="filter-type" class="filter-select">
                        <option value="all">All device types</option>
                        <option value="camera">Camera</option>
                        <option value="controller">Controller</option>
                        <option value="server">Server</option>
                        <option value="archiver">Archiver</option>
                      </select>

                      <select id="filter-status" class="filter-select">
                        <option value="all">All Status</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                      </select>

                      <div class="filter-actions">
                        <button id="apply-filters" class="btn">Apply</button>
                        <button id="reset-filters" class="btn-ghost">Reset</button>
                      </div>

                    </div> -->

                  </div>

                </div>
              </div>
            </div>


            <div class="bottom-row">

              <!-- <div class="gcard wide gcard-pie">
                <h4 class="gcard-title">Total Count </h4>
                <div class="chart-placeholder"></div>
              </div> -->
              <div class="gcard wide">
                <h4 class="gcard-title">LOC Count</h4>
                <div class="chart-placeholder"></div>
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
// --- LOC Count: Grouped bar chart (Chart.js) ----------------------

let locChart = null;

// Sample data: replace this array with your real data source (API / DOM)
const locData = [
  { city: 'DEL', Cameras: 12, ACS: 3, 'NVR/DVR': 4, Server: 2 },
  { city: 'CCU', Cameras: 8,  ACS: 4, 'NVR/DVR': 6, Server: 1 },
  { city: 'HYD', Cameras: 18, ACS: 7, 'NVR/DVR': 10, Server: 3 },
  { city: 'PUNE',Cameras: 5,  ACS: 2, 'NVR/DVR': 3, Server: 1 },
  { city: 'KOL', Cameras: 10, ACS: 5, 'NVR/DVR': 7, Server: 2 }
];

// color palette (adapt to your theme variables if needed)
const deviceColors = {
  Cameras: '#10b981',   // green
  ACS: '#f59e0b',       // amber
  'NVR/DVR': '#2563eb', // blue
  Server: '#ef4444'     // red
};

/**
 * Find the placeholder element (re-uses your helper)
 * returns the .chart-placeholder or null
 */
function findLocPlaceholder() {
  return findChartPlaceholderByTitle('LOC Count');
}

/**
 * Build chart datasets from locData for the selected device types
 */
function buildDatasets(data, deviceKeys) {
  return deviceKeys.map(key => ({
    label: key,
    data: data.map(d => d[key] || 0),
    backgroundColor: deviceColors[key] || '#94a3b8',
    borderRadius: 4,
    barThickness: 18
  }));
}

/**
 * Render the LOC bar chart (all cities)
 */
function renderLocChart(showCities = null) {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded');
    return;
  }

  const placeholder = findLocPlaceholder();
  if (!placeholder) return;

  // create canvas if needed
  let canvas = placeholder.querySelector('canvas');
  if (!canvas) {
    placeholder.innerHTML = '';
    canvas = document.createElement('canvas');
    placeholder.appendChild(canvas);
  }

  // filter cities if showCities is provided (array or single string)
  let dataToUse = locData.slice(); // copy
  if (showCities) {
    const set = new Set(Array.isArray(showCities) ? showCities : [showCities]);
    dataToUse = locData.filter(d => set.has(d.city));
  }

  const cities = dataToUse.map(d => d.city);

  // device keys (order matters)
  const deviceKeys = ['Cameras', 'ACS', 'NVR/DVR', 'Server'];

  // if chart exists, destroy it and recreate cleanly
  if (locChart) {
    locChart.destroy();
    locChart = null;
  }

  const ctx = canvas.getContext('2d');

  locChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: cities,
      datasets: buildDatasets(dataToUse, deviceKeys)
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true } },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}`
          }
        }
      },
      scales: {
        x: {
          stacked: false,
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
          grid: {
            color: getComputedStyle(document.body).getPropertyValue('--graph-grid') || 'rgba(255,255,255,0.04)'
          }
        }
      }
    }
  });
}

/**
 * Update locData (when new data arrives) and refresh chart
 * newData must be an array of {city, Cameras, ACS, 'NVR/DVR', Server}
 */
function updateLocData(newData) {
  // naive replace — adapt to merge behavior if you need
  // Example: merge on city key
  const map = new Map();
  newData.forEach(d => map.set(String(d.city).toUpperCase(), Object.assign({}, d)));
  // keep existing cities that are not in newData
  locData.forEach(d => {
    const key = String(d.city).toUpperCase();
    if (!map.has(key)) map.set(key, d);
  });

  // Rebuild locData array
  const updated = Array.from(map.values());
  // sort by city for consistent ordering
  updated.sort((a, b) => a.city.localeCompare(b.city));
  // replace contents
  locData.length = 0;
  updated.forEach(x => locData.push(x));

  // Re-render chart
  renderLocChart();
}

/**
 * Populate the #city-filter select with cities (optional)
 * The page already has a #city-filter; this will add cities and an "All Cities" option.
 */
function populateCityFilter() {
  const sel = document.getElementById('city-filter');
  if (!sel) return;
  // clear except keep first option (All Cities) if present
  sel.innerHTML = '<option value="all">All Cities</option>';
  locData.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.city;
    opt.textContent = d.city;
    sel.appendChild(opt);
  });

  sel.addEventListener('change', () => {
    const v = sel.value;
    if (!v || v === 'all') {
      renderLocChart();
    } else {
      renderLocChart(v);
    }
  });
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // initial render
  renderLocChart();
  populateCityFilter();

  // OPTIONAL: call updateLocData(...) whenever you fetch new data
  // Example to simulate an update in 6s:
  // setTimeout(() => {
  //   updateLocData([
  //     { city: 'DEL', Cameras: 14, ACS: 4, 'NVR/DVR': 6, Server: 2 },
  //     { city: 'NEW', Cameras: 3, ACS: 1, 'NVR/DVR': 0, Server: 0 }
  //   ]);
  // }, 6000);
});
