{/* Compact File Upload Section */}
<div style={styles.sideCard}>
    <div style={styles.cardHeader}>
        <FiUpload style={styles.cardIcon} />
        <h3 style={styles.sideTitle}>Quick File Upload</h3>
    </div>

    <div style={styles.compactUploadRow}>
        <div style={styles.compactFileUpload}>
            <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                style={styles.fileInput}
                id="quick-file-upload"
            />
            <label htmlFor="quick-file-upload" style={styles.compactFileLabel}>
                <FiUpload size={16} />
                {file ? file.name : "Choose File"}
            </label>
        </div>

        <div style={styles.compactButtonGroup}>
            <button
                onClick={uploadFile}
                disabled={loading}
                style={loading ? styles.disabledCompactBtn : styles.compactPrimaryBtn}
            >
                {loading ? (
                    <div style={styles.smallSpinner}></div>
                ) : (
                    <FiUpload size={14} />
                )}
            </button>
            <button
                onClick={() => {
                    setItems([]);
                    setSummary({});
                    setFile(null);
                    toast.info("Data cleared successfully.");
                }}
                style={styles.compactSecondaryBtn}
            >
                <FiTrash2 size={14} />
            </button>
            <button onClick={exportCsv} style={styles.compactGhostBtn}>
                <FiDownload size={14} />
            </button>
        </div>
    </div>

    {/* Optional: Upload status message */}
    {loading && (
        <div style={{ marginTop: '10px', color: '#6b7280', fontSize: '12px' }}>
            Uploading file... please wait.
        </div>
    )}
</div>