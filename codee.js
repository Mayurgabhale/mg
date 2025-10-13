<Button
  variant="outlined"
  sx={{ ml: 2, borderColor: '#FFC107', color: '#FFC107' }}
  onClick={async () => {
    const backendKey = backendFilterKey || 'all';
    clearHistoryCache(backendKey);
    setLoading(true);
    try {
      const fresh = await fetchHistory(decodedPartition);
      saveHistoryCache(backendKey, fresh);
      // build index
      const detailMap = new Map();
      (fresh.details || []).forEach(r => {
        const d = (r.LocaleMessageTime && r.LocaleMessageTime.slice(0, 10))
          || (r.SwipeDate && r.SwipeDate.slice(0, 10))
          || 'unknown';
        if (!detailMap.has(d)) detailMap.set(d, []);
        detailMap.get(d).push(r);
      });
      const summaryMap = new Map();
      (fresh.summaryByDate || []).forEach(s => summaryMap.set((s.date||'').slice(0,10), s));
      setData(fresh);
      setIndexByDate({ detailMap, summaryMap });
    } catch (err) {
      console.error('Manual refresh failed', err);
    } finally {
      setLoading(false);
    }
  }}
>
  Refresh History
</Button>