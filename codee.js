import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { format } from 'date-fns';

<Box
  sx={{
    display: 'flex',
    gap: 2,
    width: '100%',
    flexWrap: { xs: 'wrap', md: 'nowrap' },
    overflowX: 'auto', // ensures horizontal scroll if needed
  }}
>
  {/* Left: Summary Table */}
  <Box sx={{ flex: 1, minWidth: 320 }}>
    <Paper elevation={3} sx={{ p: 2, border: '3px solid #000', borderRadius: 2 }}>
      <TableContainer sx={{ maxHeight: 500, overflowY: 'auto' }}>
        <Table stickyHeader size="small" sx={{ border: '2px solid #000' }}>
          <TableHead>
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{
                fontWeight: 'bold',
                fontSize: 16,
                bgcolor: '#000',
                color: '#FFC107',
                border: '2px solid #000'
              }}>
                {format(pickedDate, 'EEEE, d MMMM, yyyy')}
              </TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: '#FFC107' }}>
              {['Country', 'City', 'Employees', 'Contractors', 'Total'].map((h) => (
                <TableCell
                  key={h}
                  align={['Country', 'City'].includes(h) ? 'left' : 'right'}
                  sx={{
                    fontWeight: 'bold',
                    fontSize: 14,
                    border: '2px solid #000',
                    cursor: ['Employees', 'Contractors'].includes(h) ? 'pointer' : 'default',
                    bgcolor: selectedPersonnel === h ? '#474747' : '#FFC107',
                    color: ['Employees', 'Contractors'].includes(h) && selectedPersonnel === h ? '#fff' : '#000',
                    '&:hover': { backgroundColor: ['Employees', 'Contractors'].includes(h) ? '#f2f2f2' : undefined }
                  }}
                  onClick={() => {
                    if (['Employees', 'Contractors'].includes(h)) {
                      const type = h === 'Employees' ? 'Employee' : 'Contractor';
                      if (selectedPersonnel === type) setSelectedPersonnel(null);
                      else {
                        setSelectedPersonnel(type);
                        setSelectedSummaryPartition(null);
                        setSelectedCompany(null);
                        setShowDetails(true);
                      }
                    }
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {partitionRows.map((r, i) => {
              const rowKey = `${r.country}||${r.city}`;
              return (
                <TableRow
                  key={i}
                  onClick={() => { setSelectedSummaryPartition(rowKey); setSelectedCompany(null); setSelectedPersonnel(null); setShowDetails(true); }}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#474747' },
                    ...(selectedSummaryPartition === rowKey ? { backgroundColor: '#474747' } : {})
                  }}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => { if (['Enter',' '].includes(e.key)) { e.preventDefault(); setSelectedSummaryPartition(selectedSummaryPartition === rowKey ? null : rowKey); setShowDetails(true); } }}
                >
                  <TableCell sx={{ border: '2px solid #000' }}>{r.country}</TableCell>
                  <TableCell sx={{ border: '2px solid #000' }}>{r.city}</TableCell>
                  <TableCell align="right" sx={{ border: '2px solid #000' }}>{r.employee}</TableCell>
                  <TableCell align="right" sx={{ border: '2px solid #000' }}>{r.contractor}</TableCell>
                  <TableCell align="right" sx={{ bgcolor: '#FFC107', fontWeight: 'bold', border: '2px solid #000' }}>{r.total}</TableCell>
                </TableRow>
              );
            })}
            {/* Total Row */}
            <TableRow sx={{ bgcolor: '#666' }}>
              <TableCell colSpan={2} align="right" sx={{ color: '#fff', fontWeight: 'bold', border: '2px solid #000' }}>Total</TableCell>
              <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold', border: '2px solid #000' }}>{partitionRows.reduce((s,r)=>s+r.employee,0)}</TableCell>
              <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold', border: '2px solid #000' }}>{partitionRows.reduce((s,r)=>s+r.contractor,0)}</TableCell>
              <TableCell align="right" sx={{ color: '#fff', fontWeight: 'bold', bgcolor:'#333', border: '2px solid #000' }}>{partitionRows.reduce((s,r)=>s+r.total,0)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
        <Button variant="contained" sx={{ bgcolor:'#FFC107', color:'#000' }} onClick={()=>setShowDetails(v=>!v)}>{showDetails ? 'Hide Details':'See Details'}</Button>
        {showDetails && <Button variant="outlined" sx={{ borderColor:'#FFC107', color:'#FFC107' }} onClick={handleExport}>Export to Excel</Button>}
        <Button variant="contained" sx={{ bgcolor:'#FFC107', color:'#000' }} onClick={handleExportSummary}>Export Summary</Button>
        {selectedSummaryPartition && <Button variant="outlined" sx={{ borderColor:'#090909', color:'#fff', bgcolor:'#f31408' }} onClick={()=>{setSelectedSummaryPartition(null); setSelectedCompany(null); setShowDetails(false)}}>Clear city filter</Button>}
      </Box>
    </Paper>
  </Box>

  {/* Right: Company Table */}
  <Box sx={{ flex: 1, minWidth: 320 }}>
    <Paper elevation={3} sx={{ p: 2, border: '3px solid #000', borderRadius: 2 }}>
      <TableContainer sx={{ maxHeight: 280, overflowY: 'auto' }}>
        <Table stickyHeader size="small" sx={{ border: '2px solid #000' }}>
          <TableHead>
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ fontWeight:'bold', fontSize:16, bgcolor:'#000', color:'#FFC107', border:'2px solid #000' }}>
                {format(pickedDate,'EEEE, d MMMM, yyyy')}
              </TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor:'#FFC107' }}>
              {['Country','City','Company','Total'].map(h=>(
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
            {/* Total Row */}
            {companyRows.length>0 && <TableRow sx={{ bgcolor:'#666' }}>
              <TableCell colSpan={3} align="right" sx={{ color:'#fff', fontWeight:'bold', border:'2px solid #000'}}>Total</TableCell>
              <TableCell align="right" sx={{ color:'#fff', fontWeight:'bold', bgcolor:'#333', border:'2px solid #000'}}>{companyRows.reduce((s,r)=>s+r.total,0)}</TableCell>
            </TableRow>}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" sx={{ mt:1, flexWrap:'wrap', gap:1 }}>
        <Button variant="contained" sx={{ bgcolor:'#FFC107', color:'#000'}} onClick={handleExportCompanies}>Export Companies</Button>
      </Box>
    </Paper>
  </Box>
</Box>