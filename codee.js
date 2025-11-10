can you desnt this   {activeTab === "uploadMonthly" && (  

  
{/* Region Analysis Tab */}
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
                                        <FiMap size={20} style={{ color: '#3b82f6' }} />
                                        <div>
                                            <span style={styles.statNumber}>{Object.keys(regionsData).length}</span>
                                            <span style={styles.statLabel}>Regions</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {selectedRegion ? (
                                /* Region Details View */
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
                                                <span style={styles.regionStatValue}>{regionDetails?.total_count || 0}</span>
                                                <span style={styles.regionStatLabel}>Total Travelers</span>
                                            </div>
                                            <div style={styles.regionStat}>
                                                <span style={styles.regionStatValue}>{regionDetails?.active_count || 0}</span>
                                                <span style={styles.regionStatLabel}>Active Now</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cities in this Region */}
                                    <div style={styles.citiesGrid}>
                                        {Object.entries(regionDetails?.cities || {}).map(([cityName, cityData]) => (
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

                                                {/* Sample Travelers */}
                                                <div style={styles.sampleTravelers}>
                                                    <h5 style={styles.sampleTitle}>Recent Travelers:</h5>
                                                    {cityData.sample_items?.slice(0, 3).map((traveler, index) => (
                                                        <div key={index} style={styles.travelerItem}>
                                                            <div style={styles.travelerInfo}>
                                                                <span style={styles.travelerName}>
                                                                    {traveler.first_name} {traveler.last_name}
                                                                </span>
                                                                <span style={styles.travelerId}>{traveler.emp_id}</span>
                                                            </div>
                                                            <div style={traveler.active_now ? styles.activeStatusSmall : styles.inactiveStatusSmall}>
                                                                {traveler.active_now ? 'Active' : 'Completed'}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {cityData.sample_items?.length > 3 && (
                                                        <div style={styles.moreTravelers}>
                                                            +{cityData.sample_items.length - 3} more travelers
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* Regions Overview View */
                                <div style={styles.regionsGrid}>
                                    {Object.entries(regionsData).map(([regionCode, regionData]) => (
                                        <div
                                            key={regionCode}
                                            style={styles.regionCard}
                                            onClick={() => fetchRegionDetails(regionCode)}
                                        >
                                            <div style={styles.regionHeader}>
                                                <div style={styles.regionIcon}>
                                                    <FiGlobe size={20} />
                                                </div>
                                                <h3 style={styles.regionName}>{regionCode}</h3>
                                                <div style={styles.regionStats}>
                                                    <div style={styles.regionStat}>
                                                        <span style={styles.regionStatValue}>{regionData.total_count}</span>
                                                        <span style={styles.regionStatLabel}>Total</span>
                                                    </div>
                                                    <div style={styles.regionStat}>
                                                        <span style={{
                                                            ...styles.regionStatValue,
                                                            color: regionData.active_count > 0 ? '#16a34a' : '#6b7280'
                                                        }}>
                                                            {regionData.active_count}
                                                        </span>
                                                        <span style={styles.regionStatLabel}>Active</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Top Cities Preview */}
                                            <div style={styles.citiesPreview}>
                                                <span style={styles.citiesLabel}>Top Cities:</span>
                                                <div style={styles.citiesList}>
                                                    {Object.keys(regionData.cities || {}).slice(0, 3).map(city => (
                                                        <span key={city} style={styles.cityTag}>{city}</span>
                                                    ))}
                                                    {Object.keys(regionData.cities || {}).length > 3 && (
                                                        <span style={styles.moreCities}>
                                                            +{Object.keys(regionData.cities || {}).length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div style={styles.viewDetails}>
                                                Click to view details →
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "uploadMonthly" && (
                        <div style={styles.uploadContainer}>
                            {/* Header */}
                            <div style={styles.uploadHeader}>
                                <div style={styles.headerLeft}>
                                    <FiUpload size={32} style={{ color: '#3b82f6', marginRight: 10 }} />
                                    <div>
                                        <h2 style={styles.uploadTitle}>Upload Monthly Active Sheet</h2>
                                        <p style={styles.uploadSubtitle}>
                                            Upload the latest monthly employee file to update active staff records.
                                        </p>
                                    </div>
                                </div>
                            </div>
                      
    // 🆕 Region Analysis Styles
    regionsContainer: {
        padding: "0",
    },

    regionsHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px",
        background: isDark ?
            "linear-gradient(135deg, #1e293b, #0f172a)" :
            "linear-gradient(135deg, #f8fafc, #e2e8f0)",
        borderRadius: "12px",
        marginBottom: "24px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
    },

    regionsTitle: {
        fontSize: "24px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
        margin: "0 0 4px 0",
    },

    regionsSubtitle: {
        fontSize: "14px",
        color: isDark ? "#94a3b8" : "#64748b",
        margin: "0",
    },

    regionsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px",
    },

    regionCard: {
        background: isDark ? "#1e293b" : "white",
        padding: "20px",
        borderRadius: "12px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: isDark ?
            "0 4px 6px -1px rgba(0, 0, 0, 0.3)" :
            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        ':hover': {
            transform: "translateY(-4px)",
            boxShadow: isDark ?
                "0 8px 25px -3px rgba(0, 0, 0, 0.4)" :
                "0 8px 25px -3px rgba(0, 0, 0, 0.15)",
        }
    },

    regionHeader: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "16px",
    },

    regionIcon: {
        background: isDark ?
            "linear-gradient(135deg, #8b5cf6, #3b82f6)" :
            "linear-gradient(135deg, #8b5cf6, #3b82f6)",
        color: "white",
        padding: "8px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    regionName: {
        fontSize: "18px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
        margin: "0",
        flex: 1,
    },

    regionStats: {
        display: "flex",
        gap: "12px",
    },

    regionStat: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
    },

    regionStatValue: {
        fontSize: "18px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
    },

    regionStatLabel: {
        fontSize: "11px",
        color: isDark ? "#94a3b8" : "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },

    citiesPreview: {
        marginBottom: "12px",
    },

    citiesLabel: {
        fontSize: "12px",
        color: isDark ? "#94a3b8" : "#6b7280",
        fontWeight: "600",
        marginBottom: "6px",
        display: "block",
    },

    citiesList: {
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
    },

    cityTag: {
        background: isDark ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)",
        color: isDark ? "#93c5fd" : "#1d4ed8",
        padding: "4px 8px",
        borderRadius: "6px",
        fontSize: "11px",
        fontWeight: "500",
    },

    moreCities: {
        color: isDark ? "#94a3b8" : "#6b7280",
        fontSize: "11px",
        fontStyle: "italic",
    },

    viewDetails: {
        fontSize: "12px",
        color: isDark ? "#3b82f6" : "#2563eb",
        fontWeight: "600",
        textAlign: "center",
        paddingTop: "8px",
        borderTop: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #f1f5f9",
    },

    // Region Details Styles
    regionDetailsContainer: {
        background: isDark ? "#1e293b" : "white",
        borderRadius: "12px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
        overflow: "hidden",
    },

    regionDetailsHeader: {
        padding: "24px",
        background: isDark ?
            "linear-gradient(135deg, #1e293b, #0f172a)" :
            "linear-gradient(135deg, #f8fafc, #e2e8f0)",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
    },

    backButton: {
        background: "none",
        border: "none",
        color: isDark ? "#3b82f6" : "#2563eb",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        marginBottom: "12px",
        padding: "0",
    },

    regionDetailsTitle: {
        fontSize: "20px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
        margin: "0 0 16px 0",
    },

    citiesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "16px",
        padding: "24px",
    },

    cityCard: {
        background: isDark ? "rgba(30, 41, 59, 0.5)" : "#f8fafc",
        padding: "16px",
        borderRadius: "8px",
        border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0",
    },

    cityHeader: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "12px",
    },

    cityIcon: {
        color: "#ef4444",
    },

    cityName: {
        fontSize: "16px",
        fontWeight: "600",
        color: isDark ? "#f1f5f9" : "#0f172a",
        margin: "0",
        flex: 1,
    },

    cityStats: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    cityCount: {
        fontSize: "18px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
    },

    cityLabel: {
        fontSize: "10px",
        color: isDark ? "#94a3b8" : "#6b7280",
        textTransform: "uppercase",
    },

    cityDetails: {
        display: "flex",
        gap: "12px",
        marginBottom: "12px",
    },

    cityStat: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "12px",
        color: isDark ? "#cbd5e1" : "#6b7280",
    },

    sampleTravelers: {
        borderTop: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0",
        paddingTop: "12px",
    },

    sampleTitle: {
        fontSize: "12px",
        fontWeight: "600",

                            {/* Upload Form */}
                            <div>
                                <input type="file" onChange={handleMonthlyFileChange} />
                                <button onClick={uploadMonthlySheet} disabled={!monthlyFile}>
                                    Upload
                                </button>
                                <p>{uploadStatus}</p>
                            </div>

                            {/* Upload Status */}
                            {uploadStatus && (
                                <div style={styles.uploadStatus}>
                                    <p>{uploadStatus}</p>
                                </div>
                            )}

                            {/* Uploaded Data Table */}
                            {employeeData.length > 0 && (
                                <div style={styles.tableContainer}>
                                    <h3 style={styles.tableTitle}>Uploaded Employee Data</h3>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Employee ID</th>
                                                <th>Full Name</th>
                                                <th>Department</th>
                                                <th>Company</th>
                                                <th>Location</th>
                                                <th>Years of Service</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employeeData.map((emp, idx) => (
                                                <tr key={idx}>
                                                    <td>{emp.employee_id}</td>
                                                    <td>{emp.full_name}</td>
                                                    <td>{emp.department_name}</td>
                                                    <td>{emp.company_name}</td>
                                                    <td>{emp.location_city}</td>
                                                    <td>{emp.years_of_service}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
