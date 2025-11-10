 <div style={styles.uploadForm}>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={(e) => setMonthlyFile(e.target.files[0])}
                                    style={styles.fileInput}
                                />
                                <button
                                    onClick={uploadMonthlySheet}
                                    style={styles.uploadButton}
                                    disabled={!monthlyFile}
                                >
                                    <FiUpload style={{ marginRight: 8 }} /> Upload File
                                </button>
                            </div>
                                      
this is not work
                    {activeTab === "uploadMonthly" && (
                        <div style={styles.uploadContainer}>
                            {/* Header */}
                            <div style={styles.uploadHeader}>
                                <div style={styles.headerLeft}>
                                    <FiUpload size={32} style={{ color: '#3b82f6', marginRight: 10 }} />
                                    <div>
                                        <h2 style={styles.uploadTitle}>Upload Monthly Active Sheet</h2>
                                        <p style={styles.uploadSubtitle}>
                                            Upload the latest monthly employee file to update active staff records.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Upload Form */}
                            <div style={styles.uploadForm}>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={(e) => setMonthlyFile(e.target.files[0])}
                                    style={styles.fileInput}
                                />
                                <button
                                    onClick={uploadMonthlySheet}
                                    style={styles.uploadButton}
                                    disabled={!monthlyFile}
                                >
                                    <FiUpload style={{ marginRight: 8 }} /> Upload File
                                </button>
                            </div>

                            {/* Upload Status */}
                            {uploadStatus && (
                                <div style={styles.uploadStatus}>
                                    <p>{uploadStatus}</p>
                                </div>
                            )}

                            {/* Uploaded Data Table */}
                            {employeeData.length > 0 && (
                                <div style={styles.tableContainer}>
                                    <h3 style={styles.tableTitle}>Uploaded Employee Data</h3>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Employee ID</th>
                                                <th>Full Name</th>
                                                <th>Department</th>
                                                <th>Company</th>
                                                <th>Location</th>
                                                <th>Years of Service</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employeeData.map((emp, idx) => (
                                                <tr key={idx}>
                                                    <td>{emp.employee_id}</td>
                                                    <td>{emp.full_name}</td>
                                                    <td>{emp.department_name}</td>
                                                    <td>{emp.company_name}</td>
                                                    <td>{emp.location_city}</td>
                                                    <td>{emp.years_of_service}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
