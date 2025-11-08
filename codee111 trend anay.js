Access Control Dashboard with Location and City Segregation

I'll design a comprehensive dashboard with sidebar navigation, location/city segregation, and proper controller/door management based on your data structure.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Access Control Dashboard</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    :root {
      --primary: #4361ee;
      --primary-light: #4895ef;
      --secondary: #3a0ca3;
      --accent: #f72585;
      --success: #4cc9f0;
      --success-light: #2dce89;
      --danger: #f5385c;
      --warning: #ffb300;
      --bg: #f8f9fe;
      --card-bg: #ffffff;
      --border: #e9ecef;
      --text: #2b2d42;
      --text-light: #6c757d;
      --sidebar-width: 260px;
      --header-height: 70px;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      display: flex;
      min-height: 100vh;
    }

    /* Sidebar */
    .sidebar {
      width: var(--sidebar-width);
      background: linear-gradient(180deg, var(--primary), var(--secondary));
      color: white;
      padding: 25px 0;
      position: fixed;
      height: 100vh;
      overflow-y: auto;
      transition: all 0.3s ease;
      z-index: 1000;
    }

    .sidebar.collapsed {
      width: 70px;
    }

    .sidebar-header {
      padding: 0 25px 25px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 25px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.3rem;
      font-weight: 700;
    }

    .logo i {
      font-size: 1.8rem;
    }

    .sidebar-menu {
      list-style: none;
    }

    .menu-item {
      padding: 12px 25px;
      display: flex;
      align-items: center;
      gap: 15px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .menu-item:hover, .menu-item.active {
      background-color: rgba(255, 255, 255, 0.1);
      border-left: 4px solid var(--accent);
    }

    .menu-item i {
      width: 20px;
      text-align: center;
    }

    .menu-text {
      transition: opacity 0.3s;
    }

    .sidebar.collapsed .menu-text {
      opacity: 0;
      width: 0;
      overflow: hidden;
    }

    .sidebar-footer {
      padding: 20px 25px 0;
      margin-top: 30px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.7);
    }

    /* Main Content */
    .main-content {
      flex: 1;
      margin-left: var(--sidebar-width);
      transition: margin-left 0.3s ease;
    }

    .main-content.expanded {
      margin-left: 70px;
    }

    /* Top Bar */
    .top-bar {
      height: var(--header-height);
      background: var(--card-bg);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .toggle-sidebar {
      background: none;
      border: none;
      font-size: 1.2rem;
      color: var(--text);
      cursor: pointer;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }

    /* Content Area */
    .content {
      padding: 30px;
    }

    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .page-title h1 {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--text);
    }

    .page-title p {
      color: var(--text-light);
      margin-top: 5px;
    }

    .page-actions {
      display: flex;
      gap: 15px;
    }

    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      border: none;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
    }

    .btn-primary:hover {
      background: var(--primary-light);
    }

    .btn-outline {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text);
    }

    .btn-outline:hover {
      background: var(--bg);
    }

    /* Filters */
    .filters-container {
      display: flex;
      gap: 15px;
      margin-bottom: 25px;
      flex-wrap: wrap;
    }

    .filter-select {
      padding: 10px 15px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--card-bg);
      color: var(--text);
      font-size: 0.9rem;
      min-width: 180px;
      outline: none;
    }

    .filter-select:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
    }

    /* SUMMARY SECTION */
    .summary-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .summary-card {
      background: var(--card-bg);
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      gap: 20px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      border-left: 4px solid var(--primary);
    }

    .summary-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    }

    .summary-card:nth-child(2) {
      border-left-color: var(--success-light);
    }

    .summary-card:nth-child(3) {
      border-left-color: var(--warning);
    }

    .summary-card:nth-child(4) {
      border-left-color: var(--accent);
    }

    .summary-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      color: white;
      background: var(--primary);
    }

    .summary-card:nth-child(2) .summary-icon {
      background: var(--success-light);
    }

    .summary-card:nth-child(3) .summary-icon {
      background: var(--warning);
    }

    .summary-card:nth-child(4) .summary-icon {
      background: var(--accent);
    }

    .summary-content h3 {
      font-size: 0.9rem;
      color: var(--text-light);
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .summary-content p {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--text);
    }

    /* SEARCH BAR */
    .search-container {
      position: relative;
      margin-bottom: 30px;
    }

    .search-container input {
      padding: 15px 20px 15px 50px;
      width: 100%;
      border: 1px solid var(--border);
      border-radius: 12px;
      font-size: 1rem;
      outline: none;
      transition: 0.3s;
      background: var(--card-bg);
    }

    .search-container input:focus {
      box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
      border-color: var(--primary);
    }

    .search-icon {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-light);
    }

    /* CONTROLLERS GRID */
    .controller-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 25px;
      margin-bottom: 50px;
    }

    .controller-card {
      background: var(--card-bg);
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      padding: 25px;
      transition: 0.3s;
      border-top: 5px solid var(--primary);
    }

    .controller-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    }

    .controller-card.offline {
      border-top-color: var(--danger);
    }

    .controller-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .controller-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .controller-title h3 {
      font-size: 1.2rem;
      color: var(--text);
    }

    .controller-title i {
      color: var(--primary);
    }

    .status-badge {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
      text-transform: uppercase;
    }

    .status-online { 
      background: var(--success-light);
      box-shadow: 0 2px 8px rgba(45, 206, 137, 0.3);
    }
    
    .status-offline { 
      background: var(--danger);
      box-shadow: 0 2px 8px rgba(245, 56, 92, 0.3);
    }

    .controller-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 20px;
      color: var(--text-light);
      font-size: 0.9rem;
    }

    .controller-info-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .door-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 15px;
    }

    .door-card {
      background: #f8f9fb;
      border: 1px solid #eee;
      border-radius: 10px;
      padding: 15px;
      font-size: 0.85rem;
      transition: all 0.2s;
      border-left: 3px solid var(--accent);
    }

    .door-card:hover { 
      background: #f1f7ff; 
      transform: translateY(-2px);
    }

    .door-name { 
      font-weight: 600; 
      color: var(--text);
      margin-bottom: 5px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .door-info { 
      color: var(--text-light); 
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 5px;
    }

    .door-status {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .status-on { color: var(--success-light); }
    .status-off { color: var(--danger); }

    /* CHART SECTION */
    .chart-section {
      background: var(--card-bg);
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      padding: 30px;
      margin-bottom: 30px;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
    }

    .chart-header h3 {
      font-size: 1.3rem;
      color: var(--text);
    }

    .chart-container {
      max-width: 400px;
      margin: 0 auto;
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .sidebar {
        width: 70px;
      }
      
      .main-content {
        margin-left: 70px;
      }
      
      .menu-text {
        opacity: 0;
        width: 0;
        overflow: hidden;
      }
      
      .logo span {
        display: none;
      }
      
      .sidebar-header {
        padding: 0 15px 25px;
      }
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }
      
      .main-content {
        margin-left: 0;
      }
      
      .sidebar.mobile-open {
        transform: translateX(0);
      }
      
      .controller-grid {
        grid-template-columns: 1fr;
      }
      
      .summary-section {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }
      
      .page-actions {
        width: 100%;
        justify-content: space-between;
      }
      
      .filters-container {
        flex-direction: column;
      }
      
      .filter-select {
        width: 100%;
      }
    }

    @media (max-width: 576px) {
      .summary-section {
        grid-template-columns: 1fr;
      }
      
      .content {
        padding: 20px;
      }
      
      .door-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>

<body>
  <!-- Sidebar -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <i class="fas fa-door-open"></i>
        <span>Access Control</span>
      </div>
    </div>
    
    <ul class="sidebar-menu">
      <li class="menu-item active">
        <i class="fas fa-th-large"></i>
        <span class="menu-text">Dashboard</span>
      </li>
      <li class="menu-item">
        <i class="fas fa-server"></i>
        <span class="menu-text">Controllers</span>
      </li>
      <li class="menu-item">
        <i class="fas fa-door-closed"></i>
        <span class="menu-text">Doors</span>
      </li>
      <li class="menu-item">
        <i class="fas fa-id-card"></i>
        <span class="menu-text">Readers</span>
      </li>
      <li class="menu-item">
        <i class="fas fa-map-marker-alt"></i>
        <span class="menu-text">Locations</span>
      </li>
    </ul>
    
    <div class="sidebar-footer">
      <p>© 2025 VisionWatch</p>
      <p><strong>Western Union Services India Pvt Ltd.</strong></p>
    </div>
  </aside>

  <!-- Main Content -->
  <div class="main-content" id="mainContent">
    <!-- Top Bar -->
    <div class="top-bar">
      <button class="toggle-sidebar" id="toggleSidebar">
        <i class="fas fa-bars"></i>
      </button>
      
      <div class="user-info">
        <div class="user-avatar">AD</div>
        <div>
          <div>Admin User</div>
          <div style="font-size: 0.8rem; color: var(--text-light);">System Administrator</div>
        </div>
      </div>
    </div>
    
    <!-- Content Area -->
    <div class="content">
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title">
          <h1>Access Control Dashboard</h1>
          <p>Monitor and manage access control systems</p>
        </div>
        
        <div class="page-actions">
          <button class="btn btn-outline" id="refreshBtn">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
          <button class="btn btn-primary">
            <i class="fas fa-plus"></i> Add Controller
          </button>
        </div>
      </div>
      
      <!-- Summary Cards -->
      <section class="summary-section">
        <div class="summary-card">
          <div class="summary-icon">
            <i class="fas fa-server"></i>
          </div>
          <div class="summary-content">
            <h3>Total Controllers</h3>
            <p id="totalControllers">0</p>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="summary-icon">
            <i class="fas fa-plug-circle-bolt"></i>
          </div>
          <div class="summary-content">
            <h3>Online Controllers</h3>
            <p id="onlineControllers">0</p>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="summary-icon">
            <i class="fas fa-door-closed"></i>
          </div>
          <div class="summary-content">
            <h3>Total Doors</h3>
            <p id="totalDoors">0</p>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="summary-icon">
            <i class="fas fa-id-badge"></i>
          </div>
          <div class="summary-content">
            <h3>Total Readers</h3>
            <p id="totalReaders">0</p>
          </div>
        </div>
      </section>
      
      <!-- Filters -->
      <div class="filters-container">
        <select class="filter-select" id="locationFilter">
          <option value="">All Locations</option>
        </select>
        
        <select class="filter-select" id="cityFilter">
          <option value="">All Cities</option>
        </select>
        
        <select class="filter-select" id="statusFilter">
          <option value="">All Status</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>
      </div>
      
      <!-- Search Bar -->
      <div class="search-container">
        <i class="fas fa-search search-icon"></i>
        <input type="text" id="controllerSearch" placeholder="Search by controller, door, or reader..." />
      </div>
      
      <!-- Controllers Grid -->
      <section id="controller-list" class="controller-grid">Loading controllers...</section>
      
      <!-- Chart Section -->
      <section class="chart-section">
        <div class="chart-header">
          <h3>Controller Status Overview</h3>
          <div class="chart-actions">
            <button class="btn btn-outline">
              <i class="fas fa-download"></i> Export
            </button>
          </div>
        </div>
        <div class="chart-container">
          <canvas id="statusChart"></canvas>
        </div>
      </section>
    </div>
  </div>

  <script>
    // Sample data (replace with your actual data)
    const controllersData = [
      {
        "controllername": "IN-PUN-2NDFLR-ISTAR PRO",
        "IP_address": "10.199.13.10",
        "Location": "APAC",
        "City": "Pune 2nd Floor",
        "controllerStatus": "Online",
        "Doors": [
          {
            "Door": "APAC_IN_PUN_2NDFLR_IDF ROOM_10:05:86 Restricted Door",
            "Reader": "in:1",
            "status": "Online"
          },
          {
            "Door": "APAC_IN_PUN_2NDFLR_UPS/ELEC ROOM Restricted Door_10:05:FE",
            "Reader": "in:1",
            "status": "Online"
          },
          {
            "Door": "APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR_10:05:4B",
            "Reader": "in:1",
            "status": "Online"
          },
          {
            "Door": "APAC_IN_PUN_2NDFLR_RECPTION TO WORKSTATION DOOR_10:05:4B",
            "Reader": "out:1",
            "status": "Online"
          },
          {
            "Door": "APAC_IN_PUN_2NDFLR_LIFTLOBBY TO RECEPTION EMTRY DOOR_10:05:74",
            "Reader": "in:1",
            "status": "Online"
          },
          {
            "Door": "APAC_IN_PUN_2NDFLR_LIFTLOBBY TO WORKSTATION DOOR_10:05:F0",
            "Reader": "",
            "status": "Online"
          }
        ]
      },
      {
        "controllername": "IN-PUN-PODIUM-ISTAR PRO-01",
        "IP_address": "10.199.8.20",
        "Location": "APAC",
        "City": "Pune Podium",
        "controllerStatus": "Online",
        "Doors": [
          {
            "Door": "APAC_IN-PUN-PODIUM-RED-RECREATION AREA FIRE EXIT 1-DOOR",
            "Reader": "",
            "status": "Online"
          },
          {
            "Door": "APAC_IN_PUN_PODIUM_RED_IDF ROOM-02-Restricted Door",
            "Reader": "in:1",
            "status": "Online"
          },
          {
            "Door": "APAC_IN-PUN-PODIUM-MAIN PODIUM LEFT ENTRY-DOOR",
            "Reader": "in:1",
            "status": "Online"
          },
          {
            "Door": "APAC_IN_PUN_PODIUM_MAIN PODIUM RIGHT ENTRY-DOOR",
            "Reader": "in:1",
            "status": "Online"
          },
          {
            "Door": "APAC_IN-PUN-PODIUM-RED-RECEPTION TO WS ENTRY 1-DOOR",
            "Reader": "",
            "status": "Online"
          },
          {
            "Door": "APAC_IN_PUN_PODIUM_ST2 DOOR 1 (RED)",
            "Reader": "in:1",
            "status": "Online"
          },
          {
            "Door": "APAC_IN_PUN_PODIUM_RED_MAIN LIFT LOBBY ENTRY 1-DOOR",
            "Reader": "in:1",
            "status": "Online"
          },
          {
            "Door": "APAC_IN_PUN_PODIUM_RED_MAIN LIFT LOBBY ENTRY 1-DOOR",
            "Reader": "out:1",
            "status": "Online"