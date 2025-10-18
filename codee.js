return (
  <>
    <Header onSnapshot={handleSnapshot} onLive={handleLive} />

    {mode === 'snapshot' && data?.timestamp && (
      <Box sx={{
        background: '#333',
        color: '#FFD666',
        textAlign: 'center',
        py: 1,
        borderRadius: 1,
        mb: 2,
      }}>
        <Typography variant="body2">
          Viewing historical snapshot for: {new Date(data.timestamp).toLocaleString()}
        </Typography>
      </Box>
    )}

    <Container
      maxWidth={false}
      disableGutters
      sx={{
        py: 0,
        px: { xs: 1, sm: 2, md: 3 },
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 100%)',
        color: '#f5f5f5',
      }}>

      {/* Top Summary Cards */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={2} sx={{ justifyContent: 'center' }}>
        {[
          { title: "Today's Total Headcount", color: '#FFE599', value: todayTot, icon: <i className="fa-solid fa-users" style={{ fontSize: 25, color: '#FFB300' }} />, border: '#FFB300' },
          { title: "Today's Employees Count", value: todayEmp, icon: <i className="bi bi-people" style={{ fontSize: 25, color: '#EF5350' }} />, border: '#8BC34A' },
          { title: "Today's Contractors Count", value: todayCont, icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 25, color: '#8BC34A' }} />, border: '#E57373' },
          { title: "Realtime Headcount", value: realtimeTot, icon: <i className="fa-solid fa-users" style={{ fontSize: 25, color: '#FFB300' }} />, border: '#FFD180' },
          { title: "Realtime Employees Count", value: realtimeEmp, icon: <i className="bi bi-people" style={{ fontSize: 25, color: '#EF5350' }} />, border: '#AED581' },
          { title: "Realtime Contractors Count", value: realtimeCont, icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 25, color: '#8BC34A' }} />, border: '#E57373' },
        ].map(c => (
          <Box
            key={c.title}
            sx={{
              flex: '1 1 250px', // flex-grow, flex-shrink, flex-basis
              maxWidth: '100%',
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
      <Box display="flex" flexWrap="wrap" gap={2} mb={1} sx={{ justifyContent: 'center' }}>
        {partitions.map((p, index) => (
          <Box
            key={p.name}
            sx={{
              flex: '1 1 250px',
              maxWidth: '100%',
            }}
          >
            <SummaryCard
              title={
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#FFC107', fontSize: '1.3rem' }}>
                  {p.name.replace(/^.*\./, '')}
                </Typography>
              }
              total={p.total}
              stats={[
                { label: 'Employees', value: p.Employee, color: '#40E0D0' },
                { label: 'Contractors', value: p.Contractor, color: 'green' },
              ]}
              sx={{ width: '100%', border: `2px solid ${palette15[index % palette15.length]}` }}
              icon={<Box component="img" src={p.flag} sx={{ width: 48, height: 32 }} />}
            />
          </Box>
        ))}
      </Box>

      {/* Detail Widgets */}
      <Box mt={4} display="flex" gap={2} flexWrap="wrap" justifyContent="center">
        {[{ partition: crPartition, title: 'Costa Rica', Chart: CompositeChartCard },
          { partition: arPartition, title: 'Argentina', Chart: LineChartCard },
          { partition: null, title: 'Latin America', Chart: PieChartCard }].map((item, i) => (
            <Box
              key={item.title}
              sx={{
                flex: '1 1 300px',
                minWidth: '280px',
                maxWidth: '100%',
                border: '1px solid #FFE599',
                borderRadius: 2,
                boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.02)' }
              }}
            >
              {item.title === 'Costa Rica' && crPartition.total === 0 && (
                <Typography align="center" sx={{ py: 4, color: 'white' }}>No realtime employee data</Typography>
              )}
              {item.title === 'Argentina' && arPartition.total === 0 && (
                <Typography align="center" sx={{ py: 4, color: 'white' }}>No realtime employee data</Typography>
              )}
              {item.title === 'Costa Rica' && crPartition.total > 0 && (
                <CompositeChartCard
                  title="Costa Rica"
                  data={Object.entries(crPartition.floors).map(([f, c]) => ({ name: f.trim(), headcount: c, capacity: buildingCapacities[f.trim()] || 0 }))}
                  barColor={palette15[0]} lineColor={palette15[1]} height={350}
                />
              )}
              {item.title === 'Argentina' && arPartition.total > 0 && (
                <LineChartCard
                  title="Argentina"
                  data={Object.entries(arPartition.floors).map(([f, c]) => ({ name: f.trim(), headcount: c, capacity: seatCapacities[`Argentina-${f.trim()}`] || 0 }))}
                  totalCapacity={450} lineColor1={palette15[2]} lineColor2={palette15[3]} height={350}
                />
              )}
              {item.title === 'Latin America' && (
                <PieChartCard
                  title="Latin America"
                  data={smallOnes.map(p => ({ name: displayNameMap[p.name], value: p.total, emp: p.Employee, cont: p.Contractor }))}
                  colors={[palette15[4], palette15[5], palette15[6], palette15[7]]}
                  height={350} showZeroSlice totalSeats={smallOnes.reduce((sum, p) => sum + seatCapacities[displayNameMap[p.name]], 0)}
                />
              )}
            </Box>
        ))}
      </Box>

    </Container>

    <Footer />
  </>
);