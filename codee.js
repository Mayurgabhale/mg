function drawCityBarChart() {
  const chartCanvas = document.getElementById("cityBarChart");
  if (!chartCanvas) {
    console.warn("Canvas not found");
    return;
  }

  if (!CITY_LIST || CITY_LIST.length === 0) {
    console.warn("CITY_LIST empty. Chart not drawn.");
    const lg = document.getElementById("cityBarLegend");
    if (lg) lg.remove();
    return;
  }

  // labels are city names (already normalized by buildCityListFromCombined)
  const labels = CITY_LIST.map(c => c.city);

  // --- NEW: compute offline counts (per-city)
  // ensure offline object exists with expected keys (normalize builder already does this)
  const offlineTotals = CITY_LIST.map(c => {
    const off = c.offline || {};
    // sum all offline values (camera + archiver + controller + server)
    return (Number(off.camera || 0) + Number(off.archiver || 0) + Number(off.controller || 0) + Number(off.server || 0));
  });

  // also keep per-type offline arrays for tooltip
  const offlineCamera = CITY_LIST.map(c => (c.offline && c.offline.camera) || 0);
  const offlineController = CITY_LIST.map(c => (c.offline && c.offline.controller) || 0);
  const offlineServer = CITY_LIST.map(c => (c.offline && c.offline.server) || 0);
  const offlineArchiver = CITY_LIST.map(c => (c.offline && c.offline.archiver) || 0);

  // compute risk info (uses your computeCityRiskLevel)
  const riskInfo = CITY_LIST.map(c => computeCityRiskLevel(c));
  const colors = riskInfo.map(r => r.color);
  const riskLabels = riskInfo.map(r => r.label);

  if (cityChart) {
    cityChart.destroy();
  }

  cityChart = new Chart(chartCanvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Offline Devices",
        data: offlineTotals,            // <-- show offline totals
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
          enabled: false, // we use external tooltip
          external: function (context) {
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

            // Build lines (offline totals & breakdown)
            const c = CITY_LIST[dataIndex] || {};
            const totalOffline = offlineTotals[dataIndex] || 0;
            const camOff = offlineCamera[dataIndex] || 0;
            const ctrlOff = offlineController[dataIndex] || 0;
            const srvOff = offlineServer[dataIndex] || 0;
            const archOff = offlineArchiver[dataIndex] || 0;
            const risk = riskLabels[dataIndex] || 'Low';

            const lines = [
              { key: 'City', val: labels[dataIndex], color: '#ffffff' },
              { key: 'Total Offline', val: totalOffline, color: '#ffffff' },
              { key: 'Risk Level', val: risk, color: '#ffffff' },
              { key: 'Offline Camera', val: camOff, color: camOff > 0 ? 'red' : '#ffffff' },
              { key: 'Offline Controller', val: ctrlOff, color: ctrlOff > 0 ? 'red' : '#ffffff' },
              { key: 'Offline Server', val: srvOff, color: srvOff > 0 ? 'red' : '#ffffff' },
              { key: 'Offline Archiver', val: archOff, color: archOff > 0 ? 'red' : '#ffffff' }
            ];

            // Build HTML
            let innerHtml = `<div class="tt-title">${labels[dataIndex]}</div>`;
            lines.forEach(line => {
              innerHtml += `<div class="tt-line"><span class="tt-key">${line.key}:</span> <span class="tt-val" style="color:${line.color}">${line.val}</span></div>`;
            });

            tooltipEl.innerHTML = innerHtml;
            tooltipEl.style.opacity = 1;

            // Positioning
            const canvas = context.chart.canvas;
            const canvasRect = canvas.getBoundingClientRect();
            const left = canvasRect.left + window.pageXOffset + tooltipModel.caretX;
            const top = canvasRect.top + window.pageYOffset + tooltipModel.caretY;

            tooltipEl.style.left = `${left}px`;
            tooltipEl.style.top = `${top - 10}px`;
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Offline Devices'
          }
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

  // Add legend in top-right
  createCityLegend("cityBarLegend");

  console.log("✅ City bar chart drawn (showing offline totals)");
}