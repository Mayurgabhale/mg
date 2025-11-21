function renderGauges() {
  updateGauge("gauge-cameras", "camera-online", "camera-offline", "camera-total");
  updateGauge("gauge-archivers", "archiver-online", "archiver-offline", "archiver-total");
  updateGauge("gauge-controllers", "controller-online", "controller-offline", "controller-total");
  updateGauge("gauge-ccure", "server-online", "server-offline", "server-total");

  // Collect device counts for the health table
  const deviceData = {
    cameras: {
      active: parseInt(document.getElementById('camera-online').textContent || '0'),
      inactive: parseInt(document.getElementById('camera-offline').textContent || '0')
    },
    archivers: {
      active: parseInt(document.getElementById('archiver-online').textContent || '0'),
      inactive: parseInt(document.getElementById('archiver-offline').textContent || '0')
    },
    controllers: {
      active: parseInt(document.getElementById('controller-online').textContent || '0'),
      inactive: parseInt(document.getElementById('controller-offline').textContent || '0')
    },
    ccure: {
      active: parseInt(document.getElementById('server-online').textContent || '0'),
      inactive: parseInt(document.getElementById('server-offline').textContent || '0')
    }
  };

  updateDeviceHealthTable(deviceData); // ✅ pass the data
  updateTotalCountChart();
}



.....



function updateDeviceHealthTable(data) {
  if (!data) return; // early exit if no data
  const tbody = document.querySelector('#device-health-table tbody');
  tbody.innerHTML = '';

  Object.keys(data).forEach(type => {
    const { active, inactive } = data[type] || { active: 0, inactive: 0 };
    const total = active + inactive;

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