// ✅ Apply filters
const filtered = safeItems
    .filter((r) => {
        const s = filters.search.toLowerCase();
        if (s) {
            const hay = `${r.first_name ?? ""} ${r.last_name ?? ""} ${r.email ?? ""} ${r.from_location ?? ""} ${r.to_location ?? ""}`.toLowerCase();
            if (!hay.includes(s)) return false;
        }

        // ✅ region-based filter using regionData
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

        // ✅ Show only VIPs if toggle is ON
        if (filters.showVIPOnly && !r.is_vip) return false;

        return true;
    });

// ✅ Remove duplicates only for VIP view (unique by emp_id or email)
let processed = filters.showVIPOnly
    ? Array.from(new Map(filtered.map((r) => [r.emp_id || r.email, r])).values())
    : filtered;

// ✅ Sort so active travelers always appear first
processed = processed.sort((a, b) => {
    if (a.active_now === b.active_now) return 0;
    return a.active_now ? -1 : 1;
});