see the code how to do this 
C:\Users\W0024618\Desktop\swipeData\client\src\pages\EmployeeTravelDashboard.jsx


// import React, { useState, useMemo } from "react";
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
const today = new Date("2025-10-30"); // you can change this to new Date() in production

const todayTravelers = safeItems.filter((r) => {
  const start = new Date(r.begin_dt);
  const end = new Date(r.end_dt);
  return start <= today && end >= today; // trip includes today
});

    // const filtered = safeItems.filter((r) => {
    //     const s = filters.search.toLowerCase();
    //     if (s) {
    //         const hay = `${r.first_name ?? ""} ${r.last_name ?? ""} ${r.email ?? ""}`.toLowerCase();
    //         if (!hay.includes(s)) return false;
    //     }
    //     if (filters.country && r.from_country !== filters.country) return false;
    //     if (filters.legType && r.leg_type !== filters.legType) return false;
    //     return true;
    // });



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

C:\Users\W0024618\Desktop\swipeData\client\src\App.js

// src/App.js
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  lazy,
  Suspense
} from 'react';
import {
  Container,
  Navbar,
  Nav,
  Button,
  InputGroup,
  FormControl,
  Spinner
} from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FaSun, FaBuilding } from 'react-icons/fa';

import { FaBuildingCircleCheck } from "react-icons/fa6";
import { MdAddAlert } from "react-icons/md";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import EmployeeTravelDashboard from "./pages/EmployeeTravelDashboard";
import { GiAirplaneDeparture } from "react-icons/gi";
import './App.css';

// Lazy load pages
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const ErtPage = lazy(() => import('./pages/ErtPage'));
const ZoneDetailsTable = lazy(() => import('./components/ZoneDetailsTable'));
const CompanySummary = lazy(() => import('./components/CompanySummary'));

// const DashboardPage = lazy(() => import('./pages/DashboardPage'));
// -----------------------------
// Error Banner
// -----------------------------
function ErrorBanner({ status }) {
  if (status === 'open') return null;

  let message = '';
  if (status === 'connecting') {
    message = 'Connecting to live data...';
  } else if (status === 'error') {
    message = '⚠️ Live data connection lost. Retrying...';
  }

  return (
    <div style={{
      background: status === 'error' ? '#b00020' : '#444',
      color: '#fff',
      padding: '8px 16px',
      borderLeft: status === 'error' ? '4px solid #ff9800' : '4px solid #2196f3',
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>{message}</span>
      {status === 'error' && (
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      )}
    </div>
  );
}

// -----------------------------
// TimeTravelControl
// -----------------------------
function TimeTravelControl({ currentTimestamp, onApply, onLive, loading }) {
  const [local, setLocal] = useState(currentTimestamp ? isoToInput(currentTimestamp) : '');

  useEffect(() => {
    setLocal(currentTimestamp ? isoToInput(currentTimestamp) : '');
  }, [currentTimestamp]);

  const handleApply = useCallback(() => {
    if (!local) return;
    const selected = new Date(local);
    if (selected > new Date()) {
      return window.alert("Please select a valid time (cannot be future)");
    }
    const [datePart, timePart] = local.split('T');
    onApply(datePart, timePart);
  }, [local, onApply]);

  const handleLive = useCallback(() => {
    setLocal('');
    onLive();
  }, [onLive]);

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 340 }}>
      <InputGroup>
        <FormControl
          type="datetime-local"
          value={local}
          onChange={e => setLocal(e.target.value)}
          placeholder="Select date & time"
        />
      </InputGroup>
      <div style={{ display: 'flex', gap: 6 }}>
        <Button variant="outline-warning" onClick={handleApply} disabled={loading || !local}>
          {loading ? <><Spinner animation="border" size="sm" /> Applying</> : 'Apply'}
        </Button>
        <Button variant="warning" onClick={handleLive} disabled={loading}>Live</Button>
      </div>
    </div>
  );
}

function pad(n) { return String(n).padStart(2, '0'); }
function isoToInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// -----------------------------
// ZoneDetailsPage
// -----------------------------
const ZoneDetailsPage = React.memo(function ZoneDetailsPage({ detailsData }) {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-2" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
        <Link to="/" className="btn btn-secondary">← Back to Dashboard</Link>
        <input
          type="text"
          placeholder="Search employee..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ flexGrow: 1, maxWidth: 300, padding: '0.4rem 0.8rem', fontSize: '1rem', borderRadius: 4, border: '1px solid #ccc' }}
        />
      </div>
      <Suspense fallback={<div>Loading details…</div>}>
        <ZoneDetailsTable data={detailsData} searchTerm={searchTerm} />
      </Suspense>
    </>
  );
});

// -----------------------------
// Main App
// -----------------------------
function App() {
  const esRef = useRef(null);
  const sseBufferRef = useRef(null);
  const sseFlushScheduledRef = useRef(false);
  const lastSeenRef = useRef(Date.now());

  const location = useLocation();
  const headerText = location.pathname === '/ert'
    ? 'Emergency Response Team — Western Union Pune'
    : 'Live Occupancy — Western Union Pune';

  const API_BASE = process.env.REACT_APP_API_BASE_URL
    || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : window.location.origin);
  const API_ORIGIN = API_BASE.replace(/\/$/, '');

  const [liveData, setLiveData] = useState({
    summary: [], details: {}, floorBreakdown: [], zoneBreakdown: [], personnelBreakdown: [],
    totalVisitedToday: 0, personnelSummary: { employees: 0, contractors: 0 },
    visitedToday: { employees: 0, contractors: 0, total: 0 }, ertStatus: {}
  });

  const [timeTravelMode, setTimeTravelMode] = useState(false);
  const [timeTravelTimestamp, setTimeTravelTimestamp] = useState(null);
  const [timeTravelLoading, setTimeTravelLoading] = useState(false);

  const [connectionStatus, setConnectionStatus] = useState('connecting'); // connecting | open | error
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // ------------------ setPayload ------------------
  const setPayload = useCallback(p => {
    if (!p || typeof p !== 'object') return;
    const safe = {
      summary: Array.isArray(p.summary) ? p.summary : [],
      details: p.details && typeof p.details === 'object' ? p.details : {},
      floorBreakdown: Array.isArray(p.floorBreakdown) ? p.floorBreakdown : [],
      zoneBreakdown: Array.isArray(p.zoneBreakdown) ? p.zoneBreakdown : [],
      personnelBreakdown: Array.isArray(p.personnelBreakdown) ? p.personnelBreakdown : [],
      totalVisitedToday: typeof p.totalVisitedToday === 'number' ? p.totalVisitedToday : 0,
      personnelSummary: p.personnelSummary || { employees: 0, contractors: 0 },
      visitedToday: p.visitedToday || { employees: 0, contractors: 0, total: 0 },
      ertStatus: p.ertStatus || {}
    };
    setLiveData(prev => ({ ...prev, ...safe }));
    setDashboardLoading(false); // ✅ stop spinner when data arrives
  }, []);

  // ------------------ Bootstrap Fetch ------------------
  useEffect(() => {
    const fetchBootstrap = async () => {
      try {
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
        const timeStr = now.toTimeString().slice(0, 8); // HH:MM:SS

        const resp = await fetch(
          `${API_ORIGIN}/api/occupancy-at-time-pune?date=${encodeURIComponent(dateStr)}&time=${encodeURIComponent(timeStr)}`
        );
        if (resp.ok) {
          const p = await resp.json();
          setPayload(p);
        }
      } catch (err) {
        console.error("Bootstrap fetch failed", err);
      }
    };

    fetchBootstrap();
  }, [API_ORIGIN, setPayload]);

  // ------------------ SSE Live Updates ------------------
  useEffect(() => {
    if (timeTravelMode) {
      esRef.current?.close();
      esRef.current = null;
      return;
    }

    const esUrl = `${API_ORIGIN}/api/live-occupancy`;
    const es = new EventSource(esUrl);
    esRef.current = es;

    es.onopen = () => setConnectionStatus('open');

    es.onmessage = e => {
      try {
        const p = JSON.parse(e.data);
        lastSeenRef.current = Date.now();
        sseBufferRef.current = p;

        if (!sseFlushScheduledRef.current) {
          sseFlushScheduledRef.current = true;
          setTimeout(() => {
            setPayload(sseBufferRef.current);
            sseFlushScheduledRef.current = false;
          }, 500);
        }
      } catch (err) {
        console.error('[SSE] parse error', err);
        setConnectionStatus('error');
      }
    };

    es.onerror = err => {
      console.error('[SSE] error', err);
      setConnectionStatus('error');
    };

    return () => es.close();
  }, [timeTravelMode, API_ORIGIN, setPayload]);

  // ------------------ Time Travel ------------------
  const fetchSnapshot = useCallback(async (dateStr, timeStr) => {
    setTimeTravelLoading(true);
    const safeTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
    const url = `${API_ORIGIN}/api/occupancy-at-time-pune?date=${encodeURIComponent(dateStr)}&time=${encodeURIComponent(safeTime)}`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Server returned ${resp.status}`);
      const p = await resp.json();
      setPayload(p);
      setTimeTravelMode(true);
      setTimeTravelTimestamp(p?.asOfLocal || `${dateStr} ${safeTime}`);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeTravelLoading(false);
    }
  }, [API_ORIGIN, setPayload]);

  const clearTimeTravel = useCallback(async () => {
    setTimeTravelLoading(true);
    try {
      setTimeTravelMode(false);
      setTimeTravelTimestamp(null);

      // ✅ fetch snapshot with current time
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const timeStr = now.toTimeString().slice(0, 8);

      const resp = await fetch(
        `${API_ORIGIN}/api/occupancy-at-time-pune?date=${encodeURIComponent(dateStr)}&time=${encodeURIComponent(timeStr)}`
      );
      if (resp.ok) {
        const p = await resp.json();
        setPayload(p);
      }
    } finally {
      setTimeTravelLoading(false);
    }
  }, [API_ORIGIN, setPayload]);


  const hideNavbar = location.pathname === "/travel-dashboard";


  // ------------------ Render ------------------
  return (
    <>
      


      {!hideNavbar && (
        <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
          <Navbar.Brand as={Link} to="/" className="wu-brand">{headerText}</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto align-items-center gap-2">
              <div className="time-travel-wrapper me-2">
                <TimeTravelControl
                  currentTimestamp={timeTravelTimestamp}
                  onApply={fetchSnapshot}
                  onLive={clearTimeTravel}
                  loading={timeTravelLoading}
                />
              </div>

              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">Dashboard</Tooltip>}>
                <Nav.Link as={Link} to="/" className="nav-item-infographic">
                  <i className="bi bi-house"></i>
                </Nav.Link>
              </OverlayTrigger>

              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">Live Details Page</Tooltip>}>
                <Nav.Link as={Link} to="/details" className="nav-item-infographic">
                  <i className="fa-solid fa-calendar-day"></i>
                </Nav.Link>
              </OverlayTrigger>

              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">ERT Overview</Tooltip>}>
                <Nav.Link as={Link} to="/ert" className="nav-item-infographic">
                  <MdAddAlert className='nav-item-new' />
                </Nav.Link>
              </OverlayTrigger>

              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">Company Summary</Tooltip>}>
                <Nav.Link as={Link} to="/companysummary" className="nav-item-infographic">
                  <FaBuildingCircleCheck className='nav-item-new' />
                </Nav.Link>
              </OverlayTrigger>

              {/* <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">Travel Dashboard</Tooltip>}>
                <Nav.Link as={Link} to="/travel-dashboard" className="nav-item-infographic">
                  <i className="fa-solid fa-plane fa-fade"></i>
                </Nav.Link>
              </OverlayTrigger> */}

              {location.pathname !== "/" && (
                <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">Travel Dashboard</Tooltip>}>
                  <Nav.Link as={Link} to="/travel-dashboard" className="nav-item-infographic">
                    <i className="fa-solid fa-plane fa-fade"></i>
                  </Nav.Link>
                </OverlayTrigger>
              )}

              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">History</Tooltip>}>
                <Nav.Link href="http://10.199.22.57:3000/partition/Pune/history" className="nav-item-infographic">
                  <i className="bi bi-clock-history"></i>
                </Nav.Link>
              </OverlayTrigger>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      )}

      <Container fluid className="mt-2">
        {timeTravelMode && (
          <div style={{ background: '#434d44', color: '#FFF', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid rgb(0, 255, 21)', marginBottom: 8 }}>
            <div>Viewing snapshot: <strong>{new Date(timeTravelTimestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</strong></div>
            <div>
              <button className="btn btn-sm btn-outline-warning" onClick={clearTimeTravel} disabled={timeTravelLoading}>Return to Live</button>
            </div>
          </div>
        )}

        {/* Error UI */}
        <ErrorBanner status={connectionStatus} />

        {dashboardLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <Spinner animation="border" role="status" variant="warning" />
            <span className="ms-2" style={{ color: '#FFC72C' }}>Loading live occupancy…</span>
          </div>
        ) : (
          <Suspense fallback={<div style={{ color: '#FFC72C' }}>Loading page…</div>}>
            <Routes>
              <Route path="/" element={
                <DashboardHome
                  summaryData={liveData.summary}
                  detailsData={liveData.details}
                  floorData={liveData.floorBreakdown}
                  zoneBreakdown={liveData.zoneBreakdown}
                  personnelBreakdown={liveData.personnelBreakdown}
                  totalVisitedToday={liveData.totalVisitedToday}
                  personnelSummary={liveData.personnelSummary}
                  visitedToday={liveData.visitedToday}
                  ertStatus={liveData.ertStatus}
                />
              } />
              <Route path="/details" element={<ZoneDetailsPage detailsData={liveData.details} />} />
              <Route path="/ert" element={<ErtPage ertStatus={liveData.ertStatus} />} />

              <Route path="/companysummary" element={
                <CompanySummary
                  detailsData={liveData.details}
                  personnelBreakdown={liveData.personnelBreakdown}
                  zoneBreakdown={liveData.zoneBreakdown}
                />

              } />

              <Route path="/travel-dashboard" element={<EmployeeTravelDashboard />} />


            </Routes>

          </Suspense>
        )}
      </Container>
    </>
  );
}

export default function WrappedApp() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <div className="dark-theme">
        <App />
      </div>
    </BrowserRouter>
  );
}
