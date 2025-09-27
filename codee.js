const asiaPacData = useMemo(() =>
  combinedRegions.map(r => ({
    name: displayNameMap[r.name] || r.name.replace(/^.*\./, ''),
    value: r.total,
    emp: r.Employee,
    cont: r.Contractor
  })),
  [combinedRegions]
);