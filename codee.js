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

        // ✅ VIP toggle
        if (filters.showVIPOnly && !r.is_vip) return false;

        return true;
    })
    // ✅ Sort: Active travelers first
    .sort((a, b) => (b.active_now === true) - (a.active_now === true));

// ✅ If VIP filter is on → remove duplicates (unique VIPs by emp_id or email)
const uniqueFiltered = filters.showVIPOnly
    ? Array.from(
          new Map(filtered.map((item) => [item.emp_id || item.email, item])).values()
      )
    : filtered;