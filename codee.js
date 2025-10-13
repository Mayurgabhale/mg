y







const filterAndMap = (json, currentPartition) =>
  json.details
    .filter(r =>
      r.PartitionName2 === currentPartition &&
      (r.Direction === "InDirection" || r.Direction === "OutDirection")
    )
    .map(r => {
      const floor = lookupFloor(r.PartitionName2, r.Door, r.Direction);
      return { ...r, floor };
    })
    .filter(r => r.floor !== "Unmapped");


....

useEffect(() => {
  let active = true;

  const fetchData = async () => {
    setLoading(true); // optional: show spinner if desired
    const json = await fetchLiveSummary();
    if (!active) return;
    setLiveCounts(json.realtime[partition]?.floors || {});
    setDetails(filterAndMap(json, partition));
    setLastUpdate(new Date().toLocaleTimeString());
    setLoading(false);
  };

  fetchData(); // <-- immediate fetch on partition change

  const iv = setInterval(fetchData, 1000); // continue polling

  return () => { 
    active = false; 
    clearInterval(iv); 
  };
}, [partition]);