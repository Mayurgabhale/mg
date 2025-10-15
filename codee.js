const getCanonicalCompany = useCallback((r) => {
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
}, [normalizeCompany]);