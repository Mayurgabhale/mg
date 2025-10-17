import React, { useState, useEffect } from 'react';
import { FaServer, FaShieldAlt, FaTools } from 'react-icons/fa';
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
      <h1 className="loading-title">{displayText}<span className="cursor">|</span></h1>
      <div className="spinner-container">
        <div className="spinner"></div>
        <div className="spinner"></div>
        <div className="spinner"></div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const [searchQuery, setSearchQuery] = useState('');

  const dashboards = [
    { id: 1, ip: '10.199.22.57', port: 3004, name: 'Associate Verification Tool', category: 'verification', status: 'active', icon: <FaShieldAlt /> },
    { id: 2, ip: '10.199.22.57', port: 3005, name: 'Global Monitoring Station', category: 'monitoring', status: 'active', icon: <FaServer /> },
    { id: 3, ip: '10.199.22.57', port: 3010, name: 'Violation Monitoring Station', category: 'monitoring', status: 'active', icon: <FaServer /> },
    { id: 4, ip: '10.199.22.57', port: 3011, name: 'Live Occupancy Monitoring - Pune', category: 'monitoring', status: 'active', icon: <FaTools /> },
    { id: 5, ip: '10.199.22.57', port: 3012, name: 'Live Occupancy Monitoring - Denver', category: 'monitoring', status: 'active', icon: <FaTools /> },
    { id: 6, ip: '10.199.22.57', port: 3006, name: 'Test Null', category: 'testing', status: 'inactive', icon: <FaTools /> }
  ];

  const handleClick = (dashboard) => window.open(`http://${dashboard.ip}:${dashboard.port}`, '_blank');

  const filteredDashboards = dashboards.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="dashboard light-theme">
      {/* Header */}
      <header className="header gradient-header">
        <div className="header-left">
          <img src="/WU-logo.png" alt="Logo" className="logo" />
          <h1 className="header-title">GSOC STRAT COMMAND</h1>
        </div>
        <input 
          type="text"
          className="search-bar"
          placeholder="Search dashboards..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </header>

      {/* Dashboard Grid */}
      <main className="dashboard-grid">
        {filteredDashboards.map(d => (
          <button key={d.id} className={`dashboard-card ${d.status}`} onClick={() => handleClick(d)}>
            <div className="dashboard-icon">{d.icon}</div>
            <div className="dashboard-info">
              <span className="dashboard-name">{d.name}</span>
              <span className={`status-dot ${d.status}`} title={d.status}></span>
            </div>
            <span className="dashboard-ip">{d.ip}:{d.port}</span>
          </button>
        ))}
      </main>

      {/* Footer */}
      <footer className="footer gradient-footer">
        <span>Global Security Operations Center | GSOC Dashboard Hub</span>
        <span className="footer-status"><span className="status-dot active"></span> Connected</span>
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

export default App;







....


.