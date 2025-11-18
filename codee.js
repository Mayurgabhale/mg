for this ok 
<section id="main-graph" class="graphs-section">
  <div class="graphs-inner">
    <h2 class="graphs-title">All Graph</h2>

    <div class="graphs-grid">

      <div class="gcard">
        <h4 class="gcard-title">Cameras</h4>
        <div class="gcanvas-wrap">
          <canvas id="gauge-cameras" aria-label="Cameras status gauge"></canvas>
        </div>
        <div class="gcard-foot">
          <span>Total: <b id="camera-total">0</b></span>
          <span class="gcounts">Active: <b id="camera-online">0</b> | Inactive: <b id="camera-offline">0</b></span>
        </div>
      </div>

      <div class="gcard">
        <h4 class="gcard-title">Archivers</h4>
        <div class="gcanvas-wrap">
          <canvas id="gauge-archivers" aria-label="Archivers status gauge"></canvas>
        </div>
        <div class="gcard-foot">
          <span>Total: <b id="archiver-total">0</b></span>
          <span class="gcounts">Active: <b id="archiver-online">0</b> | Inactive: <b id="archiver-offline">0</b></span>
        </div>
      </div>

      <div class="gcard">
        <h4 class="gcard-title">Controllers</h4>
        <div class="gcanvas-wrap">
          <canvas id="gauge-controllers" aria-label="Controllers status gauge"></canvas>
        </div>
        <div class="gcard-foot">
          <span>Total: <b id="controller-total">0</b></span>
          <span class="gcounts">Active: <b id="controller-online">0</b> | Inactive: <b id="controller-offline">0</b></span>
        </div>
      </div>

      <div class="gcard">
        <h4 class="gcard-title">CCURE</h4>
        <div class="gcanvas-wrap">
          <canvas id="gauge-ccure" aria-label="CCURE status gauge"></canvas>
        </div>
        <div class="gcard-foot">
          <span>Total: <b id="server-total">0</b></span>
          <span class="gcounts">Active: <b id="server-online">0</b> | Inactive: <b id="server-offline">0</b></span>
        </div>
      </div>

    </div>
  </div>
</section>



// graph.js (include this after Chart.js)
(function () {
  // --- Colors ---
  const ACTIVE_COLOR = '#12b76a';
  const INACTIVE_COLOR = '#f6b43a';
  const EMPTY_BG = '#1f2937';    // subtle background arc color
  const TEXT_PRIMARY = '#e6eef7';
  const TEXT_SECONDARY = '#98a3a8';

  // --- helper to find first existing DOM id among variants and return its int value ---
  function readFirstInt(...ids) {
    for (const id of ids) {
      if (!id) continue;
      const el = document.getElementById(id);
      if (!el) continue;
      const raw = el.textContent ?? el.innerText ?? el.value ?? '0';
      const v = parseInt(String(raw).trim().replace(/[^0-9-]/g, '') || '0', 10);
      if (!isNaN(v)) return v;
    }
    return 0;
  }

  // --- plugin to draw center text ---
  const centerPlugin = {
    id: 'centerText',
    beforeDraw(chart) {
      const opts = chart.config.options;
      if (!opts.plugins || !opts.plugins.centerText) return;
      const ctx = chart.ctx;
      const center = opts.plugins.centerText;
      const width = chart.width;
      const height = chart.height;

      ctx.save();
      // main font relative to canvas size
      const mainFont = Math.round(Math.min(width, height) / 7);
      ctx.font = `${center.fontWeight || '700'} ${mainFont}px Poppins, sans-serif`;
      ctx.fillStyle = center.color || TEXT_PRIMARY;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillText(center.mainText || '', width / 2, height / 2 - (center.offset || 8));

      if (center.subText) {
        ctx.font = `${center.subWeight || '600'} ${Math.max(10, Math.round(mainFont * 0.45))}px Poppins, sans-serif`;
        ctx.fillStyle = center.subColor || TEXT_SECONDARY;
        ctx.fillText(center.subText, width / 2, height / 2 + (center.offset || 18));
      }
      ctx.restore();
    }
  };

  if (window.Chart && Chart.register) Chart.register(centerPlugin);

  // --- create a gauge (half doughnut) ---
  function makeGauge(ctx, opts) {
    // opts: { active, inactive, label }
    const total = (opts.active || 0) + (opts.inactive || 0);
    let data, bgColors;

    if (total === 0) {
      // fallback: draw a subtle background arc so half-circle always visible
      data = [1, 0];
      bgColors = [EMPTY_BG, 'rgba(0,0,0,0)'];
    } else {
      data = [opts.active, opts.inactive];
      bgColors = [ACTIVE_COLOR, INACTIVE_COLOR];
    }

    const config = {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Inactive'],
        datasets: [{
          data: data,
          backgroundColor: bgColors,
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        rotation: -Math.PI,
        circumference: Math.PI,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
          centerText: {
            mainText: String(total),
            subText: opts.label || '',
            fontSize: 20,
            offset: -8,
            color: TEXT_PRIMARY,
            subColor: TEXT_SECONDARY
          }
        },
        elements: {
          arc: { borderRadius: 6 }
        }
      }
    };

    return new Chart(ctx, config);
  }

  // --- mapping and fallback ids (robust) ---
  // Each mapping provides multiple possible ID names (in order) for reading values.
  const mapping = [
    {
      key: 'cameras',
      canvasId: 'gauge-cameras',
      totalIds: ['camera-total', 'g-camera-total', 'camera_total'],
      activeIds: ['camera-online', 'g-camera-active', 'camera-active'],
      inactiveIds: ['camera-offline', 'g-camera-inactive', 'camera-offline']
    },
    {
      key: 'archivers',
      canvasId: 'gauge-archivers',
      totalIds: ['archiver-total', 'g-archiver-total'],
      activeIds: ['archiver-online', 'g-archiver-active'],
      inactiveIds: ['archiver-offline', 'g-archiver-inactive']
    },
    {
      key: 'controllers',
      canvasId: 'gauge-controllers',
      totalIds: ['controller-total', 'g-controller-total'],
      activeIds: ['controller-online', 'g-controller-active'],
      inactiveIds: ['controller-offline', 'g-controller-inactive']
    },
    {
      key: 'ccure',
      canvasId: 'gauge-ccure',
      totalIds: ['server-total', 'g-ccure-total', 'ccure-total'],
      activeIds: ['server-online', 'g-ccure-active', 'ccure-online'],
      inactiveIds: ['server-offline', 'g-ccure-inactive', 'ccure-offline']
    }
  ];

  const charts = {};

  function initCharts() {
    if (!window.Chart) {
      console.error('Chart.js is required for graph.js. Include Chart.js before graph.js.');
      return;
    }

    mapping.forEach(m => {
      const canvas = document.getElementById(m.canvasId);
      if (!canvas) {
        console.warn('Missing canvas for', m.canvasId);
        return;
      }
      const ctx = canvas.getContext('2d');
      const initialActive = readFirstInt(...(m.activeIds || []));
      const initialInactive = readFirstInt(...(m.inactiveIds || []));

      const chart = makeGauge(ctx, {
        active: initialActive,
        inactive: initialInactive,
        label: (m.key || '').toUpperCase()
      });

      charts[m.key] = { chart, mapping: m };
    });
  }

  // update function — reads DOM values and updates charts + footer display
  function renderGraphs() {
    if (Object.keys(charts).length === 0) initCharts();

    Object.values(charts).forEach(({ chart, mapping }) => {
      const active = readFirstInt(...(mapping.activeIds || []));
      const inactive = readFirstInt(...(mapping.inactiveIds || []));
      const totalFromIds = readFirstInt(...(mapping.totalIds || []));

      const total = totalFromIds || (active + inactive);

      // if total = 0 -> set fallback data so the half arc displays
      if ((active + inactive) === 0) {
        chart.data.datasets[0].data = [1, 0];
        chart.data.datasets[0].backgroundColor = [EMPTY_BG, 'rgba(0,0,0,0)'];
      } else {
        chart.data.datasets[0].data = [active, inactive];
        chart.data.datasets[0].backgroundColor = [ACTIVE_COLOR, INACTIVE_COLOR];
      }

      // update center text
      const center = chart.options.plugins.centerText || {};
      center.mainText = String(total);
      center.subText = (mapping.key || '').replace(/^\w/, c => c.toUpperCase());
      chart.options.plugins.centerText = center;

      // update card foot elements if they exist (try multiple id variants)
      // total
      (mapping.totalIds || []).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = total;
      });
      // active
      (mapping.activeIds || []).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = active;
      });
      // inactive
      (mapping.inactiveIds || []).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = inactive;
      });

      chart.update();
    });
  }

  // expose small API
  window.renderGraphs = renderGraphs;
  window.initGaugeCharts = initCharts;

  // auto-init & periodic refresh
  document.addEventListener('DOMContentLoaded', function () {
    initCharts();
    renderGraphs();
    // keep in sync with your fetch polling - every 6s is safe
    setInterval(renderGraphs, 6000);
  });

})();
