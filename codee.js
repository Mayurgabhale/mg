this is not perfect responsive for each size, 
  so please corect this to each device responsice alos incudng unders data 
means this 
Today's Total Headcount
1383
Today's Employees Count
1167
Today's Contractors Count
216
Realtime Headcount
1073
Realtime Employees Count
927
Realtime Contractors Count
146
 ok 
because this wrond lignh min max ok 
Today's Contractors Count
  this
Realtime Contractors Count
this 
Realtime Headcount
so adjust this auto to responsive ok 
{/* Top Summary Cards */}
        <Box
          display="flex"
          flexWrap="wrap"
          gap={1}
          mb={1}
          sx={{
            // On xs: 1 column; sm: 2 columns-ish; md+: show 6 across if space
            '& > div': {
              flex: {
                xs: '1 1 100%',
                sm: '1 1 calc(50% - 8px)',
                md: '1 1 calc(33.333% - 12px)',
                lg: '1 1 calc(16.66% - 12px)'
              },
              minWidth: {
                xs: '100%',
                sm: '220px',
                md: '220px',
                lg: '180px'
              }
            }
          }}
        >
          {[
            { title: "Today's Total Headcount", value: todayTot, icon: <i className="fa-solid fa-users" style={{ fontSize: 25, color: '#FFB300' }} />, border: '#FFB300' },
            { title: "Today's Employees Count", value: todayEmp, icon: <i className="bi bi-people" style={{ fontSize: 25, color: '#EF5350' }} />, border: '#8BC34A' },
            { title: "Today's Contractors Count", value: todayCont, icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 25, color: '#8BC34A' }} />, border: '#E57373' },
            { title: "Realtime Headcount", value: realtimeTot, icon: <i className="fa-solid fa-users" style={{ fontSize: 25, color: '#FFB300' }} />, border: '#FFD180' },
            { title: "Realtime Employees Count", value: realtimeEmp, icon: <i className="bi bi-people" style={{ fontSize: 25, color: '#EF5350' }} />, border: '#AED581' },
            { title: "Realtime Contractors Count", value: realtimeCont, icon: <i className="fa-solid fa-circle-user" style={{ fontSize: 25, color: '#8BC34A' }} />, border: '#EF5350' },
          ].map(c => (
            <Box key={c.title} sx={{}}>
              <SummaryCard
                title={c.title}
                total={c.value}
                stats={[]}
                icon={c.icon}
                sx={{
                  height: { xs: 120, sm: 120, md: 140 },
                  border: `2px solid ${c.border}`,
                  px: { xs: 1, sm: 1.5 },
                  py: { xs: 1, sm: 1.5 }
                }}
                titleSx={{ fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' } }}
                numberSx={{ fontSize: { xs: '1.15rem', sm: '1.4rem', md: '1.6rem' } }}
              />
            </Box>
          ))}
        </Box>
