import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";

const MonthlyUploadSection = () => {
  const [monthlyFile, setMonthlyFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

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
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Upload Monthly Active Sheet</h2>
      <p>Upload the latest monthly employee file to update active staff records.</p>

      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={(e) => setMonthlyFile(e.target.files[0])}
        style={{ marginTop: 10 }}
      />

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
          cursor: monthlyFile ? "pointer" : "not-allowed",
        }}
      >
        <FiUpload style={{ marginRight: 8 }} /> Upload File
      </button>

      {uploadStatus && <p style={{ marginTop: 10 }}>{uploadStatus}</p>}
    </div>
  );
};

export default MonthlyUploadSection;