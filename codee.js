create this responsive for each device and screen size ok carefully
  return (
    <>
      <Header />
      <Container maxWidth={false} disableGutters sx={{ px: 2, py: 0, background: '#151515', }}>
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {[
            {
              title: "Today's Total Headcount",
              value: todayTot,
              icon: <i className="fa-solid fa-users" style={{ color: '#E57373', fontSize: 25 }} />,
              border: '#FFB300'
            },
            {
              title: "Today's Employees Count",
              value: todayEmp,
              icon: <i className="bi bi-people" style={{ color: '#81C784', fontSize: 25 }} />,
              border: '#8BC34A'
            },
            {
              title: "Today's Contractors Count",
              value: todayCon,
              icon: <i className="fa-solid fa-circle-user" style={{ color: '#81C784', fontSize: 25 }} />,
              border: '#E57373'
            },
            {
              title: "Realtime Headcount",
              value: realtimeTot,
              icon: <i className="fa-solid fa-users" style={{ color: '#BA68C8', fontSize: 25 }} />,
              border: '#FFD180'
            },
            {
              title: "Realtime Employees Count",
              value: realtimeEmp,
              icon: <i className="bi bi-people" style={{ color: '#81C784', fontSize: 25 }} />,
              border: '#AED581'
            },
            {
              title: "Realtime Contractors Count",
              value: realtimeCon,
              icon: <i className="fa-solid fa-circle-user" style={{ color: '#BA68C8', fontSize: 25 }} />,
              border: '#EF5350'
            }
          ].map(c => (
            <Box key={c.title} sx={{ flex: '1 1 calc(16.66% - 8px)' }}>
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

        {/* ........... */}
        <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
          {
            summaryItems
              .filter(item => !['Dublin', 'Rome', 'Moscow'].includes(item.label))
              .map((item, index) => {
                const [tc,  ec, cc] = item.colors;
                const pieCities = ['Dublin', 'Rome', 'Moscow'];

                const pieData = summaryItems
                  ?.filter(item => pieCities.includes(item.label))
                  .map(item => ({
                    name: item.label,
                    value: item.total
                  }));

                return (
                  <Box key={item.label} sx={{ flex: '1 1 calc(10.66% - 1px)' }}>
                    <SummaryCard
                      title={item.label}
                      total={item.total}
                      stats={[
                        { label: 'Employees', value: item.emp },
                        { label: 'Contractors', value: item.cont }
                      ]}
                      icon={
                        item.flag && (
                          <Box
                            component="img"
                            src={item.flag}
                            alt={item.label}
                            sx={{ width: 45, height: 25, border: '1px solid #fff' }}
                          />
                        )
                      }
                      titleColor={tc}
                      statColors={[ec, cc]}
                      sx={{
                        height: 200,
                        border: `2px solid ${palette15[index % palette15.length]}`, // ✅ Now index is defined
                        '& .MuiTypography-subtitle1': { fontSize: '1.3rem' },
                        '& .MuiTypography-h4': { fontSize: '2rem' },
                        '& .MuiTypography-caption': { fontSize: '1.3rem' }
                      }}
                    />
                  </Box>
                );
              })
          }
        </Box>

        {/* Live charts row */}
        <Box display="flex" gap={1} mb={1} flexWrap="wrap">
          {/* 1) Vilnius composite */}
          <Box flex="1 1 0" sx={{ border: '2px solid #FFC107', borderRadius: 2, p: 2, background: 'rgba(0,0,0,0.6)' }}>

            {loading ? (
              <Skeleton variant="rectangular" height={400} />
            ) : (

              <CompositeChartCard
                title="Vilnius "
                data={vilniusFloors}
                barColor="#4CAF50"
                lineColor="#FF0000"
                height={320}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            )}
          </Box>
          {/* 2) Top regions donut */}
          {/* .................... .........  .. */}
          {/* CHART 1: Dublin, Rome, Moscow Breakdown */}
          <Box flex="1 1 0" sx={{ border: '2px solid #FFC107', borderRadius: 2, p: 2, background: 'rgba(0,0,0,0.6)' }}>
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
          {/* 3) Other regions donut */}
          {/* CHART 2: Other Cities Total */}
          <Box flex="1 1 0" sx={{ border: '2px solid #FFC107', borderRadius: 2, p: 2, background: 'rgba(0,0,0,0.6)' }}>
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
