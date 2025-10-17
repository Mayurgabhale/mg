const dashboards = [
  {
    id: 1,
    ip: '10.199.22.57',
    port: 3004,
    name: 'Associate Verification Tool',
    category: 'verification',
    status: 'active',
    image: '/img/Associate Verification.png',
  },
  {
    id: 2,
    ip: '10.199.22.57',
    port: 3005,
    name: 'Global Monitoring Station',
    category: 'monitoring',
    status: 'active',
    image: '/img/monitor.png',
  },
  {
    id: 3,
    ip: '10.199.22.57',
    port: 3010,
    name: 'Violation Monitoring Station',
    category: 'monitoring',
    status: 'active',
    image: '/img/violation.png',
  },
  {
    id: 4,
    ip: '10.199.22.57',
    port: 3011,
    name: 'Live Occupancy Monitoring - Pune',
    category: 'monitoring',
    status: 'active',
    image: '/img/productivity.png',
  },
  {
    id: 5,
    ip: '10.199.22.57',
    port: 3012,
    name: 'Live Occupancy Monitoring - Denver',
    category: 'monitoring',
    status: 'active',
    image: '/img/immigration.png',
  },
  {
    id: 6,
    ip: '10.199.22.57',
    port: 3006,
    name: 'Test Null',
    category: 'testing',
    status: 'inactive',
    image: '/img/monitor.png',
  }
];






<div className="dashboard-grid">
  {filteredDashboards.map((d, index) => (
    <div
      key={d.id}
      className={`card ${d.status} ${activeCard === d.id ? 'active' : ''}`}
      style={{
        animationDelay: `${index * 0.1}s`,
        backgroundImage: `linear-gradient(rgba(15,23,42,0.8), rgba(15,23,42,0.9)), url(${d.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      onClick={() => handleClick(d)}
    >
      <div className="card-glow"></div>

      <div className="card-header">
        <h3>{d.name}</h3>
        <div className={`status-badge ${d.status}`}>
          {d.status === 'active' ? 'Online' : 'Offline'}
        </div>
      </div>

      <div className="card-body">
        <div className="connection-info">
          <span className="ip-address">{d.ip}</span>
          <span className="port">:{d.port}</span>
        </div>
      </div>

      <div className="card-footer">
        <div className="access-indicator">
          <span>Click to Access</span>
          <div className="arrow">→</div>
        </div>
      </div>
    </div>
  ))}
</div>







...

.card {
  background-blend-mode: overlay;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
}

.card.active {
  transform: scale(0.96);
  border-color: var(--success);
}