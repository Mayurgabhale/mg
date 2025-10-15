<Container maxWidth={false} disableGutters sx={{ pt: 2, pb: 4 }}>
  {/* Date & summary */}
  {pickedDate && summaryEntry ? (
    <Box
      display="flex"
      flexDirection="column"
      sx={{ px: 2, mb: 2, gap: 2 }}
    >
      {/* Date picker + Refresh */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        gap={2}
        sx={{ mb: 2 }}
      >
        <Box sx={{ width: { xs: '100%', sm: 200 } }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Select date"
              value={pickedDate}
              onChange={(d) => {
                setPickedDate(d);
                setShowDetails(false);
              }}
              renderInput={(params) => (
                <TextField fullWidth {...params} sx={datePickerSx} />
              )}
              maxDate={subDays(new Date())}
            />
          </LocalizationProvider>
          <Button
            variant="outlined"
            sx={{ mt: 2, borderColor: '#FFC107', color: '#FFC107', width: { xs: '100%', sm: 'auto' } }}
            onClick={async () => {
              const backendKey = backendFilterKey || 'all';
              clearHistoryCache(backendKey);
              setLoading(true);
              try {
                const fresh = await fetchHistory(decodedPartition);
                saveHistoryCache(backendKey, fresh);
                // build index
                const detailMap = new Map();
                (fresh.details || []).forEach((r) => {
                  const d =
                    (r.LocaleMessageTime && r.LocaleMessageTime.slice(0, 10)) ||
                    (r.SwipeDate && r.SwipeDate.slice(0, 10)) ||
                    'unknown';
                  if (!detailMap.has(d)) detailMap.set(d, []);
                  detailMap.get(d).push(r);
                });
                const summaryMap = new Map();
                (fresh.summaryByDate || []).forEach((s) =>
                  summaryMap.set((s.date || '').slice(0, 10), s)
                );
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
      </Box>

      {/* Tables side by side on md+, stacked on xs/sm */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          width: '100%',
          overflowX: 'auto',
        }}
      >
        {/* Left: Summary Table */}
        <Box sx={{ flex: 1, minWidth: 320 }}>
          <Paper elevation={3} sx={{ p: 3, border: '3px solid #000', borderRadius: 2 }}>
            <TableContainer sx={{ maxHeight: 500, overflowY: 'auto' }}>
              <Table stickyHeader size="small" sx={{ border: '2px solid #000' }}>
                {/* Table Head */}
                <TableHead>
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ fontWeight: 'bold', fontSize: 16, bgcolor: '#000', color: '#FFC107', border: '2px solid #000' }}
                    >
                      {format(pickedDate, 'EEEE, d MMMM, yyyy')}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: '#FFC107' }}>
                    {['Country', 'City', 'Employees', 'Contractors', 'Total'].map((h) => {
                      if (h === 'Employees' || h === 'Contractors') {
                        const personnelType = h === 'Employees' ? 'Employee' : 'Contractor';
                        const isActive = selectedPersonnel === personnelType && !selectedSummaryPartition;
                        return (
                          <TableCell
                            key={h}
                            align="right"
                            onClick={() => {
                              if (isActive) setSelectedPersonnel(null);
                              else {
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
                              '&:hover': { backgroundColor: isActive ? '#5a5a5a' : '#f2f2f2' },
                            }}
                          >
                            {h}
                          </TableCell>
                        );
                      }
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

                {/* Table Body */}
                <TableBody>
                  {partitionRows.map((r, i) => {
                    const rowKey = `${r.country}||${r.city}`;
                    return (
                      <TableRow
                        key={i}
                        onClick={() => {
                          setSelectedSummaryPartition(rowKey);
                          setSelectedCompany(null);
                          setSelectedPersonnel(null);
                          setShowDetails(true);
                        }}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: '#474747' },
                          ...(selectedSummaryPartition === rowKey ? { backgroundColor: '#474747' } : {}),
                        }}
                        tabIndex={0}
                        role="button"
                        onKeyDown={(e) => {
                          if (['Enter', ' '].includes(e.key)) {
                            e.preventDefault();
                            setSelectedSummaryPartition(selectedSummaryPartition === rowKey ? null : rowKey);
                            setShowDetails(true);
                          }
                        }}
                      >
                        <TableCell sx={{ border: '2px solid #000' }}>{r.country}</TableCell>
                        <TableCell sx={{ border: '2px solid #000' }}>{r.city}</TableCell>
                        <TableCell align="right" sx={{ border: '2px solid #000' }}>{r.employee}</TableCell>
                        <TableCell align="right" sx={{ border: '2px solid #000' }}>{r.contractor}</TableCell>
                        <TableCell align="right" sx={{ bgcolor: '#FFC107', fontWeight: 'bold', border: '2px solid #000' }}>{r.total}</TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow sx={{ bgcolor: '#666' }}>
                    <TableCell colSpan={2} align="right" sx={{ color: '#fff', fontWeight: 'bold', border: '2px solid #000' }}>Total</TableCell>
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

            <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
              <Button variant="contained" sx={{ bgcolor: '#FFC107', color: '#000' }} onClick={() => setShowDetails((v) => !v)}>
                {showDetails ? 'Hide Details' : 'See Details'}
              </Button>
              {showDetails && <Button variant="outlined" sx={{ borderColor: '#FFC107', color: '#FFC107' }} onClick={handleExport}>Export to Excel</Button>}
              <Button variant="contained" sx={{ bgcolor: '#FFC107', color: '#000' }} onClick={handleExportSummary}>Export Summary</Button>
              {selectedSummaryPartition && (
                <Button variant="outlined" sx={{ borderColor: '#090909', color: '#fff', bgcolor: '#f31408' }}
                  onClick={() => { setSelectedSummaryPartition(null); setSelectedCompany(null); setShowDetails(false); }}>
                  Clear city filter
                </Button>
              )}
            </Box>
          </Paper>
        </Box>

        {/* Right: Company Table */}
        <Box sx={{ flex: 1, minWidth: 320 }}>
          <Paper elevation={3} sx={{ p: 3, border: '3px solid #000', borderRadius: 2 }}>
            <TableContainer sx={{ maxHeight: 280, overflowY: 'auto' }}>
              <Table stickyHeader size="small" sx={{ border: '2px solid #000' }}>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ fontWeight: 'bold', fontSize: 16, bgcolor: '#000', color: '#FFC107', border: '2px solid #000' }}>
                      {format(pickedDate, 'EEEE, d MMMM, yyyy')}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: '#FFC107' }}>
                    {['Country','City','Company','Total'].map(h => (
                      <TableCell key={h} align={h==='Total'?'right':'left'} sx={{ fontWeight:'bold', fontSize:14, border:'2px solid #000' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {companyRows.length ? companyRows.map((r,i)=>{
                    const rowKey = makeCompanyKey(r.country,r.city,r.company);
                    return (
                      <TableRow key={i} onClick={()=>setSelectedCompany(selectedCompany===rowKey?null:rowKey)} sx={{ cursor:'pointer', '&:hover':{backgroundColor:'#474747'}, ...(selectedCompany===rowKey?{backgroundColor:'#474747'}:{})}} tabIndex={0} role="button">
                        <TableCell sx={{ border:'2px solid #000'}}>{r.country}</TableCell>
                        <TableCell sx={{ border:'2px solid #000'}}>{r.city}</TableCell>
                        <TableCell sx={{ border:'2px solid #000'}}>{r.company}</TableCell>
                        <TableCell align="right" sx={{ bgcolor:'#FFC107', fontWeight:'bold', border:'2px solid #000'}}>{r.total}</TableCell>
                      </TableRow>
                    )
                  }) : (
                    <TableRow><TableCell colSpan={4} sx={{ textAlign:'center', color:'#666', fontStyle:'italic', border:'2px solid #000' }}>No records for this date.</TableCell></TableRow>
                  )}
                  {companyRows.length>0 && <TableRow sx={{ bgcolor:'#666' }}>
                    <TableCell colSpan={3} align="right" sx={{ color:'#fff', fontWeight:'bold', border:'2px solid #000'}}>Total</TableCell>
                    <TableCell align="right" sx={{ color:'#fff', fontWeight:'bold', bgcolor:'#333', border:'2px solid #000'}}>{companyRows.reduce((s,r)=>s+r.total,0)}</TableCell>
                  </TableRow>}
                </TableBody>
              </Table>
            </TableContainer>
            <Box display="flex" justifyContent="center" flexWrap="wrap" sx={{ mt:1 }}>
              <Button variant="contained" sx={{ bgcolor:'#FFC107', color:'#000'}} onClick={handleExportCompanies}>Export Companies</Button>
            </Box>
          </Paper>
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

  {/* Details Table */}
  {showDetails && (
    <Box display="flex" justifyContent="center" mb={0} sx={{ width: '100%', px:2 }}>
      <Paper elevation={1} sx={{ p: 1, width: '100%', border: '3px solid #000', borderRadius: 2, overflowX:'auto' }}>
        {detailRows.length > 0 ? (
          <Table sx={{ border: '2px solid #000', borderCollapse: 'collapse', minWidth: 600 }} size='small'>
            <TableHead>
              <TableRow sx={{ bgcolor: '#000' }}>
                {['Sr', 'Date', 'Time', 'Employee ID', 'Card Number', 'Name', 'Personnel Type', 'CompanyName', 'PrimaryLocation', 'Door', 'Partition'].map(h=>(
                  <TableCell key={h} align="center" sx={{ color:'#FFC107', fontWeight:'bold', fontSize:14, border:'2px solid #000', whiteSpace:'nowrap' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {detailRows.map((r,i)=>(
                <TableRow key={`${r.PersonGUID}-${i}`}>
                  <TableCell sx={{ border:'2px solid #000', whiteSpace:'nowrap' }}>{i+1}</TableCell>
                  <TableCell sx={{ border:'2px solid #000' }}>{r.LocaleMessageTime.slice(0,10)}</TableCell>
                  <TableCell sx={{ border:'2px solid #000', whiteSpace:'nowrap' }}>{formatApiTime12(r.LocaleMessageTime)}</TableCell>
                  <TableCell sx={{ border:'2px solid #000' }}>{r.EmployeeID}</TableCell>
                  <TableCell sx={{ border:'2px solid #000' }}>{r.CardNumber}</TableCell>
                  <TableCell sx={{ border:'2px solid #000' }}>{r.ObjectName1}</TableCell>
                  <TableCell sx={{ border:'2px solid #000' }}>{r.PersonnelType}</TableCell>
                  <TableCell sx={{ border:'2px solid #000' }}>{r.CompanyName}</TableCell>
                  <TableCell sx={{ border:'2px solid #000' }}>{r.PrimaryLocation}</TableCell>
                  <TableCell sx={{ border:'2px solid #000' }}>{r.Door}</TableCell>
                  <TableCell sx={{ border:'2px solid #000' }}>{formatPartition(r.PartitionNameFriendly)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography variant="body2" sx={{ color:'#666', textAlign:'center', mt:2, fontStyle:'italic' }}>
            No swipe records found for this date.
          </Typography>
        )}
      </Paper>
    </Box>
  )}
</Container>