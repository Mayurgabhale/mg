{/* Main Charts */}
<Box
  display="flex"
  flexWrap="wrap"
  gap={2}
  mb={2}
  justifyContent="center"
  sx={{
    // Add padding or background if needed for alignment
    px: { xs: 1, sm: 2, md: 3 },
  }}
>
  {chartConfigs.map(({ key, title, body }) => (
    <Box
      key={key}
      sx={{
        flex: {
          xs: "1 1 100%",           // Mobile: 1 per row
          sm: "1 1 100%",           // Tablet (portrait): still stacked
          md: "1 1 calc(33.33% - 16px)", // Desktop: exactly 3 in one row
        },
        maxWidth: { md: "33.33%" }, // Prevent extra stretch on big screens
        minWidth: 280,
        height: { xs: 350, md: 405 },
        animation: "fadeInUp 0.5s",
        display: "flex",
      }}
    >
      <Paper
        sx={{
          p: 2,
          flexGrow: 1,
          height: "100%",
          background: "rgba(0,0,0,0.4)",
          border: "1px solid #FFC107",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h6"
          align="center"
          sx={{ color: "#FFC107", mb: 2 }}
        >
          {title}
        </Typography>
        <Box sx={{ flex: 1, overflow: "hidden" }}>{body}</Box>
      </Paper>
    </Box>
  ))}
</Box>