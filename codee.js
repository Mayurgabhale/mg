{error && (
  <Box sx={{ px: 2, mb: 2 }}>
    <Paper sx={{ p: 2, border: '1px solid #f44336', bgcolor: '#fff4f4' }}>
      <Typography color="error" variant="body1">
        Error loading history: {error}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Please check server logs or contact the API owner. The client caught the error so the page won't crash.
      </Typography>
    </Paper>
  </Box>
)}