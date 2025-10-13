const detailRows = useMemo(() => {
  if (!indexByDate.detailMap || !pickedDate || !showDetails) return [];
  const ds = format(pickedDate, 'yyyy-MM-dd');
  const rows = indexByDate.detailMap.get(ds) || [];

  return rows
    .filter(r => {
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
      if (selectedSummaryPartition) {
        const [selCountry, selCity] = (selectedSummaryPartition || '').split('||');
        const city = formatPartition(r.PartitionNameFriendly || '');
        const disp = Object.values(apacPartitionDisplay).find(d => d.city === city);
        const country = disp?.country || 'Unknown';
        if (country !== selCountry || city !== selCity) return false;
      }
      if (!selectedCompany) return true;
      const city = formatPartition(r.PartitionNameFriendly || '');
      const disp = Object.values(apacPartitionDisplay).find(d => d.city === city);
      const country = disp?.country || 'Unknown';
      const canonical = getCanonicalCompany(r);
      const rowKey = makeCompanyKey(country, city, canonical);
      return rowKey === selectedCompany;
    })
    .sort((a,b) => (a.LocaleMessageTime || '').localeCompare(b.LocaleMessageTime || ''));
}, [indexByDate.detailMap, pickedDate, showDetails, backendFilterKey, selectedCompany, selectedPersonnel, selectedSummaryPartition]);