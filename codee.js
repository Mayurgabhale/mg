when i use this comented code that time is graph is disly
       // const mapping = [
        //   { key: 'cameras', canvasId: 'gauge-cameras', totalId: 'camera-total', activeId: 'camera-online', inactiveId: 'camera-offline', label: 'Cameras' },
        //   { key: 'archivers', canvasId: 'gauge-archivers', totalId: 'archiver-total', activeId: 'archiver-online', inactiveId: 'archiver-offline', label: 'Archivers' },
        //   { key: 'controllers', canvasId: 'gauge-controllers', totalId: 'controller-total', activeId: 'controller-online', inactiveId: 'controller-offline', label: 'Controllers' },
        //   { key: 'ccure', canvasId: 'gauge-ccure', totalId: 'server-total', activeId: 'server-online', inactiveId: 'server-offline', label: 'CCURE' }
        // ];

    

(function () {
    // Colors
    const ACTIVE_COLOR = '#12b76a';   // green
    const INACTIVE_COLOR = '#f6b43a'; // orange
    const BG_COLOR = '#111827';       // for small background segment

    // Helper: read integer from an element id, fallback to 0
    function readInt(id) {
        const el = document.getElementById(id);
        if (!el) return 0;
        const val = parseInt(el.textContent || el.innerText || el.value || '0', 10);
        return isNaN(val) ? 0 : val;
    }

    // Setup chart plugin to draw center text (value + label)
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

            const fontSize = center.fontSize || Math.round(Math.min(width, height) / 8);
            ctx.font = `${center.fontWeight || '700'} ${fontSize}px Poppins, sans-serif`;
            ctx.fillStyle = center.color || '#e6eef7';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Primary text (count)
            ctx.fillText(center.mainText || '', width / 2, height / 2 - (center.offset || 6));

            // Secondary text (label)
            if (center.subText) {
                ctx.font = `${center.subWeight || '500'} ${Math.max(10, Math.round(fontSize * 0.45))}px Poppins, sans-serif`;
                ctx.fillStyle = center.subColor || '#98a3a8';
                ctx.fillText(center.subText, width / 2, height / 2 + (center.offset || 18));
            }

            ctx.restore();
        }
    };

    // Register plugin
    if (window.Chart && Chart.register) {
        Chart.register(centerPlugin);
    }

    // Create gauge chart factory
    function makeGauge(ctx, initial, label) {
        const config = {
            type: 'doughnut',
            data: {
                labels: ['Active', 'Inactive'],
                datasets: [{
                    data: [initial.active, initial.inactive],
                    backgroundColor: [ACTIVE_COLOR, INACTIVE_COLOR],
                    borderWidth: 0,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                rotation: -Math.PI,       // start at left (makes it top half)
                circumference: Math.PI,   // half circle
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function (ctx) {
                                const label = ctx.label || '';
                                const value = ctx.raw || 0;
                                return `${label}: ${value}`;
                            }
                        }
                    },
                    centerText: {
                        mainText: String(initial.active + initial.inactive),
                        subText: label,
                        fontSize: 22,
                        offset: -6
                    }
                },
                elements: {
                    arc: { borderRadius: 6 }
                }
            }
        };

        return new Chart(ctx, config);
    }

    // Create all charts (once)
    const charts = {};
    function initCharts() {
        // guard
        if (!window.Chart) {
            console.error('Chart.js not found. Please include Chart.js before graph.js');
            return;
        }

        // const mapping = [
        //   { key: 'cameras', canvasId: 'gauge-cameras', totalId: 'camera-total', activeId: 'camera-online', inactiveId: 'camera-offline', label: 'Cameras' },
        //   { key: 'archivers', canvasId: 'gauge-archivers', totalId: 'archiver-total', activeId: 'archiver-online', inactiveId: 'archiver-offline', label: 'Archivers' },
        //   { key: 'controllers', canvasId: 'gauge-controllers', totalId: 'controller-total', activeId: 'controller-online', inactiveId: 'controller-offline', label: 'Controllers' },
        //   { key: 'ccure', canvasId: 'gauge-ccure', totalId: 'server-total', activeId: 'server-online', inactiveId: 'server-offline', label: 'CCURE' }
        // ];

        const mapping = [
            { key: 'cameras', canvasId: 'gauge-cameras', totalId: 'g-camera-total', activeId: 'g-camera-active', inactiveId: 'g-camera-inactive', label: 'Cameras' },
            { key: 'archivers', canvasId: 'gauge-archivers', totalId: 'g-archiver-total', activeId: 'g-archiver-active', inactiveId: 'g-archiver-inactive', label: 'Archivers' },
            { key: 'controllers', canvasId: 'gauge-controllers', totalId: 'g-controller-total', activeId: 'g-controller-active', inactiveId: 'g-controller-inactive', label: 'Controllers' },
            { key: 'ccure', canvasId: 'gauge-ccure', totalId: 'g-ccure-total', activeId: 'g-ccure-active', inactiveId: 'g-ccure-inactive', label: 'CCURE' }
        ];

        mapping.forEach(m => {
            const canvas = document.getElementById(m.canvasId);
            if (!canvas) {
                console.warn('Missing canvas', m.canvasId);
                return;
            }
            const ctx = canvas.getContext('2d');
            const initial = {
                active: readInt(m.activeId),
                inactive: readInt(m.inactiveId)
            };
            charts[m.key] = {
                chart: makeGauge(ctx, initial, m.label),
                mapping: m
            };
        });
    }

    // Update function reads numbers and updates charts + small labels on card
    function renderGraphs() {
        // lazy init charts if not created
        if (Object.keys(charts).length === 0) initCharts();

        Object.values(charts).forEach(({ chart, mapping }) => {
            const active = readInt(mapping.activeId);
            const inactive = readInt(mapping.inactiveId);

            // If totals are not present but individual values are zero, try compute from "totalId"
            let total = readInt(mapping.totalId);
            if (total === 0 && (active || inactive)) total = active + inactive;

            // update dataset
            chart.data.datasets[0].data = [active, inactive];
            // update center plugin text
            const center = chart.options.plugins.centerText || {};
            center.mainText = String(total || (active + inactive));
            center.subText = mapping.label;
            chart.options.plugins.centerText = center;

            // update canvas footers if present
            const footTotal = document.getElementById('g-' + mapping.key + '-total');
            const footActive = document.getElementById('g-' + mapping.key + '-active');
            const footInactive = document.getElementById('g-' + mapping.key + '-inactive');
            if (footTotal) footTotal.textContent = total;
            if (footActive) footActive.textContent = active;
            if (footInactive) footInactive.textContent = inactive;

            chart.update();
        });
    }

    // Expose for external use
    window.renderGraphs = renderGraphs;

    // Auto-render on DOM load
    document.addEventListener('DOMContentLoaded', function () {
        initCharts();
        renderGraphs();

        // Optional: keep charts fresh by polling the summary DOM every 6s (safe fallback)
        setInterval(renderGraphs, 6000);
    });
})();
      
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
