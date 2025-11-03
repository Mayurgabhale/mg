i want to combine this 
    i measn <th style={styles.th}>From Location</th>
<th style={styles.th}>From Country</th>
        this in one  ok 
<th style={styles.th}>From Location</th>
<th style={styles.th}>From Country</th>
    
                                            <th style={styles.th}>To Location</th>
                                            <th style={styles.th}>To Country</th>

                    {/* Dynamic Content based on Active Tab */}
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
                                            <th style={styles.th}>From Location</th>
                                            <th style={styles.th}>From Country</th>
                                            <th style={styles.th}>To Location</th>
                                            <th style={styles.th}>To Country</th>
                                            <th style={styles.th}>Start Date</th>
                                            <th style={styles.th}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan="11" style={styles.emptyRow}>
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
                                                        <div style={styles.locationCell}>
                                                            <FiMapPin size={12} style={{ marginRight: '4px', color: '#ef4444' }} />
                                                            {r.from_location || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.countryCell}>
                                                            <FiGlobe size={12} style={{ marginRight: '4px', color: '#3b82f6' }} />
                                                            {r.from_country || 'Unknown'}
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.locationCell}>
                                                            <FiMapPin size={12} style={{ marginRight: '4px', color: '#10b981' }} />
                                                            {r.to_location || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.countryCell}>
                                                            <FiGlobe size={12} style={{ marginRight: '4px', color: '#3b82f6' }} />
                                                            {r.to_country || 'Unknown'}
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.dateCell}>
                                                            <FiCalendar size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
                                                            {fmt(r.begin_dt)}
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
