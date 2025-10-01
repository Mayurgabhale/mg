
see pune is connect auto connect, Live data connection lost. Retrying...
   connectin is lost then diplsy this errorm, after connectin succes they start auot, not clikc on retry , this error is auto remove Live data connection lost. Retrying...
  +++++
  but denver is not auto connect or this error not remove Live data connection lost. Retrying..., when i clikc on retry or relaod page that time they remove this eoorm, 
  but i want like pune auto coonect to auot remove Live data connection lost. Retrying... this error, ok 


// client-denver/src/App.js
// src/App.js
import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { Container, Navbar, Nav, Form, Button, InputGroup } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { FaSun } from 'react-icons/fa';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import './App.css';

// Lazy load pages
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const FloorDetailsPage = lazy(() => import('./pages/FloorDetailsPage'));
const DenverInOutInconsistencyPage = lazy(() => import('./pages/DenverInOutInconsistency'));


function ErrorBanner({ status }) {
  if (status === 'open') return null;

  let message = '';
  if (status === 'connecting') {
    message = '🔄 Connecting to live data...';
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

export default function App() {
  const [state, setState] = useState({
    floorData: [],
    personnelBreakdown: [],
    totalVisitedToday: 0,
    personnelSummary: { employees: 0, contractors: 0 },
    visitedToday: { employees: 0, contractors: 0, total: 0 },
    floorInOutSummary: [],
    liveVisitedOccupants: [],
    visitedOccupants: [],
    inOutData: null,
    loadingInOut: true,
    inOutError: null,
    snapshotMode: false,
    snapshotTime: '',
    snapshotDate: new Date().toLocaleDateString('en-CA', { timeZone: 'America/Denver' }),
    snapshotLoading: false,
    snapshotError: null,
    snapshotData: null
  });
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  // SSE for live occupancy
  // useEffect(() => {
  //   const es = new EventSource('http://localhost:5000/api/live-occupancy-denver');

  //   es.onmessage = e => {
  //     try {
  //       const p = JSON.parse(e.data);
  //       setState(prev => ({
  //         ...prev,
  //         floorData: p.floorBreakdown || [],
  //         personnelBreakdown: p.personnelBreakdown || [],
  //         totalVisitedToday: p.totalVisitedToday || 0,
  //         personnelSummary: p.personnelSummary || { employees: 0, contractors: 0 },
  //         visitedToday: p.visitedToday || { employees: 0, contractors: 0, total: 0 },
  //         floorInOutSummary: p.floorInOutSummary || [],
  //         liveVisitedOccupants: p.visitedOccupants || [],
  //         visitedOccupants: prev.snapshotMode ? prev.visitedOccupants : (p.visitedOccupants || [])
  //       }));
  //     } catch (err) {
  //       console.error('SSE parse error:', err);
  //     }
  //   };

  //   es.onerror = err => {
  //     console.error('SSE error:', err);
  //     es.close();
  //   };

  //   return () => es.close();
  // }, []);



  useEffect(() => {
  const es = new EventSource('http://localhost:5000/api/live-occupancy-denver');

  es.onopen = () => {
    setConnectionStatus('open');
  };

  es.onmessage = e => {
    try {
      const p = JSON.parse(e.data);
      setState(prev => ({
        ...prev,
        floorData: p.floorBreakdown || [],
        personnelBreakdown: p.personnelBreakdown || [],
        totalVisitedToday: p.totalVisitedToday || 0,
        personnelSummary: p.personnelSummary || { employees: 0, contractors: 0 },
        visitedToday: p.visitedToday || { employees: 0, contractors: 0, total: 0 },
        floorInOutSummary: p.floorInOutSummary || [],
        liveVisitedOccupants: p.visitedOccupants || [],
        visitedOccupants: prev.snapshotMode ? prev.visitedOccupants : (p.visitedOccupants || [])
      }));
    } catch (err) {
      console.error('SSE parse error:', err);
      setConnectionStatus('error');
    }
  };

  es.onerror = err => {
    console.error('SSE error:', err);
    setConnectionStatus('error');
    es.close();
  };

  return () => es.close();
}, []);




  // Fetch in/out inconsistency once
  useEffect(() => {
    fetch('http://localhost:5000/api/inout-inconsistency-denver')
      .then(res => res.ok ? res.json() : Promise.reject(`HTTP ${res.status} - ${res.statusText}`))
      .then(data => setState(prev => ({ ...prev, inOutData: data.floorInconsistency || [], loadingInOut: false })))
      .catch(err => setState(prev => ({ ...prev, inOutError: err.toString(), loadingInOut: false })));
  }, []);

  // Snapshot handlers
  const handleSnapshotTimeChange = e => setState(prev => ({ ...prev, snapshotTime: e.target.value, snapshotError: null }));
  const handleSnapshotDateChange = e => setState(prev => ({ ...prev, snapshotDate: e.target.value, snapshotError: null }));

  function getDenverNowIsoString() {
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Denver',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    const parts = fmt.formatToParts(new Date());
    const m = {};
    parts.forEach(p => { if (p.type !== 'literal') m[p.type] = p.value; });
    return `${m.year}-${m.month}-${m.day}T${m.hour}:${m.minute}:${m.second}`;
  }

  const applySnapshot = async () => {
    const { snapshotTime, snapshotDate } = state;
    if (!snapshotTime || !snapshotDate) {
      setState(prev => ({ ...prev, snapshotError: 'Select date and time first.' }));
      return;
    }

    const timeForApi = snapshotTime.length === 5 ? `${snapshotTime}:00` : snapshotTime;
    const snapshotIso = `${snapshotDate}T${timeForApi}`;
    const nowDenverIso = getDenverNowIsoString();

    if (snapshotIso > nowDenverIso) {
      const msg = 'Snapshot cannot be in the future.';
      setState(prev => ({ ...prev, snapshotError: msg }));
      return;
    }

    setState(prev => ({ ...prev, snapshotLoading: true, snapshotError: null }));
    try {
      const resp = await fetch(`http://localhost:5000/api/occupancy-at-time-denver?date=${encodeURIComponent(snapshotDate)}&time=${encodeURIComponent(timeForApi)}`);
      if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
      const json = await resp.json();
      setState(prev => ({
        ...prev,
        snapshotData: json,
        visitedOccupants: json.visitedOccupants || [],
        snapshotMode: true
      }));
    } catch (err) {
      setState(prev => ({ ...prev, snapshotError: err.message || 'Failed to fetch snapshot', snapshotData: null, snapshotMode: false }));
    } finally {
      setState(prev => ({ ...prev, snapshotLoading: false }));
    }
  };

  const clearSnapshot = () => {
    setState(prev => ({
      ...prev,
      snapshotMode: false,
      snapshotData: null,
      snapshotTime: '',
      snapshotError: null,
      snapshotLoading: false,
      visitedOccupants: prev.liveVisitedOccupants
    }));
  };

  // Memoized active data
  const activeFloorData = useMemo(() => state.snapshotMode && state.snapshotData ? state.snapshotData.floorBreakdown || [] : state.floorData, [state.snapshotMode, state.snapshotData, state.floorData]);
  const activePersonnelBreakdown = useMemo(() => state.snapshotMode && state.snapshotData ? state.snapshotData.personnelBreakdown || [] : state.personnelBreakdown, [state.snapshotMode, state.snapshotData, state.personnelBreakdown]);
  const activeVisitedOccupants = useMemo(() => state.snapshotMode && state.snapshotData ? state.snapshotData.visitedOccupants || [] : state.visitedOccupants, [state.snapshotMode, state.snapshotData, state.visitedOccupants]);
  const activeTotalVisitedToday = useMemo(() => state.snapshotMode && state.snapshotData ? state.snapshotData.totalVisitedToday || 0 : state.totalVisitedToday, [state.snapshotMode, state.snapshotData, state.totalVisitedToday]);
  const activePersonnelSummary = useMemo(() => state.snapshotMode && state.snapshotData ? state.snapshotData.personnelSummary || { employees: 0, contractors: 0 } : state.personnelSummary, [state.snapshotMode, state.snapshotData, state.personnelSummary]);
  const activeVisitedToday = useMemo(() => state.snapshotMode && state.snapshotData ? state.snapshotData.visitedToday || { employees: 0, contractors: 0, total: 0 } : state.visitedToday, [state.snapshotMode, state.snapshotData, state.visitedToday]);
  const activeFloorInOutSummary = useMemo(() => state.snapshotMode && state.snapshotData ? state.snapshotData.floorInOutSummary || [] : state.floorInOutSummary, [state.snapshotMode, state.snapshotData, state.floorInOutSummary]);

  let snapshotLabel = null;
  if (state.snapshotMode && state.snapshotData) {
    const asOfLocal = state.snapshotData.asOfLocal || state.snapshotData.asOf || state.snapshotData.asOfUTC;
    const formatted = asOfLocal ? new Date(asOfLocal).toLocaleString('en-US', { timeZone: 'America/Denver' }) : `${state.snapshotDate} ${state.snapshotTime}`;
    snapshotLabel = <div style={{ background: '#363d37', color: '#FFF', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid rgb(11,248,3)', marginBottom: 8 }}> Snapshot: {formatted} (Denver) </div>;
  }

  return (
    <BrowserRouter>
      <div className="dark-theme">
        <Navbar bg="dark" variant="dark" expand="lg" className="px-4 navbar-infographic">
          <Navbar.Brand as={Link} to="/" className="wu-brand">Live Occupancy — Western Union Denver</Navbar.Brand>
          <Nav className="ms-auto align-items-center">
            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-dashboard">Dashboard</Tooltip>}>
              <Nav.Link as={Link} to="/" className="nav-item-infographic"><i className="bi bi-house"></i></Nav.Link>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-history">History</Tooltip>}>
              <Nav.Link href="http://10.199.22.57:3002/partition/US.CO.OBS/history" className="nav-item-infographic"><i className="bi bi-clock-history"></i></Nav.Link>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-details">Details</Tooltip>}>
              <Nav.Link as={Link} to="/floor-details" className="nav-item-infographic"><i className="fa-solid fa-calendar-day"></i></Nav.Link>
            </OverlayTrigger>
            <Form className="d-flex align-items-center ms-3" onSubmit={e => e.preventDefault()}>
              <InputGroup>
                <Form.Control type="date" value={state.snapshotDate} onChange={handleSnapshotDateChange} style={{ maxWidth: 150 }} />
                <Form.Control type="time" step="1" value={state.snapshotTime} onChange={handleSnapshotTimeChange} style={{ maxWidth: 120 }} />
                <Button variant="outline-light" onClick={applySnapshot} disabled={state.snapshotLoading}>{state.snapshotLoading ? 'Loading…' : 'Apply'}</Button>
                <Button variant="outline-secondary" onClick={clearSnapshot} className="ms-1">Clear</Button>
              </InputGroup>
            </Form>
            <Nav.Link className="theme-toggle-icon" title="Dark mode only"><FaSun color="#FFC72C" /></Nav.Link>
          </Nav>
        </Navbar>

        <Container fluid className="mt-4">
           <ErrorBanner status={connectionStatus} />
          {snapshotLabel}
          {state.snapshotError && <span style={{ color: 'salmon', marginLeft: 10 }}>{state.snapshotError}</span>}

          <Suspense fallback={<div>Loading dashboard...</div>}>
            <Routes>
              <Route path="/" element={
                <DashboardHome
                  personnelSummary={activePersonnelSummary}
                  totalVisitedToday={activeTotalVisitedToday}
                  visitedToday={activeVisitedToday}
                  visitedOccupants={activeVisitedOccupants}
                  floorData={activeFloorData}
                  personnelBreakdown={activePersonnelBreakdown}
                  floorInOutSummary={activeFloorInOutSummary}
                  rejectionSnapshot={state.snapshotMode && state.snapshotData ? state.snapshotData.rejections || state.snapshotData.rejectionAllDetailsToday || [] : null}
                />
              } />
              <Route path="/floor-details" element={<FloorDetailsPage floorData={activeFloorData} floorInOutSummary={activeFloorInOutSummary} visitedOccupants={activeVisitedOccupants} />} />
              <Route path="/inout-inconsistency-denver" element={<DenverInOutInconsistencyPage data={state.inOutData} loading={state.loadingInOut} error={state.inOutError} />} />
            </Routes>
          </Suspense> {/* <-- Fixed: Suspense properly closed */}
        </Container>
      </div>
    </BrowserRouter>
  );
}

+++++++++++++++++++++++++++++++++++++++++++  
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
import { FaSun } from 'react-icons/fa';

import './App.css';

// Lazy load pages
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const ErtPage = lazy(() => import('./pages/ErtPage'));
const ZoneDetailsTable = lazy(() => import('./components/ZoneDetailsTable'));


  // Error 
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
  }, []);

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
          }, 500); // max UI update every 0.5s
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
    } catch (err) { console.error(err); }
    finally { setTimeTravelLoading(false); }
  }, [API_ORIGIN, setPayload]);

  const clearTimeTravel = useCallback(async () => {
    setTimeTravelLoading(true);
    try {
      setTimeTravelMode(false);
      setTimeTravelTimestamp(null);
      const resp = await fetch(`${API_ORIGIN}/api/current-occupancy`);
      if (resp.ok) setPayload(await resp.json());
    } finally { setTimeTravelLoading(false); }
  }, [API_ORIGIN, setPayload]);

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
            <Nav.Link as={Link} to="/" className="nav-item-infographic"><i className="bi bi-house"></i></Nav.Link>
            <Nav.Link href="http://10.199.22.57:3000/partition/Pune/history" className="nav-item-infographic"><i className="bi bi-clock-history"></i></Nav.Link>
            <Nav.Link as={Link} to="/details" className="nav-item-infographic"><i className="fa-solid fa-calendar-day"></i></Nav.Link>
            <Nav.Link as={Link} to="/ert" className="nav-item-infographic">ERT Overview</Nav.Link>
            <Nav.Link className="theme-toggle-icon" title="Dark mode only"><FaSun /></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid className="mt-2">
        {timeTravelMode && (
          <div style={{ background: '#434d44', color: '#FFF', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid rgb(0, 255, 21)', marginBottom: 8 }}>
            <div>Viewing snapshot: <strong>{new Date(timeTravelTimestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</strong></div>
            <div>
              <button className="btn btn-sm btn-outline-warning" onClick={clearTimeTravel} disabled={timeTravelLoading}>Return to Live</button>
            </div>
          </div>
        )}
        {/* 👇 NEW ERROR UI */}
        <ErrorBanner status={connectionStatus} />

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
          </Routes>
        </Suspense>
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
