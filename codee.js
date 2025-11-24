// --------- Consolidated initialization + fixes ---------

// Safe number parse
function toNum(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// Case-insensitive CITY_COORDS lookup
async function getCityCoordinates(cityName) {
  if (!cityName) return null;
  cityName = cityName.trim();
  // direct exact hit first
  if (CITY_COORDS[cityName]) return CITY_COORDS[cityName];
  // try case-insensitive match
  const lower = cityName.toLowerCase();
  for (const k of Object.keys(CITY_COORDS)) {
    if (k.toLowerCase() === lower) return CITY_COORDS[k];
  }
  // warn and return null (don't attempt remote geocode here)
  console.warn("City not found in CITY_COORDS:", cityName);
  return null;
}

function initRealMap() {
  if (realMap) return; // idempotent init
  realMap = L.map('realmap', {
    preferCanvas: true,
    maxBounds: [
      [70, -135],
      [-60, 160]
    ],
    maxBoundsViscosity: 1.0,
    minZoom: 2.1,
    maxZoom: 20
  }).setView([15, 0], 2.4);

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    attribution: 'Tiles © Esri'
  }).addTo(realMap);

  if (!window.markerCluster) {
    window.markerCluster = L.markerClusterGroup({ chunkedLoading: true, showCoverageOnHover: false });
    realMap.addLayer(window.markerCluster);
  }
  if (!window.countryLayerGroup) window.countryLayerGroup = L.layerGroup().addTo(realMap);
  L.control.scale().addTo(realMap);
}

function placeCityMarkers() {
  if (!realMap) return;
  if (!window.cityMarkerLayer) window.cityMarkerLayer = L.layerGroup().addTo(realMap);
  window.cityMarkerLayer.clearLayers();

  CITY_LIST.forEach(c => {
    if (toNum(c.lat) === null || toNum(c.lon) === null) return;

    const blinkClass = c.shouldBlink ? 'blink' : '';
    const severityClass = (c.blinkSeverity && c.blinkSeverity >= 3) ? ' blink-high' : '';

    const cityIconHtml = `<div><span class="pin ${blinkClass}${severityClass}" title="${c.city}"><i class="bi bi-geo-alt-fill"></i></span></div>`;
    const cityIcon = L.divIcon({
      className: 'city-marker',
      html: cityIconHtml,
      iconAnchor: [12, 12]
    });

    const marker = L.marker([c.lat, c.lon], { icon: cityIcon });

    const getSummary = () => buildCitySummaryHTML(c);

    marker.on('mouseover', function () {
      marker.bindTooltip(getSummary(), {
        direction: 'top',
        offset: [0, -12],
        opacity: 1,
        permanent: false,
        className: 'city-summary-tooltip'
      }).openTooltip();
    });
    marker.on('mouseout', function () {
      try { marker.closeTooltip(); } catch (e) {}
    });
    marker.on('click', function () {
      marker.bindPopup(getSummary(), { maxWidth: 260 }).openPopup();
    });

    window.cityMarkerLayer.addLayer(marker);
  });

  window.cityMarkerLayer.bringToFront();
}

// consolidated DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initRealMap();
  placeCityMarkers();

  // safe hookup helper
  function setOnClick(id, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
  }

  setOnClick("toggle-heat", toggleHeat);
  setOnClick("fit-all", fitAllCities);
  setOnClick("show-global", populateGlobalCityList);

  // fullscreen handling - safe checks & debounce invalidateSize
  (function setupFullscreen() {
    const fullscreenBtn = document.getElementById("mapFullscreenBtn");
    const mapCard = document.querySelector(".worldmap-card");
    if (!fullscreenBtn || !mapCard) return;

    let isFullscreen = false;
    fullscreenBtn.addEventListener("click", () => {
      isFullscreen = !isFullscreen;

      if (isFullscreen) {
        mapCard.classList.add("fullscreen");
        document.body.classList.add("map-fullscreen-active");
        fullscreenBtn.innerText = "✖ Exit Full";
      } else {
        mapCard.classList.remove("fullscreen");
        document.body.classList.remove("map-fullscreen-active");
        fullscreenBtn.innerText = "⛶ View Full";
      }

      // tell Leaflet the map size changed (debounced)
      setTimeout(() => {
        try { realMap.invalidateSize(true); } catch (e) {}
      }, 300);
    });
  })();

  // expose updateMapData for external calls
  window.updateMapData = updateMapData;
});

// ---------- Chart.js bar chart (fixed config) ----------
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
  const data = CITY_LIST.map(c => {
    if (!c.devices) return 0;
    return Object.values(c.devices).reduce((a, b) => a + b, 0);
  });

  if (cityChart) {
    try { cityChart.destroy(); } catch (e) { /* ignore */ }
  }

  cityChart = new Chart(chartCanvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Total Devices",
        data: data
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true
        },
        x: {
          ticks: {
            maxRotation: 0,
            autoSkip: true
          }
        }
      }
    }
  });
}