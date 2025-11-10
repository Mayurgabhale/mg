const styles = {
    // Upload Container
    uploadContainer: {
        padding: "20px",
        maxWidth: "1000px",
        margin: "0 auto",
    },

    // Upload Header
    uploadHeader: {
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
        gap: "12px",
    },

    uploadTitle: {
        fontSize: "24px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
        margin: "0 0 4px 0",
    },

    uploadSubtitle: {
        fontSize: "14px",
        color: isDark ? "#94a3b8" : "#64748b",
        margin: "0",
    },

    // Upload Form
    uploadForm: {
        background: isDark ? "#1e293b" : "white",
        padding: "24px",
        borderRadius: "12px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
        marginBottom: "20px",
    },

    fileInput: {
        width: "100%",
        padding: "12px",
        border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid #d1d5db",
        borderRadius: "8px",
        background: isDark ? "#334155" : "#f9fafb",
        color: isDark ? "#f1f5f9" : "#111827",
        marginBottom: "16px",
        fontSize: "14px",
    },

    uploadButton: {
        background: "#3b82f6",
        color: "white",
        border: "none",
        padding: "12px 24px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ':disabled': {
            background: "#9ca3af",
            cursor: "not-allowed",
            opacity: 0.6,
        },
        ':hover:not(:disabled)': {
            background: "#2563eb",
            transform: "translateY(-1px)",
        }
    },

    // Upload Status
    uploadStatus: {
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "20px",
        fontSize: "14px",
        fontWeight: "500",
        background: isDark ? "rgba(34, 197, 94, 0.1)" : "#dcfce7",
        color: isDark ? "#4ade80" : "#166534",
        border: isDark ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid #bbf7d0",
    },

    // Error Status
    uploadError: {
        background: isDark ? "rgba(239, 68, 68, 0.1)" : "#fef2f2",
        color: isDark ? "#f87171" : "#dc2626",
        border: isDark ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid #fecaca",
    },

    // Table Container
    tableContainer: {
        background: isDark ? "#1e293b" : "white",
        borderRadius: "12px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
        overflow: "hidden",
        marginTop: "24px",
    },

    tableTitle: {
        fontSize: "18px",
        fontWeight: "600",
        color: isDark ? "#f1f5f9" : "#0f172a",
        padding: "20px 24px",
        margin: "0",
        background: isDark ? 
            "linear-gradient(135deg, #1e293b, #0f172a)" : 
            "linear-gradient(135deg, #f8fafc, #e2e8f0)",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
    },

    // Table Styles
    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "14px",
    },

    tableHead: {
        background: isDark ? "#334155" : "#f8fafc",
    },

    tableHeader: {
        padding: "12px 16px",
        textAlign: "left",
        fontWeight: "600",
        color: isDark ? "#e2e8f0" : "#374151",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb",
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },

    tableRow: {
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #f3f4f6",
        transition: "background-color 0.2s ease",
        ':hover': {
            background: isDark ? "rgba(255,255,255,0.05)" : "#f9fafb",
        }
    },

    tableCell: {
        padding: "12px 16px",
        color: isDark ? "#e2e8f0" : "#374151",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #f3f4f6",
    },

    // Empty State
    emptyState: {
        padding: "40px 24px",
        textAlign: "center",
        color: isDark ? "#94a3b8" : "#6b7280",
    },

    emptyStateIcon: {
        fontSize: "48px",
        marginBottom: "16px",
        opacity: 0.5,
    },

    emptyStateText: {
        fontSize: "16px",
        margin: "0",
    },

    // Loading State
    loadingState: {
        padding: "40px 24px",
        textAlign: "center",
        color: isDark ? "#94a3b8" : "#6b7280",
    },

    // Responsive
    '@media (max-width: 768px)': {
        uploadContainer: {
            padding: "12px",
        },
        uploadHeader: {
            padding: "16px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "16px",
        },
        tableContainer: {
            overflowX: "auto",
        },
        table: {
            minWidth: "600px",
        }
    }
};