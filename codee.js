create this dashboard for responsive for eacha and every device/ screen size
i means page respnsive or every screen size.. 
  ok 
return (
    <>
      <Header
        title="NAMER Live Occupancy"
        mode={mode}
        onTimeSelect={handleTimeClick}
        onLiveClick={handleLiveClick}
      />

      <Container
        maxWidth={false}
        disableGutters
        sx={{ py: 1, px: 2, background: 'rgba(0,0,0,0.6)' }}
      >

        {/* summary cards */}
        
         <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
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
              border: '#8BC34A'
            },
            {
              title: "Today's Contractors Count",
              value: todayCont,
              icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 25, color: '#8BC34A' }} />,
              border: '#E57373'
            },
            {
              title: "Realtime Headcount",
              value: realtimeTot,
              icon: <i className="fa-solid fa-users" style={{ fontSize: 25, color: '#FFB300' }} />,
              border: '#FFD180'
            },
            {
              title: "Realtime Employees Count",
              value: realtimeEmp,
              icon: <i className="bi bi-people" style={{ fontSize: 25, color: '#EF5350' }} />,
              border: '#AED581'
            },
            {
              title: "Realtime Contractors Count",
              value: realtimeCont,
              icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 25, color: '#8BC34A' }} />,
              border: '#E57373'
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

        {/* partition cards */}
        <Box display="flex" flexWrap="wrap" gap={1} mb={1.5}>
          {loading ? (
            <Skeleton variant="rectangular" width="90%" height={200} />
          ) : (
            partitions.map((p, index) => {
              const regionName = displayNameMap[p.name] || p.name.replace(/^.*\./, '');
              return (
                <Box key={p.name} sx={{ flex: '1 1 calc(16.66% - 8px)' }}>
                  <SummaryCard
                    title={
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 'bold',
                          color: '#FFC107',
                          fontSize: '1.3rem'
                        }}
                      >
                        {regionName}
                      </Typography>
                    }
                    total={p.total}
                    stats={[
                      { label: 'Employees', value: p.Employee, color: '#40E0D0' },
                      { label: 'Contractors', value: p.Contractor, color: 'green' }
                    ]}
                    sx={{
                      width: '100%',
                      border: `2px solid ${palette15[index % palette15.length]}`
                    }}
                    icon={
                      <Box
                        component="img"
                        src={p.flag}
                        sx={{
                          width: 48,
                          height: 32,
                          border: '1px solid white',
                          borderRadius: '2px',
                          objectFit: 'cover'
                        }}
                      />
                    }
                  />
                </Box>
              );
            })
          )}
        </Box>

        {/* charts & details */}
        <Box display="flex" gap={2} flexWrap="wrap" mb={4}>
          {[{
            key: 'denver',
            title: 'Denver',
            body: denver.total === 0
              ? <Typography color="white" align="center" py={6}>No Denver data</Typography>
              : <CompositeChartCard
                  data={floors.map(([f, h]) => ({
                    name: f,
                    headcount: h,
                    capacity: buildingCapacities[f] || 0
                  }))}
                  lineColor={palette15[1]}
                  height={300}
                  sx={{ border: 'none' }}
                />
          },{
            key: 'others',
            title: 'North America',
            body: <PieChartCard
              data={others.map(o => ({ name: displayNameMap[o.name], value: o.total }))}
              colors={[palette15[2], palette15[3], palette15[4]]}
              height={300}
              showZeroSlice
              totalSeats={others.reduce((s, o) => s + seatCapacities[o.name], 0)}
              sx={{ border: 'none' }}
            />
          },{
            key: 'details',
            title: 'Denver Floor Details',
            body: loading
              ? <Skeleton variant="rectangular" width="100%" height={300} />
              : (
                <Table size="small" sx={{
                  color: 'white', borderCollapse: 'collapse',
                  '& td, & th': { border: 'none' }
                }}>
                  <TableHead>
                    <TableRow>
                      {/* {['Floor', 'Headcount', 'Visitors', 'Security', 'Rejections', 'Avg Forecast'] */}
                        {['Floor', 'Headcount', 'Visitors', 'Security', 'Rejections']
                        .map(h => (
                          <TableCell key={h} sx={{ color: '#FFC107' }}>{h}</TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {floors.map(([floor, headcount]) => {
                      const visitors = visitorsByFloor.find(v => v.Floor === floor)?.visitorCount || 0;
                      const officerCount = officers.filter(o => o.floor === floor).length;
                      const todayDate = new Date().toISOString().slice(0, 10);
                      const rejectionCount = enrichedRejections
                        .filter(d =>
                          d.Location === 'US.CO.OBS' &&
                          d.floor === floor &&
                          d.DateOnly === todayDate
                        )
                        .length;

                      return (
                        <TableRow key={floor}>
                          <TableCell sx={{ color: 'white' }}>{floor}</TableCell>
                          <TableCell sx={{ color: 'white' }}>{headcount}</TableCell>
                          <TableCell sx={{ color: 'white' }}>{visitors}</TableCell>
                          <TableCell sx={{ color: 'white' }}>
                            {lo1 ? <Skeleton variant="text" width={24} /> : officerCount}
                          </TableCell>
                          <TableCell sx={{ color: 'white' }}>
                            {lo2 ? <Skeleton variant="text" width={24} /> : rejectionCount}
                          </TableCell>
                          {/* <TableCell sx={{ color: 'white' }}>{avgForecast}</TableCell> */}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )
          }].map(({ key, title, body }) => (
            <Box
              key={key}
              sx={{
                flex: '1 1 32%',
                minWidth: 280,
                height: 390,
                animation: 'fadeInUp 0.5s'
              }}
            >
              <Paper sx={{
                p: 2,
                height: '100%',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid #FFC107',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Typography variant="h6" sx={{ color: '#FFC107', mb: 2 }}>
                  {title}
                </Typography>
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                  {body}
                </Box>
              </Paper>
            </Box>
          ))}
        </Box>

        <footer style={{
          backgroundColor: '#000',
          color: '#FFC72C',
          padding: '1.0rem 0',
          textAlign: 'center',
          marginTop: '0.1rem',
          borderTop: '2px solid #FFC72C',
          fontSize: '0.95rem',
          lineHeight: '1.6'
        }}>
          <div>
            <strong>Global Security Operations Center (GSOC)</strong><br/>
            Live Occupancy dashboard for Western Union North America — Real-time occupancy, floor activity, and personnel insights.
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            Contact us: <a href="mailto:GSOC-GlobalSecurityOperationCenter.SharedMailbox@westernunion.com" style={{ color: '#FFC72C', textDecoration: 'underline' }}>gsoc@westernunion.com</a> |
            Landline: <span style={{ color: '#FFC72C' }}>+91-020-67632394</span>
          </div>
        </footer>
      </Container>
    </>
  );
