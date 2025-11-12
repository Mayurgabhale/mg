ok opne but i clikc on this buttin that tinme one but 
when i clicon on this button that time is opne Upload Monthly Active Sheet 
 <div style={layout}>
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

not this ok i hope  you undestand ok 

but i wan to opne when i clik con this button       <FiUpload style={{ marginRight: 8 }} />
                            Upload Button
                        </button>   
ok.. 
 {/* Temporary test button */}
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
                                cursor: 'pointer'
                            }}
                        >
                            <FiUpload style={{ marginRight: 8 }} />
                            Upload Button
                        </button>
                    </div>

                    {/* file upload sectin ⬇️⬇️ */}
                    {/* Compact File Upload Section */}

                    {activeTab === "uploadMonthly" && (
                        <div>
                            {/* Show this button initially */}
                            {!showUploadFileSection && (
                                <div style={styles.showUploadButtonContainer}>
                                    <button
                                        onClick={() => setShowUploadFileSection(true)}
                                        style={styles.showUploadButton}
                                    >
                                        <FiUpload style={{ marginRight: 8 }} />
                                        Upload File
                                    </button>
                                    <p style={styles.showUploadHint}>
                                        Click to upload monthly employee data and access analytics
                                    </p>
                                </div>
                            )}

                            {/* Show the entire upload section when button is clicked */}
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
