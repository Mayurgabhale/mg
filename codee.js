first  this,
  i want to up date live not timign every second 
not this No updates received in the last 20s — connection may be idle/closed
because it get 20 second it is more time, in this data is moe stukking 
i  want live every second wihtou  loadin page or refersing ok 
// src/App.js
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  lazy,
  Suspense,
  useMemo
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
import { FaSun } from 'react-icons/fa';

import './App.css';

// ✅ Lazy load pages (faster initial load)
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const ErtPage = lazy(() => import('./pages/ErtPage'));
const ZoneDetailsTable = lazy(() => import('./components/ZoneDetailsTable'));

// -----------------------------
// TimeTravelControl
// -----------------------------
function TimeTravelControl({ currentTimestamp, onApply, onLive, loading }) {
  const [local, setLocal] = useState(currentTimestamp ? isoToInput(currentTimestamp) : '');

  useEffect(() => {
    if (currentTimestamp) setLocal(isoToInput(currentTimestamp));
    else setLocal('');
  }, [currentTimestamp]);

  const handleApply = useCallback(() => {
    if (!local) return;

    const selected = new Date(local);
    const now = new Date();

    if (selected > now) {
      window.alert("Please select a relevant time — snapshot cannot be in the future");
      return;
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
          onChange={(e) => setLocal(e.target.value)}
          placeholder="Select date & time"
        />
      </InputGroup>

      <div style={{ display: 'flex', gap: 6 }}>
        <Button variant="outline-warning" onClick={handleApply} disabled={loading || !local}>
          {loading ? <><Spinner animation="border" size="sm" />&nbsp;Applying</> : 'Apply'}
        </Button>
        <Button variant="warning" onClick={handleLive} disabled={loading}>
          Live
        </Button>
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
// ZoneDetailsPage (memoized)
// -----------------------------
const ZoneDetailsPage = React.memo(function ZoneDetailsPage({ detailsData }) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <div
        className="d-flex justify-content-between align-items-center mb-2"
        style={{ flexWrap: 'wrap', gap: '0.5rem' }}
      >
        <Link to="/" className="btn btn-secondary">← Back to Dashboard</Link>
        <input
          type="text"
          placeholder="Search employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flexGrow: 1,
            maxWidth: 300,
            padding: '0.4rem 0.8rem',
            fontSize: '1rem',
            borderRadius: 4,
            border: '1px solid #ccc'
          }}
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

  const location = useLocation();
  const headerText = location.pathname === '/ert'
    ? 'Emergency Response Team — Western Union Pune'
    : 'Live Occupancy — Western Union Pune';

  // ---------- CONFIG: API base URL ----------
  const API_BASE = (process.env.REACT_APP_API_BASE_URL)
    || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : window.location.origin);
  const API_ORIGIN = API_BASE.replace(/\/$/, '');
  // ------------------------------------------

  const [liveData, setLiveData] = useState({
    summary: [],
    details: {},
    floorBreakdown: [],
    zoneBreakdown: [],
    personnelBreakdown: [],
    totalVisitedToday: 0,
    personnelSummary: { employees: 0, contractors: 0 },
    visitedToday: { employees: 0, contractors: 0, total: 0 },
    ertStatus: {}
  });

  const [timeTravelMode, setTimeTravelMode] = useState(false);
  const [timeTravelTimestamp, setTimeTravelTimestamp] = useState(null);
  const [timeTravelLoading, setTimeTravelLoading] = useState(false);

  // 🔌 Connection status for SSE (will show on-screen banner)
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // connecting | open | stale | error
  const lastSeenRef = useRef(Date.now());

  // Safer payload setter (validates before replacing UI)
  const setPayload = useCallback((p) => {
    if (!p || typeof p !== 'object') {
      console.warn('[setPayload] ignoring invalid payload', p);
      return;
    }
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
    setLiveData((prev) => ({ ...prev, ...safe }));
  }, []);

  // SSE with throttling + connection status reporting
  useEffect(() => {
    if (timeTravelMode) {
      if (esRef.current) {
        try { esRef.current.close(); } catch (e) {}
        esRef.current = null;
      }
      return;
    }

    const esUrl = `${API_ORIGIN}/api/live-occupancy`;
    console.info('[SSE] connecting to', esUrl);
    const es = new EventSource(esUrl);
    esRef.current = es;

    es.onopen = () => {
      console.info('[SSE] open');
      setConnectionStatus('open');
    };

    es.onmessage = (e) => {
      try {
        const p = JSON.parse(e.data);
        lastSeenRef.current = Date.now();
        sseBufferRef.current = p;

        if (!sseFlushScheduledRef.current) {
          sseFlushScheduledRef.current = true;
          setTimeout(() => {
            try {
              setPayload(sseBufferRef.current);
            } catch (err) {
              console.error('[SSE flush] payload apply error', err);
            } finally {
              sseFlushScheduledRef.current = false;
            }
          }, 500); // throttle updates to every 0.5s
        }

        // mark connected
        setConnectionStatus('open');
      } catch (err) {
        console.error('[SSE] parse error', err, 'raw:', e.data);
        // keep connection open; but mark error so banner shows
        setConnectionStatus('error');
      }
    };

    es.onerror = (err) => {
      // EventSource will automatically retry — do not close here.
      console.error('[SSE] error (EventSource will try reconnect automatically)', err);
      setConnectionStatus('error');
    };

    // monitor for staleness
    const stalenessChecker = setInterval(() => {
      try {
        const age = Date.now() - lastSeenRef.current;
        if (age > 20_000) { // 20s with no data
          setConnectionStatus('stale');
        } else {
          setConnectionStatus('open');
        }
      } catch (e) {
        console.error('[SSE stalenessChecker] error', e);
      }
    }, 4000);

    return () => {
      clearInterval(stalenessChecker);
      try { es.close(); } catch (e) { /* ignore */ }
      esRef.current = null;
    };
  }, [timeTravelMode, API_ORIGIN, setPayload]);

  // Fetch a historical snapshot
  const fetchSnapshot = useCallback(async (dateStr, timeStr) => {
    setTimeTravelLoading(true);
    const safeTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
    const url = `${API_ORIGIN}/api/occupancy-at-time-pune?date=${encodeURIComponent(dateStr)}&time=${encodeURIComponent(safeTime)}`;

    try {
      const resp = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
      if (!resp.ok) {
        const body = await resp.text().catch(() => '');
        console.error(`[TimeTravel] error ${resp.status} from ${url}`, body);
        window.alert(`Failed to load snapshot (${resp.status}). See console for details.`);
        throw new Error(`Server returned ${resp.status}`);
      }

      const p = await resp.json();
      setPayload(p);
      setTimeTravelMode(true);
      setTimeTravelTimestamp(p?.asOfLocal || `${dateStr} ${safeTime}`);
    } catch (err) {
      console.error('Failed to fetch snapshot', err);
      if (!err.message.includes('Server returned')) {
        window.alert('Failed to load snapshot. See console for details.');
      }
    } finally {
      setTimeTravelLoading(false);
    }
  }, [API_ORIGIN, setPayload]);

  // Return to live mode
  const clearTimeTravel = useCallback(async () => {
    setTimeTravelLoading(true);
    try {
      setTimeTravelMode(false);
      setTimeTravelTimestamp(null);
      const url = `${API_ORIGIN}/api/current-occupancy`;
      const resp = await fetch(url, { headers: { Accept: 'application/json' } });
      if (resp.ok) {
        const p = await resp.json();
        setPayload(p);
      }
    } finally {
      setTimeTravelLoading(false);
    }
  }, [API_ORIGIN, setPayload]);

  return (
    <>

      {/* Connection banner — shows when not open */}
      {connectionStatus !== 'open' && (
        <div style={{
          background: connectionStatus === 'error' ? '#8B0000' : '#b07b00',
          color: 'white',
          padding: '8px 12px',
          textAlign: 'center',
          fontWeight: '600'
        }}>
          {connectionStatus === 'error' && 'Connection error — check console and backend (SSE/CORS/504)'}
          {connectionStatus === 'stale' && 'No updates received in the last 20s — connection may be idle/closed'}
          {connectionStatus === 'connecting' && 'Connecting to live updates...'}
        </div>
      )}

      <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
        <Navbar.Brand as={Link} to="/" className="wu-brand">
          {headerText}
        </Navbar.Brand>
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
            <Nav.Link as={Link} to="/" className="nav-item-infographic">
              <i className="bi bi-house"></i>
            </Nav.Link>
            <Nav.Link href="http://10.199.22.57:3000/partition/Pune/history" className="nav-item-infographic">
              <i className="bi bi-clock-history"></i>
            </Nav.Link>
            <Nav.Link as={Link} to="/details" className="nav-item-infographic">
              <i className="fa-solid fa-calendar-day"></i>
            </Nav.Link>
            <Nav.Link as={Link} to="/ert" className="nav-item-infographic">
              ERT Overview
            </Nav.Link>
            <Nav.Link className="theme-toggle-icon" title="Dark mode only">
              <FaSun />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {/* responsive */}
      <Container fluid className="mt-2">
        {timeTravelMode && (
          <div style={{
            background: '#434d44',
            color: '#FFF',
            padding: '8px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderLeft: '4px solid rgb(0, 255, 21)',
            marginBottom: 8
          }}>
            <div>
              Viewing historical snapshot for:&nbsp;
              <strong>{new Date(timeTravelTimestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</strong>
            </div>
            <div>
              <button
                className="btn btn-sm btn-outline-warning"
                onClick={clearTimeTravel}
                disabled={timeTravelLoading}
              >
                Return to Live
              </button>
            </div>
          </div>
        )}

        <Suspense fallback={<div style={{ color: '#FFC72C' }}>Loading page…</div>}>
          <Routes>
            <Route
              path="/"
              element={
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
              }
            />
            <Route path="/details" element={<ZoneDetailsPage detailsData={liveData.details} />} />
            <Route path="/ert" element={<ErtPage ertStatus={liveData.ertStatus} />} />
          </Routes>
        </Suspense>
      </Container>

     
    </>
  );
}

export default function WrappedApp() {
  return (
    <BrowserRouter future={{v7_relativeSplatPath:true}}>
      <div className="dark-theme">
        <App />
      </div>
    </BrowserRouter>
  );
}
