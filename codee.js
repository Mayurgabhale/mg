// Enhanced Traveler Detail Popup Component
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

                        {/* Travel Info */}
                        <div style={styles.detailSection}>
                            <div style={styles.sectionHeader}>
                                <FiGlobe style={styles.sectionIcon} />
                                <h4 style={styles.sectionTitle}>Travel Information</h4>
                            </div>
                            <div style={styles.detailList}>
                                <div style={styles.detailRow}>
                                    <span style={styles.detailLabel}>From Location</span>
                                    <span style={styles.detailValue}>
                                        <FiMapPin size={14} style={{...styles.inlineIcon, color: '#ef4444'}} />
                                        {traveler.from_location || traveler.from_country || 'Unknown'}
                                    </span>
                                </div>
                                <div style={styles.detailRow}>
                                    <span style={styles.detailLabel}>To Location</span>
                                    <span style={styles.detailValue}>
                                        <FiMapPin size={14} style={{...styles.inlineIcon, color: '#10b981'}} />
                                        {traveler.to_location || traveler.to_country || 'Unknown'}
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