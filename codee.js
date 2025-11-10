import React, { useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";

const FileUploader = () => {
  const fileInputRef = useRef(null);
  const [monthlyFile, setMonthlyFile] = useState(null);

  const handleFileChange = (e) => {
    setMonthlyFile(e.target.files[0]);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const uploadMonthlySheet = () => {
    if (!monthlyFile) return;
    // Your upload logic here (e.g., API call or processing)
    console.log("Uploading:", monthlyFile.name);
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <button
        onClick={handleButtonClick}
        style={{
          background: "#2563eb",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Select File
      </button>

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
          opacity: monthlyFile ? 1 : 0.6,
        }}
      >
        <FiUpload style={{ marginRight: 8 }} /> Upload File
      </button>
    </div>
  );
};

export default FileUploader;