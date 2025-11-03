{/* LEFT PANEL - Navigation */}
<aside style={styles.sidebar}>
    <nav style={styles.nav}>
        {[
            { id: "overview", label: "Overview", icon: FiActivity },
            { id: "analytics", label: "Analytics", icon: FiBarChart2 },
            { id: "recent", label: "Recent Travels", icon: FiClock },
            { id: "countries", label: "Country Analysis", icon: FiMapPin },
            { id: "types", label: "Travel Types", icon: FiAward }
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
            {/* ... other stat items */}
        </div>
    </div>

    {/* Today's Travelers */}
    <div style={styles.sideCard}>
        <div style={styles.cardHeader}>
            <FiCalendar style={styles.cardIcon} />
            <h3 style={styles.sideTitle}>Today's Travelers</h3>
        </div>
        {todayTravelers.length === 0 ? (
            <div style={styles.emptyState}>
                <FiFileText size={24} style={{ color: '#9ca3af', marginBottom: '8px' }} />
                <p style={styles.sideEmpty}>No travels today</p>
            </div>
        ) : (
            <ul style={styles.countryList}>
                {todayTravelers.slice(0, 5).map((t, i) => (
                    <li key={i} style={styles.countryItem}>
                        <div style={styles.countryInfo}>
                            <span style={styles.countryRank}>{i + 1}</span>
                            <span style={styles.countryName}>
                                {t.first_name} {t.last_name}
                            </span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {t.from_country} → {t.to_country}
                        </div>
                    </li>
                ))}
            </ul>
        )}
    </div>
</aside>