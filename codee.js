// ----- ADDITIONS for integration with summary.js -----

/**
 * Wait for the map to be initialized (realMap set by initRealMap()).
 * Resolves immediately if realMap already exists, otherwise polls.
 */
function waitForMapInit(timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    if (window.realMap) return resolve();
    const start = Date.now();
    const iv = setInterval(() => {
      if (window.realMap) {
        clearInterval(iv);
        return resolve();
      }
      if (Date.now() - start > timeoutMs) {
        clearInterval(iv);
        return reject(new Error('waitForMapInit timeout'));
      }
    }, 50);
  });
}

/**
 * Normalize a single device object coming from summary.js so updateMapData
 * can read expected fields (city/location/site, lat, lon, status/online etc).
 * This is lightweight and non-destructive (keeps original properties).
 */
function normalizeSummaryDeviceObject(dev) {
  if (!dev || typeof dev !== 'object') return dev;
  const out = Object.assign({}, dev);

  // common summary fields: ip_address, pc_name, hostname, city, location, site
  out.city = out.city || out.location || out.site || out.city_name || out.city || 'Unknown';

  // lat/lon sometimes named latitude/longitude
  if (out.latitude && out.longitude && (!out.lat || !out.lon)) {
    out.lat = toNum(out.latitude);
    out.lon = toNum(out.longitude);
  } else {
    out.lat = out.lat !== undefined ? toNum(out.lat) : (out.latitude !== undefined ? toNum(out.latitude) : null);
    out.lon = out.lon !== undefined ? toNum(out.lon) : (out.longitude !== undefined ? toNum(out.longitude) : null);
  }

  // status variants
  out.status = (out.status || out.state || out.device_status || '').toString();

  // keep original object intact otherwise
  return out;
}

/**
 * Called by summary.js after it builds the details object.
 * summary.js already contains:
 *   if (typeof window.updateDeviceDetails === 'function') window.updateDeviceDetails(details);
 *
 * We accept either:
 *  - details = { cameras: [...], archivers: [...], controllers: [...], servers: [...] }
 *  - OR any similar shape (we normalize below).
 */
window.updateDeviceDetails = async function (detailsFromSummary) {
  try {
    // Wait until map initialized
    await waitForMapInit().catch(() => {
      console.warn('Map was not initialized within timeout — attempting to continue anyway.');
    });

    if (!detailsFromSummary || typeof detailsFromSummary !== 'object') {
      console.warn('updateDeviceDetails called without details object', detailsFromSummary);
      return;
    }

    // Build a shallow copy and normalize each device entry
    const normalized = {};
    Object.keys(detailsFromSummary).forEach(k => {
      const arr = Array.isArray(detailsFromSummary[k]) ? detailsFromSummary[k] : [];
      normalized[k] = arr.map(normalizeSummaryDeviceObject);
    });

    // If the summary code stores details under .details, accept that shape too
    // We'll call updateMapData with the normalized object directly.
    // updateMapData expects the second param to be either details or { details: ... } — both work.
    // Pass region summary if available in window.regionSummary (summary.js sets it).
    const summaryObj = window.regionSummary || null;

    // Call the map's update function (it will process arrays where key names include 'camera','server', etc.)
    updateMapData(summaryObj, normalized);

    // also ensure console trace for debugging
    console.log('[map] updateDeviceDetails -> updateMapData invoked with normalized keys:', Object.keys(normalized));
  } catch (err) {
    console.error('Error in window.updateDeviceDetails:', err);
  }
};

// ----- CLEANUP DOMContentLoaded duplication & safer UI hooks -----

// Remove duplicate in your original file — keep a single DOMContentLoaded handler like this:
document.addEventListener('DOMContentLoaded', () => {
  // initialize map (if not already)
  if (!window.realMap) initRealMap();

  // show any markers if already present
  if (typeof placeCityMarkers === 'function') placeCityMarkers();

  // safe hookup helper
  function setOnClick(id, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
  }

  setOnClick("toggle-heat", toggleHeat);
  setOnClick("fit-all", fitAllCities);
  setOnClick("show-global", populateGlobalCityList);

  // safe fullscreen button hookup (element may be missing)
  const fullscreenBtnEl = document.getElementById("mapFullscreenBtn");
  const mapCard = document.querySelector(".worldmap-card");
  if (fullscreenBtnEl && mapCard) {
    let isFullscreen = false;
    fullscreenBtnEl.addEventListener("click", () => {
      isFullscreen = !isFullscreen;
      if (isFullscreen) {
        mapCard.classList.add("fullscreen");
        document.body.classList.add("map-fullscreen-active");
        fullscreenBtnEl.innerText = "✖ Exit Full";
      } else {
        mapCard.classList.remove("fullscreen");
        document.body.classList.remove("map-fullscreen-active");
        fullscreenBtnEl.innerText = "⛶ View Full";
      }
      setTimeout(() => { if (window.realMap) realMap.invalidateSize(true); }, 300);
    });
  }

  // mapCityOverview button safe hookup
  const cityOverviewBtn = document.getElementById("mapCityOverviewBtn");
  if (cityOverviewBtn) {
    cityOverviewBtn.addEventListener("click", function () {
      const panel = document.getElementById("region-panel");
      if (!panel) return;
      panel.style.display = (panel.style.display === "block") ? "none" : "block";
    });
  }

  // Expose updateMapData if needed elsewhere (already done previously)
  window.updateMapData = updateMapData;
});