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
  const [dashboardLoading, setDashboardLoading] = useState(true); // 👈 NEW

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
    setDashboardLoading(false); // 👈 mark as loaded when first payload arrives
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

  // ------------------ Render ------------------
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
        <Navbar.Brand as={Link} to="/" className="wu-brand">{headerText}</Navbar.Brand>
        {/* ... navbar content ... */}
      </Navbar>

      <Container fluid className="mt-2">
        {timeTravelMode && (
          <div style={{ background: '#434d44', color: '#FFF', padding: '8px 16px',
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', borderLeft: '4px solid rgb(0, 255, 21)',
                        marginBottom: 8 }}>
            <div>Viewing snapshot: <strong>{new Date(timeTravelTimestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</strong></div>
            <div>
              <button className="btn btn-sm btn-outline-warning"
                      onClick={() => setTimeTravelMode(false)}
                      disabled={timeTravelLoading}>
                Return to Live
              </button>
            </div>
          </div>
        )}
        <ErrorBanner status={connectionStatus} />

        {dashboardLoading ? (
          <div className="d-flex justify-content-center align-items-center"
               style={{ minHeight: '60vh' }}>
            <Spinner animation="border" role="status" variant="warning" />
            <span className="ms-2" style={{ color: '#FFC72C' }}>Loading live dashboard…</span>
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
            </Routes>
          </Suspense>
        )}
      </Container>
    </>
  );
}