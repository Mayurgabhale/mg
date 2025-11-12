{/* 👥 Sample Travelers */}
<div style={styles.sampleTravelers}>
  <h5 style={styles.sampleTitle}>Recent Travelers:</h5>

  {(() => {
    const isExpanded = expandedCities?.[cityName] || false;
    const displayedTravelers = isExpanded
      ? cityData.sample_items
      : cityData.sample_items?.slice(0, 3);

    return (
      <>
        {displayedTravelers?.map((traveler, index) => (
          <div key={index} style={styles.travelerItem}>
            <div style={styles.travelerInfo}>
              <span style={styles.travelerName}>
                {traveler.first_name} {traveler.last_name}
              </span>
              <span style={styles.travelerId}>{traveler.emp_id}</span>
            </div>
            <div
              style={
                traveler.active_now
                  ? styles.activeStatusSmall
                  : styles.inactiveStatusSmall
              }
            >
              {traveler.active_now ? "Active" : "Completed"}
            </div>
          </div>
        ))}

        {cityData.sample_items?.length > 3 && (
          <div
            style={{
              ...styles.moreTravelers,
              cursor: "pointer",
              color: isExpanded ? "#2563eb" : "#3b82f6",
              textDecoration: "underline",
              transition: "all 0.2s ease-in-out",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#1d4ed8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isExpanded ? "#2563eb" : "#3b82f6";
            }}
            onClick={() =>
              setExpandedCities((prev) => ({
                ...prev,
                [cityName]: !prev?.[cityName],
              }))
            }
          >
            {isExpanded
              ? "Show less ▲"
              : `+${cityData.sample_items.length - 3} more travelers ▼`}
          </div>
        )}
      </>
    );
  })()}
</div>