leaflet-heat.js:6 Uncaught IndexSizeError: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The source width is 0.
draw	@	leaflet-heat.js:6
_redraw	@	leaflet-heat.js:11
_reset	@	leaflet-heat.js:11
fire	@	Events.js:195
_moveEnd	@	Map.js:1254
_resetView	@	Map.js:1187
panBy	@	Map.js:323
invalidateSize	@	Map.js:577
(anonymous)	@	map.js:1184
setTimeout		
(anonymous)	@	map.js:1183

  map not diplsy in full screen afte clik con view full button 

   <div class="right-panel">
              <!-- <div class="gcard tall"> -->
              <div class="">
                <div class="worldmap-wrapper">

                  <!-- MAP CARD -->
                  <div class="worldmap-card">
                    <!-- Fullscreen Button -->
                    <button id="mapFullscreenBtn" class="map-fullscreen-btn">
                      ⛶ View Full
                    </button>

                    <div id="realmap"></div>

                    <!-- Legend + Controls Row -->
                    <div class="map-bottom-bar">

    
/* Fullscreen button (top right) */
.map-fullscreen-btn {
  position: absolute;
  top: 10px;
  right: 12px;
  z-index: 9999;
  padding: 6px 10px;
  font-size: 11px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  cursor: pointer;
  border-radius: 4px;
  transition: 0.3s ease;
}

.map-fullscreen-btn:hover {
  background: #1f2937;
}

/* Make map card a reference for button */
.worldmap-card {
  position: relative;
  overflow: hidden;
}

/* Fullscreen animation */
/* .worldmap-card.fullscreen {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  max-width: unset;
  z-index: 99999;
  border-radius: 0;
  animation: expandMap 0.4s ease forwards;
} */

/* Fullscreen mode */
.worldmap-card.fullscreen {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  background: #0f172a;
}

/* Resize map */
.worldmap-card.fullscreen #realmap {
  width: 100% !important;
  height: calc(100vh - 60px) !important;
}


/* Keep bottom bar always visible */
.worldmap-card.fullscreen .map-bottom-bar {
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 999999;
}


/* Smooth animation */
@keyframes expandMap {
  from {
    transform: scale(0.9);
    opacity: 0.8;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
/* Hide other UI when fullscreen */
body.map-fullscreen-active .region-panel,
body.map-fullscreen-active .panel,
body.map-fullscreen-active .right-panel {
  display: none;
}


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
