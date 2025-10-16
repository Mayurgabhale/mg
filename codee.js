{/* Six‐card partition summary */}
<Box display="flex" flexWrap="wrap" gap={1} mb={1}>
  {[
    {
      title: "Today's Total Headcount",
      value: historyLoading ? <CircularProgress size={20} /> : partToday.total,
      icon: <i className="fa-solid fa-users" style={{ fontSize: 25, color: "#FFB300" }} />,
      border: "#FFB300",
    },
    {
      title: "Today's Employees Count",
      value: historyLoading ? <CircularProgress size={20} /> : partToday.Employee,
      icon: <i className="bi bi-people" style={{ fontSize: 25, color: "#EF5350" }} />,
      border: "#8BC34A",
    },
    {
      title: "Today's Contractors Count",
      value: historyLoading ? <CircularProgress size={20} /> : partToday.Contractor,
      icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 25, color: "#8BC34A" }} />,
      border: "#E57373",
    },
    {
      title: "Realtime Headcount",
      value: live.total,
      icon: <i className="fa-solid fa-users" style={{ fontSize: 25, color: "#FFB300" }} />,
      border: "#FFD180",
    },
    {
      title: "Realtime Employees Count",
      value: live.Employee,
      icon: <i className="bi bi-people" style={{ fontSize: 25, color: "#EF5350" }} />,
      border: "#AED581",
    },
    {
      title: "Realtime Contractors Count",
      value: live.Contractor,
      icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 25, color: "#8BC34A" }} />,
      border: "#EF5350",
    },
  ].map((card) => (
    <Box
      key={card.title}
      sx={{
        flex: {
          xs: "1 1 100%", // full width on mobile
          sm: "1 1 calc(50% - 8px)", // 2 per row on tablets
          md: "1 1 calc(33.33% - 8px)", // 3 per row on small desktops
          lg: "1 1 calc(33.33% - 8px)", // 3 per row on large desktops
          xl: "1 1 calc(16.66% - 8px)", // 6 per row on wide screens
        },
        minWidth: 0, // fixes overflow
      }}
    >
      <SummaryCard
        title={card.title}
        total={card.value}
        stats={[]}
        icon={card.icon}
        sx={{
          height: { xs: 110, sm: 130, md: 140 }, // responsive height
          border: `2px solid ${card.border}`,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          },
        }}
      />
    </Box>
  ))}
</Box>