(function () {

    const ACTIVE_COLOR = '#12b76a';
    const INACTIVE_COLOR = '#f6b43a';

    function readInt(id) {
        const el = document.getElementById(id);
        if (!el) return 0;
        const val = parseInt(el.textContent || '0', 10);
        return isNaN(val) ? 0 : val;
    }

    // Center text plugin
    const centerPlugin = {
        id: 'centerText',
        beforeDraw(chart) {
            const opts = chart.options.plugins.centerText;
            if (!opts) return;

            const ctx = chart.ctx;
            const { width, height } = chart;

            ctx.save();
            ctx.font = `700 22px Poppins`;
            ctx.fillStyle = '#e6eef7';
            ctx.textAlign = 'center';

            ctx.fillText(opts.mainText, width / 2, height / 2 - 10);

            ctx.font = `500 12px Poppins`;
            ctx.fillStyle = '#98a3a8';
            ctx.fillText(opts.subText, width / 2, height / 2 + 18);

            ctx.restore();
        }
    };

    if (window.Chart) Chart.register(centerPlugin);

    function makeGauge(ctx, initial, label) {
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Active', 'Inactive'],
                datasets: [{
                    data: [initial.active, initial.inactive],
                    backgroundColor: [ACTIVE_COLOR, INACTIVE_COLOR],
                    borderWidth: 0
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
                    centerText: {
                        mainText: initial.active + initial.inactive,
                        subText: label
                    }
                }
            }
        });
    }

    const charts = {};

    function initCharts() {
        const mapping = [
            { key: 'cameras', canvasId: 'gauge-cameras', totalId: 'g-camera-total', activeId: 'g-camera-active', inactiveId: 'g-camera-inactive', label: 'Cameras' },
            { key: 'archivers', canvasId: 'gauge-archivers', totalId: 'g-archiver-total', activeId: 'g-archiver-active', inactiveId: 'g-archiver-inactive', label: 'Archivers' },
            { key: 'controllers', canvasId: 'gauge-controllers', totalId: 'g-controller-total', activeId: 'g-controller-active', inactiveId: 'g-controller-inactive', label: 'Controllers' },
            { key: 'ccure', canvasId: 'gauge-ccure', totalId: 'g-ccure-total', activeId: 'g-ccure-active', inactiveId: 'g-ccure-inactive', label: 'CCURE' }
        ];

        mapping.forEach(m => {
            const canvas = document.getElementById(m.canvasId);
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            const initial = {
                active: readInt(m.activeId),
                inactive: readInt(m.inactiveId)
            };

            charts[m.key] = {
                chart: makeGauge(ctx, initial, m.label),
                map: m
            };
        });
    }

    function renderGraphs() {
        Object.values(charts).forEach(({ chart, map }) => {
            const active = readInt(map.activeId);
            const inactive = readInt(map.inactiveId);
            const total = active + inactive;

            chart.data.datasets[0].data = [active, inactive];
            chart.options.plugins.centerText.mainText = total;

            document.getElementById(map.totalId).textContent = total;
            document.getElementById(map.activeId).textContent = active;
            document.getElementById(map.inactiveId).textContent = inactive;

            chart.update();
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            initCharts();   // allow DOM to fully paint
            renderGraphs();
        }, 150);  // ★ Prevents “canvas height = 0” issue

        setInterval(renderGraphs, 5000);
    });

})();



.gcanvas-wrap {
    width: 100%;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.gcanvas-wrap canvas {
    width: 100% !important;
    height: 180px !important;   /* ★ Without this the graph will NOT appear */
}