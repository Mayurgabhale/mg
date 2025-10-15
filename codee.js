const updatePartitionData = async () => {
  setLoading(true); // optional: show spinner briefly
  try {
    const json = await fetchLiveSummary();
    setLiveCounts(json.realtime[partition]?.floors || {});
    setDetails(filterAndMap(json));
    setLastUpdate(new Date().toLocaleTimeString());
  } catch (err) {
    console.error("Failed to fetch live summary", err);
  } finally {
    setLoading(false);
  }
};

// Fetch immediately when partition changes
useEffect(() => {
  updatePartitionData();
}, [partition]);

// Poll every 1 second
useEffect(() => {
  const iv = setInterval(() => updatePartitionData(), 1000);
  return () => clearInterval(iv);
}, [partition]);