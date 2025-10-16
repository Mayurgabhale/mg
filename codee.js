<Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
  <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#FFC107" }}>
    {floor} (Total {liveCounts[floor] || 0})
  </Typography>
  <Button
    size="small"
    variant="contained"
    color="success"
    onClick={() => exportFloorToExcel(floor)}
    sx={{ textTransform: "none" }}
  >
    Export Excel
  </Button>
</Box>