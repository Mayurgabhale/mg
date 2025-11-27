// single chart instance
let cityChart = null;

function drawCityBarChart() {
  const chartCanvas = document.getElementById("cityBarChart");
  if (!chartCanvas) {
    console.warn("Canvas not found");
    return;
  }

  if (!CITY_LIST || CITY_LIST.length === 0) {
    console.warn("CITY_LIST empty. Chart not drawn.");
    // cleanup legend + existing chart + tooltip if present
    const lg = document.getElementById("cityBarLegend");
    if (lg) lg.remove();
    if (cityChart) {
      cityChart.destroy();
      cityChart = null;
    }
    const tt = document.getElementById('chartjs-tooltip');
    if (tt) tt.remove();
    return;
  }

  const labels = CITY_LIST.map(c => c.city);

  const data = CITY_LIST.map(c => {
    if (!c.devices) return 0;
    return Object.values(c.devices).reduce((a, b) => a + b, 0);
  });

  // compute risk info (uses your computeCityRiskLevel function)
  const riskInfo = CITY_LIST.map(c => computeCityRiskLevel(c));
  const colors = riskInfo.map(r => r.color);
  const riskLabels = riskInfo.map(r => r.label);

  // destroy previous chart + tooltip DOM if present
  if (cityChart) {
    try { cityChart.destroy(); } catch (e) { /* ignore */ }
    cityChart = null;
  }
  const existingTooltip = document.getElementById('chartjs-tooltip');
  if (existingTooltip) existingTooltip.remove();

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
        tooltip: {
          enabled: false, // disable built-in tooltip
          external: function (context) {
            // get/create tooltip element
            let tooltipEl = document.getElementById('chartjs-tooltip');
            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-tooltip';
              tooltipEl.className = 'chartjs-tooltip';
              // minimal styles (you can move to CSS)
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

            // Build tooltip content using CITY_LIST and riskLabels
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

            // Build HTML
            let innerHtml = `<div class="tt-title" style="font-weight:700;margin-bottom:6px;">${labels[dataIndex]}</div>`;
            lines.forEach(line => {
              innerHtml += `<div class="tt-line" style="margin-bottom:4px;"><span class="tt-key" style="opacity:0.85;">${line.key}:</span> <span class="tt-val" style="color:${line.color}; margin-left:6px;">${line.val}</span></div>`;
            });

            tooltipEl.innerHTML = innerHtml;
            tooltipEl.style.opacity = 1;

            // Position near the caret (chart coordinates -> page coordinates)
            const canvas = context.chart.canvas;
            const canvasRect = canvas.getBoundingClientRect();
            const left = canvasRect.left + window.pageXOffset + (tooltipModel.caretX || 0);
            const top = canvasRect.top + window.pageYOffset + (tooltipModel.caretY || 0);

            // Offset to sit above the caret slightly
            tooltipEl.style.left = `${left}px`;
            tooltipEl.style.top = `${top - tooltipEl.offsetHeight - 8}px`;
          }
        }
      },
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
              if (risk === "Medium" || risk === "High") {
                return labels[index];
              }
              return "";
            },
            color: function (context) {
              const idx = context.index;
              const risk = riskLabels[idx];
              return (risk === "Medium" || risk === "High") ? "red" : "#666";
            }
          },
          grid: {
            display: true
          }
        }
      }
    }
  });

  // Add / refresh legend in top-right
  createCityLegend("cityBarLegend");

  console.log("✅ City bar chart drawn/updated");
}