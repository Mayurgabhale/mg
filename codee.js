{/* 🆕 Region Count Cards */} this card i want clickbale  means 
clikc on APAC than in All Travel Records in this  {activeTab === "overview" && ( ok so how to do this 
 table i want to disply only apac ok 
Global
123
Total Travelers
81 Active
83 VIP
54 Active VIP
🌏
APAC
8
Travelers
8 Active
6 VIP
6 Active VIP
🌍
EMEA
15
Travelers
8 Active
11 VIP
6 Active VIP
🌎
LACA
7
Travelers
4 Active
2 VIP
2 Active VIP
🌎
NAMER
93
Travelers
61 Active
64 VIP
40 Active VIP
{/* 🆕 Region Count Cards */}
                        <div style={styles.regionCardsSection}>

                            <div style={styles.regionCardsGrid}>

                                {/* Total Card */}
                                <div style={styles.regionCard}>
                                    <div style={styles.regionCardHeader}>
                                        <div style={{ ...styles.regionIcon, background: '#3b82f6' }}>
                                            <FiGlobe size={16} />
                                        </div>
                                        <span style={styles.regionName}>Global</span>
                                    </div>

                                    <div style={styles.regionCardStats}>
                                        <span style={styles.regionCount}>{safeItems.length}</span>
                                        <span style={styles.regionLabel}>Total Travelers</span>
                                    </div>

                                    <div style={styles.regionCardActive}>
                                        <div style={styles.activeDot}></div>
                                        <span>{safeItems.filter(r => r.active_now).length} Active</span>
                                        <span style={{ marginLeft: 12, fontWeight: 600 }}>
                                            {safeItems.filter(r => r.is_vip).length} VIP
                                        </span>

                                        {/* ✅ Add this new line for Active VIP count */}
                                        <span style={{ marginLeft: 12, color: '#10b981', fontWeight: 600 }}>
                                            {safeItems.filter(r => r.active_now && r.is_vip).length} Active VIP
                                        </span>
                                    </div>
                                </div>

                                {/* Region Cards */}

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

                            </div>
                        </div>
