i dont like this and i want this in light theme..
  wiht more atractive ok wiht different section inlcude visula ok 
  and more atractive UI
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Controllers | Doors & Readers Dashboard</title>
  <link rel="stylesheet" href="styles.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <style>
    /* Page-specific overrides */
    .controller-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .controller-card {
      background: linear-gradient(145deg, #1c1c1e, #2c2c2e);
      border-radius: 20px;
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
      padding: 20px;
      transition: transform 0.2s ease, box-shadow 0.3s ease;
    }
    .controller-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
    }

    .controller-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .controller-header h3 {
      font-size: 1.1rem;
      color: #fff;
      margin: 0;
    }

    .status-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.8rem;
      color: #fff;
      text-transform: uppercase;
    }

    .status-online { background-color: #00e676; }
    .status-offline { background-color: #ff3d00; }

    .ip-text {
      color: #aaa;
      font-size: 0.9rem;
      margin-bottom: 8px;
    }

    .doors-container {
      border-top: 1px solid #444;
      margin-top: 10px;
      padding-top: 10px;
    }

    .door-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 10px;
      margin-top: 10px;
    }

    .door-card {
      background: #212121;
      border-radius: 12px;
      padding: 10px;
      text-align: left;
      transition: 0.2s ease;
    }
    .door-card:hover {
      background: #292929;
      transform: scale(1.02);
    }

    .door-name {
      font-weight: 600;
      font-size: 0.85rem;
      color: #ffcc00;
    }

    .door-info {
      font-size: 0.75rem;
      color: #bbb;
    }

    .door-status {
      font-size: 0.75rem;
      font-weight: 600;
    }

    .search-container {
      margin: 20px 0;
      text-align: center;
    }

    .search-container input {
      width: 50%;
      max-width: 400px;
      padding: 10px 15px;
      border-radius: 20px;
      border: none;
      background: #2b2b2b;
      color: #fff;
      outline: none;
    }

    .search-container input::placeholder {
      color: #aaa;
    }
  </style>
</head>

<body>
  <div id="region-title" class="dashboard-header">
    <div class="region-logo"></div>
    <div class="header-controls">
      <button class="theme-toggle" id="themeToggle"><i class="fas fa-moon"></i></button>
    </div>
  </div>

  <div class="container">
    <main id="content">
      <h2><i class="fas fa-id-card"></i> Controllers - Doors & Readers</h2>

      <div class="search-container">
        <input type="text" id="controllerSearch" placeholder="🔍 Search by controller, door, or reader..." />
      </div>

      <div id="controller-list" class="controller-grid">Loading controllers...</div>
    </main>
  </div>

  <footer class="footer">
    <p>
      <img src="images/new-header.png" alt="Company Logo" class="footer-logo" />
    </p>
    <p style="color: #fff;">© 2025 VisionWatch | Powered by 
      <strong style="color: #ffcc00;">Western Union Services India Pvt Ltd.</strong></p>
  </footer>

  <script>
    async function loadControllers() {
      try {
        const res = await fetch('http://localhost/api/controllers/status');
        const controllers = await res.json();
        renderControllers(controllers);

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
        document.getElementById('controller-list').textContent = 'Failed to load data.';
      }
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
        const statusBadge = `<span class="status-badge ${statusClass}">${ctrl.controllerStatus}</span>`;

        card.innerHTML = `
          <div class="controller-header">
            <h3><i class="fas fa-server"></i> ${ctrl.controllername}</h3>
            ${statusBadge}
          </div>
          <div class="ip-text"><i class="fas fa-network-wired"></i> ${ctrl.IP_address}</div>

          <div class="doors-container">
            <div class="door-grid">
              ${ctrl.Doors.map(d => `
                <div class="door-card">
                  <div class="door-name">${d.Door}</div>
                  <div class="door-info"><i class="fas fa-id-badge"></i> Reader: ${d.Reader || 'N/A'}</div>
                  <div class="door-status ${d.status.toLowerCase()}">
                    <i class="fas fa-signal"></i> ${d.status}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;

        container.appendChild(card);
      });
    }

    loadControllers();

    document.getElementById('themeToggle').addEventListener('click', () => {
      document.body.classList.toggle('theme-light');
      const icon = document.querySelector('#themeToggle i');
      icon.classList.toggle('fa-sun');
      icon.classList.toggle('fa-moon');
    });
  </script>
</body>
</html>
