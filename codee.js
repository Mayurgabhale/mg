/**
 * Helper: build a compact summary HTML for a city
 * - first line: total/offline (e.g. "5/2")
 * - following lines: only present device types (Cameras, Controllers, Servers, Archivers, etc.)
 * - also detects any other device-type strings from device objects (e.g. "CCURE")
 */
function buildCitySummaryHTML(city) {
  const total = city.total || 0;
  // compute offline count from common fields (status/state/online)
  const offline = (city.devicesList || []).reduce((acc, d) => {
    const s = ((d.status || d.state || '') + '').toString().toLowerCase();
    if (s === 'offline' || s === 'down') return acc + 1;
    if (typeof d.online === 'boolean' && d.online === false) return acc + 1;
    return acc;
  }, 0);

  // Start HTML (no 'total' text, just numbers)
  let html = `<div style="font-family: Inter, Roboto, Arial, sans-serif; font-size:13px; line-height:1.25; min-width:140px;">`;
  html += `<div style="font-weight:700; margin-bottom:6px;">${total}/${offline}</div>`;

  // Known device type labels
  const mapLabels = { camera: 'Cameras', controller: 'Controllers', server: 'Servers', archiver: 'Archivers' };
  Object.keys(mapLabels).forEach(key => {
    const cnt = (city.devices && city.devices[key]) || 0;
    if (cnt > 0) {
      html += `<div style="margin-bottom:4px;">${mapLabels[key]} ${cnt}</div>`;
    }
  });

  // Detect additional device-type strings from devicesList (e.g. CCURE, other products)
  // We'll look for common keys that might contain product/type names
  const extraCounts = {};
  (city.devicesList || []).forEach(d => {
    // try a few candidate properties
    const candidates = [d.type, d.deviceType, d.product, d.model, d.name, d.vendor, d.system];
    for (let val of candidates) {
      if (!val) continue;
      const s = ('' + val).trim();
      if (!s) continue;
      const low = s.toLowerCase();
      // ignore generic words that are already counted
      if (low.includes('camera') || low.includes('controller') || low.includes('archiver') || low.includes('server')) {
        continue;
      }
      // count it
      extraCounts[s] = (extraCounts[s] || 0) + 1;
      break;
    }
  });

  // append extras (only if present)
  Object.keys(extraCounts).forEach(name => {
    const cnt = extraCounts[name];
    if (cnt > 0) {
      // Show label as-is (e.g. "CCURE 1")
      html += `<div style="margin-bottom:4px;">${name} ${cnt}</div>`;
    }
  });

  // If nothing else was shown (no devices), show "—" to indicate empty
  if (total === 0) {
    html += `<div style="color:var(--text-secondary, #666);">—</div>`;
  }

  html += `</div>`;
  return html;
}

/**
 * placeCityMarkers: creates city markers and attaches hover + click summary
 * Replaces your previous placeCityMarkers implementation.
 */
function placeCityMarkers() {
  if (!window.cityMarkerLayer) window.cityMarkerLayer = L.layerGroup().addTo(realMap);
  window.cityMarkerLayer.clearLayers();

  CITY_LIST.forEach(c => {
    if (toNum(c.lat) === null || toNum(c.lon) === null) return;

    // City icon with pin only (keeps your existing class)
    const cityIcon = L.divIcon({
      className: 'city-marker',
      html: `<div><span class="pin"><i class="bi bi-geo-alt-fill"></i></span></div>`,
      iconAnchor: [10, 10],
    });

    const marker = L.marker([c.lat, c.lon], { icon: cityIcon });

    // Build summary HTML on demand (keeps memory light)
    const getSummary = () => buildCitySummaryHTML(c);

    // Hover: show compact tooltip (summary only)
    marker.on('mouseover', function () {
      // open a tooltip with summary (no permanent name, plain text)
      marker.bindTooltip(getSummary(), {
        direction: 'top',
        offset: [0, -12],
        opacity: 1,
        permanent: false,
        className: 'city-summary-tooltip' // optional for custom CSS
      }).openTooltip();
    });
    marker.on('mouseout', function () {
      try { marker.closeTooltip(); } catch (e) {}
    });

    // Click: open a popup with same content (keeps it visible)
    marker.on('click', function () {
      marker.bindPopup(getSummary(), { maxWidth: 260 }).openPopup();
    });

    // Add marker to layer
    marker.addTo(window.cityMarkerLayer);
  });

  window.cityMarkerLayer.bringToFront();
}