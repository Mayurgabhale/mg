useEffect(() => {
  let active = true;

  // Immediately reset data when partition changes
  setDetails([]);
  setLiveCounts({});
  setExpandedFloor(null);
  setLoading(true);

  // Fetch new data
  fetchLiveSummary().then(json => {
    if (!active) return;

    const partitionFloors = json.realtime[partition]?.floors || {};
    const partitionDetails = json.details
      .filter(r =>
        r.PartitionName2 === partition &&
        (r.Direction === "InDirection" || r.Direction === "OutDirection")
      )
      .map(r => {
        const floor = lookupFloor(r.PartitionName2, r.Door, r.Direction);
        return { ...r, floor };
      })
      .filter(r => r.floor !== "Unmapped");

    setLiveCounts(partitionFloors);
    setDetails(partitionDetails);
    setLastUpdate(new Date().toLocaleTimeString());
    setLoading(false);
  });

  return () => { active = false };
}, [partition]);