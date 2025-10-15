{showDetails && (
  <Box display="flex" justifyContent="center" mb={0} sx={{ width: '100%', overflowX: 'auto' }}>
    <Paper elevation={1} sx={{ p: 1, width: '100%', border: '3px solid #000', borderRadius: 2 }}>
      {detailRows.length > 0 ? (
        <Table sx={{ minWidth: 900, border: '2px solid #000', borderCollapse: 'collapse' }} size="small">
          ...
        </Table>
      ) : (
        <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', mt: 2, fontStyle: 'italic' }}>
          No swipe records found for this date.
        </Typography>
      )}
    </Paper>
  </Box>
)}