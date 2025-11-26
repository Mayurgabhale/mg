/* add somewhere in your CSS file */
.chartjs-tooltip {
  position: absolute;
  background: rgba(18,18,18,0.95);
  color: #fff;
  padding: 8px 10px;
  border-radius: 6px;
  pointer-events: none;
  transform: translate(-50%, -100%);
  font-size: 13px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.45);
  z-index: 10000;
  min-width: 160px;
}
.chartjs-tooltip .tt-title { font-weight: 700; margin-bottom:6px; }
.chartjs-tooltip .tt-line { margin: 2px 0; white-space:nowrap; }
.chartjs-tooltip .tt-key { opacity: 0.8; margin-right:6px; }
.chartjs-tooltip .tt-val { font-weight:600; }




.... is



// Replace existing tooltip: { ... } with this:
tooltip: {
  enabled: false, // disable built-in tooltip rendering
  external: function(context) {
    // get/create tooltip element
    let tooltipEl = document.getElementById('chartjs-tooltip');
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'chartjs-tooltip';
      tooltipEl.className = 'chartjs-tooltip';
      document.body.appendChild(tooltipEl);
    }

    // Hide if no tooltip
    const tooltipModel = context.tooltip;
    if (!tooltipModel || tooltipModel.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Determine index for the hovered bar
    const dataIndex = tooltipModel.dataPoints && tooltipModel.dataPoints.length ? tooltipModel.dataPoints[0].dataIndex : null;
    if (dataIndex === null) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Build lines (same order you used)
    const c = CITY_LIST[dataIndex] || {};
    const total = c.devices ? Object.values(c.devices).reduce((a,b)=>a+b,0) : 0;
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
    let innerHtml = `<div class="tt-title">${labels[dataIndex]}</div>`;
    lines.forEach(line => {
      // don't show 0 offline lines? you said show but not red — keep visible but not red
      innerHtml += `<div class="tt-line"><span class="tt-key">${line.key}:</span> <span class="tt-val" style="color:${line.color}">${line.val}</span></div>`;
    });

    tooltipEl.innerHTML = innerHtml;
    tooltipEl.style.opacity = 1;

    // Positioning: try to place tooltip near the caret (Chart.js provides caretX/caretY in tooltipModel)
    const canvas = context.chart.canvas;
    const canvasRect = canvas.getBoundingClientRect();
    // caret coordinates are in chart pixels; convert to page coords
    const left = canvasRect.left + window.pageXOffset + tooltipModel.caretX;
    const top = canvasRect.top + window.pageYOffset + tooltipModel.caretY;

    // Position slightly above the cursor
    tooltipEl.style.left = `${left}px`;
    tooltipEl.style.top = `${top - 10}px`;
  }
}