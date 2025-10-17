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
            <div className="logo-glow"></div>
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
          <div className="search-icon">🔍</div>
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
                    {d.status === 'active' && <span className="pulse"></span>}
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