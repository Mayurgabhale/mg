{/* LEFT PANEL - Navigation */}
<aside style={styles.sidebar}>
    <nav style={styles.nav}>
        {[
            { id: "regions", label: "Global", icon: FiGlobe },
            { id: "AddNewTraveler", label: "Add New Traveler", icon: IoIosAddCircle },
            { id: "overview", label: "Overview", icon: FiActivity },
            { id: "analytics", label: "Analytics", icon: FiBarChart2 },
            { id: "recent", label: "Recent Travels", icon: FiClock },
            { id: "countries", label: "Country Analysis", icon: FiMapPin },
            { id: "types", label: "Travel Types", icon: FiAward },
            { id: "incidents", label: "Incidents", icon: FiAlertTriangle }
        ].map(item => (
            <button
                key={item.id}
                onClick={() => {
                    if (item.id === "incidents") {
                        window.location.href = "/incidents";   // ⬅️ OPEN INCIDENT PAGE
                    } else {
                        setActiveTab(item.id);
                    }
                }}
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
</aside>