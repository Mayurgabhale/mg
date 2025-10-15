useEffect(() => {
  const iv = setInterval(async () => {
    const json = await fetchLiveSummary();
    setLiveCounts(json.realtime[partition]?.floors || {});
    setDetails(filterAndMap(json));
    setLastUpdate(new Date().toLocaleTimeString());
  }, 1000);
  return () => clearInterval(iv);
}, [partition]);