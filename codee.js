function onCityItemClick(cityName) {
  const c = CITY_LIST.find(x => x.city === cityName);
  if (c && toNum(c.lat) !== null && toNum(c.lon) !== null) {
    realMap.setView([c.lat, c.lon], 5, { animate: true });
  }
  populateCityPanel(cityName);
}








....realMap = L.map('realmap', { 
    preferCanvas: true,
    maxBounds: [
        [85, -180],  
        [-60, 180]
    ],
    maxBoundsViscosity: 1.0
}).setView([60, -30], 3); // Greenland / Europe centered