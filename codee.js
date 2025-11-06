chekc also below this two file 

// src/api/occupancy.service.js

const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3007';

// In‐memory cache
const cache = {
  liveSummary: null,
  history: new Map(),  // key: either 'global' or the partition name the backend expects
};

/**
 * Fetch live summary (always fresh).
 */
export async function fetchLiveSummary() {
  const res = await fetch(`${BASE}/api/occupancy/live-summary`);
  if (!res.ok) {
    throw new Error(`Live summary fetch failed: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch history (global or per‐partition), with in‐memory caching.
 * @param {string} [location] — e.g. 'IN.Pune' from your front‐end router param
 */

export async function fetchHistory(location) {
  const codeMap = {
    'IN.Pune': 'Pune',
    'MY.Kuala Lumpur': 'MY.Kuala Lumpur',
    'PH.Quezon': 'Quezon City',
    'PH.Taguig': 'Taguig City',
    'JP.Tokyo': 'JP.Tokyo',
    'IN.HYD':'IN.HYD',
    'SG.Singapore':'Singapore'

  };
  
  const key = location ? codeMap[location] || location : 'global';
  
  if (cache.history.has(key)) {
    return cache.history.get(key);
  }

  const url = key === 'global' 
    ? `${BASE}/api/occupancy/history`
    : `${BASE}/api/occupancy/history/${encodeURIComponent(key)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`History fetch failed: ${res.status}`);
  
  let json = await res.json();
  
  // Normalize single-city response to match global structure
  if (key !== 'global') {
    json.summaryByDate = json.summaryByDate.map(entry => ({
      ...entry,
      partitions: {
        [key]: {
          Employee: entry.region?.Employee,
          Contractor: entry.region?.Contractor,
          total: entry.region?.total
        }
      }
    }));
  }
  
  cache.history.set(key, json);
  return json;
}
/** Clear in‐memory caches (for dev/testing) */
export function clearCache() {
  cache.liveSummary = null;
  cache.history.clear();
}

// APAC partition list for any selector UI
export const partitionList = [
  'IN.Pune',
  'MY.Kuala Lumpur',
  'PH.Quezon',
  'PH.Taguig',
  'JP.Tokyo',
  'IN.HYD',
  'SG.Singapore'
];



//src/services/occupancy.service.js

// APAC partition list
export const partitionList = [
  'Pune',
  'Quezon City',
  'JP.Tokyo',
  'MY.Kuala Lumpur',
  'Taguig City',
  'IN.HYD',
  'Singapore'
];

