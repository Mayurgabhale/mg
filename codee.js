/* Fullscreen mode */
.worldmap-card.fullscreen {
  position: fixed;
  inset: 0; /* top:0; bottom:0; left:0; right:0 */
  display: flex;
  justify-content: center; /* horizontal center */
  align-items: center;     /* vertical center */
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  background: #0f172a;
}

/* Resize the map container to fill parent */
.worldmap-card.fullscreen #realmap {
  width: 100% !important;
  height: 100% !important;
}

/* Keep bottom bar visible */
.worldmap-card.fullscreen .map-bottom-bar {
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 99999;
}