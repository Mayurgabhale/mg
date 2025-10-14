{/* ✅ Fully Responsive Top Summary Cards */}
<Box
  display="flex"
  flexWrap="wrap"
  justifyContent="center"
  alignItems="stretch"
  gap={1.5}
  mb={2}
  sx={{
    '& > div': {
      flex: {
        xs: '1 1 100%',                // 1 per row on mobile
        sm: '1 1 calc(50% - 8px)',     // 2 per row on small tablets
        md: '1 1 calc(33.333% - 12px)',// 3 per row on tablets
        lg: '1 1 calc(16.66% - 12px)'  // 6 per row on large screens
      },
      minWidth: {
        xs: '100%',
        sm: '240px',
        md: '220px',
        lg: '180px'
      },
    }
  }}
>
  {[
    { title: "Today's Total Headcount", value: todayTot, icon: <i className="fa-solid fa-users" style={{ fontSize: 26, color: '#FFB300' }} />, border: '#FFB300' },
    { title: "Today's Employees Count", value: todayEmp, icon: <i className="bi bi-people" style={{ fontSize: 26, color: '#EF5350' }} />, border: '#8BC34A' },
    { title: "Today's Contractors Count", value: todayCont, icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 26, color: '#8BC34A' }} />, border: '#E57373' },
    { title: "Realtime Headcount", value: realtimeTot, icon: <i className="fa-solid fa-users" style={{ fontSize: 26, color: '#FFB300' }} />, border: '#FFD180' },
    { title: "Realtime Employees Count", value: realtimeEmp, icon: <i className="bi bi-people" style={{ fontSize: 26, color: '#EF5350' }} />, border: '#AED581' },
    { title: "Realtime Contractors Count", value: realtimeCont, icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 26, color: '#8BC34A' }} />, border: '#EF5350' },
  ].map((c, i) => (
    <Box key={i} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <SummaryCard
        title={c.title}
        total={c.value}
        stats={[]}
        icon={c.icon}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          textAlign: 'center',
          border: `2px solid ${c.border}`,
          borderRadius: 2,
          background: 'rgba(0,0,0,0.4)',
          px: { xs: 1.5, sm: 2 },
          py: { xs: 1.2, sm: 1.5 },
          height: 'auto',
          minHeight: { xs: 130, sm: 140, md: 150, lg: 160 },
        }}
        titleSx={{
          fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1rem' },
          fontWeight: 600,
          color: '#FFC107',
          whiteSpace: 'normal',
          lineHeight: 1.3,
          wordBreak: 'break-word',
        }}
        numberSx={{
          fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.7rem', lg: '1.9rem' },
          fontWeight: 700,
          color: '#fff',
        }}
      />
    </Box>
  ))}
</Box>