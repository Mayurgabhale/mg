.device-health-card {
  height: 250px;
  overflow-y: auto;
}

#device-health-table {
  width: 100%;
  border-collapse: collapse;
}

#device-health-table th, #device-health-table td {
  padding: 8px;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
}

.trend-up { color: #10b981; }   /* green */
.trend-down { color: #ef4444; } /* red */




...
const PREVIOUS_COUNTS = {}; // to store previous values

function updateDeviceHealthTable(data) {
  // data = { cameras: { active, inactive }, archivers: {...}, ... }
  const tbody = document.querySelector('#device-health-table tbody');
  tbody.innerHTML = '';

  Object.keys(data).forEach(type => {
    const { active, inactive } = data[type];
    const total = active + inactive;

    // calculate trend
    const prev = PREVIOUS_COUNTS[type] || { active: 0, inactive: 0 };
    let trendSymbol = '';
    if (active > prev.active) trendSymbol = '▲';
    else if (active < prev.active) trendSymbol = '▼';
    const trendClass = active >= prev.active ? 'trend-up' : 'trend-down';

    PREVIOUS_COUNTS[type] = { active, inactive };

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${type.charAt(0).toUpperCase() + type.slice(1)}</td>
      <td>${total}</td>
      <td>${active}</td>
      <td>${inactive}</td>
      <td class="${trendClass}">${trendSymbol}</td>
    `;
    tbody.appendChild(row);
  });
}



...
..



function renderGauges() {
  const deviceData = {
    cameras: { active: parseInt(document.getElementById('camera-online').textContent || 0),
               inactive: parseInt(document.getElementById('camera-offline').textContent || 0) },
    archivers: { active: parseInt(document.getElementById('archiver-online').textContent || 0),
                 inactive: parseInt(document.getElementById('archiver-offline').textContent || 0) },
    controllers: { active: parseInt(document.getElementById('controller-online').textContent || 0),
                   inactive: parseInt(document.getElementById('controller-offline').textContent || 0) },
    ccure: { active: parseInt(document.getElementById('server-online').textContent || 0),
             inactive: parseInt(document.getElementById('server-offline').textContent || 0) }
  };

  updateGauge("gauge-cameras", "camera-online", "camera-offline", "camera-total");
  updateGauge("gauge-archivers", "archiver-online", "archiver-offline", "archiver-total");
  updateGauge("gauge-controllers", "controller-online", "controller-offline", "controller-total");
  updateGauge("gauge-ccure", "server-online", "server-offline", "server-total");

  updateTotalCountChart();
  updateDeviceHealthTable(deviceData); // ✅ new panel update







....
function updateHeatMap() {
  if (!realMap) return;
  if (heatLayer) realMap.removeLayer(heatLayer);

  const heatPoints = [];

  Object.keys(cityLayers).forEach(city => {
    const { deviceLayer } = cityLayers[city];
    let inactiveCount = 0;

    deviceLayer.eachLayer(marker => {
      if (marker.getTooltip && marker.getTooltip().getContent().includes('INACTIVE')) {
        inactiveCount++;
      }
    });

    const cityObj = CITY_LIST.find(c => c.city === city);
    if (cityObj && inactiveCount > 0) {
      heatPoints.push([cityObj.lat, cityObj.lon, inactiveCount]);
    }
  });

  heatLayer = L.heatLayer(heatPoints, { radius: 25, blur: 15, maxZoom: 10 }).addTo(realMap);
}



...



function refreshMapDevices() {
  Object.values(CITY_LIST).forEach(cityObj => {
    _placeDeviceIconsForCity(cityObj, cityObj.devices);
  });
  updateHeatMap(); // 🔥 show inactive intensity
}