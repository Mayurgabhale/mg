const [regionData, setRegionData] = useState({});

useEffect(() => {
  fetch("http://127.0.0.1:8000/daily_sheet/regions")
    .then(res => res.json())
    .then(data => setRegionData(data.regions || {}))
    .catch(err => console.error("Failed to load region data", err));
}, []);



....
const handleRegionSelect = (regionCode) => {
  setSelectedRegion(regionCode);
  setFilters(prev => ({ ...prev, region: regionCode }));
};



....
const filtered = safeItems.filter((r) => {
  const s = filters.search.toLowerCase();
  if (s) {
    const hay = `${r.first_name ?? ""} ${r.last_name ?? ""} ${r.email ?? ""} ${r.from_location ?? ""} ${r.to_location ?? ""}`.toLowerCase();
    if (!hay.includes(s)) return false;
  }

  // ✅ NEW: region-based filter
  if (filters.region && regionData[filters.region]) {
    const citiesInRegion = Object.keys(regionData[filters.region].cities);
    const matchCity = citiesInRegion.some(city =>
      (r.from_location && r.from_location.toLowerCase().includes(city.toLowerCase())) ||
      (r.to_location && r.to_location.toLowerCase().includes(city.toLowerCase()))
    );
    if (!matchCity) return false;
  }

  if (filters.country && r.from_country !== filters.country) return false;
  if (filters.location) {
    const fromMatch = r.from_location?.toLowerCase().includes(filters.location.toLowerCase());
    const toMatch = r.to_location?.toLowerCase().includes(filters.location.toLowerCase());
    if (!fromMatch && !toMatch) return false;
  }
  if (filters.legType && r.leg_type !== filters.legType) return false;
  if (filters.status === "active" && !r.active_now) return false;
  if (filters.status === "inactive" && r.active_now) return false;
  if (filters.showVIPOnly && !r.is_vip) return false;

  return true;
});







....
<h3 style={styles.tableTitle}>
  {filters.region ? `${filters.region} Travel Records` : "All Travel Records"}
</h3>
{filters.region && (
  <button
    onClick={() => setFilters(prev => ({ ...prev, region: "" }))}
    style={{ marginLeft: "10px", color: "#3b82f6", cursor: "pointer" }}
  >
    Clear Region
  </button>
)}