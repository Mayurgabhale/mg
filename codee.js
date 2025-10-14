dont change anything just i want this tabe in responsive ok
in tab and mobile one one table ok and laptop and destop as it is two table side by site ok carefully
return (
    <>
      <Header />
      <Box sx={{ pt: 1, pb: 1, background: "rgba(0,0,0,0.6)" }}>
        <Container disableGutters maxWidth={false}>

          {/* Back button + title */}
          <Box display="flex" alignItems="center" mb={2} sx={{ px: 2 }}>
            <Button size="small" onClick={() => navigate(-1)} sx={{ color: "#FFC107" }}>
              ← Back to Overview
            </Button>
          </Box>

          {/* Search + timestamp */}
          <Box display="flex" alignItems="center" gap={2} mb={2} sx={{ px: 2 }}>
            <Typography variant="h6" sx={{ color: "#FFC107" }}>
              Floor Details
            </Typography>
            <Typography variant="body2" sx={{ color: "#FFC107" }}>
              Last updated: {lastUpdate}
            </Typography>
            <TextField
              size="small"
              placeholder="Search floor / emp…"
              value={search}
              onChange={e => setSearchTerm(e.target.value)}
              sx={{
                "& .MuiInputBase-input": { color: "#FFC107" },
                "& .MuiOutlinedInput-root fieldset": { borderColor: "#FFC107" }
              }}
            />
          </Box>

          {/* Floor cards */}
          <Box display="flex" flexWrap="wrap" width="100%" sx={{ px: 2 }}>
            {displayed.map(([floor, emps]) => (
              <Box key={floor} sx={{ width: "50%", p: 2 }}>
                <Paper sx={{
                  border: "2px solid #FFC107",
                  p: 2,
                  background: "rgba(0,0,0,0.4)"
                }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    gutterBottom
                    sx={{ color: "#FFC107" }}
                  >
                    {floor} (Total {emps.length})
                  </Typography>

                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{ mb: 1, background: "rgba(0,0,0,0.4)" }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#000" }}>
                          {["Emp ID","Name","Swipe Time","Type","Card","Door"].map(h => (
                            <TableCell
                              key={h}
                              sx={{
                                color: "#FFC107",
                                border: "1px solid #FFC107",
                                fontWeight: "bold"
                              }}
                            >
                              {h}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {emps.slice(0, 10).map((r, i) => (
                          <TableRow key={i}>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>
                              {r.EmployeeID}
                            </TableCell>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>
                              {r.ObjectName1}
                            </TableCell>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>
                              {new Date(r.LocaleMessageTime).toLocaleTimeString()}
                            </TableCell>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>
                              {r.PersonnelType}
                            </TableCell>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>
                              {r.CardNumber}
                            </TableCell>
                            <TableCell sx={{ color: "#fff", border: "1px solid #FFC107" }}>
                              {r.Door}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Button
                    size="small"
                    onClick={() => setExpandedFloor(f => f === floor ? null : floor)}
                    sx={{ color: "#FFC107" }}
                  >
                    {expandedFloor === floor ? "Hide" : "See more…"}
                  </Button>
                </Paper>
              </Box>
            ))}
          </Box>

          {/* Expanded table */}
          {expandedFloor && (
            <Box sx={{ px: 2, mt: 2 }}>
              <Typography variant="h6" sx={{ color: "#FFC107" }} gutterBottom>
                {expandedFloor} — All Entries
              </Typography>
              <DataTable
                columns={columns}
                rows={floorMap[expandedFloor].map(r => ({
                  ...r,
                  LocaleMessageTime: new Date(r.LocaleMessageTime).toLocaleTimeString()
                }))}
              />
            </Box>
          )}

        </Container>
      </Box>
      <Footer />
    </>
  );
