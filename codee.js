 <button id="mapCityOverviewBtn" class="map-CityOverview-btn">
                      City Overview
                    </button>
  when click on this buttin i want to opne<h4 class="panel-title">Global (City Overview)</h4> in inside mpa right side ok as it is. ok
   so who to do this 

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


    .map-CityOverview-btn{
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
   
                  <!-- SIDE PANEL -->
                  <div class="region-panel" id="region-panel">
                    <h4 class="panel-title">Global (City Overview)</h4>
                    <div id="region-panel-content" class="panel-content"></div>
                  </div>
                </div>
 <div class="worldmap-card">
                    <!-- Fullscreen Button -->
                    <button id="mapFullscreenBtn" class="map-fullscreen-btn">
                      ⛶ View Full
                    </button>
                    <button id="mapCityOverviewBtn" class="map-CityOverview-btn">
                      City Overview
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
              </div>

    /* RIGHT PANEL */

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

