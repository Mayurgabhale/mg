function buildCitySummaryHTML(city) {
  const total = city.total || 0;

  // compute offline count
  const offline = (city.devicesList || []).reduce((acc, d) => {
    const s = ((d.status || d.state || '') + '').toLowerCase();
    if (s === 'offline' || s === 'down') return acc + 1;
    if (d.online === false) return acc + 1;
    return acc;
  }, 0);

  // ICONS (your icons)
  const ICONS = {
    camera: `<i class="bi bi-camera legend-box"></i>`,
    controller: `<i class="bi bi-hdd"></i>`,
    server: `<i class="fa-duotone fa-solid fa-server"></i>`,
    archiver: `<i class="fas fa-database"></i>`
  };

  let html = `
    <div style="font-family: Inter, Roboto, Arial, sans-serif; font-size:13px; min-width:150px;">
      <div style="font-weight:700; margin-bottom:6px; font-size:14px;">
        ${city.city}
      </div>

      <div style="font-weight:600; margin-bottom:8px;">
        ${total}/<span style="color:#ff4d4d;">${offline}</span>
      </div>
  `;

  // Known device types (with icons)
  const mapList = ["camera", "controller", "server", "archiver"];

  mapList.forEach(type => {
    const count = city.devices?.[type] || 0;
    if (count > 0) {
      html += `
        <div style="margin-bottom:4px; display:flex; align-items:center; gap:6px;">
          ${ICONS[type]} <span>${count}</span>
        </div>
      `;
    }
  });

  // Detect extra types (e.g. CCURE)
  const extraCounts = {};
  (city.devicesList || []).forEach(d => {
    const candidates = [d.type, d.product, d.deviceType, d.model];
    for (let v of candidates) {
      if (!v) continue;
      const name = String(v).trim();
      if (!name) continue;

      const low = name.toLowerCase();
      if (low.includes("camera") || low.includes("server") || low.includes("controller") || low.includes("archiver"))
        continue;

      extraCounts[name] = (extraCounts[name] || 0) + 1;
      break;
    }
  });

  Object.keys(extraCounts).forEach(key => {
    html += `
      <div style="margin-bottom:4px;">
        ${key} ${extraCounts[key]}
      </div>
    `;
  });

  html += `</div>`;
  return html;
}



.city-summary-tooltip {
  background: rgba(0,0,0,0.85) !important;
  color: #fff !important;
  border: none !important;
  padding: 10px 12px !important;
  border-radius: 6px !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.35) !important;
  font-size: 13px !important;
  line-height: 1.25 !important;
}