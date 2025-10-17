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



* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }

.light-theme { background-color: #f4f5f7; color: #212529; }

.loading-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loading-title { font-size: 2.2rem; font-weight: 700; margin-bottom: 2rem; }
.cursor { animation: blink 1s infinite; }
@keyframes blink { 0%,50%,100%{opacity:1;} 25%,75%{opacity:0;} }

.spinner-container { display: flex; gap: 1rem; }
.spinner {
  width: 15px;
  height: 15px;
  border: 3px solid #ced4da;
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }

.header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; border-bottom: 1px solid #e0e0e0; }
.gradient-header { background: linear-gradient(90deg, #ffffff 0%, #e9ecef 100%); box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
.header-left { display: flex; align-items: center; gap: 1rem; }
.logo { height: 50px; }
.header-title { font-size: 1.8rem; font-weight: 700; color: #343a40; }

.search-bar { padding: 0.5rem 1rem; border-radius: 12px; border: 1px solid #ced4da; width: 250px; transition: box-shadow 0.2s; }
.search-bar:focus { box-shadow: 0 0 8px rgba(0,123,255,0.3); outline: none; }

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.dashboard-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.dashboard-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 25px rgba(0,0,0,0.12);
  background: linear-gradient(135deg, #ffffff 0%, #f1f3f5 100%);
}

.dashboard-icon { font-size: 2rem; color: #007bff; }
.dashboard-info { display: flex; justify-content: space-between; align-items: center; }
.dashboard-name { font-weight: 600; font-size: 1.1rem; color: #343a40; }
.status-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
.status-dot.active { background-color: #28a745; }
.status-dot.inactive { background-color: #dc3545; }

.dashboard-ip { font-size: 0.9rem; color: #6c757d; }

.footer { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; border-top: 1px solid #e0e0e0; }
.gradient-footer { background: linear-gradient(90deg, #ffffff 0%, #e9ecef 100%); box-shadow: 0 -2px 6px rgba(0,0,0,0.05); }
.footer-status { font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }