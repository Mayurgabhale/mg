<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Device Dashboard</title>
  <link rel="icon" href="images/favicon.png" sizes="32x32" type="images/png">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    /* Theme Variables */
    :root {
      /* Dark Theme (Default) */
      --bg-primary: #0f172a;
      --bg-secondary: #1e293b;
      --bg-card: #1a1d29;
      --text-primary: #f1f5f9;
      --text-secondary: #94a3b8;
      --text-accent: #7c3aed;
      --border-color: #334155;
      --shadow: rgba(0, 0, 0, 0.3);
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --chart-bg: #0a0a0a;
    }

    .theme-light {
      /* Light Theme */
      --bg-primary: #f8fafc;
      --bg-secondary: #ffffff;
      --bg-card: #ffffff;
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --text-accent: #7c3aed;
      --border-color: #e2e8f0;
      --shadow: rgba(0, 0, 0, 0.1);
      --success: #059669;
      --warning: #d97706;
      --danger: #dc2626;
      --chart-bg: #f1f5f9;
    }

    /* Base Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Poppins', sans-serif;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      transition: all 0.3s ease;
      min-height: 100vh;
    }

    /* Layout */
    .container {
      display: flex;
      min-height: 100vh;
    }

    /* Sidebar Styles */
    .sidebar-toggle {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1001;
      background: var(--text-accent);
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px var(--shadow);
      transition: all 0.3s ease;
    }

    .sidebar-toggle:hover {
      transform: scale(1.05);
    }

    #sidebar {
      position: fixed;
      top: 0;
      left: -320px;
      width: 300px;
      height: 100vh;
      background: var(--bg-card);
      color: var(--text-primary);
      padding: 20px;
      overflow-y: auto;
      transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 4px 0 20px var(--shadow);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    #sidebar.active {
      left: 0;
    }

    .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, visibility 0.3s;
    }

    .sidebar-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    /* Main Content */
    #content {
      flex: 1;
      padding: 20px;
      transition: margin-left 0.3s ease;
      margin-left: 0;
    }

    #sidebar.active ~ #content {
      margin-left: 300px;
    }

    /* Details Section */
    .details-section {
      background: var(--bg-secondary);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 20px var(--shadow);
      border: 1px solid var(--border-color);
    }

    .details-header {
      display: flex;
      justify-content: between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .details-header h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-accent);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .details-header h2 i {
      font-size: 1.3rem;
    }

    #device-search {
      flex: 1;
      min-width: 250px;
      padding: 12px 16px;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      background: var(--bg-card);
      color: var(--text-primary);
      font-family: 'Poppins', sans-serif;
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }

    #device-search:focus {
      outline: none;
      border-color: var(--text-accent);
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    }

    #device-search::placeholder {
      color: var(--text-secondary);
    }

    .device-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    /* Graphs Section */
    .graphs-section {
      background: var(--chart-bg);
      color: var(--text-primary);
      padding: 24px;
      border-radius: 16px;
      margin: 20px 0;
      box-shadow: 0 6px 24px var(--shadow);
      border: 1px solid var(--border-color);
    }

    .graphs-title {
      color: var(--success);
      font-size: 1.4rem;
      margin-bottom: 20px;
      letter-spacing: 1px;
      font-weight: 700;
      text-align: center;
    }

    .graphs-grid.dashboard-layout {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 24px;
    }

    .left-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .bottom-row {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 20px;
    }

    /* Cards */
    .gcard {
      background: linear-gradient(135deg, var(--bg-card), var(--bg-secondary));
      border: 1px solid var(--border-color);
      padding: 20px;
      border-radius: 12px;
      min-height: 200px;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px var(--shadow);
    }

    .gcard:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px var(--shadow);
    }

    .gcard.wide {
      grid-column: span 1;
    }

    .gcard-title {
      font-size: 0.95rem;
      color: var(--text-secondary);
      margin: 0 0 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Semi Donut Gauges */
    .semi-donut {
      --percentage: 0;
      --active: var(--success);
      --inactive: var(--warning);
      width: 100%;
      height: 120px;
      position: relative;
      font-size: 18px;
      font-weight: 600;
      overflow: hidden;
      color: var(--active);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      margin: 10px 0;
    }

    .semi-donut::after {
      content: '';
      width: 200px;
      height: 200px;
      border: 30px solid;
      border-color: var(--inactive) var(--inactive) var(--active) var(--active);
      position: absolute;
      border-radius: 50%;
      left: 50%;
      transform: translateX(-50%) rotate(calc(-45deg + var(--percentage) * 1.8deg));
      animation: fillAnimation 1s ease-in;
    }

    @keyframes fillAnimation {
      from { transform: translateX(-50%) rotate(-45deg); }
      to { transform: translateX(-50%) rotate(calc(-45deg + var(--percentage) * 1.8deg)); }
    }

    .gtext {
      position: absolute;
      bottom: 10px;
      text-align: center;
      z-index: 2;
    }

    .gtext .total {
      font-size: 1.5rem;
      color: var(--success);
      display: block;
      font-weight: 700;
    }

    .gtext small {
      font-size: 0.8rem;
      color: var(--text-secondary);
      display: block;
    }

    /* Chart Placeholders */
    .chart-placeholder {
      height: 140px;
      background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
      border-radius: 8px;
      margin-top: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      font-size: 0.9rem;
      border: 1px dashed var(--border-color);
    }

    /* Theme Toggle */
    .theme-toggle {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1001;
      background: var(--text-accent);
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px var(--shadow);
      transition: all 0.3s ease;
    }

    .theme-toggle:hover {
      transform: scale(1.05);
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .graphs-grid.dashboard-layout {
        grid-template-columns: 1fr;
      }
      
      .bottom-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      #sidebar {
        width: 280px;
        left: -280px;
      }
      
      #sidebar.active ~ #content {
        margin-left: 0;
      }

      .sidebar-toggle {
        top: 15px;
        left: 15px;
        width: 45px;
        height: 45px;
      }

      .details-header {
        flex-direction: column;
        align-items: stretch;
      }

      #device-search {
        min-width: 100%;
      }

      .left-grid {
        grid-template-columns: 1fr;
      }

      .bottom-row {
        grid-template-columns: 1fr;
      }

      .graphs-grid.dashboard-layout {
        gap: 16px;
      }

      .gcard {
        min-height: 180px;
      }
    }

    @media (max-width: 480px) {
      #content {
        padding: 15px;
      }
      
      .details-section, .graphs-section {
        padding: 16px;
      }
      
      .device-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <!-- Sidebar Toggle Button -->
  <button class="sidebar-toggle" id="sidebarToggle">
    <i class="fas fa-bars"></i>
  </button>

  <!-- Theme Toggle -->
  <button class="theme-toggle" id="themeToggle">
    <i class="fas fa-moon"></i>
  </button>

  <!-- Sidebar Overlay -->
  <div class="sidebar-overlay" id="sidebarOverlay"></div>

  <!-- Sidebar -->
  <aside id="sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title"><i class="fas fa-sliders-h"></i> Controls</h2>
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

    <button class="nav-button" onclick="location.href='trend.html'"><i class="fas fa-chart-line"></i> View Trend Analysis</button>
    <button class="nav-button" onclick="location.href='summary.html'"><i class="fas fa-table"></i> View Devices Summary</button>
    <button class="nav-button" onclick="location.href='controllers.html'"><i class="fas fa-table"></i> View Devices Door</button>

    <div id="countdown" class="countdown-timer">Loading Timer...</div>

    <div class="filter-buttons">
      <button id="filter-all" class="status-filter active" data-status="all"><i class="fas fa-layer-group"></i> All Devices</button>
      <button id="filter-online" class="status-filter" data-status="online"><i class="fas fa-wifi"></i> Online Devices</button>
      <button id="filter-offline" class="status-filter" data-status="offline"><i class="fas fa-plug-circle-xmark"></i> Offline Devices</button>
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

      <div id="device-details" class="device-grid">Loading device data...</div>
      <div id="details-container" class="device-grid"></div>
    </section>

    <section id="main-graph" class="graphs-section">
      <div class="graphs-inner">
        <h2 class="graphs-title">DASHBOARD OVERVIEW</h2>

        <div class="graphs-grid dashboard-layout">
          <!-- Left: 2x2 small cards -->
          <div class="left-grid">
            <div class="gcard">
              <h4 class="gcard-title">Total No. of Cameras</h4>
              <div class="semi-donut gauge" id="gauge-cameras" data-fill="#12b76a" aria-label="Cameras gauge"
                style="--percentage:75; --fill:#12b76a">
                <div class="gtext">
                  <b class="total">245</b>
                  <small><span class="active">184</span> active / <span class="inactive">61</span> inactive</small>
                </div>
              </div>
            </div>

            <div class="gcard">
              <h4 class="gcard-title">Total No. of Archivers</h4>
              <div class="semi-donut gauge" id="gauge-archivers" data-fill="#12b76a"
                style="--percentage:82; --fill:#12b76a">
                <div class="gtext">
                  <b class="total">56</b>
                  <small><span class="active">46</span> active / <span class="inactive">10</span> inactive</small>
                </div>
              </div>
            </div>

            <div class="gcard">
              <h4 class="gcard-title">Total No. of Controllers</h4>
              <div class="semi-donut gauge" id="gauge-controllers" data-fill="#12b76a"
                style="--percentage:68; --fill:#12b76a">
                <div class="gtext">
                  <b class="total">89</b>
                  <small><span class="active">61</span> active / <span class="inactive">28</span> inactive</small>
                </div>
              </div>
            </div>
            
            <div class="gcard">
              <h4 class="gcard-title">TOTAL No. of CCURE</h4>
              <div class="semi-donut gauge" id="gauge-ccure" data-fill="#12b76a"
                style="--percentage:91; --fill:#12b76a">
                <div class="gtext">
                  <b class="total">34</b>
                  <small><span class="active">31</span> active / <span class="inactive">3</span> inactive</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom row: three wider charts -->
          <div class="bottom-row">
            <div class="gcard wide">
              <h4 class="gcard-title">Weekly Failures</h4>
              <div class="chart-placeholder">
                <i class="fas fa-chart-pie" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <div>Donut Chart Visualization</div>
              </div>
            </div>

            <div class="gcard wide">
              <h4 class="gcard-title">Failure Count</h4>
              <div class="chart-placeholder">
                <i class="fas fa-chart-line" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <div>Line Chart Visualization</div>
              </div>
            </div>

            <div class="gcard wide">
              <h4 class="gcard-title">LOC Count</h4>
              <div class="chart-placeholder">
                <i class="fas fa-chart-bar" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <div>Bar Chart Visualization</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <script>
    // Sidebar Toggle Functionality
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function openSidebar() {
      sidebar.classList.add('active');
      sidebarOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebarFunc() {
      sidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
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

    // Region button active state
    document.querySelectorAll('.region-button').forEach(button => {
      button.addEventListener('click', function() {
        document.querySelectorAll('.region-button').forEach(btn => {
          btn.classList.remove('active');
        });
        this.classList.add('active');
      });
    });

    // Status filter active state
    document.querySelectorAll('.status-filter').forEach(button => {
      button.addEventListener('click', function() {
        document.querySelectorAll('.status-filter').forEach(btn => {
          btn.classList.remove('active');
        });
        this.classList.add('active');
      });
    });

    // Initialize gauges with animation
    document.addEventListener('DOMContentLoaded', function() {
      const gauges = document.querySelectorAll('.semi-donut');
      gauges.forEach(gauge => {
        const percentage = gauge.style.getPropertyValue('--percentage');
        gauge.style.setProperty('--percentage', '0');
        
        setTimeout(() => {
          gauge.style.setProperty('--percentage', percentage);
        }, 300);
      });
    });
  </script>
</body>
</html>