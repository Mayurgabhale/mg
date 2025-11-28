// call map update with correct args (summary computed, details from outer `data`)
if (typeof window.updateMapData === 'function') {
  try {
    window.updateMapData(summary, data.details);
  } catch (err) {
    console.warn("updateMapData failed:", err);
  }
}