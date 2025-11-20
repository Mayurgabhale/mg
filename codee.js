function initRealMap() {
  realMap = L.map('realmap', { 
    preferCanvas: true,

    // 🔥 THIS CUTS THE TOP OF THE MAP
    maxBounds: [
      [80, -180],   // TOP limit — cut above latitude 80
      [-60, 180]    // BOTTOM limit
    ],
    maxBoundsViscosity: 1.0
  })
  .setView([40, -20], 3); // Start view (adjust as you want)

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    attribution: 'Tiles © Esri'
  }).addTo(realMap);
