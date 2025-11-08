this is a dyanamic code ok not static ok 
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
above code is dynamic so i want this
can you convert below code  in dyanmic ok use thisa
    api   const res = await fetch('http://localhost/api/controllers/status');
in below code 

 <script> 

    in this code use api 
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
                font: {
                  size: 13
                }
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

    // Initialize the dashboard
    loadControllers();
  </script>


