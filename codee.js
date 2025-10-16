<Box display="flex" flexWrap="wrap" justifyContent="center" width="100%" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
  {displayed.map(([floor, emps]) => {
    const showAll = !!term;
    const preview = showAll
      ? emps.filter(r =>
          String(r.EmployeeID).toLowerCase().includes(term) ||
          String(r.ObjectName1).toLowerCase().includes(term) ||
          String(r.CardNumber).toLowerCase().includes(term)
        )
      : emps.slice(0, 15);

    return (
      <Box
        key={floor}
        sx={{
          flex: { xs: '1 1 100%', sm: '1 1 48%', md: '1 1 48%', lg: '1 1 48%' }, // max 2 side-by-side
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <Paper
          sx={{
            border: '2px solid #FFC107',
            p: 2,
            background: 'rgba(0,0,0,0.4)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#FFC107', mb: 1 }}>
            {floor} (Total {liveCounts[floor] || 0})
          </Typography>

          {/* Scrollable Table */}
          <Box sx={{ overflowX: 'auto', flexGrow: 1 }}>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 1, background: 'rgba(0,0,0,0.4)' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#000' }}>
                    {columns.map(c => (
                      <TableCell
                        key={c.field}
                        sx={{ color: '#FFC107', fontWeight: 'bold', border: '1px solid #FFC107', minWidth: 80 }}
                      >
                        {c.headerName}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {preview.map((r, i) => (
                    <TableRow key={`${r.PersonGUID}-${i}`} sx={showAll ? { background: 'rgba(255,235,59,0.3)' } : {}}>
                      <TableCell sx={{ color: '#fff', border: '1px solid #FFC107' }}>{r.EmployeeID}</TableCell>
                      <TableCell sx={{ color: '#fff', border: '1px solid #FFC107' }}>{r.ObjectName1}</TableCell>
                      <TableCell sx={{ color: '#fff', border: '1px solid #FFC107' }}>
                        {formatApiTime12(r.LocaleMessageTime, r.Swipe_Time)}
                      </TableCell>
                      <TableCell sx={{ color: '#fff', border: '1px solid #FFC107' }}>{r.PersonnelType}</TableCell>
                      <TableCell sx={{ color: '#fff', border: '1px solid #FFC107' }}>{r.CardNumber}</TableCell>
                      <TableCell sx={{ color: '#fff', border: '1px solid #FFC107' }}>{r.Door}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Button
            size="small"
            sx={{ color: '#FFC107', mt: 1 }}
            onClick={() => setExpandedFloor(f => f === floor ? null : floor)}
          >
            {expandedFloor === floor ? 'Hide' : 'See more…'}
          </Button>
        </Paper>
      </Box>
    );
  })}
</Box>