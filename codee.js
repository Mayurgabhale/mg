 <Box
  sx={{
    border: "none",
    background: "linear-gradient(145deg, #ffffff, #f9f9f9)", // light modern background
    borderRadius: 3,
    px: 4,
    py: 3,
    width: { xs: "100%", sm: "80%", md: "100%" },
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)", // softer shadow
  }}
>
  <Typography
    variant="h4"
    gutterBottom
    sx={{
      background: "linear-gradient(90deg, #1976d2, #42a5f5)", // gradient text
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontWeight: "bold",
      display: "inline-block",
      paddingBottom: "6px",
      borderBottom: "3px solid #1976d2", // matches text gradient
      letterSpacing: "0.7px",
      textShadow: "1px 1px 3px rgba(0,0,0,0.15)",
    }}
  >
    Duration Reports with Compliance & Category
  </Typography>

  <Typography
    variant="subtitle1"
    sx={{
      color: "#555",
      mt: 1,
      fontSize: "1rem",
      fontStyle: "italic",
    }}
  >
    Insights and metrics at a glance
  </Typography>
</Box>