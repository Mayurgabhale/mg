C:\Users\W0024618\Desktop\swipeData\client\src\pages\EmployeeTravelDashboard.jsx
  { id: "incidents", label: "Incidents", icon: FiAlertTriangle } // choose an icon import or use any existing one

when i click on this i want to opne this incident page ok 
{/* LEFT PANEL - Navigation */}
                <aside style={styles.sidebar}>
                    <nav style={styles.nav}>
                        {[

                            { id: "regions", label: "Global", icon: FiGlobe }, // 🆕 New tab
                            { id: "AddNewTraveler", label: "Add New Traveler", icon: IoIosAddCircle },
                            { id: "overview", label: "Overview", icon: FiActivity },
                            { id: "analytics", label: "Analytics", icon: FiBarChart2 },
                            { id: "recent", label: "Recent Travels", icon: FiClock },
                            { id: "countries", label: "Country Analysis", icon: FiMapPin },
                            { id: "types", label: "Travel Types", icon: FiAward },
                            { id: "incidents", label: "Incidents", icon: FiAlertTriangle } // choose an icon import or use any existing one

                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                style={{
                                    ...styles.navItem,
                                    ...(activeTab === item.id ? styles.navItemActive : {})
                                }}
                            >
                                <item.icon style={styles.navIcon} />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Quick Stats */}
                    <div style={styles.sideCard}>
                        <div style={styles.cardHeader}>
                            <FiTrendingUp style={styles.cardIcon} />
                            <h3 style={styles.sideTitle}>Quick Stats</h3>
                        </div>
                        <div style={styles.statsGrid}>
                            <div style={styles.statItem}>
                                <div style={styles.statIconWrapper}>
                                    <FiUsers style={styles.statIcon} />
                                </div>
                                <div style={styles.statContent}>
                                    <span style={styles.statLabel}>Total Travelers</span>
                                    <strong style={styles.statValue}>{analytics.totalTravelers}</strong>
                                </div>
                            </div>
                            <div style={styles.statItem}>
