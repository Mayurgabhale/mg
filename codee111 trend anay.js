Redesigned Doors & Readers Dashboard

I'll create a more modern, clean, and responsive UI for your dashboard with improved visual hierarchy and user experience.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Doors & Readers Dashboard</title>
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
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      color: var(--text-light);
      font-size: 0.9rem;
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
        <i class="fas fa-users"></i>
        <span class="menu-text">Users</span>
      </li>
      <li class="menu-item">
        <i class="fas fa-history"></i>
        <span class="menu-text">Access Logs</span>
      </li>
      <li class="menu-item">
        <i class="fas fa-cog"></i>
        <span class="menu-text">Settings</span>
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
          <h1>Doors & Readers Dashboard</h1>
          <p>Monitor and manage access control systems</p>
        </div>
        
        <div class="page-actions">
          <button class="btn btn-outline">
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
    // Sidebar toggle functionality
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleSidebar = document.getElementById('toggleSidebar');
    
    toggleSidebar.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('expanded');
    });
    
    // Mobile sidebar toggle
    function handleResize() {
      if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
      } else {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
      }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    // Mock data for demonstration
    const mockControllers = [
      {
        id: 1,
        controllername: "Main Entrance Controller",
        IP_address: "192.168.1.101",
        controllerStatus: "Online",
        Doors: [
          { Door: "Front Door", Reader: "RFID-001", status: "Online" },
          { Door: "Side Door", Reader: "RFID-002", status: "Online" }
        ]
      },
      {
        id: 2,
        controllername: "Server Room Controller",
        IP_address: "192.168.1.102",
        controllerStatus: "Online",
        Doors: [
          { Door: "Server Room", Reader: "RFID-003", status: "Online" },
          { Door: "Backup Room", Reader: "RFID-004", status: "Offline" }
        ]
      },
      {
        id: 3,
        controllername: "Office Area Controller",
        IP_address: "192.168.1.103",
        controllerStatus: "Offline",
        Doors: [
          { Door: "Main Office", Reader: "RFID-005", status: "Offline" },
          { Door: "Conference Room", Reader: "RFID-006", status: "Offline" },
          { Door: "Break Room", Reader: "RFID-007", status: "Offline" }
        ]
      },
      {
        id: 4,
        controllername: "Parking Garage Controller",
        IP_address: "192.168.1.104",
        controllerStatus: "Online",
        Doors: [
          { Door: "Garage Entrance", Reader: "RFID-008", status: "Online" },
          { Door: "Garage Exit", Reader: "RFID-009", status: "Online" }
        ]
      }
    ];

    // Simulate API call with delay
    async function loadControllers() {
      try {
        // In a real application, you would fetch from your API
        // const res = await fetch('http://localhost/api/controllers/status');
        // const controllers = await res.json();
        
        // For demo purposes, using mock data with a delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 800));
        const controllers = mockControllers;
        
        renderSummary(controllers);
        renderControllers(controllers);
        renderChart(controllers);

        document.getElementById('controllerSearch').addEventListener('input', (e) => {
          const searchTerm = e.target.value.toLowerCase();
          const filtered = controllers.filter(c =>
            c.controllername.toLowerCase().includes(searchTerm) ||
            c.IP_address.toLowerCase().includes(searchTerm) ||
            c.Doors.some(d =>
              d.Door.toLowerCase().includes(searchTerm) ||
              (d.Reader && d.Reader.toLowerCase().includes(searchTerm))
            )
          );
          renderControllers(filtered);
        });
      } catch (err) {
        console.error(err);
        document.getElementById('controller-list').innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--danger);">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
            <h3>Failed to load data</h3>
            <p>Please check your connection and try again.</p>
          </div>
        `;
      }
    }

    function renderSummary(data) {
      const total = data.length;
      const online = data.filter(c => c.controllerStatus.toLow