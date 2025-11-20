 <div class="gcard wide">
                <h4 class="gcard-title">Total Count</h4>
                <div class="chart-placeholder"></div>
              </div>
    now i want to add in this pie chart om this disaply all device count 

<div class="bottom-row">

              <div class="gcard wide">
                <h4 class="gcard-title">Total Count</h4>
                <div class="chart-placeholder"></div>
              </div>

              <div class="gcard wide">
                <h4 class="gcard-title">Failure Count</h4>
                <div class="chart-placeholder"></div>
              </div>

              <div class="gcard wide">
                <h4 class="gcard-title">LOC Count</h4>
                <div class="chart-placeholder"></div>
              </div>

            </div>



  <section class="summary-section">

    <div class="summary">
      <div class="card">

        <h3><i class="fas fa-microchip icon-3d"></i> Total Devices</h3>
        <div class="card-status total">Total <span id="total-devices">0</span></div>
        <div class="card-status online">Online <span id="online-devices">0</span></div>
        <div class="card-status offline">Offline <span id="offline-devices">0</span></div>
      </div>

      <div class="card">
        <h3><i class="fas fa-video icon-3d"></i> Cameras</h3>
        <div class="card-status total">Total <span id="camera-total">0</span></div>
        <div class="card-status online">Online <span id="camera-online">0</span></div>
        <div class="card-status offline">Offline <span id="camera-offline">0</span></div>
      </div>



      <div class="card">
        <h3><i class="fas fa-database icon-3d"></i> Archivers</h3>

        <div class="card-status total">Total <span id="archiver-total">0</span></div>
        <div class="card-status online">Online <span id="archiver-online">0</span></div>
        <div class="card-status offline">Offline <span id="archiver-offline">0</span></div>
      </div>

      <div class="card">
        <h3><i class="fas fa-id-card icon-3d"></i> Controllers</h3>
        <div class="card-status total">Total <span id="controller-total">0</span></div>
        <div class="card-status online">Online <span id="controller-online">0</span></div>
        <div class="card-status offline">Offline <span id="controller-offline">0</span></div>
      </div>

      <div class="card" id="door-card">
        <h3><i class="fa-solid fa-door-closed icon-3d"></i>Door</h3>
        <div class="card-status total">Total <span id="doorReader-total">0</span></div>
        <div class="card-status online">Online <span id="doorReader-online">0</span></div>
        <div class="card-status offline">Offline <span id="doorReader-offline">0</span></div>
      </div>
      <div class="card">
        <h3><i class="fas fa-id-badge icon-3d"></i>Reader</h3>
        <div class="card-status total">Total <span id="reader-total-inline">0</span></div>
        <div class="card-status online">Online <span id="reader-online-inline">0</span></div>
        <div class="card-status offline">Offline <span id="reader-offline-inline">0</span></div>
      </div>

      <div class="card">
        <h3><i class="fas fa-server icon-3d"></i>CCURE</h3>
        <div class="card-status total">Total <span id="server-total">0</span></div>
        <div class="card-status online">Online <span id="server-online">0</span></div>
        <div class="card-status offline">Offline <span id="server-offline">0</span></div>
      </div>

      <div class="card">
        <h3><i class="fas fa-desktop icon-3d"></i>Desktop</h3>
        <div class="card-status total">Total <span id="pc-total">0</span></div>
        <div class="card-status online">Online <span id="pc-online">0</span></div>
        <div class="card-status offline">Offline <span id="pc-offline">0</span></div>
      </div>

      <div class="card">
        <h3><i class="fa-etch fa-solid fa-database icon-3d"></i>DB Server</h3>
        <div class="card-status total">Total <span id="db-total">0</span></div>
        <div class="card-status online">Online <span id="db-online">0</span></div>
        <div class="card-status offline">Offline <span id="db-offline">0</span></div>
      </div>


    </div>

  </section>


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

            </div>


            <!-- RIGHT PANEL — WORLD MAP -->
            <div class="right-panel">
              <!-- <div class="gcard tall"> -->
              <div class="">
                <div class="worldmap-wrapper">

                  <!-- MAP CARD -->
                  <div class="worldmap-card">

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

                    <!-- <div class="filter-block">
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

                    </div> -->

                  </div>

                </div>
              </div>
            </div>


            <div class="bottom-row">

              <div class="gcard wide">
                <h4 class="gcard-title">Weekly Failures</h4>
                <div class="chart-placeholder"></div>
              </div>

              <div class="gcard wide">
                <h4 class="gcard-title">Failure Count</h4>
                <div class="chart-placeholder"></div>
              </div>

              <div class="gcard wide">
                <h4 class="gcard-title">LOC Count</h4>
                <div class="chart-placeholder"></div>
              </div>

            </div>


          </div>
        </div>
      </section>


C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\graph.js

function updateGauge(id, activeId, inactiveId, totalId) {
    const active = parseInt(document.getElementById(activeId).textContent) || 0;
    const inactive = parseInt(document.getElementById(inactiveId).textContent) || 0;
    const total = active + inactive;

    // element
    const gauge = document.getElementById(id);
    if (!gauge) return;

    // % calculation
    let percentage = total === 0 ? 0 : Math.round((active / total) * 100);

    // set values
    gauge.style.setProperty("--percentage", percentage);

    // update text inside semicircle
    gauge.querySelector(".total").textContent = total;
    gauge.querySelector(".active").textContent = active;
    gauge.querySelector(".inactive").textContent = inactive;

    // card footer also updates
    document.getElementById(totalId).textContent = total;
}

function renderGauges() {
    updateGauge("gauge-cameras", "camera-online", "camera-offline", "camera-total");
    updateGauge("gauge-archivers", "archiver-online", "archiver-offline", "archiver-total");
    updateGauge("gauge-controllers", "controller-online", "controller-offline", "controller-total");
    updateGauge("gauge-ccure", "server-online", "server-offline", "server-total");
}

document.addEventListener("DOMContentLoaded", () => {
    renderGauges();
    setInterval(renderGauges, 6000);
});


