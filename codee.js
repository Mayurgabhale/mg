useEffect(() => {
  // 🚫 Don't start SSE for travel dashboard
  if (location.pathname === "/travel-dashboard") return;

  if (timeTravelMode) {
    esRef.current?.close();
    esRef.current = null;
    return;
  }

  const esUrl = `${API_ORIGIN}/api/live-occupancy`;
  const es = new EventSource(esUrl);
  esRef.current = es;

  es.onopen = () => setConnectionStatus("open");
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
    } catch {
      setConnectionStatus("error");
    }
  };
  es.onerror = () => setConnectionStatus("error");

  return () => es.close();
}, [timeTravelMode, API_ORIGIN, setPayload, location.pathname]);