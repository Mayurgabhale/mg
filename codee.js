disply in header not hide. 
  chekc why 


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
              <Nav.Link as={Link} to="/" className="nav-item-infographic"><i className="bi bi-house"></i></Nav.Link>
            </OverlayTrigger>

            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">Live Details Page</Tooltip>}>
              <Nav.Link as={Link} to="/details" className="nav-item-infographic"><i className="fa-solid fa-calendar-day"></i></Nav.Link>
            </OverlayTrigger>

            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">ERT Overview</Tooltip>}>
              <Nav.Link as={Link} to="/ert" className="nav-item-infographic"> <MdAddAlert className='nav-item-new' /> </Nav.Link>
            </OverlayTrigger>

            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">Company Summary</Tooltip>}>
              <Nav.Link as={Link} to="/companysummary" className="nav-item-infographic"><FaBuildingCircleCheck className='nav-item-new' /></Nav.Link>
            </OverlayTrigger>




            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">History</Tooltip>}>
              <Nav.Link href="http://10.199.22.57:3000/partition/Pune/history" className="nav-item-infographic"><i className="bi bi-clock-history"></i></Nav.Link>
            </OverlayTrigger>



            {!hideNavbar && (
              <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
                {/* all your nav links here */}
                <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">travel-dashboard</Tooltip>}>
                  {/* <Nav.Link as={Link} to="/travel-dashboard" className="nav-item-infographic" ><GiAirplaneDeparture  className='nav-item-new'/></Nav.Link> */}
                  <Nav.Link as={Link} to="/travel-dashboard" className="nav-item-infographic" ><i class="fa-solid fa-plane fa-fade"></i></Nav.Link>
                </OverlayTrigger>
              </Navbar>
            )}


          </Nav>
        </Navbar.Collapse>
      </Navbar>
