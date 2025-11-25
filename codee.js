main-graph this sectin i want to fit to each and every screen size, wihotu any scroll bar 
    withou and vertical and horizontal scroll, bar
    main is laptop and desktop, i dont want any scroll bar ok 
        how to do this give me ony update new code not all css ok 
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


              <!-- <div class="gcard wide" style="height:280px; width: 728px;">
                <h4 class="gcard-title">Offline Device</h4>
                <canvas id="DotOfflineDevice" style="height:280px; width: 728px;"></canvas>
              </div> -->
              
              <!-- Updated Offline Device Card with new class -->
              <div class="offline-device-card">
                <h4 class="gcard-title">Offline Device</h4>
                <div class="chart-container">
                  <canvas id="DotOfflineDevice"></canvas>
                </div>
              </div>

              <div class="gcard wide gcard-pie offline-device-card" style="height:300px; width: 728px;">
                <h4 class="gcard-title">Total Count </h4>
                <div class="chart-placeholder"></div>
              </div>

              <!-- <div class="gcard wide gcard-pie" style="height:300px; width: 728px;">
                <h4 class="gcard-title">Total Count </h4>
                <div class="chart-placeholder"></div>
              </div> -->

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
                <div class="gcard wide" id="Loc-Count-chart">
                <h4 class="gcard-title">LOC Count</h4>
                <canvas id="cityBarChart"></canvas>
              </div>
            </div>


            <div class="bottom-row">

              <!-- <div class="gcard wide gcard-pie" style="height:300px; width: 728px;">
                <h4 class="gcard-title">Total Count </h4>
                <div class="chart-placeholder"></div>
              </div> -->

<!--             
              <div class="gcard wide" id="Loc-Count-chart">
                <h4 class="gcard-title">LOC Count</h4>
                <canvas id="cityBarChart"></canvas>
              </div> -->

            </div>
          </div>
        </div>
      </section>

-------------
    C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\graph.css

/* Graph Section - Dark/Light Theme */
:root {
    /* Dark Theme Colors */
    --graph-bg-dark: #0a0a0a;
    --graph-text-dark: #e6eef7;
    --graph-title-dark: #2ef07f;
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
    padding: 20px 15px 40px;
    border-radius: 12px;
    font-family: 'Poppins', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    box-shadow: 0 6px 24px var(--graph-shadow-dark);
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
}

.theme-light .graphs-section {
    background: var(--graph-bg-light);
    color: var(--graph-text-light);
    box-shadow: 0 6px 24px var(--graph-shadow-light);
}

/* Header */
.graphs-title {
    color: var(--graph-title-dark);
    font-size: clamp(18px, 4vw, 24px);
    margin-bottom: 14px;
    letter-spacing: 2px;
    font-weight: 700;
    text-align: center;
}

.theme-light .graphs-title {
    color: var(--graph-title-light);
}

.graphs-inner {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
}

/* Main grid layout - Responsive */
.graphs-grid.dashboard-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    align-items: start;
    grid-auto-rows: auto;
    width: 100%;
    box-sizing: border-box;
}

/* Left area is its own grid to form cards */
.left-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 8px;
    width: 100%;
    box-sizing: border-box;
}

/* Right panel - World Map */
.right-panel {
    width: 100%;
    box-sizing: border-box;
}

.right-panel .gcard.tall {
    height: auto;
    display: flex;
    flex-direction: column;
}

/* Bottom row (spans full width below left + right) */
.bottom-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    width: 100%;
    box-sizing: border-box;
}

/* General card */
.gcard {
    background: var(--graph-card-bg-dark);
    border: 1px solid var(--graph-card-border-dark);
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    transition: all 0.3s ease;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
    min-height: 200px;
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
    font-size: clamp(12px, 2.5vw, 16px);
    color: var(--graph-card-title-dark);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 10px;
    line-height: 1.3;
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

/* Wide card adjustments */
.gcard.wide {
    width: 100% !important;
    height: auto !important;
    min-height: 280px;
}

/* Chart containers */
#Loc-Count-chart {
    width: 100%;
    min-height: 120px;
    position: relative;
    margin-top: 20px;
    box-sizing: border-box;
}

/* Placeholders for charts & map */
.map-placeholder {
    background: var(--graph-map-bg-dark);
    border-radius: 8px;
    height: 100%;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 12px;
    position: relative;
    color: var(--graph-map-text-dark);
    font-weight: 600;
    box-sizing: border-box;
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
    border-radius: 8px;
    margin-top: 8px;
    background: var(--graph-map-bg-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--graph-map-text-dark);
    font-weight: 600;
    width: 100%;
    height: 100%;
    min-height: 200px;
    box-sizing: border-box;
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
    width: 100%;
    max-width: 300px;
    height: 150px;
    position: relative;
    font-size: clamp(16px, 4vw, 22px);
    font-weight: 600;
    overflow: hidden;
    color: var(--active);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    box-sizing: border-box;
    margin: 0 auto;
}

/* Half circle background + fill */
.semi-donut::after {
    content: '';
    width: 100%;
    height: 200%;
    max-width: 300px;
    max-height: 300px;
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
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
}

.gtext .total {
    font-size: clamp(16px, 4vw, 22px);
    color: var(--graph-gauge-total);
    display: block;
    line-height: 1.2;
}

.gtext small {
    font-size: clamp(10px, 2.5vw, 14px);
    color: var(--graph-card-footer-dark);
    display: block;
    line-height: 1.3;
}

.theme-light .gtext small {
    color: var(--graph-card-footer-light);
}

/* Canvas responsiveness */
.gcard.wide canvas {
    width: 100% !important;
    height: 100% !important;
    max-height: 280px;
    box-sizing: border-box;
}

.gcard-pie {
    background: var(--graph-card-bg-dark);
    border: 1px solid var(--graph-card-border-dark);
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    transition: all 0.3s ease;
    width: 100%;
    box-sizing: border-box;
}

.theme-light .gcard-pie {
    background: var(--graph-card-bg-light);
    border: 1px solid var(--graph-card-border-light);
}

/* Device health table */
.device-health-card {
    height: 250px;
    overflow-y: auto;
}

#device-health-table {
    width: 100%;
    border-collapse: collapse;
    font-size: clamp(12px, 2vw, 14px);
}

#device-health-table th, #device-health-table td {
    padding: 8px;
    text-align: center;
    border-bottom: 1px solid var(--graph-card-border-dark);
}

.theme-light #device-health-table th,
.theme-light #device-health-table td {
    border-bottom: 1px solid var(--graph-card-border-light);
}

.trend-up { color: #10b981; }   /* green */
.trend-down { color: #ef4444; } /* red */

/* Failure count chart */
#failureCountChart {
    width: 100% !important;
    height: 100% !important;
    box-sizing: border-box;
}

/* Responsive Design */
/* Tablets and larger phones */
@media (min-width: 768px) {
    .graphs-grid.dashboard-layout {
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
    
    .left-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .bottom-row {
        grid-column: 1 / -1;
        grid-template-columns: 1fr 2fr;
        gap: 20px;
    }
    
    .gcard.wide {
        min-height: 300px;
    }
}

/* Desktop and larger tablets */
@media (min-width: 1024px) {
    .graphs-grid.dashboard-layout {
        grid-template-columns: 1fr 1.5fr;
        gap: 25px;
    }
    
    .left-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 5px;
    }
    
    .bottom-row {
        grid-template-columns: 1fr 2fr;
        gap: 25px;
    }
    
    .gcard.wide {
        min-height: 320px;
    }
}

/* Large desktops */
@media (min-width: 1440px) {
    .graphs-grid.dashboard-layout {
        grid-template-columns: 1fr 2fr;
    }
    
    .left-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 5px;
    }
     
}


/* Mobile devices */
@media (max-width: 767px) {
    .graphs-section {
        padding: 15px 10px 30px;
    }
    
    .left-grid {
        grid-template-columns: 1fr;
        gap: 5px;
    }
    
    .semi-donut {
        max-width: 250px;
        height: 125px;
    }
    
    .semi-donut::after {
        border-width: 40px;
    }
    
    .gcard {
        padding: 5px;
        min-height: 180px;
    }
    
    .gcard.wide {
        min-height: 250px;
    }
}

/* Small mobile devices */
@media (max-width: 480px) {
    .graphs-section {
        padding: 12px 8px 20px;
    }
    
    .graphs-title {
        font-size: 18px;
        letter-spacing: 1px;
    }
    
    .semi-donut {
        max-width: 200px;
        height: 100px;
    }
    
    .semi-donut::after {
        border-width: 30px;
    }
    
    .gtext .total {
        font-size: 16px;
    }
    
    .gtext small {
        font-size: 10px;
    }
    
    .gcard {
        padding: 3px;
        min-height: 160px;
    }
    
    .gcard-title {
        font-size: 12px;
        margin-bottom: 8px;
    }
    
    .gcard.wide {
        min-height: 220px;
    }
}

/* Extra small devices */
@media (max-width: 360px) {
    .left-grid {
        grid-template-columns: 1fr;
        gap: 10px;
    }
    
    .semi-donut {
        max-width: 180px;
        height: 90px;
    }
    
    .semi-donut::after {
        border-width: 25px;
    }
    
    .gcard {
        min-height: 150px;
        padding: 8px;
    }
}



/*  */
/* Offline Device Graph Card */
.offline-device-card {
    background: var(--graph-card-bg-dark);
    border: 1px solid var(--graph-card-border-dark);
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    transition: all 0.3s ease;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
    min-height: 280px;
    grid-column: 1 / -1; /* Span full width in grid */
}

.theme-light .offline-device-card {
    background: var(--graph-card-bg-light);
    border: 1px solid var(--graph-card-border-light);
}

.offline-device-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px var(--graph-shadow-dark);
}

.theme-light .offline-device-card:hover {
    box-shadow: 0 8px 25px var(--graph-shadow-light);
}

/* Card title specific for offline device */
.offline-device-card .gcard-title {
    font-size: clamp(14px, 2.5vw, 16px);
    color: var(--graph-card-title-dark);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 15px;
    /* text-align: center; */
}

.theme-light .offline-device-card .gcard-title {
    color: var(--graph-card-title-light);
}

/* Canvas container for offline device chart */
.offline-device-card .chart-container {
    width: 100%;
    height: 100%;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

/* Canvas element styling */
#DotOfflineDevice {
    width: 100% !important;
    height: 100% !important;
    max-height: 240px;
    box-sizing: border-box;
}

/* Responsive Design for Offline Device Card */
/* Tablets and larger phones */
@media (min-width: 768px) {
    .offline-device-card {
        grid-column: 1 / -1;
        min-height: 300px;
    }
    
    #DotOfflineDevice {
        max-height: 260px;
    }
}

/* Desktop and larger tablets */
@media (min-width: 1024px) {
    .offline-device-card {
        min-height: 320px;
    }
    
    #DotOfflineDevice {
        max-height: 280px;
    }
}

/* Mobile devices */
@media (max-width: 767px) {
    .offline-device-card {
        min-height: 250px;
        padding: 12px;
    }
    
    #DotOfflineDevice {
        max-height: 200px;
    }
}

/* Small mobile devices */
@media (max-width: 480px) {
    .offline-device-card {
        min-height: 220px;
        padding: 10px;
    }
    
    .offline-device-card .gcard-title {
        font-size: 13px;
        margin-bottom: 10px;
    }
    
    #DotOfflineDevice {
        max-height: 180px;
    }
}

/* Extra small devices */
@media (max-width: 360px) {
    .offline-device-card {
        min-height: 200px;
    }
    
    #DotOfflineDevice {
        max-height: 160px;
    }
}
------------------
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
    flex-direction: column;
    width: 100%;
    align-items: flex-start;
    box-sizing: border-box;
}

/* MAIN MAP CARD */
.worldmap-card {
    width: 100%;
    background: var(--bg-card);
    box-shadow: 0 6px 20px var(--shadow);
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;

    
}

#realmap {
    height: 400px;
    width: 100%;
    box-sizing: border-box;
}

/* BOTTOM ROW UNDER MAP */
.map-bottom-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-card);
    color: var(--text-primary);
    /* padding: 12px 15px; */
    /* padding: 5px 7px; */
    gap: 15px;
    box-sizing: border-box;
    width: 100%;
}

/* LEGEND */
.legend {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
}

.legend-item {
    display: flex;
    align-items: center;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    font-size: clamp(10px, 2vw, 12px);
    color: var(--text-primary);
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap;
}

.legend-item i {
    margin-right: 4px;
    font-size: clamp(10px, 2vw, 12px);
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
    gap: 8px;
    flex-wrap: wrap;
}

.map-controls button {
    padding: 6px 12px;
    font-size: clamp(10px, 2vw, 12px);
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid var(--border-color);
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: all 0.3s ease;
    white-space: nowrap;
}

.map-controls button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}

.map-controls .btn-ghost {
    background: transparent;
    border: 1px solid var(--border-color);
    font-weight: 600;
    color: var(--text-primary);
}

.map-controls .btn-gv {
    background-color: var(--bg-primary);
    color: var(--text-primary);
}

/* RIGHT PANEL */
.region-panel {
    display: none;
    width: 90%;
    max-width: 300px;
    background: var(--bg-card);
    font-size: clamp(10px, 2vw, 12px);
    padding: 12px;
    box-shadow: 0 6px 20px var(--shadow);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    position: absolute;
    top: 70px;
    right: 5%;
    z-index: 9999;
    border-radius: 8px;
    box-sizing: border-box;
    max-height: 80vh;
    overflow-y: auto;
}

.panel-title {
    font-size: clamp(12px, 2.5vw, 14px);
    font-weight: 700;
    margin-bottom: 10px;
    white-space: normal;
    color: var(--text-primary);
    line-height: 1.3;
}

.panel-content {
    max-height: 340px;
    overflow-y: auto;
    margin-bottom: 15px;
    word-wrap: break-word;
}

/* FILTER SECTION */
.filter-block {
    border-top: 1px solid var(--border-color);
    padding-top: 12px;
    margin-top: 12px;
}

.filter-select {
    width: 100%;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid var(--border-color);
    margin-bottom: 10px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: clamp(10px, 2vw, 12px);
    box-sizing: border-box;
}

.filter-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.filter-actions button {
    flex: 1;
    min-width: 80px;
    padding: 6px 10px;
    font-size: clamp(10px, 2vw, 12px);
}

/* PIN BASE */
.city-marker .pin {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: clamp(22px, 6vw, 27px);
    height: clamp(22px, 6vw, 27px);
    border-radius: 50%;
    color: #fff;
    font-size: clamp(14px, 4vw, 18px);
    transition: transform 120ms ease, opacity 120ms ease;
}

/* DEFAULT ICON COLOR */
.city-marker .pin i {
    color: #ffd;
    transform-origin: center;
    font-size: clamp(16px, 5vw,23px);
}

/* BLINKING BEHAVIOUR */
.city-marker .pin.blink {
    animation: city-pin-blink 1.0s infinite ease-in-out;
}

/* CHANGE COLOR WHEN BLINKING (MORE VISIBLE) */
.city-marker .pin.blink i {
    color: #ff3b3b;
    text-shadow: 0 0 6px rgba(255, 59, 59, 0.9);
}

/* KEYFRAMES */
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

/* OPTIONALLY ADD SEVERITY STYLES */
.city-marker .pin.blink-high i {
    color: #ff0000;
}

.city-label-box {
    background: rgba(0, 0, 0, 0.75);
    padding: 6px 10px;
    border-radius: 6px;
    color: #00ff99;
    font-size: clamp(11px, 3vw, 13px);
    border: 1px solid #00ff99;
    box-shadow: 0 0 8px rgba(0, 255, 120, 0.5);
}

.city-dotted-path {
    color: #ffaa00;
    weight: 2;
    dashArray: "4 6";
}

/* CONTAINER */
.container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    align-items: flex-start;
    box-sizing: border-box;
    width: 100%;
}

.map-card {
    width: 100%;
    background: var(--bg-card);
    border-radius: 10px;
    padding: 12px;
    box-shadow: 0 6px 20px var(--shadow);
    border: 1px solid var(--border-color);
    box-sizing: border-box;
}

.panel {
    width: 100%;
    background: var(--bg-card);
    border-radius: 10px;
    padding: 12px;
    box-shadow: 0 6px 20px var(--shadow);
    overflow: auto;
    max-height: 500px;
    border: 1px solid var(--border-color);
    box-sizing: border-box;
}

.dev-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: clamp(30px, 8vw, 36px);
    height: clamp(30px, 8vw, 36px);
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
    font-size: clamp(11px, 3vw, 13px);
}

.stat-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid var(--border-color);
    font-size: clamp(11px, 3vw, 13px);
}

.badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 999px;
    font-weight: 700;
    font-size: clamp(11px, 3vw, 13px);
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
    flex-wrap: wrap;
}

.city-list {
    margin-top: 8px;
    max-height: 380px;
    overflow: auto;
}

.city-item {
    padding: 8px 10px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--border-color);
    margin-bottom: 6px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: clamp(11px, 3vw, 13px);
    transition: all 0.2s ease;
}

.city-item:hover {
    background: var(--bg-primary);
    transform: translateX(2px);
}

.small-muted {
    color: var(--text-secondary);
    font-size: clamp(9px, 2vw, 11px);
}

/* LEAFLET POPUP STYLES */
.leaflet-popup-content-wrapper {
    background: var(--bg-card, #fff);
    color: var(--text-primary, #111);
    border-radius: 8px;
    padding: 8px 10px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    font-size: clamp(11px, 3vw, 13px);
}

.city-summary-tooltip {
    background: rgba(0, 0, 0, 0.85) !important;
    color: #fff !important;
    border: none !important;
    padding: 8px 10px !important;
    border-radius: 6px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35) !important;
    font-size: clamp(11px, 3vw, 13px) !important;
    line-height: 1.2 !important;
    width: auto !important;
    max-width: 260px !important;
}

.leaflet-control-attribution {
    display: none !important;
}

/* CHART STYLES */
#cityBarChart {
    width: 100% !important;
    /* min-height: 350px !important; */
    min-height: 320px !important;
    box-sizing: border-box;
}

/* FULLSCREEN MODE */
.worldmap-card.fullscreen {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    z-index: 99999;
    background: var(--bg-primary);
}

/* RESIZE THE MAP CONTAINER TO FILL PARENT */
.worldmap-card.fullscreen #realmap {
    width: 100% !important;
    height: 100% !important;
}

/* KEEP BOTTOM BAR VISIBLE */
.worldmap-card.fullscreen .map-bottom-bar {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 99999;
}

/* FULLSCREEN BUTTON (TOP RIGHT) */
.map-fullscreen-btn,
.map-CityOverview-btn {
    position: absolute;
    top: 10px;
    right: 12px;
    z-index: 9999;
    padding: 8px 12px;
    font-size: clamp(10px, 2vw, 12px);
    border: 1px solid var(--border-color);
    background: var(--bg-primary);
    color: var(--text-primary);
    cursor: pointer;
    border-radius: 4px;
    transition: 0.3s ease;
    white-space: nowrap;
}

.map-CityOverview-btn {
    top: 50px;
}

.map-fullscreen-btn:hover,
.map-CityOverview-btn:hover {
    background: var(--bg-secondary);
    transform: translateY(-1px);
}

/* RESPONSIVE DESIGN FOR MAP */
/* Tablets and larger phones */
@media (min-width: 768px) {
    .worldmap-wrapper {
        flex-direction: row;
    }
    
    #realmap {
        height: 500px;
    }
    
    .map-bottom-bar {
        /* padding: 15px 20px; */
    }
    
    .region-panel {
        width: 300px;
        right: 20px;
    }
    
    .container {
        flex-direction: row;
    }
    
    .map-card {
        min-width: auto;
        flex: 1;
    }
    
    .panel {
        width: 300px;
        max-height: 600px;
    }
}

/* Desktop and larger tablets */
@media (min-width: 1024px) {
    #realmap {
        height: 550px;
    }
    
    .map-bottom-bar {
        padding: 5px 7px;
    }
    
    .region-panel {
        right: 25px;
    }
}

/* Large desktops */
@media (min-width: 1440px) {
    #realmap {
        height: 500px;
    }
}

/* Mobile devices */
@media (max-width: 767px) {
    .map-bottom-bar {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
        padding: 10px 12px;
    }
    
    .map-controls {
        width: 100%;
        justify-content: space-between;
    }
    
    .map-controls button {
        flex: 1;
        text-align: center;
        min-width: 100px;
    }
    
    .region-panel {
        width: 90%;
        right: 5%;
        top: 60px;
    }
    
    #realmap {
        height: 350px;
    }
}

/* Small mobile devices */
@media (max-width: 480px) {
    .map-bottom-bar {
        padding: 8px 10px;
        gap: 12px;
    }
    
    .legend {
        justify-content: center;
        width: 100%;
    }
    
    .map-controls {
        flex-direction: column;
        width: 100%;
        gap: 5px;
    }
    
    .map-controls button {
        width: 100%;
        margin-bottom: 5px;
    }
    
    .region-panel {
        width: 95%;
        right: 2.5%;
        top: 50px;
        padding: 10px;
    }
    
    #realmap {
        height: 300px;
    }
    
    .map-fullscreen-btn,
    .map-CityOverview-btn {
        padding: 6px 10px;
        font-size: 10px;
    }
    
    .map-CityOverview-btn {
        top: 45px;
    }
}

/* Extra small devices */
@media (max-width: 360px) {
    #realmap {
        height: 250px;
    }
    
    .legend-item {
        font-size: 9px;
        padding: 3px 6px;
    }
    
    .map-controls button {
        font-size: 9px;
        padding: 5px 8px;
    }
    
    .region-panel {
        top: 45px;
    }
}
