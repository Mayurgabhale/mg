C:\Users\W0024618\Desktop\NewFrontend\Device Dashboard\map.js

i have this code, ok 
no i want to create this dynamic, ok 
ok,
  1, i want to do this map dynamic, ok i want to gett all data in dynamic, 
  2. i want to show each city/ location count
    Cameras,Archivers,Controllers,CCURE ok 
    offline and online and totla count ok,
      when i hover on locatin icon that time i want to disply this.
      and 
<h4 class="panel-title">Global (City Overview)</h4> disply all 
like this 
Global (City Overview)
Quezon
— • 47 devices
Taguig City
— • 6 devices
Pune
— • 116 devices
Kuala lumpur
— • 7 devices
Austria
— • 3 devices
Ireland
— • 9 devices

and in this i click then i wnt ot get dairect ion for in map, 
  for exmapl i clikc on Taguig City i ma going on Taguig City ok ok,
  so do that carefully,  use i am upload first js codd 
,
  and give me update code,
      an user dont uer name
        use this icosn 
           <div class="legend">
                    <div class="legend-item">
                      <i class="bi bi-camera"></i>
                      Camera
                    </div>
                    <div class="legend-item">
                      <i class="bi bi-hdd"></i> Controller
                    </div>
                    <div class="legend-item">
                      <i class="fa-duotone fa-solid fa-server"></i> Server
                    </div>
                    <div class="legend-item">
                      <i class="fas fa-database "></i> Archiver
                    </div>
                        ok and 
   <div class="worldmap-wrapper">
              <!-- MAP CARD -->
              <div class="worldmap-card">
                <!-- Fullscreen Button -->
                <button id="mapFullscreenBtn" class="map-fullscreen-btn">
                  ⛶ View Full
                </button>
                <button id="mapCityOverviewBtn" class="map-CityOverview-btn">
                  City Overview
                </button>
                <!-- SIDE PANEL -->
                <div class="region-panel" id="region-panel">
                  <h4 class="panel-title">Global (City Overview)</h4>
                  <div id="region-panel-content" class="panel-content"></div>
                </div>

                <div id="realmap"></div>

                <!-- Legend + Controls Row -->
                <div class="map-bottom-bar">

                  <!-- Legend -->
                  <div class="legend">
                    <div class="legend-item">
                      <i class="bi bi-camera"></i>
                      Camera
                    </div>
                    <div class="legend-item">
                      <i class="bi bi-hdd"></i> Controller
                    </div>
                    <div class="legend-item">
                      <i class="fa-duotone fa-solid fa-server"></i> Server
                    </div>
                    <div class="legend-item">
                      <i class="fas fa-database "></i> Archiver
                    </div>
                  </div>

                  <!-- Controls -->
                  <div class="map-controls">
                    <button id="fit-all" class="btn-ghost">Fit All</button>
                    <button id="show-global" class="btn-gv">Global View</button>
                  </div>
                </div>
              </div>
            </div>
............
let realMap;
let CITY_LIST = [];

const CITY_COORDS = {
  "Casablanca": [33.5731, -7.5898],
  "Dubai": [25.276987, 55.296249],
  "Argentina": [-38.4161, -63.6167],
  "Austin TX": [30.2672, -97.7431],
  "Austria, Vienna": [48.2082, 16.3738],
  "Costa Rica": [9.7489, -83.7534],
  "Denver": [39.7392, -104.9903],
  "Florida, Miami": [25.7617, -80.1918],
  "Frankfurt": [50.1109, 8.6821],
  "Ireland, Dublin": [53.3331, -6.2489],
  "Italy, Rome": [41.9028, 12.4964],
  "Japan Tokyo": [35.6762, 139.6503],
  "Kuala lumpur": [3.1390, 101.6869],
  "London": [51.5074, -0.1278],
  "Madrid": [40.4168, -3.7038],
  "Mexico": [23.6345, -102.5528],
  "Moscow": [55.7558, 37.6173],
  "NEW YORK": [40.7128, -74.0060],
  "Panama": [8.5380, -80.7821],
  "Peru": [-9.1900, -75.0152],
  "Pune": [18.5204, 73.8567],
  "Vilnius": [54.6872, 25.2797],
  "Singapore": [1.3521, 103.8198],
  "HYDERABAD": [17.3850, 78.4867]
};

function initRealMap() {
  realMap = L.map('realmap', {
    preferCanvas: true,
    maxBounds: [[70, -135], [-60, 160]],
    maxBoundsViscosity: 1.0,
    minZoom: 2,
    maxZoom: 20
  }).setView([15, 0], 2.5);

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    attribution: 'Tiles © Esri'
  }).addTo(realMap);

  window.cityMarkerLayer = L.layerGroup().addTo(realMap);
  L.control.scale().addTo(realMap);
}

function buildCityListFromCoords() {
  CITY_LIST = Object.entries(CITY_COORDS).map(([city, coords]) => ({
    city: city,
    lat: coords[0],
    lon: coords[1]
  }));
}

function placeCityMarkers() {
  window.cityMarkerLayer.clearLayers();

  CITY_LIST.forEach(city => {
    const cityIcon = L.divIcon({
      className: 'city-marker',
      html: '<span class="pin"><i class="bi bi-geo-alt-fill"></i></span>',
      iconAnchor: [12, 12]
    });

    const marker = L.marker([city.lat, city.lon], { icon: cityIcon });

    marker.bindTooltip(city.city, {
      direction: 'top',
      offset: [0, -10],
      opacity: 0.9
    });

    marker.addTo(window.cityMarkerLayer);
  });
}

function fitAllCities() {
  const coords = CITY_LIST.map(c => [c.lat, c.lon]);
  const bounds = L.latLngBounds(coords);
  realMap.fitBounds(bounds.pad(0.3));
}

const fullscreenBtn = document.getElementById("mapFullscreenBtn");
const mapCard = document.querySelector(".worldmap-card");
let isFullscreen = false;

fullscreenBtn.addEventListener("click", () => {
  isFullscreen = !isFullscreen;

  if (isFullscreen) {
    mapCard.classList.add("fullscreen");
    document.body.style.overflow = "hidden";
    fullscreenBtn.innerText = "✖ Exit Full";
  } else {
    mapCard.classList.remove("fullscreen");
    document.body.style.overflow = "auto";
    fullscreenBtn.innerText = "⛶ View Full";
  }

  setTimeout(() => realMap.invalidateSize(true), 300);
});

document.addEventListener("DOMContentLoaded", () => {
  initRealMap();
  buildCityListFromCoords();
  placeCityMarkers();
  fitAllCities();
});












