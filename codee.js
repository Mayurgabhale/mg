dont change anythikg.
   i just want this css in dark and lihg theme ok 
   C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\map.css
/* WORLD MAP WRAPPER - FLEX FIX */
.worldmap-wrapper {
    display: flex;
    gap: 14px;
    width: 100%;
    align-items: flex-start;
    flex-wrap: nowrap;      
    overflow-x: hidden;      
}

/* MAIN MAP CARD */
.worldmap-card {
    flex: 1;
    background: #fff;
    box-shadow: 0 6px 20px rgba(0,0,0,0.06);
    display: flex;
    flex-direction: column;
    max-width: 922px;
}

#realmap {
    height: 550px;
     /* min-width: 400px; */
    width: 100%;
    
}

/* BOTTOM ROW UNDER MAP */
.map-bottom-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* LEGEND */
.legend {
    display: flex;
    flex-wrap: wrap;
}

.legend-item {
    display: flex;
    align-items: center;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.08);
    font-size: 10px;
}

.legend-box {
    width: 10px;
    height: 10px;
}

/* CONTROL BUTTONS */
.map-controls {
    display: flex;
   
}

.btn {
    background: #111827;
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 10px;
}

.map-controls button{
padding: 2px;
gap: 2px;
}

.map-controls  .btn-ghost {
    /* padding: 7px 12px; */
    background: transparent;
    border: 1px solid rgba(0,0,0,0.12);
    /* border-radius: 6px; */
    cursor: pointer;
    font-weight: 600;
    margin-right: 5px;
}
.map-controls .btn-gv{
    background-color: #0f172a;
    color: white;
} 
/* RIGHT PANEL */
.region-panel {
    /* flex: 0 0 330px;          */
    flex: 0 0 200px;         
    max-width: 100%;         
    height: 100%;
    background: #fff;
    /* border-radius: 12px; */
    font-size: 10px;
    padding: 5px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.06);
    overflow-y: auto;       
}

.panel-title {
    font-size: 10px;
    font-weight: 700;
    margin-bottom: 5px;
    white-space: normal;     
}

.panel-content {
    max-height: 340px;
    overflow-y: auto;
    margin-bottom: 18px;
    word-wrap: break-word;   
}

/* FILTER SECTION */
.filter-block {
    border-top: 1px solid rgba(0,0,0,0.08);
    padding-top: 14px;
}

.filter-select {
    width: 100%;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid rgba(0,0,0,0.15);
    margin-bottom: 10px;
}

.filter-actions {
    display: flex;
    gap: 10px;
}
.city-marker .pin {
  width: 10px;
  height: 10px;
  color: rgb(208, 31, 31);
  border-radius: 50%;
  margin-right: 4px;
}
.city-label-box {
  background: rgba(0,0,0,0.75);
  padding: 6px 10px;
  border-radius: 6px;
  color: #00ff99;
  font-size: 13px;
  border: 1px solid #00ff99;
  box-shadow: 0 0 8px rgba(0,255,120,0.5);
}

.city-dotted-path {
  color: #ffaa00;
  weight: 2;
  dashArray: "4 6";
}    
    
    
    
    body { margin:0; font-family: Inter, Roboto, Arial, sans-serif; background:#f6f7fb; color:#0f172a; }
    .container { display:flex; gap:12px; padding:12px; align-items:flex-start; }
    .map-card { flex:1; min-width:720px; background:#fff; border-radius:10px; padding:12px; box-shadow:0 6px 20px rgba(10,10,20,0.06); }
    .panel { width:360px; background:#fff; border-radius:10px; padding:12px; box-shadow:0 6px 20px rgba(10,10,20,0.06); overflow:auto; max-height:920px; }

    .dev-icon { display:flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:8px; color:#fff; }
    .dev-glow { box-shadow: 0 0 10px 3px rgba(0,200,0,0.22); }
    .dev-glow-off { box-shadow: 0 0 10px 3px rgba(200,0,0,0.14); opacity:0.95; }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(0,200,0,0.30); }
      70% { box-shadow: 0 0 0 12px rgba(0,200,0,0); }
      100% { box-shadow: 0 0 0 0 rgba(0,200,0,0); }
    }
    .pulse { animation: pulse 2s infinite; border-radius: 50%; }

    .region-label { background: rgba(0,0,0,0.6); color:#fff; padding:6px 8px; border-radius:6px; font-weight:700; }
    .stat-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(15,23,42,0.04); }
    .badge { display:inline-block; padding:4px 8px; border-radius:999px; font-weight:700; font-size:13px; }
    .badge-apac { background:#0ea5e9; color:#fff; }
    .badge-emea { background:#34d399; color:#fff; }
    .badge-namer { background:#fb923c; color:#fff; }
    .badge-laca { background:#a78bfa; color:#fff; }

    .legend { display:flex; gap:8px; flex-wrap:wrap; margin-top:8px; }
    .legend-item { display:flex; gap:8px; align-items:center; padding:4px 8px; border-radius:6px; background:#fff; border:1px solid rgba(10,10,20,0.04); }

    .controls { display:flex; gap:8px; align-items:center; }

    .city-list { margin-top:8px; max-height:380px; overflow:auto; }


.city-item {
    padding: 3px 6px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgba(15, 23, 42, 0.03);
    margin-bottom: 6px;
}

.city-item:hover {
    background: #f1f5f9;
}
    .small-muted { color:#475569; font-size:10px; }

// /////////////////////////////

live this below css
this is in dakr and lihg theme ok 
dont give this i giveyou ony for the exampl ok i want above css in dark and ligh theme ok 
C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\newcss.css
    /* Theme Variables */
    :root {
      /* Dark Theme (Default) */
      --bg-primary: #0f172a;
      --bg-secondary: #1e293b;
      --bg-card: #1a1d29;
      --text-primary: #f1f5f9;
      --text-secondary: #94a3b8;
      --text-accent: #7c3aed;
      --border-color: #334155;
      --shadow: rgba(0, 0, 0, 0.3);
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --chart-bg: #0a0a0a;
    }

    .theme-light {
      /* Light Theme */
      --bg-primary: #f8fafc;
      --bg-secondary: #ffffff;
      --bg-card: #ffffff;
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --text-accent: #7c3aed;
      --border-color: #e2e8f0;
      --shadow: rgba(0, 0, 0, 0.1);
      --success: #059669;
      --warning: #d97706;
      --danger: #dc2626;
      --chart-bg: #f1f5f9;
    }

    /* Base Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Poppins', sans-serif;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      transition: all 0.3s ease;
      min-height: 100vh;
    }

    /* Layout */
    .container {
      display: flex;
      min-height: 100vh;
    }

    /* Sidebar Styles */
    .sidebar-toggle {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1001;
      background: var(--text-accent);
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px var(--shadow);
      transition: all 0.3s ease;
    }

    .sidebar-toggle:hover {
      transform: scale(1.05);
    }

    #sidebar {
      position: fixed;
      top: 0;
      left: -320px;
      width: 300px;
      height: 100vh;
      background: var(--bg-card);
      color: var(--text-primary);
      padding: 20px;
      overflow-y: auto;
      transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 4px 0 20px var(--shadow);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    #sidebar.active {
      left: 0;
    }

    .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      /* background: rgba(0, 0, 0, 0.5); */
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, visibility 0.3s;
    }

    .sidebar-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    /* Main Content */
    #content {
      margin-top: 35px;
      flex: 1;
      padding: 10px 5px;
      transition: margin-left 0.3s ease;
      margin-left: 0;
    }

    #sidebar.active ~ #content {
      margin-left: 300px;
    }

    /* Details Section */
    .details-section {
      background: var(--bg-secondary);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 20px var(--shadow);
      border: 1px solid var(--border-color);
    }

    .details-header {
      display: flex;
      justify-content: between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .details-header h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-accent);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .details-header h2 i {
      font-size: 1.3rem;
    }

    #device-search {
      flex: 1;
      min-width: 250px;
      padding: 12px 16px;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      background: var(--bg-card);
      color: var(--text-primary);
      font-family: 'Poppins', sans-serif;
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }

    #device-search:focus {
      outline: none;
      border-color: var(--text-accent);
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    }

    #device-search::placeholder {
      color: var(--text-secondary);
    }

    .device-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }




    /* Theme Toggle */
    .theme-toggle {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1001;
      background: var(--text-accent);
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px var(--shadow);
      transition: all 0.3s ease;
    }

    .theme-toggle:hover {
      transform: scale(1.05);
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .graphs-grid.dashboard-layout {
        grid-template-columns: 1fr;
      }
      
      /* .bottom-row {
        grid-template-columns: repeat(2, 1fr);
      } */
    }

    @media (max-width: 768px) {
      #sidebar {
        width: 280px;
        left: -280px;
      }
      
      #sidebar.active ~ #content {
        margin-left: 0;
      }

      .sidebar-toggle {
        top: 15px;
        left: 15px;
        width: 45px;
        height: 45px;
      }

      .details-header {
        flex-direction: column;
        align-items: stretch;
      }

      #device-search {
        min-width: 100%;
      }

      .left-grid {
        grid-template-columns: 1fr;
      }

      /* .bottom-row {
        grid-template-columns: 1fr;
      } */

      .graphs-grid.dashboard-layout {
        gap: 16px;
      }

      .gcard {
        min-height: 180px;
      }
    }

    @media (max-width: 480px) {
      #content {
        padding: 15px;
      }
      
      /* .details-section, .graphs-section {
        padding: 16px;
      } */
      
      .device-grid {
        grid-template-columns: 1fr;
      }
    }

