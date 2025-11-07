
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
      --primary: #4a90e2;
      --accent: #ffb300;
      --success: #4caf50;
      --danger: #f44336;
      --bg: #f9fafc;
      --card-bg: #ffffff;
      --border: #e0e0e0;
      --text: #333;
    }

    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: var(--bg);
      color: var(--text);
      margin: 0;
    }

    header {
      background: linear-gradient(90deg, #4a90e2, #66b3ff);
      color: white;
      padding: 20px;
      text-align: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    header h1 {
      margin: 0;
      font-size: 1.8rem;
      letter-spacing: 0.5px;
    }

    main {
      padding: 30px;
      margin: auto;
    }

    /* SUMMARY SECTION */
    .summary-section {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 40px;
    }

    .summary-card {
      flex: 1;
      min-width: 220px;
      background: var(--card-bg);
      padding: 20px;
      border-radius: 16px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      text-align: center;
      border: 1px solid var(--border);
      transition: transform 0.2s ease;
    }
    .summary-card:hover {
      transform: translateY(-5px);
    }
    .summary-card i {
      font-size: 2rem;
      margin-bottom: 10px;
      color: var(--primary);
    }
    .summary-card h3 {
      margin: 5px 0;
      color: var(--text);
      font-size: 1rem;
    }
    .summary-card p {
      font-size: 1.4rem;
      font-weight: bold;
    }

    /* CONTROLLERS GRID */
    .controller-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .controller-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      padding: 20px;
      transition: 0.3s;
    }
    .controller-card:hover {
      transform: scale(1.02);
      box-shadow: 0 6px 15px rgba(0,0,0,0.1);
    }

    .controller-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    .controller-header h3 {
      font-size: 1.1rem;
      color: var(--text);
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
      background: #f8f9fb;
      border: 1px solid #eee;
      border-radius: 10px;
      padding: 8px;
      font-size: 0.85rem;
      text-align: left;
      transition: background 0.2s;
    }
    .door-card:hover { background: #f1f7ff; }
    .door-name { font-weight: 600; color: var(--accent); }
    .door-info { color: #555; font-size: 0.8rem; }

    /* SEARCH BAR */
    .search-container {
      text-align: center;
      margin-bottom: 30px;
    }
    .search-container input {
      padding: 12px 20px;
      width: 50%;
      border: 1px solid var(--border);
      border-radius: 30px;
      font-size: 1rem;
      outline: none;
      transition: 0.3s;
    }
    .search-container input:focus {
      box-shadow: 0 0 0 3px rgba(74,144,226,0.2);
      border-color: var(--primary);
    }

    /* CHART SECTION */
    .chart-section {
      margin-top: 50px;
      text-align: center;
    }
    canvas {
      max-width: 400px;
      margin: auto;
    }

    footer {
      margin-top: 50px;
      background: #fafafa;
      border-top: 1px solid #e0e0e0;
      padding: 20px;
      text-align: center;
      font-size: 0.9rem;
      color: #555;
    }
  </style>
</head>

<body>
  <header>
    <h1><i class="fas fa-door-open"></i> Doors & Readers Dashboard</h1>
  </header>

  <main>
    <section class="summary-section">
      <div class="summary-card">
        <i class="fas fa-server"></i>
        <h3>Total Controllers</h3>
        <p id="totalControllers">0</p>
      </div>
      <div class="summary-card">
        <i class="fas fa-plug-circle-bolt"></i>
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

    <div class="search-container">
      <input type="text" id="controllerSearch" placeholder="🔍 Search by controller, door, or reader..." />
    </div>

    <section id="controller-list" class="controller-grid">Loading controllers...</section>

    <section class="chart-section">
      <h3>Controller Status Overview</h3>
      <canvas id="statusChart"></canvas>
    </section>
  </main>

  <footer>
    © 2025 VisionWatch | <strong style="color:var(--primary)">Western Union Services India Pvt Ltd.</strong>
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

