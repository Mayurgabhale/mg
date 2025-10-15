<Box
  sx={{
    display: 'flex',
    gap: 2,
    width: '100%',
    flexWrap: { xs: 'wrap', md: 'nowrap' }, // stack on mobile
    overflowX: 'auto', // horizontal scroll if needed
  }}
>
  {/* Left table */}
  <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 320 } }}>
    ...
  </Box>

  {/* Right table */}
  <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 320 } }}>
    ...
  </Box>
</Box>