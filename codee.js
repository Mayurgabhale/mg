// Counts ALL devices per city (not only offline). Expects combinedDevices = [{ device: {...} }, ...]
function buildOfflineCityBarData(combinedDevices = []) {
  const cityCounts = {};

  if (!Array.isArray(combinedDevices)) return { labels: [], values: [] };

  combinedDevices.forEach(entry => {
    if (!entry || !entry.device) return;

    // Count every device regardless of status
    const city = (entry.device.city || "Unknown").toString();

    cityCounts[city] = (cityCounts[city] || 0) + 1;
  });

  // Sort by count descending (useful for charts)
  const entries = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);

  const labels = entries.map(e => e[0]);
  const values = entries.map(e => e[1]);

  return { labels, values };
}