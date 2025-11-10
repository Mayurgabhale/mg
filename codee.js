const styles = {
    // Upload Container
    uploadContainer: {
        padding: "20px",
        maxWidth: "1200px",
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
        borderRadius: "16px",
        marginBottom: "24px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    },

    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },

    uploadIcon: {
        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        color: "white",
        padding: "12px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    uploadTitle: {
        fontSize: "28px",
        fontWeight: "800",
        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        margin: "0 0 4px 0",
    },

    uploadSubtitle: {
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
        padding: "12px 20px",
        background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)",
        borderRadius: "12px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
    },

    statNumber: {
        fontSize: "20px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
        display: "block",
    },

    statLabel: {
        fontSize: "12px",
        color: isDark ? "#94a3b8" : "#64748b",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },

    // Upload Card
    uploadCard: {
        background: isDark ? "#1e293b" : "white",
        padding: "32px",
        borderRadius: "16px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
        marginBottom: "24px",
        textAlign: "center",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    },

    uploadArea: {
        border: `2px dashed ${isDark ? "rgba(255,255,255,0.2)" : "#d1d5db"}`,
        borderRadius: "12px",
        padding: "48px 32px",
        marginBottom: "24px",
        transition: "all 0.3s ease",
    },

    uploadCloudIcon: {
        color: isDark ? "#4b5563" : "#9ca3af",
        marginBottom: "16px",
    },

    uploadAreaTitle: {
        fontSize: "20px",
        fontWeight: "600",
        color: isDark ? "#f1f5f9" : "#0f172a",
        margin: "0 0 8px 0",
    },

    uploadAreaSubtitle: {
        fontSize: "14px",
        color: isDark ? "#94a3b8" : "#6b7280",
        margin: "0 0 24px 0",
    },

    fileInputLabel: {
        display: "inline-flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        color: "white",
        padding: "12px 24px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        transition: "all 0.2s ease",
        ':hover': {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
        }
    },

    hiddenFileInput: {
        display: "none",
    },

    filePreview: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px",
        background: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
        borderRadius: "8px",
        marginTop: "16px",
        maxWidth: "400px",
        margin: "16px auto 0",
    },

    fileIcon: {
        color: "#3b82f6",
    },

    fileInfo: {
        flex: 1,
        textAlign: "left",
    },

    fileName: {
        display: "block",
        fontSize: "14px",
        fontWeight: "600",
        color: isDark ? "#f1f5f9" : "#0f172a",
        marginBottom: "2px",
    },

    fileSize: {
        fontSize: "12px",
        color: isDark ? "#94a3b8" : "#6b7280",
    },

    removeFileButton: {
        background: "none",
        border: "none",
        color: isDark ? "#94a3b8" : "#6b7280",
        cursor: "pointer",
        padding: "4px",
        borderRadius: "4px",
        ':hover': {
            background: isDark ? "rgba(239, 68, 68, 0.1)" : "#fef2f2",
            color: "#ef4444",
        }
    },

    uploadButton: {
        background: "linear-gradient(135deg, #10b981, #059669)",
        color: "white",
        border: "none",
        padding: "14px 32px",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "inline-flex",
        alignItems: "center",
        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
        ':hover': {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(16, 185, 129, 0.6)",
        }
    },

    uploadButtonDisabled: {
        background: isDark ? "#374151" : "#9ca3af",
        color: isDark ? "#9ca3af" : "#6b7280",
        border: "none",
        padding: "14px 32px",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "not-allowed",
        display: "inline-flex",
        alignItems: "center",
        opacity: 0.6,
    },

    // Upload Status
    uploadStatusSuccess: {
        padding: "24px",
        borderRadius: "16px",
        marginBottom: "24px",
        background: isDark ? "rgba(16, 185, 129, 0.1)" : "#dcfce7",
        border: isDark ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid #bbf7d0",
    },

    uploadStatusError: {
        padding: "24px",
        borderRadius: "16px",
        marginBottom: "24px",
        background: isDark ? "rgba(239, 68, 68, 0.1)" : "#fef2f2",
        border: isDark ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid #fecaca",
    },

    statusHeader: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "12px",
    },

    statusTitle: {
        fontSize: "18px",
        fontWeight: "600",
        color: isDark ? "#f1f5f9" : "#0f172a",
    },

    statusMessage: {
        margin: "0",
        fontSize: "14px",
        color: isDark ? "#cbd5e1" : "#374151",
    },

    metadataGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginTop: "20px",
        paddingTop: "20px",
        borderTop: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb",
    },

    metadataItem: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },

    metadataLabel: {
        fontSize: "12px",
        color: isDark ? "#94a3b8" : "#6b7280",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },

    metadataValue: {
        fontSize: "14px",
        color: isDark ? "#f1f5f9" : "#0f172a",
        fontWeight: "500",
    },

    // Summary Card
    summaryCard: {
        background: isDark ? "#1e293b" : "white",
        padding: "24px",
        borderRadius: "16px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
        marginBottom: "24px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    },

    summaryHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },

    summaryTitle: {
        fontSize: "20px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
        margin: "0",
    },

    summaryStats: {
        display: "flex",
        gap: "24px",
    },

    summaryStat: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
    },

    summaryIcon: {
        color: "#3b82f6",
        marginBottom: "4px",
    },

    summaryNumber: {
        fontSize: "24px",
        fontWeight: "800",
        color: isDark ? "#f1f5f9" : "#0f172a",
    },

    summaryLabel: {
        fontSize: "12px",
        color: isDark ? "#94a3b8" : "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },

    // Table Container
    tableContainer: {
        background: isDark ? "#1e293b" : "white",
        borderRadius: "16px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    },

    tableHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
    },

    tableTitle: {
        fontSize: "20px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
        margin: "0",
    },

    tableActions: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },

    exportButton: {
        display: "flex",
        alignItems: "center",
        background: "none",
        border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid #d1d5db",
        color: isDark ? "#e2e8f0" : "#374151",
        padding: "8px 16px",
        borderRadius: "6px",
        fontSize: "14px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ':hover': {
            background: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
        }
    },

    searchBox: {
        position: "relative",
        display: "flex",
        alignItems: "center",
    },

    searchIcon: {
        position: "absolute",
        left: "12px",
        color: isDark ? "#94a3b8" : "#6b7280",
    },

    searchInput: {
        padding: "8px 12px 8px 36px",
        border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid #d1d5db",
        borderRadius: "6px",
        background: isDark ? "#334155" : "#f9fafb",
        color: isDark ? "#f1f5f9" : "#111827",
        fontSize: "14px",
        width: "200px",
        '::placeholder': {
            color: isDark ? "#94a3b8" : "#6b7280",
        }
    },

    tableWrapper: {
        overflowX: "auto",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "14px",
    },

    tableHead: {
        background: isDark ? "#334155" : "#f8fafc",
    },

    tableHeader: {
        padding: "16px",
        textAlign: "left",
        fontWeight: "600",
        color: isDark ? "#e2e8f0" : "#374151",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb",
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
    },

    tableRow: {
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #f3f4f6",
        transition: "background-color 0.2s ease",
        ':hover': {
            background: isDark ? "rgba(255,255,255,0.05)" : "#f9fafb",
        }
    },

    tableCell: {
        padding: "16px",
        color: isDark ? "#e2e8f0" : "#374151",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #f3f4f6",
    },

    employeeId: {
        display: "flex",
        alignItems: "center",
        fontWeight: "600",
        color: isDark ? "#f1f5f9" : "#0f172a",
    },

    employeeName: {
        display: "flex",
        flexDirection: "column",
    },

    name: {
        fontWeight: "600",
        color: isDark ? "#f1f5f9" : "#0f172a",
        marginBottom: "2px",
    },

    email: {
        fontSize: "12px",
        color: isDark ? "#94a3b8" : "#6b7280",
    },

    department: {
        background: isDark ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)",
        color: isDark ? "#93c5fd" : "#1d4ed8",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "500",
    },

    company: {
        fontWeight: "500",
        color: isDark ? "#e2e8f0" : "#374151",
    },

    location: {
        display: "flex",
        alignItems: "center",
        color: isDark ? "#cbd5e1" : "#6b7280",
        fontSize: "13px",
    },

    serviceBadge: {
        background: isDark ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.1)",
        color: isDark ? "#34d399" : "#065f46",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "600",
        textAlign: "center",
    },

    statusActive: {
        background: isDark ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.1)",
        color: isDark ? "#34d399" : "#065f46",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "600",
        textAlign: "center",
    },

    statusInactive: {
        background: isDark ? "rgba(107, 114, 128, 0.2)" : "rgba(107, 114, 128, 0.1)",
        color: isDark ? "#9ca3af" : "#374151",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "600",
        textAlign: "center",
    },

    tableFooter: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        borderTop: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
    },

    footerText: {
        fontSize: "14px",
        color: isDark ? "#94a3b8" : "#6b7280",
    },

    pagination: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },

    paginationButton: {
        background: "none",
        border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid #d1d5db",
        color: isDark ? "#e2e8f0" : "#374151",
        padding: "6px 8px",
        borderRadius: "4px",
        cursor: "pointer",
        ':disabled': {
            opacity: 0.5,
            cursor: "not-allowed",
        }
    },

    paginationInfo: {
        fontSize: "14px",
        color: isDark ? "#94a3b8" : "#6b7280",
    },

    // Animations
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
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
        headerStats: {
            width: "100%",
            justifyContent: "center",
        },
        uploadCard: {
            padding: "20px",
        },
        uploadArea: {
            padding: "32px 16px",
        },
        summaryStats: {
            gap: "16px",
        },
        tableHeader: {
            flexDirection: "column",
            gap: "16px",
            alignItems: "flex-start",
        },
        tableActions: {
            width: "100%",
            justifyContent: "space-between",
        },
        searchInput: {
            width: "150px",
        },
    }
};