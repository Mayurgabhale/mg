useEffect(() => {
  let cancelled = false;
  setLoading(true);
  fetchHistory(decodedPartition)
    .then(json => {
      if (cancelled) return;
      setData(json || { details: [], summaryByDate: [] });

      // build date -> details map (single pass)
      const detailMap = new Map();
      (json.details || []).forEach(r => {
        const d = (r.LocaleMessageTime && r.LocaleMessageTime.slice(0,10))
                  || (r.SwipeDate && r.SwipeDate.slice(0,10))
                  || 'unknown';
        if (!detailMap.has(d)) detailMap.set(d, []);
        detailMap.get(d).push(r);
      });

      // build summary map by date (use slice to normalize)
      const summaryMap = new Map();
      (json.summaryByDate || []).forEach(s => {
        const key = (s.date || '').slice(0,10);
        summaryMap.set(key, s);
      });

      setIndexByDate({ detailMap, summaryMap });
    })
    .catch(err => { console.error('fetchHistory error', err); })
    .finally(() => setLoading(false));

  return () => { cancelled = true; };
}, [decodedPartition]);