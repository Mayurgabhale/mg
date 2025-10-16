first in table diplsy only 10 rows/ records afte 10 see more diplsy, ok 
and clikc on see mor i want to pop up table like i give in below chekc this like that table desing ok ..
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

                        {/* Right-aligned See More button */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                          <Button
                            size="small"
                            sx={{ color: '#FFC107' }}
                            onClick={() => setExpandedFloor(f => f === floor ? null : floor)}
                          >
                            {expandedFloor === floor ? 'Hide' : 'See more…'}
                          </Button>
                        </Box>
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

for pop pu adutop this deisn ok 

 {/* ✅ Popup Modal */}
        <Dialog
          open={Boolean(expanded)}
          onClose={() => setExpanded(null)}
          maxWidth="lg"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              width: "100%",
              maxWidth: { xs: "95%", sm: "90%", md: "85%", lg: "80%" }, // responsive width
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
            }}
          >
            {expanded} — All Entries
          </DialogTitle>

          <DialogContent
            sx={{
              overflowX: "auto",
              p: { xs: 1, sm: 2 },
            }}
          >
            {expanded && (
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{
                  border: "2px solid #FFC107",
                  borderRadius: 2,
                  overflowX: "auto",
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <Table
                  size="small"
                  stickyHeader
                  sx={{
                    borderCollapse: "collapse",
                    width: "100%",
                    "& th, & td": {
                      borderRight: "1px solid #ddd",
                      borderBottom: "1px solid #ddd",
                      textAlign: "left",
                      px: { xs: 0.5, sm: 1 },
                      py: { xs: 0.6, sm: 0.8 },
                      fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.9rem" },
                      whiteSpace: "nowrap",
                    },
                    "& th:last-child, & td:last-child": {
                      borderRight: "none",
                    },
                    "& thead th": {
                      backgroundColor: "#e7b40cff",
                      fontWeight: "bold",
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {floorMap[expanded]?.map((r, i) => (
                      <TableRow
                        key={i}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#3b3b39ff",
                          },
                        }}
                      >
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: "center",
              py: { xs: 1, sm: 1.5 },
            }}
          >
            <Button
              variant="contained"
              color="warning"
              onClick={() => setExpanded(null)}
              sx={{
                px: { xs: 2, sm: 3 },
                py: { xs: 0.7, sm: 0.9 },
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
