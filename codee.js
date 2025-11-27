const mapList = ["camera", "controller", "server", "archiver"];
mapList.forEach(type => {
  const count = city.devices?.[type] || 0;
  const off = city.offline?.[type] || 0;
  if (count > 0) {
    html += `<div style="margin-bottom:4px; display:flex; align-items:center; gap:6px; font-size:10px;">
               ${ICONS[type]} <span>${count}</span>
               ${off ? `<span style="color:#ff3b3b; margin-left:6px">(${off} offline)</span>` : ''}
             </div>`;
  }
});