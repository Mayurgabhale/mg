i want to add in this dasbhoard images and icons  in card or backend,
  so this dashboard UI more atractive and modersn desing ok, 
  lookin like more atracibe and professla desing ok 
import React, { useState, useEffect } from 'react';
import './App.css';

function Loading() {
  const [displayText, setDisplayText] = useState('');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fullText = 'GSOC STRAT COMMAND...';
    let i = 0;
    const timer = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i > fullText.length) {
        clearInterval(timer);
        setTimeout(() => setFadeOut(true), 500);
      }
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`loading-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <h1 className="loading-title">
          {displayText}<span className="cursor">|</span>
        </h1>
        <div className="spinner-container">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCard, setActiveCard] = useState(null);

  const dashboards = [
    { id: 1, ip: '10.199.22.57', port: 3004, name: 'Associate Verification Tool', category: 'verification', status: 'active' },
    { id: 2, ip: '10.199.22.57', port: 3005, name: 'Global Monitoring Station', category: 'monitoring', status: 'active' },
    { id: 3, ip: '10.199.22.57', port: 3010, name: 'Violation Monitoring Station', category: 'monitoring', status: 'active' },
    { id: 4, ip: '10.199.22.57', port: 3011, name: 'Live Occupancy Monitoring - Pune', category: 'monitoring', status: 'active' },
    { id: 5, ip: '10.199.22.57', port: 3012, name: 'Live Occupancy Monitoring - Denver', category: 'monitoring', status: 'active' },
    { id: 6, ip: '10.199.22.57', port: 3006, name: 'Test Null', category: 'testing', status: 'inactive' }
  ];

  const handleClick = (dashboard) => {
    setActiveCard(dashboard.id);
    setTimeout(() => {
      window.open(`http://${dashboard.ip}:${dashboard.port}`, '_blank');
      setActiveCard(null);
    }, 300);
  };

  const filteredDashboards = dashboards.filter(d => 
    (selectedCategory === 'all' || d.category === selectedCategory) &&
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryCount = (category) => {
    return category === 'all' ? dashboards.length : dashboards.filter(d => d.category === category).length;
  };

  const getActiveCount = () => dashboards.filter(d => d.status === 'active').length;

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo-container">
            <img src="/WU-logo.png" alt="Logo" className="logo"/>
            
          </div>
          <h1 className="header-title">
            <span className="title-main">GSOC</span>
            <span className="title-sub">STRAT COMMAND</span>
          </h1>
        </div>
        
        <div className="search-container">
          <input 
            type="text"
            className="search-bar"
            placeholder="Search dashboards..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {/* <div className="search-icon"></div> */}
        </div>

        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-value">{getActiveCount()}/{dashboards.length}</div>
            <div className="stat-label">Systems Online</div>
          </div>
          <div className="status-indicator">
            <div className="pulse-dot"></div>
            <span>Operational</span>
          </div>
        </div>
      </header>

      <div className="content-wrapper">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <button 
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <span className={`chevron ${sidebarCollapsed ? 'right' : 'left'}`}></span>
          </button>
          
          {!sidebarCollapsed && (
            <nav className="sidebar-nav">
              <h3 className="nav-title">Categories</h3>
              {['all','monitoring','verification','testing'].map(cat => (
                <button
                  key={cat}
                  className={`category-btn ${selectedCategory===cat?'active':''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span className="category-icon">•</span>
                  <span className="category-text">
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </span>
                  <span className="category-count">({getCategoryCount(cat)})</span>
                </button>
              ))}
            </nav>
          )}
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="content-header">
            <h2>Dashboard Hub</h2>
            <div className="view-controls">
              <span className="results-count">
                {filteredDashboards.length} systems found
              </span>
            </div>
          </div>

          <div className="dashboard-grid">
            {filteredDashboards.map((d, index) => (
              <div 
                key={d.id} 
                className={`card ${d.status} ${activeCard === d.id ? 'active' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
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
        </main>

        {/* Right Panel */}
        <aside className="sidebar-right">
          <div className="info-panel">
            <h3 className="panel-title">System Status</h3>
            <div className="status-list">
              {dashboards.map(d => (
                <div key={d.id} className="status-item">
                  <div className="status-indicators">
                    <span className={`status-dot ${d.status}`}></span>
                  
                  </div>
                  <span className="status-name">{d.name}</span>
                  <span className="status-port">:{d.port}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="info-panel">
            <h3 className="panel-title">Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <span>Global Monitoring accessed</span>
                  <span className="activity-time">2m ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <span>Verification Tool updated</span>
                  <span className="activity-time">15m ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <span>System health check completed</span>
                  <span className="activity-time">1h ago</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <span>Global Security Operations Center | GSOC Dashboard Hub</span>
          <div className="footer-status">
            <span className="status-pulse"></span>
            <span>Connected</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <Loading /> : <DashboardContent />;
}

export default App;




* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
}

:root {
    --primary: #2563eb;
    --primary-dark: #1d4ed8;
    --secondary: #64748b;
    --success: #10b981;
    --warning: #f59e0b;
    --error: #ef4444;
    --background: #0f172a;
    --surface: #1e293b;
    --surface-light: #334155;
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --border: #334155;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --glow: 0 0 20px rgba(37, 99, 235, 0.3);
}





body {
    background: var(--background);
    color: var(--text-primary);
    overflow-x: hidden;
}

/* Loading Animation */
.loading-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--background) 0%, #1e293b 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    transition: opacity 0.5s ease-out;
}

.loading-container.fade-out {
    opacity: 0;
    pointer-events: none;
}

.loading-content {
    text-align: center;
    animation: fadeInUp 0.8s ease-out;
}

.loading-title {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--primary) 0%, var(--success) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 2rem;
    letter-spacing: 2px;
}

.cursor {
    animation: blink 1s infinite;
}

@keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
}

.spinner-container {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.spinner-ring {
    width: 12px;
    height: 12px;
    border: 2px solid var(--primary);
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.spinner-ring:nth-child(2) {
    animation-delay: 0.2s;
    border-color: var(--success);
}

.spinner-ring:nth-child(3) {
    animation-delay: 0.4s;
    border-color: var(--warning);
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Main Dashboard */
.dashboard {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--background) 0%, #1e293b 100%);
}

/* Header */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: rgba(30, 41, 59, 0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.logo-container {
    position: relative;
    padding: 0.5rem;
}

.logo {
    height: 40px;
    filter: brightness(0) invert(1);
    position: relative;
    z-index: 2;
}


.header-title {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
}

.title-main {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--primary) 0%, var(--success) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.title-sub {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.search-container {
    position: relative;
    display: flex;
    align-items: center;
}

.search-bar {
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: rgba(30, 41, 59, 0.6);
    color: var(--text-primary);
    width: 300px;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.search-bar:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: var(--glow);
    width: 350px;
}

.search-bar::placeholder {
    color: var(--text-secondary);
}

.search-icon {
    position: absolute;
    left: 1rem;
    color: var(--text-secondary);
    pointer-events: none;
}

.header-stats {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.stat-card {
    text-align: center;
    padding: 0.5rem 1rem;
    background: rgba(30, 41, 59, 0.6);
    border-radius: 12px;
    border: 1px solid var(--border);
}

.stat-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--success);
}

.stat-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 12px;
    color: var(--success);
}

.pulse-dot {
    width: 8px;
    height: 8px;
    background: var(--success);
    border-radius: 50%;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
}

/* Content Layout */
.content-wrapper {
    display: flex;
    min-height: calc(100vh - 120px);
}

/* Sidebar */
.sidebar {
    width: 280px;
    background: rgba(30, 41, 59, 0.6);
    padding: 1.5rem;
    border-right: 1px solid var(--border);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
}

.sidebar.collapsed {
    width: 70px;
}

.collapse-btn {
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.5rem;
    cursor: pointer;
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
}

.collapse-btn:hover {
    background: var(--surface-light);
    border-color: var(--primary);
}

.chevron {
    display: block;
    width: 12px;
    height: 12px;
    border: 2px solid var(--text-primary);
    border-top: none;
    border-right: none;
    transition: transform 0.3s ease;
}

.chevron.left {
    transform: rotate(45deg);
}

.chevron.right {
    transform: rotate(-135deg);
}

.nav-title {
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.category-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.category-btn::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: var(--primary);
    transform: scaleY(0);
    transition: transform 0.3s ease;
}

.category-btn:hover {
    background: rgba(37, 99, 235, 0.1);
    color: var(--text-primary);
    transform: translateX(5px);
}

.category-btn.active {
    background: rgba(37, 99, 235, 0.2);
    color: var(--text-primary);
}

.category-btn.active::before {
    transform: scaleY(1);
}

.category-icon {
    color: var(--primary);
    font-size: 1.2rem;
}

.category-text {
    flex: 1;
    text-align: left;
    text-transform: capitalize;
}

.category-count {
    background: var(--surface-light);
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
}

/* Main Content */
.main-content {
    flex: 1;
    padding: 2rem;
    background: transparent;
}

.content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.content-header h2 {
    font-size: 1.75rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.results-count {
    color: var(--text-secondary);
    font-size: 0.875rem;
}

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
    width: 6px;
    height: 6px;
    background: var(--primary);
    border-radius: 50%;
    margin-top: 0.375rem;
    flex-shrink: 0;
}

.activity-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
}

.activity-content span:first-child {
    color: var(--text-primary);
    font-size: 0.875rem;
}

.activity-time {
    color: var(--text-secondary);
    font-size: 0.75rem;
}

/* Footer */
.footer {
    background: rgba(30, 41, 59, 0.8);
    border-top: 1px solid var(--border);
    padding: 1rem 2rem;
    backdrop-filter: blur(10px);
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--text-secondary);
    font-size: 0.875rem;
}

.footer-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--success);
    font-weight: 600;
}

.status-pulse {
    width: 6px;
    height: 6px;
    background: var(--success);
    border-radius: 50%;
    animation: pulse 2s infinite;
}

/* Responsive Design */
@media (max-width: 1200px) {
    .sidebar-right {
        display: none;
    }
}

@media (max-width: 768px) {
    .header {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }
    
    .search-bar {
        width: 100%;
    }
    
    .search-bar:focus {
        width: 100%;
    }
    
    .content-wrapper {
        flex-direction: column;
    }
    
    .sidebar {
        width: 100%;
        order: 2;
    }
    
    .sidebar.collapsed {
        width: 100%;
        height: 60px;
        overflow: hidden;
    }
    
    .main-content {
        order: 1;
        padding: 1rem;
    }
    
    .dashboard-grid {
        grid-template-columns: 1fr;
    }
}
