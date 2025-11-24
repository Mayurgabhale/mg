read this main-graph boht css file  section carefully,
  and give me correct i measn, responvie code for all device and screen size ok,
  i and this sectin fully responsive ok for eac and every screen size ok
  withc correct ok,
    and dont chaen my priviseu code logic, and just give me update and responvie corrrec code, 
      <section id="main-graph" class="graphs-section">
        <div class="graphs-inner">

          <div class="graphs-grid dashboard-layout">
            <!-- Left 2x2 cards -->
            <div class="left-grid">
              <div class="gcard">
                <h4 class="gcard-title">Total No. of Cameras</h4>
                <div class="semi-donut gauge" id="gauge-cameras" data-fill="#12b76a"
                  style="--percentage:0; --fill:#12b76a">
                  <div class="gtext">
                    <b class="total">0</b>
                    <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
                  </div>
                </div>
              </div>

              <div class="gcard">
                <h4 class="gcard-title">Total No. of Archivers</h4>
                <div class="semi-donut gauge" id="gauge-archivers" data-fill="#12b76a"
                  style="--percentage:0; --fill:#12b76a">
                  <div class="gtext">
                    <b class="total">0</b>
                    <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
                  </div>
                </div>
              </div>

              <div class="gcard">
                <h4 class="gcard-title">Total No. of Controllers</h4>
                <div class="semi-donut gauge" id="gauge-controllers" data-fill="#12b76a"
                  style="--percentage:0; --fill:#12b76a">
                  <div class="gtext">
                    <b class="total">0</b>
                    <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
                  </div>
                </div>
              </div>

              <div class="gcard">
                <h4 class="gcard-title">TOTAL No. of CCURE</h4>
                <div class="semi-donut gauge" id="gauge-ccure" data-fill="#12b76a"
                  style="--percentage:0; --fill:#12b76a">
                  <div class="gtext">
                    <b class="total">0</b>
                    <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
                  </div>
                </div>
              </div>


              <div class="gcard wide" style="height:280px; width: 728px;">
                <h4 class="gcard-title">Offline Device</h4>
                <canvas id="DotOfflineDevice" style="height:280px; width: 728px;"></canvas>
              </div>

            </div>
            <!-- .......................................... -->

            <!-- RIGHT PANEL — WORLD MAP -->
            <div class="right-panel">
              <!-- <div class="gcard tall"> -->
              <div class="">
                <div class="worldmap-wrapper">
                  <!-- MAP CARD -->
                  <div class="worldmap-card">
                    <!-- Fullscreen Button -->
                    <button id="mapFullscreenBtn" class="map-fullscreen-btn">
                      ⛶ View Full
                    </button>
                    <button id="mapCityOverviewBtn" class="map-CityOverview-btn">
                      City Overview
                    </button>
                    <!-- SIDE PANEL -->
                    <div class="region-panel" id="region-panel">
                      <h4 class="panel-title">Global (City Overview)</h4>
                      <div id="region-panel-content" class="panel-content"></div>
                    </div>

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



                </div>
              </div>
            </div>


            <div class="bottom-row">

              <div class="gcard wide gcard-pie" style="height:300px; width: 728px;">
                <h4 class="gcard-title">Total Count </h4>
                <div class="chart-placeholder"></div>
              </div>

              <!-- <div class="gcard wide" id="Loc-Count-chart" style="height:300px; width: 1208px; margin-bottom: 50px">
                <h4 class="gcard-title">LOC Count</h4>
                <canvas id="cityBarChart"></canvas>
              </div> -->
              <div class="gcard wide" id="Loc-Count-chart">
                <h4 class="gcard-title">LOC Count</h4>
                <canvas id="cityBarChart"></canvas>
              </div>

            </div>
          </div>
        </div>

C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\graph.css
  /* Graph Section - Dark/Light Theme */
:root {
    /* Dark Theme Colors */
    --graph-bg-dark: #0a0a0a;
    --graph-text-dark: #e6eef7;
    --graph-title-dark: #2ef07f;
    /* --graph-card-bg-dark: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01)); */
    --graph-card-bg-dark: linear-gradient(180deg, rgba(255, 255, 255, 0.099), rgba(255, 255, 255, 0.104));
    --graph-card-border-dark: rgba(255, 255, 255, 0.94);
    --graph-card-title-dark: #cfeeed;
    --graph-card-footer-dark: #98a3a8;
    --graph-map-bg-dark: #060606;
    --graph-map-text-dark: #b8f4c9;
    --graph-map-annot-bg-dark: rgba(0, 0, 0, 0.45);
    --graph-map-annot-border-dark: rgba(255, 255, 255, 0.04);
    --graph-gauge-active: #12b76a;
    --graph-gauge-inactive: #f6b43a;
    --graph-gauge-total: #0ee08f;
    --graph-gauge-text: #f6b43a;
    --graph-shadow-dark: rgba(0, 0, 0, 0.6);
}

.theme-light {
    /* Light Theme Colors */
    --graph-bg-light: #f8fafc;
    --graph-text-light: #1e293b;
    --graph-title-light: #059669;
    --graph-card-bg-light: linear-gradient(180deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.01));
    --graph-card-border-light: rgba(0, 0, 0, 0.08);
    --graph-card-title-light: #374151;
    --graph-card-footer-light: #6b7280;
    --graph-map-bg-light: #ffffff;
    --graph-map-text-light: #059669;
    --graph-map-annot-bg-light: rgba(0, 0, 0, 0.05);
    --graph-map-annot-border-light: rgba(0, 0, 0, 0.1);
    --graph-gauge-active: #10b981;
    --graph-gauge-inactive: #d97706;
    --graph-gauge-total: #059669;
    --graph-gauge-text: #d97706;
    --graph-shadow-light: rgba(0, 0, 0, 0.1);
}

/* Overall section */
.graphs-section {
    background: var(--graph-bg-dark);
    color: var(--graph-text-dark);
    padding-top: 20px;
    padding-bottom: 40px;
    border-radius: 12px;
    font-family: 'Poppins', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    box-shadow: 0 6px 24px var(--graph-shadow-dark);
    height: 100vh;
}

.theme-light .graphs-section {
    background: var(--graph-bg-light);
    color: var(--graph-text-light);
    box-shadow: 0 6px 24px var(--graph-shadow-light);
}

/* Header */
.graphs-title {
    color: var(--graph-title-dark);
    font-size: 20px;
    margin-bottom: 14px;
    letter-spacing: 2px;
    font-weight: 700;
}

.theme-light .graphs-title {
    color: var(--graph-title-light);
}



.graphs-grid.dashboard-layout {
    gap: 7px;
    display: grid;
    align-items: start;
    grid-auto-rows: auto;
    grid-template-columns: 1fr 1250px;
}

/* Left area is its own grid to form 2x2 cards */
.left-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(320px, 1fr));
    
    gap: 8px;

}




.right-panel .gcard.tall {
    height: auto;
    display: flex;
    flex-direction: column;
}

/* Bottom row (spans full width below left + right) */
.bottom-row {
    grid-column: 1 / -1;
   
    display: grid;
    grid-template-columns: repeat(3, 1fr);
   
}

/* General card */
.gcard {
    background: var(--graph-card-bg-dark);
    border: 1px solid black;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    transition: all 0.3s ease;
}

.theme-light .gcard {
    background: var(--graph-card-bg-light);
    border: 1px solid var(--graph-card-border-light);
}

.gcard:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px var(--graph-shadow-dark);
}

.theme-light .gcard:hover {
    box-shadow: 0 8px 25px var(--graph-shadow-light);
}

/* Card title */
.gcard-title {
    font-size: 13px;
    color: var(--graph-card-title-dark);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.theme-light .gcard-title {
    color: var(--graph-card-title-light);
}

/* Small footer row in the card */
.gcard-foot.small {
    display: flex;
    justify-content: space-between;
    margin-top: auto;
    color: var(--graph-card-footer-dark);
    font-size: 12px;
}

.theme-light .gcard-foot.small {
    color: var(--graph-card-footer-light);
}


#Loc-Count-chart{
   
   width: 1250px;
   position: relative;
   top: 5px;
}

/* Placeholders for charts & map */
.map-placeholder {
    background: var(--graph-map-bg-dark);
    border-radius: 8px;
    height: 100%;
    min-height: 500px !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 12px;
    position: relative;
    color: var(--graph-map-text-dark);
    font-weight: 600;
}

.theme-light .map-placeholder {
    background: var(--graph-map-bg-light);
    color: var(--graph-map-text-light);
}

/* Simple annotation boxes for map example */
.map-annot {
    background: var(--graph-map-annot-bg-dark);
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid var(--graph-map-annot-border-dark);
    font-size: 12px;
    text-align: center;
}

.theme-light .map-annot {
    background: var(--graph-map-annot-bg-light);
    border: 1px solid var(--graph-map-annot-border-light);
}

/* Chart placeholders */
.chart-placeholder {
    max-height: 280px;
    border-radius: 8px;
    margin-top: 8px;
    background: var(--graph-map-bg-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--graph-map-text-dark);
    font-weight: 600;
}

.theme-light .chart-placeholder {
    background: var(--graph-map-bg-light);
    color: var(--graph-map-text-light);
}

/* ================= Semi Donut (dashboard smaller sizing) =============== */
.semi-donut {
    --percentage: 0;
    --active: var(--graph-gauge-active);
    --inactive: var(--graph-gauge-inactive);
    width: 300px;
    height: 150px;
    position: relative;
    font-size: 22px;
    font-weight: 600;
    overflow: hidden;
    color: var(--active);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    box-sizing: border-box;
}

/* Half circle background + fill */
.semi-donut::after {
    content: '';
    width: 300px;
    height: 300px;
    border: 50px solid;
    border-color: var(--inactive) var(--inactive) var(--active) var(--active);
    position: absolute;
    border-radius: 50%;
    left: 0;
    top: 0;
    transform: rotate(calc(-45deg + var(--percentage) * 1.8deg));
    animation: fillAnimation 1s ease-in;
    box-sizing: border-box;
}

@keyframes fillAnimation {
    from {
        transform: rotate(-45deg);
    }

    to {
        transform: rotate(calc(-45deg + var(--percentage) * 1.8deg));
    }
}

/* Inside text */
.gtext {
    position: absolute;
    bottom: 8px;
    text-align: center;
    color: var(--graph-gauge-text);
}

.gtext .total {
    font-size: 20px;
    color: var(--graph-gauge-total);
    display: block;
}

.gtext small {
    font-size: 12px;
    color: var(--graph-card-footer-dark);
    display: block;
}

.theme-light .gtext small {
    color: var(--graph-card-footer-light);
}

/* ⬇️⬇️⬇️⬇️⬇️⬇️ */






/* Responsive */
@media (max-width: 1100px) {
    .graphs-grid.dashboard-layout {
        grid-template-columns: 1fr;
    }

    .left-grid {
        grid-template-columns: 1fr 1fr;
    }

    .bottom-row {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .graphs-section {
        padding: 16px;
    }

    .left-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .semi-donut {
        width: 250px;
        height: 125px;
    }

    .semi-donut::after {
        width: 250px;
        height: 250px;
        border-width: 40px;
    }
}

@media (max-width: 480px) {
    .graphs-section {
        padding: 12px;
    }

    .graphs-title {
        font-size: 18px;
    }

    .semi-donut {
        width: 200px;
        height: 100px;
    }

    .semi-donut::after {
        width: 200px;
        height: 200px;
        border-width: 30px;
    }

    .gtext .total {
        font-size: 18px;
    }

    .gtext small {
        font-size: 10px;
    }
}


/* ⬇️⬇️⬇️⬇️⬇️⬇️ */
.gcard.wide .chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  box-sizing: border-box;
  min-height: 160px; /* adjusts by breakpoints already in your CSS */
  width: 100%;
}

/* canvas should fill placeholder responsively */
.gcard.wide .chart-placeholder canvas {
  width: 100% !important;
  height: 100% !important;
  max-width: 420px;    /* keeps it from growing too large on desktops */
  max-height: 360px;
}


.gcard-pie{
    /* width: 700px; */
     background: var(--graph-map-bg-light);
    border: 1px solid black;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    transition: all 0.3s ease;
    
}

/* /////////// */

/* smaller screens */
@media (max-width: 768px) {
  .chart-placeholder { min-height: 190px; }
}
@media (max-width: 480px) {
  .chart-placeholder { min-height: 160px; }
}










/* ☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️☝️ */


.device-health-card {
  height: 250px;
  overflow-y: auto;
}

#device-health-table {
  width: 100%;
  border-collapse: collapse;
}

#device-health-table th, #device-health-table td {
  padding: 8px;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
}

.trend-up { color: #10b981; }   /* green */
.trend-down { color: #ef4444; } /* red */

/* /////////////// */

.gcard wide {
  position: relative;
}

#failureCountChart {
  width: 100% !important;
  height: 100% !important;
}


####
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
    /* 
    .region-panel {
        display: none;
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
    } */

    .region-panel {
        display: none;
        max-width: 100%;
        background: var(--bg-card);
        font-size: 10px;
        padding: 5px;
        box-shadow: 0 6px 20px var(--shadow);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        position: absolute;
        top: 70px;
        right: -19px;
        z-index: 9999;
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
        color: #fff;
        font-size: 18px;
        transition: transform 120ms ease, opacity 120ms ease;
    }



    /* default icon color */
    .city-marker .pin i {
        color: #ffd;
        /* subtle default */
        transform-origin: center;
        font-size: 25px;
    }

    /* blinking behaviour */
    .city-marker .pin.blink {
        animation: city-pin-blink 1.0s infinite ease-in-out;
    }

    /* change color when blinking (more visible) */
    .city-marker .pin.blink i {
        color: #ff3b3b;
        /* red when blinking */
        text-shadow: 0 0 6px rgba(255, 59, 59, 0.9);
    }

    /* keyframes */
    @keyframes city-pin-blink {
        0% {
            opacity: 1;
            transform: scale(1);
        }

        50% {
            opacity: 0.25;
            transform: scale(1.12);
        }

        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    /* optionally add severity styles (if you want) */
    .city-marker .pin.blink-high i {
        color: #ff0000;
    }


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





    .city-summary-tooltip {
        background: rgba(0, 0, 0, 0.85) !important;
        color: #fff !important;
        border: none !important;
        padding: 8px 10px !important;
        border-radius: 6px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35) !important;
        font-size: 13px !important;
        line-height: 1.2 !important;
        width: auto !important;
        max-width: 260px !important;
    }



    .leaflet-control-attribution {
        display: none !important;
    }



    #cityBarChart {
        width: 100% !important;
        height: 300px !important;
    }


    /* /// */



    /* Fullscreen mode */
    .worldmap-card.fullscreen {
        position: fixed;
        left: 400px;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
        z-index: 99999;
        background: #0f172a;
    }


    /* Resize the map container to fill parent */
    .worldmap-card.fullscreen #realmap {
        width: 100% !important;
        height: 100% !important;
    }

    /* Keep bottom bar visible */
    .worldmap-card.fullscreen .map-bottom-bar {
        position: absolute;
        bottom: 0;
        width: 100%;
        z-index: 99999;
    }



    /* Fullscreen button (top right) */
    .map-fullscreen-btn {
        position: absolute;
        top: 10px;
        right: 12px;
        z-index: 9999;
        padding: 6px 10px;
        font-size: 11px;
        border: 1px solid var(--border-color);
        background: var(--bg-primary);
        color: var(--text-primary);
        cursor: pointer;
        border-radius: 4px;
        transition: 0.3s ease;
    }

    .map-fullscreen-btn:hover {
        background: #1f2937;
    }

    /* Make map card a reference for button */
    .worldmap-card {
        position: relative;
        overflow: hidden;
    }

    .map-CityOverview-btn {
        position: absolute;
        top: 40px;
        right: 12px;
        z-index: 9999;
        padding: 6px 10px;
        font-size: 11px;
        border: 1px solid var(--border-color);
        background: var(--bg-primary);
        color: var(--text-primary);
        cursor: pointer;
        border-radius: 4px;
        transition: 0.3s ease;
    }
      </section>
