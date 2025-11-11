All Travel Records
i want to first show active then other ok 
Active
TYLER BROWN
245218
tyler.brown@wu.com
CAR	
Denver, Colorado
United States
Denver, Colorado
United States
10/15/2025 6:49:00 PM
11/14/2025 2:00:00 PM
View
Active
SHARI GALE
326280
shari.gale@westernunion.com
CAR	
Denver, Colorado
United States
Denver, Colorado
United States
10/10/2025 2:00:00 PM
12/8/2025 4:00:00 PM

Inactive
MARIE-ANDREE LEGAULT
326779
marieandree.legault@westernunion.com
STOP	
Guatemala City
Guatemala
Guatemala City
Guatemala
10/27/2025 4:25:00 PM
10/31/2025 12:28:00 PM
View
Inactive
BRAYAM GARCIA
248858
brayam.garcia@westernunion.com
HOTEL	
Singapore City
Singapore
Singapore City
Singapore
10/26/2025 12:00:00 AM
11/1/2025 12:00:00 AM
 ok 
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
                                                            {fmt(r.begin_date)}
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.dateCell}>
                                                            <FiCalendar size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
                                                            {fmt(r.end_date)}
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
