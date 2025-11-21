<!-- Fullscreen Button -->
<button id="mapFullscreenBtn" class="map-fullscreen-btn">
  ⛶ View Full
</button>

<div id="realmap"></div>





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
.worldmap-card.fullscreen {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  max-width: unset;
  z-index: 99999;
  border-radius: 0;
  animation: expandMap 0.4s ease forwards;
}

/* Resize map container */
.worldmap-card.fullscreen #realmap {
  height: 100vh !important;
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

/* Fade rest UI */
body.map-fullscreen-active .region-panel,
body.map-fullscreen-active .panel,
body.map-fullscreen-active .right-panel {
  display: none !important;
}






const fullscreenBtn = document.getElementById("mapFullscreenBtn");
const mapCard = document.querySelector(".worldmap-card");

let isFullscreen = false;

fullscreenBtn.addEventListener("click", () => {
  isFullscreen = !isFullscreen;

  if (isFullscreen) {
    mapCard.classList.add("fullscreen");
    document.body.classList.add("map-fullscreen-active");
    fullscreenBtn.innerText = "✖ Exit Full";

    setTimeout(() => {
      realMap.invalidateSize();   // Refresh Leaflet size
    }, 400);
  } else {
    mapCard.classList.remove("fullscreen");
    document.body.classList.remove("map-fullscreen-active");
    fullscreenBtn.innerText = "⛶ View Full";

    setTimeout(() => {
      realMap.invalidateSize();
    }, 400);
  }
});
