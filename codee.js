const getStyles = (isDark) => ({
    // ... your existing styles ...

    // 🆕 Add Traveler Section Styles
    addTravelerSection: {
        margin: "24px 0",
        padding: "0",
    },

    addButton: {
        background: isDark ? 
            "linear-gradient(135deg, #2563eb, #1d4ed8)" : 
            "linear-gradient(135deg, #3b82f6, #2563eb)",
        color: "white",
        padding: "12px 20px",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        width: "100%",
        transition: "all 0.3s ease",
        boxShadow: isDark ? 
            "0 4px 12px rgba(37, 99, 235, 0.3)" : 
            "0 4px 12px rgba(37, 99, 235, 0.2)",
        ':hover': {
            transform: "translateY(-2px)",
            boxShadow: isDark ? 
                "0 8px 20px rgba(37, 99, 235, 0.4)" : 
                "0 8px 20px rgba(37, 99, 235, 0.3)",
        }
    },

    cancelButton: {
        background: isDark ? 
            "linear-gradient(135deg, #6b7280, #4b5563)" : 
            "linear-gradient(135deg, #9ca3af, #6b7280)",
        color: "white",
        padding: "12px 20px",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        width: "100%",
        transition: "all 0.3s ease",
        boxShadow: isDark ? 
            "0 4px 12px rgba(107, 114, 128, 0.3)" : 
            "0 4px 12px rgba(107, 114, 128, 0.2)",
        ':hover': {
            transform: "translateY(-2px)",
            boxShadow: isDark ? 
                "0 8px 20px rgba(107, 114, 128, 0.4)" : 
                "0 8px 20px rgba(107, 114, 128, 0.3)",
        }
    },

    buttonContent: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
    },

    addFormContainer: {
        marginTop: "16px",
        padding: "20px",
        background: isDark ? 
            "linear-gradient(135deg, #1f2937, #111827)" : 
            "linear-gradient(135deg, #ffffff, #f9fafb)",
        borderRadius: "16px",
        boxShadow: isDark ? 
            "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255,255,255,0.1)" : 
            "0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.05)",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
        backdropFilter: "blur(10px)",
    },

    formHeader: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "20px",
        paddingBottom: "16px",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
    },

    formIcon: {
        background: isDark ? 
            "linear-gradient(135deg, #8b5cf6, #3b82f6)" : 
            "linear-gradient(135deg, #8b5cf6, #3b82f6)",
        color: "white",
        padding: "10px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    formTitle: {
        fontSize: "18px",
        fontWeight: "700",
        color: isDark ? "#f9fafb" : "#111827",
        margin: "0 0 4px 0",
    },

    formSubtitle: {
        fontSize: "12px",
        color: isDark ? "#9ca3af" : "#6b7280",
        margin: 0,
    },

    formGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        marginBottom: "20px",
    },

    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },

    inputLabel: {
        fontSize: "12px",
        fontWeight: "600",
        color: isDark ? "#d1d5db" : "#374151",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },

    labelIcon: {
        color: isDark ? "#9ca3af" : "#6b7280",
        opacity: "0.7",
    },

    formInput: {
        padding: "10px 12px",
        borderRadius: "8px",
        border: isDark ? 
            "1px solid rgba(255,255,255,0.2)" : 
            "1px solid #d1d5db",
        background: isDark ? "rgba(17, 24, 39, 0.5)" : "white",
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
        gap: "12px",
        justifyContent: "flex-end",
        paddingTop: "16px",
        borderTop: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
    },

    secondaryButton: {
        background: isDark ? 
            "linear-gradient(135deg, #4b5563, #374151)" : 
            "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
        color: isDark ? "#d1d5db" : "#374151",
        border: "none",
        padding: "10px 20px",
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
        padding: "10px 20px",
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
});