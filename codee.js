why show this error; and how to slvoe it 

ContentMain.js:18 [ContentMain]
ContentMain.js:18 [ContentService] document.readyState: loading
ContentMain.js:5 [ContentService.SetContentInitData] target: { TabId: 346274178, FrameId: 0}
react refresh:37 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
App.js:362  ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
warnOnce @ deprecations.ts:9
logDeprecation @ deprecations.ts:13
logV6DeprecationWarnings @ deprecations.ts:26
(anonymous) @ index.tsx:816
react-stack-bottom-frame @ react-dom-client.development.js:23949
runWithFiberInDEV @ react-dom-client.development.js:1518
commitHookEffectListMount @ react-dom-client.development.js:11886
commitHookPassiveMountEffects @ react-dom-client.development.js:12024
commitPassiveMountOnFiber @ react-dom-client.development.js:13840
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13813
commitPassiveMountOnFiber @ react-dom-client.development.js:13834
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13813
commitPassiveMountOnFiber @ react-dom-client.development.js:13957
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13813
commitPassiveMountOnFiber @ react-dom-client.development.js:13853
flushPassiveEffects @ react-dom-client.development.js:15737
(anonymous) @ react-dom-client.development.js:15379
performWorkUntilDeadline @ scheduler.development.js:45
<BrowserRouter>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:336
WrappedApp @ App.js:362
react-stack-bottom-frame @ react-dom-client.development.js:23863
renderWithHooksAgain @ react-dom-client.development.js:5629
renderWithHooks @ react-dom-client.development.js:5541
updateFunctionComponent @ react-dom-client.development.js:8897
beginWork @ react-dom-client.development.js:10522
runWithFiberInDEV @ react-dom-client.development.js:1518
performUnitOfWork @ react-dom-client.development.js:15130
workLoopSync @ react-dom-client.development.js:14956
renderRootSync @ react-dom-client.development.js:14936
performWorkOnRoot @ react-dom-client.development.js:14417
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16216
performWorkUntilDeadline @ scheduler.development.js:45
<WrappedApp>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:336
./src/index.js @ index.js:10
options.factory @ react refresh:37
__webpack_require__ @ bootstrap:22
(anonymous) @ startup:7
(anonymous) @ startup:7
App.js:362  ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
warnOnce @ deprecations.ts:9
logDeprecation @ deprecations.ts:13
logV6DeprecationWarnings @ deprecations.ts:37
(anonymous) @ index.tsx:816
react-stack-bottom-frame @ react-dom-client.development.js:23949
runWithFiberInDEV @ react-dom-client.development.js:1518
commitHookEffectListMount @ react-dom-client.development.js:11886
commitHookPassiveMountEffects @ react-dom-client.development.js:12024
commitPassiveMountOnFiber @ react-dom-client.development.js:13840
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13813
commitPassiveMountOnFiber @ react-dom-client.development.js:13834
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13813
commitPassiveMountOnFiber @ react-dom-client.development.js:13957
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13813
commitPassiveMountOnFiber @ react-dom-client.development.js:13853
flushPassiveEffects @ react-dom-client.development.js:15737
(anonymous) @ react-dom-client.development.js:15379
performWorkUntilDeadline @ scheduler.development.js:45
<BrowserRouter>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:336
WrappedApp @ App.js:362
react-stack-bottom-frame @ react-dom-client.development.js:23863
renderWithHooksAgain @ react-dom-client.development.js:5629
renderWithHooks @ react-dom-client.development.js:5541
updateFunctionComponent @ react-dom-client.development.js:8897
beginWork @ react-dom-client.development.js:10522
runWithFiberInDEV @ react-dom-client.development.js:1518
performUnitOfWork @ react-dom-client.development.js:15130
workLoopSync @ react-dom-client.development.js:14956
renderRootSync @ react-dom-client.development.js:14936
performWorkOnRoot @ react-dom-client.development.js:14417
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16216
performWorkUntilDeadline @ scheduler.development.js:45
<WrappedApp>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:336
./src/index.js @ index.js:10
options.factory @ react refresh:37
__webpack_require__ @ bootstrap:22
(anonymous) @ startup:7
(anonymous) @ startup:7
+++++++++++++++++++++++++
  


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
    <BrowserRouter>
      <div className="dark-theme">
        <App />
      </div>
    </BrowserRouter>
  );
}
