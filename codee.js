this section i want more atractive wiht employeed id  {r.emp_id} ok. 
    see Travel Type:
CAR then alos Ui  Travel Type  use to add icons and other do thie more atractive ok 
const TravelerDetailPopup = ({ traveler, onClose }) => {
        if (!traveler) return null;

        return (
            <div style={styles.popupOverlay}>
                <div style={styles.popupContent}>
                    <div style={styles.popupHeader}>
                        <h3 style={styles.popupTitle}>Traveler Details</h3>
                        <button onClick={onClose} style={styles.popupCloseBtn}>
                            <FiX size={20} />
                        </button>
                    </div>

                    <div style={styles.popupBody}>
                        <div style={styles.detailSection}>
                            <div style={detailRow}>
                                <div style={detailItem}>
                                    <strong>Name:</strong>
                                    <span>{traveler.first_name} {traveler.last_name}</span>
                                </div>
                                <div style={detailItem}>
                                    <strong>Email:</strong>
                                    <span>{traveler.email}</span>
                                </div>
                            </div>

                            <div style={detailRow}>
                                <div style={detailItem}>
                                    <strong>Status:</strong>
                                    <span style={traveler.active_now ? activeBadge : inactiveBadge}>
                                        {traveler.active_now ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <div style={detailItem}>
                                    <strong>Travel Type:</strong>
                                    <span>{traveler.leg_type}</span>
                                </div>
                            </div>

                            <div style={detailRow}>
                                <div style={detailItem}>
                                    <strong>From Country:</strong>
                                    <span>{traveler.from_country}</span>
                                </div>
                                <div style={detailItem}>
                                    <strong>To Country:</strong>
                                    <span>{traveler.to_country}</span>
                                </div>
                            </div>

                            <div style={detailRow}>
                                <div style={detailItem}>
                                    <strong>Start Date:</strong>
                                    <span>{fmt(traveler.begin_dt)}</span>
                                </div>
                                <div style={detailItem}>
                                    <strong>End Date:</strong>
                                    <span>{fmt(traveler.end_dt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };



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
        padding: "0",
        maxWidth: "500px",
        width: "100%",
        maxHeight: "90vh",
        overflow: "hidden",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    },

    popupHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 24px",
        borderBottom: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
    },

    popupTitle: {
        fontSize: "18px",
        fontWeight: 600,
        color: isDark ? "#f1f5f9" : "#1e293b",
        margin: 0,
    },

    popupCloseBtn: {
        background: "none",
        border: "none",
        color: isDark ? "#94a3b8" : "#64748b",
        cursor: "pointer",
        padding: "4px",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    popupBody: {
        padding: "24px",
    },

    detailSection: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },

    detailRow: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
    },

    detailItem: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        ' strong': {
            color: isDark ? "#cbd5e1" : "#374151",
            fontSize: "14px",
            marginBottom: "4px",
        },
        ' span': {
            color: isDark ? "#94a3b8" : "#6b7280",
            fontSize: "14px",
        }
    },
});

export default EmployeeTravelDashboard;
