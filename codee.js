// 🔌 Connection status for SSE
const [connectionStatus, setConnectionStatus] = useState('connecting'); // connecting | open | stale | error
const lastSeenRef = useRef(Date.now());

// Safer payload setter
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

