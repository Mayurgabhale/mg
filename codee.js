// summaryEntry: use indexed map
const summaryEntry = useMemo(() => {
  if (!indexByDate.summaryMap || !pickedDate) return null;
  const ds = format(pickedDate, 'yyyy-MM-dd');
  // exact lookup — no O(n) find
  return indexByDate.summaryMap.get(ds) || null;
}, [indexByDate.summaryMap, pickedDate]);

// companyRows
const companyRows = useMemo(() => {
  if (!indexByDate.detailMap || !pickedDate) return [];
  const ds = format(pickedDate, 'yyyy-MM-dd');
  const rows = indexByDate.detailMap.get(ds) || []; // only this date's rows

  // apply partition and personnel filters on this smaller array
  const filtered = rows.filter(r => {
    if (backendFilterKey) {
      const ok = r.PartitionNameFriendly === backendFilterKey ||
                 apacForwardKey[r.PartitionNameFriendly] === backendFilterKey;
      if (!ok) return false;
    }
    if (selectedPersonnel) {
      const pt = String(r.PersonnelType || '').toLowerCase();
      if (selectedPersonnel === 'Employee') {
        if (!(pt.includes('employee') || pt.includes('staff') || pt === 'employee')) return false;
      } else {
        if (!(pt.includes('contractor') || pt.includes('vendor') || pt.includes('subcontract') || pt.includes('cont'))) return false;
      }
    }
    return true;
  });

  // aggregate
  const map = new Map();
  filtered.forEach(r => {
    const city = formatPartition(r.PartitionNameFriendly || '');
    const disp = Object.values(apacPartitionDisplay).find(d => d.city === city);
    const country = disp?.country || 'Unknown';
    if (selectedSummaryPartition) {
      const [selCountry, selCity] = selectedSummaryPartition.split('||');
      if (country !== selCountry || city !== selCity) return;
    }
    const company = getCanonicalCompany(r);
    const key = `${country}||${city}||${company}`;
    const existing = map.get(key);
    if (existing) existing.total += 1;
    else map.set(key, { country, city, company, total: 1 });
  });

  return Array.from(map.values()).sort((a,b) => {
    if (a.country !== b.country) return a.country.localeCompare(b.country);
    if (a.city !== b.city) return a.city.localeCompare(b.city);
    return a.company.localeCompare(b.company);
  });
}, [indexByDate.detailMap, pickedDate, backendFilterKey, selectedPersonnel, selectedSummaryPartition]); // trimmed deps