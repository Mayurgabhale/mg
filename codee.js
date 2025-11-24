<div class="right-panel">
    <div class="worldmap-wrapper">
        <!-- MAP CARD with integrated LOC Chart -->
        <div class="worldmap-card worldmap-card-with-chart">
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
                        <i class="bi bi-camera"></i> Camera
                    </div>
                    <div class="legend-item">
                        <i class="bi bi-hdd"></i> Controller
                    </div>
                    <div class="legend-item">
                        <i class="fa-duotone fa-solid fa-server"></i> Server
                    </div>
                    <div class="legend-item">
                        <i class="fas fa-database"></i> Archiver
                    </div>
                </div>

                <!-- Controls -->
                <div class="map-controls">
                    <button id="fit-all" class="btn-ghost">Fit All</button>
                    <button id="show-global" class="btn-gv">Global View</button>
                </div>
            </div>

            <!-- LOC Count Chart Integrated -->
            <div class="loc-chart-section">
                <h4 class="gcard-title">LOC Count</h4>
                <canvas id="cityBarChart"></canvas>
            </div>
        </div>
    </div>
</div>