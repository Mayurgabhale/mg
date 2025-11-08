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
          }
        ]
      },
      {
        "controllername": "US-NYC-5THFLR-ISTAR PRO",
        "IP_address": "10.199.15.20",
        "Location": "AMER",
        "City": "New York 5th Floor",
        "controllerStatus": "Offline",
        "Doors": [
          {
            "Door": "AMER_US_NYC_5THFLR_SERVER ROOM Restricted Door",
            "Reader": "in:1",
            "status": "Offline"
          },
          {
            "Door": "AMER_US_NYC_5THFLR_MAIN ENTRY DOOR",
            "Reader": "in:1",
            "status": "Offline"
          }
        ]
      }
    ];

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

    // Initialize the dashboard
    function initDashboard() {
      renderFilters();
      renderSummary(controllersData);
      renderControllers(controllersData);
      renderChart(controllersData);
      setupEventListeners();
    }

    // Render filter options
    function renderFilters() {
      const locationFilter = document.getElementById('locationFilter');
      const cityFilter = document.getElementById('cityFilter');
      
      // Get unique locations and cities
      const locations = [...new Set(controllersData.map(c => c.Location))];
      const cities = [...new Set(controllersData.map(c => c.City))];
      
      // Populate location filter
      locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationFilter.appendChild(option);
      });
      
      // Populate city filter
      cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
      });
    }

    // Render summary cards
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

    // Render controllers grid
    function renderControllers(data) {
      const container = document.getElementById('controller-list');
      container.innerHTML = '';

      if (data.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-light);">
            <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px;"></i>
            <h3>No matching controllers found</h3>
            <p>Try adjusting your search or filter terms</p>
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
            <div class="controller-info-row">
              <i class="fas fa-network-wired"></i>
              <span>${ctrl.IP_address}</span>
            </div>
            <div class="controller-info-row">
              <i class="fas fa-map-marker-alt"></i>
              <span>${ctrl.Location} - ${ctrl.City}</span>
            </div>
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

    // Render status chart
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

    // Setup event listeners
    function setupEventListeners() {
      // Search functionality
      document.getElementById('controllerSearch').addEventListener('input', filterControllers);
      
      // Filter functionality
      document.getElementById('locationFilter').addEventListener('change', filterControllers);
      document.getElementById('cityFilter').addEventListener('change', filterControllers);
      document.getElementById('statusFilter').addEventListener('change', filterControllers);
      
      // Refresh button
      document.getElementById('refreshBtn').addEventListener('click', () => {
        // In a real app, this would fetch fresh data from the API
        filterControllers();
      });
    }

    // Filter controllers based on search and filter criteria
    function filterControllers() {
      const searchTerm = document.getElementById('controllerSearch').value.toLowerCase();
      const locationFilter = document.getElementById('locationFilter').value;
      const cityFilter = document.getElementById('cityFilter').value;
      const statusFilter = document.getElementById('statusFilter').value;
      
      const filtered = controllersData.filter(c => {
        // Search filter
        const matchesSearch = searchTerm === '' || 
          c.controllername.toLowerCase().includes(searchTerm) ||
          c.IP_address.toLowerCase().includes(searchTerm) ||
          c.Doors.some(d => 
            d.Door.toLowerCase().includes(searchTerm) ||
            (d.Reader && d.Reader.toLowerCase().includes(searchTerm))
          );
        
        // Location filter
        const matchesLocation = locationFilter === '' || c.Location === locationFilter;
        
        // City filter
        const matchesCity = cityFilter === '' || c.City === cityFilter;
        
        // Status filter
        const matchesStatus = statusFilter === '' || c.controllerStatus === statusFilter;
        
        return matchesSearch && matchesLocation && matchesCity && matchesStatus;
      });
      
      renderControllers(filtered);
      renderSummary(filtered);
    }

    // Initialize the dashboard
    initDashboard();
  </script>
</body>
</html>