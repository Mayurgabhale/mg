// Add these styles to your getStyles function
const getStyles = (isDark) => ({
    // ... your existing styles ...

    // 🆕 Add New Traveler Tab Styles
    addTravelContainer: {
        padding: "0",
    },

    addTravelHeader: {
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

    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },

    headerIconLarge: {
        background: isDark ? 
            "linear-gradient(135deg, #8b5cf6, #3b82f6)" : 
            "linear-gradient(135deg, #8b5cf6, #3b82f6)",
        color: "white",
        padding: "16px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    addTravelTitle: {
        fontSize: "24px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
        margin: "0 0 4px 0",
    },

    addTravelSubtitle: {
        fontSize: "14px",
        color: isDark ? "#94a3b8" : "#64748b",
        margin: "0",
    },

    headerStats: {
        display: "flex",
        gap: "16px",
    },

    statCard: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)",
        borderRadius: "8px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
    },

    statNumber: {
        fontSize: "18px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
        display: "block",
    },

    statLabel: {
        fontSize: "12px",
        color: isDark ? "#94a3b8" : "#64748b",
        display: "block",
    },

    formMainContainer: {
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        gap: "24px",
        alignItems: "start",
    },

    formCard: {
        background: isDark ? "#1e293b" : "white",
        padding: "24px",
        borderRadius: "12px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
        boxShadow: isDark ? 
            "0 4px 6px -1px rgba(0, 0, 0, 0.3)" : 
            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },

    formHeader: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "32px",
        paddingBottom: "20px",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
    },

    formIcon: {
        background: isDark ? 
            "linear-gradient(135deg, #8b5cf6, #3b82f6)" : 
            "linear-gradient(135deg, #8b5cf6, #3b82f6)",
        color: "white",
        padding: "12px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    formTitle: {
        fontSize: "20px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
        margin: "0 0 4px 0",
    },

    formSubtitle: {
        fontSize: "14px",
        color: isDark ? "#94a3b8" : "#64748b",
        margin: "0",
    },

    formSections: {
        display: "flex",
        flexDirection: "column",
        gap: "32px",
    },

    formSection: {
        padding: "0",
    },

    sectionTitle: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "16px",
        fontWeight: "600",
        color: isDark ? "#e2e8f0" : "#374151",
        margin: "0 0 20px 0",
        paddingBottom: "12px",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #f1f5f9",
    },

    sectionIcon: {
        color: "#3b82f6",
    },

    sectionGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px",
    },

    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },

    inputLabel: {
        fontSize: "14px",
        fontWeight: "600",
        color: isDark ? "#e2e8f0" : "#374151",
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },

    labelIcon: {
        color: isDark ? "#94a3b8" : "#6b7280",
        opacity: "0.8",
    },

    required: {
        color: "#ef4444",
        marginLeft: "2px",
    },

    formInput: {
        padding: "12px 16px",
        borderRadius: "8px",
        border: isDark ? 
            "1px solid rgba(255,255,255,0.2)" : 
            "1px solid #d1d5db",
        background: isDark ? "rgba(15, 23, 42, 0.5)" : "white",
        color: isDark ? "#f9fafb" : "#111827",
        fontSize: "14px",
        transition: "all 0.2s ease",
        outline: "none",
        ':focus': {
            borderColor: isDark ? "#3b82f6" : "#2563eb",
            boxShadow: isDark ? 
                "0 0 0 3px rgba(59, 130, 246, 0.1)" : 
                "0 0 0 3px rgba(37, 99, 235, 0.1)",
        },
        '::placeholder': {
            color: isDark ? "#6b7280" : "#9ca3af",
        }
    },

    formActions: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "24px",
        marginTop: "32px",
        borderTop: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
    },

    secondaryButton: {
        background: isDark ? 
            "linear-gradient(135deg, #4b5563, #374151)" : 
            "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
        color: isDark ? "#d1d5db" : "#374151",
        border: "none",
        padding: "12px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.3s ease",
        ':hover': {
            transform: "translateY(-1px)",
            boxShadow: isDark ? 
                "0 4px 12px rgba(0, 0, 0, 0.3)" : 
                "0 4px 12px rgba(0, 0, 0, 0.1)",
        }
    },

    primaryActions: {
        display: "flex",
        gap: "12px",
    },

    clearButton: {
        background: isDark ? 
            "linear-gradient(135deg, #6b7280, #4b5563)" : 
            "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
        color: isDark ? "#d1d5db" : "#374151",
        border: "none",
        padding: "12px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.3s ease",
        ':hover': {
            transform: "translateY(-1px)",
            boxShadow: isDark ? 
                "0 4px 12px rgba(0, 0, 0, 0.3)" : 
                "0 4px 12px rgba(0, 0, 0, 0.1)",
        }
    },

    saveButton: {
        background: isDark ? 
            "linear-gradient(135deg, #059669, #047857)" : 
            "linear-gradient(135deg, #10b981, #059669)",
        color: "white",
        border: "none",
        padding: "12px 24px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.3s ease",
        boxShadow: isDark ? 
            "0 4px 12px rgba(5, 150, 105, 0.3)" : 
            "0 4px 12px rgba(5, 150, 105, 0.2)",
        ':hover': {
            transform: "translateY(-1px)",
            boxShadow: isDark ? 
                "0 8px 20px rgba(5, 150, 105, 0.4)" : 
                "0 8px 20px rgba(5, 150, 105, 0.3)",
        }
    },

    tipsCard: {
        background: isDark ? "#1e293b" : "white",
        padding: "20px",
        borderRadius: "12px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
        boxShadow: isDark ? 
            "0 4px 6px -1px rgba(0, 0, 0, 0.3)" : 
            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        position: "sticky",
        top: "20px",
    },

    tipsTitle: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "16px",
        fontWeight: "600",
        color: isDark ? "#e2e8f0" : "#374151",
        margin: "0 0 16px 0",
    },

    tipsList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },

    tipItem: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "14px",
        color: isDark ? "#cbd5e1" : "#6b7280",
    },
});