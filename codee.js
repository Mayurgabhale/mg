function placeCityMarkers() {
  if (!window.cityMarkerLayer) return;

  window.cityMarkerLayer.clearLayers();

  CITY_LIST.forEach(c => {
    if (toNum(c.lat) === null || toNum(c.lon) === null) return;

    const blinkClass = c.shouldBlink ? 'blink' : '';
    const severityClass = (c.blinkSeverity >= 3) ? ' blink-high' : '';

    const cityIconHtml = `<div><span class="pin ${blinkClass}${severityClass}"><i class="bi bi-geo-alt-fill"></i></span></div>`;
    const cityIcon = L.divIcon({ className: 'city-marker', html: cityIconHtml, iconAnchor: [12, 12] });
    const marker = L.marker([c.lat, c.lon], { icon: cityIcon });

    const getSummary = () => buildCitySummaryHTML(c);

    marker.on('mouseover', () => marker.bindTooltip(getSummary(), { direction: 'top', offset: [0, -12], opacity: 1 }).openTooltip());
    marker.on('mouseout', () => marker.closeTooltip());
    marker.on('click', () => marker.bindPopup(getSummary(), { maxWidth: 260 }).openPopup());

    marker.addTo(window.cityMarkerLayer);
  });

  // Bring individual markers to front safely
  window.cityMarkerLayer.eachLayer(layer => layer.bringToFront && layer.bringToFront());
}