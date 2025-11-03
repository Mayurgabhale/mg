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
                           