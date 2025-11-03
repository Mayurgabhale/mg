// 🆕 Enhanced Attractive Popup Styles
popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
    backdropFilter: "blur(8px)",
},

popupContent: {
    background: isDark ? 
        "linear-gradient(145deg, #1e293b, #0f172a)" : 
        "linear-gradient(145deg, #ffffff, #f8fafc)",
    borderRadius: "20px",
    padding: "0",
    maxWidth: "520px",
    width: "100%",
    maxHeight: "80vh",
    overflow: "hidden",
    boxShadow: isDark ? 
        "0 32px 64px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)" : 
        "0 32px 64px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0,0,0,0.05)",
    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
    transform: "scale(0.95)",
    animation: "popupScale 0.3s ease-out forwards",
},

popupHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "28px 28px 20px 28px",
    background: isDark ? 
        "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))" : 
        "linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(241, 245, 249, 0.9))",
    backdropFilter: "blur(10px)",
    position: "relative",
    '::after': {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: "28px",
        right: "28px",
        height: "1px",
        background: isDark ? 
            "linear-gradient(90deg, transparent, rgba(100, 116, 139, 0.3), transparent)" : 
            "linear-gradient(90deg, transparent, rgba(203, 213, 225, 0.5), transparent)",
    }
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
    position: "relative",
},

avatarLarge: {
    width: "70px",
    height: "70px",
    borderRadius: "20px",
    background: isDark ? 
        "linear-gradient(135deg, #8b5cf6, #3b82f6)" : 
        "linear-gradient(135deg, #8b5cf6, #3b82f6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "28px",
    boxShadow: isDark ? 
        "0 8px 32px rgba(139, 92, 246, 0.3)" : 
        "0 8px 32px rgba(139, 92, 246, 0.2)",
    border: isDark ? "2px solid rgba(255,255,255,0.1)" : "2px solid rgba(255,255,255,0.2)",
},

headerInfo: {
    flex: 1,
},

popupTitle: {
    fontSize: "22px",
    fontWeight: 700,
    color: isDark ? "#f1f5f9" : "#0f172a",
    margin: "0 0 6px 0",
    lineHeight: "1.2",
    background: isDark ? 
        "linear-gradient(135deg, #f1f5f9, #cbd5e1)" : 
        "linear-gradient(135deg, #0f172a, #475569)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
},

employeeId: {
    fontSize: "14px",
    color: isDark ? "#94a3b8" : "#64748b",
    margin: 0,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    '::before': {
        content: '"👤"',
        fontSize: "12px",
    }
},

popupCloseBtn: {
    background: isDark ? 
        "linear-gradient(135deg, rgba(71, 85, 105, 0.8), rgba(51, 65, 85, 0.8))" : 
        "linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(241, 245, 249, 0.9))",
    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
    color: isDark ? "#cbd5e1" : "#475569",
    cursor: "pointer",
    padding: "10px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    ':hover': {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        background: isDark ? 
            "linear-gradient(135deg, rgba(100, 116, 139, 0.8), rgba(71, 85, 105, 0.8))" : 
            "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248, 250, 252, 0.9))",
    }
},

popupBody: {
    padding: "0",
    maxHeight: "calc(80vh - 140px)",
    overflowY: "auto",
    background: isDark ? 
        "linear-gradient(180deg, rgba(15, 23, 42, 0.5), rgba(30, 41, 59, 0.5))" : 
        "linear-gradient(180deg, rgba(248, 250, 252, 0.5), rgba(241, 245, 249, 0.5))",
},

statusBanner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 28px",
    background: isDark ? 
        "linear-gradient(90deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8))" : 
        "linear-gradient(90deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.8))",
    backdropFilter: "blur(10px)",
    borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.03)",
},

statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 18px",
    borderRadius: "16px",
    fontSize: "14px",
    fontWeight: 600,
    border: "1px solid",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
},

activeStatus: {
    background: isDark ? 
        "linear-gradient(135deg, rgba(22, 163, 74, 0.2), rgba(21, 128, 61, 0.1))" : 
        "linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.1))",
    color: isDark ? "#4ade80" : "#16a34a",
    borderColor: isDark ? "rgba(74, 222, 128, 0.3)" : "rgba(34, 197, 94, 0.3)",
},

inactiveStatus: {
    background: isDark ? 
        "linear-gradient(135deg, rgba(71, 85, 105, 0.2), rgba(51, 65, 85, 0.1))" : 
        "linear-gradient(135deg, rgba(203, 213, 225, 0.2), rgba(148, 163, 184, 0.1))",
    color: isDark ? "#94a3b8" : "#64748b",
    borderColor: isDark ? "rgba(148, 163, 184, 0.3)" : "rgba(203, 213, 225, 0.4)",
},

statusDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    transition: "all 0.3s ease",
},

activeDot: {
    background: "#22c55e",
    boxShadow: "0 0 12px rgba(34, 197, 94, 0.5)",
    animation: "pulse 2s infinite",
},

inactiveDot: {
    background: "#94a3b8",
    boxShadow: "0 0 8px rgba(148, 163, 184, 0.3)",
},

travelTypeBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    borderRadius: "14px",
    fontSize: "14px",
    fontWeight: 600,
    border: "1px solid",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
},

travelTypeText: {
    fontWeight: "600",
},

detailsContainer: {
    padding: "8px 0",
},

detailSection: {
    padding: "24px 28px",
    borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.03)",
    transition: "all 0.3s ease",
    ':hover': {
        background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
    },
    ':last-child': {
        borderBottom: "none",
    }
},

sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
    paddingBottom: "12px",
    borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.03)",
},

sectionIcon: {
    color: "#3b82f6",
    fontSize: "18px",
    background: isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.1)",
    padding: "8px",
    borderRadius: "10px",
    border: isDark ? "1px solid rgba(59, 130, 246, 0.2)" : "1px solid rgba(59, 130, 246, 0.2)",
},

sectionTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: isDark ? "#e2e8f0" : "#1e293b",
    margin: 0,
    letterSpacing: "-0.01em",
},

detailList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
},

detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "12px 0",
    borderRadius: "8px",
    transition: "all 0.2s ease",
    ':hover': {
        background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
        padding: "12px 8px",
        margin: "0 -8px",
    }
},

detailLabel: {
    fontSize: "13px",
    color: isDark ? "#94a3b8" : "#64748b",
    fontWeight: "600",
    flex: 1,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "flex",
    alignItems: "center",
    gap: "6px",
},

detailValue: {
    fontSize: "14px",
    color: isDark ? "#f1f5f9" : "#1e293b",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "6px",
},

inlineIcon: {
    marginRight: "6px",
    opacity: "0.8",
},

statusTag: {
    padding: "6px 12px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "600",
    backdropFilter: "blur(10px)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
},

activeTag: {
    background: isDark ? 
        "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.1))" : 
        "linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.1))",
    color: isDark ? "#4ade80" : "#16a34a",
    border: isDark ? "1px solid rgba(74, 222, 128, 0.3)" : "1px solid rgba(34, 197, 94, 0.3)",
},

inactiveTag: {
    background: isDark ? 
        "linear-gradient(135deg, rgba(148, 163, 184, 0.2), rgba(100, 116, 139, 0.1))" : 
        "linear-gradient(135deg, rgba(203, 213, 225, 0.2), rgba(148, 163, 184, 0.1))",
    color: isDark ? "#cbd5e1" : "#64748b",
    border: isDark ? "1px solid rgba(148, 163, 184, 0.3)" : "1px solid rgba(203, 213, 225, 0.4)",
},