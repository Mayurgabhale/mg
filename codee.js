 {/* Search Fields */}
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Search Employee ID"
                    value={searchEmployeeId}
                    onChange={(e) => setSearchEmployeeId(e.target.value)}
                    size="small"
                    helperText="Type an ID and click Run"
                    sx={{ bgcolor: "#0000", borderRadius: 1, color: "#120101" }}
                  />
                </Grid>
