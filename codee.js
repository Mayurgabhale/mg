{activeTab === "uploadMonthly" && (
    <div style={styles.uploadContainer}>
        {/* Header - Left aligned only */}
        <div style={styles.uploadHeader}>
            <div style={styles.headerLeft}>
                <div style={styles.uploadIcon}>
                    <FiUpload size={32} />
                </div>
                <div>
                    <h2 style={styles.uploadTitle}>Upload Monthly Active Sheet</h2>
                    <p style={styles.uploadSubtitle}>
                        Upload the latest monthly employee file
                    </p>
                </div>
            </div>
            {/* Show employee count in header if data exists */}
            {employeeData.length > 0 && (
                <div style={styles.headerStats}>
                    <div style={styles.statCard}>
                        <FiDatabase size={20} />
                        <div>
                            <span style={styles.statNumber}>{employeeData.length}</span>
                            <span style={styles.statLabel}>Employees</span>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Upload Card - Only show if no data exists */}
        {showUploadCard && employeeData.length === 0 && (
            <div style={styles.uploadCard}>
                <div style={styles.uploadArea}>
                    <FiUploadCloud size={48} style={styles.uploadCloudIcon} />
                    <h3 style={styles.uploadAreaTitle}>Drop your file here</h3>
                    <p style={styles.uploadAreaSubtitle}>Supports .xlsx, .xls, .csv files up to 10MB</p>

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

                {/* Upload Button */}
                <button
                    onClick={uploadMonthlySheet}
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
        )}

        {/* Upload Status & Metadata - Show if we have data OR upload status */}
        {(uploadStatus || employeeData.length > 0) && (
            <div style={uploadStatus?.includes('Error') ? styles.uploadStatusError : styles.uploadStatusSuccess}>
                <div style={styles.statusHeader}>
                    {uploadStatus?.includes('Error') ? <FiAlertCircle size={20} /> : <FiCheckCircle size={20} />}
                    <span style={styles.statusTitle}>
                        {uploadStatus?.includes('Error') ? 'Upload Failed' : 'Data Loaded Successfully'}
                    </span>
                    {/* Add delete button in header */}
                    {!uploadStatus?.includes('Error') && employeeData.length > 0 && (
                        <button
                            onClick={confirmDeleteData}
                            style={styles.deleteButton}
                            title="Delete uploaded data"
                        >
                            <FiTrash2 size={16} />
                        </button>
                    )}
                </div>
                <p style={styles.statusMessage}>
                    {uploadStatus || `${employeeData.length} employee records loaded from previous session.`}
                </p>

                {/* Upload Metadata - Show if we have file info and upload time */}
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
                        <div style={styles.metadataItem}>
                            <span style={styles.metadataLabel}>File Type</span>
                            <span style={styles.metadataValue}>{monthlyFile.name.split('.').pop().toUpperCase()}</span>
                        </div>
                        <div style={styles.metadataItem}>
                            <span style={styles.metadataLabel}>Database</span>
                            <span style={styles.metadataValue}>SQLite</span>
                        </div>
                        <div style={styles.metadataItem}>
                            <span style={styles.metadataLabel}>Data Status</span>
                            <span style={styles.metadataValue}>
                                <div style={styles.persistedBadge}>
                                    <FiSave style={{ marginRight: 4 }} />
                                    Persisted
                                </div>
                            </span>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* Uploaded Data Summary */}
        {employeeData.length > 0 && (
            <div style={styles.summaryCard}>
                <div style={styles.summaryHeader}>
                    <h3 style={styles.summaryTitle}>Upload Summary</h3>
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

        {/* Rest of your table code remains the same */}
        {employeeData.length > 0 && (
            <div style={styles.tableContainer}>
                {/* ... your existing table code ... */}
            </div>
        )}
    </div>
)}