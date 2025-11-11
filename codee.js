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
          {/* Success content here */}
        </div>
      )}
    </div>

    {/* Upload Popup Modal */}
    {showUploadPopup && (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          {/* Modal content here */}
        </div>
      </div>
    )}
  </div>
)}