i want to redesign this ... dont change any logic, just i want redesing css only css not anything ok wiht perferct laout and strcute wiht more atractive ok  
{showUploadFileSection && (
                        <div style={styles.uploadMonthlyContainer}>
                            {/* Left Side - Main Content */}
                            <div style={styles.leftPanel}>
                                <div style={styles.headerSection}>
                                    <h2 style={styles.mainTitle}>Upload Monthly Active Sheet</h2>
                                    <p style={styles.subtitle}>Upload the latest monthly employee file</p>

                                    {/* Close button to hide the section */}
                                    <button onClick={() => setShowUploadFileSection(false)}
                                        style={styles.closeSectionButton}
                                    >
                                        <FiX size={16} />
                                        Closeeeee
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
                                            <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} style={styles.fileInput}
                                                id="file-upload" />
                                            <label htmlFor="file-upload" style={styles.compactFileLabel}>
                                                <FiUpload size={16} />
                                                {file ? file.name : "Choose File"}
                                            </label>
                                        </div>
                                        <div style={styles.compactButtonGroup}>
                                            <button onClick={uploadFile} disabled={loading} style={loading ? styles.disabledCompactBtn :
                                                styles.compactPrimaryBtn}>
                                                {loading ? (
                                                    <div style={styles.smallSpinner}></div>
                                                ) : (
                                                    <FiUpload size={14} />
                                                )}
                                            </button>
                                            <button onClick={() => {
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
                                            <button onClick={() => setShowUploadPopup(true)}
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
                                                <button onClick={confirmDeleteData} style={styles.deleteDataButton}>
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
                                            <button onClick={() => setShowUploadPopup(false)}
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
                                                <input id="monthly-file-upload" type="file" onChange={handleMonthlyFileChange}
                                                    style={styles.hiddenFileInput} accept=".xlsx,.xls,.csv" />

                                                {monthlyFile && (
                                                    <div style={styles.filePreview}>
                                                        <FiFile style={styles.fileIcon} />
                                                        <div style={styles.fileInfo}>
                                                            <span style={styles.fileName}>{monthlyFile.name}</span>
                                                            <span style={styles.fileSize}>
                                                                {(monthlyFile.size / 1024 / 1024).toFixed(2)} MB
                                                            </span>
                                                        </div>
                                                        <button onClick={() => setMonthlyFile(null)}
                                                            style={styles.removeFileButton}
                                                        >
                                                            <FiX />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div style={styles.modalActions}>
                                                <button onClick={() => setShowUploadPopup(false)}
                                                    style={styles.cancelButton}
                                                >
                                                    Cancel
                                                </button>
                                                <button onClick={handleUploadSubmit} disabled={!monthlyFile ||
                                                    uploadStatus?.includes('Uploading')} style={!monthlyFile ? styles.uploadButtonDisabled :
                                                        styles.uploadButton}>
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

 uploadMonthlyContainer: {
        // Make sure this has proper styling
        padding: '20px',
        background: isDark ? "rgba(15, 23, 42, 0.5)" : "white",
        borderRadius: '12px',
        margin: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },

    leftPanel: {
        flex: 1,
        padding: '20px',
    },


    leftPanel: {
        flex: 1,
        padding: '20px',
    },
    headerSection: {
        marginBottom: '30px',
    },
    mainTitle: {
        fontSize: '28px',
        fontWeight: '600',
        color: isDark ? "white" : "rgba(15, 23, 42, 0.5)",
        marginBottom: '8px',
    },
    subtitle: {
        fontSize: '16px',
        color: isDark ? "white" : "rgba(15, 23, 42, 0.5)",
        margin: 0,

    },
    uploadButtonSection: {
        textAlign: 'center',
        padding: '60px 20px',
    },
    uploadTriggerButton: {
        backgroundColor: '#3182ce',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        transition: 'background-color 0.2s',
    },
    successContainer: {
        background: isDark ? "rgba(15, 23, 42, 0.5)" : "white",
        color: isDark ? "white" : "rgba(15, 23, 42, 0.5)",
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    successHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },
    successTitleSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    successIcon: {
        color: '#38a169',
    },
    successTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: isDark ? "white" : "rgba(15, 23, 42, 0.5)",
        margin: 0,
    },
    successSubtitle: {
        color: '#718096',
        margin: 0,
    },
    deleteDataButton: {
        backgroundColor: '#e53e3e',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    metadataGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
    },
    metadataItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    metadataLabel: {
        fontSize: '12px',
        color: '#718096',
        fontWeight: '500',
    },
    metadataValue: {
        fontSize: '14px',
        color: '#1a202c',
        fontWeight: '500',
    },
    summaryCard: {
        backgroundColor: '#f7fafc',
        borderRadius: '8px',
        padding: '20px',
    },
    summaryTitle: {
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '16px',
        color: '#2d3748',
    },
    summaryStats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
    },
    summaryStat: {
        textAlign: 'center',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    summaryIcon: {
        fontSize: '24px',
        color: '#3182ce',
        marginBottom: '8px',
    },
    summaryNumber: {
        display: 'block',
        fontSize: '24px',
        fontWeight: '600',
        color: '#1a202c',
    },
    summaryLabel: {
        fontSize: '12px',
        color: '#718096',
    },
    // Modal Styles
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px',
        borderBottom: '1px solid #e2e8f0',
    },
    modalTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a202c',
        margin: 0,
    },
    closeButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#718096',
        padding: '4px',
    },
    uploadCard: {
        padding: '24px',
    },
    uploadArea: {
        border: '2px dashed #cbd5e0',
        borderRadius: '8px',
        padding: '40px 20px',
        textAlign: 'center',
        marginBottom: '20px',
    },
    uploadCloudIcon: {
        color: '#a0aec0',
        marginBottom: '16px',
    },
    uploadAreaTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: '8px',
    },
    uploadAreaSubtitle: {
        color: '#718096',
        marginBottom: '20px',
    },
    fileInputLabel: {
        backgroundColor: '#3182ce',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: '500',
    },
    hiddenFileInput: {
        display: 'none',
    },
    filePreview: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f7fafc',
        padding: '12px',
        borderRadius: '6px',
        marginTop: '16px',
    },
    fileIcon: {
        color: '#718096',
        marginRight: '12px',
    },
    fileInfo: {
        flex: 1,
    },
    fileName: {
        display: 'block',
        fontWeight: '500',
        color: '#2d3748',
    },
    fileSize: {
        fontSize: '12px',
        color: '#718096',
    },
    removeFileButton: {
        background: 'none',
        border: 'none',
        color: '#718096',
        cursor: 'pointer',
        padding: '4px',
    },
    modalActions: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
    },
    cancelButton: {
        backgroundColor: '#e2e8f0',
        color: '#4a5568',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    },
    uploadButton: {
        backgroundColor: '#3182ce',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
    },
    uploadButtonDisabled: {
        backgroundColor: '#a0aec0',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'not-allowed',
        fontSize: '14px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
    },
    // new 📝📝📝📝📝


    // Upload Container
    uploadContainer: {
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
    },

    // Upload Header
    uploadHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px",
        background: isDark ?
            "linear-gradient(135deg, #1e293b, #0f172a)" :
            "linear-gradient(135deg, #f8fafc, #e2e8f0)",
        borderRadius: "16px",
        marginBottom: "24px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    },

    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },

    uploadIcon: {
        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        color: "white",
        padding: "12px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    uploadTitle: {
        fontSize: "28px",
        fontWeight: "800",
        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        margin: "0 0 4px 0",
    },

    uploadSubtitle: {
        fontSize: "14px",
        color: isDark ? "#94a3b8" : "#64748b",
        margin: "0",
    },

    headerStats: {
        display: "flex",
        gap: "16px",
    },

    statCard: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 20px",
        background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)",
        borderRadius: "12px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
    },

    statNumber: {
        fontSize: "20px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
        display: "block",
    },

    statLabel: {
        fontSize: "12px",
        color: isDark ? "#94a3b8" : "#64748b",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },

    // Upload Card
    uploadCard: {
        background: isDark ? "#1e293b" : "white",
        padding: "10px",
        borderRadius: "16px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
        marginBottom: "24px",
        textAlign: "center",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    },

    uploadArea: {
        border: `2px dashed ${isDark ? "rgba(255,255,255,0.2)" : "#d1d5db"}`,
        borderRadius: "12px",
        padding: "15px 10px",
        marginBottom: "24px",
        transition: "all 0.3s ease",
    },

    uploadCloudIcon: {
        color: isDark ? "#4b5563" : "#9ca3af",
        marginBottom: "16px",
    },

    uploadAreaTitle: {
        fontSize: "20px",
        fontWeight: "600",
        color: isDark ? "#f1f5f9" : "#0f172a",
        margin: "0 0 8px 0",
    },

    uploadAreaSubtitle: {
        fontSize: "14px",
        color: isDark ? "#94a3b8" : "#6b7280",
        margin: "0 0 24px 0",
    },

    fileInputLabel: {
        display: "inline-flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        color: "white",
        padding: "12px 24px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        transition: "all 0.2s ease",
        ':hover': {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
        }
    },

    hiddenFileInput: {
        display: "none",
    },

    filePreview: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px",
        background: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
        borderRadius: "8px",
        marginTop: "16px",
        maxWidth: "400px",
        margin: "16px auto 0",
    },

    fileIcon: {
        color: "#3b82f6",
    },

    fileInfo: {
        flex: 1,
        textAlign: "left",
    },

    fileName: {
        display: "block",
        fontSize: "14px",
        fontWeight: "600",
        color: isDark ? "#f1f5f9" : "#0f172a",
        marginBottom: "2px",
    },

    fileSize: {
        fontSize: "12px",
        color: isDark ? "#94a3b8" : "#6b7280",
    },

    removeFileButton: {
        background: "none",
        border: "none",
        color: isDark ? "#94a3b8" : "#6b7280",
        cursor: "pointer",
        padding: "4px",
        borderRadius: "4px",
        ':hover': {
            background: isDark ? "rgba(239, 68, 68, 0.1)" : "#fef2f2",
            color: "#ef4444",
        }
    },

    uploadButton: {
        background: "linear-gradient(135deg, #10b981, #059669)",
        color: "white",
        border: "none",
        padding: "14px 32px",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "inline-flex",
        alignItems: "center",
        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
        ':hover': {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(16, 185, 129, 0.6)",
        }
    },

    uploadButtonDisabled: {
        background: isDark ? "#374151" : "#9ca3af",
        color: isDark ? "#9ca3af" : "#6b7280",
        border: "none",
        padding: "14px 32px",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "not-allowed",
        display: "inline-flex",
        alignItems: "center",
        opacity: 0.6,
    },

    // Upload Status
    uploadStatusSuccess: {
        padding: "24px",
        borderRadius: "16px",
        marginBottom: "24px",
        background: isDark ? "rgba(16, 185, 129, 0.1)" : "#dcfce7",
        border: isDark ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid #bbf7d0",
    },

    uploadStatusError: {
        padding: "24px",
        borderRadius: "16px",
        marginBottom: "24px",
        background: isDark ? "rgba(239, 68, 68, 0.1)" : "#fef2f2",
        border: isDark ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid #fecaca",
    },

    statusHeader: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "12px",
    },

    statusTitle: {
        fontSize: "18px",
        fontWeight: "600",
        color: isDark ? "#f1f5f9" : "#0f172a",
    },

    statusMessage: {
        margin: "0",
        fontSize: "14px",
        color: isDark ? "#cbd5e1" : "#374151",
    },

    metadataGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginTop: "20px",
        paddingTop: "20px",
        borderTop: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb",
    },

    metadataItem: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },

    metadataLabel: {
        fontSize: "12px",
        color: isDark ? "#94a3b8" : "#6b7280",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },

    metadataValue: {
        fontSize: "14px",
        color: isDark ? "#f1f5f9" : "#0f172a",
        fontWeight: "500",
    },

    // Summary Card
    summaryCard: {
        background: isDark ? "#1e293b" : "white",
        padding: "24px",
        borderRadius: "16px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
        marginBottom: "24px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    },

    summaryHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },

    summaryTitle: {
        fontSize: "20px",
        fontWeight: "700",
        color: isDark ? "#f1f5f9" : "#0f172a",
        margin: "0",
    },

    summaryStats: {
        display: "flex",
        gap: "24px",
    },

    summaryStat: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
    },

    summaryIcon: {
        color: "#3b82f6",
        marginBottom: "4px",
    },

    summaryNumber: {
        fontSize: "24px",
        fontWeight: "800",
        color: isDark ? "#f1f5f9" : "#0f172a",
    },

    summaryLabel: {
        fontSize: "12px",
        color: isDark ? "#94a3b8" : "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },

    // Table Container
    tableContainer: {
        background: isDark ? "#1e293b" : "white",
        borderRadius: "16px",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    },

