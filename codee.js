write css for  Clear Region buttin to disply correct postin or or disply left side of   <span style={styles.tableBadge}>{filtered.length} records</span>

<div style={styles.tableHeader}>
                                     
                                        <h3 style={styles.tableTitle}>
                                            {filters.region ? `${filters.region} Travel Records` : "All Travel Records"}
                                        </h3>
                                        {filters.region && (
                                            <button
                                                onClick={() => setFilters(prev => ({ ...prev, region: "" }))}
                                                style={{ marginLeft: "10px", color: "#3b82f6", cursor: "pointer" }}
                                            >
                                                Clear Region
                                            </button>
                                        )}
                                        <span style={styles.tableBadge}>{filtered.length} records</span>
                                    </div>

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
