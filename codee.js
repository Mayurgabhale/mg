{activeTab === "uploadMonthly" && (
    <div style={styles.uploadContainer}>
        {/* Header */}
        <div style={styles.uploadHeader}>
            <div style={styles.headerLeft}>
                <div style={styles.uploadIcon}>
                    <FiUpload size={32} />
                </div>
                <div>
                    <h2 style={styles.uploadTitle}>Upload Monthly Active Sheet</h2>
                    <p style={styles.uploadSubtitle}>
                        Upload the latest monthly employee file to update active staff records
                    </p>
                </div>
            </div>
            <div style={styles.headerStats}>
                <div style={styles.statCard}>
                    <FiDatabase size={20} />
                    <div>
                        <span style={styles.statNumber}>{employeeData.length}</span>
                        <span style={styles.statLabel}>Employees</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Upload Card */}
        <div style={styles.uploadCard}>
            <div style={styles.uploadArea}>
                <FiUploadCloud size={48} style={styles.uploadCloudIcon} />
                <h3 style={styles.uploadAreaTitle}>Drop your file here</h3>
                <p style={styles.uploadAreaSubtitle}>Supports .xlsx, .xls, .csv files up to 10MB</p>
                
                <label htmlFor="file-upload" style={styles.fileInputLabel}>
                    <FiFolder style={{ marginRight: 8 }} />
                    Choose File
                </label>
                <input 
                    id="file-upload"
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

        {/* Upload Status & Metadata */}
        {uploadStatus && (
            <div style={uploadStatus.includes('Error') ? styles.uploadStatusError : styles.uploadStatusSuccess}>
                <div style={styles.statusHeader}>
                    {uploadStatus.includes('Error') ? <FiAlertCircle size={20} /> : <FiCheckCircle size={20} />}
                    <span style={styles.statusTitle}>
                        {uploadStatus.includes('Error') ? 'Upload Failed' : 'Upload Successful'}
                    </span>
                </div>
                <p style={styles.statusMessage}>{uploadStatus}</p>
                
                {/* Upload Metadata */}
                {!uploadStatus.includes('Error') && monthlyFile && (
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
                            <span style={styles.metadataLabel}>Upload Date</span>
                            <span style={styles.metadataValue}>
                                {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                            </span>
                        </div>
                        <div style={styles.metadataItem}>
                            <span style={styles.metadataLabel}>Records Processed</span>
                            <span style={styles.metadataValue}>{employeeData.length} employees</span>
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
                    </div>
                </div>
            </div>
        )}

        {/* Uploaded Data Table */}
        {employeeData.length > 0 && (
            <div style={styles.tableContainer}>
                <div style={styles.tableHeader}>
                    <h3 style={styles.tableTitle}>Employee Records</h3>
                    <div style={styles.tableActions}>
                        <button style={styles.exportButton}>
                            <FiDownload style={{ marginRight: 6 }} />
                            Export CSV
                        </button>
                        <div style={styles.searchBox}>
                            <FiSearch style={styles.searchIcon} />
                            <input 
                                type="text" 
                                placeholder="Search employees..." 
                                style={styles.searchInput}
                            />
                        </div>
                    </div>
                </div>
                
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead style={styles.tableHead}>
                            <tr>
                                <th style={styles.tableHeader}>Employee ID</th>
                                <th style={styles.tableHeader}>Full Name</th>
                                <th style={styles.tableHeader}>Department</th>
                                <th style={styles.tableHeader}>Company</th>
                                <th style={styles.tableHeader}>Location</th>
                                <th style={styles.tableHeader}>Years of Service</th>
                                <th style={styles.tableHeader}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeData.map((emp, idx) => (
                                <tr key={idx} style={styles.tableRow}>
                                    <td style={styles.tableCell}>
                                        <div style={styles.employeeId}>
                                            <FiUser style={{ marginRight: 6 }} />
                                            {emp.employee_id}
                                        </div>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <div style={styles.employeeName}>
                                            <span style={styles.name}>{emp.full_name}</span>
                                            <span style={styles.email}>{emp.employee_email}</span>
                                        </div>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <span style={styles.department}>{emp.department_name}</span>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <span style={styles.company}>{emp.company_name}</span>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <div style={styles.location}>
                                            <FiMapPin size={12} style={{ marginRight: 4 }} />
                                            {emp.location_city}
                                        </div>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <div style={styles.serviceBadge}>
                                            {emp.years_of_service} years
                                        </div>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <div style={emp.current_status === 'Active' ? styles.statusActive : styles.statusInactive}>
                                            {emp.current_status || 'Active'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Table Footer */}
                <div style={styles.tableFooter}>
                    <span style={styles.footerText}>
                        Showing {employeeData.length} of {employeeData.length} records
                    </span>
                    <div style={styles.pagination}>
                        <button style={styles.paginationButton} disabled>
                            <FiChevronLeft />
                        </button>
                        <span style={styles.paginationInfo}>Page 1 of 1</span>
                        <button style={styles.paginationButton} disabled>
                            <FiChevronRight />
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
)}