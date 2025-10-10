when i filte city that time 
in this comnay table city column not disply.    
Thursday, 9 October, 2025
Country	City	Company	Total
India	CBRE	7
India	CLR Facility Services Pvt.Ltd.	26
India	Osource India Pvt Ltd	4
India	Poona Security India Pvt Ltd	31
India	Tea Point	1
India	Temp Badge	5
India	Vedant Enterprises Pvt. Ltd	4
India	Visitor	28
India	Western Union	507
Total	613

 {/* Right: NEW company-level table (same style) */}
              <Box sx={{ flex: 1, minWidth: 320 }}>
                <Paper elevation={3} sx={{ p: 3, border: '3px solid #000', borderRadius: 2 }}>
                  <TableContainer sx={{ maxHeight: 280, overflowY: 'auto' }}>
                    <Table sx={{ border: '2px solid #000' }} size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell colSpan={4} align="center"
                            sx={{ fontWeight: 'bold', fontSize: 16, bgcolor: '#000', color: '#FFC107', border: '2px solid #000' }}>
                            {format(pickedDate, 'EEEE, d MMMM, yyyy')}
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: '#FFC107' }}>
                          {['Country', 'City', 'Company', 'Total'].map(h => (
                            <TableCell key={h} align={h === 'Country' || h === 'City' ? 'left' : 'center'}
                              sx={{ color: '#000', fontWeight: 'bold', fontSize: 14, border: '2px solid #000' }}>
                              {h}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>


                      <TableBody>
                        {companyRows.length > 0 ? (
                          companyRows.map((r, i) => {
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
                                  cursor: "pointer",
                                  "&:hover": { backgroundColor: "#474747" },
                                  ...(selectedCompany === rowKey
                                    ? { backgroundColor: "#474747" }
                                    : {}),
                                }}
                                tabIndex={0}
                                role="button"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
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
                                <TableCell sx={{ border: "2px solid #000" }}>{r.country}</TableCell>
                                {!selectedSummaryPartition && (
                                  <TableCell sx={{ border: "2px solid #000" }}>{r.city}</TableCell>
                                )}
                                <TableCell sx={{ border: "2px solid #000" }}>{r.company}</TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    bgcolor: "#FFC107",
                                    fontWeight: "bold",
                                    border: "2px solid #000",
                                  }}
                                >
                                  {r.total}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={companyColSpan}
                              sx={{
                                border: "2px solid #000",
                                textAlign: "center",
                                color: "#666",
                                fontStyle: "italic",
                              }}
                            >
                              No records for this date.
                            </TableCell>
                          </TableRow>
                        )}

                        {/* ✅ Clean Total Row */}
                        {companyRows.length > 0 && (
                          <TableRow sx={{ bgcolor: "#666" }}>
                            {/* If city filter applied → only 2 columns: Country + Company + Total */}
                            <TableCell
                              colSpan={selectedSummaryPartition ? 2 : 3}
                              align="right"
                              sx={{
                                color: "#fff",
                                fontWeight: "bold",
                                border: "2px solid #000",
                                fontSize: 15,
                              }}
                            >
                              Total
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                color: "#fff",
                                fontWeight: "bold",
                                bgcolor: "#333",
                                border: "2px solid #000",
                                fontSize: 15,
                              }}
                            >
                              {companyRows.reduce((s, r) => s + r.total, 0)}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>

                    </Table>
                  </TableContainer>
                </Paper>

                

                <Box display="flex" justifyContent="center" sx={{ mt: 1 }}>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: '#FFC107', color: '#000' }}
                    onClick={handleExportCompanies}
                  >
                    Export Companies to Excel
                  </Button>

                  {selectedSummaryPartition && (
                    <Button
                      variant="outlined"
                      sx={{ ml: 2, borderColor: '#FFC107', color: '#FFC107' }}
                      onClick={() => { setSelectedSummaryPartition(null); setSelectedCompany(null); setShowDetails(false); }}
                    >
                      Clear city filter
                    </Button>
                  )}
                </Box>

              </Box>
