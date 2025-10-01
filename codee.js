const [connectionStatus, setConnectionStatus] = useState('connecting');



......


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







.....
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