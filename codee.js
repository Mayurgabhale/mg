// src/api/occupancy.service.js
const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3007';

// In-memory cache (liveSummary now has a timestamp)
const cache = {
  liveSummary: null, // { ts: number, data: any }
  history: new Map()
};

const LIVE_TTL = 2000; // ms: return cached copy if last fetch < 2s

// helper: fetch with timeout
async function fetchWithTimeout(url, opts = {}, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export async function fetchLiveSummary({ force = false, timeout = 8000 } = {}) {
  if (!force && cache.liveSummary && Date.now() - cache.liveSummary.ts < LIVE_TTL) {
    return cache.liveSummary.data;
  }

  const res = await fetchWithTimeout(`${BASE}/api/occupancy/live-summary`, {}, timeout);
  if (!res.ok) {
    throw new Error(`Live summary fetch failed: ${res.status}`);
  }
  const json = await res.json();
  cache.liveSummary = { ts: Date.now(), data: json };
  return json;
}

/* existing fetchHistory / clearCache unchanged except add liveSummary clear */
export async function fetchHistory(location) {
  // ... your existing code ...
}

export function clearCache() {
  cache.liveSummary = null;
  cache.history.clear();
}

export const partitionList = [
  'IN.Pune',
  'MY.Kuala Lumpur',
  'PH.Quezon',
  'PH.Taguig',
  'JP.Tokyo',
  'IN.HYD'
];









......
.


// src/hooks/useLiveOccupancy.js
import { useState, useEffect, useRef } from 'react';
import { fetchLiveSummary } from '../api/occupancy.service';

export function useLiveOccupancy(interval = 5000, options = {}) {
  // default interval increased to 5s for production; you can keep 1000 for dev
  const pollInterval = interval;
  const maxErrorCount = options.maxErrorCount ?? 3; // only show error after 3 consecutive failures
  const maxBackoff = options.maxBackoff ?? 60_000; // 60s
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);
  const failuresRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;

    const shouldPollNow = () => !document.hidden && navigator.onLine;

    async function pollOnce() {
      if (!mountedRef.current) return;
      if (!shouldPollNow()) {
        // check again later (small delay) but don't hammer when hidden/offline
        timerRef.current = setTimeout(pollOnce, 2000);
        return;
      }

      try {
        // try fetching; fetchLiveSummary has a TTL to reduce backend calls
        const json = await fetchLiveSummary();
        if (!mountedRef.current) return;
        setData(json);
        setLoading(false);
        setError(null);
        failuresRef.current = 0;
        // next normal poll
        timerRef.current = setTimeout(pollOnce, pollInterval);
      } catch (err) {
        // transient failure handling
        failuresRef.current += 1;
        console.warn('Live summary fetch failed (attempt):', failuresRef.current, err?.message);

        if (failuresRef.current >= maxErrorCount) {
          setError(err);
          setLoading(false);
        }
        // exponential backoff: increase delay after failures
        const backoff = Math.min(maxBackoff, pollInterval * Math.pow(2, failuresRef.current));
        timerRef.current = setTimeout(pollOnce, backoff);
      }
    }

    // react to visibility / online changes: try to resume polling immediately
    const onVisibilityChange = () => {
      if (!document.hidden) {
        // resume ASAP
        clearTimeout(timerRef.current);
        pollOnce();
      }
    };
    const onOnline = () => {
      clearTimeout(timerRef.current);
      pollOnce();
    };
    const onOffline = () => {
      setError(new Error('Offline'));
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    // kick off
    pollOnce();

    return () => {
      mountedRef.current = false;
      clearTimeout(timerRef.current);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [pollInterval, maxErrorCount, maxBackoff]);

  return { data, loading, error };
}