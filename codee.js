<!-- RIGHT PANEL — WORLD MAP -->
<div class="right-panel">
  <div class="gcard tall">

      <h4 class="gcard-title">World Device Map</h4>

      <div class="worldmap-wrapper">

          <!-- MAP CARD -->
          <div class="worldmap-card">

              <div id="realmap"></div>

              <!-- Legend + Controls Row -->
              <div class="map-bottom-bar">
                  
                  <!-- Legend -->
                  <div class="legend">
                      <div class="legend-item">
                          <div class="legend-box" style="background:#10b981"></div> Camera
                      </div>
                      <div class="legend-item">
                          <div class="legend-box" style="background:#f97316"></div> Controller
                      </div>
                      <div class="legend-item">
                          <div class="legend-box" style="background:#7c3aed"></div> Server
                      </div>
                      <div class="legend-item">
                          <div class="legend-box" style="background:#2563eb"></div> Archiver
                      </div>
                  </div>

                  <!-- Controls -->
                  <div class="map-controls">
                      <button id="toggle-heat" class="btn-ghost">Heat</button>
                      <button id="fit-all" class="btn-ghost">Fit All</button>
                      <button id="show-global" class="btn">Global View</button>
                  </div>

              </div>
          </div>

          <!-- SIDE PANEL -->
          <div class="region-panel" id="region-panel">
              <h4 class="panel-title">Global (City Overview)</h4>

              <div id="region-panel-content" class="panel-content"></div>

              <!-- Filters -->
              <div class="filter-block">
                  <h5>Filters</h5>

                  <select id="filter-type" class="filter-select">
                      <option value="all">All device types</option>
                      <option value="camera">Camera</option>
                      <option value="controller">Controller</option>
                      <option value="server">Server</option>
                      <option value="archiver">Archiver</option>
                  </select>

                  <select id="filter-status" class="filter-select">
                      <option value="all">All Status</option>
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                  </select>

                  <div class="filter-actions">
                      <button id="apply-filters" class="btn">Apply</button>
                      <button id="reset-filters" class="btn-ghost">Reset</button>
                  </div>

              </div>
          </div>

      </div>
  </div>
</div>