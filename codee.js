function initRealMap() {
  realMap = L.map('realmap', { 
    preferCanvas: true,

    // 🌎 SHOW ONLY APAC + EMEA + NAMER + LACA
    maxBounds: [
      [70, -150],   // top-left limit (cuts Arctic)
      [-60, 160]    // bottom-right limit (cuts Antarctica)
    ],
    maxBoundsViscosity: 1.0,

    minZoom: 2.3,    // prevent zooming out too far
    maxZoom: 20
  })
  .setView([15, 0], 2.4);  // perfect center for all 4 regions

  // Satellite map
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    attribution: 'Tiles © Esri'
  }).addTo(realMap);

  // clusters, layers, etc
  window.markerCluster = L.markerClusterGroup({ chunkedLoading: true, showCoverageOnHover: false });
  window.countryLayerGroup = L.layerGroup().addTo(realMap);
  realMap.addLayer(window.markerCluster);

  L.control.scale().addTo(realMap);
}