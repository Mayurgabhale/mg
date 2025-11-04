this all i want to auto update 
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
