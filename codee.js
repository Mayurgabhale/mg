useEffect(() => {
  if (timeTravelMode) {
    if (esRef.current) {
      esRef.current.close();
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
      setPayload(p);
      if (connectionStatus !== 'open') setConnectionStatus('open');
    } catch (err) {
      console.error('[SSE] parse error', err, 'raw:', e.data);
      setConnectionStatus('error'); // but keep connection open
    }
  };

  es.onerror = (err) => {
    console.error('[SSE] error (EventSource will try reconnect automatically)', err);
    // ⚠️ Important: DO NOT close here, let EventSource retry
    setConnectionStatus('error');
  };

  // monitor for staleness
  const stalenessChecker = setInterval(() => {
    const age = Date.now() - lastSeenRef.current;
    if (age > 20_000) { // 20s with no data
      setConnectionStatus('stale');
    } else if (connectionStatus === 'stale') {
      setConnectionStatus('open');
    }
  }, 4000);

  return () => {
    clearInterval(stalenessChecker);
    try { es.close(); } catch (e) {}
    esRef.current = null;
  };
}, [timeTravelMode, API_ORIGIN, setPayload]);