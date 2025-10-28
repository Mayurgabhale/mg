import React, { useState } from "react";
import axios from "axios";

const EmployeeTravelDashboard = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    country: "",
    legType: "",
  });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const uploadFile = async () => {
    if (!file) return alert("Please upload an Excel or CSV file first.");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("http://localhost:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please check the backend server or file format.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((row) => {
    const countryMatch =
      !filters.country || row["FROM COUNTRY"] === filters.country;
    const legMatch = !filters.legType || row["LEG TYPE"] === filters.legType;
    return countryMatch && legMatch;
  });

  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        padding: "30px 60px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#333",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "28px",
            fontWeight: "600",
            color: "#1e293b",
          }}
        >
          🌍 Employee Travel Dashboard
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            style={{
              padding: "8px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              background: "#fff",
            }}
          />
          <button
            onClick={uploadFile}
            disabled={loading}
            style={{
              padding: "8px 20px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            {loading ? "Processing..." : "Upload & Analyze"}
          </button>
        </div>

        {data.length > 0 && (
          <>
            <h3
              style={{
                marginTop: "20px",
                textAlign: "center",
                color: "#334155",
              }}
            >
              Total Travelers Today:{" "}
              <span style={{ color: "#2563eb" }}>{filteredData.length}</span>
            </h3>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "15px",
                margin: "20px 0",
              }}
            >
              <select
                value={filters.country}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, country: e.target.value }))
                }
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  background: "#fff",
                }}
              >
                <option value="">All Countries</option>
                {[...new Set(data.map((d) => d["FROM COUNTRY"]))].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={filters.legType}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, legType: e.target.value }))
                }
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  background: "#fff",
                }}
              >
                <option value="">All Travel Types</option>
                {[...new Set(data.map((d) => d["LEG TYPE"]))].map((lt) => (
                  <option key={lt} value={lt}>
                    {lt}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                overflowX: "auto",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  backgroundColor: "white",
                }}
              >
                <thead style={{ background: "#f1f5f9" }}>
                  <tr>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Travel Type</th>
                    <th style={thStyle}>From</th>
                    <th style={thStyle}>To</th>
                    <th style={thStyle}>Begin</th>
                    <th style={thStyle}>End</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: "1px solid #e5e7eb",
                        backgroundColor:
                          idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                      }}
                    >
                      <td style={tdStyle}>
                        {row["FIRST NAME"]} {row["LAST NAME"]}
                      </td>
                      <td style={tdStyle}>{row["EMAIL"]}</td>
                      <td style={tdStyle}>{row["LEG TYPE"]}</td>
                      <td style={tdStyle}>{row["FROM LOCATION"]}</td>
                      <td style={tdStyle}>{row["TO LOCATION"]}</td>
                      <td style={tdStyle}>{row["BEGIN DATE"]}</td>
                      <td style={tdStyle}>{row["END DATE"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Styles for table headers & cells
const thStyle = {
  textAlign: "left",
  padding: "10px",
  fontWeight: "600",
  color: "#1e293b",
  borderBottom: "2px solid #e2e8f0",
};

const tdStyle = {
  padding: "8px 10px",
  color: "#334155",
};

export default EmployeeTravelDashboard;