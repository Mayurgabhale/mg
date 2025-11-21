function drawHeatmap() {

  // Prevent redraw when container is hidden or animating
  const mapDiv = document.getElementById("realmap");
  if (!mapDiv || mapDiv.offsetWidth === 0 || mapDiv.offsetHeight === 0) {
    return;
  }

  const totals = CITY_LIST
    .map(c => ({
      lat: toNum(c.lat),
      lon: toNum(c.lon),
      total: c.devices ? Object.values(c.devices).reduce((a, b) => a + b, 0) : 0
    }))
    .filter(x => x.lat !== null && x.lon !== null && x.total > 0);

  if (!totals.length) {
    if (heatLayer) {
      realMap.removeLayer(heatLayer);
      heatLayer = null;
    }
    return;
  }

  let maxTotal = Math.max(...totals.map(t => t.total), 1);
  const heatPoints = totals.map(t =>
    [t.lat, t.lon, Math.min(1.5, (t.total / maxTotal) + 0.2)]
  );

  if (heatLayer) realMap.removeLayer(heatLayer);

  heatLayer = L.heatLayer(heatPoints, {
    radius: 40,
    blur: 25,
    maxZoom: 10
  }).addTo(realMap);
}




...

const fullscreenBtn = document.getElementById("mapFullscreenBtn");
const mapCard = document.querySelector(".worldmap-card");

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

  // VERY IMPORTANT for Leaflet + heatmap
  setTimeout(() => {
    realMap.invalidateSize(true);
  }, 350);
});