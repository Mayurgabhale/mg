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
    if (!file) return alert("Please upload an Excel file first.");
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
      alert("Upload failed. Check the backend server.");
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
    <div style={{ padding: "20px" }}>
      <h1>🌍 Employee Travel Dashboard</h1>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      <button onClick={uploadFile} disabled={loading}>
        {loading ? "Processing..." : "Upload & Analyze"}
      </button>

      {data.length > 0 && (
        <>
          <h3 style={{ marginTop: "20px" }}>
            Total travelers today: {filteredData.length}
          </h3>

          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <select
              value={filters.country}
              onChange={(e) =>
                setFilters((f) => ({ ...f, country: e.target.value }))
              }
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
            >
              <option value="">All Travel Types</option>
              {[...new Set(data.map((d) => d["LEG TYPE"]))].map((lt) => (
                <option key={lt} value={lt}>
                  {lt}
                </option>
              ))}
            </select>
          </div>

          <table border="1" cellPadding="5" width="100%">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Travel Type</th>
                <th>From</th>
                <th>To</th>
                <th>Begin</th>
                <th>End</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    {row["FIRST NAME"]} {row["LAST NAME"]}
                  </td>
                  <td>{row["EMAIL"]}</td>
                  <td>{row["LEG TYPE"]}</td>
                  <td>{row["FROM LOCATION"]}</td>
                  <td>{row["TO LOCATION"]}</td>
                  <td>{row["BEGIN DATE"]}</td>
                  <td>{row["END DATE"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default EmployeeTravelDashboard;