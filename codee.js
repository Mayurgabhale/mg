// ------------------ Time Travel ------------------
const clearTimeTravel = useCallback(async () => {
  setTimeTravelLoading(true);
  try {
    setTimeTravelMode(false);
    setTimeTravelTimestamp(null);

    // 🔑 no fetch here – SSE will kick in again
    // liveData will auto-refresh from /api/live-occupancy
  } finally {
    setTimeTravelLoading(false);
  }
}, []);