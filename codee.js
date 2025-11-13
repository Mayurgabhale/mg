onClick={() => handleRegionSelect(regionCode)}

... 

const handleRegionSelect = (regionCode) => {
    setSelectedRegion(regionCode);

    // Optional: Fetch region details if needed
    fetchRegionDetails(regionCode);

    // ✅ Update filters to only show that region's records
    setFilters(prev => ({
        ...prev,
        region: regionCode
    }));
};




....
const filtered = safeItems.filter((r) => {
    const s = filters.search.toLowerCase();
    if (s) {
        const hay = `${r.first_name ?? ""} ${r.last_name ?? ""} ${r.email ?? ""} ${r.from_location ?? ""} ${r.to_location ?? ""}`.toLowerCase();
        if (!hay.includes(s)) return false;
    }

    if (filters.region && r.region !== filters.region) return false; // ✅ new line
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



...

{filters.region && (
  <button 
    onClick={() => setFilters(prev => ({ ...prev, region: "" }))}
    style={{ marginLeft: "10px", color: "#3b82f6", cursor: "pointer" }}
  >
    Clear Region
  </button>
)}