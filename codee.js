          {/* Six-card partition summary */}
<Box display="flex" flexWrap="wrap" gap={1} mb={1}>
  {[
    {
      title: "Today's Total Headcount",
      value: historyLoading ? <CircularProgress size={20} /> : todayHist.total,
      icon: <i className="fa-solid fa-users" style={{ fontSize: 25, color: "#FFB300" }} />,
      border: "#FFB300",
    },
    {
      title: "Today's Employees Count",
      value: historyLoading ? <CircularProgress size={20} /> : todayHist.Employee,
      icon: <i className="bi bi-people" style={{ fontSize: 25, color: "#EF5350" }} />,
      border: "#8BC34A",
    },
    {
      title: "Today's Contractors Count",
      value: historyLoading ? <CircularProgress size={20} /> : todayHist.Contractor,
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
          xs: "1 1 100%",     // mobile: full width
          sm: "1 1 calc(50% - 8px)", // tablets: 2 per row
          md: "1 1 calc(33.33% - 8px)", // small desktops: 3 per row
          lg: "1 1 calc(33.33% - 8px)", // large desktops: 3 per row
          xl: "1 1 calc(16.66% - 8px)", // extra large: 6 per row
        },
        minWidth: 0, // fixes overflow issues
      }}
    >
      <SummaryCard
        title={card.title}
        total={card.value}
        stats={[]}
        icon={card.icon}
        sx={{
          height: 140,
          border: `2px solid ${card.border}`,
        }}
      />
    </Box>
  ))}
</Box>
create six card like above for responive desng 
create this card ok :;
{/* Six‐card partition summary */}
          <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
            {[
              {
                title: "Today's Total Headcount",
                value: historyLoading ? <CircularProgress size={20} /> : partToday.total,
                icon: <i className="fa-solid fa-users" style={{ fontSize: 25, color: '#FFB300' }} />,
                border: '#FFB300',
              },
              {
                title: "Today's Employees Count",
                value: historyLoading ? <CircularProgress size={20} /> : partToday.Employee,
                icon: <i className="bi bi-people" style={{ fontSize: 25, color: '#EF5350' }} />,
                border: '#8BC34A',
              },
              {
                title: "Today's Contractors Count",
                value: historyLoading ? <CircularProgress size={20} /> : partToday.Contractor,
                icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 25, color: '#8BC34A' }} />,
                border: '#E57373',
              },
              {
                title: "Realtime Headcount",
                value: live.total,
                icon: <i className="fa-solid fa-users" style={{ fontSize: 25, color: '#FFB300' }} />,
                border: '#FFD180',
              },
              {
                title: "Realtime Employees Count",
                value: live.Employee,
                icon: <i className="bi bi-people" style={{ fontSize: 25, color: '#EF5350' }} />,
                border: '#AED581',
              },
              {
                title: "Realtime Contractors Count",
                value: live.Contractor,
                icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 25, color: '#8BC34A' }} />,
                border: '#EF5350',
              },
            ].map((card) => (

              <Box key={card.title} sx={{ flex: "1 1 calc(16.66% - 8px)" }}>
                
                <SummaryCard
                  title={card.title}
                  total={card.value}
                  stats={[]}
                  icon={card.icon}
                  sx={{
                    height: 140,
                    border: `2px solid ${card.border}`,
                  }}
                />
              </Box>
              
            ))}
          </Box>
