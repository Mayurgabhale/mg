.city-marker {
  display: flex;
  align-items: center;
  background: rgba(37, 99, 235, 0.85);
  color: #fff;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.city-marker .pin {
  width: 10px;
  height: 10px;
  background: #f59e0b;
  border-radius: 50%;
  margin-right: 4px;
}






....

function placeCityMarkers() {
  if (!window.cityMarkerLayer) window.cityMarkerLayer = L.layerGroup().addTo(realMap);
  window.cityMarkerLayer.clearLayers();

  CITY_LIST.forEach(c => {
    if (toNum(c.lat) === null || toNum(c.lon) === null) return;

    // City icon with pin
    const cityIcon = L.divIcon({
      className: 'city-marker',
      html: `<div><span class="pin"></span>${c.city}</div>`,
      iconAnchor: [10, 10], // adjust so text appears above pin
    });

    const marker = L.marker([c.lat, c.lon], { icon: cityIcon });
    marker.addTo(window.cityMarkerLayer);
  });

  window.cityMarkerLayer.bringToFront();
}




...



// Place city markers with names + pin
placeCityMarkers();