this dashboard i want wiht more future and..
  user frindley.. with pop up table  clickbalr option. 
  wiht multople section. in one dashboard. data anahlise wiht different different secion / part. 
  that help to more ok.
  so can you do this. 


// C:\Users\W0024618\Desktop\swipeData\client\src\pages\EmployeeTravelDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Player } from "@lottiefiles/react-lottie-player"; 

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



      // 🆕 Load saved data on page reload
  useEffect(() => {
    const loadPreviousData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/data");
        const payload = res.data || {};
        const rows = payload.items || [];
        setItems(rows);
        setSummary(payload.summary || {});
        if (rows.length > 0) {
          toast.info(`Loaded ${rows.length} saved records from previous session.`);
        }
      } catch (err) {
        console.log("No saved data found yet.");
      }
    };
    loadPreviousData();
  }, []);

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



    // 🆕 Find travelers who are traveling today (30-10-2025)
const today = new Date(); // use current date in production
today.setHours(0, 0, 0, 0); // normalize to midnight for comparison

const todayTravelers = safeItems.filter((r) => {
  if (!r.begin_dt) return false;
  const start = new Date(r.begin_dt);
  start.setHours(0, 0, 0, 0);
  return start.getTime() === today.getTime(); // only if start date = today
});

const filtered = safeItems
  .filter((r) => {
    const s = filters.search.toLowerCase();
    if (s) {
      const hay = `${r.first_name ?? ""} ${r.last_name ?? ""} ${r.email ?? ""}`.toLowerCase();
      if (!hay.includes(s)) return false;
    }
    if (filters.country && r.from_country !== filters.country) return false;
    if (filters.legType && r.leg_type !== filters.legType) return false;
    return true;
  })
  // 🆕 Sort so active travelers appear first
  .sort((a, b) => (b.active_now === true) - (a.active_now === true));


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
            {loading && (
                <div style={style.overlay}>
                    <span style={style.loader}></span>
                   
                    <style>{keyframes}</style>
                </div>
            )}
            {/* HEADER */}
            <header style={header}>
                <div style={headerContent}>
                    <div style={headerIcon}>
                        <FiGlobe size={32} />
                    </div>
                    <div>
                        <h1 style={title}>Travel Details</h1>
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
                                <div style={{ ...statIconWrapper, background: '#dcfce7' }}>
                                    <FiCheckCircle style={{ ...statIcon, color: '#16a34a' }} />
                                </div>
                                <div style={statContent}>
                                    <span style={statLabel}>Active Now</span>
                                    <strong style={statValue}>{safeItems.filter((r) => r.active_now).length}</strong>
                                </div>
                            </div>
                            <div style={statItem}>
                                <div style={{ ...statIconWrapper, background: '#dbeafe' }}>
                                    <FiMapPin style={{ ...statIcon, color: '#2563eb' }} />
                                </div>
                                <div style={statContent}>
                                    <span style={statLabel}>Countries</span>
                                    <strong style={statValue}>{countries.length}</strong>
                                </div>
                            </div>
                            <div style={statItem}>
                                <div style={{ ...statIconWrapper, background: '#fef3c7' }}>
                                    <FiAward style={{ ...statIcon, color: '#d97706' }} />
                                </div>
                                <div style={statContent}>
                                    <span style={statLabel}>Travel Types</span>
                                    <strong style={statValue}>{legTypes.length}</strong>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* 🆕 TODAY'S TRAVELERS SECTION */}
<div style={sideCard}>
  <div style={cardHeader}>
    <FiCalendar style={cardIcon} />
    <h3 style={sideTitle}>Today's Travelers ({today.toLocaleDateString()})</h3>
  </div>

  {todayTravelers.length === 0 ? (
    <div style={emptyState}>
      <FiFileText size={24} style={{ color: '#9ca3af', marginBottom: '8px' }} />
      <p style={sideEmpty}>No one is traveling today</p>
    </div>
  ) : (
    <ul style={countryList}>
      {todayTravelers.map((t, i) => (
        <li key={i} style={countryItem}>
          <div style={countryInfo}>
            <span style={countryRank}>{i + 1}</span>
            <span style={countryName}>
              {t.first_name} {t.last_name}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {t.from_country} → {t.to_country}
          </div>
        </li>
      ))}
    </ul>
  )}
</div>


                    <div style={sideCard}>
                        <div style={cardHeader}>
                            <FiMapPin style={cardIcon} />
                            <h3 style={sideTitle}>Country-wise Travelers</h3>
                        </div>
                        {countryStats.length === 0 ? (
                            <div style={emptyState}>
                                <FiFileText size={24} style={{ color: '#9ca3af', marginBottom: '8px' }} />
                                <p style={sideEmpty}>No data available</p>
                            </div>
                        ) : (
                            <ul style={countryList}>
                                {countryStats.slice().map((c, index) => (
                                    <li key={c.country} style={countryItem}>
                                        <div style={countryInfo}>
                                            <span style={countryRank}>{index + 1}</span>
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
                                    <FiUpload style={{ marginRight: '8px' }} />
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
                                            <FiUpload style={{ marginRight: '8px' }} />
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
                                    <FiTrash2 style={{ marginRight: '8px' }} />
                                    Clear
                                </button>
                                <button onClick={exportCsv} style={ghostBtn}>
                                    <FiDownload style={{ marginRight: '8px' }} />
                                    Export CSV
                                </button>
                            </div>
                        </div>

                        <div style={filtersSection}>
                            <div style={filtersHeader}>
                                <FiFilter style={{ marginRight: '8px', color: '#6b7280' }} />
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
                                                        <FiFileText size={32} style={{ color: '#9ca3af', marginBottom: '12px' }} />
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
                                                            <FiMail size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
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
                                                            <FiCalendar size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
                                                            {fmt(r.begin_dt)}
                                                        </div>
                                                    </td>
                                                    <td style={td}>
                                                        <div style={dateCell}>
                                                            <FiCalendar size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
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
    // backgroundColor: "#19191aff",
    minHeight: "100vh",
    padding: "24px",
    color: "#1e293b",
    // color: "#e7eaeeff",
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
   alignItems: "center",
    zIndex: 9999,
    color: "#fff",
    fontSize: "16px",
    backdropFilter: "blur(4px)",
  },
  loader: {
    fontSize: "10px",
    width: "1em",
    height: "1em",
    borderRadius: "50%",
    position: "relative",
    textIndent: "-9999em",
    animation: "mulShdSpin 1.1s infinite ease",
    transform: "translateZ(0)",
  },
  text: {
    marginTop: "17px",
  },
};
