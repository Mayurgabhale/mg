// Fix the state declaration - remove the typo
const [showUploadFileSection, setShowUploadFileSection] = useState(false);
// Remove the extra 'i' in "Sectino" ^



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
        Test Upload Button
    </button>
</div>

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
                        {/* Your quick upload content */}
                    </div>

                    {/* ======================= */}
                    {/* MONTHLY EMPLOYEE UPLOAD SECTION */}
                    {/* ======================= */}
                    <div style={styles.monthlyUploadSection}>
                        {/* Your monthly upload content */}
                    </div>
                </div>
            </div>
        )}
    </div>
)}