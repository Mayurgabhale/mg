map.js:1188 updateMapData error ReferenceError: drawRegionBadges is not defined
    at updateMapData (map.js:1186:5)

map.js:921 Uncaught (in promise) TypeError: window.cityMarkerLayer.bringToFront is not a function
    at placeCityMarkers (map.js:921:26)
    at updateMapData (map.js:1190:3)
map.js:921 Uncaught (in promise) TypeError: window.cityMarkerLayer.bringToFront is not a function
    at placeCityMarkers (map.js:921:26)
    at updateMapData (map.js:1190:3)
// ============================
// LOC Count Bar Chart (FIXED)
// ============================

let _locCountChart = null;

function collectLocCounts() {
  if (!Array.isArray(window.CITY_LIST) || window.CITY_LIST.length === 0) {
    console.warn("CITY_LIST empty or unavailable");
    return { labels: [], values: [] };
  }

  const sorted = window.CITY_LIST
    .map(c => ({
      city: c.city || "Unknown",
      total: c.total || (c.devices ? Object.values(c.devices).reduce((a,b)=>a+b,0) : 0)
    }))
    .filter(x => x.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  return {
    labels: sorted.map(x => x.city),
    values: sorted.map(x => x.total)
  };
}

function renderLocCountChart() {
  const placeholder = findChartPlaceholderByTitle("LOC Count");

  if (!placeholder) {
    console.warn("LOC Count card not found");
    return;
  }

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
        data: data.values,
        backgroundColor: "#10b981",
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxRotation: 45 }
        },
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

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

// Auto refresh every 3 seconds
setInterval(() => {
  if (window.CITY_LIST && window.CITY_LIST.length > 0) {
    updateLocCountChart();
  }
}, 3000);

// Initial render
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(renderLocCountChart, 1500);
});
