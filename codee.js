<div id="mapFullscreenModal">
  <span id="closeFullscreenBtn">✖</span>
  <div id="fullscreenMap"></div>
</div>


/* Fullscreen Modal */
#mapFullscreenModal {
  position: fixed;
  inset: 0;
  background: black;
  z-index: 999999;
  display: none;
}

/* Fullscreen Map */
#fullscreenMap {
  width: 100%;
  height: 100vh;
}

/* Close Button */
#closeFullscreenBtn {
  position: absolute;
  top: 15px;
  right: 20px;
  color: white;
  font-size: 22px;
  cursor: pointer;
  z-index: 9999999;
  background: rgba(0,0,0,0.5);
  padding: 6px 10px;
  border-radius: 5px;
}



..


let fullscreenMap;

document.getElementById("mapFullscreenBtn").addEventListener("click", () => {
  const modal = document.getElementById("mapFullscreenModal");
  modal.style.display = "block";

  // Wait for popup to show
  setTimeout(() => {

    if (!fullscreenMap) {
      fullscreenMap = L.map("fullscreenMap").setView(realMap.getCenter(), realMap.getZoom());

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(fullscreenMap);
    } else {
      fullscreenMap.setView(realMap.getCenter(), realMap.getZoom());
      fullscreenMap.invalidateSize();
    }

    drawFullscreenHeatmap();
  }, 200);
});


...


function drawFullscreenHeatmap() {

  const totals = CITY_LIST
    .map(c => ({
      lat: toNum(c.lat),
      lon: toNum(c.lon),
      total: c.devices ? Object.values(c.devices).reduce((a,b)=>a+b,0) : 0
    }))
    .filter(x => x.lat && x.lon && x.total > 0);

  if (!totals.length) return;

  let maxTotal = Math.max(...totals.map(t => t.total), 1);

  const heatPoints = totals.map(t =>
    [t.lat, t.lon, Math.min(1.5, (t.total / maxTotal) + 0.2)]
  );

  L.heatLayer(heatPoints, {
      radius: 40,
      blur: 25,
      maxZoom: 10
  }).addTo(fullscreenMap);
}




...
document.getElementById("closeFullscreenBtn").addEventListener("click", () => {
  const modal = document.getElementById("mapFullscreenModal");
  modal.style.display = "none";
});