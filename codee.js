const normalizeCompany = (raw) => {
  if (!raw) return 'Unknown';
  const orig = String(raw).trim();
  const s = orig
    .toLowerCase()
    .replace(/[.,()\/\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (/\bpoona\b/.test(s) || /\bpoona security\b/.test(s)) return 'Poona Security India Pvt Ltd';
  if (/\bwestern union\b/.test(s) || /\bwu\b/.test(s) || /\bwu srvcs\b/.test(s) || /\bwu technology\b/.test(s)) return 'Western Union';
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

  // CBRE + CLR or Facility -> CLR canonical
  if (s && /\bcbre\b/.test(s) && (/\bclr\b/.test(s) || /\bfacilit/i.test(s))) {
    return 'CLR Facility Services Pvt.Ltd.';
  }

  // blank company -> use PersonnelType fallback
  if (!rawCompany) {
    if (pt.includes('contractor')) return 'CBRE';
    if (pt.includes('property') || pt.includes('management')) return 'CLR Facility Services Pvt.Ltd.';
    if (pt === 'employee') return 'Western Union';
    if (pt.includes('visitor')) return 'Visitor';
    if (pt.includes('temp')) return 'Temp Badge';
    return 'Unknown';
  }

  return normalizeCompany(rawCompany);
};



const companyName = getCanonicalCompany(employee);

