<!-- FULLSCREEN MAP POPUP -->
<div id="mapFullscreenOverlay" class="map-overlay">
  <div class="map-popup">

    <button id="closeFullscreenMap" class="close-map-btn">
      ✖ Close
    </button>

    <div id="fullscreenMapContainer"></div>

  </div>
</div>





/* Overlay background */
.map-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 999999;
}

/* Popup container */
.map-popup {
  width: 96vw;
  height: 94vh;
  background: #0f172a;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(0,0,0,0.6);
  animation: zoomIn 0.35s ease;
}

/* Actual fullscreen map */
#fullscreenMapContainer {
  width: 100%;
  height: 100%;
}

/* Close button */
.close-map-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10000;
  padding: 6px 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  cursor: pointer;
  border-radius: 4px;
}

/* Animation */
@keyframes zoomIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}



.....


const fullscreenBtn = document.getElementById("mapFullscreenBtn");
const overlay = document.getElementById("mapFullscreenOverlay");
const closeBtn = document.getElementById("closeFullscreenMap");

let fullscreenMap = null;

fullscreenBtn.addEventListener("click", () => {

  overlay.style.display = "flex";

  setTimeout(() => {

    // Create new map only once
    if (!fullscreenMap) {

      fullscreenMap = L.map('fullscreenMapContainer', {
        preferCanvas: true,
        center: realMap.getCenter(),
        zoom: realMap.getZoom()
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 20
      }).addTo(fullscreenMap);

      // copy markers
      window.cityMarkerLayer?.eachLayer(m => m.addTo(fullscreenMap));

      // copy heatmap
      if (heatLayer) {
        heatLayer.addTo(fullscreenMap);
      }
    } else {
      fullscreenMap.setView(realMap.getCenter(), realMap.getZoom());
    }

    fullscreenMap.invalidateSize(true);

  }, 200);   // VERY IMPORTANT delay fixes your error

});






closeBtn.addEventListener("click", () => {
  overlay.style.display = "none";
});