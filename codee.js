
ERROR in [eslint]
src\pages\EmployeeTravelDashboard.jsx
  Line 342:1:  Import in body of module; reorder to top  import/first
  Line 343:1:  Import in body of module; reorder to top  import/first
  Line 344:1:  Import in body of module; reorder to top  import/first
  Line 345:1:  Import in body of module; reorder to top  import/first
  Line 346:1:  Import in body of module; reorder to top  import/first

Search for the keywords to learn more about each error.

webpack compiled with 1 error and 1 warning



import React, { useState, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  FiActivity,
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
    const [filters, setFilters] = useState({ country: "", legType: "", search: "" });
    const [pastUploads, setPastUploads] = useState([]);

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const uploadFile = async () => {
        if (!file) return toast.warn("Please select an Excel or CSV file first.");

        // ✅ Enforce filename to contain a valid date like 20251028
        const validName = /\d{8}/.test(file.name);
        if (!validName) {
            return toast.error(
                "Filename must include a date (e.g. EMPLOYEES_TRAVELING_TODAY-20251028.csv)"
            );
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await axios.post("http://localhost:8000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const data = res.data || {};
            const rows = data.items || [];
            setItems(rows);
            setSummary(data.summary || {});

            if (data.status === "already_uploaded") {
                toast.info(data.message || "File already uploaded earlier.");
            } else {
                toast.success(data.message || "File uploaded successfully.");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.detail || "Upload failed. Please check the backend or file format.");
        } finally {
            setLoading(false);
        }
    };

    const fetchUploads = async () => {
        try {
            const res = await axios.get("http://localhost:8000/uploads");
            setPastUploads(res.data.uploads || []);
            toast.success("Fetched past uploads.");
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch uploads.");
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
            <ToastContainer position="top-right" autoClose={3000} theme="light" />
            {loading && (
                <div style={overlay}>
                    <span style={loader}></span>
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
                                <div style={{ ...statIconWrapper, background: "#dcfce7" }}>
                                    <FiCheckCircle style={{ ...statIcon, color: "#16a34a" }} />
                                </div>
                                <div style={statContent}>
                                    <span style={statLabel}>Active Now</span>
                                    <strong style={statValue}>
                                        {safeItems.filter((r) => r.active_now).length}
                                    </strong>
                                </div>
                            </div>
                            <div style={statItem}>
                                <div style={{ ...statIconWrapper, background: "#dbeafe" }}>
                                    <FiMapPin style={{ ...statIcon, color: "#2563eb" }} />
                                </div>
                                <div style={statContent}>
                                    <span style={statLabel}>Countries</span>
                                    <strong style={statValue}>{countries.length}</strong>
                                </div>
                            </div>
                            <div style={statItem}>
                                <div style={{ ...statIconWrapper, background: "#fef3c7" }}>
                                    <FiAward style={{ ...statIcon, color: "#d97706" }} />
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
                                <FiFileText size={24} style={{ color: "#9ca3af", marginBottom: "8px" }} />
                                <p style={sideEmpty}>No data available</p>
                            </div>
                        ) : (
                            <ul style={countryList}>
                                {countryStats.map((c, index) => (
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
                                    <FiUpload style={{ marginRight: "8px" }} />
                                    {file ? file.name : "Choose File"}
                                </label>
                            </div>

                            <div style={buttonGroup}>
                                <button onClick={uploadFile} disabled={loading} style={loading ? disabledPrimaryBtn : primaryBtn}>
                                    {loading ? (
                                        <>
                                            <div style={spinner}></div> Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FiUpload style={{ marginRight: "8px" }} /> Upload File
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
                                    <FiTrash2 style={{ marginRight: "8px" }} /> Clear
                                </button>
                                <button onClick={exportCsv} style={ghostBtn}>
                                    <FiDownload style={{ marginRight: "8px" }} /> Export CSV
                                </button>
                                <button onClick={fetchUploads} style={ghostBtn}>
                                    <FiFileText style={{ marginRight: "8px" }} /> View Upload History
                                </button>
                            </div>
                        </div>

                        {/* Upload history table */}
                        {pastUploads.length > 0 && (
                            <div style={tableSection}>
                                <div style={tableHeader}>
                                    <h3 style={tableTitle}>Previous Uploads</h3>
                                    <span style={tableBadge}>{pastUploads.length}</span>
                                </div>
                                <div style={tableWrap}>
                                    <table style={table}>
                                        <thead style={thead}>
                                            <tr>
                                                <th style={th}>File Date</th>
                                                <th style={th}>Rows</th>
                                                <th style={th}>Removed</th>
                                                <th style={th}>Parse Errors</th>
                                                <th style={th}>Active Now</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pastUploads.map((u, i) => (
                                                <tr key={i} style={i % 2 === 0 ? rowEven : rowOdd}>
                                                    <td style={td}>{u.file_date}</td>
                                                    <td style={td}>{u.rows_received}</td>
                                                    <td style={td}>{u.rows_removed_as_footer_or_empty}</td>
                                                    <td style={td}>{u.rows_with_parse_errors}</td>
                                                    <td style={td}>{u.active_now_count}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

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
    background: "linear-gradient(
