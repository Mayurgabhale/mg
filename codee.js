  // Derived: filtered & paginated rows for display in the details table
      const filteredAll = useMemo(() => getFilteredDetailsAll(), [detailsRows, columnFilters]);
      const paginatedRows = useMemo(() => {
        const start = Math.max(0, detailsOffset || 0);
        const lim = Math.max(1, detailsLimit || 200);
        return filteredAll.slice(start, start + lim);
      }, [filteredAll, detailsOffset, detailsLimit]);
