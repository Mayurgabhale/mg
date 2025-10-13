useEffect(() => {
  let active = true;
  const backendKey = backendFilterKey || 'all';

  const buildIndexAndSet = (json) => {
    const detailMap = new Map();
    (json.details || []).forEach(r => {
      const d = (r.LocaleMessageTime && r.LocaleMessageTime.slice(0, 10))
        || (r.SwipeDate && r.SwipeDate.slice(0, 10))
        || 'unknown';
      if (!detailMap.has(d)) detailMap.set(d, []);
      detailMap.get(d).push(r);
    });

    const summaryMap = new Map();
    (json.summaryByDate || []).forEach(s => {
      const key = (s.date || '').slice(0, 10);
      summaryMap.set(key, s);
    });

    if (!active) return;
    setData(json || { details: [], summaryByDate: [] });
    setIndexByDate({ detailMap, summaryMap });
  };

  (async () => {
    setLoading(true);

    const cached = loadHistoryCache(backendKey);
    const now = Date.now();
    let usedCache = false;

    if (cached && cached.json) {
      const cachedVersion = cached.version || null;
      if (cachedVersion && (now - (cached.fetchedAt || 0)) < CACHE_TTL_MS) {
        buildIndexAndSet(cached.json);
        usedCache = true;
        setLoading(false);
      } else if (!cachedVersion && (now - (cached.fetchedAt || 0)) < CACHE_TTL_MS) {
        buildIndexAndSet(cached.json);
        usedCache = true;
        setLoading(false);
      }
      // We'll still check server in background below (to detect new version)
    }

    // fetch once (either to validate or to populate fresh cache)
    try {
      const json = await fetchHistory(decodedPartition);
      if (!active) return;
      const serverVersion = json?.meta?.version || json?.generated_at || null;

      // if we had cached version and it matches, nothing to do (unless we didn't use cache)
      if (cached && cached.version && cached.version === serverVersion && usedCache) {
        // nothing
      } else {
        saveHistoryCache(backendKey, json);
        buildIndexAndSet(json);
      }
    } catch (err) {
      console.error('fetchHistory error', err);
      // fall back to cached data if fetch failed
      if (cached && cached.json && !usedCache) {
        buildIndexAndSet(cached.json);
      }
    } finally {
      if (active) setLoading(false);
    }
  })();

  return () => { active = false; };
}, [decodedPartition]); // runs once per partition change