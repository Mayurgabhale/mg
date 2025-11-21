/* Parent */
.worldmap-card {
  position: relative;
}

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

/* Hide other UI when fullscreen */
body.map-fullscreen-active .region-panel,
body.map-fullscreen-active .panel,
body.map-fullscreen-active .right-panel {
  display: none;
}