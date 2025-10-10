// decide if we should hide City column (when summary partition is set)
const companyColSpan = selectedSummaryPartition ? 3 : 4;

...

<TableHead>
  <TableRow>
    <TableCell colSpan={companyColSpan} align="center"
      sx={{ fontWeight: 'bold', fontSize: 16, bgcolor: '#000', color: '#FFC107', border: '2px solid #000' }}>
      {format(pickedDate, 'EEEE, d MMMM, yyyy')}
    </TableCell>
  </TableRow>
  <TableRow sx={{ bgcolor: '#FFC107' }}>
    <TableCell align="left" sx={{ color: '#000', fontWeight: 'bold', fontSize: 14, border: '2px solid #000' }}>Country</TableCell>
    {/* hide City column if selectedSummaryPartition */}
    {!selectedSummaryPartition && (
      <TableCell align="left" sx={{ color: '#000', fontWeight: 'bold', fontSize: 14, border: '2px solid #000' }}>City</TableCell>
    )}
    <TableCell align="left" sx={{ color: '#000', fontWeight: 'bold', fontSize: 14, border: '2px solid #000' }}>Company</TableCell>
    <TableCell align="center" sx={{ color: '#000', fontWeight: 'bold', fontSize: 14, border: '2px solid #000' }}>Total</TableCell>
  </TableRow>
</TableHead>