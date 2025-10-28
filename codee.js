import React, { useState, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      toast.success(`✅ Uploaded successfully. ${rows.length} records found.`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Upload failed. Please check the backend or file format.");
    } finally {
      setLoading(false);
    }
  };

  const safeItems = Array.isArray(items) ? items : [];
  const countries = useMemo(
    () => [...new Set(safeItems.map((r) => r.from_country).filter(Boolean))],
    [safeItems]
  );
  const legTypes = useMemo(
    () => [...new Set(safeItems.map((r) => r.leg_type).filter(Boolean))],
    [safeItems]
  );

  const filtered = safeItems.filter((r) => {
    const s = filters.search.toLowerCase();
    if (s) {
      const hay = `${r.first_name ?? ""} ${r.last_name ?? ""} ${r.email ?? ""}`.toLowerCase();
      if (!hay.includes(s)) return false;
    }
    if (filters.country && r.from_country !== filters.country) return false;
    if (filters.legType && r.leg_type !== filters.legType) return false;
    return true;
  });

  const countryStats = useMemo(() => {
    const map = {};
    for (const r of safeItems) {
      const c = r.from_country || "Unknown";
      map[c] = (map[c] || 0) + 1;
    }
    return Object.entries(map)
      .map(([k, v]) => ({ country: k, count: v }))
      .sort((a, b) => b.count - a.count);
  }, [safeItems]);

  const exportCsv = () => {
    if (!filtered.length) return toast.info("No data to export.");
    const keys = Object.keys(filtered[0]);
    const csv = [keys.join(",")];
    filtered.forEach((r) =>
      csv.push(keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(","))
    );
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "EmployeeTravelData.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("📁 CSV exported.");
  };

  return (
    <div style={page}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* HEADER */}
      <header style={header}>
        <h1 style={title}>🌍 Employee Travel Dashboard</h1>
      </header>

      <div style={layout}>
        {/* LEFT PANEL */}
        <aside style={sidebar}>
          <div style={sideCard}>
            <h3 style={sideTitle}>📊 Overview</h3>
            <div style={sideStat}>
              <span>Total Travelers:</span>
              <strong>{safeItems.length}</strong>
            </div>
            <div style={sideStat}>
              <span>Active Now:</span>
              <strong>{safeItems.filter((r) => r.active_now).length}</strong>
            </div>
            <div style={sideStat}>
              <span>Countries:</span>
              <strong>{countries.length}</strong>
            </div>
            <div style={sideStat}>
              <span>Travel Types:</span>
              <strong>{legTypes.length}</strong>
            </div>
          </div>

          <div style={sideCard}>
            <h3 style={sideTitle}>🌎 Country-wise Travelers</h3>
            {countryStats.length === 0 ? (
              <p style={sideEmpty}>No data yet</p>
            ) : (
              <ul style={countryList}>
                {countryStats.map((c) => (
                  <li key={c.country} style={countryItem}>
                    <span>{c.country}</span>
                    <strong>{c.count}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* RIGHT PANEL */}
        <main style={main}>
          <div style={uploadRow}>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              style={fileInput}
            />
            <button onClick={uploadFile} disabled={loading} style={primaryBtn}>
              {loading ? "Processing..." : "Upload File"}
            </button>
            <button
              onClick={() => {
                setItems([]);
                setSummary({});
                setFile(null);
                toast.info("Data cleared.");
              }}
              style={secondaryBtn}
            >
              Clear
            </button>
            <button onClick={exportCsv} style={ghostBtn}>
              ⬇ Export CSV
            </button>
          </div>

          <div style={filtersRow}>
            <input
              placeholder="🔍 Search name or email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              style={searchInput}
            />
            <select
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              style={select}
            >
              <option value="">All Countries</option>
              {countries.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={filters.legType}
              onChange={(e) => setFilters({ ...filters, legType: e.target.value })}
              style={select}
            >
              <option value="">All Travel Types</option>
              {legTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div style={tableWrap}>
            <table style={table}>
              <thead style={thead}>
                <tr>
                  <th style={th}>Active</th>
                  <th style={th}>Name</th>
                  <th style={th}>Email</th>
                  <th style={th}>Type</th>
                  <th style={th}>From</th>
                  <th style={th}>To</th>
                  <th style={th}>Begin</th>
                  <th style={th}>End</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={emptyRow}>
                      No matching results. Upload a file or adjust filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, i) => (
                    <tr key={i} style={i % 2 === 0 ? rowEven : rowOdd}>
                      <td style={td}>{r.active_now ? "✅" : ""}</td>
                      <td style={td}>
                        {r.first_name} {r.last_name}
                      </td>
                      <td style={td}>{r.email}</td>
                      <td style={td}>{r.leg_type}</td>
                      <td style={td}>{r.from_country}</td>
                      <td style={td}>{r.to_country}</td>
                      <td style={td}>{fmt(r.begin_dt)}</td>
                      <td style={td}>{fmt(r.end_dt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

/* === STYLES === */
const page = {
  backgroundColor: "#f9fafb",
  minHeight: "100vh",
  padding: "20px",
  color: "#1e293b",
  fontFamily: "'Inter', system-ui, sans-serif",
};
const header = { textAlign: "center", marginBottom: "25px" };
const title = { fontSize: "2rem", fontWeight: 700, color: "#0f172a" };
const layout = {
  display: "flex",
  gap: "20px",
  alignItems: "flex-start",
  justifyContent: "center",
  flexWrap: "wrap",
};
const sidebar = {
  flex: "0 0 280px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};
const main = { flex: "1 1 700px", maxWidth: "900px" };
const sideCard = {
  background: "#fff",
  borderRadius: "16px",
  padding: "16px 20px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};
const sideTitle = { fontSize: "1.1rem", fontWeight: 600, marginBottom: "10px" };
const sideStat = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "6px",
  fontSize: "0.95rem",
};
const sideEmpty = { color: "#94a3b8", fontStyle: "italic" };
const countryList = { listStyle: "none", padding: 0, margin: 0 };
const countryItem = {
  display: "flex",
  justifyContent: "space-between",
  padding: "4px 0",
  borderBottom: "1px solid #f1f5f9",
};
const uploadRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginBottom: "20px",
};
const fileInput = {
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  background: "#fff",
};
const primaryBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 600,
};
const secondaryBtn = {
  background: "#f1f5f9",
  border: "none",
  padding: "8px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  color: "#1e293b",
};
const ghostBtn = {
  background: "transparent",
  border: "1px solid #cbd5e1",
  padding: "8px 16px",
  borderRadius: "8px",
  cursor: "pointer",
};
const filtersRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginBottom: "10px",
};
const searchInput = {
  flex: 1,
  minWidth: "250px",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
};
const select = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  background: "#fff",
};
const tableWrap = {
  overflowX: "auto",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};
const table = { width: "100%", borderCollapse: "collapse", background: "#fff" };
const thead = { background: "#f1f5f9" };
const th = {
  padding: "12px 16px",
  textAlign: "left",
  fontWeight: 600,
  color: "#1e293b",
  borderBottom: "2px solid #e2e8f0",
};
const td = {
  padding: "10px 16px",
  borderBottom: "1px solid #e2e8f0",
  color: "#334155",
};
const rowEven = { background: "#fff" };
const rowOdd = { background: "#f8fafc" };
const emptyRow = { textAlign: "center", padding: "18px", color: "#64748b" };

export default EmployeeTravelDashboard;