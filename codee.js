import React, { useState, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Player } from "@lottiefiles/react-lottie-player"; // ✅ Import Lottie Player
import {
  FiGlobe,
  FiUsers,
  FiMapPin,
  FiFileText,
  FiUpload,
  FiFilter,
  FiSearch,
  FiDownload,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiMail,
  FiUser,
  FiAward,
  FiActivity
} from "react-icons/fi";

const fmt = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  } catch {
    return String(iso);
  }
};

const EmployeeTravelDashboard = () => {
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    country: "",
    legType: "",
    search: "",
  });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const uploadFile = async () => {
    if (!file) return toast.warn("Please select an Excel or CSV file first.");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("http://localhost:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const payload = res.data || {};
      const rows = payload.items || [];
      setItems(rows);
      setSummary(payload.summary || {});
      toast.success(`Uploaded successfully. ${rows.length} records found.`);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Please check the backend or file format.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Replace spinner section in your Upload Button with Lottie animation
  return (
    <div style={page}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* HEADER OMITTED FOR BREVITY */}

      <main style={main}>
        <div style={card}>
          <div style={uploadRow}>
            <div style={fileUploadWrapper}>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                style={fileInput}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={fileInputLabel}>
                <FiUpload style={{ marginRight: "8px" }} />
                {file ? file.name : "Choose File"}
              </label>
            </div>

            <div style={buttonGroup}>
              <button
                onClick={uploadFile}
                disabled={loading}
                style={loading ? disabledPrimaryBtn : primaryBtn}
              >
                {loading ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {/* ✅ Lottie Loading Animation */}
                    <Player
                      autoplay
                      loop
                      src="https://lottie.host/2f8b6c6e-bb9a-4cc9-9b29-2e79a3cc1884/1F5iALqUxl.json"
                      style={{ height: "36px", width: "36px" }}
                    />
                    Processing...
                  </div>
                ) : (
                  <>
                    <FiUpload style={{ marginRight: "8px" }} />
                    Upload File
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setItems([]);
                  setSummary({});
                  setFile(null);
                  toast.info("Data cleared successfully.");
                }}
                style={secondaryBtn}
              >
                <FiTrash2 style={{ marginRight: "8px" }} />
                Clear
              </button>

              <button onClick={exportCsv} style={ghostBtn}>
                <FiDownload style={{ marginRight: "8px" }} />
                Export CSV
              </button>
            </div>
          </div>

          {/* ... Rest of your component remains the same ... */}
        </div>
      </main>
    </div>
  );
};