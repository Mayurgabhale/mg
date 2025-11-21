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