// add at top of file
import { subDays } from 'date-fns';

// inside component, add helper functions:

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours fallback TTL

const cacheKeyFor = (backendKey) => `history_cache_${backendKey || 'all'}`;

const saveHistoryCache = (backendKey, json) => {
  try {
    const version = json?.meta?.version || json?.generated_at || null;
    const payload = {
      fetchedAt: Date.now(),
      version,
      json
    };
    localStorage.setItem(cacheKeyFor(backendKey), JSON.stringify(payload));
  } catch (err) {
    console.warn('saveHistoryCache error', err);
  }
};

const loadHistoryCache = (backendKey) => {
  try {
    const raw = localStorage.getItem(cacheKeyFor(backendKey));
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('loadHistoryCache error', err);
    return null;
  }
};

const clearHistoryCache = (backendKey) => {
  try {
    localStorage.removeItem(cacheKeyFor(backendKey));
  } catch (err) {
    console.warn('clearHistoryCache error', err);
  }
};

// New useEffect that uses cache + one fetch if required
useEffect(() => {
  let active = true;
  const backendKey = backendFilterKey || 'all';

  const buildIndexAndSet = (json) => {
    // build date -> details map (single pass)
    const detailMap = new Map();
    (json.details || []).forEach(r => {
      const d = (r.LocaleMessageTime && r.LocaleMessageTime.slice(0, 10))
        || (r.SwipeDate && r.SwipeDate.slice(0, 10))
        || 'unknown';
      if (!detailMap.has(d)) detailMap.set(d, []);
      detailMap.get(d).push(r);
    });

    // build summary map by date (use slice to normalize)
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

    // 1) try load cache
    const cached = loadHistoryCache(backendKey);
    const now = Date.now();
    let useCache = false;

    if (cached && cached.json) {
      // if server gives a version, we can try to validate. Otherwise use TTL.
      // Preferred: server returns json.meta.version or json.generated_at
      const cachedVersion = cached.version || null;
      if (cachedVersion) {
        // If cached recently (within TTL) use cache immediately, but also check server version in background
        if ((now - (cached.fetchedAt || 0)) < CACHE_TTL_MS) {
          useCache = true;
          buildIndexAndSet(cached.json);
          setLoading(false);
        } else {
          // expired by TTL — will fetch below
        }

        // background: check server version quickly if possible
        try {
          // Attempt a lightweight check. If your API supports an endpoint which returns only version/ETag, call it.
          // fallback: call full fetchHistory (still only once)
          const json = await fetchHistory(decodedPartition);
          if (!active) return;
          const serverVersion = json?.meta?.version || json?.generated_at || null;
          // if version changed, replace cache
          if (serverVersion !== cachedVersion) {
            saveHistoryCache(backendKey, json);
            buildIndexAndSet(json);
          } else if (!useCache) {
            // cache was not used earlier and server same - use cached one
            buildIndexAndSet(cached.json);
          }
          setLoading(false);
          return;
        } catch (err) {
          // server check failed -> fallback to cached if available
          console.warn('version check failed, using cache fallback', err);
          if (!useCache) buildIndexAndSet(cached.json);
          setLoading(false);
          return;
        }
      } else {
        // no server version — fall back to TTL
        if ((now - (cached.fetchedAt || 0)) < CACHE_TTL_MS) {
          useCache = true;
          buildIndexAndSet(cached.json);
          setLoading(false);
        }
      }
    }

    // 2) If not using cache, fetch once and save
    try {
      const json = await fetchHistory(decodedPartition);
      if (!active) return;
      saveHistoryCache(backendKey, json);
      buildIndexAndSet(json);
    } catch (err) {
      console.error('fetchHistory error', err);
      // if we had cached data (stale) and fetch failed, use cache as best-effort
      if (cached && cached.json) {
        buildIndexAndSet(cached.json);
      }
    } finally {
      if (active) setLoading(false);
    }
  })();

  return () => { active = false; };
}, [decodedPartition]); // runs once per partition change