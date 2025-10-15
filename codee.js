create this responsive for each device and screen size ok carefully
 return (
    <>
      <Header />
      <Container maxWidth={false} disableGutters sx={{ px: 2, py: 2 }}>
        <Box mb={1}><Button size="small" onClick={() => navigate(-1)}>← Back to Overview</Button></Box>
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={0.5} mb={2}>
          {/* Title */}
          <Typography variant="h6">Floor Details</Typography>

          {/* Search field */}
          <TextField
            size="small"
            placeholder="Search floor / emp…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ ml: 1 }}
          />
        </Box>

        <Box display="flex" flexWrap="wrap">
          {[...displayed]
            .sort((a, b) => b[1].length - a[1].length) // Priority: most rows first
            .map(([floor, emps]) => {
              const isExpanded = expanded === floor;
              const visibleEmps = isExpanded ? emps : emps.slice(0, 10);

              return (
                <Box
                  key={floor}
                  sx={{
                    width: { xs: '100%', sm: '50%' },
                    p: 1,
                    boxSizing: 'border-box',
                  }}
                >
                  {/* Title + Export aligned in one row */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {floor} (Total {emps.length})
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => exportToExcel(floor, emps)}
                    >
                      Export
                    </Button>
                  </Box>
                  {/* Smart height layout */}
                  <Box
                    sx={{
                      border: '2px solid #FFC107',
                      borderRadius: 1,
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: 120,
                      maxHeight: isExpanded ? 600 : 'auto',
                    }}
                  >
                    <TableContainer
                      component={Paper}
                      variant="outlined"
                      sx={{
                        overflowY: 'auto',
                        flexGrow: 1,
                      }}
                    >
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            {['ID', 'Name', 'Time', 'Type', 'CompanyName', 'Card', 'Door'].map((h, idx, arr) => (
                              <TableCell
                                key={h}
                                sx={{
                                  fontWeight: 'bold',
                                  py: 0.5,
                                  whiteSpace: 'nowrap',
                                  borderRight: idx !== arr.length - 1 ? '1px solid #ccc' : 'none',
                                  borderBottom: '1px solid #ccc',
                                }}
                              >
                                {h}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {visibleEmps.map((r, i) => (
                            <TableRow key={i}>
                              {[
                                r.EmployeeID,
                                r.ObjectName1,
                                formatApiTime12(r.LocaleMessageTime),
                                r.PersonnelType,
                                r.CompanyName,
                                r.CardNumber,
                                r.Door,
                              ].map((val, idx, arr) => (
                                <TableCell
                                  key={idx}
                                  sx={{
                                    py: 0.5,
                                    minWidth: [50, 120, 100, 80, 100, 100][idx],
                                    whiteSpace: 'nowrap',
                                    borderRight: idx !== arr.length - 1 ? '1px solid #eee' : 'none',
                                  }}
                                >
                                  {val}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {emps.length > 10 && (
                      <Box textAlign="right" mt={1}>
                        <Button
                          size="small"
                          onClick={() => setExpanded(isExpanded ? null : floor)}
                        >
                          {isExpanded ? 'Hide' : 'See more…'}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
        </Box>
        {expanded && (
            <Box mt={2}>
              <Typography variant="h6" gutterBottom>{expanded} — All Entries</Typography>
              <DataTable
                columns={[
                  { field: 'SrNo', headerName: 'Sr No' },               
                  { field: 'EmployeeID', headerName: 'ID' },
                  { field: 'ObjectName1', headerName: 'Name' },
                  { field: 'LocaleMessageTime', headerName: 'Time' },
                  { field: 'PersonnelType', headerName: 'Type' },
                  { field: 'CompanyName', headerName: 'CompanyName' },
                  { field: 'CardNumber', headerName: 'Card' },
                  { field: 'Door', headerName: 'Door' }
                ]}
                rows={floorMap[expanded].map((r, i) => ({
                  ...r,
                  LocaleMessageTime:      formatApiTime12(r.LocaleMessageTime),
                  SrNo: i + 1                                      
                }))}
              />
            </Box>
          )
        }
      </Container >
      <Footer />
    </>
  );
