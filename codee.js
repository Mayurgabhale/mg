Not disply anythig

C:\Users\W0024618\Desktop\swipeData\client\src\components\CompanySummary.jsx
// src/components/CompanySummary.jsx
import React, { useMemo, useState } from 'react';
import { Card, Button, Table, Row, Col } from 'react-bootstrap';

/**
 * CompanySummary
 * Props:
 *  - details: object mapping zoneName -> array of occupant events (your liveData.details)
 *  - title (optional)
 */

// Move SECTIONS outside the component so it's stable for hooks
const SECTIONS = {
  Podium: (zone) => zone && zone.toLowerCase().includes('podium'),
  '2nd': (zone) => {
    const z = (zone || '').toLowerCase();
    return z.includes('2nd') || z.includes('second') || z.includes('level 2') || /\b2\b/.test(z);
  },
  'Tower B': (zone) => zone && zone.toLowerCase().includes('tower b'),
  All: () => true
};

export default function CompanySummary({ details = {}, title = 'Company-wise Summary' }) {
  const [section, setSection] = useState('Podium');

  // Compute company counts for currently selected section
  const { companyList, totalCount, perZoneBreakdown } = useMemo(() => {
    const predicate = SECTIONS[section] || (() => true);
    const counts = new Map();
    const zoneBreak = {};

    for (const [zoneName, arr] of Object.entries(details || {})) {
      if (!predicate(zoneName)) continue;
      zoneBreak[zoneName] = zoneBreak[zoneName] || {};
      for (const evt of (arr || [])) {
        // CompanyName should come from backend; fallback to 'Unknown'
        const rawC = (evt && (evt.CompanyName || evt.Company || evt.company) ) || '';
        const company = String(rawC).trim().length ? String(rawC).trim() : 'Unknown';
        counts.set(company, (counts.get(company) || 0) + 1);
        zoneBreak[zoneName][company] = (zoneBreak[zoneName][company] || 0) + 1;
      }
    }

    const companyList = Array.from(counts.entries())
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count || a.company.localeCompare(b.company));

    const totalCount = companyList.reduce((s, c) => s + c.count, 0);

    return { companyList, totalCount, perZoneBreakdown: zoneBreak };
  }, [details, section]); // SECTIONS outside, so no eslint warning

  return (
    <Card className="mb-3">
      <Card.Header>
        <Row className="align-items-center">
          <Col><strong>{title}</strong></Col>
          <Col xs="auto">
            <div style={{ display: 'flex', gap: 8 }}>
              {Object.keys(SECTIONS).map(s => (
                <Button
                  key={s}
                  size="sm"
                  variant={s === section ? 'warning' : 'outline-secondary'}
                  onClick={() => setSection(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </Col>
        </Row>
        <div style={{ fontSize: 12, color: '#aaa', marginTop: 6 }}>
          Showing <strong>{section}</strong> — total occupants: <strong>{totalCount}</strong>
        </div>
      </Card.Header>

      <Card.Body>
        <Row>
          <Col md={6}>
            <Table hover size="sm" className="mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Company</th>
                  <th className="text-end">Count</th>
                </tr>
              </thead>
              <tbody>
                {companyList.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-muted">No data for this section</td>
                  </tr>
                )}
                {companyList.map((row, idx) => (
                  <tr key={row.company}>
                    <td>{idx + 1}</td>
                    <td style={{ maxWidth: 280, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.company}</td>
                    <td className="text-end">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>

          <Col md={6}>
            <div style={{ marginBottom: 8 }}>
              <strong>Zones included:</strong>
            </div>

            <div style={{ maxHeight: 260, overflowY: 'auto' }}>
              {Object.keys(perZoneBreakdown).length === 0 && (
                <div className="text-muted">No zones included</div>
              )}

              {Object.entries(perZoneBreakdown).map(([zone, companies]) => (
                <div key={zone} style={{ marginBottom: 8, padding: 8, borderRadius: 6, background: '#f8f9fa' }}>
                  <div style={{ fontWeight: 600 }}>{zone} <span style={{ fontSize: 12, color: '#666' }}>({Object.values(companies).reduce((s,c)=>s+c,0)})</span></div>
                  <div style={{ fontSize: 13 }}>
                    {Object.entries(companies).slice(0,6).map(([company, count]) => (
                      <div key={company} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <div style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{company}</div>
                        <div>{count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Card.Body>

      <Card.Footer className="d-flex justify-content-between align-items-center">
        <div style={{ fontSize: 14 }}>Total (section): <strong>{totalCount}</strong></div>
        <div style={{ fontSize: 12, color: '#777' }}>Data updates from live feed / snapshot</div>
      </Card.Footer>
    </Card>
  );
}
.....

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


....

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
const CompanySummary = lazy(() => import('./components/CompanySummary'));

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
            <Nav.Link as={Link} to="/company-summary" className="nav-item-infographic">Company Summary</Nav.Link>
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
              <Route path="/CompanySummary" element={<ErtPage ertStatus={liveData.ertStatus} />} />
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
