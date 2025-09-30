in this dashbord data is not disply,
    data is get fomr api, in api also problme,

but i want to use try cacht block to show erro in frontend excaly where is the issue
why data is not visibal in dashboard , where is the isssue, 
backend or frontend, that i understant the erro is where is came and what is the error, whay data is not disply, 
where data is stukking ok 
i hope you undestand better, 
that is got , then we move on backend 
+++ first i stat backend and frontend only 10 or 15 minite not get any error, but aftet that, in dashbaord not disply any things is empty++ not disply any data ++ 
C:\Users\W0024618\Desktop\swipeData\client\src\services\app.js
import React, { useEffect, useState } from 'react';
import { fetchOccupancyData } from './services/api';
import SummaryChart from './components/SummaryChart';
import ZoneDetailsTable from './components/ZoneDetailsTable';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const newData = await fetchOccupancyData();
      setData(newData);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Live Employee Occupancy Dashboard</h2>
      <SummaryChart summary={data.summary} />
      <ZoneDetailsTable details={data.details} />
    </div>
  );
}

export default App;



++++++++++++++++++
// src/api.js C:\Users\W0024618\Desktop\swipeData\client\src\api.js
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});


++++++++++++



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

  // SSE with throttling
  useEffect(() => {
    if (timeTravelMode) {
      if (esRef.current) esRef.current.close();
      esRef.current = null;
      return;
    }

    const esUrl = `${API_ORIGIN}/api/live-occupancy`;
    const es = new EventSource(esUrl);
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const p = JSON.parse(e.data);
        sseBufferRef.current = p;

        if (!sseFlushScheduledRef.current) {
          sseFlushScheduledRef.current = true;
          setTimeout(() => {
            setLiveData(sseBufferRef.current);
            sseFlushScheduledRef.current = false;
          }, 500); // throttle updates to every 0.5s
        }
      } catch (err) {
        console.error('[SSE] parse error', err);
      }
    };

    es.onerror = (err) => {
      console.error('[SSE] error', err);
      es.close();
      esRef.current = null;
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [timeTravelMode, API_ORIGIN]);

  // Unified payload setter
  const setPayload = useCallback((p) => {
    setLiveData({
      summary: Array.isArray(p.summary) ? p.summary : [],
      details: p.details || {},
      floorBreakdown: Array.isArray(p.floorBreakdown) ? p.floorBreakdown : [],
      zoneBreakdown: Array.isArray(p.zoneBreakdown) ? p.zoneBreakdown : [],
      personnelBreakdown: Array.isArray(p.personnelBreakdown) ? p.personnelBreakdown : [],
      totalVisitedToday: typeof p.totalVisitedToday === 'number' ? p.totalVisitedToday : 0,
      personnelSummary: p.personnelSummary || { employees: 0, contractors: 0 },
      visitedToday: p.visitedToday || { employees: 0, contractors: 0, total: 0 },
      ertStatus: p.ertStatus || {}
    });
  }, []);

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

      {/* <Navbar bg="dark" variant="dark" expand="lg" className="px-4">
        <Navbar.Brand as={Link} to="/" className="wu-brand">{headerText}</Navbar.Brand>
        <Nav className="ms-auto align-items-center">
          <div className="me-3" style={{ display: 'flex', alignItems: 'center' }}>
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
      </Navbar> */}

      {/* responsive */}


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

+++++++++++

    

// src/pages/DashboardHome.jsx
import React, { useMemo, lazy, Suspense, useDeferredValue } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import SummaryCards from '../components/SummaryCards';
import LoadingSpinner from '../components/LoadingSpinner';

// lazy-load charts (prefetch so browser can warm the chunk after idle)
const FloorOccupancyChart = lazy(() => import(
  /* webpackChunkName: "floor-chart", webpackPrefetch: true */ '../components/FloorOccupancyChart'
));
const SummaryChart = lazy(() => import(
  /* webpackChunkName: "summary-chart", webpackPrefetch: true */ '../components/SummaryChart'
));
const PersonnelDonutChart = lazy(() => import(
  /* webpackChunkName: "personnel-donut", webpackPrefetch: true */ '../components/PersonnelDonutChart'
));

/**
 * DashboardHome
 * - Always render SummaryCards immediately (fast first meaningful paint)
 * - Defer heavy chart rendering with useDeferredValue + Suspense fallbacks
 * - Memoize chart data so children only get new props when the source changes
 */
function DashboardHome({
  summaryData = [],
  detailsData,
  floorData = [],
  zoneBreakdown,
  personnelBreakdown = [],
  totalVisitedToday = 0,
  personnelSummary = { employees: 0, contractors: 0 },
  visitedToday = {},
  ertStatus
}) {
  // small cheap derived numbers shown in SummaryCards (fast)
  const employees = personnelSummary?.employees ?? 0;
  const contractors = personnelSummary?.contractors ?? 0;
  const totalOccupancy = employees + contractors;

  // memoize chart input transforms (cheap => prevents child re-render unless source changes)
  const chartData = useMemo(() => {
    return (personnelBreakdown || []).map(({ personnelType, count }) => ({ personnelType, count }));
  }, [personnelBreakdown]);

  // useDeferredValue prevents urgent UI (summary cards) from being blocked by chart updates
  const deferredChartData = useDeferredValue(chartData);
  const deferredFloorData = useDeferredValue(floorData || []);
  const deferredSummary = useDeferredValue(summaryData || []);

  // NOTE: Do NOT block entire page on charts. Always show summary cards immediately.
  // Charts will show loading placeholders until their lazy chunks and data are ready.

  return (
    <Container fluid className="py-4">
      {/* Summary: first meaningful paint (always show with minimal compute) */}
      <SummaryCards
        totalOccupancy={totalOccupancy}
        employeeCount={employees}
        contractorCount={contractors}
        totalVisitedToday={totalVisitedToday}
        employeesVisitedToday={visitedToday?.employees ?? 0}
        contractorsVisitedToday={visitedToday?.contractors ?? 0}
      />

      {/* Charts row — lazy rendered with Suspense fallback */}
      <Row className="g-4" style={{ marginTop: 12 }}>
        <Col md={4} style={{ minHeight: 300 }}>
          <Suspense fallback={<div style={{height: '100%', display:'flex', alignItems:'center', justifyContent:'center'}}><LoadingSpinner message="Loading chart…" small /></div>}>
            <FloorOccupancyChart data={deferredFloorData} />
          </Suspense>
        </Col>

        <Col md={4} style={{ minHeight: 300 }}>
          <Suspense fallback={<div style={{height: '100%', display:'flex', alignItems:'center', justifyContent:'center'}}><LoadingSpinner message="Loading chart…" small /></div>}>
            <SummaryChart summary={deferredSummary} />
          </Suspense>
        </Col>

        <Col md={4} style={{ minHeight: 300 }}>
          <Suspense fallback={<div style={{height: '100%', display:'flex', alignItems:'center', justifyContent:'center'}}><LoadingSpinner message="Loading chart…" small /></div>}>
            <PersonnelDonutChart data={deferredChartData} />
          </Suspense>
        </Col>
      </Row>

     
{/* Footer — always at the bottom */}
<footer style={{
  backgroundColor: '#000',
  color: '#FFC72C',
  padding: '1.5rem 0',
  textAlign: 'center',
  borderTop: '2px solid #FFC72C',
  fontSize: '0.95rem',
  lineHeight: '1.6',
  minHeight: 120,
  // position: 'fixed',   // fix at bottom
  left: 0,             // full width
  bottom: 0,
  width: '100%',
  zIndex: 1000         // ensures it’s on top of other content
}}>
  <div>
    <strong>Global Security Operations Center</strong><br />
    Live HeadCount against Occupancy dashboard for Western Union Pune — Real-time occupancy, floor activity, and personnel insights.
  </div>
  <div style={{ marginTop: '0.75rem' }}>
    Contact us:&nbsp;
    <a href="mailto:GSOC-GlobalSecurityOperationCenter.SharedMailbox@westernunion.com"
       style={{ color: '#FFC72C', textDecoration: 'underline' }}>
      GSOC Mail
    </a>&nbsp;|&nbsp;
    Landline:&nbsp;<span style={{ color: '#FFC72C' }}>+91-020-67632394</span>
  </div>
</footer>

    </Container>
  );
}

export default React.memo(DashboardHome);
