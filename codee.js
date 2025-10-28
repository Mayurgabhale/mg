and write reminie css wiht same desing 
ERROR in ./src/App.js 1820:42-65
export 'default' (imported as 'EmployeeTravelDashboard') was not found in './pages/EmployeeTravelDashboard' (module has no exports)

ERROR in [eslint]
src\pages\EmployeeTravelDashboard.jsx
  Line 521:27:  'emptyState' is not defined     no-undef
  Line 523:27:  'sideEmpty' is not defined      no-undef
  Line 602:36:  'searchIcon' is not defined     no-undef
  Line 607:28:  'searchInput' is not defined    no-undef
  Line 613:26:  'select' is not defined         no-undef
  Line 623:26:  'select' is not defined         no-undef
  Line 633:25:  'tableSection' is not defined   no-undef
  Line 634:27:  'tableHeader' is not defined    no-undef
  Line 635:28:  'tableTitle' is not defined     no-undef
  Line 636:30:  'tableBadge' is not defined     no-undef
  Line 638:27:  'tableWrap' is not defined      no-undef
  Line 639:31:  'table' is not defined          no-undef
  Line 640:33:  'thead' is not defined          no-undef
  Line 642:34:  'th' is not defined             no-undef
  Line 643:34:  'th' is not defined             no-undef
  Line 644:34:  'th' is not defined             no-undef
  Line 645:34:  'th' is not defined             no-undef
  Line 646:34:  'th' is not defined             no-undef
  Line 647:34:  'th' is not defined             no-undef
  Line 648:34:  'th' is not defined             no-undef
  Line 649:34:  'th' is not defined             no-undef
  Line 655:48:  'emptyRow' is not defined       no-undef
  Line 656:39:  'emptyState' is not defined     no-undef
  Line 659:39:  'emptySubtext' is not defined   no-undef
  Line 665:58:  'rowEven' is not defined        no-undef
  Line 665:68:  'rowOdd' is not defined         no-undef
  Line 666:38:  'td' is not defined             no-undef
  Line 668:43:  'activeBadge' is not defined    no-undef
  Line 673:43:  'inactiveBadge' is not defined  no-undef
  Line 679:38:  'td' is not defined             no-undef
  Line 680:41:  'userCell' is not defined       no-undef
  Line 681:43:  'avatar' is not defined         no-undef
  Line 689:38:  'td' is not defined             no-undef
  Line 690:41:  'emailCell' is not defined      no-undef
  Line 695:38:  'td' is not defined             no-undef
  Line 696:42:  'typeBadge' is not defined      no-undef
  Line 698:38:  'td' is not defined             no-undef
  Line 699:38:  'td' is not defined             no-undef
  Line 700:38:  'td' is not defined             no-undef
  Line 701:41:  'dateCell' is not defined       no-undef
  Line 706:38:  'td' is not defined             no-undef
  Line 707:41:  'dateCell' is not defined       no-undef

Search for the keywords to learn more about each error.

webpack compiled with 2 errors and 1 warning



// /////////////////
import React, { useState, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import real icons
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

const  EmployeeTravelDashboard  = () => {
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
    toast.success("CSV exported successfully.");
  };

  return (
    <div style={page}>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* HEADER */}
      <header style={header}>
        <div style={headerContent}>
          <div style={headerIcon}>
            <FiGlobe size={32} />
          </div>
          <div>
            <h1 style={title}>Employee Travel Dashboard</h1>
            <p style={subtitle}>Manage and monitor employee travel activities</p>
          </div>
        </div>
      </header>

      <div style={layout}>
        {/* LEFT PANEL */}
        <aside style={sidebar}>
          <div style={sideCard}>
            <div style={cardHeader}>
              <FiActivity style={cardIcon} />
              <h3 style={sideTitle}>Overview</h3>
            </div>
            <div style={statsGrid}>
              <div style={statItem}>
                <div style={statIconWrapper}>
                  <FiUsers style={statIcon} />
                </div>
                <div style={statContent}>
                  <span style={statLabel}>Total Travelers</span>
                  <strong style={statValue}>{safeItems.length}</strong>
                </div>
              </div>
              <div style={statItem}>
                <div style={{...statIconWrapper, background: '#dcfce7'}}>
                  <FiCheckCircle style={{...statIcon, color: '#16a34a'}} />
                </div>
                <div style={statContent}>
                  <span style={statLabel}>Active Now</span>
                  <strong style={statValue}>{safeItems.filter((r) => r.active_now).length}</strong>
                </div>
              </div>
              <div style={statItem}>
                <div style={{...statIconWrapper, background: '#dbeafe'}}>
                  <FiMapPin style={{...statIcon, color: '#2563eb'}} />
                </div>
                <div style={statContent}>
                  <span style={statLabel}>Countries</span>
                  <strong style={statValue}>{countries.length}</strong>
                </div>
              </div>
              <div style={statItem}>
                <div style={{...statIconWrapper, background: '#fef3c7'}}>
                  <FiAward style={{...statIcon, color: '#d97706'}} />
                </div>
                <div style={statContent}>
                  <span style={statLabel}>Travel Types</span>
                  <strong style={statValue}>{legTypes.length}</strong>
                </div>
              </div>
            </div>
          </div>

          <div style={sideCard}>
            <div style={cardHeader}>
              <FiMapPin style={cardIcon} />
              <h3 style={sideTitle}>Country-wise Travelers</h3>
            </div>
            {countryStats.length === 0 ? (
              <div style={emptyState}>
                <FiFileText size={24} style={{color: '#9ca3af', marginBottom: '8px'}} />
                <p style={sideEmpty}>No data available</p>
              </div>
            ) : (
              <ul style={countryList}>
                {countryStats.slice(0, 8).map((c, index) => (
                  <li key={c.country} style={countryItem}>
                    <div style={countryInfo}>
                      <span style={countryRank}>#{index + 1}</span>
                      <span style={countryName}>{c.country}</span>
                    </div>
                    <strong style={countryCount}>{c.count}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* RIGHT PANEL */}
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
                  <FiUpload style={{marginRight: '8px'}} />
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
                    <>
                      <div style={spinner}></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiUpload style={{marginRight: '8px'}} />
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
                  <FiTrash2 style={{marginRight: '8px'}} />
                  Clear
                </button>
                <button onClick={exportCsv} style={ghostBtn}>
                  <FiDownload style={{marginRight: '8px'}} />
                  Export CSV
                </button>
              </div>
            </div>

            <div style={filtersSection}>
              <div style={filtersHeader}>
                <FiFilter style={{marginRight: '8px', color: '#6b7280'}} />
                <span style={filtersTitle}>Filters</span>
              </div>
              <div style={filtersRow}>
                <div style={searchWrapper}>
                  <FiSearch style={searchIcon} />
                  <input
                    placeholder="Search by name or email..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    style={searchInput}
                  />
                </div>
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
            </div>

            <div style={tableSection}>
              <div style={tableHeader}>
                <h3 style={tableTitle}>Travel Records</h3>
                <span style={tableBadge}>{filtered.length} records</span>
              </div>
              <div style={tableWrap}>
                <table style={table}>
                  <thead style={thead}>
                    <tr>
                      <th style={th}>Status</th>
                      <th style={th}>Traveler</th>
                      <th style={th}>Email</th>
                      <th style={th}>Type</th>
                      <th style={th}>From</th>
                      <th style={th}>To</th>
                      <th style={th}>Start Date</th>
                      <th style={th}>End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={emptyRow}>
                          <div style={emptyState}>
                            <FiFileText size={32} style={{color: '#9ca3af', marginBottom: '12px'}} />
                            <p>No matching results found</p>
                            <p style={emptySubtext}>Upload a file or adjust your filters</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((r, i) => (
                        <tr key={i} style={i % 2 === 0 ? rowEven : rowOdd}>
                          <td style={td}>
                            {r.active_now ? (
                              <div style={activeBadge}>
                                <FiCheckCircle size={14} />
                                Active
                              </div>
                            ) : (
                              <div style={inactiveBadge}>
                                <FiXCircle size={14} />
                                Inactive
                              </div>
                            )}
                          </td>
                          <td style={td}>
                            <div style={userCell}>
                              <div style={avatar}>
                                <FiUser size={14} />
                              </div>
                              <span>
                                {r.first_name} {r.last_name}
                              </span>
                            </div>
                          </td>
                          <td style={td}>
                            <div style={emailCell}>
                              <FiMail size={14} style={{marginRight: '6px', color: '#6b7280'}} />
                              {r.email}
                            </div>
                          </td>
                          <td style={td}>
                            <span style={typeBadge}>{r.leg_type}</span>
                          </td>
                          <td style={td}>{r.from_country}</td>
                          <td style={td}>{r.to_country}</td>
                          <td style={td}>
                            <div style={dateCell}>
                              <FiCalendar size={14} style={{marginRight: '6px', color: '#6b7280'}} />
                              {fmt(r.begin_dt)}
                            </div>
                          </td>
                          <td style={td}>
                            <div style={dateCell}>
                              <FiCalendar size={14} style={{marginRight: '6px', color: '#6b7280'}} />
                              {fmt(r.end_dt)}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

/* === ENHANCED STYLES === */
const page = {
  backgroundColor: "#f8fafc",
  minHeight: "100vh",
  padding: "24px",
  color: "#1e293b",
  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  lineHeight: "1.5",
};

const header = {
  marginBottom: "32px",
};

const headerContent = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const headerIcon = {
  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
  color: "white",
  padding: "16px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const title = {
  fontSize: "28px",
  fontWeight: 700,
  color: "#0f172a",
  margin: 0,
  lineHeight: "1.2",
};

const subtitle = {
  fontSize: "16px",
  color: "#64748b",
  margin: 0,
  fontWeight: 400,
};

const layout = {
  display: "flex",
  gap: "24px",
  alignItems: "flex-start",
  maxWidth: "1400px",
  margin: "0 auto",
};

const sidebar = {
  flex: "0 0 320px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const main = {
  flex: "1 1 800px",
  minWidth: 0,
};

const card = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  border: "1px solid #e2e8f0",
};

const sideCard = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  border: "1px solid #e2e8f0",
};

const cardHeader = {
  display: "flex",
  alignItems: "center",
  marginBottom: "20px",
};

const cardIcon = {
  color: "#3b82f6",
  marginRight: "12px",
  fontSize: "20px",
};

const sideTitle = {
  fontSize: "18px",
  fontWeight: 600,
  color: "#1e293b",
  margin: 0,
};

const statsGrid = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const statItem = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 0",
};

const statIconWrapper = {
  background: "#eff6ff",
  padding: "12px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const statIcon = {
  fontSize: "18px",
  color: "#3b82f6",
};

const statContent = {
  flex: 1,
};

const statLabel = {
  fontSize: "14px",
  color: "#64748b",
  display: "block",
  marginBottom: "4px",
};

const statValue = {
  fontSize: "20px",
  fontWeight: 700,
  color: "#1e293b",
  display: "block",
};

const countryList = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const countryItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 0",
  borderBottom: "1px solid #f1f5f9",
};

const countryInfo = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const countryRank = {
  background: "#f1f5f9",
  color: "#64748b",
  fontSize: "12px",
  fontWeight: 600,
  padding: "4px 8px",
  borderRadius: "6px",
  minWidth: "32px",
  textAlign: "center",
};

const countryName = {
  color: "#374151",
  fontWeight: 500,
};

const countryCount = {
  color: "#1e293b",
  fontWeight: 600,
  background: "#f8fafc",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "14px",
};

const uploadRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  marginBottom: "24px",
  alignItems: "center",
};

const fileUploadWrapper = {
  flex: "1",
  minWidth: "200px",
};

const fileInput = {
  display: "none",
};

const fileInputLabel = {
  display: "flex",
  alignItems: "center",
  padding: "12px 16px",
  borderRadius: "10px",
  border: "2px dashed #d1d5db",
  background: "#f9fafb",
  cursor: "pointer",
  color: "#6b7280",
  fontWeight: 500,
  transition: "all 0.2s ease",
  justifyContent: "center",
};

const buttonGroup = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const primaryBtn = {
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  padding: "12px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  transition: "all 0.2s ease",
  boxShadow: "0 1px 3px 0 rgba(59, 130, 246, 0.3)",
};

const disabledPrimaryBtn = {
  ...primaryBtn,
  background: "#9ca3af",
  cursor: "not-allowed",
  boxShadow: "none",
};

const secondaryBtn = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  padding: "12px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  color: "#374151",
  fontWeight: 500,
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  transition: "all 0.2s ease",
};

const ghostBtn = {
  background: "transparent",
  border: "1px solid #d1d5db",
  padding: "12px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  color: "#374151",
  fontWeight: 500,
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  transition: "all 0.2s ease",
};

const spinner = {
  width: "16px",
  height: "16px",
  border: "2px solid transparent",
  borderTop: "2px solid #ffffff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  marginRight: "8px",
};

const filtersSection = {
  marginBottom: "24px",
  padding: "20px",
  background: "#f8fafc",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
};

const filtersHeader = {
  display: "flex",
  alignItems: "center",
  marginBottom: "16px",
  fontSize: "16px",
  fontWeight: 600,
  color: "#374151",
};

const filtersTitle = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#374151",
};

const filtersRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
};

const searchWrapper = {
  position: "relative"}

