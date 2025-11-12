this sectin is opne when i clikc on Upload Button this buttion ### not Upload Monthly Active Sheet this buttion ok 
Upload Monthly Active Sheet
Upload the latest monthly employee file

ony this button this sectin is opne when i clikc on Upload Button this buttion

see this is my full code 
<div style={styles.page}>
            <ToastContainer position="top-right" autoClose={3000} theme={isDarkTheme ? "dark" : "light"} />
            {loading && (
                <div style={style.overlay}>
                    <span style={style.loader}></span>
                    <style>{keyframes}</style>
                </div>
            )}

            {/* Traveler Detail Popup */}
            <TravelerDetailPopup
                traveler={selectedTraveler}
                onClose={() => setSelectedTraveler(null)}
            />

            {/* HEADER */}
            {/* HEADER */}
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={styles.headerIcon}>
                        <FiGlobe size={32} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={styles.title}>Employee Travel Details Dashboard</h1>

                    </div>
                    {/* 🆕 Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        style={styles.themeToggleBtn}
                        title={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {isDarkTheme ? <FiSun size={20} /> : <FiMoon size={20} />}
                    </button>
                </div>
            </header>

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

                                        {/* ======================= */}
                                        {/* QUICK FILE UPLOAD SECTION */}
                                        {/* ======================= */}
                                        <div style={styles.quickUploadSection}>
                                            <div style={styles.sectionHeader}>
                                                <FiUpload style={styles.sectionIcon} />
                                                <h3 style={styles.sectionTitle}>Quick File Upload</h3>
                                            </div>

                                            {/* Compact Upload Section */}
                                            <div style={styles.compactUploadRow}>
                                                <div style={styles.compactFileUpload}>
                                                    <input
                                                        type="file"
                                                        accept=".xlsx,.xls,.csv"
                                                        onChange={handleFileChange}
                                                        style={styles.fileInput}
                                                        id="file-upload"
                                                    />
                                                    <label htmlFor="file-upload" style={styles.compactFileLabel}>
                                                        <FiUpload size={16} />
                                                        {file ? file.name : "Choose File"}
                                                    </label>
                                                </div>
                                                <div style={styles.compactButtonGroup}>
                                                    <button
                                                        onClick={uploadFile}
                                                        disabled={loading}
                                                        style={loading ? styles.disabledCompactBtn : styles.compactPrimaryBtn}
                                                    >
                                                        {loading ? (
                                                            <div style={styles.smallSpinner}></div>
                                                        ) : (
                                                            <FiUpload size={14} />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setItems([]);
                                                            setSummary({});
                                                            setFile(null);
                                                            toast.info("Data cleared successfully.");
                                                        }}
                                                        style={styles.compactSecondaryBtn}
                                                    >
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                    <button onClick={exportCsv} style={styles.compactGhostBtn}>
                                                        <FiDownload size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* File Status for Quick Upload */}
                                            {file && (
                                                <div style={styles.fileStatus}>
                                                    <FiFile size={14} style={{ color: '#3b82f6', marginRight: 8 }} />
                                                    <span style={styles.fileStatusText}>
                                                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* ======================= */}
                                        {/* MONTHLY EMPLOYEE UPLOAD SECTION */}
                                        {/* ======================= */}
                                        <div style={styles.monthlyUploadSection}>
                                            <div style={styles.sectionHeader}>
                                                <FiDatabase style={styles.sectionIcon} />
                                                <h3 style={styles.sectionTitle}>Monthly Employee Data</h3>
                                            </div>

                                            {/* DEBUG: Check what's being rendered */}
                                            {console.log('hasUploadedData:', hasUploadedData, 'employeeData length:', employeeData.length)}

                                            {/* ONLY SHOW UPLOAD BUTTON INITIALLY */}
                                            {!hasUploadedData && employeeData.length === 0 && (
                                                <div style={styles.uploadButtonSection}>
                                                    <button
                                                        onClick={() => setShowUploadPopup(true)}
                                                        style={styles.uploadTriggerButton}
                                                    >
                                                        <FiUpload style={{ marginRight: 8 }} />
                                                        Upload Monthly Sheet
                                                    </button>
                                                    <p style={styles.uploadHint}>
                                                        Upload monthly employee data for detailed analytics and reporting
                                                    </p>
                                                </div>
                                            )}

                                            {/* SHOW SUCCESS DATA AFTER UPLOAD - FIXED CONDITION */}
                                            {hasUploadedData && employeeData.length > 0 && (
                                                <div style={styles.successContainer}>
                                                    <div style={styles.successHeader}>
                                                        <div style={styles.successTitleSection}>
                                                            <FiCheckCircle size={24} style={styles.successIcon} />
                                                            <div>
                                                                <h3 style={styles.successTitle}>Data Loaded Successfully</h3>
                                                                <p style={styles.successSubtitle}>
                                                                    {employeeData.length} employee records loaded
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={confirmDeleteData}
                                                            style={styles.deleteDataButton}
                                                        >
                                                            <FiTrash2 size={16} />
                                                            Delete All Data
                                                        </button>
                                                    </div>

                                                    {/* Upload Metadata - FIXED: Check both monthlyFile and uploadTime */}
                                                    {monthlyFile && uploadTime && (
                                                        <div style={styles.metadataGrid}>
                                                            <div style={styles.metadataItem}>
                                                                <span style={styles.metadataLabel}>File Name</span>
                                                                <span style={styles.metadataValue}>{monthlyFile.name}</span>
                                                            </div>
                                                            <div style={styles.metadataItem}>
                                                                <span style={styles.metadataLabel}>File Size</span>
                                                                <span style={styles.metadataValue}>
                                                                    {(monthlyFile.size / 1024 / 1024).toFixed(2)} MB
                                                                </span>
                                                            </div>
                                                            <div style={styles.metadataItem}>
                                                                <span style={styles.metadataLabel}>Upload Date & Time</span>
                                                                <span style={styles.metadataValue}>
                                                                    {uploadTime.toLocaleDateString()} at {uploadTime.toLocaleTimeString()}
                                                                </span>
                                                            </div>
                                                            <div style={styles.metadataItem}>
                                                                <span style={styles.metadataLabel}>Records Processed</span>
                                                                <span style={styles.metadataValue}>{employeeData.length} employees</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Summary Cards */}
                                                    <div style={styles.summaryCard}>
                                                        <h4 style={styles.summaryTitle}>Upload Summary</h4>
                                                        <div style={styles.summaryStats}>
                                                            <div style={styles.summaryStat}>
                                                                <FiUsers style={styles.summaryIcon} />
                                                                <span style={styles.summaryNumber}>{employeeData.length}</span>
                                                                <span style={styles.summaryLabel}>Total Employees</span>
                                                            </div>
                                                            <div style={styles.summaryStat}>
                                                                <FiMapPin style={styles.summaryIcon} />
                                                                <span style={styles.summaryNumber}>
                                                                    {new Set(employeeData.map(emp => emp.location_city)).size}
                                                                </span>
                                                                <span style={styles.summaryLabel}>Locations</span>
                                                            </div>
                                                            <div style={styles.summaryStat}>
                                                                <FiBriefcase style={styles.summaryIcon} />
                                                                <span style={styles.summaryNumber}>
                                                                    {new Set(employeeData.map(emp => emp.department_name)).size}
                                                                </span>
                                                                <span style={styles.summaryLabel}>Departments</span>
                                                            </div>
                                                            <div style={styles.summaryStat}>
                                                                <FaBuilding style={styles.summaryIcon} />
                                                                <span style={styles.summaryNumber}>
                                                                    {new Set(employeeData.map(emp => emp.company_name)).size}
                                                                </span>
                                                                <span style={styles.summaryLabel}>Companies</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Show loading state if data is being fetched */}
                                            {hasUploadedData && employeeData.length === 0 && (
                                                <div style={styles.loadingContainer}>
                                                    <FiLoader size={24} style={{ animation: 'spin 1s linear infinite' }} />
                                                    <p>Loading employee data...</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Upload Popup Modal */}
                                    {showUploadPopup && (
                                        <div style={styles.modalOverlay}>
                                            <div style={styles.modalContent}>
                                                <div style={styles.modalHeader}>
                                                    <h3 style={styles.modalTitle}>Upload Monthly Employee File</h3>
                                                    <button
                                                        onClick={() => setShowUploadPopup(false)}
                                                        style={styles.closeButton}
                                                    >
                                                        <FiX size={20} />
                                                    </button>
                                                </div>

                                                <div style={styles.uploadCard}>
                                                    <div style={styles.uploadArea}>
                                                        <FiUploadCloud size={48} style={styles.uploadCloudIcon} />
                                                        <h3 style={styles.uploadAreaTitle}>Drop your file here</h3>
                                                        <p style={styles.uploadAreaSubtitle}>
                                                            Supports .xlsx, .xls, .csv files up to 10MB
                                                        </p>
                                                        <label htmlFor="monthly-file-upload" style={styles.fileInputLabel}>
                                                            <FiFolder style={{ marginRight: 8 }} />
                                                            Choose File
                                                        </label>
                                                        <input
                                                            id="monthly-file-upload"
                                                            type="file"
                                                            onChange={handleMonthlyFileChange}
                                                            style={styles.hiddenFileInput}
                                                            accept=".xlsx,.xls,.csv"
                                                        />

                                                        {monthlyFile && (
                                                            <div style={styles.filePreview}>
                                                                <FiFile style={styles.fileIcon} />
                                                                <div style={styles.fileInfo}>
                                                                    <span style={styles.fileName}>{monthlyFile.name}</span>
                                                                    <span style={styles.fileSize}>
                                                                        {(monthlyFile.size / 1024 / 1024).toFixed(2)} MB
                                                                    </span>
                                                                </div>
                                                                <button
                                                                    onClick={() => setMonthlyFile(null)}
                                                                    style={styles.removeFileButton}
                                                                >
                                                                    <FiX />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div style={styles.modalActions}>
                                                        <button
                                                            onClick={() => setShowUploadPopup(false)}
                                                            style={styles.cancelButton}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={handleUploadSubmit}
                                                            disabled={!monthlyFile || uploadStatus?.includes('Uploading')}
                                                            style={!monthlyFile ? styles.uploadButtonDisabled : styles.uploadButton}
                                                        >
                                                            {uploadStatus?.includes('Uploading') ? (
                                                                <>
                                                                    <FiLoader size={16} style={{ marginRight: 8, animation: 'spin 1s linear infinite' }} />
                                                                    Uploading...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FiUpload style={{ marginRight: 8 }} />
                                                                    Process Upload
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}


                    {/* file upload sectin ⬇️⬇️ end*/}
                </aside>

                {/* MAIN CONTENT */}
                <main style={styles.main}>
                    {/* File Upload Section */}
                    <div style={styles.card}>
                        {/* Compact Upload Section */}
                        <div style={styles.compactUploadRow}>
                            <div style={styles.compactFileUpload}>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleFileChange}
                                    style={styles.fileInput}
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" style={styles.compactFileLabel}>
                                    <FiUpload size={16} />
                                    {file ? file.name : "Choose File"}
                                </label>
                            </div>
                            <div style={styles.compactButtonGroup}>
                                <button
                                    onClick={uploadFile}
                                    disabled={loading}
                                    style={loading ? styles.disabledCompactBtn : styles.compactPrimaryBtn}
                                >
                                    {loading ? (
                                        <div style={styles.smallSpinner}></div>
                                    ) : (
                                        <FiUpload size={14} />
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setItems([]);
                                        setSummary({});
                                        setFile(null);
                                        toast.info("Data cleared successfully.");
                                    }}
                                    style={styles.compactSecondaryBtn}
                                >
                                    <FiTrash2 size={14} />
                                </button>
                                <button onClick={exportCsv} style={styles.compactGhostBtn}>
                                    <FiDownload size={14} />
                                </button>
                            </div>
                        </div>



                        {/* 📝📝📝📝📝 */}

                        {/* 🆕 Region Count Cards */}
                        <div style={styles.regionCardsSection}>
                            <div style={styles.sectionHeader}>
                                <FiGlobe style={styles.sectionIcon} />
                                <h3 style={styles.sectionTitle}>Regions Overview</h3>
                            </div>
                            <div style={styles.regionCardsGrid}>

                                {/* Total Card */}
                                <div style={styles.regionCard}>
                                    <div style={styles.regionCardHeader}>
                                        <div style={{ ...styles.regionIcon, background: '#3b82f6' }}>
                                            <FiGlobe size={16} />
                                        </div>
                                        <span style={styles.regionName}>Global</span>
                                    </div>

                                    <div style={styles.regionCardStats}>
                                        <span style={styles.regionCount}>{safeItems.length}</span>
                                        <span style={styles.regionLabel}>Total Travelers</span>
                                    </div>

                                    <div style={styles.regionCardActive}>
                                        <div style={styles.activeDot}></div>
                                        <span>{safeItems.filter(r => r.active_now).length} Active</span>
                                        <span style={{ marginLeft: 12, fontWeight: 600 }}>
                                            {safeItems.filter(r => r.is_vip).length} VIP
                                        </span>

                                        {/* ✅ Add this new line for Active VIP count */}
                                        <span style={{ marginLeft: 12, color: '#10b981', fontWeight: 600 }}>
                                            {safeItems.filter(r => r.active_now && r.is_vip).length} Active VIP
                                        </span>
                                    </div>
                                </div>

                                {/* Region Cards */}

                                {/* Region Cards */}
                                {Object.entries(regionsData || {})
                                    .sort(([a], [b]) => {
                                        if (a === 'GLOBAL') return -1;
                                        if (b === 'GLOBAL') return 1;
                                        return a.localeCompare(b);
                                    })
                                    .map(([regionCode, regionData]) => (
                                        <div
                                            key={regionCode}
                                            style={{
                                                ...styles.regionCard,
                                                ...(filters.region === regionCode && styles.regionCardActive),
                                            }}
                                        >
                                            <div style={styles.regionCardHeader}>
                                                <div
                                                    style={{
                                                        ...styles.regionIcon,
                                                        background: getRegionColor(regionCode),
                                                    }}
                                                >
                                                    {getRegionIcon(regionCode)}
                                                </div>
                                                <span style={styles.regionName}>{regionCode}</span>
                                            </div>

                                            <div style={styles.regionCardStats}>
                                                <span style={styles.regionCount}>{regionData.total_count ?? 0}</span>
                                                <span style={styles.regionLabel}>Travelers</span>
                                            </div>

                                            <div style={styles.regionCardActive}>
                                                <div
                                                    style={{
                                                        ...styles.activeDot,
                                                        background:
                                                            (regionData.active_count ?? 0) > 0 ? '#10b981' : '#6b7280',
                                                    }}
                                                ></div>

                                                <span>{regionData.active_count ?? 0} Active</span>

                                                <span style={{ marginLeft: 12, fontWeight: 600 }}>
                                                    {regionData.vip_count ?? 0} VIP
                                                </span>

                                                {/* ✅ New Active VIP count */}
                                                <span style={{ marginLeft: 12, color: '#10b981', fontWeight: 600 }}>
                                                    {regionData.active_vip_count ?? 0} Active VIP
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                            </div>
                        </div>
                        {/* 📝📝📝📝📝 */}



                        {/* Filters Section */}
                        <div style={styles.filtersSection}>
                            <div style={styles.filtersHeader}>
                                <FiFilter style={{ marginRight: '8px', color: '#6b7280' }} />
                                <span style={styles.filtersTitle}>Filters & Search</span>
                            </div>
                            <div style={styles.filtersRow}>
                                <div style={styles.searchWrapper}>
                                    <FiSearch style={styles.searchIcon} />
                                    <input
                                        placeholder="Search travelers..."
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                        style={styles.searchInput}
                                    />
                                </div>

                                <button
                                    onClick={() => setFilters({ ...filters, showVIPOnly: !filters.showVIPOnly })}
                                    style={{
                                        ...styles.vipButton,
                                        backgroundColor: filters.showVIPOnly ? "#facc15" : "#e5e7eb",
                                        color: filters.showVIPOnly ? "#000" : "#374151",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "6px",
                                        padding: "6px 12px",
                                        fontWeight: 500,
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    {filters.showVIPOnly ? "Showing VIP Only" : "View VIP Only"}
                                </button>

                                {/* Region Filter Dropdown */}
                                <select
                                    value={filters.country}
                                    onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                                    style={styles.select}
                                >
                                    <option value="">All Countries</option>
                                    {countries.map((c) => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                                <select
                                    value={filters.legType}
                                    onChange={(e) => setFilters({ ...filters, legType: e.target.value })}
                                    style={styles.select}
                                >
                                    <option value="">All Travel Types</option>
                                    {legTypes.map((t) => (
                                        <option key={t}>{t}</option>
                                    ))}
                                </select>
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    style={styles.select}
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active Only</option>
                                    <option value="inactive">Inactive Only</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 📝📝📝📝 */}


                    {/* Dynamic Content based on Active Tab */}
                    {/* //////// */}
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
                                                    { key: 'begin_date', label: 'Start Date & Time', type: 'datetime-local', icon: FiCalendar, required: true },
                                                    { key: 'end_date', label: 'End Date & Time', type: 'datetime-local', icon: FiCalendar, required: true },
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
                        <div style={styles.card}>
                            <div style={styles.tableHeader}>
                                <h3 style={styles.tableTitle}>All Travel Records</h3>
                                <span style={styles.tableBadge}>{filtered.length} records</span>
                            </div>
                            <div style={styles.tableWrap}>
                                <table style={styles.table}>
                                    <thead style={styles.thead}>
                                        <tr>
                                            <th style={styles.th}>Status</th>
                                            <th style={styles.th}>Traveler</th>
                                            <th style={styles.th}>Emp ID</th>
                                            <th style={styles.th}>Email</th>
                                            <th style={styles.th}>Type</th>
                                            <th style={styles.th}>From</th>
                                            <th style={styles.th}>To</th>
                                            <th style={styles.th}>Start Date</th>
                                            <th style={styles.th}>End Date</th>
                                            <th style={styles.th}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" style={styles.emptyRow}>
                                                    <div style={styles.emptyState}>
                                                        <FiFileText size={32} style={{ color: '#9ca3af', marginBottom: '12px' }} />
                                                        <p>No matching results found</p>
                                                        <p style={styles.emptySubtext}>Upload a file or adjust your filters</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filtered.map((r, i) => (
                                                <tr key={i} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                                                    <td style={styles.td}>
                                                        {r.active_now ? (
                                                            <div style={styles.activeBadge}>
                                                                <FiCheckCircle size={14} />
                                                                Active
                                                            </div>
                                                        ) : (
                                                            <div style={styles.inactiveBadge}>
                                                                <FiXCircle size={14} />
                                                                Inactive
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.userCell}>
                                                            <div style={styles.avatar}>
                                                                <FiUser size={14} />
                                                            </div>
                                                            <span>
                                                                {r.first_name} {r.last_name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.userCell}>
                                                            <span style={styles.empId}>
                                                                {r.emp_id || 'N/A'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.emailCell}>
                                                            <FiMail size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
                                                            {r.email}
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <span style={styles.typeBadge}>{r.leg_type}</span>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.combinedLocationCell}>
                                                            <div style={styles.locationRow}>
                                                                <FiMapPin size={12} style={{ marginRight: '4px', color: '#ef4444' }} />
                                                                <span style={styles.locationText}>
                                                                    {r.from_location || 'N/A'}
                                                                </span>
                                                            </div>
                                                            <div style={styles.countryRow}>
                                                                <FiGlobe size={10} style={{ marginRight: '4px', color: '#3b82f6' }} />
                                                                <span style={styles.countryText}>
                                                                    {r.from_country || 'Unknown'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.combinedLocationCell}>
                                                            <div style={styles.locationRow}>
                                                                <FiMapPin size={12} style={{ marginRight: '4px', color: '#10b981' }} />
                                                                <span style={styles.locationText}>
                                                                    {r.to_location || 'N/A'}
                                                                </span>
                                                            </div>
                                                            <div style={styles.countryRow}>
                                                                <FiGlobe size={10} style={{ marginRight: '4px', color: '#3b82f6' }} />
                                                                <span style={styles.countryText}>
                                                                    {r.to_country || 'Unknown'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.dateCell}>
                                                            <FiCalendar size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
                                                            {fmt(r.begin_date)}
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.dateCell}>
                                                            <FiCalendar size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
                                                            {fmt(r.end_date)}
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <button
                                                            onClick={() => setSelectedTraveler(r)}
                                                            style={styles.viewButton}
                                                        >
                                                            <FiEye size={14} />
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {activeTab === "analytics" && (
                        <div style={styles.analyticsGrid}>
                            <div style={styles.analyticsCard}>
                                <h4 style={styles.analyticsTitle}>Travel Analytics</h4>
                                <div style={styles.analyticsStats}>
                                    <div style={styles.analyticsStat}>
                                        <span style={styles.analyticsLabel}>Average Duration</span>
                                        <strong style={styles.analyticsValue}>{analytics.avgDuration} days</strong>
                                    </div>
                                    <div style={styles.analyticsStat}>
                                        <span style={styles.analyticsLabel}>Total Countries</span>
                                        <strong style={styles.analyticsValue}>{analytics.totalCountries}</strong>
                                    </div>
                                    <div style={styles.analyticsStat}>
                                        <span style={styles.analyticsLabel}>Travel Types</span>
                                        <strong style={styles.analyticsValue}>{analytics.totalTypes}</strong>
                                    </div>
                                </div>
                            </div>

                            <div style={styles.analyticsCard}>
                                <h4 style={styles.analyticsTitle}>Country Distribution</h4>
                                <div style={styles.countryChart}>
                                    {countryStats.slice(0, 5).map((stat, index) => (
                                        <div key={stat.country} style={chartBarWrapper}>
                                            <div style={chartBarLabel}>
                                                <span>{stat.country}</span>
                                                <span>{stat.count}</span>
                                            </div>
                                            <div style={styles.chartBarTrack}>
                                                <div
                                                    style={{
                                                        ...styles.chartBarFill,
                                                        width: `${(stat.count / Math.max(...countryStats.map(s => s.count))) * 100}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "recent" && (
                        <div style={styles.card}>
                            <div style={styles.tableHeader}>
                                <h3 style={styles.tableTitle}>Recent Travels (Last 7 Days)</h3>
                            </div>
                            <div style={styles.tableWrap}>
                                <table style={styles.table}>
                                    <thead style={styles.thead}>
                                        <tr>
                                            <th style={styles.th}>Traveler</th>
                                            <th style={styles.th}>Destination</th>
                                            <th style={styles.th}>Type</th>
                                            <th style={styles.th}>Start Date</th>
                                            <th style={styles.th}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTravelers.map((r, i) => (
                                            <tr key={i} style={i % 2 === 0 ? rowEven : rowOdd}>
                                                <td style={styles.td}>
                                                    <div style={styles.userCell}>
                                                        <div style={styles.avatar}>
                                                            <FiUser size={14} />
                                                        </div>
                                                        {r.first_name} {r.last_name}
                                                    </div>
                                                </td>
                                                <td style={styles.td}>{r.to_country}</td>
                                                <td style={styles.td}>
                                                    <span style={styles.typeBadge}>{r.leg_type}</span>
                                                </td>
                                                <td style={styles.td}>{fmt(r.begin_date)}</td>
                                                <td style={styles.td}>
                                                    {r.active_now ? (
                                                        <div style={styles.activeBadge}>
                                                            <FiCheckCircle size={14} />
                                                            Active
                                                        </div>
                                                    ) : (
                                                        <div style={styles.inactiveBadge}>
                                                            <FiXCircle size={14} />
                                                            Completed
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "countries" && (
                        <div style={styles.card}>
                            <div style={styles.tableHeader}>
                                <h3 style={styles.tableTitle}>Country-wise Analysis</h3>
                            </div>
                            <div style={styles.tableWrap}>
                                <table style={styles.table}>
                                    <thead style={styles.thead}>
                                        <tr>
                                            <th style={styles.th}>Country</th>
                                            <th style={styles.th}>Total Travels</th>
                                            <th style={styles.th}>Active</th>
                                            <th style={styles.th}>Unique Travelers</th>
                                            <th style={styles.th}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {countryStats.map((stat, i) => (
                                            <tr key={i} style={i % 2 === 0 ? rowEven : rowOdd}>
                                                <td style={styles.td}>
                                                    <strong>{stat.country}</strong>
                                                </td>
                                                <td style={styles.td}>{stat.count}</td>
                                                <td style={styles.td}>
                                                    <span style={{ color: stat.active > 0 ? '#16a34a' : '#6b7280' }}>
                                                        {stat.active}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>{stat.travelerCount}</td>
                                                <td style={styles.td}>
                                                    <button style={viewButton}>
                                                        <FiEye size={14} />
                                                        Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "types" && (
                        <div style={styles.card}>
                            <div style={styles.tableHeader}>
                                <h3 style={styles.tableTitle}>Travel Type Analysis</h3>
                            </div>
                            <div style={styles.tableWrap}>
                                <table style={styles.table}>
                                    <thead style={styles.thead}>
                                        <tr>
                                            <th style={styles.th}>Travel Type</th>
                                            <th style={styles.th}>Total</th>
                                            <th style={styles.th}>Active</th>
                                            <th style={styles.th}>Countries</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {travelTypeStats.map((stat, i) => (
                                            <tr key={i} style={i % 2 === 0 ? rowEven : rowOdd}>
                                                <td style={styles.td}>
                                                    <strong>{stat.type}</strong>
                                                </td>
                                                <td style={styles.td}>{stat.count}</td>
                                                <td style={styles.td}>
                                                    <span style={{ color: stat.active > 0 ? '#16a34a' : '#6b7280' }}>
                                                        {stat.active}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>{stat.countryCount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}


                    {/* ................. */}
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
                        <div style={styles.uploadMonthlyContainer}>
                            {/* Left Side - Main Content */}
                            <div style={styles.leftPanel}>
                                <div style={styles.headerSection}>
                                    <h2 style={styles.mainTitle}>Upload Monthly Active Sheet</h2>
                                    <p style={styles.subtitle}>Upload the latest monthly employee file</p>
                                </div>

                                {/* DEBUG: Check what's being rendered */}
                                {console.log('hasUploadedData:', hasUploadedData, 'employeeData length:', employeeData.length)}

                                {/* ONLY SHOW UPLOAD BUTTON INITIALLY */}
                                {!hasUploadedData && employeeData.length === 0 && (
                                    <div style={styles.uploadButtonSection}>
                                        <button
                                            onClick={() => setShowUploadPopup(true)}
                                            style={styles.uploadTriggerButton}
                                        >
                                            <FiUpload style={{ marginRight: 8 }} />
                                            Upload Monthly Sheet
                                        </button>
                                    </div>
                                )}

                                {/* SHOW SUCCESS DATA AFTER UPLOAD - FIXED CONDITION */}
                                {hasUploadedData && employeeData.length > 0 && (
                                    <div style={styles.successContainer}>
                                        <div style={styles.successHeader}>
                                            <div style={styles.successTitleSection}>
                                                <FiCheckCircle size={24} style={styles.successIcon} />
                                                <div>
                                                    <h3 style={styles.successTitle}>Data Loaded Successfully</h3>
                                                    <p style={styles.successSubtitle}>
                                                        {employeeData.length} employee records loaded
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={confirmDeleteData}
                                                style={styles.deleteDataButton}
                                            >
                                                <FiTrash2 size={16} />
                                                Delete All Data
                                            </button>
                                        </div>

                                        {/* Upload Metadata - FIXED: Check both monthlyFile and uploadTime */}
                                        {monthlyFile && uploadTime && (
                                            <div style={styles.metadataGrid}>
                                                <div style={styles.metadataItem}>
                                                    <span style={styles.metadataLabel}>File Name</span>
                                                    <span style={styles.metadataValue}>{monthlyFile.name}</span>
                                                </div>
                                                <div style={styles.metadataItem}>
                                                    <span style={styles.metadataLabel}>File Size</span>
                                                    <span style={styles.metadataValue}>
                                                        {(monthlyFile.size / 1024 / 1024).toFixed(2)} MB
                                                    </span>
                                                </div>
                                                <div style={styles.metadataItem}>
                                                    <span style={styles.metadataLabel}>Upload Date & Time</span>
                                                    <span style={styles.metadataValue}>
                                                        {uploadTime.toLocaleDateString()} at {uploadTime.toLocaleTimeString()}
                                                    </span>
                                                </div>
                                                <div style={styles.metadataItem}>
                                                    <span style={styles.metadataLabel}>Records Processed</span>
                                                    <span style={styles.metadataValue}>{employeeData.length} employees</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Summary Cards */}
                                        <div style={styles.summaryCard}>
                                            <h4 style={styles.summaryTitle}>Upload Summary</h4>
                                            <div style={styles.summaryStats}>
                                                <div style={styles.summaryStat}>
                                                    <FiUsers style={styles.summaryIcon} />
                                                    <span style={styles.summaryNumber}>{employeeData.length}</span>
                                                    <span style={styles.summaryLabel}>Total Employees</span>
                                                </div>
                                                <div style={styles.summaryStat}>
                                                    <FiMapPin style={styles.summaryIcon} />
                                                    <span style={styles.summaryNumber}>
                                                        {new Set(employeeData.map(emp => emp.location_city)).size}
                                                    </span>
                                                    <span style={styles.summaryLabel}>Locations</span>
                                                </div>
                                                <div style={styles.summaryStat}>
                                                    <FiBriefcase style={styles.summaryIcon} />
                                                    <span style={styles.summaryNumber}>
                                                        {new Set(employeeData.map(emp => emp.department_name)).size}
                                                    </span>
                                                    <span style={styles.summaryLabel}>Departments</span>
                                                </div>
                                                <div style={styles.summaryStat}>
                                                    <FaBuilding style={styles.summaryIcon} />
                                                    <span style={styles.summaryNumber}>
                                                        {new Set(employeeData.map(emp => emp.company_name)).size}
                                                    </span>
                                                    <span style={styles.summaryLabel}>Companies</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Show loading state if data is being fetched */}
                                {hasUploadedData && employeeData.length === 0 && (
                                    <div style={styles.loadingContainer}>
                                        <FiLoader size={24} style={{ animation: 'spin 1s linear infinite' }} />
                                        <p>Loading employee data...</p>
                                    </div>
                                )}
                            </div>

                            {/* Upload Popup Modal */}
                            {showUploadPopup && (
                                <div style={styles.modalOverlay}>
                                    <div style={styles.modalContent}>
                                        <div style={styles.modalHeader}>
                                            <h3 style={styles.modalTitle}>Upload Monthly Employee File</h3>
                                            <button
                                                onClick={() => setShowUploadPopup(false)}
                                                style={styles.closeButton}
                                            >
                                                <FiX size={20} />
                                            </button>
                                        </div>

                                        <div style={styles.uploadCard}>
                                            <div style={styles.uploadArea}>
                                                <FiUploadCloud size={48} style={styles.uploadCloudIcon} />
                                                <h3 style={styles.uploadAreaTitle}>Drop your file here</h3>
                                                <p style={styles.uploadAreaSubtitle}>
                                                    Supports .xlsx, .xls, .csv files up to 10MB
                                                </p>
                                                <label htmlFor="monthly-file-upload" style={styles.fileInputLabel}>
                                                    <FiFolder style={{ marginRight: 8 }} />
                                                    Choose File
                                                </label>
                                                <input
                                                    id="monthly-file-upload"
                                                    type="file"
                                                    onChange={handleMonthlyFileChange}
                                                    style={styles.hiddenFileInput}
                                                    accept=".xlsx,.xls,.csv"
                                                />

                                                {monthlyFile && (
                                                    <div style={styles.filePreview}>
                                                        <FiFile style={styles.fileIcon} />
                                                        <div style={styles.fileInfo}>
                                                            <span style={styles.fileName}>{monthlyFile.name}</span>
                                                            <span style={styles.fileSize}>
                                                                {(monthlyFile.size / 1024 / 1024).toFixed(2)} MB
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => setMonthlyFile(null)}
                                                            style={styles.removeFileButton}
                                                        >
                                                            <FiX />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div style={styles.modalActions}>
                                                <button
                                                    onClick={() => setShowUploadPopup(false)}
                                                    style={styles.cancelButton}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleUploadSubmit}
                                                    disabled={!monthlyFile || uploadStatus?.includes('Uploading')}
                                                    style={!monthlyFile ? styles.uploadButtonDisabled : styles.uploadButton}
                                                >
                                                    {uploadStatus?.includes('Uploading') ? (
                                                        <>
                                                            <FiLoader size={16} style={{ marginRight: 8, animation: 'spin 1s linear infinite' }} />
                                                            Uploading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiUpload style={{ marginRight: 8 }} />
                                                            Process Upload
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}



                    {/* ................. */}

                </main>
            </div>
        </div>
