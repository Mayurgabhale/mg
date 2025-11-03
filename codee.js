const filtered = safeItems
    .filter((r) => {
        const s = filters.search.toLowerCase();
        if (s) {
            const hay = `${r.first_name ?? ""} ${r.last_name ?? ""} ${r.email ?? ""} ${r.from_location ?? ""} ${r.to_location ?? ""}`.toLowerCase();
            if (!hay.includes(s)) return false;
        }
        if (filters.country && r.from_country !== filters.country) return false;
        if (filters.location) {
            const fromLocationMatch = r.from_location && r.from_location.toLowerCase().includes(filters.location.toLowerCase());
            const toLocationMatch = r.to_location && r.to_location.toLowerCase().includes(filters.location.toLowerCase());
            if (!fromLocationMatch && !toLocationMatch) return false;
        }
        if (filters.legType && r.leg_type !== filters.legType) return false;
        if (filters.status === "active" && !r.active_now) return false;
        if (filters.status === "inactive" && r.active_now) return false;
        return true;
    })
    .sort((a, b) => (b.active_now === true) - (a.active_now === true));