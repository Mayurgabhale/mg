 <!-- SIDE PANEL -->
                  <div class="region-panel" id="region-panel">
                    <h4 class="panel-title">Global (City Overview)</h4>
                    <div id="region-panel-content" class="panel-content"></div>
                  </div>
    this sectin Global (City Overview) this i want ot add in map,
   for exmapl i want in map one buttion when i clikc on this buttin that timeopn this ok, like that 
       i measn worldmap-card in this ok, 
   so can yo do this..... 

<div class="worldmap-card">
                    <!-- Fullscreen Button -->
                    <button id="mapFullscreenBtn" class="map-fullscreen-btn">
                      ⛶ View Full
                    </button>

                    <div id="realmap"></div>

                    <!-- Legend + Controls Row -->
                    <div class="map-bottom-bar">

                      <!-- Legend -->
                      <div class="legend">
                        <div class="legend-item">
                          <i class="bi bi-camera"></i>
                          Camera
                        </div>
                        <div class="legend-item">
                          <i class="bi bi-hdd"></i> Controller
                        </div>
                        <div class="legend-item">
                          <i class="fa-duotone fa-solid fa-server"></i> Server
                        </div>
                        <div class="legend-item">
                          <i class="fas fa-database "></i> Archiver
                        </div>
                      </div>

                      <!-- Controls -->
                      <div class="map-controls">
                        <button id="fit-all" class="btn-ghost">Fit All</button>
                        <button id="show-global" class="btn-gv">Global View</button>
                      </div>

                    </div>
                  </div>
------------
    <div class="worldmap-wrapper">
                  <!-- MAP CARD -->
                  <div class="worldmap-card">
                    <!-- Fullscreen Button -->
                    <button id="mapFullscreenBtn" class="map-fullscreen-btn">
                      ⛶ View Full
                    </button>

                    <div id="realmap"></div>

                    <!-- Legend + Controls Row -->
                    <div class="map-bottom-bar">

                      <!-- Legend -->
                      <div class="legend">
                        <div class="legend-item">
                          <i class="bi bi-camera"></i>
                          Camera
                        </div>
                        <div class="legend-item">
                          <i class="bi bi-hdd"></i> Controller
                        </div>
                        <div class="legend-item">
                          <i class="fa-duotone fa-solid fa-server"></i> Server
                        </div>
                        <div class="legend-item">
                          <i class="fas fa-database "></i> Archiver
                        </div>
                      </div>

                      <!-- Controls -->
                      <div class="map-controls">
                        <button id="fit-all" class="btn-ghost">Fit All</button>
                        <button id="show-global" class="btn-gv">Global View</button>
                      </div>

                    </div>
                  </div>

                  <!-- SIDE PANEL -->
                  <div class="region-panel" id="region-panel">
                    <h4 class="panel-title">Global (City Overview)</h4>
                    <div id="region-panel-content" class="panel-content"></div>
                  </div>
                </div>
C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\map.css
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
        background: var(--bg-card);
        box-shadow: 0 6px 20px var(--shadow);
        display: flex;
        flex-direction: column;
        /* max-width: 922px; */
        max-width: 1200px;
        border: 1px solid var(--border-color);
    }

    #realmap {
        height: 550px;
        width: 100%;

    }

    /* BOTTOM ROW UNDER MAP */
    .map-bottom-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--bg-card);
        color: var(--text-primary);
    }

    /* LEGEND */
    .legend {
        display: flex;
        flex-wrap: wrap;
    }



    .legend-item {
        display: flex;
        align-items: center;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        font-size: 10px;
        color: var(--text-primary);
        padding: 2px 4px;
    }

    .legend-item i {
        margin: 2px;
    }

    .legend-box {
        width: 10px;
        height: 10px;
        background: var(--bg-secondary);
        color: var(--text-primary);

    }

    /* CONTROL BUTTONS */
    .map-controls {
        display: flex;

    }


    .btn {
        background: var(--bg-primary);
        color: var(--text-primary);
        border: none;
        cursor: pointer;
        font-size: 10px;
    }

    .map-controls button {
        padding: 2px;
        gap: 2px;
    }



    .map-controls .btn-ghost {
        background: transparent;
        border: 1px solid var(--border-color);
        cursor: pointer;
        font-weight: 600;
        margin-right: 5px;
        color: var(--text-primary);
    }



    .map-controls .btn-gv {
        background-color: var(--bg-primary);
        color: var(--text-primary);
    }


    /* RIGHT PANEL */

    .region-panel {
        flex: 0 0 200px;
        max-width: 100%;
        height: 100%;
        background: var(--bg-card);
        font-size: 10px;
        padding: 5px;
        box-shadow: 0 6px 20px var(--shadow);
        overflow-y: auto;
        border: 1px solid var(--border-color);
        color: var(--text-primary);
    }



    .panel-title {
        font-size: 10px;
        font-weight: 700;
        margin-bottom: 5px;
        white-space: normal;
        color: var(--text-primary);
    }


    .panel-content {
        max-height: 340px;
        overflow-y: auto;
        margin-bottom: 18px;
        word-wrap: break-word;
    }

    /* FILTER SECTION */
    .filter-block {
        border-top: 1px solid var(--border-color);
        padding-top: 14px;
    }

    .filter-select {
        width: 100%;
        padding: 8px;
        border-radius: 6px;
        border: 1px solid var(--border-color);
        margin-bottom: 10px;
        background: var(--bg-secondary);
        color: var(--text-primary);
    }

    .filter-actions {
        display: flex;
        gap: 10px;
    }

 
    /* pin base */
    .city-marker .pin {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 27px;
        height: 27px;
        border-radius: 50%;
        /* background: rgba(0, 0, 0, 0.35); */
        color: #fff;
        font-size: 18px;
        /* box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4); */
        transition: transform 120ms ease, opacity 120ms ease;
    }


    
/* default icon color */
.city-marker .pin i {
  color: #ffd; /* subtle default */
  transform-origin: center;
  font-size: 25px;
}

/* blinking behaviour */
.city-marker .pin.blink {
  animation: city-pin-blink 1.0s infinite ease-in-out;
}

/* change color when blinking (more visible) */
.city-marker .pin.blink i {
  color: #ff3b3b;     /* red when blinking */
  text-shadow: 0 0 6px rgba(255,59,59,0.9);
}

/* keyframes */
@keyframes city-pin-blink {
  0%   { opacity: 1; transform: scale(1); }
  50%  { opacity: 0.25; transform: scale(1.12); }
  100% { opacity: 1; transform: scale(1); }
}

/* optionally add severity styles (if you want) */
.city-marker .pin.blink-high i { color: #ff0000; }


    .pin i {
        font-size: 19px;
    }

    .city-label-box {
        background: rgba(0, 0, 0, 0.75);
        padding: 6px 10px;
        border-radius: 6px;
        color: #00ff99;
        font-size: 13px;
        border: 1px solid #00ff99;
        box-shadow: 0 0 8px rgba(0, 255, 120, 0.5);
    }

    .city-dotted-path {
        color: #ffaa00;
        weight: 2;
        dashArray: "4 6";
    }




    body {
        background: var(--bg-primary);
        color: var(--text-primary);
    }

    .container {
        display: flex;
        gap: 12px;
        padding: 12px;
        align-items: flex-start;
    }

    .map-card {
        flex: 1;
        min-width: 720px;
        background: var(--bg-card);
        border-radius: 10px;
        padding: 12px;
        box-shadow: 0 6px 20px var(--shadow);
        border: 1px solid var(--border-color);
    }

    .panel {
        width: 360px;
        background: var(--bg-card);
        border-radius: 10px;
        padding: 12px;
        box-shadow: 0 6px 20px var(--shadow);
        overflow: auto;
        max-height: 920px;
        border: 1px solid var(--border-color);
    }

    .dev-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 8px;
        color: #fff;
    }

    .dev-glow {
        box-shadow: 0 0 10px 3px rgba(0, 200, 0, 0.22);
    }

    .dev-glow-off {
        box-shadow: 0 0 10px 3px rgba(200, 0, 0, 0.14);
        opacity: 0.95;
    }

    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(0, 200, 0, 0.30);
        }

        70% {
            box-shadow: 0 0 0 12px rgba(0, 200, 0, 0);
        }

        100% {
            box-shadow: 0 0 0 0 rgba(0, 200, 0, 0);
        }
    }

    .pulse {
        animation: pulse 2s infinite;
        border-radius: 50%;
    }

    .region-label {
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        padding: 6px 8px;
        border-radius: 6px;
        font-weight: 700;
    }

    .stat-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid rgba(15, 23, 42, 0.04);
    }

    .badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 999px;
        font-weight: 700;
        font-size: 13px;
    }

    .badge-apac {
        background: #0ea5e9;
        color: #fff;
    }

    .badge-emea {
        background: #34d399;
        color: #fff;
    }

    .badge-namer {
        background: #fb923c;
        color: #fff;
    }

    .badge-laca {
        background: #a78bfa;
        color: #fff;
    }

    .legend {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 8px;
    }

    .controls {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .city-list {
        margin-top: 8px;
        max-height: 380px;
        overflow: auto;
    }


    .city-item {
        padding: 3px 6px;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid var(--border-color);
        margin-bottom: 6px;
        background: var(--bg-secondary);
        color: var(--text-primary);
    }

    .city-item:hover {
        background: var(--bg-primary);
    }

    .small-muted {
        color: var(--text-secondary);
        font-size: 10px;
    }




    .leaflet-popup-content-wrapper {
        background: var(--bg-card, #fff);
        color: var(--text-primary, #111);
        border-radius: 8px;
        padding: 8px 10px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    }


