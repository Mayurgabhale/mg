{/* Main Content Area */}
<div style={styles.mainContent}>
    {/* Other tabs content... */}
    
    {/* Upload Monthly Tab Content */}
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
                    {/* Your full upload section content here */}
                    {/* ... */}
                </div>
            )}
        </div>
    )}
</div>