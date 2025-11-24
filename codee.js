
<div class="right-panel"> and   <h4 class="gcard-title">LOC Count</h4> 
right panel and loc cout bitween gatting some space i wan to rmove this space 
in rihgt panel or  <div class="worldmap-card"> bottom side i want to dispoly  this loc count chart wihtou top and bottom gap ok 

<div class="gcard wide" id="Loc-Count-chart">
                <h4 class="gcard-title">LOC Count</h4>
                <canvas id="cityBarChart"></canvas>
              </div>

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

            
              <div class="gcard wide" id="Loc-Count-chart">
                <h4 class="gcard-title">LOC Count</h4>
                <canvas id="cityBarChart"></canvas>
              </div>

            </div>
