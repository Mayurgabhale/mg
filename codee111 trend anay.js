<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Doors & Readers Dashboard</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    /* ========== GLOBAL STYLES ========== */
    :root {
      --primary: #007bff;
      --secondary: #00bcd4;
      --accent: #ffc107;
      --success: #4caf50;
      --danger: #f44336;
      --bg: #f5f7fa;
      --card-bg: rgba(255, 255, 255, 0.9);
      --text: #2d2d2d;
      --border: #e0e0e0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: "Inter", "Segoe UI", sans-serif;
      background: linear-gradient(135deg, #f3f6ff, #eef2f7);
      color: var(--text);
    }

    /* ========== HEADER ========== */
    header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      color: #fff;
      padding: 16px 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    header h1 {
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .search-bar {
      position: relative;
    }

    .search-bar input {
      padding: 10px 40px 10px 16px;
      border-radius: 20px;
      border: none;
      font-size: 1rem;
      width: 280px;
      transition: 0.3s;
    }

    .search-bar input:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(255,255,255,0.3);
    }

    .search-bar i {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #555;
    }

    /* ========== MAIN CONTENT ========== */
    main {
      padding: 30px;
      max-width: 1200px;
      margin: auto;
    }

    /* ========== SUMMARY CARDS ========== */
    .summary-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .summary-card {
      background: var(--card-bg);
      backdrop-filter: blur(8px);
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      box-shadow: 0 8px 20px rgba(0,0,0,0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .summary-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }

    .summary-card i {
      font-size: 2.2rem;
      color: var(--primary);
      margin-bottom: 10px;
    }

    .summary-card h3 {
      font-size: 1rem;
      margin-bottom: 6px;
      color: #444;
    }

    .summary-card p {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--text);
    }

    /* ========== CONTROLLER GRID ========== */
    .controller-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .controller-card {
      background: var(--card-bg);
      border-radius: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      padding: 20px;
      border: 1px solid var(--border);
      transition: 0.3s;
    }

    .controller-card:hover {
      transform: scale(1.02);
      box-shadow: 0 6px 18px rgba(0,0,0,0.1);
    }

    .controller-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
      text-transform: uppercase;
    }

    .status-online { background: var(--success); }
    .status-offline { background: var(--danger); }

    .door-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 10px;
      margin-top: 10px;
    }

    .door-card {
      background: #f9fafe;
      border-radius: 10px;
      padding: 10px;
      border: 1px solid #ececec;
      transition: background 0.2s;
    }

    .door-card:hover { background: #eef5ff; }
    .door-name { font-weight: 600; color: var(--primary); }
    .door-info { font-size: 0.8rem; color: #666; }

    /* ========== CHART SECTION ========== */
    .chart-section {
      margin-top: 60px;
      text-align: center;
    }

    .chart-section h3 {
      margin-bottom: 20px;
      font-weight: 600;
      color: #333;
    }

    canvas {
      max-width: 400px;
      margin: auto;
    }

    /* ========== FOOTER ========== */
    footer {
      margin-top: 50px;
      text-align: center;
      padding: 20px;
      font-size: 0.9rem;
      color: #666;
      border-top: 1px solid #e0e0e0;
    }

    footer strong { color: var(--primary); }
  </style>
</head>
<body>
  <header>
    <h1><i class="fas fa-door-open"></i> Doors & Readers Dashboard</h1>
    <div class="search-bar">
      <input type="text" id="controllerSearch" placeholder="Search controllers, doors, or readers..." />
      <i class="fas fa-search"></i>
    </div>
  </header>

  <main>
    <!-- Summary Section -->
    <section class="summary-section">
      <div class="summary-card">
        <i class="fas fa-server"></i>
        <h3>Total Controllers</h3>
        <p id="totalControllers">0</p>
      </div>
      <div class="summary-card">
        <i class="fas fa-signal"></i>
        <h3>Online Controllers</h3>
        <p id="onlineControllers">0</p>
      </div>
      <div class="summary-card">
        <i class="fas fa-door-closed"></i>
        <h3>Total Doors</h3>
        <p id="totalDoors">0</p>
      </div>
      <div class="summary-card">
        <i class="fas fa-id-badge"></i>
        <h3>Total Readers</h3>
        <p id="totalReaders">0</p>
      </div>
    </section>

    <!-- Controller List -->
    <section id="controller-list" class="controller-grid">Loading controllers...</section>

    <!-- Chart Section -->
    <section class="chart-section">
      <h3>Controller Status Overview</h3>
      <canvas id="statusChart"></canvas>
    </section>
  </main>

  <footer>
    © 2025 VisionWatch | <strong>Western Union Services India Pvt Ltd.</strong>
  </footer>

  <script>
    async function loadControllers() {
      try {
        const res = await fetch('http://localhost/api/controllers/status');
        const controllers = await res.json();
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
        document.getElementById('controller-list').textContent = '⚠️ Failed to load data.';
      }
    }

    function renderSummary(data) {
      const total = data.length;
      const online = data.filter(c => c.controllerStatus.toLowerCase() === 'online').length;
      const doors = data.reduce((sum, c) => sum + c.Doors.length, 0);
      const readers = data.reduce((sum, c) => sum + c.Doors.filter(d => d.Reader).length, 0);
      document.getElementById('totalControllers').textContent = total;
      document.getElementById('onlineControllers').textContent = online;
      document.getElementById('totalDoors').textContent = doors;
      document.getElementById('totalReaders').textContent = readers;
    }

    function renderControllers(data) {
      const container = document.getElementById('controller-list');
      container.innerHTML = '';
      if (data.length === 0) {
        container.innerHTML = '<p>No matching controllers found.</p>';
        return;
      }

      data.forEach(ctrl => {
        const card = document.createElement('div');
        card.classList.add('controller-card');

        const statusClass = ctrl.controllerStatus.toLowerCase() === 'online' ? 'status-online' : 'status-offline';

        card.innerHTML = `
          <div class="controller-header">
            <h3><i class="fas fa-server"></i> ${ctrl.controllername}</h3>
            <span class="status-badge ${statusClass}">${ctrl.controllerStatus}</span>
          </div>
          <div><i class="fas fa-network-wired"></i> ${ctrl.IP_address}</div>
          <div class="door-grid">
            ${ctrl.Doors.map(d => `
              <div class="door-card">
                <div class="door-name">${d.Door}</div>
                <div class="door-info"><i class="fas fa-id-badge"></i> ${d.Reader || 'N/A'}</div>
                <div class="door-status" style="color:${d.status.toLowerCase()==='online'?'green':'red'};">
                  <i class="fas fa-signal"></i> ${d.status}
                </div>
              </div>
            `).join('')}
          </div>
        `;

        container.appendChild(card);
      });
    }

    function renderChart(data) {
      const online = data.filter(c => c.controllerStatus.toLowerCase() === 'online').length;
      const offline = data.length - online;
      new Chart(document.getElementById('statusChart'), {
        type: 'doughnut',
        data: {
          labels: ['Online', 'Offline'],
          datasets: [{
            data: [online, offline],
            backgroundColor: ['#4caf50', '#f44336']
          }]
        },
        options: {
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    loadControllers();
  </script>
</body>
</html>