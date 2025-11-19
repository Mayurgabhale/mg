function placeCityMarkers() {
  if (!window.cityMarkerLayer) window.cityMarkerLayer = L.layerGroup().addTo(realMap);
  window.cityMarkerLayer.clearLayers();

  CITY_LIST.forEach(c => {
    if (toNum(c.lat) === null || toNum(c.lon) === null) return;

    // City icon with pin only
    const cityIcon = L.divIcon({
      className: 'city-marker',
      html: `<div><span class="pin"><i class="bi bi-geo-alt"></i></span></div>`,
      iconAnchor: [10, 10], // adjust so pin points to location
    });

    const marker = L.marker([c.lat, c.lon], { icon: cityIcon });

    // Bind tooltip with city name
    marker.bindTooltip(c.city, {
      permanent: false,      // shows only on hover
      direction: 'top',      // tooltip appears above marker
      offset: [0, -10],      // slight offset above the pin
      opacity: 0.9
    });

    marker.addTo(window.cityMarkerLayer);
  });

  window.cityMarkerLayer.bringToFront();
}