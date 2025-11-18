this is my side bar ok i want desin this more atractivbe and balck and ligh theme ok 
    dont chagne any in this just i wan this and wiht button 
        i measn clikc buttin when i clik con ths side buttin that time opne the side bar ok.. 
with more atractive ok and primun desin 
            
<!-- Sidebar -->
    <aside id="sidebar">

      <button class="nav-button" id="toggle-main-btn"><i class="fas fa-window-maximize"></i>Device Details</button>
      <button class="region-button" data-region="global"><i class="fas fa-globe"></i> Global</button>
      <button class="region-button" data-region="apac"><i class="fas fa-map-marker-alt"></i> APAC</button>
      <button class="region-button" data-region="emea"><i class="fas fa-map-marker-alt"></i> EMEA</button>
      <button class="region-button" data-region="laca"><i class="fas fa-map-marker-alt"></i> LACA</button>
      <button class="region-button" data-region="namer"><i class="fas fa-map-marker-alt"></i> NAMER</button>

      <button class="nav-button" onclick="location.href='trend.html'"><i class="fas fa-chart-line"></i> View Trend
        Analysis</button>
      <button class="nav-button" onclick="location.href='summary.html'"><i class="fas fa-table"></i> View Devices
        Summary</button>
      <button class="nav-button" onclick="location.href='controllers.html'"><i class="fas fa-table"></i> View
        Devices
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
below is my all html file code ok

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
  <!-- <link rel="stylesheet" href="incss.css" /> -->

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">


  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">

  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

  <!-- inside <head> or before body end, add Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

</head>

<body>

  <button id="scrollToTopBtn" title="Go to top">
    <i class="bi bi-chevron-double-up"></i>
  </button>

  <div id="region-title" class="dashboard-header">
    <div class="region-logo">
    </div>
    <div class="header-controls">
      <button class="theme-toggle" id="themeToggle">
        <i class="fas fa-moon"></i>
      </button>
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
    <aside id="sidebar">

      <button class="nav-button" id="toggle-main-btn"><i class="fas fa-window-maximize"></i>Device Details</button>
      <button class="region-button" data-region="global"><i class="fas fa-globe"></i> Global</button>
      <button class="region-button" data-region="apac"><i class="fas fa-map-marker-alt"></i> APAC</button>
      <button class="region-button" data-region="emea"><i class="fas fa-map-marker-alt"></i> EMEA</button>
      <button class="region-button" data-region="laca"><i class="fas fa-map-marker-alt"></i> LACA</button>
      <button class="region-button" data-region="namer"><i class="fas fa-map-marker-alt"></i> NAMER</button>

      <button class="nav-button" onclick="location.href='trend.html'"><i class="fas fa-chart-line"></i> View Trend
        Analysis</button>
      <button class="nav-button" onclick="location.href='summary.html'"><i class="fas fa-table"></i> View Devices
        Summary</button>
      <button class="nav-button" onclick="location.href='controllers.html'"><i class="fas fa-table"></i> View
        Devices
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


    <!-- Main Content -->
    <main id="content">
      <section id="details-section" class="details-section">
        <div class="details-header">
          <h2><i class="fas fa-microchip"></i> Device Details</h2>
          <input type="text" id="device-search" placeholder="🔍 Search by IP, Location, City..." />
        </div>

        <div id="device-details" class="device-grid">Loading...</div>
        <div id="details-container" class="device-grid"></div>
      </section>


      <section id="main-graph" class="graphs-section">
        <div class="graphs-inner">
          <h2 class="graphs-title">DASHBOARD</h2>

          <div class="graphs-grid dashboard-layout">
            <!-- Left: 2x2 small cards -->
            <div class="left-grid">
              <div class="gcard">
                <h4 class="gcard-title">Total No. of Cameras</h4>
                <div class="semi-donut gauge" id="gauge-cameras" data-fill="#12b76a" aria-label="Cameras gauge"
                  style="--percentage:0; --fill:#12b76a">
                  <div class="gtext">
                    <b class="total">0</b>
                    <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
                  </div>
                </div>
                <!-- <div class="gcard-foot small">
                  <span class="muted">ACTIVE: <b id="camera-online">0</b></span>
                  <span class="muted">INACTIVE: <b id="camera-offline">0</b></span>
                </div> -->
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
                <!-- <div class="gcard-foot small">
                  <span class="muted">ACTIVE: <b id="archiver-online">0</b></span>
                  <span class="muted">INACTIVE: <b id="archiver-offline">0</b></span>
                </div> -->
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
                <!-- <div class="gcard-foot small">
                  <span class="muted">ACTIVE: <b id="controller-online">0</b></span>
                  <span class="muted">INACTIVE: <b id="controller-offline">0</b></span>
                </div> -->
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
                <!-- <div class="gcard-foot small">
                  <span class="muted">ACTIVE: <b id="server-online">0</b></span>
                  <span class="muted">INACTIVE: <b id="server-offline">0</b></span>
                </div> -->
              </div>
            </div>



            <!-- Bottom row: three wider charts -->
            <div class="bottom-row">
              <div class="gcard wide">
                <h4 class="gcard-title">Weekly Failures</h4>
                <div class="chart-placeholder"> <!-- simple donut placeholder or Chart.js chart --> </div>
              </div>

              <div class="gcard wide">
                <h4 class="gcard-title">Failure Count</h4>
                <div class="chart-placeholder"> <!-- scatter / line chart placeholder --> </div>
              </div>

              <div class="gcard wide">
                <h4 class="gcard-title">LOC Count</h4>
                <div class="chart-placeholder"> <!-- bar chart placeholder --> </div>
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



  <script src="script.js"></script>
  <script src="graph.js"></script>

  <script>
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
