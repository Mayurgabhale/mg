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
        <div>
            <input type="file" onChange={handleMonthlyFileChange} />
            <button onClick={uploadMonthlySheet} disabled={!monthlyFile}>
                Upload
            </button>
            <p>{uploadStatus}</p>
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
                            {/* Table continues... */}