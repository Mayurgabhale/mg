<div><input accept=".xlsx,.xls,.csv" type="file" style="display: none;"><button disabled="" style="margin-left: 10px; background: rgb(16, 185, 129); color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer;">Upload File</button></div>
  {/* <button
                                    onClick={uploadMonthlySheet}
                                    style={styles.uploadButton}
                                    disabled={!monthlyFile}
                                >
                                    <FiUpload style={{ marginRight: 8 }} /> Upload File
                                </button> */}
                                <button
  onClick={uploadMonthlySheet}
  disabled={!monthlyFile}
  style={{
    marginLeft: "10px",
    background: "#10b981",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  Upload File
</button>
