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
      --secondary: #3f37c9;
      --accent: #f72585;
      --success: #4cc9f0;
      --success-dark: #3a86ff;
      --warning: #f8961e;
      --danger: #f94144;
      --bg: #f8f9fa;
      --card-bg: #ffffff;
      --border: #e9ecef;
      --text: #2b2d42;
      --text-light: #6c757d;
      --shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      --radius: 12px;
      --transition: all 0.3s ease;
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
      line-height: 1.6;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* HEADER */
    header {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      padding: 18px 0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo i {
      font-size: 1.8rem;
    }

    .logo h1 {
      font-size: 1.6rem;
      font-weight: 700;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .notification {
      position: relative;
      cursor: pointer;
    }

    .notification i {
      font-size: 1.3rem;
    }

    .notification-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: var(--accent);
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 0.7rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    /* MAIN CONTENT */
    main {
      padding: 30px 0;
    }

    /* DASHBOARD OVERVIEW */
    .dashboard-overview {
      margin-bottom: 40px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 25px;
    }

    .section-title h2 {
      font-size: 1.5rem;
      font-weight: 600;
    }

    .section-title i {
      color: var(--primary);
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .summary-card {
      background: var(--card-bg);
      border-radius: var(--radius);
      padding: 25px;
      box-shadow: var(--shadow);
      display: flex;
      align-items: center;
      gap: 20px;
      transition: var(--transition);
      border-left: 4px solid var(--primary);
    }

    .summary-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .summary-card.controllers {
      border-left-color: var(--primary);
    }

    .summary-card.online {
      border-left-color: var(--success-dark);
    }

    .summary-card.doors {
      border-left-color: var(--warning);
    }

    .summary-card.readers {
      border-left-color: var(--accent);
    }

    .summary-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
    }

    .summary-icon.controllers {
      background: var(--primary);
    }

    .summary-icon.online {
      background: var(--success-dark);
    }

    .summary-icon.doors {
      background: var(--warning);
    }

    .summary-icon.readers {
      background: var(--accent);
    }

    .summary-content h3 {
      font-size: 0.9rem;
      color: var(--text-light);
      margin-bottom: 5px;
    }

    .summary-content p {
      font-size: 1.8rem;
      font-weight: 700;
    }

    /* QUICK ACTIONS */
    .quick-actions {
      margin-bottom: 40px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .action-btn {
      background: var(--card-bg);
      border: none;
      border-radius: var(--radius);
      padding: 15px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      transition: var(--transition);
    }

    .action-btn:hover {
      background: var(--primary);
      color: white;
      transform: translateY(-3px);
    }

    .action-btn i {
      font-size: 1.5rem;
    }

    .action-btn span {
      font-size: 0.9rem;
      font-weight: 500;
    }

    /* SEARCH & FILTER */
    .search-filter {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 300px;
      position: relative;
    }

    .search-box input {
      width: 100%;
      padding: 12px 20px 12px 45px;
      border: 1px solid var(--border);
      border-radius: 30px;
      font-size: 1rem;
      outline: none;
      transition: var(--transition);
      background: var(--card-bg);
    }

    .search-box input:focus {
      box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
      border-color: var(--primary);
    }

    .search-box i {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-light);
    }

    .filter-dropdown {
      position: relative;
    }

    .filter-btn {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 30px;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: var(--transition);
    }

    .filter-btn:hover {
      background: #f1f3f9;
    }

    /* CONTROLLERS GRID */
    .controllers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 25px;
      margin-bottom: 40px;
    }

    .controller-card {
      background: var(--card-bg);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      overflow: hidden;
      transition: var(--transition);
    }

    .controller-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .controller-header {
      padding: 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .controller-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .controller-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(67, 97, 238, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
    }

    .controller-details h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 3px;
    }

    .controller-details p {
      font-size: 0.85rem;
      color: var(--text-light);
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
      text-transform: uppercase;
    }

    .status-online {
      background: var(--success-dark);
    }

    .status-offline {
      background: var(--danger);
    }

    .controller-body {
      padding: 20px;
    }

    .doors-title {
      font-size: 0.9rem;
      color: var(--text-light);
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .doors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 12px;
    }

    .door-card {
      background: #f8f9fa;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px;
      transition: var(--transition);
    }

    .door-card:hover {
      background: #f1f3f9;
    }

    .door-name {
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 5px;
    }

    .door-info {
      color: var(--text-light);
      font-size: 0.8rem;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .door-status {
      font-size: 0.75rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .door-status.online {
      color: var(--success-dark);
    }

    .door-status.offline {
      color: var(--danger);
    }

    /* CHARTS SECTION */
    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 25px;
      margin-bottom: 40px;
    }

    .chart-card {
      background: var(--card-bg);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 25px;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .chart-header h3 {
      font-size: 1.1rem;
      font-weight: 600;
    }

    .chart-container {
      height: 250px;
      position: relative;
    }

    /* RECENT ACTIVITY */
    .recent-activity {
      margin-bottom: 40px;
    }

    .activity-list {
      background: var(--card-bg);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 20px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px 0;
      border-bottom: 1px solid var(--border);
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .activity-icon.success {
      background: var(--success-dark);
    }

    .activity-icon.warning {
      background: var(--warning);
    }

    .activity-icon.danger {
      background: var(--danger);
    }

    .activity-content {
      flex: 1;
    }

    .activity-content p {
      font-size: 0.9rem;
      margin-bottom: 3px;
    }

    .activity-time {
      font-size: 0.8rem;
      color: var(--text-light);
    }

    /* FOOTER */
    footer {
      background: var(--card-bg);
      border-top: 1px solid var(--border);
      padding: 25px 0;
      margin-top: 50px;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .footer-logo i {
      color: var(--primary);
      font-size: 1.5rem;
    }

    .footer-logo span {
      font-weight: 600;
    }

    .footer-links {
      display: flex;
      gap: 20px;
    }

    .footer-links a {
      color: var(--text-light);
      text-decoration: none;
      font-size: 0.9rem;
      transition: var(--transition);
    }

    .footer-links a:hover {
      color: var(--primary);
    }

    .copyright {
      color: var(--text-light);
      font-size: 0.9rem;
    }

    /* RESPONSIVE DESIGN */
    @media (max-width: 1200px) {
      .charts-section {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
      }

      .summary-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .controllers-grid {
        grid-template-columns: 1fr;
      }

      .search-filter {
        flex-direction: column;
      }

      .search-box {
        min-width: 100%;
      }
    }

    @media (max-width: 576px) {
      .summary-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .footer-content {
        flex-direction: column;
        text-align: center;
      }
    }
  </style>
</head>

<body>
  <header>
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <i class="fas fa-door-open"></i>
          <h1>Access Control Dashboard</h1>
        </div>
        <div class="user-info">
          <div class="notification">
            <i class="fas fa-bell"></i>
            <span class="notification-badge">3</span>
          </div>
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="container">
    <!-- DASHBOARD OVERVIEW -->
    <section class="dashboard-overview">
      <div class="section-title">
        <i class="fas fa-tachometer-alt"></i>
        <h2>Dashboard Overview</h2>
      </div>
      
      <div class="summary-grid">
        <div class="summary-card controllers">
          <div class="summary-icon controllers">
            <i class="fas fa-server"></i>
          </div>
          <div class="summary-content">
            <h3>Total Controllers</h3>
            <p id="totalControllers">0</p>
          </div>
        </div>
        
        <div class="summary-card online">
          <div class="summary-icon online">
            <i class="fas fa-plug-circle-bolt"></i>
          </div>
          <div class="summary-content">
            <h3>Online Controllers</h3>
            <p id="onlineControllers">0</p>
          </div>
        </div>
        
        <div class="summary-card doors">
          <div class="summary-icon doors">
            <i class="fas fa-door-closed"></i>
          </div>
          <div class="summary-content">
            <h3>Total Doors</h3>
            <p id="totalDoors">0</p>
          </div>
        </div>
        
        <div class="summary-card readers">
          <div class="summary-icon readers">
            <i class="fas fa-id-badge"></i>
          </div>
          <div class="summary-content">
            <h3>Total Readers</h3>
            <p id="totalReaders">0</p>
          </div>
        </div>
      </div>
      
      <!-- QUICK ACTIONS -->
      <div class="quick-actions">
        <div class="actions-grid">
          <button class="action-btn">
            <i class="fas fa-plus-circle"></i>
            <span>Add Controller</span>
          </button>
          <button class="action-btn">
            <i class="fas fa-cog"></i>
            <span>System Settings</span>
          </button>
          <button class="action-btn">
            <i class="fas fa-history"></i>
            <span>Access Logs</span>
          </button>
          <button class="action-btn">
            <i class="fas fa-user-shield"></i>
            <span>User Management</span>
          </button>
        </div>
      </div>
    </section>

    <!-- SEARCH & FILTER -->
    <section class="search-filter">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input type="text" id="controllerSearch" placeholder="Search by controller, door, or reader..." />
      </div>
      <div class="filter-dropdown">
        <button class="filter-btn">
          <i class="fas fa-filter"></i>
          <span>Filter by Status</span>
          <i class="fas fa-chevron-down"></i>
        </button>
      </div>
    </section>

    <!-- CONTROLLERS LIST -->
    <section id="controller-list" class="controllers-grid">
      Loading controllers...
    </section>

    <!-- CHARTS SECTION -->
    <section class="charts-section">
      <div class="chart-card">
        <div class="chart-header">
          <h3>Controller Status Overview</h3>
        </div>
        <div class="chart-container">
          <canvas id="statusChart"></canvas>
        </div>
      </div>
      
      <div class="chart-card">
        <div class="chart-header">
          <h3>Door Activity</h3>
        </div>
        <div class="chart-container">
          <canvas id="activityChart"></canvas>
        </div>
      </div>
    </section>

    <!-- RECENT ACTIVITY -->
    <section class="recent-activity">
      <div class="section-title">
        <i class="fas fa-clock"></i>
        <h2>Recent Activity</h2>
      </div>
      
      <div class="activity-list">
        <div class="activity-item">
          <div class="activity-icon success">
            <i class="fas fa-door-open"></i>
          </div>
          <div class="activity-content">
            <p>Door <strong>Main Entrance</strong> accessed by John Smith</p>
            <div class="activity-time">2 minutes ago</div>
          </div>
        </div>
        
        <div class="activity-item">
          <div class="activity-icon warning">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="activity-content">
            <p>Controller <strong>North Wing</strong> connection unstable</p>
            <div class="activity-time">15 minutes ago</div>
          </div>
        </div>
        
        <div class="activity-item">
          <div class="activity-icon success">
            <i class="fas fa-user-check"></i>
          </div>
          <div class="activity-content">
            <p>User <strong>Sarah Johnson</strong> added to access group</p>
            <div class="activity-time">1 hour ago</div>
          </div>
        </div>
        
        <div class="activity-item">
          <div class="activity-icon danger">
            <i class="fas fa-door-closed"></i>
          </div>
          <div class="activity-content">
            <p>Door <strong>Storage Room</strong> forced open attempt</p>
            <div class="activity-time">3 hours ago</div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      <div class="footer-content">
        <div class="footer-logo">
          <i class="fas fa-shield-alt"></i>
          <span>VisionWatch</span>
        </div>
        
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Support</a>
        </div>
        
        <div class="copyright">
          © 2025 VisionWatch | <strong style="color:var(--primary)">Western Union Services India Pvt Ltd.</strong>
        </div>
      </div>
    </div>
  </footer>

  <script>
    async function loadControllers() {
      try {
        const res = await fetch('http://localhost/api/controllers/status');
        const controllers = await res.json();
        renderSummary(controllers);
        renderControllers(controllers);
        renderCharts(controllers);

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
        document.getElementById('controller-list').textContent = '⚠️ Failed to load data.';
      }
    }

    function renderSummary(data) {
      const total = data.length;
      const online = data.filter(c => c.controllerStatus.toLowerCase() 