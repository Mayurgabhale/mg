
this section desin i want like above image show ok same as above image ok 
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


.semi-donut {
  --percentage: 0;
  --fill: #ff0;
  width: 300px;
  height: 150px;
  position: relative;
  color: var(--fill);
  font-size: 22px;
  font-weight: 600;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  box-sizing: border-box;
}

.semi-donut::after {
  content: '';
  width: 300px;
  height: 300px;
  border: 50px solid;
  border-color: rgba(0,0,0,0.15) rgba(0,0,0,0.15) var(--fill) var(--fill);
  position: absolute;
  border-radius: 50%;
  left: 0;
  top: 0;
  box-sizing: border-box;
  transform: rotate(calc(-45deg + var(--percentage) * 1.8deg));
  animation: fillAnimation 1s ease-in;
}
.graphs-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(260px, 1fr));
  gap: 18px;
}


/* =================== Semi Donut Chart model-2 ======================== */

.semi-donut-model-2 {
  width: 300px;
  height: 150px;
  position: relative;
  text-align: center;
  color: var(--fill);
  font-size: 22px;
  font-weight: 600;
  border-radius: 150px 150px 0 0;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  box-sizing: border-box;
}

.semi-donut-model-2::before,
.semi-donut-model-2::after {
  content: '';
  width: 300px;
  height: 150px;
  border: 50px solid var(--fill);
  border-top: none;
  position: absolute;
  transform-origin: 50% 0%;
  border-radius: 0 0 300px 300px;
  box-sizing: border-box;
  left: 0;
  top: 100%;
}

.semi-donut-model-2::before {
  border-color: rgba(0,0,0,.15);
  transform: rotate(180deg);
}

.semi-donut-model-2::after {
  z-index: 3;
  animation: fillGraphAnimation 1s ease-in;
  transform: rotate(calc(var(--percentage) * 1.8deg));
}

.semi-donut-model-2:hover::after {
  opacity: 0.8;
  cursor: pointer;
}


/* =================== Multi Semi Donut Chart ======================== */

.multi-graph {
  width: 300px;
  height: 150px;
  position: relative;
  color: #fff;
  font-size: 22px;
  font-weight: 600;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
}

.multi-graph::before {
  content: '';
  width: 300px;
  height: 150px;
  border: 50px solid rgba(0,0,0,.15);
  border-bottom: none;
  position: absolute;
  box-sizing: border-box;
  transform-origin: 50% 0%;
  border-radius: 300px 300px 0 0;
  left: 0;
  top: 0;
}

.multi-graph .graph {
  width: 300px;
  height: 150px;
  border: 50px solid var(--fill);
  border-top: none;
  position: absolute;
  transform-origin: 50% 0%;
  border-radius: 0 0 300px 300px;
  left: 0;
  top: 100%;
  z-index: 5;
  animation: fillGraphAnimation 1s ease-in;
  transform: rotate(calc(var(--percentage) * 1.8deg));
  box-sizing: border-box;
  cursor: pointer;
}

.multi-graph .graph::after {
  content: attr(data-name) ' ' counter(varible) '%';
  counter-reset: varible var(--percentage);
  background: var(--fill);
  border-radius: 2px;
  color: #fff;
  font-weight: 200;
  font-size: 12px;
  height: 20px;
  padding: 3px 5px;
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(calc(-1deg * var(--percentage) * 1.8)) translate(-30px, 0);
  transform-origin: 0 50%;
  transition: 0.2s ease-in;
  opacity: 0;
}

.multi-graph .graph:hover {
  opacity: 0.8;
}

.multi-graph .graph:hover::after {
  opacity: 1;
  left: 30px;
}


/* =================== Animations ======================== */

@keyframes fillAnimation {
  0% { transform: rotate(-45deg); }
  50% { transform: rotate(135deg); }
}

@keyframes fillGraphAnimation {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
}
