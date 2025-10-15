return (
  <>
    <Header />
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 2 },
      }}
    >
      {/* Back button */}
      <Box mb={1}>
        <Button
          size="small"
          onClick={() => navigate(-1)}
          sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
        >
          ← Back to Overview
        </Button>
      </Box>

      {/* Title + Search */}
      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
        mb={2}
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
          }}
        >
          Floor Details
        </Typography>

        <TextField
          size="small"
          placeholder="Search floor / emp…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            ml: { xs: 0, sm: 1 },
            mt: { xs: 1, sm: 0 },
            width: { xs: '100%', sm: 'auto' },
            flexGrow: { xs: 1, sm: 0 },
          }}
        />
      </Box>

      {/* Floor Cards Container */}
      <Box display="flex" flexWrap="wrap">
        {[...displayed]
          .sort((a, b) => b[1].length - a[1].length)
          .map(([floor, emps]) => {
            const isExpanded = expanded === floor;
            const visibleEmps = isExpanded ? emps : emps.slice(0, 10);

            return (
              <Box
                key={floor}
                sx={{
                  width: {
                    xs: '100%', // Mobile
                    sm: '50%', // Tablet
                    md: '33.33%', // Medium screens
                    lg: '25%', // Large screens
                    xl: '20%', // Extra wide
                  },
                  p: { xs: 0.5, sm: 1 },
                  boxSizing: 'border-box',
                }}
              >
                {/* Header Row */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                  flexWrap="wrap"
                  sx={{
                    gap: { xs: 1, sm: 0 },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    }}
                  >
                    {floor} (Total {emps.length})
                  </Typography>

                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      py: { xs: 0.3, sm: 0.4 },
                      px: { xs: 1, sm: 1.2 },
                    }}
                    onClick={() => exportToExcel(floor, emps)}
                  >
                    Export
                  </Button>
                </Box>

                {/* Table Card */}
                <Box
                  sx={{
                    border: '2px solid #FFC107',
                    borderRadius: 1,
                    p: { xs: 0.5, sm: 1 },
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 120,
                    maxHeight: isExpanded ? 600 : 'auto',
                    backgroundColor: '#fff',
                    overflow: 'hidden',
                  }}
                >
                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{
                      overflowX: 'auto',
                      overflowY: 'auto',
                      flexGrow: 1,
                    }}
                  >
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          {[
                            'ID',
                            'Name',
                            'Time',
                            'Type',
                            'CompanyName',
                            'Card',
                            'Door',
                          ].map((h, idx, arr) => (
                            <TableCell
                              key={h}
                              sx={{
                                fontWeight: 'bold',
                                py: 0.5,
                                whiteSpace: 'nowrap',
                                borderRight:
                                  idx !== arr.length - 1
                                    ? '1px solid #ccc'
                                    : 'none',
                                borderBottom: '1px solid #ccc',
                                fontSize: { xs: '0.75rem', sm: '0.85rem' },
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
                                  minWidth: [
                                    60, 120, 100, 80, 100, 100, 100,
                                  ][idx],
                                  whiteSpace: 'nowrap',
                                  borderRight:
                                    idx !== arr.length - 1
                                      ? '1px solid #eee'
                                      : 'none',
                                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
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
                        sx={{
                          fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        }}
                        onClick={() =>
                          setExpanded(isExpanded ? null : floor)
                        }
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

      {/* Expanded Data Table */}
      {expanded && (
        <Box mt={2}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontSize: { xs: '1rem', sm: '1.2rem' },
            }}
          >
            {expanded} — All Entries
          </Typography>

          <Box sx={{ overflowX: 'auto' }}>
            <DataTable
              columns={[
                { field: 'SrNo', headerName: 'Sr No' },
                { field: 'EmployeeID', headerName: 'ID' },
                { field: 'ObjectName1', headerName: 'Name' },
                { field: 'LocaleMessageTime', headerName: 'Time' },
                { field: 'PersonnelType', headerName: 'Type' },
                { field: 'CompanyName', headerName: 'CompanyName' },
                { field: 'CardNumber', headerName: 'Card' },
                { field: 'Door', headerName: 'Door' },
              ]}
              rows={floorMap[expanded].map((r, i) => ({
                ...r,
                LocaleMessageTime: formatApiTime12(r.LocaleMessageTime),
                SrNo: i + 1,
              }))}
            />
          </Box>
        </Box>
      )}
    </Container>
    <Footer />
  </>
);