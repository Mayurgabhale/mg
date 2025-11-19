function drawCityHighlight(cityObj) {
  const { city, lat, lon } = cityObj;

  // offset point slightly to place the label
  const labelLat = lat + 2.5;
  const labelLon = lon + 3;

  // 1. Draw dotted connection line
  const dotted = L.polyline(
    [
      [lat, lon],
      [labelLat, labelLon]
    ],
    {
      className: "city-dotted-path"
    }
  ).addTo(realMap);

  // 2. Create label box
  const devs = STATIC_DEVICES.filter(d => d.city === city);
  const total = devs.length;
  const online = devs.filter(d => d.status === "online").length;
  const inactive = total - online;

  const html = `
    <div class="city-label-box">
      <b>${city}</b><br>
      TOTAL: ${total}<br>
      ACTIVE: ${online}<br>
      INACTIVE: ${inactive}
    </div>
  `;

  L.marker([labelLat, labelLon], {
    icon: L.divIcon({
      html,
      className: "",
      iconAnchor: [0, 0]
    })
  }).addTo(realMap);
}






.city-label-box {
  background: rgba(0,0,0,0.75);
  padding: 6px 10px;
  border-radius: 6px;
  color: #00ff99;
  font-size: 13px;
  border: 1px solid #00ff99;
  box-shadow: 0 0 8px rgba(0,255,120,0.5);
}

.city-dotted-path {
  color: #ffaa00;
  weight: 2;
  dashArray: "4 6";
}