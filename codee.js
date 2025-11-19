now this right panel worlmap i want to add our real dynanamic count wiht the help of api  our section id="main-graph is wokr on real count ok this sectin 
<div class="right-panel">
              <div class="gcard tall">
                <div class="worldmap-wrapper">

                  <!-- MAP CARD -->
                  <div class="worldmap-card">

                    <div id="realmap"></div>

                    <!-- Legend + Controls Row -->
                    <div class="map-bottom-bar">

                      <!-- Legend -->
                      <div class="legend">
                        <div class="legend-item">
                          <div class="legend-box" style="background:#10b981"></div> Camera
                        </div>
                        <div class="legend-item">
                          <div class="legend-box" style="background:#f97316"></div> Controller
                        </div>
                        <div class="legend-item">
                          <div class="legend-box" style="background:#7c3aed"></div> Server
                        </div>
                        <div class="legend-item">
                          <div class="legend-box" style="background:#2563eb"></div> Archiver
                        </div>
                      </div>

                      <!-- Controls -->
                      <div class="map-controls">
                        <button id="toggle-heat" class="btn-ghost">Heat</button>
                        <button id="fit-all" class="btn-ghost">Fit All</button>
                        <button id="show-global" class="btn">Global View</button>
                      </div>

                    </div>
                  </div>

                  <!-- SIDE PANEL -->
                  <div class="region-panel" id="region-panel">
                    <h4 class="panel-title">Global (City Overview)</h4>

                    <div id="region-panel-content" class="panel-content"></div>

                    <!-- Filters -->
                    <div class="filter-block">
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

                    </div>
                  </div>

                </div>
              </div>
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

</head>

<body>
  <button id="scrollToTopBtn" title="Go to top">
    <i class="bi bi-chevron-double-up"></i>
  </button>

  <div id="region-title" class="dashboard-header">
    <div class="region-logo">
    </div
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
      </div
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

            </div>

            <!-- Right SIDE MAP PANEL -->
            <!-- <div class="right-panel">
              <div class="gcard tall">
                <h4 class="gcard-title">World Device Map</h4>

                <div class="map-placeholder">

                  <div class="map-card">
                    
                    <div id="realmap"></div>

                    <div style="margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
                      <div class="legend">
                        <div class="legend-item">
                          <div style="width:18px;height:18px;background:#10b981;border-radius:4px"></div> Camera
                        </div>
                        <div class="legend-item">
                          <div style="width:18px;height:18px;background:#f97316;border-radius:4px"></div> Controller
                        </div>
                        <div class="legend-item">
                          <div style="width:18px;height:18px;background:#7c3aed;border-radius:4px"></div> Server
                        </div>
                        <div class="legend-item">
                          <div style="width:18px;height:18px;background:#2563eb;border-radius:4px"></div> Archiver
                        </div>
                      </div>

                      <div class="controls" id="map-controls" style="font-size:13px; color:#334155;">
                        <button id="toggle-heat" class="btn-ghost">Toggle Heat</button>
                        <button id="fit-all" class="btn-ghost">Fit All</button>
                        <button id="show-global" class="btn">Show Global</button>
                      </div>
                    </div>
                  </div>

                  <div class="panel" id="region-panel">
                    <h4>Global (city-wise)</h4>
                    <div id="region-panel-content"></div>

                    <div style="margin-top:12px">
                      <h5>Filters (optional)</h5>
                      <select id="filter-type" style="width:100%; padding:8px; margin-bottom:8px;">
                        <option value="all">All device types</option>
                        <option value="camera">Camera</option>
                        <option value="controller">Controller</option>
                        <option value="server">Server</option>
                        <option value="archiver">Archiver</option>
                      </select>

                      <select id="filter-status" style="width:100%; padding:8px; margin-bottom:8px;">
                        <option value="all">All status</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                      </select>

                      <div style="display:flex; gap:8px;">
                        <button id="apply-filters" class="btn">Apply</button>
                        <button id="reset-filters" class="btn-ghost">Reset</button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div> -->


            <!-- ..... -->

            <!-- RIGHT PANEL — WORLD MAP -->
            <div class="right-panel">
              <div class="gcard tall">
                <div class="worldmap-wrapper">

                  <!-- MAP CARD -->
                  <div class="worldmap-card">

                    <div id="realmap"></div>

                    <!-- Legend + Controls Row -->
                    <div class="map-bottom-bar">

                      <!-- Legend -->
                      <div class="legend">
                        <div class="legend-item">
                          <div class="legend-box" style="background:#10b981"></div> Camera
                        </div>
                        <div class="legend-item">
                          <div class="legend-box" style="background:#f97316"></div> Controller
                        </div>
                        <div class="legend-item">
                          <div class="legend-box" style="background:#7c3aed"></div> Server
                        </div>
                        <div class="legend-item">
                          <div class="legend-box" style="background:#2563eb"></div> Archiver
                        </div>
                      </div>

                      <!-- Controls -->
                      <div class="map-controls">
                        <button id="toggle-heat" class="btn-ghost">Heat</button>
                        <button id="fit-all" class="btn-ghost">Fit All</button>
                        <button id="show-global" class="btn">Global View</button>
                      </div>

                    </div>
                  </div>

                  <!-- SIDE PANEL -->
                  <div class="region-panel" id="region-panel">
                    <h4 class="panel-title">Global (City Overview)</h4>

                    <div id="region-panel-content" class="panel-content"></div>

                    <!-- Filters -->
                    <div class="filter-block">
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

                    </div>
                  </div>

                </div>
              </div>
            </div>

            <!-- ..... -->
            <div class="bottom-row">

              <div class="gcard wide">
                <h4 class="gcard-title">Weekly Failures</h4>
                <div class="chart-placeholder"></div>
              </div>

              <div class="gcard wide">
                <h4 class="gcard-title">Failure Count</h4>
                <div class="chart-placeholder"></div>
              </div>

              <div class="gcard wide">
                <h4 class="gcard-title">LOC Count</h4>
                <div class="chart-placeholder"></div>
              </div>

            </div>

          </div>
        </div>
      </section>


    </main>

    <!-- new mian code end -->

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
   
..........................
C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\map.js
/* ============================================================
   1. CITY DEFINITIONS (your WU locations)
   ============================================================ */

const CITY_LIST = [
    {
        city: "Pune",
        lat: 18.5204,
        lon: 73.8567,
        region: "APAC",
        devices: {
            camera: 60,
            controller: 40,
            server: 2,
            archiver: 20
        }
    },
    {
        city: "Hyderabad",
        lat: 17.3850,
        lon: 78.4867,
        region: "APAC",
        devices: {
            camera: 40,
            controller: 28,
            server: 10,
            archiver: 20
        }
    },
    {
        city: "London",
        lat: 51.5074,
        lon: -0.1278,
        region: "EMEA",
        devices: {
            camera: 22,
            controller: 14,
            server: 5,
            archiver: 10
        }
    },
    {
        city: "New York",
        lat: 40.7128,
        lon: -74.0060,
        region: "NAMER",
        devices: {
            camera: 35,
            controller: 20,
            server: 15,
            archiver: 12
        }
    },
    {
        city: "Sao Paulo",
        lat: -23.5505,
        lon: -46.6333,
        region: "LACA",
        devices: {
            camera: 18,
            controller: 12,
            server: 5,
            archiver: 6
        }
    }
];

/* ============================================================
   2. MAP VARIABLES
   ============================================================ */

let realMap;
let cityMarkers = [];
let heatLayer = null;

/* region colors */
const regionColors = {
    APAC: "#0ea5e9",
    EMEA: "#34d399",
    NAMER: "#fb923c",
    LACA: "#a78bfa"
};

/* ============================================================
   3. INIT MAP
   ============================================================ */

function initRealMap() {
    realMap = L.map("realmap", { preferCanvas: true }).setView([20, 0], 2);

    L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 20 }
    ).addTo(realMap);

    renderCitySummary();       // DEFAULT VIEW
    populateGlobalCityList();  // Right-side panel
    drawRegionBadges();        // Region markers
    drawHeatmap();             // Heat default ON
    // ADD THIS LINE
    CITY_LIST.forEach(c => drawCityHighlight(c));

    L.control.scale().addTo(realMap);
}

/* ============================================================
   4. CITY SUMMARY MARKERS ONLY
   ============================================================ */

function renderCitySummary() {
    // clear markers
    cityMarkers.forEach(m => realMap.removeLayer(m));
    cityMarkers = [];

    CITY_LIST.forEach(c => {
        const total =
            c.devices.camera +
            c.devices.controller +
            c.devices.server +
            c.devices.archiver;

        const html = `
      <div style="
        background:#0f172a;
        color:white;
        padding:10px 12px;
        border-radius:12px;
        width:160px;
        box-shadow:0 4px 20px rgba(0,0,0,0.3);
        font-family:Inter;
      ">
        <div style="font-size:15px;font-weight:700">${c.city}</div>
        <div style="margin-top:6px;font-size:13px">
          <b>Total:</b> ${total}<br>
          Camera: ${c.devices.camera}<br>
          Controller: ${c.devices.controller}<br>
          Server: ${c.devices.server}<br>
          Archiver: ${c.devices.archiver}
        </div>
      </div>
    `;

        const icon = L.divIcon({
            html,
            className: "",
            iconSize: [170, 120],
            iconAnchor: [85, 60]
        });

        const marker = L.marker([c.lat, c.lon], { icon }).addTo(realMap);
        cityMarkers.push(marker);

        marker.on("click", () => {
            realMap.setView([c.lat, c.lon], 8);
            populateCityPanel(c.city);
        });
    });

    fitAllCities();
}

/* ============================================================
   5. HEATMAP
   ============================================================ */

function drawHeatmap() {
    const heatPoints = CITY_LIST.map(c => [
        c.lat,
        c.lon,
        0.8 // intensity
    ]);

    if (heatLayer) realMap.removeLayer(heatLayer);

    heatLayer = L.heatLayer(heatPoints, { radius: 35, blur: 25 }).addTo(realMap);
}

/* toggle */
function toggleHeat() {
    if (!heatLayer) return;
    if (realMap.hasLayer(heatLayer)) realMap.removeLayer(heatLayer);
    else realMap.addLayer(heatLayer);
}

/* ============================================================
   6. FIT ALL CITIES
   ============================================================ */

function fitAllCities() {
    const bounds = L.latLngBounds(
        CITY_LIST.map(c => [c.lat, c.lon])
    );
    realMap.fitBounds(bounds.pad(0.25));
}

/* ============================================================
   7. GLOBAL PANEL (CITY LIST)
   ============================================================ */

function populateGlobalCityList() {
    const panel = document.getElementById("region-panel-content");

    let html = `<h4>Global Devices</h4><hr>`;
    CITY_LIST.forEach(c => {
        const total = c.devices.camera + c.devices.controller + c.devices.server + c.devices.archiver;
        html += `
      <div class="city-item" onclick="onCityItemClick('${c.city}')">
        <div style="font-weight:700">${c.city}</div>
        <div class="small-muted">${c.region} • ${total} devices</div>
      </div>
    `;
    });

    panel.innerHTML = html;
}

/* ============================================================
   8. CITY PANEL DETAIL
   ============================================================ */

function onCityItemClick(cityName) {
    const c = CITY_LIST.find(x => x.city === cityName);
    if (c) realMap.setView([c.lat, c.lon], 8);
    populateCityPanel(cityName);
}

function populateCityPanel(cityName) {
    const panel = document.getElementById("region-panel-content");
    const c = CITY_LIST.find(x => x.city === cityName);
    if (!c) return;

    const total = c.devices.camera + c.devices.controller + c.devices.server + c.devices.archiver;

    panel.innerHTML = `
    <h4>${cityName} — ${total} devices</h4>
    <hr>
    <div><b>Camera:</b> ${c.devices.camera}</div>
    <div><b>Controller:</b> ${c.devices.controller}</div>
    <div><b>Server:</b> ${c.devices.server}</div>
    <div><b>Archiver:</b> ${c.devices.archiver}</div>
  `;
}

/* ============================================================
   9. REGION BADGES
   ============================================================ */

const regionCenter = {
    APAC: [20, 100],
    EMEA: [30, 10],
    NAMER: [40, -100],
    LACA: [-10, -60]
};

function drawRegionBadges() {
    Object.keys(regionCenter).forEach(region => {
        const devices = CITY_LIST
            .filter(c => c.region === region)
            .reduce((sum, c) => {
                return sum +
                    c.devices.camera +
                    c.devices.controller +
                    c.devices.server +
                    c.devices.archiver;
            }, 0);

        const html = `
      <div style="
        background:${regionColors[region]};
        padding:6px 12px;
        color:white;
        border-radius:8px;
        font-size:13px;
        text-align:center;
        font-weight:600;
      ">
        ${region}<br>${devices} devices
      </div>
    `;

        const marker = L.marker(regionCenter[region], {
            icon: L.divIcon({ html, className: "", iconSize: [120, 60], iconAnchor: [60, 30] })
        }).addTo(realMap);

        marker.on("click", () => populateRegionPanel(region));
    });
}

/* region panel */
function populateRegionPanel(region) {
    const panel = document.getElementById("region-panel-content");

    const cities = CITY_LIST.filter(c => c.region === region);

    let html = `<h4>${region} Region</h4><hr>`;

    cities.forEach(c => {
        const total = c.devices.camera + c.devices.controller + c.devices.server + c.devices.archiver;
        html += `
      <div class="city-item" onclick="onCityItemClick('${c.city}')">
        <b>${c.city}</b> — ${total} devices
      </div>
    `;
    });

    panel.innerHTML = html;
}



// /////////


function drawCityHighlight(cityObj) {
    const { city, lat, lon } = cityObj;

    // offset point slightly to place the label
    const labelLat = lat + 2.5;
    const labelLon = lon + 3;

    // 1. Draw dotted connection line
    const dotted = L.polyline(
        [
            [lat, lon],
            [labelLat, labelLon]
        ],
        {
            className: "city-dotted-path"
        }
    ).addTo(realMap);

    // 2. Create label box
    const devs = STATIC_DEVICES.filter(d => d.city === city);
    const total = devs.length;
    const online = devs.filter(d => d.status === "online").length;
    const inactive = total - online;

    const html = `
    <div class="city-label-box">
      <b>${city}</b><br>
      TOTAL: ${total}<br>
      ACTIVE: ${online}<br>
      INACTIVE: ${inactive}
    </div>
  `;

    L.marker([labelLat, labelLon], {
        icon: L.divIcon({
            html,
            className: "",
            iconAnchor: [0, 0]
        })
    }).addTo(realMap);
}



/* ============================================================
   10. BUTTON EVENTS
   ============================================================ */

document.getElementById("toggle-heat").onclick = toggleHeat;
document.getElementById("fit-all").onclick = fitAllCities;
document.getElementById("show-global").onclick = populateGlobalCityList;

/* ============================================================
   START MAP
   ============================================================ */
document.addEventListener("DOMContentLoaded", initRealMap);


// ########################
read below js code is our main code for getting real count throug the backne wiht the help of api so i want to use the real count in our world map to diplsy real time count 
ok 
// C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\script.js
const baseUrl = "http://localhost:80/api/regions";
let refreshInterval = 300000; // 5 minutes
let pingInterval = 60000; // 30 seconds
let countdownTime = refreshInterval / 1000; // Convert to seconds
let currentRegion = "global";
let deviceDetailsCache = {}; // Store previous details to prevent redundant updates
let latestDetails = null; // Cache the latest fetched details

document.addEventListener("DOMContentLoaded", () => {
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
function fetchData(regionName) {
    Promise.all([
        fetch(`${baseUrl}/summary/${regionName}`).then(res => res.json()),
        fetch(`${baseUrl}/details/${regionName}`).then(res => res.json()),
        fetch(`http://localhost/api/controllers/status`).then(res => res.json()) // <-- controllers endpoint
    ])
        .then(([summary, details, controllerData]) => {
            console.log("Summary Data:", summary);
            console.log("Details Data:", details);
            console.log("Controller Data:", controllerData);

            // Compute door + reader summary from controllers API
            const controllerExtras = processDoorAndReaderData(controllerData);

            // Attach extras into the same structure updateSummary expects:
            // updateSummary expects an object with a .summary property, so keep that shape.
            if (!summary.summary) summary.summary = {};
            summary.summary.controllerExtras = controllerExtras;

            // Update UI and details
            updateSummary(summary);

            if (JSON.stringify(details) !== JSON.stringify(deviceDetailsCache)) {
                updateDetails(details);
                deviceDetailsCache = details; // Update cache
            }
            latestDetails = details;
        })
        .catch((error) => console.error("Error fetching data:", error));
}

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
 // Fetch real-time status if available.
    fetch("http://localhost:80/api/region/devices/status")
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

                                read this all code carefully and write correct js code to map wokr on real dynamic count ok carefully.. 
