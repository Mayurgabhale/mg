{/* Six‐card partition summary */}
<Box sx={{ width: '100%', mb: 2 }}>
  <Grid
    container
    spacing={{ xs: 1, sm: 2, md: 3 }}
    alignItems="stretch"
  >
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
      <Grid
        key={card.title}
        item
        xs={12}   // full width on extra-small screens
        sm={6}    // 2 per row on small screens
        md={4}    // 3 per row on medium screens
        lg={2}    // 6 per row on large+ screens
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'stretch',
        }}
      >
        <Box
          sx={{
            width: '100%',
            p: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <SummaryCard
            title={card.title}
            total={card.value}
            stats={[]}
            icon={card.icon}
            sx={{
              flex: 1,
              border: `2px solid ${card.border}`,
              borderRadius: 2,
              height: { xs: 110, sm: 130, md: 140 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              },
            }}
          />
        </Box>
      </Grid>
    ))}
  </Grid>
</Box>