// Add these styles to your getStyles function
const getStyles = (isDark) => ({
    // ... your existing styles ...

    // 🆕 Region Analysis Styles
    regionsContainer: {
        padding: "0",
    },

    regionsHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px",
        background: isDark ? 
            "linear-gradient(135deg, #1e293b, #0f172a)" : 
            "linear-gradient(135deg, #f8fafc, #e2e8f0)",
        borderRadius: "12px",
        marginBottom: "24px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
    },

    regionsTitle: {
        fontSize: "24px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
        margin: "0 0 4px 0",
    },

    regionsSubtitle: {
        fontSize: "14px",
        color: isDark ? "#94a3b8" : "#64748b",
        margin: "0",
    },

    regionsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px",
    },

    regionCard: {
        background: isDark ? "#1e293b" : "white",
        padding: "20px",
        borderRadius: "12px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: isDark ? 
            "0 4px 6px -1px rgba(0, 0, 0, 0.3)" : 
            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        ':hover': {
            transform: "translateY(-4px)",
            boxShadow: isDark ? 
                "0 8px 25px -3px rgba(0, 0, 0, 0.4)" : 
                "0 8px 25px -3px rgba(0, 0, 0, 0.15)",
        }
    },

    regionHeader: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "16px",
    },

    regionIcon: {
        background: isDark ? 
            "linear-gradient(135deg, #8b5cf6, #3b82f6)" : 
            "linear-gradient(135deg, #8b5cf6, #3b82f6)",
        color: "white",
        padding: "8px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    regionName: {
        fontSize: "18px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
        margin: "0",
        flex: 1,
    },

    regionStats: {
        display: "flex",
        gap: "12px",
    },

    regionStat: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
    },

    regionStatValue: {
        fontSize: "18px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
    },

    regionStatLabel: {
        fontSize: "11px",
        color: isDark ? "#94a3b8" : "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },

    citiesPreview: {
        marginBottom: "12px",
    },

    citiesLabel: {
        fontSize: "12px",
        color: isDark ? "#94a3b8" : "#6b7280",
        fontWeight: "600",
        marginBottom: "6px",
        display: "block",
    },

    citiesList: {
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
    },

    cityTag: {
        background: isDark ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)",
        color: isDark ? "#93c5fd" : "#1d4ed8",
        padding: "4px 8px",
        borderRadius: "6px",
        fontSize: "11px",
        fontWeight: "500",
    },

    moreCities: {
        color: isDark ? "#94a3b8" : "#6b7280",
        fontSize: "11px",
        fontStyle: "italic",
    },

    viewDetails: {
        fontSize: "12px",
        color: isDark ? "#3b82f6" : "#2563eb",
        fontWeight: "600",
        textAlign: "center",
        paddingTop: "8px",
        borderTop: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #f1f5f9",
    },

    // Region Details Styles
    regionDetailsContainer: {
        background: isDark ? "#1e293b" : "white",
        borderRadius: "12px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
        overflow: "hidden",
    },

    regionDetailsHeader: {
        padding: "24px",
        background: isDark ? 
            "linear-gradient(135deg, #1e293b, #0f172a)" : 
            "linear-gradient(135deg, #f8fafc, #e2e8f0)",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
    },

    backButton: {
        background: "none",
        border: "none",
        color: isDark ? "#3b82f6" : "#2563eb",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        marginBottom: "12px",
        padding: "0",
    },

    regionDetailsTitle: {
        fontSize: "20px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
        margin: "0 0 16px 0",
    },

    citiesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "16px",
        padding: "24px",
    },

    cityCard: {
        background: isDark ? "rgba(30, 41, 59, 0.5)" : "#f8fafc",
        padding: "16px",
        borderRadius: "8px",
        border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0",
    },

    cityHeader: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "12px",
    },

    cityIcon: {
        color: "#ef4444",
    },

    cityName: {
        fontSize: "16px",
        fontWeight: "600",
        color: isDark ? "#f1f5f9" : "#0f172a",
        margin: "0",
        flex: 1,
    },

    cityStats: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    cityCount: {
        fontSize: "18px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
    },

    cityLabel: {
        fontSize: "10px",
        color: isDark ? "#94a3b8" : "#6b7280",
        textTransform: "uppercase",
    },

    cityDetails: {
        display: "flex",
        gap: "12px",
        marginBottom: "12px",
    },

    cityStat: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "12px",
        color: isDark ? "#cbd5e1" : "#6b7280",
    },

    sampleTravelers: {
        borderTop: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0",
        paddingTop: "12px",
    },

    sampleTitle: {
        fontSize: "12px",
        fontWeight: "600",
        color: isDark ? "#94a3b8" : "#6b7280",
        margin: "0 0 8px 0",
        textTransform: "uppercase",
    },

    travelerItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "6px 0",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.02)" : "1px solid #f8fafc",
    },

    travelerInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },

    travelerName: {
        fontSize: "12px",
        fontWeight: "500",
        color: isDark ? "#e2e8f0" : "#374151",
    },

    travelerId: {
        fontSize: "10px",
        color: isDark ? "#94a3b8" : "#6b7280",
    },

    activeStatusSmall: {
        fontSize: "10px",
        color: "#16a34a",
        fontWeight: "600",
        padding: "2px 6px",
        background: "rgba(22, 163, 74, 0.1)",
        borderRadius: "4px",
    },

    inactiveStatusSmall: {
        fontSize: "10px",
        color: "#6b7280",
        fontWeight: "600",
        padding: "2px 6px",
        background: "rgba(107, 114, 128, 0.1)",
        borderRadius: "4px",
    },

    moreTravelers: {
        fontSize: "11px",
        color: isDark ? "#94a3b8" : "#6b7280",
        fontStyle: "italic",
        textAlign: "center",
        marginTop: "8px",
    },
});