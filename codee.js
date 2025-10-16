not correct responive in desktop and laptop this side by side table diplsy very samll, increase ther widht,
  this in desktop and labotp disply very small and dipsly one side, 
  so correct this and correct responvie for each and evry devices ok 
   return (
    <>
      <Header />
      <Box sx={{ pt: 1, pb: 1, background: 'rgba(0,0,0,0.6)' }}>
        <Container disableGutters maxWidth={false}>
          {/* Top controls */}
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" mb={2} sx={{ px: 2 }}>
            <Button size="small" onClick={() => navigate(-1)} sx={{ color: '#FFC107', mb: { xs: 1, sm: 0 } }}>
              ← Back to Overview
            </Button>
            <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Typography variant="h6" sx={{ color: '#FFC107' }}>Floor Details</Typography>
              <Typography variant="body2" sx={{ color: '#FFC107' }}>Last updated: {lastUpdate}</Typography>
              <TextField
                size="small"
                placeholder="Search…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                sx={{
                  '& .MuiInputBase-input': { color: '#FFC107' },
                  '& .MuiOutlinedInput-root fieldset': { borderColor: '#FFC107' },
                  minWidth: { xs: '100%', sm: 200 }
                }}
              />
            </Box>
          </Box>

          {loading ? <Box sx={{ px: 2, py: 8 }}><LoadingSpinner /></Box> : (
            <>
              {/* Floor cards */}
              <Box display="flex" flexWrap="wrap" width="100%" sx={{ px: 2   }}>
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
                    <Box key={floor} sx={{
                      width: { xs: '100%', sm: '48%', md: '32%' },
                      p: 1
                    }}>
                      <Paper sx={{ border: '2px solid #FFC107', p: 1.5, background: 'rgba(0,0,0,0.4)' }}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#FFC107', mb: 1 }}>
                          {floor} (Total {liveCounts[floor] || 0})
                        </Typography>
                        {/* Scrollable Table */}
                        <Box sx={{ overflowX: 'auto' }}>
                          <TableContainer component={Paper} variant="outlined" sx={{ mb: 1, background: 'rgba(0,0,0,0.4)' }}>
                            <Table size="small">
                              <TableHead>
                                <TableRow sx={{ bgcolor: '#000' }}>
                                  {columns.map(c => (
                                    <TableCell key={c.field}
                                      sx={{ color: '#FFC107', fontWeight: 'bold', border: '1px solid #FFC107' }}
                                    >{c.headerName}</TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {preview.map((r, i) => (
                                  <TableRow key={`${r.PersonGUID}-${i}`}
                                    sx={showAll ? { background: 'rgba(255,235,59,0.3)' } : {}}>
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
                        <Button size="small" sx={{ color: '#FFC107' }}
                          onClick={() => setExpandedFloor(f => f === floor ? null : floor)}>
                          {expandedFloor === floor ? 'Hide' : 'See more…'}
                        </Button>
                      </Paper>
                    </Box>
                  );
                })}
              </Box>

              {/* Expanded Floor Table */}
              {expandedFloor && (
                <Box sx={{ px: 2, mt: 2 }}>
                  <Typography variant="h6" sx={{ color: '#FFC107' }} gutterBottom>
                    {expandedFloor} — All Entries
                  </Typography>
                  <Box sx={{ overflowX: 'auto' }}>
                    <DataTable
                      columns={columns}
                      rows={(floorMap[expandedFloor] || []).map(r => ({
                        ...r,
                        LocaleMessageTime: formatApiTime12(r.LocaleMessageTime, r.Swipe_Time)
                      }))}
                    />
                  </Box>
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
