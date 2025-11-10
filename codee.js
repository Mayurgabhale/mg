upload file input box not take a file from my pc,
    i mesn it is not work ths is decabale in think 
when i clikc nothikg happen anything ok 
    const [monthlyFile, setMonthlyFile] = useState(null);
const [uploadStatus, setUploadStatus] = useState("");
const [employeeData, setEmployeeData] = useState([]);

const uploadMonthlySheet = async () => {
    if (!monthlyFile) {
        setUploadStatus("Please select a file first.");
        return;
    }

    const formData = new FormData();
    formData.append("file", monthlyFile);

    try {
        setUploadStatus("Uploading...");

        const response = await fetch("http://127.0.0.1:8000/monthly_sheet/upload_monthly", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Upload failed.");
        }

        const result = await response.json();
        setUploadStatus(result.message || "Upload successful!");

        // Optionally fetch employee data after upload
        const dataRes = await fetch("http://127.0.0.1:8000/monthly_sheet/employees");
        const data = await dataRes.json();
        setEmployeeData(data);

    } catch (err) {
        console.error("Upload error:", err);
        setUploadStatus(`Error: ${err.message}`);
    }
};
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
