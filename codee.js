i want to disply location name when i hover the icon ok 

function placeCityMarkers() {
  if (!window.cityMarkerLayer) window.cityMarkerLayer = L.layerGroup().addTo(realMap);
  window.cityMarkerLayer.clearLayers();

  CITY_LIST.forEach(c => {
    if (toNum(c.lat) === null || toNum(c.lon) === null) return;

    // City icon with pin
    const cityIcon = L.divIcon({
      className: 'city-marker',
       //  html: `<div><span class="pin"><i class="bi bi-geo-alt"></i></span>${c.city}</div>`,
    html: `<div><span class="pin"><i class="bi bi-geo-alt"></i></span></div>`,
      iconAnchor: [10, 10], // adjust so text appears above pin
    });

    const marker = L.marker([c.lat, c.lon], { icon: cityIcon });
    marker.addTo(window.cityMarkerLayer);
  });

  window.cityMarkerLayer.bringToFront();
}
