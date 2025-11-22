Failure Count graph is not display please fidnout he issue and chekc why Failure Count not disply,, 
  

C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\index.html
  <div class="gcard wide" style="height:300px;">
                <h4 class="gcard-title">Failure Count</h4>
                <canvas id="failureCountChart"></canvas>
              </div>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Device Dashboard</title>


  <!-- >>>>>>>>>>>>>>>>>>>> -->
  <!-- <link rel="icon" type="image/png" href="images/favicon-96x96.png"/> -->

  <!-- >>>>>>>>>>>>>>>>>>>> -->
  <link rel="icon" href="images/favicon.png" sizes="32x32" type="images/png">

  <link rel="stylesheet" href="styles.css" />
  <link rel="stylesheet" href="graph.css">
  <link rel="stylesheet" href="sidebar.css">
  <!-- <link rel="stylesheet" href="incss.css" /> -->
  <link rel="stylesheet" href="newcss.css">
  <link rel="stylesheet" href="map.css">

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">


  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">

  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

  <!-- inside <head> or before body end, add Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>


  <!-- map js link here 📝📝📝📝📝📝⬇️⬇️ -->

  <!-- Leaflet -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>

  <!-- MarkerCluster -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css" />
  <script src="https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js"></script>

  <!-- Heatmap -->
  <script src="https://unpkg.com/leaflet.heat/dist/leaflet-heat.js"></script>

  <!-- Turf (optional spatial ops) -->
  <script src="https://unpkg.com/@turf/turf/turf.min.js"></script>
  <!-- map js link here 📝📝📝📝📝📝 -->

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

</head>

<body>
  <button id="scrollToTopBtn" title="Go to top">
    <i class="bi bi-chevron-double-up"></i>
  </button>

  <div id="region-title" class="dashboard-header">
    <div class="region-logo">
    </div>

  </div>


  <section class="summary-section">

    <div class="summary">
      <div class="card">

        <h3><i class="fas fa-microchip icon-3d"></i> Total Devices</h3>
        <div class="card-status total">Total <span id="total-devices">0</span></div>
        <div class="card-status online">Online <span id="online-devices">0</span></div>
        <div class="card-status offline">Offline <span id="offline-devices">0</span></div>
      </div>

      <div class="card">
        <h3><i class="fas fa-video icon-3d"></i> Cameras</h3>
        <div class="card-status total">Total <span id="camera-total">0</span></div>
        <div class="card-status online">Online <span id="camera-online">0</span></div>
        <div class="card-status offline">Offline <span id="camera-offline">0</span></div>
      </div>



      <div class="card">
        <h3><i class="fas fa-database icon-3d"></i> Archivers</h3>

        <div class="card-status total">Total <span id="archiver-total">0</span></div>
        <div class="card-status online">Online <span id="archiver-online">0</span></div>
        <div class="card-status offline">Offline <span id="archiver-offline">0</span></div>
      </div>

      <div class="card">
        <h3><i class="fas fa-id-card icon-3d"></i> Controllers</h3>
        <div class="card-status total">Total <span id="controller-total">0</span></div>
        <div class="card-status online">Online <span id="controller-online">0</span></div>
        <div class="card-status offline">Offline <span id="controller-offline">0</span></div>
      </div>

      <div class="card" id="door-card">
        <h3><i class="fa-solid fa-door-closed icon-3d"></i>Door</h3>
        <div class="card-status total">Total <span id="doorReader-total">0</span></div>
        <div class="card-status online">Online <span id="doorReader-online">0</span></div>
        <div class="card-status offline">Offline <span id="doorReader-offline">0</span></div>
      </div>
      <div class="card">
        <h3><i class="fas fa-id-badge icon-3d"></i>Reader</h3>
        <div class="card-status total">Total <span id="reader-total-inline">0</span></div>
        <div class="card-status online">Online <span id="reader-online-inline">0</span></div>
        <div class="card-status offline">Offline <span id="reader-offline-inline">0</span></div>
      </div>

      <div class="card">
        <h3><i class="fas fa-server icon-3d"></i>CCURE</h3>
        <div class="card-status total">Total <span id="server-total">0</span></div>
        <div class="card-status online">Online <span id="server-online">0</span></div>
        <div class="card-status offline">Offline <span id="server-offline">0</span></div>
      </div>

      <div class="card">
        <h3><i class="fas fa-desktop icon-3d"></i>Desktop</h3>
        <div class="card-status total">Total <span id="pc-total">0</span></div>
        <div class="card-status online">Online <span id="pc-online">0</span></div>
        <div class="card-status offline">Offline <span id="pc-offline">0</span></div>
      </div>

      <div class="card">
        <h3><i class="fa-etch fa-solid fa-database icon-3d"></i>DB Server</h3>
        <div class="card-status total">Total <span id="db-total">0</span></div>
        <div class="card-status online">Online <span id="db-online">0</span></div>
        <div class="card-status offline">Offline <span id="db-offline">0</span></div>
      </div>


    </div>

  </section>

  <div class="container">
    <!-- Sidebar -->

    <!-- 📝📝📝📝📝 new sidebar -->
    <!-- Sidebar Toggle Button -->
    <button class="sidebar-toggle" id="sidebarToggle">
      <i class="fas fa-bars"></i>
    </button>

    <!-- Sidebar Overlay -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

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
    <!-- 📝📝📝📝📝 new sidebar end -->


    <!-- Main Content -->


    <!-- new mian code start📝📝📝📝📝 -->
    <main id="content">
      <section id="details-section" class="details-section">
        <div class="details-header">
          <h2><i class="fas fa-microchip"></i> Device Details</h2>
          <input type="text" id="device-search" placeholder="🔍 Search by IP, Location, City..." />
        </div>

        <div id="device-details" class="device-grid">Loading device data...</div>
        <div id="details-container" class="device-grid"></div>
      </section>



      <section id="main-graph" class="graphs-section">
        <div class="graphs-inner">

          <div class="graphs-grid dashboard-layout">

            <!-- Left 2x2 cards -->
            <div class="left-grid">

              <div class="gcard">
                <h4 class="gcard-title">Total No. of Cameras</h4>
                <div class="semi-donut gauge" id="gauge-cameras" data-fill="#12b76a"
                  style="--percentage:0; --fill:#12b76a">
                  <div class="gtext">
                    <b class="total">0</b>
                    <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
                  </div>
                </div>
              </div>

              <div class="gcard">
                <h4 class="gcard-title">Total No. of Archivers</h4>
                <div class="semi-donut gauge" id="gauge-archivers" data-fill="#12b76a"
                  style="--percentage:0; --fill:#12b76a">
                  <div class="gtext">
                    <b class="total">0</b>
                    <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
                  </div>
                </div>
              </div>

              <div class="gcard">
                <h4 class="gcard-title">Total No. of Controllers</h4>
                <div class="semi-donut gauge" id="gauge-controllers" data-fill="#12b76a"
                  style="--percentage:0; --fill:#12b76a">
                  <div class="gtext">
                    <b class="total">0</b>
                    <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
                  </div>
                </div>
              </div>

              <div class="gcard">
                <h4 class="gcard-title">TOTAL No. of CCURE</h4>
                <div class="semi-donut gauge" id="gauge-ccure" data-fill="#12b76a"
                  style="--percentage:0; --fill:#12b76a">
                  <div class="gtext">
                    <b class="total">0</b>
                    <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
                  </div>
                </div>
              </div>

              <!-- <div class="gcard wide gcard-pie">
                <h4 class="gcard-title">Total Count </h4>
                <div class="chart-placeholder"></div>
              </div> -->

            </div>


            <!-- RIGHT PANEL — WORLD MAP -->
            <div class="right-panel">
              <!-- <div class="gcard tall"> -->
              <div class="">
                <div class="worldmap-wrapper">

                  <!-- MAP CARD -->
                  <div class="worldmap-card">
                    <!-- Fullscreen Button -->
                    <button id="mapFullscreenBtn" class="map-fullscreen-btn">
                      ⛶ View Full
                    </button>

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
              <!-- <div class="gcard wide">
                <h4 class="gcard-title">LOC Count</h4>
                <div class="chart-placeholder"></div>
              </div> -->
              <div class="gcard wide" style="height:300px;">
                <h4 class="gcard-title">LOC Count</h4>
                <canvas id="cityBarChart"></canvas>
              </div>

              <!-- <div class="gcard wide">
                <h4 class="gcard-title">Failure Count</h4>
                <div class="chart-placeholder"></div>
              </div> -->
              <div class="gcard wide" style="height:300px;">
                <h4 class="gcard-title">Failure Count</h4>
                <canvas id="failureCountChart"></canvas>
              </div>




              <div class="gcard wide gcard-pie">
                <h4 class="gcard-title">Total Count </h4>
                <div class="chart-placeholder"></div>
              </div>



            </div>


          </div>
        </div>
      </section>


    </main>


  </div>


  <!-- Modal -->
  <div id="modal">
    <div class="modal-content">
      <span id="close-modal">&times;</span>
      <h3 id="modal-title">Device Details</h3>
      <ul id="modal-body"></ul>
    </div>
  </div>

  <!-- Footer -->
  <footer class="footer">
    <p>
      <img src="images/new-header.png" alt="Company Logo" class="footer-logo" />
    </p>

    <p style="color: #fff;">&copy; 2025 VisionWatch | Powered by <strong style="color: #ffcc00;">Western Union
        Services India Pvt Ltd.</strong></p>
    <p style="color: #fff;">Contact:
      <a href="mailto:gsoc-globalsecurityoperationcenter.sharedmailbox@westernunion.com">Email</a> |
      <a href="tel:+912067632394">+91 20 67632394</a>
    </p>
  </footer>

  <div id="mapFullscreenModal">
    <span id="closeFullscreenBtn">✖</span>
    <div id="fullscreenMap"></div>
  </div>




  <script src="script.js"></script>
  <script src="graph.js"></script>
  <script src="map.js"></script>


  <script>
    // Sidebar Toggle Functionality
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function openSidebar() {
      sidebar.classList.add('active');
      sidebarOverlay.classList.add('active');
      sidebarToggle.style.display = 'none';   // HIDE TOGGLE BUTTON
      document.body.style.overflow = 'hidden';
    }


    function closeSidebarFunc() {
      sidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
      sidebarToggle.style.display = 'block';  // SHOW TOGGLE BUTTON
      document.body.style.overflow = 'auto';
    }

    sidebarToggle.addEventListener('click', openSidebar);
    closeSidebar.addEventListener('click', closeSidebarFunc);
    sidebarOverlay.addEventListener('click', closeSidebarFunc);

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('theme-light');
      const icon = themeToggle.querySelector('i');
      if (document.body.classList.contains('theme-light')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    });
  </script>

</body>

</html>

C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\graph.js


// ☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️
// ☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️

// Global variable to store chart instance
let failureChart = null;

function refreshFailureChart(failureData) {
  if (!failureChart) {
    failureChart = createFailureCountChart();
  }
  
  failureChart.data.datasets[0].data = Object.values(failureData);
  failureChart.update();
}


// Enhanced Failure Count Chart with real data
function createFailureCountChart() {
  const ctx = document.getElementById('failureCountChart');
  if (!ctx) return null;
  
  failureChart = new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['Cameras', 'Controllers', 'Archivers', 'Servers', 'Desktops', 'DB Servers'],
      datasets: [{
        label: 'Total Failures',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: '#ff6b6b',
        borderColor: '#ff5252',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
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
            text: 'Failure Count'
          },
          ticks: {
            precision: 0
          }
        },
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 45
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      }
    }
  });

  return failureChart;
}

// Calculate failure counts from your device data
function calculateFailureCounts(deviceDetails) {
  const counts = {
    cameras: 0,
    controllers: 0,
    archivers: 0,
    servers: 0,
    desktops: 0,
    dbServers: 0
  };

  if (!deviceDetails || !window.deviceHistoryData) return counts;

  // Process each device type
  Object.keys(deviceDetails).forEach(type => {
    const devices = deviceDetails[type] || [];
    devices.forEach(device => {
      const ip = device.ip_address;
      const history = window.deviceHistoryData[ip] || [];
      const filteredHistory = filterHistoryForDisplay(history, type.toUpperCase());
      const failureCount = filteredHistory.filter(e => e.status === 'Offline').length;
      
      // Map to appropriate category
      switch(type) {
        case 'cameras': counts.cameras += failureCount; break;
        case 'controllers': counts.controllers += failureCount; break;
        case 'archivers': counts.archivers += failureCount; break;
        case 'servers': counts.servers += failureCount; break;
        case 'pcDetails': counts.desktops += failureCount; break;
        case 'DBDetails': counts.dbServers += failureCount; break;
      }
    });
  });

  return counts;
}

// Function to update chart with real data
function updateFailureCountChart(deviceData) {
  // This function will be called with actual device data
  const failureCounts = {
    cameras: 0,
    controllers: 0,
    archivers: 0,
    servers: 0,
    desktops: 0,
    dbServers: 0
  };

  // Count failures for each device type
  ['cameras', 'archivers', 'controllers', 'servers', 'pcDetails', 'DBDetails'].forEach(type => {
    const devices = deviceData[type] || [];
    devices.forEach(dev => {
      const ip = dev.ip_address;
      const hist = filterHistoryForDisplay(window.deviceHistoryData[ip] || [], type.toUpperCase());
      const failureCount = hist.filter(e => e.status === 'Offline').length;
      
      // Map to the correct category names
      if (type === 'cameras') failureCounts.cameras += failureCount;
      else if (type === 'controllers') failureCounts.controllers += failureCount;
      else if (type === 'archivers') failureCounts.archivers += failureCount;
      else if (type === 'servers') failureCounts.servers += failureCount;
      else if (type === 'pcDetails') failureCounts.desktops += failureCount;
      else if (type === 'DBDetails') failureCounts.dbServers += failureCount;
    });
  });

  return failureCounts;
}

// Initialize chart when page loads
// document.addEventListener('DOMContentLoaded', function() {
//   // Wait a bit for other components to load
//   setTimeout(() => {
//     createFailureCountChart();
//   }, 1000);
// });
document.addEventListener('DOMContentLoaded', function() {
  // Your existing initialization code...
  
  // Initialize failure count chart
  createFailureCountChart();
  
  // Update chart when region changes
  document.getElementById('region')?.addEventListener('change', function() {
    setTimeout(() => {
      if (window.currentDeviceDetails) {
        const failureData = calculateFailureCounts(window.currentDeviceDetails);
        refreshFailureChart(failureData);
      }
    }, 1500);
  });
});

chekc also this 
..........

C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\summary.js
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

    // After populating the table, update the failure chart
    if (typeof updateFailureCountChart === 'function') {
        const failureData = updateFailureCountChart(details);
        refreshFailureChart(failureData);
    }

    filterData();
}

--------------
  C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\trend.js

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
  // After populating the table, update the failure chart
  if (typeof updateFailureCountChart === 'function') {
    const failureData = updateFailureCountChart(details);
    refreshFailureChart(failureData);
  }

  filterData();


}
