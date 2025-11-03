// 🆕 Theme-aware style functions
const getStyles = (isDark) => ({
    page: {
        backgroundColor: isDark ? "#0f172a" : "#f8fafc",
        minHeight: "100vh",
        padding: "24px",
        color: isDark ? "#e2e8f0" : "#1e293b",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        lineHeight: "1.5",
        transition: "all 0.3s ease",
    },

    header: {
        marginBottom: "32px",
    },

    headerContent: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },

    headerIcon: {
        background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        color: "white",
        padding: "16px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    title: {
        fontSize: "28px",
        fontWeight: 700,
        color: isDark ? "#f1f5f9" : "#0f172a",
        margin: 0,
        lineHeight: "1.2",
    },

    subtitle: {
        fontSize: "16px",
        color: isDark ? "#94a3b8" : "#64748b",
        margin: 0,
    },

    // 🆕 Theme Toggle Button
    themeToggleBtn: {
        background: isDark ? "#334155" : "#e2e8f0",
        color: isDark ? "#fbbf24" : "#64748b",
        border: "none",
        padding: "12px",
        borderRadius: "8px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
        ':hover': {
            background: isDark ? "#475569" : "#d1d5db",
        }
    },

    layout: {
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        gap: "24px",
        alignItems: "start",
    },

    sidebar: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },

    nav: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },

    navItem: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        border: "none",
        background: "transparent",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
        color: isDark ? "#94a3b8" : "#64748b",
        transition: "all 0.2s ease",
    },

    navItemActive: {
        background: "#3b82f6",
        color: "white",
    },

    navIcon: {
        fontSize: "18px",
    },

    sideCard: {
        background: isDark ? "#1e293b" : "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: isDark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.1)",
        border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
        transition: "all 0.3s ease",
    },

    cardHeader: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "16px",
    },

    cardIcon: {
        color: "#3b82f6",
        fontSize: "18px",
    },

    sideTitle: {
        fontSize: "16px",
        fontWeight: 600,
        color: isDark ? "#f1f5f9" : "#1e293b",
        margin: 0,
    },

    statsGrid: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },

    statItem: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px",
        background: isDark ? "#334155" : "#f8fafc",
        borderRadius: "8px",
        transition: "all 0.3s ease",
    },

    statIconWrapper: {
        padding: "8px",
        borderRadius: "8px",
        background: isDark ? "#1e40af" : "#dbeafe",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    statIcon: {
        color: "#3b82f6",
        fontSize: "16px",
    },

    statContent: {
        flex: 1,
    },

    statLabel: {
        fontSize: "12px",
        color: isDark ? "#cbd5e1" : "#64748b",
        display: "block",
    },

    statValue: {
        fontSize: "18px",
        fontWeight: 700,
        color: isDark ? "#f1f5f9" : "#1e293b",
        display: "block",
    },

    countryList: {
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },

    countryItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: isDark ? "1px solid #334155" : "1px solid #f1f5f9",
    },

    countryInfo: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },

    countryRank: {
        background: "#3b82f6",
        color: "white",
        fontSize: "12px",
        fontWeight: 600,
        width: "20px",
        height: "20px",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    countryName: {
        fontSize: "14px",
        fontWeight: 500,
        color: isDark ? "#e2e8f0" : "#1e293b",
    },

    countryCount: {
        fontSize: "14px",
        fontWeight: 600,
        color: "#3b82f6",
    },

    emptyState: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        color: isDark ? "#94a3b8" : "#64748b",
        textAlign: "center",
    },

    sideEmpty: {
        fontSize: "14px",
        color: isDark ? "#64748b" : "#94a3b8",
        margin: 0,
    },

    main: {
        display: "flex",
        flexDirection: "column",
        gap: "24px",
    },

    card: {
        background: isDark ? "#1e293b" : "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: isDark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.1)",
        border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
        transition: "all 0.3s ease",
    },

    uploadRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        marginBottom: "20px",
    },

    fileUploadWrapper: {
        flex: 1,
    },

    fileInput: {
        display: "none",
    },

    fileInputLabel: {
        display: "flex",
        alignItems: "center",
        padding: "12px 16px",
        background: isDark ? "#334155" : "#f8fafc",
        border: `2px dashed ${isDark ? "#475569" : "#cbd5e1"}`,
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
        color: isDark ? "#cbd5e1" : "#64748b",
        transition: "all 0.2s ease",
    },

    buttonGroup: {
        display: "flex",
        gap: "12px",
    },

    primaryBtn: {
        display: "flex",
        alignItems: "center",
        padding: "12px 20px",
        background: "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 600,
        transition: "all 0.2s ease",
    },

    disabledPrimaryBtn: {
        display: "flex",
        alignItems: "center",
        padding: "12px 20px",
        background: isDark ? "#475569" : "#94a3b8",
        color: isDark ? "#94a3b8" : "white",
        border: "none",
        borderRadius: "8px",
        cursor: "not-allowed",
        fontSize: "14px",
        fontWeight: 600,
    },

    secondaryBtn: {
        display: "flex",
        alignItems: "center",
        padding: "12px 20px",
        background: "transparent",
        color: isDark ? "#cbd5e1" : "#64748b",
        border: isDark ? "1px solid #475569" : "1px solid #cbd5e1",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
        transition: "all 0.2s ease",
    },

    ghostBtn: {
        display: "flex",
        alignItems: "center",
        padding: "12px 20px",
        background: "transparent",
        color: "#3b82f6",
        border: "1px solid #3b82f6",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
        transition: "all 0.2s ease",
    },

    spinner: {
        width: "16px",
        height: "16px",
        border: "2px solid transparent",
        borderTop: "2px solid currentColor",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginRight: "8px",
    },

    filtersSection: {
        marginBottom: "20px",
    },

    filtersHeader: {
        display: "flex",
        alignItems: "center",
        marginBottom: "16px",
    },

    filtersTitle: {
        fontSize: "16px",
        fontWeight: 600,
        color: isDark ? "#f1f5f9" : "#1e293b",
    },

    filtersRow: {
        display: "flex",
        gap: "12px",
        alignItems: "center",
    },

    searchWrapper: {
        position: "relative",
        flex: 1,
    },

    searchIcon: {
        position: "absolute",
        left: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        color: isDark ? "#94a3b8" : "#64748b",
    },

    searchInput: {
        width: "100%",
        padding: "12px 12px 12px 40px",
        border: isDark ? "1px solid #475569" : "1px solid #cbd5e1",
        borderRadius: "8px",
        fontSize: "14px",
        outline: "none",
        background: isDark ? "#334155" : "white",
        color: isDark ? "#e2e8f0" : "#1e293b",
        transition: "all 0.2s ease",
        '::placeholder': {
            color: isDark ? "#64748b" : "#9ca3af",
        }
    },

    select: {
        padding: "12px",
        border: isDark ? "1px solid #475569" : "1px solid #cbd5e1",
        borderRadius: "8px",
        fontSize: "14px",
        background: isDark ? "#334155" : "white",
        color: isDark ? "#e2e8f0" : "#1e293b",
        outline: "none",
        minWidth: "140px",
    },

    tableHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
    },

    tableTitle: {
        fontSize: "18px",
        fontWeight: 600,
        color: isDark ? "#f1f5f9" : "#1e293b",
        margin: 0,
    },

    tableBadge: {
        background: "#3b82f6",
        color: "white",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 600,
    },

    tableWrap: {
        overflowX: "auto",
        borderRadius: "8px",
        border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "14px",
    },

    thead: {
        background: isDark ? "#334155" : "#f8fafc",
    },

    th: {
        padding: "12px 16px",
        textAlign: "left",
        fontWeight: 600,
        color: isDark ? "#cbd5e1" : "#475569",
        borderBottom: isDark ? "1px solid #475569" : "1px solid #e2e8f0",
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },

    td: {
        padding: "16px",
        borderBottom: isDark ? "1px solid #334155" : "1px solid #f1f5f9",
        color: isDark ? "#e2e8f0" : "#1e293b",
    },

    rowEven: {
        background: isDark ? "#1e293b" : "white",
    },

    rowOdd: {
        background: isDark ? "#334155" : "#f8fafc",
    },

    emptyRow: {
        textAlign: "center",
        padding: "40px",
    },

    emptySubtext: {
        fontSize: "14px",
        color: isDark ? "#94a3b8" : "#94a3b8",
        margin: 0,
    },

    activeBadge: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "4px 8px",
        background: isDark ? "#065f46" : "#dcfce7",
        color: isDark ? "#34d399" : "#16a34a",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 500,
        width: "fit-content",
    },

    inactiveBadge: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "4px 8px",
        background: isDark ? "#7f1d1d" : "#fef2f2",
        color: isDark ? "#fca5a5" : "#dc2626",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 500,
        width: "fit-content",
    },

    userCell: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },

    avatar: {
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        background: isDark ? "#475569" : "#e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: isDark ? "#cbd5e1" : "#64748b",
    },

    emailCell: {
        display: "flex",
        alignItems: "center",
    },

    typeBadge: {
        padding: "4px 8px",
        background: isDark ? "#1e40af" : "#dbeafe",
        color: isDark ? "#93c5fd" : "#1d4ed8",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: 500,
    },

    dateCell: {
        display: "flex",
        alignItems: "center",
    },

    viewButton: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "6px 12px",
        background: "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: 500,
        transition: "all 0.2s ease",
    },

    // Analytics Styles
    analyticsGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
    },

    analyticsCard: {
        background: isDark ? "#1e293b" : "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: isDark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.1)",
        border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
    },

    analyticsTitle: {
        fontSize: "16px",
        fontWeight: 600,
        color: isDark ? "#f1f5f9" : "#1e293b",
        margin: "0 0 16px 0",
    },

    analyticsStats: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },

    analyticsStat: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px",
        background: isDark ? "#334155" : "#f8fafc",
        borderRadius: "8px",
    },

    analyticsLabel: {
        fontSize: "14px",
        color: isDark ? "#cbd5e1" : "#64748b",
    },

    analyticsValue: {
        fontSize: "16px",
        fontWeight: 600,
        color: isDark ? "#f1f5f9" : "#1e293b",
    },

    countryChart: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },

    chartBarWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },

    chartBarLabel: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "12px",
        color: isDark ? "#94a3b8" : "#64748b",
    },

    chartBarTrack: {
        height: "8px",
        background: isDark ? "#334155" : "#e2e8f0",
        borderRadius: "4px",
        overflow: "hidden",
    },

    chartBarFill: {
        height: "100%",
        background: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
        borderRadius: "4px",
        transition: "width 0.3s ease",
    },

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