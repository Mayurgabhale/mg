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
    /* Sidebar Styles */
    :root {
      --sidebar-bg-dark: #1a1d29;
      --sidebar-bg-light: #ffffff;
      --sidebar-text-dark: #e4e6eb;
      --sidebar-text-light: #333333;
      --sidebar-accent: #7c3aed;
      --sidebar-hover-dark: #2d3748;
      --sidebar-hover-light: #f1f5f9;
      --sidebar-border-dark: #2d3748;
      --sidebar-border-light: #e2e8f0;
      --sidebar-shadow: rgba(0, 0, 0, 0.1);
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Poppins', sans-serif;
      transition: background-color 0.3s, color 0.3s;
    }

    .sidebar-toggle {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1001;
      background: var(--sidebar-accent);
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
    }

    .sidebar-toggle:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    #sidebar {
      position: fixed;
      top: 0;
      left: -320px;
      width: 300px;
      height: 100vh;
      background: var(--sidebar-bg-dark);
      color: var(--sidebar-text-dark);
      padding: 20px;
      overflow-y: auto;
      transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 4px 0 20px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    #sidebar.active {
      left: 0;
    }

    .theme-light #sidebar {
      background: var(--sidebar-bg-light);
      color: var(--sidebar-text-light);
      box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
    }

    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding-bottom: 15px;
      border-bottom: 1px solid var(--sidebar-border-dark);
    }

    .theme-light .sidebar-header {
      border-bottom: 1px solid var(--sidebar-border-light);
    }

    .sidebar-title {
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--sidebar-accent);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .close-sidebar {
      background: none;
      border: none;
      color: var(--sidebar-text-dark);
      font-size: 1.5rem;
      cursor: pointer;
      transition: color 0.2s;
    }

    .theme-light .close-sidebar {
      color: var(--sidebar-text-light);
    }

    .close-sidebar:hover {
      color: var(--sidebar-accent);
    }

    .nav-button, .region-button, .status-filter {
      width: 100%;
      padding: 14px 16px;
      background: transparent;
      border: 1px solid var(--sidebar-border-dark);
      border-radius: 10px;
      color: var(--sidebar-text-dark);
      text-align: left;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Poppins', sans-serif;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .theme-light .nav-button,
    .theme-light .region-button,
    .theme-light .status-filter {
      border: 1px solid var(--sidebar-border-light);
      color: var(--sidebar-text-light);
    }

    .nav-button:hover, .region-button:hover, .status-filter:hover {
      background: var(--sidebar-hover-dark);
      transform: translateX(5px);
      border-color: var(--sidebar-accent);
    }

    .theme-light .nav-button:hover,
    .theme-light .region-button:hover,
    .theme-light .status-filter:hover {
      background: var(--sidebar-hover-light);
    }

    .region-button.active {
      background: var(--sidebar-accent);
      color: white;
      border-color: var(--sidebar-accent);
    }

    .status-filter.active {
      background: var(--sidebar-accent);
      color: white;
      border-color: var(--sidebar-accent);
    }

    .countdown-timer {
      padding: 15px;
      background: rgba(124, 58, 237, 0.1);
      border-radius: 10px;
      text-align: center;
      font-weight: 600;
      margin: 15px 0;
      border: 1px solid rgba(124, 58, 237, 0.2);
    }

    .theme-light .countdown-timer {
      background: rgba(124, 58, 237, 0.05);
    }

    .filter-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 10px 0;
    }

    #sidebar label {
      display: block;
      margin-top: 15px;
      margin-bottom: 8px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    #sidebar select {
      width: 100%;
      padding: 12px 15px;
      border-radius: 8px;
      border: 1px solid var(--sidebar-border-dark);
      background: var(--sidebar-bg-dark);
      color: var(--sidebar-text-dark);
      font-family: 'Poppins', sans-serif;
      margin-bottom: 5px;
      transition: all 0.3s;
    }

    .theme-light #sidebar select {
      background: var(--sidebar-bg-light);
      color: var(--sidebar-text-light);
      border: 1px solid var(--sidebar-border-light);
    }

    #sidebar select:focus {
      outline: none;
      border-color: var(--sidebar-accent);
      box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
    }

    /* Overlay when sidebar is open */
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

    /* Theme styles */
    .theme-light {
      background-color: #f8fafc;
      color: #333;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      #sidebar {
        width: 280px;
        left: -280px;
      }
      
      .sidebar-toggle {
        top: 15px;
        left: 15px;
        width: 45px;
        height: 45px;
      }
    }
  </style>
</head>
<body>
  <!-- Sidebar Toggle Button -->
  <button class="sidebar-toggle" id="sidebarToggle">
    <i class="fas fa-bars"></i>
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

  <!-- Rest of your content -->
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
    <!-- Your summary cards here -->
  </section>

  <div class="container">
    <!-- Main Content -->
    <main id="content">
      <!-- Your main content here -->
    </main>
  </div>

  <!-- Modal -->
  <div id="modal">
    <!-- Modal content -->
  </div>

  <!-- Footer -->
  <footer class="footer">
    <!-- Footer content -->
  </footer>

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
  </script>
</body>
</html>