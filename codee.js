read belwo code and whret ot add above code 
    // ✅ Apply filters
    const filtered = safeItems
        .filter((r) => {
            const s = filters.search.toLowerCase();
            if (s) {
                const hay = `${r.first_name ?? ""} ${r.last_name ?? ""} ${r.email ?? ""} ${r.from_location ?? ""} ${r.to_location ?? ""}`.toLowerCase();
                if (!hay.includes(s)) return false;
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



{/* Region Cards */}
                                {Object.entries(regionsData || {})
                                    .sort(([a], [b]) => {
                                        if (a === 'GLOBAL') return -1;
                                        if (b === 'GLOBAL') return 1;
                                        return a.localeCompare(b);
                                    })
                                    .map(([regionCode, regionData]) => (
                                        <div
                                            key={regionCode}
                                            onClick={() => setSelectedRegion(regionCode)}  // ✅ make clickable
                                            style={{
                                                ...styles.regionCard,
                                                ...(filters.region === regionCode && styles.regionCardActive),
                                            }}
                                        >
                                            <div style={styles.regionCardHeader}>
                                                <div
                                                    style={{
                                                        ...styles.regionIcon,
                                                        background: getRegionColor(regionCode),
                                                    }}
                                                >
                                                    {getRegionIcon(regionCode)}
                                                </div>
                                                <span style={styles.regionName}>{regionCode}</span>
                                            </div>

                                            <div style={styles.regionCardStats}>
                                                <span style={styles.regionCount}>{regionData.total_count ?? 0}</span>
                                                <span style={styles.regionLabel}>Travelers</span>
                                            </div>

                                            <div style={styles.regionCardActive}>
                                                <div
                                                    style={{
                                                        ...styles.activeDot,
                                                        background:
                                                            (regionData.active_count ?? 0) > 0 ? '#10b981' : '#6b7280',
                                                    }}
                                                ></div>

                                                <span>{regionData.active_count ?? 0} Active</span>

                                                <span style={{ marginLeft: 12, fontWeight: 600 }}>
                                                    {regionData.vip_count ?? 0} VIP
                                                </span>

                                                {/* ✅ New Active VIP count */}
                                                <span style={{ marginLeft: 12, color: '#10b981', fontWeight: 600 }}>
                                                    {regionData.active_vip_count ?? 0} Active VIP
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                            </div>
                        </div>
                        {/* 📝📝📝📝📝 */}

{activeTab === "overview" && (
                                <div style={styles.card}>
                                    <div style={styles.tableHeader}>
                                        <h3 style={styles.tableTitle}>All Travel Records</h3>
                                        <span style={styles.tableBadge}>{filtered.length} records</span>
                                    </div>
                                    <div style={styles.tableWrap}>
                                        <table style={styles.table}>
                                            <thead style={styles.thead}>
                                                <tr>
                                                    <th style={styles.th}>Status</th>
                                                    <th style={styles.th}>Traveler</th>
                                                    <th style={styles.th}>Emp ID</th>
                                                    <th style={styles.th}>Email</th>
                                                    <th style={styles.th}>Type</th>
                                                    <th style={styles.th}>From</th>
                                                    <th style={styles.th}>To</th>
                                                    <th style={styles.th}>Start Date</th>
                                                    <th style={styles.th}>End Date</th>
                                                    <th style={styles.th}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filtered.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="9" style={styles.emptyRow}>
                                                            <div style={styles.emptyState}>
                                                                <FiFileText size={32} style={{ color: '#9ca3af', marginBottom: '12px' }} />
                                                                <p>No matching results found</p>
                                                                <p style={styles.emptySubtext}>Upload a file or adjust your filters</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filtered.map((r, i) => (
                                                        <tr key={i} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                                                            <td style={styles.td}>
                                                                {r.active_now ? (
                                                                    <div style={styles.activeBadge}>
                                                                        <FiCheckCircle size={14} />
                                                                        Active
                                                                    </div>
                                                                ) : (
                                                                    <div style={styles.inactiveBadge}>
                                                                        <FiXCircle size={14} />
                                                                        Inactive
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td style={styles.td}>
                                                                <div style={styles.userCell}>
                                                                    <div style={styles.avatar}>
                                                                        <FiUser size={14} />
                                                                    </div>
                                                                    <span>
                                                                        {r.first_name} {r.last_name}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <div style={styles.userCell}>
                                                                    <span style={styles.empId}>
                                                                        {r.emp_id || 'N/A'}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <div style={styles.emailCell}>
                                                                    <FiMail size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
                                                                    {r.email}
                                                                </div>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <span style={styles.typeBadge}>{r.leg_type}</span>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <div style={styles.combinedLocationCell}>
                                                                    <div style={styles.locationRow}>
                                                                        <FiMapPin size={12} style={{ marginRight: '4px', color: '#ef4444' }} />
                                                                        <span style={styles.locationText}>
                                                                            {r.from_location || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                    <div style={styles.countryRow}>
                                                                        <FiGlobe size={10} style={{ marginRight: '4px', color: '#3b82f6' }} />
                                                                        <span style={styles.countryText}>
                                                                            {r.from_country || 'Unknown'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <div style={styles.combinedLocationCell}>
                                                                    <div style={styles.locationRow}>
                                                                        <FiMapPin size={12} style={{ marginRight: '4px', color: '#10b981' }} />
                                                                        <span style={styles.locationText}>
                                                                            {r.to_location || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                    <div style={styles.countryRow}>
                                                                        <FiGlobe size={10} style={{ marginRight: '4px', color: '#3b82f6' }} />
                                                                        <span style={styles.countryText}>
                                                                            {r.to_country || 'Unknown'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <div style={styles.dateCell}>
                                                                    <FiCalendar size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
                                                                    {fmt(r.begin_dt)}
                                                                </div>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <div style={styles.dateCell}>
                                                                    <FiCalendar size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
                                                                    {fmt(r.end_dt)}
                                                                </div>
                                                            </td>
                                                            <td style={styles.td}>
                                                                <button
                                                                    onClick={() => setSelectedTraveler(r)}
                                                                    style={styles.viewButton}
                                                                >
                                                                    <FiEye size={14} />
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
