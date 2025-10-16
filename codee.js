{/* Right-aligned See More button */}
<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
  {rows.length > 10 && (
    <Button
      size="small"
      sx={{ color: "#FFC107" }}
      onClick={() => setExpanded(floor)}
    >
      See more…
    </Button>
  )}
</Box>