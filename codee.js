this is not correct responsive.. 
          {/* Six‐card partition summary */}
          <Box sx={{ width: '100%', mb: 2 }}>
            <Grid
              container
              spacing={{ xs: 1, sm: 2, md: 2 }}
              justifyContent="center"
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
                  xs={16}   // full width on extra-small screens
                  sm={6}    // 2 per row on small screens
                  md={4}    // 3 per row on medium screens
                  lg={2}    // 6 per row on large+ screens
                  display="flex"
                  justifyContent="center"
                >
                  <Box sx={{ width: '100%', maxWidth: 280 }}>
                    <SummaryCard
                      title={card.title}
                      total={card.value}
                      stats={[]}
                      icon={card.icon}
                      sx={{
                        height: { xs: 120, sm: 130, md: 140 },
                        border: `2px solid ${card.border}`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
