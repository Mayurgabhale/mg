{activeTab === "uploadMonthly" && (
    <div style={styles.uploadContainer}>
        {/* ... other code ... */}

        {/* Upload Card */}
        <div style={styles.uploadCard}>
            <div style={styles.uploadArea}>
                <FiUploadCloud size={48} style={styles.uploadCloudIcon} />
                <h3 style={styles.uploadAreaTitle}>Drop your file here</h3>
                <p style={styles.uploadAreaSubtitle}>Supports .xlsx, .xls, .csv files up to 10MB</p>

                {/* 🛠️ FIX: Change ID to be unique */}
                <label htmlFor="monthly-file-upload" style={styles.fileInputLabel}>
                    <FiFolder style={{ marginRight: 8 }} />
                    Choose File
                </label>
                <input
                    id="monthly-file-upload"  {/* 🛠️ CHANGED ID */}
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

        {/* ... rest of the code ... */}
    </div>
)}