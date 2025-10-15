i want this fully responsive for anywher device, 
  each device ok, opne this page any in any device to looking responive and clean ok 
  dont chagne anythinkg just create responive ok but careully, ok 
<Container maxWidth={false} disableGutters sx={{ pt: 2, pb: 4 }}>
        {/* ‣ Date & summary */}
        {pickedDate && summaryEntry ? (
          <Box display="flex" alignItems="flex-start" sx={{ px: 2, mb: 2, gap: 2 }}>

            <Box sx={{ width: 200 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>

                <DatePicker
                  label="Select date"
                  value={pickedDate}
                  onChange={d => { setPickedDate(d); setShowDetails(false); }}
                  renderInput={params => <TextField fullWidth {...params} sx={datePickerSx} />}
                  maxDate={subDays(new Date())}
                />

              </LocalizationProvider>
              <Button
                  variant="outlined"
                  sx={{ ml: 2, mt: 2, borderColor: '#FFC107', color: '#FFC107' }}
                  onClick={async () => {
                    const backendKey = backendFilterKey || 'all';
                    clearHistoryCache(backendKey);
                    setLoading(true);
                    try {
                      const fresh = await fetchHistory(decodedPartition);
                      saveHistoryCache(backendKey, fresh);
                      // build index
                      const detailMap = new Map();
                      (fresh.details || []).forEach(r => {
                        const d = (r.LocaleMessageTime && r.LocaleMessageTime.slice(0, 10))
                          || (r.SwipeDate && r.SwipeDate.slice(0, 10))
                          || 'unknown';
                        if (!detailMap.has(d)) detailMap.set(d, []);
                        detailMap.get(d).push(r);
                      });
                      const summaryMap = new Map();
                      (fresh.summaryByDate || []).forEach(s => summaryMap.set((s.date || '').slice(0, 10), s));
                      setData(fresh);
                      setIndexByDate({ detailMap, summaryMap });
                    } catch (err) {
                      console.error('Manual refresh failed', err);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  Refresh History
                </Button>
            </Box>

            {/* Container for both tables side-by-side */}
            <Box sx={{ display: 'flex', gap: 2, width: '100%', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
              {/* Left: existing summary table */}
              <Box sx={{ flex: 1, minWidth: 320 }}>
                <Paper elevation={3} sx={{ p: 3, border: '3px solid #000', borderRadius: 2 }}>
                  <TableContainer sx={{ maxHeight: 500, overflowY: 'auto' }}>
                    <Table sx={{ border: '2px solid #000' }} size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell colSpan={5} align="center"
                            sx={{ fontWeight: 'bold', fontSize: 16, bgcolor: '#000', color: '#FFC107', border: '2px solid #000' }}>
                            {format(pickedDate, 'EEEE, d MMMM, yyyy')}
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: '#FFC107' }}>
                          {['Country', 'City', 'Employees', 'Contractors', 'Total'].map(h => {
                            // clickable personnel headers
                            if (h === 'Employees' || h === 'Contractors') {
                              const personnelType = h === 'Employees' ? 'Employee' : 'Contractor';
                              const isActive = selectedPersonnel === personnelType && !selectedSummaryPartition;
                              return (
                                <TableCell
                                  key={h}
                                  align="right"
                                  onClick={() => {
                                    if (isActive) {
                                      setSelectedPersonnel(null);
                                    } else {
                                      setSelectedPersonnel(personnelType);
                                      setSelectedSummaryPartition(null);
                                      setSelectedCompany(null);
                                      setShowDetails(true);
                                    }
                                  }}
                                  sx={{
                                    color: isActive ? '#fff' : '#000',
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    border: '2px solid #000',
                                    cursor: 'pointer',
                                    textAlign: 'right',
                                    bgcolor: isActive ? '#474747' : '#FFC107',
                                    '&:hover': { backgroundColor: isActive ? '#5a5a5a' : '#f2f2f2' }
                                  }}
                                >
                                  {h}
                                </TableCell>
                              );
                            }
                            // non-clickable headers
                            return (
                              <TableCell
                                key={h}
                                align={['Country', 'City'].includes(h) ? 'left' : 'right'}
                                sx={{ color: '#000', fontWeight: 'bold', fontSize: 14, border: '2px solid #000' }}
                              >
                                {h}
                              </TableCell>
                            );
                          })}
                        </TableRow>

                      </TableHead>
                      <TableBody>

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


                        <TableRow sx={{ bgcolor: '#666' }}>
                          <TableCell colSpan={2} align="right" sx={{ color: '#fff', fontWeight: 'bold', border: '2px solid #000' }}>
                            Total
                          </TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold', border: '2px solid #000' }}>
                            {partitionRows.reduce((s, r) => s + r.employee, 0)}
                          </TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold', border: '2px solid #000' }}>
                            {partitionRows.reduce((s, r) => s + r.contractor, 0)}
                          </TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold', bgcolor: '#333', border: '2px solid #000' }}>
                            {partitionRows.reduce((s, r) => s + r.total, 0)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>

                <Box display="flex" justifyContent="center" sx={{ mt: 1 }}>
                  <Button variant="contained" sx={{ bgcolor: '#FFC107', color: '#000' }}
                    onClick={() => setShowDetails(v => !v)}>
                    {showDetails ? 'Hide Details' : 'See Details'}
                  </Button>
                  {showDetails && (
                    <Button variant="outlined" sx={{ ml: 2, borderColor: '#FFC107', color: '#FFC107' }}
                      onClick={handleExport}>
                      Export to Excel
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    sx={{ ml: 2, bgcolor: '#FFC107', color: '#000' }}
                    onClick={handleExportSummary}
                  >
                    Export Summary to Excel
                  </Button>
                  {selectedSummaryPartition && (
                    <Button
                      variant="outlined"
                      sx={{ ml: 2, borderColor: '#090909ff', color: '#060606ff', bgcolor: '#f31408ff' }}
                      onClick={() => { setSelectedSummaryPartition(null); setSelectedCompany(null); setShowDetails(false); }}
                    >
                      Clear city filter
                    </Button>
                  )}
                </Box>

                

              </Box>

              {/* Right: NEW company-level table (same style) */}
              <Box sx={{ flex: 1, minWidth: 320 }}>
                <Paper elevation={3} sx={{ p: 3, border: '3px solid #000', borderRadius: 2 }}>
                  <TableContainer sx={{ maxHeight: 280, overflowY: 'auto' }}>
                    <Table sx={{ border: '2px solid #000' }} size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            align="center"
                            sx={{
                              fontWeight: "bold",
                              fontSize: 16,
                              bgcolor: "#000",
                              color: "#FFC107",
                              border: "2px solid #000",
                            }}
                          >
                            {format(pickedDate, "EEEE, d MMMM, yyyy")}
                          </TableCell>
                        </TableRow>

                        <TableRow sx={{ bgcolor: "#FFC107" }}>
                          <TableCell
                            align="left"
                            sx={{
                              color: "#000",
                              fontWeight: "bold",
                              fontSize: 14,
                              border: "2px solid #000",
                            }}
                          >
                            Country
                          </TableCell>

                          <TableCell
                            align="left"
                            sx={{
                              color: "#000",
                              fontWeight: "bold",
                              fontSize: 14,
                              border: "2px solid #000",
                            }}
                          >
                            City
                          </TableCell>

                          <TableCell
                            align="left"
                            sx={{
                              color: "#000",
                              fontWeight: "bold",
                              fontSize: 14,
                              border: "2px solid #000",
                            }}
                          >
                            Company
                          </TableCell>

                          <TableCell
                            align="center"
                            sx={{
                              color: "#000",
                              fontWeight: "bold",
                              fontSize: 14,
                              border: "2px solid #000",
                            }}
                          >
                            Total
                          </TableCell>
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
                                <TableCell sx={{ border: "2px solid #000" }}>{r.city}</TableCell>
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
                              colSpan={4}
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

                        {/* ✅ Total Row */}
                        {companyRows.length > 0 && (
                          <TableRow sx={{ bgcolor: "#666" }}>
                            <TableCell
                              colSpan={3}
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


                </Box>

              </Box>
              
            </Box>

          </Box>
        ) : (
          <Box sx={{ px: 2, mb: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select date"
                value={pickedDate}
                onChange={d => { setPickedDate(d); setShowDetails(false); }}
                renderInput={params => <TextField fullWidth {...params} sx={datePickerSx} />}
                maxDate={subDays(new Date(), 1)}
              />

            </LocalizationProvider>
            {!pickedDate && (
              <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                Please pick a date to view region summary.
              </Typography>
            )}
          </Box>
        )}
        {/* ‣ Details */}
        {showDetails && (
          <Box display="flex" justifyContent="center" mb={0} sx={{ width: '100%' }}>
            <Paper elevation={1} sx={{ p: 1, width: '100%', border: '3px solid #000', borderRadius: 2 }}>
              {detailRows.length > 0 ? (

                <Table sx={{ border: '2px solid #000', borderCollapse: 'collapse' }} size='small'>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#000' }}>
                      {[
                        'Sr', 'Date', 'Time',
                        'Employee ID', 'Card Number', 'Name', 'Personnel Type', 'CompanyName', 'PrimaryLocation',
                        'Door', 'Partition'
                      ].map(h => (
                        <TableCell key={h} align="center"
                          sx={{ color: '#FFC107', fontWeight: 'bold', fontSize: 14, border: '2px solid #000' }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detailRows.map((r, i) => (
                      <TableRow key={`${r.PersonGUID}-${i}`}>
                        <TableCell sx={{ border: '2px solid #000', whiteSpace: 'nowrap' }}>{i + 1}</TableCell>
                        <TableCell sx={{ border: '2px solid #000' }}>{r.LocaleMessageTime.slice(0, 10)}</TableCell>
                        <TableCell sx={{ border: '2px solid #000', whiteSpace: 'nowrap' }}>
                          {formatApiTime12(r.LocaleMessageTime)}
                        </TableCell>
                        <TableCell sx={{ border: '2px solid #000' }}>{r.EmployeeID}</TableCell>
                        <TableCell sx={{ border: '2px solid #000' }}>{r.CardNumber}</TableCell>
                        <TableCell sx={{ border: '2px solid #000' }}>{r.ObjectName1}</TableCell>
                        <TableCell sx={{ border: '2px solid #000' }}>{r.PersonnelType}</TableCell>
                        <TableCell sx={{ border: '2px solid #000' }}>{r.CompanyName}</TableCell>
                        <TableCell sx={{ border: '2px solid #000' }}>{r.PrimaryLocation}</TableCell>
                        <TableCell sx={{ border: '2px solid #000' }}>{r.Door}</TableCell>
                        <TableCell sx={{ border: '2px solid #000' }}>
                          {formatPartition(r.PartitionNameFriendly)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', mt: 2, fontStyle: 'italic' }}>
                  No swipe records found for this date.
                </Typography>
              )}
            </Paper>
          </Box>
        )}
      </Container>
