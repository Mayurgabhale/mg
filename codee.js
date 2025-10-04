const chartData = useMemo(() => {
  return (companyData?.companies || []).map((c) => ({
    name: companyShortNames[c.name] || c.name,  // <-- short name
    podium: c.byBuilding["Podium Floor"] || 0,
    second: c.byBuilding["2nd Floor"] || 0,
    towerB: c.byBuilding["Tower B"] || 0,
    total: c.total || 0,
  }));
}, [companyData]);