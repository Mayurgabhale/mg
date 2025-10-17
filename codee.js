//C:\Users\W0024618\Desktop\laca-occupancy-frontend\src\api\occupancy.service.js


const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

// Simple in-memory cache
const cache = {
  liveSummary: null,
  history: new Map(),  // key: partition code or 'global'
};


export async function fetchLiveSummary() {
  // always fetch fresh data (no in-memory caching)
  const res = await fetch(`${BASE}/api/occupancy/live-summary`);
  if (!res.ok) throw new Error(`Live summary fetch failed: ${res.status}`);
  return res.json();
}


/**
 * @param {string} [location] — e.g. 'CR.Costa Rica Partition'
 */
export async function fetchHistory(location) {
  const key = location || 'global';
  if (cache.history.has(key)) {
    return cache.history.get(key);
  }

  const url = location
    ? `${BASE}/api/occupancy/history/${encodeURIComponent(location)}`
    : `${BASE}/api/occupancy/history`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`History fetch failed: ${res.status}`);
  const json = await res.json();
  cache.history.set(key, json);
  return json;
}

/**
 * Optional helper to clear cache (call if you need fresh data)
 */
export function clearCache() {
  cache.liveSummary = null;
  cache.history.clear();
}
