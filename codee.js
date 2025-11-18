<section id="main-graph" class="graphs-section">
  <div class="graphs-inner">
    <h2 class="graphs-title">DASHBOARD</h2>

    <div class="graphs-grid dashboard-layout">
      <!-- Left: 2x2 small cards -->
      <div class="left-grid">
        <div class="gcard">
          <h4 class="gcard-title">Total No. of Cameras</h4>
          <div class="semi-donut gauge" id="gauge-cameras" data-fill="#12b76a" aria-label="Cameras gauge" style="--percentage:0; --fill:#12b76a">
            <div class="gtext">
              <b class="total">0</b>
              <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
            </div>
          </div>
          <div class="gcard-foot small">
            <span class="muted">ACTIVE: <b id="camera-online">0</b></span>
            <span class="muted">INACTIVE: <b id="camera-offline">0</b></span>
          </div>
        </div>

        <div class="gcard">
          <h4 class="gcard-title">Total No. of ACS</h4>
          <div class="semi-donut gauge" id="gauge-archivers" data-fill="#12b76a" style="--percentage:0; --fill:#12b76a">
            <div class="gtext">
              <b class="total">0</b>
              <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
            </div>
          </div>
          <div class="gcard-foot small">
            <span class="muted">ACTIVE: <b id="archiver-online">0</b></span>
            <span class="muted">INACTIVE: <b id="archiver-offline">0</b></span>
          </div>
        </div>

        <div class="gcard">
          <h4 class="gcard-title">Total No. of NVR/DVR</h4>
          <div class="semi-donut gauge" id="gauge-controllers" data-fill="#12b76a" style="--percentage:0; --fill:#12b76a">
            <div class="gtext">
              <b class="total">0</b>
              <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
            </div>
          </div>
          <div class="gcard-foot small">
            <span class="muted">ACTIVE: <b id="controller-online">0</b></span>
            <span class="muted">INACTIVE: <b id="controller-offline">0</b></span>
          </div>
        </div>

        <div class="gcard">
          <h4 class="gcard-title">TOTAL No. of SERVERS</h4>
          <div class="semi-donut gauge" id="gauge-ccure" data-fill="#12b76a" style="--percentage:0; --fill:#12b76a">
            <div class="gtext">
              <b class="total">0</b>
              <small><span class="active">0</span> active / <span class="inactive">0</span> inactive</small>
            </div>
          </div>
          <div class="gcard-foot small">
            <span class="muted">ACTIVE: <b id="server-online">0</b></span>
            <span class="muted">INACTIVE: <b id="server-offline">0</b></span>
          </div>
        </div>
      </div>

      <!-- Right: tall map / region panel -->
      <div class="right-panel">
        <div class="gcard tall">
          <h4 class="gcard-title">Regional Map</h4>
          <div id="region-map" class="map-placeholder">
            <!-- Put your SVG/Map here. Example boxes for totals -->
            <div class="map-annot top">DELHI<br/><small>TOTAL: 30<br/>ACTIVE: 29<br/>INACTIVE: 1</small></div>
            <div class="map-annot mid">KOLKATA<br/><small>TOTAL: 35<br/>ACTIVE: 30<br/>INACTIVE: 5</small></div>
            <div class="map-annot bot">HYDERABAD<br/><small>TOTAL: 100<br/>ACTIVE: 85<br/>INACTIVE: 15</small></div>
          </div>
        </div>
      </div>

      <!-- Bottom row: three wider charts -->
      <div class="bottom-row">
        <div class="gcard wide">
          <h4 class="gcard-title">Weekly Failures</h4>
          <div class="chart-placeholder"> <!-- simple donut placeholder or Chart.js chart --> </div>
        </div>

        <div class="gcard wide">
          <h4 class="gcard-title">Failure Count</h4>
          <div class="chart-placeholder"> <!-- scatter / line chart placeholder --> </div>
        </div>

        <div class="gcard wide">
          <h4 class="gcard-title">LOC Count</h4>
          <div class="chart-placeholder"> <!-- bar chart placeholder --> </div>
        </div>
      </div>
    </div>
  </div>
</section>