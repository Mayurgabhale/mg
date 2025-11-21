// =============================================
// LOC COUNT BAR CHART (AUTO HANDLES CITY_LIST)
// =============================================

let _locCountChart = null;

/** Collect data from CITY_LIST */
function collectLocCounts() {
  if (!Array.isArray(window.CITY_LIST) || window.CITY_LIST.length === 0) {
    return { labels: [], values: [] };
  }

  const sorted = window.CITY_LIST
    .map(c => ({
      city: c.city || "Unknown",
      total: Number(c.total) || 0
    }))
    .filter(x => x.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  return {
    labels: sorted.map(x => x.city),
    values: sorted.map(x => x.total)
  };
}

/** Render chart */
function renderLocCountChart() {
  if (typeof Chart === "undefined") {
    console.warn("Chart.js not loaded");
    return;
  }

  const placeholder = findChartPlaceholderByTitle("LOC Count");
  if (!placeholder) return;

  let canvas = placeholder.querySelector("canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    placeholder.innerHTML = "";
    placeholder.appendChild(canvas);
  }

  placeholder.style.height = "300px";

  const ctx = canvas.getContext("2d");
  const data = collectLocCounts();

  if (_locCountChart) {
    _locCountChart.destroy();
  }

  _locCountChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [{
        label: "Devices",
        data: data.values,
        backgroundColor: "#10b981",
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#9ca3af", maxRotation: 45 }
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(255,255,255,0.05)" },
          ticks: { color: "#9ca3af" }
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
    }
  });
}

/** Update chart manually if needed */
function updateLocCountChart() {
  if (!_locCountChart) {
    renderLocCountChart();
    return;
  }

  const data = collectLocCounts();
  _locCountChart.data.labels = data.labels;
  _locCountChart.data.datasets[0].data = data.values;
  _locCountChart.update();
}

/** Auto wait for CITY_LIST (no map.js changes needed) */
function waitForCityList() {
  let attempts = 0;

  const timer = setInterval(() => {
    attempts++;

    if (Array.isArray(window.CITY_LIST) && window.CITY_LIST.length > 0) {
      console.log("CITY_LIST ready → Updating LOC Chart");
      updateLocCountChart();
      clearInterval(timer);
    }

    if (attempts > 50) {
      console.warn("CITY_LIST not found after timeout.");
      clearInterval(timer);
    }
  }, 300);
}

// ===== Initialize LOC chart =====
document.addEventListener("DOMContentLoaded", () => {
  renderLocCountChart();   // Draw empty chart first
  waitForCityList();       // Fill when data arrives

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderLocCountChart();
      waitForCityList();
    }, 200);
  });
});