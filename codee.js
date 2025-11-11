we upload file but any infromtianis not show 

Upload Monthly Active Sheet
Upload the latest monthly employee file only show this::: 

   // State variables - FIXED
const [employeeData, setEmployeeData] = useState([]);
const [monthlyFile, setMonthlyFile] = useState(null);
const [showUploadPopup, setShowUploadPopup] = useState(false);
const [hasUploadedData, setHasUploadedData] = useState(false);
const [uploadTime, setUploadTime] = useState(null); // ADD THIS
const [uploadStatus, setUploadStatus] = useState(""); // ADD THIS

// Load only essential data on component mount
useEffect(() => {
  const savedHasUploadedData = localStorage.getItem('hasUploadedData');
  const savedUploadTime = localStorage.getItem('uploadTime'); // ADD THIS
  
  if (savedHasUploadedData === 'true') {
    setHasUploadedData(true);
    if (savedUploadTime) {
      setUploadTime(new Date(savedUploadTime)); // ADD THIS
    }
    fetchEmployeeData();
  }
}, []);

// Fetch employee data only when needed
const fetchEmployeeData = async () => {
  try {
    const employeesRes = await fetch("http://localhost:8000/monthly_sheet/employees");
    const employeesData = await employeesRes.json();
    setEmployeeData(employeesData);
  } catch (err) {
    console.error("Failed to fetch employee data:", err);
  }
};

// Handle file selection
const handleMonthlyFileChange = (e) => {
  const selected = e.target.files?.[0];
  setMonthlyFile(selected);
};

// Handle upload submission - UPDATED
const handleUploadSubmit = async () => {
  if (!monthlyFile) return;

  const formData = new FormData();
  formData.append("file", monthlyFile);
  
  try {
    setUploadStatus("Uploading..."); // ADD THIS
    
    const res = await fetch("http://localhost:8000/monthly_sheet/upload_monthly", {
      method: "POST",
      body: formData,
    });
    
    const result = await res.json();
    
    if (res.ok) {
      setUploadStatus("Upload successful!"); // ADD THIS
      setUploadTime(new Date()); // ADD THIS
      setHasUploadedData(true);
      setShowUploadPopup(false);
      
      // Save to localStorage
      localStorage.setItem('hasUploadedData', 'true');
      localStorage.setItem('uploadTime', new Date().toISOString()); // ADD THIS
      
      // Fetch the uploaded data
      await fetchEmployeeData();
      toast.success("File uploaded successfully!");
    } else {
      throw new Error(result.detail || "Upload failed");
    }
  } catch (err) {
    console.error(err);
    setUploadStatus("Upload failed!"); // ADD THIS
    toast.error("Upload failed!");
  }
};

// Delete confirmation
const confirmDeleteData = () => {
  if (window.confirm("Are you sure you want to delete all employee data? This action cannot be undone.")) {
    deleteEmployeeData();
  }
};

// Delete employee data - UPDATED
const deleteEmployeeData = async () => {
  try {
    // Clear backend data
    await fetch("http://localhost:8000/monthly_sheet/clear_data", {
      method: "DELETE"
    });

    // Clear frontend state
    setEmployeeData([]);
    setMonthlyFile(null);
    setHasUploadedData(false);
    setUploadTime(null); // ADD THIS
    setUploadStatus(""); // ADD THIS

    // Clear localStorage
    localStorage.removeItem('hasUploadedData');
    localStorage.removeItem('uploadTime'); // ADD THIS

    toast.success("Employee data cleared successfully.");
  } catch (err) {
    console.error(err);
    toast.error("Failed to clear data.");
  }
};


{activeTab === "uploadMonthly" && (
  <div style={styles.uploadMonthlyContainer}>
    {/* Left Side - Main Content */}
    <div style={styles.leftPanel}>
      <div style={styles.headerSection}>
        <h2 style={styles.mainTitle}>Upload Monthly Active Sheet</h2>
        <p style={styles.subtitle}>Upload the latest monthly employee file</p>
      </div>

      {/* ONLY SHOW UPLOAD BUTTON INITIALLY */}
      {!hasUploadedData && (
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

      {/* ONLY SHOW SUCCESS DATA AFTER UPLOAD */}
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

          {/* Upload Metadata - NOW USING uploadTime STATE */}
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
    </div>

    {/* Upload Popup Modal - NOW USING uploadStatus STATE */}
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
