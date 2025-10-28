import React, { useState, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* Helper to format date safely */
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
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    country: "",
    legType: "",
    search: "",
  });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const uploadFile = async () => {
    if (!file) return toast.warn("Please select an Excel or CSV file.");

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
      toast.success(`✅ File uploaded successfully. ${rows.length} records found.`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Upload failed. Please check backend or file format.");
    } finally {
      setLoading(false);
    }
  };

  const countries = useMemo(
    () => [...new Set(items.map((r) => r.from_country).filter(Boolean))],
    [items]
  );
  const legTypes = useMemo(
    () => [...new Set(items.map((r) => r.leg_type).filter(Boolean))],
    [items]
  );

  const safeItems = Array.isArray(items) ? items : [];

  const filtered = safeItems.filter((row) => {
    const s = filters.search.toLowerCase();
    if (s) {
      const haystack = `${row.first_name ?? ""} ${row.last_name ?? ""} ${row.email ?? ""}`.toLowerCase();
      if (!haystack.includes(s)) return false;
    }
    if (filters.country && row.from_country !== filters.country) return false;
    if (filters.legType && row.leg_type !== filters.legType) return false;
    return true;
  });

  const exportCsv = () => {
    if (!filtered.length) return toast.info("No data to export.");
    const keys = Object.keys(filtered[0]);
    const csvRows = [keys.join(",")];
    for (const r of filtered) {
      csvRows.push(
        keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(",")
      );
    }
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "EmployeeTravelData.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("📁 Exported to CSV");
  };

  return (
    <div style={page}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <header style={header}>
        <h1 style={title}>🌍 Employee Travel Dashboard</h1>
      </header>

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
            setSummary(null);
            setFile(null);
            toast.info("Data cleared.");
          }}
          style={secondaryBtn}
        >
          Clear
        </button>
      </div>

      <div style={summaryGrid}>
        <div style={summaryCard}>
          <div style={summaryLabel}>Total Rows</div>
          <div style={summaryValue}>{summary?.rows_received ?? items.length}</div>
        </div>
        <div style={summaryCard}>
          <div style={summaryLabel}>Active Travelers</div>
          <div style={summaryValue}>
            {summary?.active_now_count ?? safeItems.filter((r) => r.active_now).length}
          </div>
        </div>
        <div style={summaryCard}>
          <div style={summaryLabel}>Countries</div>
          <div style={summaryValue}>{countries.length}</div>
        </div>
        <div style={summaryCard}>
          <div style={summaryLabel}>Travel Types</div>
          <div style={summaryValue}>{legTypes.length}</div>
        </div>
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
        <button onClick={exportCsv} style={ghostBtn}>
          ⬇ Export CSV
        </button>
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
    </div>
  );
};

/* === STYLES === */
const page = {
  backgroundColor: "#f8fafc",
  minHeight: "100vh",
  padding: "30px",
  color: "#1e293b",
  fontFamily: "'Inter', system-ui, sans-serif",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const header = {
  width: "100%",
  maxWidth: "1200px",
  marginBottom: "20px",
  textAlign: "center",
};

const title = {
  fontSize: "2rem",
  fontWeight: 700,
  color: "#0f172a",
};

const uploadRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginBottom: "20px",
  justifyContent: "center",
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
  color: "#1e293b",
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
  marginBottom: "20px",
  width: "100%",
  maxWidth: "1200px",
};

const summaryCard = {
  background: "#fff",
  borderRadius: "12px",
  padding: "16px",
  textAlign: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};

const summaryLabel = { fontSize: "0.9rem", color: "#64748b" };
const summaryValue = { fontSize: "1.5rem", fontWeight: 700, color: "#0f172a" };

const filtersRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginBottom: "15px",
  justifyContent: "center",
  width: "100%",
  maxWidth: "1200px",
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
  minWidth: "160px",
};

const tableWrap = {
  overflowX: "auto",
  width: "100%",
  maxWidth: "1200px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
};

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