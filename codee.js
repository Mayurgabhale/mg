i dont want this   {totalMatches} {totalMatches === 1 ? 'record' : 'records'}
{/* Right-aligned See More button */}
                          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                            {showSeeMore ? (
                              <Button size="small" sx={{ color: "#FFC107" }} onClick={() => setExpanded(floor)}>
                                See more…
                              </Button>
                            ) : (
                              <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
                                {totalMatches} {totalMatches === 1 ? 'record' : 'records'}
                              </Typography>
                            )}
                          </Box>
