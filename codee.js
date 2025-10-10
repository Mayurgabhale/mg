const companyRows = useMemo(() => {
  if (!data || !pickedDate) return [];

  const ds = format(pickedDate, 'yyyy-MM-dd');

  // filter details for the date + optional partition filter + personnel filter
  const filtered = data.details.filter(r => {
    if (!r.LocaleMessageTime || r.LocaleMessageTime.slice(0, 10) !== ds) return false;
    if (backendFilterKey) {
      const ok = r.PartitionNameFriendly === backendFilterKey ||
        apacForwardKey[r.PartitionNameFriendly] === backendFilterKey;
      if (!ok) return false;
    }
    if (selectedPersonnel) {
      const pt = String(r.PersonnelType || '').toLowerCase();
      if (selectedPersonnel === 'Employee') {
        if (!(pt.includes('employee') || pt.includes('staff') || pt === 'employee')) return false;
      } else if (selectedPersonnel === 'Contractor') {
        if (!(pt.includes('contractor') || pt.includes('vendor') || pt.includes('subcontract') || pt.includes('cont'))) return false;
      }
    }
    return true;
  });

  // aggregate into map: key = country||city||normalizedCompany
  const map = new Map();

  filtered.forEach(r => {
    const city = formatPartition(r.PartitionNameFriendly || '');
    const disp = Object.values(apacPartitionDisplay).find(d => d.city === city);
    const country = disp?.country || 'Unknown';

    // If a summary-partition (city) is selected, skip other cities
    if (selectedSummaryPartition) {
      const [selCountry, selCity] = selectedSummaryPartition.split('||');
      if (country !== selCountry || city !== selCity) return; // skip this row
    }

    const company = getCanonicalCompany(r);
    const key = `${country}||${city}||${company}`;
    const existing = map.get(key);
    if (existing) {
      existing.total += 1;
    } else {
      map.set(key, { country, city, company, total: 1 });
    }
  });

  return Array.from(map.values()).sort((a, b) => {
    if (a.country !== b.country) return a.country.localeCompare(b.country);
    if (a.city !== b.city) return a.city.localeCompare(b.city);
    return a.company.localeCompare(b.company);
  });
}, [data, pickedDate, backendFilterKey, selectedPersonnel, selectedSummaryPartition]);