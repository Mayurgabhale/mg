   {/* City */}
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="city-select-label">City / Partition</InputLabel>
                    <Select
                      labelId="city-select-label"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      renderValue={(v) => v || ""}
                      sx={{ bgcolor: "#fff", borderRadius: 1, color: "#000" }}
                    >
                      <MenuItem value="">
                        <em>All</em>
                      </MenuItem>
                      {citiesForRegion?.length > 0 ? (
                        citiesForRegion.map((c, idx) => (
                          <MenuItem key={idx} value={c}>
                            {c}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled value="">
                          No predefined cities (type manually below)
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Or type manually"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    sx={{
                      mt: 1,
                      borderRadius: 1,
                      "& .MuiInputBase-input": {
                        color: "#000000", 
                        backgroundColor: "white",
                      },
                    }}
                  />
                </Grid>
