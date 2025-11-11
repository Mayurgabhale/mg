{activeTab === "uploadMonthly" && (
  <div style={styles.uploadMonthlyContainer}>
    {/* Left Side - Main Content */}
    <div style={styles.leftPanel}>
      <div style={styles.headerSection}>
        <h2 style={styles.mainTitle}>Upload Monthly Active Sheet</h2>
        <p style={styles.subtitle}>Upload the latest monthly employee file</p>
      </div>

      {/* Upload Button - Only show when no data exists */}
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

      {/* Success Display - Show after upload */}
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

          {/* Upload Metadata */}
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