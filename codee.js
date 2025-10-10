{partitionRows.map((r, i) => {
  const rowKey = `${r.country}||${r.city}`;
  return (
    <TableRow
      key={i}
      onClick={() => {
        // set city filter when a partition is clicked
        setSelectedSummaryPartition(rowKey);
        setSelectedCompany(null);
        setSelectedPersonnel(null);
        setShowDetails(true);
      }}
      sx={{
        cursor: 'pointer',
        '&:hover': { backgroundColor: '#474747' },
        ...(selectedSummaryPartition === rowKey ? { backgroundColor: '#474747' } : {})
      }}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (selectedSummaryPartition === rowKey) {
            setSelectedSummaryPartition(null);
            setShowDetails(true);
          } else {
            setSelectedSummaryPartition(rowKey);
            setShowDetails(true);
          }
        }
      }}
    >
      <TableCell sx={{ border: '2px solid #000' }}>{r.country}</TableCell>
      <TableCell sx={{ border: '2px solid #000' }}>{r.city}</TableCell>
      <TableCell align="right" sx={{ border: '2px solid #000' }}>{r.employee}</TableCell>
      <TableCell align="right" sx={{ border: '2px solid #000' }}>{r.contractor}</TableCell>
      <TableCell align="right" sx={{ bgcolor: '#FFC107', fontWeight: 'bold', border: '2px solid #000' }}>
        {r.total}
      </TableCell>
    </TableRow>
  );
})}