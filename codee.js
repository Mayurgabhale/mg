<div style={layout}>
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
                { id: "uploadMonthly", label: "Upload Monthly Active Sheet", icon: FiUpload },
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
            {/* ... your quick stats content ... */}
        </div>

        {/* Today's Travelers */}
        <div style={styles.sideCard}>
            {/* ... your today's travelers content ... */}
        </div>

        {/* Upload Button in Sidebar */}
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <button
                onClick={() => setShowUploadFileSection(true)}
                style={{
                    backgroundColor: '#3182ce',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    width: '100%'
                }}
            >
                <FiUpload style={{ marginRight: 8 }} />
                Upload Button
            </button>
        </div>
    </aside>

    {/* MAIN CONTENT AREA */}
    <main style={styles.mainContent}>
        {/* Show upload section ONLY when Upload Button is clicked */}
        {showUploadFileSection && (
            <div style={styles.uploadMonthlyContainer}>
                {/* Left Side - Main Content */}
                <div style={styles.leftPanel}>
                    <div style={styles.headerSection}>
                        <h2 style={styles.mainTitle}>Upload Monthly Active Sheet</h2>
                        <p style={styles.subtitle}>Upload the latest monthly employee file</p>

                        {/* Close button to hide the section */}
                        <button
                            onClick={() => setShowUploadFileSection(false)}
                            style={styles.closeSectionButton}
                        >
                            <FiX size={16} />
                            Close
                        </button>
                    </div>

                    {/* ======================= */}
                    {/* QUICK FILE UPLOAD SECTION */}
                    {/* ======================= */}
                    <div style={styles.quickUploadSection}>
                        {/* ... your quick file upload content ... */}
                    </div>

                    {/* ======================= */}
                    {/* MONTHLY EMPLOYEE UPLOAD SECTION */}
                    {/* ======================= */}
                    <div style={styles.monthlyUploadSection}>
                        {/* ... your monthly employee upload content ... */}
                    </div>
                </div>
            </div>
        )}

        {/* Show regular tab content when upload section is NOT open */}
        {!showUploadFileSection && (
            <>
                {/* Regions Tab */}
                {activeTab === "regions" && (
                    <div>
                        {/* Your regions content */}
                    </div>
                )}

                {/* Add New Traveler Tab */}
                {activeTab === "AddNewTraveler" && (
                    <div>
                        {/* Your add new traveler content */}
                    </div>
                )}

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div>
                        {/* Your overview content */}
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === "analytics" && (
                    <div>
                        {/* Your analytics content */}
                    </div>
                )}

                {/* Recent Travels Tab */}
                {activeTab === "recent" && (
                    <div>
                        {/* Your recent travels content */}
                    </div>
                )}

                {/* Country Analysis Tab */}
                {activeTab === "countries" && (
                    <div>
                        {/* Your country analysis content */}
                    </div>
                )}

                {/* Travel Types Tab */}
                {activeTab === "types" && (
                    <div>
                        {/* Your travel types content */}
                    </div>
                )}

                {/* Upload Monthly Tab - Show only a message or empty state */}
                {activeTab === "uploadMonthly" && !showUploadFileSection && (
                    <div style={styles.emptyTabState}>
                        <FiUpload size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
                        <h3 style={{ color: '#374151', marginBottom: '8px' }}>Upload Monthly Data</h3>
                        <p style={{ color: '#6b7280' }}>
                            Click the "Upload Button" in the sidebar to upload monthly employee data
                        </p>
                    </div>
                )}
            </>
        )}
    </main>
</div>