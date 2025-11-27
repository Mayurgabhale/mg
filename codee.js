// SINGLE INSTANCE
let cityChart = null;

function drawCityBarChart() {
  // guard: Chart.js loaded?
  if (typeof Chart === 'undefined') {
    console.error("Chart.js not found. Please include Chart.js before calling drawCityBarChart.");
    return;
  }

  const chartCanvas = document.getElementById("cityBarChart");
  if (!chartCanvas) {
    console.warn("Canvas #cityBarChart not found");
    return;
  }

  // If the canvas (or parent) has zero height/width, Chart will draw nothing.
  // Defensive: ensure canvas has reasonable height if not provided by CSS.
  const canvasStyle = window.getComputedStyle(chartCanvas);
  if ((chartCanvas.clientHeight === 0) || (chartCanvas.clientWidth === 0) ||
      canvasStyle.display === 'none' || canvasStyle.visibility === 'hidden') {
    // Try to set a sensible default height so Chart.js can render.
    // If you prefer CSS to control this, remove/adjust the line below.
    chartCanvas.style.minHeight = chartCanvas.style.height || '220px';
  }

  if (!CITY_LIST || CITY_LIST.length === 0) {
    console.warn("CITY_LIST empty. Chart not drawn.");
    // cleanup legend + existing chart + tooltip if present
    const lg = document.getElementById("cityBarLegend");
    if (lg) lg.remove();
    if (cityChart) {
      try { cityChart.destroy(); } catch (e) { /* ignore */ }
      cityChart = null;
    }
    const tt = document.getElementById('chartjs-tooltip');
    if (tt) tt.remove();
    return;
  }

  // Build labels & data
  const labels = CITY_LIST.map(c => c.city || "—");
  const data = CITY_LIST.map(c => {
    if (!c.devices) return 0;
    return Object.values(c.devices).reduce((a, b) => a + b, 0);
  });

  // Risk info (keeps your computeCityRiskLevel logic)
  const riskInfo = CITY_LIST.map(c => computeCityRiskLevel(c));
  const colors = riskInfo.map(r => r.color);
  const riskLabels = riskInfo.map(r => r.label);

  // Remove previous chart + tooltip element if present
  if (cityChart) {
    try { cityChart.destroy(); } catch (e) { /* ignore */ }
    cityChart = null;
  }
  const existingTooltip = document.getElementById('chartjs-tooltip');
  if (existingTooltip) existingTooltip.remove();

  // Create the chart (riskLabels and labels are closed over and available to callbacks)
  cityChart = new Chart(chartCanvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Total Devices",
        data: data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.8,
        categoryPercentage: 0.9
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },

        // custom external tooltip (keeps your tooltip content)
        tooltip: {
          enabled: false,
          external: function (context) {
            let tooltipEl = document.getElementById('chartjs-tooltip');
            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-tooltip';
              tooltipEl.className = 'chartjs-tooltip';
              // minimal inline styles; move to CSS if desired
              tooltipEl.style.position = 'absolute';
              tooltipEl.style.pointerEvents = 'none';
              tooltipEl.style.background = 'rgba(0,0,0,0.75)';
              tooltipEl.style.color = '#fff';
              tooltipEl.style.padding = '8px 10px';
              tooltipEl.style.borderRadius = '6px';
              tooltipEl.style.fontSize = '12px';
              tooltipEl.style.zIndex = 10000;
              document.body.appendChild(tooltipEl);
            }

            const tooltipModel = context.tooltip;
            if (!tooltipModel || tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0;
              return;
            }

            const dataIndex = tooltipModel.dataPoints && tooltipModel.dataPoints.length ? tooltipModel.dataPoints[0].dataIndex : null;
            if (dataIndex === null) {
              tooltipEl.style.opacity = 0;
              return;
            }

            // Build tooltip text from CITY_LIST and riskLabels (unchanged logic)
            const c = CITY_LIST[dataIndex] || {};
            const total = c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0;
            const camOff = (c.offline && c.offline.camera) || 0;
            const ctrlOff = (c.offline && c.offline.controller) || 0;
            const srvOff = (c.offline && c.offline.server) || 0;
            const archOff = (c.offline && c.offline.archiver) || 0;
            const risk = riskLabels[dataIndex] || 'Low';

            const lines = [
              { key: 'Total Devices', val: total, color: '#ffffff' },
              { key: 'Risk Level', val: risk, color: '#ffffff' },
              { key: 'Offline Camera', val: camOff, color: camOff > 0 ? 'red' : '#ffffff' },
              { key: 'Offline Controller', val: ctrlOff, color: ctrlOff > 0 ? 'red' : '#ffffff' },
              { key: 'Offline Server', val: srvOff, color: srvOff > 0 ? 'red' : '#ffffff' },
              { key: 'Offline Archiver', val: archOff, color: archOff > 0 ? 'red' : '#ffffff' }
            ];

            let innerHtml = `<div class="tt-title" style="font-weight:700;margin-bottom:6px;">${labels[dataIndex]}</div>`;
            lines.forEach(line => {
              innerHtml += `<div class="tt-line" style="margin-bottom:4px;"><span class="tt-key" style="opacity:0.85;">${line.key}:</span> <span class="tt-val" style="color:${line.color}; margin-left:6px;">${line.val}</span></div>`;
            });

            tooltipEl.innerHTML = innerHtml;
            tooltipEl.style.opacity = 1;

            // Position near the caret (chart → page coords). caretX/caretY may be undefined in some interactions, guard them.
            const canvas = context.chart.canvas;
            const canvasRect = canvas.getBoundingClientRect();
            const caretX = (tooltipModel.caretX != null) ? tooltipModel.caretX : (canvasRect.width / 2);
            const caretY = (tooltipModel.caretY != null) ? tooltipModel.caretY : (canvasRect.height / 2);
            const left = canvasRect.left + window.pageXOffset + caretX;
            const top = canvasRect.top + window.pageYOffset + caretY;

            // Place tooltip above caret if possible
            tooltipEl.style.left = `${left}px`;
            tooltipEl.style.top = `${top - tooltipEl.offsetHeight - 8}px`;
          }
        }
      },
      // scales: keep your ticks logic (riskLabels closed over)
      scales: {
        y: {
          beginAtZero: true
        },
        x: {
          ticks: {
            display: true,
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
            callback: function (value, index) {
              const risk = riskLabels[index];
              if (risk === "Medium" || risk === "High") return labels[index];
              return "";
            },
            color: function (context) {
              const idx = context.index;
              const risk = riskLabels[idx];
              return (risk === "Medium" || risk === "High") ? "red" : "#666";
            }
          },
          grid: { display: true }
        }
      }
    }
  });

  // if canvas was previously hidden, force an update/resize to ensure visible rendering
  try {
    cityChart.resize();
    cityChart.update();
  } catch (e) { /* ignore */ }

  // Add / refresh legend in top-right (your existing function)
  createCityLegend("cityBarLegend");

  console.log("✅ City bar chart drawn/updated");
}