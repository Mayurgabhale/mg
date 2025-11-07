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
            <div class="controller-info">
              <div class="controller-icon">
                <i class="fas fa-server"></i>
              </div>
              <div class="controller-details">
                <h3>${ctrl.controllername}</h3>
                <p><i class="fas fa-network-wired"></i> ${ctrl.IP_address}</p>
              </div>
            </div>
            <span class="status-badge ${statusClass}">${ctrl.controllerStatus}</span>
          </div>
          <div class="controller-body">
            <div class="doors-title">
              <i class="fas fa-door-closed"></i>
              <span>Connected Doors (${ctrl.Doors.length})</span>
            </div>
            <div class="doors-grid">
              ${ctrl.Doors.map(d => `
                <div class="door-card">
                  <div class="door-name">${d.Door}</div>
                  <div class="door-info"><i class="fas fa-id-badge"></i> ${d.Reader || 'N/A'}</div>
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

    function renderCharts(data) {
      // Status Chart
      const online = data.filter(c => c.controllerStatus.toLowerCase() === 'online').length;
      const offline = data.length - online;
      
      new Chart(document.getElementById('statusChart'), {
        type: 'doughnut',
        data: {
          labels: ['Online', 'Offline'],
          datasets: [{
            data: [online, offline],
            backgroundColor: ['#3a86ff', '#f94144'],
            borderWidth: 0
          }]
        },
        options: {
          plugins: { 
            legend: { 
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            }
          },
          cutout: '70%'
        }
      });

      // Activity Chart
      const ctx = document.getElementById('activityChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Access Events',
            data: [120, 190, 130, 170, 150, 80, 100],
            backgroundColor: '#4361ee',
            borderRadius: 5
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                drawBorder: false
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }

    // Initialize the dashboard
    document.addEventListener('DOMContentLoaded', loadControllers);
  </script>
</body>
</html>