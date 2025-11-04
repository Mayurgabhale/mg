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
    FiSun, FiMoon
} from "react-icons/fi";

import { BsPersonWalking } from "react-icons/bs";
import {
    FaCar,
    FaTruck,
    FaTrain,
    FaPlane,
    FaShip,
    FaBicycle, FaHotel
} from "react-icons/fa";

import { FaLocationArrow } from 'react-icons/fa6'; 

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
        location: "",
        legType: "",
        search: "",
        status: ""
    });
    const [selectedTraveler, setSelectedTraveler] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    // 🆕 Add theme state
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    // 🆕 Toggle theme function
    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };


    const styles = getStyles(isDarkTheme);


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

    const analytics = useMemo(() => {
        const active = safeItems.filter(r => r.active_now).length;
        
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
    const locations = useMemo(() => {
        const allLocations = [
            ...new Set([
                ...safeItems.map((r) => r.from_location).filter(Boolean),
                ...safeItems.map((r) => r.to_location).filter(Boolean)
            ])
        ];
        return allLocations.sort();
    }, [safeItems]);
    const legTypes = useMemo(
        () => [...new Set(safeItems.map((r) => r.leg_type).filter(Boolean))],
        [safeItems]
    );


    // 🆕 Travel Type Icons Mapping
    const getTravelTypeIcon = (type) => {
        if (!type) return FiGlobe;

        const typeLower = type.toLowerCase();
        if (typeLower.includes('car') || typeLower.includes('vehicle')) return FaCar;
        if (typeLower.includes('truck') || typeLower.includes('bus')) return FaTruck;
        if (typeLower.includes('train') || typeLower.includes('rail')) return FaTrain;
        if (typeLower.includes('plane') || typeLower.includes('air') || typeLower.includes('flight')) return FaPlane;
        if (typeLower.includes('ship') || typeLower.includes('boat') || typeLower.includes('sea')) return FaShip;
        if (typeLower.includes('bike') || typeLower.includes('cycle')) return FaBicycle;
        if (typeLower.includes('hotel') || typeLower.includes('HOTEL')) return FaHotel;
        if (typeLower.includes('stop') || typeLower.includes('stop')) return BsPersonWalking;
        return FaLocationArrow;
    };

    // 🆕 Travel Type Color Mapping
    const getTravelTypeColor = (type) => {
        if (!type) return '#6b7280';

        const typeLower = type.toLowerCase();
        if (typeLower.includes('car') || typeLower.includes('vehicle')) return '#dc2626';
        if (typeLower.includes('truck') || typeLower.includes('bus')) return '#ea580c';
        if (typeLower.includes('train') || typeLower.includes('rail')) return '#16a34a';
        if (typeLower.includes('plane') || typeLower.includes('air') || typeLower.includes('flight')) return '#2563eb';
        if (typeLower.includes('ship') || typeLower.includes('boat') || typeLower.includes('sea')) return '#7c3aed';
        if (typeLower.includes('bike') || typeLower.includes('cycle')) return '#ca8a04';
        return '#2465c1ff';
    };

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
                const hay = `${r.first_name ?? ""} ${r.last_name ?? ""} ${r.email ?? ""} ${r.from_location ?? ""} ${r.to_location ?? ""}`.toLowerCase();
                if (!hay.includes(s)) return false;
            }
            if (filters.country && r.from_country !== filters.country) return false;
            if (filters.location) {
                const fromLocationMatch = r.from_location && r.from_location.toLowerCase().includes(filters.location.toLowerCase());
                const toLocationMatch = r.to_location && r.to_location.toLowerCase().includes(filters.location.toLowerCase());
                if (!fromLocationMatch && !toLocationMatch) return false;
            }
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

    // Enhanced Traveler Detail Popup Component
    const TravelerDetailPopup = ({ traveler, onClose }) => {
        if (!traveler) return null;

        const TravelTypeIcon = getTravelTypeIcon(traveler.leg_type);
        const travelTypeColor = getTravelTypeColor(traveler.leg_type);

        // Calculate duration
        const getDuration = () => {
            if (!traveler.begin_dt || !traveler.end_dt) return 'Unknown';
            const start = new Date(traveler.begin_dt);
            const end = new Date(traveler.end_dt);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            return `${days} day${days !== 1 ? 's' : ''}`;
        };

        return (
            <div style={styles.popupOverlay}>
                <div style={styles.popupContent}>
                    {/* Header */}
                    <div style={styles.popupHeader}>
                        <div style={styles.headerContent}>
                            <div style={styles.avatarSection}>
                                <div style={styles.avatarLarge}>
                                    <FiUser size={24} />
                                </div>
                            </div>
                            <div style={styles.headerInfo}>
                                <h3 style={styles.popupTitle}>
                                    {traveler.first_name} {traveler.last_name}
                                </h3>
                                <p style={styles.employeeId}>Employee ID: {traveler.emp_id || 'N/A'}</p>
                            </div>
                        </div>
                        <button onClick={onClose} style={styles.popupCloseBtn}>
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div style={styles.popupBody}>
                        {/* Status Banner */}
                        <div style={styles.statusBanner}>
                            <div style={{
                                ...styles.statusBadge,
                                ...(traveler.active_now ? styles.activeStatus : styles.inactiveStatus)
                            }}>
                                <div style={{
                                    ...styles.statusDot,
                                    ...(traveler.active_now ? styles.activeDot : styles.inactiveDot)
                                }}></div>
                                {traveler.active_now ? "Currently Traveling" : "Travel Completed"}
                            </div>

                            <div style={{
                                ...styles.travelTypeBadge,
                                background: `${travelTypeColor}15`,
                                border: `1px solid ${travelTypeColor}30`,
                                color: travelTypeColor
                            }}>
                                <TravelTypeIcon size={16} />
                                <span style={styles.travelTypeText}>
                                    {traveler.leg_type || 'Unknown Type'}
                                </span>
                            </div>
                        </div>

                        {/* Details Container */}
                        <div style={styles.detailsContainer}>
                            {/* Personal Info */}
                            <div style={styles.detailSection}>
                                <div style={styles.sectionHeader}>
                                    <FiUser style={styles.sectionIcon} />
                                    <h4 style={styles.sectionTitle}>Personal Information</h4>
                                </div>
                                <div style={styles.detailList}>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Employee ID</span>
                                        <span style={styles.detailValue}>{traveler.emp_id || 'Not Provided'}</span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Full Name</span>
                                        <span style={styles.detailValue}>{traveler.first_name} {traveler.last_name}</span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Email</span>
                                        <span style={styles.detailValue}>
                                            <FiMail size={14} style={styles.inlineIcon} />
                                            {traveler.email || 'Not Provided'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Travel Info - From */}
                            <div style={styles.detailSection}>
                                <div style={styles.sectionHeader}>
                                    <FiMapPin style={{ ...styles.sectionIcon, color: '#ef4444' }} />
                                    <h4 style={styles.sectionTitle}>Departure Details</h4>
                                </div>
                                <div style={styles.detailList}>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>From Location</span>
                                        <span style={styles.detailValue}>
                                            <FiMapPin size={14} style={{ ...styles.inlineIcon, color: '#ef4444' }} />
                                            {traveler.from_location || 'Not specified'}
                                        </span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>From Country</span>
                                        <span style={styles.detailValue}>
                                            <FiGlobe size={14} style={{ ...styles.inlineIcon, color: '#3b82f6' }} />
                                            {traveler.from_country || 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Travel Info - To */}
                            <div style={styles.detailSection}>
                                <div style={styles.sectionHeader}>
                                    <FiMapPin style={{ ...styles.sectionIcon, color: '#10b981' }} />
                                    <h4 style={styles.sectionTitle}>Destination Details</h4>
                                </div>
                                <div style={styles.detailList}>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>To Location</span>
                                        <span style={styles.detailValue}>
                                            <FiMapPin size={14} style={{ ...styles.inlineIcon, color: '#10b981' }} />
                                            {traveler.to_location || 'Not specified'}
                                        </span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>To Country</span>
                                        <span style={styles.detailValue}>
                                            <FiGlobe size={14} style={{ ...styles.inlineIcon, color: '#3b82f6' }} />
                                            {traveler.to_country || 'Unknown'}
                                        </span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Travel Type</span>
                                        <span style={{
                                            ...styles.detailValue,
                                            color: travelTypeColor,
                                            fontWeight: '600'
                                        }}>
                                            <TravelTypeIcon size={14} style={styles.inlineIcon} />
                                            {traveler.leg_type || 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div style={styles.detailSection}>
                                <div style={styles.sectionHeader}>
                                    <FiCalendar style={styles.sectionIcon} />
                                    <h4 style={styles.sectionTitle}>Travel Timeline</h4>
                                </div>
                                <div style={styles.detailList}>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Start Date</span>
                                        <span style={styles.detailValue}>
                                            <FiClock size={14} style={styles.inlineIcon} />
                                            {fmt(traveler.begin_dt) || 'Not Set'}
                                        </span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>End Date</span>
                                        <span style={styles.detailValue}>
                                            <FiClock size={14} style={styles.inlineIcon} />
                                            {fmt(traveler.end_dt) || 'Not Set'}
                                        </span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Duration</span>
                                        <span style={styles.detailValue}>
                                            {getDuration()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div style={styles.detailSection}>
                                <div style={styles.sectionHeader}>
                                    <FiAward style={styles.sectionIcon} />
                                    <h4 style={styles.sectionTitle}>Additional Details</h4>
                                </div>
                                <div style={styles.detailList}>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Status</span>
                                        <span style={{
                                            ...styles.statusTag,
                                            ...(traveler.active_now ? styles.activeTag : styles.inactiveTag)
                                        }}>
                                            {traveler.active_now ? 'Active' : 'Completed'}
                                        </span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <span style={styles.detailLabel}>Last Updated</span>
                                        <span style={styles.detailValue}>
                                            {new Date().toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        // <div style={page}>
        <div style={styles.page}>
            <ToastContainer position="top-right" autoClose={3000} theme={isDarkTheme ? "dark" : "light"} />
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
            {/* HEADER */}
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={styles.headerIcon}>
                        <FiGlobe size={32} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={styles.title}>Employee Travel Details Dashboard</h1>

                    </div>
                    {/* 🆕 Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        style={styles.themeToggleBtn}
                        title={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {isDarkTheme ? <FiSun size={20} /> : <FiMoon size={20} />}
                    </button>
                </div>
            </header>

            <div style={layout}>
                {/* LEFT PANEL - Navigation */}
                <aside style={styles.sidebar}>
                    <nav style={styles.nav}>
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
                                    ...styles.navItem,
                                    ...(activeTab === item.id ? styles.navItemActive : {})
                                }}
                            >
                                <item.icon style={styles.navIcon} />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Quick Stats */}
                    <div style={styles.sideCard}>
                        <div style={styles.cardHeader}>
                            <FiTrendingUp style={styles.cardIcon} />
                            <h3 style={styles.sideTitle}>Quick Stats</h3>
                        </div>
                        <div style={styles.statsGrid}>
                            <div style={styles.statItem}>
                                <div style={styles.statIconWrapper}>
                                    <FiUsers style={styles.statIcon} />
                                </div>
                                <div style={styles.statContent}>
                                    <span style={styles.statLabel}>Total Travelers</span>
                                    <strong style={styles.statValue}>{analytics.totalTravelers}</strong>
                                </div>
                            </div>
                            <div style={styles.statItem}>
                                <div style={{ ...styles.statIconWrapper, background: '#dcfce7' }}>
                                    <FiCheckCircle style={{ ...styles.statIcon, color: '#16a34a' }} />
                                </div>
                                <div style={statContent}>
                                    <span style={styles.statLabel}>Active Now</span>
                                    <strong style={styles.statValue}>{analytics.active}</strong>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                    {/* Today's Travelers */}
                    <div style={styles.sideCard}>
                        <div style={styles.cardHeader}>
                            <FiCalendar style={styles.cardIcon} />
                            <h3 style={styles.sideTitle}>Today's Travelers</h3>
                        </div>
                        {todayTravelers.length === 0 ? (
                            <div style={styles.emptyState}>
                                <FiFileText size={24} style={{ color: '#9ca3af', marginBottom: '8px' }} />
                                <p style={styles.sideEmpty}>No travels today</p>
                            </div>
                        ) : (
                            <ul style={styles.countryList}>
                                {todayTravelers.slice(0, 5).map((t, i) => (
                                    <li key={i} style={styles.countryItem}>
                                        <div style={styles.countryInfo}>
                                            <span style={styles.countryRank}>{i + 1}</span>
                                            <span style={styles.countryName}>
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
                <main style={styles.main}>
                    {/* File Upload Section */}
                    <div style={styles.card}>
                        <div style={styles.uploadRow}>
                            <div style={styles.fileUploadWrapper}>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleFileChange}
                                    style={styles.fileInput}
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" style={styles.fileInputLabel}>
                                    <FiUpload style={{ marginRight: '8px' }} />
                                    {file ? file.name : "Choose File"}
                                </label>
                            </div>
                            <div style={styles.buttonGroup}>
                                <button
                                    onClick={uploadFile}
                                    disabled={loading}
                                    style={loading ? styles.disabledPrimaryBtn : styles.primaryBtn}
                                >
                                    {loading ? (
                                        <>
                                            <div style={styles.spinner}></div>
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
                                    style={styles.secondaryBtn}
                                >
                                    <FiTrash2 style={{ marginRight: '8px' }} />
                                    Clear
                                </button>
                                <button onClick={exportCsv} style={styles.ghostBtn}>
                                    <FiDownload style={{ marginRight: '8px' }} />
                                    Export CSV
                                </button>
                            </div>
                        </div>

                        {/* Filters Section */}
                        <div style={styles.filtersSection}>
                            <div style={styles.filtersHeader}>
                                <FiFilter style={{ marginRight: '8px', color: '#6b7280' }} />
                                <span style={styles.filtersTitle}>Filters & Search</span>
                            </div>
                            <div style={styles.filtersRow}>
                                <div style={styles.searchWrapper}>
                                    <FiSearch style={styles.searchIcon} />
                                    <input
                                        placeholder="Search by name, email, or location..."
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                        style={styles.searchInput}
                                    />
                                </div>
                                <select
                                    value={filters.country}
                                    onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                                    style={styles.select}
                                >
                                    <option value="">All Countries</option>
                                    {countries.map((c) => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                                <select
                                    value={filters.location}
                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                    style={styles.select}
                                >
                                    <option value="">All Locations</option>
                                    {locations.map((loc) => (
                                        <option key={loc}>{loc}</option>
                                    ))}
                                </select>
                                <select
                                    value={filters.legType}
                                    onChange={(e) => setFilters({ ...filters, legType: e.target.value })}
                                    style={styles.select}
                                >
                                    <option value="">All Travel Types</option>
                                    {legTypes.map((t) => (
                                        <option key={t}>{t}</option>
                                    ))}
                                </select>
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    style={styles.select}
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
                        <div style={styles.card}>
                            <div style={styles.tableHeader}>
                                <h3 style={styles.tableTitle}>All Travel Records</h3>
                                <span style={styles.tableBadge}>{filtered.length} records</span>
                            </div>
                            <div style={styles.tableWrap}>
                                <table style={styles.table}>
                                    <thead style={styles.thead}>
                                        <tr>
                                            <th style={styles.th}>Status</th>
                                            <th style={styles.th}>Traveler</th>
                                            <th style={styles.th}>Emp ID</th>
                                            <th style={styles.th}>Email</th>
                                            <th style={styles.th}>Type</th>
                                            <th style={styles.th}>From</th>
                                            <th style={styles.th}>To</th>
                                            <th style={styles.th}>Start Date</th>
                                            <th style={styles.th}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" style={styles.emptyRow}>
                                                    <div style={styles.emptyState}>
                                                        <FiFileText size={32} style={{ color: '#9ca3af', marginBottom: '12px' }} />
                                                        <p>No matching results found</p>
                                                        <p style={styles.emptySubtext}>Upload a file or adjust your filters</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filtered.map((r, i) => (
                                                <tr key={i} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                                                    <td style={styles.td}>
                                                        {r.active_now ? (
                                                            <div style={styles.activeBadge}>
                                                                <FiCheckCircle size={14} />
                                                                Active
                                                            </div>
                                                        ) : (
                                                            <div style={styles.inactiveBadge}>
                                                                <FiXCircle size={14} />
                                                                Inactive
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.userCell}>
                                                            <div style={styles.avatar}>
                                                                <FiUser size={14} />
                                                            </div>
                                                            <span>
                                                                {r.first_name} {r.last_name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.userCell}>
                                                            <span style={styles.empId}>
                                                                {r.emp_id || 'N/A'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.emailCell}>
                                                            <FiMail size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
                                                            {r.email}
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <span style={styles.typeBadge}>{r.leg_type}</span>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.combinedLocationCell}>
                                                            <div style={styles.locationRow}>
                                                                <FiMapPin size={12} style={{ marginRight: '4px', color: '#ef4444' }} />
                                                                <span style={styles.locationText}>
                                                                    {r.from_location || 'N/A'}
                                                                </span>
                                                            </div>
                                                            <div style={styles.countryRow}>
                                                                <FiGlobe size={10} style={{ marginRight: '4px', color: '#3b82f6' }} />
                                                                <span style={styles.countryText}>
                                                                    {r.from_country || 'Unknown'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.combinedLocationCell}>
                                                            <div style={styles.locationRow}>
                                                                <FiMapPin size={12} style={{ marginRight: '4px', color: '#10b981' }} />
                                                                <span style={styles.locationText}>
                                                                    {r.to_location || 'N/A'}
                                                                </span>
                                                            </div>
                                                            <div style={styles.countryRow}>
                                                                <FiGlobe size={10} style={{ marginRight: '4px', color: '#3b82f6' }} />
                                                                <span style={styles.countryText}>
                                                                    {r.to_country || 'Unknown'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={styles.dateCell}>
                                                            <FiCalendar size={14} style={{ marginRight: '6px', color: '#6b7280' }} />
                                                            {fmt(r.begin_dt)}
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>
                                                        <button
                                                            onClick={() => setSelectedTraveler(r)}
                                                            style={styles.viewButton}
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
                        <div style={styles.analyticsGrid}>
                            <div style={styles.analyticsCard}>
                                <h4 style={styles.analyticsTitle}>Travel Analytics</h4>
                                <div style={styles.analyticsStats}>
                                    <div style={styles.analyticsStat}>
                                        <span style={styles.analyticsLabel}>Average Duration</span>
                                        <strong style={styles.analyticsValue}>{analytics.avgDuration} days</strong>
                                    </div>
                                    <div style={styles.analyticsStat}>
                                        <span style={styles.analyticsLabel}>Total Countries</span>
                                        <strong style={styles.analyticsValue}>{analytics.totalCountries}</strong>
                                    </div>
                                    <div style={styles.analyticsStat}>
                                        <span style={styles.analyticsLabel}>Travel Types</span>
                                        <strong style={styles.analyticsValue}>{analytics.totalTypes}</strong>
                                    </div>
                                </div>
                            </div>

                            <div style={styles.analyticsCard}>
                                <h4 style={styles.analyticsTitle}>Country Distribution</h4>
                                <div style={styles.countryChart}>
                                    {countryStats.slice(0, 5).map((stat, index) => (
                                        <div key={stat.country} style={chartBarWrapper}>
                                            <div style={chartBarLabel}>
                                                <span>{stat.country}</span>
                                                <span>{stat.count}</span>
                                            </div>
                                            <div style={styles.chartBarTrack}>
                                                <div
                                                    style={{
                                                        ...styles.chartBarFill,
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
                        <div style={styles.card}>
                            <div style={styles.tableHeader}>
                                <h3 style={styles.tableTitle}>Recent Travels (Last 7 Days)</h3>
                            </div>
                            <div style={styles.tableWrap}>
                                <table style={styles.table}>
                                    <thead style={styles.thead}>
                                        <tr>
                                            <th style={styles.th}>Traveler</th>
                                            <th style={styles.th}>Destination</th>
                                            <th style={styles.th}>Type</th>
                                            <th style={styles.th}>Start Date</th>
                                            <th style={styles.th}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTravelers.map((r, i) => (
                                            <tr key={i} style={i % 2 === 0 ? rowEven : rowOdd}>
                                                <td style={styles.td}>
                                                    <div style={styles.userCell}>
                                                        <div style={styles.avatar}>
                                                            <FiUser size={14} />
                                                        </div>
                                                        {r.first_name} {r.last_name}
                                                    </div>
                                                </td>
                                                <td style={styles.td}>{r.to_country}</td>
                                                <td style={styles.td}>
                                                    <span style={styles.typeBadge}>{r.leg_type}</span>
                                                </td>
                                                <td style={styles.td}>{fmt(r.begin_dt)}</td>
                                                <td style={styles.td}>
                                                    {r.active_now ? (
                                                        <div style={styles.activeBadge}>
                                                            <FiCheckCircle size={14} />
                                                            Active
                                                        </div>
                                                    ) : (
                                                        <div style={styles.inactiveBadge}>
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
                        <div style={styles.card}>
                            <div style={styles.tableHeader}>
                                <h3 style={styles.tableTitle}>Country-wise Analysis</h3>
                            </div>
                            <div style={styles.tableWrap}>
                                <table style={styles.table}>
                                    <thead style={styles.thead}>
                                        <tr>
                                            <th style={styles.th}>Country</th>
                                            <th style={styles.th}>Total Travels</th>
                                            <th style={styles.th}>Active</th>
                                            <th style={styles.th}>Unique Travelers</th>
                                            <th style={styles.th}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {countryStats.map((stat, i) => (
                                            <tr key={i} style={i % 2 === 0 ? rowEven : rowOdd}>
                                                <td style={styles.td}>
                                                    <strong>{stat.country}</strong>
                                                </td>
                                                <td style={styles.td}>{stat.count}</td>
                                                <td style={styles.td}>
                                                    <span style={{ color: stat.active > 0 ? '#16a34a' : '#6b7280' }}>
                                                        {stat.active}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>{stat.travelerCount}</td>
                                                <td style={styles.td}>
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
                        <div style={styles.card}>
                            <div style={styles.tableHeader}>
                                <h3 style={styles.tableTitle}>Travel Type Analysis</h3>
                            </div>
                            <div style={styles.tableWrap}>
                                <table style={styles.table}>
                                    <thead style={styles.thead}>
                                        <tr>
                                            <th style={styles.th}>Travel Type</th>
                                            <th style={styles.th}>Total</th>
                                            <th style={styles.th}>Active</th>
                                            <th style={styles.th}>Countries</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {travelTypeStats.map((stat, i) => (
                                            <tr key={i} style={i % 2 === 0 ? rowEven : rowOdd}>
                                                <td style={styles.td}>
                                                    <strong>{stat.type}</strong>
                                                </td>
                                                <td style={styles.td}>{stat.count}</td>
                                                <td style={styles.td}>
                                                    <span style={{ color: stat.active > 0 ? '#16a34a' : '#6b7280' }}>
                                                        {stat.active}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>{stat.countryCount}</td>
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


const layout = {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: "24px",
    alignItems: "start",
};



const statContent = {
    flex: 1,
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


const rowEven = {
    background: "white",
};

const rowOdd = {
    background: "#f8fafc",
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





// 🆕 Theme-aware style functions
const getStyles = (isDark) => ({

    // /////////////////


    // ///

    // Combined Location Styles
    combinedLocationCell: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        minWidth: '120px',
        maxWidth: '180px',
    },

    locationRow: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '13px',
        lineHeight: '1.2',
    },

    countryRow: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '11px',
        lineHeight: '1.2',
        opacity: '0.8',
    },

    locationText: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flex: 1,
    },

    countryText: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flex: 1,
        color: isDark ? '#9ca3af' : '#6b7280',
        fontWeight: '400',
    },

    // Remove or keep these if you want to use them elsewhere
    locationCell: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
    },

    countryCell: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: '500',
        color: isDark ? '#cbd5e1' : '#374151',
    },

    empId: {
        fontSize: '14px',
        fontWeight: '500',
        color: isDark ? '#cbd5e1' : '#374151',
    },
    // ///


    // Table Styles
    locationCell: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        maxWidth: '150px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },

    countryCell: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: '500',
        color: isDark ? '#cbd5e1' : '#374151',
    },

    empId: {
        fontSize: '14px',
        fontWeight: '500',
        color: isDark ? '#cbd5e1' : '#374151',
    },

    // Popup Styles
    detailsContainer: {
        padding: '0',
    },

    // detailSection: {
    //     padding: '20px 24px',
    //     borderBottom: isDark ? '1px solid #374151' : '1px solid #f3f4f6',
    //     ':last-child': {
    //         borderBottom: 'none',
    //     }
    // },

    detailSection: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },

    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
    },

    sectionIcon: {
        color: '#3b82f6',
        fontSize: '16px',
    },

    sectionTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: isDark ? '#f3f4f6' : '#374151',
        margin: 0,
    },

    detailList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },

    // detailRow: {
    //     display: 'flex',
    //     justifyContent: 'space-between',
    //     alignItems: 'flex-start',
    // },

    detailRow: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
    },

    detailLabel: {
        fontSize: '14px',
        color: isDark ? '#9ca3af' : '#6b7280',
        fontWeight: '500',
        flex: 1,
    },

    // detailValue: {
    //     fontSize: '14px',
    //     color: isDark ? '#e5e7eb' : '#374151',
    //     fontWeight: '400',
    //     flex: 1,
    //     textAlign: 'right',
    //     display: 'flex',
    //     alignItems: 'center',
    //     justifyContent: 'flex-end',
    // },

    detailValue: {
        fontSize: "14px",
        color: isDark ? "#e5e7eb" : "#374151",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
    },

    inlineIcon: {
        marginRight: '6px',
    },

    statusTag: {
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500',
    },

    activeTag: {
        background: isDark ? '#065f46' : '#dcfce7',
        color: isDark ? '#34d399' : '#16a34a',
    },

    inactiveTag: {
        background: isDark ? '#374151' : '#f3f4f6',
        color: isDark ? '#9ca3af' : '#6b7280',
    },
    // /////////////////

    page: {
        backgroundColor: isDark ? "#0f172a" : "#f8fafc",
        minHeight: "100vh",
        padding: "24px",
        color: isDark ? "#e2e8f0" : "#1e293b",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        lineHeight: "1.5",
        transition: "all 0.3s ease",
    },

    header: {
        marginBottom: "32px",
    },

    headerContent: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },

    headerIcon: {
        background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        color: "white",
        padding: "16px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    title: {
        fontSize: "28px",
        fontWeight: 700,
        color: isDark ? "#f1f5f9" : "#0f172a",
        margin: 0,
        lineHeight: "1.2",
    },

    subtitle: {
        fontSize: "16px",
        color: isDark ? "#94a3b8" : "#64748b",
        margin: 0,
    },

    // 🆕 Theme Toggle Button
    themeToggleBtn: {
        background: isDark ? "#334155" : "#e2e8f0",
        color: isDark ? "#fbbf24" : "#64748b",
        border: "none",
        padding: "12px",
        borderRadius: "8px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
        ':hover': {
            background: isDark ? "#475569" : "#d1d5db",
        }
    },

    layout: {
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        gap: "24px",
        alignItems: "start",
    },

    sidebar: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },

    nav: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",

    },

    navItem: {
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
        color: isDark ? "#94a3b8" : "#64748b",
        transition: "all 0.2s ease",
        border: "1px solid #3b82f6"
    },

    navItemActive: {
        background: "#3b82f6",
        color: "white",
    },

    navIcon: {
        fontSize: "18px",
    },

    sideCard: {
        background: isDark ? "#1e293b" : "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: isDark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.1)",
        border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
        transition: "all 0.3s ease",
    },

    cardHeader: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "16px",
    },

    cardIcon: {
        color: "#3b82f6",
        fontSize: "18px",
    },

    sideTitle: {
        fontSize: "16px",
        fontWeight: 600,
        color: isDark ? "#f1f5f9" : "#1e293b",
        margin: 0,
    },

    statsGrid: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },

    statItem: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px",
        background: isDark ? "#334155" : "#f8fafc",
        borderRadius: "8px",
        transition: "all 0.3s ease",
    },

    statIconWrapper: {
        padding: "8px",
        borderRadius: "8px",
        background: isDark ? "#1e40af" : "#dbeafe",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    statIcon: {
        color: "#3b82f6",
        fontSize: "16px",
    },

    statContent: {
        flex: 1,
    },

    statLabel: {
        fontSize: "12px",
        color: isDark ? "#cbd5e1" : "#64748b",
        display: "block",
    },

    statValue: {
        fontSize: "18px",
        fontWeight: 700,
        color: isDark ? "#f1f5f9" : "#1e293b",
        display: "block",
    },

    countryList: {
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },

    countryItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: isDark ? "1px solid #334155" : "1px solid #f1f5f9",
    },

    countryInfo: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },

    countryRank: {
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
    },

    countryName: {
        fontSize: "14px",
        fontWeight: 500,
        color: isDark ? "#e2e8f0" : "#1e293b",
    },

    countryCount: {
        fontSize: "14px",
        fontWeight: 600,
        color: "#3b82f6",
    },

    emptyState: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        color: isDark ? "#94a3b8" : "#64748b",
        textAlign: "center",
    },

    sideEmpty: {
        fontSize: "14px",
        color: isDark ? "#64748b" : "#94a3b8",
        margin: 0,
    },

    main: {
        display: "flex",
        flexDirection: "column",
        gap: "24px",
    },

    card: {
        background: isDark ? "#1e293b" : "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: isDark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.1)",
        border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
        transition: "all 0.3s ease",
    },

    uploadRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        marginBottom: "20px",
    },

    fileUploadWrapper: {
        flex: 1,
    },

    fileInput: {
        display: "none",
    },

    fileInputLabel: {
        display: "flex",
        alignItems: "center",
        padding: "12px 16px",
        background: isDark ? "#334155" : "#f8fafc",
        border: `2px dashed ${isDark ? "#475569" : "#cbd5e1"}`,
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
        color: isDark ? "#cbd5e1" : "#64748b",
        transition: "all 0.2s ease",
    },

    buttonGroup: {
        display: "flex",
        gap: "12px",
    },

    primaryBtn: {
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
    },

    disabledPrimaryBtn: {
        display: "flex",
        alignItems: "center",
        padding: "12px 20px",
        background: isDark ? "#475569" : "#94a3b8",
        color: isDark ? "#94a3b8" : "white",
        border: "none",
        borderRadius: "8px",
        cursor: "not-allowed",
        fontSize: "14px",
        fontWeight: 600,
    },

    secondaryBtn: {
        display: "flex",
        alignItems: "center",
        padding: "12px 20px",
        background: "transparent",
        color: isDark ? "#cbd5e1" : "#64748b",
        border: isDark ? "1px solid #475569" : "1px solid #cbd5e1",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
        transition: "all 0.2s ease",
    },

    ghostBtn: {
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
    },

    spinner: {
        width: "16px",
        height: "16px",
        border: "2px solid transparent",
        borderTop: "2px solid currentColor",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginRight: "8px",
    },

    filtersSection: {
        marginBottom: "20px",
    },

    filtersHeader: {
        display: "flex",
        alignItems: "center",
        marginBottom: "16px",
    },

    filtersTitle: {
        fontSize: "16px",
        fontWeight: 600,
        color: isDark ? "#f1f5f9" : "#1e293b",
    },

    filtersRow: {
        display: "flex",
        gap: "12px",
        alignItems: "center",
    },

    searchWrapper: {
        position: "relative",
        flex: 1,
    },

    searchIcon: {
        position: "absolute",
        left: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        color: isDark ? "#94a3b8" : "#64748b",
    },

    searchInput: {
        width: "100%",
        padding: "12px 12px 12px 40px",
        border: isDark ? "1px solid #475569" : "1px solid #cbd5e1",
        borderRadius: "8px",
        fontSize: "14px",
        outline: "none",
        background: isDark ? "#334155" : "white",
        color: isDark ? "#e2e8f0" : "#1e293b",
        transition: "all 0.2s ease",
        '::placeholder': {
            color: isDark ? "#ffffffff" : "#ffffffff",
        }
    },

    select: {
        padding: "12px",
        border: isDark ? "1px solid #475569" : "1px solid #cbd5e1",
        borderRadius: "8px",
        fontSize: "14px",
        background: isDark ? "#334155" : "white",
        color: isDark ? "#e2e8f0" : "#1e293b",
        outline: "none",
        minWidth: "140px",
    },

    tableHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
    },

    tableTitle: {
        fontSize: "18px",
        fontWeight: 600,
        color: isDark ? "#f1f5f9" : "#1e293b",
        margin: 0,
    },

    tableBadge: {
        background: "#3b82f6",
        color: "white",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 600,
    },

    tableWrap: {
        overflowX: "auto",
        borderRadius: "8px",
        border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "14px",
    },

    thead: {
        background: isDark ? "#334155" : "#f8fafc",
    },

    th: {
        padding: "12px 16px",
        textAlign: "left",
        fontWeight: 600,
        color: isDark ? "#cbd5e1" : "#475569",
        borderBottom: isDark ? "1px solid #475569" : "1px solid #e2e8f0",
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },

    td: {
        padding: "16px",
        borderBottom: isDark ? "1px solid #334155" : "1px solid #f1f5f9",
        color: isDark ? "#e2e8f0" : "#1e293b",
        background: isDark ? "#1e293b" : "white",

    },

    rowEven: {
        background: isDark ? "#1e293b" : "white",
    },

    rowOdd: {
        background: isDark ? "#334155" : "#f8fafc",
    },

    emptyRow: {
        textAlign: "center",
        padding: "40px",
    },

    emptySubtext: {
        fontSize: "14px",
        color: isDark ? "#94a3b8" : "#94a3b8",
        margin: 0,
    },

    activeBadge: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "4px 8px",
        background: isDark ? "#065f46" : "#dcfce7",
        color: isDark ? "#34d399" : "#16a34a",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 500,
        width: "fit-content",
    },

    inactiveBadge: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "4px 8px",
        background: isDark ? "#7f1d1d" : "#fef2f2",
        color: isDark ? "#fca5a5" : "#dc2626",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 500,
        width: "fit-content",
    },

    userCell: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },

    avatar: {
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        background: isDark ? "#475569" : "#e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: isDark ? "#cbd5e1" : "#64748b",
    },

    emailCell: {
        display: "flex",
        alignItems: "center",
    },

    typeBadge: {
        padding: "4px 8px",
        background: isDark ? "#1e40af" : "#dbeafe",
        color: isDark ? "#93c5fd" : "#1d4ed8",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: 500,
    },

    dateCell: {
        display: "flex",
        alignItems: "center",
    },

    viewButton: {
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
    },

    // Analytics Styles
    analyticsGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
    },

    analyticsCard: {
        background: isDark ? "#1e293b" : "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: isDark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.1)",
        border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
    },

    analyticsTitle: {
        fontSize: "16px",
        fontWeight: 600,
        color: isDark ? "#f1f5f9" : "#1e293b",
        margin: "0 0 16px 0",
    },

    analyticsStats: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },

    analyticsStat: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px",
        background: isDark ? "#334155" : "#f8fafc",
        borderRadius: "8px",
    },

    analyticsLabel: {
        fontSize: "14px",
        color: isDark ? "#cbd5e1" : "#64748b",
    },

    analyticsValue: {
        fontSize: "16px",
        fontWeight: 600,
        color: isDark ? "#f1f5f9" : "#1e293b",
    },

    countryChart: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },

    chartBarWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },

    chartBarLabel: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "12px",
        color: isDark ? "#94a3b8" : "#64748b",
    },

    chartBarTrack: {
        height: "8px",
        background: isDark ? "#334155" : "#e2e8f0",
        borderRadius: "4px",
        overflow: "hidden",
    },

    chartBarFill: {
        height: "100%",
        background: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
        borderRadius: "4px",
        transition: "width 0.3s ease",
    },



    // 🆕 Enhanced Popup Styles
    popupOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
        backdropFilter: "blur(4px)",
    },

    popupContent: {
        background: isDark ? "#1e293b" : "white",
        borderRadius: "16px",
        padding: "0",
        maxWidth: "600px",
        width: "100%",
        maxHeight: "85vh",
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
    },

    popupHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "24px",
        borderBottom: isDark ? "1px solid #374151" : "1px solid #f3f4f6",
        background: isDark ? "linear-gradient(135deg, #1e293b, #374151)" : "linear-gradient(135deg, #f8fafc, #f1f5f9)",
    },

    popupHeaderLeft: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flex: 1,
    },

    avatarLarge: {
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: isDark ? "linear-gradient(135deg, #3b82f6, #1d4ed8)" : "linear-gradient(135deg, #3b82f6, #60a5fa)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "24px",
    },

    popupTitle: {
        fontSize: "20px",
        fontWeight: 700,
        color: isDark ? "#f9fafb" : "#111827",
        margin: "0 0 4px 0",
        lineHeight: "1.3",
    },

    employeeId: {
        fontSize: "14px",
        color: isDark ? "#9ca3af" : "#6b7280",
        margin: 0,
        fontWeight: 500,
    },

    popupCloseBtn: {
        background: isDark ? "#374151" : "#f3f4f6",
        border: "none",
        color: isDark ? "#9ca3af" : "#6b7280",
        cursor: "pointer",
        padding: "8px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
        ':hover': {
            background: isDark ? "#4b5563" : "#e5e7eb",
        }
    },

    popupBody: {
        padding: "24px",
        maxHeight: "calc(85vh - 110px)",
        overflowY: "auto",
    },

    bannerSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 24px",
        background: isDark ? "linear-gradient(90deg, #1e293b, #374151)" : "linear-gradient(90deg, #f8fafc, #f1f5f9)",
        borderBottom: isDark ? "1px solid #374151" : "1px solid #f3f4f6",
    },

    statusBadge: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: 600,
        border: "1px solid",
    },

    activeStatus: {
        background: isDark ? "#065f4620" : "#dcfce7",
        color: isDark ? "#34d399" : "#16a34a",
        borderColor: isDark ? "#065f46" : "#bbf7d0",
    },

    inactiveStatus: {
        background: isDark ? "#374151" : "#f3f4f6",
        color: isDark ? "#9ca3af" : "#6b7280",
        borderColor: isDark ? "#4b5563" : "#e5e7eb",
    },

    statusDot: {
        width: "8px",
        height: "8px",
        borderRadius: "50%",
    },

    activeStatusDot: {
        background: "#10b981",
        animation: "pulse 2s infinite",
    },

    inactiveStatusDot: {
        background: "#6b7280",
    },

    travelTypeBadge: {
        display: "flex",
        alignItems: "center",
        padding: "8px 16px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: 600,
        border: "1px solid",
    },

    detailGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0",
    },

    detailGroup: {
        padding: "24px",
        borderBottom: isDark ? "1px solid #374151" : "1px solid #f3f4f6",
        ':nth-child(odd)': {
            borderRight: isDark ? "1px solid #374151" : "1px solid #f3f4f6",
        }
    },

    detailGroupTitle: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "16px",
        fontWeight: 600,
        color: isDark ? "#f3f4f6" : "#374151",
        margin: "0 0 16px 0",
    },

    detailGroupIcon: {
        color: "#3b82f6",
    },

    detailItems: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },

    detailItem: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },





    travelTypeDisplay: {
        display: "flex",
        alignItems: "center",
        fontSize: "14px",
        fontWeight: 600,
        padding: "4px 0",
    },

    statusIndicator: {
        padding: "4px 12px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 600,
        width: "fit-content",
    },

    activeIndicator: {
        background: isDark ? "#065f4620" : "#dcfce7",
        color: isDark ? "#34d399" : "#16a34a",
    },

    inactiveIndicator: {
        background: isDark ? "#374151" : "#f3f4f6",
        color: isDark ? "#9ca3af" : "#6b7280",
    },


    // /////////////////////////
    // Popup Styles












    detailItem: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        ' strong': {
            color: isDark ? "#cbd5e1" : "#374151",
            fontSize: "14px",
            marginBottom: "4px",
        },
        ' span': {
            color: isDark ? "#94a3b8" : "#6b7280",
            fontSize: "14px",
        }
    },
});

export default EmployeeTravelDashboard;
