Upload Successful

8587 employee records saved successfully to SQLite database.

File Name
Excel 2025-10-09 16_03 GMT+5_30.xlsx
File Size
4.30 MB
Upload Date & Time
11/10/2025 at 3:51:22 PM
Records Processed
8587 employees
File Type
XLSX
Database
SQLite


when i dont delete this my self that time this is i want to diplsy what ever i do 
page referese or aanythikh 
only remove this that time i delete this my self ok 




    const [employeeData, setEmployeeData] = useState([]);
    const [monthlyFile, setMonthlyFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [uploadTime, setUploadTime] = useState(null); // Add this state
    const [showUploadCard, setShowUploadCard] = useState(true); // Add this state



    const handleMonthlyFileChange = (e) => {
        const selected = e.target.files?.[0];
        console.log("Selected:", selected);
        setMonthlyFile(selected);
    };



    const uploadMonthlySheet = async () => {
        if (!monthlyFile) return alert("Please select a file first.");

        const formData = new FormData();
        formData.append("file", monthlyFile);

        try {
            setUploadStatus("Uploading...");
            const res = await fetch("http://localhost:8000/monthly_sheet/upload_monthly", {
                method: "POST",
                body: formData,
            });
            const result = await res.json();
            setUploadStatus(result.message || "Upload success!");
            setUploadTime(new Date()); // Set upload time

            // Hide upload card after successful upload
            setShowUploadCard(false);

            // Fetch employee data after successful upload
            const employeesRes = await fetch("http://localhost:8000/monthly_sheet/employees");
            const employeesData = await employeesRes.json();
            setEmployeeData(employeesData);

        } catch (err) {
            console.error(err);
            setUploadStatus("Upload failed.");
        }
    };

    // Add delete confirmation function
    const confirmDeleteData = () => {
        if (window.confirm("Are you sure you want to delete all employee data? This action cannot be undone.")) {
            deleteEmployeeData();
        }
    };


    const deleteEmployeeData = async () => {
        try {
            // Clear local state
            setEmployeeData([]);
            setUploadStatus("");
            setUploadTime(null);
            setShowUploadCard(true);
            setMonthlyFile(null);

            // You might want to add a backend endpoint to clear the data
            // await fetch("http://localhost:8000/monthly_sheet/clear_data", { method: "DELETE" });

            toast.success("Employee data cleared successfully.");
        } catch (err) {
            console.error(err);
            toast.error("Failed to clear data.");
        }
    };





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
                                {/* Remove the headerStats from here */}
                            </div>

                            {/* Upload Card - Only show if no successful upload yet */}
                            {showUploadCard && (
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

                            {/* Upload Status & Metadata - Show after upload */}
                            {uploadStatus && (
                                <div style={uploadStatus.includes('Error') ? styles.uploadStatusError : styles.uploadStatusSuccess}>
                                    <div style={styles.statusHeader}>
                                        {uploadStatus.includes('Error') ? <FiAlertCircle size={20} /> : <FiCheckCircle size={20} />}
                                        <span style={styles.statusTitle}>
                                            {uploadStatus.includes('Error') ? 'Upload Failed' : 'Upload Successful'}
                                        </span>
                                        {/* Add delete button in header */}
                                        {!uploadStatus.includes('Error') && (
                                            <button
                                                onClick={confirmDeleteData}
                                                style={styles.deleteButton}
                                                title="Delete uploaded data"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <p style={styles.statusMessage}>{uploadStatus}</p>

                                    {/* Upload Metadata - Show only on success */}
                                    {!uploadStatus.includes('Error') && monthlyFile && uploadTime && (
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

                            {/* Uploaded Data Table */}
                            {employeeData.length > 0 && (
                                <div style={styles.tableContainer}>
                                    <div style={styles.tableHeader}>
                                        <h3 style={styles.tableTitle}>Employee Records ({employeeData.length})</h3>
                                        <div style={styles.tableActions}>
                                            <button style={styles.exportButton}>
                                                <FiDownload style={{ marginRight: 6 }} />
                                                Export CSV
                                            </button>
                                            <button onClick={confirmDeleteData} style={styles.deleteDataButton}>
                                                <FiTrash2 style={{ marginRight: 6 }} />
                                                Clear Data
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
