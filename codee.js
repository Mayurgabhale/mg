tableHeader: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
},

tableHeaderRight: {
  display: "flex",
  alignItems: "center",
  gap: "12px", // adds nice spacing between button and record count
},

clearRegionButton: {
  background: "transparent",
  border: "1px solid #3b82f6",
  color: "#3b82f6",
  borderRadius: "6px",
  padding: "4px 10px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 500,
  transition: "all 0.2s ease",
},



<div style={styles.tableHeader}>
  <h3 style={styles.tableTitle}>
    {filters.region ? `${filters.region} Travel Records` : "All Travel Records"}
  </h3>

  <div style={styles.tableHeaderRight}>
    {filters.region && (
      <button
        onClick={() => setFilters(prev => ({ ...prev, region: "" }))}
        style={styles.clearRegionButton}
      >
        Clear Region
      </button>
    )}
    <span style={styles.tableBadge}>{filtered.length} records</span>
  </div>
</div>
