now inthis i want to add new tab :: upload monhlty active sheet ok,. 
    this after uplod i wnat to disply uploadwer data alos and more in this ta ok,, that you like 
{ id: "regions", label: "Global", icon: FiGlobe }, // 🆕 New tab
                            { id: "AddNewTraveler", label: "Add New Traveler", icon: IoIosAddCircle },
                            { id: "overview", label: "Overview", icon: FiActivity },
                            { id: "analytics", label: "Analytics", icon: FiBarChart2 },
                            { id: "recent", label: "Recent Travels", icon: FiClock },
                            { id: "countries", label: "Country Analysis", icon: FiMapPin },
                            { id: "types", label: "Travel Types", icon: FiAward }
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
                            <div style={styles.statItem}>
                                <div style={{ ...styles.statIconWrapper, background: '#dcfce7' }}>
                                    <FiCheckCircle style={{ ...styles.statIcon, color: '#16a34a' }} />
                                </div>
                                <div style={statContent}>
                                    <span style={styles.statLabel}>Active Now</span>
                                    <strong style={styles.statValue}>{analytics.active}</strong>
                                </div>
                            </div>

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

 {/* Add New Traveler Tab */}
                    {activeTab === "AddNewTraveler" && (
                        <div style={styles.addTravelContainer}>
                            {/* Header Section */}
                            <div style={styles.addTravelHeader}>
                                <div style={styles.headerLeft}>
                                    <div style={styles.headerIconLarge}>
                                        <FiUserPlus size={32} />
                                    </div>
                                    <div>
                                        <h2 style={styles.addTravelTitle}>Add New Traveler</h2>
                                        <p style={styles.addTravelSubtitle}>Enter details for the new travel record</p>
                                    </div>
                                </div>
                                <div style={styles.headerStats}>
                                    <div style={styles.statCard}>
                                        <FiUsers size={20} style={{ color: '#3b82f6' }} />
                                        <div>
                                            <span style={styles.statNumber}>{analytics.totalTravelers}</span>
                                            <span style={styles.statLabel}>Total Travelers</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Container */}
                            <div style={styles.formMainContainer}>
                                <div style={styles.formCard}>
                                    {/* Form Header */}
                                    <div style={styles.formHeader}>
                                        <div style={styles.formIcon}>
                                            <FiUserPlus size={24} />
                                        </div>
                                        <div>
                                            <h3 style={styles.formTitle}>Traveler Information</h3>
                                            <p style={styles.formSubtitle}>Fill in all required details</p>
                                        </div>
                                    </div>

                                    {/* Form Sections */}
                                    <div style={styles.formSections}>
                                        {/* Personal Information */}
                                        <div style={styles.formSection}>
                                            <h4 style={styles.sectionTitle}>
                                                <FiUser style={styles.sectionIcon} />
                                                Personal Information
                                            </h4>
                                            <div style={styles.sectionGrid}>
                                                {[
                                                    { key: 'first_name', label: 'First Name', type: 'text', icon: FiUser, required: true },
                                                    { key: 'last_name', label: 'Last Name', type: 'text', icon: FiUser, required: true },
                                                    { key: 'emp_id', label: 'Employee ID', type: 'text', icon: FiAward, required: true },
                                                    { key: 'email', label: 'Email Address', type: 'email', icon: FiMail, required: true },
                                                ].map(({ key, label, type, icon: Icon, required }) => (
                                                    <div key={key} style={styles.inputGroup}>
                                                        <label style={styles.inputLabel}>
                                                            <Icon size={16} style={styles.labelIcon} />
                                                            {label}
                                                            {required && <span style={styles.required}>*</span>}
                                                        </label>
                                                        <input
                                                            type={type}
                                                            value={newTraveler[key] || ''}
                                                            onChange={(e) => setNewTraveler({ ...newTraveler, [key]: e.target.value })}
                                                            style={styles.formInput}
                                                            placeholder={`Enter ${label.toLowerCase()}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Travel Details */}
                                        <div style={styles.formSection}>
                                            <h4 style={styles.sectionTitle}>
                                                <FiGlobe style={styles.sectionIcon} />
                                                Travel Details
                                            </h4>
                                            <div style={styles.sectionGrid}>
                                                {[
                                                    { key: 'leg_type', label: 'Travel Type', type: 'text', icon: FiNavigation, required: true },
                                                    { key: 'from_location', label: 'From Location', type: 'text', icon: FiMapPin, required: true },
                                                    { key: 'from_country', label: 'From Country', type: 'text', icon: FiGlobe, required: true },
                                                    { key: 'to_location', label: 'To Location', type: 'text', icon: FiMapPin, required: true },
                                                    { key: 'to_country', label: 'To Country', type: 'text', icon: FiGlobe, required: true },
                                                ].map(({ key, label, type, icon: Icon, required }) => (
                                                    <div key={key} style={styles.inputGroup}>
                                                        <label style={styles.inputLabel}>
                                                            <Icon size={16} style={styles.labelIcon} />
                                                            {label}
                                                            {required && <span style={styles.required}>*</span>}
                                                        </label>
                                                        <input
                                                            type={type}
                                                            value={newTraveler[key] || ''}
                                                            onChange={(e) => setNewTraveler({ ...newTraveler, [key]: e.target.value })}
                                                            style={styles.formInput}
                                                            placeholder={`Enter ${label.toLowerCase()}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Timeline */}
                                        <div style={styles.formSection}>
                                            <h4 style={styles.sectionTitle}>
                                                <FiCalendar style={styles.sectionIcon} />
                                                Travel Timeline
                                            </h4>
                                            <div style={styles.sectionGrid}>
                                                {[
                                                    { key: 'begin_dt', label: 'Start Date & Time', type: 'datetime-local', icon: FiCalendar, required: true },
                                                    { key: 'end_dt', label: 'End Date & Time', type: 'datetime-local', icon: FiCalendar, required: true },
                                                ].map(({ key, label, type, icon: Icon, required }) => (
                                                    <div key={key} style={styles.inputGroup}>
                                                        <label style={styles.inputLabel}>
                                                            <Icon size={16} style={styles.labelIcon} />
                                                            {label}
                                                            {required && <span style={styles.required}>*</span>}
                                                        </label>
                                                        <input
                                                            type={type}
                                                            value={newTraveler[key] || ''}
                                                            onChange={(e) => setNewTraveler({ ...newTraveler, [key]: e.target.value })}
                                                            style={styles.formInput}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div style={styles.formActions}>
                                        <button
                                            onClick={() => setActiveTab('overview')}
                                            style={styles.secondaryButton}
                                        >
                                            <FiArrowLeft size={16} />
                                            Back to Overview
                                        </button>
                                        <div style={styles.primaryActions}>
                                            <button
                                                onClick={() => setNewTraveler({})}
                                                style={styles.clearButton}
                                            >
                                                <FiRefreshCw size={16} />
                                                Clear Form
                                            </button>
                                            <button
                                                onClick={addTraveler}
                                                style={styles.saveButton}
                                            >
                                                <FiSave size={16} />
                                                Save Traveler
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Tips Sidebar */}
                                <div style={styles.tipsCard}>
                                    <h4 style={styles.tipsTitle}>
                                        <FiInfo size={18} />
                                        Quick Tips
                                    </h4>
                                    <div style={styles.tipsList}>
                                        <div style={styles.tipItem}>
                                            <FiCheckCircle size={14} style={{ color: '#10b981' }} />
                                            <span>Fill all required fields marked with *</span>
                                        </div>
                                        <div style={styles.tipItem}>
                                            <FiCheckCircle size={14} style={{ color: '#10b981' }} />
                                            <span>Use proper date and time format</span>
                                        </div>
                                        <div style={styles.tipItem}>
                                            <FiCheckCircle size={14} style={{ color: '#10b981' }} />
                                            <span>Double-check email addresses</span>
                                        </div>
                                        <div style={styles.tipItem}>
                                            <FiCheckCircle size={14} style={{ color: '#10b981' }} />
                                            <span>Ensure employee ID is unique</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* //////// */}

                    {activeTab === "overview" && (
