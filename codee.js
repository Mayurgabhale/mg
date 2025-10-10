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