// Add these new icons at the top with other imports
import {
    // ... existing icons
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

// 🆕 Travel Type Icons Mapping
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

// 🆕 Travel Type Color Mapping
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