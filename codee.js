// ---------- top-level helpers (paste above component) ----------
import { subDays } from 'date-fns'; // keep this import at top

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h fallback TTL

const cacheKeyFor = (backendKey) => `history_cache_${backendKey || 'all'}`;

const saveHistoryCache = (backendKey, json) => {
  try {
    const version = json?.meta?.version || json?.generated_at || null;
    const payload = { fetchedAt: Date.now(), version, json };
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

// company normaliser moved top-level (so useMemo won't require it in deps)
const normalizeCompany = (raw) => {
  if (!raw) return 'Unknown';
  const orig = String(raw).trim();
  const s = orig
    .toLowerCase()
    // remove punctuation commonly causing variants (simplified escapes)
    .replace(/[.,()\/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (/\bpoona\b/.test(s) || /\bpoona security\b/.test(s) || /\bpoona security india\b/.test(s)) {
    return 'Poona Security India Pvt Ltd';
  }

  if (
    /\bwestern union\b/.test(s) ||
    /\bwesternunion\b/.test(s) ||
    /\bwu\b/.test(s) ||
    /\bwufs\b/.test(s) ||
    /\bwu technology\b/.test(s)
  ) {
    return 'Western Union';
  }

  if (/\bvedant\b/.test(s)) return 'Vedant Enterprises Pvt. Ltd';
  if (/\bosource\b/.test(s)) return 'Osource India Pvt Ltd';
  if (/\bcbre\b/.test(s)) return 'CBRE';
  if (s === 'unknown' || s === '') return 'Unknown';
  return orig;
};

const getCanonicalCompany = (r) => {
  const rawCompany = (r.CompanyName || '').toString().trim();
  const pt = (r.PersonnelType || '').toString().trim().toLowerCase();
  const s = rawCompany.toLowerCase();

  if (s && /\bcbre\b/.test(s) && (/\bclr\b/.test(s) || /\bfacilit/i.test(s))) {
    return 'CLR Facility Services Pvt.Ltd.';
  }

  if (s && (s === 'cbre' || normalizeCompany(rawCompany) === 'CBRE')) {
    if (pt.includes('property') || pt.includes('management') || pt === 'property management') {
      return 'CLR Facility Services Pvt.Ltd.';
    }
    return 'CBRE';
  }

  if (!rawCompany) {
    if (pt.includes('contractor')) return 'CBRE';
    if (pt.includes('property') || pt.includes('management') || pt === 'property management') {
      return 'CLR Facility Services Pvt.Ltd.';
    }
    if (pt === 'employee') return 'Western Union';
    if (pt.includes('visitor')) return 'Visitor';
    if (pt.includes('temp')) return 'Temp Badge';
    return 'Unknown';
  }
  return normalizeCompany(rawCompany);
};