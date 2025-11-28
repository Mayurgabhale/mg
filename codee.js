let cityChart = null;

function drawCityBarChart() {

  const chartCanvas = document.getElementById("cityBarChart");
  if (!chartCanvas) {
    console.warn("Canvas not found");
    return;
  }

  if (!CITY_LIST || CITY_LIST.length === 0) {
    console.warn("CITY_LIST empty. Chart not drawn.");
    return;
  }

  const labels = CITY_LIST.map(c => c.city);

  // ✅ TOTAL DEVICE COUNT
  const data = CITY_LIST.map(c => {
    return Object.values(c.devices).reduce((sum, val) => sum + val, 0);
  });

  const riskInfo = CITY_LIST.map(c => computeCityRisk(c));
  const colors = riskInfo.map(r => r.color);
  const riskLabels = riskInfo.map(r => r.label);

  if (cityChart) cityChart.destroy();

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
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false,
          external: function (context) {

            let tooltipEl = document.getElementById('chartjs-tooltip');

            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-tooltip';
              tooltipEl.className = 'chartjs-tooltip';
              document.body.appendChild(tooltipEl);
            }

            const tooltipModel = context.tooltip;
            if (!tooltipModel || tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0;
              return;
            }

            const index = tooltipModel.dataPoints[0].dataIndex;
            const c = CITY_LIST[index];

            const total = Object.values(c.devices).reduce((a, b) => a + b, 0);
            const risk = riskLabels[index];

            const html = `
              <div><b>${c.city}</b></div>
              <div>Total Devices: ${total}</div>
              <div>Risk Level: ${risk}</div>
              <div>Offline Camera: ${c.offline.camera}</div>
              <div>Offline Controller: ${c.offline.controller}</div>
              <div>Offline Server: ${c.offline.server}</div>
              <div>Offline Archiver: ${c.offline.archiver}</div>
            `;

            tooltipEl.innerHTML = html;

            const canvasRect = context.chart.canvas.getBoundingClientRect();
            tooltipEl.style.left = canvasRect.left + window.pageXOffset + tooltipModel.caretX + 'px';
            tooltipEl.style.top = canvasRect.top + window.pageYOffset + tooltipModel.caretY - 40 + 'px';
            tooltipEl.style.opacity = 1;
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#fff"
          }
        },
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
            callback: function (value, index) {
              return (riskLabels[index] === "Medium" || riskLabels[index] === "High")
                ? labels[index]
                : "";
            },
            color: function (ctx) {
              const risk = riskLabels[ctx.index];
              return (risk === "Medium" || risk === "High") ? "red" : "#666";
            }
          }
        }
      }
    }
  });

  createCityLegend();
}