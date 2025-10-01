const [connectionStatus, setConnectionStatus] = useState('connecting'); 
const retryAttemptRef = React.useRef(0);
const esRef = React.useRef(null);



 ....

const initSSE = React.useCallback(() => {
  if (esRef.current) {
    esRef.current.close();
    esRef.current = null;
  }

  const es = new EventSource('http://localhost:5000/api/live-occupancy-denver');
  esRef.current = es;

  es.onopen = () => {
    console.log('[SSE] connected (Denver)');
    setConnectionStatus('open');
    retryAttemptRef.current = 0; // reset retries
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
      console.error('[SSE] parse error', err);
      setConnectionStatus('error');
    }
  };

  es.onerror = err => {
    console.error('[SSE] error', err);
    setConnectionStatus('error');
    es.close();

    // exponential backoff retry
    retryAttemptRef.current += 1;
    const delay = Math.min(30000, 1000 * Math.pow(2, retryAttemptRef.current));
    console.log(`[SSE] retrying in ${delay / 1000}s`);
    setTimeout(() => {
      initSSE();
    }, delay);
  };
}, []);



....


useEffect(() => {
  initSSE();
  return () => esRef.current?.close();
}, [initSSE]);



....
function ErrorBanner({ status, attempt }) {
  if (status === 'open') return null;

  let message = '';
  if (status === 'connecting') {
    message = '🔄 Connecting to live data...';
  } else if (status === 'error') {
    const secs = Math.min(30, Math.pow(2, attempt));
    message = `⚠️ Live data connection lost. Retrying in ${secs}s...`;
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
          Retry now
        </button>
      )}
    </div>
  );
}




....

<Container fluid className="mt-4">
  <ErrorBanner status={connectionStatus} attempt={retryAttemptRef.current} />

  {snapshotLabel}
  {state.snapshotError && <span style={{ color: 'salmon', marginLeft: 10 }}>{state.snapshotError}</span>}