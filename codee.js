<TableBody>
  {companyRows.length > 0 ? companyRows.map((r, i) => {
    const rowKey = makeCompanyKey(r.country, r.city, r.company);
    return (
      <TableRow
        key={`${r.company}-${i}`}
        onClick={() => {
          if (selectedCompany === rowKey) {
            setSelectedCompany(null);
            setShowDetails(true);
          } else {
            setSelectedCompany(rowKey);
            setShowDetails(true);
          }
        }}
        sx={{
          cursor: 'pointer',
          '&:hover': { backgroundColor: '#474747' },
          ...(selectedCompany === rowKey ? { backgroundColor: '#474747' } : {})
        }}
        tabIndex={0}
        role="button"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (selectedCompany === rowKey) {
              setSelectedCompany(null);
              setShowDetails(true);
            } else {
              setSelectedCompany(rowKey);
              setShowDetails(true);
            }
          }
        }}
      >
        <TableCell sx={{ border: '2px solid #000' }}>{r.country}</TableCell>
        {!selectedSummaryPartition && <TableCell sx={{ border: '2px solid #000' }}>{r.city}</TableCell>}
        <TableCell sx={{ border: '2px solid #000' }}>{r.company}</TableCell>
        <TableCell align="right" sx={{ bgcolor: '#FFC107', fontWeight: 'bold', border: '2px solid #000' }}>{r.total}</TableCell>
      </TableRow>
    );
  }) : (
    <TableRow>
      <TableCell colSpan={companyColSpan} sx={{ border: '2px solid #000', textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
        No records for this date.
      </TableCell>
    </TableRow>
  )}
  ...
</TableBody>