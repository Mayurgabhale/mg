this i want dark and light theme... 
    how to do this give me only uddae code not all 
// C:\Users\W0024618\Desktop\swipeData\client\src\pages\EmployeeTravelDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
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
    FiActivity,
    FiBarChart2,
    FiTrendingUp,
    FiClock,
    FiEye,
    FiX,
    FiArrowUp,
    FiArrowDown
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
        status: ""
    });
    const [selectedTraveler, setSelectedTraveler] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

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

    // 🆕 Enhanced Analytics Data
    const analytics = useMemo(() => {
        const active = safeItems.filter(r => r.active_now).length;
        const upcoming = safeItems.filter(r => {
            if (!r.begin_dt) return false;
            return new Date(r.begin_dt) > new Date();
        }).length;
        
        const countries = [...new Set(safeItems.map(r => r.from_country).filter(Boolean))];
        const legTypes = [...new Set(safeItems.map(r => r.leg_type).filter(Boolean))];
        
        // Travel duration analysis
        const durations = safeItems.map(r => {
            if (!r.begin_dt || !r.end_dt) return 0;
            const start = new Date(r.begin_dt);
            const end = new Date(r.end_dt);
            return Math.max(0, (end - start) / (1000 * 60 * 60 * 24)); // days
        }).filter(d => d > 0);
        
        const avgDuration = durations.length > 0 ? 
            durations.reduce((a, b) => a + b, 0) / durations.length : 0;

        return {
            active,
            upcoming,
            totalCountries: countries.length,
            totalTypes: legTypes.length,
            avgDuration: avgDuration.toFixed(1),
            totalTravelers: safeItems.length
        };
    }, [safeItems]);

    // 🆕 Country Statistics with enhanced data
    const countryStats = useMemo(() => {
        const map = {};
        safeItems.forEach(r => {
            const c = r.from_country || "Unknown";
            if (!map[c]) {
                map[c] = { count: 0, active: 0, travelers: new Set() };
            }
            map[c].count++;
            if (r.active_now) map[c].active++;
            map[c].travelers.add(`${r.first_name} ${r.last_name}`);
        });
        
        return Object.entries(map)
            .map(([country, data]) => ({
                country,
                count: data.count,
                active: data.active,
                travelerCount: data.travelers.size
            }))
            .sort((a, b) => b.count - a.count);
    }, [safeItems]);

    // 🆕 Travel Type Analysis
    const travelTypeStats = useMemo(() => {
        const map = {};
        safeItems.forEach(r => {
            const type = r.leg_type || "Unknown";
            if (!map[type]) {
                map[type] = { count: 0, active: 0, countries: new Set() };
            }
            map[type].count++;
            if (r.active_now) map[type].active++;
            if (r.from_country) map[type].countries.add(r.from_country);
        });
        
        return Object.entries(map)
            .map(([type, data]) => ({
                type,
                count: data.count,
                active: data.active,
                countryCount: data.countries.size
            }))
            .sort((a, b) => b.count - a.count);
    }, [safeItems]);

    // 🆕 Recent Travelers (last 7 days)
    const recentTravelers = useMemo(() => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        return safeItems
            .filter(r => r.begin_dt && new Date(r.begin_dt) >= sevenDaysAgo)
            .sort((a, b) => new Date(b.begin_dt) - new Date(a.begin_dt))
            .slice(0, 10);
    }, [safeItems]);

    const countries = useMemo(
        () => [...new Set(safeItems.map((r) => r.from_country).filter(Boolean))],
        [safeItems]
    );
    const legTypes = useMemo(
        () => [...new Set(safeItems.map((r) => r.leg_type).filter(Boolean))],
        [safeItems]
    );

    // 🆕 Today's Travelers
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTravelers = safeItems.filter((r) => {
        if (!r.begin_dt) return false;
        const start = new Date(r.begin_dt);
        start.setHours(0, 0, 0, 0);
        return start.getTime() === today.getTime();
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
            if (filters.status === "active" && !r.active_now) return false;
            if (filters.status === "inactive" && r.active_now) return false;
            return true;
        })
        .sort((a, b) => (b.active_now === true) - (a.active_now === true));

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

    // 🆕 Traveler Detail Popup Component
    const TravelerDetailPopup = ({ traveler, onClose }) => {
        if (!traveler) return null;
        
        return (
            <div style={popupOverlay}>
                <div style={popupContent}>
                    <div style={popupHeader}>
                        <h3 style={popupTitle}>Traveler Details</h3>
                        <button onClick={onClose} style={popupCloseBtn}>
                            <FiX size={20} />
                        </button>
                    </div>
                    
                    <div style={popupBody}>
                        <div style={detailSection}>
                            <div style={detailRow}>
                                <div style={detailItem}>
                                    <strong>Name:</strong>
                                    <span>{traveler.first_name} {traveler.last_name}</span>
                                </div>
                                <div style={detailItem}>
                                    <strong>Email:</strong>
                                    <span>{traveler.email}</span>
                                </div>
                            </div>
                            
                            <div style={detailRow}>
                                <div style={detailItem}>
                                    <strong>Status:</strong>
                                    <span style={traveler.active_now ? activeBadge : inactiveBadge}>
                                        {traveler.active_now ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <div style={detailItem}>
                                    <strong>Travel Type:</strong>
                                    <span>{traveler.leg_type}</span>
                                </div>
                            </div>
                            
                            <div style={detailRow}>
                                <div style={detailItem}>
                                    <strong>From Country:</strong>
                                    <span>{traveler.from_country}</span>
                                </div>
                                <div style={detailItem}>
                                    <strong>To Country:</strong>
                                    <span>{traveler.to_country}</span>
                                </div>
                            </div>
                            
                            <div style={detailRow}>
                                <div style={detailItem}>
                                    <strong>Start Date:</strong>
                                    <span>{fmt(traveler.begin_dt)}</span>
                                </div>
                                <div style={detailItem}>
                                    <strong>End Date:</strong>
                                    <span>{fmt(traveler.end_dt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={page}>
            <ToastContainer position="top-right" autoClose={3000} />
            {loading && (
                <div style={style.overlay}>
                    <span style={style.loader}></span>
                    <style>{keyframes}</style>
                </div>
            )}
            
            {/* Traveler Detail Popup */}
            <TravelerDetailPopup 
                traveler={selectedTraveler} 
                onClose={() => setSelectedTraveler(null)} 
            />

            {/* HEADER */}
            <header style={header}>
                <div style={headerContent}>
                    <div style={headerIcon}>
                        <FiGlobe size={32} />
                    </div>
                    <div>
                        <h1 style={title}>Employee Travel Analytics Dashboard</h1>
                        <p style={subtitle}>Comprehensive travel management and monitoring system</p>
                    </div>
                </div>
            </header>

            <div style={layout}>
                {/* LEFT PANEL - Navigation */}
                <aside style={sidebar}>
                    <nav style={nav}>
                        {[
                            { id: "overview", label: "Overview", icon: FiActivity },
                            { id: "analytics", label: "Analytics", icon: FiBarChart2 },
                            { id: "recent", label: "Recent Travels", icon: FiClock },
                            { id: "countries", label: "Country Analysis", icon: FiMapPin },
                            { id: "types", label: "Travel Types", icon: FiAward }
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                style={{
                                    ...navItem,
                                    ...(activeTab === item.id ? navItemActive : {})
                                }}
                            >
                                <item.icon style={navIcon} />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Quick Stats */}
                    <div style={sideCard}>
                        <div style={cardHeader}>
                            <FiTrendingUp style={cardIcon} />
                            <h3 style={sideTitle}>Quick Stats</h3>
                        </div>
                        <div style={statsGrid}>
                            <div style={statItem}>
                                <div style={statIconWrapper}>
                                    <FiUsers style={statIcon} />
                                </div>
                                <div style={statContent}>
                                    <span style={statLabel}>Total Travelers</span>
                                    <strong style={statValue}>{analytics.totalTravelers}</strong>
                                </div>
                            </div>
                            <div style={statItem}>
                                <div style={{ ...statIconWrapper, background: '#dcfce7' }}>
                                    <FiCheckCircle style={{ ...statIcon, color: '#16a34a' }} />
                                </div>
                                <div style={statContent}>
                                    <span style={statLabel}>Active Now</span>
                                    <strong style={statValue}>{analytics.active}</strong>
                                </div>
                            </div>
                            <div style={statItem}>
                                <div style={{ ...statIconWrapper, background: '#dbeafe' }}>
                                    <FiClock style={{ ...statIcon, color: '#2563eb' }} />
                                </div>
                                <div style={statContent}>
                                    <span style={statLabel}>Upcoming</span>
                                    <strong style={statValue}>{analytics.upcoming}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Today's Travelers */}
                    <div style={sideCard}>
                        <div style={cardHeader}>
                            <FiCalendar style={cardIcon} />
                            <h3 style={sideTitle}>Today's Travelers</h3>
                        </div>
                        {todayTravelers.length === 0 ? (
                            <div style={emptyState}>
                                <FiFileText size={24} style={{ color: '#9ca3af', marginBottom: '8px' }} />
                                <p style={sideEmpty}>No travels today</p>
                            </div>
                        ) : (
                            <ul style={countryList}>
                                {todayTravelers.slice(0, 5).map((t, i) => (
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
                </aside>

                {/* MAIN CONTENT */}
                <main style={main}>
                    {/* File Upload Section */}
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

                        {/* Filters Section */}
                        <div style={filtersSection}>
                            <div style={filtersHeader}>
                                <FiFilter style={{ marginRight: '8px', color: '#6b7280' }} />
                                <span style={filtersTitle}>Filters & Search</span>
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
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    style={select}
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active Only</option>
                                    <option value="inactive">Inactive Only</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Content based on Active Tab */}
                    {activeTab === "overview" && (
                        <div style={card}>
                            <div style={tableHeader}>
                                <h3 style={tableTitle}>All Travel Records</h3>
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
                                            <th style={th}>Actions</th>
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
                                                        <button 
                                                            onClick={() => setSelectedTraveler(r)}
                                                            style={viewButton}
                                                        >
                                                            <FiEye size={14} />
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "analytics" && (
                        <div style={analyticsGrid}>
                            <div style={analyticsCard}>
                                <h4 style={analyticsTitle}>Travel Analytics</h4>
                                <div style={analyticsStats}>
                                    <div style={analyticsStat}>
                                        <span style={analyticsLabel}>Average Duration</span>
                                        <strong style={analyticsValue}>{analytics.avgDuration} days</strong>
                                    </div>
                                    <div style={analyticsStat}>
                                        <span style={analyticsLabel}>Total Countries</span>
                                        <strong style={analyticsValue}>{analytics.totalCountries}</strong>
                                    </div>
                                    <div style={analyticsStat}>
                                        <span style={analyticsLabel}>Travel Types</span>
                                        <strong style={analyticsValue}>{analytics.totalTypes}</strong>
                                    </div>
                                </div>
                            </div>
                            
                            <div style={analyticsCard}>
                                <h4 style={analyticsTitle}>Country Distribution</h4>
                                <div style={countryChart}>
                                    {countryStats.slice(0, 5).map((stat, index) => (
                                        <div key={stat.country} style={chartBarWrapper}>
                                            <div style={chartBarLabel}>
                                                <span>{stat.country}</span>
                                                <span>{stat.count}</span>
                                            </div>
                                            <div style={chartBarTrack}>
                                                <div 
                                                    style={{
                                                        ...chartBarFill,
                                                        width: `${(stat.count / Math.max(...countryStats.map(s => s.count))) * 100}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "recent" && (
                        <div style={card}>
                            <div style={tableHeader}>
                                <h3 style={tableTitle}>Recent Travels (Last 7 Days)</h3>
                            </div>
                            <div style={tableWrap}>
                                <table style={table}>
                                    <thead style={thead}>
                                        <tr>
                                            <th style={th}>Traveler</th>
                                            <th style={th}>Destination</th>
                                            <th style={th}>Type</th>
                                            <th style={th}>Start Date</th>
                                            <th style={th}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTravelers.map((r, i) => (
                                            <tr key={i} style={i % 2 === 0 ? rowEven : rowOdd}>
                                                <td style={td}>
                                                    <div style={userCell}>
                                                        <div style={avatar}>
                                                            <FiUser size={14} />
                                                        </div>
                                                        {r.first_name} {r.last_name}
                                                    </div>
                                                </td>
                                                <td style={td}>{r.to_country}</td>
                                                <td style={td}>
                                                    <span style={typeBadge}>{r.leg_type}</span>
                                                </td>
                                                <td style={td}>{fmt(r.begin_dt)}</td>
                                                <td style={td}>
                                                    {r.active_now ? (
                                                        <div style={activeBadge}>
                                                            <FiCheckCircle size={14} />
                                                            Active
                                                        </div>
                                                    ) : (
                                                        <div style={inactiveBadge}>
                                                            <FiXCircle size={14} />
                                                            Completed
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "countries" && (
                        <div style={card}>
                            <div style={tableHeader}>
                                <h3 style={tableTitle}>Country-wise Analysis</h3>
                            </div>
                            <div style={tableWrap}>
                                <table style={table}>
                                    <thead style={thead}>
                                        <tr>
                                            <th style={th}>Country</th>
                                            <th style={th}>Total Travels</th>
                                            <th style={th}>Active</th>
                                            <th style={th}>Unique Travelers</th>
                                            <th style={th}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {countryStats.map((stat, i) => (
                                            <tr key={i} style={i % 2 === 0 ? rowEven : rowOdd}>
                                                <td style={td}>
                                                    <strong>{stat.country}</strong>
                                                </td>
                                                <td style={td}>{stat.count}</td>
                                                <td style={td}>
                                                    <span style={{ color: stat.active > 0 ? '#16a34a' : '#6b7280' }}>
                                                        {stat.active}
                                                    </span>
                                                </td>
                                                <td style={td}>{stat.travelerCount}</td>
                                                <td style={td}>
                                                    <button style={viewButton}>
                                                        <FiEye size={14} />
                                                        Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "types" && (
                        <div style={card}>
                            <div style={tableHeader}>
                                <h3 style={tableTitle}>Travel Type Analysis</h3>
                            </div>
                            <div style={tableWrap}>
                                <table style={table}>
                                    <thead style={thead}>
                                        <tr>
                                            <th style={th}>Travel Type</th>
                                            <th style={th}>Total</th>
                                            <th style={th}>Active</th>
                                            <th style={th}>Countries</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {travelTypeStats.map((stat, i) => (
                                            <tr key={i} style={i % 2 === 0 ? rowEven : rowOdd}>
                                                <td style={td}>
                                                    <strong>{stat.type}</strong>
                                                </td>
                                                <td style={td}>{stat.count}</td>
                                                <td style={td}>
                                                    <span style={{ color: stat.active > 0 ? '#16a34a' : '#6b7280' }}>
                                                        {stat.active}
                                                    </span>
                                                </td>
                                                <td style={td}>{stat.countryCount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

// Enhanced Styles
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
};

const layout = {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: "24px",
    alignItems: "start",
};

const sidebar = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
};

const nav = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
};

const navItem = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    border: "none",
    background: "transparent",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    color: "#64748b",
    transition: "all 0.2s ease",
};

const navItemActive = {
    background: "#3b82f6",
    color: "white",
};

const navIcon = {
    fontSize: "18px",
};

const sideCard = {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
};

const cardHeader = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
};

const cardIcon = {
    color: "#3b82f6",
    fontSize: "18px",
};

const sideTitle = {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1e293b",
    margin: 0,
};

const statsGrid = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
};

const statItem = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    background: "#f8fafc",
    borderRadius: "8px",
};

const statIconWrapper = {
    padding: "8px",
    borderRadius: "8px",
    background: "#dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const statIcon = {
    color: "#3b82f6",
    fontSize: "16px",
};

const statContent = {
    flex: 1,
};

const statLabel = {
    fontSize: "12px",
    color: "#64748b",
    display: "block",
};

const statValue = {
    fontSize: "18px",
    fontWeight: 700,
    color: "#1e293b",
    display: "block",
};

const countryList = {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
};

const countryItem = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #f1f5f9",
};

const countryInfo = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
};

const countryRank = {
    background: "#3b82f6",
    color: "white",
    fontSize: "12px",
    fontWeight: 600,
    width: "20px",
    height: "20px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const countryName = {
    fontSize: "14px",
    fontWeight: 500,
    color: "#1e293b",
};

const countryCount = {
    fontSize: "14px",
    fontWeight: 600,
    color: "#3b82f6",
};

const emptyState = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    color: "#64748b",
    textAlign: "center",
};

const sideEmpty = {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0,
};

const main = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
};

const card = {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
};

const uploadRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
};

const fileUploadWrapper = {
    flex: 1,
};

const fileInput = {
    display: "none",
};

const fileInputLabel = {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    background: "#f8fafc",
    border: "2px dashed #cbd5e1",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    color: "#64748b",
    transition: "all 0.2s ease",
};

const buttonGroup = {
    display: "flex",
    gap: "12px",
};

const primaryBtn = {
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    transition: "all 0.2s ease",
};

const disabledPrimaryBtn = {
    ...primaryBtn,
    background: "#94a3b8",
    cursor: "not-allowed",
};

const secondaryBtn = {
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    background: "transparent",
    color: "#64748b",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.2s ease",
};

const ghostBtn = {
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    background: "transparent",
    color: "#3b82f6",
    border: "1px solid #3b82f6",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.2s ease",
};

const spinner = {
    width: "16px",
    height: "16px",
    border: "2px solid transparent",
    borderTop: "2px solid currentColor",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginRight: "8px",
};

const filtersSection = {
    marginBottom: "20px",
};

const filtersHeader = {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
};

const filtersTitle = {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1e293b",
};

const filtersRow = {
    display: "flex",
    gap: "12px",
    alignItems: "center",
};

const searchWrapper = {
    position: "relative",
    flex: 1,
};

const searchIcon = {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#64748b",
};

const searchInput = {
    width: "100%",
    padding: "12px 12px 12px 40px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s ease",
};

const select = {
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    background: "white",
    outline: "none",
    minWidth: "140px",
};

const tableSection = {
    marginTop: "20px",
};

const tableHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
};

const tableTitle = {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1e293b",
    margin: 0,
};

const tableBadge = {
    background: "#3b82f6",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
};

const tableWrap = {
    overflowX: "auto",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
};

const table = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
};

const thead = {
    background: "#f8fafc",
};

const th = {
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: 600,
    color: "#475569",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
};

const td = {
    padding: "16px",
    borderBottom: "1px solid #f1f5f9",
};

const rowEven = {
    background: "white",
};

const rowOdd = {
    background: "#f8fafc",
};

const emptyRow = {
    textAlign: "center",
    padding: "40px",
};

const emptySubtext = {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0,
};

const activeBadge = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 8px",
    background: "#dcfce7",
    color: "#16a34a",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 500,
    width: "fit-content",
};

const inactiveBadge = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 8px",
    background: "#fef2f2",
    color: "#dc2626",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 500,
    width: "fit-content",
};

const userCell = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
};

const avatar = {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
};

const emailCell = {
    display: "flex",
    alignItems: "center",
};

const typeBadge = {
    padding: "4px 8px",
    background: "#dbeafe",
    color: "#1d4ed8",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 500,
};

const dateCell = {
    display: "flex",
    alignItems: "center",
};

const viewButton = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "6px 12px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 500,
    transition: "all 0.2s ease",
};

// 🆕 New Analytics Styles
const analyticsGrid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
};

const analyticsCard = {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
};

const analyticsTitle = {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1e293b",
    margin: "0 0 16px 0",
};

const analyticsStats = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
};

const analyticsStat = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    background: "#f8fafc",
    borderRadius: "8px",
};

const analyticsLabel = {
    fontSize: "14px",
    color: "#64748b",
};

const analyticsValue = {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1e293b",
};

const countryChart = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
};

const chartBarWrapper = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
};

const chartBarLabel = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#64748b",
};

const chartBarTrack = {
    height: "8px",
    background: "#e2e8f0",
    borderRadius: "4px",
    overflow: "hidden",
};

const chartBarFill = {
    height: "100%",
    background: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
    borderRadius: "4px",
    transition: "width 0.3s ease",
};

// 🆕 Popup Styles
const popupOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
};

const popupContent = {
    background: "white",
    borderRadius: "12px",
    padding: "0",
    maxWidth: "500px",
    width: "100%",
    maxHeight: "90vh",
    overflow: "hidden",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
};

const popupHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid #e2e8f0",
};

const popupTitle = {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1e293b",
    margin: 0,
};

const popupCloseBtn = {
    background: "none",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const popupBody = {
    padding: "24px",
};

const detailSection = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
};

const detailRow = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
};

const detailItem = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
};

// Existing loader styles
const style = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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

const keyframes = `
@keyframes mulShdSpin {
    0%, 100% { box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0; }
    12.5% { box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em; }
    25% { box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em; }
    37.5% { box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 0, 2em 2em 0 0.2em, 0 3em 0 0, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em; }
    50% { box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0, 0 3em 0 0.2em, -2em 2em 0 0, -3em 0 0 -1em, -2em -2em 0 -1em; }
    62.5% { box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em; }
    75% { box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0 0 0.2em, -2em -2em 0 0; }
    87.5% { box-shadow: 0 -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 0, -2em -2em 0 0.2em; }
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

export default EmployeeTravelDashboard;
