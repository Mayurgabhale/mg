<!-- Sidebar Button -->
<button class="nav-button" id="toggle-main-btn">
  <i class="fas fa-window-maximize"></i> Device Details
</button>

<!-- Main Content -->
<main id="content">

  <!-- DEVICE DETAILS SECTION -->
  <section id="details-section" class="details-section" style="display:none;">
    <div class="details-header">
      <h2><i class="fas fa-microchip"></i> Device Details</h2>
      <input type="text" id="device-search" placeholder="🔍 Search by IP, Location, City..." />
    </div>

    <div id="device-details" class="device-grid">Loading...</div>
    <div id="details-container" class="device-grid"></div>
  </section>

  <!-- GRAPHS SECTION (visible by default) -->
  <section id="main-graph" class="graphs-section">
    <div class="graphs-inner">
      <h2 class="graphs-title">All Graph</h2>

      <div class="graphs-grid">

        <div class="gcard">
          <h4 class="gcard-title">Cameras</h4>
          <div class="gcanvas-wrap">
            <canvas id="gauge-cameras"></canvas>
          </div>
          <div class="gcard-foot">
            <span>Total: <b id="g-camera-total">0</b></span>
            <span class="gcounts">Active: <b id="g-camera-active">0</b> | Inactive: <b id="g-camera-inactive">0</b></span>
          </div>
        </div>

        <div class="gcard">
          <h4 class="gcard-title">Archivers</h4>
          <div class="gcanvas-wrap">
            <canvas id="gauge-archivers"></canvas>
          </div>
          <div class="gcard-foot">
            <span>Total: <b id="g-archiver-total">0</b></span>
            <span class="gcounts">Active: <b id="g-archiver-active">0</b> | Inactive: <b id="g-archiver-inactive">0</b></span>
          </div>
        </div>

        <div class="gcard">
          <h4 class="gcard-title">Controllers</h4>
          <div class="gcanvas-wrap">
            <canvas id="gauge-controllers"></canvas>
          </div>
          <div class="gcard-foot">
            <span>Total: <b id="g-controller-total">0</b></span>
            <span class="gcounts">Active: <b id="g-controller-active">0</b> | Inactive: <b id="g-controller-inactive">0</b></span>
          </div>
        </div>

        <div class="gcard">
          <h4 class="gcard-title">CCURE</h4>
          <div class="gcanvas-wrap">
            <canvas id="gauge-ccure"></canvas>
          </div>
          <div class="gcard-foot">
            <span>Total: <b id="g-ccure-total">0</b></span>
            <span class="gcounts">Active: <b id="g-ccure-active">0</b> | Inactive: <b id="g-ccure-inactive">0</b></span>
          </div>
        </div>

      </div>
    </div>
  </section>

</main>