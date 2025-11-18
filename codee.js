<section id="main-graph" class="graphs-section">
  <div class="graphs-inner">
    <h2 class="graphs-title">All Graph</h2>

    <div class="graphs-grid">

      <!-- Cameras -->
      <div class="gcard">
        <h4 class="gcard-title">Cameras</h4>
        <div class="semi-donut gauge" id="gauge-cameras" style="--percentage:0; --fill:#12b76a;">
          <div class="gtext">
            <b class="total">0</b>
            <small><span class="active">0</span> / <span class="inactive">0</span></small>
          </div>
        </div>
        <div class="gcard-foot">
          <span>Total: <b id="camera-total">0</b></span>
          <span class="gcounts">Active: <b id="camera-online">0</b> | Inactive: <b id="camera-offline">0</b></span>
        </div>
      </div>

      <!-- Archivers -->
      <div class="gcard">
        <h4 class="gcard-title">Archivers</h4>
        <div class="semi-donut gauge" id="gauge-archivers" style="--percentage:0; --fill:#12b76a;">
          <div class="gtext">
            <b class="total">0</b>
            <small><span class="active">0</span> / <span class="inactive">0</span></small>
          </div>
        </div>
        <div class="gcard-foot">
          <span>Total: <b id="archiver-total">0</b></span>
          <span class="gcounts">Active: <b id="archiver-online">0</b> | Inactive: <b id="archiver-offline">0</b></span>
        </div>
      </div>

      <!-- Controllers -->
      <div class="gcard">
        <h4 class="gcard-title">Controllers</h4>
        <div class="semi-donut gauge" id="gauge-controllers" style="--percentage:0; --fill:#12b76a;">
          <div class="gtext">
            <b class="total">0</b>
            <small><span class="active">0</span> / <span class="inactive">0</span></small>
          </div>
        </div>
        <div class="gcard-foot">
          <span>Total: <b id="controller-total">0</b></span>
          <span class="gcounts">Active: <b id="controller-online">0</b> | Inactive: <b id="controller-offline">0</b></span>
        </div>
      </div>

      <!-- CCURE -->
      <div class="gcard">
        <h4 class="gcard-title">CCURE</h4>
        <div class="semi-donut gauge" id="gauge-ccure" style="--percentage:0; --fill:#12b76a;">
          <div class="gtext">
            <b class="total">0</b>
            <small><span class="active">0</span> / <span class="inactive">0</span></small>
          </div>
        </div>
        <div class="gcard-foot">
          <span>Total: <b id="server-total">0</b></span>
          <span class="gcounts">Active: <b id="server-online">0</b> | Inactive: <b id="server-offline">0</b></span>
        </div>
      </div>

    </div>
  </div>
</section>



/* Semi Donut Gauge */
.semi-donut {
  --percentage: 0;
  --fill: #12b76a;
  width: 100%;
  height: 150px;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.semi-donut::after {
  content: "";
  width: 200%;
  height: 200%;
  border: 40px solid;
  border-color: rgba(255,255,255,0.1) rgba(255,255,255,0.1) var(--fill) var(--fill);
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: -50%;
  transform: rotate(calc(-45deg + var(--percentage) * 1.8deg));
  transition: transform 0.6s ease-out;
}

.gtext {
  position: absolute;
  bottom: 20px;
  text-align: center;
  color: white;
}

.gtext b {
  font-size: 20px;
  color: #0ee08f;
}

.gtext small {
  display: block;
  font-size: 12px;
  color: #98a3a8;
}






