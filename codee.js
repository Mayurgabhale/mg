{/* Top six summary cards */}
<Box
  display="flex"
  flexWrap="wrap"
  gap={3}                // more gap between cards
  mb={3}
  sx={{
    justifyContent: "flex-start",
    px: { xs: 2, sm: 4, md: 6, lg: 10 }, // ✅ left & right padding responsive
  }}
>
  {[
    {
      title: "Today's Total Headcount",
      color: '#FFE599',
      value: todayTot,
      icon: <i className="fa-solid fa-users" style={{ fontSize: 25, color: '#FFB300' }} />,
      border: '#FFB300',
    },
    {
      title: "Today's Employees Count",
      value: todayEmp,
      icon: <i className="bi bi-people" style={{ fontSize: 25, color: '#EF5350' }} />,
      border: '#8BC34A',
    },
    {
      title: "Today's Contractors Count",
      value: todayCont,
      icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 25, color: '#8BC34A' }} />,
      border: '#E57373',
    },
    {
      title: "Realtime Headcount",
      value: realtimeTot,
      icon: <i className="fa-solid fa-users" style={{ fontSize: 25, color: '#FFB300' }} />,
      border: '#FFD180',
    },
    {
      title: "Realtime Employees Count",
      value: realtimeEmp,
      icon: <i className="bi bi-people" style={{ fontSize: 25, color: '#EF5350' }} />,
      border: '#AED581',
    },
    {
      title: "Realtime Contractors Count",
      value: realtimeCont,
      icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 25, color: '#8BC34A' }} />,
      border: '#E57373',
    },
  ].map(c => (
    <Box
      key={c.title}
      sx={{
        flexBasis: { xs: "100%", sm: "48%", md: "30%", lg: "15%" },
        minWidth: { xs: "100%", sm: "220px" },
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
<Box
  display="flex"
  flexWrap="wrap"
  gap={3}               // ✅ more space between region cards
  mb={3}
  sx={{
    justifyContent: "flex-start",
    px: { xs: 2, sm: 4, md: 6, lg: 10 }, // ✅ side margin responsive
  }}
>
  {partitions.map((p, index) => (
    <Box
      key={p.name}
      sx={{
        flexBasis: { xs: "100%", sm: "48%", md: "30%", lg: "15%" },
        minWidth: { xs: "100%", sm: "220px" },
      }}
    >
      <SummaryCard
        title={
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 'bold',
              color: '#FFC107',
              fontSize: '1.3rem',
            }}
          >
            {p.name.replace(/^.*\./, '')}
          </Typography>
        }
        total={p.total}
        stats={[
          { label: 'Employees', value: p.Employee, color: '#40E0D0' },
          { label: 'Contractors', value: p.Contractor, color: 'green' },
        ]}
        sx={{
          width: '100%',
          border: `2px solid ${palette15[index % palette15.length]}`,
        }}
        icon={<Box component="img" src={p.flag} sx={{ width: 48, height: 32 }} />}
      />
    </Box>
  ))}
</Box>