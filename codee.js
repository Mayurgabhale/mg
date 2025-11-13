<div style={styles.regionCard}>
  <div style={styles.regionTitle}>Global</div>

  <div style={styles.regionCardStats}>
    <span style={styles.regionLabel}>Total Travelers</span>
    <span style={styles.regionCount}>
      {regionData.total_count ?? 0}
      <span style={styles.countSeparator}> - </span>
      {regionData.vip_count ?? 0} VIP
    </span>
  </div>

  <div style={styles.regionCardStats}>
    <span style={styles.regionLabel}>Active</span>
    <span style={styles.regionCount}>
      {regionData.active_count ?? 0}
      <span style={styles.countSeparator}> - </span>
      {regionData.active_vip_count ?? 0} Active VIP
    </span>
  </div>
</div>




const styles = {
  regionCard: {
    padding: "12px 16px",
    borderRadius: "16px",
    backgroundColor: isDark ? "#1e293b" : "#f8fafc",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    marginBottom: "16px",
  },
  regionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "6px",
    color: isDark ? "#f8fafc" : "#0f172a",
  },
  regionCardStats: {
    marginBottom: "6px",
  },
  regionLabel: {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: isDark ? "#cbd5e1" : "#64748b",
  },
  regionCount: {
    display: "block",
    fontSize: "18px",
    fontWeight: "700",
    color: isDark ? "#f1f5f9" : "#0f172a",
    lineHeight: "1.2",
  },
  countSeparator: {
    margin: "0 8px",
    fontWeight: "400",
    color: isDark ? "#94a3b8" : "#94a3b8",
  },
};