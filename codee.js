useEffect(() => {
  let active = true;

  const fetchData = async () => {
    if (!active) return;
    const json = await fetchLiveSummary();
    if (!active) return;
    setLiveCounts(json.realtime[partition]?.floors || {});
    setDetails(filterAndMap(json, partition));
    setLastUpdate(new Date().toLocaleTimeString());
    setLoading(false);  // only set once after first fetch
  };

  setLoading(true);  // show spinner on first load
  fetchData();        // fetch immediately
  const iv = setInterval(fetchData, 1000); // continue polling

  return () => { 
    active = false; 
    clearInterval(iv); 
  };
}, [partition]);