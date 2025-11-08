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

  // ✅ Dynamic API fetch (no mock data)
  async function loadControllers() {
    try {
      // Fetch live data from your API
      const res = await fetch('http://localhost/api/controllers/status');
      const controllers = await res.json();

      renderSummary(controllers);
      renderControllers(controllers);
      renderChart(controllers);

      // Add live search functionality
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
          <p>Please check your API connection and try again.</p>
        </div>
      `;
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
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-light);">
          <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px;"></i>
          <h3>No matching controllers found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      `;
      return;
    }

    data.forEach(ctrl => {
      const card = document.createElement('div');
      const isOnline = ctrl.controllerStatus.toLowerCase() === 'online';
      card.classList.add('controller-card');
      if (!isOnline) card.classList.add('offline');

      const statusClass = isOnline ? 'status-online' : 'status-offline';

      card.innerHTML = `
        <div class="controller-header">
          <div class="controller-title">
            <i class="fas fa-server"></i>
            <h3>${ctrl.controllername}</h3>
          </div>
          <span class="status-badge ${statusClass}">${ctrl.controllerStatus}</span>
        </div>
        <div class="controller-info">
          <i class="fas fa-network-wired"></i>
          <span>${ctrl.IP_address}</span>
        </div>
        <div class="door-grid">
          ${ctrl.Doors.map(d => `
            <div class="door-card">
              <div class="door-name">${d.Door}</div>
              <div class="door-info">
                <i class="fas fa-id-badge"></i> 
                <span>${d.Reader || 'N/A'}</span>
              </div>
              <div class="door-status ${d.status.toLowerCase() === 'online' ? 'status-on' : 'status-off'}">
                <i class="fas fa-signal"></i> 
                <span>${d.status}</span>
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

    const ctx = document.getElementById('statusChart').getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Online', 'Offline'],
        datasets: [{
          data: [online, offline],
          backgroundColor: ['#2dce89', '#f5385c'],
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { 
          legend: { 
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: { size: 13 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: 12,
            cornerRadius: 8
          }
        },
        cutout: '70%'
      }
    });
  }

  // ✅ Initialize the dashboard with live API data
  loadControllers();
</script>