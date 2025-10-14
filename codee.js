const partitions = useMemo(() => {
  return partitionList
    .map(name => {
      // collect all region keys that belong to this partition (e.g. all "IN.Pune.*")
      const matchingKeys = Object.keys(regions).filter(k => k.includes(name));

      // merge totals and floors across all matching keys
      let total = 0, Employee = 0, Contractor = 0;
      const mergedFloors = {};

      matchingKeys.forEach(k => {
        const r = regions[k];
        if (!r) return;
        total += r.total || 0;
        Employee += r.Employee || 0;
        Contractor += r.Contractor || 0;
        Object.entries(r.floors || {}).forEach(([f, c]) => {
          mergedFloors[f] = (mergedFloors[f] || 0) + c;
        });
      });

      return {
        name,
        total,
        Employee,
        Contractor,
        floors: mergedFloors,
        flag: flagMap[name] || null
      };
    })
    .sort((a, b) => b.total - a.total);
}, [regions]);