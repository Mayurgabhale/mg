{/* Update the main flex container for tables */}
<Box
  sx={{
    display: 'flex',
    gap: 2,
    width: '100%',
    flexWrap: { xs: 'wrap', md: 'nowrap' }, // Already in your code
    overflowX: 'auto', // ADD this to allow horizontal scrolling on small screens
  }}
>
  {/* Left Table */}
  <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 320 } }}> {/* changed minWidth to be responsive */}
    ...
  </Box>

  {/* Right Table */}
  <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 320 } }}> {/* changed minWidth to be responsive */}
    ...
  </Box>
</Box>

{/* Update buttons container below tables for mobile */}
<Box display="flex" justifyContent="center" flexWrap="wrap" sx={{ mt: 1, gap: 1 }}> {/* added flexWrap & gap */}
  <Button variant="contained" sx={{ bgcolor: '#FFC107', color: '#000' }} onClick={() => setShowDetails(v => !v)}>
    {showDetails ? 'Hide Details' : 'See Details'}
  </Button>
  {showDetails && (
    <Button variant="outlined" sx={{ borderColor: '#FFC107', color: '#FFC107' }} onClick={handleExport}>
      Export to Excel
    </Button>
  )}
  <Button variant="contained" sx={{ bgcolor: '#FFC107', color: '#000' }} onClick={handleExportSummary}>
    Export Summary to Excel
  </Button>
  {selectedSummaryPartition && (
    <Button
      variant="outlined"
      sx={{ borderColor: '#090909', color: '#fff', bgcolor: '#f31408' }}
      onClick={() => { setSelectedSummaryPartition(null); setSelectedCompany(null); setShowDetails(false); }}
    >
      Clear city filter
    </Button>
  )}
</Box>

{/* Update Details table container for small screens */}
<Box display="flex" justifyContent="center" mb={0} sx={{ width: '100%', overflowX: 'auto' }}> {/* ADD overflowX */}
  <Paper elevation={1} sx={{ p: 1, width: '100%', border: '3px solid #000', borderRadius: 2 }}>
    <Table sx={{ border: '2px solid #000', borderCollapse: 'collapse', minWidth: 600 }} size='small'> {/* minWidth ensures table doesn't shrink too much */}
      ...
    </Table>
  </Paper>
</Box>