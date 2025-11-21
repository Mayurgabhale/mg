
    ok disply but it is goin left side, i want perfect is center
/* Fullscreen mode */
.worldmap-card.fullscreen {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  background: #0f172a;
}

/* Resize the existing map container */
.worldmap-card.fullscreen #realmap {
  width: 100% !important;
  height: 100% !important;
}

/* Optional: keep bottom bar visible */
.worldmap-card.fullscreen .map-bottom-bar {
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 99999;
}


    
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




....



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

  // VERY IMPORTANT: tell Leaflet the map size changed
  setTimeout(() => {
    realMap.invalidateSize(true);
  }, 300); // wait for CSS animation to finish
});
