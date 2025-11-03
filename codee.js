
// Add these styles to your getStyles function
const getStyles = (isDark) => ({
    // ... existing styles ...

    // Popup Styles
    popupOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
    },

    popupContent: {
        background: isDark ? "#1e293b" : "white",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "500px",
        maxHeight: "90vh",
        overflow: "hidden",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    },

    // Header
    popupHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "24px",
        borderBottom: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
    },

    headerContent: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flex: 1,
    },

    avatarSection: {
        display: "flex",
        alignItems: "center",
    },

    avatarLarge: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        background: isDark ? "#3b82f6" : "#3b82f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
    },

    headerInfo: {
        flex: 1,
    },

    popupTitle: {
        fontSize: "18px",
        fontWeight: "600",
        color: isDark ? "#f9fafb" : "#111827",
        margin: "0 0 4px 0",
    },

    employeeId: {
        fontSize: "14px",
        color: isDark ? "#9ca3af" : "#6b7280",
        margin: 0,
    },

    popupCloseBtn: {
        background: "none",
        border: "none",
        color: isDark ? "#9ca3af" : "#6b7280",
        cursor: "pointer",
        padding: "4px",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    // Body
    popupBody: {
        padding: "0",
        maxHeight: "400px",
        overflowY: "auto",
    },

    // Status Banner
    statusBanner: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        background: isDark ? "#374151" : "#f8fafc",
        borderBottom: isDark ? "1px solid #4b5563" : "1px solid #e5e7eb",
    },

    statusBadge: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: "500",
    },

    activeStatus: {
        background: isDark ? "#065f46" : "#dcfce7",
        color: isDark ? "#34d399" : "#16a34a",
    },

    inactiveStatus: {
        background: isDark ? "#374151" : "#f3f4f6",
        color: isDark ? "#9ca3af" : "#6b7280",
    },

    statusDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
    },

    activeDot: {
        background: "#10b981",
    },

    inactiveDot: {
        background: "#6b7280",
    },

    travelTypeBadge: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
    },

    travelTypeText: {
        marginLeft: "4px",
    },

    // Details Container
    detailsContainer: {
        padding: "0",
    },

    detailSection: {
        padding: "20px 24px",
        borderBottom: isDark ? "1px solid #374151" : "1px solid #f3f4f6",
        ':last-child': {
            borderBottom: "none",
        }
    },

    sectionHeader: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "16px",
    },

    sectionIcon: {
        color: "#3b82f6",
        fontSize: "16px",
    },

    sectionTitle: {
        fontSize: "16px",
        fontWeight: "600",
        color: isDark ? "#f3f4f6" : "#374151",
        margin: 0,
    },

    detailList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },

    detailRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    detailLabel: {
        fontSize: "14px",
        color: isDark ? "#9ca3af" : "#6b7280",
        fontWeight: "500",
        flex: 1,
    },

    detailValue: {
        fontSize: "14px",
        color: isDark ? "#e5e7eb" : "#374151",
        fontWeight: "400",
        flex: 1,
        textAlign: "right",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
    },

    inlineIcon: {
        marginRight: "6px",
    },

    statusTag: {
        padding: "4px 8px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "500",
    },

    activeTag: {
        background: isDark ? "#065f46" : "#dcfce7",
        color: isDark ? "#34d399" : "#16a34a",
    },

    inactiveTag: {
        background: isDark ? "#374151" : "#f3f4f6",
        color: isDark ? "#9ca3af" : "#6b7280",
    },
});


....


// Add these new icons at the top with other imports
import {
    FiCar,
    FiTruck,
    FiTrain,
    FiPlane,
    FiShip,
    FiBike,
    FiNavigation,
    FiUser,
    FiMail,
    FiMapPin,
    FiCalendar,
    FiClock,
    FiGlobe,
    FiAward
} from "react-icons/fi";

// Travel Type Icons Mapping
const getTravelTypeIcon = (type) => {
    if (!type) return FiGlobe;
    
    const typeLower = type.toLowerCase();
    if (typeLower.includes('car') || typeLower.includes('vehicle')) return FiCar;
    if (typeLower.includes('truck') || typeLower.includes('bus')) return FiTruck;
    if (typeLower.includes('train') || typeLower.includes('rail')) return FiTrain;
    if (typeLower.includes('plane') || typeLower.includes('air') || typeLower.includes('flight')) return FiPlane;
    if (typeLower.includes('ship') || typeLower.includes('boat') || typeLower.includes('sea')) return FiShip;
    if (typeLower.includes('bike') || typeLower.includes('cycle')) return FiBike;
    return FiNavigation;
};

// Travel Type Color Mapping
const getTravelTypeColor = (type) => {
    if (!type) return '#6b7280';
    
    const typeLower = type.toLowerCase();
    if (typeLower.includes('car') || typeLower.includes('vehicle')) return '#dc2626';
    if (typeLower.includes('truck') || typeLower.includes('bus')) return '#ea580c';
    if (typeLower.includes('train') || typeLower.includes('rail')) return '#16a34a';
    if (typeLower.includes('plane') || typeLower.includes('air') || typeLower.includes('flight')) return '#2563eb';
    if (typeLower.includes('ship') || typeLower.includes('boat') || typeLower.includes('sea')) return '#7c3aed';
    if (typeLower.includes('bike') || typeLower.includes('cycle')) return '#ca8a04';
    return '#475569';
};

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

                    {/* Details Grid */}
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
                                    <span style={styles.detailLabel}>From Country</span>
                                    <span style={styles.detailValue}>
                                        <FiMapPin size={14} style={{...styles.inlineIcon, color: '#ef4444'}} />
                                        {traveler.from_country || 'Unknown'}
                                    </span>
                                </div>
                                <div style={styles.detailRow}>
                                    <span style={styles.detailLabel}>To Country</span>
                                    <span style={styles.detailValue}>
                                        <FiMapPin size={14} style={{...styles.inlineIcon, color: '#10b981'}} />
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