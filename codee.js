// ------------------------
// Regions: fetch + details
// ------------------------

// Fetch summary for all regions from backend
const fetchRegionsData = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/daily_sheet/regions");
    if (!res.ok) throw new Error("Failed to fetch regions");
    const payload = await res.json();
    // backend returns { regions: { ... } }
    setRegionsData(payload.regions || {});
  } catch (err) {
    console.error("Failed to fetch regions data:", err);
    toast.error("Failed to load region summary");
  }
};

// Fetch detail for a single region and show details view
const fetchRegionDetails = async (regionCode) => {
  try {
    // optional: optimistic UI set so card looks selected immediately
    setSelectedRegion(regionCode);
    setRegionDetails(null); // clear old details while loading

    const res = await fetch(`http://127.0.0.1:8000/daily_sheet/regions/${encodeURIComponent(regionCode)}`);
    if (!res.ok) {
      // revert selection if fetch fails
      setSelectedRegion(null);
      throw new Error(`Failed to fetch details for ${regionCode}`);
    }
    const payload = await res.json();
    // payload is the region object (region_code, total_count, cities, ...)
    setRegionDetails(payload || {});
  } catch (err) {
    console.error("Error fetching region details:", err);
    toast.error(`Failed to load details for ${regionCode}`);
    setSelectedRegion(null);
    setRegionDetails(null);
  }
};