import { useTheme, useMediaQuery } from "@mui/material";

export default function Dashboard() {
  // ... keep your existing logic above

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // --- Keep error/loading checks here ---

  return (
    <>
      <Header title="APAC Live Occupancy" />
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          py: 0,
          px: { xs: 1, sm: 2, md: 3 },
          background: "linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 100%)",
          color: "#f5f5f5",
        }}
      >
        {/* Summary Cards */}
        <Box
          display="flex"
          flexWrap="wrap"
          gap={1}
          mb={1}
          justifyContent="center"
        >
          {[
            { title: "Today's Total Headcount", value: todayTot, icon: <i className="fa-solid fa-users" style={{ fontSize: 25, color: '#FFB300' }} />, border: '#FFB300' },
            { title: "Today's Employees Count", value: todayEmp, icon: <i className="bi bi-people" style={{ fontSize: 25, color: '#EF5350' }} />, border: '#8BC34A' },
            { title: "Today's Contractors Count", value: todayCont, icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 25, color: '#8BC34A' }} />, border: '#E57373' },
            { title: "Realtime Headcount", value: realtimeTot, icon: <i className="fa-solid fa-users" style={{ fontSize: 25, color: '#FFB300' }} />, border: '#FFD180' },
            { title: "Realtime Employees Count", value: realtimeEmp, icon: <i className="bi bi-people" style={{ fontSize: 25, color: '#EF5350' }} />, border: '#AED581' },
            { title: "Realtime Contractors Count", value: realtimeCont, icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 25, color: '#8BC34A' }} />, border: '#EF5350' },
          ].map(c => (
            <Box
              key={c.title}
              sx={{
                flex: {
                  xs: "1 1 100%",   // Mobile: 1 per row
                  sm: "1 1 calc(50% - 8px)", // Tablet: 2 per row
                  md: "1 1 calc(33.33% - 8px)", // Desktop: 3 per row
                  lg: "1 1 calc(16.66% - 8px)", // Large Desktop: 6 per row
                },
              }}
            >
              <SummaryCard
                title={c.title}
                total={c.value}
                stats={[]}
                icon={c.icon}
                sx={{ height: 140, border: `2px solid ${c.border}` }}
              />
            </Box>
          ))}
        </Box>

        {/* Region Cards */}
        <Box display="flex" flexWrap="wrap" gap={1} mb={3} justifyContent="center">
          {loading
            ? <Skeleton variant="rectangular" width="90%" height={200} />
            : partitions.map((p, i) => (
              <Box
                key={p.name}
                sx={{
                  flex: {
                    xs: "1 1 100%",
                    sm: "1 1 calc(50% - 8px)",
                    md: "1 1 calc(33.33% - 8px)",
                    lg: "1 1 calc(16.66% - 8px)",
                  },
                }}
              >
                <SummaryCard
                  title={
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        color: "#FFC107",
                        fontSize: { xs: "1rem", md: "1.3rem" },
                      }}
                    >
                      {displayNameMap[p.name] || p.name.replace(/^.*\./, '')}
                    </Typography>
                  }
                  total={p.total}
                  stats={[
                    { label: "Employees", value: p.Employee },
                    { label: "Contractors", value: p.Contractor },
                  ]}
                  sx={{
                    width: "100%",
                    border: `2px solid ${palette15[i % palette15.length]}`,
                  }}
                  icon={
                    <Box
                      component="img"
                      src={p.flag}
                      sx={{ width: 48, height: 32 }}
                    />
                  }
                />
              </Box>
            ))}
        </Box>

        {/* Main Charts */}
        <Box display="flex" flexWrap="wrap" gap={2} mb={4} justifyContent="center">
          {chartConfigs.map(({ key, title, body }) => (
            <Box
              key={key}
              sx={{
                flex: {
                  xs: "1 1 100%",         // Mobile
                  sm: "1 1 calc(50% - 8px)", // Tablet
                  md: "1 1 calc(33.33% - 8px)", // Desktop
                },
                minWidth: 280,
                height: { xs: 350, md: 405 },
                animation: "fadeInUp 0.5s",
              }}
            >
              <Paper
                sx={{
                  p: 2,
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
      </Container>
      <Footer />
    </>
  );
}