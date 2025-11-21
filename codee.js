// ⬇️⬇️⬇️⬇️⬇️⬇️----- LOC Count Bar Chart -----
let _locCountChart = null;

// ✅ Safe title matcher
function findChartPlaceholderByTitle(titleText) {
  const cards = document.querySelectorAll('.gcard.wide');

  for (let card of cards) {
    const title = card.querySelector('.gcard-title');
    if (title && title.textContent.toLowerCase().includes(titleText.toLowerCase())) {
      return card.querySelector('.chart-placeholder');
    }
  }
  return null;
}

// ✅ Collect LOC device counts
function collectLocCounts(options = { topN: 12 }) {

  if (!Array.isArray(window.CITY_LIST) || window.CITY_LIST.length === 0) {
    console.warn("CITY_LIST not ready yet...");
    return { labels: [], values: [] };
  }

  const arr = window.CITY_LIST
    .map(c => {
      const total = Number.isFinite(+c.total) ? +c.total :
        (c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0);

      return {
        city: c.city || "Unknown",
        total: total || 0
      };
    })
    .filter(x => x.total > 0);

  arr.sort((a, b) => b.total - a.total);

  const top = arr.slice(0, options.topN);

  return {
    labels: top.map(x => x.city),
    values: top.map(x => x.total)
  };
}

// ✅ Draw chart
function renderLocCountChart() {

  if (typeof Chart === "undefined") {
    console.warn("Chart.js is not loaded!");
    return;
  }

  const placeholder = findChartPlaceholderByTitle("LOC Count");

  if (!placeholder) {
    console.warn("LOC Count container not found");
    return;
  }

  // force height (very important)
  placeholder.style.height = "320px";

  // ensure canvas
  let canvas = placeholder.querySelector("canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    placeholder.innerHTML = "";
    placeholder.appendChild(canvas);
  }

  const ctx = canvas.getContext("2d");
  const data = collectLocCounts({ topN: 12 });

  if (_locCountChart) {
    try { _locCountChart.destroy(); } catch(e) {}
    _locCountChart = null;
  }

  const palette = [
    "#10b981", "#f97316", "#2563eb", "#7c3aed",
    "#06b6d4", "#ef4444", "#f59e0b", "#94a3b8",
    "#60a5fa", "#34d399", "#f43f5e", "#f59e0b"
  ];

  const valueLabelPlugin = {
    id: "valueLabels",
    afterDatasetsDraw(chart) {
      const ctx = chart.ctx;

      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);

        meta.data.forEach((bar, index) => {
          const val = dataset.data[index];
          if (val === undefined) return;

          ctx.save();
          ctx.fillStyle = "#cbd5e1";
          ctx.font = "12px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText(val, bar.x, bar.y - 6);
          ctx.restore();
        });
      });
    }
  };

  _locCountChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [{
        label: "Devices",
        data: data.values,
        backgroundColor: palette.slice(0, data.values.length),
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.85
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      scales: {
        x: {
          ticks: {
            color: "#b8f4c9",
            maxRotation: 45,
            minRotation: 0
          },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: { color: "#b8f4c9" },
          grid: { color: "rgba(255,255,255,0.05)" }
        }
      },

      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(ctx) {
              return `${ctx.label} : ${ctx.parsed.y}`;
            }
          }
        }
      }
    },
    plugins: [valueLabelPlugin]
  });
}

// ✅ Update chart after CITY_LIST changes
function updateLocCountChart() {

  if (!_locCountChart) {
    return renderLocCountChart();
  }

  const data = collectLocCounts({ topN: 12 });

  _locCountChart.data.labels = data.labels;
  _locCountChart.data.datasets[0].data = data.values;
  _locCountChart.data.datasets[0].backgroundColor = [
    "#10b981", "#f97316", "#2563eb", "#7c3aed",
    "#06b6d4", "#ef4444", "#f59e0b", "#94a3b8"
  ].slice(0, data.values.length);

  _locCountChart.update();
}

// ✅ Auto-run
document.addEventListener("DOMContentLoaded", () => {

  renderLocCountChart();

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(renderLocCountChart, 300);
  });

});