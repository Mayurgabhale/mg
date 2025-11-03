i want to use alos this.. 
"from_location": "Buenos Aires, Ciudad de Buenos Aires",
    
      "to_location": "Buenos Aires, Ciudad de Buenos Aires",

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
                                            <th style={styles.th}>Emp Id</th>
                                            <th style={styles.th}>Email</th>
                                            <th style={styles.th}>Type</th>
                                            <th style={styles.th}>From</th>
                                            <th style={styles.th}>To</th>
                                            <th style={styles.th}>Start Date</th>
                                            <th style={styles.th}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" style={styles.emptyRow}>
                                                    <div style={styles.emptyState}>
                                                        <FiFileText size={32} style={{ color: '#9ca3af', marginBottom: '12px' }} />
                                                        <p>No matching results found</p>
                                                        <p style={styles.emptySubtext}>Upload a file or adjust your filters</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filtered.map((r, i) => (
                                                <tr key={i} style={i % 2 === 0 ? rowEven : rowOdd}>
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
                                                           
                                                            <span>
                                                                 {r.emp_id} 
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
                                                    <td style={styles.td}>{r.from_country}</td>
                                                    <td style={styles.td}>{r.to_country}</td>
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
// 🆕 Enhanced Traveler Detail Popup Component
const TravelerDetailPopup = ({ traveler, onClose }) => {
    if (!traveler) return null;

    const TravelTypeIcon = getTravelTypeIcon(traveler.leg_type);
    const travelTypeColor = getTravelTypeColor(traveler.leg_type);

    return (
        <div style={styles.popupOverlay}>
            <div style={styles.popupContent}>
                <div style={styles.popupHeader}>
                    <div style={styles.popupHeaderLeft}>
                        <div style={styles.avatarLarge}>
                            <FiUser size={24} />
                        </div>
                        <div>
                            <h3 style={styles.popupTitle}>
                                {traveler.first_name} {traveler.last_name}
                            </h3>
                            <p style={styles.employeeId}>ID: {traveler.emp_id || 'N/A'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={styles.popupCloseBtn}>
                        <FiX size={20} />
                    </button>
                </div>

                <div style={styles.popupBody}>
                    {/* Status & Travel Type Banner */}
                    <div style={styles.bannerSection}>
                        <div style={{
                            ...styles.statusBadge,
                            ...(traveler.active_now ? styles.activeStatus : styles.inactiveStatus)
                        }}>
                            <div style={styles.statusDot}></div>
                            {traveler.active_now ? "Currently Traveling" : "Travel Completed"}
                        </div>
                        <div style={{
                            ...styles.travelTypeBadge,
                            background: `${travelTypeColor}15`,
                            border: `1px solid ${travelTypeColor}30`,
                            color: travelTypeColor
                        }}>
                            <TravelTypeIcon size={16} style={{ marginRight: '6px' }} />
                            {traveler.leg_type || 'Unknown Type'}
                        </div>
                    </div>

                    <div style={styles.detailGrid}>
                        {/* Personal Information */}
                        <div style={styles.detailGroup}>
                            <h4 style={styles.detailGroupTitle}>
                                <FiUser style={styles.detailGroupIcon} />
                                Personal Information
                            </h4>
                            <div style={styles.detailItems}>
                                <div style={styles.detailItem}>
                                    <strong style={styles.detailLabel}>Employee ID</strong>
                                    <span style={styles.detailValue}>{traveler.emp_id || 'Not Provided'}</span>
                                </div>
                                <div style={styles.detailItem}>
                                    <strong style={styles.detailLabel}>Full Name</strong>
                                    <span style={styles.detailValue}>{traveler.first_name} {traveler.last_name}</span>
                                </div>
                                <div style={styles.detailItem}>
                                    <strong style={styles.detailLabel}>Email</strong>
                                    <span style={styles.detailValue}>
                                        <FiMail size={14} style={{ marginRight: '6px' }} />
                                        {traveler.email || 'Not Provided'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Travel Information */}
                        <div style={styles.detailGroup}>
                            <h4 style={styles.detailGroupTitle}>
                                <FiGlobe style={styles.detailGroupIcon} />
                                Travel Information
                            </h4>
                            <div style={styles.detailItems}>
                                <div style={styles.detailItem}>
                                    <strong style={styles.detailLabel}>From Country</strong>
                                    <span style={styles.detailValue}>
                                        <FiMapPin size={14} style={{ marginRight: '6px', color: '#ef4444' }} />
                                        {traveler.from_country || 'Unknown'}
                                    </span>
                                </div>
                                <div style={styles.detailItem}>
                                    <strong style={styles.detailLabel}>To Country</strong>
                                    <span style={styles.detailValue}>
                                        <FiMapPin size={14} style={{ marginRight: '6px', color: '#10b981' }} />
                                        {traveler.to_country || 'Unknown'}
                                    </span>
                                </div>
                                <div style={styles.detailItem}>
                                    <strong style={styles.detailLabel}>Travel Type</strong>
                                    <span style={{
                                        ...styles.travelTypeDisplay,
                                        color: travelTypeColor
                                    }}>
                                        <TravelTypeIcon size={16} style={{ marginRight: '6px' }} />
                                        {traveler.leg_type || 'Unknown'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Information */}
                        <div style={styles.detailGroup}>
                            <h4 style={styles.detailGroupTitle}>
                                <FiCalendar style={styles.detailGroupIcon} />
                                Travel Timeline
                            </h4>
                            <div style={styles.detailItems}>
                                <div style={styles.detailItem}>
                                    <strong style={styles.detailLabel}>Start Date</strong>
                                    <span style={styles.detailValue}>
                                        <FiClock size={14} style={{ marginRight: '6px' }} />
                                        {fmt(traveler.begin_dt) || 'Not Set'}
                                    </span>
                                </div>
                                <div style={styles.detailItem}>
                                    <strong style={styles.detailLabel}>End Date</strong>
                                    <span style={styles.detailValue}>
                                        <FiClock size={14} style={{ marginRight: '6px' }} />
                                        {fmt(traveler.end_dt) || 'Not Set'}
                                    </span>
                                </div>
                                <div style={styles.detailItem}>
                                    <strong style={styles.detailLabel}>Duration</strong>
                                    <span style={styles.detailValue}>
                                        {traveler.begin_dt && traveler.end_dt ? 
                                            `${Math.ceil((new Date(traveler.end_dt) - new Date(traveler.begin_dt)) / (1000 * 60 * 60 * 24))} days` : 
                                            'Unknown'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div style={styles.detailGroup}>
                            <h4 style={styles.detailGroupTitle}>
                                <FiAward style={styles.detailGroupIcon} />
                                Additional Details
                            </h4>
                            <div style={styles.detailItems}>
                                <div style={styles.detailItem}>
                                    <strong style={styles.detailLabel}>Status</strong>
                                    <span style={{
                                        ...styles.statusIndicator,
                                        ...(traveler.active_now ? styles.activeIndicator : styles.inactiveIndicator)
                                    }}>
                                        {traveler.active_now ? 'Active' : 'Completed'}
                                    </span>
                                </div>
                                <div style={styles.detailItem}>
                                    <strong style={styles.detailLabel}>Last Updated</strong>
                                    <span style={styles.detailValue}>
                                        {new Date().toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
