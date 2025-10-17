i dont want icons only add image in card, wiht correct 
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

/* Dashboard Grid */
.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
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

.info-panel {
    margin-bottom: 2rem;
}

.panel-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
}

.status-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.status-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: rgba(30, 41, 59, 0.4);
    border-radius: 8px;
    border: 1px solid var(--border);
    transition: all 0.3s ease;
}

.status-item:hover {
    background: rgba(37, 99, 235, 0.1);
    border-color: var(--primary);
}

.status-indicators {
    position: relative;
    display: flex;
    align-items: center;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: relative;
    z-index: 2;
}

.status-dot.active {
    background: var(--success);
}

.status-dot.inactive {
    background: var(--error);
}

.pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    background: var(--success);
    border-radius: 50%;
    animation: pulse 2s infinite;
    opacity: 0.6;
}

.status-name {
    flex: 1;
    color: var(--text-primary);
    font-size: 0.875rem;
}

.status-port {
    color: var(--text-secondary);
    font-size: 0.75rem;
    font-family: 'Monaco', 'Consolas', monospace;
}

.activity-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.activity-item {
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem;
    background: rgba(30, 41, 59, 0.4);
    border-radius: 8px;
    border: 1px solid var(--border);
    transition: all 0.3s ease;
}

.activity-item:hover {
    background: rgba(37, 99, 235, 0.1);
    border-color: var(--primary);
    transform: translateX(5px);
}

.activity-dot {

.card {
  background-blend-mode: overlay;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
}

.card-icon {
  font-size: 2rem;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header h3 {
  flex: 1;
  color: #f1f5f9;
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card:hover .card-icon {
  transform: scale(1.2);
  transition: all 0.3s ease;
}

.card.active {
  transform: scale(0.96);
  border-color: var(--success);
}

.card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
}

.card-footer {
  border-top: 1px solid rgba(255,255,255,0.05);
  padding-top: 0.75rem;
  text-align: right;
}

.access-indicator {
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.3rem;
  font-size: 0.85rem;
}

.access-indicator .arrow {
  transition: transform 0.3s ease;
}

.card:hover .access-indicator .arrow {
  transform: translateX(4px);
}
