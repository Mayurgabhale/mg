<button
  onClick={() => setFilters({ ...filters, showVIPOnly: !filters.showVIPOnly })}
  style={{
    ...styles.vipButton,
    backgroundColor: filters.showVIPOnly ? "#facc15" : "#e5e7eb",
    color: filters.showVIPOnly ? "#000" : "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    padding: "6px 12px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
  }}
>
  {filters.showVIPOnly ? "Showing VIP Only" : "View VIP Only"}
</button>