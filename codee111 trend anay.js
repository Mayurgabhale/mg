const getStyles = (isDark) => ({
    // ... your existing styles ...

    // 🆕 Compact Upload Styles
    compactUploadRow: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "20px",
    },

    compactFileUpload: {
        flex: 1,
    },

    compactFileLabel: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        background: isDark ? "#374151" : "#f3f4f6",
        border: `1px solid ${isDark ? "#4b5563" : "#d1d5db"}`,
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        color: isDark ? "#d1d5db" : "#374151",
        transition: "all 0.2s ease",
        ':hover': {
            background: isDark ? "#4b5563" : "#e5e7eb",
        }
    },

    compactButtonGroup: {
        display: "flex",
        gap: "8px",
    },

    compactPrimaryBtn: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px",
        background: "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        transition: "all 0.2s ease",
        minWidth: "36px",
        ':hover': {
            background: "#2563eb",
        }
    },

    disabledCompactBtn: {
        ...this.compactPrimaryBtn,
        background: "#9ca3af",
        cursor: "not-allowed",
        ':hover': {
            background: "#9ca3af",
        }
    },

    compactSecondaryBtn: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px",
        background: "transparent",
        color: isDark ? "#d1d5db" : "#374151",
        border: `1px solid ${isDark ? "#4b5563" : "#d1d5db"}`,
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        transition: "all 0.2s ease",
        minWidth: "36px",
        ':hover': {
            background: isDark ? "#4b5563" : "#f3f4f6",
        }
    },

    compactGhostBtn: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px",
        background: "transparent",
        color: "#3b82f6",
        border: "1px solid #3b82f6",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        transition: "all 0.2s ease",
        minWidth: "36px",
        ':hover': {
            background: "rgba(59, 130, 246, 0.1)",
        }
    },

    smallSpinner: {
        width: "14px",
        height: "14px",
        border: "2px solid transparent",
        borderTop: "2px solid currentColor",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },

    // 🆕 Region Cards Styles
    regionCardsSection: {
        marginBottom: "24px",
        paddingBottom: "20px",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb",
    },

    regionCardsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "12px",
    },

    regionCard: {
        background: isDark ? "rgba(30, 41, 59, 0.5)" : "#f8fafc",
        padding: "16px",
        borderRadius: "8px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
        cursor: "pointer",
        transition: "all 0.3s ease",
        textAlign: "center",
        ':hover': {
            transform: "translateY(-2px)",
            boxShadow: isDark ? 
                "0 4px 12px rgba(0, 0, 0, 0.3)" : 
                "0 4px 12px rgba(0, 0, 0, 0.1)",
        }
    },

    regionCardActive: {
        borderColor: isDark ? "rgba(59, 130, 246, 0.5)" : "rgba(37, 99, 235, 0.5)",
        background: isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(37, 99, 235, 0.05)",
    },

    regionCardHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        marginBottom: "12px",
    },

    regionIcon: {
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "14px",
    },

    regionName: {
        fontSize: "12px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },

    regionCardStats: {
        marginBottom: "8px",
    },

    regionCount: {
        fontSize: "20px",
        fontWeight: "800",
        color: isDark ? "#f1f5f9" : "#0f172a",
        display: "block",
        lineHeight: "1.2",
    },

    regionLabel: {
        fontSize: "10px",
        color: isDark ? "#94a3b8" : "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },

    regionCardActive: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        fontSize: "10px",
        color: isDark ? "#94a3b8" : "#6b7280",
    },

    activeDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#10b981",
    },
});

// 🆕 Helper functions for regions
const getRegionColor = (regionCode) => {
    const colors = {
        'GLOBAL': '#6b7280',
        'APAC': '#dc2626',
        'EMEA': '#2563eb', 
        'LACA': '#16a34a',
        'NAMER': '#7c3aed'
    };
    return colors[regionCode] || '#6b7280';
};

const getRegionIcon = (regionCode) => {
    const icons = {
        'GLOBAL': '🌍',
        'APAC': '🌏',
        'EMEA': '🌍',
        'LACA': '🌎',
        'NAMER': '🌎'
    };
    return icons[regionCode] || '📍';
};