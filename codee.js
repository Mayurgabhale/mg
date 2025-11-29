function initRealMap() {
  if (realMap) return; // Prevent multiple initializations

  realMap = L.map('realmap', {
    preferCanvas: true,
    maxBounds: [[70, -135], [-60, 160]],
    maxBoundsViscosity: 1.0,
    minZoom: 2.1,
    maxZoom: 20
  }).setView([15, 0], 2.4);

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    attribution: 'Tiles © Esri'
  }).addTo(realMap);

  window.markerCluster = L.markerClusterGroup({ chunkedLoading: true, showCoverageOnHover: false });
  window.countryLayerGroup = L.layerGroup().addTo(realMap);
  realMap.addLayer(window.markerCluster);
  L.control.scale().addTo(realMap);

  // Layer for city markers
  window.cityMarkerLayer = L.layerGroup().addTo(realMap);
}