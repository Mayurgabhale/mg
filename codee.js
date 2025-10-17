image not in background ok 
/* Dashboard Grid */
.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}
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
.card {
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
    animation: cardSlideIn 0.6s ease-out both;
}

.card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: left 0.5s ease;
}

.card:hover::before {
    left: 100%;
}

.card:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: var(--primary);
    box-shadow: var(--glow);
}

.card.active {
    transform: scale(0.95);
    border-color: var(--success);
}

.card-glow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(37, 99, 235, 0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.card:hover .card-glow {
    opacity: 1;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.card-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    flex: 1;
    margin-right: 1rem;
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.status-badge.active {
    background: rgba(16, 185, 129, 0.2);
    color: var(--success);
    border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-badge.inactive {
    background: rgba(239, 68, 68, 0.2);
    color: var(--error);
    border: 1px solid rgba(239, 68, 68, 0.3);
}

.card-body {
    margin-bottom: 1rem;
}

.connection-info {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--text-secondary);
    font-family: 'Monaco', 'Consolas', monospace;
    font-size: 0.875rem;
}

.ip-address {
    color: var(--text-primary);
}

.port {
    color: var(--primary);
}

.card-footer {
    border-top: 1px solid var(--border);
    padding-top: 1rem;
}

.access-indicator {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--text-secondary);
    font-size: 0.875rem;
    transition: all 0.3s ease;
}

.card:hover .access-indicator {
    color: var(--primary);
}

.arrow {
    transform: translateX(0);
    transition: transform 0.3s ease;
}

.card:hover .arrow {
    transform: translateX(4px);
}

@keyframes cardSlideIn {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Right Sidebar */
.sidebar-right {
    width: 300px;
    padding: 1.5rem;
    background: rgba(30, 41, 59, 0.6);
    border-left: 1px solid var(--border);
    backdrop-filter: blur(10px);
}


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


