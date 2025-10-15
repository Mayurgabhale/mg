return (
  <>
    <Header />
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        px: { xs: 1, sm: 2 },
        py: 0,
        background: '#151515',
      }}
    >
      {/* ---------- SUMMARY CARDS ROW ---------- */}
      <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
        {[
          {
            title: "Today's Total Headcount",
            value: todayTot,
            icon: <i className="fa-solid fa-users" style={{ color: '#E57373', fontSize: 25 }} />,
            border: '#FFB300',
          },
          {
            title: "Today's Employees Count",
            value: todayEmp,
            icon: <i className="bi bi-people" style={{ color: '#81C784', fontSize: 25 }} />,
            border: '#8BC34A',
          },
          {
            title: "Today's Contractors Count",
            value: todayCon,
            icon: <i className="fa-solid fa-circle-user" style={{ color: '#81C784', fontSize: 25 }} />,
            border: '#E57373',
          },
          {
            title: "Realtime Headcount",
            value: realtimeTot,
            icon: <i className="fa-solid fa-users" style={{ color: '#BA68C8', fontSize: 25 }} />,
            border: '#FFD180',
          },
          {
            title: "Realtime Employees Count",
            value: realtimeEmp,
            icon: <i className="bi bi-people" style={{ color: '#81C784', fontSize: 25 }} />,
            border: '#AED581',
          },
          {
            title: "Realtime Contractors Count",
            value: realtimeCon,
            icon: <i className="fa-solid fa-circle-user" style={{ color: '#BA68C8', fontSize: 25 }} />,
            border: '#EF5350',
          },
        ].map((c) => (
          <Box
            key={c.title}
            sx={{
              flex: {
                xs: '1 1 100%',   // 1 per row (mobile)
                sm: '1 1 48%',    // 2 per row (tablet)
                md: '1 1 31%',    // 3 per row (small desktop)
                lg: '1 1 23%',    // 4 per row (large desktop)
                xl: '1 1 calc(16.66% - 8px)', // 6 per row (wide screen)
              },
            }}
          >
            <SummaryCard
              title={c.title}
              total={c.value}
              stats={[]}
              icon={c.icon}
              sx={{ height: { xs: 120, sm: 130, md: 140 }, border: `2px solid ${c.border}` }}
            />
          </Box>
        ))}
      </Box>

      {/* ---------- COUNTRY SUMMARY CARDS ---------- */}
      <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
        {summaryItems
          .filter((item) => !['Dublin', 'Rome', 'Moscow'].includes(item.label))
          .map((item, index) => {
            const [tc, ec, cc] = item.colors;
            const pieCities = ['Dublin', 'Rome', 'Moscow'];

            const pieData = summaryItems
              ?.filter((item) => pieCities.includes(item.label))
              .map((item) => ({
                name: item.label,
                value: item.total,
              }));

            return (
              <Box
                key={item.label}
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 48%',
                    md: '1 1 31%',
                    lg: '1 1 23%',
                    xl: '1 1 calc(10.66% - 1px)',
                  },
                }}
              >
                <SummaryCard
                  title={item.label}
                  total={item.total}
                  stats={[
                    { label: 'Employees', value: item.emp },
                    { label: 'Contractors', value: item.cont },
                  ]}
                  icon={
                    item.flag && (
                      <Box
                        component="img"
                        src={item.flag}
                        alt={item.label}
                        sx={{
                          width: 45,
                          height: 25,
                          border: '1px solid #fff',
                          borderRadius: 0.5,
                        }}
                      />
                    )
                  }
                  titleColor={tc}
                  statColors={[ec, cc]}
                  sx={{
                    height: { xs: 180, sm: 190, md: 200 },
                    border: `2px solid ${palette15[index % palette15.length]}`,
                    '& .MuiTypography-subtitle1': { fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' } },
                    '& .MuiTypography-h4': { fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' } },
                    '& .MuiTypography-caption': { fontSize: { xs: '1rem', sm: '1.1rem', md: '1.3rem' } },
                  }}
                />
              </Box>
            );
          })}
      </Box>

      {/* ---------- LIVE CHARTS ROW ---------- */}
      <Box display="flex" gap={1} mb={1} flexWrap="wrap">
        {/* CHART 1: Composite */}
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 48%', lg: '1 1 32%' },
            border: '2px solid #FFC107',
            borderRadius: 2,
            p: { xs: 1, sm: 2 },
            background: 'rgba(0,0,0,0.6)',
          }}
        >
          {loading ? (
            <Skeleton variant="rectangular" height={300} />
          ) : (
            <CompositeChartCard
              title="Vilnius"
              data={vilniusFloors}
              barColor="#4CAF50"
              lineColor="#FF0000"
              height={320}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          )}
        </Box>

        {/* CHART 2: Dublin, Rome, Moscow */}
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 48%', lg: '1 1 32%' },
            border: '2px solid #FFC107',
            borderRadius: 2,
            p: { xs: 1, sm: 2 },
            background: 'rgba(0,0,0,0.6)',
          }}
        >
          {loading ? (
            <Skeleton variant="rectangular" height={300} />
          ) : (
            <PieChartCard
              title=""
              data={pieData1}
              colors={['#FFB74D', '#4DB6AC', '#9575CD']}
              innerRadius={60}
              height={400}
              showZeroSlice
              animationDuration={1500}
            />
          )}
        </Box>

        {/* CHART 3: Other Cities */}
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 48%', lg: '1 1 32%' },
            border: '2px solid #FFC107',
            borderRadius: 2,
            p: { xs: 1, sm: 2 },
            background: 'rgba(0,0,0,0.6)',
          }}
        >
          {loading ? (
            <Skeleton variant="rectangular" height={300} />
          ) : (
            <PieChartCard
              title=""
              data={pieData2}
              colors={['#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F']}
              innerRadius={60}
              height={400}
              showZeroSlice
              animationDuration={1500}
            />
          )}
        </Box>
      </Box>
    </Container>
    <Footer />
  </>
);