
this pop up table UI i want in clean laoyout. right know i correct but not atractive ok 
do this more  atracib
and litin dont change this const TravelerDetailPopup 
const TravelerDetailPopup = ({ traveler, onClose }) => {
        if (!traveler) return null;

        const TravelTypeIcon = getTravelTypeIcon(traveler.leg_type);
        const travelTypeColor = getTravelTypeColor(traveler.leg_type);

        // Calculate duration
        const getDuration = () => {
            if (!traveler.begin_dt || !traveler.end_dt) return 'Unknown';
            const start = new Date(traveler.begin_dt);
            const end = new Date(traveler.end_dt);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            return `${days} day${days !== 1 ? 's' : ''}`;
        };

        return (
            <div style={styles.popupOverlay}>
                <div style={styles.popupContent}>
                    {/* Header */}
                    <div style={styles.popupHeader}>
                        <div style={styles.headerContent}>
                            <div style={styles.avatarSection}>
                                <div style={styles.avatarLarge}>
                                    <FiUser size={24} />
                                </div>
                            </div>
                            <div style={styles.headerInfo}>
                                <h3 style={styles.popupTitle}>
                                    {traveler.first_name} {traveler.last_name}
                                </h3>
                                <p style={styles.employeeId}>Employee ID: {traveler.emp_id || 'N/A'}</p>
                            </div>
                        </div>
                        <button onClick={onClose} style={styles.popupCloseBtn}>
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div style={styles.popupBody}>
                        {/* Status Banner */}
                        <div style={styles.statusBanner}>
                            <div style={{
                                ...styles.statusBadge,
                                ...(traveler.active_now ? styles.activeStatus : styles.inactiveStatus)
                            }}>
                                <div style={{
                                    ...styles.statusDot,
                                    ...(traveler.active_now ? styles.activeDot : styles.inactiveDot)
                                }}></div>
                                {traveler.active_now ? "Currently Traveling" : "Travel Completed"}
                            </div>

                            <div style={{
                                ...styles.travelTypeBadge,
                                background: `${travelTypeColor}15`,
                                border: `1px solid ${travelTypeColor}30`,
                                color: travelTypeColor
                            }}>
                                <TravelTypeIcon size={16} />
                                <span style={styles.travelTypeText}>
                                    {traveler.leg_type || 'Unknown Type'}
                                </span>
                            </div>
                        </div>

                        {/* Details Container */}
                        <div style={styles.detailsContainer}>
                            {/* Personal Info */}
                            <div style={styles.detailSection}>
                                <div style={styles.sectionHeader}>
                                    <FiUser style={styles.sectionIcon} />
                                    <h4 style={styles.sectionTitle}>Personal Information</h4>
                                </div>
                                <div style={styles.detailList}>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Employee ID</span>
                                        <span style={styles.detailValue}>{traveler.emp_id || 'Not Provided'}</span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Full Name</span>
                                        <span style={styles.detailValue}>{traveler.first_name} {traveler.last_name}</span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Email</span>
                                        <span style={styles.detailValue}>
                                            <FiMail size={14} style={styles.inlineIcon} />
                                            {traveler.email || 'Not Provided'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Travel Info - From */}
                            <div style={styles.detailSection}>
                                <div style={styles.sectionHeader}>
                                    <FiMapPin style={{ ...styles.sectionIcon, color: '#ef4444' }} />
                                    <h4 style={styles.sectionTitle}>Departure Details</h4>
                                </div>
                                <div style={styles.detailList}>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>From Location</span>
                                        <span style={styles.detailValue}>
                                            <FiMapPin size={14} style={{ ...styles.inlineIcon, color: '#ef4444' }} />
                                            {traveler.from_location || 'Not specified'}
                                        </span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>From Country</span>
                                        <span style={styles.detailValue}>
                                            <FiGlobe size={14} style={{ ...styles.inlineIcon, color: '#3b82f6' }} />
                                            {traveler.from_country || 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Travel Info - To */}
                            <div style={styles.detailSection}>
                                <div style={styles.sectionHeader}>
                                    <FiMapPin style={{ ...styles.sectionIcon, color: '#10b981' }} />
                                    <h4 style={styles.sectionTitle}>Destination Details</h4>
                                </div>
                                <div style={styles.detailList}>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>To Location</span>
                                        <span style={styles.detailValue}>
                                            <FiMapPin size={14} style={{ ...styles.inlineIcon, color: '#10b981' }} />
                                            {traveler.to_location || 'Not specified'}
                                        </span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>To Country</span>
                                        <span style={styles.detailValue}>
                                            <FiGlobe size={14} style={{ ...styles.inlineIcon, color: '#3b82f6' }} />
                                            {traveler.to_country || 'Unknown'}
                                        </span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Travel Type</span>
                                        <span style={{
                                            ...styles.detailValue,
                                            color: travelTypeColor,
                                            fontWeight: '600'
                                        }}>
                                            <TravelTypeIcon size={14} style={styles.inlineIcon} />
                                            {traveler.leg_type || 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div style={styles.detailSection}>
                                <div style={styles.sectionHeader}>
                                    <FiCalendar style={styles.sectionIcon} />
                                    <h4 style={styles.sectionTitle}>Travel Timeline</h4>
                                </div>
                                <div style={styles.detailList}>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Start Date</span>
                                        <span style={styles.detailValue}>
                                            <FiClock size={14} style={styles.inlineIcon} />
                                            {fmt(traveler.begin_dt) || 'Not Set'}
                                        </span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>End Date</span>
                                        <span style={styles.detailValue}>
                                            <FiClock size={14} style={styles.inlineIcon} />
                                            {fmt(traveler.end_dt) || 'Not Set'}
                                        </span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Duration</span>
                                        <span style={styles.detailValue}>
                                            {getDuration()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div style={styles.detailSection}>
                                <div style={styles.sectionHeader}>
                                    <FiAward style={styles.sectionIcon} />
                                    <h4 style={styles.sectionTitle}>Additional Details</h4>
                                </div>
                                <div style={styles.detailList}>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Status</span>
                                        <span style={{
                                            ...styles.statusTag,
                                            ...(traveler.active_now ? styles.activeTag : styles.inactiveTag)
                                        }}>
                                            {traveler.active_now ? 'Active' : 'Completed'}
                                        </span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Last Updated</span>
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




    // 🆕 Enhanced Popup Styles
    popupOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
        backdropFilter: "blur(4px)",
    },

    popupContent: {
        background: isDark ? "#1e293b" : "white",
        borderRadius: "16px",
        padding: "0",
        maxWidth: "600px",
        width: "100%",
        maxHeight: "85vh",
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
    },

    popupHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "24px",
        borderBottom: isDark ? "1px solid #374151" : "1px solid #f3f4f6",
        background: isDark ? "linear-gradient(135deg, #1e293b, #374151)" : "linear-gradient(135deg, #f8fafc, #f1f5f9)",
    },

    popupHeaderLeft: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flex: 1,
    },

    avatarLarge: {
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: isDark ? "linear-gradient(135deg, #3b82f6, #1d4ed8)" : "linear-gradient(135deg, #3b82f6, #60a5fa)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "24px",
    },

    popupTitle: {
        fontSize: "20px",
        fontWeight: 700,
        color: isDark ? "#f9fafb" : "#111827",
        margin: "0 0 4px 0",
        lineHeight: "1.3",
    },

    employeeId: {
        fontSize: "14px",
        color: isDark ? "#9ca3af" : "#6b7280",
        margin: 0,
        fontWeight: 500,
    },

    popupCloseBtn: {
        background: isDark ? "#374151" : "#f3f4f6",
        border: "none",
        color: isDark ? "#9ca3af" : "#6b7280",
        cursor: "pointer",
        padding: "8px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
        ':hover': {
            background: isDark ? "#4b5563" : "#e5e7eb",
        }
    },

    popupBody: {
        padding: "0",
        maxHeight: "calc(85vh - 120px)",
        overflowY: "auto",
    },

    bannerSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 24px",
        background: isDark ? "linear-gradient(90deg, #1e293b, #374151)" : "linear-gradient(90deg, #f8fafc, #f1f5f9)",
        borderBottom: isDark ? "1px solid #374151" : "1px solid #f3f4f6",
    },

    statusBadge: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: 600,
        border: "1px solid",
    },

    activeStatus: {
        background: isDark ? "#065f4620" : "#dcfce7",
        color: isDark ? "#34d399" : "#16a34a",
        borderColor: isDark ? "#065f46" : "#bbf7d0",
    },

    inactiveStatus: {
        background: isDark ? "#374151" : "#f3f4f6",
        color: isDark ? "#9ca3af" : "#6b7280",
        borderColor: isDark ? "#4b5563" : "#e5e7eb",
    },

    statusDot: {
        width: "8px",
        height: "8px",
        borderRadius: "50%",
    },

    activeStatusDot: {
        background: "#10b981",
        animation: "pulse 2s infinite",
    },

    inactiveStatusDot: {
        background: "#6b7280",
    },

    travelTypeBadge: {
        display: "flex",
        alignItems: "center",
        padding: "8px 16px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: 600,
        border: "1px solid",
    },

    detailGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0",
    },

    detailGroup: {
        padding: "24px",
        borderBottom: isDark ? "1px solid #374151" : "1px solid #f3f4f6",
        ':nth-child(odd)': {
            borderRight: isDark ? "1px solid #374151" : "1px solid #f3f4f6",
        }
    },

    detailGroupTitle: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "16px",
        fontWeight: 600,
        color: isDark ? "#f3f4f6" : "#374151",
        margin: "0 0 16px 0",
    },

    detailGroupIcon: {
        color: "#3b82f6",
    },

    detailItems: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },

    detailItem: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },

    detailLabel: {
        fontSize: "12px",
        fontWeight: 600,
        color: isDark ? "#9ca3af" : "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: "2px",
    },

    detailValue: {
        fontSize: "14px",
        color: isDark ? "#e5e7eb" : "#374151",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
    },

    travelTypeDisplay: {
        display: "flex",
        alignItems: "center",
        fontSize: "14px",
        fontWeight: 600,
        padding: "4px 0",
    },

    statusIndicator: {
        padding: "4px 12px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 600,
        width: "fit-content",
    },

    activeIndicator: {
        background: isDark ? "#065f4620" : "#dcfce7",
        color: isDark ? "#34d399" : "#16a34a",
    },

    inactiveIndicator: {
        background: isDark ? "#374151" : "#f3f4f6",
        color: isDark ? "#9ca3af" : "#6b7280",
    },
