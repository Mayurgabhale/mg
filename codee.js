function createCityMarker(cityStats, extraDetail) {

  // ✅ calculate offline total correctly
  const offlineTotal =
    (cityStats.offline?.camera || 0) +
    (cityStats.offline?.controller || 0) +
    (cityStats.offline?.archiver || 0) +
    (cityStats.offline?.server || 0);

  const labelHTML = `
    <div class="city-pin">
      <i class="bi bi-geo-alt-fill"></i>
      <div class="city-count">${cityStats.total}</div>
    </div>`;

  const icon = L.divIcon({
    className: "city-marker",
    html: labelHTML,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  const lat = cityStats.lat, lon = cityStats.lon;
  const marker = L.marker([lat, lon], { icon });

  const off = extraDetail?.offline || {
    camera: 0, controller: 0, archiver: 0, server: 0
  };

  const risk = extraDetail?.risk || "Low";

  // ✅ TOOLTIP FIXED
  const tooltip = `
    <div style="min-width:220px">
      <strong>${cityStats.city}</strong><br/>
      Total: ${cityStats.total}<br/>
      Online: ${cityStats.online} | Offline: ${offlineTotal}<br/><br/>

      Cameras: ${cityStats.counts.camera} (Offline ${off.camera})<br/>
      Archivers: ${cityStats.counts.archiver} (Offline ${off.archiver})<br/>
      Controllers: ${cityStats.counts.controller} (Offline ${off.controller})<br/>
      Servers: ${cityStats.counts.server} (Offline ${off.server})<br/>

      <hr style="margin:6px 0"/>
      Risk: ${risk}
    </div>
  `;

  marker.bindTooltip(tooltip, {
    sticky: true,
    direction: "top",
    opacity: 0.95,
    className: "city-tooltip"
  });

  marker.bindPopup(tooltip, { maxWidth: 320 });

  return marker;
}