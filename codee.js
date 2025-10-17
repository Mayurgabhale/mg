

import React, { useState, useEffect } from 'react';
import './App.css';



function Loading() {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const fullText = 'GSOC STRAT COMMAND...';
    let i = 0;
    const timer = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="loading-container light-theme">
      <h1 className="loading-title">
        {displayText}<span className="cursor">|</span>
      </h1>
      <div className="spinner-container">
        <div className="spinner"></div>
        <div className="spinner"></div>
        <div className="spinner"></div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dashboards = [
    { id: 1, ip: '10.199.22.57', port: 3004, name: 'Associate Verification Tool', category: 'verification', status: 'active' },
    { id: 2, ip: '10.199.22.57', port: 3005, name: 'Global Monitoring Station', category: 'monitoring', status: 'active' },
    { id: 3, ip: '10.199.22.57', port: 3010, name: 'Violation Monitoring Station', category: 'monitoring', status: 'active' },
    { id: 4, ip: '10.199.22.57', port: 3011, name: 'Live Occupancy Monitoring - Pune', category: 'monitoring', status: 'active' },
    { id: 5, ip: '10.199.22.57', port: 3012, name: 'Live Occupancy Monitoring - Denver', category: 'monitoring', status: 'active' },
    { id: 6, ip: '10.199.22.57', port: 3006, name: 'Test Null', category: 'testing', status: 'inactive' }
  ];

  const handleClick = (dashboard) => {
    window.open(`http://${dashboard.ip}:${dashboard.port}`, '_blank');
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
    <div className="dashboard light-theme">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <img src="/WU-logo.png" alt="Logo" className="logo"/>
          <h1 className="header-title">GSOC STRAT COMMAND</h1>
        </div>
        <input 
          type="text"
          className="search-bar"
          placeholder="Search dashboards..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <div className="header-stats">
          <div className="stat">
            <span>Systems Online</span>
            <span>{getActiveCount()}/{dashboards.length}</span>
          </div>
          <div className="stat">
            <span>Status</span>
            <span className={`status-dot active`}></span>
          </div>
        </div>
      </header>

      <div className="content-wrapper">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <button className="collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? '→' : '←'}
          </button>
          {!sidebarCollapsed && (
            <nav>
              <h3>Categories</h3>
              {['all','monitoring','verification','testing'].map(cat => (
                <button
                  key={cat}
                  className={`category-btn ${selectedCategory===cat?'active':''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)} ({getCategoryCount(cat)})
                </button>
              ))}
            </nav>
          )}
        </aside>

        {/* Dashboard Cards */}
        <main className="main-content">
          <div className="dashboard-grid">
            {filteredDashboards.map(d => (
              <div key={d.id} className={`card ${d.status}`} onClick={() => handleClick(d)}>
                <div className="card-header">{d.name}</div>
                <div className="card-footer">
                  <span className={`status-dot ${d.status}`}></span>
                  <span>{d.ip}:{d.port}</span>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right Panel */}
        <aside className="sidebar-right">
          <div className="info-panel">
            <h3>System Status</h3>
            {dashboards.map(d => (
              <div key={d.id} className="status-item">
                <span className={`status-dot ${d.status}`}></span>
                <span>{d.name} :{d.port}</span>
              </div>
            ))}
          </div>
          <div className="info-panel">
            <h3>Recent Activity</h3>
            <div className="activity-item">2m ago - Global Monitoring accessed</div>
            <div className="activity-item">15m ago - Verification Tool updated</div>
            <div className="activity-item">1h ago - System health check completed</div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div>Global Security Operations Center | GSOC Dashboard Hub</div>
        <div className="footer-status"><span className="status-dot active"></span> Connected</div>
      </footer>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <Loading /> : <DashboardContent />;
}


* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
}

.light-theme {
    background: #f8f9fa;
    color: #212529;
}

header.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid #e0e0e0;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.logo {
    height: 50px;
}

.header-title {
    font-weight: 700;
    font-size: 1.8rem;
}

.search-bar {
    padding: 0.5rem 1rem;
    border-radius: 12px;
    border: 1px solid #ced4da;
    width: 250px;
}

.search-bar:focus {
    outline: none;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
}

.header-stats {
    display: flex;
    gap: 1.5rem;
}

.stat {
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
}

.status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
}

.status-dot.active {
    background: #28a745;
}

.status-dot.inactive {
    background: #dc3545;
}

.content-wrapper {
    display: flex;
}

.sidebar {
    width: 220px;
    background: #fff;
    padding: 1rem;
    box-shadow: 2px 0 6px rgba(0, 0, 0, 0.05);
    transition: width 0.3s;
}

.sidebar.collapsed {
    width: 50px;
}

.collapse-btn {
    margin-bottom: 1rem;
    cursor: pointer;
}

.category-btn {
    display: block;
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 0.3rem;
    border: none;
    background: #f1f3f5;
    border-radius: 8px;
    cursor: pointer;
    text-align: left;
    transition: background 0.2s;
}

.category-btn:hover,
.category-btn.active {
    background: #e0e0e0;
}

.main-content {
    flex: 1;
    padding: 2rem;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
}

.card {
    background: #fff;
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
}

.sidebar-right {
    width: 250px;
    padding: 1rem;
    background: #fff;
    box-shadow: -2px 0 6px rgba(0, 0, 0, 0.05);
}

.info-panel {
    margin-bottom: 1.5rem;
}

.status-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.activity-item {
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
}

footer.footer {
    display: flex;
    justify-content: space-between;
    padding: 1rem 2rem;
    background: #fff;
    box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.05);
    border-top: 1px solid #e0e0e0;
    font-size: 0.9rem;
}

.footer-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
}

export default App;
