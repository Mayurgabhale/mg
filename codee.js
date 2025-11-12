Total: 33  is this but show only this i want to sho all ok 
Denver
33
travelers
Total: 33
Active: 28
Recent Travelers:
KAROLIS KEVALAS
Active
KAROLIS KEVALAS
Active
KAROLIS KEVALAS
Active
KAROLIS KEVALAS
Active
FRANCISCO JAVIER PEREZ ROMERO
Active
TYLER BROWN
Active
SHARI GALE
Active
CARL PIERCE
Active
GIOVANNI NAJERA
Active
GIOVANNI NAJERA
Active
Show less ▲  {/* Region Analysis Tab */}
                            {/* 🌍 REGION ANALYSIS TAB */}
                            {activeTab === "regions" && (
                                <div style={styles.regionsContainer}>
                                    {/* Header */}
                                    <div style={styles.regionsHeader}>
                                        <div style={styles.headerLeft}>
                                            <div style={styles.headerIconLarge}>
                                                <FiGlobe size={32} />
                                            </div>
                                            <div>
                                                <h2 style={styles.regionsTitle}>Region Analysis</h2>
                                                <p style={styles.regionsSubtitle}>Travel distribution across global regions</p>
                                            </div>
                                        </div>
                                        <div style={styles.headerStats}>
                                            <div style={styles.statCard}>
                                                <FiMap size={20} style={{ color: "#3b82f6" }} />
                                                <div>
                                                    <span style={styles.statNumber}>
                                                        {Object.keys(regionsData || {}).length}
                                                    </span>
                                                    <span style={styles.statLabel}>Regions</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ✅ Conditional: Region Details or Region Overview */}
                                    {selectedRegion && regionDetails ? (
                                        /* 🗺️ Region Details View */
                                        <div style={styles.regionDetailsContainer}>
                                            <div style={styles.regionDetailsHeader}>
                                                <button
                                                    onClick={() => {
                                                        setSelectedRegion(null);
                                                        setRegionDetails(null);
                                                    }}
                                                    style={styles.backButton}
                                                >
                                                    <FiArrowLeft size={16} />
                                                    Back to Regions
                                                </button>
                                                <h3 style={styles.regionDetailsTitle}>
                                                    {selectedRegion} Region Details
                                                </h3>

                                                <div style={styles.regionStats}>
                                                    <div style={styles.regionStat}>
                                                        <span style={styles.regionStatValue}>
                                                            {regionDetails.total_count || 0}
                                                        </span>
                                                        <span style={styles.regionStatLabel}>Total Travelers</span>
                                                    </div>
                                                    <div style={styles.regionStat}>
                                                        <span style={styles.regionStatValue}>
                                                            {regionDetails.active_count || 0}
                                                        </span>
                                                        <span style={styles.regionStatLabel}>Active Now</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 🏙️ Cities Breakdown */}
                                            <div style={styles.citiesGrid}>
                                                {Object.entries(regionDetails.cities || {}).map(([cityName, cityData]) => (
                                                    <div key={cityName} style={styles.cityCard}>
                                                        <div style={styles.cityHeader}>
                                                            <FiMapPin style={styles.cityIcon} />
                                                            <h4 style={styles.cityName}>{cityName}</h4>
                                                            <div style={styles.cityStats}>
                                                                <span style={styles.cityCount}>{cityData.total_count}</span>
                                                                <span style={styles.cityLabel}>travelers</span>
                                                            </div>
                                                        </div>

                                                        <div style={styles.cityDetails}>
                                                            <div style={styles.cityStat}>
                                                                <FiUsers size={14} />
                                                                <span>Total: {cityData.total_count}</span>
                                                            </div>
                                                            <div style={styles.cityStat}>
                                                                <FiActivity size={14} />
                                                                <span>Active: {cityData.active_count}</span>
                                                            </div>
                                                        </div>


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


                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        /* 🌎 Regions Overview Grid */
                                        <div style={styles.regionsGrid}>
                                            {Object.entries(regionsData || {}).map(([regionCode, regionData]) => (
                                                <div
                                                    key={regionCode}
                                                    style={{
                                                        ...styles.regionCard,
                                                        borderLeft: `4px solid ${getRegionColor(regionCode)}`
                                                    }}
                                                    onClick={() => fetchRegionDetails(regionCode)}
                                                >
                                                    <div style={styles.regionHeader}>
                                                        <div style={styles.regionIcon}>
                                                            <span style={{ fontSize: 20 }}>
                                                                {getRegionIcon(regionCode)}
                                                            </span>
                                                        </div>
                                                        <h3 style={styles.regionName}>{regionCode}</h3>

                                                        <div style={styles.regionStats}>
                                                            <div style={styles.regionStat}>
                                                                <span style={styles.regionStatValue}>
                                                                    {regionData.total_count}
                                                                </span>
                                                                <span style={styles.regionStatLabel}>Total</span>
                                                            </div>
                                                            <div style={styles.regionStat}>
                                                                <span
                                                                    style={{
                                                                        ...styles.regionStatValue,
                                                                        color:
                                                                            regionData.active_count > 0
                                                                                ? "#16a34a"
                                                                                : "#6b7280"
                                                                    }}
                                                                >
                                                                    {regionData.active_count}
                                                                </span>
                                                                <span style={styles.regionStatLabel}>Active</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* 🏙️ Top Cities */}
                                                    <div style={styles.citiesPreview}>
                                                        <span style={styles.citiesLabel}>Top Cities:</span>
                                                        <div style={styles.citiesList}>
                                                            {Object.keys(regionData.cities || {})
                                                                .slice(0, 3)
                                                                .map((city) => (
                                                                    <span key={city} style={styles.cityTag}>
                                                                        {city}
                                                                    </span>
                                                                ))}
                                                            {Object.keys(regionData.cities || {}).length > 3 && (
                                                                <span style={styles.moreCities}>
                                                                    +
                                                                    {Object.keys(regionData.cities || {}).length -
                                                                        3}{" "}
                                                                    more
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div style={styles.viewDetails}>Click to view details →</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

