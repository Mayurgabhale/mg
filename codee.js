// // src/App.js
// import React, { useState, useEffect } from 'react';
// import './App.css';

// function Loading() {
//   const [displayText, setDisplayText] = useState('');

//   useEffect(() => {
//     const fullText = 'GSOC STRAT COMMAND...';
//     let i = 0;
//     const timer = setInterval(() => {
//       setDisplayText(fullText.slice(0, i + 1));
//       i++;
//       if (i > fullText.length) {
//         clearInterval(timer);
//       }
//     }, 150);

//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <div className="loading-container">
//       <h1 className="loading-title">
//         {displayText}
//         <span className="cursor">|</span>
//       </h1>
//       <div className="spinner-container">
//         <div className="spinner"></div>
//         <div className="spinner"></div>
//         <div className="spinner"></div>
//       </div>
//       <div className="particles">
//         <div className="particle"></div>
//         <div className="particle"></div>
//         <div className="particle"></div>
//         <div className="particle"></div>
//         <div className="particle"></div>
//       </div>
//     </div>
//   );
// }

// function DashboardContent() {
//   const dashboards = [
//     { id: 1, ip: '10.199.22.57', port: 3004, name: 'Associate Verification Tool', img:'/identity-verification-removebg-preview.png' },
//     { id: 2, ip: '10.199.22.57', port: 3005, name: 'Global Montoring Station', img:'/OIP.webp' }, 
//     { id: 3, ip: '10.199.22.57', port: 3010, name: 'Violation Monitoring Station', img:'/vio.png' },
//     { id: 4, ip: '10.199.22.57', port: 3011, name: 'Live Occupancy Monitoring - Pune', img:'/occu.jpg' },
//     { id: 5, ip: '10.199.22.57', port: 3012, name: 'Live Occupancy Monitoring - Denver', img:'/occu.jpg' },
//     { id: 6, ip: '10.199.22.57', port: 3006, name: 'Test Null' }
//   ];

//   const handleClick = (dashboard) => {
//     window.open(`http://${dashboard.ip}:${dashboard.port}`, '_blank');
//   };

//   return (
//     <div className="App">
//       <div className="header">
//         <div className='title-container'>
//           <img src='/WU-logo.png' alt='Logo' className='logo'/>
//           <h1 className="title">GSOC STRAT COMMAND</h1>
//         </div>
//         <div className="divider" />
//       </div>

//       <div className="buttons-container">
//         {dashboards.map((dashboard) => (
//           <button
//             key={dashboard.id}
//             className="button"
//             onClick={() => handleClick(dashboard)}
//           >
//             {dashboard.name}
//           </button>
//         ))}
//       </div>
//       <footer className='footer'>
//         <div className='divider'/>
//       </footer>
//       <div className='text-block'>
//         <div className='bold-line'>Global Security Operations Center</div>
//         <div>GSOC Dashbord Hub</div>
//       </div>
//     </div>
//   );
// }

// function App() {
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, []);

//   return isLoading ? <Loading /> : <DashboardContent />;
// }

// export default App;













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
      if (i > fullText.length) {
        clearInterval(timer);
      }
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="loading-container">
      <h1 className="loading-title">
        {displayText}
        <span className="cursor">|</span>
      </h1>
      <div className="spinner-container">
        <div className="spinner"></div>
        <div className="spinner"></div>
        <div className="spinner"></div>
      </div>
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dashboards = [
    { 
      id: 1, 
      ip: '10.199.22.57', 
      port: 3004, 
      name: 'Associate Verification Tool', 
      // img: '/identity-verification-removebg-preview.png',
      category: 'verification',
      location: 'Global',
      status: 'active'
    },
    { 
      id: 2, 
      ip: '10.199.22.57', 
      port: 3005, 
      name: 'Global Monitoring Station', 
      // img: '/OIP.webp',
      category: 'monitoring',
      location: 'Global',
      status: 'active'
    }, 
    { 
      id: 3, 
      ip: '10.199.22.57', 
      port: 3010, 
      name: 'Violation Monitoring Station', 
      // img: '/vio.png',
      category: 'monitoring',
      location: 'Global',
      status: 'active'
    },
    { 
      id: 4, 
      ip: '10.199.22.57', 
      port: 3011, 
      name: 'Live Occupancy Monitoring - Pune', 
      // img: '/occu.jpg',
      category: 'monitoring',
      location: 'Pune',
      status: 'active'
    },
    { 
      id: 5, 
      ip: '10.199.22.57', 
      port: 3012, 
      name: 'Live Occupancy Monitoring - Denver', 
      // img: '/occu.jpg',
      category: 'monitoring',
      location: 'Denver',
      status: 'active'
    },
    { 
      id: 6, 
      ip: '10.199.22.57', 
      port: 3006, 
      name: 'Test Null',
      category: 'testing',
      location: 'Global',
      status: 'inactive'
    }
  ];

  const handleClick = (dashboard) => {
    window.open(`http://${dashboard.ip}:${dashboard.port}`, '_blank');
  };

  // Filter dashboards based on category and search
  const filteredDashboards = dashboards.filter(dashboard => {
    const matchesCategory = selectedCategory === 'all' || dashboard.category === selectedCategory;
    const matchesSearch = dashboard.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (category) => {
    if (category === 'all') return dashboards.length;
    return dashboards.filter(d => d.category === category).length;
  };

  const getActiveCount = () => {
    return dashboards.filter(d => d.status === 'active').length;
  };

  return (
    <div className="App">
      {/* Top Control Bar */}
      <header className="top-bar">
        <div className="top-bar-left">
          <img src='/WU-logo.png' alt='Logo' className='logo'/>
          <h1 className="title">GSOC STRAT COMMAND</h1>
        </div>
        <div className="top-bar-center">
          <input 
            type="text" 
            placeholder="Search dashboards..." 
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="top-bar-right">
          <div className="stat-item">
            <span className="stat-label">Systems Online</span>
            <span className="stat-value">{getActiveCount()}/{dashboards.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Status</span>
            <span className="status-indicator active"></span>
          </div>
        </div>
      </header>

      <div className="divider-top"></div>

      {/* Main Content Area */}
      <div className="content-wrapper">
        {/* Left Sidebar */}
        <aside className={`sidebar-left ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <button 
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
          
          {!sidebarCollapsed && (
            <nav className="sidebar-nav">
              <div className="nav-section">
                <h3 className="nav-title">Categories</h3>
                <button 
                  className={`nav-item ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  
                  <span className="nav-label">All Dashboards</span>
                  <span className="nav-count">{getCategoryCount('all')}</span>
                </button>
                <button 
                  className={`nav-item ${selectedCategory === 'monitoring' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('monitoring')}
                >
                 
                  <span className="nav-label">Monitoring Tools</span>
                  <span className="nav-count">{getCategoryCount('monitoring')}</span>
                </button>
                <button 
                  className={`nav-item ${selectedCategory === 'verification' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('verification')}
                >
                  
                  <span className="nav-label">Verification Tools</span>
                  <span className="nav-count">{getCategoryCount('verification')}</span>
                </button>
                <button 
                  className={`nav-item ${selectedCategory === 'testing' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('testing')}
                >
                  
                  <span className="nav-label">Testing</span>
                  <span className="nav-count">{getCategoryCount('testing')}</span>
                </button>
              </div>
            </nav>
          )}
        </aside>

        {/* Main Grid Area */}
        <main className="main-content">
          <div className="buttons-container">
            {filteredDashboards.map((dashboard) => (
              <button
                key={dashboard.id}
                className="button"
                onClick={() => handleClick(dashboard)}
                style={{
                  backgroundImage: dashboard.img ? `url(${dashboard.img})` : 'none'
                }}
              >
                <span className="button-text">{dashboard.name}</span>
                <div className="button-status">
                  <span className={`status-dot ${dashboard.status}`}></span>
                </div>
              </button>
            ))}
          </div>
        </main>

        {/* Right Info Panel */}
        <aside className="sidebar-right">
          <div className="info-panel">
            <h3 className="panel-title">System Status</h3>
            <div className="status-list">
              {dashboards.map((dashboard) => (
                <div key={dashboard.id} className="status-item">
                  <span className={`status-dot ${dashboard.status}`}></span>
                  <span className="status-name">{dashboard.name}</span>
                  <span className="status-port">:{dashboard.port}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="info-panel">
            <h3 className="panel-title">Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-time">2m ago</span>
                <span className="activity-text">Global Monitoring accessed</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">15m ago</span>
                <span className="activity-text">Verification Tool updated</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">1h ago</span>
                <span className="activity-text">System health check completed</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Status Bar */}
      <footer className='footer'>
        <div className="footer-left">
          <span className={`status-indicator active`}></span>
          <span className="footer-text">Connected</span>
        </div>
        <div className="footer-center">
          <div className='bold-line'>Global Security Operations Center</div>
          <div className='bold-line'>GSOC Dashboard Hub</div>
        </div>
        <div className="footer-right">
          <span className="footer-text">Last Updated: Just now</span>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <Loading /> : <DashboardContent />;
}

export default App;
