useEffect(() => {
  let active = true;

  // clear previous details so table updates instantly
  setDetails([]);
  setExpanded(null);
  setLoading(true);

  const load = async () => {
    const json = await fetchLiveSummary();
    if (!active) return;

    const det = json.details
      .filter(r => r.PartitionName2 === partition && r.Direction === 'InDirection')
      .map(r => ({
        ...r,
        floor: lookupFloor(r.PartitionName2, r.Door, r.Direction)
      }));

    if (!active) return;
    setDetails(det);
    setLoading(false);
  };

  load();

  // optional: interval for live refresh
  const iv = setInterval(load, 1000);

  return () => {
    active = false;
    clearInterval(iv);
  };
}, [partition]);