// track which city cards are expanded
const [expandedCities, setExpandedCities] = useState({});





{/* 👥 Sample Travelers */}
<div style={styles.sampleTravelers}>
  <h5 style={styles.sampleTitle}>Recent Travelers:</h5>

  {/* keep track of whether we expanded this city */}
  {(() => {
    // create a per-city key to store toggle state
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
            style={styles.moreTravelers}
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