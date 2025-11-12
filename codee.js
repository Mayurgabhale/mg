<div
    key={regionCode}
    onClick={() => setSelectedRegion(regionCode)} // ✅ Clickable region
    style={{
        ...styles.regionCard,
        cursor: "pointer",
        border:
            selectedRegion === regionCode
                ? "2px solid #3b82f6"
                : "1px solid #e5e7eb",
        boxShadow:
            selectedRegion === regionCode
                ? "0 0 10px rgba(59,130,246,0.4)"
                : "none",
    }}
>





...


onClick={() => setSelectedRegion(null)}
style={{ ...styles.regionCard, cursor: "pointer" }}


...