
      <section id="main-graph" class="graphs-section">
        <div class="graphs-inner">
          <h2 class="graphs-title">DASHBOARD</h2>

          <div class="graphs-grid dashboard-layout">
            <div class="left-grid">
              <div class="gcard">
                <h4 class="gcard-title">Total No. of Cameras</h4>
                <div class="semi-donut gauge" id="gauge-cameras" data-fill="#12b76a" aria-label="Cameras gauge"
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

            <div class="bottom-row">
              <div class="gcard wide">
                <h4 class="gcard-title">Weekly Failures</h4>
                <div class="chart-placeholder"> </div>
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
-------------
this is my dynamic sectin so remove static code, view above code and correct this ok .. 
<section id="main-graph" class="graphs-section">
      <div class="graphs-inner">
        <h2 class="graphs-title">DASHBOARD OVERVIEW</h2>

        <div class="graphs-grid dashboard-layout">
          <!-- Left: 2x2 small cards -->
          <div class="left-grid">
            <div class="gcard">
              <h4 class="gcard-title">Total No. of Cameras</h4>
              <div class="semi-donut gauge" id="gauge-cameras" data-fill="#12b76a" aria-label="Cameras gauge"
                style="--percentage:75; --fill:#12b76a">
                <div class="gtext">
                  <b class="total">245</b>
                  <small><span class="active">184</span> active / <span class="inactive">61</span> inactive</small>
                </div>
              </div>
            </div>

            <div class="gcard">
              <h4 class="gcard-title">Total No. of Archivers</h4>
              <div class="semi-donut gauge" id="gauge-archivers" data-fill="#12b76a"
                style="--percentage:82; --fill:#12b76a">
                <div class="gtext">
                  <b class="total">56</b>
                  <small><span class="active">46</span> active / <span class="inactive">10</span> inactive</small>
                </div>
              </div>
            </div>

            <div class="gcard">
              <h4 class="gcard-title">Total No. of Controllers</h4>
              <div class="semi-donut gauge" id="gauge-controllers" data-fill="#12b76a"
                style="--percentage:68; --fill:#12b76a">
                <div class="gtext">
                  <b class="total">89</b>
                  <small><span class="active">61</span> active / <span class="inactive">28</span> inactive</small>
                </div>
              </div>
            </div>
            
            <div class="gcard">
              <h4 class="gcard-title">TOTAL No. of CCURE</h4>
              <div class="semi-donut gauge" id="gauge-ccure" data-fill="#12b76a"
                style="--percentage:91; --fill:#12b76a">
                <div class="gtext">
                  <b class="total">34</b>
                  <small><span class="active">31</span> active / <span class="inactive">3</span> inactive</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom row: three wider charts -->
          <div class="bottom-row">
            <div class="gcard wide">
              <h4 class="gcard-title">Weekly Failures</h4>
              <div class="chart-placeholder">
                <i class="fas fa-chart-pie" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <div>Donut Chart Visualization</div>
              </div>
            </div>

            <div class="gcard wide">
              <h4 class="gcard-title">Failure Count</h4>
              <div class="chart-placeholder">
                <i class="fas fa-chart-line" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <div>Line Chart Visualization</div>
              </div>
            </div>

            <div class="gcard wide">
              <h4 class="gcard-title">LOC Count</h4>
              <div class="chart-placeholder">
                <i class="fas fa-chart-bar" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <div>Bar Chart Visualization</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
